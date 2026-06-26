import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.inventory.deleteMany()
  await prisma.item.deleteMany()
  await prisma.attempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.childProfile.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding advanced database...')

  // 0. Create Parent and Children
  const parent = await prisma.user.create({
    data: {
      email: 'parent@example.com',
      password: '123456',
      name: 'Phụ huynh mặc định',
      children: {
        create: [
          {
            id: 'child_1',
            name: 'Bé Mặc Định',
            grade: 2,
            coins: 100
          }
        ]
      }
    }
  })

  // 0.5. Create Items
  await prisma.item.createMany({
    data: [
      { id: 'item_1', name: 'Mũ lưỡi trai', type: 'hat', price: 20, image: '🧢' },
      { id: 'item_2', name: 'Kính râm', type: 'glasses', price: 15, image: '🕶️' },
      { id: 'item_3', name: 'Vương miện', type: 'crown', price: 50, image: '👑' }
    ]
  })

  // 1. Create Topic
  const topic1 = await prisma.topic.create({
    data: {
      id: 'T1',
      name: 'Ôn tập và bổ sung',
      order: 1,
      worldTheme: 'Vương quốc Số',
      iconUrl: '/icons/world1.png'
    }
  })

  // 2. Create Lesson 1
  const lesson1 = await prisma.lesson.create({
    data: {
      id: 'L1',
      topicId: 'T1',
      name: 'Thử thách Toán Tư Duy (5 Trạm)',
      order: 1,
    }
  })

  // 3. Create ADVANCED Questions for Lesson 1
  await prisma.question.createMany({
    data: [
      {
        lessonId: 'L1',
        contentJson: JSON.stringify({
          text: 'Trạm 1: Lớp 2A có 35 học sinh. Nếu lớp có thêm 5 bạn nữ thì số nam và nữ bằng nhau. Hỏi ban đầu lớp 2A có bao nhiêu bạn nữ?',
          options: ['15', '20', '10', '25']
        }),
        answerJson: JSON.stringify({ correct: '15' }),
        difficulty: 5,
        representationType: 'multiple_choice'
      },
      {
        lessonId: 'L1',
        contentJson: JSON.stringify({
          text: 'Trạm 2: Tớ là một số có hai chữ số. Tổng hai chữ số của tớ bằng 9 và hiệu hai chữ số của tớ bằng 3. Tớ lớn hơn 50. Đố bạn biết tớ là số nào?',
        }),
        answerJson: JSON.stringify({ correct: '63' }),
        difficulty: 4,
        representationType: 'fill_number'
      },
      {
        lessonId: 'L1',
        contentJson: JSON.stringify({
          text: 'Trạm 3: Tổng của "số lớn nhất có 2 chữ số khác nhau" và "số bé nhất có 2 chữ số giống nhau" là 109. Khẳng định này Đúng hay Sai?',
        }),
        // 98 + 11 = 109 -> True
        answerJson: JSON.stringify({ correct: true }),
        difficulty: 4,
        representationType: 'true_false'
      },
      {
        lessonId: 'L1',
        contentJson: JSON.stringify({
          text: 'Trạm 4: Thử tài tính nhẩm! Hãy nối phép tính với kết quả đúng nhé.',
          left: [
            { id: 'l1', text: '25 + 18' },
            { id: 'l2', text: '42 - 17' },
            { id: 'l3', text: '8 × 5' },
            { id: 'l4', text: '56 + 14' }
          ],
          right: [
            { id: 'r1', text: '40' },
            { id: 'r2', text: '43' },
            { id: 'r3', text: '70' },
            { id: 'r4', text: '25' }
          ]
        }),
        answerJson: JSON.stringify({ 
          pairs: [
            { leftId: 'l1', rightId: 'r2' }, // 25+18 = 43
            { leftId: 'l2', rightId: 'r4' }, // 42-17 = 25
            { leftId: 'l3', rightId: 'r1' }, // 8*5 = 40
            { leftId: 'l4', rightId: 'r3' }  // 56+14 = 70
          ] 
        }),
        difficulty: 3,
        representationType: 'matching'
      },
      {
        lessonId: 'L1',
        contentJson: JSON.stringify({
          text: 'Trạm 5: Hãy chọn các số để sắp xếp thành một dãy số có quy luật:',
          items: ['21', '13', '29', '25', '17']
        }),
        // Quy luật +4: 13, 17, 21, 25, 29
        answerJson: JSON.stringify({ 
          correctOrder: ['13', '17', '21', '25', '29']
        }),
        difficulty: 5,
        representationType: 'sort_order'
      }
    ]
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
