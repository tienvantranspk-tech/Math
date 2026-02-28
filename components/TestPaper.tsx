import React, { useState, useEffect } from 'react';
import { TestStructure, Question, QuestionType, Subject } from '../types';
import { Check, Printer, Home, Award, Send, RefreshCcw, X, AlertCircle, Shuffle } from 'lucide-react';

interface TestPaperProps {
  test: TestStructure;
  onBack: () => void;
  onRegenerate?: () => void;
}

const TestPaper: React.FC<TestPaperProps> = ({ test, onBack, onRegenerate }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [totalMcqPoints, setTotalMcqPoints] = useState(0);

  // Safety reset in case key prop isn't used (though App.tsx handles this)
  useEffect(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setMcqScore(0);
    setTotalMcqPoints(0);
  }, [test.id]);

  const getHeaderColor = () => {
    switch (test.colorTheme) {
      case 'green': return 'bg-green-100 border-green-500 text-green-800';
      case 'yellow': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'red': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShuffle = () => {
     if (!onRegenerate) return;

     if (isSubmitted) {
        // If already submitted, just regenerate immediately
        onRegenerate();
     } else {
         // If in progress, ask for confirmation
         const hasAnswers = Object.keys(userAnswers).length > 0;
         if (!hasAnswers || window.confirm("Con có chắc muốn đổi đề mới không? Bài làm hiện tại sẽ bị mất.")) {
             onRegenerate();
         }
     }
  };

  const handleRetry = () => {
    if (isSubmitted) {
        // Just reset if already submitted and viewed results
        setUserAnswers({});
        setIsSubmitted(false);
        setMcqScore(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // If in progress, confirm clearing
        const hasAnswers = Object.keys(userAnswers).length > 0;
        if (!hasAnswers || window.confirm("Con có chắc muốn xóa hết và làm lại từ đầu không?")) {
            setUserAnswers({});
            setIsSubmitted(false);
            setMcqScore(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    if (isSubmitted) return; // Prevent changes after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    // Check if any MCQs are unanswered
    const mcqQuestions = test.questions.part1.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
    const unansweredCount = mcqQuestions.filter(q => !userAnswers[q.id]).length;

    if (unansweredCount > 0) {
        if (!window.confirm(`Còn ${unansweredCount} câu trắc nghiệm chưa làm. Con có chắc muốn nộp bài luôn không?`)) {
            return;
        }
    }

    let score = 0;
    let totalPoints = 0;

    test.questions.part1.forEach(q => {
       if (q.type === QuestionType.MULTIPLE_CHOICE) {
           totalPoints += q.points;
           if (userAnswers[q.id] === q.correctAnswer) {
               score += q.points;
           }
       }
    });

    setMcqScore(score);
    setTotalMcqPoints(totalPoints);
    setIsSubmitted(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderVerticalMath = (data: any[], questionId: string) => {
    let currentAnswers: Record<string, string> = {};
    try {
        if (userAnswers[questionId]) {
            const val = userAnswers[questionId];
            if (val.startsWith('{')) {
                currentAnswers = JSON.parse(val);
            }
        }
    } catch (e) {
        console.error("Error parsing answers", e);
    }

    const handleSubAnswerChange = (idx: number, val: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(val)) return;
        
        const newAnswers = { ...currentAnswers, [idx]: val };
        handleAnswerChange(questionId, JSON.stringify(newAnswers));
    };

    return (
        <div className="flex flex-wrap gap-8 mt-4 mb-4 justify-center md:justify-start">
            {data.map((item: any, idx: number) => {
                const result = item.op === '+' ? item.val1 + item.val2 : item.val1 - item.val2;
                const userVal = currentAnswers[idx] || '';
                const isCorrect = isSubmitted && parseInt(userVal) === result;

                return (
                <div key={idx} className="flex flex-col items-center p-4 bg-blue-50/50 rounded-lg border border-blue-100 min-w-[120px]">
                    <span className="font-bold text-gray-500 mb-2 self-start">{item.label}</span>
                    <div className="text-3xl font-mono font-bold text-gray-800 flex flex-col items-end">
                        <div>{item.val1}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.op}</span>
                            <span>{item.val2}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800 mt-1 mb-1"></div>
                        
                        <input 
                            type="text" 
                            disabled={isSubmitted}
                            maxLength={3}
                            className={`w-20 text-center text-3xl p-1 rounded border-2 outline-none font-mono ${
                                isSubmitted 
                                    ? (isCorrect ? 'text-green-600 border-green-500 bg-green-50' : 'text-red-600 border-red-500 bg-red-50')
                                    : 'bg-white border-blue-200 focus:border-blue-500 text-blue-800'
                            }`}
                            value={userVal}
                            onChange={(e) => handleSubAnswerChange(idx, e.target.value)}
                        />
                        
                        {isSubmitted && !isCorrect && (
                             <div className="text-lg text-green-600 font-bold mt-1 animate-fade-in">
                                {result}
                             </div>
                        )}
                    </div>
                </div>
            )})}
        </div>
    );
  };

  const renderComparison = (data: any[], questionId: string) => {
    let currentAnswers: Record<string, string> = {};
    try {
        if (userAnswers[questionId]) {
            const val = userAnswers[questionId];
            if (val.startsWith('{')) {
                currentAnswers = JSON.parse(val);
            }
        }
    } catch (e) {
        console.error("Error parsing answers", e);
    }

    const handleSubAnswerChange = (idx: number, val: string) => {
        const newAnswers = { ...currentAnswers, [idx]: val };
        handleAnswerChange(questionId, JSON.stringify(newAnswers));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
            {data.map((item: any, idx: number) => {
                const userVal = currentAnswers[idx] || '';
                const isCorrect = isSubmitted && userVal === item.sign;
                
                return (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-500 w-6">{item.label}</span>
                        <span className="text-2xl font-bold text-gray-800 w-12 text-right">{item.val1}</span>
                        
                        <div className="flex gap-1 mx-2">
                            {['>', '<', '='].map((sign) => {
                                const isSelected = userVal === sign;
                                let btnClass = "w-10 h-10 rounded-lg border-2 font-bold text-xl flex items-center justify-center transition-all ";
                                
                                if (isSubmitted) {
                                    if (sign === item.sign) {
                                         btnClass += "bg-green-100 border-green-500 text-green-700";
                                    } else if (isSelected && sign !== item.sign) {
                                         btnClass += "bg-red-100 border-red-500 text-red-700";
                                    } else {
                                         btnClass += "bg-gray-100 border-gray-200 text-gray-400 opacity-30";
                                    }
                                } else {
                                    if (isSelected) {
                                        btnClass += "bg-blue-100 border-blue-500 text-blue-700 shadow-sm transform scale-105";
                                    } else {
                                        btnClass += "bg-white border-gray-300 text-gray-600 hover:bg-gray-100";
                                    }
                                }

                                return (
                                    <button
                                        key={sign}
                                        disabled={isSubmitted}
                                        onClick={() => handleSubAnswerChange(idx, sign)}
                                        className={btnClass}
                                    >
                                        {sign}
                                    </button>
                                );
                            })}
                        </div>

                        <span className="text-2xl font-bold text-gray-800 w-12 text-left">{item.val2}</span>
                    </div>
                );
            })}
        </div>
    );
  };

  const renderSection = (title: string, questions: Question[]) => {
    if (!questions || questions.length === 0) return null;
    return (
      <div className="mb-8 print-break-inside-avoid">
        <h3 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2 uppercase text-gray-700 flex items-center gap-2">
          {title}
        </h3>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = isSubmitted && q.type === QuestionType.MULTIPLE_CHOICE && userAnswer === q.correctAnswer;
            const isWrong = isSubmitted && q.type === QuestionType.MULTIPLE_CHOICE && userAnswer !== q.correctAnswer;

            return (
              <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 print:shadow-none print:border-0 print:p-0 print:mb-4 break-inside-avoid relative overflow-hidden">
                {/* Status Indicator Bar for Submitted MCQs */}
                {isSubmitted && q.type === QuestionType.MULTIPLE_CHOICE && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} print:hidden`}></div>
                )}

                <div className="flex gap-3">
                  <span className="font-bold text-gray-500 print:text-black">Câu {idx + 1}.</span>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                           <div className="w-full">
                               <p className="text-lg font-medium text-gray-900 mb-2 whitespace-pre-line print:text-black">
                                  {q.image && !q.metadata && <span className="mr-2 text-2xl align-middle">{q.image}</span>}
                                  {q.questionText}
                               </p>
                               {q.metadata?.type === 'VERTICAL_MATH' && renderVerticalMath(q.metadata.data, q.id)}
                               {q.metadata?.type === 'COMPARISON' && renderComparison(q.metadata.data, q.id)}
                           </div>
                          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded print:hidden flex-shrink-0 ml-2">
                              {q.points} điểm
                          </span>
                      </div>
                   
                    {/* MULTIPLE CHOICE RENDERING */}
                    {q.type === QuestionType.MULTIPLE_CHOICE && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        {q.options.map((opt, i) => {
                          const isSelected = userAnswer === opt;
                          const isThisCorrect = opt === q.correctAnswer;
                          
                          let cardClass = "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"; // Default
                          let icon = null;

                          if (isSubmitted) {
                              if (isThisCorrect) {
                                  cardClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
                                  icon = <Check size={18} className="text-green-600 ml-auto" />;
                              } else if (isSelected && !isThisCorrect) {
                                  cardClass = "bg-red-50 border-red-500 ring-1 ring-red-500";
                                  icon = <X size={18} className="text-red-600 ml-auto" />;
                              } else {
                                  cardClass = "bg-gray-50 border-gray-200 opacity-60";
                              }
                          } else {
                              if (isSelected) {
                                  cardClass = "bg-blue-50 border-blue-500 ring-1 ring-blue-500";
                                  icon = <Check size={18} className="text-blue-600 ml-auto" />;
                              }
                          }

                          return (
                            <div 
                              key={i} 
                              onClick={() => handleAnswerChange(q.id, opt)}
                              className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${cardClass} print:border-none print:p-0 print:bg-transparent print:opacity-100`}
                            >
                              <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border text-sm font-bold ${
                                isSubmitted && isThisCorrect 
                                  ? 'border-green-500 text-green-700 bg-green-100'
                                  : isSelected && !isSubmitted
                                    ? 'border-blue-500 text-blue-700 bg-blue-100'
                                    : isSubmitted && isSelected && !isThisCorrect
                                        ? 'border-red-500 text-red-700 bg-red-100'
                                        : 'border-gray-400 text-gray-600 bg-gray-50'
                              } print:border-black print:text-black print:bg-transparent print:w-6 print:h-6`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="text-base text-gray-900 print:text-black font-medium">
                                {opt}
                              </span>
                              <div className="print:hidden ml-auto">
                                {icon}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* ESSAY / THINKING / GAME INPUT RENDERING */}
                    {(q.type === QuestionType.ESSAY || q.type === QuestionType.THINKING || q.type === QuestionType.GAME) && q.metadata?.type !== 'VERTICAL_MATH' && q.metadata?.type !== 'COMPARISON' && (
                       <div className="mt-3">
                           {/* Print line */}
                           <div className="mt-4 border-b border-gray-300 border-dashed h-20 w-full hidden print:block"></div>
                           
                           {/* Screen Input */}
                           <textarea
                               disabled={isSubmitted}
                               value={userAnswer || ''}
                               onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                               placeholder={isSubmitted ? "Không có câu trả lời" : "Nhập câu trả lời của em tại đây..."}
                               className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-colors min-h-[80px] print:hidden font-hand text-lg ${
                                   isSubmitted ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white border-gray-300 text-gray-800'
                               }`}
                           />
                       </div>
                    )}

                    {/* REVIEW SECTION (SHOWN AFTER SUBMIT) */}
                    {isSubmitted && (
                      <div className={`mt-4 p-4 rounded-lg border text-sm animate-fade-in print:block print:bg-transparent print:border-0 print:text-gray-600 print:mt-1 print:p-0 print:text-xs ${
                          q.type === QuestionType.MULTIPLE_CHOICE 
                            ? (isCorrect ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900')
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}>
                         <p className="font-bold flex items-center gap-2 text-base">
                          {q.type === QuestionType.MULTIPLE_CHOICE 
                             ? (isCorrect ? <span className="flex items-center gap-2"><Check size={18}/> Chính xác!</span> : <span className="flex items-center gap-2"><X size={18}/> Sai rồi!</span>)
                             : <span className="flex items-center gap-2"><Award size={18}/> Đáp án gợi ý:</span>
                          }
                         </p>
                         
                         {/* Show correct answer text if it's MCQ and Wrong, OR if it's Essay */}
                         {( (q.type === QuestionType.MULTIPLE_CHOICE && isWrong) || q.type !== QuestionType.MULTIPLE_CHOICE ) && (
                             <div className="mt-2 text-base font-medium">
                                <span className="underline mr-2">Đáp án:</span> 
                                <span className="whitespace-pre-line">{q.correctAnswer}</span>
                             </div>
                         )}

                         {q.explanation && (
                           <p className="text-gray-700 mt-2 italic flex gap-2 border-t border-black/10 pt-2">
                             <span>💡</span> 
                             <span>{q.explanation}</span>
                           </p>
                         )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Control Bar (Hidden on Print) */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-3 md:p-4 no-print flex flex-wrap justify-between items-center gap-4">
        
        {/* Left: Navigation & Regenerate */}
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1">
                <Home size={20} /> <span className="hidden sm:inline">Thoát</span>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {onRegenerate && (
                <button 
                    onClick={handleShuffle}
                    className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-100 text-purple-700 border border-purple-200 font-bold hover:bg-purple-200 transition-all"
                    title="Tạo đề mới ngẫu nhiên"
                >
                    <Shuffle size={18} />
                    <span>Đổi Đề Khác</span>
                </button>
            )}
        </div>
        
        {/* Right: Actions */}
        <div className="flex gap-2 items-center">
          
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gray-100 text-gray-700 border border-gray-300 font-bold hover:bg-gray-200 transition-all"
          >
            <RefreshCcw size={18} />
            <span className="hidden sm:inline">Làm Lại</span>
          </button>

          {!isSubmitted && (
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Send size={18} />
                <span>Nộp Bài</span>
              </button>
          )}
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-900 transition-colors shadow-sm ml-1"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">In</span>
          </button>
        </div>
      </div>

      {/* Paper Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-10 bg-white shadow-xl mt-6 min-h-[29.7cm] print:shadow-none print:mt-0 print:p-0 print:w-full">
        
        {/* Header */}
        <div className={`border-4 rounded-xl p-6 mb-8 text-center relative overflow-hidden ${getHeaderColor()} print:border-black print:bg-white print:text-black`}>
            
            {/* Score Badge (Only visible when submitted) */}
            {isSubmitted && (
                <div className="animate-bounce absolute top-4 right-4 md:right-10 bg-white text-red-600 border-2 border-red-600 rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg rotate-12 print:hidden z-10">
                    <span className="text-xs font-bold uppercase text-gray-500">Điểm</span>
                    <span className="text-3xl font-extrabold">{mcqScore}/{totalMcqPoints}</span>
                </div>
            )}

            <div className="flex justify-between items-start mb-4 text-sm uppercase tracking-wider opacity-80 font-bold text-left">
                <span className="block">Trường: Tiểu học Ngô Quyền</span>
                <span className="block">Lớp: 1D</span>
            </div>
            <div className="flex justify-between items-start mb-6 text-sm uppercase tracking-wider opacity-80 font-bold text-left">
                <span className="block">Họ và tên: Trần Đỗ Đăng Khoa</span>
                <span className="block">Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold uppercase mb-3 font-hand tracking-wide">{test.title}</h1>
            <p className="text-lg md:text-xl opacity-90 font-medium mb-4">{test.subTitle}</p>
            
            {/* Welcome Message Banner */}
            {test.welcomeMessage && (
               <div className="bg-white/80 p-3 rounded-lg mb-4 text-lg font-hand font-bold text-blue-800 shadow-sm border border-blue-100 print:hidden animate-pulse">
                   💌 {test.welcomeMessage}
               </div>
            )}
            
            <div className="flex justify-center gap-4 text-sm font-bold no-print flex-wrap">
                 <span className="bg-white/60 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">⏱️ Thời gian: 40 phút</span>
                 <span className="bg-white/60 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                    📚 Môn: {test.subject === Subject.VIETNAMESE ? 'Tiếng Việt (Cánh Diều)' : 'Toán (Cánh Diều)'}
                 </span>
            </div>
            <div className="mt-4 hidden print:block text-center text-sm italic">
                (Thời gian làm bài: 40 phút)
            </div>
        </div>
        
        {/* Submission Feedback Message */}
        {isSubmitted && (
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm print:hidden">
                <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                    <Award /> Kết quả bài làm
                </h4>
                <p className="text-blue-800 mt-1">
                    Con đã trả lời đúng <strong>{mcqScore}</strong> trên tổng số <strong>{totalMcqPoints}</strong> điểm phần trắc nghiệm. 
                    Hãy xem lại đáp án chi tiết và tự chấm điểm phần tự luận nhé!
                </p>
            </div>
        )}

        {/* Content */}
        {renderSection('Phần 1: Trắc Nghiệm', test.questions.part1)}
        {renderSection('Phần 2: Tự Luận', test.questions.part2)}
        {renderSection('Phần 3: Toán Tư Duy', test.questions.part3)}

        {/* Game Section (Optional) */}
        {test.questions.part4.length > 0 && (
            <div className="mt-10 pt-8 border-t-4 border-dashed border-gray-200 print:break-before-page">
                <div className="flex items-center gap-3 mb-6 justify-center">
                     <span className="text-4xl animate-bounce">🎪</span>
                     <h3 className="text-2xl font-bold uppercase text-purple-600 font-hand">Góc Đố Vui</h3>
                     <span className="text-4xl animate-bounce" style={{animationDelay: '0.1s'}}>🤹</span>
                </div>
                 <div className="grid gap-4">
                    {test.questions.part4.map((q, i) => (
                        <div key={q.id} className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100 flex flex-col items-center text-center">
                            <p className="font-bold text-xl mb-3 text-purple-900">{q.image} {q.questionText}</p>
                            
                            {/* Simple toggle for game answers instead of full grading UI */}
                            {isSubmitted ? (
                                <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-purple-200 animate-fade-in w-full">
                                    <p className="text-purple-700 font-bold text-lg">👉 {q.correctAnswer}</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <input 
                                        type="text" 
                                        placeholder="Đoán xem là gì nào?"
                                        className="w-full text-center p-2 rounded-full border border-purple-200 focus:outline-none focus:border-purple-400 font-hand text-lg"
                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                        value={userAnswers[q.id] || ''}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
            </div>
        )}

        {/* Footer Advice */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 print:border-black print:bg-white print:mt-8">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
                <Award size={20} className="text-yellow-500"/> 
                <span>Gợi ý chấm điểm & Nhận xét</span>
            </h4>
            <p className="mb-4 leading-relaxed"><strong>📌 Dành cho phụ huynh:</strong> {test.advice}</p>
            <div className="mt-6 h-32 border-2 border-gray-300 border-dashed rounded-lg p-4 hidden print:block relative">
                <span className="absolute top-2 left-2 text-xs uppercase text-gray-400 font-bold">Lời phê của giáo viên:</span>
            </div>
        </div>

        <div className="mt-10 text-center text-gray-400 text-xs print:mt-12 flex items-center justify-center gap-2">
            <span>© 2024 {test.subject === Subject.VIETNAMESE ? 'Tiếng Việt' : 'Toán'} Cánh Diều Lớp 1</span>
            <span>•</span>
            <span>Biên soạn cho Kỳ 2</span>
        </div>

      </div>
    </div>
  );
};

export default TestPaper;