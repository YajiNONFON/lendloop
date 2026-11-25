'use client';
import {useState} from 'react';
import {useMutation} from 'convex/react';
import {ConvexError} from 'convex/values';
import {api} from '@convex/_generated/api';
import type {Id} from '@convex/_generated/dataModel';
import {Btn,Modal,inp} from './ui';
import {today} from '@/lib/types';
export default function RequestModal({toolId,toolName,onClose,onDone}:{toolId:string;toolName:string;onClose:()=>void;onDone:()=>void}){
const request=useMutation(api.loans.mutations.request);const[s,setS]=useState(today());const[e,setE]=useState(today());const[err,setErr]=useState('');const[busy,setBusy]=useState(false);
const send=async()=>{setErr('');setBusy(true);try{await request({toolId:toolId as Id<'tools'>,startDate:s,endDate:e});onDone();}catch(x){setErr(x instanceof ConvexError?String((x.data as {message?:string}).message??'Something went wrong'):'Something went wrong');setBusy(false);}};
return <Modal title={`Borrow: ${toolName}`} onClose={onClose}><div className="grid gap-3">
<label className="text-sm">From<input type="date" min={today()} className={inp} value={s} onChange={x=>setS(x.target.value)}/></label>
<label className="text-sm">To<input type="date" min={s} className={inp} value={e} onChange={x=>setE(x.target.value)}/></label>
{err&&<p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{err}</p>}
<div className="flex justify-end gap-2"><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn disabled={busy||e<s||s<today()} onClick={send}>Send request</Btn></div></div></Modal>}
