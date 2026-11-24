'use client';
import {useState} from 'react';
import {Modal,Btn,inp} from './ui';
import {CATEGORIES,Tool} from '@/lib/types';
export default function ToolForm({onClose,onSave}:{onClose:()=>void;onSave:(t:Omit<Tool,'id'|'ownerId'>)=>void}){
const[f,setF]=useState({name:'',category:CATEGORIES[0],condition:'Good',description:''});const set=(k:string,v:string)=>setF({...f,[k]:v});
return <Modal title="List a tool" onClose={onClose}><div className="grid gap-3">
<input className={inp} placeholder="Name" value={f.name} onChange={e=>set('name',e.target.value)}/>
<select className={inp} value={f.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
<select className={inp} value={f.condition} onChange={e=>set('condition',e.target.value)}>{['Like new','Good','Fair'].map(c=><option key={c}>{c}</option>)}</select>
<textarea className={inp} rows={3} placeholder="Short description" value={f.description} onChange={e=>set('description',e.target.value)}/>
<div className="flex justify-end gap-2"><Btn v="ghost" onClick={onClose}>Cancel</Btn><Btn disabled={!f.name.trim()} onClick={()=>{onSave(f);onClose()}}>Publish</Btn></div></div></Modal>}
