import React from "react";
import { UserPlusIcon, DownloadIcon } from "./Icons";

interface SaveContactButtonProps {
  slug: string;
  corPrimaria?: string;
  className?: string;
}

export default function SaveContactButton({
  slug,
  corPrimaria = "#0EA5E9",
  className = "",
}: SaveContactButtonProps) {
  return (
    <a
      href={`/${slug}/contato.vcf`}
      download={`${slug}.vcf`}
      className={`group relative w-full block rounded-2xl p-[1px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                 hover:scale-[1.015] active:scale-[0.985] shadow-lg ${className}`}
      style={
        {
          "--brand": corPrimaria,
        } as React.CSSProperties
      }
    >
      {/* Glow e Borda Gradiente com maior destaque por ser ação primária */}
      <div
        className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
        style={{
          background: `linear-gradient(135deg, ${corPrimaria}70 0%, rgba(255,255,255,0.12) 50%, ${corPrimaria}40 100%)`,
        }}
      />

      {/* Sombra difusa colorida no hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-15 group-hover:opacity-40 transition-opacity duration-300 blur-xl pointer-events-none"
        style={{
          backgroundColor: corPrimaria,
        }}
      />

      {/* Núcleo interno Double-Bezel */}
      <div
        className="relative z-10 w-full rounded-[calc(1rem-1px)]
                   bg-gradient-to-r from-[#0F172A]/90 to-[#0A101D]/90 hover:from-[#131E35]/95 hover:to-[#0D1526]/95
                   border border-white/15 group-hover:border-white/25
                   backdrop-blur-xl
                   px-4 py-3.5 flex items-center justify-between gap-3.5
                   shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]
                   transition-all duration-300"
      >
        {/* Ícone com fundo da cor da marca */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                     border border-white/15
                     transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: `${corPrimaria}25`,
            color: corPrimaria,
          }}
        >
          <UserPlusIcon className="w-5 h-5" />
        </div>

        {/* Textos da Ação */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm sm:text-base font-semibold text-white tracking-tight truncate group-hover:text-white transition-colors">
            Salvar Contato
          </p>
          <p className="text-[11px] font-mono text-slate-300/80 truncate">
            Adicionar à agenda do celular (.vcf)
          </p>
        </div>

        {/* Ícone de download circular */}
        <div
          className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15
                     flex items-center justify-center text-slate-300 shrink-0
                     transition-all duration-300
                     group-hover:text-white group-hover:bg-white/[0.15]
                     group-hover:translate-y-0.5"
          style={{
            color: corPrimaria,
          }}
        >
          <DownloadIcon className="w-3.5 h-3.5" />
        </div>
      </div>
    </a>
  );
}
