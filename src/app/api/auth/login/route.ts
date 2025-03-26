import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

// Get origin based on request
const getOrigin = (request: Request) => {
  const host = request.headers.get('host') || ''
  return `http://${host}`
}

// Use a consistent JWT secret
const JWT_SECRET = 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const origin = getOrigin(request)

    console.log('Login attempt:', { email, origin })

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    console.log('Creating session for user:', { userId: user.id, token: token.substring(0, 10) + '...' })

    // Create response with cookie
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )

    // Set cookie with proper options
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    })

    console.log('Setting cookie:', {
      name: 'token',
      value: token.substring(0, 10) + '...',
      cookies: response.cookies.getAll()
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  const origin = getOrigin(request)
  
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  )
} 