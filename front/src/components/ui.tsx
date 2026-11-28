'use client';
import {useEffect,useRef,type ButtonHTMLAttributes,type ReactNode} from 'react';
import {Trash2,X,type LucideIcon} from 'lucide-react';

export const inp='min-h-11 w-full rounded-xl border border-emerald-200 bg-white px-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/30';

export const Card=({children,className='',hover=false}:{children:ReactNode;className?:string;hover?:boolean})=>
<div className={`rounded-3xl border border-emerald-900/5 bg-white p-5 shadow-[0_1px_2px_rgba(15,60,40,.04),0_10px_28px_rgba(15,60,40,.05)] sm:p-6 ${hover?'transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,60,40,.10)]':''} ${className}`}>{children}</div>;

// One status vocabulary for every page: same label, same colours, contrast of AA or better.
const TONE:Record<string,[string,string]>={
  available:['bg-emerald-100 text-emerald-900','bg-emerald-600'],'on loan':['bg-amber-100 text-amber-900','bg-amber-600'],
  pending:['bg-amber-100 text-amber-900','bg-amber-600'],approved:['bg-emerald-100 text-emerald-900','bg-emerald-600'],
  declined:['bg-rose-100 text-rose-900','bg-rose-600'],returned:['bg-slate-100 text-slate-800','bg-slate-500'],
  cancelled:['bg-slate-100 text-slate-800','bg-slate-500'],overdue:['bg-rose-100 text-rose-900','bg-rose-600'],
  trusted:['bg-lime/70 text-emerald-950','bg-emerald-700'],yours:['bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200','bg-emerald-600']};
export const Badge=({s,label}:{s:string;label?:string})=>{const[c,d]=TONE[s]??TONE.returned;
return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium capitalize ${c}`}><span aria-hidden className={`size-1.5 rounded-full ${d}`}/>{label??s}</span>;};

import {btnClass,type BtnVariant as V} from '@/lib/styles';
export {btnClass};
export const Btn=({v='solid',icon:Icon,size='md',className='',children,...p}:ButtonHTMLAttributes<HTMLButtonElement>&{v?:V;icon?:LucideIcon;size?:'md'|'lg'})=>
<button type="button" {...p} className={`${btnClass(v,size)} ${className}`}>{Icon&&<Icon aria-hidden className="size-4 shrink-0"/>}{children}</button>;

const COL=['bg-emerald-200 text-emerald-950','bg-amber-200 text-amber-950','bg-sky-200 text-sky-950','bg-rose-200 text-rose-950'];
export const Avatar=({n,size='size-10'}:{n:string;size?:string})=><span aria-hidden className={`grid ${size} shrink-0 place-items-center rounded-full text-sm font-semibold ring-2 ring-white ${COL[n.length%4]}`}>{n[0]?.toUpperCase()}</span>;

export const PageHeader=({title,subtitle,action}:{title:string;subtitle?:string;action?:ReactNode})=>
<div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div className="min-w-0"><h1 className="text-[28px] font-semibold leading-tight tracking-tight sm:text-[30px]">{title}</h1>{subtitle&&<p className="mt-1 text-[15px] text-slate-600">{subtitle}</p>}</div>{action}</div>;

export const Stat=({icon:Icon,label,value,hint}:{icon:LucideIcon;label:string;value:number;hint?:string})=>
<Card hover className="!p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-lime/60 text-emerald-900"><Icon aria-hidden className="size-5"/></span><p className="text-[15px] font-medium text-slate-600">{label}</p></div>
<p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>{hint&&<p className="mt-1 text-[13px] text-slate-500">{hint}</p>}</Card>;

export const Donut=({parts}:{parts:[number,string][]})=>{const ps=parts.filter(p=>p[0]>0);const t=ps.reduce((a,p)=>a+p[0],0);let o=0;
return <svg viewBox="0 0 42 42" className="size-44 -rotate-90" aria-hidden><circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e2e8f0" strokeWidth="5"/>
{ps.map(([v,c],i)=>{const l=(v/t)*100,k=Math.max(l-2,0.5);const e=<circle key={i} cx="21" cy="21" r="15.9155" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${k} ${100-k}`} strokeDashoffset={-o}/>;o+=l;return e;})}</svg>;};

export const Skeleton=({className=''}:{className?:string})=><div aria-hidden className={`animate-pulse rounded-2xl bg-emerald-100/70 ${className}`}/>;
export const GridSkeleton=({count=6}:{count?:number})=><div role="status" aria-label="Loading" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({length:count},(_,i)=><Card key={i} className="!p-3"><Skeleton className="aspect-[3/2] w-full"/><Skeleton className="mt-4 h-5 w-2/3"/><Skeleton className="mt-2 h-4 w-1/2"/></Card>)}</div>;

export const EmptyState=({icon:Icon,title,text,action}:{icon:LucideIcon;title:string;text:string;action?:ReactNode})=>
<Card className="flex flex-col items-center px-6 py-14 text-center"><span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-brand"><Icon aria-hidden className="size-8"/></span>
<h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-1 max-w-sm text-[15px] text-slate-600">{text}</p>{action&&<div className="mt-6">{action}</div>}</Card>;

export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
const ref=useRef<HTMLDivElement>(null);const close=useRef(onClose);close.current=onClose;
useEffect(()=>{const prev=document.activeElement as HTMLElement|null;
  (ref.current?.querySelector<HTMLElement>('input,select,textarea,[data-autofocus]'))?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close.current();};document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);prev?.focus();};},[]);
return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-emerald-950/40 p-4 backdrop-blur-sm" onMouseDown={e=>{if(e.target===e.currentTarget)close.current();}}>
<div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
<div className="mb-4 flex items-start justify-between gap-3"><h2 id="modal-title" className="text-xl font-semibold">{title}</h2>
<button type="button" aria-label="Close dialog" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"><X aria-hidden className="size-5"/></button></div>{children}</div></div>;}

export const ConfirmDialog=({title,message,confirmLabel,busy=false,onConfirm,onClose}:{title:string;message:string;confirmLabel:string;busy?:boolean;onConfirm:()=>void;onClose:()=>void})=>
<Modal title={title} onClose={onClose}><p className="text-[15px] text-slate-600">{message}</p>
<div className="mt-6 flex flex-wrap justify-end gap-2"><Btn v="ghost" data-autofocus onClick={onClose}>Cancel</Btn><Btn v="danger" icon={Trash2} disabled={busy} onClick={onConfirm}>{confirmLabel}</Btn></div></Modal>;
