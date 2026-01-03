'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { formatCurrency } from "@/lib/utils"

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-muted-foreground font-medium">Orders</span>
                        <span className="text-sm font-bold">{payload[0].value}</span>
                    </div>
                    {payload[0].payload.revenue !== undefined && (
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-xs text-muted-foreground font-medium">Sales</span>
                            <span className="text-sm font-bold text-primary">{formatCurrency(payload[0].payload.revenue)}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export function MonthlyOrdersChart({ data, height = 350 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 8 }}
                    content={<CustomTooltip />}
                />
                <Bar
                    dataKey="orders"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            className="fill-primary hover:opacity-80 transition-all duration-300 cursor-pointer"
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
