import {internalMutation} from "../_generated/server";
import {v} from "convex/values";
// Idempotent journal: the same key never creates two rows, so retries are harmless.
export const record=internalMutation({args:{key:v.string(),type:v.string(),status:v.union(v.literal("sent"),v.literal("failed")),loanId:v.optional(v.string()),detail:v.optional(v.string())},handler:async(ctx,a)=>{
  const loanId=a.loanId?ctx.db.normalizeId("loans",a.loanId)??undefined:undefined;
  const ex=await ctx.db.query("automationEvents").withIndex("by_key",q=>q.eq("idempotencyKey",a.key)).unique();
  if(ex){
    if(ex.status==="failed"&&a.status==="sent"){await ctx.db.patch(ex._id,{status:"sent",detail:a.detail,createdAt:Date.now()});return{duplicate:false};}
    return{duplicate:true};}
  await ctx.db.insert("automationEvents",{idempotencyKey:a.key,type:a.type,loanId,status:a.status,detail:a.detail,createdAt:Date.now()});
  return{duplicate:false};}});
