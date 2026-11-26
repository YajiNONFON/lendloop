'use client';
import {useState} from 'react';
import {useMutation} from 'convex/react';
import {ConvexError} from 'convex/values';
import {api} from '@convex/_generated/api';
import type {Id} from '@convex/_generated/dataModel';
import {Card,Badge,Btn,Empty} from './ui';
import {LoanView,toolImg} from '@/lib/types';
const ago=(t:number)=>{const m=Math.round((Date.now()-t)/60000);if(m<1)return 'just now';if(m<60)return `${m} min ago`;const h=Math.round(m/60);if(h<24)return `${h} h ago`;const d=Math.round(h/24);return `${d} day${d>1?'s':''} ago`;};
export default function LoanList({items,mode}:{items:LoanView[]|undefined;mode:'borrower'|'lender'}){
const decide=useMutation(api.loans.mutations.decide);const cancel=useMutation(api.loans.mutations.cancel);const markReturned=useMutation(api.loans.mutations.markReturned);
const[err,setErr]=useState('');
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
if(items===undefined)return <Empty text="Loading..."/>;
if(!items.length)return <Empty text={mode==='lender'?'No one has asked to borrow your tools yet.':'You haven’t requested anything yet. Browse tools to get started.'}/>;
return <>{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{err}</p>}
<div className="grid gap-3">{items.map(l=><Card key={l._id} className="flex flex-wrap items-center justify-between gap-3">
<div className="flex items-center gap-4"><img src={toolImg(l.toolId)} alt="" className="size-16 rounded-2xl object-cover"/><div><h3 className="font-medium">{l.toolName}</h3>
<p className="text-sm text-slate-500">{mode==='lender'?`Requested by ${l.borrowerName}`:`From ${l.lenderName}`}, {l.startDate} to {l.endDate}</p>{l.lastEvent&&<p className={`mt-1 text-xs ${l.lastEvent.status==='sent'?'text-emerald-700':'text-rose-600'}`}>{l.lastEvent.type==='reminder'?'⏰ Reminder':'✉️ Notification'} {l.lastEvent.status==='sent'?'sent':'failed'} {ago(l.lastEvent.at)}</p>}</div></div>
<div className="flex flex-wrap items-center gap-2">{l.overdue&&<Badge s="overdue"/>}<Badge s={l.status}/>
{mode==='lender'&&l.status==='pending'&&<><Btn onClick={()=>run(()=>decide({loanId:l._id as Id<'loans'>,decision:'approve'}))}>Approve</Btn><Btn v="ghost" onClick={()=>run(()=>decide({loanId:l._id as Id<'loans'>,decision:'decline'}))}>Decline</Btn></>}
{mode==='lender'&&l.status==='approved'&&<Btn onClick={()=>run(()=>markReturned({loanId:l._id as Id<'loans'>}))}>Mark returned</Btn>}
{mode==='borrower'&&l.status==='pending'&&<Btn v="danger" onClick={()=>run(()=>cancel({loanId:l._id as Id<'loans'>}))}>Cancel</Btn>}</div></Card>)}</div></>}
