"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LessonEngine.module.css";
import MascotTobi from "./MascotTobi";

// Helper functions for synthesizing SFX using Web Audio API
const playCorrectSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    
    playTone(523.25, now, 0.15); // C5
    playTone(659.25, now + 0.08, 0.25); // E5
  } catch (e) {
    console.error('Audio synthesis failed', e);
  }
};

const playIncorrectSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3); // Slide down to A2
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error('Audio synthesis failed', e);
  }
};

const playWinSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    
    playTone(523.25, now, 0.15); // C5
    playTone(659.25, now + 0.12, 0.15); // E5
    playTone(783.99, now + 0.24, 0.15); // G5
    playTone(1046.50, now + 0.36, 0.45); // C6
  } catch (e) {
    console.error('Audio synthesis failed', e);
  }
};

// Confetti burst using dynamic import to avoid SSR errors
const triggerConfetti = (isFinal = false) => {
  if (typeof window === 'undefined') return;
  import('canvas-confetti').then((confetti) => {
    if (isFinal) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti.default({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    } else {
      confetti.default({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        zIndex: 10000
      });
    }
  }).catch(console.error);
};

type Question = {
  id: string;
  lessonId: string;
  contentJson: string;
  answerJson: string;
  representationType: string;
  isSpacedRepetition?: boolean;
};

type LessonProps = {
  lessonId: string;
  lessonName: string;
  questions: Question[];
};

export default function LessonEngine({ lessonId, lessonName, questions: initialQuestions }: LessonProps) {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [stars, setStars] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const [mascotState, setMascotState] = useState<"idle" | "talking" | "correct" | "incorrect">("idle");

  useEffect(() => {
    if (mascotState === "correct" || mascotState === "incorrect") {
      const timer = setTimeout(() => setMascotState("idle"), 1500);
      return () => clearTimeout(timer);
    }
  }, [mascotState]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onstart = () => setMascotState("talking");
      utterance.onend = () => setMascotState("idle");
      utterance.onerror = () => setMascotState("idle");
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play audio when entering a new step
  useEffect(() => {
    if (step === -1) {
      speak("Khám phá bài học mới! Hôm nay chúng ta sẽ ôn tập. Sẵn sàng chưa nào?");
    } else if (step >= 0 && step < questions.length) {
      const q = questions[step];
      const parsed = JSON.parse(q.contentJson);
      if (parsed.text) {
        speak(parsed.text);
      }
    } else if (step === questions.length) {
      playWinSound();
      triggerConfetti(true);
      speak(`Tuyệt vời! Bé đã hoàn thành bài học và nhận được ${stars} sao.`);
    }
  }, [step, questions, stars]);
  
  // Fetch spaced repetition questions on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const childId = localStorage.getItem("childId") || "child_1";
      fetch(`/api/spaced-repetition?childId=${childId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setQuestions(prev => [...data, ...prev]);
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleNext = async (correct?: boolean) => {
    if (correct) {
      setStars((s) => s + 1);
      playCorrectSound();
      triggerConfetti(false);
      setMascotState("correct");
      speak("Đúng rồi! Giỏi quá!");
    } else if (correct === false) {
      playIncorrectSound();
      setMascotState("incorrect");
      speak("Tiếc quá, sai mất rồi. Cố lên nhé!");
    }

    if (step >= 0 && step < questions.length && typeof correct !== 'undefined') {
      const childId = localStorage.getItem("childId") || "child_1";
      const questionId = questions[step].id;
      
      try {
        await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId,
            lessonId: questions[step].lessonId || lessonId,
            questionId,
            isCorrect: correct,
            timeSeconds: 10
          })
        });
      } catch (e) {
        console.error("Failed to save attempt", e);
      }
    }

    // Delay a bit so the child hears the feedback before moving
    if (typeof correct !== 'undefined') {
      setTimeout(() => setStep((s) => s + 1), 1500);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleFinish = () => {
    router.push("/map");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push(lessonId === "practice" ? "/" : "/map")} className={styles.closeBtn}>
          X Đóng
        </button>
        <div className={styles.lessonTitle}>{lessonName}</div>
        <div className={styles.starBox}>
          ⭐ {stars}
        </div>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === -1 && (
            <motion.div
              key="intro"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={styles.introCard}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <MascotTobi state={mascotState} />
              </div>
              <h2 className={styles.introTitle}>
                Khám phá bài học mới!
              </h2>
              <p className={styles.introText}>
                Hôm nay chúng ta sẽ ôn tập các số đến 100. Sẵn sàng chưa nào?
              </p>
              <button onClick={() => handleNext()} className="btn btn-primary" style={{width: '100%'}}>
                Bắt đầu luyện tập
              </button>
            </motion.div>
          )}

          {step >= 0 && step < questions.length && (
            <motion.div
              key={`q-${step}`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={styles.questionContainer}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                <MascotTobi state={mascotState} />
              </div>
              {questions[step].isSpacedRepetition && (
                <div style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.5rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                  🔄 Câu hỏi ôn tập
                </div>
              )}
              <QuestionRenderer 
                question={questions[step]} 
                onAnswer={(isCorrect) => handleNext(isCorrect)} 
              />
            </motion.div>
          )}

          {step === questions.length && (
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={styles.resultCard}
            >
              <div className={styles.introEmoji}>🏆</div>
              <h2 className={styles.resultTitle}>
                {lessonId === "practice" ? "Hoàn thành Luyện tập!" : "Tuyệt vời! Hoàn thành bài học"}
              </h2>
              <p className={styles.resultStars}>
                Bé nhận được {stars} ⭐
              </p>
              {lessonId === "practice" ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-success" 
                    style={{ width: '100%', fontSize: '1.25rem' }}
                  >
                    🔄 Luyện tập tiếp
                  </button>
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <button 
                      onClick={() => router.push("/")} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, fontSize: '1rem', minHeight: '50px' }}
                    >
                      🚪 Đổi người học
                    </button>
                    <button 
                      onClick={() => router.push("/parent/gate")} 
                      className="btn btn-primary" 
                      style={{ flex: 1, fontSize: '1rem', minHeight: '50px', backgroundColor: 'var(--color-primary)' }}
                    >
                      👨‍👩‍👧 Phụ huynh
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleFinish} className="btn btn-success" style={{ width: '100%' }}>
                  Trở về Bản đồ
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Specific Question Type Renderers ---

function QuestionRenderer({ question, onAnswer }: { question: Question, onAnswer: (correct: boolean) => void }) {
  const content = JSON.parse(question.contentJson);
  const answer = JSON.parse(question.answerJson);

  if (question.representationType === "multiple_choice") {
    return <MultipleChoiceQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "fill_number") {
    return <FillNumberQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "true_false") {
    return <TrueFalseQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "matching") {
    return <MatchingQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "sort_order") {
    return <SortOrderQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "measuring_length") {
    return <MeasuringLengthQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }
  if (question.representationType === "clock_time") {
    return <ClockTimeQuestion content={content} answer={answer} onAnswer={onAnswer} />;
  }

  return <div>Unknown question type</div>;
}

function MultipleChoiceQuestion({ content, answer, onAnswer }: any) {
  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{content.text}</h3>
      <div className={styles.optionsGrid}>
        {content.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => onAnswer(opt === answer.correct)}
            className={styles.optionBtn}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FillNumberQuestion({ content, answer, onAnswer }: any) {
  const [val, setVal] = useState("");

  const handleSubmit = () => {
    if (val.trim()) {
      onAnswer(val.trim() === answer.correct);
    }
  };

  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{content.text}</h3>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className={styles.numberInput}
        autoFocus
      />
      <button onClick={handleSubmit} className="btn btn-secondary" style={{padding: '1rem 3rem'}}>
        Trả lời
      </button>
    </div>
  );
}

function TrueFalseQuestion({ content, answer, onAnswer }: any) {
  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{content.text}</h3>
      <div className={styles.tfContainer}>
        <button onClick={() => onAnswer(true === answer.correct)} className={styles.tfBtnTrue}>
          ĐÚNG
        </button>
        <button onClick={() => onAnswer(false === answer.correct)} className={styles.tfBtnFalse}>
          SAI
        </button>
      </div>
    </div>
  );
}

function MatchingQuestion({ content, answer, onAnswer }: any) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  
  const handleLeftClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedLeft(id);
    checkMatch(id, selectedRight);
  };
  const handleRightClick = (id: string) => {
    const isMatched = answer.pairs.some((p:any) => p.rightId === id && matchedPairs.includes(p.leftId));
    if (isMatched) return;
    setSelectedRight(id);
    checkMatch(selectedLeft, id);
  };

  const checkMatch = (lId: string | null, rId: string | null) => {
    if (lId && rId) {
      const isCorrectPair = answer.pairs.some((p:any) => p.leftId === lId && p.rightId === rId);
      if (isCorrectPair) {
        const newMatched = [...matchedPairs, lId];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        if (newMatched.length === content.left.length) {
          setTimeout(() => onAnswer(true), 500);
        }
      } else {
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }
  };

  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{content.text}</h3>
      <div className={styles.matchingContainer}>
        <div className={styles.matchingCol}>
          {content.left.map((item: any) => {
            const isMatched = matchedPairs.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => handleLeftClick(item.id)}
                className={`${styles.matchingItem} ${selectedLeft === item.id ? styles.matchingItemSelected : ''} ${isMatched ? styles.matchingItemMatched : ''}`}
              >
                {item.text}
              </div>
            );
          })}
        </div>
        <div className={styles.matchingCol}>
          {content.right.map((item: any) => {
            const isMatched = answer.pairs.some((p:any) => p.rightId === item.id && matchedPairs.includes(p.leftId));
            return (
              <div 
                key={item.id} 
                onClick={() => handleRightClick(item.id)}
                className={`${styles.matchingItem} ${selectedRight === item.id ? styles.matchingItemSelected : ''} ${isMatched ? styles.matchingItemMatched : ''}`}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortOrderQuestion({ content, answer, onAnswer }: any) {
  const [placed, setPlaced] = useState<string[]>([]);
  
  const handlePlace = (item: string) => {
    if (placed.length < content.items.length) {
      const newPlaced = [...placed, item];
      setPlaced(newPlaced);
      
      if (newPlaced.length === content.items.length) {
        const isCorrect = JSON.stringify(newPlaced) === JSON.stringify(answer.correctOrder);
        setTimeout(() => onAnswer(isCorrect), 500);
      }
    }
  };

  const handleRemove = (index: number) => {
    const newPlaced = [...placed];
    newPlaced.splice(index, 1);
    setPlaced(newPlaced);
  };

  return (
    <div className={styles.questionCard}>
      <h3 className={styles.questionText}>{content.text}</h3>
      <div className={styles.sortContainer}>
        <div className={styles.sortSlots}>
          {content.items.map((_:any, i: number) => (
            <div 
              key={i} 
              className={`${styles.sortSlot} ${placed[i] ? styles.sortSlotFilled : ''}`}
              onClick={() => { if(placed[i]) handleRemove(i) }}
            >
              {placed[i] || ''}
            </div>
          ))}
        </div>
        <div className={styles.sortItemsGroup}>
          {content.items.map((item: string, i: number) => {
            const totalCount = content.items.filter((x:string)=>x===item).length;
            const placedCount = placed.filter((x:string)=>x===item).length;
            const isUsed = placedCount >= totalCount;
            
            return (
              <div 
                key={i} 
                className={`${styles.sortItem} ${isUsed ? styles.sortItemUsed : ''}`}
                onClick={() => handlePlace(item)}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MeasuringLengthQuestion({ content, answer, onAnswer }: any) {
  const [val, setVal] = useState("");

  const handleSubmit = () => {
    if (val.trim()) {
      onAnswer(val.trim() === answer.correct);
    }
  };

  const scale = 24; // 24px per cm
  const pencilWidth = content.length * scale - 15;

  return (
    <div className={styles.questionCard} style={{ gap: '1.5rem' }}>
      <h3 className={styles.questionText}>{content.text}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg width="300" height="120" viewBox="0 0 300 120" style={{ background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
          {/* Ruler */}
          <rect x="10" y="70" width="280" height="35" fill="#fef08a" stroke="#eab308" strokeWidth="2" rx="4" />
          
          {/* Ruler Marks & Numbers */}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = 20 + i * scale;
            return (
              <g key={i}>
                <line x1={x} y1="70" x2={x} y2="80" stroke="#a16207" strokeWidth="1.5" />
                <text x={x} y="94" fill="#a16207" fontSize="10" fontWeight="bold" textAnchor="middle">{i}</text>
                {i < 10 && (
                  <>
                    <line x1={x + scale/2} y1="70" x2={x + scale/2} y2="76" stroke="#a16207" strokeWidth="1" />
                    {Array.from({ length: 4 }).map((_, j) => (
                      <line 
                        key={j} 
                        x1={x + (j + 1) * (scale / 10)} 
                        y1="70" 
                        x2={x + (j + 1) * (scale / 10)} 
                        y2="73" 
                        stroke="#a16207" 
                        strokeWidth="0.5" 
                      />
                    ))}
                    {Array.from({ length: 4 }).map((_, j) => (
                      <line 
                        key={j} 
                        x1={x + scale/2 + (j + 1) * (scale / 10)} 
                        y1="70" 
                        x2={x + scale/2 + (j + 1) * (scale / 10)} 
                        y2="73" 
                        stroke="#a16207" 
                        strokeWidth="0.5" 
                      />
                    ))}
                  </>
                )}
              </g>
            );
          })}

          {/* Pencil Object aligned at 0 */}
          <g>
            {/* Eraser */}
            <rect x="10" y="35" width="10" height="18" fill="#fda4af" rx="1" />
            {/* Ferrule (Metal band) */}
            <rect x="17" y="35" width="3" height="18" fill="#94a3b8" />
            {/* Pencil Body */}
            <rect x="20" y="35" width={pencilWidth} height="18" fill="#f97316" />
            {/* Pencil Tip (Wood) */}
            <polygon points={`${20 + pencilWidth},35 ${20 + pencilWidth + 10},44 ${20 + pencilWidth},53`} fill="#fde047" />
            {/* Pencil Lead */}
            <polygon points={`${20 + pencilWidth + 6},41.4 ${20 + pencilWidth + 10},44 ${20 + pencilWidth + 6},46.6`} fill="#334155" />
          </g>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className={styles.numberInput}
          style={{ marginBottom: 0, width: '8rem' }}
          placeholder="Số cm"
          autoFocus
        />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-text)' }}>cm</span>
      </div>

      <button onClick={handleSubmit} className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>
        Trả lời
      </button>
    </div>
  );
}

function ClockTimeQuestion({ content, answer, onAnswer }: any) {
  const [hourVal, setHourVal] = useState("");
  const [minuteVal, setMinuteVal] = useState("");

  const handleSubmit = () => {
    if (hourVal.trim() && minuteVal.trim()) {
      onAnswer(
        hourVal.trim() === answer.correctHour &&
        minuteVal.trim() === answer.correctMinute
      );
    }
  };

  const hour = content.hour;
  const minute = content.minute;

  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  return (
    <div className={styles.questionCard} style={{ gap: '1.5rem' }}>
      <h3 className={styles.questionText}>{content.text}</h3>

      {/* SVG Analog Clock */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <svg width="180" height="180" viewBox="0 0 200 200">
          {/* Clock Face Shadow */}
          <circle cx="100" cy="103" r="80" fill="rgba(0,0,0,0.06)" />
          {/* Clock Face */}
          <circle cx="100" cy="100" r="80" fill="white" stroke="var(--color-primary)" strokeWidth="6" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="2" />
          <circle cx="100" cy="100" r="5" fill="#1e293b" />

          {/* Numbers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const num = i + 1;
            const angle = num * 30;
            const rad = (angle * Math.PI) / 180;
            const x = 100 + 58 * Math.sin(rad);
            const y = 100 - 58 * Math.cos(rad);
            return (
              <text 
                key={num} 
                x={x} 
                y={y} 
                fill="#334155" 
                fontSize="14" 
                fontWeight="900" 
                textAnchor="middle" 
                dominantBaseline="central"
              >
                {num}
              </text>
            );
          })}

          {/* Hour Hand (shorter, black) */}
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="52" 
            stroke="#1e293b" 
            strokeWidth="6" 
            strokeLinecap="round" 
            transform={`rotate(${hourAngle} 100 100)`} 
          />

          {/* Minute Hand (longer, orange) */}
          <line 
            x1="100" 
            y1="100" 
            x2="100" 
            y2="34" 
            stroke="var(--color-secondary)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            transform={`rotate(${minuteAngle} 100 100)`} 
          />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="number"
          value={hourVal}
          onChange={(e) => setHourVal(e.target.value)}
          className={styles.numberInput}
          style={{ marginBottom: 0, width: '5rem', padding: '0.75rem', fontSize: '1.75rem' }}
          placeholder="Giờ"
          autoFocus
        />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>giờ</span>
        <input
          type="number"
          value={minuteVal}
          onChange={(e) => setMinuteVal(e.target.value)}
          className={styles.numberInput}
          style={{ marginBottom: 0, width: '5rem', padding: '0.75rem', fontSize: '1.75rem' }}
          placeholder="Phút"
        />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text)' }}>phút</span>
      </div>

      <button onClick={handleSubmit} className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>
        Trả lời
      </button>
    </div>
  );
}
