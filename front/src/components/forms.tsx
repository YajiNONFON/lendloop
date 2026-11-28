'use client';
import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Modal,Btn,inp} from './ui';
import {CATEGORIES,ToolInput} from '@/lib/types';
export default function ToolForm({onClose,onSave}:{onClose:()=>void;onSave:(t:ToolInput)=>void}){
const[f,setF]=useState({name:'',category:CATEGORIES[0],condition:'Good',description:''});const set=(k:string,v:string)=>setF({...f,[k]:v});
return <Modal title="List a tool" onClose={onClose}><div className="grid gap-4">
<label className="grid gap-1.5 text-sm font-medium text-slate-700">Name<input className={inp} placeholder="Cordless drill" maxLength={80} value={f.name} onChange={e=>set('name',e.target.value)}/></label>
<div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-medium text-slate-700">Category<select className={inp} value={f.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
<label className="grid gap-1.5 text-sm font-medium text-slate-700">Condition<select className={inp} value={f.condition} onChange={e=>set('condition',e.target.value)}>{['Like new','Good','Fair'].map(c=><option key={c}>{c}</option>)}</select></label></div>
<label className="grid gap-1.5 text-sm font-medium text-slate-700">Short description<textarea className={`${inp} py-2.5`} rows={3} maxLength={300} placeholder="What is it, what comes with it?" value={f.description} onChange={e=>set('description',e.target.value)}/></label>
<div className="flex flex-wrap justify-end gap-2"><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn icon={Plus} disabled={!f.name.trim()} onClick={()=>{onSave(f);onClose();}}>Publish</Btn></div></div></Modal>;}
