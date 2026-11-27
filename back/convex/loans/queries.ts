import {query} from "../_generated/server";
import {requireUser} from "../shared/auth";
import {isOverdue} from "./domain";
const today=()=>new Date().toISOString().slice(0,10);
// Loans where I am the borrower or the lender, with just the names the screens need.
export const listMine=query({args:{},handler:async(ctx)=>{
  const me=await requireUser(ctx);
  const asBorrower=await ctx.db.query("loans").withIndex("by_borrower",q=>q.eq("borrowerId",me._id)).collect();
  const asLender=await ctx.db.query("loans").withIndex("by_lender",q=>q.eq("lenderId",me._id)).collect();
  const t=today();const out=[];
  for(const l of [...asBorrower,...asLender]){
    const events=await ctx.db.query("automationEvents").withIndex("by_loan",q=>q.eq("loanId",l._id)).collect();
    const last=events.sort((x,y)=>y.createdAt-x.createdAt)[0];
    const tool=await ctx.db.get(l.toolId);const b=await ctx.db.get(l.borrowerId);const le=await ctx.db.get(l.lenderId);
    out.push({_id:l._id,toolId:l.toolId,toolName:tool?.name??"Removed tool",toolCategory:tool?.category??"",borrowerName:b?.name??"Unknown",lenderName:le?.name??"Unknown",
      startDate:l.startDate,endDate:l.endDate,status:l.status,overdue:isOverdue(l,t),lastEvent:last?{type:last.type,status:last.status,at:last.createdAt}:null,role:(l.borrowerId===me._id?"borrower":"lender") as "borrower"|"lender"});}
  return out.sort((a,b)=>b.startDate.localeCompare(a.startDate));}});
