import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Dt7ZIYsC.mjs';
import { manifest } from './manifest_BPkXuG4b.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/api/create.astro.mjs');
const _page4 = () => import('./pages/blog/_page_.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page7 = () => import('./pages/category/_slug_/_page_.astro.mjs');
const _page8 = () => import('./pages/category/_---slug_.astro.mjs');
const _page9 = () => import('./pages/components.astro.mjs');
const _page10 = () => import('./pages/confirmation.astro.mjs');
const _page11 = () => import('./pages/contact.astro.mjs');
const _page12 = () => import('./pages/forms/create/business.astro.mjs');
const _page13 = () => import('./pages/forms/create/entrepreneur.astro.mjs');
const _page14 = () => import('./pages/forms/create/recapitulatif.astro.mjs');
const _page15 = () => import('./pages/legal/_slug_.astro.mjs');
const _page16 = () => import('./pages/legal.astro.mjs');
const _page17 = () => import('./pages/privacy-policy.astro.mjs');
const _page18 = () => import('./pages/process.astro.mjs');
const _page19 = () => import('./pages/services.astro.mjs');
const _page20 = () => import('./pages/services/_---slug_.astro.mjs');
const _page21 = () => import('./pages/style-guide.astro.mjs');
const _page22 = () => import('./pages/team.astro.mjs');
const _page23 = () => import('./pages/team/_---slug_.astro.mjs');
const _page24 = () => import('./pages/theme-info/techspecs.astro.mjs');
const _page25 = () => import('./pages/theme-info.astro.mjs');
const _page26 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/contact.ts", _page2],
    ["src/pages/api/create.ts", _page3],
    ["src/pages/blog/[page].astro", _page4],
    ["src/pages/blog/index.astro", _page5],
    ["src/pages/blog/[...slug].astro", _page6],
    ["src/pages/category/[slug]/[page].astro", _page7],
    ["src/pages/category/[...slug].astro", _page8],
    ["src/pages/components/index.astro", _page9],
    ["src/pages/confirmation/index.astro", _page10],
    ["src/pages/contact/index.astro", _page11],
    ["src/pages/forms/create/business/index.astro", _page12],
    ["src/pages/forms/create/entrepreneur/index.astro", _page13],
    ["src/pages/forms/create/recapitulatif/index.astro", _page14],
    ["src/pages/legal/[slug].astro", _page15],
    ["src/pages/legal/index.astro", _page16],
    ["src/pages/privacy-policy/index.astro", _page17],
    ["src/pages/process/index.astro", _page18],
    ["src/pages/services/index.astro", _page19],
    ["src/pages/services/[...slug].astro", _page20],
    ["src/pages/style-guide.astro", _page21],
    ["src/pages/team/index.astro", _page22],
    ["src/pages/team/[...slug].astro", _page23],
    ["src/pages/theme-info/TechSpecs.astro", _page24],
    ["src/pages/theme-info/index.astro", _page25],
    ["src/pages/index.astro", _page26]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d6143135-7f3f-4b04-b2e1-2c10b46a2577",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
