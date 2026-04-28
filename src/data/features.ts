import { Zap, Shield, BadgeEuro, Briefcase, TabletSmartphone, CircleCheck, FileText, ShieldCheck, Send, UserCheck } from 'lucide-astro';

// Define the LucideIcon type based on the structure of Lucide icons
type LucideIcon = typeof Zap;

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

export interface FeatureList {
    id: string;
    features: Feature[];
}

// Example feature lists
export const featureLists: Record<string, FeatureList> = {
    main: {
        id: 'main',
    features: [
            {
                icon: Zap,
                title: 'Dossier traité rapidement',
                description: 'Votre formalité est préparée et déposée sous 48h.'
            },
            {
                icon: Shield,
                title: 'Zéro erreur administrative',
                description: 'Chaque dossier est vérifié pour éviter les refus.'
            },
            {
                icon: UserCheck,
                title: 'Accompagnement humain',
                description: 'Un interlocuteur unique pour vous guider.'
            },
            {
                icon: TabletSmartphone,
                title: '100% en ligne',
                description: 'Aucune paperasse, tout se fait à distance.'
            },
            {
                icon: BadgeEuro,
                title: 'Tarifs clairs',
                description: 'Pas de surprise, vous savez ce que vous payez.'
            },
            {
                icon: Briefcase,
                title: 'Spécialiste indépendants',
                description: 'EI, micro-entrepreneurs, freelances.'
            }
        ]
    },
    create: {
        id: 'create',
        features: [
            {
                icon: FileText,
                title: 'Préparation de votre dossier',
                description: 'Je vous aide à réunir et compléter toutes les informations nécessaires pour créer votre entreprise individuelle.'
            },
            {
                icon: ShieldCheck,
                title: 'Vérification et conformité',
                description: 'Votre dossier est vérifié pour éviter les erreurs et limiter les risques de refus ou de blocage.'
            },
            {
                icon: Send,
                title: 'Dépôt auprès de l’INPI',
                description: 'Je m’occupe de la déclaration sur le guichet unique et du suivi de votre dossier jusqu’à validation.'
            },
            {
                icon: UserCheck,
                title: 'Accompagnement personnalisé',
                description: 'Vous avez un interlocuteur unique pour répondre à vos questions et vous guider à chaque étape.'
            }
        ]
    },
    close: {
        id: 'close',
        features: [
            {
                icon: FileText,
                title: 'Préparation du dossier de cessation',
                description: 'Je vous aide à rassembler et compléter toutes les informations nécessaires pour fermer votre entreprise individuelle.'
            },
            {
                icon: ShieldCheck,
                title: 'Vérification et conformité',
                description: 'Votre dossier est contrôlé pour éviter les erreurs pouvant retarder ou bloquer la fermeture.'
            },
            {
                icon: Send,
                title: 'Dépôt auprès de l’INPI',
                description: 'Je réalise la déclaration de cessation sur le guichet unique et assure le suivi jusqu’à validation.'
            },
            {
                icon: CircleCheck,
                title: 'Fermeture sans erreur administrative',
                description: 'Vous êtes accompagné pour éviter les oublis qui pourraient entraîner des complications après la fermeture.'
            }
        ]
    },
    move: {
        id: 'move',
        features: [
            {
                icon: FileText,
                title: 'Préparation du dossier de changement d’adresse',
                description: 'Je vous aide à rassembler et compléter toutes les informations nécessaires pour modifier l’adresse de votre entreprise individuelle.'
            },
            {
                icon: ShieldCheck,
                title: 'Vérification et conformité',
                description: 'Votre dossier est contrôlé pour éviter les erreurs pouvant retarder ou bloquer la mise à jour de votre entreprise.'
            },
            {
                icon: Send,
                title: 'Déclaration auprès de l’INPI',
                description: 'Je réalise la déclaration de changement d’adresse sur le guichet unique et assure le suivi jusqu’à validation.'
            },
            {
                icon: CircleCheck,
                title: 'Mise à jour administrative sans erreur',
                description: 'Votre nouvelle adresse est enregistrée correctement pour garantir la continuité de votre activité sans complication.'
            }
        ]
    },
    correction: {
        id: 'correction',
        features: [
            {
                icon: FileText,
                title: 'Analyse de l’erreur sur le RNE',
                description: 'J’identifie précisément l’erreur ou l’incohérence présente dans les informations de votre entreprise afin de préparer une correction conforme.'
            },
            {
                icon: ShieldCheck,
                title: 'Vérification et mise en conformité',
                description: 'Votre dossier est contrôlé pour garantir qu’il respecte les exigences du registre et éviter tout refus ou blocage administratif.'
            },
            {
                icon: Send,
                title: 'Dépôt de la demande de correction auprès de l’INPI',
                description: 'Je réalise la démarche sur le guichet unique et assure le suivi jusqu’à la prise en compte de la modification.'
            },
            {
                icon: CircleCheck,
                title: 'Données administratives corrigées et sécurisées',
                description: 'Vos informations sont mises à jour correctement pour garantir la cohérence de votre dossier et éviter toute erreur future.'
            }
        ]
    },
    activity: {
        id: 'activity',
        features: [
            {
                icon: FileText,
                title: 'Analyse de votre activité actuelle',
                description: 'J’analyse votre situation pour identifier la modification à effectuer : ajout d’activité, changement d’activité principale ou mise à jour.'
            },
            {
                icon: ShieldCheck,
                title: 'Vérification et conformité du dossier',
                description: 'Votre demande est vérifiée pour garantir qu’elle respecte les exigences du guichet unique et éviter tout refus ou blocage.'
            },
            {
                icon: Send,
                title: 'Déclaration auprès de l’INPI',
                description: 'Je réalise la modification de votre activité sur le guichet unique et assure le suivi de votre dossier jusqu’à validation.'
            },
            {
                icon: CircleCheck,
                title: 'Activité mise à jour et sécurisée',
                description: 'Votre nouvelle activité est correctement enregistrée, vous permettant de poursuivre votre activité en toute conformité.'
            }
        ]
    },
};
