export const prerender = false;
import { type APIContext } from 'astro';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  import.meta.env.MJ_API_KEY_PUBLIC,
  import.meta.env.MJ_API_KEY_PRIVATE
);

export async function POST(context: APIContext) {
  const body = await context.request.json();
  console.log('Body reçu :', body)
  const { name, email, message } = body;

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'contact@mon-assistant-formalites.db-dev.fr',
            Name: 'Mon Assistant Formalités'
          },
          To: [
            {
              Email: 'destinataire@mail.com',
              Name: 'Toi'
            }
          ],
          Subject: `Message de ${name} via le formulaire`,
          TextPart: message,
          HTMLPart: `
            <h3>Message reçu via le site</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br/>${message}</p>
          `
        }
      ]
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
