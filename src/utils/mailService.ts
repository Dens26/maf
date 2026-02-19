import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    import.meta.env.MJ_APIKEY_PUBLIC,
    import.meta.env.MJ_APIKEY_PRIVATE
);

type SendCreateNotificationParams = {
    name: string;
    email: string;
    phone: string;
    pdf?: {
        filename: string;
        base64: string;
    };
};

export async function sendCreateNotification({ name, email, phone, pdf }: SendCreateNotificationParams) {

    const now = new Date().toLocaleString('fr-FR');

    const attachment = pdf
        ? [{
            ContentType: "application/pdf",
            Filename: pdf.filename,
            Base64Content: pdf.base64,
        }]
        : [];
        
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

    // Admin
    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: 'contact@mon-assistant-formalites.fr', Name: 'Admin' }],
            Subject: `Nouvelle demande de création de ${name}`,
            HTMLPart: adminHtmlContent,
            Attachments: attachment,
        }]
    });

    // Client
    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: name }],
            Subject: `Confirmation de votre demande de création d'entreprise`,
            HTMLPart: clientHtmlContent,
            Attachments: attachment,
        }]
    });
}