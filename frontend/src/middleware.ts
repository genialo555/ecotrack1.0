import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/features',
  '/about',
  '/contact',
  '/demo',
  '/blog',
  '/videos',
  '/api/auth/session'
];

// Check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => path.startsWith(publicPath));
};

// Check if the request is for a video file
const isVideoRequest = (pathname: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  return videoExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
};

// Check if the path is a dashboard route
const isDashboardRoute = (path: string) => {
  return path.startsWith('/dashboard');
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Handle video requests
  const fromPath = searchParams.get('from');
  if (fromPath && (fromPath.startsWith('/videos/') || isVideoRequest(fromPath))) {
    return NextResponse.redirect(new URL(fromPath, request.url));
  }

  // Allow public paths and video requests
  if (isPublicPath(pathname) || isVideoRequest(pathname)) {
    return NextResponse.next();
  }

  try {
    // Validate authentication
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log('Validating auth at:', `${baseUrl}/api/auth/validate`);
    
    const response = await fetch(`${baseUrl}/api/auth/validate`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    // Handle unauthenticated users
    if (!response.ok) {
      console.error('Auth validation failed:', {
        status: response.status,
        statusText: response.statusText
      });
      const loginUrl = new URL('/login', request.url);
      // Only set 'from' parameter for non-public paths
      if (!isPublicPath(pathname)) {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    const userData = await response.json();
    console.log('Auth validation response:', userData);

    // Validate user role
    if (!userData.role) {
      console.error('No role found in user data');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const userRole = userData.role.toLowerCase();
    console.log('User role:', { role: userData.role, normalizedRole: userRole });

    // Handle dashboard routes
    if (isDashboardRoute(pathname)) {
      // Root dashboard redirect
      if (pathname === '/dashboard') {
        const targetPath = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/user';
        console.log('Dashboard redirect:', { userRole, targetPath });
        return NextResponse.redirect(new URL(targetPath, request.url));
      }

      // Strict role-based access control
      if (userRole === 'admin') {
        if (pathname.startsWith('/dashboard/user')) {
          console.log('Admin accessing user dashboard - redirecting to admin dashboard');
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        }
      } else {
        if (pathname.startsWith('/dashboard/admin')) {
          console.log('Non-admin accessing admin dashboard - redirecting to user dashboard');
          return NextResponse.redirect(new URL('/dashboard/user', request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const loginUrl = new URL('/login', request.url);
    if (!isPublicPath(pathname)) {
      loginUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }
}

// Configure paths that should trigger the middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|videos|api).*)',
  ],
};