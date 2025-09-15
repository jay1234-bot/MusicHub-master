import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle errors
  if (request.nextUrl.pathname.startsWith('/_error')) {
    // Handle different error types
    if (request.nextUrl.pathname.includes('404')) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
    if (request.nextUrl.pathname.includes('500')) {
      return NextResponse.rewrite(new URL('/error', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.svg).*)',
  ],
};