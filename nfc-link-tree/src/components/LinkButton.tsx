import { LinkItem } from "@/types/empresa";
import {
  ArrowUpRightIcon,
  GoogleReviewIcon,
  WhatsAppIcon,
  GlobeIcon,
  PackageIcon,
  InstagramIcon,
} from "./Icons";
import React from "react";

function renderLinkIcon(label: string, url: string, className = "w-5 h-5") {
  const text = `${label} ${url}`.toLowerCase();
  if (text.includes("google") || text.includes("avaliar")) return <GoogleReviewIcon className={className} />;
  if (text.includes("whatsapp") || text.includes("wa.me")) return <WhatsAppIcon className={className} />;
  if (text.includes("estoquepro") || text.includes("produto") || text.includes("pedido")) return <PackageIcon className={className} />;
  if (text.includes("instagram")) return <InstagramIcon className={className} />;
  return <GlobeIcon className={className} />;
}

// Limpa emojis iniciais do label para manter a tipografia editorial limpa e elegante
function formatLabel(label: string): string {
  return label.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, "").trim() || label;
}

// Extrai um domínio legível para dar contexto micro-editorial
function getDomainHint(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("wa.me")) return "WhatsApp direto";
    if (parsed.hostname.includes("google") || parsed.hostname.includes("g.page")) return "Avaliação verificada";
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export default function LinkButton({
  link,
  corPrimaria = "#0EA5E9",
}: {
  link: LinkItem;
  corPrimaria?: string;
}) {
  const cleanLabel = formatLabel(link.label);
  const domainHint = getDomainHint(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full block rounded-2xl p-[1px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                 hover:scale-[1.015] active:scale-[0.985]"
      style={
        {
          "--brand": corPrimaria,
        } as React.CSSProperties
      }
    >
      {/* Glow e Borda Gradiente no Hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
        style={{
          background: `linear-gradient(135deg, ${corPrimaria}40 0%, rgba(255,255,255,0.08) 50%, ${corPrimaria}20 100%)`,
        }}
      />

      {/* Sombra difusa no hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
        style={{
          backgroundColor: `${corPrimaria}25`,
        }}
      />

      {/* Núcleo interno do botão (Double-Bezel) */}
      <div
        className="relative z-10 w-full rounded-[calc(1rem-1px)]
                   bg-[#0E1524]/85 hover:bg-[#121B2D]/90
                   border border-white/10 group-hover:border-white/20
                   backdrop-blur-xl
                   px-4 py-3.5 flex items-center justify-between gap-3.5
                   shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]
                   transition-all duration-300"
      >
        {/* Ícone à esquerda com sutil realce */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                     border border-white/10
                     transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: `${corPrimaria}15`,
            color: corPrimaria,
          }}
        >
          {renderLinkIcon(link.label, link.url, "w-5 h-5")}
        </div>

        {/* Textos: Título e subtexto sutil */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm sm:text-base font-semibold text-white tracking-tight truncate group-hover:text-white transition-colors">
            {cleanLabel}
          </p>
          {domainHint && (
            <p className="text-[11px] font-mono text-slate-400/80 truncate">
              {domainHint}
            </p>
          )}
        </div>

        {/* Trailing Icon (Button-in-Button pattern) */}
        <div
          className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10
                     flex items-center justify-center text-slate-400 shrink-0
                     transition-all duration-300
                     group-hover:text-white group-hover:bg-white/[0.12]
                     group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <ArrowUpRightIcon className="w-3.5 h-3.5" />
        </div>
      </div>
    </a>
  );
}
