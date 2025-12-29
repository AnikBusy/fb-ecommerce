
import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mongodb-green/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

            <div className="relative z-10 w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}
