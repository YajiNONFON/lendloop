import {internalQuery} from "../_generated/server";
import {v} from "convex/values";
import {isOverdue} from "../loans/domain";
import {buildNotification,daysBetween,reminderKey} from "./domain";
export const eventValidator=v.union(v.literal("requested"),v.literal("approved"),v.literal("declined"),v.literal("cancelled"),v.literal("returned"));
export const alreadySent=internalQuery({args:{key:v.string()},handler:async(ctx,a)=>{
  const ex=await ctx.db.query("automationEvents").withIndex("by_key",q=>q.eq("idempotencyKey",a.key)).unique();return ex?.status==="sent";}});
export const notificationFor=internalQuery({args:{loanId:v.id("loans"),event:eventValidator},handler:async(ctx,a)=>{
  const l=await ctx.db.get(a.loanId);if(!l)return null;
  const tool=await ctx.db.get(l.toolId),b=await ctx.db.get(l.borrowerId),le=await ctx.db.get(l.lenderId);if(!tool||!b||!le)return null;
  return buildNotification(a.event,a.loanId,l,tool,b,le);}});
// Overdue loans that have not been reminded today, with only what a reminder needs.
export const overdueToRemind=internalQuery({args:{today:v.string()},handler:async(ctx,a)=>{
  const out=[];
  for(const l of await ctx.db.query("loans").withIndex("by_status",q=>q.eq("status","approved")).collect()){
    if(!isOverdue(l,a.today))continue;
    const done=await ctx.db.query("automationEvents").withIndex("by_key",q=>q.eq("idempotencyKey",reminderKey(l._id,a.today))).unique();
    if(done?.status==="sent")continue;
    const tool=await ctx.db.get(l.toolId),b=await ctx.db.get(l.borrowerId);if(!tool||!b)continue;
    out.push({loanId:l._id,borrowerName:b.name,borrowerEmail:b.email??null,toolName:tool.name,endDate:l.endDate,daysLate:daysBetween(l.endDate,a.today)});}
  return out;}});
