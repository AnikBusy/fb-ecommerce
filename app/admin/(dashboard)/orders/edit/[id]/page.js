'use client'

import { getProduct, getProducts } from "@/actions/product"
import { getOrderById, updateFullOrder } from "@/actions/order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner'

export default function EditOrderPage({ params }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [products, setProducts] = useState([])

    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        area: 'outside-dhaka',
        deliveryCharge: 0,
        discount: 0,
        orderNote: '',
        items: []
    })

    const { id } = use(params)

    useEffect(() => {
        async function load() {
            const [order, allProducts] = await Promise.all([
                getOrderById(id),
                getProducts()
            ])

            if (order) {
                setFormData({
                    customerName: order.customerName,
                    phone: order.phone,
                    address: order.address,
                    area: order.area || 'outside-dhaka',
                    deliveryCharge: order.deliveryCharge || 0,
                    discount: order.discount || 0,
                    orderNote: order.orderNote || '',
                    items: order.products.map(p => ({
                        productId: p.product?._id || p.product || '', // Handle populated, id, or null
                        quantity: p.quantity,
                        price: p.price
                    }))
                })
            }
            setProducts(allProducts)
            setLoading(false)
        }
        load()
    }, [id])


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

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const calculateTotal = () => {
        return calculateSubtotal() + Number(formData.deliveryCharge) - Number(formData.discount)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const orderData = {
                customerName: formData.customerName,
                phone: formData.phone,
                address: formData.address,
                area: formData.area,
                deliveryCharge: Number(formData.deliveryCharge),
                discount: Number(formData.discount),
                totalAmount: calculateTotal(),
                orderNote: formData.orderNote,
                products: formData.items.map(item => ({
                    product: item.productId,
                    quantity: Number(item.quantity),
                    price: Number(item.price)
                }))
            }

            const res = await updateFullOrder(id, orderData)
            if (res.success) {
                toast.success("Order updated successfully!")
                router.push('/admin/orders')
            } else {
                toast.error("Failed: " + res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold mb-6">Edit Order #{id.slice(-6)}</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Customer Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Customer Name</Label>
                                <Input required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone Number</Label>
                                <Input
                                    required
                                    type="tel"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    value={formData.phone}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        setFormData({ ...formData, phone: e.target.value });
                                        if (e.target.validity.patternMismatch) {
                                            e.target.setCustomValidity('Please enter numbers only');
                                        } else {
                                            e.target.setCustomValidity('');
                                        }
                                    }}
                                />
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
                                <Label>Customer Note (Size/Color)</Label>
                                <Input value={formData.orderNote} onChange={e => setFormData({ ...formData, orderNote: e.target.value })} placeholder="e.g. Size: XL, Color: Black" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pricing Adjustment</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Delivery Charge (TK.)</Label>
                                <Input type="number" value={formData.deliveryCharge} onChange={e => setFormData({ ...formData, deliveryCharge: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-red-500">Discount (TK.)</Label>
                                <Input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="border-red-200 focus-visible:ring-red-500" />
                                <p className="text-xs text-muted-foreground">Amount to deduct from total.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-2 items-end border-b pb-4 mb-4">
                                <div className="flex-1 w-full">
                                    <Label className="text-xs">Product</Label>
                                    <Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:w-24">
                                    <Label className="text-xs">Qty</Label>
                                    <Input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                                </div>
                                <div className="w-full md:w-32">
                                    <Label className="text-xs">Price (TK.)</Label>
                                    <Input type="number" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} className="hover:bg-red-600">
                                    <span className="sr-only">Delete</span>
                                    &times;
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addItem} className="w-full hover:bg-green-50 hover:text-green-700 hover:border-green-300">
                            + Add Product
                        </Button>
                    </CardContent>
                </Card>

                <Card className="mt-6 mb-8 bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="flex justify-between py-2 border-b border-muted-foreground/20">
                            <span>Subtotal</span>
                            <span>{calculateSubtotal()} TK.</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-muted-foreground/20">
                            <span>Delivery Charge</span>
                            <span>+ {Number(formData.deliveryCharge)} TK.</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-muted-foreground/20 text-red-500">
                            <span>Discount</span>
                            <span>- {Number(formData.discount)} TK.</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-xl mt-2">
                            <span>Grand Total</span>
                            <span>{calculateTotal()} TK.</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 sticky bottom-6 bg-background p-4 border rounded shadow-lg z-10">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 hover:bg-gray-100 hover:text-gray-900">Cancel</Button>
                    <Button type="submit" disabled={saving} className="flex-1 hover:bg-primary/90">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Order
                    </Button>
                </div>
            </form>
        </div>
    )
}
