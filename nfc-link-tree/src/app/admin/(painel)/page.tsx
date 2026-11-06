import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin-sessao";
import { botaoPrimario, botaoSecundario, card, selo } from "@/app/admin/_componentes/estilos";

export default async function AdminDashboard() {
  await exigirAdmin();

  const empresas = await prisma.empresa.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true,
      nome: true,
      slug: true,
      ativo: true,
      corPrimaria: true,
      _count: { select: { links: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Empresas</h1>
          <p className="text-sm text-slate-400">{empresas.length} cadastrada(s), ativas e inativas.</p>
        </div>
        <Link href="/admin/empresas/novo" className={botaoPrimario}>
          + Nova empresa
        </Link>
      </div>

      {empresas.length === 0 ? (
        <div className={`${card} p-8 text-center text-sm text-slate-400`}>Nenhuma empresa cadastrada ainda.</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {empresas.map((empresa) => (
            <li key={empresa.id} className={`${card} p-4 flex flex-wrap items-center justify-between gap-3`}>
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-10 h-10 shrink-0 rounded-xl border border-white/10 flex items-center justify-center font-bold"
                  style={{ color: empresa.corPrimaria, backgroundColor: `${empresa.corPrimaria}1A` }}
                >
                  {empresa.nome.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{empresa.nome}</p>
                  <p className="text-xs font-mono text-slate-400 truncate">/{empresa.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">{empresa._count.links} link(s)</span>
                {empresa.ativo ? (
                  <span className={`${selo} border-emerald-500/30 bg-emerald-500/10 text-emerald-300`}>Ativa</span>
                ) : (
                  <span className={`${selo} border-white/10 bg-white/[0.04] text-slate-400`}>Inativa</span>
                )}
                <Link href={`/admin/empresas/${empresa.id}/editar`} className={`${botaoSecundario} !py-1.5 text-xs`}>
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
