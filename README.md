# Mon Assistant Formalités - Site propulsé par Titan Core  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Mon Assistant Formalités** est un site vitrine moderne dédié à l’accompagnement administratif des entrepreneurs individuels.  
Il repose sur le thème **Titan Core**, un thème Astro optimisé, réactif, et facilement personnalisable.

👉 [Voir le site en ligne](https://mon-assistant-formalites.fr)

---

## ✨ Fonctionnalités

- 📱 **Design responsive** — Adapté mobile, tablette et bureau
- 🎯 **Performance et SEO** — Chargement rapide, balises enrichies, sitemap inclus
- 📦 **Composants personnalisés** — Fiches services, FAQ, CTA, témoignages, etc.
- 🗂️ **Contenus dynamiques** — Gestion via collections Astro (`src/content/service`)
- 💼 **Thématique professionnelle** — Design sobre et efficace pour une activité de mandataire
- 🎨 **Thème personnalisé** — Couleurs et styles adaptés à l’identité de marque
- 🔍 **SEO ready** — Open Graph, Twitter Card, favicon, structure balisée
- ⚡ **Animations AOS** — Apparitions fluides au scroll

---

## 🚀 Lancer le projet

```bash
# Cloner ce projet personnalisé
git clone https://github.com/dens26/mon-assistant-formalites.git
cd mon-assistant-formalites
npm install
npm run dev

```

## 📁 Project Structure

```
/
├── public/             # Fichiers statiques accessibles publiquement
│   └── favicon.ico
├── src/
│   ├── assets/         # Images et autres ressources
│   ├── components/     # Composants UI
│   │   ├── blog/       # Composants spécifiques au blog
│   │   ├── forms/      # Composants de formulaires
│   │   ├── icons/      # Composants d’icônes
│   │   ├── sections/   # Sections de pages
│   │   ├── team/       # Composants liés à l’équipe
│   │   ├── service/    # Composants liés aux services
│   │   └── ui/         # Composants UI de base
│   ├── content/        # Contenus dynamiques (Markdown, collections)
│   ├── data/           # Fichiers de configuration et données statiques
│   ├── layouts/        # Gabarits de pages (layouts)
│   ├── pages/          # Routes du site (pages)
│   ├── styles/         # Styles globaux (CSS)
│   └── utils/          # Fonctions utilitaires
└── package.json        # Dépendances et scripts du projet
```

## 📝 Content Management

MAF utilise les collections de contenu d’Astro pour les articles de blog et autres types de contenu. Ajoutez vos fichiers dans le répertoire src/content/.

## 🧩 Components

Titan Core includes a wide range of components:

- **Layout Components**: Hsections "Hero", fonctionnalités, panneau divisé, bannière d’appel à l’action (CTA), etc.
- **UI Components**: boutons, formulaires, cartes, etc.
- **Blog Components**: Post cards, category pills, etc.
- **Team Components**: grille des membres, cartes individuelles, etc.
- **Service Components**: grille des membres, cartes individuelles, etc.

## 🛠️ Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Install dependencies                            |
| `npm run dev`          | Start local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |

## 📄 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🙏 Credits

- Built with [Astro](https://astro.build)
- Animations by [AOS](https://michalsnik.github.io/aos/)
- Icons from [Lucide](https://lucide.dev)
