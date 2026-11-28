'use client';
import {useQuery} from 'convex/react';
import {PackageOpen} from 'lucide-react';
import {api} from '@convex/_generated/api';
import ToolImage from './tool-image';
import {Reveal} from './motion';
import {EmptyState,Skeleton} from './ui';
import {btnClass} from '@/lib/styles';
import Cta from './cta';
export default function PublicTools(){const tools=useQuery(api.tools.queries.listPublic);
if(tools===undefined)return <div role="status" aria-label="Loading" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map(i=><Skeleton key={i} className="h-56"/>)}</div>;
if(!tools.length)return <EmptyState icon={PackageOpen} title="No tools shared yet" text="Be the first neighbour to list a tool and get the loop started." action={<Cta className={btnClass('solid','lg')}/>}/>;
return <ul className="flex flex-wrap justify-center gap-4">{tools.map((t,i)=><li key={t._id} className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"><Reveal inView i={i}>
<div className="overflow-hidden rounded-3xl border border-emerald-900/5 bg-white p-3 shadow-[0_10px_28px_rgba(15,60,40,.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,60,40,.10)]"><ToolImage tool={t}/>
<div className="px-2 pb-2 pt-4"><p className="text-lg font-semibold">{t.name}</p><p className="text-sm text-slate-600">{t.category}</p></div></div></Reveal></li>)}</ul>;}
