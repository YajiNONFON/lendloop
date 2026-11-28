// Display helpers only. The data itself is never changed.
export const formatDate=(iso:string)=>{const d=new Date(`${iso}T00:00:00Z`);return Number.isNaN(d.getTime())?iso:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});};
export const plural=(n:number,one:string,many=`${one}s`)=>`${n} ${n===1?one:many}`;
export const ago=(t:number)=>{const m=Math.round((Date.now()-t)/60000);if(m<1)return 'just now';if(m<60)return `${m} min ago`;const h=Math.round(m/60);if(h<24)return `${h} h ago`;const d=Math.round(h/24);return `${d} ${d===1?'day':'days'} ago`;};
