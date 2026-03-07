import type { APIRoute } from 'astro';
import { supabase } from '@utils/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return new Response(JSON.stringify({
        success: false,
        message: error?.message || 'Email ou mot de passe incorrect'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // stocker le token dans le cookie
    cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
    });

    return new Response(JSON.stringify({
      success: true,
      redirect: '/admin/maf/dashboard'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur serveur'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
};