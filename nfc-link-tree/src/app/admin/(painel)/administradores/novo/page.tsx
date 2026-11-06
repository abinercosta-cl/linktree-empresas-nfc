import Link from "next/link";
import { exigirAdmin } from "@/lib/admin-sessao";
import AcaoForm from "@/app/admin/_componentes/AcaoForm";
import { botaoPrimario, campo, card, rotulo } from "@/app/admin/_componentes/estilos";
import { criarAdministrador } from "@/app/admin/_acoes/administradores";

export default async function NovoAdministradorPage() {
  await exigirAdmin();

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <Link href="/admin/administradores" className="text-xs text-slate-400 hover:text-white">
          ← Voltar para administradores
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-1">Novo administrador</h1>
        <p className="text-sm text-slate-400">Passe a senha para a pessoa por um canal seguro.</p>
      </div>

      <AcaoForm action={criarAdministrador} className={`${card} p-6 flex flex-col gap-4`}>
        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Nome</span>
          <input name="nome" required maxLength={120} className={campo} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Email</span>
          <input name="email" type="email" required autoComplete="off" className={campo} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Senha (mínimo 8 caracteres)</span>
          <input name="senha" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={campo} />
        </label>
        <button type="submit" className={`${botaoPrimario} self-start`}>
          Criar administrador
        </button>
      </AcaoForm>
    </div>
  );
}
