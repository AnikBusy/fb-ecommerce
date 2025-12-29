'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
        } else {
            // Redirect handled server side or here
            // router.push('/admin/dashboard') 
            // We rely on server action redirect usually, but client might need refresh
            // result in login action does redirect.
        }
    }

    return (
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-zinc-200 shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-8 pt-10">
                <div className="mx-auto mb-4">
                    <span className="text-3xl font-black tracking-tighter uppercase text-zinc-900">Flux<span className="text-mongodb-green">.</span></span>
                </div>
                <CardTitle className="text-xl font-bold text-zinc-800">Welcome Back</CardTitle>
                <CardDescription className="text-zinc-500">
                    Sign in to manage your store
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-6 px-8">
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="font-bold text-zinc-900">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="bg-white border-zinc-400 text-zinc-900 focus:border-mongodb-green focus:ring-mongodb-green/20 h-11 placeholder:text-zinc-400"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="font-bold text-zinc-900">Password</Label>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="bg-white border-zinc-400 text-zinc-900 focus:border-mongodb-green focus:ring-mongodb-green/20 h-11 placeholder:text-zinc-400"
                            placeholder="••••••••"
                        />
                    </div>
                </CardContent>
                <CardFooter className="pb-10 px-8 pt-6">
                    <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 transition-all shadow-lg active:scale-95 text-base mt-2" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
