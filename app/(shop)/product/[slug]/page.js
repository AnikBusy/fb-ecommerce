import { getProduct, getProducts } from "@/actions/product"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { QuickOrderForm } from "@/components/shop/quick-order-form"
import { ProductCard } from "@/components/shop/product-card"
import { ProductImageGallery } from "@/components/shop/product-image-gallery"
import { notFound } from "next/navigation"
import { Sparkles, ShieldCheck, Truck, RefreshCcw, ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

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
    }).then(list => list.slice(0, 4))

    // Serialize to plain objects for client components
    const serializedProduct = JSON.parse(JSON.stringify(product))
    const serializedRelated = JSON.parse(JSON.stringify(relatedProducts))

    return (
        <div className="bg-background min-h-screen md:pb-32 pb-10">
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
                {/* Breadcrumb / Back */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shop-muted hover:text-mongodb-green transition-colors mb-6 md:mb-10 group">
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Back to Collection
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Product Media */}
                    <div className="space-y-6">
                        <ProductImageGallery images={serializedProduct.images} title={serializedProduct.title} />
                    </div>

                    {/* Right: Basic Product Info */}
                    <div className="space-y-10">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-mongodb-green">
                                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">{serializedProduct.category?.name || 'Exclusive Edition'}</span>
                                </div>
                                <h1 className="text-2xl md:text-5xl font-black tracking-tighter shop-text leading-[0.9] uppercase">{serializedProduct.title}</h1>
                            </div>

                            <div className="flex items-center gap-8">
                                <span className="text-3xl md:text-6xl font-black shop-text italic tracking-tighter flex items-baseline gap-1">
                                    {serializedProduct.discountPrice || serializedProduct.price}
                                    <span className="text-xl md:text-3xl opacity-50 font-normal not-italic tracking-normal">TK.</span>
                                </span>
                                {serializedProduct.discountPrice > 0 && (
                                    <div className="flex flex-col">
                                        <span className="text-sm md:text-xl shop-muted line-through font-bold opacity-40">{serializedProduct.price} TK.</span>
                                        <span className="text-mongodb-green text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-mongodb-green/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full w-fit">Save {serializedProduct.price - serializedProduct.discountPrice} TK.</span>
                                    </div>
                                )}
                            </div>

                            {/* Trust markers */}
                            <div className="grid grid-cols-2 gap-10 py-10 border-y">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-mongodb-green/10 flex items-center justify-center border border-mongodb-green/20">
                                        <ShieldCheck className="w-6 h-6 text-mongodb-green" />
                                    </div>
                                    <span className="text-[10px] font-black shop-text/60 uppercase tracking-widest leading-tight">Elite<br />Authentic</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center border">
                                        <Truck className="w-6 h-6 shop-muted" />
                                    </div>
                                    <span className="text-[10px] font-black shop-text/60 uppercase tracking-widest leading-tight">Priority<br />Shipment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Row: Details & Order Form */}
                <div className="mt-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left Column: Product Details */}
                    <div className="space-y-8 ">
                        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                            <div className="h-12 w-12 rounded-2xl bg-mongodb-green/10 flex items-center justify-center border border-mongodb-green/20">
                                <Package className="w-6 h-6 text-mongodb-green" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter shop-text">Product Details</h2>
                        </div>

                        <div className="shop-card-bg rounded-xl md:p-8 p-6 border shadow-sm">
                            <div className="prose prose-invert max-w-none">
                                <div className="shop-text text-base leading-relaxed whitespace-pre-line">
                                    {serializedProduct.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Form & Actions */}
                    <div className="space-y-10 lg:sticky lg:top-24">
                        {/* Quick Order Form */}
                        <QuickOrderForm product={serializedProduct} />

                        <div className="fixed bottom-6 right-6 z-50 md:static md:block">
                            <AddToCartButton
                                product={serializedProduct}
                                className="w-auto px-8 md:w-full h-16 md:h-20 rounded-full text-[10px] uppercase tracking-[0.3em] font-black shadow-2xl md:shadow-lg bg-mongodb-green  hover:bg-[#00FF6C] transition-all hover:scale-105 active:scale-95"
                            />
                        </div>

                    </div>
                </div>

                {/* Related Products Section */}
                {serializedRelated.length > 0 && (
                    <div className="mt-48 space-y-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-mongodb-green">
                                    <div className="h-0.5 w-8 bg-mongodb-green"></div>
                                    <span className="text-[10px] font-black tracking-[0.5em] uppercase">Extended Manifest</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black shop-text uppercase tracking-tighter">Related Modules</h2>
                            </div>
                            <Link href="/shop" className="text-[10px] font-black shop-text/40 hover:text-mongodb-green uppercase tracking-widest transition-colors mb-2">
                                Explore Full Shop
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                            {serializedRelated.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
