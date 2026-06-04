import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_drishti_key_123");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Exclude static assets, login page, and auth API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/drishti_logo.png' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('admin_session')?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify the JWT token
    await jwtVerify(sessionCookie, SECRET)
    return NextResponse.next()
  } catch (err) {
    // Invalid or expired token
    console.error("Invalid session:", err)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
