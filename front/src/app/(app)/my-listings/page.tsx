'use client';
import {useState} from 'react';
import {useMutation,useQuery} from 'convex/react';
import {ConvexError} from 'convex/values';
import {PackageOpen,Plus,Trash2} from 'lucide-react';
import {api} from '@convex/_generated/api';
import type {Id} from '@convex/_generated/dataModel';
import {Btn,ConfirmDialog,EmptyState,GridSkeleton,PageHeader} from '@/components/ui';
import {ToolCard} from '@/components/widgets';
import {Reveal} from '@/components/motion';
import ToolForm from '@/components/forms';
export default function MyListings(){const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listMine,me?{}:'skip');
const create=useMutation(api.tools.mutations.create);const remove=useMutation(api.tools.mutations.remove);
const[open,setOpen]=useState(false);const[err,setErr]=useState('');const[del,setDel]=useState<{id:string;name:string}|null>(null);
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
const add=<Btn size="lg" icon={Plus} onClick={()=>setOpen(true)}>List a tool</Btn>;
return <><PageHeader title="My listings" subtitle="Tools you share with the neighbourhood." action={add}/>
{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-[15px] text-rose-800">{err}</p>}
{tools===undefined?<GridSkeleton count={4}/>:!tools.length?<EmptyState icon={PackageOpen} title="You have not listed any tool yet" text="List your first tool so your neighbours can borrow it." action={add}/>
:<ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{tools.map((t,i)=><li key={t._id}><Reveal i={i} className="h-full"><ToolCard t={t} action={<Btn v="danger" icon={Trash2} aria-label={`Delete ${t.name}`} onClick={()=>setDel({id:t._id,name:t.name})}>Delete</Btn>}/></Reveal></li>)}</ul>}
{open&&<ToolForm onClose={()=>setOpen(false)} onSave={t=>run(()=>create(t))}/>}
{del&&<ConfirmDialog title="Delete this tool?" message={`${del.name} will no longer be listed. Its loan history is kept.`} confirmLabel="Delete tool" onClose={()=>setDel(null)} onConfirm={()=>{const id=del.id;setDel(null);run(()=>remove({toolId:id as Id<'tools'>}));}}/>}</>;}
