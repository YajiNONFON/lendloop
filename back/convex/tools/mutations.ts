import {mutation} from "../_generated/server";
import {v} from "convex/values";
import {requireUser} from "../shared/auth";
import {appError} from "../shared/errors";
import {validateTool,canEdit,canDelete,isBusy} from "./domain";
const fields={name:v.string(),category:v.string(),condition:v.string(),description:v.string()};
const today=()=>new Date().toISOString().slice(0,10);
export const create=mutation({args:fields,handler:async(ctx,a)=>{
  const u=await requireUser(ctx);const r=validateTool(a);if(!r.ok)throw appError("INVALID",r.error);
  return await ctx.db.insert("tools",{ownerId:u._id,...r.value});}});
export const update=mutation({args:{toolId:v.id("tools"),...fields},handler:async(ctx,{toolId,...rest})=>{
  const u=await requireUser(ctx);const t=await ctx.db.get(toolId);
  if(!t||t.deletedAt)throw appError("NOT_FOUND","Tool not found");
  if(!canEdit(u,t))throw appError("FORBIDDEN","Only the owner can edit this tool");
  const r=validateTool(rest);if(!r.ok)throw appError("INVALID",r.error);
  await ctx.db.patch(toolId,r.value);}});
// Soft delete: loan history stays available for audit.
export const remove=mutation({args:{toolId:v.id("tools")},handler:async(ctx,{toolId})=>{
  const u=await requireUser(ctx);const t=await ctx.db.get(toolId);
  if(!t||t.deletedAt)throw appError("NOT_FOUND","Tool not found");
  if(!canDelete(u,t))throw appError("FORBIDDEN","You cannot delete this tool");
  const loans=await ctx.db.query("loans").withIndex("by_tool",q=>q.eq("toolId",toolId)).collect();
  if(isBusy(loans,today()))throw appError("INVALID","This tool is currently on loan");
  await ctx.db.patch(toolId,{deletedAt:Date.now()});}});
