import { Level, Question, QuestionType, TestStructure } from '../types';

// Helper: Random integer min <= x <= max
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Pick random element from array
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper: Convert number to Vietnamese text (Simplified for < 100)
const readNumber = (num: number): string => {
  const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
  
  if (num === 0) return 'không';
  if (num < 10) return units[num];
  
  const unitDigit = num % 10;
  const tenDigit = Math.floor(num / 10);
  
  let str = tens[tenDigit];
  if (tenDigit === 1) str = 'mười'; // Special case for teens

  if (unitDigit === 1) {
    str += (tenDigit > 1) ? ' mốt' : ' một';
  } else if (unitDigit === 5) {
    str += ' lăm';
  } else if (unitDigit !== 0) {
    str += ' ' + units[unitDigit];
  }
  
  // Capitalize first letter
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- Generators for specific question types ---

const genReadingNumber = (level: Level): Question => {
  const num = randomInt(10, 99);
  const correct = readNumber(num);
  // Distractors
  const d1 = readNumber(num + randomInt(1, 5));
  const d2 = readNumber(Math.abs(num - randomInt(1, 5)));
  
  return {
    id: `q_read_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Số ${num} đọc là:`,
    correctAnswer: correct,
    options: [correct, d1, d2].sort(() => Math.random() - 0.5),
    image: '🗣️'
  };
};

const genMathOp = (level: Level): Question => {
  const isAddition = Math.random() > 0.5;
  let a, b, result;

  if (level === Level.BASIC) {
    // No carrying/borrowing preferred
    if (isAddition) {
        a = randomInt(10, 50);
        b = randomInt(1, 9); // Simple
        result = a + b;
    } else {
        a = randomInt(20, 90);
        b = randomInt(1, 9);
        result = a - b;
    }
  } else {
    // Advanced/Challenge can have larger numbers or carrying
    if (isAddition) {
        a = randomInt(20, 60);
        b = randomInt(15, 30);
        result = a + b;
    } else {
        a = randomInt(50, 90);
        b = randomInt(20, 40);
        result = a - b;
    }
  }

  const distractor1 = result + randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
  const distractor2 = result + 10;

  return {
    id: `q_math_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Kết quả của phép tính ${a} ${isAddition ? '+' : '-'} ${b} là:`,
    correctAnswer: result.toString(),
    options: [result.toString(), distractor1.toString(), distractor2.toString()].sort(() => Math.random() - 0.5),
    image: '🧮'
  };
};

const genPredecessorSuccessor = (): Question => {
  const num = randomInt(10, 98);
  const type = Math.random() > 0.5 ? 'liền sau' : 'liền trước';
  const correct = type === 'liền sau' ? num + 1 : num - 1;
  
  return {
    id: `q_succ_${Date.now()}_${Math.random()}`,
    type: QuestionType.MULTIPLE_CHOICE,
    points: 1,
    questionText: `Số ${type} của ${num} là:`,
    correctAnswer: correct.toString(),
    options: [correct.toString(), (num).toString(), (type === 'liền sau' ? num + 2 : num - 2).toString()].sort(() => Math.random() - 0.5),
    image: '🔢'
  };
};

const genCompare = (level: Level): Question => {
    const a = randomInt(10, 90);
    const b = randomInt(10, 90);
    if (a === b) return genCompare(level); // Retry if equal

    return {
        id: `q_comp_${Date.now()}_${Math.random()}`,
        type: QuestionType.ESSAY,
        points: 1,
        questionText: `Điền dấu > < = thích hợp:`,
        correctAnswer: a > b ? `${a} > ${b}` : `${a} < ${b}`,
        image: `⚖️ ${a} ... ${b}`
    };
}

const genWordProblem = (level: Level): Question => {
    const names = ['An', 'Bình', 'Chi', 'Dũng', 'Hoa', 'Lan', 'Mai', 'Nam'];
    const items = ['cái kẹo', 'viên bi', 'quyển vở', 'bông hoa', 'cái nhãn vở'];
    const name1 = randomPick(names);
    let name2 = randomPick(names);
    while(name1 === name2) name2 = randomPick(names);
    const item = randomPick(items);

    const n1 = randomInt(10, 40);
    const n2 = randomInt(5, 15);
    
    const isAdd = Math.random() > 0.5;
    
    let text, answer, explanation;

    if (isAdd) {
        text = `${name1} có ${n1} ${item}. ${name2} cho ${name1} thêm ${n2} ${item} nữa. Hỏi ${name1} có tất cả bao nhiêu ${item}?`;
        answer = `${n1 + n2} ${item}`;
        explanation = `Phép tính: ${n1} + ${n2} = ${n1 + n2}`;
    } else {
        // Subtraction
        const total = n1 + n2; // Ensure subtraction is possible
        text = `${name1} có ${total} ${item}. ${name1} cho ${name2} ${n2} ${item}. Hỏi ${name1} còn lại bao nhiêu ${item}?`;
        answer = `${total - n2} ${item}`;
        explanation = `Phép tính: ${total} - ${n2} = ${n1}`;
    }

    return {
        id: `q_word_${Date.now()}_${Math.random()}`,
        type: QuestionType.ESSAY,
        points: 2,
        questionText: text,
        correctAnswer: answer,
        explanation: explanation,
        image: isAdd ? '🎁' : '🤝'
    };
};

// Static riddle pool
const riddles = [
    { q: 'Con gì ăn cỏ, đầu nhỏ có sừng?', a: 'Con dê / Con trâu', img: '🐄' },
    { q: 'Cái gì có mặt mà không có mắt, có kim mà không biết khâu?', a: 'Cái đồng hồ', img: '⏰' },
    { q: 'Vừa bằng một thước, mà bước không qua?', a: 'Cái bóng', img: '👻' },
    { q: 'Cây gì có hoa mà không có lá?', a: 'Cây cột điện / Hoa tuyết', img: '❄️' },
    { q: 'Con gì càng to càng nhỏ?', a: 'Con cua (càng)', img: '🦀' }
];

// --- Main Generator Function ---

export const generateTest = (level: Level): TestStructure => {
  const parts = {
    part1: [] as Question[],
    part2: [] as Question[],
    part3: [] as Question[],
    part4: [] as Question[],
  };

  // Generate Part 1: Multiple Choice (5 questions)
  parts.part1.push(genReadingNumber(level));
  parts.part1.push(genMathOp(level));
  parts.part1.push(genPredecessorSuccessor());
  
  // Specific questions based on Level
  if (level === Level.BASIC) {
     parts.part1.push({
        id: `q_time_${Date.now()}`, type: QuestionType.MULTIPLE_CHOICE, points: 1,
        questionText: 'Đồng hồ kim ngắn chỉ 3, kim dài chỉ 12 là mấy giờ?',
        options: ['12 giờ', '3 giờ', '2 giờ'], correctAnswer: '3 giờ', image: '⏰'
     });
     parts.part1.push(genMathOp(level));
  } else {
     // Advanced/Challenge logic
     const maxNum = randomInt(80, 99);
     parts.part1.push({
        id: `q_max_${Date.now()}`, type: QuestionType.MULTIPLE_CHOICE, points: 1,
        questionText: `Số lớn nhất trong các số: ${randomInt(10, 50)}, ${randomInt(51, 70)}, ${maxNum} là:`,
        options: [randomInt(10, 50).toString(), randomInt(51, 70).toString(), maxNum.toString()].sort(() => Math.random() - 0.5),
        correctAnswer: maxNum.toString(), image: '🏆'
     });
     parts.part1.push({
         id: `q_date_${Date.now()}`, type: QuestionType.MULTIPLE_CHOICE, points: 1,
         questionText: 'Hôm nay là Thứ Hai. Ngày kia là thứ mấy?',
         options: ['Thứ Tư', 'Thứ Năm', 'Thứ Ba'], correctAnswer: 'Thứ Tư', image: '📅'
     });
  }

  // Generate Part 2: Essay (3 questions)
  // 1. Math setting
  const a = randomInt(20, 60);
  const b = randomInt(10, 30);
  parts.part2.push({
      id: `q_essay_math_${Date.now()}`, type: QuestionType.ESSAY, points: 2,
      questionText: 'Đặt tính rồi tính:',
      correctAnswer: `a) ${a} + ${b} = ${a+b}\nb) ${a+b} - ${b} = ${a}`,
      explanation: 'Viết số thẳng cột.',
      image: `✍️\na) ${a} + ${b}      b) ${a+b} - ${b}`
  });

  // 2. Comparison
  parts.part2.push(genCompare(level));

  // 3. Word Problem
  parts.part2.push(genWordProblem(level));

  // Generate Part 3: Thinking (1 question)
  if (level === Level.CHALLENGE) {
      parts.part3.push({
          id: `q_think_${Date.now()}`, type: QuestionType.THINKING, points: 1,
          questionText: 'Điền số tiếp theo: 2, 5, 8, 11, ...',
          correctAnswer: '14', explanation: 'Cộng thêm 3 đơn vị.', image: '🚂'
      });
  } else {
      parts.part3.push({
        id: `q_think_${Date.now()}`, type: QuestionType.THINKING, points: 1,
        questionText: 'Hình tam giác có mấy cạnh?',
        correctAnswer: '3 cạnh', image: '🔺'
      });
  }

  // Generate Part 4: Game (1 random riddle)
  const riddle = randomPick(riddles);
  parts.part4.push({
      id: `q_game_${Date.now()}`, type: QuestionType.GAME, points: 0,
      questionText: riddle.q,
      correctAnswer: riddle.a,
      image: riddle.img
  });

  // Metadata
  let title = '', subTitle = '', colorTheme = '', advice = '', welcomeMessage = '';
  if (level === Level.BASIC) {
      title = 'ĐỀ KIỂM TRA MỨC 1 - CƠ BẢN 🟢';
      subTitle = 'Dành cho học sinh nắm vững kiến thức nền tảng';
      colorTheme = 'green';
      advice = 'Phụ huynh hãy khích lệ bé đọc to đề bài. Tập trung vào việc nhận biết số và tính toán cẩn thận.';
      welcomeMessage = "Đăng Khoa ơi, tự tin lên nhé! Bài này dễ lắm, con làm cẩn thận là được 10 điểm ngay! 🌟";
  } else if (level === Level.ADVANCED) {
      title = 'ĐỀ KIỂM TRA MỨC 2 - NÂNG CAO 🟡';
      subTitle = 'Dành cho học sinh khá, tư duy nhanh';
      colorTheme = 'yellow';
      advice = 'Phụ huynh hướng dẫn bé đọc kỹ các bài toán có lời văn 2 bước hoặc điền số còn thiếu.';
      welcomeMessage = "Mức độ khó hơn xíu nè! Đăng Khoa nhớ đọc kỹ đề bài nhé. Cố lên chàng trai! 💪";
  } else {
      title = 'ĐỀ KIỂM TRA MỨC 3 - THỬ THÁCH 🔴';
      subTitle = 'Dành cho học sinh giỏi';
      colorTheme = 'red';
      advice = 'Đây là các bài toán cần suy luận logic. Hãy để bé tự suy nghĩ ít nhất 5 phút mỗi câu.';
      welcomeMessage = "Wow! Đây là thử thách dành cho Siêu Nhân Toán Học Đăng Khoa. Tập trung cao độ nhé! 🚀";
  }

  return {
    id: `test_${level}_${Date.now()}`,
    level,
    title,
    subTitle,
    colorTheme,
    questions: parts,
    advice,
    welcomeMessage
  };
};