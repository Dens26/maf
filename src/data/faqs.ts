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
                question: "Pourquoi passer par un mandataire INPI ?",
                answer: "Cela vous permet d’éviter les erreurs, les refus de dossier et les pertes de temps. Vous bénéficiez d’un accompagnement complet et sécurisé."
            },
            {
                question: "Comment créer une entreprise individuelle rapidement ?",
                answer: "Je m’occupe de votre création d’entreprise de A à Z : préparation, dépôt et suivi jusqu’à l’obtention de votre SIRET."
            },
            {
                question: "Combien coûte une formalité ?",
                answer: "Les tarifs commencent à partir de 39€ pour une correction ou cessation, 49€ pour une création et 59€ pour une modification. Des frais administratifs peuvent s’ajouter selon la formalité."
            },
            {
                question: "Quel est le délai de traitement ?",
                answer: "Votre dossier est préparé et déposé sous 48h après réception des documents. Ensuite, les délais dépendent des organismes."
            },
            {
                question: "Tout peut-il se faire à distance ?",
                answer: "Oui, toutes les démarches sont réalisées en ligne. Vous êtes accompagné à chaque étape sans avoir à vous déplacer."
            },
            {
                question: "Puis-je vous contacter avant de démarrer ?",
                answer: "Oui, vous pouvez me contacter gratuitement pour poser vos questions et être guidé vers la bonne démarche."
            }
        ]
    }
};
