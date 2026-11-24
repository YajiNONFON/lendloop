import {StoreProvider} from '@/lib/store';
import Nav from '@/components/nav';
export default function AppLayout({children}:{children:React.ReactNode}){return <StoreProvider><Nav/><main className="mx-auto max-w-[1400px] px-4 pb-28 md:px-5 md:pb-16">{children}</main></StoreProvider>}
