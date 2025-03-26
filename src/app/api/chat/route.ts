import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma/client'
import { verifyToken } from '@/lib/auth/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
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
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get chat completion from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI training partner helping users improve their skills. Provide constructive feedback and guidance.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'gpt-4',
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Store the training interaction in the database
    await prisma.training.create({
      data: {
        userId,
        title: 'Training Session',
        description: message,
        duration: 0, // You can calculate actual duration if needed
        feedback: aiResponse,
      },
    })

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 