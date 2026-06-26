import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./map.module.css";

export default async function MapPage() {
  const topics = await prisma.topic.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>🗺️ Bản Đồ Thế Giới</h1>
        <div className={styles.stats}>
          <div className={styles.statStar}>
            ⭐ 0
          </div>
          <div className={styles.statCoin}>
            🪙 0
          </div>
          <Link href="/shop" className={styles.parentBtn} style={{ backgroundColor: '#4ecdc4', marginRight: '10px' }}>
            🛒 Cửa hàng
          </Link>
          <Link href="/parent/gate" className={styles.parentBtn}>
            👨‍👩‍👧 Phụ huynh
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {topics.map((topic) => (
          <div key={topic.id} className={styles.topicCard}>
            <h2 className={styles.topicTitle}>
              {topic.worldTheme}: {topic.name}
            </h2>
            
            <div className={styles.lessonGrid}>
              {topic.lessons.map((lesson) => (
                <Link href={`/lesson/${lesson.id}`} key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonCircle}>
                    {lesson.order}
                  </div>
                  <span className={styles.lessonName}>
                    {lesson.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
