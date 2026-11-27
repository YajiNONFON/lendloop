import {query} from "../_generated/server";
import {requireAdmin} from "../shared/auth";
export const me=query({args:{},handler:async(ctx)=>{const i=await ctx.auth.getUserIdentity();if(!i)return null;
  return await ctx.db.query("users").withIndex("by_token",q=>q.eq("tokenIdentifier",i.tokenIdentifier)).unique();}});
export const listAll=query({args:{},handler:async(ctx)=>{await requireAdmin(ctx);const users=await ctx.db.query("users").collect();
  // Admins get what they need to manage lenders, never the sign-in token.
  return users.map(u=>({_id:u._id,name:u.name,email:u.email??null,role:u.role,trustedLender:u.trustedLender}));}});
