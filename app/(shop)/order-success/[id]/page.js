
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function OrderSuccessPage({ params }) {
    const { id } = await params

    return (
        <div className="container py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
            <div className="space-y-3 mb-8 max-w-md">
                <p className="text-lg">Thank you for your order!</p>
                <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Your Order ID:</p>
                    <p className="font-mono text-sm font-bold break-all">{id}</p>
                </div>
                <p className="text-muted-foreground">
                    We will contact you shortly to confirm your order details.
                </p>
            </div>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}
