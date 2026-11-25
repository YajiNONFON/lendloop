'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useQuery} from 'convex/react';
import {UserButton} from '@clerk/nextjs';
import {api} from '@convex/_generated/api';
const L=[['/dashboard','Dashboard','🏠','Home'],['/browse','Tools','🔧','Tools'],['/my-listings','My listings','📋','Listings'],['/my-requests','My requests','📤','Requests'],['/incoming','Incoming','📥','Incoming']];
export default function Nav(){const p=usePathname();const me=useQuery(api.users.queries.me);const links=me?.role==='admin'?[...L,['/admin','Admin','🛡','Admin']]:L;
return <>
<header className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 md:px-5 md:py-5">
<Link href="/" className="flex items-center gap-2 text-lg font-medium md:mr-3 md:text-xl"><span className="grid size-9 place-items-center rounded-xl bg-brand text-white md:size-10">↻</span>LendLoop</Link>
<nav aria-label="Main" className="hidden flex-wrap gap-2 md:flex">{links.map(([h,t])=><Link key={h} href={h} className={`rounded-full px-5 py-3 text-sm font-medium transition ${p===h?'bg-brand text-white shadow-md':'bg-white/70 hover:bg-white'}`}>{t}</Link>)}</nav>
<div className="ml-auto flex items-center gap-3"><Link href="/browse" aria-label="Search tools" className="hidden size-11 place-items-center rounded-full bg-white/80 md:grid">🔍</Link>
<span className="hidden text-right text-sm leading-tight md:block"><b className="block font-medium">{me?.name??'...'}</b><span className="text-slate-500">{me?.role==='admin'?'Admin':'Member'}</span></span><UserButton/></div></header>
<nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-emerald-900/10 bg-white/95 px-1 pt-2 backdrop-blur md:hidden" style={{paddingBottom:'max(0.5rem,env(safe-area-inset-bottom))'}}>{links.map(([h,,e,s])=><Link key={h} href={h} aria-current={p===h?'page':undefined} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] ${p===h?'bg-emerald-50 font-medium text-brand':'text-slate-500'}`}><span className="text-xl leading-none">{e}</span>{s}</Link>)}</nav></>}
