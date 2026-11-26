// Pure rules for automation: who is told, what is sent, how retries and keys work.
export type LoanEvent="requested"|"approved"|"declined"|"cancelled"|"returned";
export const MAX_ATTEMPTS=3;
// Delay before attempt number n (0 = first try, then 30 s, then 2 min).
export const retryDelayMs=(attempt:number)=>[0,30_000,120_000][attempt]??300_000;
export const notificationKey=(loanId:string,event:LoanEvent)=>`notify:${loanId}:${event}`;
export const reminderKey=(loanId:string,day:string)=>`reminder:${loanId}:${day}`;
export const recipientFor=(event:LoanEvent):"lender"|"borrower"=>event==="requested"||event==="cancelled"?"lender":"borrower";
export const daysBetween=(from:string,to:string)=>Math.round((Date.parse(to)-Date.parse(from))/864e5);
type Person={name:string;email?:string};
export type NotificationPayload={event:LoanEvent;loanId:string;recipientName:string;recipientEmail:string|null;toolName:string;otherPartyName:string;startDate:string;endDate:string};
// Data minimization: only what a message needs. No ids of users, no tokens, no descriptions.
export function buildNotification(event:LoanEvent,loanId:string,loan:{startDate:string;endDate:string},tool:{name:string},borrower:Person,lender:Person):NotificationPayload{
  const toLender=recipientFor(event)==="lender";const to=toLender?lender:borrower;const other=toLender?borrower:lender;
  return{event,loanId,recipientName:to.name,recipientEmail:to.email??null,toolName:tool.name,otherPartyName:other.name,startDate:loan.startDate,endDate:loan.endDate};}
export type EventBody={key:string;type:string;status:"sent"|"failed";loanId?:string;detail?:string};
export function validateEventBody(b:unknown):{ok:true;value:EventBody}|{ok:false;error:string}{
  if(!b||typeof b!=="object")return{ok:false,error:"Body must be a JSON object"};
  const o=b as Record<string,unknown>;
  if(typeof o.key!=="string"||o.key.length<3||o.key.length>200)return{ok:false,error:"key is required"};
  if(typeof o.type!=="string"||!["reminder","n8n_error"].includes(o.type))return{ok:false,error:"unknown type"};
  if(o.status!=="sent"&&o.status!=="failed")return{ok:false,error:"status must be sent or failed"};
  if(o.loanId!==undefined&&typeof o.loanId!=="string")return{ok:false,error:"loanId must be a string"};
  if(o.detail!==undefined&&(typeof o.detail!=="string"||o.detail.length>500))return{ok:false,error:"detail is too long"};
  return{ok:true,value:{key:o.key,type:o.type,status:o.status,loanId:o.loanId as string|undefined,detail:o.detail as string|undefined}};}
