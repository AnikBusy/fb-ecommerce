'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { getNotifications, markAsRead, markAllAsRead } from '@/actions/notification'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    const fetchNotifications = async () => {
        const data = await getNotifications()
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.isRead).length)
    }

    useEffect(() => {
        setMounted(true)
        fetchNotifications()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id) => {
        const res = await markAsRead(id)
        if (res.success) {
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    }

    const handleMarkAllRead = async () => {
        const res = await markAllAsRead()
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        }
    }

    const unreadNotifications = notifications.filter(n => !n.isRead)

    if (!mounted) return (
        <Button variant="ghost" size="icon" disabled>
            <Bell className="w-5 h-5 text-muted-foreground opacity-50" />
        </Button>
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 rounded-full transition-all">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] font-black items-center justify-center text-primary-foreground">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 glass border-border shadow-2xl rounded-2xl overflow-hidden" align="end">
                <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
                    <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Recent Alerts</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase tracking-widest hover:text-primary p-0"
                            onClick={handleMarkAllRead}
                        >
                            Clear All
                        </Button>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {unreadNotifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {unreadNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "p-4 flex gap-4 transition-colors hover:bg-secondary/20 group relative",
                                        !notification.isRead && "bg-primary/5"
                                    )}
                                >
                                    <div className={cn(
                                        "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                                        notification.isRead ? "bg-muted" : "bg-primary"
                                    )} />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold text-foreground leading-tight">{notification.title}</p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {mounted && formatTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{notification.message}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    onClick={() => {
                                                        handleMarkAsRead(notification._id)
                                                        setOpen(false)
                                                    }}
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View Details
                                                </Link>
                                            )}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] gap-4 p-8 text-center">
                            <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center">
                                <Bell className="w-6 h-6 text-muted-foreground opacity-20" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-foreground">No New Alerts</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">You're all caught up!</p>
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
