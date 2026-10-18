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
import React from "react";

const ICON_MAP: Record<TipoRedeSocial, React.ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  google: GoogleReviewIcon,
};

export default function SocialIcons({ redes }: { redes: RedeSocial[] }) {
  if (!redes || !redes.length) return null;

  return (
    <div className="flex items-center justify-center gap-3.5 mt-2">
      {redes.map((rede) => {
        const IconComponent = ICON_MAP[rede.tipo] ?? GlobeIcon;
        return (
          <a
            key={rede.url}
            href={rede.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={rede.tipo}
            className="group relative flex items-center justify-center w-11 h-11 rounded-full
                       bg-white/[0.04] hover:bg-white/[0.1]
                       border border-white/10 hover:border-white/25
                       text-slate-300 hover:text-white
                       backdrop-blur-md
                       transition-all duration-300 ease-out
                       hover:scale-110 active:scale-95
                       shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
            <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
          </a>
        );
      })}
    </div>
  );
}
