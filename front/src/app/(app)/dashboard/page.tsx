'use client';
import Link from 'next/link';
import {useQuery} from 'convex/react';
import {AlertTriangle,CalendarClock,Handshake,Inbox,PackageSearch,Wrench} from 'lucide-react';
import {api} from '@convex/_generated/api';
import {Card,Badge,Donut,PageHeader,Skeleton,Stat,EmptyState} from '@/components/ui';
import ActivityChart from '@/components/activity-chart';
import ToolImage from '@/components/tool-image';
import {Featured,Reminders} from '@/components/widgets';
import {Reveal} from '@/components/motion';
import {btnClass} from '@/lib/styles';
import {formatDate,plural} from '@/lib/format';
const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export default function Dashboard(){
const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');const loans=useQuery(api.loans.queries.listMine,me?{}:'skip');
if(!me||!tools||!loans)return <div role="status" aria-label="Loading"><Skeleton className="mb-6 h-12 w-72"/><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map(i=><Skeleton key={i} className="h-32"/>)}</div><Skeleton className="mt-5 h-72"/></div>;
const approved=loans.filter(l=>l.status==='approved');const od=approved.filter(l=>l.overdue).length;
const avail=tools.filter(t=>t.available).length;const out=tools.length-avail;const onLoan=Math.max(out-od,0);
const waiting=loans.filter(l=>l.role==='lender'&&l.status==='pending').length;
const upcoming=approved.filter(l=>!l.overdue).sort((a,b)=>a.endDate.localeCompare(b.endDate));const year=String(new Date().getFullYear());
const monthly=M.map((_,i)=>loans.filter(l=>l.startDate.slice(0,4)===year&&Number(l.startDate.slice(5,7))===i+1).length);
const other=(l:typeof loans[number])=>l.role==='lender'?l.borrowerName:l.lenderName;
return <>
<PageHeader title={`Welcome back, ${me.name.split(' ')[0]}`} subtitle="Here is what is happening in your neighbourhood."/>
<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
{[{icon:Wrench,label:'Tools shared',value:tools.length},{icon:Handshake,label:'Active loans',value:approved.length},{icon:Inbox,label:'Awaiting your answer',value:waiting},{icon:AlertTriangle,label:'Overdue',value:od}].map((s,i)=><Reveal key={s.label} i={i}><Stat {...s}/></Reveal>)}</div>
<div className="mt-5 grid gap-5 xl:grid-cols-3"><div className="grid content-start gap-5 xl:col-span-2">
<Reveal i={4}><Card><div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Loan activity</h2><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">{year}</span></div><ActivityChart data={monthly} labels={M}/></Card></Reveal>
<div className="grid gap-5 lg:grid-cols-2"><Reveal i={5}><Card className="h-full"><h2 className="mb-4 text-lg font-semibold">Availability</h2>
<div className="relative mx-auto w-fit"><Donut parts={[[avail,'#0d7a54'],[onLoan,'#e6f57a'],[od,'#e11d48']]}/><div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-3xl font-semibold">{tools.length}</p><p className="text-[13px] text-slate-600">{tools.length===1?'Total tool':'Total tools'}</p></div></div></div>
<ul className="mt-4 grid gap-1.5 text-[15px]">{[['bg-brand',avail,'available'],['bg-lime ring-1 ring-emerald-700/30',onLoan,'on loan'],['bg-rose-600',od,'overdue']].map(([c,n,l])=><li key={String(l)} className="flex items-center justify-between"><span className="flex items-center gap-2"><span aria-hidden className={`size-3 rounded-full ${c}`}/>{String(l).replace(/^./,x=>x.toUpperCase())}</span><b className="font-semibold">{n}</b></li>)}</ul></Card></Reveal>
<Reveal i={6}><Reminders loans={loans}/></Reveal></div>
<Reveal i={7}><Card><div className="mb-2 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">My loans</h2><span className="text-sm text-slate-600">{plural(loans.length,'loan')}</span></div>
{!loans.length?<EmptyState icon={PackageSearch} title="No loans yet" text="Request a tool from a neighbour or list your own to get started." action={<Link href="/browse" className={btnClass('solid','lg')}>Browse tools</Link>}/>:
<div><div aria-hidden className="hidden grid-cols-[minmax(0,2.2fr)_1.2fr_1fr_auto] gap-4 border-b border-emerald-900/5 pb-2 text-[13px] font-medium text-slate-600 md:grid"><span>Tool</span><span>With</span><span>Return by</span><span className="min-w-24">Status</span></div>
<ul>{loans.map(l=><li key={l._id} className="grid gap-2 border-b border-emerald-900/5 py-3.5 last:border-0 md:grid-cols-[minmax(0,2.2fr)_1.2fr_1fr_auto] md:items-center md:gap-4">
<span className="flex min-w-0 items-center gap-3"><ToolImage tool={{name:l.toolName,category:l.toolCategory}} variant="thumb" className="!size-12"/><span className="min-w-0"><b className="block truncate font-semibold">{l.toolName}</b><span className="text-[13px] text-slate-600">{l.role==='lender'?'You lend':'You borrow'}</span></span></span>
<span className="text-[15px]"><span className="text-slate-600 md:hidden">With: </span>{other(l)}</span>
<span className="text-[15px]"><span className="text-slate-600 md:hidden">Return by: </span>{formatDate(l.endDate)}</span>
<span className="md:min-w-24"><Badge s={l.overdue?'overdue':l.status}/></span></li>)}</ul></div>}</Card></Reveal></div>
<div className="grid content-start gap-5"><Reveal i={5}><Featured tools={tools} loans={loans}/></Reveal>
<Reveal i={6}><Card><h2 className="mb-4 text-lg font-semibold">Upcoming returns</h2>
<div className="mb-4 grid grid-cols-5 gap-1.5 text-center">{[0,1,2,3,4].map(i=>{const d=new Date(Date.now()+i*864e5);return <div suppressHydrationWarning key={i} className={`rounded-2xl py-2 ${i===0?'bg-brand text-white':'bg-emerald-50 text-slate-700'}`}><p className="text-lg font-semibold leading-tight">{d.getDate()}</p><p className="text-[13px]">{d.toLocaleDateString('en-GB',{weekday:'short'})}</p></div>;})}</div>
{!upcoming.length?<p className="flex items-center gap-2 text-[15px] text-slate-600"><CalendarClock aria-hidden className="size-4"/>No returns coming up.</p>:<ul className="grid gap-3">{upcoming.slice(0,4).map(l=><li key={l._id} className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 p-3"><CalendarClock aria-hidden className="mt-0.5 size-5 shrink-0 text-brand"/><span className="min-w-0 text-[15px]"><b className="block truncate font-semibold">{l.toolName}</b><span className="text-slate-600">{other(l)}, by {formatDate(l.endDate)}</span></span></li>)}</ul>}</Card></Reveal></div></div></>;}
