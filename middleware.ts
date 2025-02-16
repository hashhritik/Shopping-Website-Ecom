import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; 
  const token = req.cookies.get('authToken'); 

  const restrictedPages = ['/log-in', '/sign-up'];

  if (token && restrictedPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/log-in', '/sign-up'], 
};
