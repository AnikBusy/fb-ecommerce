'use client'

import Script from "next/script"
import { useSettings } from "@/providers/settings-provider"

export function GoogleAnalytics() {
    const settings = useSettings()

    if (!settings?.googleAnalyticsId) return null

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${settings.googleAnalyticsId}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    )
}
