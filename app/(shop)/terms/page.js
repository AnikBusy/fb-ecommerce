import { getPageBySlug } from "@/actions/page"

export default async function TermsPage() {
    const page = await getPageBySlug('terms')

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                            {page.title}
                        </h1>
                        <div className="h-1 w-20 bg-primary"></div>
                    </div>

                    <div
                        className="prose prose-invert max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </div>
    )
}
