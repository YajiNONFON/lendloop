'use client';
import {useApp} from '@/lib/store';
import {Head} from '@/components/ui';
import Loans from '@/components/loans';
export default function Incoming(){const{loans,me}=useApp();return <><Head title="Incoming requests" sub="Neighbours asking to borrow your tools."/><Loans mode="lender" items={loans.filter(l=>l.lenderId===me.id)}/></>}
