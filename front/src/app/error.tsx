'use client';
import Link from 'next/link';
// Shown if a screen crashes, for example when the session expired. The user can retry or go home.
export default function Error({reset}:{error:Error;reset:()=>void}){
return <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center"><div className="rounded-[28px] border border-white bg-white/80 p-8 shadow">
<p className="text-4xl">🌿</p><h1 className="mt-3 text-2xl font-medium">Something went wrong</h1>
<p className="mt-2 text-slate-500">Your data is safe. Check your connection and try again.</p>
<div className="mt-5 flex justify-center gap-2"><button onClick={reset} className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white">Try again</button><Link href="/" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-brand ring-1 ring-emerald-100">Home</Link></div></div></main>}
