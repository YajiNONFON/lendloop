import './globals.css';
import {Outfit} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';
import Providers from '@/components/providers';
import OfflineBanner from '@/components/offline-banner';
const f=Outfit({subsets:['latin'],variable:'--font-outfit'});
export const metadata={title:'LendLoop',description:'Borrow what you need. Lend what you don’t.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <ClerkProvider><html lang="en" className={f.variable}><body className="font-sans antialiased"><OfflineBanner/><Providers>{children}</Providers></body></html></ClerkProvider>}
