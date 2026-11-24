import {expect,test} from "vitest";
import {signPayload,verifySignature} from "../../convex/shared/hmac";
const S="shared-secret",B='{"loanId":"l1","status":"approved"}';
test("a valid signature is accepted",async()=>{const{timestamp,signature}=await signPayload(S,B,1000);expect(await verifySignature(S,B,timestamp,signature,1000)).toBe(true);});
test("a tampered body is rejected",async()=>{const{timestamp,signature}=await signPayload(S,B,1000);expect(await verifySignature(S,B.replace("approved","declined"),timestamp,signature,1000)).toBe(false);});
test("a wrong secret is rejected",async()=>{const{timestamp,signature}=await signPayload(S,B,1000);expect(await verifySignature("other",B,timestamp,signature,1000)).toBe(false);});
test("an expired timestamp is rejected",async()=>{const{timestamp,signature}=await signPayload(S,B,1000);expect(await verifySignature(S,B,timestamp,signature,1000+6*60*1000)).toBe(false);});
test("a malformed signature is rejected",async()=>{const{timestamp}=await signPayload(S,B,1000);expect(await verifySignature(S,B,timestamp,"abc",1000)).toBe(false);});
