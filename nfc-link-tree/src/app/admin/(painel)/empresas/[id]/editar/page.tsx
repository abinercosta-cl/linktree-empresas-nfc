import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin-sessao";
import { TIPOS_REDE_SOCIAL } from "@/lib/validacao";
import AcaoForm from "@/app/admin/_componentes/AcaoForm";
import CamposEmpresa from "@/app/admin/_componentes/CamposEmpresa";
import {
  botaoPerigo,
  botaoPrimario,
  botaoSecundario,
  campo,
  card,
  rotulo,
  selo,
} from "@/app/admin/_componentes/estilos";
import {
  adicionarLink,
  adicionarRedeSocial,
  alternarAtivoEmpresa,
  atualizarEmpresa,
  atualizarLink,
  atualizarRedeSocial,
  removerLink,
  removerRedeSocial,
} from "@/app/admin/_acoes/empresas";

const NOMES_REDE: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  google: "Google (avaliações)",
};

function SeletorRede({ valor }: { valor?: string }) {
  return (
    <select name="tipo" required defaultValue={valor ?? ""} className={`${campo} sm:w-44`}>
      <option value="" disabled>
        Tipo...
      </option>
      {TIPOS_REDE_SOCIAL.map((tipo) => (
        <option key={tipo} value={tipo} className="bg-[#0C111D]">
          {NOMES_REDE[tipo] ?? tipo}
        </option>
      ))}
    </select>
  );
}

export default async function EditarEmpresaPage({ params }: { params: Promise<{ id: string }> }) {
  await exigirAdmin();
  const { id } = await params;

  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      links: { orderBy: [{ ordem: "asc" }, { id: "asc" }] },
      redesSociais: { orderBy: { id: "asc" } },
    },
  });
  if (!empresa) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin" className="text-xs text-slate-400 hover:text-white">
            ← Voltar para empresas
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1 truncate">{empresa.nome}</h1>
          <div className="flex items-center gap-2 mt-1">
            {empresa.ativo ? (
              <span className={`${selo} border-emerald-500/30 bg-emerald-500/10 text-emerald-300`}>Ativa</span>
            ) : (
              <span className={`${selo} border-white/10 bg-white/[0.04] text-slate-400`}>Inativa</span>
            )}
            {empresa.ativo && (
              <a
                href={`/${empresa.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-sky-400 hover:text-sky-300"
              >
                /{empresa.slug} ↗
              </a>
            )}
          </div>
        </div>

        <AcaoForm
          action={alternarAtivoEmpresa}
          confirmar={
            empresa.ativo
              ? "Desativar esta empresa? A página pública dela passa a responder 404."
              : "Ativar esta empresa? A página pública volta a ficar disponível."
          }
          className="flex flex-col items-end gap-2"
        >
          <input type="hidden" name="id" value={empresa.id} />
          <button type="submit" className={empresa.ativo ? botaoPerigo : botaoPrimario}>
            {empresa.ativo ? "Desativar empresa" : "Ativar empresa"}
          </button>
        </AcaoForm>
      </div>

      {/* Dados da empresa */}
      <section className={`${card} p-6 flex flex-col gap-4`}>
        <h2 className="text-lg font-semibold tracking-tight">Dados da empresa</h2>
        <AcaoForm action={atualizarEmpresa} mensagemSucesso="Dados salvos." className="flex flex-col gap-5">
          <input type="hidden" name="id" value={empresa.id} />
          <CamposEmpresa valores={empresa} />
          <button type="submit" className={`${botaoPrimario} self-start`}>
            Salvar dados
          </button>
        </AcaoForm>
      </section>

      {/* Links */}
      <section className={`${card} p-6 flex flex-col gap-4`}>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Links</h2>
          <p className="text-xs text-slate-400">Exibidos em ordem crescente do campo “ordem”.</p>
        </div>

        {empresa.links.length === 0 && <p className="text-sm text-slate-400">Nenhum link cadastrado.</p>}

        <ul className="flex flex-col gap-3">
          {empresa.links.map((link) => (
            <li key={link.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <AcaoForm action={atualizarLink} mensagemSucesso="Link salvo." className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={link.id} />
                <input name="ordem" type="number" min={0} max={9999} defaultValue={link.ordem} aria-label="Ordem" className={`${campo} !w-20`} />
                <input name="label" required maxLength={120} defaultValue={link.label} aria-label="Texto do link" className={`${campo} flex-1 min-w-40`} />
                <input name="url" required defaultValue={link.url} aria-label="URL do link" className={`${campo} flex-[2] min-w-56 font-mono text-xs`} />
                <button type="submit" className={`${botaoSecundario} !py-1.5 text-xs`}>
                  Salvar
                </button>
              </AcaoForm>
              <AcaoForm action={removerLink} confirmar={`Remover o link "${link.label}"?`} className="flex flex-col items-end">
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" className="text-xs text-red-300/80 hover:text-red-300 cursor-pointer">
                  Remover link
                </button>
              </AcaoForm>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
          <span className={rotulo}>Adicionar link</span>
          <AcaoForm action={adicionarLink} limparAoSalvar className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="empresaId" value={empresa.id} />
            <input name="ordem" type="number" min={0} max={9999} placeholder="auto" aria-label="Ordem" className={`${campo} !w-20`} />
            <input name="label" required maxLength={120} placeholder="Texto do botão" aria-label="Texto do link" className={`${campo} flex-1 min-w-40`} />
            <input name="url" required placeholder="https://..." aria-label="URL do link" className={`${campo} flex-[2] min-w-56 font-mono text-xs`} />
            <button type="submit" className={`${botaoPrimario} !py-1.5 text-xs`}>
              Adicionar
            </button>
          </AcaoForm>
        </div>
      </section>

      {/* Redes sociais */}
      <section className={`${card} p-6 flex flex-col gap-4`}>
        <h2 className="text-lg font-semibold tracking-tight">Redes sociais</h2>

        {empresa.redesSociais.length === 0 && <p className="text-sm text-slate-400">Nenhuma rede social cadastrada.</p>}

        <ul className="flex flex-col gap-3">
          {empresa.redesSociais.map((rede) => (
            <li key={rede.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <AcaoForm action={atualizarRedeSocial} mensagemSucesso="Rede social salva." className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={rede.id} />
                <SeletorRede valor={rede.tipo} />
                <input name="url" type="url" required defaultValue={rede.url} aria-label="URL da rede social" className={`${campo} flex-1 min-w-56 font-mono text-xs`} />
                <button type="submit" className={`${botaoSecundario} !py-1.5 text-xs`}>
                  Salvar
                </button>
              </AcaoForm>
              <AcaoForm action={removerRedeSocial} confirmar={`Remover a rede social ${NOMES_REDE[rede.tipo] ?? rede.tipo}?`} className="flex flex-col items-end">
                <input type="hidden" name="id" value={rede.id} />
                <button type="submit" className="text-xs text-red-300/80 hover:text-red-300 cursor-pointer">
                  Remover rede social
                </button>
              </AcaoForm>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
          <span className={rotulo}>Adicionar rede social</span>
          <AcaoForm action={adicionarRedeSocial} limparAoSalvar className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="empresaId" value={empresa.id} />
            <SeletorRede />
            <input name="url" type="url" required placeholder="https://..." aria-label="URL da rede social" className={`${campo} flex-1 min-w-56 font-mono text-xs`} />
            <button type="submit" className={`${botaoPrimario} !py-1.5 text-xs`}>
              Adicionar
            </button>
          </AcaoForm>
        </div>
      </section>
    </div>
  );
}
