import { getProducts } from "@/actions/product"
import { getCategories } from "@/actions/category"
import { ProductCard } from "@/components/shop/product-card"
import { CategorySlider } from "@/components/shop/category-slider"
import Link from "next/link"
import { Filter, Grid3X3, List } from "lucide-react"
import * as motion from "framer-motion/client"

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    const products = await getProducts({ isActive: true })
    const categories = await getCategories()

    // Serialize to plain objects for client components
    const serializedProducts = JSON.parse(JSON.stringify(products))
    const serializedCategories = JSON.parse(JSON.stringify(categories))

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Category Slider - No Images, Text Only */}
            <CategorySlider categories={serializedCategories} variant="text" isSticky={true} />

            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0 py-8 md:py-12">

                <div className="flex flex-col gap-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3 pb-6 border-b border-border/50"
                    >
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">All Collection</h1>
                        <p className="text-muted-foreground text-xs md:text-base max-w-xl italic font-medium leading-relaxed">Explore our items</p>
                    </motion.div>

                    {/* Product Grid - Full Width */}
                    <div>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8"
                        >
                            {serializedProducts.map((product) => (
                                <motion.div
                                    key={product._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

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
