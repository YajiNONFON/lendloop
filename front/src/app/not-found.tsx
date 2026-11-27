import Link from 'next/link';
export default function NotFound(){
return <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center"><div className="rounded-[28px] border border-white bg-white/80 p-8 shadow">
<p className="text-4xl">🔍</p><h1 className="mt-3 text-2xl font-medium">Page not found</h1>
<p className="mt-2 text-slate-500">This page does not exist.</p>
<Link href="/" className="mt-5 inline-block rounded-full bg-brand px-5 py-2 text-sm font-medium text-white">Back to LendLoop</Link></div></main>}
