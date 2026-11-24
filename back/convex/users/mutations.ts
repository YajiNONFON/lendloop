import {mutation} from "../_generated/server";
import {v} from "convex/values";
import {requireIdentity,requireAdmin} from "../shared/auth";
import {appError} from "../shared/errors";
import {resolveRole} from "./domain";
// Called after sign-in. Creates the profile once; the role is decided on the server, never by the client.
export const store=mutation({args:{},handler:async(ctx)=>{
  const i=await requireIdentity(ctx);const role=resolveRole(i.email,process.env.ADMIN_EMAILS);
  const ex=await ctx.db.query("users").withIndex("by_token",q=>q.eq("tokenIdentifier",i.tokenIdentifier)).unique();
  if(ex){if(role==="admin"&&ex.role!=="admin")await ctx.db.patch(ex._id,{role});return ex._id;}
  return await ctx.db.insert("users",{tokenIdentifier:i.tokenIdentifier,name:i.name??i.email??"Neighbour",email:i.email,role,trustedLender:false});}});
export const setTrusted=mutation({args:{userId:v.id("users"),trusted:v.boolean()},handler:async(ctx,a)=>{
  await requireAdmin(ctx);if(!(await ctx.db.get(a.userId)))throw appError("NOT_FOUND","User not found");
  await ctx.db.patch(a.userId,{trustedLender:a.trusted});}});
