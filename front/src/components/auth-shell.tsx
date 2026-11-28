import type {ReactNode} from 'react';
import Logo from './logo';
export default function AuthShell({children}:{children:ReactNode}){
return <div className="grid min-h-screen lg:grid-cols-2">
<div className="flex flex-col justify-between bg-brand px-6 py-8 text-white sm:px-10 lg:py-12"><Logo light/>
<div className="py-10 lg:py-0"><h1 className="max-w-md text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">Borrow what you need. Lend what you don’t.</h1>
<p className="mt-4 max-w-md text-[17px] text-emerald-50">The neighbourhood tool library. List what sits in your garage, request what you need from a neighbour.</p></div>
<p className="hidden text-sm text-emerald-100 lg:block">© 2026 LendLoop</p></div>
<div className="grid place-items-center px-4 py-10">{children}</div></div>;}
