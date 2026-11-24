import {Tool,Loan} from './types';
const d=(n:number)=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
export const USERS=[{id:'u1',name:'Awa Mensah',trusted:true},{id:'u2',name:'Koffi Adjovi',trusted:false},{id:'u3',name:'Nadia Bello',trusted:false}];
export const TOOLS:Tool[]=[
{id:'t1',ownerId:'u1',name:'Cordless drill',category:'Power tools',condition:'Like new',description:'18V drill with two batteries and a bit set.'},
{id:'t2',ownerId:'u2',name:'Hedge trimmer',category:'Garden',condition:'Good',description:'Electric, 60 cm blade.'},
{id:'t3',ownerId:'u3',name:'Camping tent (4 people)',category:'Camping',condition:'Good',description:'Easy setup, comes with a carry bag.'},
{id:'t4',ownerId:'u1',name:'Stand mixer',category:'Kitchen',condition:'Fair',description:'5L bowl with three attachments.'},
{id:'t5',ownerId:'u2',name:'Pressure washer',category:'Cleaning',condition:'Good',description:'Great for terraces and cars.'},
{id:'t6',ownerId:'u3',name:'Ladder 3 m',category:'Other',condition:'Good',description:'Aluminium, folds flat.'}];
export const LOANS:Loan[]=[
{id:'l1',toolId:'t1',borrowerId:'u2',lenderId:'u1',start:d(-6),end:d(-2),status:'approved',reminder:'Reminder sent 1 day ago'},
{id:'l2',toolId:'t4',borrowerId:'u3',lenderId:'u1',start:d(2),end:d(5),status:'pending'},
{id:'l3',toolId:'t2',borrowerId:'u1',lenderId:'u2',start:d(1),end:d(3),status:'approved'},
{id:'l4',toolId:'t3',borrowerId:'u1',lenderId:'u3',start:d(8),end:d(10),status:'pending'}];
