'use client';
import Link from 'next/link';
import {RefreshCw} from 'lucide-react';
import {btnClass} from '@/lib/styles';
// Shown if a public page crashes. The user can retry or go home.
export default function Error({reset}:{error:Error;reset:()=>void}){
return <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 text-center"><div className="rounded-3xl border border-emerald-900/5 bg-white p-8 shadow">
<span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-brand"><RefreshCw aria-hidden className="size-8"/></span>
<h1 className="mt-5 text-2xl font-semibold">Something went wrong</h1><p className="mt-2 text-[15px] text-slate-600">Check your connection and try again.</p>
<div className="mt-6 flex flex-wrap justify-center gap-2"><button type="button" onClick={reset} className={btnClass('solid','lg')}>Try again</button><Link href="/" className={btnClass('ghost','lg')}>Home</Link></div></div></main>;}
