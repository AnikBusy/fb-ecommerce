import { getPageBySlug } from "@/actions/page"
import EditPageClient from "./edit-page-client"

export default async function EditPagePage({ params }) {
    const { slug } = params
    const page = await getPageBySlug(slug)

    return <EditPageClient slug={slug} initialPage={page} />
}
