'use client';
import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useQuery} from 'convex/react';
import {UserButton} from '@clerk/nextjs';
import {Bell,Inbox,LayoutDashboard,Menu,Package,Search,Send,ShieldCheck,Wrench,X,type LucideIcon} from 'lucide-react';
import {api} from '@convex/_generated/api';
import Logo from './logo';
import {Avatar} from './ui';
const MAIN:[string,string,LucideIcon][]=[['/dashboard','Dashboard',LayoutDashboard],['/browse','Tools',Wrench],['/my-listings','My listings',Package],['/my-requests','My requests',Send],['/incoming','Incoming',Inbox]];
const TITLES:Record<string,string>={'/dashboard':'Dashboard','/browse':'Tools','/my-listings':'My listings','/my-requests':'My requests','/incoming':'Incoming requests','/admin':'Admin'};
function NavLink({href,label,icon:Icon,active,badge}:{href:string;label:string;icon:LucideIcon;active:boolean;badge?:number}){
return <Link href={href} aria-current={active?'page':undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] transition ${active?'bg-brand font-semibold text-white shadow-sm':'font-medium text-slate-700 hover:bg-emerald-50 hover:text-brand-dark'}`}>
<Icon aria-hidden className={`size-5 shrink-0 ${active?'stroke-[2.25]':''}`}/><span className="flex-1">{label}</span>
{!!badge&&<span aria-label={`${badge} pending`} className={`grid min-w-6 place-items-center rounded-full px-1.5 text-[13px] font-semibold ${active?'bg-white text-brand-dark':'bg-rose-600 text-white'}`}>{badge}</span>}</Link>;}
export default function AppShell({children}:{children:ReactNode}){
const pathname=usePathname();const router=useRouter();
const me=useQuery(api.users.queries.me);const loans=useQuery(api.loans.queries.listMine,me?{}:'skip');
const pending=(loans??[]).filter(l=>l.role==='lender'&&l.status==='pending').length;const isAdmin=me?.role==='admin';
const[open,setOpen]=useState(false);const burger=useRef<HTMLButtonElement>(null);const[q,setQ]=useState('');
useEffect(()=>{setOpen(false);},[pathname]);
useEffect(()=>{if(!open)return;document.body.style.overflow='hidden';
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);burger.current?.focus();}};document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow='';document.removeEventListener('keydown',key);};},[open]);
const submit=(e:FormEvent)=>{e.preventDefault();router.push(q.trim()?`/browse?q=${encodeURIComponent(q.trim())}`:'/browse');};
return <div className="min-h-screen">
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
{open&&<div className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-sm lg:hidden" onClick={()=>setOpen(false)} aria-hidden/>}
<aside id="sidebar" aria-label="Sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-emerald-900/5 bg-white px-4 py-5 transition-transform duration-300 lg:visible lg:w-64 lg:translate-x-0 ${open?'translate-x-0':'invisible -translate-x-full'}`}>
<div className="mb-6 flex items-center justify-between px-1"><Link href="/" aria-label="LendLoop home"><Logo/></Link>
<button type="button" aria-label="Close navigation" onClick={()=>{setOpen(false);burger.current?.focus();}} className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 lg:hidden"><X aria-hidden className="size-5"/></button></div>
<nav aria-label="Main" className="grid gap-1">{MAIN.map(([h,l,I])=><NavLink key={h} href={h} label={l} icon={I} active={pathname===h} badge={h==='/incoming'?pending:undefined}/>)}</nav>
{isAdmin&&<div className="mt-6"><p className="mb-2 px-3.5 text-[13px] font-semibold uppercase tracking-wide text-slate-500">Admin</p><NavLink href="/admin" label="Admin" icon={ShieldCheck} active={pathname==='/admin'}/></div>}
<div className="mt-auto flex items-center gap-3 rounded-2xl bg-emerald-50 p-3"><UserButton/><span className="min-w-0 text-sm leading-tight"><b className="block truncate font-semibold">{me?.name??'...'}</b><span className="text-slate-600">{isAdmin?'Admin':'Member'}</span></span></div></aside>
<div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-emerald-900/5 bg-cream/85 px-4 backdrop-blur sm:px-6 lg:px-8">
<button ref={burger} type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="sidebar" onClick={()=>setOpen(true)} className="grid size-11 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-emerald-100 lg:hidden"><Menu aria-hidden className="size-5"/></button>
<p className="hidden text-base font-semibold sm:block">{TITLES[pathname]??'LendLoop'}</p>
<form onSubmit={submit} role="search" className="relative ml-auto w-full max-w-sm"><Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"/><input value={q} onChange={e=>setQ(e.target.value)} aria-label="Search tools" placeholder="Search tools" className="min-h-11 w-full rounded-full border border-emerald-200 bg-white pl-10 pr-4 text-[15px] outline-none placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/30"/></form>
<Link href="/incoming" aria-label={pending?`Incoming requests, ${pending} pending`:'Incoming requests'} className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white text-slate-700 ring-1 ring-emerald-100 transition hover:bg-emerald-50"><Bell aria-hidden className="size-5"/>{pending>0&&<span aria-hidden className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-rose-600 text-[13px] font-semibold text-white">{pending}</span>}</Link>
<span className="hidden sm:block"><Avatar n={me?.name??'?'} size="size-10"/></span></header>
<main id="main" className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main></div></div>;}
