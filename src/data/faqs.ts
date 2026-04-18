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
    },
    create: {
        id: 'create',
        faqs: [
            {
                question: "Quelles sont les démarches pour créer une entreprise individuelle ?",
                answer: "Je m’occupe de la préparation et du dépôt de votre dossier auprès de l’INPI. Vous me transmettez les informations nécessaires, et je gère le reste."
            },
            {
                question: "Combien de temps prend la création ?",
                answer: "Une fois le dossier complet, la création peut être traitée rapidement par l’INPI. Le délai dépend ensuite de leur validation."
            },
            {
                question: "Est-ce que je dois me déplacer ?",
                answer: "Non, tout se fait en ligne. Vous n’avez aucun déplacement à prévoir."
            },
            {
                question: "Que se passe-t-il en cas d’erreur dans le dossier ?",
                answer: "Je vérifie votre dossier avant dépôt afin de limiter au maximum les risques de rejet ou de demande de correction."
            },
            {
                question: "Est-ce que vous êtes un mandataire INPI ?",
                answer: "Oui, je vous accompagne dans vos formalités de création en assurant la conformité du dossier transmis à l’INPI."
            }
        ]
    },
    close: {
        id: 'close',
        faqs: [
            {
                question: "Quelles sont les démarches pour fermer une entreprise individuelle ?",
                answer: "Je m’occupe de la préparation et du dépôt de votre dossier de cessation auprès de l’INPI. Vous me transmettez les informations nécessaires, et je gère l’ensemble des formalités."
            },
            {
                question: "Combien de temps prend la cessation d’activité ?",
                answer: "Une fois le dossier complet, la cessation peut être traitée rapidement par l’INPI. Le délai dépend ensuite de la validation du guichet unique."
            },
            {
                question: "Est-ce que je dois me déplacer pour fermer mon entreprise ?",
                answer: "Non, tout se fait en ligne. Vous n’avez aucun déplacement à prévoir pour la fermeture de votre activité."
            },
            {
                question: "Que se passe-t-il en cas d’erreur dans le dossier de cessation ?",
                answer: "Je vérifie votre dossier avant dépôt afin de limiter les risques d’erreurs, de rejet ou de complications administratives après la fermeture."
            },
            {
                question: "Est-ce que ma cessation est bien prise en compte par l’INPI ?",
                answer: "Oui, je réalise la déclaration via le guichet unique et assure le suivi jusqu’à validation officielle de la cessation."
            }
        ]
    },
    move: {
        id: 'move',
        faqs: [
            {
                question: "Quelles sont les démarches pour changer l’adresse d’une entreprise individuelle ?",
                answer: "Je m’occupe de la préparation et du dépôt de votre dossier de changement d’adresse auprès de l’INPI. Vous me transmettez les informations nécessaires, et je gère l’ensemble de la modification administrative."
            },
            {
                question: "Combien de temps prend un changement d’adresse ?",
                answer: "Une fois le dossier complet, la modification peut être traitée rapidement par l’INPI. Le délai dépend ensuite de la validation du guichet unique."
            },
            {
                question: "Est-ce que je dois me déplacer pour modifier mon adresse ?",
                answer: "Non, tout se fait en ligne. Vous n’avez aucun déplacement à prévoir pour mettre à jour l’adresse de votre entreprise."
            },
            {
                question: "Que se passe-t-il en cas d’erreur dans le dossier de modification ?",
                answer: "Je vérifie votre dossier avant dépôt afin de limiter les risques d’erreurs, de rejet ou de blocage de la mise à jour administrative."
            },
            {
                question: "Mon entreprise continue-t-elle à fonctionner pendant le changement d’adresse ?",
                answer: "Oui, votre activité continue normalement. Le changement d’adresse est une simple mise à jour administrative sans interruption de votre entreprise."
            }
        ]
    },
    correction: {
        id: 'correction',
        faqs: [
            {
                question: "Qu’est-ce qu’une correction du RNE ?",
                answer: "Il s’agit de rectifier une erreur ou une information inexacte enregistrée sur le Registre National des Entreprises afin de rendre votre dossier conforme."
            },
            {
                question: "Pourquoi corriger une information sur le RNE ?",
                answer: "Une erreur sur le RNE peut entraîner des incohérences administratives ou des blocages dans certaines démarches. La correction permet de sécuriser votre situation."
            },
            {
                question: "Combien de temps prend une correction du RNE ?",
                answer: "Une fois le dossier complet, la correction est transmise à l’INPI via le guichet unique. Le délai dépend ensuite de leur traitement et validation."
            },
            {
                question: "Dois-je me déplacer pour corriger une erreur sur le RNE ?",
                answer: "Non, tout se fait en ligne. Vous me transmettez les informations nécessaires et je m’occupe de la correction auprès de l’INPI."
            },
            {
                question: "Que se passe-t-il si mon dossier est refusé ?",
                answer: "Je vérifie votre dossier en amont pour limiter au maximum les risques de rejet et je vous accompagne en cas de demande de complément ou de correction."
            }
        ]
    },
    activity: {
        id: 'activity',
        faqs: [
            {
                question: "Comment modifier l’activité de mon entreprise individuelle ?",
                answer: "La modification d’activité se fait via une déclaration sur le guichet unique de l’INPI. Je vous accompagne dans la préparation et le dépôt de votre dossier pour garantir sa conformité."
            },
            {
                question: "Puis-je ajouter une nouvelle activité à mon entreprise ?",
                answer: "Oui, vous pouvez ajouter une activité secondaire ou modifier votre activité principale. La démarche doit être déclarée pour être prise en compte officiellement."
            },
            {
                question: "La modification d’activité est-elle obligatoire ?",
                answer: "Oui, toute modification de votre activité doit être déclarée afin de maintenir votre situation administrative à jour et éviter toute incohérence."
            },
            {
                question: "Combien de temps prend une modification d’activité ?",
                answer: "Une fois votre dossier complet, la déclaration est transmise à l’INPI. Le délai dépend ensuite de leur traitement et de la validation de votre demande."
            },
            {
                question: "Dois-je me déplacer pour modifier mon activité ?",
                answer: "Non, tout se fait en ligne. Vous me transmettez les informations nécessaires et je m’occupe de la déclaration auprès de l’INPI."
            },
            {
                question: "Que se passe-t-il en cas d’erreur dans la déclaration ?",
                answer: "Je vérifie votre dossier avant dépôt pour limiter les risques de rejet et je vous accompagne en cas de demande de correction ou de complément."
            }
        ]
    },
};
