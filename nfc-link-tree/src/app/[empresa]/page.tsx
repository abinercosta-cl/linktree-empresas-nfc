import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEmpresa, listarSlugs } from "@/data/empresas";
import ProfileHeader from "@/components/ProfileHeader";
import LinkButton from "@/components/LinkButton";
import SocialIcons from "@/components/SocialIcons";

type Params = Promise<{ empresa: string }>;

// Gera as rotas conhecidas em build time; novas empresas adicionadas depois continuam funcionando
export async function generateStaticParams() {
  return listarSlugs().map((slug) => ({ empresa: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { empresa: slug } = await params;
  const empresa = getEmpresa(slug);
  if (!empresa) return {};
  return {
    title: `${empresa.nome} | Links Oficiais`,
    description: empresa.bio,
  };
}

export default async function EmpresaPage({ params }: { params: Params }) {
  const { empresa: slug } = await params;
  const empresa = getEmpresa(slug);

  if (!empresa) notFound();

  const brandColor = empresa.corPrimaria ?? "#0EA5E9";

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 py-10 sm:py-16 overflow-x-hidden selection:bg-white/10"
      style={{ backgroundColor: empresa.corFundo ?? "#080B11" }}
    >
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
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-7 my-auto">
        <ProfileHeader empresa={empresa} />

        {/* Lista de Links */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {empresa.links.map((link) => (
            <LinkButton
              key={link.url}
              link={link}
              corPrimaria={brandColor}
            />
          ))}
        </div>

        {/* Redes Sociais */}
        {empresa.redesSociais && <SocialIcons redes={empresa.redesSociais} />}
      </div>

      {/* Footer Minimalista com Selo NFC */}
      <footer className="relative z-10 pt-10 pb-2 flex flex-col items-center gap-1.5 text-center">
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
