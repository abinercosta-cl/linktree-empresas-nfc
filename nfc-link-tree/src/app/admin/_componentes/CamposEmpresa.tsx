import { campo, rotulo } from "./estilos";

type Valores = {
  slug?: string;
  nome?: string;
  bio?: string | null;
  corPrimaria?: string;
  corFundo?: string;
};

// Campos compartilhados entre os formulários de criação e edição de empresa.
// slugSomenteLeitura: para CLIENTE, o slug aparece (é o endereço da página dele)
// mas não pode ser alterado. Campo disabled não é enviado; o servidor mantém o
// slug do banco de qualquer forma (ver atualizarEmpresa).
export default function CamposEmpresa({
  valores = {},
  slugSomenteLeitura = false,
}: {
  valores?: Valores;
  slugSomenteLeitura?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5">
        <span className={rotulo}>Nome</span>
        <input name="nome" required maxLength={120} defaultValue={valores.nome} className={campo} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={rotulo}>Slug (endereço público)</span>
        <input
          name="slug"
          required
          maxLength={60}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="Letras minúsculas, números e hífens (ex: minha-empresa)"
          placeholder="minha-empresa"
          defaultValue={valores.slug}
          disabled={slugSomenteLeitura}
          className={`${campo} font-mono disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {slugSomenteLeitura && (
          <span className="text-[11px] text-slate-500">
            Só a equipe da Quantum pode alterar o endereço, para não quebrar as tags NFC e os QR Codes.
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className={rotulo}>Bio</span>
        <textarea name="bio" rows={3} maxLength={500} defaultValue={valores.bio ?? ""} className={campo} />
      </label>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
        <span className={rotulo}>Cor primária</span>
        <input
          name="corPrimaria"
          type="color"
          defaultValue={(valores.corPrimaria ?? "#0EA5E9").toLowerCase()}
          className="h-8 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        />
      </label>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
        <span className={rotulo}>Cor de fundo</span>
        <input
          name="corFundo"
          type="color"
          defaultValue={(valores.corFundo ?? "#07090E").toLowerCase()}
          className="h-8 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        />
      </label>
    </div>
  );
}
