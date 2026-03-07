import type { APIRoute } from 'astro';
import { updateRefInpi } from '@utils/supabase';

export const POST: APIRoute = async ({ request }) => {

    const { demandeId, ref_inpi } = await request.json()

    const result = await updateRefInpi(demandeId, ref_inpi)

    if (!result.success)
        return new Response(JSON.stringify({ error: "Erreur mise à jour référence INPI" }), { status: 500 })

    return new Response(JSON.stringify({ success: true }))
}