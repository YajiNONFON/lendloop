// HMAC-SHA256 signing with a timestamp (limits replay). Uses Web Crypto, available in Convex and n8n.
const enc=new TextEncoder();
const hex=(b:ArrayBuffer)=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
async function mac(secret:string,msg:string){const k=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",k,enc.encode(msg)));}
function safeEqual(a:string,b:string){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
export async function signPayload(secret:string,body:string,timestamp=Date.now()){return{timestamp,signature:await mac(secret,`${timestamp}.${body}`)};}
export async function verifySignature(secret:string,body:string,timestamp:number,signature:string,now=Date.now(),toleranceMs=5*60*1000){
  if(!Number.isFinite(timestamp)||Math.abs(now-timestamp)>toleranceMs)return false;
  return safeEqual(await mac(secret,`${timestamp}.${body}`),signature);}
