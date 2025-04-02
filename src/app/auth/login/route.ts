import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Server-side redirect to the correct login page
  return NextResponse.redirect(new URL('/login', request.url));
} 