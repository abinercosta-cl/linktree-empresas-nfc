"use client";

import { startTransition, useActionState, useEffect, useRef, type ReactNode } from "react";
import type { EstadoAcao } from "@/lib/validacao";

type Props = {
  action: (estado: EstadoAcao, formData: FormData) => Promise<EstadoAcao>;
  children: ReactNode;
  className?: string;
  // Limpa os campos após salvar com sucesso (formulários de "adicionar").
  limparAoSalvar?: boolean;
  // Pede confirmação antes de enviar (ações destrutivas).
  confirmar?: string;
  mensagemSucesso?: string;
};

// Formulário ligado a uma Server Action via useActionState.
// Envia por onSubmit (e não pela prop action) para que o React não resete os
// campos quando a validação falha: o usuário corrige sem redigitar tudo.
export default function AcaoForm({
  action,
  children,
  className,
  limparAoSalvar,
  confirmar,
  mensagemSucesso,
}: Props) {
  const [estado, formAction, pendente] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (limparAoSalvar && estado.ok) formRef.current?.reset();
  }, [estado, limparAoSalvar]);

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        if (confirmar && !window.confirm(confirmar)) return;
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <fieldset disabled={pendente} className="contents">
        {children}
      </fieldset>

      {estado.erro && (
        <p role="alert" className="basis-full w-full text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {estado.erro}
        </p>
      )}
      {estado.ok && mensagemSucesso && (
        <p role="status" className="basis-full w-full text-xs text-emerald-300">
          {mensagemSucesso}
        </p>
      )}
    </form>
  );
}
