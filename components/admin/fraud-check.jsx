'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ShieldAlert, ShieldCheck, ShieldQuestion, ExternalLink } from "lucide-react"

export function FraudCheck({ history, phone }) {
    if (!history) return null

    const { total, delivered, cancelled, returned } = history
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0

    let TrustIcon = ShieldQuestion
    let color = "text-yellow-500"

    if (total > 0) {
        if (successRate >= 80) {
            TrustIcon = ShieldCheck
            color = "text-green-500"
        } else if (successRate < 50) {
            TrustIcon = ShieldAlert
            color = "text-red-500"
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <TrustIcon className={`h-4 w-4 ${color}`} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Customer Trust Score</h4>
                    <div className="text-2xl font-bold">{successRate}%</div>
                    <div className="text-xs text-muted-foreground">
                        Based on {total} previous orders.
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm pt-2">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold">Delivered</span>
                            <span className="font-medium text-green-600">{delivered}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold">Cancelled</span>
                            <span className="font-medium text-red-600">{cancelled}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold">Returned</span>
                            <span className="font-medium text-orange-600">{returned || 0}</span>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">External Verification</div>
                        <div className="grid grid-cols-1 gap-2">
                            <a
                                href="https://steadfast.com.bd/check-fraud"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full"
                            >
                                <Button size="sm" variant="outline" className="w-full justify-between text-[10px] h-8 bg-zinc-50 hover:bg-zinc-100 border-zinc-200">
                                    Steadfast Fraud Check
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </a>
                            <a
                                href={`https://fraudbd.com/?phone=${phone || ''}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full"
                            >
                                <Button size="sm" variant="outline" className="w-full justify-between text-[10px] h-8 bg-zinc-50 hover:bg-zinc-100 border-zinc-200">
                                    FraudBD Search
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
