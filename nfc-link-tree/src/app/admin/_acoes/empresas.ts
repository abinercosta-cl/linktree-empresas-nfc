"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin-sessao";
import { invalidarCacheEmpresa } from "@/lib/cache-empresa";
import {
  ErroValidacao,
  TIPOS_REDE_SOCIAL,
  executarAcao,
  obrigatorio,
  texto,
  validarCor,
  validarSlug,
  validarUrl,
  type EstadoAcao,
} from "@/lib/validacao";

// Toda ação começa com exigirAdmin(): Server Actions são endpoints POST
// públicos, então a proteção do proxy.ts não basta sozinha.

const ESQUEMAS_LINK = ["http:", "https:", "mailto:", "tel:"];

// avatarUrl não é lido aqui de propósito: o avatar só é definido por upload
// (uploadAvatarEmpresa), e o Prisma não altera campos omitidos no update.
function lerDadosEmpresa(formData: FormData) {
  const bio = texto(formData, "bio");
  return {
    slug: validarSlug(texto(formData, "slug").toLowerCase()),
    nome: obrigatorio(texto(formData, "nome"), "Nome", 120),
    bio: bio ? obrigatorio(bio, "Bio", 500) : null,
    corPrimaria: validarCor(texto(formData, "corPrimaria"), "Cor primária"),
    corFundo: validarCor(texto(formData, "corFundo"), "Cor de fundo"),
  };
}

async function garantirSlugLivre(slug: string, ignorarId?: string) {
  const existente = await prisma.empresa.findUnique({ where: { slug }, select: { id: true } });
  if (existente && existente.id !== ignorarId) {
    throw new ErroValidacao(`O slug "${slug}" já está em uso por outra empresa.`);
  }
}

function tratarSlugDuplicado(error: unknown): never {
  // Corrida entre a checagem e a gravação: a constraint unique do banco decide.
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new ErroValidacao("Esse slug já está em uso por outra empresa.");
  }
  throw error;
}

async function slugDaEmpresa(empresaId: string): Promise<string> {
  const empresa = await prisma.empresa.findUnique({ where: { id: empresaId }, select: { slug: true } });
  if (!empresa) throw new ErroValidacao("Empresa não encontrada.");
  return empresa.slug;
}

function lerOrdem(formData: FormData): number | null {
  const valor = texto(formData, "ordem");
  if (!valor) return null;
  const ordem = Number(valor);
  if (!Number.isInteger(ordem) || ordem < 0 || ordem > 9999) {
    throw new ErroValidacao("Ordem deve ser um número inteiro entre 0 e 9999.");
  }
  return ordem;
}

function lerTipoRede(formData: FormData): string {
  const tipo = texto(formData, "tipo");
  if (!(TIPOS_REDE_SOCIAL as readonly string[]).includes(tipo)) {
    throw new ErroValidacao("Tipo de rede social inválido.");
  }
  return tipo;
}

// ---------- Empresa ----------

export async function criarEmpresa(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  let novoId: string | undefined;

  const estado = await executarAcao(async () => {
    const dados = lerDadosEmpresa(formData);
    await garantirSlugLivre(dados.slug);
    const empresa = await prisma.empresa.create({ data: dados }).catch(tratarSlugDuplicado);
    novoId = empresa.id;
    invalidarCacheEmpresa(dados.slug);
  });

  if (novoId) redirect(`/admin/empresas/${novoId}/editar`);
  return estado;
}

export async function atualizarEmpresa(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const slugAntigo = await slugDaEmpresa(id);
    const dados = lerDadosEmpresa(formData);
    await garantirSlugLivre(dados.slug, id);
    await prisma.empresa.update({ where: { id }, data: dados }).catch(tratarSlugDuplicado);
    // Slug alterado: invalida o antigo (passa a 404) e o novo (pode ter um 404 em cache).
    invalidarCacheEmpresa(slugAntigo, dados.slug);
  });
}

export async function alternarAtivoEmpresa(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const empresa = await prisma.empresa.findUnique({ where: { id }, select: { slug: true, ativo: true } });
    if (!empresa) throw new ErroValidacao("Empresa não encontrada.");
    await prisma.empresa.update({ where: { id }, data: { ativo: !empresa.ativo } });
    invalidarCacheEmpresa(empresa.slug);
  });
}

// ---------- Avatar ----------

const TIPOS_AVATAR = ["image/png", "image/jpeg", "image/jpg"];
const TAMANHO_MAX_AVATAR = 5 * 1024 * 1024; // 5MB
const LARGURA_MAX_AVATAR = 512;

export type ResultadoUpload = { url?: string; erro?: string };

// Envia a imagem e já grava o avatarUrl na empresa, sem depender do "Salvar dados".
// Exige uma empresa existente: no cadastro, o avatar é enviado na página de edição,
// para onde criarEmpresa redireciona logo após criar.
export async function uploadAvatarEmpresa(formData: FormData): Promise<ResultadoUpload> {
  await exigirAdmin();
  let url: string | undefined;

  const estado = await executarAcao(async () => {
    const arquivo = formData.get("arquivo");
    if (!(arquivo instanceof File) || arquivo.size === 0) {
      throw new ErroValidacao("Selecione um arquivo de imagem.");
    }
    if (!TIPOS_AVATAR.includes(arquivo.type)) {
      throw new ErroValidacao("Formato não suportado: envie uma imagem PNG, JPEG ou JPG.");
    }
    if (arquivo.size > TAMANHO_MAX_AVATAR) {
      throw new ErroValidacao("A imagem deve ter no máximo 5MB.");
    }

    const empresaId = texto(formData, "empresaId");
    const slug = await slugDaEmpresa(empresaId);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN não configurado: upload de avatar indisponível.");
      throw new ErroValidacao("Upload de imagens não está configurado no servidor.");
    }

    const entrada = Buffer.from(await arquivo.arrayBuffer());
    // O mimetype vem do navegador e pode mentir: confere o formato real do conteúdo.
    const formatoReal = await sharp(entrada)
      .metadata()
      .then((m) => m.format)
      .catch(() => undefined);
    if (formatoReal !== "png" && formatoReal !== "jpeg") {
      throw new ErroValidacao("O arquivo não é uma imagem PNG ou JPEG válida.");
    }

    const otimizada = await sharp(entrada)
      .rotate() // aplica a orientação EXIF (fotos de celular) antes de descartar os metadados
      .resize({ width: LARGURA_MAX_AVATAR, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const blob = await put(`avatars/${slug}-${Date.now()}.webp`, otimizada, {
      access: "public",
      contentType: "image/webp",
    });

    await prisma.empresa.update({ where: { id: empresaId }, data: { avatarUrl: blob.url } });
    invalidarCacheEmpresa(slug);
    url = blob.url;
  });

  return url ? { url } : { erro: estado.erro };
}

// ---------- Links ----------

export async function adicionarLink(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const empresaId = texto(formData, "empresaId");
    const slug = await slugDaEmpresa(empresaId);
    const label = obrigatorio(texto(formData, "label"), "Texto do link", 120);
    const url = validarUrl(texto(formData, "url"), "URL do link", ESQUEMAS_LINK);

    let ordem = lerOrdem(formData);
    if (ordem === null) {
      const ultimo = await prisma.link.aggregate({ where: { empresaId }, _max: { ordem: true } });
      ordem = (ultimo._max.ordem ?? -1) + 1;
    }

    await prisma.link.create({ data: { empresaId, label, url, ordem } });
    invalidarCacheEmpresa(slug);
  });
}

export async function atualizarLink(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const link = await prisma.link.findUnique({ where: { id }, select: { empresa: { select: { slug: true } } } });
    if (!link) throw new ErroValidacao("Link não encontrado.");

    await prisma.link.update({
      where: { id },
      data: {
        label: obrigatorio(texto(formData, "label"), "Texto do link", 120),
        url: validarUrl(texto(formData, "url"), "URL do link", ESQUEMAS_LINK),
        ordem: lerOrdem(formData) ?? 0,
      },
    });
    invalidarCacheEmpresa(link.empresa.slug);
  });
}

export async function removerLink(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const link = await prisma.link.findUnique({ where: { id }, select: { empresa: { select: { slug: true } } } });
    if (!link) throw new ErroValidacao("Link não encontrado.");
    // Eventos de clique do link são mantidos (linkId vira null pelo onDelete: SetNull).
    await prisma.link.delete({ where: { id } });
    invalidarCacheEmpresa(link.empresa.slug);
  });
}

// ---------- Redes sociais ----------

export async function adicionarRedeSocial(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const empresaId = texto(formData, "empresaId");
    const slug = await slugDaEmpresa(empresaId);
    await prisma.redeSocial.create({
      data: {
        empresaId,
        tipo: lerTipoRede(formData),
        url: validarUrl(texto(formData, "url"), "URL da rede social"),
      },
    });
    invalidarCacheEmpresa(slug);
  });
}

export async function atualizarRedeSocial(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const rede = await prisma.redeSocial.findUnique({ where: { id }, select: { empresa: { select: { slug: true } } } });
    if (!rede) throw new ErroValidacao("Rede social não encontrada.");
    await prisma.redeSocial.update({
      where: { id },
      data: {
        tipo: lerTipoRede(formData),
        url: validarUrl(texto(formData, "url"), "URL da rede social"),
      },
    });
    invalidarCacheEmpresa(rede.empresa.slug);
  });
}

export async function removerRedeSocial(_: EstadoAcao, formData: FormData): Promise<EstadoAcao> {
  await exigirAdmin();
  return executarAcao(async () => {
    const id = texto(formData, "id");
    const rede = await prisma.redeSocial.findUnique({ where: { id }, select: { empresa: { select: { slug: true } } } });
    if (!rede) throw new ErroValidacao("Rede social não encontrada.");
    await prisma.redeSocial.delete({ where: { id } });
    invalidarCacheEmpresa(rede.empresa.slug);
  });
}
