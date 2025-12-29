'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=90",
        title: "The Art of Modern Living",
        subtitle: "ESTABLISHED 2024",
        label: "New Collection"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=90",
        title: "Pure Elegance in Every Thread",
        subtitle: "LIMITED EDITION",
        label: "Exclusive"
    }
]

export function HeroSlider() {
    return (
        <div className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden bg-background">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full flex items-center">
                            {/* Background Image */}
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="absolute inset-0 z-0"
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
                                />
                                {/* Stronger gradient for better text punch */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-background/95 via-background/50 to-transparent" />
                            </motion.div>

                            {/* Content */}
                            <div className="container mx-auto px-6 md:px-16 lg:w-[85%] xl:w-[80%] relative z-10">
                                <div className="max-w-4xl">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="flex items-center gap-4 mb-8"
                                    >
                                        <div className="h-[3px] w-14 bg-mongodb-green rounded-full shadow-[0_0_15px_rgba(0,237,100,0.4)]" />
                                        <span className="text-foreground/70 text-[11px] font-black tracking-[0.5em] uppercase">
                                            {slide.subtitle}
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <h1 className="text-4xl md:text-9xl font-black text-foreground mb-12 tracking-tighter leading-[0.8] uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
                                            {slide.title}
                                        </h1>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className="flex flex-wrap items-center gap-8"
                                    >
                                        <Button
                                            size="lg"
                                            className="h-14 md:h-20 px-10 md:px-16 rounded-2xl bg-mongodb-green text-white hover:bg-[#00D650] text-sm font-black tracking-[0.2em] uppercase group transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,237,100,0.25)] border-none"
                                        >
                                            Collection
                                            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                                        </Button>

                                        <div className="hidden md:flex items-center gap-4 text-foreground/40">
                                            <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-mongodb-green" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest">Authored by</span>
                                                <span className="text-xs font-bold text-foreground/60 italic tracking-tighter">Flux Design Studio</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
