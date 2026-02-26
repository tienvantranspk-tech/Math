import { Level, Question, QuestionType, TestStructure, Subject } from '../types';

// Helper: Random integer min <= x <= max
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Pick random element from array
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Data ---

const vocabWords = [
  { word: 'con mèo', image: '🐱', distractors: ['con chó', 'con gà', 'con heo'] },
  { word: 'quả táo', image: '🍎', distractors: ['quả cam', 'quả chuối', 'quả dưa'] },
  { word: 'bông hoa', image: '🌸', distractors: ['cái lá', 'cái cây', 'cỏ xanh'] },
  { word: 'ngôi nhà', image: '🏠', distractors: ['cái bàn', 'cái ghế', 'cái cửa'] },
  { word: 'xe đạp', image: '🚲', distractors: ['xe máy', 'ô tô', 'máy bay'] },
  { word: 'quyển sách', image: '📚', distractors: ['cái bút', 'cái thước', 'cục tẩy'] },
  { word: 'mặt trời', image: '☀️', distractors: ['mặt trăng', 'ngôi sao', 'đám mây'] },
  { word: 'cái ô', image: '☂️', distractors: ['cái mũ', 'cái áo', 'cái khăn'] },
];

const fillInBlankSentences = [
  { sentence: 'Con ___ đang bắt chuột.', answer: 'mèo', options: ['mèo', 'chó', 'gà'] },
  { sentence: 'Bé đi học ___ đúng giờ.', answer: 'đúng', options: ['đúng', 'sai', 'muộn'] },
  { sentence: 'Mẹ đi chợ mua ___ cá.', answer: 'con', options: ['con', 'cái', 'chiếc'] },
  { sentence: 'Trời mưa thì phải che ___.', answer: 'ô', options: ['ô', 'mũ', 'khăn'] },
  { sentence: 'Em yêu trường ___ của em.', answer: 'lớp', options: ['lớp', 'nhà', 'phố'] },
];

const rhymes = [
  { text: 'Con cò bay lả bay ___', answer: 'la', options: ['la', 'xa', 'qua'] },
  { text: 'Công cha như núi Thái ___', answer: 'Sơn', options: ['Sơn', 'Cao', 'Lớn'] },
  { text: 'Học thầy không tày học ___', answer: 'bạn', options: ['bạn', 'bè', 'anh'] },
];

const sentenceOrdering = [
  { words: ['Bé', 'đi', 'học', 'ngoan'], correct: 'Bé đi học ngoan' },
  { words: ['Mẹ', 'mua', 'quà', 'cho', 'bé'], correct: 'Mẹ mua quà cho bé' },
  { words: ['Em', 'yêu', 'cây', 'xanh'], correct: 'Em yêu cây xanh' },
  { words: ['Trời', 'hôm', 'nay', 'đẹp', 'quá'], correct: 'Trời hôm nay đẹp quá' },
];

const readingPassages = [
  {
    text: "Nhà bà ngoại có đàn gà. Gà mái đẻ trứng vàng. Gà trống gáy ò ó o. Bà cho gà ăn thóc.",
    questions: [
      { q: "Nhà bà ngoại có con gì?", a: "Đàn gà", opts: ["Đàn gà", "Đàn vịt", "Đàn chó"] },
      { q: "Gà trống gáy như thế nào?", a: "Ò ó o", opts: ["Ò ó o", "Cục tác", "Chiếp chiếp"] }
    ]
  },
  {
    text: "Mùa xuân về, cây cối đâm chồi nảy lộc. Hoa đào nở đỏ thắm. Chim én bay lượn trên bầu trời.",
    questions: [
      { q: "Mùa nào cây cối đâm chồi nảy lộc?", a: "Mùa xuân", opts: ["Mùa xuân", "Mùa hè", "Mùa đông"] },
      { q: "Hoa đào nở màu gì?", a: "Đỏ thắm", opts: ["Đỏ thắm", "Vàng tươi", "Trắng tinh"] }
    ]
  }
];

// --- Generators ---

const genVocabImage = (): Question => {
  const item = randomPick(vocabWords);
  const options = [item.word, ...item.distractors.slice(0, 2)].sort(() => Math.random() - 0.5);
  
  return {
    id: `v_img_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Hình bên là cái gì?`,
    correctAnswer: item.word,
    options: options,
    image: item.image
  };
};

const genFillBlank = (): Question => {
  const item = randomPick(fillInBlankSentences);
  return {
    id: `v_fill_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Điền từ thích hợp vào chỗ trống: "${item.sentence}"`,
    correctAnswer: item.answer,
    options: item.options.sort(() => Math.random() - 0.5),
    image: '📝'
  };
};

const genRhyme = (): Question => {
  const item = randomPick(rhymes);
  return {
    id: `v_rhyme_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Điền từ còn thiếu vào câu ca dao/tục ngữ: "${item.text}"`,
    correctAnswer: item.answer,
    options: item.options.sort(() => Math.random() - 0.5),
    image: '🎶'
  };
};

const genSentenceOrder = (level: Level): Question => {
  const item = randomPick(sentenceOrdering);
  const shuffled = [...item.words].sort(() => Math.random() - 0.5);
  
  return {
    id: `v_order_${Date.now()}_${Math.random()}`,
    type: QuestionType.ESSAY,
    points: 2,
    questionText: `Sắp xếp các từ sau thành câu hoàn chỉnh: ${shuffled.join(' / ')}`,
    correctAnswer: item.correct,
    explanation: 'Chú ý viết hoa chữ cái đầu câu.',
    image: '🔤'
  };
};

const genReadingComp = (level: Level): Question[] => {
  const passage = randomPick(readingPassages);
  const qs: Question[] = [];
  
  // Add passage as a "question" or context? 
  // For simplicity, I'll attach the passage to the first question or make a special "Reading" type.
  // But our types are limited. Let's put the passage in the question text of the first question.
  
  passage.questions.forEach((q, idx) => {
    qs.push({
      id: `v_read_${Date.now()}_${Math.random()}_${idx}`,
      type: QuestionType.MULTIPLE_CHOICE,
      points: 1,
      questionText: idx === 0 ? `Đọc đoạn văn sau và trả lời câu hỏi:\n\n"${passage.text}"\n\n${q.q}` : q.q,
      correctAnswer: q.a,
      options: q.opts.sort(() => Math.random() - 0.5),
      image: idx === 0 ? '📖' : undefined
    });
  });
  
  return qs;
};

const genHandwriting = (): Question => {
    const phrases = ['Em yêu Tổ quốc', 'Non sông gấm vóc', 'Học tập chăm chỉ', 'Lễ phép vâng lời'];
    const phrase = randomPick(phrases);
    return {
        id: `v_write_${Date.now()}_${Math.random()}`,
        type: QuestionType.ESSAY,
        points: 2,
        questionText: `Tập chép: Em hãy viết lại câu sau thật đẹp:\n"${phrase}"`,
        correctAnswer: phrase,
        explanation: 'Viết đúng chính tả, nắn nót từng chữ.',
        image: '✍️'
    };
}

// --- Main Generator ---

export const generateVietnameseTest = (level: Level): TestStructure => {
  const parts = {
    part1: [] as Question[],
    part2: [] as Question[],
    part3: [] as Question[],
    part4: [] as Question[],
  };

  // Part 1: Multiple Choice (Vocabulary, Reading)
  parts.part1.push(genVocabImage());
  parts.part1.push(genVocabImage());
  parts.part1.push(genFillBlank());
  parts.part1.push(genRhyme());
  
  // Reading Comprehension (2 questions)
  const readingQs = genReadingComp(level);
  parts.part1.push(...readingQs);

  // Part 2: Essay (Writing, Ordering)
  parts.part2.push(genHandwriting());
  parts.part2.push(genSentenceOrder(level));
  
  // Part 3: Thinking (Word games)
  if (level === Level.CHALLENGE) {
      parts.part3.push({
          id: `v_think_${Date.now()}`, type: QuestionType.THINKING, points: 1,
          questionText: 'Tìm 3 từ có vần "an"?',
          correctAnswer: 'bàn, ghế, nhãn, ...', explanation: 'Các từ có chứa vần an.', image: '🧠'
      });
  } else {
      parts.part3.push({
          id: `v_think_${Date.now()}`, type: QuestionType.THINKING, points: 1,
          questionText: 'Tìm từ trái nghĩa với "đen"?',
          correctAnswer: 'trắng', image: '⚪⚫'
      });
  }

  // Part 4: Game (Riddle)
  const riddles = [
      { q: 'Cái gì để đo, giúp em kẻ thẳng?', a: 'Cái thước kẻ', img: '📏' },
      { q: 'Hạt gì nho nhỏ, gà mẹ mổ ngay?', a: 'Hạt thóc', img: '🌾' }
  ];
  const r = randomPick(riddles);
  parts.part4.push({
      id: `v_game_${Date.now()}`, type: QuestionType.GAME, points: 0,
      questionText: r.q,
      correctAnswer: r.a,
      image: r.img
  });

  // Metadata
  let title = '', subTitle = '', colorTheme = '', advice = '', welcomeMessage = '';
  if (level === Level.BASIC) {
      title = 'TIẾNG VIỆT - CƠ BẢN 🟢';
      subTitle = 'Luyện đọc, viết câu đơn giản';
      colorTheme = 'green';
      advice = 'Phụ huynh hãy cùng bé đọc to các đoạn văn. Chú ý sửa ngọng (l/n) nếu có.';
      welcomeMessage = "Chào bé yêu! Hôm nay mình cùng học Tiếng Việt thật vui nhé! 🇻🇳";
  } else if (level === Level.ADVANCED) {
      title = 'TIẾNG VIỆT - NÂNG CAO 🟡';
      subTitle = 'Mở rộng vốn từ, đọc hiểu';
      colorTheme = 'yellow';
      advice = 'Khuyến khích bé tự đặt câu với các từ mới học.';
      welcomeMessage = "Bé đã sẵn sàng trở thành nhà văn nhí chưa nào? Cố lên nhé! ✍️";
  } else {
      title = 'TIẾNG VIỆT - THỬ THÁCH 🔴';
      subTitle = 'Tư duy ngôn ngữ, sáng tạo';
      colorTheme = 'red';
      advice = 'Đây là các bài tập khó về ngữ pháp và tư duy. Hãy kiên nhẫn giải thích cho bé.';
      welcomeMessage = "Thử thách Tiếng Việt dành cho bé giỏi đây! Chinh phục ngay thôi! 🚀";
  }

  return {
    id: `test_vn_${level}_${Date.now()}`,
    subject: Subject.VIETNAMESE,
    level,
    title,
    subTitle,
    colorTheme,
    questions: parts,
    advice,
    welcomeMessage
  };
};
