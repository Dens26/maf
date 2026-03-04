// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Initialisation du client Supabase (service_role = backend only)
export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL as string,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string
)

type InvoiceUpdateData = {
    invoiceId: string | null
    invoiceNumber: string | null
    invoiceUrl: string | null
    invoicePdf: string | null
}

/**
 * Vérifie si une demande est déjà en attente ou en cours de traitement
 * pour le même email, le même nom et le même type de formalité.
 * @param email 
 * @param name 
 * @param typeFormaliteId 
 * @returns 
 */
export async function checkDuplicateFormality(email: string, name: string, typeFormaliteId: number) {
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

/**
 * Retourne toute les formalités avec le statut passé en paramètre
 * @param statutFormaliteId
 * @returns 
 */
export async function getFormalitiesByStatus(statutFormaliteId: number) {
    const { data, error } = await supabase
        .from('demandes')
        .select(`id, demandeid, stripe_customerid, email, name, siren, typeformaliteid, statutformaliteid, statutpaiementid, pdf, phone, city, zipcode, datecreation, numero_formalite`)
        .eq('statutformaliteid', statutFormaliteId)
        .order('datecreation', { ascending: false })

    if (error) {
        console.error('ERREUR GET FORMALITIES :', error)
        return []
    }

    return data
}

/**
 * Mise à jour de l'id stripe_customerid
 * @param demandeId 
 * @param customerId 
 * @returns 
 */
export async function updateFormalityStripeCustomerId(demandeId: string, stripeCustomerId: string) {
    const { error } = await supabase
        .from('demandes')
        .update({ stripe_customerid: stripeCustomerId })
        .eq('demandeid', demandeId);

    if (error) {
        console.error('ERREUR UPDATE STRIPE CUSTOMER ID :', error);
        throw error;
    }

    return { success: true };
}

/**
 * Met à jour le statut de paiement d'une demande
 * @param demandeId UUID de la demande
 * @param statutPaiementId ID du nouveau statut de paiement
 */
export async function updatePaymentStatus(demandeId: string, statutPaiementId: number) {
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
        })
        .eq('demandeid', demandeId)

    if (error) {
        console.error('❌ Erreur updateInvoiceData:', error)
        throw new Error('Erreur mise à jour données facture')
    }
}

/**
 * Génère un lien temporaire pour télécharger un PDF depuis Supabase Storage
 * @param pdfPath
 * @param expires
 */
export async function getPdfSignedUrl(pdfPath: string, expires = 60) {
    try {
        const { data, error } = await supabase
            .storage
            .from('pdfs')          // bucket
            .createSignedUrl(pdfPath, expires)

        if (error) throw error
        if (!data.signedUrl) throw new Error('Impossible de générer le lien signé')

        return data.signedUrl
    } catch (err) {
        console.error('ERREUR GET PDF SIGNED URL :', err)
        throw err
    }
}

























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
 * Mise à jour du statut de paiement
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
