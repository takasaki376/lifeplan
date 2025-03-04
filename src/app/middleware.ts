// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '../utils/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decodedToken = await verifyIdToken(token);

  if (!decodedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
