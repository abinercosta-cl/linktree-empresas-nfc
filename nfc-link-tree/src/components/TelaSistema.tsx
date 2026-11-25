import type { CSSProperties, ReactNode } from "react";
import { NfcIcon } from "@/components/Icons";
import { criarPaleta, variaveisPaleta } from "@/lib/paleta";

// Sem empresa carregada, as telas da plataforma usam a paleta padrão, com o
// mesmo sistema de cores da página da empresa (src/lib/paleta.ts).
const paleta = criarPaleta();

// Moldura das telas de sistema (erro e 404): título, texto e, opcionalmente,
// uma ação. Não usa hooks nem "use client", para o 404 da raiz continuar sendo
// Server Component (o Next envia o not-found.tsx da raiz com todas as páginas).
export default function TelaSistema({
  titulo,
  mensagem,
  children,
}: {
  titulo: string;
  mensagem: string;
  children?: ReactNode;
}) {
  return (
    <main
      style={variaveisPaleta(paleta) as CSSProperties}
      className="flex min-h-[100dvh] w-full flex-col bg-[var(--fundo)] px-4 text-[var(--texto)] sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl leading-8 font-medium">{titulo}</h1>
        <p className="mt-2 max-w-[34ch] text-[15px] leading-[22px] text-[var(--texto-2)] text-balance">{mensagem}</p>
        {children}
      </div>

      <footer className="mx-auto flex w-full max-w-[420px] justify-center border-t border-[var(--linha)] py-6">
        <p className="inline-flex items-center gap-2 text-xs text-[var(--texto-3)]">
          <NfcIcon className="size-4" />
          NFC Link Tree · Quantum
        </p>
      </footer>
    </main>
  );
}
