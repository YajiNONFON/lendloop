export interface ToolView{_id:string;name:string;category:string;condition:string;description:string;ownerName:string;ownerTrusted:boolean;isMine:boolean;available:boolean}
export interface LoanView{_id:string;toolId:string;toolName:string;toolCategory:string;borrowerName:string;lenderName:string;startDate:string;endDate:string;status:'pending'|'approved'|'declined'|'cancelled'|'returned';overdue:boolean;role:'borrower'|'lender'|'admin';lastEvent:{type:string;status:'sent'|'failed';at:number}|null}
export interface ToolInput{name:string;category:string;condition:string;description:string}
export const CATEGORIES=['Power tools','Garden','Kitchen','Camping','Cleaning','Other'];
export const today=()=>new Date().toISOString().slice(0,10);
export const toolImg=(id:string)=>`/img/t${[...id].reduce((a,c)=>a+c.charCodeAt(0),0)%6+1}.jpg`;
