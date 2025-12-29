import { Header } from "@/components/shop/header"
import { Footer } from "@/components/shop/footer"
import { CartProvider } from "@/providers/cart-provider"
import { CartSheet } from "@/components/shop/cart-sheet"
import { getCategories } from "@/actions/category"

export default async function ShopLayout({ children }) {
    const categories = await getCategories()
    const serializedCategories = JSON.parse(JSON.stringify(categories))

    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Header categories={serializedCategories} />
                <main className="flex-1 w-full pt-20 md:pt-24">
                    {children}
                </main>
                <Footer />
                <CartSheet />
            </div>
        </CartProvider>
    )
}
