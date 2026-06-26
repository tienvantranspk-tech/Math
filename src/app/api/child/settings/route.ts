import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { childId, practiceLength, practiceTopics } = await request.json();

    if (!childId) {
      return NextResponse.json({ error: "Thiếu childId" }, { status: 400 });
    }

    const updated = await prisma.childProfile.update({
      where: { id: childId },
      data: {
        practiceLength: Number(practiceLength) || 10,
        practiceTopics: practiceTopics || "all"
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API settings error:", error);
    return NextResponse.json({ error: error.message || "Không thể cập nhật cấu hình" }, { status: 500 });
  }
}
