// Extrai só os dígitos do número de telefone de uma URL de WhatsApp ou tel:.
// Não aplica o replace na URL inteira: em `wa.me/5511...?text=Ola%20` os dígitos
// da query string (ex: o "20" de %20) seriam colados ao número.
//   https://wa.me/5511999999999?text=Oi           -> pathname
//   https://api.whatsapp.com/send?phone=5511...   -> parâmetro phone
//   tel:+5511999999999                            -> pathname
//   wa.me/5511999999999?text=Oi (sem protocolo)   -> trecho antes de ? ou #
export function extrairDigitosTelefone(valor: string): string {
  let parte: string;
  try {
    const url = new URL(valor);
    parte = url.searchParams.get("phone") ?? url.pathname;
  } catch {
    parte = valor.split(/[?#]/)[0];
  }
  return parte.replace(/\D/g, "");
}

type FonteTelefone = {
  links: { url: string }[];
  redesSociais?: { tipo: string; url: string }[];
};

// Telefone da empresa no formato E.164 (+5593...), ou null. Procura primeiro a
// rede social "whatsapp" e depois links wa.me, whatsapp.com ou tel:. É a mesma
// regra usada no vCard e na prévia do "Salvar contato" da página pública.
export function telefoneDaEmpresa(empresa: FonteTelefone): string | null {
  const whatsapp = empresa.redesSociais?.find((r) => r.tipo.toLowerCase() === "whatsapp");
  if (whatsapp?.url) {
    const digitos = extrairDigitosTelefone(whatsapp.url);
    if (digitos.length >= 8) return `+${digitos}`;
  }

  for (const link of empresa.links) {
    const url = link.url.toLowerCase();
    if (url.includes("wa.me") || url.includes("whatsapp.com") || url.startsWith("tel:")) {
      const digitos = extrairDigitosTelefone(link.url);
      if (digitos.length >= 8) return `+${digitos}`;
    }
  }

  return null;
}

// Formata para leitura: celulares e fixos do Brasil viram "+55 93 99135-9644";
// outros números ficam como vieram (+ e dígitos).
export function formatarTelefone(e164: string): string {
  const m = /^\+55(\d{2})(\d{4,5})(\d{4})$/.exec(e164);
  return m ? `+55 ${m[1]} ${m[2]}-${m[3]}` : e164;
}
