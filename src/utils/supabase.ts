// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

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

// Types pour la création d'une formalité
type CreateFormalityParams = {
    typeFormaliteId: number
    email: string
    phone: string
    name: string
    firstname: string
    address: string
    zipcode: string
    city: string
    siren?: string
    stripeCustomerId?: string
    pdf: {
        filename: string
        base64: string
    }
}
// Labels
const FORMALITY_TYPE_LABELS: Record<number, string> = {
    1: 'CR', // Création
    2: 'MO', // Déménagement
    3: 'AC', // Activité
    4: 'CO', // Correction
    5: 'CE', // Cessation
};

// Fonction de génération du numéro de formalité
function generateDemandeId(typeFormaliteId: number) {
    const brand = 'MAF';
    const prefix = FORMALITY_TYPE_LABELS[typeFormaliteId] ?? 'XX';

    // Date format YYMMDD
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePart = `${year}${month}${day}`;

    // 7 caractères alphanumériques aléatoires
    const randomPart = parseInt(randomBytes(4).toString('hex'), 16).toString(36).toUpperCase().substring(0, 7);

    return `${brand}${prefix}-${datePart}-${randomPart}`;
}

/**
 * Création d'une formalité
 * @param param0 
 */
export async function createFormality({ typeFormaliteId, email, phone, name, firstname, address, zipcode, city, siren, stripeCustomerId, pdf }: CreateFormalityParams) {
    try {
        const demandeId = generateDemandeId(typeFormaliteId)
        const pdfName = `${demandeId}_${pdf.filename}`
        const pdfPath = `pdfs/${demandeId}_${pdf.filename}`

        // Upload PDF dans Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('pdfs')       // nom du bucket
            .upload(pdfPath, Buffer.from(pdf.base64, 'base64'), {
                contentType: 'application/pdf',
                upsert: false
            })

        if (uploadError) throw uploadError

        // Création de la demande dans la base
        const { error: dbError } = await supabase.from('demandes').insert([
            {
                demandeid: demandeId,
                typeformaliteid: typeFormaliteId,
                email,
                phone,
                name,
                firstname,
                address,
                zipcode,
                city,
                siren,
                statutpaiementid: 1,
                statutformaliteid: 1,
                stripe_customerid: stripeCustomerId,
                pdf: pdfName,
            }
        ])

        if (dbError) throw dbError

    } catch (err) {
        console.error('ERREUR CREATE FORMALITY :', err)
        throw err
    }
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
        .select(`id, demandeid, stripe_customerid, email, name, siren, typeformaliteid, statutformaliteid, statutpaiementid, pdf, phone, city, zipcode, datecreation`)
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
