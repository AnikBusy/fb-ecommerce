import { getProducts } from "@/actions/product"
import { getCategories } from "@/actions/category"
import { ProductCard } from "@/components/shop/product-card"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Filter, Grid3X3, List } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    const products = await getProducts()
    const categories = await getCategories()

    // Serialize to plain objects for client components
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedCategories = JSON.parse(JSON.stringify(categories))

    return (
        <div className="py-12 md:py-24 min-h-screen max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
            <div className="flex flex-col gap-12 md:gap-20">
                {/* Header Section */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter shop-text">Full Collection</h1>
                    <p className="shop-muted text-sm md:text-lg max-w-2xl italic font-medium leading-relaxed">Explore our premium selection of quality items curated for style and durability.</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-12 md:gap-20">
                    {/* Sidebar Filters */}
                    <aside className="space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-mongodb-green">Filter Group</h3>
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/shop"
                                    className="text-sm font-black uppercase tracking-widest text-mongodb-green transition-colors flex items-center justify-between group"
                                >
                                    All Products
                                    <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-mongodb-green">{serializedProducts.length}</span>
                                </Link>
                                {serializedCategories.map(cat => (
                                    <Link
                                        key={cat._id}
                                        href={`/category/${cat.slug}`}
                                        className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-mongodb-green transition-colors flex items-center justify-between group"
                                    >
                                        {cat.name}
                                        <div className="w-6 h-px bg-zinc-800 group-hover:bg-mongodb-green transition-colors"></div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-mongodb-dark/50 border border-white/5 shadow-sm backdrop-blur-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-mongodb-green/60 mb-6">Quality Assurance</h4>
                            <p className="text-xs shop-muted leading-relaxed italic font-medium">Every item in our collection is handpicked and quality verified for the flux community.</p>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
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
