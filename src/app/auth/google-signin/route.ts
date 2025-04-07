import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    console.log('Google sign-in callback received with code:', code ? 'present' : 'missing');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Google sign-in error:', error);
      return NextResponse.redirect(new URL(`/login?error=auth_callback_error&message=${error.message}`, requestUrl.origin));
    }

    if (!session) {
      return NextResponse.redirect(new URL('/login?error=no_session', requestUrl.origin));
    }

    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  } catch (error) {
    console.error('Google sign-in route error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin));
  }
} 