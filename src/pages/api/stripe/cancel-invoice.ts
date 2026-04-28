import type { APIContext } from 'astro';
import Stripe from 'stripe';
import { getFormalityByDemandeId, updatePaymentStatus } from '@utils/supabase';
import { sendCanceledInvoice } from '@utils/mailService';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

const STATUS = {
    SENT: 2,
    PAID: 3,
    FAILED: 4,
    EXPIRED: 5,
    CANCELED: 6,
    REFUND: 7
} as const;

export async function POST({ request }: APIContext) {
    const { demandeId } = await request.json();
    if (!demandeId) return new Response(JSON.stringify({ error: 'demandeId manquant' }), { status: 400 });

    const formality = await getFormalityByDemandeId(demandeId);
    if (!formality || !formality.stripe_invoice_id) {
        return new Response(JSON.stringify({ error: 'Aucune facture existante pour cette formalité' }), { status: 404 });
    }

    if (formality.payment_status === STATUS.CANCELED) {
        return new Response(JSON.stringify({ error: 'Facture déjà annulée' }), { status: 400 });
    }

    try {
        // Annule la facture
        const voidedInvoice = await stripe.invoices.voidInvoice(formality.stripe_invoice_id);

        // Envoie de mail
        if (voidedInvoice) {
            await sendCanceledInvoice(
                formality.demandeid,
                formality.typeformaliteid,
                formality.firstname,
                formality.name,
                formality.stripe_invoice_number,
                formality.email
            );
        }

        // Met à jour le statut dans la BDD
        await updatePaymentStatus(demandeId, STATUS.CANCELED);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error('Erreur annulation facture :', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
}