'use client';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {PageHeader} from '@/components/ui';
import LoanList from '@/components/loan-list';
export default function Incoming(){const me=useQuery(api.users.queries.me);const loans=useQuery(api.loans.queries.listMine,me?{}:'skip');
return <><PageHeader title="Incoming requests" subtitle="Neighbours asking to borrow your tools."/><LoanList mode="lender" items={loans?.filter(l=>l.role==='lender')}/></>;}
