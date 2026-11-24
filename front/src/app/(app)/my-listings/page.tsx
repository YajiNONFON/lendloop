'use client';
import {useState} from 'react';
import {useApp} from '@/lib/store';
import {Btn,Empty,Head} from '@/components/ui';
import {ToolCard} from '@/components/widgets';
import ToolForm from '@/components/forms';
export default function MyListings(){const{tools,me,addTool,removeTool}=useApp();const[open,setOpen]=useState(false);const mine=tools.filter(t=>t.ownerId===me.id);
return <><Head title="My listings" sub="Tools you share with the neighbourhood."><Btn onClick={()=>setOpen(true)}>List a tool</Btn></Head>
{!mine.length?<Empty text="You haven’t listed anything yet. List your first tool."/>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{mine.map(t=><ToolCard key={t.id} t={t} action={<Btn v="danger" onClick={()=>removeTool(t.id)}>Delete</Btn>}/>)}</div>}
{open&&<ToolForm onClose={()=>setOpen(false)} onSave={addTool}/>}</>}
