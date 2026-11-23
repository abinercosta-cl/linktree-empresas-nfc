import { del } from "@vercel/blob";

// Só apagamos avatares que estão no Vercel Blob: os legados em /avatars/ fazem
// parte do deploy e URLs de outros hosts não são nossas.
export function ehUrlDoBlob(url: string | null): url is string {
  if (!url) return false;
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

// Remove o avatar substituído. Roda depois de gravar o novo: se falhar, a empresa
// já está com o avatar certo e sobra só um arquivo órfão, então registra e segue.
export async function apagarAvatarAntigo(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.warn(`Avatar antigo não foi removido do Blob: ${url}`, error);
  }
}
