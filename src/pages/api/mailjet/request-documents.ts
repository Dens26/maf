export const prerender = false;

import type { APIContext } from 'astro';
import { sendRequestDocuments } from "@utils/mailService";
import { getFormalityByDemandeId } from '@utils/supabase';


export async function POST({ request }: APIContext) {
    try {
        const body = await request.json();

        const {
            demandeId
        } = body;

        // Récupération formalité
        const formality = await getFormalityByDemandeId(demandeId)

        // ✅ Validation minimale
        if (!formality) {
            return jsonResponse({ error: 'Formalité introuvable' }, 400);
        }

        // Envoi du mail notification (désactivé temporairement)
        await sendRequestDocuments(formality.demandeid, formality.firstname, formality.name, formality.email);

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
