import type { ComponentType } from "react";
import { RedeSocial, TipoRedeSocial } from "@/types/empresa";
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  GoogleReviewIcon,
  GlobeIcon,
} from "./Icons";

const ICON_MAP: Record<TipoRedeSocial, ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  google: GoogleReviewIcon,
};

const NOMES: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  google: "Google",
};

export default function SocialIcons({ redes }: { redes: RedeSocial[] }) {
  if (!redes || !redes.length) return null;

  return (
    <nav aria-label="Redes sociais" className="flex items-center justify-center gap-2">
      {redes.map((rede) => {
        const IconComponent = ICON_MAP[rede.tipo] ?? GlobeIcon;
        return (
          <a
            key={rede.id}
            href={rede.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={NOMES[rede.tipo] ?? rede.tipo}
            className="flex size-11 items-center justify-center rounded-[10px]
                       bg-[var(--cartao)] border border-[var(--linha)] text-[var(--texto-2)]
                       transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                       hover:bg-[var(--elevado)] hover:text-[var(--texto)] active:scale-[0.96]
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
          >
            <IconComponent className="size-5" />
          </a>
        );
      })}
    </nav>
  );
}
