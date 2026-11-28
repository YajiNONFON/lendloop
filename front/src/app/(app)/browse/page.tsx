'use client';
import {Suspense,useEffect,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {useQuery} from 'convex/react';
import {PackageOpen,Search,SearchX,Send} from 'lucide-react';
import {api} from '@convex/_generated/api';
import {Badge,Btn,EmptyState,GridSkeleton,PageHeader} from '@/components/ui';
import {ToolCard} from '@/components/widgets';
import RequestModal from '@/components/request-modal';
import {Reveal} from '@/components/motion';
import {btnClass} from '@/lib/styles';
import {plural} from '@/lib/format';
import {CATEGORIES} from '@/lib/types';
function BrowseInner(){
const params=useSearchParams();const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');
const[cat,setCat]=useState('All');const[q,setQ]=useState(params.get('q')??'');const[sel,setSel]=useState<{id:string;name:string}|null>(null);const[notice,setNotice]=useState('');
useEffect(()=>{setQ(params.get('q')??'');},[params]);
const list=(tools??[]).filter(t=>(cat==='All'||t.category===cat)&&t.name.toLowerCase().includes(q.toLowerCase()));
return <><PageHeader title="Tools" subtitle="Browse what your neighbours are willing to lend."/>
<div className="relative mb-4"><Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500"/><input value={q} onChange={e=>setQ(e.target.value)} aria-label="Search tools by name" placeholder="Search tools by name" className="min-h-12 w-full rounded-full border border-emerald-200 bg-white pl-12 pr-4 text-base outline-none transition placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/30"/></div>
<div role="group" aria-label="Filter by category" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">{['All',...CATEGORIES].map(c=><button key={c} type="button" aria-pressed={cat===c} onClick={()=>setCat(c)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition ${cat===c?'bg-brand text-white shadow-sm':'bg-white text-slate-700 ring-1 ring-emerald-200 hover:bg-emerald-50'}`}>{c}</button>)}</div>
{notice&&<p role="status" className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-[15px] text-emerald-900">{notice}</p>}
{tools===undefined?<GridSkeleton/>:!tools.length?<EmptyState icon={PackageOpen} title="No tools shared yet" text="Be the first to list a tool and let your neighbours borrow it." action={<Link href="/my-listings" className={btnClass('solid','lg')}>List a tool</Link>}/>
:!list.length?<EmptyState icon={SearchX} title="No tools match your search" text="Try another word or choose a different category." action={<Btn size="lg" onClick={()=>{setQ('');setCat('All');}}>Clear filters</Btn>}/>
:<><p className="mb-4 text-sm text-slate-600">{plural(list.length,'tool')}</p><ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{list.map((t,i)=><li key={t._id}><Reveal i={i} className="h-full"><ToolCard t={t} action={t.isMine?<Badge s="yours" label="Yours"/>:<Btn icon={Send} onClick={()=>{setNotice('');setSel({id:t._id,name:t.name});}}>Request</Btn>}/></Reveal></li>)}</ul></>}
{sel&&<RequestModal toolId={sel.id} toolName={sel.name} onClose={()=>setSel(null)} onDone={()=>{setSel(null);setNotice('Request sent. You can follow it in My requests.');}}/>}</>;}
export default function Browse(){return <Suspense fallback={<GridSkeleton/>}><BrowseInner/></Suspense>;}
