export const prerender = false;
import { type APIContext } from 'astro';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  import.meta.env.MJ_APIKEY_PUBLIC,
  import.meta.env.MJ_APIKEY_PRIVATE
);

export async function POST({ request }: APIContext) {

  const formData = await request.formData();

  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const phone = formData.get('phone')?.toString() || '';
  const observation = formData.get('observation')?.toString() || '';
  const pdfFile = formData.get('pdf') as File | null;

  let attachment;

  // ✅ Si PDF présent
  if (pdfFile && pdfFile.type === "application/pdf") {

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    attachment = {
      ContentType: "application/pdf",
      Filename: pdfFile.name || "recap.pdf",
      Base64Content: buffer.toString("base64"),
    };
  }

  const now = new Date().toLocaleString('fr-FR');

  const htmlContent = `
    <h2>Nouvelle demande</h2>
    <p><strong>Date :</strong> ${now}</p>
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Téléphone :</strong> ${phone}</p>
    <p>${observation.replace(/\n/g, '<br>')}</p>
  `;

  try {

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'contact@mon-assistant-formalites.db-dev.fr',
            Name: 'Mon Assistant Formalités',
          },
          To: [
            {
              Email: 'contact@mon-assistant-formalites.db-dev.fr',
              Name: 'Mon Assistant Formalités',
            },
          ],
          ReplyTo: {
            Email: email,
            Name: name,
          },
          Subject: `Demande de création d'entreprise de ${name}`,
          HTMLPart: htmlContent,

          // ✅ PIECE JOINTE ICI
          Attachments: attachment ? [attachment] : [],
        },
      ],
    });

    if (!pdfFile || pdfFile.type !== "application/pdf" || pdfFile.size > 5_000_000)
        return new Response(JSON.stringify({ error: "Fichier PDF invalide ou trop volumineux (max 5MB)" }), { status: 400 });

    return new Response(JSON.stringify({ success: true }), { status: 200, });

  } catch (error) {
    console.error('Erreur Mailjet:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500, });
  }
}
