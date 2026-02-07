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
    withContent: {
        id: 'withContent',
        stats: [
            { value: 2026, label: "lancement du service" },
            { value: 100, label: "démarches traitées en ligne", suffix: " %" },
            { value: 59, label: "tarif unique par formalité*", suffix: " €" },
            { value: 48, label: "délai de réponse maximum", prefix: "< ", suffix: " h" }
        ]
    }
};
