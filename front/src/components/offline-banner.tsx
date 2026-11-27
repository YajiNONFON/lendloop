'use client';
import {useEffect,useState} from 'react';
// Tells the user when the connection drops. Convex reconnects on its own and screens refresh when it is back.
export default function OfflineBanner(){const[offline,setOffline]=useState(false);
useEffect(()=>{const sync=()=>setOffline(!navigator.onLine);sync();window.addEventListener('online',sync);window.addEventListener('offline',sync);
  return()=>{window.removeEventListener('online',sync);window.removeEventListener('offline',sync);};},[]);
if(!offline)return null;
return <div role="status" className="fixed inset-x-0 top-0 z-[60] bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">You are offline. Changes will sync when the connection is back.</div>}
