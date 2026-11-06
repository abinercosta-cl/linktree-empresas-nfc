import type { Metadata } from "next";

// Layout raiz de /admin (inclui /admin/login): só metadados.
// A proteção fica em (painel)/layout.tsx, que não envolve a tela de login;
// se ficasse aqui, /admin/login redirecionaria para si mesmo em loop.
export const metadata: Metadata = {
  title: "Painel | NFC Link Tree",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
