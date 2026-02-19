import { v4 } from 'uuid';
import { s as saveToken } from '../../chunks/tokenStore_BjIPfJGE.mjs';
import Mailjet from 'node-mailjet';
export { renderers } from '../../renderers.mjs';

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
async function sendCreateNotification({ name, email, phone, pdf }) {
  const now = (/* @__PURE__ */ new Date()).toLocaleString("fr-FR");
  const attachment = pdf ? [{
    ContentType: "application/pdf",
    Filename: pdf.filename,
    Base64Content: pdf.base64
  }] : [];
  const adminHtmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">   
            <h2>Nouvelle demande de création</h2>
            <p><strong>Date :</strong> ${now}</p>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone}</p>
        </div>
    </div>
    `;
  const clientHtmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">   
        <h2 style="color: #1d4ed8; margin-bottom: 20px;">Bonjour ${name},</h2>
        <p>Nous avons bien reçu votre demande de création d'entreprise.</p>
        <p>Vous trouverez en pièce jointe le document récapitulatif de votre demande.</p>
        <p>Nous reviendrons vers vous rapidement pour les prochaines étapes, qui pourront inclure des informations supplémentaires ou un lien de paiement.</p>
        <p>Merci pour votre confiance,</p>
        <p style="margin-top: 30px; font-weight: bold;">Mon Assistant Formalités</p>
        <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
        <p style="font-size: 0.85em; color: #6b7280; margin-top: 10px;">
            Si vous ne recevez pas d’email dans les prochaines minutes, pensez à vérifier votre dossier spam.
        </p>
        </div>
    </div>
    `;
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [{
      From: { Email: "contact@mon-assistant-formalites.fr", Name: "Mon Assistant Formalités" },
      To: [{ Email: "contact@mon-assistant-formalites.fr", Name: "Admin" }],
      Subject: `Nouvelle demande de création de ${name}`,
      HTMLPart: adminHtmlContent,
      Attachments: attachment
    }]
  });
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [{
      From: { Email: "contact@mon-assistant-formalites.fr", Name: "Mon Assistant Formalités" },
      To: [{ Email: email, Name: name }],
      Subject: `Confirmation de votre demande de création d'entreprise`,
      HTMLPart: clientHtmlContent,
      Attachments: attachment
    }]
  });
}

const prerender = false;
async function POST({ request }) {
  try {
    const formData = await request.formData();
    const typeFormaliteId = Number(formData.get("typeFormaliteId")) || 1;
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const city = formData.get("city")?.toString() || "";
    const zipcode = formData.get("zipcode")?.toString() || "";
    const pdfFile = formData.get("pdf");
    if (!pdfFile || pdfFile.type !== "application/pdf" || pdfFile.size > 5e6) {
      return new Response(JSON.stringify({
        error: "Fichier PDF invalide ou trop volumineux (max 5MB)"
      }), { status: 400 });
    }
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const token = v4();
    const pdfBase64 = buffer.toString("base64");
    saveToken(token, pdfBase64);
    await sendCreateNotification({
      name,
      email,
      phone,
      pdf: {
        filename: pdfFile.name,
        base64: pdfBase64
      }
    });
    return new Response(JSON.stringify({ success: true, token }), { status: 200 });
  } catch (error) {
    console.error("🔥 ERREUR API CREATE :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur", detail: String(error) }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
