import { getBanners, deleteBanner } from "@/actions/banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BannerDialog } from "@/components/admin/banner-dialog"
import { Trash2, Image as ImageIcon, ExternalLink, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DialogTrigger } from "@/components/ui/dialog"

export default async function BannersPage() {
    const banners = await getBanners()

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Banners</h1>
                <BannerDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Store Banners</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banners.map((banner) => (
                                    <TableRow key={banner._id}>
                                        <TableCell>
                                            <div className="h-12 w-24 rounded border overflow-hidden bg-zinc-50 flex items-center justify-center">
                                                {banner.imageUrl ? (
                                                    <img
                                                        src={banner.imageUrl}
                                                        alt={banner.title}
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-zinc-300" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{banner.title}</span>
                                                {banner.link && (
                                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                                        <ExternalLink className="w-2 h-2" />
                                                        {banner.link}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={banner.type === 'hero' ? 'default' : 'secondary'} className="uppercase text-[9px] tracking-widest font-black">
                                                {banner.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{banner.order}</TableCell>
                                        <TableCell>
                                            <Badge variant={banner.isActive ? 'success' : 'destructive'} className="uppercase text-[9px] tracking-widest font-black">
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <BannerDialog
                                                    banner={banner}
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
                                                    await deleteBanner(banner._id)
                                                }}>
                                                    <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {banners.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-zinc-400 italic">
                                            No banners found. Add your first Hero or Promo banner to get started.
                                        </TableCell>
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
