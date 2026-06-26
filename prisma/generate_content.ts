import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 14 Chủ đề Toán 2 KNTT
const TOPICS = [
  'Ôn tập và bổ sung',
  'Phép cộng, phép trừ qua 10 trong phạm vi 20',
  'Làm quen với khối lượng, dung tích',
  'Phép cộng, phép trừ có nhớ trong phạm vi 100',
  'Làm quen với hình phẳng',
  'Ngày, tháng, xem đồng hồ',
  'Phép nhân, phép chia',
  'Làm quen với hình khối',
  'Các số đến 1000',
  'Phép cộng, phép trừ không nhớ trong phạm vi 1000',
  'Độ dài, khối lượng, dung tích',
  'Phép cộng, phép trừ có nhớ trong phạm vi 1000',
  'Làm quen với yếu tố thống kê, xác suất',
  'Ôn tập cuối năm'
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMultipleChoice() {
  const a = getRandomInt(20, 50);
  const b = getRandomInt(10, 40);
  const correct = a + b;
  const options = [correct, correct + 10, correct - 5, correct + 2].sort(() => 0.5 - Math.random());
  return {
    contentJson: JSON.stringify({
      text: `Trạm đố: Lớp 2 có ${a} bạn nữ và ${b} bạn nam. Hỏi cả lớp có bao nhiêu bạn?`,
      options: options.map(String)
    }),
    answerJson: JSON.stringify({ correct: String(correct) }),
    representationType: 'multiple_choice'
  }
}

function generateFillNumber() {
  const sum = getRandomInt(11, 18);
  const diff = getRandomInt(1, 7);
  // (a+b)=sum, (a-b)=diff -> 2a = sum+diff => a = (sum+diff)/2, so sum+diff must be even
  let s = sum, d = diff;
  if ((s + d) % 2 !== 0) s += 1;
  const a = (s + d) / 2;
  const b = s - a;
  const target = a * 10 + b;
  return {
    contentJson: JSON.stringify({
      text: `Tớ là số có 2 chữ số. Tổng 2 chữ số của tớ bằng ${s}, hiệu 2 chữ số của tớ bằng ${d}. Chữ số hàng chục lớn hơn chữ số hàng đơn vị. Tớ là số nào?`,
    }),
    answerJson: JSON.stringify({ correct: String(target) }),
    representationType: 'fill_number'
  }
}

function generateTrueFalse() {
  const isTrue = Math.random() > 0.5;
  const a = getRandomInt(40, 90);
  const b = getRandomInt(10, 30);
  const target = isTrue ? a + b : a + b + getRandomInt(1, 5);
  return {
    contentJson: JSON.stringify({
      text: `Khẳng định sau Đúng hay Sai: Tổng của ${a} và ${b} là ${target}.`,
    }),
    answerJson: JSON.stringify({ correct: isTrue }),
    representationType: 'true_false'
  }
}

function generateMatching() {
  const pairs = [];
  for(let i=0; i<4; i++){
    const a = getRandomInt(10, 50);
    const b = getRandomInt(10, 40);
    pairs.push({ eq: `${a} + ${b}`, res: String(a+b), idL: `l${i}`, idR: `r${i}` });
  }
  const rightOptions = [...pairs].sort(() => 0.5 - Math.random());
  
  return {
    contentJson: JSON.stringify({
      text: `Thử tài tính nhẩm! Ghép phép tính với kết quả đúng.`,
      left: pairs.map(p => ({ id: p.idL, text: p.eq })),
      right: rightOptions.map(p => ({ id: p.idR, text: p.res }))
    }),
    answerJson: JSON.stringify({ 
      pairs: pairs.map(p => ({ leftId: p.idL, rightId: p.idR })) 
    }),
    representationType: 'matching'
  }
}

function generateSortOrder() {
  const start = getRandomInt(10, 50);
  const step = getRandomInt(2, 6);
  const arr = [start, start + step, start + step*2, start + step*3, start + step*4];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return {
    contentJson: JSON.stringify({
      text: `Sắp xếp các số sau để tạo thành dãy số tăng dần:`,
      items: shuffled.map(String)
    }),
    answerJson: JSON.stringify({ 
      correctOrder: arr.map(String)
    }),
    representationType: 'sort_order'
  }
}

function generateMeasuringLength() {
  const length = getRandomInt(3, 11);
  const items = ['bút chì', 'bút sáp', 'băng giấy', 'chiếc tẩy', 'chiếc bút mực'];
  const item = items[getRandomInt(0, items.length - 1)];
  return {
    contentJson: JSON.stringify({
      text: `Trạm quan sát: Chiếc ${item} dưới đây dài bao nhiêu xăng-ti-mét?`,
      length: length,
      itemName: item
    }),
    answerJson: JSON.stringify({ correct: String(length) }),
    representationType: 'measuring_length'
  };
}

function generateClockTime() {
  const hour = getRandomInt(1, 12);
  const minuteChoices = [0, 15, 30, 45];
  const minute = minuteChoices[getRandomInt(0, minuteChoices.length - 1)];
  return {
    contentJson: JSON.stringify({
      text: `Trạm đồng hồ: Đồng hồ dưới đây đang chỉ mấy giờ?`,
      hour: hour,
      minute: minute
    }),
    answerJson: JSON.stringify({
      correctHour: String(hour),
      correctMinute: String(minute)
    }),
    representationType: 'clock_time'
  };
}

async function main() {
  console.log('Generating 75 Lessons...')

  // Delete old topics/lessons except those seeded manually maybe?
  // We will just clear all topics and recreate them
  await prisma.attempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.topic.deleteMany()

  let lessonOrder = 1;
  const questionsData = [];

  for (let t = 0; t < TOPICS.length; t++) {
    const topic = await prisma.topic.create({
      data: {
        id: `T_GEN_${t}`,
        name: TOPICS[t],
        order: t + 1,
        worldTheme: `Vương quốc số ${t+1}`,
        iconUrl: '/icons/world1.png'
      }
    });

    const lessonsInTopic = (t === 0 || t === TOPICS.length - 1) ? 6 : 5; // roughly 75 lessons total (14*5 + 2 = 72.. lets just do 5 to 6)

    for (let l = 0; l < lessonsInTopic; l++) {
      const lesson = await prisma.lesson.create({
        data: {
          id: `L_GEN_${topic.id}_${l}`,
          topicId: topic.id,
          name: `Bài học ${lessonOrder}`,
          order: lessonOrder,
        }
      });

      // 5 questions per lesson out of 7 possible types
      const qTypes = [
        generateMultipleChoice(),
        generateFillNumber(),
        generateTrueFalse(),
        generateMatching(),
        generateSortOrder(),
        generateMeasuringLength(),
        generateClockTime()
      ].sort(() => 0.5 - Math.random());

      for (let q = 0; q < 5; q++) {
        questionsData.push({
          lessonId: lesson.id,
          contentJson: qTypes[q].contentJson,
          answerJson: qTypes[q].answerJson,
          difficulty: getRandomInt(3, 5),
          representationType: qTypes[q].representationType
        });
      }

      lessonOrder++;
    }
  }

  await prisma.question.createMany({
    data: questionsData
  });

  console.log(`Generated ${lessonOrder - 1} lessons and ${questionsData.length} questions!`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
