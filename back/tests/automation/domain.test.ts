import {expect,test} from "vitest";
import {buildNotification,daysBetween,notificationKey,recipientFor,reminderKey,retryDelayMs,validateEventBody} from "../../convex/automation/domain";
test("requests and cancellations tell the lender, everything else tells the borrower",()=>{
  expect(recipientFor("requested")).toBe("lender");expect(recipientFor("cancelled")).toBe("lender");
  for(const e of ["approved","declined","returned"] as const)expect(recipientFor(e)).toBe("borrower");});
test("a notification carries only the fields a message needs",()=>{
  const p=buildNotification("requested","l1",{startDate:"2026-12-01",endDate:"2026-12-03"},{name:"Drill"},{name:"Koffi",email:"k@x.test"},{name:"Awa",email:"a@x.test"});
  expect(Object.keys(p).sort()).toEqual(["endDate","event","loanId","otherPartyName","recipientEmail","recipientName","startDate","toolName"]);
  expect(p.recipientName).toBe("Awa");expect(p.otherPartyName).toBe("Koffi");expect(p.recipientEmail).toBe("a@x.test");});
test("a missing email becomes null",()=>{expect(buildNotification("approved","l1",{startDate:"a",endDate:"b"},{name:"D"},{name:"K"},{name:"A"}).recipientEmail).toBeNull();});
test("keys are stable, so retries cannot create duplicates",()=>{expect(notificationKey("l1","approved")).toBe("notify:l1:approved");expect(reminderKey("l1","2026-12-01")).toBe("reminder:l1:2026-12-01");});
test("retries back off: now, 30 seconds, 2 minutes",()=>{expect([0,1,2].map(retryDelayMs)).toEqual([0,30000,120000]);});
test("days late are counted in whole days",()=>{expect(daysBetween("2026-11-20","2026-11-23")).toBe(3);});
test("event bodies are validated",()=>{
  expect(validateEventBody({key:"reminder:l1:2026-12-01",type:"reminder",status:"sent"}).ok).toBe(true);
  for(const bad of [null,{},{key:"abc",type:"x",status:"sent"},{key:"abc",type:"reminder",status:"maybe"},{key:"abc",type:"reminder",status:"sent",detail:"x".repeat(501)}])expect(validateEventBody(bad).ok).toBe(false);});
