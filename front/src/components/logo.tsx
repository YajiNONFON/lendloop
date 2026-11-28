import {Repeat2} from 'lucide-react';
export default function Logo({light=false}:{light?:boolean}){
return <span className={`flex items-center gap-2.5 text-xl font-semibold tracking-tight ${light?'text-white':'text-slate-900'}`}><span className={`grid size-10 place-items-center rounded-xl ${light?'bg-white text-brand':'bg-brand text-white'}`}><Repeat2 aria-hidden className="size-5"/></span>LendLoop</span>}
