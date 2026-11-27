import {internalAction} from "../_generated/server";
import {internal} from "../_generated/api";
import {v} from "convex/values";
import {signPayload} from "../shared/hmac";
import {MAX_ATTEMPTS,notificationKey,retryDelayMs} from "./domain";
import {eventValidator} from "./queries";
// Sends one signed notification to n8n. Retries are scheduled, and the final failure is recorded, never silent.
export const notifyLoanEvent=internalAction({args:{loanId:v.id("loans"),event:eventValidator,attempt:v.number()},handler:async(ctx,a):Promise<void>=>{
  const url=process.env.N8N_WEBHOOK_URL,secret=process.env.AUTOMATION_SECRET;if(!url||!secret)return;
  const key=notificationKey(a.loanId,a.event);
  if(await ctx.runQuery(internal.automation.queries.alreadySent,{key}))return;
  const payload=await ctx.runQuery(internal.automation.queries.notificationFor,{loanId:a.loanId,event:a.event});if(!payload)return;
  const body=JSON.stringify(payload);const{timestamp,signature}=await signPayload(secret,body);
  let failure="";
  try{
    const res=await fetch(url,{method:"POST",headers:{"content-type":"application/json","x-lendloop-timestamp":String(timestamp),"x-lendloop-signature":signature,"x-lendloop-event-id":key},body});
    if(res.ok){await ctx.runMutation(internal.automation.mutations.record,{key,type:"notification",status:"sent",loanId:a.loanId,detail:`${a.event}, attempt ${a.attempt+1}`});return;}
    failure=`n8n answered ${res.status}`;
  }catch(e){failure=e instanceof Error?e.message:"network error";}
  if(a.attempt+1<MAX_ATTEMPTS){await ctx.scheduler.runAfter(retryDelayMs(a.attempt+1),internal.automation.actions.notifyLoanEvent,{...a,attempt:a.attempt+1});return;}
  await ctx.runMutation(internal.automation.mutations.record,{key,type:"notification",status:"failed",loanId:a.loanId,detail:failure});}});
