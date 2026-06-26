import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { childId, itemId } = await request.json()

    if (!childId || !itemId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } })
    const child = await prisma.childProfile.findUnique({ where: { id: childId } })

    if (!item || !child) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin' }, { status: 404 })
    }

    // Check if already owned
    const existingInventory = await prisma.inventory.findFirst({
      where: { childId, itemId }
    })

    if (existingInventory) {
      return NextResponse.json({ error: 'Đã sở hữu vật phẩm này' }, { status: 400 })
    }

    if (child.coins < item.price) {
      return NextResponse.json({ error: 'Không đủ xu' }, { status: 400 })
    }

    // Transaction: subtract coins and add to inventory
    await prisma.$transaction([
      prisma.childProfile.update({
        where: { id: childId },
        data: { coins: child.coins - item.price }
      }),
      prisma.inventory.create({
        data: { childId, itemId }
      })
    ])

    return NextResponse.json({ success: true, coins: child.coins - item.price })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
