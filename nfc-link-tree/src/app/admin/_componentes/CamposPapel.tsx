"use client";

import { useState } from "react";
import { campo, rotulo } from "./estilos";

type EmpresaOpcao = { id: string; nome: string; slug: string };

// Papel do novo administrador. Com "Admin Quantum" o select de empresa nem é
// renderizado, então empresaId não é enviado; o servidor grava null de qualquer
// forma (ver lerPapel em _acoes/administradores.ts).
export default function CamposPapel({ empresas }: { empresas: EmpresaOpcao[] }) {
  const [role, setRole] = useState<"ADMIN" | "CLIENTE">("ADMIN");
  const cliente = role === "CLIENTE";

  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className={rotulo}>Papel</span>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value === "CLIENTE" ? "CLIENTE" : "ADMIN")}
          className={campo}
        >
          <option value="ADMIN" className="bg-[#0C111D]">
            Admin Quantum (acesso total)
          </option>
          <option value="CLIENTE" className="bg-[#0C111D]">
            Cliente (só a própria empresa)
          </option>
        </select>
      </label>

      {cliente && (
        <label className="flex flex-col gap-1.5">
          <span className={rotulo}>Empresa do cliente</span>
          <select name="empresaId" required defaultValue="" className={campo}>
            <option value="" disabled>
              {empresas.length ? "Escolha a empresa..." : "Nenhuma empresa ativa"}
            </option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id} className="bg-[#0C111D]">
                {empresa.nome} (/{empresa.slug})
              </option>
            ))}
          </select>
        </label>
      )}
    </>
  );
}
