import type { APIContext } from 'astro'
import Stripe from 'stripe'
import { getFormalityByDemandeId, updateFormalityStripeCustomerId } from '@utils/supabase'

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
})

// Prix des formalités (en centimes)
const FORMALITY_PRICES: Record<number, number> = {
    1: 5900,
    2: 6900,
    3: 6900,
    4: 4900,
    5: 7900,
}

// Labels des formalités
const FORMALITY_LABELS: Record<number, string> = {
    1: 'Création',
    2: 'Déménagement',
    3: 'Modification d’activité',
    4: 'Correction',
    5: 'Cessation',
}

export async function POST({ request }: APIContext) {
    try {

        // Validation entrée
        const { demandeId } = await request.json()

        if (!demandeId) {
            return jsonError('demandeId manquant', 400)
        }

        // Récupération formalité
        const formality = await getFormalityByDemandeId(demandeId)

        if (!formality)
            return jsonError('Formalité introuvable', 404)

        if (formality.stripe_invoice_number)
            return jsonError('Une facture a déjà été créée pour cette formalité', 400)

        const {
            email,
            typeformaliteid: typeId,
            firstname,
            name,
            address,
            zipcode,
            city,
        } = formality

        const amount = FORMALITY_PRICES[typeId]
        const advanceAmount = 1000
        const label = FORMALITY_LABELS[typeId]

        if (!email || !amount || !label) {
            return jsonError('Données de facturation invalides', 400)
        }

        // Récupération ou création client Stripe
        const existingCustomers = await stripe.customers.list({
            email,
            limit: 10, // plusieurs clients possible avec le même email
        });

        const customer = existingCustomers.data.find(c => 
            c.name?.trim() === `${firstname ?? ''} ${name ?? ''}`.trim()
        );

        const finalCustomer = customer ?? await stripe.customers.create({
            email,
            name: `${firstname ?? ''} ${name ?? ''}`.trim(),
            preferred_locales: ['fr'],
            metadata: { demandeId },
            address: {
                line1: address,
                postal_code: zipcode,
                city,
                country: 'FR',
            },
        });

        await updateFormalityStripeCustomerId(demandeId, finalCustomer.id);

        // Création item de facture
        await stripe.invoiceItems.create({
            customer: finalCustomer.id,
            amount,
            currency: 'eur',
            description: `Formalité ${label} n° ${demandeId}`,
        })

        await stripe.invoiceItems.create({
            customer: finalCustomer.id,
            amount: advanceAmount,
            currency: 'eur',
            description: `Avance pour formalité ${label} n° ${demandeId}`,
        })

        // 5️⃣ Création facture (sans auto_advance)
        const invoice = await stripe.invoices.create({
            customer: finalCustomer.id,
            collection_method: 'send_invoice',
            days_until_due: 7,
            auto_advance: false, // ⚠️ on désactive l'automatique
            metadata: { demandeId },
            pending_invoice_items_behavior: 'include',
        })

        // 6️⃣ Finalisation manuelle
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

        // 7️⃣ Petit délai de sécurité (évite les effets de timing Stripe)
        await new Promise(resolve => setTimeout(resolve, 800))

        // 8️⃣ Envoi manuel contrôlé
        await stripe.invoices.sendInvoice(finalizedInvoice.id)

        // Réponse API
        return new Response(JSON.stringify({ success: true, invoiceId: finalizedInvoice.id, invoiceUrl: finalizedInvoice.hosted_invoice_url }), { status: 200 })
        
    } catch (error) {
        console.error('Erreur create-invoice:', error)
        return jsonError('Erreur serveur lors de la création de facture', 500)
    }
}

// Helper réponse JSON erreur
function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), { status })
}