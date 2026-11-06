"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { texto, type EstadoAcao } from "@/lib/validacao";

// Aceita só caminhos internos do painel, evitando open redirect via callbackUrl.
function destinoSeguro(callbackUrl: string): string {
  if (!callbackUrl.startsWith("/admin") || callbackUrl.startsWith("/admin/login")) return "/admin";
  if (callbackUrl.includes("//") || callbackUrl.includes("\\")) return "/admin";
  return callbackUrl;
}

export async function entrar(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  try {
    await signIn("credentials", {
      email: texto(formData, "email"),
      senha: String(formData.get("senha") ?? ""),
      redirectTo: destinoSeguro(texto(formData, "callbackUrl")),
    });
    return {};
  } catch (error) {
    // Mensagem única para email inexistente, senha errada ou excesso de tentativas.
    if (error instanceof AuthError) return { erro: "Email ou senha inválidos." };
    throw error; // inclui o redirect de sucesso do signIn
  }
}

export async function sair() {
  await signOut({ redirectTo: "/admin/login" });
}
