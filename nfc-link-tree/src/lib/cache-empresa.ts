import { revalidatePath, updateTag } from "next/cache";
import { tagEmpresa } from "@/data/empresas";

// Chamar ao final de toda Server Action que altera uma empresa, seus links ou
// suas redes sociais. Passe também o slug antigo quando o slug mudar.
//
// updateTag (e não revalidateTag) porque no Next 16 revalidateTag com um único
// argumento está obsoleto, e revalidateTag(tag, "max") ainda serviria a versão
// antiga uma vez. updateTag expira o cache na hora: a próxima visita já vê a edição.
export function invalidarCacheEmpresa(...slugs: string[]) {
  for (const slug of new Set(slugs)) {
    updateTag(tagEmpresa(slug));
  }
  // Hub da Home, que ainda usa ISR de página (revalidate = 3600).
  revalidatePath("/");
}
