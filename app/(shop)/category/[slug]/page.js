import { getProducts } from "@/actions/product"
import { getCategories, getCategoryBySlug } from "@/actions/category"
import { CategorySidebar } from "@/components/shop/category-sidebar"
import { ProductCard } from "@/components/shop/product-card"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)
    if (!category) return { title: 'Category Not Found' }

    return {
        title: `${category.name} | Collection`,
        description: `Explore our ${category.name} collection.`,
    }
}

export default async function CategoryPage({ params }) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    // Fetch child categories to include their products
    const allCategories = await getCategories()
    const children = allCategories.filter(c => c.parent?._id === category._id || c.parent === category._id)
    const categoryIds = [category._id, ...children.map(c => c._id)]

    const products = await getProducts({ category: { $in: categoryIds } })

    // Serialize to plain objects for client components
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedCategories = JSON.parse(JSON.stringify(allCategories))

    return (
        <div className="py-12 md:py-24 min-h-screen max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
            <div className="flex flex-col gap-12 md:gap-20">
                {/* Header Section */}
                <div className="space-y-8">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-mongodb-green hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Shop
                    </Link>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-mongodb-green">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-[10px] font-black tracking-[0.5em] uppercase">COLLECTION</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter shop-text leading-none">{category.name}</h1>
                        <p className="shop-muted text-sm md:text-lg max-w-2xl italic font-medium leading-relaxed">
                            Displaying {serializedProducts.length} elite items from the {category.name} manifest. Curated for performance and durability.
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-12 md:gap-20">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block h-fit sticky top-24">
                        <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                            <CategorySidebar categories={serializedCategories} />
                        </div>

                        <div className="mt-8 p-8 rounded-[2rem] bg-mongodb-dark/50 border border-white/5 shadow-sm backdrop-blur-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-mongodb-green/60 mb-6">Quality Assurance</h4>
                            <p className="text-xs shop-muted leading-relaxed italic font-medium">Every item in this collection is handpicked and quality verified for the flux community.</p>
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
                            <div className="py-32 text-center rounded-[3rem] border border-dashed border-zinc-200">
                                <p className="text-zinc-300 font-black italic uppercase tracking-[0.4em]">Cluster currently empty.</p>
                                <Link href="/shop" className="inline-block mt-8 text-[10px] font-black text-mongodb-green uppercase tracking-widest border-b border-mongodb-green pb-1 hover:border-white hover:text-white transition-all">Return to Stream</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
