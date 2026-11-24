'use client';
import {useState} from 'react';
import {useApp} from '@/lib/store';
import {Btn,Modal,Empty,inp} from '@/components/ui';
import {ToolCard,Reminders,Featured} from '@/components/widgets';
import {CATEGORIES,today} from '@/lib/types';
export default function Browse(){const{tools,me,request}=useApp();
const[cat,setCat]=useState('All');const[q,setQ]=useState('');const[sel,setSel]=useState<string|null>(null);const[s,setS]=useState(today());const[e,setE]=useState(today());
const list=tools.filter(t=>(cat==='All'||t.category===cat)&&t.name.toLowerCase().includes(q.toLowerCase()));
return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-4xl font-medium sm:text-5xl">Tools</h1><input value={q} onChange={x=>setQ(x.target.value)} placeholder="Search tools..." aria-label="Search tools" className={inp+' w-full sm:max-w-xs !rounded-full !bg-white !py-3'}/></div>
<div className="mb-5 flex flex-wrap gap-2">{['All',...CATEGORIES].map(c=><button key={c} onClick={()=>setCat(c)} className={`rounded-full px-4 py-2 text-sm ${cat===c?'bg-brand text-white':'bg-white/70 hover:bg-white'}`}>{c}</button>)}</div>
<div className="grid gap-5 xl:grid-cols-[1fr_340px]">{!list.length?<Empty text="No tools match your search. Try another category."/>:<div className="grid content-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">{list.map(t=><ToolCard key={t.id} t={t} action={<Btn disabled={t.ownerId===me.id} onClick={()=>setSel(t.id)}>{t.ownerId===me.id?'Your tool':'Request'}</Btn>}/>)}</div>}
<aside className="grid content-start gap-5"><Reminders/><Featured/></aside></div>
{sel&&<Modal title="Request to borrow" onClose={()=>setSel(null)}><div className="grid gap-3"><label className="text-sm">From<input type="date" min={today()} className={inp} value={s} onChange={x=>setS(x.target.value)}/></label><label className="text-sm">To<input type="date" min={s} className={inp} value={e} onChange={x=>setE(x.target.value)}/></label>
<div className="flex justify-end gap-2"><Btn v="ghost" onClick={()=>setSel(null)}>Cancel</Btn><Btn disabled={e<s||s<today()} onClick={()=>{request(sel,s,e);setSel(null)}}>Send request</Btn></div></div></Modal>}</>}
