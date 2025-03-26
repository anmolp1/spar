import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { verifyToken } from '@/lib/auth/auth'

export async function GET(request: Request) {
  try {
    // Get token from cookie
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        settings: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Merge user data with settings
    const settings = {
      name: user.name || '',
      email: user.email || '',
      notifications: user.settings?.notifications ?? true,
      theme: user.settings?.theme || 'light',
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Get token from cookie
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get request body
    const { name, email, notifications, theme } = await request.json()

    // Update user settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        settings: {
          upsert: {
            create: { notifications, theme },
            update: { notifications, theme },
          },
        },
      },
    })

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 