import {ConvexError} from "convex/values";
export type ErrorCode="UNAUTHENTICATED"|"FORBIDDEN"|"NOT_FOUND"|"INVALID";
export const appError=(code:ErrorCode,message:string)=>new ConvexError({code,message});
