import Link from "next/link"
import { logout, getCurrentAdmin } from "@/actions/auth"
import { getSettings } from "@/actions/settings"
import { getPendingOrderCount } from "@/actions/order"
import { AdminProfileSection } from "@/components/admin/admin-profile-section"
import { ThemeToggle } from "@/components/admin/theme-toggle"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminSearch } from "@/components/admin/admin-search"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { NotificationCenter } from "@/components/admin/notification-center"
export default async function AdminLayout({ children }) {
    const admin = await getCurrentAdmin()
    const settings = await getSettings()
    const pendingCount = await getPendingOrderCount()

    return (
        <div className="fixed inset-0 flex overflow-hidden bg-background text-foreground">
            {/* Desktop Sidebar */}
            <aside className="hidden w-56 border-r bg-muted/40 lg:block flex-shrink-0">
                <div className="flex h-full flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-100 transition-colors" href="/admin/dashboard">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-auto object-contain" />
                            ) : (
                                <span className="text-xl">{settings.siteName || 'Flux'}<span className="text-primary">.</span></span>
                            )}
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                        <AdminNav className="grid items-start px-4 text-sm font-medium" pendingCount={pendingCount} />
                    </div>
                    <div className="mt-auto border-t p-2">
                        <AdminProfileSection admin={admin} />
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex h-[60px] items-center gap-4 border-b bg-muted/40 px-6 shrink-0">
                    {/* Mobile Navigation */}
                    <AdminMobileNav admin={admin} settings={settings} pendingCount={pendingCount} />

                    <div className="flex-1 flex items-center gap-4">
                        <Link className="lg:hidden flex items-center gap-2 font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-100" href="/admin/dashboard">
                            <span>{settings.siteName || 'Flux'}<span className="text-primary">.</span></span>
                        </Link>
                        <AdminSearch />
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
