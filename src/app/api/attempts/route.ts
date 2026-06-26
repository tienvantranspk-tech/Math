import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childId, lessonId, questionId, isCorrect, timeSeconds } = body;

    if (!childId || !lessonId || !questionId || typeof isCorrect !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attempt = await prisma.attempt.create({
      data: {
        childId,
        lessonId,
        questionId,
        isCorrect,
        timeSeconds: timeSeconds || null
      }
    });

    // If correct, reward the child with 1 star and 1 coin
    if (isCorrect) {
      try {
        await prisma.childProfile.update({
          where: { id: childId },
          data: {
            stars: { increment: 1 },
            coins: { increment: 1 }
          }
        });
      } catch (dbError) {
        console.error('Failed to update child stars/coins:', dbError);
      }
    }

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error('Error creating attempt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
