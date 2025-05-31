import { NextResponse } from 'next/server'

export function middleware() {
  // For now, we'll let the client-side auth handle redirects
  // The useAuth hook and useEffect in each component will handle the actual protection
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 