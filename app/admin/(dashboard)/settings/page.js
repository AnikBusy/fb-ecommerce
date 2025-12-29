'use client'

import { useState, useEffect } from "react"
import { getSettings, updateSettings } from "@/actions/settings"
import { toast } from "sonner"
import { useSettings } from "@/providers/settings-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        siteName: '',
        logoUrl: '',
        facebookPixelId: '',
        contactPhone: '',
        address: '',
        deliveryChargeInsideDhaka: 60,
        deliveryChargeOutsideDhaka: 110,
        steadfastApiKey: '',
        steadfastSecretKey: '',
        pathaoClientId: '',
        pathaoSecret: '',
        redxAccessToken: '',
        paperflyUser: '',
        paperflyPassword: '',
    })

    useEffect(() => {
        getSettings().then(data => {
            if (data) setFormData(data)
            setLoading(false)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const data = new FormData()
        data.append("file", file)

        const res = await fetch("/api/upload", {
            method: "POST",
            body: data,
        })
        const json = await res.json()
        if (json.url) {
            setFormData(prev => ({ ...prev, logoUrl: json.url }))
        }
    }

    const { updateSettingsState } = useSettings()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        const res = await updateSettings(formData)
        setSaving(false)
        if (res.success) {
            updateSettingsState(formData)
            toast.success('Settings updated successfully!')
        } else {
            toast.error('Failed to update settings')
        }
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Site Settings</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Site Name</Label>
                                <Input name="siteName" value={formData.siteName} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                    {formData.logoUrl && (
                                        <img src={formData.logoUrl} alt="Logo" className="h-12 w-12 object-contain border rounded" />
                                    )}
                                    <Input type="file" onChange={handleImageUpload} accept="image/*" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Facebook URL</Label>
                                <Input name="facebookUrl" value={formData.facebookUrl || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Instagram URL</Label>
                                <Input name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Contact Phone</Label>
                                <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input name="address" value={formData.address} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Facebook Pixel ID</Label>
                                <Input name="facebookPixelId" value={formData.facebookPixelId} onChange={handleChange} placeholder="e.g. 1234567890" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Delivery Charges</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Inside Dhaka (TK.)</Label>
                                <Input type="number" name="deliveryChargeInsideDhaka" value={formData.deliveryChargeInsideDhaka} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Outside Dhaka (TK.)</Label>
                                <Input type="number" name="deliveryChargeOutsideDhaka" value={formData.deliveryChargeOutsideDhaka} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Steadfast Courier Integration</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>API Key</Label>
                                <Input name="steadfastApiKey" value={formData.steadfastApiKey || ''} onChange={handleChange} placeholder="Enter Steadfast API Key" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Secret Key</Label>
                                <Input type="password" name="steadfastSecretKey" value={formData.steadfastSecretKey || ''} onChange={handleChange} placeholder="Enter Steadfast Secret Key" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pathao Courier</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Client ID</Label>
                                <Input name="pathaoClientId" value={formData.pathaoClientId || ''} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Client Secret</Label>
                                <Input type="password" name="pathaoSecret" value={formData.pathaoSecret || ''} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>RedX Courier</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Access Token</Label>
                                <Input type="password" name="redxAccessToken" value={formData.redxAccessToken || ''} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Paperfly Courier</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Username</Label>
                                <Input name="paperflyUser" value={formData.paperflyUser || ''} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Password</Label>
                                <Input type="password" name="paperflyPassword" value={formData.paperflyPassword || ''} onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <Button type="submit" className="h-14 px-10 rounded-xl bg-mongodb-green text-mongodb-dark hover:bg-[#00FF6C] font-black uppercase tracking-widest text-xs border-none" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </form >
        </div >
    )
}
