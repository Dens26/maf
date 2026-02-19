import Mailjet from 'node-mailjet';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
async function POST({ request }) {
  const body = await request.json();
  const name = String(body.name || "");
  const email = String(body.email || "");
  const phone = String(body.phone || "");
  const company = String(body.company || "");
  const message = String(body.message || "");
  const service = String(body.service || "");
  const hearAbout = String(body.hear_about || "");
  const now = (/* @__PURE__ */ new Date()).toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Logo Mon Assistant Formalités" style="width: 100%; height: auto; max-width: none;" />
      </div>
      <h2 style="color: #2c3e50;">📩 Nouvelle demande via le formulaire de contact</h2>
      <p><strong>Date :</strong> ${now}</p>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p>
      <p><strong>Entreprise :</strong> ${escapeHtml(company) || "Non renseignée"}</p>
      <p><strong>Service demandé :</strong> ${escapeHtml(service)}</p>
      <p><strong>Comment nous a-t-il connu :</strong> ${escapeHtml(hearAbout)}</p>
      <p><strong>Message :</strong></p>
      <blockquote style="margin: 15px 0; padding-left: 15px; border-left: 3px solid #ccc; color: #555;">
        ${escapeHtml(message).replace(/\n/g, "<br>")}
      </blockquote>
      <hr style="margin-top: 30px;"/>
      <p style="font-size: 0.9em; color: #888;">
        Formulaire envoyé depuis <a href="https://www.mon-assistant-formalites.fr/contact">mon-assistant-formalites.fr</a>
      </p>
    </div>
  </div>
`;
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "contact@mon-assistant-formalites.fr",
            Name: "Mon Assistant Formalités"
          },
          To: [
            {
              Email: "contact@mon-assistant-formalites.fr",
              Name: "Mon Assistant Formalités"
            }
          ],
          ReplyTo: {
            Email: email,
            Name: name
          },
          Subject: `Message de ${escapeHtml(name)} via le formulaire`,
          HTMLPart: htmlContent,
          TrackOpens: "disabled",
          TrackClicks: "disabled"
        }
      ]
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erreur Mailjet:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
