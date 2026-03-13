import type { APIRoute } from 'astro';
import { getFormalityByDemandeId, updateStatutFormalite } from '@utils/supabase';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { demandeId, action } = await request.json();

        if (!demandeId || !action)
            return new Response(JSON.stringify({ error: 'Paramètres manquants' }), { status: 400 });

        // 1️⃣ Récupérer la demande complète
        const formality = await getFormalityByDemandeId(demandeId);

        if (!formality)
            return new Response(JSON.stringify({ error: 'Demande introuvable' }), { status: 404 });

        const paymentStatus = formality.statutpaiementid;
        const currentFormalityStatus = formality.statutformaliteid;

        let newStatus: number | null = null;

        // 2️⃣ Gestion des transitions métier
        switch (action) {
            case "demarrer_formalite":
                // Paiement obligatoire validé
                if (paymentStatus !== 3)
                    return new Response(JSON.stringify({ error: 'Paiement non validé' }), { status: 403 });

                // Seulement si formalité en attente
                if (currentFormalityStatus !== 1)
                    return new Response(JSON.stringify({ error: 'Transition invalide' }), { status: 400 });

                newStatus = 2; // en traitement
                break;

            case "terminer_formalite":
                // Seulement si formalité en traitement
                if (currentFormalityStatus !== 2 || !formality.ref_inpi)
                    return new Response(JSON.stringify({ error: 'Transition invalide' }), { status: 400 });

                newStatus = 3; // terminée
                break;

            case "rejeter_formalite":
                // Seulement si formalité en traitement
                if (currentFormalityStatus !== 2 || !formality.ref_inpi)
                    return new Response(JSON.stringify({ error: 'Transition invalide' }), { status: 400 });

                newStatus = 4; // rejetée
                break;

            case "annuler_formalite":
                // Annulation possible si en traitement ou en attente
                if (![1, 2].includes(currentFormalityStatus))
                    return new Response(JSON.stringify({ error: 'Transition invalide' }), { status: 400 });

                newStatus = 5; // annulée
                break;

            default:
                return new Response(JSON.stringify({ error: 'Action inconnue' }), { status: 400 });
        }

        if (newStatus === null)
            return new Response(JSON.stringify({ error: 'Impossible de déterminer le statut' }), { status: 500 });

        // 3️⃣ Mise à jour en base
        await updateStatutFormalite(demandeId, newStatus);

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error('Erreur update-formality-status:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
    }
};