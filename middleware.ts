import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  const isTryingToAccessAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');
  const isTryingToAccessAdminLogin = request.nextUrl.pathname === '/admin';

  if (isTryingToAccessAdminDashboard && !session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (isTryingToAccessAdminLogin && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
