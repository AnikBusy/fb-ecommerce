import { getProducts } from "@/actions/product"
import { getCategories, getCategoryBySlug } from "@/actions/category"
import { CategorySidebar } from "@/components/shop/category-sidebar"
import { ProductCard } from "@/components/shop/product-card"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { CategorySlider } from "@/components/shop/category-slider"
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
        <div className="pb-12 md:pb-24 min-h-screen">


            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0 pt-12 md:pt-24">
                <CategorySlider categories={serializedCategories} isSticky={true} activeSlug={slug} />
                <div className="flex flex-col gap-12 md:gap-20">
                    {/* Header Section */}
                    <div className="space-y-8">
                        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors group">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Shop
                        </Link>

                    </div>

                    <div className="grid lg:grid-cols-6 gap-12 md:gap-4">


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
                                    <Link href="/shop" className="inline-block mt-8 text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary pb-1 hover:border-foreground hover:text-foreground transition-all">Return to Stream</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
