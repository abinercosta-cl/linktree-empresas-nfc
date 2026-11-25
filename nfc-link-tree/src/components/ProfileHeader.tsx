import Image from "next/image";
import { Empresa } from "@/types/empresa";

// Cabeçalho da página da empresa: avatar, nome e bio. As cores vêm das
// variáveis da paleta (src/lib/paleta.ts), definidas em PaginaEmpresa.
export default function ProfileHeader({ empresa }: { empresa: Empresa }) {
  const inicial = empresa.nome.trim().charAt(0).toUpperCase();

  return (
    <header className="flex flex-col items-center text-center">
      <div className="size-22 rounded-full overflow-hidden ring-1 ring-[var(--linha)] bg-[var(--elevado)] flex items-center justify-center">
        {empresa.avatarUrl ? (
          <Image
            src={empresa.avatarUrl}
            alt={`Logo de ${empresa.nome}`}
            width={176}
            height={176}
            priority
            className="size-full object-cover"
          />
        ) : (
          <span aria-hidden className="text-3xl font-medium text-[var(--texto-2)]">
            {inicial}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-2xl leading-8 font-medium text-[var(--texto)] text-balance">{empresa.nome}</h1>

      {empresa.bio && (
        <p className="mt-2 max-w-[34ch] text-[15px] leading-[22px] text-[var(--texto-2)] text-balance">
          {empresa.bio}
        </p>
      )}
    </header>
  );
}
