import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminAtual = { id: string; nome: string; email: string };

// Lê a sessão e confirma no banco que o administrador ainda existe.
// Retorna null se não houver sessão válida.
export const getAdminAtual = cache(async (): Promise<AdminAtual | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  return prisma.administrador.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true },
  });
});

// Use no início de todo layout/página/Server Action do painel.
export async function exigirAdmin(): Promise<AdminAtual> {
  const admin = await getAdminAtual();
  if (!admin) redirect("/admin/login");
  return admin;
}
