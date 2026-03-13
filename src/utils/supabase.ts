import { createClient } from '@supabase/supabase-js'

/* SUPABASE CLIENT */
export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL as string,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string
)

/* TYPES */
type InvoiceUpdateData = {
    invoiceId: string | null
    invoiceNumber: string | null
    invoiceUrl: string | null
    invoicePdf: string | null
    amountPaid: number | null
}

/* GETTERS / SELECT */

/**
 * Récupération d'une formalité par demandeId
 * @param demandeId 
 * @returns 
 */
export async function getFormalityByDemandeId(demandeId: string) {
    const { data, error } = await supabase
        .from('demandes')
        .select(`
            *,
            type_formalite: typeformaliteid(nom),
            statut_paiement: statutpaiementid(nom),
            statut_formalite: statutformaliteid(nom)
        `)
        .eq('demandeid', demandeId)
        .single()

    if (error) {
        console.error('ERREUR GET FORMALITY :', error)
        return null
    }

    return data
}

/**
 * Retourne toutes les formalités avec un statut donné
 * @param statutFormaliteId 
 * @returns 
 */
export async function getFormalitiesByStatus(statutFormaliteId: number) {
    const { data, error } = await supabase
        .from('demandes')
        .select(`id, demandeid, stripe_customer_id, email, phone, name, firstname, siren, typeformaliteid, statutformaliteid, statutpaiementid, pdf, city, zipcode, datecreation, ref_inpi, amount_paid, amount_refunded`)
        .eq('statutformaliteid', statutFormaliteId)
        .order('datecreation', { ascending: false })

    if (error) {
        console.error('ERREUR GET FORMALITIES :', error)
        return []
    }

    return data
}

/* VALIDATIONS  */

/**
 * Vérifie si une demande est déjà en attente ou en cours
 * @param email 
 * @param name 
 * @param typeFormaliteId 
 * @returns 
 */
export async function checkDuplicateFormality(
    email: string,
    name: string,
    typeFormaliteId: number
) {
    try {
        const { data, error } = await supabase
            .from('demandes')
            .select('demandeid, statutformaliteid')
            .eq('email', email)
            .eq('name', name)
            .eq('typeformaliteid', typeFormaliteId)
            .in('statutformaliteid', [1, 2])
            .maybeSingle()

        if (error) return { status: 'error_db', error }
        if (data) return { status: 'duplicate', demandeId: data.demandeid, statut: data.statutformaliteid }

        return { status: 'empty' }

    } catch (err) {
        return { status: 'error_db', error: err }
    }
}

/*  UPDATE  */

/**
 * Mise à jour du stripe_customerid
 * @param demandeId 
 * @param stripeCustomerId 
 * @returns 
 */
export async function updateFormalityStripeCustomerId(
    demandeId: string,
    stripeCustomerId: string
) {
    const { error } = await supabase
        .from('demandes')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('demandeid', demandeId)

    if (error) {
        console.error('ERREUR UPDATE STRIPE CUSTOMER ID :', error)
        throw error
    }

    return { success: true }
}

/**
 * Mise à jour du statut de paiement
 * @param demandeId 
 * @param statutPaiementId 
 * @returns 
 */
export async function updatePaymentStatus(
    demandeId: string,
    statutPaiementId: number
) {
    try {
        const { error } = await supabase
            .from('demandes')
            .update({ statutpaiementid: statutPaiementId })
            .eq('demandeid', demandeId)

        if (error) {
            console.error('ERREUR updatePaymentStatus Supabase:', error)
            throw error
        }

        return { success: true }

    } catch (err) {
        console.error('ERREUR updatePaymentStatus:', err)
        throw err
    }
}
/**
 * Mise à jour du montant remboursé
 * @param demandeId 
 * @param amountRefunded 
 * @returns 
 */
export async function updateAmountRefunded(
    demandeId: string,
    amountRefunded: number
) {
    try {
        const { error } = await supabase
            .from('demandes')
            .update({ amount_refunded: amountRefunded })
            .eq('demandeid', demandeId)

        if (error) {
            console.error('ERREUR updatePaymentStatus Supabase:', error)
            throw error
        }

        return { success: true }

    } catch (err) {
        console.error('ERREUR updatePaymentStatus:', err)
        throw err
    }
}

/**
 * Mise à jour des données de facture Stripe
 * @param demandeId 
 * @param data 
 */
export async function updateInvoiceData(
    demandeId: string,
    data: InvoiceUpdateData
) {
    const { error } = await supabase
        .from('demandes')
        .update({
            stripe_invoice_id: data.invoiceId,
            stripe_invoice_number: data.invoiceNumber,
            stripe_invoice_url: data.invoiceUrl,
            stripe_invoice_pdf: data.invoicePdf,
            amount_paid: data.amountPaid,
        })
        .eq('demandeid', demandeId)

    if (error) {
        console.error('❌ Erreur updateInvoiceData:', error)
        throw new Error('Erreur mise à jour données facture')
    }
}

/**
 * Mise à jour du statut de paiement (version simple)
 * @param demandeId 
 * @param statutPaiementId 
 */
export async function updateStatutPaiement(demandeId: string, statutPaiementId: number) {
    const { error } = await supabase
        .from('demandes')
        .update({ statutpaiementid: statutPaiementId })
        .eq('demandeid', demandeId)

    if (error) console.error('ERREUR UPDATE STATUT PAIEMENT :', error)
}

/**
 * Mise à jour du statut de formalité
 * @param demandeId 
 * @param statutFormaliteId 
 */
export async function updateStatutFormalite(demandeId: string, statutFormaliteId: number) {
    const { error } = await supabase
        .from('demandes')
        .update({ statutformaliteid: statutFormaliteId })
        .eq('demandeid', demandeId)

    if (error) console.error('ERREUR UPDATE STATUT FORMALITE :', error)
}

/**
 * Mise à jour du numéro de formalité ref_inpi
 * @param demandeId
 * @param refInpi
 */
export async function updateRefInpi(demandeId: string, refInpi: string) {
    const { error } = await supabase
        .from('demandes')
        .update({ ref_inpi: refInpi })
        .eq('demandeid', demandeId)

    if (error) {
        console.error('ERREUR UPDATE REF INPI :', error)
        return { success: false, error }
    }

    return { success: true }
}

/* STORAGE  */

/**
 * Génère un lien temporaire pour télécharger un PDF
 * @param pdfPath 
 * @param expires 
 * @returns 
 */
export async function getPdfSignedUrl(pdfPath: string, expires = 60) {
    try {
        const { data, error } = await supabase
            .storage
            .from('pdfs')
            .createSignedUrl(pdfPath, expires)

        if (error) throw error
        if (!data.signedUrl) throw new Error('Impossible de générer le lien signé')

        return data.signedUrl

    } catch (err) {
        console.error('ERREUR GET PDF SIGNED URL :', err)
        throw err
    }
}