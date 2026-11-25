import {expect,test} from "vitest";
import {validateTool,canEdit,canDelete,isBusy} from "../../convex/tools/domain";
const ok={name:"Drill",category:"Power tools",condition:"Good",description:"18V"};
test("a valid tool is accepted and trimmed",()=>{const r=validateTool({...ok,name:"  Drill  "});expect(r.ok&&r.value.name).toBe("Drill");});
test("short names, unknown categories and long descriptions are rejected",()=>{
  expect(validateTool({...ok,name:" a "}).ok).toBe(false);expect(validateTool({...ok,category:"Weapons"}).ok).toBe(false);
  expect(validateTool({...ok,condition:"Broken"}).ok).toBe(false);expect(validateTool({...ok,description:"x".repeat(301)}).ok).toBe(false);});
test("only the owner can edit",()=>{expect(canEdit({_id:"a"},{ownerId:"a"})).toBe(true);expect(canEdit({_id:"b"},{ownerId:"a"})).toBe(false);});
test("owner and admin can delete, others cannot",()=>{
  expect(canDelete({_id:"a",role:"user"},{ownerId:"a"})).toBe(true);expect(canDelete({_id:"z",role:"admin"},{ownerId:"a"})).toBe(true);expect(canDelete({_id:"b",role:"user"},{ownerId:"a"})).toBe(false);});
test("only an approved loan that started makes a tool busy, even when overdue",()=>{
  expect(isBusy([{status:"approved",startDate:"2026-01-01"}],"2026-02-01")).toBe(true);
  expect(isBusy([{status:"approved",startDate:"2026-03-01"}],"2026-02-01")).toBe(false);
  expect(isBusy([{status:"pending",startDate:"2026-01-01"},{status:"returned",startDate:"2026-01-01"}],"2026-02-01")).toBe(false);});
