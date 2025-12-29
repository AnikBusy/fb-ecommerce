
import { getOrders } from "@/actions/order"
import { getSettings } from "@/actions/settings"
import { Badge } from "@/components/ui/badge"
import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import Image from "next/image"
import { notFound } from "next/navigation"

import { cn, formatCurrency } from "@/lib/utils"

export default async function InvoicePage({ params }) {
    const { id } = await params
    await dbConnect()
    const order = await Order.findById(id).populate('products.product').lean()
    const settings = await getSettings()

    if (!order) return notFound()

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        confirmed: "bg-blue-100 text-blue-800 border-blue-200",
        shipped: "bg-purple-100 text-purple-800 border-purple-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        cancelled: "bg-red-100 text-red-800 border-red-200"
    }

    return (
        <div className="max-w-[800px] mx-auto p-10 bg-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}} />

            {/* Header */}
            <div className="flex justify-between items-start mb-10 border-b pb-8">
                <div>
                    {/* Logo Placeholder - You can add actual Image component here if logo exists */}
                    <div className="text-3xl font-bold text-gray-900 mb-2">{settings?.siteName || 'E-Commerce Store'}</div>
                    <div className="text-gray-500 text-sm whitespace-pre-line">{settings?.address}</div>
                    <div className="text-gray-500 text-sm mt-1">{settings?.contactPhone}</div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold text-gray-900">INVOICE</h2>
                    <div className="text-gray-500 mt-2">#{order._id.toString().slice(-6)}</div>
                    <div className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <Badge variant="outline" className={cn("mt-2 text-xs uppercase", statusColors[order.status])}>
                        {order.status}
                    </Badge>
                </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Bill To</h3>
                    <div className="text-gray-700 font-medium">{order.customerName}</div>
                    <div className="text-gray-600 text-sm mt-1">{order.phone}</div>
                    <div className="text-gray-600 text-sm mt-1">{order.address}</div>
                </div>
                {order.courierName && (
                    <div className="text-right">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Shipping Method</h3>
                        <div className="text-gray-700">{order.courierName}</div>
                        {order.trackingId && <div className="text-gray-600 text-sm mt-1">Tracking: {order.trackingId}</div>}
                    </div>
                )}
            </div>

            {/* Order Items */}
            <table className="w-full mb-10">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">Product</th>
                        <th className="text-center py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">Qty</th>
                        <th className="text-right py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">Price</th>
                        <th className="text-right py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="py-4 text-gray-700">
                                {item.product?.title || 'Product Deleted'}
                            </td>
                            <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-700">{formatCurrency(item.price)}</td>
                            <td className="py-4 text-right text-gray-900 font-medium">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(order.totalAmount - order.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Delivery</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(order.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between py-4">
                        <span className="font-bold text-lg text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                Thank you for shopping with us!
            </div>
        </div>
    )
}
