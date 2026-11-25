'use client';
import {useQuery} from 'convex/react';
import {api} from '@convex/_generated/api';
import {useApp} from '@/lib/store';
import {Card,Badge,Btn,Empty,Head} from '@/components/ui';
import Loans from '@/components/loans';
export default function Admin(){const{loans,users,tools,trust,removeTool}=useApp();const me=useQuery(api.users.queries.me);const role=me?.role;
if(role!=='admin')return <Empty text="This area is for admins only."/>;
return <><Head title="Admin" sub="Moderate listings, review all loans, recognise trusted lenders."/>
<h2 className="mb-3 text-xl font-semibold">Lenders</h2><div className="mb-8 grid gap-3 sm:grid-cols-3">{users.map(u=><Card key={u.id} className="flex items-center justify-between"><span className="font-medium">{u.name}</span><span className="flex items-center gap-2">{u.trusted&&<Badge s="trusted"/>}<Btn v="ghost" onClick={()=>trust(u.id)}>{u.trusted?'Remove badge':'Mark trusted'}</Btn></span></Card>)}</div>
<h2 className="mb-3 text-xl font-semibold">All loans</h2><div className="mb-8"><Loans mode="admin" items={loans}/></div>
<h2 className="mb-3 text-xl font-semibold">All listings</h2><div className="grid gap-3 sm:grid-cols-2">{tools.map(t=><Card key={t.id} className="flex items-center justify-between"><span>{t.name}</span><Btn v="danger" onClick={()=>removeTool(t.id)}>Remove</Btn></Card>)}</div></>}
