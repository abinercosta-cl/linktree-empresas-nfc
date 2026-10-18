import { Empresa } from "@/types/empresa";

// MOCK inicial — depois migrar para SQLite/Prisma (ver seção "Próximos passos")
export const empresas: Record<string, Empresa> = {
  quantum: {
    slug: "quantum",
    nome: "Quantum — Soluções e Estratégias",
    bio: "Avalie nosso atendimento — deixe sua avaliação no Google Meu Negócio",
    avatarUrl: "/avatars/quantum.png",
    corPrimaria: "#0EA5E9",
    corFundo: "#0B1220",
    links: [
      { label: "⭐ Avaliar no Google", url: "https://g.page/r/SEU_LINK_AQUI" },
      { label: "💬 Falar no WhatsApp", url: "https://wa.me/5593991359644" },
      { label: "🌐 Visitar site", url: "https://abiner.dev" },
      { label: "📦 Conhecer o EstoquePRO", url: "https://exemplo.com/estoquepro" },
    ],
    redesSociais: [
      { tipo: "whatsapp", url: "https://wa.me/5593991359644" },
      { tipo: "instagram", url: "https://instagram.com/seuperfil" },
    ],
  },

  // Exemplo de uma segunda empresa — é só adicionar uma entrada nova aqui
  // para a plataforma atender outro cliente, sem mexer em nenhum componente.
  exemplo: {
    slug: "exemplo",
    nome: "Nome da Empresa Exemplo",
    bio: "Descrição curta do negócio",
    corPrimaria: "#F97316",
    corFundo: "#111827",
    links: [
      { label: "⭐ Avaliar no Google", url: "https://g.page/r/EXEMPLO" },
      { label: "💬 WhatsApp", url: "https://wa.me/55999999999" },
    ],
    redesSociais: [{ tipo: "instagram", url: "https://instagram.com/exemplo" }],
  },
};

export function getEmpresa(slug: string): Empresa | undefined {
  return empresas[slug];
}

export function listarSlugs(): string[] {
  return Object.keys(empresas);
}
