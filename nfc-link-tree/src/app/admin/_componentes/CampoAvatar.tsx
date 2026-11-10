"use client";

import { useRef, useState, useTransition } from "react";
import { uploadAvatarEmpresa } from "@/app/admin/_acoes/empresas";
import { botaoSecundario, campo, rotulo } from "./estilos";

const TIPOS_ACEITOS = "image/png,image/jpeg,image/jpg";

// Campo de Avatar URL com upload opcional. Fica dentro do <form> da empresa,
// então o envio da imagem não pode ser um form aninhado: o botão monta o
// FormData à mão e chama a Server Action, preenchendo a URL com o retorno.
// O input de arquivo não tem "name" para não ser enviado junto ao salvar.
export default function CampoAvatar({ valorInicial }: { valorInicial?: string | null }) {
  const [url, setUrl] = useState(valorInicial ?? "");
  const [erro, setErro] = useState<string>();
  const [sucesso, setSucesso] = useState(false);
  const [enviando, startTransition] = useTransition();
  const arquivoRef = useRef<HTMLInputElement>(null);

  function enviar() {
    const input = arquivoRef.current;
    const arquivo = input?.files?.[0];
    setSucesso(false);
    if (!arquivo) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }

    const slug = input.form?.elements.namedItem("slug");
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("slug", slug instanceof HTMLInputElement ? slug.value : "");

    startTransition(async () => {
      try {
        const resultado = await uploadAvatarEmpresa(formData);
        if (resultado.url) {
          setUrl(resultado.url);
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
    <div className="flex flex-col gap-1.5 sm:col-span-2">
      <label className="flex flex-col gap-1.5">
        <span className={rotulo}>Avatar URL</span>
        <input
          name="avatarUrl"
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setSucesso(false);
          }}
          className={campo}
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={arquivoRef}
          type="file"
          accept={TIPOS_ACEITOS}
          aria-label="Arquivo de imagem do avatar"
          onChange={() => {
            setErro(undefined);
            setSucesso(false);
          }}
          className="flex-1 min-w-56 text-xs text-slate-400 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/[0.06] file:px-3 file:py-1.5 file:text-xs file:text-slate-100 file:cursor-pointer"
        />
        <button
          type="button"
          onClick={enviar}
          disabled={enviando}
          className={`${botaoSecundario} !py-1.5 text-xs`}
        >
          {enviando ? "Enviando..." : "Enviar imagem"}
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        PNG ou JPEG até 5MB. A imagem é redimensionada e convertida para WebP. Ou cole a URL de uma imagem já hospedada.
      </p>

      {erro && (
        <p role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}
      {sucesso && (
        <p role="status" className="text-xs text-emerald-300">
          Imagem enviada. Salve o formulário para aplicar o novo avatar.
        </p>
      )}
    </div>
  );
}
