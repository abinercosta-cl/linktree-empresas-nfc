import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEmpresa, listarSlugs } from "@/data/empresas";
import ProfileHeader from "@/components/ProfileHeader";
import SaveContactButton from "@/components/SaveContactButton";
import LinkButton from "@/components/LinkButton";
import SocialIcons from "@/components/SocialIcons";
import QrCodeModal from "@/components/QrCodeModal";
import TrackPageView from "@/components/TrackPageView";

type Params = Promise<{ empresa: string }>;

export const revalidate = 3600;

// Gera as rotas conhecidas em build time com suporte a ISR para novos registros
export async function generateStaticParams() {
  const slugs = await listarSlugs();
  return slugs.map((slug) => ({ empresa: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { empresa: slug } = await params;
  const empresa = await getEmpresa(slug);
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
  const { empresa: slug } = await params;

  const empresa = await getEmpresa(slug);

  if (!empresa) notFound();

  const brandColor = empresa.corPrimaria ?? "#0EA5E9";

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 py-10 sm:py-16 overflow-x-hidden selection:bg-white/10"
      style={{ backgroundColor: empresa.corFundo ?? "#080B11" }}
    >
      {/* Telemetria de View da Página */}
      {empresa.id && <TrackPageView empresaId={empresa.id} />}

      {/* Luzes de Fundo e Blur Ambientes (Ambient Glow Orbs) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Orbe Primário - Topo Centrado */}
        <div
          className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full blur-[130px] opacity-35"
          style={{ backgroundColor: brandColor }}
        />

        {/* Orbe Secundário - Fundo */}
        <div
          className="absolute -bottom-[140px] right-[-80px] w-[420px] h-[420px] rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: brandColor }}
        />

        {/* Textura sutil de micro-grid pontilhado para profundidade tátil */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Conteúdo Central em Coluna Minimalista */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 my-auto">
        <ProfileHeader empresa={empresa} />

        {/* Botão de Destaque: Salvar Contato Direto na Agenda */}
        <SaveContactButton slug={slug} corPrimaria={brandColor} />

        {/* Lista de Links */}
        <div className="w-full flex flex-col gap-3">
          {empresa.links.map((link) => (
            <LinkButton
              key={link.url}
              link={link}
              empresaId={empresa.id}
              corPrimaria={brandColor}
            />
          ))}
        </div>

        {/* Redes Sociais */}
        {empresa.redesSociais && <SocialIcons redes={empresa.redesSociais} />}
      </div>

      {/* Footer Minimalista com Selo NFC & Botão QR Code */}
      <footer className="relative z-10 pt-10 pb-4 flex flex-col items-center gap-3.5 text-center">
        {/* Botão Discreto: Exibir QR Code para usuários com NFC desligado */}
        <QrCodeModal slug={slug} nome={empresa.nome} corPrimaria={brandColor} />

        <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wider text-slate-400">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
          <span>NFC LINK TREE</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400/90 font-medium">POWERED BY QUANTUM</span>
        </div>
      </footer>
    </main>
  );
}
