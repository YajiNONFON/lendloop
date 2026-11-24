'use client';
import {useApp} from '@/lib/store';
import {Head} from '@/components/ui';
import Loans from '@/components/loans';
export default function MyRequests(){const{loans,me}=useApp();return <><Head title="My requests" sub="Tools you asked to borrow."/><Loans mode="borrower" items={loans.filter(l=>l.borrowerId===me.id)}/></>}
