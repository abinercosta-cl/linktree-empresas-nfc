"use client";

import { LinkItem } from "@/types/empresa";
import {
  ArrowUpRightIcon,
  GoogleReviewIcon,
  WhatsAppIcon,
  GlobeIcon,
  PackageIcon,
  InstagramIcon,
} from "./Icons";

function renderLinkIcon(label: string, url: string, className = "size-[18px]") {
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

// Contexto curto sob o texto do link: o serviço ou o domínio de destino.
function getDomainHint(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("wa.me") || host.includes("whatsapp.com")) return "WhatsApp";
    if (host.includes("google") || host.includes("g.page")) return "Google";
    return host;
  } catch {
    return null;
  }
}

export default function LinkButton({ link, empresaId }: { link: LinkItem; empresaId?: string }) {
  const cleanLabel = formatLabel(link.label);
  const domainHint = getDomainHint(link.url);

  const handleClick = () => {
    if (!empresaId) return;

    let source: string | undefined;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      source = params.get("src") || undefined;
    }

    const payload = JSON.stringify({
      empresaId,
      tipo: "click",
      linkId: link.id || undefined,
      origem: source || "direto",
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Telemetria é best-effort: uma falha aqui não pode afetar a navegação.
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 min-h-14
                 bg-[var(--cartao)] border border-[var(--linha)]
                 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                 hover:bg-[var(--elevado)] active:scale-[0.98]
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
    >
      <span className="flex w-5 shrink-0 justify-center text-[var(--texto-3)]">
        {renderLinkIcon(link.label, link.url)}
      </span>
      <span className="flex-1 min-w-0 py-2">
        <span className="block truncate text-[15px] leading-[22px] font-medium text-[var(--texto)]">{cleanLabel}</span>
        {domainHint && (
          <span className="block truncate text-[13px] leading-5 text-[var(--texto-3)]">{domainHint}</span>
        )}
      </span>
      <ArrowUpRightIcon className="size-4 shrink-0 text-[var(--texto-3)]" />
    </a>
  );
}
