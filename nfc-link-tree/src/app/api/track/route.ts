import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

export async function POST(request: NextRequest) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    getClientIp(request),
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas requisições" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { empresaId, tipo, linkId, origem } = body as Record<string, unknown>;

  if (typeof empresaId !== "string" || !empresaId || !tipo) {
    return NextResponse.json(
      { error: "empresaId e tipo são obrigatórios" },
      { status: 400 }
    );
  }

  if (tipo !== "view" && tipo !== "click") {
    return NextResponse.json(
      { error: "tipo deve ser 'view' ou 'click'" },
      { status: 400 }
    );
  }

  if (!isOptionalString(linkId) || !isOptionalString(origem)) {
    return NextResponse.json(
      { error: "linkId e origem devem ser texto" },
      { status: 400 }
    );
  }

  try {
    const empresa = await prisma.empresa.findFirst({
      where: { id: empresaId, ativo: true },
      select: { id: true },
    });

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    if (linkId) {
      const link = await prisma.link.findFirst({
        where: { id: linkId, empresaId },
        select: { id: true },
      });

      if (!link) {
        return NextResponse.json(
          { error: "Link não encontrado" },
          { status: 404 }
        );
      }
    }

    const evento = await prisma.evento.create({
      data: {
        empresaId,
        tipo,
        linkId: linkId || null,
        origem: origem ? origem.slice(0, 50) : null,
      },
    });

    return NextResponse.json({ success: true, id: evento.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar telemetria:", error);
    return NextResponse.json(
      { error: "Falha ao registrar evento" },
      { status: 500 }
    );
  }
}
