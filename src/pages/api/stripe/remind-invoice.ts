import type { APIContext } from 'astro';
import Stripe from 'stripe';
import { getFormalityByDemandeId } from '@utils/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export async function POST({ request }: APIContext) {
    try {
        const { demandeId } = await request.json();
        if (!demandeId) return new Response(JSON.stringify({ error: 'demandeId manquant' }), { status: 400 });

        const formality = await getFormalityByDemandeId(demandeId);
        if (!formality || !formality.stripe_invoice_id) {
            return new Response(JSON.stringify({ error: 'Aucune facture existante pour cette formalité' }), { status: 404 });
        }

        // Relance la facture Stripe
        const invoice = await stripe.invoices.sendInvoice(formality.stripe_invoice_id);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error('Erreur relance facture:', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
}