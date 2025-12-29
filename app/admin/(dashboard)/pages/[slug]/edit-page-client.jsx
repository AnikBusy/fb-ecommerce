'use client'

import { useState, useEffect } from 'react'
import { getPageBySlug, updatePage } from "@/actions/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from 'sonner'

export default function EditPageClient({ slug, initialPage }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialPage?.title || '',
        content: initialPage?.content || ''
    })
    const router = useRouter()

    const pageTitles = {
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        contact: 'Contact Us'
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const res = await updatePage(slug, formData)

        setLoading(false)
        if (res.success) {
            toast.success("Page updated successfully")
            router.push('/admin/pages')
            router.refresh()
        } else {
            toast.error("Failed to update page")
        }
    }

    return (
        <div className="grid gap-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/pages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Edit {pageTitles[slug]}</h1>
                    <p className="text-sm text-muted-foreground">Manage the content for /{slug}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Page Content</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Page Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={15}
                                className="font-mono text-sm"
                                placeholder="Enter page content here..."
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                You can use basic HTML tags for formatting.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link href="/admin/pages">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
