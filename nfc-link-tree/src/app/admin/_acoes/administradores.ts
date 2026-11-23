"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma, type PapelAdministrador } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirPapelAdmin } from "@/lib/admin-sessao";
import {
  ErroValidacao,
  executarAcao,
  obrigatorio,
  texto,
  validarEmail,
  validarSenha,
  type EstadoAcao,
} from "@/lib/validacao";

// Mesmo custo usado em prisma/criar-admin.ts.
const BCRYPT_CUSTO = 12;

// Toda a gestão de administradores é só para ADMIN: CLIENTE recebe 404.

// ADMIN nunca tem empresa; CLIENTE precisa de uma empresa existente.
async function lerPapel(formData: FormData): Promise<{ role: PapelAdministrador; empresaId: string | null }> {
  const role = texto(formData, "role");
  if (role === "ADMIN") return { role: "ADMIN", empresaId: null };
  if (role !== "CLIENTE") throw new ErroValidacao("Papel inválido.");

  const empresaId = texto(formData, "empresaId");
  if (!empresaId) throw new ErroValidacao("Escolha a empresa do cliente.");
  const empresa = await prisma.empresa.findUnique({ where: { id: empresaId }, select: { id: true } });
  if (!empresa) throw new ErroValidacao("Empresa não encontrada.");
  return { role: "CLIENTE", empresaId };
}

export async function criarAdministrador(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirPapelAdmin();
  let criado = false;

  const estado = await executarAcao(async () => {
    const nome = obrigatorio(texto(formData, "nome"), "Nome", 120);
    const email = validarEmail(texto(formData, "email"));
    // Senha não passa por trim: espaços podem fazer parte dela.
    const senha = validarSenha(String(formData.get("senha") ?? ""));
    const papel = await lerPapel(formData);

    const senhaHash = await bcrypt.hash(senha, BCRYPT_CUSTO);
    try {
      await prisma.administrador.create({ data: { nome, email, senhaHash, ...papel } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ErroValidacao("Já existe um administrador com esse email.");
      }
      throw error;
    }
    criado = true;
  });

  if (criado) {
    revalidatePath("/admin/administradores");
    redirect("/admin/administradores");
  }
  return estado;
}

export async function removerAdministrador(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  const adminAtual = await exigirPapelAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    if (id === adminAtual.id) {
      throw new ErroValidacao("Você não pode remover a si mesmo.");
    }
    const alvo = await prisma.administrador.findUnique({ where: { id }, select: { role: true } });
    if (!alvo) throw new ErroValidacao("Administrador não encontrado.");
    // Clientes não administram o painel: o que precisa sobrar é um ADMIN.
    if (alvo.role === "ADMIN") {
      const totalAdmins = await prisma.administrador.count({ where: { role: "ADMIN" } });
      if (totalAdmins <= 1) throw new ErroValidacao("O painel precisa de pelo menos um administrador da Quantum.");
    }

    const removido = await prisma.administrador.deleteMany({ where: { id } });
    if (removido.count === 0) throw new ErroValidacao("Administrador não encontrado.");
    // A sessão (JWT) do removido deixa de valer na próxima requisição:
    // exigirAdmin() confere no banco se o administrador ainda existe.
    revalidatePath("/admin/administradores");
  });
}
