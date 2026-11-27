'use client';
import {useState} from 'react';
import {useMutation,useQuery} from 'convex/react';
import {ConvexError} from 'convex/values';
import {api} from '@convex/_generated/api';
import {Card,Badge,Btn,Empty,Head} from '@/components/ui';
import LoanList from '@/components/loan-list';
export default function Admin(){const me=useQuery(api.users.queries.me);const isAdmin=me?.role==='admin';
const users=useQuery(api.users.queries.listAll,isAdmin?{}:'skip');const loans=useQuery(api.loans.queries.listAll,isAdmin?{}:'skip');const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');
const setTrusted=useMutation(api.users.mutations.setTrusted);const remove=useMutation(api.tools.mutations.remove);const[err,setErr]=useState('');
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
if(me===undefined)return <Empty text="Loading..."/>;
if(!isAdmin)return <Empty text="This area is for admins only."/>;
return <><Head title="Admin" sub="Moderate listings, review all loans, recognise trusted lenders."/>
{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{err}</p>}
<h2 className="mb-3 text-xl font-medium">Lenders</h2>
<div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(users??[]).map(u=><Card key={u._id} className="flex items-center justify-between gap-2"><span className="min-w-0"><b className="block truncate font-medium">{u.name}</b><span className="text-xs text-slate-400">{u.role}</span></span><span className="flex items-center gap-2">{u.trustedLender&&<Badge s="trusted"/>}<Btn v="ghost" onClick={()=>run(()=>setTrusted({userId:u._id,trusted:!u.trustedLender}))}>{u.trustedLender?'Remove badge':'Mark trusted'}</Btn></span></Card>)}</div>
<h2 className="mb-3 text-xl font-medium">All loans</h2><div className="mb-8"><LoanList mode="admin" items={loans}/></div>
<h2 className="mb-3 text-xl font-medium">All listings</h2>
{tools===undefined?<Empty text="Loading..."/>:!tools.length?<Empty text="No listings yet."/>:<div className="grid gap-3 sm:grid-cols-2">{tools.map(t=><Card key={t._id} className="flex items-center justify-between gap-2"><span className="min-w-0"><b className="block truncate font-medium">{t.name}</b><span className="text-xs text-slate-400">by {t.ownerName}</span></span><Btn v="danger" onClick={()=>run(()=>remove({toolId:t._id}))}>Remove</Btn></Card>)}</div>}</>}
