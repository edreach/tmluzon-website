import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase/auth';
import { initializeFirebase } from './firebase';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
