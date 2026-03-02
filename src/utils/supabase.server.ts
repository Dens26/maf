import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY! // server only
)

export async function getPdfSignedUrl(pdfPath: string, expires = 60) {
  const { data, error } = await supabase
    .storage
    .from('pdfs')
    .createSignedUrl(pdfPath, expires)

  if (error) throw error
  if (!data.signedUrl) throw new Error('Impossible de générer le lien signé')
  return data.signedUrl
}