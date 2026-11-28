'use client';
import Link from 'next/link';
import {type ReactNode} from 'react';
import {AlertTriangle,BadgeCheck,CalendarClock,ChevronRight,ClipboardList} from 'lucide-react';
import {Card,Badge,Avatar} from './ui';
import ToolImage from './tool-image';
import {LoanView,ToolView,today} from '@/lib/types';
const other=(l:LoanView)=>l.role==='lender'?l.borrowerName:l.lenderName;
export function Reminders({loans}:{loans:LoanView[]|undefined}){const L=loans??[];
const rows=[
 {icon:ClipboardList,title:'Follow-ups',text:(n:number)=>`${n} ${n===1?'request needs':'requests need'} your answer`,items:L.filter(l=>l.role==='lender'&&l.status==='pending'),href:'/incoming',tone:'bg-emerald-100 text-emerald-900'},
 {icon:CalendarClock,title:'Returns today',text:(n:number)=>`${n} ${n===1?'tool is':'tools are'} due back today`,items:L.filter(l=>l.status==='approved'&&l.endDate===today()),href:'/my-requests',tone:'bg-amber-100 text-amber-900'},
 {icon:AlertTriangle,title:'Overdue',text:(n:number)=>`${n} ${n===1?'loan is':'loans are'} late`,items:L.filter(l=>l.overdue),href:'/my-requests',tone:'bg-rose-100 text-rose-900'}];
return <Card><h2 className="mb-3 text-lg font-semibold">Reminders</h2><ul className="grid gap-1">
{rows.map(r=><li key={r.title}><Link href={r.href} className="group flex min-h-14 items-center gap-3 rounded-2xl p-2.5 transition hover:bg-emerald-50">
<span className={`grid size-10 shrink-0 place-items-center rounded-xl ${r.tone}`}><r.icon aria-hidden className="size-5"/></span>
<span className="min-w-0 flex-1"><span className="block text-[15px] font-medium">{r.title}</span><span className="block text-sm text-slate-600">{r.text(r.items.length)}</span></span>
<span className="hidden -space-x-2 sm:flex">{r.items.slice(0,3).map(x=><Avatar key={x._id} n={other(x)} size="size-7"/>)}</span>
<ChevronRight aria-hidden className="size-4 text-slate-500 transition group-hover:translate-x-0.5"/></Link></li>)}</ul></Card>;}

export function ToolCard({t,action}:{t:ToolView;action:ReactNode}){
return <Card hover className="flex h-full flex-col !p-3 sm:!p-3">
<div className="relative"><ToolImage tool={t}/><span className="absolute left-3 top-3"><Badge s={t.available?'available':'on loan'}/></span></div>
<div className="flex flex-1 flex-col px-2 pb-2 pt-4"><div className="flex items-start justify-between gap-2"><h3 className="min-w-0 text-lg font-semibold leading-snug">{t.name}</h3>
{t.ownerTrusted&&<span title="Trusted lender" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime/70 px-2.5 py-1 text-[13px] font-medium text-emerald-950"><BadgeCheck aria-hidden className="size-4"/>Trusted</span>}</div>
<p className="mt-1 text-sm text-slate-600">{t.category}, {t.condition}</p>
{t.description&&<p className="mt-2 line-clamp-2 text-[15px] text-slate-600">{t.description}</p>}
<div className="mt-auto flex items-center justify-between gap-3 pt-4"><span className="flex min-w-0 items-center gap-2 text-sm text-slate-600"><Avatar n={t.ownerName} size="size-8"/><span className="truncate">{t.ownerName}</span></span>{action}</div></div></Card>;}

export function Featured({tools,loans}:{tools:ToolView[];loans:LoanView[]}){
const n=new Map<string,number>();loans.forEach(l=>n.set(l.toolId,(n.get(l.toolId)??0)+1));
const t=[...tools].sort((a,b)=>(n.get(b._id)??0)-(n.get(a._id)??0))[0];if(!t)return null;
const L=loans.filter(l=>l.toolId===t._id);const done=L.filter(l=>l.status==='returned').length,run=L.filter(l=>l.status==='approved').length;
return <Card className="!p-3 sm:!p-3"><div className="relative"><ToolImage tool={t} variant="banner"/><span className="absolute bottom-3 left-3 rounded-full bg-slate-900/70 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur">Most requested</span></div>
<div className="px-2 pb-2 pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="min-w-0"><h3 className="text-xl font-semibold">{t.name}</h3><p className="text-sm text-slate-600">{t.category}, by {t.ownerName}</p></div><Badge s={t.available?'available':'on loan'}/></div>
<dl className="mt-4 grid grid-cols-3 gap-2 text-center">{[[L.length,'Requests'],[run,'Active'],[done,'Returned']].map(([a,b])=><div key={b} className="rounded-2xl bg-emerald-50 py-3"><dt className="text-[13px] text-slate-600">{b}</dt><dd className="text-xl font-semibold">{a}</dd></div>)}</dl>
<div className="mt-4 flex h-2.5 gap-1" aria-hidden><div style={{flex:done+1}} className="rounded-full bg-gradient-to-r from-brand to-emerald-300"/><div style={{flex:run+1}} className="rounded-full bg-emerald-100"/></div></div></Card>;}
