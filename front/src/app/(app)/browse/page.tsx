'use client';
import {useState} from 'react';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {Btn,Empty,inp} from '@/components/ui';
import {ToolCard,Reminders} from '@/components/widgets';
import {CATEGORIES} from '@/lib/types';
export default function Browse(){const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');
const[cat,setCat]=useState('All');const[q,setQ]=useState('');
const list=(tools??[]).filter(t=>(cat==='All'||t.category===cat)&&t.name.toLowerCase().includes(q.toLowerCase()));
return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h1 className="text-4xl font-medium sm:text-5xl">Tools</h1><input value={q} onChange={x=>setQ(x.target.value)} placeholder="Search tools..." aria-label="Search tools" className={inp+' w-full sm:max-w-xs !rounded-full !bg-white !py-3'}/></div>
<div className="mb-5 flex flex-wrap gap-2">{['All',...CATEGORIES].map(c=><button key={c} onClick={()=>setCat(c)} className={`rounded-full px-4 py-2 text-sm ${cat===c?'bg-brand text-white':'bg-white/70 hover:bg-white'}`}>{c}</button>)}</div>
<div className="grid gap-5 xl:grid-cols-[1fr_340px]">
{tools===undefined?<Empty text="Loading tools..."/>:!list.length?<Empty text="No tools match. Try another category, or list your own."/>:<div className="grid content-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">{list.map(t=><ToolCard key={t._id} t={t} action={<Btn disabled title="Borrow requests arrive in the next release">{t.isMine?'Your tool':'Request'}</Btn>}/>)}</div>}
<aside className="grid content-start gap-5"><Reminders/></aside></div></>}
