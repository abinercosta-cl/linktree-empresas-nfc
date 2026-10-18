export interface LinkItem {
  label: string;
  url: string;
  icon?: string; // emoji ou nome de ícone (lucide-react no futuro)
}

export type TipoRedeSocial =
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "google";

export interface RedeSocial {
  tipo: TipoRedeSocial;
  url: string;
}

export interface Empresa {
  slug: string; // identifica a rota /[slug]
  nome: string;
  bio?: string;
  avatarUrl?: string;
  corPrimaria?: string; // hex — cor dos botões
  corFundo?: string; // hex — fundo da página
  links: LinkItem[];
  redesSociais?: RedeSocial[];
}
