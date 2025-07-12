export const prerender = false;
import { type APIContext } from 'astro';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  import.meta.env.MJ_APIKEY_PUBLIC,
  import.meta.env.MJ_APIKEY_PRIVATE
);

export async function POST({ request }: APIContext) {
  const body = await request.json();

  console.log('BODY:', body); // ← debug utile pour vérifier les valeurs reçues

  try {
    const variables = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      service: body.service || '',
      hear_about: body.hear_about || '', // ← tu peux renommer ça en "hear-about" si ton template l'attend ainsi
      interests: Array.isArray(body.interests) ? body.interests.join(', ') : (body.interests || ''),
    };

    console.log('VARIABLES ENVOYÉES À MAILJET:', variables); // ← log utile

    const response = await mailjet.post('send', { version: 'v3.1' }).request({
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
          TemplateID: 7152261,
          TemplateLanguage: true,
          Subject: `Message de ${variables.name} via le formulaire`,
          Variables: variables,
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
