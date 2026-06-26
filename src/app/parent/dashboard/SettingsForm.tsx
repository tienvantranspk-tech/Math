"use client";

import React, { useState } from "react";
import styles from "./dashboard.module.css";

interface Topic {
  id: string;
  name: string;
}

interface SettingsFormProps {
  childId: string;
  initialLength: number;
  initialTopics: string; // "all" or comma-separated list
  topics: Topic[];
}

export default function SettingsForm({
  childId,
  initialLength,
  initialTopics,
  topics,
}: SettingsFormProps) {
  const [practiceLength, setPracticeLength] = useState<number>(initialLength);
  const [isAllTopics, setIsAllTopics] = useState<boolean>(initialTopics === "all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    if (initialTopics === "all") {
      return topics.map((t) => t.id);
    }
    return initialTopics.split(",").filter(Boolean);
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleTopicToggle = (topicId: string) => {
    if (isAllTopics) {
      setIsAllTopics(false);
      setSelectedTopics([topicId]);
      return;
    }

    setSelectedTopics((prev) => {
      let next;
      if (prev.includes(topicId)) {
        next = prev.filter((id) => id !== topicId);
      } else {
        next = [...prev, topicId];
      }

      if (next.length === topics.length) {
        setIsAllTopics(true);
      }
      return next;
    });
  };

  const handleAllTopicsToggle = () => {
    if (isAllTopics) {
      setIsAllTopics(false);
      setSelectedTopics([]);
    } else {
      setIsAllTopics(true);
      setSelectedTopics(topics.map((t) => t.id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const practiceTopicsString = isAllTopics || selectedTopics.length === topics.length
      ? "all"
      : selectedTopics.join(",");

    try {
      const res = await fetch("/api/child/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          practiceLength,
          practiceTopics: practiceTopicsString,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast("Cập nhật cấu hình luyện tập thành công!");
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast(`Lỗi: ${data.error || "Không thể lưu"}`);
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setToast("Không thể lưu cấu hình, vui lòng thử lại.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.settingsGrid}>
      {toast && <div className={styles.toast}>✨ {toast}</div>}

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="practiceLength">
          Số lượng câu hỏi mỗi lượt luyện tập:
        </label>
        <select
          id="practiceLength"
          value={practiceLength}
          onChange={(e) => setPracticeLength(Number(e.target.value))}
          className={styles.formSelect}
        >
          <option value={5}>5 câu hỏi</option>
          <option value={10}>10 câu hỏi (Mặc định)</option>
          <option value={15}>15 câu hỏi</option>
          <option value={20}>20 câu hỏi</option>
          <option value={25}>25 câu hỏi</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Chủ đề luyện tập:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            onClick={handleAllTopicsToggle}
            className={`${styles.checkboxCard} ${isAllTopics ? styles.checkboxCardActive : ""}`}
          >
            <input
              type="checkbox"
              checked={isAllTopics}
              onChange={() => {}}
              className={styles.checkboxInput}
              style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem' }}
            />
            <span className={styles.checkboxText} style={{ fontWeight: '900' }}>
              🌟 Tất cả chủ đề (Mặc định)
            </span>
          </div>

          <div className={styles.topicsCheckboxGrid}>
            {topics.map((topic) => {
              const isChecked = isAllTopics || selectedTopics.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => handleTopicToggle(topic.id)}
                  className={`${styles.checkboxCard} ${isChecked ? styles.checkboxCardActive : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className={styles.checkboxInput}
                    style={{ cursor: 'pointer', width: '1rem', height: '1rem' }}
                  />
                  <span className={styles.checkboxText}>{topic.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button type="submit" disabled={isSaving} className={styles.saveButton}>
        {isSaving ? "Đang lưu..." : "Lưu Cấu Hình"}
      </button>
    </form>
  );
}
