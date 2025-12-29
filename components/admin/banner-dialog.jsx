'use client'

import { useState, useEffect } from 'react'
import { createBanner, updateBanner } from "@/actions/banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, X, Pencil } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function BannerDialog({ banner, trigger }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState(banner?.imageUrl || '')
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: banner?.title || '',
        link: banner?.link || '',
        type: banner?.type || 'hero',
        order: banner?.order || 0
    })
    const [bannersCount, setBannersCount] = useState(0)

    const router = useRouter()
    const isEdit = !!banner

    useEffect(() => {
        if (banner) {
            setImageUrl(banner.imageUrl || '')
            setFormData({
                title: banner.title || '',
                link: banner.link || '',
                type: banner.type || 'hero',
                order: banner.order || 0
            })
        } else if (open) {
            // Fetch total count for next order
            const fetchCount = async () => {
                try {
                    const res = await fetch('/api/banners-count')
                    const data = await res.json()
                    if (data.success) {
                        setFormData(prev => ({ ...prev, order: data.count }))
                    }
                } catch (err) {
                    console.error("Failed to fetch count:", err)
                }
            }
            fetchCount()
        }
    }, [banner, open])

    async function handleUpload(e) {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                setImageUrl(data.url)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!imageUrl) return toast.error("Please upload an image")

        setLoading(true)
        const form = new FormData(e.target)

        const data = {
            title: form.get('title'),
            link: form.get('link'),
            type: form.get('type'),
            imageUrl: imageUrl,
            order: Number(form.get('order')) || 0,
        }

        const res = isEdit
            ? await updateBanner(banner._id, data)
            : await createBanner(data)

        setLoading(false)
        if (res.success) {
            setOpen(false)
            if (!isEdit) {
                setImageUrl('')
                setFormData({ title: '', link: '', type: 'hero', order: 0 })
            }
            toast.success(`Banner ${isEdit ? 'updated' : 'created'} successfully`)
            router.refresh()
        } else {
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} banner`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger || (
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Banner
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Banner Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Hero Winter Sale (Internal Use)" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hero">Hero Slider</SelectItem>
                                    <SelectItem value="promo">Promotional Banner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input id="order" name="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="link">Link URL (Optional)</Label>
                        <Input id="link" name="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="/product/my-product" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="banner-img">Banner Image</Label>
                        <Input
                            id="banner-img"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            required={!imageUrl}
                        />
                        {uploading && <div className="text-sm">Uploading...</div>}
                        {imageUrl && (
                            <div className="relative h-40 w-full border rounded mt-2 overflow-hidden bg-zinc-50 flex items-center justify-center">
                                <img src={imageUrl} className="h-full w-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl('')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="submit" disabled={loading || uploading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Banner' : 'Save Banner'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
