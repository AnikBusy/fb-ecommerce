import { getPages, deletePage } from "@/actions/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import { CreatePageDialog } from "@/components/admin/create-page-dialog"

export default async function PagesListPage() {
    const pages = await getPages()
    const defaultPages = ['privacy', 'terms', 'contact']

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Pages</h1>
                <CreatePageDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Static Pages</CardTitle>
                    <CardDescription>
                        Create and edit pages for your store. Default pages (Privacy, Terms, Contact) are created automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pages.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No pages yet. Create your first page!</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Page</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page) => (
                                    <TableRow key={page._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                {page.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm font-mono">
                                            /{page.slug}
                                        </TableCell>
                                        <TableCell>
                                            {defaultPages.includes(page.slug) ? (
                                                <Badge variant="secondary">Default</Badge>
                                            ) : (
                                                <Badge variant="outline">Custom</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/pages/${page.slug}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {!defaultPages.includes(page.slug) && (
                                                    <form action={async () => {
                                                        'use server'
                                                        await deletePage(page.slug)
                                                    }}>
                                                        <Button variant="ghost" size="icon" type="submit">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </form>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
