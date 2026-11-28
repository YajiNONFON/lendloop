'use client';
import {useState} from 'react';
import {useMutation,useQuery} from 'convex/react';
import {ConvexError} from 'convex/values';
import {BadgeCheck,PackageOpen,ShieldCheck,Trash2} from 'lucide-react';
import {api} from '@convex/_generated/api';
import type {Id} from '@convex/_generated/dataModel';
import {Avatar,Badge,Btn,Card,ConfirmDialog,EmptyState,PageHeader,Skeleton} from '@/components/ui';
import LoanList from '@/components/loan-list';
import ToolImage from '@/components/tool-image';
import {Reveal} from '@/components/motion';
export default function Admin(){
const me=useQuery(api.users.queries.me);const isAdmin=me?.role==='admin';
const users=useQuery(api.users.queries.listAll,isAdmin?{}:'skip');const loans=useQuery(api.loans.queries.listAll,isAdmin?{}:'skip');const tools=useQuery(api.tools.queries.listAll,me?{}:'skip');
const setTrusted=useMutation(api.users.mutations.setTrusted);const remove=useMutation(api.tools.mutations.remove);
const[err,setErr]=useState('');const[del,setDel]=useState<{id:Id<'tools'>;name:string}|null>(null);
const run=async(f:()=>Promise<unknown>)=>{setErr('');try{await f();}catch(e){setErr(e instanceof ConvexError?String((e.data as {message?:string}).message??'Something went wrong'):'Something went wrong');}};
if(me===undefined)return <div role="status" aria-label="Loading" className="grid gap-4"><Skeleton className="h-12 w-64"/><Skeleton className="h-40"/><Skeleton className="h-40"/></div>;
if(!isAdmin)return <EmptyState icon={ShieldCheck} title="Admins only" text="You need an admin role to see this area."/>;
return <><PageHeader title="Admin" subtitle="Moderate listings, review all loans and recognise trusted lenders."/>
{err&&<p role="alert" className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-[15px] text-rose-800">{err}</p>}
<section aria-labelledby="lenders" className="mb-10"><h2 id="lenders" className="mb-4 text-xl font-semibold">Lenders</h2>
{users===undefined?<Skeleton className="h-24"/>:<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{users.map((u,i)=><li key={u._id}><Reveal i={i} className="h-full"><Card hover className="flex h-full items-center justify-between gap-3 !p-4">
<span className="flex min-w-0 items-center gap-3"><Avatar n={u.name}/><span className="min-w-0"><b className="block truncate font-semibold">{u.name}</b><span className="text-sm capitalize text-slate-600">{u.role}</span></span></span>
<span className="flex flex-wrap items-center justify-end gap-2">{u.trustedLender&&<Badge s="trusted" label="Trusted"/>}<Btn v="ghost" icon={BadgeCheck} onClick={()=>run(()=>setTrusted({userId:u._id,trusted:!u.trustedLender}))}>{u.trustedLender?'Remove badge':'Mark trusted'}</Btn></span></Card></Reveal></li>)}</ul>}</section>
<section aria-labelledby="loans" className="mb-10"><h2 id="loans" className="mb-4 text-xl font-semibold">All loans</h2><LoanList mode="admin" items={loans}/></section>
<section aria-labelledby="listings"><h2 id="listings" className="mb-4 text-xl font-semibold">All listings</h2>
{tools===undefined?<Skeleton className="h-24"/>:!tools.length?<EmptyState icon={PackageOpen} title="No listings yet" text="Tools listed by neighbours will appear here."/>
:<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tools.map((t,i)=><li key={t._id}><Reveal i={i} className="h-full"><Card hover className="flex h-full items-center justify-between gap-3 !p-4"><span className="flex min-w-0 items-center gap-3"><ToolImage tool={t} variant="thumb"/><span className="min-w-0"><b className="block truncate font-semibold">{t.name}</b><span className="text-sm text-slate-600">by {t.ownerName}</span></span></span>
<Btn v="danger" icon={Trash2} aria-label={`Remove ${t.name}`} onClick={()=>setDel({id:t._id as Id<'tools'>,name:t.name})}>Remove</Btn></Card></Reveal></li>)}</ul>}</section>
{del&&<ConfirmDialog title="Remove this listing?" message={`${del.name} will be removed for everyone. Its loan history is kept.`} confirmLabel="Remove listing" onClose={()=>setDel(null)} onConfirm={()=>{const id=del.id;setDel(null);run(()=>remove({toolId:id}));}}/>}</>;}
