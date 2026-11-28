import {SignUp} from '@clerk/nextjs';
import AuthShell from '@/components/auth-shell';
export default function SignUpPage(){return <AuthShell><SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard"/></AuthShell>;}
