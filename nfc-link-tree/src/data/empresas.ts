import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Empresa } from "@/types/empresa";

// Erros de banco propagam de propósito: retornar null/[] faria o ISR cachear
// um 404 ou um hub vazio durante uma falha temporária do Neon.
export const getEmpresa = cache(async (slug: string): Promise<Empresa | null> => {
  return prisma.empresa.findFirst({
    where: {
      slug,
      ativo: true,
    },
    include: {
      links: {
        orderBy: {
          ordem: "asc",
        },
      },
      redesSociais: true,
    },
  });
});

export async function listarSlugs(): Promise<string[]> {
  const empresas = await prisma.empresa.findMany({
    where: {
      ativo: true,
    },
    select: {
      slug: true,
    },
  });

  return empresas.map((e) => e.slug);
}

export async function listarEmpresas(): Promise<Empresa[]> {
  return prisma.empresa.findMany({
    where: {
      ativo: true,
    },
    include: {
      links: {
        orderBy: {
          ordem: "asc",
        },
      },
      redesSociais: true,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });
}
