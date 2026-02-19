export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import { type APIContext } from 'astro';
import { saveToken } from '@utils/tokenStore';
import { sendCreateNotification } from "@utils/mailService";
import { checkDuplicateFormality, createFormality } from '@utils/supabase';

export async function POST({ request }: APIContext) {
  try {
    const formData = await request.formData();

    const typeFormaliteId = Number(formData.get('typeFormaliteId')) || 1;
    const name = formData.get('name')?.toString() || '';
    const siren = formData.get('siren')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const city = formData.get('city')?.toString() || '';
    const zipcode = formData.get('zipcode')?.toString() || '';
    const pdfFile = formData.get('pdf') as File | null;

    if (!pdfFile || pdfFile.type !== "application/pdf" || pdfFile.size > 5_000_000) {
      return new Response(JSON.stringify({
        error: "Fichier PDF invalide ou trop volumineux (max 5MB)"
      }), { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const token = uuidv4();
    const pdfBase64 = buffer.toString('base64');

    saveToken(token, pdfBase64);

    const result = await checkDuplicateFormality(email, name, typeFormaliteId)

    if (result.status === 'error_db')
      return new Response(JSON.stringify({ error: "error_db" }), { status: 500 });
  
    if (result.status === 'duplicate')
      return new Response(JSON.stringify({ error: "duplicate", statut: result.statut }), { status: 400 });

    // Enregistrement dans Supabase
    await createFormality({
      typeFormaliteId,
      name,
      siren,
      email,
      phone,
      city,
      zipcode,
      pdf: {
        filename: pdfFile.name,
        base64: pdfBase64,
      }
    });

    // Envoi du mail notification
    // await sendCreateNotification({
    //   name,
    //   email,
    //   phone,
    //   pdf: {
    //     filename: pdfFile.name,
    //     base64: pdfBase64,
    //   }
    // });

    return new Response(JSON.stringify({ success: true, token }), { status: 200 });

  } catch (error) {
    console.error("🔥 ERREUR API CREATE :", error);

    return new Response(JSON.stringify({ error: "Erreur serveur", detail: String(error) }), { status: 500 });
  }
}
