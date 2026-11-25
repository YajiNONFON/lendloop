'use client';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {toolImg} from '@/lib/types';
export default function PublicTools(){const tools=useQuery(api.tools.queries.listPublic);
if(tools===undefined)return <p className="text-slate-500">Loading tools...</p>;
if(!tools.length)return <p className="rounded-3xl bg-white/80 p-8 text-center text-slate-500">🌱 No tools shared yet. Sign in and list the first one.</p>;
return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map(t=><div key={t._id} className="flex items-center gap-4 rounded-3xl border border-white bg-white/80 p-3"><img src={toolImg(t._id)} alt="" className="size-20 rounded-2xl object-cover"/><div><p className="font-medium">{t.name}</p><p className="text-sm text-slate-500">{t.category}</p></div></div>)}</div>}
