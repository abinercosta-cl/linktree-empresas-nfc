"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin-sessao";
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

export async function criarAdministrador(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  let criado = false;

  const estado = await executarAcao(async () => {
    const nome = obrigatorio(texto(formData, "nome"), "Nome", 120);
    const email = validarEmail(texto(formData, "email"));
    // Senha não passa por trim: espaços podem fazer parte dela.
    const senha = validarSenha(String(formData.get("senha") ?? ""));

    const senhaHash = await bcrypt.hash(senha, BCRYPT_CUSTO);
    try {
      await prisma.administrador.create({ data: { nome, email, senhaHash } });
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
  const adminAtual = await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    if (id === adminAtual.id) {
      throw new ErroValidacao("Você não pode remover a si mesmo.");
    }
    const total = await prisma.administrador.count();
    if (total <= 1) throw new ErroValidacao("O painel precisa de pelo menos um administrador.");

    const removido = await prisma.administrador.deleteMany({ where: { id } });
    if (removido.count === 0) throw new ErroValidacao("Administrador não encontrado.");
    // A sessão (JWT) do removido deixa de valer na próxima requisição:
    // exigirAdmin() confere no banco se o administrador ainda existe.
    revalidatePath("/admin/administradores");
  });
}
