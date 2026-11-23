# NFC Link Tree

Plataforma multi-tenant de páginas de links para empresas, aberta por aproximação de cartão ou tag NFC, ou por QR Code, sem instalar aplicativo. Cada empresa tem uma página em `/<slug>` com a própria identidade visual, botão para salvar o contato na agenda (vCard) e telemetria de acessos e cliques.

É usada pela Quantum para atender clientes como a Auto Car Tapeçaria. Empresas, links, redes sociais, avatares e administradores são gerenciados pelo painel em `/admin`.

## Stack

- **Next.js 16** (App Router, Turbopack, React Compiler) e **React 19**
- **Tailwind CSS v4**, configurado por CSS em `src/app/globals.css`
- **Prisma 6** com **Neon** (PostgreSQL)
- **Auth.js v5** (login por email e senha no painel)
- **Vercel Blob** para os avatares, otimizados para WebP com `sharp`

## Como rodar localmente

Pré-requisitos: Node.js (versão em `.nvmrc`), npm e um banco PostgreSQL (o projeto usa Neon).

```bash
npm install                 # também roda "prisma generate"
cp .env.example .env        # preencha com os valores reais
npx prisma migrate deploy   # aplica as migrations
npx prisma db seed          # cria as empresas de exemplo
npm run dev                 # http://localhost:3000
```

> ⚠️ Se o `.env` apontar para o banco de produção, abrir páginas grava eventos reais e `prisma migrate dev` altera o schema. Para desenvolvimento, prefira um branch do Neon.

### Primeiro administrador

O painel não tem cadastro aberto. Crie o primeiro administrador pela linha de comando:

```bash
npx tsx prisma/criar-admin.ts email@exemplo.com senha123 "Nome opcional"
```

A senha precisa ter de 8 a 72 caracteres. Depois, entre em `/admin/login`; os demais administradores são convidados pelo próprio painel.

## Variáveis de ambiente

Todas estão em `.env.example`.

| Variável | Para que serve |
|---|---|
| `DATABASE_URL` | Conexão do Neon **com pooling**, usada pela aplicação |
| `DIRECT_URL` | Conexão do Neon **sem pooling**, usada pelas migrations |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada em OpenGraph, QR Code e vCard. É fixada no build |
| `AUTH_SECRET` | Segredo que assina a sessão do painel. Gere com `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob, necessário para o upload de avatar |

`VERCEL_URL` é injetada pela Vercel e só é usada como alternativa quando `NEXT_PUBLIC_SITE_URL` não está definida.

`SEED_QUANTUM_WHATSAPP` só é necessária para rodar o seed (`npx prisma db seed`): é o WhatsApp da Quantum, mantido fora do código versionado. A aplicação não a lê, então não precisa ser configurada no deploy.

## Verificação

```bash
npx tsc --noEmit   # type-check
npm run lint       # ESLint
npm run build      # build de produção
npm run start      # serve o build
```

## Estrutura

```
prisma/              schema, migrations, seed e criar-admin.ts
prisma.config.ts     configuração da CLI do Prisma (carrega o .env)
src/app/             rotas: hub (/), página da empresa (/[empresa]),
                     vCard (/[empresa]/contato.vcf), telemetria (/api/track)
                     e painel (/admin)
src/components/      componentes da página pública
src/data/            leitura das empresas com cache
src/lib/             Prisma client, sessão do admin, cache, validação, rate limit
src/auth.ts          configuração do Auth.js
src/proxy.ts         protege /admin (o antigo middleware.ts no Next 16)
```
