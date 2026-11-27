import Nav from '@/components/nav';
import EnsureUser from '@/components/ensure-user';
export default function AppLayout({children}:{children:React.ReactNode}){return <><EnsureUser/><Nav/><main className="mx-auto max-w-[1400px] px-4 pb-28 md:px-5 md:pb-16">{children}</main></>}
