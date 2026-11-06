import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin-sessao";
import AcaoForm from "@/app/admin/_componentes/AcaoForm";
import { botaoPerigo, botaoPrimario, card, selo } from "@/app/admin/_componentes/estilos";
import { removerAdministrador } from "@/app/admin/_acoes/administradores";

const formatarData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function AdministradoresPage() {
  const adminAtual = await exigirAdmin();

  const administradores = await prisma.administrador.findMany({
    orderBy: { criadoEm: "asc" },
    select: { id: true, nome: true, email: true, criadoEm: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
          <p className="text-sm text-slate-400">{administradores.length} com acesso ao painel.</p>
        </div>
        <Link href="/admin/administradores/novo" className={botaoPrimario}>
          + Novo administrador
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {administradores.map((admin) => {
          const ehVoce = admin.id === adminAtual.id;
          return (
            <li key={admin.id} className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
              <div className="min-w-0">
                <p className="font-semibold truncate flex items-center gap-2">
                  {admin.nome}
                  {ehVoce && <span className={`${selo} border-sky-500/30 bg-sky-500/10 text-sky-300`}>Você</span>}
                </p>
                <p className="text-xs font-mono text-slate-400 truncate">{admin.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">desde {formatarData.format(admin.criadoEm)}</span>
                {!ehVoce && (
                  <AcaoForm
                    action={removerAdministrador}
                    confirmar={`Remover o acesso de ${admin.nome} (${admin.email})?`}
                    className="flex flex-col items-end gap-1"
                  >
                    <input type="hidden" name="id" value={admin.id} />
                    <button type="submit" className={`${botaoPerigo} !py-1.5 text-xs`}>
                      Remover
                    </button>
                  </AcaoForm>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
