"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadAvatarEmpresa } from "@/app/admin/_acoes/empresas";
import { botaoSecundario } from "./estilos";

const TIPOS_ACEITOS = "image/png,image/jpeg,image/jpg";

type Props = {
  empresaId: string;
  nome: string;
  avatarAtual?: string | null;
};

// Upload do avatar de uma empresa já existente. A Server Action grava o
// avatarUrl no banco no mesmo momento, então não há campo para "Salvar dados".
export default function CampoAvatar({ empresaId, nome, avatarAtual }: Props) {
  const [avatar, setAvatar] = useState(avatarAtual ?? "");
  const [erro, setErro] = useState<string>();
  const [sucesso, setSucesso] = useState(false);
  const [enviando, startTransition] = useTransition();
  const arquivoRef = useRef<HTMLInputElement>(null);

  function enviar() {
    const input = arquivoRef.current;
    const arquivo = input?.files?.[0];
    setSucesso(false);
    if (!input || !arquivo) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("empresaId", empresaId);

    startTransition(async () => {
      try {
        const resultado = await uploadAvatarEmpresa(formData);
        if (resultado.url) {
          setAvatar(resultado.url);
          setErro(undefined);
          setSucesso(true);
          input.value = "";
        } else {
          setErro(resultado.erro ?? "Não foi possível enviar a imagem.");
        }
      } catch {
        // Ex: arquivo acima do limite de corpo das Server Actions.
        setErro("Não foi possível enviar a imagem. Verifique o tamanho (máx. 5MB) e tente novamente.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden border border-white/15 bg-white/[0.04] flex items-center justify-center">
          {avatar ? (
            // unoptimized: avatares antigos podem ter sido cadastrados por URL de
            // qualquer domínio, fora do remotePatterns; no painel isso não pesa.
            <Image src={avatar} alt={`Avatar de ${nome}`} width={80} height={80} unoptimized className="object-cover w-full h-full" />
          ) : (
            <span className="text-[11px] font-mono uppercase text-slate-500">Sem avatar</span>
          )}
        </div>
        <p className="text-[11px] text-slate-500">
          PNG ou JPEG até 5MB. A imagem é redimensionada, convertida para WebP e aplicada na hora.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={arquivoRef}
          type="file"
          accept={TIPOS_ACEITOS}
          aria-label="Arquivo de imagem do avatar"
          disabled={enviando}
          onChange={() => {
            setErro(undefined);
            setSucesso(false);
          }}
          className="flex-1 min-w-56 text-xs text-slate-400 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/[0.06] file:px-3 file:py-1.5 file:text-xs file:text-slate-100 file:cursor-pointer"
        />
        <button type="button" onClick={enviar} disabled={enviando} className={`${botaoSecundario} !py-1.5 text-xs`}>
          {enviando ? "Enviando..." : "Enviar imagem"}
        </button>
      </div>

      {erro && (
        <p role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="text-xs text-emerald-300">
          Avatar atualizado.
        </p>
      )}
    </div>
  );
}
