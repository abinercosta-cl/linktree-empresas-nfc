// Cria um Administrador direto no banco. Necessário só para o PRIMEIRO acesso
// (bootstrap): depois disso, novos administradores são convidados pelo painel
// em /admin/administradores/novo.
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// Mesmo custo usado na Server Action de criação de administrador.
const BCRYPT_CUSTO = 12;

async function main() {
  const [emailArg, senha, ...nomePartes] = process.argv.slice(2);

  if (!emailArg || !senha) {
    console.error("Uso: npx tsx prisma/criar-admin.ts <email> <senha> [nome]");
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(`Email inválido: ${emailArg}`);
    process.exit(1);
  }
  if (senha.length < 8 || senha.length > 72) {
    console.error("A senha deve ter entre 8 e 72 caracteres.");
    process.exit(1);
  }

  const nome = nomePartes.join(" ").trim() || email.split("@")[0];
  const prisma = new PrismaClient();

  try {
    const senhaHash = await bcrypt.hash(senha, BCRYPT_CUSTO);
    const admin = await prisma.administrador.create({ data: { email, senhaHash, nome } });
    console.log(`Administrador criado: ${admin.nome} <${admin.email}> (id ${admin.id})`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      console.error(`Já existe um administrador com o email ${email}.`);
      process.exitCode = 1;
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Uso (a partir da pasta nfc-link-tree, com DATABASE_URL no .env):
//
//   npx tsx prisma/criar-admin.ts email@exemplo.com senha123 "Nome do Admin"
//
// O nome é opcional (padrão: parte do email antes do @). A senha precisa ter
// de 8 a 72 caracteres. Dica: comece o comando com um espaço para ele não ficar
// salvo no histórico do shell (funciona no bash/zsh com HISTCONTROL=ignorespace
// ou setopt HIST_IGNORE_SPACE), já que a senha vai como argumento.
