export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqList {
    id: string;
    faqs: FaqItem[];
}

export const faqLists: Record<string, FaqList> = {
    main: {
        id: 'main',
        faqs: [
            {
                question: "Qu’est-ce qu’un mandataire INPI pour formalités d’entreprise ?",
                answer: "Un mandataire en formalités administratives est un professionnel habilité à réaliser pour vous les démarches auprès du Guichet Unique de l’INPI : création d’entreprise individuelle, modification, correction ou cessation. Il agit en votre nom grâce à un mandat."
            },
            {
                question: "Pourquoi faire appel à un mandataire pour créer son entreprise ?",
                answer: "Faire appel à un mandataire INPI permet de sécuriser votre création d’entreprise individuelle, d’éviter les erreurs administratives et de gagner du temps. Vous bénéficiez d’un accompagnement complet jusqu’à l’obtention de votre SIRET."
            },
            {
                question: "À qui s’adressent vos services de formalités administratives ?",
                answer: "Mes services s’adressent aux entrepreneurs individuels, auto-entrepreneurs (micro-entrepreneurs), freelances et professions libérales souhaitant déléguer leurs formalités administratives."
            },
            {
                question: "Peut-on créer ou modifier une entreprise individuelle en ligne ?",
                answer: "Oui, toutes les formalités peuvent être réalisées en ligne via le Guichet Unique. Mon Assistant Formalités vous accompagne à distance pour simplifier chaque étape sans déplacement."
            },
            {
                question: "Quels documents sont nécessaires pour une formalité INPI ?",
                answer: "Les documents varient selon la formalité (création, modification, cessation). En général, une pièce d’identité, un justificatif d’adresse et parfois une procuration sont demandés. Une liste précise vous est fournie après votre demande."
            },
            {
                question: "Quel est le délai pour une création ou modification d’entreprise ?",
                answer: "Votre dossier est traité sous 48h après réception complète. Ensuite, les délais dépendent des organismes (INSEE, Greffe, etc.). Un suivi complet est assuré jusqu’à validation."
            },
            {
                question: "Combien coûte une formalité d’entreprise individuelle ?",
                answer: "Les tarifs commencent à partir de 39€, 59€ ou 69€ selon la formalité (création, modification, correction). Des frais administratifs peuvent être demandés par les organismes publics et restent à la charge du client."
            },
            {
                question: "Les prestations de formalités sont-elles déductibles ?",
                answer: "Oui, les prestations sont facturées et peuvent être comptabilisées comme frais professionnels pour votre activité."
            },
            {
                question: "Proposez-vous un accompagnement pour les formalités en France ?",
                answer: "Oui, Mon Assistant Formalités accompagne les entrepreneurs dans toute la France pour leurs démarches administratives auprès de l’INPI et du Guichet Unique."
            }
        ]
    }
};
