// Pure rules for users: no database, easy to test.
export type Role="user"|"admin";
export const parseAdminEmails=(csv?:string)=>(csv??"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
export const resolveRole=(email:string|undefined,csv?:string):Role=>!!email&&parseAdminEmails(csv).includes(email.toLowerCase())?"admin":"user";
