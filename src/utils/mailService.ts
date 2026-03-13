import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    import.meta.env.MJ_APIKEY_PUBLIC,
    import.meta.env.MJ_APIKEY_PRIVATE
);

type SendCreateNotificationParams = {
    firstname: string;
    name: string;
    email: string;
    phone: string;
    pdf?: {
        filename: string;
        base64: string;
    };
};

export async function sendCreateNotification({ firstname, name, email, phone, pdf }: SendCreateNotificationParams) {

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
            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 50px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">
            <h2>Nouvelle demande de création</h2>
            <p><strong>Date :</strong> ${now}</p>
            <p><strong>Nom :</strong> ${firstname} ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone}</p>
        </div>
    </div>
    `;

    const clientHtmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">

            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 40px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">

            <h2 style="margin-bottom: 20px; font-size: 1.3rem;">Bonjour ${firstname} ${name},</h2>

            <p style="margin-bottom: 20px;">Nous avons bien reçu votre demande de création d'entreprise. Le document récapitulatif de votre dossier est joint à cet email.</p>

            <h3 style="font-size: 1rem; margin-bottom: 10px;">Prochaines étapes</h3>
            <ul style="margin-bottom: 20px; padding-left: 20px;">
                <li>Après examen et acceptation de votre demande, vous recevrez un email vous indiquant les pièces nécessaires au traitement de votre dossier.</li>
                <li>Vous recevrez également un email contenant un lien de paiement et votre facture correspondante.</li>
            </ul>

            <!-- Section contact séparée -->
            <div style="margin-bottom: 20px; margin-top: 20px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
                <p>Le traitement de votre dossier commencera dès réception de l’ensemble des documents requis et confirmation de votre paiement.</p>
            </div>

            <p style="margin-bottom: 20px;">Nous vous remercions pour votre confiance et restons à votre disposition pour tout complément d’information.</p>
            <p style="margin: 0;">Si vous avez la moindre question concernant votre dossier ou le traitement de votre formalité, n’hésitez pas à nous <a href="https://www.mon-assistant-formalites.fr/contact" style="color:#1d4ed8; text-decoration:underline;">contacter</a>.</p>

            <p style="margin-top: 25px; font-weight: bold;">Mon Assistant Formalités</p>

            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>

            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse mail à vos contacts ou comme courrier légitime.</p>
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
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Confirmation de votre demande de création d'entreprise`,
            HTMLPart: clientHtmlContent,
            Attachments: attachment,
        }]
    });
}



export async function sendRequestDocuments(demandeid : string, firstname: string, name : string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            
            <img style="max-width: 100%; height: auto; display: block; margin: 0 auto 50px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">
            
            <h2 style="margin-bottom: 20px;">Bonjour ${firstname} ${name},</h2>

            <p style="margin-bottom: 20px;">C’est avec plaisir que nous vous informons de la prise en charge de votre dossier de création d’entreprise numéro : <strong>${demandeid}</strong>.</p>

            <p>Pour finaliser la création de votre entreprise individuelle, merci de nous fournir les pièces justificatives suivantes :</p>
            <ul>
                <li>Une copie de votre pièce d'identité (carte d'identité ou passeport en cours de validité)</li>
                <li>Un justificatif de domicile récent (facture, avis d’imposition, contrat de bail, etc.)</li>
                <li>Le mandat signé pour nous autoriser à déposer votre dossier auprès du Guichet Unique. Vous pouvez télécharger le modèle ici : <a href="https://www.mon-assistant-formalites.fr/documents/modele_de_mandat.pdf" target="_blank">Modèle de mandat PDF</a></li>
            </ul>
            <p style="margin-top: 20px;">Merci de nous envoyer ces documents par retour de mail.</p>

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
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Dossier MAF n°${demandeid} pris en charge – pièces justificatives requises`,
            HTMLPart: htmlContent
        }]
    });
}

export async function sendCanceledInvoice(demandeid : string, firstname: string, name : string, invoiceNumber: string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">

            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 40px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">

            <h2 style="margin-bottom: 20px; font-size: 1.3rem;">Bonjour ${firstname} ${name},</h2>

            <p style="margin-bottom: 20px;">Nous vous informons que la facture <strong>n°${invoiceNumber}</strong> relative à votre formalité <strong>MAF n°${demandeid}</strong> a été <strong>annulée</strong>.</p>

            <p style="margin-bottom: 20px;">Merci de ne plus tenir compte de cette facture. Si nécessaire, une nouvelle facture vous sera envoyée ultérieurement pour poursuivre le traitement de votre dossier.</p>

            <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
                <p>Pour rappel :</p>
                <p style="margin-top: 10px;">L’annulation de cette facture n’impacte pas l’état de votre formalité, qui reste en cours de traitement. Vous serez informé par email de toute action ou facture à venir.</p>
            </div>

            <p style="margin-bottom: 20px;">Si vous avez des questions concernant cette annulation ou votre dossier, vous pouvez nous <a href="https://www.mon-assistant-formalites.fr/contact" style="color:#1d4ed8; text-decoration:underline;">contacter</a> à tout moment.</p>

            <p style="margin-top: 25px; font-weight: bold;">Mon Assistant Formalités</p>

            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>

            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse mail à vos contacts ou comme courrier légitime.</p>
        </div>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Annulation de votre facture n°${invoiceNumber}`,
            HTMLPart: htmlContent
        }]
    });
}

export async function sendRefundNotification(demandeid : string, firstname: string, name : string, amount: string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.5; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 50px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">
            <h2 style="margin-bottom: 30px; font-size: 1.3rem;">Bonjour ${firstname} ${name}</h2>
            <p style="margin-bottom: 30px;">Nous vous informons que le solde non utilisé de l’avance demandée pour la formalité n° <strong>${demandeid}</strong> vous a été remboursé.</p>
            <p>Lors du traitement de votre dossier, une avance de <strong>10 €</strong> est demandée afin de couvrir d’éventuels frais de régularisation auprès de l’administration.</p>
            <p style="margin-bottom: 30px;">Les frais réellement engagés ont été déduits de cette avance et le montant restant, soit <strong>${amount} €</strong>, vient d’être remboursé sur votre moyen de paiement.</p>
            <p style="margin-bottom: 30px;">Ce remboursement peut apparaître sur votre compte dans un délai de quelques jours selon les délais de votre établissement bancaire.</p>
            <p>Si vous avez la moindre question concernant votre formalité, n’hésitez pas à nous contacter.</p><p>Merci pour votre confiance,</p>
            <p style="margin-top: 30px; font-weight: bold;">Mon Assistant Formalités</p><hr style="margin-top: 20px; border-color: #e5e7eb;"/>
            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse mail à vos contacts ou comme courrier légitime.</p>
        </div>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Information concernant le remboursement de votre solde`,
            HTMLPart: htmlContent
        }]
    });
}

export async function sendCompletedFormalityNotification(demandeid : string, firstname: string, name : string, ref_inpi: string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">

            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 40px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">

            <p style="margin-bottom: 10px; font-size: 0.9rem; color:#6b7280;">Références utiles pour votre dossier :</p>
            <ul style="margin-top: 0; margin-bottom: 30px;">
                <li>n° MAF : <strong>${demandeid}</strong></li>
                <li>réf. INPI : <strong>${ref_inpi}</strong></li>
            </ul>

            <h2 style="margin-bottom: 25px; font-size: 1.3rem;">Bonjour ${firstname} ${name},</h2>

            <p style="margin-bottom: 20px;">J’ai le plaisir de vous informer que votre formalité a été <strong>validée avec succès</strong> auprès de l’administration.</p>
            <p style="margin-bottom: 20px;">Votre dossier est désormais finalisé. Vous recevrez dans un prochain message la <strong>synthèse définitive de votre formalité</strong> ainsi que les éléments récapitulatifs relatifs à votre démarche.</p>
            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
                <p>Pour rappel :</p>
                <p style="margin-top: 10px; font-weight: bold; color: #1d4ed8;">
                    Tout solde restant sur votre avance, un remboursement sera effectué sur votre moyen de paiement dans les prochains jours s’il n’a pas déjà été traité.
                    Selon les délais de traitement de votre établissement bancaire, ce remboursement peut apparaître sur votre compte dans les prochains jours.
                </p>
            </div>
            <p style="margin-bottom: 20px;">Nous vous conseillons de conserver ce message ainsi que les références ci-dessus, qui pourront vous être utiles pour toute correspondance ou suivi ultérieur concernant votre formalité.</p>
            <p style="margin-bottom: 30px;">Si vous avez la moindre question concernant votre dossier ou si vous avez besoin d'une information complémentaire, n’hésitez pas à nous <a href="https://www.mon-assistant-formalites.fr/contact" style="color:#1d4ed8; text-decoration:underline;">contacter</a>.</p>
                    
            <p>Merci pour votre confiance.</p>
                    
            <p style="margin-top: 25px; font-weight: bold;">Mon Assistant Formalités</p>
            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse email à vos contacts ou comme courrier légitime.</p>
        </div>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Votre formalité MAF n°${demandeid} a été validée`,
            HTMLPart: htmlContent
        }]
    });
}

export async function sendRejectedFormalityNotification(demandeid : string, firstname: string, name : string, ref_inpi: string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 40px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">
            <p style="margin-bottom: 10px; font-size: 0.9rem; color:#6b7280;">Références utiles pour votre dossier :</p>
            <ul style="margin-top: 0; margin-bottom: 30px;">
                <li>n° MAF : <strong>${demandeid}</strong></li>
                <li>réf. INPI : <strong>${ref_inpi}</strong></li>
            </ul>
                    
            <h2 style="margin-bottom: 25px; font-size: 1.3rem;">Bonjour ${firstname} ${name},</h2>
            <p style="margin-bottom: 20px;">Après analyse de votre dossier, nous vous informons que votre formalité n’a malheureusement pas pu être <strong>validée auprès de l’administration</strong>.</p>
            <p style="margin-bottom: 20px;">Cette décision peut intervenir pour différentes raisons (informations incomplètes, incohérences dans les données transmises ou éléments nécessitant une correction préalable).</p>
            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
                <p>Pour rappel :</p>
                <p style="margin-top: 10px; font-weight: bold; color: #1d4ed8;">
                    Tout solde restant sur votre avance, un remboursement sera effectué sur votre moyen de paiement dans les prochains jours s’il n’a pas déjà été traité.
                    Selon les délais de traitement de votre établissement bancaire, ce remboursement peut apparaître sur votre compte dans les prochains jours.
                </p>
            </div>
            <p style="margin-bottom: 30px;">Si vous souhaitez obtenir plus d’informations concernant ce refus ou être accompagné pour effectuer une nouvelle démarche, n’hésitez pas à nous <a href="https://www.mon-assistant-formalites.fr/contact" style="color:#1d4ed8; text-decoration:underline;">contacter</a>.</p>
                    
            <p>Nous restons à votre disposition pour toute question.</p>
            <p style="margin-top: 25px; font-weight: bold;">Mon Assistant Formalités</p>
                    
            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse email à vos contacts ou comme courrier légitime.</p>
        </div>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Votre formalité MAF n°${demandeid} a été rejetée`,
            HTMLPart: htmlContent
        }]
    });
}

export async function sendCanceledFormalityNotification(demandeid : string, firstname: string, name : string, ref_inpi: string, email : string) {
    
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2c3e50; line-height: 1.6; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            <img style="max-width: 100%; height: auto; display: block; margin: 10px auto 40px auto;" src="https://www.mon-assistant-formalites.fr/images/logo.png" alt="Mon Assistant Formalités">

            <p style="margin-bottom: 10px; font-size: 0.9rem; color:#6b7280;">Références utiles pour votre dossier :</p>

            <ul style="margin-top: 0; margin-bottom: 30px;">
                <li>n° MAF : <strong>${demandeid}</strong></li>
                <li>réf. INPI : <strong>${ref_inpi}</strong></li>
            </ul>

            <h2 style="margin-bottom: 25px; font-size: 1.3rem;">Bonjour ${firstname} ${name},</h2>

            <p style="margin-bottom: 20px;">Nous vous informons que votre demande de formalité n° <strong>${demandeid}</strong> a été <strong>annulée</strong>.</p>
            <p style="margin-bottom: 20px;">Après analyse de votre dossier, il n’a malheureusement pas été possible de poursuivre le traitement de cette formalité dans les conditions actuelles.</p>
            <!-- Section mise en valeur -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; line-height: 1.5;">
                <p>Pour rappel :</p>
                <p style="margin-top: 10px; font-weight: bold; color: #1d4ed8;">
                    Tout solde restant sur votre avance, un remboursement sera effectué sur votre moyen de paiement dans les prochains jours s’il n’a pas déjà été traité.
                    Selon les délais de traitement de votre établissement bancaire, ce remboursement peut apparaître sur votre compte dans les prochains jours.
                </p>
            </div>
            <p style="margin-bottom: 30px;">Si vous souhaitez effectuer une nouvelle demande ou obtenir des précisions concernant cette annulation, vous pouvez nous <a href="https://www.mon-assistant-formalites.fr/contact" style="color:#1d4ed8; text-decoration:underline;">contacter</a>.</p>
            
            <p>Nous restons à votre disposition pour toute question.</p>
            <p style="margin-top: 25px; font-weight: bold;">Mon Assistant Formalités</p>
            
            <hr style="margin-top: 20px; border-color: #e5e7eb;"/>
            <p style="font-size: 0.75em; color: #6b7280; margin-top: 20px; line-height: 1.4;">Pour ne manquer aucune information de notre part, nous vous recommandons d’ajouter notre adresse email à vos contacts ou comme courrier légitime.</p>
        </div>
    </div>
    `;

    await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [{
            From: { Email: 'contact@mon-assistant-formalites.fr', Name: 'Mon Assistant Formalités' },
            To: [{ Email: email, Name: `${firstname} ${name}` }],
            Subject: `Votre formalité MAF n°${demandeid} a été annulée`,
            HTMLPart: htmlContent
        }]
    });
}