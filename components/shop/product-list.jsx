'use client'

import { ProductCard } from "./product-card"

export function ProductList({ products, title }) {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-0">
                {title && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-black tracking-tight text-zinc-900 border-l-4 border-zinc-900 pl-6 uppercase">{title}</h2>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
