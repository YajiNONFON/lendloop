import Link from 'next/link';
import {SearchX} from 'lucide-react';
import {btnClass} from '@/lib/styles';
export default function NotFound(){
return <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 text-center"><div className="rounded-3xl border border-emerald-900/5 bg-white p-8 shadow">
<span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-brand"><SearchX aria-hidden className="size-8"/></span>
<h1 className="mt-5 text-2xl font-semibold">Page not found</h1><p className="mt-2 text-[15px] text-slate-600">This page does not exist.</p>
<Link href="/" className={`${btnClass('solid','lg')} mt-6`}>Back to LendLoop</Link></div></main>;}
