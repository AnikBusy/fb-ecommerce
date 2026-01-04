'use client'

import { useState, useEffect } from "react"
import { getSettings, updateSettings, testCourierConnection } from "@/actions/settings"
import { toast } from "sonner"
import { useSettings } from "@/providers/settings-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, Facebook, Truck, Settings2, Instagram, Youtube, Video, MessageCircle, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        siteName: '',
        logoUrl: '',
        facebookPixelId: '',
        facebookAccessToken: '',
        isPixelActive: false,
        contactPhone: '',
        address: '',
        deliveryChargeInsideDhaka: 60,
        deliveryChargeOutsideDhaka: 110,
        steadfastApiKey: '',
        steadfastSecretKey: '',
        steadfastEnabled: false,
        pathaoClientId: '',
        pathaoSecret: '',
        pathaoEnabled: false,
        redxAccessToken: '',
        redxEnabled: false,
        paperflyUser: '',
        paperflyPassword: '',
        paperflyEnabled: false,
        facebookUrl: '',
        instagramUrl: '',
        tiktokUrl: '',
        youtubeUrl: '',
        whatsappNumber: '',
        googleAnalyticsId: '',
        faviconUrl: '',
    })

    const [selectedCourier, setSelectedCourier] = useState('steadfast')
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState(null)

    useEffect(() => {
        getSettings().then(data => {
            if (data) setFormData(data)
            setLoading(false)
        })
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSwitchChange = (name, checked) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    const handleImageUpload = async (e, field = 'logoUrl') => {
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
            setFormData(prev => ({ ...prev, [field]: json.url }))
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

    const handleTestConnection = async () => {
        setTesting(true)
        setTestResult(null)
        try {
            const res = await testCourierConnection(selectedCourier, formData)
            setTestResult(res)
            if (res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            setTestResult({ success: false, message: "Connection failed" })
        } finally {
            setTesting(false)
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
                                    <Input type="file" onChange={(e) => handleImageUpload(e, 'logoUrl')} accept="image/*" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Favicon</Label>
                                <div className="flex items-center gap-4">
                                    {formData.faviconUrl && (
                                        <img src={formData.faviconUrl} alt="Favicon" className="h-12 w-12 object-contain border rounded" />
                                    )}
                                    <Input type="file" onChange={(e) => handleImageUpload(e, 'faviconUrl')} accept="image/*" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Contact Phone</Label>
                                <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Address</Label>
                                <Input name="address" value={formData.address} onChange={handleChange} />
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
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>Analytics & Tracking</CardTitle>
                                    <CardDescription>Configure Facebook Pixel, Google Analytics, and other tracking.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="isPixelActive" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {formData.isPixelActive ? 'Pixel Active' : 'Pixel Inactive'}
                                    </Label>
                                    <Switch
                                        id="isPixelActive"
                                        checked={formData.isPixelActive}
                                        onCheckedChange={(checked) => handleSwitchChange('isPixelActive', checked)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Google Analytics ID (G-XXXXXXXXXX)</Label>
                                <Input name="googleAnalyticsId" value={formData.googleAnalyticsId || ''} onChange={handleChange} placeholder="e.g. G-12345678" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Facebook Pixel ID</Label>
                                <Input name="facebookPixelId" value={formData.facebookPixelId} onChange={handleChange} placeholder="e.g. 1234567890" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Facebook Access Token (CAPI)</Label>
                                <Input type="password" name="facebookAccessToken" value={formData.facebookAccessToken || ''} onChange={handleChange} placeholder="Enter Facebook CAPI Access Token" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Channels</CardTitle>
                            <CardDescription>Connect your store with your social platform presence.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2]">
                                        <Facebook className="h-5 w-5" />
                                    </div>
                                    <div className="grid flex-1 gap-1">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">Facebook Page</Label>
                                        <Input
                                            name="facebookUrl"
                                            value={formData.facebookUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://facebook.com/yourpage"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#E4405F]/10 text-[#E4405F]">
                                        <Instagram className="h-5 w-5" />
                                    </div>
                                    <div className="grid flex-1 gap-1">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">Instagram Profile</Label>
                                        <Input
                                            name="instagramUrl"
                                            value={formData.instagramUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://instagram.com/yourprofile"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-950/10 text-zinc-950 dark:bg-zinc-50/10 dark:text-zinc-50">
                                        <Video className="h-5 w-5" />
                                    </div>
                                    <div className="grid flex-1 gap-1">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">TikTok Profile</Label>
                                        <Input
                                            name="tiktokUrl"
                                            value={formData.tiktokUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://tiktok.com/@yourprofile"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#FF0000]/10 text-[#FF0000]">
                                        <Youtube className="h-5 w-5" />
                                    </div>
                                    <div className="grid flex-1 gap-1">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">YouTube Channel</Label>
                                        <Input
                                            name="youtubeUrl"
                                            value={formData.youtubeUrl || ''}
                                            onChange={handleChange}
                                            placeholder="https://youtube.com/@yourchannel"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                                        <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <div className="grid flex-1 gap-1">
                                        <Label className="text-xs font-bold uppercase text-muted-foreground">WhatsApp Number</Label>
                                        <Input
                                            name="whatsappNumber"
                                            value={formData.whatsappNumber || ''}
                                            onChange={handleChange}
                                            placeholder="e.g. +8801XXXXXXXXX"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>



                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>Courier Integration</CardTitle>
                                    <CardDescription>Manage your delivery service providers.</CardDescription>
                                </div>
                                <Truck className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label>Select Courier to Configure</Label>
                                <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Courier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="steadfast">Steadfast Courier</SelectItem>
                                        <SelectItem value="pathao">Pathao Courier</SelectItem>
                                        <SelectItem value="redx">RedX Courier</SelectItem>
                                        <SelectItem value="paperfly">Paperfly Courier</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleTestConnection}
                                    disabled={testing}
                                    className="flex-1 h-10 border-dashed border-primary/50 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-300"
                                >
                                    {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                    Test {selectedCourier.charAt(0).toUpperCase() + selectedCourier.slice(1)} Connection
                                </Button>
                            </div>

                            {testResult && (
                                <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${testResult.success ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                                    {testResult.success ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    )}
                                    <div className="grid gap-1">
                                        <div className={`text-sm font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                            {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                                        </div>
                                        <div className={`text-xs ${testResult.success ? 'text-green-700/80' : 'text-red-700/80'}`}>
                                            {testResult.message}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Enable {selectedCourier.charAt(0).toUpperCase() + selectedCourier.slice(1)}</Label>
                                        <p className="text-xs text-muted-foreground">Toggle this to show/hide this courier in order assignment.</p>
                                    </div>
                                    <Switch
                                        checked={formData[`${selectedCourier}Enabled`]}
                                        onCheckedChange={(checked) => handleSwitchChange(`${selectedCourier}Enabled`, checked)}
                                    />
                                </div>

                                {selectedCourier === 'steadfast' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>API Key</Label>
                                            <Input name="steadfastApiKey" value={formData.steadfastApiKey || ''} onChange={handleChange} placeholder="Enter Steadfast API Key" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Secret Key</Label>
                                            <Input type="password" name="steadfastSecretKey" value={formData.steadfastSecretKey || ''} onChange={handleChange} placeholder="Enter Steadfast Secret Key" />
                                        </div>
                                    </>
                                )}

                                {selectedCourier === 'pathao' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Client ID</Label>
                                            <Input name="pathaoClientId" value={formData.pathaoClientId || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Client Secret</Label>
                                            <Input type="password" name="pathaoSecret" value={formData.pathaoSecret || ''} onChange={handleChange} />
                                        </div>
                                    </>
                                )}

                                {selectedCourier === 'redx' && (
                                    <div className="grid gap-2">
                                        <Label>Access Token</Label>
                                        <Input type="password" name="redxAccessToken" value={formData.redxAccessToken || ''} onChange={handleChange} />
                                    </div>
                                )}

                                {selectedCourier === 'paperfly' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label>Username</Label>
                                            <Input name="paperflyUser" value={formData.paperflyUser || ''} onChange={handleChange} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Password</Label>
                                            <Input type="password" name="paperflyPassword" value={formData.paperflyPassword || ''} onChange={handleChange} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>




                </div>

                <div className="mt-8">
                    <Button type="submit" className="h-14 px-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-xs border-none" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </form >
        </div >
    )
}
