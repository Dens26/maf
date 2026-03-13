export const prerender = false;

import type { APIContext } from 'astro';
import { sendCanceledFormalityNotification, sendCompletedFormalityNotification, sendRejectedFormalityNotification } from "@utils/mailService";
import { getFormalityByDemandeId } from '@utils/supabase';


export async function POST({ request }: APIContext) {
    try {
        const body = await request.json();

        const {
            demandeId,
            action
        } = body;

        // Récupération formalité
        const formality = await getFormalityByDemandeId(demandeId)

        // ✅ Validation minimale
        if (!formality) {
            return jsonResponse({ error: 'Formalité introuvable' }, 400);
        }

        // Envoi du mail notification
        switch (action){
            case 'terminer_formalite' :
                await sendCompletedFormalityNotification(formality.demandeid, formality.firstname, formality.name, formality.ref_inpi, formality.email);
                break;
            case 'rejeter_formalite' :
                await sendRejectedFormalityNotification(formality.demandeid, formality.firstname, formality.name, formality.ref_inpi, formality.email);
                break;
            case 'annuler_formalite' :
                await sendCanceledFormalityNotification(formality.demandeid, formality.firstname, formality.name, formality.ref_inpi, formality.email);
                break;
            default :
                return new Response(JSON.stringify({ error: 'Action inconnue' }), { status: 400 });
        }

        return jsonResponse({ success: true }, 200);

    } catch (error) {
        console.error("🔥 ERREUR API CREATE :", error);
        return jsonResponse(
            { error: "Erreur serveur", detail: String(error) },
            500
        );
    }
}

// Helper pour réponses JSON homogènes
function jsonResponse(data: unknown, status: number) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
