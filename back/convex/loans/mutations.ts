import {mutation} from "../_generated/server";
import {internal} from "../_generated/api";
import {automationEnabled} from "../automation/config";
import type {LoanEvent} from "../automation/domain";
import type {MutationCtx} from "../_generated/server";
import type {Id} from "../_generated/dataModel";
import {v} from "convex/values";
import {requireUser} from "../shared/auth";
import {appError} from "../shared/errors";
import {validateDates,overlaps,canBorrow,transition,MAX_PENDING_REQUESTS} from "./domain";
import type {Action,LoanStatus} from "./domain";
const today=()=>new Date().toISOString().slice(0,10);
const EVENT:Record<Action,LoanEvent>={approve:"approved",decline:"declined",cancel:"cancelled",return:"returned"};
// Tells n8n about a change. Scheduled, so the loan is already saved and a slow n8n never blocks the user.
async function notify(ctx:MutationCtx,loanId:Id<"loans">,event:LoanEvent){
  if(!automationEnabled())return;
  await ctx.scheduler.runAfter(0,internal.automation.actions.notifyLoanEvent,{loanId,event,attempt:0});}
async function approvedFor(ctx:MutationCtx,toolId:Id<"tools">){
  return (await ctx.db.query("loans").withIndex("by_tool",q=>q.eq("toolId",toolId)).collect()).filter(l=>l.status==="approved");}
export const request=mutation({args:{toolId:v.id("tools"),startDate:v.string(),endDate:v.string()},handler:async(ctx,a)=>{
  const u=await requireUser(ctx);const t=await ctx.db.get(a.toolId);
  if(!t||t.deletedAt)throw appError("NOT_FOUND","Tool not found");
  if(!canBorrow(u._id,t.ownerId))throw appError("INVALID","You cannot borrow your own tool");
  const err=validateDates(a.startDate,a.endDate,today());if(err)throw appError("INVALID",err);
  if((await approvedFor(ctx,t._id)).some(l=>overlaps(l.startDate,l.endDate,a.startDate,a.endDate)))throw appError("INVALID","This tool is already booked on those dates");
  // Quotas against mistakes and abuse: no duplicate request, no flood of pending requests.
  const mine=(await ctx.db.query("loans").withIndex("by_borrower",q=>q.eq("borrowerId",u._id)).collect()).filter(l=>l.status==="pending"||l.status==="approved");
  if(mine.some(l=>l.toolId===t._id&&overlaps(l.startDate,l.endDate,a.startDate,a.endDate)))throw appError("INVALID","You already requested this tool for those dates");
  if(mine.filter(l=>l.status==="pending").length>=MAX_PENDING_REQUESTS)throw appError("INVALID","Too many pending requests. Wait for answers or cancel some.");
  const id=await ctx.db.insert("loans",{toolId:t._id,borrowerId:u._id,lenderId:t.ownerId,startDate:a.startDate,endDate:a.endDate,status:"pending"});
  await notify(ctx,id,"requested");return id;}});
// One place applies every status change, so the rules cannot drift apart.
async function act(ctx:MutationCtx,loanId:Id<"loans">,action:Action){
  const u=await requireUser(ctx);const l=await ctx.db.get(loanId);
  if(!l)throw appError("NOT_FOUND","Loan not found");
  const actor=u._id===l.lenderId?"lender":u._id===l.borrowerId?"borrower":null;
  if(!actor)throw appError("FORBIDDEN","This loan is not yours");
  const r=transition(l.status,action,actor);
  if(!r.ok)throw appError(r.reason,r.reason==="FORBIDDEN"?"You cannot do this on this loan":`A ${l.status} loan cannot be changed this way`);
  if(action==="approve"&&(await approvedFor(ctx,l.toolId)).some(o=>overlaps(o.startDate,o.endDate,l.startDate,l.endDate)))throw appError("INVALID","This tool is already booked on those dates");
  const patch:{status:LoanStatus;decidedAt?:number;returnedAt?:number}={status:r.to};
  if(action==="approve"||action==="decline")patch.decidedAt=Date.now();
  if(action==="return")patch.returnedAt=Date.now();
  await ctx.db.patch(loanId,patch);await notify(ctx,loanId,EVENT[action]);}
export const decide=mutation({args:{loanId:v.id("loans"),decision:v.union(v.literal("approve"),v.literal("decline"))},handler:(ctx,a)=>act(ctx,a.loanId,a.decision)});
export const cancel=mutation({args:{loanId:v.id("loans")},handler:(ctx,a)=>act(ctx,a.loanId,"cancel")});
export const markReturned=mutation({args:{loanId:v.id("loans")},handler:(ctx,a)=>act(ctx,a.loanId,"return")});
