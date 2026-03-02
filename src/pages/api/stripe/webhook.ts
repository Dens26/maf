import type { APIContext } from 'astro'
import Stripe from 'stripe'
import { updatePaymentStatus, updateInvoiceData } from '@utils/supabase'

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
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
        return new Response('Configuration webhook invalide', { status: 400 })
    }

    const body = await request.text()
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch {
        return new Response('Signature invalide', { status: 400 })
    }

    if (!event.type.startsWith('invoice.')) {
        return new Response(JSON.stringify({ received: true }), { status: 200 })
    }

    try {
        const invoice = event.data.object as Stripe.Invoice
        const demandeId = invoice.metadata?.demandeId

        if (!demandeId) return new Response(JSON.stringify({ received: true }), { status: 200 })

        let newStatus: number | null = null

        switch (event.type) {
            case 'invoice.finalized':
                // ⚠️ Récupérer la facture complète pour être sûr que tous les champs sont remplis
                const fullInvoice = await stripe.invoices.retrieve(invoice.id)
                await updateInvoiceData(demandeId, {
                    invoiceId: fullInvoice.id || null,
                    invoiceNumber: fullInvoice.number || null,
                    invoiceUrl: fullInvoice.hosted_invoice_url || null,
                    invoicePdf: fullInvoice.invoice_pdf || null,
                })
                break
            case 'invoice.sent':
                newStatus = STATUS.SENT
                break
            case 'invoice.paid':
                newStatus = STATUS.PAID
                break
            case 'invoice.payment_failed':
                newStatus = STATUS.FAILED
                break
            case 'invoice.marked_uncollectible':
                newStatus = STATUS.EXPIRED
                break
            case 'invoice.voided':
                newStatus = STATUS.CANCELED
                await updateInvoiceData(demandeId, {
                    invoiceId: null,
                    invoiceNumber: null,
                    invoiceUrl: null,
                    invoicePdf: null,
                })
                break
            case 'invoice.updated':
                if (invoice.due_date && invoice.status === 'open' && Date.now() / 1000 > invoice.due_date) {
                    newStatus = STATUS.EXPIRED
                }
                break
        }

        if (newStatus !== null) await updatePaymentStatus(demandeId, newStatus)

        return new Response(JSON.stringify({ received: true }), { status: 200 })
    } catch (err) {
        console.error('❌ Erreur webhook Stripe:', err)
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
    }
}