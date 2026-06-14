export const prerender = false;

import type { APIContext } from 'astro';
import { sendEmailProspection } from "@utils/mailService";


export async function POST({ request }: APIContext) {
    try {
        const body = await request.json();

        const {
            email
        } = body;

        // Envoi du mail notification (désactivé temporairement)
        await sendEmailProspection(email);

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