'use client';
import {useApp} from '@/lib/store';
import {Card,Badge,Btn,Empty} from './ui';
import {toolImg} from '@/lib/types';
import {Loan,isOverdue} from '@/lib/types';
export default function Loans({items,mode}:{items:Loan[];mode:'borrower'|'lender'|'admin'}){const{tools,name,setStatus}=useApp();
if(!items.length)return <Empty text="Nothing here yet."/>;
return <div className="grid gap-3">{items.map(l=>{const t=tools.find(x=>x.id===l.toolId);return <Card key={l.id} className="flex flex-wrap items-center justify-between gap-3">
<div className="flex items-center gap-4"><img src={toolImg(l.toolId)} alt="" className="size-16 rounded-2xl object-cover"/><div><h3 className="font-medium">{t?.name??'Removed tool'}</h3>
<p className="text-sm text-slate-500">{mode==='lender'?`Requested by ${name(l.borrowerId)}`:mode==='borrower'?`From ${name(l.lenderId)}`:`${name(l.lenderId)} to ${name(l.borrowerId)}`}, {l.start} to {l.end}</p>
{l.reminder&&<p className="mt-1 text-xs text-emerald-700">⏰ {l.reminder}</p>}</div></div>
<div className="flex flex-wrap items-center gap-2">{isOverdue(l)&&<Badge s="overdue"/>}<Badge s={l.status}/>
{mode==='lender'&&l.status==='pending'&&<><Btn onClick={()=>setStatus(l.id,'approved')}>Approve</Btn><Btn v="ghost" onClick={()=>setStatus(l.id,'declined')}>Decline</Btn></>}
{mode==='lender'&&l.status==='approved'&&<Btn onClick={()=>setStatus(l.id,'returned')}>Mark returned</Btn>}</div></Card>})}</div>}
