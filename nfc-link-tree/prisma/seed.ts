import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed do banco de dados...");

  // 1. Empresa Quantum
  await prisma.empresa.upsert({
    where: { slug: "quantum" },
    update: {},
    create: {
      slug: "quantum",
      nome: "Quantum — Soluções e Estratégias",
      bio: "Avalie nosso atendimento — deixe sua avaliação no Google Meu Negócio",
      avatarUrl: "/avatars/quantum.png",
      corPrimaria: "#0EA5E9",
      corFundo: "#0B1220",
      ativo: true,
      links: {
        create: [
          { label: "⭐ Avaliar no Google", url: "https://g.page/r/SEU_LINK_AQUI", ordem: 0 },
          { label: "💬 Falar no WhatsApp", url: "https://wa.me/5593991359644", ordem: 1 },
          { label: "🌐 Visitar site", url: "https://abiner.dev", ordem: 2 },
          { label: "📦 Conhecer o EstoquePRO", url: "https://exemplo.com/estoquepro", ordem: 3 },
        ],
      },
      redesSociais: {
        create: [
          { tipo: "whatsapp", url: "https://wa.me/5593991359644" },
          { tipo: "instagram", url: "https://instagram.com/seuperfil" },
        ],
      },
    },
  });

  // 2. Empresa Exemplo
  await prisma.empresa.upsert({
    where: { slug: "exemplo" },
    update: {},
    create: {
      slug: "exemplo",
      nome: "Nome da Empresa Exemplo",
      bio: "Descrição curta do negócio",
      corPrimaria: "#F97316",
      corFundo: "#111827",
      ativo: true,
      links: {
        create: [
          { label: "⭐ Avaliar no Google", url: "https://g.page/r/EXEMPLO", ordem: 0 },
          { label: "💬 WhatsApp", url: "https://wa.me/55999999999", ordem: 1 },
        ],
      },
      redesSociais: {
        create: [
          { tipo: "instagram", url: "https://instagram.com/exemplo" },
        ],
      },
    },
  });

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
