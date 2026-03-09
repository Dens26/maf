import type { APIContext } from 'astro'
import Stripe from 'stripe'
import { getFormalityByDemandeId, updateAmountRefunded, updatePaymentStatus } from '@utils/supabase'

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
})

const STATUS = {
    SENT: 2,
    PAID: 3,
    FAILED: 4,
    EXPIRED: 5,
    CANCELED: 6,
    REFUND: 7
} as const

export async function POST({ request }: APIContext) {
    try {
        const { demandeId, amount } = await request.json()

        if (!demandeId) return jsonError('demandeId manquant', 400)
        if (!amount || typeof amount !== 'number' || amount <= 0)
            return jsonError('Montant de remboursement invalide', 400)

        // 1️⃣ Récupération de la formalité
        const formality = await getFormalityByDemandeId(demandeId)
        if (!formality) return jsonError('Formalité introuvable', 404)

        if (!formality.stripe_invoice_id || !formality.stripe_customer_id)
            return jsonError('Facture Stripe non trouvée pour cette formalité', 400)

        // 2️⃣ Récupération de la facture Stripe
        const stripeInvoice = await stripe.invoices.retrieve(formality.stripe_invoice_id)

        // 3️⃣ Récupération de l'ID du paiement
        const invoicePayments = await stripe.invoicePayments.list({ invoice: stripeInvoice.id })

        const paymentIntentId = typeof invoicePayments.data[0]?.payment?.payment_intent === 'string'
            ? invoicePayments.data[0]?.payment?.payment_intent
            : invoicePayments.data[0]?.payment?.payment_intent?.id

        if (!paymentIntentId) return jsonError('La facture n’a pas de paiement à rembourser', 400)

        // 4️⃣ Création du remboursement partiel
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount,
            reason: 'requested_by_customer',
            metadata: { demandeId },
        })

        // 5️⃣ Mise à jour du statut dans Supabase
        await updatePaymentStatus(demandeId, STATUS.REFUND)
        await updateAmountRefunded(demandeId, formality.amount_refunded + amount)

        return new Response(
            JSON.stringify({
                success: true,
                refundId: refund.id,
                refundedAmount: amount,
                message: 'Remboursement créé avec succès',
            }),
            { status: 200 }
        )
    } catch (error) {
        console.error('Erreur refund-invoice:', error)
        return jsonError('Erreur serveur lors du remboursement', 500)
    }
}

function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), { status })
}