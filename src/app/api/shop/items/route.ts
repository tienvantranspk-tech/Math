import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')

    if (!childId) {
      return NextResponse.json({ error: 'Missing childId' }, { status: 400 })
    }

    const [items, child, inventory] = await Promise.all([
      prisma.item.findMany(),
      prisma.childProfile.findUnique({
        where: { id: childId },
        select: { coins: true }
      }),
      prisma.inventory.findMany({
        where: { childId }
      })
    ])

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // Map items with "isOwned" boolean
    const itemsWithStatus = items.map(item => ({
      ...item,
      isOwned: inventory.some(inv => inv.itemId === item.id)
    }))

    return NextResponse.json({
      items: itemsWithStatus,
      coins: child.coins
    })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
