import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { PapelAdministrador } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminAtual = {
  id: string;
  nome: string;
  email: string;
  role: PapelAdministrador;
  empresaId: string | null;
};

// Lê a sessão e busca o administrador no banco. O JWT só carrega o id: papel e
// empresa vêm sempre do banco, então mudar o papel, trocar a empresa ou remover
// o administrador vale na próxima requisição, sem esperar o token expirar.
// O cache() do React só evita repetir a consulta dentro da MESMA requisição
// (layout + página + ação); cada requisição nova consulta o banco de novo.
// Retorna null se não houver sessão válida.
export const getAdminAtual = cache(async (): Promise<AdminAtual | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  return prisma.administrador.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, role: true, empresaId: true },
  });
});

// Use no início de todo layout/página/Server Action do painel.
export async function exigirAdmin(): Promise<AdminAtual> {
  const admin = await getAdminAtual();
  if (!admin) redirect("/admin/login");
  return admin;
}

// Áreas só da Quantum: criar empresas e gerenciar administradores.
// Para um CLIENTE responde 404, sem revelar que a área existe.
export async function exigirPapelAdmin(): Promise<AdminAtual> {
  const admin = await exigirAdmin();
  if (admin.role !== "ADMIN") notFound();
  return admin;
}

// Acesso a uma empresa específica. ADMIN acessa qualquer uma; CLIENTE só a
// vinculada a ele. Para os demais casos responde 404 (e não "sem permissão"),
// para não revelar se a empresa existe.
export async function exigirAcessoEmpresa(empresaId: string): Promise<AdminAtual> {
  const admin = await exigirAdmin();
  if (admin.role === "ADMIN") return admin;
  if (!empresaId || admin.empresaId !== empresaId) notFound();
  return admin;
}
