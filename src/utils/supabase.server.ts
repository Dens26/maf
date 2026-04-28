import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY! // server only
)

/* ================= TYPES ================= */

type FileBase64 = {
  filename: string
  base64: string
}

type CreateFormalityParams = {
  demandeId: string
  typeFormaliteId: number
  email: string
  phone: string
  name: string
  firstname: string
  address: string
  zipcode: string
  city: string
  siren?: string
  ref_inpi?: string
  pdf: FileBase64
  synthese?: FileBase64 // ✅ optionnel
}

/* ================= CREATE FORMALITY ================= */
/**
 * Création d'une formalité
 * @param param0 
 * @returns 
 */
export async function createFormality({ demandeId, typeFormaliteId, email, phone, name, firstname, address, zipcode, city, siren, pdf, synthese }: CreateFormalityParams) {
  try {
    /* ===== PDF RECAP ===== */

    const pdfName = `${demandeId}_${pdf.filename}`
    const pdfPath = `pdfs/${pdfName}`

    const { error: uploadPdfError } = await supabase.storage
      .from('pdfs')
      .upload(pdfPath, Buffer.from(pdf.base64, 'base64'), {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadPdfError) throw uploadPdfError

    /* ===== SYNTHESE (OPTIONNELLE) ===== */

    let syntheseName: string | null = null

    if (synthese) {
      syntheseName = `${demandeId}_${synthese.filename}`
      const synthesePath = `syntheses/${syntheseName}`

      const { error: uploadSyntheseError } = await supabase.storage
        .from('syntheses')
        .upload(synthesePath, Buffer.from(synthese.base64, 'base64'), {
          contentType: 'application/pdf',
          upsert: false
        })

      if (uploadSyntheseError) throw uploadSyntheseError
    }

    /* ===== INSERT DB ===== */

    const { error: dbError } = await supabase
      .from('demandes')
      .insert([
        {
          demandeid: demandeId,
          typeformaliteid: typeFormaliteId,
          email,
          phone,
          name: name.toUpperCase(),
          firstname,
          address,
          zipcode,
          city,
          siren,
          statutpaiementid: 1,
          statutformaliteid: 1,
          pdf: pdfName,
          synthese: syntheseName // null si non fourni
        }
      ])

    if (dbError) throw dbError

    return {
      demandeId,
      pdfPath
    }

  } catch (err) {
    console.error('ERREUR CREATE FORMALITY :', err)
    throw err
  }
}

/* ================= SIGNED URL ================= */
/**
 * Récupération de l'url d'un pdf
 * @param pdfPath 
 * @param expires 
 * @returns 
 */
export async function getPdfSignedUrl(pdfPath: string, expires = 60) {
  const { data, error } = await supabase
    .storage
    .from('pdfs')
    .createSignedUrl(pdfPath, expires)

  if (error) throw error
  if (!data?.signedUrl) throw new Error('Impossible de générer le lien signé')

  return data.signedUrl
}

/**
 * Récupération de l'url d'une synthèse
 * @param synthesePath 
 * @param expires 
 * @returns 
 */
export async function getSyntheseSignedUrl(synthesePath: string, expires = 60) {
  const { data, error } = await supabase
    .storage
    .from('syntheses')
    .createSignedUrl(synthesePath, expires)

  if (error) throw error
  if (!data?.signedUrl) throw new Error('Impossible de générer le lien signé')

  return data.signedUrl
}