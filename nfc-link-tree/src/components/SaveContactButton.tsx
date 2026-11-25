import { UserPlusIcon, DownloadIcon } from "./Icons";

// Ação principal da página e o único elemento na cor da marca. Mostra o que
// vai para a agenda (nome e telefone), os mesmos dados que o vCard gera.
export default function SaveContactButton({
  slug,
  nome,
  telefone,
}: {
  slug: string;
  nome: string;
  telefone: string | null;
}) {
  return (
    <a
      href={`/${slug}/contato.vcf`}
      download={`${slug}.vcf`}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 min-h-16
                 bg-[var(--destaque)] text-[var(--sobre-destaque)]
                 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]
                 transition-[transform,filter] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]
                 hover:brightness-[1.06] active:scale-[0.98]
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--destaque)]"
    >
      <UserPlusIcon className="size-5 shrink-0" />
      <span className="flex-1 min-w-0">
        <span className="block text-base leading-6 font-medium">Salvar contato</span>
        <span className="block truncate text-[13px] leading-5 tabular-nums">
          {telefone ? `${nome} · ${telefone}` : "Adicionar à agenda do celular"}
        </span>
      </span>
      <DownloadIcon className="size-[18px] shrink-0" />
    </a>
  );
}
