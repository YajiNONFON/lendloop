'use client';
import {createContext,useContext,useState,ReactNode} from 'react';
import {Tool,Role,Status} from './types';
import {TOOLS,LOANS,USERS} from './mock';
// Data layer on mock data. On back-end day, replace the internals with Convex queries and mutations.
const ME='u1';
function useStore(){
const [tools,setTools]=useState(TOOLS);const [loans,setLoans]=useState(LOANS);const [users,setUsers]=useState(USERS);const [role,setRole]=useState<Role>('admin');
return {me:users.find(u=>u.id===ME)!,role,setRole,tools,loans,users,
busy:(id:string)=>loans.some(l=>l.toolId===id&&l.status==='approved'),
name:(id:string)=>users.find(u=>u.id===id)?.name??'Unknown',
addTool:(t:Omit<Tool,'id'|'ownerId'>)=>setTools(a=>[{...t,id:'t'+Date.now(),ownerId:ME},...a]),
removeTool:(id:string)=>setTools(a=>a.filter(t=>t.id!==id)),
request:(toolId:string,start:string,end:string)=>{const t=tools.find(x=>x.id===toolId);if(t)setLoans(a=>[{id:'l'+Date.now(),toolId,borrowerId:ME,lenderId:t.ownerId,start,end,status:'pending'},...a])},
setStatus:(id:string,status:Status)=>setLoans(a=>a.map(l=>l.id===id?{...l,status}:l)),
trust:(id:string)=>setUsers(a=>a.map(u=>u.id===id?{...u,trusted:!u.trusted}:u))};}
const Ctx=createContext<ReturnType<typeof useStore>|null>(null);
export const StoreProvider=({children}:{children:ReactNode})=><Ctx.Provider value={useStore()}>{children}</Ctx.Provider>;
export const useApp=()=>useContext(Ctx)!;
export const useTools=()=>{const{tools,busy,addTool,removeTool,name}=useApp();return{tools,busy,addTool,removeTool,name}};
export const useLoans=()=>{const{loans,setStatus,request}=useApp();return{loans,setStatus,request}};
