'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useSettings } from '@/providers/settings-provider'

export const FacebookPixel = () => {
    const { isPixelActive, facebookPixelId } = useSettings()
    const [loaded, setLoaded] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        if (!isPixelActive || !facebookPixelId || !loaded) return

        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init(facebookPixelId)
                ReactPixel.pageView()
            })
    }, [pathname, loaded, isPixelActive, facebookPixelId])

    if (!isPixelActive || !facebookPixelId) return null

    return (
        <div>
            <Script
                id="fb-pixel"
                src="https://connect.facebook.net/en_US/fbevents.js"
                onLoad={() => setLoaded(true)}
                strategy="afterInteractive"
            />
        </div>
    )
}
