import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";
import ChildSelector from "./ChildSelector";

export default async function WelcomeScreen() {
  // Fetch all children profiles
  // Assuming a family app where all profiles belong to the same local instance
  const childrenList = await prisma.childProfile.findMany();

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Toán Vui KNTT</h1>
      
      <div className={styles.splitContainer}>
        {/* Khu vực của Bé */}
        <div className={styles.splitCard}>
          <div className={styles.emoji}>🐘</div>
          <h2 className={styles.title} style={{ color: 'var(--color-primary)' }}>Khu vực của Bé</h2>
          <p className={styles.subtitle}>Bé hãy chọn tên của mình để bắt đầu vào học Toán nhé!</p>
          
          {childrenList.length > 0 ? (
            <ChildSelector childrenList={childrenList} />
          ) : (
            <p style={{ color: '#EF4444', fontWeight: 'bold' }}>Chưa có tài khoản bé nào. Vui lòng nhờ Phụ huynh tạo nhé!</p>
          )}
        </div>

        {/* Khu vực của Phụ huynh */}
        <div className={styles.splitCard}>
          <div className={styles.emoji}>👨‍👩‍👧</div>
          <h2 className={styles.title} style={{ color: '#4B5563' }}>Góc Phụ Huynh</h2>
          <p className={styles.subtitle}>Xem báo cáo học tập và quản lý ứng dụng.</p>
          
          <Link href="/parent/gate" className="btn btn-secondary" style={{ padding: '1.5rem 3rem', fontSize: '1.5rem', width: '100%', marginTop: 'auto' }}>
            Vào góc Phụ huynh
          </Link>
        </div>
      </div>
    </div>
  );
}
