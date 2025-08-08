import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle 404 errors
  if (request.nextUrl.pathname.startsWith('/_error') || 
      request.nextUrl.pathname === '/404' || 
      request.nextUrl.pathname === '/500') {
    // Redirect to custom error page
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.svg).*)',
  ],
};