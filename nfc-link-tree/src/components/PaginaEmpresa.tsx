import type { CSSProperties } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import SaveContactButton from "@/components/SaveContactButton";
import LinkButton from "@/components/LinkButton";
import SocialIcons from "@/components/SocialIcons";
import QrCodeModal from "@/components/QrCodeModal";
import TrackPageView from "@/components/TrackPageView";
import { NfcIcon } from "@/components/Icons";
import { criarPaleta, variaveisPaleta } from "@/lib/paleta";
import { formatarTelefone, telefoneDaEmpresa } from "@/lib/telefone";
import type { Empresa } from "@/types/empresa";

// Visual da página pública de uma empresa. Toda cor sai de criarPaleta(), a
// partir da cor de fundo e da cor primária escolhidas no painel, para que
// qualquer combinação continue legível (ver src/lib/paleta.ts).
export default function PaginaEmpresa({ empresa, slug }: { empresa: Empresa; slug: string }) {
  const paleta = criarPaleta(empresa.corFundo, empresa.corPrimaria);
  const telefone = telefoneDaEmpresa(empresa);

  return (
    <main
      style={variaveisPaleta(paleta) as CSSProperties}
      className="min-h-[100dvh] w-full bg-[var(--fundo)] text-[var(--texto)] px-4 sm:px-6
                 selection:bg-[var(--destaque)] selection:text-[var(--sobre-destaque)]"
    >
      {/* Mesma cor na rolagem elástica do iOS e atrás da barra do navegador. */}
      <style>{`html,body{background-color:${paleta.fundo}}`}</style>

      {empresa.id && <TrackPageView empresaId={empresa.id} />}

      <div className="mx-auto flex w-full max-w-[420px] flex-col pt-12 pb-10 sm:pt-20">
        <ProfileHeader empresa={empresa} />

        <div className="mt-8">
          <SaveContactButton
            slug={slug}
            nome={empresa.nome}
            telefone={telefone ? formatarTelefone(telefone) : null}
          />
        </div>

        {empresa.links.length > 0 && (
          <nav aria-label="Links" className="mt-6 flex flex-col gap-2">
            {empresa.links.map((link) => (
              <LinkButton key={link.id} link={link} empresaId={empresa.id} />
            ))}
          </nav>
        )}

        {empresa.redesSociais && empresa.redesSociais.length > 0 && (
          <div className="mt-6">
            <SocialIcons redes={empresa.redesSociais} />
          </div>
        )}

        <footer className="mt-12 flex flex-col items-center gap-3 border-t border-[var(--linha)] pt-6">
          <QrCodeModal slug={slug} nome={empresa.nome} />
          <p className="inline-flex items-center gap-2 text-xs text-[var(--texto-3)]">
            <NfcIcon className="size-4" />
            NFC Link Tree · Quantum
          </p>
        </footer>
      </div>
    </main>
  );
}
