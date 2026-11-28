import Image from 'next/image';
import Link from 'next/link';
import {BadgeCheck,Bell,Clock,Handshake,ListPlus,ShieldCheck,Undo2} from 'lucide-react';
import Cta from '@/components/cta';
import Logo from '@/components/logo';
import PublicTools from '@/components/public-tools';
import {Reveal} from '@/components/motion';
import {btnClass} from '@/lib/styles';
import {BLUR_DATA_URL,LANDING_IMAGES} from '@/config/images';
const STEPS=[
 {icon:ListPlus,title:'List a tool',text:'Add what sits in your garage with its category and condition, in under a minute.',src:LANDING_IMAGES.howList,alt:'A neighbour holding a cordless drill and a toolbox in a tool library',pos:'object-top'},
 {icon:Handshake,title:'Request and agree',text:'Pick your dates. The owner approves or declines, and both of you are notified.',src:LANDING_IMAGES.howRequest,alt:'Two neighbours smiling with a ladder, a hammer and a drill',pos:'object-center'},
 {icon:Undo2,title:'Return and repeat',text:'Mark the loan as returned. If it runs late, a friendly reminder goes out automatically.',src:LANDING_IMAGES.howReturn,alt:'A smiling volunteer putting a power tool back on a shelf',pos:'object-center'}];
const TRUST=[
 {icon:ShieldCheck,title:'Role-based access',text:'Every action is checked on the server, not just in the interface.'},
 {icon:Bell,title:'Automatic notifications',text:'Each request and decision reaches the right person.'},
 {icon:Clock,title:'Overdue reminders',text:'A daily check nudges borrowers before it becomes awkward.'},
 {icon:BadgeCheck,title:'Trusted lenders',text:'Reliable lenders earn a badge that others can see.'}];
export default function Home(){return <div className="min-h-screen">
<header className="sticky top-0 z-30 border-b border-emerald-900/5 bg-cream/85 backdrop-blur"><div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
<Link href="/" aria-label="LendLoop home"><Logo/></Link>
<nav aria-label="Sections" className="hidden items-center gap-8 text-[15px] font-medium text-slate-700 md:flex"><a className="hover:text-brand-dark" href="#how">How it works</a><a className="hover:text-brand-dark" href="#trust">Why LendLoop</a><a className="hover:text-brand-dark" href="#tools">Shared tools</a></nav>
<Cta className={btnClass('solid')} label="Sign in"/></div></header>
<main>
<section className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
<Reveal><span className="inline-flex rounded-full bg-lime/70 px-4 py-1.5 text-sm font-medium text-emerald-950">Neighbourhood tool lending</span>
<h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Borrow what you need. Lend what you don’t.</h1>
<p className="mt-5 max-w-xl text-lg text-slate-600">List the tools sitting in your garage, request what you need from a neighbour, and let automatic reminders do the chasing. Fewer purchases, more community.</p>
<div className="mt-8 flex flex-wrap items-center gap-3"><Cta className={btnClass('solid','lg')}/><a href="#how" className={btnClass('ghost','lg')}>See how it works</a></div></Reveal>
<Reveal i={2}><div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(15,60,40,.18)]"><Image src={LANDING_IMAGES.hero} alt="A neighbour handing a toolbox to another neighbour at her front door" fill priority sizes="(min-width:1024px) 600px,100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover object-center"/></div></Reveal></section>
<section id="how" className="mx-auto max-w-[1280px] scroll-mt-20 px-4 py-12 sm:px-6"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2><p className="mt-2 max-w-2xl text-[17px] text-slate-600">Three simple steps between your garage and your neighbour’s project.</p>
<ol className="mt-8 grid gap-5 md:grid-cols-3">{STEPS.map((s,i)=><li key={s.title}><Reveal inView i={i} className="h-full"><div className="h-full overflow-hidden rounded-3xl border border-emerald-900/5 bg-white shadow-[0_10px_28px_rgba(15,60,40,.05)]">
<div className="relative aspect-[3/2] w-full"><Image src={s.src} alt={s.alt} fill sizes="(min-width:768px) 33vw,100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className={`object-cover ${s.pos}`}/></div>
<div className="p-6"><span className="grid size-11 place-items-center rounded-2xl bg-lime/60 text-emerald-900"><s.icon aria-hidden className="size-5"/></span><h3 className="mt-4 text-xl font-semibold">{i+1}. {s.title}</h3><p className="mt-1.5 text-[15px] text-slate-600">{s.text}</p></div></div></Reveal></li>)}</ol></section>
<section id="trust" className="mx-auto max-w-[1280px] scroll-mt-20 px-4 py-12 sm:px-6"><div className="rounded-[2rem] bg-brand-dark px-6 py-10 text-white sm:px-10 sm:py-14">
<h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Built so neighbours can trust each other</h2>
<ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{TRUST.map((t,i)=><li key={t.title}><Reveal inView i={i} className="h-full"><div className="h-full rounded-3xl bg-white/10 p-6 ring-1 ring-white/10"><span className="grid size-11 place-items-center rounded-2xl bg-lime text-emerald-950"><t.icon aria-hidden className="size-5"/></span>
<h3 className="mt-4 text-lg font-semibold">{t.title}</h3><p className="mt-1.5 text-[15px] text-emerald-50">{t.text}</p></div></Reveal></li>)}</ul></div></section>
<section id="tools" className="mx-auto max-w-[1280px] scroll-mt-20 px-4 py-12 sm:px-6"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Shared in your neighbourhood</h2><p className="mb-8 mt-2 text-[17px] text-slate-600">Tools available to borrow right now.</p><PublicTools/></section>
<section className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 sm:px-6"><div className="relative isolate flex min-h-[380px] items-center overflow-hidden rounded-[2rem]">
<Image src={LANDING_IMAGES.ctaBanner} alt="A cordless drill, a toolbox and a tape measure on a workbench" fill sizes="(min-width:1280px) 1280px,100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="-z-20 object-cover object-right"/>
<div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/90 via-emerald-950/65 to-emerald-950/10"/>
<div className="max-w-xl px-6 py-12 text-white sm:px-12"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to borrow your next tool?</h2><p className="mt-3 text-[17px] text-emerald-50">Join your neighbours in a few clicks.</p>
<div className="mt-7"><Cta className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-brand-dark transition hover:bg-emerald-50"/></div></div></div></section></main>
<footer className="border-t border-emerald-900/5"><div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-slate-600 sm:px-6"><span>© 2026 LendLoop</span><span>Borrow what you need. Lend what you don’t.</span></div></footer></div>;}
