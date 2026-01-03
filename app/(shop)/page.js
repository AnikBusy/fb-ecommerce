import { getProducts } from "@/actions/product"
import { getBanners } from "@/actions/banner"
import { getCategories } from "@/actions/category"
import { ProductCard } from "@/components/shop/product-card"
import { CategorySlider } from "@/components/shop/category-slider"
import { BannerCarousel } from "@/components/shop/banner-carousel"
import { CategorySidebar } from "@/components/shop/category-sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap, Star, Flame, Sparkles } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const [banners, allProducts, categories] = await Promise.all([
        getBanners({ isActive: true }),
        getProducts({ isActive: true }),
        getCategories()
    ])

    const heroBanners = banners.filter(b => b.type === 'hero')
    const promoBanners = banners.filter(b => b.type === 'promo')

    const newProducts = allProducts.slice(0, 6)
    const bestSelling = allProducts.filter(p => p.isBestSelling).slice(0, 4)
    const featuredProducts = allProducts.filter(p => p.isFeatured).slice(0, 6)

    // Serialize to plain objects for client components
    const serializedHeroBanners = JSON.parse(JSON.stringify(heroBanners))
    const serializedPromoBanners = JSON.parse(JSON.stringify(promoBanners))
    const serializedCategories = JSON.parse(JSON.stringify(categories))
    const serializedNewProducts = JSON.parse(JSON.stringify(newProducts))
    const serializedBestSelling = JSON.parse(JSON.stringify(bestSelling))
    const serializedFeatured = JSON.parse(JSON.stringify(featuredProducts))

    return (
        <div className="pb-5 overflow-hidden">
            {/* 1. Rolling Categories Section - Now at Top */}
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0 mt-4 md:mt-8">
                <CategorySlider categories={categories} />
            </div>

            {/* 2. Hero Section - Full Width Banner */}
            <section className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] mt-4 md:mt-8">
                <div className="h-[30vh] md:h-[60vh] relative overflow-hidden shadow-lg border border-border rounded-2xl">
                    {heroBanners.length > 0 ? (
                        <BannerCarousel banners={heroBanners} />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-800 font-black italic text-4xl md:text-8xl select-none">SHOP BANNERS</div>
                    )}
                </div>
            </section>

            {/* Container for Centered Content */}
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0 space-y-12 md:space-y-24 mt-8 md:mt-16">



                {/* 3. New Added Products (Just Arrived) */}
                <section className="relative">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

                    <div className="relative p-0">
                        <div className="">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 md:mb-8 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-0.5 w-6 bg-primary"></div>
                                        <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">Pulse</span>
                                    </div>
                                    <h3 className="text-xl md:text-4xl font-black uppercase tracking-tighter text-foreground">New Arrived</h3>
                                </div>
                                <Link href="/shop" className="group flex items-center gap-4 bg-primary px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 w-fit">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground">View Store</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary-foreground transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-4">
                                {serializedNewProducts.slice(0, 6).map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Best Selling Products */}
                {/* 4. Best Selling Products: Premium Redesign */}
                <section className="relative py-12 md:py-32">
                    {/* Background Accents */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[120%] bg-gradient-to-b from-transparent via-zinc-100/50 dark:via-zinc-900/50 to-transparent -z-10 rounded-[100%] blur-3xl opacity-50"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
                                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">Trending Now</span>
                            </div>
                            <h2 className="text-xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-[0.9]">
                                Most Loved <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Items</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 relative z-10">
                        {serializedBestSelling.map((product, idx) => (
                            <div key={product._id} className={`transform transition-all duration-500 hover:-translate-y-2 ${idx % 2 === 0 ? 'md:translate-y-8' : ''}`}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Promotional Banners: Premium Glassmorphism Redesign */}
                {/* 5. Promotional Banners: Premium Feature Section */}



                {/* 5. Promotional Banners: Hero Style Redesign */}
                {serializedPromoBanners.length > 0 && (() => {
                    const promo = serializedPromoBanners[0];
                    return (
                        <section className="relative w-full h-[200px] md:h-[400px] overflow-hidden group my-12 md:my-20">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={promo.imageUrl}
                                    alt={promo.title || "Promotional Banner"}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {/* Overlay Gradient - Darker for better text readability */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-700"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                                <div className="space-y-6 max-w-3xl">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="h-px w-10 bg-yellow-500"></span>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-yellow-500 shadow-sm">Exclusive Offer</span>
                                        <span className="h-px w-10 bg-yellow-500"></span>
                                    </div>

                                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-yellow-500 leading-[0.9] drop-shadow-2xl">
                                        {promo.title || "Special Promotion"}
                                    </h2>

                                    <p className="text-zinc-200 font-medium text-lg md:text-xl max-w-xl mx-auto leading-relaxed drop-shadow-md">
                                        Discover our latest collection defined by innovation, style, and premium quality.
                                    </p>

                                    <div className="pt-4">
                                        <Link
                                            href={promo.link || '/shop'}
                                            className="inline-flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl"
                                        >
                                            Shop Now
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })()}

                {/* 6. Promotional Products */}
                <section className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <Sparkles className="w-3.5 h-3.5 fill-yellow-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Current Stream</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-foreground">Featured Offers</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {serializedFeatured.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 7. Final Call to Action */}
                <div className="flex flex-col items-center gap-6 md:gap-10 py-5 md:py-24 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-32 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                    <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 md:px-16 h-12 md:h-20 font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 group border-none">
                        <Link href="/shop" className="flex items-center gap-4">
                            Explore All Products
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    <div className="text-center space-y-1.5 opacity-60">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">Cash On </p>
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground italic">Delivery Available</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
