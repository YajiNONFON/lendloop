import {expect,test} from "vitest";
import {validateDates,overlaps,canBorrow,transition,isOverdue} from "../../convex/loans/domain";
test("valid dates pass, bad ones are explained",()=>{
  expect(validateDates("2026-12-01","2026-12-03","2026-11-30")).toBeNull();
  expect(validateDates("2026-12-01","2026-12-01","2026-12-01")).toBeNull();
  expect(validateDates("2026-11-01","2026-12-03","2026-11-30")).toMatch(/past/);
  expect(validateDates("2026-12-05","2026-12-03","2026-11-30")).toMatch(/before/);
  expect(validateDates("tomorrow","2026-12-03","2026-11-30")).toMatch(/YYYY-MM-DD/);});
test("overlap includes shared boundary days",()=>{
  expect(overlaps("2026-12-01","2026-12-05","2026-12-05","2026-12-08")).toBe(true);
  expect(overlaps("2026-12-01","2026-12-04","2026-12-05","2026-12-08")).toBe(false);});
test("nobody borrows their own tool",()=>{expect(canBorrow("a","a")).toBe(false);expect(canBorrow("a","b")).toBe(true);});
test("the lender decides and receives, the borrower cancels",()=>{
  expect(transition("pending","approve","lender")).toEqual({ok:true,to:"approved"});
  expect(transition("pending","decline","lender")).toEqual({ok:true,to:"declined"});
  expect(transition("pending","cancel","borrower")).toEqual({ok:true,to:"cancelled"});
  expect(transition("approved","return","lender")).toEqual({ok:true,to:"returned"});});
test("the wrong person is forbidden, the wrong status is invalid",()=>{
  expect(transition("pending","approve","borrower")).toEqual({ok:false,reason:"FORBIDDEN"});
  expect(transition("approved","return","borrower")).toEqual({ok:false,reason:"FORBIDDEN"});
  expect(transition("approved","cancel","borrower")).toEqual({ok:false,reason:"INVALID"});
  expect(transition("declined","approve","lender")).toEqual({ok:false,reason:"INVALID"});});
test("only an approved loan past its end date is overdue",()=>{
  expect(isOverdue({status:"approved",endDate:"2026-11-01"},"2026-11-02")).toBe(true);
  expect(isOverdue({status:"approved",endDate:"2026-11-02"},"2026-11-02")).toBe(false);
  expect(isOverdue({status:"returned",endDate:"2026-11-01"},"2026-11-02")).toBe(false);});
