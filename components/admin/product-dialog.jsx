'use client'

import { useState, useEffect } from 'react'
import { createProduct, updateProduct } from "@/actions/product"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2, X, Pencil } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ProductDialog({ categories, product, trigger }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState(product?.images || [])
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: product?.title || '',
        category: product?.category?._id || '',
        price: product?.price || 0,
        discountPrice: product?.discountPrice || 0,
        stock: product?.stock || 0,
        description: product?.description || '',
        isFeatured: product?.isFeatured || false,
        isBestSelling: product?.isBestSelling || false,
        isPromotional: product?.isPromotional || false
    })

    const router = useRouter()
    const isEdit = !!product

    useEffect(() => {
        if (product) {
            setImages(product.images || [])
            setFormData({
                title: product.title || '',
                category: product.category?._id || '',
                price: product.price || 0,
                discountPrice: product.discountPrice || 0,
                stock: product.stock || 0,
                description: product.description || '',
                isFeatured: product.isFeatured || false,
                isBestSelling: product.isBestSelling || false,
                isPromotional: product.isPromotional || false
            })
        }
    }, [product])

    async function handleUpload(e) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData()
            formData.append('file', files[i])

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                if (data.success) {
                    setImages(prev => [...prev, data.url])
                }
            } catch (err) {
                console.error(err)
            }
        }
        setUploading(false)
    }

    function removeImage(index) {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const form = new FormData(e.target)
        const data = {
            title: form.get('title'),
            slug: form.get('title').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: form.get('category'),
            price: Number(form.get('price')),
            discountPrice: Number(form.get('discountPrice')) || 0,
            stock: Number(form.get('stock')),
            description: form.get('description'),
            images: images,
            isFeatured: form.get('isFeatured') === 'on',
            isBestSelling: form.get('isBestSelling') === 'on',
            isPromotional: form.get('isPromotional') === 'on',
        }

        const res = isEdit
            ? await updateProduct(product._id, data)
            : await createProduct(data)

        setLoading(false)
        if (res.success) {
            setOpen(false)
            if (!isEdit) {
                setImages([])
                setFormData({
                    title: '',
                    category: '',
                    price: 0,
                    discountPrice: 0,
                    stock: 0,
                    description: '',
                    isFeatured: false,
                    isBestSelling: false,
                    isPromotional: false
                })
            }
            toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully!`)
            router.refresh()
        } else {
            toast.error(`Failed to ${isEdit ? 'update' : 'create'} product: ${res.error}`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger || (
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => (
                                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" name="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (TK.)</Label>
                            <Input id="price" name="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
                            <Input id="discountPrice" name="discountPrice" type="number" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border p-4 rounded-lg bg-zinc-50/50">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-zinc-300" />
                            <Label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-tight">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isBestSelling" name="isBestSelling" checked={formData.isBestSelling} onChange={(e) => setFormData({ ...formData, isBestSelling: e.target.checked })} className="h-4 w-4 rounded border-zinc-300" />
                            <Label htmlFor="isBestSelling" className="text-xs font-bold uppercase tracking-tight">Best Selling</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isPromotional" name="isPromotional" checked={formData.isPromotional} onChange={(e) => setFormData({ ...formData, isPromotional: e.target.checked })} className="h-4 w-4 rounded border-zinc-300" />
                            <Label htmlFor="isPromotional" className="text-xs font-bold uppercase tracking-tight">Promotional</Label>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="images">Images</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                        />
                        {uploading && <div className="text-sm">Uploading...</div>}
                        <div className="flex gap-2 flex-wrap mt-2">
                            {images.map((img, i) => (
                                <div key={i} className="relative h-20 w-20 border rounded overflow-hidden group">
                                    <img src={img} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={loading || uploading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
