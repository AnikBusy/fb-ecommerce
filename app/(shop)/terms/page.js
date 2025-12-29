import { getPageBySlug } from "@/actions/page"

export default async function TermsPage() {
    const page = await getPageBySlug('terms')

    return (
        <div className="min-h-screen shop-container-bg">
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter shop-text">
                            {page.title}
                        </h1>
                        <div className="h-1 w-20 bg-mongodb-green"></div>
                    </div>

                    <div
                        className="prose prose-invert max-w-none shop-text"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </div>
    )
}
