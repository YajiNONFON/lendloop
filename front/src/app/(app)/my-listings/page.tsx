'use client';
import {useState} from 'react';
import {useMutation,useQuery} from 'convex/react';
import {ConvexError} from 'convex/values';
import {api} from '@convex/_generated/api';
import {Btn,Empty,Head} from '@/components/ui';
import {ToolCard} from '@/components/widgets';
import ToolForm from '@/components/forms';
export default function MyListings(){const me=useQuery(api.users.queries.me);const tools=useQuery(api.tools.queries.listMine,me?{}:'skip');
const create=useMutation(api.tools.mutations.create);const remove=useMutation(api.tools.mutations.remove);
const[open,setOpen]=useState(false);const[err,setErr]=useState('');
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
return <><Head title="My listings" sub="Tools you share with the neighbourhood."><Btn onClick={()=>setOpen(true)}>List a tool</Btn></Head>
{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{err}</p>}
{tools===undefined?<Empty text="Loading your tools..."/>:!tools.length?<Empty text="You haven’t listed anything yet. List your first tool."/>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{tools.map(t=><ToolCard key={t._id} t={t} action={<Btn v="danger" onClick={()=>run(()=>remove({toolId:t._id}))}>Delete</Btn>}/>)}</div>}
{open&&<ToolForm onClose={()=>setOpen(false)} onSave={t=>run(()=>create(t))}/>}</>}
