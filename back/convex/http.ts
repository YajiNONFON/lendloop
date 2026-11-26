import {httpRouter} from "convex/server";
import {httpAction} from "./_generated/server";
import {internal} from "./_generated/api";
import {verifySignature} from "./shared/hmac";
import {validateEventBody} from "./automation/domain";
const http=httpRouter();
// Every call from n8n is signed: HMAC of "timestamp.body" with the shared secret, valid for 5 minutes.
async function authorized(req:Request,body:string){
  const secret=process.env.AUTOMATION_SECRET;if(!secret)return false;
  return verifySignature(secret,body,Number(req.headers.get("x-lendloop-timestamp")),req.headers.get("x-lendloop-signature")??"");}
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json"}});
http.route({path:"/automation/overdue",method:"GET",handler:httpAction(async(ctx,req)=>{
  if(!(await authorized(req,"")))return json({error:"unauthorized"},401);
  const loans=await ctx.runQuery(internal.automation.queries.overdueToRemind,{today:new Date().toISOString().slice(0,10)});
  return json({loans});})});
http.route({path:"/automation/event",method:"POST",handler:httpAction(async(ctx,req)=>{
  const body=await req.text();if(!(await authorized(req,body)))return json({error:"unauthorized"},401);
  let parsed:unknown;try{parsed=JSON.parse(body);}catch{return json({error:"invalid json"},400);}
  const r=validateEventBody(parsed);if(!r.ok)return json({error:r.error},400);
  const res=await ctx.runMutation(internal.automation.mutations.record,r.value);
  return json({ok:true,duplicate:res.duplicate});})});
export default http;
