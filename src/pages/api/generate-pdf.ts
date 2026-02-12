export const prerender = false;

import type { APIRoute } from 'astro';
import puppeteer from 'puppeteer';

export const POST: APIRoute = async ({ request }) => {

  const { html } = await request.json();

 const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // On injecte ton HTML client dans un vrai document complet
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          padding: 40px;
          font-family: Arial, sans-serif;
          background: white;
        }
      </style>
    </head>
    <body>
      <h1 style="text-align:center;margin-bottom:30px;">
        RÉCAPITULATIF DE CRÉATION
      </h1>

      ${html}
    </body>
    </html>
  `, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });

  await browser.close();

  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="recapitulatif.pdf"'
    }
  });
};
