import { prisma } from "@/lib/prisma";
import type { Empresa } from "@/types/empresa";

export async function getEmpresa(slug: string): Promise<Empresa | null> {
  try {
    const empresa = await prisma.empresa.findFirst({
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

    return empresa;
  } catch (error) {
    console.error(`Erro ao buscar empresa [${slug}]:`, error);
    return null;
  }
}

export async function listarSlugs(): Promise<string[]> {
  try {
    const empresas = await prisma.empresa.findMany({
      where: {
        ativo: true,
      },
      select: {
        slug: true,
      },
    });

    return empresas.map((e) => e.slug);
  } catch (error) {
    console.error("Erro ao listar slugs:", error);
    return [];
  }
}

export async function listarEmpresas(): Promise<Empresa[]> {
  try {
    const empresas = await prisma.empresa.findMany({
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

    return empresas;
  } catch (error) {
    console.error("Erro ao listar empresas:", error);
    return [];
  }
}
