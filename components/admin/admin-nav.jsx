import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Package, ListOrdered, Settings, Users, ExternalLink, Image, FileText, FileClock } from "lucide-react"

export const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders?status=pending", label: "Orders", icon: ListOrdered },
    { href: "/admin/incomplete-orders", label: "Incomplete", icon: FileClock },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/banners", label: "Banners", icon: Image },
    { href: "/admin/categories", label: "Categories", icon: Package },
    { href: "/admin/pages", label: "Pages", icon: FileText },
    { href: "/admin/admins", label: "Admins", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/", label: "Visit Store", icon: ExternalLink },
]

export function AdminNav({ className, onItemClick, pendingCount }) {
    return (
        <nav className={className}>
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    target={item.href === "/" ? "_blank" : undefined}
                    rel={item.href === "/" ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground group"
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </div>
                    {item.label === "Orders" && pendingCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-black text-white shadow-sm group-hover:bg-yellow-600 transition-colors">
                            {pendingCount > 99 ? '99+' : pendingCount}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    )
}
