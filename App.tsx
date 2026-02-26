import React, { useState } from 'react';
import { Level, TestStructure } from './types';
import { generateTest } from './utils/generator';
import TestPaper from './components/TestPaper';
import { BookOpen, Star, Zap, ChevronRight, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [currentTest, setCurrentTest] = useState<TestStructure | null>(null);

  const handleSelectLevel = (level: Level) => {
    // Generate a fresh test when level is selected
    const newTest = generateTest(level);
    setCurrentTest(newTest);
  };

  const handleRegenerate = () => {
    if (currentTest) {
      const newTest = generateTest(currentTest.level);
      setCurrentTest(newTest);
    }
  };

  const handleBack = () => {
    setCurrentTest(null);
  };

  if (currentTest) {
    return (
      <TestPaper 
        key={currentTest.id} /* CRITICAL: Force remount when test ID changes */
        test={currentTest} 
        onBack={handleBack} 
        onRegenerate={handleRegenerate} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <div className="inline-block bg-white p-3 rounded-full shadow-lg mb-4">
             <span className="text-5xl">🪁</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2 font-hand">
          Toán Lớp 1 - Cánh Diều
        </h1>
        <p className="text-lg text-blue-600 font-medium">
          Bộ đề kiểm tra Học Kỳ 2 (Chuẩn Bộ GD&ĐT)
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        {/* Level 1 Card */}
        <div 
          onClick={() => handleSelectLevel(Level.BASIC)}
          className="group cursor-pointer bg-white rounded-2xl shadow-xl border-b-4 border-green-500 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MỨC 1
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600">Cơ Bản</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Dành cho học sinh nắm vững kiến thức nền tảng: Số đến 100, cộng trừ không nhớ.
            </p>
            <span className="text-green-600 font-bold flex items-center gap-1">
              Làm bài ngay <ChevronRight size={16} />
            </span>
          </div>
        </div>

        {/* Level 2 Card */}
        <div 
          onClick={() => handleSelectLevel(Level.ADVANCED)}
          className="group cursor-pointer bg-white rounded-2xl shadow-xl border-b-4 border-yellow-400 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
        >
           <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MỨC 2
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
              <Star size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-500">Nâng Cao</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Dành cho học sinh khá: Bài toán 2 bước, điền số còn thiếu, so sánh phức tạp.
            </p>
            <span className="text-yellow-600 font-bold flex items-center gap-1">
              Thử sức <ChevronRight size={16} />
            </span>
          </div>
        </div>

        {/* Level 3 Card */}
        <div 
          onClick={() => handleSelectLevel(Level.CHALLENGE)}
          className="group cursor-pointer bg-white rounded-2xl shadow-xl border-b-4 border-red-500 hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            MỨC 3
          </div>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform">
              <Zap size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-red-600">Thử Thách</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Dành cho học sinh giỏi: Toán tư duy, quy luật dãy số, bài toán logic.
            </p>
            <span className="text-red-600 font-bold flex items-center gap-1">
              Chinh phục <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p className="flex items-center justify-center gap-2">
          <PenTool size={16} /> Biên soạn bởi Giáo viên chuyên môn - Chương trình Cánh Diều
        </p>
      </footer>
    </div>
  );
};

export default App;