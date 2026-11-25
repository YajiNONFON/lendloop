// Pure rules for loans: no database, easy to test.
export type LoanStatus="pending"|"approved"|"declined"|"cancelled"|"returned";
export type Action="approve"|"decline"|"cancel"|"return";
export type Actor="lender"|"borrower";
const isDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s));
export function validateDates(start:string,end:string,today:string):string|null{
  if(!isDate(start)||!isDate(end))return "Dates must look like YYYY-MM-DD";
  if(start<today)return "The start date cannot be in the past";
  if(end<start)return "The end date cannot be before the start date";
  return null;}
export const overlaps=(aStart:string,aEnd:string,bStart:string,bEnd:string)=>aStart<=bEnd&&bStart<=aEnd;
export const canBorrow=(userId:string,ownerId:string)=>userId!==ownerId;
// Who may do what, and from which status. Anything else is refused.
const TRANSITIONS:Record<Action,{from:LoanStatus;to:LoanStatus;actor:Actor}>={
  approve:{from:"pending",to:"approved",actor:"lender"},
  decline:{from:"pending",to:"declined",actor:"lender"},
  cancel:{from:"pending",to:"cancelled",actor:"borrower"},
  return:{from:"approved",to:"returned",actor:"lender"}};
export type Transition={ok:true;to:LoanStatus}|{ok:false;reason:"FORBIDDEN"|"INVALID"};
export function transition(status:LoanStatus,action:Action,actor:Actor):Transition{
  const t=TRANSITIONS[action];
  if(t.actor!==actor)return{ok:false,reason:"FORBIDDEN"};
  if(t.from!==status)return{ok:false,reason:"INVALID"};
  return{ok:true,to:t.to};}
export const isOverdue=(l:{status:string;endDate:string},today:string)=>l.status==="approved"&&l.endDate<today;
