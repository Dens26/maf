export interface Stat {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
}

export interface StatsList {
    id: string;
    stats: Stat[];
    content?: {
        title: string;
        description: string;
        button?: {
            text: string;
            link: string;
            variant?: 'primary' | 'secondary' | 'ghostLight' | 'ghostDark';
        };
    };
}

export const statsLists: Record<string, StatsList> = {
    main: {
        id: 'main',
        stats: [
            { value: 10, label: 'Theme Configurations' },
            { value: 11, label: 'Pre-Built Components' },
            { value: 48, label: 'Team Members' },
            { value: 500000, label: 'Lines of Code', prefix: '+' }
        ]
    },
    create: {
        id: 'create',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 24, label: 'Heures en moyenne pour traitement', suffix: 'h' },
            { value: 0, label: 'Erreur évitée grâce à la vérification', suffix: '%' },
            { value: 100, label: 'Formalités réalisées en ligne', suffix: '%' }
        ]
    },
    close: {
        id: 'close',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 24, label: 'Traitement moyen des dossiers', suffix: 'h' },
            { value: 0, label: 'Erreur dans les dossiers préparés', suffix: '%' },
            { value: 100, label: 'Formalités réalisées en ligne', suffix: '%' }
        ]
    },
    move: {
        id: 'move',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 24, label: 'Traitement moyen des dossiers', suffix: 'h' },
            { value: 0, label: 'Erreur dans les dossiers préparés', suffix: '%' },
            { value: 100, label: 'Formalités réalisées en ligne', suffix: '%' }
        ]
    },
    correction: {
        id: 'correction',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 24, label: 'Traitement moyen des dossiers', suffix: 'h' },
            { value: 0, label: 'Erreur dans les dossiers préparés', suffix: '%' },
            { value: 100, label: 'Formalités réalisées en ligne', suffix: '%' }
        ]
    },
    activity: {
        id: 'activity',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 24, label: 'Traitement moyen des dossiers', suffix: 'h' },
            { value: 0, label: 'Erreur dans les dossiers préparés', suffix: '%' },
            { value: 100, label: 'Formalités réalisées en ligne', suffix: '%' }
        ]
    },
    withContent: {
        id: 'withContent',
        stats: [
            { value: 0, label: 'Stress administratif' },
            { value: 100, label: 'Clarté et suivi', suffix: '%' },
            { value: 0, label: 'Erreurs dans les dossiers' },
            { value: 100, label: 'Accompagnement personnalisé', suffix: '%' }
        ],
    }
};
