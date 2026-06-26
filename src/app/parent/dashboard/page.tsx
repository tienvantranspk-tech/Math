import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./dashboard.module.css";
import { cookies } from "next/headers";
import SettingsForm from "./SettingsForm";

export default async function ParentDashboard() {
  const cookieStore = await cookies();
  let childId = cookieStore.get("childId")?.value;

  if (!childId) {
    const firstChild = await prisma.childProfile.findFirst();
    if (firstChild) {
      childId = firstChild.id;
    }
  }

  if (!childId) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#4B5563', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        Không tìm thấy dữ liệu học sinh. Vui lòng chọn bé ở màn hình chính trước khi vào Góc Phụ Huynh.
      </div>
    );
  }

  const child = await prisma.childProfile.findUnique({
    where: { id: childId }
  });

  if (!child) {
    return <div>Không tìm thấy dữ liệu học sinh. Vui lòng thiết lập ở màn hình chờ.</div>;
  }

  // Fetch recent attempts
  const recentAttempts = await prisma.attempt.findMany({
    where: { childId: child.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      question: true,
      lesson: true
    }
  });

  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  const accuracy = recentAttempts.length > 0 ? Math.round((correctCount / recentAttempts.length) * 100) : 0;
  
  // Simple heuristic for weakness
  const incorrectAttempts = recentAttempts.filter(a => !a.isCorrect);

  // Fetch all topics
  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Báo Cáo Học Tập: {child.name}</h1>
        <Link href="/map" className={styles.backBtn}>Thoát</Link>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{accuracy}%</div>
            <div className={styles.statLabel}>Tỷ lệ đúng gần đây</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>⭐ {child.stars}</div>
            <div className={styles.statLabel}>Sao tích lũy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>🔥 {child.currentStreak}</div>
            <div className={styles.statLabel}>Chuỗi ngày học</div>
          </div>
        </div>

        {incorrectAttempts.length > 0 && (
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>⚠️ Điểm yếu cần chú ý</h2>
            <div className={styles.weaknessAlert}>
              <p>Trẻ đang gặp khó khăn với một số câu hỏi (sai {incorrectAttempts.length} lần gần đây).</p>
              <p><strong>Gợi ý:</strong> Phụ huynh nên cùng trẻ dùng giấy nháp vẽ sơ đồ bài toán để trẻ dễ hình dung hơn.</p>
            </div>
          </div>
        )}

        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>⚙️ Cấu hình Luyện tập cho Bé</h2>
          <SettingsForm
            childId={child.id}
            initialLength={child.practiceLength}
            initialTopics={child.practiceTopics}
            topics={topics}
          />
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Lịch sử làm bài (10 câu gần nhất)</h2>
          
          {recentAttempts.length === 0 ? (
            <p style={{color: '#6B7280'}}>Chưa có dữ liệu làm bài.</p>
          ) : (
            <div className={styles.historyList}>
              {recentAttempts.map(attempt => {
                const qContent = JSON.parse(attempt.question.contentJson);
                return (
                  <div key={attempt.id} className={styles.historyItem}>
                    <div>
                      <div className={styles.historyQuestion}>
                        {qContent.text.length > 50 ? qContent.text.substring(0, 50) + "..." : qContent.text}
                      </div>
                      <div className={styles.historyDate}>
                        Bài: {attempt.lesson.name} • {new Date(attempt.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className={attempt.isCorrect ? styles.historyCorrect : styles.historyIncorrect}>
                      {attempt.isCorrect ? 'Đúng' : 'Sai'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
