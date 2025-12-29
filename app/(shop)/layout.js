import { Header } from "@/components/shop/header"
import { Footer } from "@/components/shop/footer"
import { CartProvider } from "@/providers/cart-provider"
import { CartSheet } from "@/components/shop/cart-sheet"
export default function ShopLayout({ children }) {
    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1 w-full pt-20 md:pt-24">
                    {children}
                </main>
                <Footer />
                <CartSheet />
            </div>
        </CartProvider>
    )
}
