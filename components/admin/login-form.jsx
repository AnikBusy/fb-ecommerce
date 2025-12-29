'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, User, Lock, Eye, EyeOff } from "lucide-react"

export function LoginForm({ settings }) {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(event.target)
        const result = await login(formData)

        if (result && !result.success) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden">
                <div className="p-10 pt-12 text-center bg-gradient-to-b from-zinc-50/50 to-transparent">
                    <div className="mx-auto mb-6 h-16 flex items-center justify-center">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
                        ) : (
                            <span className="text-3xl font-black tracking-tighter uppercase text-zinc-950">
                                {settings?.siteName?.toUpperCase() || 'FLUX'}<span className="text-mongodb-green">.</span>
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950 mb-2">Admin Terminal</h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide">Enter credentials to authenticate session</p>
                </div>

                <form onSubmit={handleSubmit} className="px-10 pb-12 pt-2 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50/50 border border-red-100 p-4 rounded-2xl">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Registry User</Label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-mongodb-green transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="bg-white border-zinc-200 text-zinc-950 focus:border-mongodb-green focus:ring-4 focus:ring-mongodb-green/10 h-16 rounded-[1.25rem] pl-14 pr-6 text-sm font-bold transition-all placeholder:text-zinc-500 placeholder:font-medium placeholder:italic shadow-sm"
                                placeholder="Identification Handle"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-4">Access Key</Label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-mongodb-green transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="bg-white border-zinc-200 text-zinc-950 focus:border-mongodb-green focus:ring-4 focus:ring-mongodb-green/10 h-16 rounded-[1.25rem] pl-14 pr-14 text-sm font-bold transition-all placeholder:text-zinc-500 placeholder:font-medium placeholder:italic shadow-sm"
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-black uppercase tracking-[0.2em] h-16 rounded-[1.25rem] transition-all shadow-2xl shadow-zinc-200 active:scale-95 text-xs border-none mt-4"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate Identity"}
                    </Button>
                </form>
            </div>

            <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500/50">
                System v2.1.0 // Auth Protected
            </p>
        </div>
    )
}
