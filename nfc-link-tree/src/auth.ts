import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, isRateLimited } from "@/lib/rate-limit";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

// Hash válido de uma senha aleatória: quando o email não existe, ainda rodamos
// bcrypt.compare contra ele para que o tempo de resposta não revele quais
// emails estão cadastrados.
const HASH_FICTICIO = "$2b$12$doyJslFevGrE6rNQtQva9eAkwUDYQYxRaCnsZG9nImmPsOLVT/Vhq";

const LOGIN_LIMITE = 5;
const LOGIN_JANELA_MS = 15 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Necessário fora da Vercel (ex: Render), onde o app roda atrás de um proxy.
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const senha = String(credentials?.senha ?? "");
        if (!email || !senha) return null;

        // Bloqueia o email após LOGIN_LIMITE falhas na janela (força bruta).
        const chave = `login:${email}`;
        if (isRateLimited(chave, LOGIN_LIMITE)) return null;

        const admin = await prisma.administrador.findUnique({ where: { email } });
        const senhaOk = await bcrypt.compare(senha, admin?.senhaHash ?? HASH_FICTICIO);
        if (!admin || !senhaOk) {
          checkRateLimit(chave, LOGIN_LIMITE, LOGIN_JANELA_MS); // registra a falha
          return null;
        }

        return { id: admin.id, name: admin.nome, email: admin.email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.adminId = user.id;
      return token;
    },
    session({ session, token }) {
      if (typeof token.adminId === "string") session.user.id = token.adminId;
      return session;
    },
  },
});
