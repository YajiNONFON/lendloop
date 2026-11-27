import {convexTest} from "convex-test";
import {expect,test} from "vitest";
import schema from "../../convex/schema";
import {modules} from "../setup";
import {api} from "../../convex/_generated/api";
const idn=(sub:string)=>({tokenIdentifier:`https://clerk.test|${sub}`,subject:sub,name:sub,email:`${sub}@x.test`});
const d=(n:number)=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
async function setup(){const t=convexTest(schema,modules);
  const as=async(sub:string)=>{const c=t.withIdentity(idn(sub));await c.mutation(api.users.mutations.store,{});return c;};
  const awa=await as("awa"),koffi=await as("koffi"),nadia=await as("nadia");
  const toolId=await awa.mutation(api.tools.mutations.create,{name:"Drill",category:"Other",condition:"Good",description:""});
  return{t,awa,koffi,nadia,toolId};}
// Note: convex-test does not reproduce Convex's real optimistic concurrency control. These tests check that the rules
// hold when calls are fired at the same time. In production, Convex runs each mutation as a serializable transaction.
test("approving two overlapping requests at the same time books the tool only once",async()=>{const{t,awa,koffi,nadia,toolId}=await setup();
  const a=await koffi.mutation(api.loans.mutations.request,{toolId,startDate:d(1),endDate:d(4)});
  const b=await nadia.mutation(api.loans.mutations.request,{toolId,startDate:d(2),endDate:d(5)});
  const results=await Promise.allSettled([awa.mutation(api.loans.mutations.decide,{loanId:a,decision:"approve"}),awa.mutation(api.loans.mutations.decide,{loanId:b,decision:"approve"})]);
  expect(results.filter(r=>r.status==="fulfilled").length).toBe(1);
  const approved=(await t.run(c=>c.db.query("loans").collect())).filter(l=>l.status==="approved");expect(approved.length).toBe(1);});
test("a double click on Request creates a single request",async()=>{const{t,koffi,toolId}=await setup();
  const args={toolId,startDate:d(1),endDate:d(3)};
  const results=await Promise.allSettled([koffi.mutation(api.loans.mutations.request,args),koffi.mutation(api.loans.mutations.request,args)]);
  expect(results.filter(r=>r.status==="fulfilled").length).toBe(1);expect((await t.run(c=>c.db.query("loans").collect())).length).toBe(1);});
test("the same approval sent twice is applied once",async()=>{const{t,awa,koffi,toolId}=await setup();
  const id=await koffi.mutation(api.loans.mutations.request,{toolId,startDate:d(1),endDate:d(3)});
  const results=await Promise.allSettled([awa.mutation(api.loans.mutations.decide,{loanId:id,decision:"approve"}),awa.mutation(api.loans.mutations.decide,{loanId:id,decision:"approve"})]);
  expect(results.filter(r=>r.status==="fulfilled").length).toBe(1);
  expect((await t.run(c=>c.db.query("loans").collect())).filter(l=>l.status==="approved").length).toBe(1);});
