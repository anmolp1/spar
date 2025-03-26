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

    // Get user's training history
    const trainings = await prisma.training.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ trainings })
  } catch (error) {
    console.error('Trainings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 