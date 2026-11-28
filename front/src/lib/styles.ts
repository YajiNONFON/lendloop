// Shared style helpers that work in both server and client components.
export type BtnVariant='solid'|'ghost'|'danger';
const VARIANT:Record<BtnVariant,string>={solid:'bg-brand text-white hover:bg-brand-dark',ghost:'bg-white text-brand-dark ring-1 ring-emerald-200 hover:bg-emerald-50',danger:'bg-rose-50 text-rose-800 ring-1 ring-rose-200 hover:bg-rose-100'};
export const btnClass=(v:BtnVariant='solid',size:'md'|'lg'='md')=>`inline-flex items-center justify-center gap-2 rounded-full font-medium transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${size==='lg'?'min-h-12 px-6 text-[15px]':'min-h-10 px-4 text-sm'} ${VARIANT[v]}`;
