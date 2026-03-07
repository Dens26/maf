import type { APIRoute } from 'astro';
import { supabase } from '@utils/supabase';

export const GET: APIRoute = async ({ url }) => {
  const pdfName = url.searchParams.get('name');
  if (!pdfName) return new Response('Nom PDF manquant', { status: 400 });

  const { data, error } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(pdfName, 60);

  if (error) return new Response('Erreur générer URL', { status: 500 });

  return new Response(JSON.stringify({ url: data.signedUrl }), {
    headers: { 'Content-Type': 'application/json' },
  });
};