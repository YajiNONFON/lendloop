import './globals.css';
import {Outfit} from 'next/font/google';
const f=Outfit({subsets:['latin'],variable:'--font-outfit'});
export const metadata={title:'LendLoop',description:'Borrow what you need. Lend what you don’t.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={f.variable}><body className="font-sans antialiased">{children}</body></html>}
