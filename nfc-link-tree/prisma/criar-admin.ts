// Cria um Administrador direto no banco. Necessário só para o PRIMEIRO acesso
// (bootstrap) ou fora do painel: depois disso, novos administradores são
// convidados em /admin/administradores/novo.
//
// Uso (a partir da pasta nfc-link-tree, com DATABASE_URL no .env):
//
//   npx tsx prisma/criar-admin.ts email@exemplo.com senha123 "Nome do Admin"
//   npx tsx prisma/criar-admin.ts email@cliente.com senha123 "Nome" --cliente auto-car-tapecaria
//
// Sem --cliente, cria um ADMIN (equipe da Quantum, acesso total). Com
// --cliente <slug>, cria um CLIENTE com acesso só à empresa desse slug.
// O nome é opcional (padrão: parte do email antes do @). A senha precisa ter
// de 8 a 72 caracteres. Dica: comece o comando com um espaço para ele não ficar
// salvo no histórico do shell (funciona no bash/zsh com HISTCONTROL=ignorespace
// ou setopt HIST_IGNORE_SPACE), já que a senha vai como argumento.
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// Mesmo custo usado na Server Action de criação de administrador.
const BCRYPT_CUSTO = 12;

const USO =
  'Uso: npx tsx prisma/criar-admin.ts <email> <senha> [nome] [--cliente <slug-da-empresa>]';

// Separa a opção --cliente <slug> dos argumentos posicionais, em qualquer posição.
function lerArgumentos(argv: string[]) {
  const posicionais: string[] = [];
  let slugCliente: string | null = null;

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--cliente") {
      const slug = argv[i + 1];
      if (!slug || slug.startsWith("--")) {
        console.error("Informe o slug da empresa depois de --cliente.");
        console.error(USO);
        process.exit(1);
      }
      slugCliente = slug.trim().toLowerCase();
      i++;
    } else if (argv[i].startsWith("--")) {
      console.error(`Opção desconhecida: ${argv[i]}`);
      console.error(USO);
      process.exit(1);
    } else {
      posicionais.push(argv[i]);
    }
  }

  return { posicionais, slugCliente };
}

async function main() {
  const { posicionais, slugCliente } = lerArgumentos(process.argv.slice(2));
  const [emailArg, senha, ...nomePartes] = posicionais;

  if (!emailArg || !senha) {
    console.error(USO);
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
    let empresa: { id: string; nome: string } | null = null;
    if (slugCliente) {
      empresa = await prisma.empresa.findUnique({
        where: { slug: slugCliente },
        select: { id: true, nome: true },
      });
      if (!empresa) {
        console.error(`Nenhuma empresa com o slug "${slugCliente}".`);
        process.exitCode = 1;
        return;
      }
    }

    const senhaHash = await bcrypt.hash(senha, BCRYPT_CUSTO);
    const admin = await prisma.administrador.create({
      data: empresa
        ? { email, senhaHash, nome, role: "CLIENTE", empresaId: empresa.id }
        : { email, senhaHash, nome, role: "ADMIN" },
    });
    const papel = empresa ? `CLIENTE de ${empresa.nome} (/${slugCliente})` : "ADMIN";
    console.log(`Administrador criado: ${admin.nome} <${admin.email}> (id ${admin.id}), papel ${papel}`);
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
