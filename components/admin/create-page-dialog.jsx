'use client'

import { useState } from 'react'
import { createPage } from "@/actions/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreatePageDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: ''
    })
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const res = await createPage(formData)

        setLoading(false)
        if (res.success) {
            setOpen(false)
            setFormData({ title: '', slug: '', content: '' })
            toast.success("Page created successfully")
            router.refresh()
        } else {
            toast.error(`Failed to create page: ${res.error}`)
        }
    }

    function handleTitleChange(title) {
        setFormData({
            ...formData,
            title,
            // Auto-generate slug from title
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Page
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="e.g., About Us"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">/</span>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="about-us"
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This will be the page URL (auto-generated from title)
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Initial Content (Optional)</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={6}
                            placeholder="Enter initial page content..."
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Page
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
