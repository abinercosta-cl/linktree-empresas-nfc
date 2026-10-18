import Link from "next/link";
import { NfcIcon, ArrowUpRightIcon, VerifiedCheckIcon } from "@/components/Icons";
import { empresas } from "@/data/empresas";

export default function Home() {
  const tenants = Object.values(empresas);

  return (
    <main className="relative min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 py-12 sm:py-20 bg-[#07090E] text-white selection:bg-sky-500/20 overflow-x-hidden">
      {/* Luzes de Fundo com Blur Ambiente */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/20 blur-[150px]" />
        <div className="absolute -bottom-[200px] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Cabeçalho Minimalista Hero */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center gap-4 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-white/[0.04] border border-white/10 text-sky-400 backdrop-blur-md shadow-sm">
          <NfcIcon className="w-4 h-4 text-sky-400" />
          <span>Plataforma Multi-tenant NFC</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl text-balance">
          Linktree para Empresas com Tags NFC
        </h1>

        <p className="text-slate-300/80 text-sm sm:text-base max-w-md leading-relaxed text-balance">
          Páginas ultrarrápidas, sem aplicativo. Aproxime o cartão NFC ou escaneie o QR Code para abrir os canais oficiais do cliente.
        </p>

        {/* Bento Cards dos Tenants Cadastrados */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {tenants.map((empresa) => {
            const brandColor = empresa.corPrimaria ?? "#0EA5E9";
            return (
              <Link
                key={empresa.slug}
                href={`/${empresa.slug}`}
                className="group relative rounded-2xl p-[1px] text-left transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Glow de Borda no Hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                  style={{
                    background: `linear-gradient(135deg, ${brandColor}50 0%, rgba(255,255,255,0.05) 60%, ${brandColor}20 100%)`,
                  }}
                />

                {/* Sombra difusa colorida no hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
                  style={{ backgroundColor: `${brandColor}20` }}
                />

                {/* Card Interior Double-Bezel */}
                <div className="relative z-10 h-full rounded-[calc(1rem-1px)] bg-[#0C111C]/85 group-hover:bg-[#101726]/90 border border-white/10 group-hover:border-white/20 backdrop-blur-xl p-5 flex flex-col justify-between gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border border-white/10"
                        style={{
                          backgroundColor: `${brandColor}20`,
                          color: brandColor,
                        }}
                      >
                        {empresa.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-white tracking-tight leading-snug group-hover:text-white">
                          {empresa.nome}
                        </h2>
                        <span className="text-xs font-mono text-slate-400">
                          /{empresa.slug}
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.12] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                      <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/70 line-clamp-2 leading-relaxed">
                    {empresa.bio || "Página oficial de links para cartões NFC"}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
                    <span>{empresa.links.length} links configurados</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <VerifiedCheckIcon className="w-3 h-3" />
                      Ativo
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Minimalista */}
      <footer className="relative z-10 pt-12 pb-2 text-center">
        <p className="text-xs font-mono text-slate-500 tracking-wider">
          QUANTUM ECOSYSTEM • CARTÕES E TAGS NFC
        </p>
      </footer>
    </main>
  );
}
