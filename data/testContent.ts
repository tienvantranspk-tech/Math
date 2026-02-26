import { Level, TestStructure, QuestionType } from '../types';

export const TEST_DATA: Record<Level, TestStructure> = {
  [Level.BASIC]: {
    id: 'test-basic',
    level: Level.BASIC,
    title: 'ĐỀ KIỂM TRA MỨC 1 - CƠ BẢN 🟢',
    subTitle: 'Dành cho học sinh nắm vững kiến thức nền tảng',
    colorTheme: 'green',
    advice: 'Phụ huynh hãy khích lệ bé đọc to đề bài. Tập trung vào việc nhận biết số và tính toán cẩn thận.',
    questions: {
      part1: [
        {
          id: 'b1', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Số 75 đọc là:',
          options: ['Bảy mươi lăm', 'Bảy lăm', 'Bảy mươi năm'],
          correctAnswer: 'Bảy mươi lăm',
          image: '🗣️'
        },
        {
          id: 'b2', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Số liền sau của 19 là:',
          options: ['18', '20', '21'],
          correctAnswer: '20',
          image: '🔢'
        },
        {
          id: 'b3', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Kết quả của phép tính 30 + 20 là:',
          options: ['40', '50', '60'],
          correctAnswer: '50',
          image: '🧮'
        },
        {
          id: 'b4', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Đồng hồ chỉ mấy giờ?',
          image: '⏰ (Kim ngắn chỉ 3, kim dài chỉ 12)',
          options: ['12 giờ', '3 giờ', '2 giờ'],
          correctAnswer: '3 giờ'
        },
        {
          id: 'b5', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Số gồm 4 chục và 5 đơn vị là:',
          options: ['54', '45', '405'],
          correctAnswer: '45',
          image: '📦'
        }
      ],
      part2: [
        {
          id: 'b6', type: QuestionType.ESSAY, points: 2,
          questionText: 'Đặt tính rồi tính:',
          correctAnswer: 'a) 35 + 12 = 47\nb) 68 - 24 = 44',
          explanation: 'Viết số thẳng cột, tính từ phải sang trái.',
          image: '✍️\na) 35 + 12       b) 68 - 24'
        },
        {
          id: 'b7', type: QuestionType.ESSAY, points: 1,
          questionText: 'Điền dấu > < =',
          correctAnswer: '34 < 43',
          image: '⚖️ 34 ... 43'
        },
        {
          id: 'b8', type: QuestionType.ESSAY, points: 2,
          questionText: 'Lớp 1A có 20 bạn nam và 15 bạn nữ. Hỏi lớp 1A có tất cả bao nhiêu bạn?',
          correctAnswer: '35 bạn',
          explanation: 'Phép tính: 20 + 15 = 35 (bạn)',
          image: '🏫'
        }
      ],
      part3: [
        {
          id: 'b9', type: QuestionType.THINKING, points: 1,
          questionText: 'Hình bên có bao nhiêu hình tam giác?',
          image: '🔺 (Hình tam giác bị chia đôi)',
          correctAnswer: '3 hình',
          explanation: 'Gồm 2 hình nhỏ và 1 hình lớn bao quanh.'
        }
      ],
      part4: [
        {
          id: 'bg1', type: QuestionType.GAME, points: 0,
          questionText: 'Con gì ăn cỏ, đầu nhỏ có sừng?',
          correctAnswer: 'Con dê / Con trâu / Con bò',
          image: '🐄'
        }
      ]
    }
  },
  [Level.ADVANCED]: {
    id: 'test-advanced',
    level: Level.ADVANCED,
    title: 'ĐỀ KIỂM TRA MỨC 2 - NÂNG CAO 🟡',
    subTitle: 'Dành cho học sinh khá, tư duy nhanh',
    colorTheme: 'yellow',
    advice: 'Phụ huynh hướng dẫn bé đọc kỹ các bài toán có lời văn 2 bước hoặc điền số còn thiếu.',
    questions: {
      part1: [
        {
          id: 'a1', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Số lớn nhất có hai chữ số là:',
          options: ['90', '99', '100'],
          correctAnswer: '99',
          image: '🏆'
        },
        {
          id: 'a2', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Phép tính nào có kết quả bé nhất?',
          options: ['80 - 10', '30 + 30', '90 - 40'],
          correctAnswer: '90 - 40',
          image: '📉'
        },
        {
          id: 'a3', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Hôm nay là thứ Hai, ngày 12. Thứ Tư là ngày mấy?',
          options: ['Ngày 13', 'Ngày 14', 'Ngày 15'],
          correctAnswer: 'Ngày 14',
          image: '📅'
        },
        {
          id: 'a4', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Đoạn thẳng AB dài 10cm, đoạn BC dài 20cm. Cả hai đoạn dài bao nhiêu?',
          options: ['30cm', '30', '12cm'],
          correctAnswer: '30cm',
          image: '📏'
        },
        {
          id: 'a5', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Hình vuông có mấy cạnh bằng nhau?',
          options: ['2', '3', '4'],
          correctAnswer: '4',
          image: '🟩'
        }
      ],
      part2: [
        {
          id: 'a6', type: QuestionType.ESSAY, points: 2,
          questionText: 'Điền số thích hợp vào chỗ chấm:',
          correctAnswer: 'a) 45\nb) 20',
          image: '✏️\na) 30 + 15 = ...\nb) ... + 10 = 30'
        },
        {
          id: 'a7', type: QuestionType.ESSAY, points: 2,
          questionText: 'Mai có 15 cái kẹo. Lan cho Mai thêm 5 cái nữa. Sau đó Mai ăn hết 2 cái. Hỏi Mai còn lại bao nhiêu cái kẹo?',
          correctAnswer: '18 cái kẹo',
          explanation: 'Bước 1: 15 + 5 = 20. Bước 2: 20 - 2 = 18.',
          image: '🍬'
        }
      ],
      part3: [
        {
          id: 'a8', type: QuestionType.THINKING, points: 1,
          questionText: 'Tìm quy luật và điền 2 số tiếp theo: 2, 4, 6, 8, ..., ...',
          correctAnswer: '10, 12',
          image: '🚂'
        }
      ],
      part4: [
        {
          id: 'ag1', type: QuestionType.GAME, points: 0,
          questionText: 'Cái gì có mặt mà không có mắt, có kim mà không biết khâu?',
          correctAnswer: 'Cái đồng hồ',
          image: '🤔'
        }
      ]
    }
  },
  [Level.CHALLENGE]: {
    id: 'test-challenge',
    level: Level.CHALLENGE,
    title: 'ĐỀ KIỂM TRA MỨC 3 - THỬ THÁCH 🔴',
    subTitle: 'Dành cho học sinh giỏi, ôn thi học sinh giỏi',
    colorTheme: 'red',
    advice: 'Đây là các bài toán cần suy luận logic. Hãy để bé tự suy nghĩ ít nhất 5 phút mỗi câu.',
    questions: {
      part1: [
        {
          id: 'c1', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Số tròn chục liền trước số 45 là:',
          options: ['40', '44', '50'],
          correctAnswer: '40',
          image: '🎯'
        },
        {
          id: 'c2', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Tổng của số lớn nhất có 1 chữ số và số bé nhất có 2 chữ số là:',
          options: ['19', '20', '99'],
          correctAnswer: '19',
          explanation: '9 + 10 = 19',
          image: '➕'
        },
        {
          id: 'c3', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'An đứng thứ 3 trong hàng. Bình đứng thứ 8. Giữa An và Bình có mấy bạn?',
          options: ['4 bạn', '5 bạn', '3 bạn'],
          correctAnswer: '4 bạn',
          explanation: 'Các bạn thứ 4, 5, 6, 7. Tổng là 4 bạn.',
          image: '🚶‍♂️'
        },
        {
          id: 'c4', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Hình nào không phải là khối lập phương?',
          options: ['Hộp phấn', 'Viên xúc xắc', 'Quả bóng'],
          correctAnswer: 'Quả bóng',
          image: '📦'
        },
        {
          id: 'c5', type: QuestionType.MULTIPLE_CHOICE, points: 1,
          questionText: 'Đồng hồ chỉ 8 giờ. 2 giờ nữa là mấy giờ?',
          options: ['9 giờ', '10 giờ', '11 giờ'],
          correctAnswer: '10 giờ',
          image: '⌛'
        }
      ],
      part2: [
        {
          id: 'c6', type: QuestionType.ESSAY, points: 2,
          questionText: 'Viết tất cả các số có hai chữ số mà tổng hai chữ số bằng 5.',
          correctAnswer: '14, 41, 23, 32, 50',
          image: '📝'
        },
        {
          id: 'c7', type: QuestionType.ESSAY, points: 2,
          questionText: 'Dũng có một số bi. Sau khi Dũng cho Hùng 10 viên bi thì Dũng còn lại 25 viên. Hỏi lúc đầu Dũng có bao nhiêu viên bi?',
          correctAnswer: '35 viên bi',
          explanation: 'Lấy số còn lại cộng số đã cho: 25 + 10 = 35.',
          image: '🎱'
        }
      ],
      part3: [
        {
          id: 'c8', type: QuestionType.THINKING, points: 1,
          questionText: 'Điền số thích hợp vào ô trống để tổng 3 ô liền nhau luôn bằng 10:\n 2 | 5 | ? | 2 | 5 | ?',
          correctAnswer: '3',
          explanation: 'Quy luật lặp lại: 2, 5, 3, 2, 5, 3...',
          image: '🧩'
        }
      ],
      part4: [
        {
          id: 'cg1', type: QuestionType.GAME, points: 0,
          questionText: 'Vừa bằng một thước, mà bước không qua. Là cái gì?',
          correctAnswer: 'Cái bóng',
          image: '👻'
        }
      ]
    }
  }
};