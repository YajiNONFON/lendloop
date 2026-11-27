import {query} from "../_generated/server";
import type {QueryCtx} from "../_generated/server";
import type {Doc} from "../_generated/dataModel";
import {requireUser,requireAdmin} from "../shared/auth";
import {isOverdue} from "./domain";
const today=()=>new Date().toISOString().slice(0,10);
// One shape for every screen: just the names and dates a screen needs, plus the latest automation event.
async function view(ctx:QueryCtx,l:Doc<"loans">,role:"borrower"|"lender"|"admin"){
  const events=await ctx.db.query("automationEvents").withIndex("by_loan",q=>q.eq("loanId",l._id)).collect();
  const last=events.sort((x,y)=>y.createdAt-x.createdAt)[0];
  const tool=await ctx.db.get(l.toolId),b=await ctx.db.get(l.borrowerId),le=await ctx.db.get(l.lenderId);
  return{_id:l._id,toolId:l.toolId,toolName:tool?.name??"Removed tool",toolCategory:tool?.category??"",borrowerName:b?.name??"Unknown",lenderName:le?.name??"Unknown",
    startDate:l.startDate,endDate:l.endDate,status:l.status,overdue:isOverdue(l,today()),role,lastEvent:last?{type:last.type,status:last.status,at:last.createdAt}:null};}
const newestFirst=<T extends {startDate:string}>(a:T[])=>a.sort((x,y)=>y.startDate.localeCompare(x.startDate));
// Loans where I am the borrower or the lender.
export const listMine=query({args:{},handler:async(ctx)=>{
  const me=await requireUser(ctx);
  const asBorrower=await ctx.db.query("loans").withIndex("by_borrower",q=>q.eq("borrowerId",me._id)).collect();
  const asLender=await ctx.db.query("loans").withIndex("by_lender",q=>q.eq("lenderId",me._id)).collect();
  const out=[];for(const l of [...asBorrower,...asLender])out.push(await view(ctx,l,l.borrowerId===me._id?"borrower":"lender"));
  return newestFirst(out);}});
// Admin only: every loan.
export const listAll=query({args:{},handler:async(ctx)=>{
  await requireAdmin(ctx);const out=[];
  for(const l of await ctx.db.query("loans").collect())out.push(await view(ctx,l,"admin"));
  return newestFirst(out);}});
