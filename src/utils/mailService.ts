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
            
            <img 
                style="max-width: 100%; height: auto; display: block; margin: 0 auto 50px auto;" 
                src="https://www.mon-assistant-formalites.fr/images/logo.png" 
                alt="Mon Assistant Formalités"
            >
            
            <h2 style="margin-bottom: 20px;">Bonjour ${name},</h2>
            
            <p>Nous avons bien reçu votre demande de création d'entreprise.</p>
            <p>Vous trouverez en pièce jointe le document récapitulatif de votre demande.</p>
            
            <h3>Les prochaines étapes</h3>
            <ul>
                <li>Vous recevrez prochainement un email d'acceptation de votre demande ainsi que votre facture.</li>
                <li>La demande sera traitée après le retour des documents demandés et l'acceptation de votre paiement.</li>
            </ul>
            
            <p>Merci pour votre confiance,</p>
            <p style="margin-top: 30px; font-weight: bold;">Mon Assistant Formalités</p>
            
            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
            
            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">
                Pour ne manquer aucune information de notre part, ajoutez notre adresse mail comme courrier légitime. Pour recevoir votre facture, pensez à vérifier votre dossier <strong>SPAM</strong>.<br>
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



export async function sendRequestDocuments(demandeid : string, name : string, email : string) {
    
    const htmlContent = `
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
        <img style="max-width: 100%; height: auto; display: block; margin: 0 auto 50px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">
        
        <h2 style="margin-bottom: 20px;">Bonjour ${name},</h2>

        <p>C’est avec plaisir que nous vous informons de la prise en charge de votre dossier de création d’entreprise numéro : <strong>${demandeid}</strong>.</p>

        <p>Pour finaliser la création de votre entreprise individuelle, merci de nous fournir les pièces justificatives suivantes :</p>
        <ul>
            <li>Une copie de votre pièce d'identité (carte d'identité ou passeport en cours de validité)</li>
            <li>Un justificatif de domicile récent (facture, avis d’imposition, contrat de bail, etc.)</li>
            <li>Le mandat signé pour nous autoriser à déposer votre dossier auprès du Guichet Unique. Vous pouvez télécharger le modèle ici : <a href="https://www.mon-assistant-formalites.fr/documents/modele_de_mandat.pdf" target="_blank">Modèle de mandat PDF</a></li>
        </ul>
        <p style="margin-top: 30px;">Merci de nous envoyer ces documents par retour de mail.</p>

        <!-- Section mise en valeur -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
            <p>Un e-mail de paiement vous a été envoyé.</p>
            <p>Si vous ne le recevez pas dans les prochaines minutes, veuillez vérifier votre dossier <strong>SPAM</strong> ou nous contacter par retour de mail afin que nous puissions vous renvoyer le message.</p>

            <p style="margin-top: 20px; font-weight: bold; color: #d63636; background-color: #fff3f3; padding: 12px; border-radius: 6px; border: 1px solid #f5c2c2; line-height: 1.5;">
                Le traitement de votre formalité ne pourra commencer qu’après réception complète des pièces et validation de votre paiement.
            </p>
        </div>

        <p style="margin-top: 30px;"><em>⚠️ Cet e-mail a été généré automatiquement suite à la prise en charge de votre dossier. Selon le contenu de votre dossier, nous pourrons revenir vers vous pour demander des pièces justificatives complémentaires si nécessaire.</em></p>

        <p style="margin-top: 30px; font-weight: bold;">Mon Assistant Formalités</p>

        <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
        
        <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse mail à vos contacts ou comme courrier légitime.</p>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: name }],
            Subject: `Confirmation de votre demande de création d'entreprise`,
            HTMLPart: htmlContent
        }]
    });
}