'use client'

import { useState } from "react"
import { createOrder } from "@/actions/order"
import { saveIncompleteOrder, deleteIncompleteOrder } from "@/actions/incomplete-order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Zap, User, Phone, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function QuickOrderForm({ product, cart, total: cartTotal }) {
    const [loading, setLoading] = useState(false)
    const [area, setArea] = useState('inside-dhaka')
    const [incompleteOrderId, setIncompleteOrderId] = useState(null)
    const router = useRouter()

    const deliveryCharge = area === 'inside-dhaka' ? 60 : 110

    // Handle both single product and cart scenarios
    const total = product
        ? (product.discountPrice || product.price) + deliveryCharge
        : (cartTotal || 0) + deliveryCharge

    // Auto-save function
    const handleAutoSave = async (e) => {
        const form = e.target.closest('form')
        if (!form) return

        const formData = new FormData(form)
        const products = product
            ? [{
                product: product._id,
                quantity: 1,
                price: product.discountPrice || product.price
            }]
            : cart.map(item => ({
                product: item.product?._id,
                quantity: item.quantity,
                price: item.product?.discountPrice || item.product?.price || 0
            }))

        const data = {
            customerName: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            area: area,
            products: products,
            deliveryCharge,
            totalAmount: total,
            orderNote: formData.get('orderNote') || ''
        }

        // Only save if at least phone or name is present
        if (data.phone || data.customerName) {
            const res = await saveIncompleteOrder(data, incompleteOrderId)
            if (res.success && res.id) {
                setIncompleteOrderId(res.id)
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        // Prepare items based on whether it's a single product or cart
        const products = product
            ? [{
                product: product._id,
                quantity: 1,
                price: product.discountPrice || product.price
            }]
            : cart.map(item => ({
                product: item.product?._id,
                quantity: item.quantity,
                price: item.product?.discountPrice || item.product?.price || 0
            }))

        const orderData = {
            customerName: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            area: area,
            products: products,
            deliveryCharge,
            totalAmount: total,
            orderNote: formData.get('orderNote') || ''
        }

        const res = await createOrder(orderData)

        setLoading(false)
        if (res.success) {
            // Clean up incomplete order on success
            if (incompleteOrderId) {
                await deleteIncompleteOrder(incompleteOrderId)
            }
            toast.success('Order placed successfully! We will contact you soon.')
            router.push('/')
        } else {
            toast.error('Failed to place order. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="shop-card-bg border rounded-xl p-8 md:p-10 space-y-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-mongodb-green/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-2 relative">
                <div className="bg-mongodb-green text-mongodb-dark p-3 rounded-2xl shadow-sm">
                    <Zap className="w-5 h-5 fill-mongodb-dark" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] shop-text">Express Order</h3>
                    <p className="text-[10px] font-black shop-muted uppercase tracking-widest opacity-60">Instant execution</p>
                </div>
            </div>

            <div className="grid gap-6 relative">
                <div className="grid gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-mongodb-green" />
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest shop-muted">Full Name</Label>
                    </div>
                    <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Type your name..."
                        onBlur={handleAutoSave}
                        className="h-14 rounded-2xl border-border bg-secondary/30 shop-text placeholder:text-muted-foreground focus:border-mongodb-green focus:bg-card transition-all shadow-sm px-6"
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 text-mongodb-green" />
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest shop-muted">Phone Number</Label>
                    </div>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        required
                        placeholder="017xxxxxxxx"
                        onInput={(e) => {
                            // Remove non-numeric characters
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            // Show custom validation message
                            if (e.target.validity.patternMismatch) {
                                e.target.setCustomValidity('Please enter numbers only');
                            } else {
                                e.target.setCustomValidity('');
                            }
                        }}
                        onBlur={handleAutoSave}
                        className="h-14 rounded-2xl border-border bg-secondary/30 shop-text placeholder:text-muted-foreground focus:border-mongodb-green focus:bg-card transition-all shadow-sm px-6"
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-mongodb-green" />
                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest shop-muted">Shipping Address</Label>
                    </div>
                    <Textarea
                        id="address"
                        name="address"
                        required
                        placeholder="House, Road, Area..."
                        onBlur={handleAutoSave}
                        className="min-h-[120px] rounded-2xl border-border bg-secondary/30 shop-text placeholder:text-muted-foreground focus:border-mongodb-green focus:bg-card transition-all p-6 shadow-sm resize-none"
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3 h-3 text-mongodb-green" />
                        <Label htmlFor="orderNote" className="text-[10px] font-black uppercase tracking-widest shop-muted">Customer Note</Label>
                    </div>
                    <Input
                        id="orderNote"
                        name="orderNote"
                        placeholder=""
                        onBlur={handleAutoSave}
                        className="h-14 rounded-2xl border-border bg-secondary/30 shop-text placeholder:text-muted-foreground focus:border-mongodb-green focus:bg-card transition-all shadow-sm px-6"
                    />
                </div>
                <div className="grid gap-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest shop-muted">Regional Tier</Label>
                    <RadioGroup defaultValue="inside-dhaka" onValueChange={(val) => { setArea(val); setTimeout(() => document.getElementById('name').focus(), 0); }} className="flex flex-col md:flex-row gap-4">
                        <div className="flex items-center space-x-3 bg-secondary/30 p-4 rounded-2xl border border-border flex-1 hover:border-mongodb-green transition-all cursor-pointer group shadow-sm">
                            <RadioGroupItem value="inside-dhaka" id="quick-inside" className="border-border text-mongodb-green" />
                            <Label htmlFor="quick-inside" className="text-[10px] font-black uppercase tracking-widest shop-muted group-hover:shop-text cursor-pointer transition-colors">Inside Dhaka (60 TK.)</Label>
                        </div>
                        <div className="flex items-center space-x-3 bg-secondary/30 p-4 rounded-2xl border border-border flex-1 hover:border-mongodb-green transition-all cursor-pointer group shadow-sm">
                            <RadioGroupItem value="outside-dhaka" id="quick-outside" className="border-border text-mongodb-green" />
                            <Label htmlFor="quick-outside" className="text-[10px] font-black uppercase tracking-widest shop-muted group-hover:shop-text cursor-pointer transition-colors">Outside Dhaka (110 TK.)</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <div className="pt-8 border-t border-border relative">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-widest shop-muted">Manifest Total</span>
                    <span className="text-3xl font-black shop-text italic tracking-tighter flex items-baseline gap-1">
                        {total}
                        <span className="text-lg opacity-50 font-normal not-italic tracking-normal">TK.</span>
                    </span>
                </div>
                <Button className="w-full h-16 bg-mongodb-green hover:bg-[#00FF6C] text-mongodb-dark rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 font-black uppercase tracking-widest text-[10px] border-none" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-mongodb-dark" />}
                    Place Order
                </Button>
            </div>
        </form>
    )
}


