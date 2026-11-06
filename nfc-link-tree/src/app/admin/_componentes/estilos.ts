// Tokens visuais do painel, reaproveitando o design system escuro/glassmorphism
// das páginas públicas (ProfileHeader, ErrorState): fundo #07090E, cards
// #0C111D com borda white/10, acento sky-500 e rótulos em mono com tracking largo.

export const card =
  "rounded-3xl border border-white/10 bg-[#0C111D]/90 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]";

export const rotulo = "text-[11px] font-mono tracking-widest uppercase text-slate-400";

export const campo =
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-500/60 focus:bg-white/[0.06] disabled:opacity-60";

const botaoBase =
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

export const botaoPrimario = `${botaoBase} bg-sky-500 hover:bg-sky-400 text-[#07090E] shadow-[0_0_20px_rgba(14,165,233,0.25)]`;

export const botaoSecundario = `${botaoBase} bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-slate-100`;

export const botaoPerigo = `${botaoBase} bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300`;

export const selo = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-widest uppercase border";
