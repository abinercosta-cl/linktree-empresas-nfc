import { NextRequest } from "next/server";
import { getEmpresa } from "@/data/empresas";

type RouteParams = Promise<{ empresa: string }>;

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function extractPhoneNumber(empresa: Awaited<ReturnType<typeof getEmpresa>>): string | null {
  if (!empresa) return null;

  // 1. Procura nas redes sociais pelo WhatsApp
  const waSocial = empresa.redesSociais?.find(
    (r) => r.tipo.toLowerCase() === "whatsapp"
  );
  if (waSocial?.url) {
    const digits = waSocial.url.replace(/\D/g, "");
    if (digits.length >= 8) {
      return digits.startsWith("+") ? digits : `+${digits}`;
    }
  }

  // 2. Procura nos links customizados por WhatsApp ou tel
  for (const link of empresa.links) {
    const url = link.url.toLowerCase();
    if (url.includes("wa.me") || url.includes("whatsapp.com") || url.startsWith("tel:")) {
      const digits = link.url.replace(/\D/g, "");
      if (digits.length >= 8) {
        return digits.startsWith("+") ? digits : `+${digits}`;
      }
    }
  }

  return null;
}

function extractWebsite(
  empresa: Awaited<ReturnType<typeof getEmpresa>>,
  fallbackUrl: string
): string {
  if (!empresa) return fallbackUrl;

  // Procura por um link que seja site institucional
  const siteLink = empresa.links.find((l) => {
    const text = `${l.label} ${l.url}`.toLowerCase();
    const isSocialOrReview =
      text.includes("whatsapp") ||
      text.includes("wa.me") ||
      text.includes("google") ||
      text.includes("instagram") ||
      text.includes("tiktok") ||
      text.includes("facebook") ||
      text.includes("youtube");
    return !isSocialOrReview && (l.url.startsWith("http://") || l.url.startsWith("https://"));
  });

  return siteLink ? siteLink.url : fallbackUrl;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const { empresa: slug } = await params;
  const empresa = await getEmpresa(slug);

  if (!empresa) {
    return new Response("Empresa não encontrada", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const phone = extractPhoneNumber(empresa);
  const fallbackUrl = new URL(`/${slug}`, request.url).toString();
  const website = extractWebsite(empresa, fallbackUrl);

  // Montagem do vCard 3.0 em conformidade com RFC 2426
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//Quantum Ecosystem//NFC LinkTree//PT-BR",
    `FN:${escapeVCard(empresa.nome)}`,
    `N:;${escapeVCard(empresa.nome)};;;`,
    `ORG:${escapeVCard(empresa.nome)}`,
    "TITLE:Atendimento Oficial",
  ];

  if (empresa.bio) {
    lines.push(`NOTE:${escapeVCard(empresa.bio)}`);
  }

  if (phone) {
    lines.push(`TEL;TYPE=CELL,VOICE,PREF:${phone}`);
  }

  if (website) {
    lines.push(`URL:${website}`);
  }

  // Instagram se disponível
  const insta = empresa.redesSociais?.find(
    (r) => r.tipo.toLowerCase() === "instagram"
  );
  if (insta?.url) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${insta.url}`);
  }

  lines.push("END:VCARD");

  // Concatenação com retorno de linha CRLF (\r\n) exigido pelo padrão vCard
  const vcfContent = lines.join("\r\n") + "\r\n";

  return new Response(vcfContent, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.vcf"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
