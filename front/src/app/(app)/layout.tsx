import EnsureUser from '@/components/ensure-user';
import AppShell from '@/components/app-shell';
export default function AppLayout({children}:{children:React.ReactNode}){return <><EnsureUser/><AppShell>{children}</AppShell></>}
