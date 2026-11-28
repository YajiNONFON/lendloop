'use client';
import {useState} from 'react';
import {Activity} from 'lucide-react';
const W=640,H=220,L=40,R=12,T=12,B=28;
export default function ActivityChart({data,labels}:{data:number[];labels:string[]}){
const[hover,setHover]=useState<number|null>(null);
const total=data.reduce((a,b)=>a+b,0);const step=Math.max(1,Math.ceil(Math.max(...data,1)/4));const max=step*4;
const x=(i:number)=>L+(i*(W-L-R))/(data.length-1);const y=(v:number)=>T+(1-v/max)*(H-T-B);
const line=data.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ');
return <div className="relative">
<svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Loans per month, ${total} in total this year`}>
<defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0d7a54" stopOpacity=".22"/><stop offset="1" stopColor="#0d7a54" stopOpacity="0"/></linearGradient></defs>
{[0,1,2,3,4].map(k=><g key={k}><line x1={L} x2={W-R} y1={y(k*step)} y2={y(k*step)} stroke="#e2e8f0" strokeDasharray={k?'4 4':undefined}/><text x={L-8} y={y(k*step)+4} textAnchor="end" fontSize="12" fill="#64748b">{k*step}</text></g>)}
{total>0&&<><path d={`${line} L${x(data.length-1)},${y(0)} L${x(0)},${y(0)}Z`} fill="url(#ag)"/><path d={line} fill="none" stroke="#0d7a54" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></>}
{labels.map((l,i)=><text key={l} x={x(i)} y={H-8} textAnchor="middle" fontSize="12" fill="#64748b">{l}</text>)}
{total>0&&hover!==null&&<><line x1={x(hover)} x2={x(hover)} y1={T} y2={y(0)} stroke="#0d7a54" strokeOpacity=".3"/><circle cx={x(hover)} cy={y(data[hover])} r="5" fill="#fff" stroke="#0d7a54" strokeWidth="2.5"/></>}
{data.map((_,i)=><rect key={i} x={x(i)-(W-L-R)/(data.length-1)/2} y={T} width={(W-L-R)/(data.length-1)} height={H-T-B} fill="transparent" tabIndex={0} aria-label={`${labels[i]}: ${data[i]} ${data[i]===1?'loan':'loans'}`} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(i)} onBlur={()=>setHover(null)}/>)}
</svg>
{hover!==null&&total>0&&<div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg" style={{left:`${(x(hover)/W)*100}%`,top:`${(y(data[hover])/H)*100}%`,marginTop:-10}}>{labels[hover]}: {data[hover]} {data[hover]===1?'loan':'loans'}</div>}
{total===0&&<div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-sm"><Activity aria-hidden className="size-4 text-brand"/>No loans yet this year</div></div>}
</div>}
