import {query} from "../_generated/server";
import type {QueryCtx} from "../_generated/server";
import type {Doc} from "../_generated/dataModel";
import {requireUser} from "../shared/auth";
import {isBusy} from "./domain";
const today=()=>new Date().toISOString().slice(0,10);
async function available(ctx:QueryCtx,t:Doc<"tools">){
  const loans=await ctx.db.query("loans").withIndex("by_tool",q=>q.eq("toolId",t._id)).collect();return !isBusy(loans,today());}
async function view(ctx:QueryCtx,t:Doc<"tools">,meId:string){
  const owner=await ctx.db.get(t.ownerId);
  return{_id:t._id,name:t.name,category:t.category,condition:t.condition,description:t.description,ownerName:owner?.name??"Unknown",ownerTrusted:owner?.trustedLender??false,isMine:t.ownerId===meId,available:await available(ctx,t)};}
// Public: name and category only, never owner details.
export const listPublic=query({args:{},handler:async(ctx)=>{
  const out=[];for(const t of await ctx.db.query("tools").collect()){
    if(t.deletedAt||!(await available(ctx,t)))continue;out.push({_id:t._id,name:t.name,category:t.category});}
  return out;}});
export const listAll=query({args:{},handler:async(ctx)=>{
  const me=await requireUser(ctx);const out=[];
  for(const t of await ctx.db.query("tools").collect())if(!t.deletedAt)out.push(await view(ctx,t,me._id));
  return out;}});
export const listMine=query({args:{},handler:async(ctx)=>{
  const me=await requireUser(ctx);const out=[];
  for(const t of await ctx.db.query("tools").withIndex("by_owner",q=>q.eq("ownerId",me._id)).collect())if(!t.deletedAt)out.push(await view(ctx,t,me._id));
  return out;}});
