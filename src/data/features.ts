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
                title: 'Formalités simplifiées',
                description: 'Je prends en charge la rédaction, le dépôt et le suivi de vos formalités.'
            },
            {
                icon: Shield,
                title: 'Conformité garantie',
                description: 'Vos démarches sont réalisées selon les dernières exigences réglementaires.'
            },
            {
                icon: TabletSmartphone,
                title: '100% à distance',
                description: 'Toutes les démarches peuvent être traitées en ligne, où que vous soyez.'
            },
            {
                icon: Smile,
                title: 'Gain de temps assuré',
                description: 'Focalisez-vous sur votre activité pendant que je m’occupe du reste.'
            },
            {
                icon: Type,
                title: 'Transparence totale',
                description: 'Vous êtes informé à chaque étape, sans jargon inutile.'
            },
            {
                icon: CodeXml,
                title: 'Adapté aux indépendants',
                description: 'Spécialiste des entreprises individuelles et micro-entrepreneurs.'
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
