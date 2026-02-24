import type { APIContext } from 'astro'
import { getPdfSignedUrl } from '@utils/supabase'

export async function GET({ request }: APIContext) {
    try {
        const url = new URL(request.url)
        const file = url.searchParams.get('file')
        if (!file) return new Response(JSON.stringify({ error: 'Fichier manquant' }), { status: 400 })

        const signedUrl = await getPdfSignedUrl(`pdfs/${file}`)
        return new Response(JSON.stringify({ signedUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err) {
        console.error('🔥 ERREUR GET PDF API :', err)
        return new Response(JSON.stringify({ error: 'Erreur serveur', detail: String(err) }), { status: 500 })
    }
}