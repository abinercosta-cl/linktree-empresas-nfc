import { NextResponse } from "next/server";
import { auth } from "@/auth";

// No Next.js 16 o antigo middleware.ts se chama proxy.ts. Como o projeto usa
// src/, o arquivo precisa ficar em src/ (mesmo nível de app/) para ser carregado.
//
// Esta é a primeira barreira (checa só o JWT). O layout do painel e cada
// Server Action também validam a sessão contra o banco, para que um
// administrador removido perca o acesso mesmo com um token ainda válido.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return;

  if (!req.auth?.user?.id) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
