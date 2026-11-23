export interface LinkItem {
  id: string;
  label: string;
  url: string;
  ordem?: number;
}

export type TipoRedeSocial =
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "google"
  | string;

export interface RedeSocialItem {
  id: string;
  tipo: TipoRedeSocial;
  url: string;
}

export type RedeSocial = RedeSocialItem;

export type Empresa = {
  id?: string;
  slug: string;
  nome: string;
  bio?: string | null;
  avatarUrl?: string | null;
  corPrimaria?: string | null;
  corFundo?: string | null;
  ativo?: boolean;
  links: LinkItem[];
  redesSociais?: RedeSocialItem[];
};
