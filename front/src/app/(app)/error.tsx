'use client';
import {RefreshCw} from 'lucide-react';
import {EmptyState} from '@/components/ui';
import {btnClass} from '@/lib/styles';
export default function AppError({reset}:{error:Error;reset:()=>void}){
return <EmptyState icon={RefreshCw} title="Something went wrong" text="We could not load this page. Check your connection and try again." action={<button type="button" onClick={reset} className={btnClass('solid','lg')}>Try again</button>}/>;}
