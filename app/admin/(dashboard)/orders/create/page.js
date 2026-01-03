'use client'

import { createOrder } from "@/actions/order"
import { getProducts } from "@/actions/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSettings } from "@/providers/settings-provider"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CreateOrderPage() {
    const router = useRouter()
    const { settings } = useSettings()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        area: 'outside-dhaka',
        deliveryCharge: 110,
        orderNote: '',
        items: [{ productId: '', quantity: 1, price: 0 }]
    })

    useEffect(() => {
        async function load() {
            const data = await getProducts()
            setProducts(data)
        }
        load()
    }, [])

    useEffect(() => {
        // Auto-update delivery charge based on area
        if (settings) {
            const charge = formData.area === 'inside-dhaka'
                ? settings.deliveryChargeInsideDhaka
                : settings.deliveryChargeOutsideDhaka
            setFormData(prev => ({ ...prev, deliveryCharge: charge }))
        }
    }, [formData.area, settings])

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items]
        newItems[index][field] = value

        // Auto-set price if product changes
        if (field === 'productId') {
            const product = products.find(p => p._id === value)
            if (product) {
                newItems[index].price = product.discountPrice || product.price
            }
        }
        setFormData({ ...formData, items: newItems })
    }

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 1, price: 0 }]
        })
    }

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index)
        setFormData({ ...formData, items: newItems })
    }

    const calculateTotal = () => {
        const itemsTotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        return itemsTotal + formData.deliveryCharge
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Prepare data for server action
            const orderData = {
                customerName: formData.customerName,
                phone: formData.phone,
                address: formData.address,
                area: formData.area,
                deliveryCharge: formData.deliveryCharge,
                totalAmount: calculateTotal(),
                products: formData.items.map(item => ({
                    product: item.productId,
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                })),
                status: 'pending', // Default status
                orderNote: formData.orderNote
            }

            const res = await createOrder(orderData)
            if (res.success) {
                toast.success("Order created successfully!")
                router.push('/admin/orders')
            } else {
                toast.error("Failed: " + res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <h1 className="text-xl font-bold uppercase mb-6 text-foreground">
                Create Manual Order<span className="text-primary">.</span>
            </h1>
            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader className="border-b border-border/50 bg-primary/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Customer Name</Label>
                            <Input required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone Number</Label>
                            <Input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Area</Label>
                            <Select value={formData.area} onValueChange={(val) => setFormData({ ...formData, area: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inside-dhaka">Inside Dhaka</SelectItem>
                                    <SelectItem value="outside-dhaka">Outside Dhaka</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Order Note (Size/Color etc)</Label>
                            <Input value={formData.orderNote} onChange={e => setFormData({ ...formData, orderNote: e.target.value })} placeholder="e.g. Size: XL, Color: Black" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader className="border-b border-border/50 bg-primary/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center group hover:bg-primary/5 transition-colors">
                                    {/* Product Image Preview */}
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                                            {products.find(p => p._id === item.productId)?.images?.[0] ? (
                                                <img
                                                    src={products.find(p => p._id === item.productId).images[0]}
                                                    alt="Product"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase font-black">No Pic</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Selection */}
                                    <div className="col-span-10 sm:col-span-6">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Product</Label>
                                        <Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)}>
                                            <SelectTrigger className="h-10 glass focus:ring-primary">
                                                <SelectValue placeholder="Search & Select Product" />
                                            </SelectTrigger>
                                            <SelectContent className="glass">
                                                {products.map(p => (
                                                    <SelectItem key={p._id} value={p._id}>
                                                        {p.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-5 sm:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Quantity</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                            className="h-10 text-center"
                                        />
                                    </div>

                                    {/* Price (Read-only for manual sanity) */}
                                    <div className="col-span-5 sm:col-span-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Unit Price</Label>
                                        <div className="h-10 flex items-center justify-center rounded-md bg-muted/50 border border-transparent font-bold text-sm">
                                            {item.price} <span className="ml-1 text-[10px] font-normal text-muted-foreground">TK</span>
                                        </div>
                                    </div>

                                    {/* Delete Action */}
                                    <div className="col-span-2 sm:col-span-1 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-muted/5">
                            <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed border-2 hover:bg-primary/10 hover:text-primary transition-all uppercase text-xs font-black tracking-widest">
                                + Add Another Item
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-8 overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            <div className="flex justify-between p-4 text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-bold">{formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} TK.</span>
                            </div>
                            <div className="flex justify-between p-4 text-sm">
                                <span className="text-muted-foreground">Delivery Charge</span>
                                <span className="font-bold">{formData.deliveryCharge} TK.</span>
                            </div>
                            <div className="flex justify-between p-6 bg-primary/5">
                                <span className="text-sm font-black uppercase tracking-widest text-primary">Grand Total</span>
                                <span className="text-xl font-black text-primary">{calculateTotal()} TK.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? 'Creating...' : 'Place Order'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
