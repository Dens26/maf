export const prerender = false;

import { v4 as uuidv4 } from 'uuid';
import type { APIContext } from 'astro';
import { saveToken } from '@utils/tokenStore';
import { checkDuplicateFormality } from '@utils/supabase';
import { createFormality } from '@utils/supabase.server';
import { sendNotification } from '@utils/mailService';

const MAX_PDF_SIZE = 1_000_000; // 1MB

export async function POST({ request }: APIContext) {
  try {
    const body = await request.json();

    const {
      demandeId,
      typeFormaliteId,
      email,
      phone,
      name,
      firstname,
      address,
      zipcode,
      city,
      siren,
      pdf,
      synthese
    } = body;

    const typeId = Number(typeFormaliteId);

    /* ================= VALIDATION ================= */

    if (!demandeId || !typeId || !name || !email || !pdf) {
      return jsonResponse({ error: "Champs obligatoires manquants" }, 400);
    }

    /* ================= PDF RECAP ================= */

    let pdfBuffer: Buffer;

    try {
      pdfBuffer = Buffer.from(pdf, 'base64');
    } catch {
      return jsonResponse({ error: "PDF invalide (base64 incorrect)" }, 400);
    }

    if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_PDF_SIZE) {
      return jsonResponse(
        { error: "PDF invalide ou trop volumineux (max 1MB)" },
        400
      );
    }

    /* ================= SYNTHESE (OPTIONNELLE) ================= */

    let syntheseData: { filename: string; base64: string } | undefined;

    if (typeId === 6) {
      if (!synthese) {
        return jsonResponse({ error: "Synthèse manquante" }, 400);
      }

      let syntheseBuffer: Buffer;

      try {
        syntheseBuffer = Buffer.from(synthese, 'base64');
      } catch {
        return jsonResponse({ error: "Synthèse invalide (base64 incorrect)" }, 400);
      }

      if (syntheseBuffer.length === 0 || syntheseBuffer.length > MAX_PDF_SIZE) {
        return jsonResponse(
          { error: "Synthèse invalide ou trop volumineuse (max 1MB)" },
          400
        );
      }

      syntheseData = {
        filename: "synthese.pdf",
        base64: synthese,
      };
    }

    /* ================= TOKEN ================= */

    const token = uuidv4();
    saveToken(token, pdf);

    /* ================= DOUBLON ================= */

    const result = await checkDuplicateFormality(email, name, firstname, typeId);

    if (result.status === 'error_db')
      return jsonResponse({ error: "error_db" }, 500);

    if (result.status === 'duplicate')
      return jsonResponse({ error: "duplicate", statut: result.statut }, 400);

    /* ================= INSERT ================= */

    try {
      await createFormality({
        demandeId,
        typeFormaliteId: typeId,
        email,
        phone,
        name,
        firstname,
        address,
        zipcode,
        city,
        siren,
        pdf: {
          filename: "recap.pdf",
          base64: pdf,
        },
        synthese: syntheseData 
      });
    } catch (error) {
      console.error('Erreur create.ts:', error);
      return jsonResponse({ error: "Erreur insertion Supabase" }, 500);
    }

    // Envoi du mail notification (désactivé temporairement)
    try {
      await sendNotification({
        firstname,
        name,
        email,
        phone,
        typeFormaliteId: typeId,
        pdf: {
          filename: "recap.pdf",
          base64: pdf,
        },
        synthese: syntheseData
      });
    } catch (err) {
      console.error("Erreur envoi mail :", err);
      // ne bloque PAS la création de la demande
    }

    return jsonResponse({ success: true, token }, 200);

  } catch (error) {
    console.error("🔥 ERREUR API CREATE :", error);
    return jsonResponse(
      { error: "Erreur serveur", detail: String(error) },
      500
    );
  }
}

/* ================= HELPER ================= */

function jsonResponse(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}