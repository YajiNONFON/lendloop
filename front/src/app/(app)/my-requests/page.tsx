'use client';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {Head} from '@/components/ui';
import LoanList from '@/components/loan-list';
export default function MyRequests(){const me=useQuery(api.users.queries.me);const loans=useQuery(api.loans.queries.listMine,me?{}:'skip');
return <><Head title="My requests" sub="Tools you asked to borrow."/><LoanList mode="borrower" items={loans?.filter(l=>l.role==='borrower')}/></>}
