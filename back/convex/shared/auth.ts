import type {QueryCtx,MutationCtx} from "../_generated/server";
import {appError} from "./errors";
type Ctx=QueryCtx|MutationCtx;
export async function requireIdentity(ctx:Ctx){const i=await ctx.auth.getUserIdentity();if(!i)throw appError("UNAUTHENTICATED","Sign in required");return i;}
export async function requireUser(ctx:Ctx){const i=await requireIdentity(ctx);
  const u=await ctx.db.query("users").withIndex("by_token",q=>q.eq("tokenIdentifier",i.tokenIdentifier)).unique();
  if(!u)throw appError("UNAUTHENTICATED","User profile not found. Call users.store first.");return u;}
export async function requireAdmin(ctx:Ctx){const u=await requireUser(ctx);if(u.role!=="admin")throw appError("FORBIDDEN","Admin only");return u;}
