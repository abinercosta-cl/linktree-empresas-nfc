"use client";

import TelaSistema from "@/components/TelaSistema";

// Tela de erro usada pelos error boundaries, pela página da empresa e pelo hub
// quando o banco falha. É Client Component por causa do botão de tentar de novo.
export default function ErrorState({
  digest,
  retry,
}: {
  digest?: string;
  retry?: () => void;
}) {
  return (
    <TelaSistema
      titulo="Algo deu errado"
      mensagem="Não foi possível carregar esta página agora. Tente novamente em instantes."
    >
      <button
        type="button"
        onClick={() => (retry ? retry() : window.location.reload())}
        className="mt-8 flex h-12 w-full items-center justify-center rounded-xl px-4 text-base font-medium
                   bg-[var(--destaque)] text-[var(--sobre-destaque)]
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]
                   transition-[transform,filter] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                   hover:brightness-[1.06] active:scale-[0.98] cursor-pointer
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
      >
        Tentar novamente
      </button>

      {digest && (
        <p className="mt-4 text-xs text-[var(--texto-3)]">
          Código do erro <span className="font-mono select-all">{digest}</span>
        </p>
      )}
    </TelaSistema>
  );
}
