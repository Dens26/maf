export const prerender = false;
import { type APIContext } from 'astro';
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  import.meta.env.MJ_APIKEY_PUBLIC,
  import.meta.env.MJ_APIKEY_PRIVATE
);

export async function POST({ request }: APIContext) {
  const body = await request.json();
  console.log(body);
  try {
    // const response = await mailjet.post('send', { version: 'v3.1' }).request({
    //   Messages: [
    //     {
    //       From: {
    //         Email: 'contact@mon-assistant-formalites.db-dev.fr',
    //         Name: 'Mon Assistant Formalités',
    //       },
    //       To: [
    //         {
    //           Email: 'denis.bekaert@live.fr',
    //           Name: 'Denis Bekaert',
    //         },
    //       ],
    //       TemplateID: 7133670,
    //       TemplateLanguage: true,
    //       Subject: `Message de ${body.name} via le formulaire`,
    //       Variables: {
    //         name: body.name,
    //         email: body.email,
    //         phone: body.phone,
    //         company: body.company,
    //         hear_about: body.hear_about,
    //         interests: body.interests,
    //         service: body.service,
    //         message: body.message,
    //       },
    //     },
    //   ],
    // });

    // return new Response(JSON.stringify({ success: true }), {
    //   status: 200,
    // });
  } catch (error) {
    console.error('Erreur Mailjet:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
}