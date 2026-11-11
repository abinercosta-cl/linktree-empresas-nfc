import Link from "next/link";
import { exigirAdmin } from "@/lib/admin-sessao";
import AcaoForm from "@/app/admin/_componentes/AcaoForm";
import CamposEmpresa from "@/app/admin/_componentes/CamposEmpresa";
import { botaoPrimario, card } from "@/app/admin/_componentes/estilos";
import { criarEmpresa } from "@/app/admin/_acoes/empresas";

export default async function NovaEmpresaPage() {
  await exigirAdmin();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link href="/admin" className="text-xs text-slate-400 hover:text-white">
          ← Voltar para empresas
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-1">Nova empresa</h1>
        {/* Sem upload de avatar aqui: o upload grava o avatarUrl direto na empresa, que
            ainda não existe. Não havia no código um padrão de upload antes da criação,
            então criarEmpresa cria sem avatar e redireciona para a edição, onde o
            avatar é enviado. */}
        <p className="text-sm text-slate-400">
          Depois de criar, você poderá enviar o avatar e adicionar links e redes sociais.
        </p>
      </div>

      <AcaoForm action={criarEmpresa} className={`${card} p-6 flex flex-col gap-5`}>
        <CamposEmpresa />
        <button type="submit" className={`${botaoPrimario} self-start`}>
          Criar empresa
        </button>
      </AcaoForm>
    </div>
  );
}
