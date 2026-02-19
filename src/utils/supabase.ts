// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

// Initialisation du client Supabase (service_role = backend only)
export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL as string,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string
)

// Types pour la création d'une formalité
type CreateFormalityParams = {
    typeFormaliteId: number
    name: string
    siren?: string
    email: string
    phone?: string
    city?: string
    zipcode?: string
    pdf: {
        filename: string
        base64: string
    }
}

/**
 * Création d'une formalité
 * @param param0 
 */
export async function createFormality({ typeFormaliteId, name, siren, email, phone, city, zipcode, pdf }: CreateFormalityParams) {
    try {
        const demandeId = randomUUID()

        // sauvegarde PDF
        const dir = path.join(process.cwd(), 'public', 'pdfs')
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

        const pdfPath = path.join('pdfs', `${demandeId}_${pdf.filename}`)
        fs.writeFileSync(
            path.join(process.cwd(), 'public', pdfPath),
            Buffer.from(pdf.base64, 'base64')
        )

        // insertion Supabase
        const { error } = await supabase.from('demandes').insert([
            {
                demandeid: demandeId,
                email,
                name,
                siren,
                typeformaliteid: typeFormaliteId,
                statutpaiementid: 1,   // en_attente
                statutformaliteid: 1,  // en_attente
                pdf: pdfPath,
                phone,
                city,
                zipcode
            }
        ])

        if (error) throw error

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
            .in('statutformaliteid', [1, 2]) // en_attente ou en_traitement
            .maybeSingle()

        if (error) return { status: 'error_db', error }
        if (data) return { status: 'duplicate', demandeId: data.demandeid, statut: data.statutformaliteid }
        return { status: 'empty' }

    } catch (err) {
        return { status: 'error_db', error: err }
    }
}

/**
 * Récupération d'une formalité par demandeId
 * @param demandeId 
 * @returns 
 */
export async function getFormality(demandeId: string) {
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
