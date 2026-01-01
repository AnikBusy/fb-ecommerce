import { getProducts } from "@/actions/product"
import { getCategories } from "@/actions/category"
import { ProductCard } from "@/components/shop/product-card"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Filter, Grid3X3, List } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    const products = await getProducts({ isActive: true })
    const categories = await getCategories()

    // Serialize to plain objects for client components
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedCategories = JSON.parse(JSON.stringify(categories))

    return (
        <div className="py-12 md:py-24 min-h-screen max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
            <div className="flex flex-col gap-12 md:gap-20">
                {/* Header Section */}
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter shop-text">Full Collection</h1>
                    <p className="shop-muted text-xs md:text-base max-w-xl italic font-medium leading-relaxed">Explore our premium selection of quality items curated for style and durability.</p>
                </div>

                <div className="grid gap-12 md:gap-20">
                    {/* Product Grid */}
                    <div className="w-full">
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                            {serializedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {serializedProducts.length === 0 && (
                            <div className="py-32 text-center">
                                <p className="text-zinc-300 font-black italic uppercase tracking-[0.4em]">No products available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
