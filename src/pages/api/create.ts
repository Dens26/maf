export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import type { APIContext } from 'astro';
import { saveToken } from '@utils/tokenStore';
import { sendCreateNotification } from "@utils/mailService";
import { checkDuplicateFormality, createFormality } from '@utils/supabase';

const MAX_PDF_SIZE = 5_000_000; // 5MB

export async function POST({ request }: APIContext) {
  try {
    const body = await request.json();

    const {
      typeFormaliteId,
      name,
      siren,
      email,
      phone,
      city,
      zipcode,
      pdf
    } = body;

    // ✅ Validation minimale
    if (!typeFormaliteId || !name || !email || !pdf) {
      return jsonResponse({ error: "Champs obligatoires manquants" }, 400);
    }

    // ✅ Vérification PDF base64
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = Buffer.from(pdf, 'base64');
    } catch {
      return jsonResponse({ error: "PDF invalide (base64 incorrect)" }, 400);
    }

    if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_PDF_SIZE) {
      return jsonResponse(
        { error: "Fichier PDF invalide ou trop volumineux (max 5MB)" },
        400
      );
    }

    const token = uuidv4();

    // Sauvegarde temporaire pour téléchargement ultérieur
    saveToken(token, pdf);

    // Vérification doublon
    const result = await checkDuplicateFormality(email, name, typeFormaliteId);

    if (result.status === 'error_db')
      return jsonResponse({ error: "error_db" }, 500);

    if (result.status === 'duplicate')
      return jsonResponse(
        { error: "duplicate", statut: result.statut },
        400
      );

    // Enregistrement Supabase
    try {
    await createFormality({
      typeFormaliteId,
      name,
      siren,
      email,
      phone,
      city,
      zipcode,
      pdf: {
        filename: "recap.pdf",
        base64: pdf,
      }
    });
  }catch(err) {
  return jsonResponse({ error: "Erreur insertion Supabase", detail: err }, 500);
}

    // Envoi du mail notification (désactivé temporairement)
    // await sendCreateNotification({
    //   name,
    //   email,
    //   phone,
    //   pdf: {
    //     filename: "recap.pdf",
    //     base64: pdf,
    //   }
    // });

    return jsonResponse({ success: true, token }, 200);

  } catch (error) {
    console.error("🔥 ERREUR API CREATE :", error);
    return jsonResponse(
      { error: "Erreur serveur", detail: String(error) },
      500
    );
  }
}

// Helper pour réponses JSON homogènes
function jsonResponse(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
