"use client";

export default function ErrorState({
  digest,
  retry,
}: {
  digest?: string;
  retry: () => void;
}) {
  return (
    <main className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-12 bg-[#07090E] text-white overflow-x-hidden">
      {/* Luzes de Fundo com Blur Ambiente */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-sky-500/20 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Card Double-Bezel */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl p-[1px] bg-gradient-to-br from-sky-500/40 via-white/10 to-sky-500/20">
        <div className="rounded-[calc(1.5rem-1px)] bg-[#0C111D]/90 border border-white/10 backdrop-blur-2xl p-6 flex flex-col items-center text-center gap-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-sky-500/10 text-sky-400 text-xl font-bold">
            !
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-lg font-semibold tracking-tight">Algo deu errado</h1>
            <p className="text-sm text-slate-300/80 leading-relaxed text-balance">
              Não foi possível carregar esta página agora. Tente novamente em instantes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => retry()}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-sm font-medium text-slate-100 hover:text-white transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            Tentar novamente
          </button>

          {digest && (
            <p className="text-[11px] font-mono text-slate-500">código: {digest}</p>
          )}
        </div>
      </div>
    </main>
  );
}
