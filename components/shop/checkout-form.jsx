'use client'

import { useState, useEffect } from "react"
import { useCart } from "@/providers/cart-provider"
import { createOrder } from "@/actions/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

export function CheckoutForm() {
    const { cart, cartTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [area, setArea] = useState('inside-dhaka')
    const [deliveryCharge, setDeliveryCharge] = useState(60)
    const router = useRouter()

    useEffect(() => {
        if (area === 'inside-dhaka') {
            setDeliveryCharge(60)
        } else {
            setDeliveryCharge(110)
        }
    }, [area])

    const subtotal = cartTotal
    const total = subtotal + deliveryCharge

    if (cart.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                <Button onClick={() => router.push('/')}>Continue Shopping</Button>
            </div>
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const orderData = {
            customerName: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            area: area,
            deliveryCharge: deliveryCharge,
            totalAmount: total,
            orderNote: formData.get('orderNote') || '',
            products: cart.map(item => ({
                product: item.product?._id,
                quantity: item.quantity,
                price: item.product?.discountPrice || item.product?.price || 0
            })).filter(item => item.product) // Remove invalid items
        }

        const res = await createOrder(orderData)

        if (res.success) {
            clearCart()
            toast.success('Order placed successfully!', { duration: 5000 })
            // Immediate partial update or optimistic UI could go here, 
            // but for now, we just push immediately.
            router.push(`/order-success/${res.order._id}`)
        } else {
            setLoading(false)
            toast.error('Failed to place order: ' + res.error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="Enter your name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            required
                            placeholder="017xxxxxxxx"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                if (e.target.validity.patternMismatch) {
                                    e.target.setCustomValidity('Please enter numbers only');
                                } else {
                                    e.target.setCustomValidity('');
                                }
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Full Address</Label>
                        <Textarea id="address" name="address" required placeholder="House, Road, Area..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="orderNote">Customer Note</Label>
                        <Textarea id="orderNote" name="orderNote" placeholder="" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Delivery Area</Label>
                        <RadioGroup defaultValue="inside-dhaka" onValueChange={setArea} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="inside-dhaka" id="inside" />
                                <Label htmlFor="inside">Inside Dhaka ({formatCurrency(60)})</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="outside-dhaka" id="outside" />
                                <Label htmlFor="outside">Outside Dhaka ({formatCurrency(110)})</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cart.map(item => (
                        <div key={item.product?._id || Math.random()} className="flex justify-between text-sm">
                            <span>{item.product?.title || 'Unknown'} x {item.quantity}</span>
                            <span>{formatCurrency((item.product?.discountPrice || item.product?.price || 0) * item.quantity)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-4 flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charge</span>
                        <span>{formatCurrency(deliveryCharge)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total Payable</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Processing Order...' : 'Place Order'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
