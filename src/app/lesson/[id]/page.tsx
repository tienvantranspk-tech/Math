import prisma from "@/lib/prisma";
import LessonEngine from "@/components/lesson/LessonEngine";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const lesson = await prisma.lesson.findUnique({
    where: { id: resolvedParams.id },
    include: { questions: true }
  });

  if (!lesson) {
    notFound();
  }

  return <LessonEngine lessonId={lesson.id} lessonName={lesson.name} questions={lesson.questions} />;
}
