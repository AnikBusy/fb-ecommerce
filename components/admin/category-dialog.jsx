'use client'

import { useState, useEffect } from 'react'
import { createCategory, updateCategory } from "@/actions/category"
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
import { Plus, Loader2, Pencil } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CategoryDialog({ category, trigger }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(category?.image || '')
    const [name, setName] = useState(category?.name || '')
    const [uploading, setUploading] = useState(false)

    const router = useRouter()
    const isEdit = !!category

    useEffect(() => {
        if (category) {
            setImage(category.image || '')
            setName(category.name || '')
        }
    }, [category])

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
                setImage(data.url)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        const data = {
            name: formData.get('name'),
            slug: formData.get('name').toLowerCase().replace(/\s+/g, '-'),
            image: image
        }

        const res = isEdit
            ? await updateCategory(category._id, data)
            : await createCategory(data)

        setLoading(false)
        if (res.success) {
            setOpen(false)
            if (!isEdit) {
                setImage('')
                setName('')
            }
            toast.success(`Category ${isEdit ? 'updated' : 'created'} successfully!`)
            router.refresh()
        } else {
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} category`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger || (
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                        />
                        {uploading && <div className="text-sm">Uploading...</div>}
                        {image && (
                            <img src={image} className="h-20 w-20 object-cover rounded mt-2" alt="Preview" />
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={loading || uploading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
