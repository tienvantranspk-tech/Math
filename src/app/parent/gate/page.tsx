"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./gate.module.css";

export default function ParentalGate() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  // A simple static math problem to gate kids (e.g. 7 x 8 = 56).
  // In a full app, this should be randomized.
  const expectedAnswer = "56";

  const handleSubmit = () => {
    if (answer.trim() === expectedAnswer) {
      router.push("/parent/dashboard");
    } else {
      setError(true);
      setAnswer("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Khu vực Phụ Huynh</h1>
        <p className={styles.subtitle}>
          Vui lòng giải phép tính sau để xác nhận bạn là phụ huynh:
        </p>

        <div className={styles.equation}>
          7 × 8 = ?
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="Nhập kết quả"
            className={styles.input}
            autoFocus
          />
          {error && <p className={styles.error}>Sai rồi. Vui lòng thử lại!</p>}
        </div>

        <div className={styles.actions}>
          <Link href="/map" className={styles.backBtn}>
            Quay lại
          </Link>
          <button onClick={handleSubmit} className={styles.submitBtn}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
