import { redirect } from "next/navigation";
import { getAdminAtual } from "@/lib/admin-sessao";
import { NfcIcon } from "@/components/Icons";
import AcaoForm from "@/app/admin/_componentes/AcaoForm";
import { botaoPrimario, campo, rotulo } from "@/app/admin/_componentes/estilos";
import { entrar } from "@/app/admin/_acoes/sessao";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  if (await getAdminAtual()) redirect("/admin");

  const { callbackUrl } = await searchParams;

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-12 bg-[#07090E] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-sky-500/20 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-3xl p-[1px] bg-gradient-to-br from-sky-500/40 via-white/10 to-sky-500/20">
        <div className="rounded-[calc(1.5rem-1px)] bg-[#0C111D]/90 border border-white/10 backdrop-blur-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-sky-500/10 text-sky-400">
              <NfcIcon className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase bg-white/[0.04] border border-white/10 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Painel administrativo
            </div>
            <h1 className="text-xl font-bold tracking-tight">Entrar</h1>
          </div>

          <AcaoForm action={entrar} className="flex flex-col gap-4">
            <input type="hidden" name="callbackUrl" value={typeof callbackUrl === "string" ? callbackUrl : ""} />
            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>Email</span>
              <input name="email" type="email" required autoComplete="username" className={campo} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={rotulo}>Senha</span>
              <input name="senha" type="password" required autoComplete="current-password" className={campo} />
            </label>
            <button type="submit" className={`${botaoPrimario} w-full mt-1`}>
              Entrar
            </button>
          </AcaoForm>
        </div>
      </div>
    </main>
  );
}
