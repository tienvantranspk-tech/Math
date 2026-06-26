import prisma from "@/lib/prisma";
import LessonEngine from "@/components/lesson/LessonEngine";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const cookieStore = await cookies();
  const childId = cookieStore.get("childId")?.value;

  let practiceLength = 10;
  let practiceTopics = "all";

  if (childId) {
    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      select: { practiceLength: true, practiceTopics: true }
    });
    if (child) {
      practiceLength = child.practiceLength;
      practiceTopics = child.practiceTopics;
    }
  }

  // Build where clause based on practiceTopics
  let whereClause: any = {};
  if (practiceTopics !== "all") {
    const topicIds = practiceTopics.split(",").filter(Boolean);
    if (topicIds.length > 0) {
      whereClause = {
        lesson: {
          topicId: { in: topicIds }
        }
      };
    }
  }

  // Fetch all question IDs from the database matching the filter
  const allQuestionIds = await prisma.question.findMany({
    where: whereClause,
    select: { id: true }
  });

  if (allQuestionIds.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#4B5563', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        Chưa có câu hỏi nào thuộc chủ đề đã cấu hình. Vui lòng nhờ phụ huynh cấu hình lại nhé!
      </div>
    );
  }

  // Shuffle and pick random question IDs
  const shuffledIds = allQuestionIds
    .map((q) => q.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, practiceLength);

  // Fetch full details of these questions
  const questions = await prisma.question.findMany({
    where: {
      id: { in: shuffledIds }
    }
  });

  // Re-shuffle the fetched questions to ensure random order
  const randomQuestions = questions.sort(() => 0.5 - Math.random());

  // Adapt questions for LessonEngine
  const adaptedQuestions = randomQuestions.map((q) => ({
    id: q.id,
    lessonId: q.lessonId,
    contentJson: q.contentJson,
    answerJson: q.answerJson,
    representationType: q.representationType
  }));

  return (
    <LessonEngine
      lessonId="practice"
      lessonName="Luyện Tập Tổng Hợp"
      questions={adaptedQuestions}
    />
  );
}
