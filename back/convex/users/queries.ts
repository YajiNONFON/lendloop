import {query} from "../_generated/server";
import {requireAdmin} from "../shared/auth";
export const me=query({args:{},handler:async(ctx)=>{const i=await ctx.auth.getUserIdentity();if(!i)return null;
  return await ctx.db.query("users").withIndex("by_token",q=>q.eq("tokenIdentifier",i.tokenIdentifier)).unique();}});
export const listAll=query({args:{},handler:async(ctx)=>{await requireAdmin(ctx);return await ctx.db.query("users").collect();}});
