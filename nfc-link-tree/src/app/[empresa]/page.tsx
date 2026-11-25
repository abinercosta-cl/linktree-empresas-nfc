import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata, Viewport } from "next";
import { getEmpresa } from "@/data/empresas";
import ErrorState from "@/components/ErrorState";
import PaginaEmpresa from "@/components/PaginaEmpresa";
import { criarPaleta } from "@/lib/paleta";
import type { Empresa } from "@/types/empresa";

type Params = Promise<{ empresa: string }>;

// Renderização por requisição: o cache fica nos dados (ver getEmpresa). Com ISR,
// um ErrorState retornado durante uma queda do banco seria gravado no cache da
// página por até 1h, e connection() numa rota SSG gera DYNAMIC_SERVER_USAGE (500).

// Barra do navegador no celular na cor de fundo da empresa.
export async function generateViewport({ params }: { params: Params }): Promise<Viewport> {
  const { empresa: slug } = await params;
  try {
    const empresa = await getEmpresa(slug);
    return empresa ? { themeColor: criarPaleta(empresa.corFundo, empresa.corPrimaria).fundo } : {};
  } catch {
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { empresa: slug } = await params;

  let empresa: Empresa | null;
  try {
    empresa = await getEmpresa(slug);
  } catch (error) {
    console.error(`generateMetadata: falha ao buscar empresa [${slug}]`, error);
    return { title: "NFC Link Tree" };
  }

  if (!empresa) return {};

  const title = empresa.nome;
  const description = empresa.bio ?? "Acesse os links e canais oficiais";
  const image = empresa.avatarUrl || "/avatars/quantum.png";

  return {
    title: `${title} | Links Oficiais`,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function EmpresaPage({
  params,
}: {
  params: Params;
}) {
  // Garante renderização por requisição (nunca prerenderizada nem cacheada como página).
  await connection();
  const { empresa: slug } = await params;

  let empresa: Empresa | null;
  try {
    empresa = await getEmpresa(slug);
  } catch (error) {
    console.error(`EmpresaPage: falha ao buscar empresa [${slug}]`, error);
    return <ErrorState />;
  }

  if (!empresa) notFound();

  return <PaginaEmpresa empresa={empresa} slug={slug} />;
}
