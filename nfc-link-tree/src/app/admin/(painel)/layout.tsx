import Link from "next/link";
import { exigirAdmin } from "@/lib/admin-sessao";
import { NfcIcon } from "@/components/Icons";
import { botaoSecundario } from "@/app/admin/_componentes/estilos";
import { sair } from "@/app/admin/_acoes/sessao";

// Layout protegido do painel. O proxy.ts já barra quem não tem sessão; aqui
// também conferimos no banco que o administrador ainda existe.
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await exigirAdmin();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#07090E] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[260px] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#07090E]/70 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 bg-sky-500/10 text-sky-400">
                <NfcIcon className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Painel</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/admin" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition">
                Empresas
              </Link>
              <Link href="/admin/administradores" className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition">
                Administradores
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 truncate max-w-[40vw]">
              Olá, <span className="text-slate-100 font-medium">{admin.nome}</span>
            </span>
            <form action={sair}>
              <button type="submit" className={`${botaoSecundario} !py-1.5 !px-3 text-xs`}>
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
