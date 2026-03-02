import type { APIContext } from 'astro'
import Stripe from 'stripe';
import { getFormalityByDemandeId, updatePaymentStatus } from '@utils/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

const STATUS = {
    SENT: 2,
    PAID: 3,
    FAILED: 4,
    EXPIRED: 5,
    CANCELED: 6,
    REFUND: 6,
} as const

export async function POST({ request }: APIContext) {
        const { demandeId } = await request.json();
        if (!demandeId) return new Response(JSON.stringify({ error: 'demandeId manquant' }), { status: 400 });

        const formality = await getFormalityByDemandeId(demandeId);
        if (!formality || !formality.stripe_invoice_id) {
            return new Response(JSON.stringify({ error: 'Aucune facture existante pour cette formalité' }), { status: 404 });
        }

    try {
        // Annule la facture
        const voidedInvoice = await stripe.invoices.voidInvoice(formality.stripe_invoice_id);

        // Met à jour le statut dans ta BDD
        await updatePaymentStatus(demandeId, 6); // 6 = CANCELED

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error('Erreur annulation facture :', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
}