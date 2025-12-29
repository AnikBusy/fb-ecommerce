'use client'

import { useState, useEffect } from "react"
import { getAdmins, createAdmin, deleteAdmin, updateAdmin } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trash2, UserPlus, Pencil, Mail, Phone, CreditCard, ImageIcon, User } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'

export default function AdminsPage() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingAdmin, setEditingAdmin] = useState(null)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        nid: '',
        image: ''
    })
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        loadAdmins()
    }, [])

    async function loadAdmins() {
        setLoading(true)
        const data = await getAdmins()
        setAdmins(data)
        setLoading(false)
    }

    const handleOpenDialog = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin)
            setFormData({
                username: admin.username,
                password: '', // Don't show password
                email: admin.email || '',
                phone: admin.phone || '',
                nid: admin.nid || '',
                image: admin.image || ''
            })
        } else {
            setEditingAdmin(null)
            setFormData({
                username: '',
                password: '',
                email: '',
                phone: '',
                nid: '',
                image: ''
            })
        }
        setDialogOpen(true)
    }

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.set('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.url }));
                toast.success("Image uploaded successfully");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)

        let res
        if (editingAdmin) {
            res = await updateAdmin(editingAdmin._id, formData)
        } else {
            res = await createAdmin(formData.username, formData.password, formData)
        }

        setSaving(false)

        if (res.success) {
            setDialogOpen(false)
            loadAdmins()
            toast.success(`Admin ${editingAdmin ? 'updated' : 'created'} successfully`)
        } else {
            toast.error(res.error || "An error occurred")
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this admin?')) return
        const res = await deleteAdmin(id)
        if (res.success) {
            loadAdmins()
            toast.success("Admin deleted successfully")
        } else {
            toast.error(res.error)
        }
    }

    if (loading && admins.length === 0) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
                    <p className="text-muted-foreground">Manage administrative users and their profiles.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-zinc-900 text-white hover:bg-zinc-800">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Directory</CardTitle>
                    <CardDescription>A list of all users with access to the admin panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Profile</TableHead>
                                <TableHead>Admin Details</TableHead>
                                <TableHead className="hidden md:table-cell">Contact & ID</TableHead>
                                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map(admin => (
                                <TableRow key={admin._id}>
                                    <TableCell>
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={admin.image} alt={admin.username} />
                                            <AvatarFallback><User className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{admin.username}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {admin.email || 'No email set'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3 w-3 text-muted-foreground" /> {admin.phone || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <CreditCard className="h-3 w-3 text-muted-foreground" /> NID: {admin.nid || 'N/A'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-xs">
                                        {new Date(admin.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(admin)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(admin._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {admins.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No admins found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingAdmin ? 'Edit Admin Profile' : 'Add New Admin'}</DialogTitle>
                        <DialogDescription>
                            {editingAdmin ? 'Update account details and profile information.' : 'Create a new administrative user account.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center gap-4 py-2">
                            <Avatar className="h-24 w-24 border-2 border-zinc-100">
                                <AvatarImage src={formData.image} />
                                <AvatarFallback><User className="h-10 w-10 text-muted-foreground" /></AvatarFallback>
                            </Avatar>
                            <div className="relative">
                                <Button type="button" variant="outline" size="sm" disabled={uploading} className="relative overflow-hidden">
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
                                    {formData.image ? 'Change Photo' : 'Upload Photo'}
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        disabled={uploading}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    disabled={!!editingAdmin}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{editingAdmin ? 'New Password' : 'Password'}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={editingAdmin ? 'Leave blank to keep current' : ''}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingAdmin}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="017XXXXXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nid">NID Number</Label>
                                <Input
                                    id="nid"
                                    value={formData.nid}
                                    onChange={e => setFormData({ ...formData, nid: e.target.value })}
                                    placeholder="National ID"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving || uploading} className="bg-zinc-900 text-white hover:bg-zinc-800">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingAdmin ? 'Save Changes' : 'Create Admin'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
