import Image from 'next/image';
import {BLUR_DATA_URL,TOOL_DEFAULT_IMAGE} from '@/config/images';
type Variant='thumb'|'card'|'banner';
const BOX:Record<Variant,string>={thumb:'size-16 rounded-2xl',card:'aspect-[3/2] w-full rounded-2xl',banner:'aspect-[16/9] w-full rounded-3xl sm:aspect-[2/1]'};
const SIZES:Record<Variant,string>={thumb:'64px',card:'(min-width:1536px) 22vw,(min-width:1280px) 28vw,(min-width:640px) 45vw,100vw',banner:'(min-width:1280px) 38vw,100vw'};
// Every tool uses the default image for now. Real photos can be plugged in here later without touching any screen.
export const getToolImage=(tool:{name:string;category:string})=>{void tool;return TOOL_DEFAULT_IMAGE;};
export default function ToolImage({tool,variant='card',className='',priority=false}:{tool:{name:string;category:string};variant?:Variant;className?:string;priority?:boolean}){
return <div className={`relative shrink-0 overflow-hidden bg-emerald-100 ${BOX[variant]} ${className}`}>
<Image src={getToolImage(tool)} alt={`${tool.name}, ${tool.category} tool`} fill sizes={SIZES[variant]} priority={priority} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover"/></div>}
