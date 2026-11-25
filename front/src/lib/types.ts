export type Role='user'|'admin';
export type Status='pending'|'approved'|'declined'|'returned';
export interface Tool{id:string;ownerId:string;name:string;category:string;condition:string;description:string}
export interface Loan{id:string;toolId:string;borrowerId:string;lenderId:string;start:string;end:string;status:Status;reminder?:string}
export interface ToolView{_id:string;name:string;category:string;condition:string;description:string;ownerName:string;isMine:boolean;available:boolean}
export const CATEGORIES=['Power tools','Garden','Kitchen','Camping','Cleaning','Other'];
export const today=()=>new Date().toISOString().slice(0,10);
export const isOverdue=(l:Loan)=>l.status==='approved'&&l.end<today();
export const toolImg=(id:string)=>`/img/t${[...id].reduce((a,c)=>a+c.charCodeAt(0),0)%6+1}.jpg`;
