

import { getProducts, deleteProduct } from "@/actions/product"
import { getCategories } from "@/actions/category"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductDialog } from "@/components/admin/product-dialog"
import { Trash2, Pencil } from "lucide-react"
import { DialogTrigger } from "@/components/ui/dialog"

export default async function ProductsPage() {
    const products = await getProducts()
    const categories = await getCategories()

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <ProductDialog categories={categories} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            {product.images && product.images[0] && (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                                        <TableCell>{product.price} TK.</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.isActive !== false ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                {product.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <ProductDialog
                                                    categories={categories}
                                                    product={product}
                                                    trigger={
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                    }
                                                />
                                                <form action={async () => {
                                                    'use server'
                                                    await deleteProduct(product._id)
                                                }}>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {products.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">No products found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
