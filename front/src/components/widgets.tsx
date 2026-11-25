'use client';
import Link from 'next/link';
import {ReactNode} from 'react';
import {Card,Badge,Avatar} from './ui';
import {LoanView,ToolView,today,toolImg} from '@/lib/types';
const other=(l:LoanView)=>l.role==='lender'?l.borrowerName:l.lenderName;
export function Reminders({loans}:{loans:LoanView[]|undefined}){const L=loans??[];
const rows:[string,string,LoanView[]][]=[
 ['Follow-ups','requests need your answer',L.filter(l=>l.role==='lender'&&l.status==='pending')],
 ['Returns today','tools are due back today',L.filter(l=>l.status==='approved'&&l.endDate===today())],
 ['Overdue','loans are late',L.filter(l=>l.overdue)]];
return <Card><div className="mb-3 flex items-center justify-between"><h3 className="text-xl font-medium">Reminders</h3><span className="grid size-8 place-items-center rounded-full bg-slate-50 text-sm">↗</span></div>
{rows.map(([t,s,l],i)=><Link href="/incoming" key={t} className={`mb-1 flex items-center justify-between rounded-2xl p-3 ${i===0?'bg-emerald-50':'hover:bg-slate-50'}`}><div><p className="font-medium">{t}</p><p className="text-sm text-slate-500">{l.length} {s}</p><div className="mt-1 flex -space-x-2">{l.slice(0,4).map(x=><Avatar key={x._id} n={other(x)} size="size-6"/>)}</div></div><span className="text-slate-400">›</span></Link>)}</Card>}
export function Featured({tools,loans}:{tools:ToolView[];loans:LoanView[]}){
const n=new Map<string,number>();loans.forEach(l=>n.set(l.toolId,(n.get(l.toolId)??0)+1));
const t=[...tools].sort((a,b)=>(n.get(b._id)??0)-(n.get(a._id)??0))[0];if(!t)return null;
const L=loans.filter(l=>l.toolId===t._id);const done=L.filter(l=>l.status==='returned').length,run=L.filter(l=>l.status==='approved').length;
const rest=tools.filter(x=>x._id!==t._id);const extra=Math.max(rest.length-2,0);
return <Card className="!p-3"><div className="grid grid-cols-[1fr_92px] gap-3"><div className="relative overflow-hidden rounded-3xl"><img src={toolImg(t._id)} alt={t.name} className="h-56 w-full object-cover"/><span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-4 py-2 text-sm text-white backdrop-blur">Most requested</span></div>
<div className="grid gap-3"><img src={toolImg(rest[0]?._id??t._id)} alt="" className="h-full w-full rounded-2xl object-cover"/><div className="relative"><img src={toolImg(rest[1]?._id??t._id)} alt="" className="h-full w-full rounded-2xl object-cover"/>{extra>0&&<span className="absolute inset-0 grid place-items-center rounded-2xl bg-black/30 font-medium text-white">+{extra}</span>}</div></div></div>
<div className="grid gap-4 p-3 sm:grid-cols-[1fr_1.4fr]"><div><h3 className="text-2xl font-medium">{t.name}</h3><p className="text-slate-500">{t.category}</p><div className="mt-4 flex gap-2 text-center text-sm">{[[L.length,'Requests'],[run,'Active'],[done,'Returned']].map(([a,b])=><div key={b} className="flex-1 rounded-xl bg-slate-50 py-2"><b className="block font-medium">{a}</b><span className="text-xs text-slate-400">{b}</span></div>)}</div></div>
<div><div className="flex justify-between text-sm"><b className="font-medium">Loans</b><span className="text-slate-400">by {t.ownerName}</span></div><div className="my-3 flex h-8 gap-1"><div style={{flex:done+1}} className="rounded-full bg-gradient-to-r from-brand to-emerald-300"/><div style={{flex:run+1}} className="rounded-full bg-[repeating-linear-gradient(135deg,#e2e8f0_0_4px,#f1f5f9_4px_8px)]"/></div><div className="flex justify-between text-sm"><span>{done}<br/><span className="text-xs text-slate-400">Returned</span></span><span className="text-right">{run}<br/><span className="text-xs text-slate-400">In progress</span></span></div></div></div>
<div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">{['🛠 '+t.condition,'📦 '+t.category,'👤 '+t.ownerName.split(' ')[0],t.available?'✅ Available':'⏳ On loan'].map(f=><span key={f} className="truncate rounded-xl bg-slate-50 px-3 py-2 text-center">{f}</span>)}</div></Card>}
export function ToolCard({t,action}:{t:ToolView;action:ReactNode}){
return <Card className="!p-3"><div className="relative"><img src={toolImg(t._id)} alt={t.name} className="h-36 w-full rounded-3xl object-cover"/><span className="absolute right-2 top-2"><Badge s={t.available?'available':'on loan'}/></span></div>
<div className="mt-3 flex items-center gap-3 px-1"><Avatar n={t.ownerName}/><div className="min-w-0 flex-1"><p className="truncate font-medium">{t.name}</p><p className="text-sm text-slate-500">{t.category}</p></div></div>
<p className="mt-2 line-clamp-2 px-1 text-sm text-slate-500">{t.description}</p><div className="mt-3 flex items-center justify-between px-1"><span className="text-xs text-slate-400">{t.condition} · by {t.ownerName}</span>{action}</div></Card>}
