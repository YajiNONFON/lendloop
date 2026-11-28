'use client';
import {motion} from 'framer-motion';
import type {ReactNode} from 'react';
const EASE:[number,number,number,number]=[0.22,1,0.36,1];
// Fade and small upward move, in a cascade (60 to 80 ms per item). Reduced motion is handled by MotionConfig.
export function Reveal({children,i=0,className='',inView=false}:{children:ReactNode;i?:number;className?:string;inView?:boolean}){
  const t={duration:0.4,delay:Math.min(i,12)*0.07,ease:EASE};
  return inView
    ?<motion.div className={className} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-40px'}} transition={t}>{children}</motion.div>
    :<motion.div className={className} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={t}>{children}</motion.div>;}
