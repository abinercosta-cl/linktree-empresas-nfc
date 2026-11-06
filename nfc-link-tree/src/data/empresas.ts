import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Empresa } from "@/types/empresa";

// Tempo de vida do cache de dados de uma empresa (Data Cache do Next).
export const EMPRESA_CACHE_SEGUNDOS = 3600;

async function buscarEmpresa(slug: string): Promise<Empresa | null> {
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
}

// O cache fica nos DADOS, não na página renderizada: a página /[empresa] é
// dinâmica, então um ErrorState renderizado durante uma queda do Neon nunca é
// persistido. Erros lançados aqui também não são cacheados pelo unstable_cache,
// e uma revalidação que falha mantém o último valor válido.
// React cache() deduplica as chamadas de generateMetadata + página na mesma requisição.
export const getEmpresa = cache(
  (slug: string): Promise<Empresa | null> =>
    unstable_cache(buscarEmpresa, ["empresa", slug], {
      revalidate: EMPRESA_CACHE_SEGUNDOS,
      tags: ["empresas", `empresa:${slug}`],
    })(slug)
);

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
