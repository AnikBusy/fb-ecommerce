import { getSettings } from "@/actions/settings"
import Link from "next/link"

export async function Footer() {
    const settings = await getSettings()

    return (
        <footer className="bg-background border-t border-border py-10 md:py-20">
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <span className="text-2xl font-black tracking-tighter text-foreground uppercase">{settings?.siteName || 'Flux'}<span className="text-primary">.</span></span>
                        <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground text-center">
                            © {new Date().getFullYear()} {settings?.siteName || 'Flux'}. All rights reserved.
                        </div>
                    </div>

                    <div className="flex items-center gap-12">
                        <Link href="/privacy" className="text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                        <Link href="/contact" className="text-[10px] font-black tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                    </div>

                    <div className="flex gap-6">
                        {settings?.facebookUrl && (
                            <Link href={settings.facebookUrl} target="_blank" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer">
                                FB
                            </Link>
                        )}
                        {settings?.instagramUrl && (
                            <Link href={settings.instagramUrl} target="_blank" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer">
                                IG
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}

