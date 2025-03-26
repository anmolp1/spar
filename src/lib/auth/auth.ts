import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { prisma } from '../prisma/client'

// Use a consistent JWT secret
const JWT_SECRET = 'your-secret-key'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
  return prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })
} 