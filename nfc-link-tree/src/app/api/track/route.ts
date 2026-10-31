import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    let body: {
      empresaId?: string;
      tipo?: string;
      linkId?: string;
      origem?: string;
    };

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    }

    const { empresaId, tipo, linkId, origem } = body;

    if (!empresaId || !tipo) {
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

    const evento = await prisma.evento.create({
      data: {
        empresaId,
        tipo,
        linkId: linkId || null,
        origem: origem ? String(origem).slice(0, 50) : null,
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
