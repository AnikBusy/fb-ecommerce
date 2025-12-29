
import { CheckoutForm } from "@/components/shop/checkout-form"

export default function CheckoutPage() {
    return (
        <div className="container px-4 py-8 md:px-0 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <CheckoutForm />
        </div>
    )
}
