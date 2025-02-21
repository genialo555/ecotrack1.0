import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const ROUTES = {
  auth: '/login',
  admin: '/admin',
  user: '/dashboard',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Ignorer les assets et l'API
  if (pathname.includes('_next') || pathname.includes('api/')) {
    return NextResponse.next();
  }

  // Si on est sur le login
  if (pathname === ROUTES.auth) {
    // Si on a un token valide
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const defaultRedirect = decoded.role === 'ADMIN' ? ROUTES.admin : ROUTES.user;
        return NextResponse.redirect(new URL(defaultRedirect, request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Routes protégées
  if (pathname.startsWith(ROUTES.admin) || pathname.startsWith(ROUTES.user)) {
    if (!token) {
      return NextResponse.redirect(new URL(ROUTES.auth, request.url));
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Vérifier l'expiration
      if (decoded.exp < Date.now() / 1000) {
        const response = NextResponse.redirect(new URL(ROUTES.auth, request.url));
        response.cookies.delete('token');
        return response;
      }

      // Route admin protégée
      if (pathname.startsWith(ROUTES.admin) && decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL(ROUTES.user, request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL(ROUTES.auth, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/admin/:path*'
  ]
};