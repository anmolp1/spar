import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add console.log for debugging
const log = (message: string, ...args: any[]) => {
  console.log(`[Middleware] ${message}`, ...args)
}

// Simple token verification that works in Edge Runtime
function verifyToken(token: string): string | null {
  try {
    // Basic JWT structure check
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      log('Token expired')
      return null
    }

    return payload.userId
  } catch (error) {
    log('Token verification error:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  log('Request path:', pathname)
  log('Token present:', !!token)

  // Check if the request is for an auth page
  const isAuthPage = pathname.startsWith('/auth')
  const isDashboardPage = pathname.startsWith('/dashboard')

  // If there's no token and trying to access protected routes
  if (!token && isDashboardPage) {
    log('No token, redirecting to login')
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('token')
    return response
  }

  // If there's a token, verify it
  if (token) {
    try {
      const userId = verifyToken(token)
      if (!userId) {
        log('Invalid token, redirecting to login')
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        response.cookies.delete('token')
        return response
      }
      log('Valid token, user ID:', userId)

      // If token is valid and trying to access auth pages, redirect to dashboard
      if (isAuthPage) {
        log('Valid token, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // If token is valid and accessing dashboard, allow access
      if (isDashboardPage) {
        log('Valid token, proceeding to dashboard')
        return NextResponse.next()
      }
    } catch (error) {
      log('Token verification failed:', error)
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
} 