import { Zap, Shield, Heart, Coffee, Smile, Type, TabletSmartphone, CodeXml } from 'lucide-astro';

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
                icon: Smile,
                title: 'Accompagnement humain',
                description: 'Un interlocuteur unique pour vous guider.'
            },
            {
                icon: TabletSmartphone,
                title: '100% en ligne',
                description: 'Aucune paperasse, tout se fait à distance.'
            },
            {
                icon: Type,
                title: 'Tarifs clairs',
                description: 'Pas de surprise, vous savez ce que vous payez.'
            },
            {
                icon: CodeXml,
                title: 'Spécialiste indépendants',
                description: 'EI, micro-entrepreneurs, freelances.'
            }
        ]
    },
    secondary: {
        id: 'secondary',
        features: [
            {
                icon: Heart,
                title: 'Accompagnement humain',
                description: 'Je reste disponible et à l’écoute tout au long du processus.'
            },
            {
                icon: Coffee,
                title: 'Dossiers toujours à jour',
                description: 'Veille juridique permanente pour garantir des formalités conformes.'
            },
            {
                icon: Smile,
                title: 'Simplicité d’accès',
                description: 'Un simple message ou appel pour lancer vos démarches.'
            }
        ]
    }
};
