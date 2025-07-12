export const prerender = false;
import { type APIContext } from 'astro';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  import.meta.env.MJ_APIKEY_PUBLIC,
  import.meta.env.MJ_APIKEY_PRIVATE
);

export async function POST({ request }: APIContext) {
  const body = await request.json();

  const {
    name = '',
    email = '',
    phone = '',
    company = '',
    message = '',
    service = '',
    interests = '',
    ['hear_about']: hearAbout = '', // attention au nom de la clé
  } = body;

  const interestText = Array.isArray(interests) ? interests.join(', ') : interests;

  const now = new Date().toLocaleString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://app.mon-assistant-formalites.db-dev.fr/images/logo.png" alt="Logo Mon Assistant Formalités" style="width: 100%; height: auto; max-width: none;" />
      </div>
      <h2 style="color: #2c3e50;">📩 Nouvelle demande via le formulaire de contact</h2>
      <p><strong>Date :</strong> ${now}</p>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Téléphone :</strong> ${phone}</p>
      <p><strong>Entreprise :</strong> ${company || 'Non renseignée'}</p>
      <p><strong>Service demandé :</strong> ${service}</p>
      <p><strong>Comment nous a-t-il connu :</strong> ${hearAbout}</p>
      <p><strong>Centres d’intérêt :</strong> ${interestText}</p>
      <p><strong>Message :</strong></p>
      <blockquote style="margin: 15px 0; padding-left: 15px; border-left: 3px solid #ccc; color: #555;">${message.replace(/\n/g, '<br>')}</blockquote>
      <hr style="margin-top: 30px;"/>
      <p style="font-size: 0.9em; color: #888;">Formulaire envoyé depuis <a href="https://app.mon-assistant-formalites.db-dev.fr/contact">mon-assistant-formalites.db-dev.fr</a></p>
    </div>
  </div>
`;

  try {
    // 1. Envoi du mail complet à contact@...
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
            Email: email, // email du client qui a soumis le formulaire
            Name: name,
          },
          Subject: `Message de ${name} via le formulaire`,
          HTMLPart: htmlContent,
        },
      ],
    });

    // 2. Envoi d’une notification simple à ta boîte perso
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'contact@mon-assistant-formalites.db-dev.fr',
            Name: 'Mon Assistant Formalités',
          },
          To: [
            {
              Email: 'denis.bekaert@live.fr',
              Name: 'Denis Bekaert',
            },
          ],
          Subject: `Notification : nouvelle demande de ${name}`,
          TextPart: `Une nouvelle demande a été envoyée via le formulaire de contact.\n\nNom : ${name}\nEmail : ${email}\nMessage : ${message.substring(0, 100)}...`,
          HTMLPart: `<p>Une nouvelle demande a été envoyée via le formulaire de contact.</p>
                     <p><strong>Nom :</strong> ${name}</p>
                     <p><strong>Email :</strong> ${email}</p>
                     <p><strong>Message :</strong> ${message.substring(0, 100)}...</p>`,
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Erreur Mailjet:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
