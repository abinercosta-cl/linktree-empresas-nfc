import type { Metadata } from "next";
import TelaSistema from "@/components/TelaSistema";

// 404 de todo o app: URLs que não existem e notFound() de qualquer rota, como
// uma empresa inexistente ou desativada, ou uma área do painel que o
// administrador não pode acessar. Fica sem ação de propósito: quem chega por
// uma tag NFC não tem para onde ir no site, e o texto diz o que fazer.
// Server Component: o Next envia este arquivo com todas as páginas do app.
export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <TelaSistema
      titulo="Página não encontrada"
      mensagem="Este endereço não existe ou a página foi desativada. Confira o link ou fale com a empresa."
    />
  );
}
