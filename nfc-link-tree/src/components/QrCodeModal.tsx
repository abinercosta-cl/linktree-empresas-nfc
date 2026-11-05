"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getSiteUrl } from "@/lib/site-url";
import { QrCodeIcon, CloseIcon, CopyIcon, CheckIcon } from "./Icons";

interface QrCodeModalProps {
  slug: string;
  nome: string;
  corPrimaria?: string;
  className?: string;
}

export default function QrCodeModal({
  slug,
  nome,
  corPrimaria = "#0EA5E9",
  className = "",
}: QrCodeModalProps) {
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
      {/* Botão Discreto no Rodapé */}
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-slate-300/90 hover:text-white
                   bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20
                   backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${className}`}
      >
        <QrCodeIcon className="w-3.5 h-3.5 text-slate-300" />
        <span>Exibir QR Code</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          {/* Card Glassmorphic do Modal */}
          <div
            className="relative w-full max-w-sm rounded-3xl p-[1px] transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow cromático com a cor primária */}
            <div
              className="absolute inset-0 rounded-3xl opacity-60 blur-xl pointer-events-none"
              style={{ backgroundColor: `${corPrimaria}30` }}
            />

            {/* Borda gradiente glassmorphism */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${corPrimaria}60 0%, rgba(255,255,255,0.12) 50%, ${corPrimaria}30 100%)`,
              }}
            />

            {/* Conteúdo interno do Modal */}
            <div className="relative z-10 w-full rounded-[calc(1.5rem-1px)] bg-[#0C111D]/95 border border-white/15 p-6 flex flex-col items-center text-center gap-5 shadow-2xl backdrop-blur-2xl">
              {/* Topo do modal com Título e Fechar */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2 text-left">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/15"
                    style={{
                      backgroundColor: `${corPrimaria}20`,
                      color: corPrimaria,
                    }}
                  >
                    <QrCodeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight leading-tight">
                      QR Code de Acesso
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 truncate max-w-[190px]">
                      {nome}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar modal"
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Container do QR Code de Alto Contraste (Fundo branco para garantir leitura perfeita por qualquer câmera em modo claro ou escuro) */}
              <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center ring-4 ring-white/10">
                {url ? (
                  <QRCodeSVG
                    value={`${url}?src=qr`}
                    size={190}
                    level="M"
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                ) : (
                  <div className="w-[190px] h-[190px] bg-slate-100 animate-pulse rounded-lg" />
                )}
              </div>

              {/* Instruções */}
              <p className="text-xs text-slate-300/80 leading-relaxed max-w-xs text-balance">
                Aponte a câmera do celular para escanear e abrir a página oficial sem precisar de NFC.
              </p>

              {/* Botão de Copiar Link */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-xs font-mono text-slate-200 hover:text-white transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Link copiado para a área de transferência!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar link da página</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
