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
