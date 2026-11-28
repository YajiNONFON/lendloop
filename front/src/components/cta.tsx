'use client';
import Link from 'next/link';
import {Show,SignInButton} from '@clerk/nextjs';
import {ArrowRight} from 'lucide-react';
export default function Cta({className,label='Sign in to lend or borrow'}:{className:string;label?:string}){return <>
<Show when="signed-out"><SignInButton mode="modal" forceRedirectUrl="/dashboard"><button type="button" className={className}>{label}</button></SignInButton></Show>
<Show when="signed-in"><Link href="/dashboard" className={className}>Open dashboard<ArrowRight aria-hidden className="size-4"/></Link></Show></>}
