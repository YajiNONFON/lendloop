import {defineSchema,defineTable} from "convex/server";
import {v} from "convex/values";
export const loanStatus=v.union(v.literal("pending"),v.literal("approved"),v.literal("declined"),v.literal("cancelled"),v.literal("returned"));
export default defineSchema({
  users:defineTable({tokenIdentifier:v.string(),name:v.string(),email:v.optional(v.string()),role:v.union(v.literal("user"),v.literal("admin")),trustedLender:v.boolean()}).index("by_token",["tokenIdentifier"]),
  tools:defineTable({ownerId:v.id("users"),name:v.string(),category:v.string(),condition:v.string(),description:v.string(),deletedAt:v.optional(v.number())}).index("by_owner",["ownerId"]).index("by_category",["category"]),
  loans:defineTable({toolId:v.id("tools"),borrowerId:v.id("users"),lenderId:v.id("users"),startDate:v.string(),endDate:v.string(),status:loanStatus,decidedAt:v.optional(v.number()),returnedAt:v.optional(v.number())}).index("by_tool",["toolId"]).index("by_borrower",["borrowerId"]).index("by_lender",["lenderId"]).index("by_status",["status"]),
  automationEvents:defineTable({idempotencyKey:v.string(),type:v.string(),loanId:v.optional(v.id("loans")),status:v.union(v.literal("sent"),v.literal("failed")),createdAt:v.number()}).index("by_key",["idempotencyKey"]),
});
