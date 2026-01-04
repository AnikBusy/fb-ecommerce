import { getProduct, getProducts } from "@/actions/product"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { QuickOrderForm } from "@/components/shop/quick-order-form"
import { ProductCard } from "@/components/shop/product-card"
import { ProductImageGallery } from "@/components/shop/product-image-gallery"
import { notFound } from "next/navigation"
import { Sparkles, ShieldCheck, Truck, RefreshCcw, ArrowLeft, Package, RotateCcw } from "lucide-react"
import Link from "next/link"
import { ProductSwiper } from "@/components/shop/product-swiper"
import { ProductBottomBar } from "@/components/shop/product-bottom-bar"

export async function generateMetadata({ params }) {
    const { slug } = await params
    const product = await getProduct(slug)
    if (!product) return { title: 'Product Not Found' }

    return {
        title: product.title,
        description: product.description.substring(0, 160),
    }
}

export default async function ProductPage({ params }) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getProducts({
        category: product.category?._id,
        _id: { $ne: product._id },
        isActive: true
    }).then(list => list.slice(0, 10))

    // Serialize to plain objects for client components
    const serializedProduct = JSON.parse(JSON.stringify(product))
    const serializedRelated = JSON.parse(JSON.stringify(relatedProducts))

    return (
        <div className="bg-background min-h-screen md:pb-32 pb-24">
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left: Product Media */}
                    <div className="space-y-6">
                        <ProductImageGallery images={serializedProduct.images} title={serializedProduct.title} />
                    </div>

                    {/* Right: Basic Product Info */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">{serializedProduct.category?.name || 'Exclusive Edition'}</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground leading-[1.1] uppercase">{serializedProduct.title}</h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-3xl md:text-5xl font-black text-foreground italic tracking-tighter flex items-baseline gap-1">
                                    {serializedProduct.discountPrice || serializedProduct.price}
                                    <span className="text-xl md:text-2xl opacity-50 font-normal not-italic tracking-normal">TK.</span>
                                </span>
                                {serializedProduct.discountPrice > 0 && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground line-through font-bold opacity-60 text-sm md:text-lg">{serializedProduct.price} TK.</span>
                                        <span className="text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full w-fit">Save {serializedProduct.price - serializedProduct.discountPrice} TK.</span>
                                    </div>
                                )}
                            </div>

                            {/* Delivery & Return Info */}
                            <div className="grid grid-cols-1 gap-4 py-6 border-y border-border/50">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20">
                                    <div className="p-2 bg-background rounded-full shadow-sm">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Delivery Information</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Fast delivery nationwide. Usually displayed in 2-4 business days. specialized handling for premium items.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20">
                                    <div className="p-2 bg-background rounded-full shadow-sm">
                                        <RotateCcw className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Return Condition</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Easy returns within 7 days. Item must be unused and in original packaging. Terms applied.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Standard Desktop Actions */}
                            <div className="hidden md:grid grid-cols-2 gap-4">
                                <AddToCartButton product={serializedProduct} className="rounded-full shadow-lg h-12 text-base" />
                                <AddToCartButton product={serializedProduct} variant="order" className="rounded-full shadow-lg h-12 text-base" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="mt-12 md:mt-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b border-border">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground flex items-center gap-2">
                                <Package className="w-6 h-6 text-primary" />
                                Product Details
                            </h2>
                        </div>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
                            <p className="whitespace-pre-line">{serializedProduct.description}</p>
                        </div>
                    </div>
                </div>

                {/* Related Products Section via Swiper */}
                {serializedRelated.length > 0 && (
                    <div className="mt-20 space-y-8">
                        <div className="flex items-end justify-between border-b border-border pb-4">
                            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-foreground">You May Also Like</h2>
                        </div>
                        <ProductSwiper products={serializedRelated} />
                    </div>
                )}
            </div>

            {/* Mobile Bottom Actions */}
            <ProductBottomBar product={serializedProduct} />
        </div>
    )
}
