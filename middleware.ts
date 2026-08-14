import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route (but not the login page)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin/login') {
    
    // Check for the admin cookie
    const adminCookie = request.cookies.get('jez-admin');
    
    if (!adminCookie || adminCookie.value !== 'authenticated') {
      // Redirect to login if cookie is missing or invalid
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
