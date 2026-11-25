"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getSiteUrl } from "@/lib/site-url";
import { QrCodeIcon, CloseIcon, CopyIcon, CheckIcon } from "./Icons";

// Alternativa para quem está com o NFC desligado: mostra a página como QR Code.
// As cores vêm das variáveis da paleta (o modal é renderizado dentro da página).
export default function QrCodeModal({ slug, nome }: { slug: string; nome: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    setUrl(`${getSiteUrl(window.location.origin)}/${slug}`);
    setIsOpen(true);
  };

  // Bloqueia scroll do body e escuta tecla ESC enquanto modal estiver aberto
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar URL:", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-[var(--texto-2)]
                   transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                   hover:bg-[var(--cartao)] hover:text-[var(--texto)] cursor-pointer
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
      >
        <QrCodeIcon className="size-4" />
        Mostrar QR Code
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-titulo"
            className="entrar w-full max-w-sm rounded-2xl bg-[var(--fundo)] border border-[var(--linha)] p-6
                       flex flex-col items-center gap-5 text-center shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-start justify-between gap-4 text-left">
              <div className="min-w-0">
                <h2 id="qr-titulo" className="text-[15px] leading-[22px] font-medium text-[var(--texto)]">
                  QR Code da página
                </h2>
                <p className="truncate text-[13px] leading-5 text-[var(--texto-3)]">{nome}</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setIsOpen(false)}
                aria-label="Fechar"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--texto-3)]
                           transition-colors duration-150 hover:bg-[var(--cartao)] hover:text-[var(--texto)] cursor-pointer
                           focus-visible:outline-2 focus-visible:outline-[var(--destaque)]"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {/* Fundo branco e módulos pretos em qualquer tema: é o que toda câmera lê bem. */}
            <div className="rounded-xl bg-white p-4">
              {url ? (
                <QRCodeSVG value={`${url}?src=qr`} size={192} level="M" fgColor="#000000" bgColor="#ffffff" />
              ) : (
                <div className="size-48" />
              )}
            </div>

            <p className="max-w-[30ch] text-sm leading-5 text-[var(--texto-2)] text-balance">
              Aponte a câmera do celular para abrir esta página sem NFC
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm
                         bg-[var(--cartao)] border border-[var(--linha)] text-[var(--texto)]
                         transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                         hover:bg-[var(--elevado)] active:scale-[0.98] cursor-pointer
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
            >
              {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4 text-[var(--texto-3)]" />}
              <span aria-live="polite">{copied ? "Link copiado" : "Copiar link"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
