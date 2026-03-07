import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY! // server only
)

// Types pour la création d'une formalité
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
export async function createFormality({ demandeId, typeFormaliteId, email, phone, name, firstname, address, zipcode, city, siren, pdf }: CreateFormalityParams) {
  try {
    const pdfName = `${demandeId}_${pdf.filename}`
    const pdfPath = `pdfs/${pdfName}`

    // 🔹 Upload PDF dans Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(pdfPath, Buffer.from(pdf.base64, 'base64'), {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) throw uploadError

    // 🔹 Création de la demande dans la base
    const { error: dbError } = await supabase.from('demandes').insert([
      {
        demandeid: demandeId,
        typeformaliteid: typeFormaliteId,
        email,
        phone,
        name : name.toUpperCase(),
        firstname,
        address,
        zipcode,
        city,
        siren,
        statutpaiementid: 1,
        statutformaliteid: 1,
        ref_inpi: 'non définie',
        pdf: pdfName,
      }
    ])

    if (dbError) throw dbError

    return { demandeId, pdfPath }
  } catch (err) {
    console.error('ERREUR CREATE FORMALITY :', err)
    throw err
  }
}

export async function getPdfSignedUrl(pdfPath: string, expires = 60) {
  const { data, error } = await supabase
    .storage
    .from('pdfs')
    .createSignedUrl(pdfPath, expires)

  if (error) throw error
  if (!data.signedUrl) throw new Error('Impossible de générer le lien signé')
  return data.signedUrl
}