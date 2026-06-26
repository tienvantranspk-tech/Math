import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const childId = searchParams.get('childId')

  if (!childId) return NextResponse.json([])

  const incorrectAttempts = await prisma.attempt.findMany({
    where: {
      childId: childId,
      isCorrect: false
    },
    include: {
      question: true
    },
    take: 2,
    orderBy: {
      createdAt: 'desc'
    }
  })

  // deduplicate questions
  const uniqueQuestions = new Map()
  for (const att of incorrectAttempts) {
    if (!uniqueQuestions.has(att.questionId)) {
      uniqueQuestions.set(att.questionId, {
        ...att.question,
        isSpacedRepetition: true
      })
    }
  }

  return NextResponse.json(Array.from(uniqueQuestions.values()))
}
