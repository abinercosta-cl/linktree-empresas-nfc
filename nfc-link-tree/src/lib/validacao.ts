// Validações compartilhadas pelas Server Actions do painel administrativo.
import { unstable_rethrow } from "next/navigation";

export type EstadoAcao = { erro?: string; ok?: boolean; versao?: number };

export class ErroValidacao extends Error {}

export const TIPOS_REDE_SOCIAL = [
  "whatsapp",
  "instagram",
  "tiktok",
  "youtube",
  "facebook",
  "google",
] as const;

// Slugs que colidiriam com rotas do próprio app.
const SLUGS_RESERVADOS = new Set(["admin", "api", "_next", "favicon.ico"]);
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function texto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

export function obrigatorio(valor: string, nomeCampo: string, max = 200): string {
  if (!valor) throw new ErroValidacao(`${nomeCampo} é obrigatório.`);
  if (valor.length > max) throw new ErroValidacao(`${nomeCampo} pode ter no máximo ${max} caracteres.`);
  return valor;
}

export function validarSlug(slug: string): string {
  if (!SLUG_REGEX.test(slug) || slug.length < 2 || slug.length > 60) {
    throw new ErroValidacao(
      "Slug inválido: use de 2 a 60 caracteres em kebab-case (letras minúsculas, números e hífens, ex: minha-empresa)."
    );
  }
  if (SLUGS_RESERVADOS.has(slug)) throw new ErroValidacao(`O slug "${slug}" é reservado.`);
  return slug;
}

export function validarCor(cor: string, nomeCampo: string): string {
  if (!COR_REGEX.test(cor)) throw new ErroValidacao(`${nomeCampo} deve estar no formato #RRGGBB.`);
  return cor.toUpperCase();
}

// Bloqueia esquemas perigosos (ex: javascript:) que virariam XSS ao serem
// renderizados como href na página pública.
export function validarUrl(
  url: string,
  nomeCampo: string,
  esquemas: string[] = ["http:", "https:"]
): string {
  obrigatorio(url, nomeCampo, 2000);
  let protocolo: string;
  try {
    protocolo = new URL(url).protocol;
  } catch {
    throw new ErroValidacao(`${nomeCampo} não é uma URL válida (inclua https://).`);
  }
  if (!esquemas.includes(protocolo)) {
    throw new ErroValidacao(`${nomeCampo} deve começar com ${esquemas.join(", ")}`);
  }
  return url;
}

export function validarEmail(email: string): string {
  const normalizado = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizado) || normalizado.length > 254) {
    throw new ErroValidacao("Email inválido.");
  }
  return normalizado;
}

export function validarSenha(senha: string): string {
  if (senha.length < 8) throw new ErroValidacao("A senha deve ter pelo menos 8 caracteres.");
  if (senha.length > 72) throw new ErroValidacao("A senha pode ter no máximo 72 caracteres.");
  return senha;
}

// Executa a ação e converte erros de validação em mensagem para o formulário.
// Erros inesperados (ex: banco fora do ar) também viram mensagem genérica, sem
// vazar detalhes. Redirects do Next (lançados como exceção) são repassados.
export async function executarAcao(fn: () => Promise<void>): Promise<EstadoAcao> {
  try {
    await fn();
    return { ok: true, versao: Date.now() };
  } catch (error) {
    unstable_rethrow(error); // repassa redirect()/notFound() do Next
    if (error instanceof ErroValidacao) return { erro: error.message };
    console.error("Erro em Server Action do painel", error);
    return { erro: "Não foi possível salvar agora. Tente novamente em instantes." };
  }
}

