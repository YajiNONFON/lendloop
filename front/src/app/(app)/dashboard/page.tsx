'use client';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {Card,Badge,Avatar,Stat,Donut,Area} from '@/components/ui';
import {Reminders,Featured} from '@/components/widgets';
import {toolImg} from '@/lib/types';
const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export default function Dashboard(){const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');const loans=useQuery(api.loans.queries.listMine,me?{}:'skip');
if(!me||!tools||!loans)return <Card className="py-14 text-center text-slate-500">Loading your dashboard...</Card>;
const approved=loans.filter(l=>l.status==='approved');const od=approved.filter(l=>l.overdue).length;const avail=tools.filter(t=>t.available).length;const out=tools.length-avail;
const upcoming=approved.filter(l=>!l.overdue).sort((a,b)=>a.endDate.localeCompare(b.endDate));const latest=loans[0];const year=String(new Date().getFullYear());
const monthly=M.map((_,i)=>loans.filter(l=>l.startDate.slice(0,4)===year&&Number(l.startDate.slice(5,7))===i+1).length);
const other=(l:typeof loans[number])=>l.role==='lender'?l.borrowerName:l.lenderName;
return <>
<div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-slate-500">Welcome back, {me.name.split(' ')[0]}</p><h1 className="text-4xl font-medium leading-tight sm:text-5xl">Neighbourhood<br/>Overview</h1></div>
<div className="flex w-full gap-4 sm:w-auto"><Stat icon="🔧" label="Tools shared" value={tools.length}/><Stat icon="🤝" label="Active loans" value={approved.length}/></div></div>
<div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="grid content-start gap-5">
<Card><div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-medium">Loan activity</h3><span className="rounded-lg border px-3 py-1 text-sm text-slate-500">{year}</span></div><Area data={monthly} labels={M}/></Card>
<div className="grid gap-5 md:grid-cols-[1fr_1.2fr]"><Card><h3 className="mb-3 text-xl font-medium">Availability</h3><div className="relative mx-auto w-fit"><Donut parts={[[avail,'#0f8a5f'],[Math.max(out-od,0),'#e6f57a'],[od,'#f43f5e']]}/><div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-3xl font-medium">{tools.length}</p><p className="text-xs text-slate-500">Total tools</p></div></div></div>
<div className="mt-3 flex flex-wrap justify-between gap-1 text-sm"><span>🟢 {avail} available</span><span>🟡 {Math.max(out-od,0)} on loan</span><span>🔴 {od} overdue</span></div></Card><Reminders loans={loans}/></div>
<Card className="overflow-x-auto"><h3 className="mb-3 text-xl font-medium">My loans</h3>{!loans.length?<p className="py-6 text-center text-slate-500">🌱 No loans yet. Request a tool to get started.</p>:<table className="w-full min-w-[560px] text-left text-sm"><thead className="text-slate-400"><tr><th className="pb-2 font-normal">Tool</th><th className="font-normal">With</th><th className="font-normal">Return by</th><th className="font-normal">Status</th></tr></thead><tbody>{loans.map(l=><tr key={l._id} className="border-t border-slate-100"><td className="py-3"><span className="flex items-center gap-3"><img src={toolImg(l.toolId)} alt="" className="size-11 rounded-xl object-cover"/><span><b className="block font-medium">{l.toolName}</b><span className="text-xs text-slate-400">{l.role==='lender'?'You lend':'You borrow'}</span></span></span></td><td>{other(l)}</td><td>{l.endDate}</td><td><Badge s={l.overdue?'overdue':l.status}/></td></tr>)}</tbody></table>}</Card></div>
<div className="grid content-start gap-5"><Featured tools={tools} loans={loans}/><div className="grid gap-5 md:grid-cols-2">
{latest&&<Card><div className="flex items-center gap-3"><Avatar n={other(latest)}/><span><b className="block font-medium">{other(latest)}</b><span className="text-sm text-slate-500">{latest.toolName}</span></span></div><p className="mt-5 text-xl font-medium">{latest.startDate} to {latest.endDate}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400">Latest request</span><Badge s={latest.status}/></div></Card>}
<Card><h3 className="mb-3 font-medium">Upcoming returns</h3><div className="mb-3 flex justify-between">{[0,1,2,3,4].map(i=>{const d=new Date(Date.now()+i*864e5);return <div suppressHydrationWarning key={i} className={`rounded-xl px-2 py-2 text-center text-xs ${i===0?'bg-brand text-white':'text-slate-500'}`}><p>{d.getDate()}</p><p>{d.toLocaleDateString('en',{weekday:'short'})}</p></div>})}</div>
{upcoming.slice(0,3).map(l=><div key={l._id} className="mb-2 border-l-2 border-brand pl-3 text-sm"><b className="block font-medium">Return {l.toolName}</b><span className="text-slate-500">{other(l)}, by {l.endDate}</span></div>)}{!upcoming.length&&<p className="text-sm text-slate-500">No returns coming up.</p>}</Card></div></div></div></>}
