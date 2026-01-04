'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ProductCard } from "./product-card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useRef } from 'react'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

export function ProductSwiper({ products }) {
    const swiperRef = useRef(null)

    return (
        <div className="relative group/swiper">
            <Swiper
                onSwiper={(swiper) => swiperRef.current = swiper}
                slidesPerView={2.6}
                spaceBetween={12}
                freeMode={true}
                modules={[FreeMode, Navigation]}
                breakpoints={{
                    640: {
                        slidesPerView: 3.6,
                        spaceBetween: 16,
                    },
                    1024: {
                        slidesPerView: 5.5,
                        spaceBetween: 20,
                    },
                }}
                className="w-full !overflow-visible"
            >
                {products.map((product) => (
                    <SwiperSlide key={product._id} className="h-auto">
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons (Desktop) */}
            <div className="hidden lg:flex items-center justify-between absolute top-1/2 -translate-y-1/2 -left-4 -right-4 z-20 pointer-events-none">
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all pointer-events-auto opacity-0 group-hover/swiper:opacity-100 disabled:opacity-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all pointer-events-auto opacity-0 group-hover/swiper:opacity-100 disabled:opacity-0"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
