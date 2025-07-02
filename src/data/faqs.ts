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
                question: "Qu’est-ce qu’un mandataire en formalités administratives ?",
                answer: "C’est un professionnel habilité à réaliser pour vous les démarches liées à la création, la modification ou la radiation d’une entreprise. Il agit en votre nom grâce à un mandat écrit."
            },
            {
                question: "À qui s’adressent vos services ?",
                answer: "Mes services s’adressent principalement aux entrepreneurs individuels, micro-entrepreneurs, freelances et professions libérales qui souhaitent déléguer leurs démarches administratives."
            },
            {
                question: "Est-ce que tout peut se faire à distance ?",
                answer: "Oui, toutes les formalités sont gérables en ligne. Vous n’avez pas besoin de vous déplacer : un simple échange par email ou téléphone suffit."
            },
            {
                question: "Quels documents dois-je fournir ?",
                answer: "Cela dépend de la formalité concernée. Lors de notre premier contact, je vous indique précisément les documents nécessaires pour constituer votre dossier."
            },
            {
                question: "Combien de temps prennent les démarches ?",
                answer: "Le délai varie selon la formalité et l’administration concernée. Je vous informe toujours des délais estimés dès le départ et vous tiens informé tout au long du processus."
            },
            {
                question: "Vos prestations sont-elles éligibles aux frais professionnels ?",
                answer: "Oui, mes prestations sont facturées avec justificatif, et peuvent être comptabilisées comme frais professionnels pour votre activité."
            }
        ]
    }
};
