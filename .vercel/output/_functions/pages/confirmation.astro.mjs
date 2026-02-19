import { b as createAstro, c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_U83PXhRR.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Button } from '../chunks/Layout_dI54FK7s.mjs';
import { c as consumeToken } from '../chunks/tokenStore_BjIPfJGE.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("http://localhost:4321");
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const token = Astro2.url.searchParams.get("token");
  if (!token)
    return Astro2.redirect("/");
  const pdf = consumeToken(token);
  if (!pdf)
    return Astro2.redirect("/");
  const seoTitle = "Demande envoy\xE9e | Mon Assistant Formalit\xE9s";
  const seoDescription = "Votre demande a bien \xE9t\xE9 transmise. Nous revenons vers vous rapidement par email.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": seoTitle, "description": seoDescription }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full min-h-[80vh] flex items-center bg-gray-50"> <div class="site-container mx-auto px-4 py-base text-center"> <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md"> <h1 class="mb-6 text-3xl md:text-4xl font-bold text-primary" data-aos="fade-up">
Merci pour votre confiance
</h1> <p class="text-base mb-4" data-aos="fade-up" data-aos-delay="100">
Votre demande a bien été transmise.
</p> <p class="text-base mb-16" data-aos="fade-up" data-aos-delay="200">
Un email de confirmation contenant votre récapitulatif PDF vous a été envoyé.
</p> <p class="text-base mb-4 italic font-light" data-aos="fade-up" data-aos-delay="200">
Vous pouvez également le télécharger directement ci-dessous.
</p> <div data-aos="fade-up" data-aos-delay="300" class="mb-16"> ${renderComponent($$result2, "Button", $$Button, { "id": "downloadPdf", "variant": "primary", "size": "lg", "aria-label": "T\xE9l\xE9chargez le r\xE9capitulatif PDF" }, { "default": ($$result3) => renderTemplate` Téléchargez le récapitulatif PDF ` })} </div> <p class="text-small text-gray-500" data-aos="fade-up" data-aos-delay="250">
Si vous ne recevez pas l’email dans les prochaines minutes, pensez à vérifier votre dossier spam.
</p> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/denis/Desktop/Dev/astro/maf/src/pages/confirmation/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/denis/Desktop/Dev/astro/maf/src/pages/confirmation/index.astro", void 0);

const $$file = "C:/Users/denis/Desktop/Dev/astro/maf/src/pages/confirmation/index.astro";
const $$url = "/confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
