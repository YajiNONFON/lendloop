'use client';
import {useState} from 'react';
import {useMutation} from 'convex/react';
import {ConvexError} from 'convex/values';
import {AlertTriangle,Bell,Check,Clock,Inbox,PackageSearch,Undo2,X} from 'lucide-react';
import {api} from '@convex/_generated/api';
import type {Id} from '@convex/_generated/dataModel';
import Link from 'next/link';
import {Card,Badge,Btn,EmptyState,Skeleton,btnClass} from './ui';
import ToolImage from './tool-image';
import {Reveal} from './motion';
import {LoanView} from '@/lib/types';
import {ago,formatDate} from '@/lib/format';
export default function LoanList({items,mode}:{items:LoanView[]|undefined;mode:'borrower'|'lender'|'admin'}){
const decide=useMutation(api.loans.mutations.decide);const cancel=useMutation(api.loans.mutations.cancel);const markReturned=useMutation(api.loans.mutations.markReturned);
const[err,setErr]=useState('');
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
if(items===undefined)return <div role="status" aria-label="Loading" className="grid gap-3">{[0,1,2].map(i=><Skeleton key={i} className="h-24"/>)}</div>;
if(!items.length){
  if(mode==='lender')return <EmptyState icon={Inbox} title="No incoming requests yet" text="When a neighbour asks to borrow one of your tools, it will show up here." action={<Link href="/my-listings" className={btnClass('solid','lg')}>Manage my listings</Link>}/>;
  if(mode==='admin')return <EmptyState icon={PackageSearch} title="No loans yet" text="Loans between neighbours will appear here as soon as they are requested."/>;
  return <EmptyState icon={PackageSearch} title="No requests yet" text="Find a tool you need and ask a neighbour to borrow it." action={<Link href="/browse" className={btnClass('solid','lg')}>Browse tools</Link>}/>;}
return <>{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-[15px] text-rose-800">{err}</p>}
<ul className="grid gap-3">{items.map((l,i)=><li key={l._id}><Reveal i={i}><Card hover className="flex flex-col gap-4 !p-4 sm:flex-row sm:items-center sm:justify-between sm:!p-5">
<div className="flex min-w-0 items-center gap-4"><ToolImage tool={{name:l.toolName,category:l.toolCategory}} variant="thumb"/>
<div className="min-w-0"><h3 className="truncate text-base font-semibold">{l.toolName}</h3>
<p className="text-sm text-slate-600">{mode==='lender'?`Requested by ${l.borrowerName}`:mode==='admin'?`${l.lenderName} lends to ${l.borrowerName}`:`From ${l.lenderName}`}</p>
<p className="text-sm text-slate-600">{formatDate(l.startDate)} to {formatDate(l.endDate)}</p>
{l.lastEvent&&<p className={`mt-1 flex items-center gap-1.5 text-[13px] ${l.lastEvent.status==='sent'?'text-emerald-800':'text-rose-800'}`}>{l.lastEvent.status==='failed'?<AlertTriangle aria-hidden className="size-3.5"/>:l.lastEvent.type==='reminder'?<Clock aria-hidden className="size-3.5"/>:<Bell aria-hidden className="size-3.5"/>}{l.lastEvent.type==='reminder'?'Reminder':'Notification'} {l.lastEvent.status==='sent'?'sent':'failed'} {ago(l.lastEvent.at)}</p>}</div></div>
<div className="flex flex-wrap items-center gap-2 sm:justify-end">{l.overdue&&<Badge s="overdue"/>}<Badge s={l.status}/>
{mode==='lender'&&l.status==='pending'&&<><Btn size="lg" icon={Check} onClick={()=>run(()=>decide({loanId:l._id as Id<'loans'>,decision:'approve'}))}>Approve</Btn><Btn size="lg" v="ghost" icon={X} onClick={()=>run(()=>decide({loanId:l._id as Id<'loans'>,decision:'decline'}))}>Decline</Btn></>}
{mode==='lender'&&l.status==='approved'&&<Btn size="lg" icon={Undo2} onClick={()=>run(()=>markReturned({loanId:l._id as Id<'loans'>}))}>Mark returned</Btn>}
{mode==='borrower'&&l.status==='pending'&&<Btn v="danger" onClick={()=>run(()=>cancel({loanId:l._id as Id<'loans'>}))}>Cancel request</Btn>}</div></Card></Reveal></li>)}</ul></>;}
