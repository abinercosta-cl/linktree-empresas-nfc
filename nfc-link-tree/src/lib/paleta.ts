// Paleta da página pública derivada das duas cores que o cliente escolhe no
// painel (corFundo e corPrimaria). Tudo o mais sai delas: texto, superfícies,
// bordas e a cor do texto sobre o botão principal.
//
// Qualquer combinação #RRGGBB precisa continuar legível, então o contraste é
// calculado (WCAG 2.x) e corrigido em vez de assumido:
// - texto principal e secundário: pelo menos 4.5:1 sobre o fundo;
// - texto apagado (meta, legendas): pelo menos 4.5:1 também;
// - destaque (botão principal): pelo menos 3:1 contra o fundo, para o botão
//   se distinguir da página, e o texto sobre ele com pelo menos 4.5:1.

type Rgb = [number, number, number];

export type Paleta = {
  fundo: string;
  cartao: string; // superfície dos links
  elevado: string; // hover e campos
  linha: string; // bordas finas
  texto: string;
  textoSecundario: string;
  textoApagado: string;
  destaque: string;
  textoSobreDestaque: string;
  escuro: boolean;
};

const TEXTO_CLARO = "#F5F5F4";
const TEXTO_ESCURO = "#1C1B19";

const PADRAO_FUNDO = "#07090E";
const PADRAO_DESTAQUE = "#0EA5E9";

function hexParaRgb(hex: string): Rgb | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbParaHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function luminancia([r, g, b]: Rgb): number {
  const canal = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function contraste(a: string, b: string): number {
  const ra = hexParaRgb(a);
  const rb = hexParaRgb(b);
  if (!ra || !rb) return 1;
  const la = luminancia(ra);
  const lb = luminancia(rb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Mistura `cor` em `base` na proporção `t` (0 = base, 1 = cor).
function misturar(base: string, cor: string, t: number): string {
  const a = hexParaRgb(base)!;
  const b = hexParaRgb(cor)!;
  return rgbParaHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb);
}

// Pior contraste de `cor` entre as superfícies onde ela aparece.
function piorContraste(cor: string, superficies: string[]): number {
  return Math.min(...superficies.map((s) => contraste(cor, s)));
}

// Aproxima `cor` de `alvo` aos poucos até atingir o contraste mínimo contra
// todas as `superficies` (ou chegar ao próprio alvo).
function garantirContraste(cor: string, superficies: string[], alvo: string, minimo: number): string {
  let atual = cor;
  for (let passo = 1; piorContraste(atual, superficies) < minimo && passo <= 20; passo++) {
    atual = misturar(cor, alvo, passo / 20);
  }
  return atual;
}

export function criarPaleta(corFundo?: string | null, corPrimaria?: string | null): Paleta {
  const fundo = rgbParaHex(hexParaRgb(corFundo ?? "") ?? hexParaRgb(PADRAO_FUNDO)!);
  const primaria = rgbParaHex(hexParaRgb(corPrimaria ?? "") ?? hexParaRgb(PADRAO_DESTAQUE)!);

  // Texto claro ou escuro: o que tiver mais contraste com o fundo do cliente.
  // Os tons levemente quentes são preferidos; em fundos de tom médio (ex: cinza
  // #808080) eles não bastam, e o texto vai para branco ou preto puros.
  const escuro = contraste(fundo, "#FFFFFF") >= contraste(fundo, "#000000");
  const texto =
    contraste(escuro ? TEXTO_CLARO : TEXTO_ESCURO, fundo) >= 7
      ? escuro ? TEXTO_CLARO : TEXTO_ESCURO
      : escuro ? "#FFFFFF" : "#000000";
  const oposto = escuro ? "#000000" : "#FFFFFF";

  // Superfícies saem do próprio fundo misturado ao texto, então herdam o tom do
  // cliente (um fundo creme gera cartões creme). Em fundos de tom médio, chegar
  // perto do texto tiraria contraste: aí o cartão se afasta dele.
  // Testa com a mistura mais forte usada (a do elevado), que é o pior caso.
  const pertoDoTexto = contraste(texto, misturar(fundo, texto, 0.1)) >= 4.5;
  const superficie = (t: number) => (pertoDoTexto ? misturar(fundo, texto, t) : misturar(fundo, oposto, t));
  const cartao = superficie(escuro ? 0.06 : 0.04);
  const elevado = superficie(escuro ? 0.1 : 0.08);
  const linha = misturar(fundo, texto, 0.14);
  const fundos = [fundo, cartao, elevado];
  const textoSecundario = garantirContraste(misturar(fundo, texto, 0.74), fundos, texto, 4.5);
  const textoApagado = garantirContraste(misturar(fundo, texto, 0.6), fundos, texto, 4.5);

  // A cor do cliente é o destaque. Se ela some no fundo (ex: azul-marinho sobre
  // preto), é clareada ou escurecida até o botão se destacar.
  const destaque = garantirContraste(primaria, [fundo], texto, 3);
  // Texto sobre o botão: prefere os tons quentes; se nenhum chega a 4.5:1
  // (cores médias, como #808080), usa o branco ou o preto puro com mais contraste.
  const quente = [TEXTO_CLARO, TEXTO_ESCURO].sort((x, y) => contraste(destaque, y) - contraste(destaque, x))[0];
  const puro = contraste(destaque, "#FFFFFF") >= contraste(destaque, "#000000") ? "#FFFFFF" : "#000000";
  const textoSobreDestaque = contraste(destaque, quente) >= 4.5 ? quente : puro;

  return {
    fundo,
    cartao,
    elevado,
    linha,
    texto,
    textoSecundario,
    textoApagado,
    destaque,
    textoSobreDestaque,
    escuro,
  };
}

// Variáveis CSS consumidas pelos componentes da página pública (bg-[var(--cartao)] etc.).
export function variaveisPaleta(p: Paleta): Record<string, string> {
  return {
    "--fundo": p.fundo,
    "--cartao": p.cartao,
    "--elevado": p.elevado,
    "--linha": p.linha,
    "--texto": p.texto,
    "--texto-2": p.textoSecundario,
    "--texto-3": p.textoApagado,
    "--destaque": p.destaque,
    "--sobre-destaque": p.textoSobreDestaque,
  };
}
