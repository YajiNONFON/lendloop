// Pure rules for tools: no database, easy to test.
export const CATEGORIES=["Power tools","Garden","Kitchen","Camping","Cleaning","Other"] as const;
export const CONDITIONS=["Like new","Good","Fair"] as const;
export type ToolInput={name:string;category:string;condition:string;description:string};
export type Validation={ok:true;value:ToolInput}|{ok:false;error:string};
export function validateTool(i:ToolInput):Validation{
  const name=i.name.trim(),description=i.description.trim();
  if(name.length<2||name.length>80)return{ok:false,error:"Name must be 2 to 80 characters"};
  if(!(CATEGORIES as readonly string[]).includes(i.category))return{ok:false,error:"Unknown category"};
  if(!(CONDITIONS as readonly string[]).includes(i.condition))return{ok:false,error:"Unknown condition"};
  if(description.length>300)return{ok:false,error:"Description is limited to 300 characters"};
  return{ok:true,value:{name,category:i.category,condition:i.condition,description}};}
export const canEdit=(user:{_id:string},tool:{ownerId:string})=>user._id===tool.ownerId;
export const canDelete=(user:{_id:string;role:string},tool:{ownerId:string})=>user._id===tool.ownerId||user.role==="admin";
// A tool is out as long as an approved loan has started and was not returned (an overdue loan still counts).
export const isBusy=(loans:{status:string;startDate:string}[],today:string)=>loans.some(l=>l.status==="approved"&&l.startDate<=today);
