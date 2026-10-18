import Image from "next/image";
import { Empresa } from "@/types/empresa";
import { VerifiedCheckIcon } from "./Icons";

export default function ProfileHeader({ empresa }: { empresa: Empresa }) {
  const brandColor = empresa.corPrimaria ?? "#0EA5E9";
  const initial = empresa.nome.trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Container do Avatar com Luminous Halo */}
      <div className="relative group">
        {/* Glow difuso atrás da imagem */}
        <div
          className="absolute -inset-3 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-80 pointer-events-none"
          style={{ backgroundColor: `${brandColor}40` }}
        />

        {/* Borda Externa (Double-Bezel) */}
        <div className="relative p-1 rounded-full ring-1 ring-white/15 bg-white/[0.03] backdrop-blur-md shadow-2xl">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/20 bg-[#0B101C] flex items-center justify-center">
            {empresa.avatarUrl ? (
              <Image
                src={empresa.avatarUrl}
                alt={empresa.nome}
                width={112}
                height={112}
                priority
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span
                className="text-3xl sm:text-4xl font-extrabold tracking-wider"
                style={{
                  color: brandColor,
                  textShadow: `0 0 20px ${brandColor}60`,
                }}
              >
                {initial}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selo / Eyebrow Badge Minimalista */}
      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-white/[0.04] border border-white/10 text-slate-300 backdrop-blur-md shadow-sm">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: brandColor }}
        />
        <span>Atendimento Oficial</span>
        <VerifiedCheckIcon className="w-3.5 h-3.5" />
      </div>

      {/* Nome da Empresa */}
      <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight max-w-xs sm:max-w-md">
        {empresa.nome}
      </h1>

      {/* Bio / Descrição */}
      {empresa.bio && (
        <p className="text-slate-300/80 text-xs sm:text-sm max-w-xs sm:max-w-sm leading-relaxed text-balance">
          {empresa.bio}
        </p>
      )}
    </div>
  );
}
