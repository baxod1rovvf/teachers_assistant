// Skills course: the content of every step (2026-11-05: 20 steps — Beginner b1…b10 = Steps 1–10, then Elementary
// e1…e10 = Steps 11–20; e1…e10 were "Level 1…10" before, and old links ?lv=N open eN). Four skills each.
// Read by the student page (skill.html) and by Loom's Course tab. English names and places only (the teacher's rule).
// A step: { id (stable: kept in links, ta_skills_links keys and results), no (its shown number = position),
//   stage: 'Beginner' | 'Elementary', theme, emoji, listening?, reading?, writing?, speaking? }.
//
// listening: src = the recording (made with tools/make-course-audio.py from audio/skills/elementary-scripts.json —
//   keep `transcript` in step with that file; a spelled line is written as the recording says it: "That's T, H, …").
//   questions[i].a = accepted answers, the first is the one shown as right. transcript[].answers = the question
//   numbers (1–10) whose answer is said in that line.
// reading: text = sentences; `line` is a sentence's index when the text is split with /(?<=[.!?])\s+/
//   (a blank line between paragraphs is fine). Question types: tfng ('True' / 'False' / 'Not given'), tf ('True' /
//   'False' — beginner steps), gap, choose (answers are the option's own text). Any number of questions.
// speaking: questions[i] = { q, use: words the student can use }. Nothing is recorded or sent.
// A step without any of the four skills is "Coming soon".

var TA_SKILLS = {
  steps: [
    {
      id: 'b1', no: 1, stage: 'Beginner', theme: 'Hello!', emoji: '👋',
      listening: {
        src: 'audio/skills/beg-1-listening.mp3?v=1',
        title: 'A new student at an English club',
        intro: 'Listen to a teacher and a new student. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: "Teacher's name: _____", a: ['Kate'] },
          { q: "Student's name: _____", a: ['Sam'] },
          { q: "Sam's age: _____", a: ['16', 'sixteen'] },
          { q: 'Sam is from: _____', a: ['London'] },
          { q: "Sam's brother: _____", a: ['Tom'] },
          { q: "Tom's age: _____", a: ['12', 'twelve'] },
          { q: 'Classroom: room _____', a: ['9', 'nine'] },
          { q: 'Students in the class: _____', a: ['14', 'fourteen'] },
          { q: "The lesson starts at: _____ o'clock", a: ['4', 'four'] },
          { q: 'Open the book at page: _____', a: ['5', 'five'] }
        ],
        words: [
          { w: 'hello', emoji: '👋', m: 'what you say when you meet someone', ex: 'Hello, Kate. Nice to meet you.' },
          { w: 'teacher', emoji: '👩‍🏫', m: 'a person who helps you learn at school', ex: "I'm your teacher." },
          { w: 'student', emoji: '🎒', m: 'a person who learns at a school or a club', ex: 'Sam is a new student.' },
          { w: 'nice to meet you', emoji: '🤝', m: 'what you say to a new person', ex: 'Hello, Kate. Nice to meet you.' },
          { w: 'spell', emoji: '🔤', m: 'to say the letters of a word one by one', ex: 'How do you spell your name?' },
          { w: 'years old', emoji: '🎂', m: 'how we say our age', ex: "I'm sixteen years old." },
          { w: 'from', emoji: '🌍', m: 'the place where you were born or live', ex: "I'm from London." },
          { w: 'brother', emoji: '👦', m: 'a boy in your family, with the same mum and dad', ex: "I've got a brother." },
          { w: 'classroom', emoji: '🚪', m: 'the room where you have lessons', ex: 'Our classroom is room nine.' },
          { w: 'page', emoji: '📖', m: 'one side of paper in a book', ex: 'Please open your book at page five.' }
        ],
        transcript: [
          { who: 'Woman', text: "Step one. You will hear a teacher and a new student at an English club. Listen and write the answers.", answers: [] },
          { who: 'Woman', text: "Hello, and welcome to the English club! I'm your teacher. My name is Kate.", answers: [] },
          { who: 'Man', text: "Hello, Kate. Nice to meet you. How do you spell your name, please?", answers: [] },
          { who: 'Woman', text: "That's K, A, T, E.", answers: [1] },
          { who: 'Woman', text: "Thank you. And what's your name?", answers: [] },
          { who: 'Man', text: "My name is Sam. I'll spell it for you.", answers: [] },
          { who: 'Man', text: "That's S, A, M.", answers: [2] },
          { who: 'Woman', text: "Thank you, Sam. How old are you?", answers: [] },
          { who: 'Man', text: "I'm sixteen years old.", answers: [3] },
          { who: 'Woman', text: "Sixteen years old? Good.", answers: [3] },
          { who: 'Woman', text: "And where are you from, Sam?", answers: [] },
          { who: 'Man', text: "I'm from London. I live here with my family.", answers: [4] },
          { who: 'Woman', text: "Have you got a brother or a sister?", answers: [] },
          { who: 'Man', text: "Yes, I've got a brother. His name is Tom.", answers: [5] },
          { who: 'Woman', text: "How old is Tom?", answers: [] },
          { who: 'Man', text: "He's twelve years old.", answers: [6] },
          { who: 'Woman', text: "Twelve? OK.", answers: [6] },
          { who: 'Woman', text: "Our classroom is room nine. It's next to the library.", answers: [7] },
          { who: 'Man', text: "Room nine. Thank you.", answers: [7] },
          { who: 'Woman', text: "There are fourteen students in our class.", answers: [8] },
          { who: 'Man', text: "Fourteen students? That's a nice class.", answers: [8] },
          { who: 'Woman', text: "Our lesson starts at four o'clock.", answers: [9] },
          { who: 'Man', text: "Four o'clock. OK.", answers: [9] },
          { who: 'Woman', text: "Now, please open your book at page five.", answers: [10] },
          { who: 'Man', text: "Page five? OK, I've got it.", answers: [10] },
          { who: 'Woman', text: "Very good, Sam. Let's start!", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "A Day in My Life",
        text: "My name is Daniel, and I am a 17-year-old student. I usually wake up at 7 o'clock in the morning. First, I take a shower and get dressed. Then, I have breakfast with my family. I usually eat eggs and bread and drink a cup of tea.\n\n" +
          "I go to school at 8 o'clock. My lessons start at 8:30 and finish at 2 p.m. My favourite subjects are English and history because I enjoy learning new things. During the break, I talk to my classmates and sometimes play games with them.\n\n" +
          "After school, I come home and have lunch. Then, I do my homework and help my parents with some housework. In the evening, I sometimes watch movies, listen to music or go for a walk with my friends.\n\n" +
          "I usually have dinner at 8 p.m. After dinner, I spend some time with my family. Before going to bed, I read a book or watch a few videos. I usually go to bed at 10:30.\n\n" +
          "I like my daily routine because I have enough time for studying, relaxing and spending time with people I love.",
        words: [
          { w: "Usually", uz: "Odatda", emoji: "🔁", ex: "I usually wake up at 7 o'clock in the morning." },
          { w: "Get dressed", uz: "Kiyinmoq", emoji: "👕", ex: "First, I take a shower and get dressed." },
          { w: "Have breakfast", uz: "Nonushta qilmoq", emoji: "🍳", ex: "Then, I have breakfast with my family." },
          { w: "Lesson", uz: "Dars", emoji: "📘", ex: "My lessons start at 8:30 and finish at 2 p.m." },
          { w: "Favourite subject", uz: "Sevimli fan", emoji: "❤️", ex: "My favourite subjects are English and history because I enjoy learning new things." },
          { w: "Classmate", uz: "Sinfdosh", emoji: "🧑‍🎓", ex: "During the break, I talk to my classmates and sometimes play games with them." },
          { w: "Break", uz: "Tanaffus", emoji: "🔔", ex: "Then, I have breakfast with my family." },
          { w: "Housework", uz: "Uy ishlari", emoji: "🧹", ex: "Then, I do my homework and help my parents with some housework." },
          { w: "Spend time", uz: "Vaqt o'tkazmoq", emoji: "⏳", ex: "After dinner, I spend some time with my family." },
          { w: "Daily routine", uz: "Kundalik tartib", emoji: "📅", ex: "I like my daily routine because I have enough time for studying, relaxing and spending time with people I love." }
        ],
        questions: [
          { type: "tf", q: "Daniel is 16 years old.", a: ["False"], line: 0 },
          { type: "tf", q: "He wakes up at 7 o'clock.", a: ["True"], line: 1 },
          { type: "tf", q: "He goes to school at 9 o'clock.", a: ["False"], line: 5 },
          { type: "tf", q: "His favourite subjects are English and history.", a: ["True"], line: 7 },
          { type: "tf", q: "He sometimes plays games with his classmates.", a: ["True"], line: 8 },
          { type: "open", q: "What does Daniel do after waking up?", keys: ["shower","dressed"], line: 2 },
          { type: "open", q: "What time do his lessons finish?", keys: ["2","two"], line: 6 },
          { type: "open", q: "What does he do after school?", keys: ["lunch","homework","housework"], line: 9 },
          { type: "open", q: "How does he spend his evenings?", keys: ["movie","music","walk"], line: 11 },
          { type: "open", q: "Why does he like his daily routine?", keys: ["enough time","studying","relaxing","people he loves","people i love"], line: 16 }
        ],
        retell: "Retell Daniel's day in your own words, from the morning to the evening."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Daily Routine",
        instruction: "Describe a normal day in your life, from the moment you wake up until you go to bed. Say what you do in the morning, in the afternoon and in the evening.",
        words: [
          { w: "wake up", uz: "uyg'onmoq" },
          { w: "get dressed", uz: "kiyinmoq" },
          { w: "have breakfast", uz: "nonushta qilmoq" },
          { w: "usually", uz: "odatda" },
          { w: "after school", uz: "maktabdan keyin" },
          { w: "do homework", uz: "uy vazifasini bajarmoq" },
          { w: "in the evening", uz: "kechqurun" },
          { w: "go to bed", uz: "uxlashga yotmoq" }
        ],
        minWords: 80, maxWords: 100, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Daily Routine",
        words: [
          { w: "Wake up", uz: "Uyg'onmoq", emoji: "⏰", ex: "I wake up at seven o'clock." },
          { w: "Get dressed", uz: "Kiyinmoq", emoji: "👕", ex: "I get dressed after breakfast." },
          { w: "Have breakfast", uz: "Nonushta qilmoq", emoji: "🍳", ex: "I have breakfast with my family." },
          { w: "Go to work", uz: "Ishga bormoq", emoji: "💼", ex: "My dad goes to work by bus." },
          { w: "Come home", uz: "Uyga kelmoq", emoji: "🏠", ex: "I come home at four o'clock." },
          { w: "Do homework", uz: "Uy vazifasini bajarmoq", emoji: "📝", ex: "I do my homework in the evening." },
          { w: "Take a shower", uz: "Dush qabul qilmoq", emoji: "🚿", ex: "I take a shower every morning." },
          { w: "Have a rest", uz: "Dam olmoq", emoji: "🛋️", ex: "After school, I have a rest." },
          { w: "Go to bed", uz: "Uxlashga yotmoq", emoji: "🛏️", ex: "I go to bed at ten o'clock." },
          { w: "Every day", uz: "Har kuni", emoji: "📅", ex: "I read a book every day." }
        ],
        questions: [
          { q: "What time do you wake up?", use: ["I wake up at …","every day","on Sundays"] },
          { q: "What do you have for breakfast?", use: ["I have … for breakfast","bread","eggs","tea"] },
          { q: "How do you go to school or work?", use: ["I go to … by bus / on foot","It takes … minutes"] },
          { q: "What do you do after school?", use: ["I come home and …","I do my homework","I have a rest"] },
          { q: "What time do you go to bed?", use: ["I go to bed at …","before that, I …"] }
        ],
        part2: { topic: "Talk about your daily routine", hints: ["what you do in the morning","what you do in the afternoon","what you do in the evening"], seconds: 30 }
      }
    },
    {
      id: 'b2', no: 2, stage: 'Beginner', theme: 'Numbers 1–20', emoji: '🔢',
      listening: {
        src: 'audio/skills/beg-2-listening.mp3?v=1',
        title: 'A new student at a school office',
        intro: 'Listen to a new student at a school office. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'First name: _____', a: ['Ben'] },
          { q: 'Surname: _____', a: ['Hart'] },
          { q: 'Age: _____', a: ['13', 'thirteen'] },
          { q: 'Classroom: room _____', a: ['17', 'seventeen'] },
          { q: 'Phone number: _____', a: ['07700 900 517', '07700900517'] },
          { q: 'Locker number: _____', a: ['11', 'eleven'] },
          { q: 'Bus number: _____', a: ['20', 'twenty'] },
          { q: 'Students in the class: _____', a: ['19', 'nineteen'] },
          { q: 'Lessons every day: _____', a: ['6', 'six'] },
          { q: "English teacher's room: room _____", a: ['14', 'fourteen'] }
        ],
        words: [
          { w: 'new', emoji: '🆕', m: 'here for the first time', ex: 'Are you a new student?' },
          { w: 'surname', emoji: '🪪', m: 'your family name', ex: 'Can you spell your surname?' },
          { w: 'first name', emoji: '📛', m: 'the name your family calls you', ex: 'My first name is Ben.' },
          { w: 'thirteen', emoji: '🔢', m: 'the number 13', ex: "I'm thirteen years old." },
          { w: 'room', emoji: '🚪', m: 'a part of a building with walls and a door', ex: 'Your classroom is room seventeen.' },
          { w: 'phone number', emoji: '📞', m: 'the numbers you use to call someone', ex: "What's your phone number, please?" },
          { w: 'locker', emoji: '🔐', m: 'a small cupboard at school for your things', ex: "This is your locker. It's number eleven." },
          { w: 'bus', emoji: '🚌', m: 'a big car for a lot of people', ex: 'I come on bus number twenty.' },
          { w: 'lesson', emoji: '📚', m: 'a time when you learn something at school', ex: 'You have six lessons every day.' },
          { w: 'every day', emoji: '📅', m: 'on all the days', ex: 'You have six lessons every day.' }
        ],
        transcript: [
          { who: 'Woman', text: "Step two. You will hear a new student at a school office. Listen and write the answers.", answers: [] },
          { who: 'Woman', text: "Hello. Are you a new student?", answers: [] },
          { who: 'Man', text: "Yes, I am. My name is Ben Hart.", answers: [] },
          { who: 'Woman', text: "Can you spell your first name, please?", answers: [] },
          { who: 'Man', text: "That's B, E, N.", answers: [1] },
          { who: 'Woman', text: "Thank you. And can you spell your surname?", answers: [] },
          { who: 'Man', text: "That's H, A, R, T.", answers: [2] },
          { who: 'Woman', text: "Thank you, Ben. How old are you?", answers: [] },
          { who: 'Man', text: "I'm thirteen years old.", answers: [3] },
          { who: 'Woman', text: "Thirteen years old? Good.", answers: [3] },
          { who: 'Woman', text: "Your classroom is room seventeen.", answers: [4] },
          { who: 'Man', text: "Room seventeen? OK, thank you.", answers: [4] },
          { who: 'Woman', text: "What's your phone number, please?", answers: [] },
          { who: 'Man', text: "It's oh seven seven double oh, nine double oh, five one seven.", answers: [5] },
          { who: 'Woman', text: "Oh seven seven double oh, nine double oh, five one seven?", answers: [5] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "This is your locker. It's number eleven.", answers: [6] },
          { who: 'Man', text: "Number eleven? Great.", answers: [6] },
          { who: 'Woman', text: "Do you come to school by bus?", answers: [] },
          { who: 'Man', text: "Yes, I do. I come on bus number twenty.", answers: [7] },
          { who: 'Woman', text: "Bus number twenty? OK.", answers: [7] },
          { who: 'Woman', text: "There are nineteen students in your class.", answers: [8] },
          { who: 'Man', text: "Nineteen students? That's a big class.", answers: [8] },
          { who: 'Woman', text: "You have six lessons every day.", answers: [9] },
          { who: 'Man', text: "Six lessons every day? OK.", answers: [9] },
          { who: 'Woman', text: "Your English teacher is in room fourteen.", answers: [10] },
          { who: 'Man', text: "Room fourteen. Thank you very much.", answers: [10] },
          { who: 'Woman', text: "You're welcome, Ben. Have a good day.", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "My Family",
        text: "There are five people in our family: my parents, my two brothers and me. We live in a flat on the fourth floor of a tall building.\n\n" +
          "My father, Michael, works at a bank. He is a calm and patient man. He leaves home early, but he always comes back for dinner. My mother, Helen, is a nurse. She works long hours, but she is never too tired to listen to us.\n\n" +
          "Jack is my older brother. He is twenty and studies at university in another city, so we only see him at the weekends. Sam is my younger brother. He is only eight, and he is very funny and full of energy.\n\n" +
          "We are a close family. We get along well, but sometimes Sam and I argue about the TV! Every Sunday, we have a big lunch together at my grandparents' house. My grandmother cooks delicious soup, and my grandfather tells us stories about his childhood.\n\n" +
          "Our flat is not very big, so Sam and I share a bedroom. It is sometimes noisy, but at night we often talk and laugh before we fall asleep.\n\n" +
          "I love my family because they always support me, and I know I can talk to them about anything.",
        words: [
          { w: "Parents", uz: "Ota-ona", emoji: "👨‍👩‍👦", ex: "There are five people in our family: my parents, my two brothers and me." },
          { w: "Older brother", uz: "Aka", emoji: "👦", ex: "Jack is my older brother." },
          { w: "Younger brother", uz: "Uka", emoji: "🧒", ex: "Sam is my younger brother." },
          { w: "Calm", uz: "Xotirjam", emoji: "😌", ex: "He is a calm and patient man." },
          { w: "Patient", uz: "Sabrli", emoji: "🕰️", ex: "He is a calm and patient man." },
          { w: "Works long hours", uz: "Uzoq soat ishlaydi", emoji: "⏰", ex: "She works long hours, but she is never too tired to listen to us." },
          { w: "Get along well", uz: "Yaxshi chiqishmoq", emoji: "🤝", ex: "We get along well, but sometimes Sam and I argue about the TV!" },
          { w: "Argue", uz: "Bahslashmoq", emoji: "🗯️", ex: "We get along well, but sometimes Sam and I argue about the TV!" },
          { w: "Childhood", uz: "Bolalik", emoji: "🧸", ex: "My grandmother cooks delicious soup, and my grandfather tells us stories about his childhood." },
          { w: "Support", uz: "Qo'llab-quvvatlamoq", emoji: "🙌", ex: "I love my family because they always support me, and I know I can talk to them about anything." }
        ],
        questions: [
          { type: "tf", q: "The family lives in a house.", a: ["False"], line: 1 },
          { type: "tf", q: "The writer's father has a job in a bank.", a: ["True"], line: 2 },
          { type: "tf", q: "Jack lives at home with the rest of the family.", a: ["False"], line: 8 },
          { type: "tf", q: "The youngest brother is eight years old.", a: ["True"], line: 10 },
          { type: "tf", q: "The family has lunch with the grandparents every Saturday.", a: ["False"], line: 13 },
          { type: "gap", q: "My mother, Helen, is a _____.", a: ["nurse"], line: 5 },
          { type: "gap", q: "Jack studies at _____ in another city.", a: ["university"], line: 8 },
          { type: "gap", q: "Sam is very funny and full of _____.", a: ["energy"], line: 10 },
          { type: "gap", q: "Every _____, the family has a big lunch at the grandparents' house.", a: ["Sunday"], line: 13 },
          { type: "gap", q: "Sam and the writer share a _____.", a: ["bedroom"], line: 15 }
        ],
        retell: "Retell the text in your own words. Talk about each person in the family and what they do on Sundays."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Family",
        instruction: "Write about the people in your family. Describe what they are like, what they do, and what you do together.",
        words: [
          { w: "parents", uz: "ota-ona" },
          { w: "older", uz: "katta (yoshi katta)" },
          { w: "younger", uz: "kichik (yoshi kichik)" },
          { w: "kind", uz: "mehribon" },
          { w: "get along with", uz: "yaxshi chiqishmoq" },
          { w: "spend time together", uz: "birga vaqt o'tkazmoq" },
          { w: "help", uz: "yordam bermoq" },
          { w: "close family", uz: "ahil oila" },
          { w: "at the weekend", uz: "dam olish kunlari" }
        ],
        minWords: 80, maxWords: 100, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Family",
        words: [
          { w: "Parents", uz: "Ota-ona", emoji: "👨‍👩‍👧", ex: "My parents are very kind." },
          { w: "Only child", uz: "Yolg'iz farzand", emoji: "🧒", ex: "I'm an only child, so I have no brothers or sisters." },
          { w: "Older brother", uz: "Aka", emoji: "👦", ex: "My older brother is seventeen." },
          { w: "Younger sister", uz: "Singil", emoji: "👧", ex: "My younger sister is five years old." },
          { w: "Get along with", uz: "Yaxshi chiqishmoq", emoji: "🤝", ex: "I get along with my brother." },
          { w: "Spend time together", uz: "Birga vaqt o'tkazmoq", emoji: "⏳", ex: "We spend time together at the weekend." },
          { w: "Take care of", uz: "G'amxo'rlik qilmoq", emoji: "💞", ex: "My mum takes care of my grandma." },
          { w: "Helpful", uz: "Yordam berishga tayyor", emoji: "🙌", ex: "My sister is very helpful at home." },
          { w: "Kind", uz: "Mehribon", emoji: "😊", ex: "My grandad is a kind man." },
          { w: "Close family", uz: "Ahil oila", emoji: "🏡", ex: "We are a close family." }
        ],
        questions: [
          { q: "How many people are there in your family?", use: ["There are … people in my family","my parents","my brother / sister"] },
          { q: "Have you got brothers or sisters?", use: ["I have got an older brother / a younger sister","I'm an only child"] },
          { q: "Who do you get along with best?", use: ["I get along with my … best","because he / she is kind"] },
          { q: "What do you do together as a family?", use: ["We spend time together …","at the weekend","we have dinner together"] },
          { q: "Who helps you at home?", use: ["My … helps me","he / she is very helpful","we take care of each other"] }
        ],
        part2: { topic: "Talk about your family", hints: ["who is in your family","what they are like","what you do together"], seconds: 30 }
      }
    },
    {
      id: 'b3', no: 3, stage: 'Beginner', theme: 'My family', emoji: '👨‍👩‍👧',
      listening: {
        src: 'audio/skills/beg-3-listening.mp3?v=1',
        title: 'A family photo',
        intro: 'Listen to a girl talking about a family photo. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: "Brother's name: _____", a: ['Jack'] },
          { q: "Jack's age: _____", a: ['10', 'ten'] },
          { q: "Sister's name: _____", a: ['Mia'] },
          { q: "Mia's age: _____", a: ['6', 'six'] },
          { q: "Mum's name: _____", a: ['Rose'] },
          { q: "Dad's name: _____", a: ['Mark'] },
          { q: "Grandma's name: _____", a: ['Ruby'] },
          { q: "Grandma's cats: _____", a: ['2', 'two'] },
          { q: "Dog's name: _____", a: ['Max'] },
          { q: "Dog's age: _____", a: ['3', 'three'] }
        ],
        words: [
          { w: 'photo', emoji: '📷', m: 'a picture you make with a camera or a phone', ex: 'Is this a photo of your family?' },
          { w: 'family', emoji: '👨‍👩‍👧‍👦', m: 'your mum, dad, brothers, sisters…', ex: 'This is a photo of my family.' },
          { w: 'brother', emoji: '👦', m: 'a boy in your family, with the same mum and dad', ex: 'This is my brother.' },
          { w: 'sister', emoji: '👧', m: 'a girl in your family, with the same mum and dad', ex: 'This is my sister.' },
          { w: 'little', emoji: '🤏', m: 'small or young', ex: 'Who is this little girl?' },
          { w: 'tall', emoji: '🦒', m: 'big from the feet to the head', ex: "He's very tall." },
          { w: 'grandma', emoji: '👵', m: 'the mother of your mum or your dad', ex: "That's my grandma." },
          { w: 'cat', emoji: '🐱', m: 'a small animal that lives in a home', ex: 'Grandma has got two cats.' },
          { w: 'dog', emoji: '🐶', m: 'an animal that lives with people and says "woof"', ex: 'Is this your dog?' },
          { w: 'funny', emoji: '😂', m: 'he or she makes you laugh', ex: "He's very funny." }
        ],
        transcript: [
          { who: 'Woman', text: "Step three. You will hear a girl talking about a family photo. Listen and write the answers.", answers: [] },
          { who: 'Man', text: "Is this a photo of your family?", answers: [] },
          { who: 'Woman', text: "Yes, it is. This is my brother. His name is Jack.", answers: [1] },
          { who: 'Man', text: "How old is Jack?", answers: [] },
          { who: 'Woman', text: "He's ten years old.", answers: [2] },
          { who: 'Man', text: "Ten years old? He's very tall.", answers: [2] },
          { who: 'Man', text: "And who is this little girl?", answers: [] },
          { who: 'Woman', text: "This is my sister. Her name is Mia. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's M, I, A.", answers: [3] },
          { who: 'Man', text: "How old is Mia?", answers: [] },
          { who: 'Woman', text: "She's six years old.", answers: [4] },
          { who: 'Man', text: "Six years old? She's very sweet.", answers: [4] },
          { who: 'Man', text: "Who is this woman?", answers: [] },
          { who: 'Woman', text: "This is my mum. Her name is Rose.", answers: [5] },
          { who: 'Man', text: "And is this your dad?", answers: [] },
          { who: 'Woman', text: "Yes, it is. My dad's name is Mark.", answers: [6] },
          { who: 'Man', text: "Who is the old woman with the cats?", answers: [] },
          { who: 'Woman', text: "That's my grandma. Her name is Ruby. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's R, U, B, Y.", answers: [7] },
          { who: 'Woman', text: "Grandma has got two cats. She loves them.", answers: [8] },
          { who: 'Man', text: "Two cats? That's nice.", answers: [8] },
          { who: 'Man', text: "And is this your dog?", answers: [] },
          { who: 'Woman', text: "Yes, it is. His name is Max.", answers: [9] },
          { who: 'Man', text: "How old is Max?", answers: [] },
          { who: 'Woman', text: "He's three years old.", answers: [10] },
          { who: 'Man', text: "Three years old? He's very young.", answers: [10] },
          { who: 'Woman', text: "Yes, and he's very funny. We all love him.", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "My Dream House",
        text: "Close your eyes and imagine your perfect home. Here is mine.\n\n" +
          "My dream house is not in a busy city. It is near a quiet lake, with mountains behind it. The house has two floors and big windows, so there is a lot of light in every room.\n\n" +
          "On the ground floor, there is a spacious living room with a fireplace and a comfortable sofa. Next to it, there is a modern kitchen. I want a big table there because I love cooking for my friends.\n\n" +
          "Upstairs, there are three bedrooms and two bathrooms. My bedroom has a balcony with a view of the lake. Every morning, I want to drink my tea there and watch the sunrise.\n\n" +
          "Outside, there is a large garden with fruit trees and flowers. I also want a small vegetable garden, like my grandmother has. In the corner of the garden, there is a little wooden house for my dog.\n\n" +
          "I also have a plan for the inside. The walls will be light green, my favourite colour, and there will be a small library under the stairs with shelves full of books. On rainy days, I want to sit there with a cup of hot chocolate and read for hours.\n\n" +
          "Of course, a house like this is expensive. But I am saving money every month, and one day I hope to build it.",
        words: [
          { w: "Dream house", uz: "Orzudagi uy", emoji: "🏡", ex: "My dream house is not in a busy city." },
          { w: "Imagine", uz: "Tasavvur qilmoq", emoji: "💭", ex: "Close your eyes and imagine your perfect home." },
          { w: "Floor", uz: "Qavat", emoji: "🏢", ex: "The house has two floors and big windows, so there is a lot of light in every room." },
          { w: "Spacious", uz: "Keng", emoji: "📐", ex: "On the ground floor, there is a spacious living room with a fireplace and a comfortable sofa." },
          { w: "Fireplace", uz: "Kamin", emoji: "🔥", ex: "On the ground floor, there is a spacious living room with a fireplace and a comfortable sofa." },
          { w: "Comfortable", uz: "Qulay", emoji: "🛋️", ex: "On the ground floor, there is a spacious living room with a fireplace and a comfortable sofa." },
          { w: "Upstairs", uz: "Yuqori qavatda", emoji: "⬆️", ex: "Upstairs, there are three bedrooms and two bathrooms." },
          { w: "View", uz: "Manzara", emoji: "🏞️", ex: "My bedroom has a balcony with a view of the lake." },
          { w: "Sunrise", uz: "Quyosh chiqishi", emoji: "🌅", ex: "Every morning, I want to drink my tea there and watch the sunrise." },
          { w: "Save money", uz: "Pul yig'moq", emoji: "💰", ex: "But I am saving money every month, and one day I hope to build it." }
        ],
        questions: [
          { type: "tf", q: "The dream house is in the centre of a big city.", a: ["False"], line: 2 },
          { type: "tf", q: "The house has large windows.", a: ["True"], line: 4 },
          { type: "tf", q: "There are four bedrooms upstairs.", a: ["False"], line: 8 },
          { type: "tf", q: "The writer wants to have morning tea on the balcony.", a: ["True"], line: 10 },
          { type: "tf", q: "The dog will sleep inside the main house.", a: ["False"], line: 13 },
          { type: "open", q: "What is behind the house?", keys: ["mountain"], line: 3 },
          { type: "open", q: "Why does the writer want a big table in the kitchen?", keys: ["cook","friend"], line: 7 },
          { type: "open", q: "What can the writer see from the balcony?", keys: ["lake","sunrise"], line: 9 },
          { type: "open", q: "What is in the garden?", keys: ["fruit","flower","tree","vegetable"], line: 11 },
          { type: "open", q: "How is the writer getting ready to build the house?", keys: ["saving","save","money"], line: 18 }
        ],
        retell: "Retell the text in your own words. Describe the dream house floor by floor and its garden."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Dream House",
        instruction: "Describe the house you would like to live in one day: where it is, what rooms it has, and why you like it.",
        words: [
          { w: "dream house", uz: "orzudagi uy" },
          { w: "spacious", uz: "keng" },
          { w: "comfortable", uz: "qulay" },
          { w: "living room", uz: "mehmonxona" },
          { w: "bedroom", uz: "yotoqxona" },
          { w: "garden", uz: "bog'" },
          { w: "view", uz: "manzara" },
          { w: "near", uz: "yaqinida" },
          { w: "I would like", uz: "... istardim" }
        ],
        minWords: 80, maxWords: 100, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Home & Living",
        words: [
          { w: "Living room", uz: "Mehmonxona", emoji: "🛋️", ex: "We watch TV in the living room." },
          { w: "Bedroom", uz: "Yotoqxona", emoji: "🛏️", ex: "My bedroom is small but nice." },
          { w: "Kitchen", uz: "Oshxona", emoji: "🍳", ex: "My mum cooks in the kitchen." },
          { w: "Bathroom", uz: "Hammom", emoji: "🛁", ex: "Our bathroom is next to my bedroom." },
          { w: "Furniture", uz: "Mebel", emoji: "🪑", ex: "We have new furniture in the living room." },
          { w: "Comfortable", uz: "Qulay", emoji: "😌", ex: "My bed is very comfortable." },
          { w: "Spacious", uz: "Keng", emoji: "📐", ex: "Our kitchen is spacious and bright." },
          { w: "Tidy", uz: "Ozoda", emoji: "🧹", ex: "I keep my room tidy." },
          { w: "Garden", uz: "Bog'", emoji: "🌳", ex: "There are apple trees in our garden." },
          { w: "Neighbour", uz: "Qo'shni", emoji: "👋", ex: "Our neighbour is very friendly." }
        ],
        questions: [
          { q: "Do you live in a house or a flat?", use: ["I live in a house / a flat","It has … rooms"] },
          { q: "What is your favourite room? Why?", use: ["My favourite room is …","because it is comfortable / spacious"] },
          { q: "What is in your bedroom?", use: ["There is a … in my bedroom","There are …","furniture"] },
          { q: "Is your room tidy?", use: ["My room is usually tidy / messy","I clean it on …"] },
          { q: "Do you know your neighbours?", use: ["Our neighbour is …","he / she is friendly","we say hello"] }
        ],
        part2: { topic: "Talk about your home", hints: ["where your home is and how big it is","the rooms in it","your favourite room and why"], seconds: 30 }
      }
    },
    {
      id: 'b4', no: 4, stage: 'Beginner', theme: 'Colours & things', emoji: '🎨',
      listening: {
        src: 'audio/skills/beg-4-listening.mp3?v=1',
        title: 'A lost school bag',
        intro: 'Listen to a boy at a school office. He can\'t find his bag. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'First name: _____', a: ['Luke'] },
          { q: 'Surname: _____', a: ['Cole'] },
          { q: 'Colour of the bag: _____', a: ['blue'] },
          { q: 'On the bag: a _____ star', a: ['yellow'] },
          { q: 'Number of books: _____', a: ['3', 'three'] },
          { q: 'Colour of the pencil case: _____', a: ['green'] },
          { q: 'Number of pens: _____', a: ['4', 'four'] },
          { q: 'Food in the bag: an _____', a: ['apple'] },
          { q: 'Also in the bag: a black _____', a: ['hat'] },
          { q: 'The bag was in room _____', a: ['16', 'sixteen'] }
        ],
        words: [
          { w: 'bag', emoji: '🎒', m: 'you carry your things in it', ex: "I can't find my school bag." },
          { w: 'colour', emoji: '🎨', m: 'red, blue, green and yellow are colours', ex: 'What colour is your bag?' },
          { w: 'blue', emoji: '🔵', m: 'the colour of the sky on a sunny day', ex: "It's a big blue bag." },
          { w: 'yellow', emoji: '🟡', m: 'the colour of a banana', ex: "There's a yellow star on it." },
          { w: 'star', emoji: '⭐', m: 'a shape with five points', ex: "There's a yellow star on it." },
          { w: 'pencil case', emoji: '✏️', m: 'a small bag or box for your pens and pencils', ex: "There's a green pencil case too." },
          { w: 'pen', emoji: '🖊️', m: 'you write with it', ex: 'There are four pens in it.' },
          { w: 'apple', emoji: '🍎', m: 'a round red or green fruit', ex: "There's an apple in my bag." },
          { w: 'hat', emoji: '🧢', m: 'you wear it on your head', ex: "There's a black hat." },
          { w: 'find', emoji: '🔍', m: 'to see something you are looking for', ex: 'A teacher found it in room sixteen.' }
        ],
        transcript: [
          { who: 'Woman', text: "Step four. You will hear a boy at a school office. He can't find his bag. Listen and write the answers.", answers: [] },
          { who: 'Woman', text: "Hello. Can I help you?", answers: [] },
          { who: 'Man', text: "Yes, please. I can't find my school bag.", answers: [] },
          { who: 'Woman', text: "OK. What's your first name?", answers: [] },
          { who: 'Man', text: "My first name is Luke. I'll spell it for you.", answers: [] },
          { who: 'Man', text: "That's L, U, K, E.", answers: [1] },
          { who: 'Woman', text: "And what's your surname?", answers: [] },
          { who: 'Man', text: "That's C, O, L, E.", answers: [2] },
          { who: 'Woman', text: "Thank you, Luke. What colour is your bag?", answers: [] },
          { who: 'Man', text: "It's blue. It's a big blue bag.", answers: [3] },
          { who: 'Woman', text: "A big blue bag. OK.", answers: [3] },
          { who: 'Man', text: "And there's a yellow star on it.", answers: [4] },
          { who: 'Woman', text: "A yellow star. Good.", answers: [4] },
          { who: 'Woman', text: "What's in your bag?", answers: [] },
          { who: 'Man', text: "There are three books in it. They're my English books.", answers: [5] },
          { who: 'Woman', text: "Three English books? OK.", answers: [5] },
          { who: 'Man', text: "There's a green pencil case too.", answers: [6] },
          { who: 'Woman', text: "A green pencil case?", answers: [6] },
          { who: 'Man', text: "Yes, and there are four pens in it.", answers: [7] },
          { who: 'Woman', text: "Four pens. OK.", answers: [7] },
          { who: 'Man', text: "There's an apple, and there's a black hat.", answers: [8, 9] },
          { who: 'Woman', text: "An apple and a black hat?", answers: [8, 9] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "Look, I've got a blue bag here. A teacher found it in room sixteen.", answers: [10] },
          { who: 'Man', text: "Room sixteen? That's my classroom. Yes, that's my bag!", answers: [10] },
          { who: 'Woman', text: "Here you are, Luke.", answers: [] },
          { who: 'Man', text: "Thank you very much.", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "Traditional Food Around the World",
        text: "Every country has its own traditional food. These dishes tell us a lot about the people and their history.\n\n" +
          "In Italy, people love pasta and pizza. Real Italian pizza is thin, and it is often cooked in a hot stone oven. Families in Italy usually eat lunch together, and a meal can last two hours.\n\n" +
          "In Japan, rice is part of almost every meal. People also eat a lot of fish and vegetables. Sushi is the most famous Japanese dish. It is made with rice, raw fish and seaweed.\n\n" +
          "Mexico is famous for tacos. A taco is a soft or crispy tortilla with meat, beans, cheese and spicy sauce. Many Mexicans eat tacos for breakfast, lunch and dinner!\n\n" +
          "In India, many dishes are full of spices. Curry is very popular, and people often eat it with rice or flat bread. In the south of India, some people eat with their right hand.\n\n" +
          "In Britain, a traditional breakfast has eggs, sausages, beans and toast. It is called a full English breakfast, and it is very filling.\n\n" +
          "In Turkey, breakfast is a big meal with bread, cheese, olives, tomatoes, eggs and tea. People sit at the table for a long time and talk. Turkish people also love sweet desserts, and baklava, made with nuts and honey, is one of the most famous. Many visitors take a box of it home as a present.\n\n" +
          "Trying traditional food is one of the best ways to learn about a new culture.",
        words: [
          { w: "Traditional", uz: "An'anaviy", emoji: "🏺", ex: "Every country has its own traditional food." },
          { w: "Dish", uz: "Taom", emoji: "🍽️", ex: "These dishes tell us a lot about the people and their history." },
          { w: "Meal", uz: "Ovqat (taomlanish)", emoji: "🍲", ex: "Families in Italy usually eat lunch together, and a meal can last two hours." },
          { w: "Last", uz: "Davom etmoq", emoji: "⏳", ex: "Families in Italy usually eat lunch together, and a meal can last two hours." },
          { w: "Raw", uz: "Xom", emoji: "🐟", ex: "It is made with rice, raw fish and seaweed." },
          { w: "Spicy", uz: "Achchiq", emoji: "🌶️", ex: "A taco is a soft or crispy tortilla with meat, beans, cheese and spicy sauce." },
          { w: "Sauce", uz: "Sous", emoji: "🥫", ex: "A taco is a soft or crispy tortilla with meat, beans, cheese and spicy sauce." },
          { w: "Spices", uz: "Ziravorlar", emoji: "🧂", ex: "A taco is a soft or crispy tortilla with meat, beans, cheese and spicy sauce." },
          { w: "Filling", uz: "To'yimli", emoji: "🍳", ex: "It is called a full English breakfast, and it is very filling." },
          { w: "Culture", uz: "Madaniyat", emoji: "🌍", ex: "Trying traditional food is one of the best ways to learn about a new culture." }
        ],
        questions: [
          { type: "tf", q: "Real Italian pizza is usually thick.", a: ["False"], line: 3 },
          { type: "tf", q: "In Japan, people eat rice with most meals.", a: ["True"], line: 5 },
          { type: "tf", q: "Sushi is made with cooked meat.", a: ["False"], line: 8 },
          { type: "tf", q: "Some Mexicans eat tacos in the morning.", a: ["True"], line: 11 },
          { type: "tf", q: "A full English breakfast is a light meal.", a: ["False"], line: 16 },
          { type: "gap", q: "Real Italian pizza is often cooked in a hot stone _____.", a: ["oven"], line: 3 },
          { type: "gap", q: "In Japan, _____ is part of almost every meal.", a: ["rice"], line: 5 },
          { type: "gap", q: "Sushi is made with rice, raw fish and _____.", a: ["seaweed"], line: 8 },
          { type: "gap", q: "In India, people often eat curry with rice or flat _____.", a: ["bread"], line: 13 },
          { type: "gap", q: "Baklava is made with nuts and _____.", a: ["honey"], line: 19 }
        ],
        retell: "Retell the text in your own words. Talk about the traditional food of at least three countries."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Food",
        instruction: "Write about your favourite food. Say what it is, what is in it, who makes it, and when you eat it.",
        words: [
          { w: "favourite dish", uz: "sevimli taom" },
          { w: "delicious", uz: "mazali" },
          { w: "ingredients", uz: "masalliqlar" },
          { w: "cook", uz: "pishirmoq" },
          { w: "taste", uz: "ta'm" },
          { w: "sweet", uz: "shirin" },
          { w: "healthy", uz: "foydali, sog'lom" },
          { w: "homemade", uz: "uyda tayyorlangan" },
          { w: "on special days", uz: "maxsus kunlarda" }
        ],
        minWords: 80, maxWords: 100, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Food & Meals",
        words: [
          { w: "Breakfast", uz: "Nonushta", emoji: "🥣", ex: "I have eggs for breakfast." },
          { w: "Lunch", uz: "Tushlik", emoji: "🥪", ex: "I have lunch at school." },
          { w: "Dinner", uz: "Kechki ovqat", emoji: "🍲", ex: "We have dinner at seven o'clock." },
          { w: "Delicious", uz: "Mazali", emoji: "😋", ex: "My mum's soup is delicious." },
          { w: "Spicy", uz: "Achchiq", emoji: "🌶️", ex: "I don't like spicy food." },
          { w: "Sweet", uz: "Shirin", emoji: "🍰", ex: "This cake is very sweet." },
          { w: "Sour", uz: "Nordon", emoji: "🍋", ex: "Lemons are sour." },
          { w: "Homemade", uz: "Uyda tayyorlangan", emoji: "🏠", ex: "I love homemade bread." },
          { w: "Ingredients", uz: "Masalliqlar", emoji: "🧂", ex: "Rice and carrots are the main ingredients." },
          { w: "Favourite dish", uz: "Sevimli taom", emoji: "🍽️", ex: "My favourite dish is plov." }
        ],
        questions: [
          { q: "What do you usually have for breakfast?", use: ["I usually have …","for breakfast","with tea / milk"] },
          { q: "Where do you have lunch?", use: ["I have lunch at school / at home","at … o'clock"] },
          { q: "What is your favourite dish?", use: ["My favourite dish is …","it is delicious","my mum makes it"] },
          { q: "Do you like spicy or sweet food?", use: ["I like … food","I don't like …","because it is too spicy / sweet"] },
          { q: "Who cooks in your family?", use: ["My … cooks","homemade food","the ingredients are …"] }
        ],
        part2: { topic: "Talk about your favourite dish", hints: ["what it is and what it tastes like","its ingredients","when you eat it and who makes it"], seconds: 30 }
      }
    },
    {
      id: 'b5', no: 5, stage: 'Beginner', theme: 'Numbers 20–100', emoji: '💯',
      listening: {
        src: 'audio/skills/beg-5-listening.mp3?v=1',
        title: 'Phoning a sports shop',
        intro: 'Listen to a woman phoning a sports shop. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'Football: £_____', a: ['25', 'twenty-five', 'twenty five', '£25'] },
          { q: 'Sports bag: £_____', a: ['40', 'forty', '£40'] },
          { q: 'Trainers: £_____', a: ['65', 'sixty-five', 'sixty five', '£65'] },
          { q: 'T-shirt: £_____', a: ['22', 'twenty-two', 'twenty two', '£22'] },
          { q: 'Tennis racket: £_____', a: ['100', 'a hundred', 'one hundred', 'hundred', '£100'] },
          { q: 'First name: _____', a: ['Anna'] },
          { q: 'Surname: _____', a: ['Shaw'] },
          { q: 'Phone number: _____', a: ['07700 900 281', '07700900281'] },
          { q: 'The shop: _____ Park Road', a: ['91', 'ninety-one', 'ninety one'] },
          { q: "The shop's phone number: _____", a: ['01632 960 539', '01632960539'] }
        ],
        words: [
          { w: 'how much', emoji: '💰', m: 'we ask this about a price', ex: 'How much is a football, please?' },
          { w: 'pound (£)', emoji: '💷', m: 'British money', ex: 'A football is twenty-five pounds.' },
          { w: 'football', emoji: '⚽', m: 'a ball you kick', ex: 'A football is twenty-five pounds.' },
          { w: 'sports bag', emoji: '👜', m: 'a bag for your sports clothes', ex: 'A sports bag is forty pounds.' },
          { w: 'trainers', emoji: '👟', m: 'shoes for sport', ex: 'I need some trainers for my son.' },
          { w: 'T-shirt', emoji: '👕', m: 'a shirt with short arms', ex: "We've got football T-shirts too." },
          { w: 'tennis racket', emoji: '🎾', m: 'you hit the ball with it in tennis', ex: 'How much is a tennis racket?' },
          { w: 'cheap', emoji: '👍', m: 'it does not cost a lot of money', ex: "Twenty-two pounds? That's cheap." },
          { w: 'too much', emoji: '😮', m: 'more money than you want to pay', ex: "A hundred pounds? That's too much." },
          { w: 'son', emoji: '👦', m: 'a boy who is your child', ex: 'I need some trainers for my son.' }
        ],
        transcript: [
          { who: 'Woman', text: "Step five. You will hear a woman phoning a sports shop. Listen and write the answers.", answers: [] },
          { who: 'Man', text: "Hello, City Sports. How can I help you?", answers: [] },
          { who: 'Woman', text: "Hello. How much is a football, please?", answers: [] },
          { who: 'Man', text: "A football is twenty-five pounds.", answers: [1] },
          { who: 'Woman', text: "Twenty-five pounds? OK.", answers: [1] },
          { who: 'Woman', text: "And how much is a sports bag?", answers: [] },
          { who: 'Man', text: "A sports bag is forty pounds.", answers: [2] },
          { who: 'Woman', text: "Forty pounds? Is that right?", answers: [2] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "I need some trainers for my son. How much are they?", answers: [] },
          { who: 'Man', text: "Our trainers are sixty-five pounds.", answers: [3] },
          { who: 'Woman', text: "Sixty-five pounds. That's fine.", answers: [3] },
          { who: 'Man', text: "We've got football T-shirts too. They're twenty-two pounds.", answers: [4] },
          { who: 'Woman', text: "Twenty-two pounds? That's cheap.", answers: [4] },
          { who: 'Woman', text: "And how much is a tennis racket?", answers: [] },
          { who: 'Man', text: "This tennis racket is a hundred pounds.", answers: [5] },
          { who: 'Woman', text: "A hundred pounds? Oh no, that's too much.", answers: [5] },
          { who: 'Woman', text: "OK. I'd like the trainers, please. Can you keep them for me?", answers: [] },
          { who: 'Man', text: "Yes, of course. What's your name, please?", answers: [] },
          { who: 'Woman', text: "My first name is Anna. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's A, double N, A.", answers: [6] },
          { who: 'Man', text: "Thank you. And your surname?", answers: [] },
          { who: 'Woman', text: "That's S, H, A, W.", answers: [7] },
          { who: 'Man', text: "And what's your phone number?", answers: [] },
          { who: 'Woman', text: "It's oh seven seven double oh, nine double oh, two eight one.", answers: [8] },
          { who: 'Man', text: "Oh seven seven double oh, nine double oh, two eight one?", answers: [8] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "And where is your shop?", answers: [] },
          { who: 'Man', text: "We're at ninety-one Park Road.", answers: [9] },
          { who: 'Woman', text: "Ninety-one Park Road. Thank you.", answers: [9] },
          { who: 'Woman', text: "And what's the shop's phone number, please?", answers: [] },
          { who: 'Man', text: "Yes. It's oh one six three two, nine six oh, five three nine.", answers: [10] },
          { who: 'Woman', text: "Oh one six three two, nine six oh, five three nine?", answers: [10] },
          { who: 'Man', text: "Yes, that's right. See you soon!", answers: [] },
          { who: 'Woman', text: "Thank you. Goodbye!", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "How People Spend Their Free Time",
        text: "What do people do when they are not working or studying? Last month, our English class asked 50 people this question. Here are the results.\n\n" +
          "The most popular free-time activity is watching videos and films. Thirty people said they watch something every evening, usually on their phones. Many of them also listen to music while they travel to work or school.\n\n" +
          "Sports are popular too. Twelve people go to the gym or play football at least twice a week. Older people prefer walking in the park. They say it helps them relax after a busy day.\n\n" +
          "Some people like quiet hobbies. Eight people read books, and five people enjoy cooking new recipes at the weekend. One woman told us she paints pictures of flowers in her free time.\n\n" +
          "Young people spend a lot of time with friends. They meet in cafés, play computer games together or chat online for hours.\n\n" +
          "We also asked people how much free time they have. Most adults said they have about two or three hours on weekdays and more at the weekend. Students said they often feel they don't have enough free time because of homework and exams.\n\n" +
          "Finally, we asked people what they want to do when they have more free time. The most common answers were travelling, learning a new language and spending more time with family. One man said he wants to learn to play the piano, and a young girl told us she dreams of having a garden with her own vegetables.\n\n" +
          "The survey shows one important thing: everyone needs free time. It helps people feel happy, healthy and full of energy.",
        words: [
          { w: "Free time", uz: "Bo'sh vaqt", emoji: "🕒", ex: "One woman told us she paints pictures of flowers in her free time." },
          { w: "Activity", uz: "Mashg'ulot", emoji: "🎯", ex: "The most popular free-time activity is watching videos and films." },
          { w: "Popular", uz: "Ommabop", emoji: "⭐", ex: "The most popular free-time activity is watching videos and films." },
          { w: "At least", uz: "Kamida", emoji: "🔢", ex: "Twelve people go to the gym or play football at least twice a week." },
          { w: "Twice a week", uz: "Haftasiga ikki marta", emoji: "📅", ex: "Twelve people go to the gym or play football at least twice a week." },
          { w: "Prefer", uz: "Afzal ko'rmoq", emoji: "👍", ex: "Older people prefer walking in the park." },
          { w: "Relax", uz: "Dam olmoq", emoji: "🧘", ex: "They say it helps them relax after a busy day." },
          { w: "Recipe", uz: "Retsept", emoji: "📖", ex: "Eight people read books, and five people enjoy cooking new recipes at the weekend." },
          { w: "Chat online", uz: "Internetda suhbatlashmoq", emoji: "💬", ex: "They meet in cafés, play computer games together or chat online for hours." },
          { w: "Survey", uz: "So'rovnoma", emoji: "📋", ex: "The survey shows one important thing: everyone needs free time." }
        ],
        questions: [
          { type: "tf", q: "The class asked fifty people about their free time.", a: ["True"], line: 1 },
          { type: "tf", q: "Most people watch videos on a TV.", a: ["False"], line: 4 },
          { type: "tf", q: "Older people like walking in the park.", a: ["True"], line: 8 },
          { type: "tf", q: "Fifteen people said they read books.", a: ["False"], line: 11 },
          { type: "tf", q: "Young people never chat online.", a: ["False"], line: 14 },
          { type: "open", q: "Why do students feel they don't have enough free time?", keys: ["homework","exam"], line: 17 },
          { type: "open", q: "What is the most popular free-time activity?", keys: ["video","film"], line: 3 },
          { type: "open", q: "Why do older people like walking?", keys: ["relax"], line: 9 },
          { type: "open", q: "What does one woman paint?", keys: ["flower"], line: 12 },
          { type: "open", q: "Where do young people meet their friends?", keys: ["café","cafe"], line: 14 }
        ],
        retell: "Retell the text in your own words. Say how people spend their free time and what the survey shows."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Free Time",
        instruction: "Write about what you do in your free time, who you do it with, and why you enjoy it.",
        words: [
          { w: "free time", uz: "bo'sh vaqt" },
          { w: "enjoy", uz: "zavqlanmoq" },
          { w: "hang out with", uz: "... bilan vaqt o'tkazmoq" },
          { w: "go for a walk", uz: "sayrga chiqmoq" },
          { w: "at least", uz: "kamida" },
          { w: "once a week", uz: "haftada bir marta" },
          { w: "relax", uz: "dam olmoq" },
          { w: "prefer", uz: "afzal ko'rmoq" },
          { w: "because", uz: "chunki" }
        ],
        minWords: 90, maxWords: 110, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Free Time",
        words: [
          { w: "Free time", uz: "Bo'sh vaqt", emoji: "🕒", ex: "In my free time, I read books." },
          { w: "Hang out", uz: "Vaqt o'tkazmoq", emoji: "🧑‍🤝‍🧑", ex: "I hang out with my friends in the park." },
          { w: "Listen to music", uz: "Musiqa tinglamoq", emoji: "🎧", ex: "I listen to music on the bus." },
          { w: "Watch videos", uz: "Videolar ko'rmoq", emoji: "📱", ex: "I watch videos in the evening." },
          { w: "Go for a walk", uz: "Sayrga chiqmoq", emoji: "🚶", ex: "We go for a walk after dinner." },
          { w: "Play games", uz: "O'yin o'ynamoq", emoji: "🎮", ex: "I play games with my brother." },
          { w: "Read books", uz: "Kitob o'qimoq", emoji: "📚", ex: "I like to read books about animals." },
          { w: "Meet friends", uz: "Do'stlar bilan uchrashmoq", emoji: "👋", ex: "I meet friends on Saturdays." },
          { w: "Stay at home", uz: "Uyda qolmoq", emoji: "🏠", ex: "When it rains, I stay at home." },
          { w: "Enjoy", uz: "Rohatlanmoq", emoji: "😄", ex: "I enjoy playing football." }
        ],
        questions: [
          { q: "What do you do in your free time?", use: ["In my free time, I …","I enjoy …ing"] },
          { q: "Do you like listening to music?", use: ["Yes, I listen to music …","My favourite singer is …"] },
          { q: "Where do you hang out with your friends?", use: ["We hang out in / at …","we play games","we go for a walk"] },
          { q: "Do you prefer to go out or stay at home?", use: ["I prefer to …","because …"] },
          { q: "What did you do last weekend?", use: ["Last weekend, I …","I met friends","I stayed at home"] }
        ],
        part2: { topic: "Talk about your free time", hints: ["what you like doing","who you do it with","why you enjoy it"], seconds: 30 }
      }
    },
    {
      id: 'b6', no: 6, stage: 'Beginner', theme: 'Days & times', emoji: '📅',
      listening: {
        src: 'audio/skills/beg-6-listening.mp3?v=1',
        title: 'Classes at a sports centre',
        intro: 'Listen to a girl at a sports centre. She asks about classes. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'First name: _____', a: ['Lucy'] },
          { q: 'Surname: _____', a: ['Webb'] },
          { q: 'Swimming: on _____', a: ['Monday'] },
          { q: "Swimming starts at _____ o'clock", a: ['4', 'four'] },
          { q: 'Dance: on _____', a: ['Wednesday'] },
          { q: "Dance starts at _____ o'clock", a: ['6', 'six'] },
          { q: 'Tennis: on _____ morning', a: ['Saturday'] },
          { q: "Tennis starts at _____ o'clock", a: ['10', 'ten'] },
          { q: 'The sports centre is closed on _____', a: ['Sunday'] },
          { q: "The sports centre opens at _____ o'clock", a: ['8', 'eight'] }
        ],
        words: [
          { w: 'sports centre', emoji: '🏟️', m: 'a building where you can do sports', ex: 'You will hear a girl at a sports centre.' },
          { w: 'class', emoji: '👩‍🏫', m: 'a time when a teacher shows you how to do something', ex: 'I want to join a class after school.' },
          { w: 'swimming', emoji: '🏊', m: 'moving in water with your arms and legs', ex: 'There is swimming on Monday.' },
          { w: 'dance', emoji: '💃', m: 'moving your body to music', ex: 'Dance is on Wednesday.' },
          { w: 'tennis', emoji: '🎾', m: 'a sport with a ball and two rackets', ex: 'Tennis is on Saturday morning.' },
          { w: 'Monday', emoji: '📅', m: 'the first day of the school week', ex: 'See you on Monday!' },
          { w: 'Saturday', emoji: '🗓️', m: 'a day of the weekend, after Friday', ex: 'Tennis is on Saturday morning.' },
          { w: "o'clock", emoji: '🕓', m: "we say it with the time: 4:00 is four o'clock", ex: "It starts at four o'clock." },
          { w: 'closed', emoji: '🔒', m: "not open: you can't go in", ex: "We're closed on Sunday." },
          { w: 'open', emoji: '🔓', m: 'you can go in', ex: "We open at eight o'clock." }
        ],
        transcript: [
          { who: 'Woman', text: 'Step six. You will hear a girl at a sports centre. She asks about classes. Listen and write the answers.', answers: [] },
          { who: 'Man', text: 'Hello. Can I help you?', answers: [] },
          { who: 'Woman', text: 'Yes, please. I want to join a class after school.', answers: [] },
          { who: 'Man', text: "OK. What's your first name?", answers: [] },
          { who: 'Woman', text: "My first name is Lucy. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's L, U, C, Y.", answers: [1] },
          { who: 'Man', text: "And what's your surname?", answers: [] },
          { who: 'Woman', text: "That's W, E, double B.", answers: [2] },
          { who: 'Man', text: "Thank you, Lucy. There's swimming on Monday.", answers: [3] },
          { who: 'Woman', text: 'On Monday? Great. I love swimming.', answers: [3] },
          { who: 'Man', text: "It starts at four o'clock.", answers: [4] },
          { who: 'Woman', text: "Four o'clock. That's good.", answers: [4] },
          { who: 'Woman', text: 'Is there a dance class too?', answers: [] },
          { who: 'Man', text: "Yes. Dance is on Wednesday, at six o'clock.", answers: [5, 6] },
          { who: 'Woman', text: "Wednesday at six o'clock. OK.", answers: [5, 6] },
          { who: 'Woman', text: 'And when is the tennis class?', answers: [] },
          { who: 'Man', text: "Tennis is on Saturday morning, at ten o'clock.", answers: [7, 8] },
          { who: 'Woman', text: 'Saturday at ten. Good.', answers: [7, 8] },
          { who: 'Woman', text: 'Is the sports centre open on Sunday?', answers: [] },
          { who: 'Man', text: "No, sorry. We're closed on Sunday.", answers: [9] },
          { who: 'Woman', text: 'What time do you open in the morning?', answers: [] },
          { who: 'Man', text: "We open at eight o'clock.", answers: [10] },
          { who: 'Woman', text: "Eight o'clock. Thank you!", answers: [10] },
          { who: 'Man', text: "You're welcome. See you on Monday, Lucy!", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "A True Friendship",
        text: "When Tom was ten, his family moved to a new town. On his first day at the new school, he felt nervous and lonely. Nobody talked to him during the break.\n\n" +
          "Then a boy with curly hair sat next to him. \"Hi, I'm Ben,\" he said. \"Do you want to play football with us?\" Tom smiled. From that day, they became best friends.\n\n" +
          "Tom and Ben did everything together. They walked to school, did their homework and watched football matches on TV. Ben was always cheerful, and Tom was good at maths, so they helped each other.\n\n" +
          "When they were fifteen, Tom broke his leg while he was playing football. He stayed at home for six weeks. Every day after school, Ben visited him. He brought Tom's homework and told him all the school news. Tom never felt bored or alone.\n\n" +
          "There was one difficult time in their friendship. When they were seventeen, Ben started spending a lot of time with a new group of friends. He stopped calling Tom, and Tom felt hurt. For a few weeks, they didn't talk at all.\n\n" +
          "One evening, Tom decided to visit Ben and tell him how he felt. Ben was surprised. \"I'm really sorry,\" he said. \"I didn't want to lose you. I was just busy with my new friends.\" They talked for hours that night, and after that, their friendship became even stronger. Tom learned that good friends sometimes make mistakes, but they also say sorry.\n\n" +
          "Now Tom and Ben are twenty-five. They live in different cities, but they still call each other every week. Tom often says, \"A true friend is someone who stays with you on good days and bad days.\"",
        words: [
          { w: "Move", uz: "Ko'chib o'tmoq", emoji: "🚚", ex: "When Tom was ten, his family moved to a new town." },
          { w: "Nervous", uz: "Hayajonlangan", emoji: "😬", ex: "On his first day at the new school, he felt nervous and lonely." },
          { w: "Lonely", uz: "Yolg'iz", emoji: "😔", ex: "On his first day at the new school, he felt nervous and lonely." },
          { w: "Curly hair", uz: "Jingalak soch", emoji: "👦", ex: "Then a boy with curly hair sat next to him." },
          { w: "Best friends", uz: "Eng yaqin do'stlar", emoji: "🤝", ex: "From that day, they became best friends." },
          { w: "Cheerful", uz: "Quvnoq", emoji: "😄", ex: "Ben was always cheerful, and Tom was good at maths, so they helped each other." },
          { w: "Help each other", uz: "Bir-biriga yordam bermoq", emoji: "🙌", ex: "Ben was always cheerful, and Tom was good at maths, so they helped each other." },
          { w: "Break a leg", uz: "Oyog'ini sindirmoq", emoji: "🦵", ex: "When they were fifteen, Tom broke his leg while he was playing football." },
          { w: "Feel bored", uz: "Zerikmoq", emoji: "🥱", ex: "Tom never felt bored or alone." },
          { w: "Call each other", uz: "Bir-biriga qo'ng'iroq qilmoq", emoji: "📞", ex: "They live in different cities, but they still call each other every week." }
        ],
        questions: [
          { type: "tf", q: "Tom's family moved when he was ten.", a: ["True"], line: 0 },
          { type: "tf", q: "On his first day, many children talked to Tom.", a: ["False"], line: 2 },
          { type: "tf", q: "Ben was the one who was good at maths.", a: ["False"], line: 9 },
          { type: "tf", q: "Tom stayed at home for six weeks.", a: ["True"], line: 11 },
          { type: "tf", q: "Now Tom and Ben live in the same city.", a: ["False"], line: 26 },
          { type: "gap", q: "On his first day, nobody talked to Tom during the _____.", a: ["break"], line: 2 },
          { type: "gap", q: "Ben was always _____.", a: ["cheerful"], line: 9 },
          { type: "gap", q: "Tom was good at _____, so he could help Ben.", a: ["maths","math"], line: 9 },
          { type: "gap", q: "When Ben stopped calling him, Tom felt _____.", a: ["hurt"], line: 17 },
          { type: "gap", q: "Tom learned that good friends make mistakes, but they also say _____.", a: ["sorry"], line: 24 }
        ],
        retell: "Retell the story of Tom and Ben in your own words, from their first meeting to today."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Best Friend",
        instruction: "Write about your best friend: how you met, what he or she is like, and what you do together.",
        words: [
          { w: "best friend", uz: "eng yaqin do'st" },
          { w: "meet", uz: "tanishmoq, uchrashmoq" },
          { w: "funny", uz: "kulgili" },
          { w: "honest", uz: "rostgo'y" },
          { w: "trust", uz: "ishonmoq" },
          { w: "share", uz: "bo'lishmoq" },
          { w: "have fun", uz: "maza qilmoq" },
          { w: "support", uz: "qo'llab-quvvatlamoq" },
          { w: "since", uz: "... dan beri" }
        ],
        minWords: 90, maxWords: 110, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Friends",
        words: [
          { w: "Best friend", uz: "Eng yaqin do'st", emoji: "🤝", ex: "My best friend lives next to me." },
          { w: "Friendly", uz: "Do'stona", emoji: "😊", ex: "Our new classmate is very friendly." },
          { w: "Funny", uz: "Kulgili", emoji: "😂", ex: "My friend tells funny stories." },
          { w: "Honest", uz: "Rostgo'y", emoji: "🙂", ex: "A good friend is honest." },
          { w: "Helpful", uz: "Yordamchi", emoji: "🙌", ex: "She is helpful with my homework." },
          { w: "Trust", uz: "Ishonmoq", emoji: "🔒", ex: "I trust my best friend." },
          { w: "Share", uz: "Bo'lishmoq", emoji: "🍪", ex: "We share our lunch at school." },
          { w: "Spend time together", uz: "Birga vaqt o'tkazmoq", emoji: "⏳", ex: "We spend time together after school." },
          { w: "Have fun", uz: "Mazza qilmoq", emoji: "🎉", ex: "We always have fun at the park." },
          { w: "Make friends", uz: "Do'stlashmoq", emoji: "🧑‍🤝‍🧑", ex: "It is easy to make friends at school." }
        ],
        questions: [
          { q: "Who is your best friend?", use: ["My best friend is …","we met at …"] },
          { q: "What is your best friend like?", use: ["He / She is friendly / funny / honest","and very helpful"] },
          { q: "What do you do together?", use: ["We spend time together …","we have fun","we play / talk / watch …"] },
          { q: "Is it easy for you to make friends?", use: ["Yes / No, it is easy / difficult","because I am …"] },
          { q: "What makes a good friend?", use: ["A good friend is …","you can trust him / her","he / she shares …"] }
        ],
        part2: { topic: "Talk about your best friend", hints: ["who your best friend is and how you met","what he or she is like","what you do together"], seconds: 40 }
      }
    },
    {
      id: 'b7', no: 7, stage: 'Beginner', theme: 'Food', emoji: '🍎',
      listening: {
        src: 'audio/skills/beg-7-listening.mp3?v=1',
        title: 'Ordering food at a café',
        intro: 'Listen to a woman ordering food at a café. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'Her son likes: _____', a: ['pizza'] },
          { q: 'Small pizza: £_____', a: ['6', 'six', '£6'] },
          { q: 'Her daughter likes: _____', a: ['fish'] },
          { q: 'Fish and chips: £_____', a: ['8', 'eight', '£8'] },
          { q: 'For the woman: a _____ salad', a: ['chicken'] },
          { q: 'Salad: £_____', a: ['5', 'five', '£5'] },
          { q: 'Drinks: two _____ juices and a tea', a: ['orange'] },
          { q: 'All the food and drinks: £_____', a: ['23', 'twenty-three', 'twenty three', '£23'] },
          { q: 'First name: _____', a: ['Jane'] },
          { q: 'Surname: _____', a: ['Hill'] }
        ],
        words: [
          { w: 'café', emoji: '☕', m: 'a small place where you eat and drink', ex: 'You will hear a woman ordering food at a café.' },
          { w: 'pizza', emoji: '🍕', m: 'a round, flat bread with cheese and tomato on it', ex: 'My son likes pizza.' },
          { w: 'fish and chips', emoji: '🐟', m: 'fish and long pieces of hot potato', ex: 'Fish and chips is eight pounds.' },
          { w: 'salad', emoji: '🥗', m: 'cold vegetables, like tomatoes and lettuce', ex: "I'd like a chicken salad, please." },
          { w: 'chicken', emoji: '🍗', m: 'meat from a bird that lives on a farm', ex: 'A chicken salad is five pounds.' },
          { w: 'drink', emoji: '🥤', m: 'something like water, tea or juice', ex: 'Would you like a drink?' },
          { w: 'orange juice', emoji: '🧃', m: 'a drink made from oranges', ex: 'Two orange juices, please.' },
          { w: 'tea', emoji: '🍵', m: 'a hot drink, often with milk', ex: 'And a cup of tea, please.' },
          { w: 'daughter', emoji: '👧', m: 'a girl who is your child', ex: 'My daughter likes fish.' },
          { w: 'order', emoji: '📝', m: 'what you ask for in a café', ex: 'Can I have your name for the order?' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step seven. You will hear a woman ordering food at a café. Listen and write the answers.', answers: [] },
          { who: 'Man', text: 'Hello. What would you like?', answers: [] },
          { who: 'Woman', text: 'Hello. My son likes pizza. How much is a small pizza?', answers: [1] },
          { who: 'Man', text: 'A small pizza is six pounds.', answers: [2] },
          { who: 'Woman', text: 'Six pounds? OK, one small pizza, please.', answers: [2] },
          { who: 'Woman', text: 'My daughter likes fish. Have you got fish and chips?', answers: [3] },
          { who: 'Man', text: 'Yes, we have. Fish and chips is eight pounds.', answers: [4] },
          { who: 'Woman', text: 'Eight pounds. Good.', answers: [4] },
          { who: 'Man', text: 'And what would you like?', answers: [] },
          { who: 'Woman', text: "I'd like a chicken salad, please.", answers: [5] },
          { who: 'Man', text: 'A chicken salad is five pounds.', answers: [5, 6] },
          { who: 'Woman', text: 'Five pounds. Lovely.', answers: [6] },
          { who: 'Man', text: 'Would you like a drink?', answers: [] },
          { who: 'Woman', text: 'Yes. Two orange juices and a cup of tea, please.', answers: [7] },
          { who: 'Man', text: 'Two orange juices and a tea. OK.', answers: [7] },
          { who: 'Man', text: "That's twenty-three pounds, please.", answers: [8] },
          { who: 'Woman', text: 'Twenty-three pounds? Here you are.', answers: [8] },
          { who: 'Man', text: 'Thank you. Can I have your name for the order?', answers: [] },
          { who: 'Woman', text: "Yes. My first name is Jane. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's J, A, N, E.", answers: [9] },
          { who: 'Man', text: 'And your surname?', answers: [] },
          { who: 'Woman', text: "That's H, I, double L.", answers: [10] },
          { who: 'Man', text: 'Thank you, Jane. Your food is ready in ten minutes.', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "A Day at School",
        text: "Last Friday was a special day at Greenfield School: it was Science Day.\n\n" +
          "Lucy arrived at school at eight o'clock, earlier than usual. The school hall was full of tables, posters and strange machines. Every class had a project. Lucy's class made a small model of a volcano.\n\n" +
          "The first lesson was maths, but nobody could think about numbers. Everybody was excited. At ten o'clock, the bell rang, and the visitors came in: parents, teachers from other schools and a real scientist from the local university.\n\n" +
          "Lucy and her classmates stood next to their volcano. When the scientist came to their table, Lucy explained how a volcano works. Then her friend Max poured vinegar into the model. Red foam came out of the top, and everyone laughed and clapped.\n\n" +
          "At lunchtime, the students ate pizza in the playground. In the afternoon, the head teacher gave prizes. Lucy's class won second prize! Each student got a certificate and a science book.\n\n" +
          "After the prizes, the scientist gave a short talk in the hall. She told the students about her work. She studies the weather and travels to cold places like Iceland and Greenland. She showed photos of a real volcano and explained that hot rock from inside the Earth comes out when a volcano erupts. The students asked a lot of questions. Lucy wanted to know if it is dangerous to work near a volcano. \"Yes, it can be,\" the scientist answered, \"so we always wear special clothes and follow strict rules.\"\n\n" +
          "Before the students went home, the head teacher thanked everyone for their hard work. She also told them some exciting news: next year, the winning class is going to visit the university and see the scientist's laboratory.\n\n" +
          "On the way home, Lucy said to her mum, \"That was the best school day of the year!\"",
        words: [
          { w: "Project", uz: "Loyiha", emoji: "📁", ex: "Every class had a project." },
          { w: "Model", uz: "Maket", emoji: "🌋", ex: "Lucy's class made a small model of a volcano." },
          { w: "Excited", uz: "Hayajonlangan", emoji: "🤩", ex: "Everybody was excited." },
          { w: "The bell rang", uz: "Qo'ng'iroq chalindi", emoji: "🔔", ex: "At ten o'clock, the bell rang, and the visitors came in: parents, teachers from other schools and a real scientist from the local university." },
          { w: "Visitors", uz: "Mehmonlar", emoji: "👥", ex: "At ten o'clock, the bell rang, and the visitors came in: parents, teachers from other schools and a real scientist from the local university." },
          { w: "Explain", uz: "Tushuntirmoq", emoji: "🗣️", ex: "When the scientist came to their table, Lucy explained how a volcano works." },
          { w: "Classmates", uz: "Sinfdoshlar", emoji: "🧑‍🎓", ex: "Every class had a project." },
          { w: "Playground", uz: "O'yin maydonchasi", emoji: "🛝", ex: "At lunchtime, the students ate pizza in the playground." },
          { w: "Head teacher", uz: "Maktab direktori", emoji: "👩‍🏫", ex: "In the afternoon, the head teacher gave prizes." },
          { w: "Win a prize", uz: "Sovrin yutmoq", emoji: "🏆", ex: "Lucy's class won second prize!" }
        ],
        questions: [
          { type: "tf", q: "Science Day was on a Monday.", a: ["False"], line: 0 },
          { type: "tf", q: "Lucy and her classmates built a volcano model.", a: ["True"], line: 4 },
          { type: "tf", q: "A scientist from the university came to the school.", a: ["True"], line: 7 },
          { type: "tf", q: "Lucy poured the vinegar into the model.", a: ["False"], line: 10 },
          { type: "tf", q: "Lucy's class won first prize.", a: ["False"], line: 14 },
          { type: "open", q: "What does the scientist study?", keys: ["weather"], line: 18 },
          { type: "open", q: "Who were the visitors?", keys: ["parent","teacher","scientist"], line: 7 },
          { type: "open", q: "What came out of the top of the volcano model?", keys: ["foam"], line: 11 },
          { type: "open", q: "What did each student in Lucy's class get?", keys: ["certificate","book"], line: 15 },
          { type: "open", q: "Why does the scientist wear special clothes near volcanoes?", keys: ["dangerous","danger","safe"], line: 22 }
        ],
        retell: "Retell the story of Science Day in your own words. Talk about the morning, the volcano and the prizes."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My School",
        instruction: "Describe your school: the building, your lessons, your classmates, and what you like or don't like about it.",
        words: [
          { w: "subject", uz: "fan" },
          { w: "classmate", uz: "sinfdosh" },
          { w: "break", uz: "tanaffus" },
          { w: "timetable", uz: "dars jadvali" },
          { w: "difficult", uz: "qiyin" },
          { w: "easy", uz: "oson" },
          { w: "uniform", uz: "maktab formasi" },
          { w: "improve", uz: "yaxshilamoq" },
          { w: "learn", uz: "o'rganmoq" }
        ],
        minWords: 90, maxWords: 110, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "School & Education",
        words: [
          { w: "Classroom", uz: "Sinfxona", emoji: "🏫", ex: "Our classroom is on the second floor." },
          { w: "Subject", uz: "Fan", emoji: "📘", ex: "English is my favourite subject." },
          { w: "Lesson", uz: "Dars", emoji: "🕘", ex: "Our first lesson starts at nine o'clock." },
          { w: "Break", uz: "Tanaffus", emoji: "🔔", ex: "We play outside during the break." },
          { w: "Classmate", uz: "Sinfdosh", emoji: "🧑‍🎓", ex: "My classmate sits next to me." },
          { w: "Homework", uz: "Uy vazifasi", emoji: "📝", ex: "We have a lot of homework today." },
          { w: "Difficult", uz: "Qiyin", emoji: "😓", ex: "Maths is difficult for me." },
          { w: "Easy", uz: "Oson", emoji: "😎", ex: "This exercise is easy." },
          { w: "Improve", uz: "Yaxshilamoq", emoji: "📈", ex: "I want to improve my English." },
          { w: "Learn new things", uz: "Yangi narsalarni o'rganmoq", emoji: "💡", ex: "I like to learn new things at school." }
        ],
        questions: [
          { q: "What is your favourite subject? Why?", use: ["My favourite subject is …","because it is easy / interesting"] },
          { q: "Which subject is difficult for you?", use: ["… is difficult for me","but I want to improve"] },
          { q: "What do you do during the break?", use: ["During the break, I …","with my classmates"] },
          { q: "How much homework do you have?", use: ["I have a lot of / a little homework","I do it in the evening"] },
          { q: "What would you like to learn?", use: ["I would like to learn …","I like learning new things"] }
        ],
        part2: { topic: "Talk about your school", hints: ["where your school is and what it is like","your favourite and least favourite subject","your classmates and teachers"], seconds: 40 }
      }
    },
    {
      id: 'b8', no: 8, stage: 'Beginner', theme: 'Animals & pets', emoji: '🐶',
      listening: {
        src: 'audio/skills/beg-8-listening.mp3?v=1',
        title: "A girl at the vet's",
        intro: "Listen to a girl at the vet's. She talks about her pets. Write ONE WORD or A NUMBER for each answer.",
        questions: [
          { q: "Dog's name: _____", a: ['Rex'] },
          { q: 'Rex: _____ years old', a: ['2', 'two'] },
          { q: 'Rex is brown and _____', a: ['white'] },
          { q: 'Her other pet: a _____', a: ['cat'] },
          { q: "Cat's name: _____", a: ['Luna'] },
          { q: 'Luna: _____ years old', a: ['9', 'nine'] },
          { q: 'Colour of Luna: _____', a: ['black'] },
          { q: "Colour of Luna's eyes: _____", a: ['green'] },
          { q: 'Number of fish: _____', a: ['3', 'three'] },
          { q: "The vet can see Rex at _____ o'clock", a: ['4', 'four'] }
        ],
        words: [
          { w: 'vet', emoji: '🩺', m: 'a doctor for animals', ex: 'Can the vet see him?' },
          { w: 'pet', emoji: '🐾', m: 'an animal that lives with you at home', ex: 'Have you got any other pets?' },
          { w: 'dog', emoji: '🐶', m: 'a pet that says "woof"', ex: "I've got a new dog." },
          { w: 'cat', emoji: '🐱', m: 'a pet that says "miaow"', ex: "I've got a cat too." },
          { w: 'fish', emoji: '🐟', m: 'an animal that lives in water', ex: "I've got three fish too." },
          { w: 'brown', emoji: '🟤', m: 'the colour of chocolate', ex: "He's brown and white." },
          { w: 'white', emoji: '⚪', m: 'the colour of milk', ex: "He's brown and white." },
          { w: 'eyes', emoji: '👀', m: 'you see with them', ex: 'She has got green eyes.' },
          { w: 'old', emoji: '👵', m: 'not young', ex: "She's nine. She's an old cat." },
          { w: 'beautiful', emoji: '😍', m: 'very nice to look at', ex: 'A black cat with green eyes. Beautiful!' }
        ],
        transcript: [
          { who: 'Woman', text: "Step eight. You will hear a girl at the vet's. She talks about her pets. Listen and write the answers.", answers: [] },
          { who: 'Man', text: 'Hello. Can I help you?', answers: [] },
          { who: 'Woman', text: "Hello. I've got a new dog. Can the vet see him today?", answers: [] },
          { who: 'Man', text: "Yes, of course. What's your dog's name?", answers: [] },
          { who: 'Woman', text: "His name is Rex. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's R, E, X.", answers: [1] },
          { who: 'Man', text: 'How old is Rex?', answers: [] },
          { who: 'Woman', text: "He's two years old.", answers: [2] },
          { who: 'Man', text: 'Two years old. OK.', answers: [2] },
          { who: 'Man', text: 'What colour is he?', answers: [] },
          { who: 'Woman', text: "He's brown and white.", answers: [3] },
          { who: 'Man', text: 'Brown and white. Lovely.', answers: [3] },
          { who: 'Man', text: 'Have you got any other pets?', answers: [] },
          { who: 'Woman', text: "Yes, I've got a cat. Her name is Luna. I'll spell it for you.", answers: [4] },
          { who: 'Woman', text: "That's L, U, N, A.", answers: [5] },
          { who: 'Man', text: 'And how old is Luna?', answers: [] },
          { who: 'Woman', text: "She's nine. She's an old cat.", answers: [6] },
          { who: 'Man', text: 'Nine years old? OK.', answers: [6] },
          { who: 'Man', text: 'What colour is she?', answers: [] },
          { who: 'Woman', text: "She's black, and she has got green eyes.", answers: [7, 8] },
          { who: 'Man', text: 'A black cat with green eyes. Beautiful!', answers: [7, 8] },
          { who: 'Woman', text: "I've got three fish too.", answers: [9] },
          { who: 'Man', text: "Three fish! You've got a lot of pets.", answers: [9] },
          { who: 'Man', text: "The vet can see Rex at four o'clock today.", answers: [10] },
          { who: 'Woman', text: "Four o'clock. Thank you very much!", answers: [10] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "The Benefits of Having a Hobby",
        text: "A hobby is something you do in your free time because you enjoy it. Some people collect stamps, some play the guitar, and others grow plants. But did you know that hobbies are also good for us?\n\n" +
          "First, hobbies help us reduce stress. When you are busy with something you love, you forget about your problems for a while. For example, many people say that drawing or gardening makes them feel calm.\n\n" +
          "Second, hobbies help us learn new skills. A person who plays chess learns to think carefully. Someone who cooks learns to plan and to be creative. These skills are useful at school and at work too.\n\n" +
          "Third, hobbies help us make friends. When you join a club or a team, you meet people with the same interests. Emma, a 16-year-old student, joined a photography club last year. \"Now I have five new friends,\" she says, \"and we go out to take photos every Saturday.\"\n\n" +
          "Some hobbies can even become jobs. Harry Brooks, a 30-year-old from Leeds, started baking cakes as a hobby when he was a teenager. At first, he baked only for his family's birthdays. Then his friends started asking him to make cakes for their parties. Five years ago, he opened his own small bakery, and now he has three workers.\n\n" +
          "Of course, a hobby doesn't have to become a job. Doctors say it is important to do something just for fun. Many busy adults stop doing their hobbies because they have no time. But even thirty minutes a week can help.\n\n" +
          "If you want to start a hobby, think about what you enjoyed as a child. Did you like drawing, building things or dancing? You can also ask your friends what they do in their free time and join them. Remember that you don't need to be good at your hobby. The important thing is to enjoy it.\n\n" +
          "Finally, hobbies make life more interesting. So if you don't have a hobby yet, why not try something new this month?",
        words: [
          { w: "Collect", uz: "Yig'moq (kolleksiya qilmoq)", emoji: "📮", ex: "Some people collect stamps, some play the guitar, and others grow plants." },
          { w: "Reduce stress", uz: "Stressni kamaytirmoq", emoji: "😮‍💨", ex: "First, hobbies help us reduce stress." },
          { w: "For a while", uz: "Bir muddat", emoji: "⏳", ex: "When you are busy with something you love, you forget about your problems for a while." },
          { w: "Feel calm", uz: "Xotirjam bo'lmoq", emoji: "😌", ex: "For example, many people say that drawing or gardening makes them feel calm." },
          { w: "Skills", uz: "Ko'nikmalar", emoji: "🛠️", ex: "Second, hobbies help us learn new skills." },
          { w: "Creative", uz: "Ijodkor", emoji: "🎨", ex: "Someone who cooks learns to plan and to be creative." },
          { w: "Useful", uz: "Foydali", emoji: "👍", ex: "These skills are useful at school and at work too." },
          { w: "Join a club", uz: "Klubga a'zo bo'lmoq", emoji: "🧑‍🤝‍🧑", ex: "When you join a club or a team, you meet people with the same interests." },
          { w: "Interests", uz: "Qiziqishlar", emoji: "💡", ex: "When you join a club or a team, you meet people with the same interests." },
          { w: "Try something new", uz: "Yangi narsani sinab ko'rmoq", emoji: "✨", ex: "So if you don't have a hobby yet, why not try something new this month?" }
        ],
        questions: [
          { type: "tf", q: "Hobbies can help people feel less stressed.", a: ["True"], line: 3 },
          { type: "tf", q: "People who play chess learn to decide quickly without thinking.", a: ["False"], line: 7 },
          { type: "tf", q: "The skills we learn from hobbies are only useful at home.", a: ["False"], line: 9 },
          { type: "tf", q: "Emma is a member of a photography club.", a: ["True"], line: 12 },
          { type: "tf", q: "Emma and her friends take photos every Sunday.", a: ["False"], line: 13 },
          { type: "gap", q: "Hobbies help us reduce _____.", a: ["stress"], line: 3 },
          { type: "gap", q: "A person who plays chess learns to think _____.", a: ["carefully"], line: 7 },
          { type: "gap", q: "Emma joined a _____ club last year.", a: ["photography"], line: 12 },
          { type: "gap", q: "Five years ago, Harry Brooks opened his own small _____.", a: ["bakery"], line: 17 },
          { type: "gap", q: "Doctors say even thirty minutes a _____ can help.", a: ["week"], line: 21 }
        ],
        retell: "Retell the text in your own words. Explain the benefits of having a hobby."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Hobby",
        instruction: "Write about your favourite hobby: when you started it, how often you do it, and why it is important to you.",
        words: [
          { w: "hobby", uz: "sevimli mashg'ulot" },
          { w: "start", uz: "boshlamoq" },
          { w: "practise", uz: "mashq qilmoq" },
          { w: "skill", uz: "ko'nikma" },
          { w: "creative", uz: "ijodkor" },
          { w: "relaxing", uz: "tinchlantiruvchi" },
          { w: "improve", uz: "yaxshilamoq" },
          { w: "join", uz: "qo'shilmoq, a'zo bo'lmoq" },
          { w: "spend time", uz: "vaqt o'tkazmoq" }
        ],
        minWords: 90, maxWords: 110, minutes: 15
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Hobbies & Sports",
        words: [
          { w: "Hobby", uz: "Sevimli mashg'ulot", emoji: "🎨", ex: "My hobby is drawing." },
          { w: "Football", uz: "Futbol", emoji: "⚽", ex: "I play football with my friends." },
          { w: "Swimming", uz: "Suzish", emoji: "🏊", ex: "Swimming is good for your health." },
          { w: "Cycling", uz: "Velosiped haydash", emoji: "🚴", ex: "I go cycling in the park." },
          { w: "Drawing", uz: "Rasm chizish", emoji: "✏️", ex: "She is very good at drawing." },
          { w: "Dancing", uz: "Raqsga tushish", emoji: "💃", ex: "My sister loves dancing." },
          { w: "Playing chess", uz: "Shaxmat o'ynash", emoji: "♟️", ex: "Playing chess makes me think." },
          { w: "Practice", uz: "Mashq qilmoq", emoji: "🔁", ex: "I practise every afternoon." },
          { w: "Team", uz: "Jamoa", emoji: "👥", ex: "Our team won the game." },
          { w: "Competition", uz: "Musobaqa", emoji: "🏆", ex: "There is a chess competition next week." }
        ],
        questions: [
          { q: "What is your hobby?", use: ["My hobby is …","I started it when I was …"] },
          { q: "Do you like sports? Which ones?", use: ["I like …","football / swimming / cycling","I don't like …"] },
          { q: "How often do you practise?", use: ["I practise … times a week","every day / at the weekend"] },
          { q: "Do you play in a team?", use: ["Yes, I play in a … team","No, I prefer to …"] },
          { q: "Have you ever been in a competition?", use: ["Yes, I was in a … competition","No, but I want to"] }
        ],
        part2: { topic: "Talk about your hobby", hints: ["what your hobby is","when and where you do it","why you like it"], seconds: 40 }
      }
    },
    {
      id: 'b9', no: 9, stage: 'Beginner', theme: 'My room', emoji: '🛏️',
      listening: {
        src: 'audio/skills/beg-9-listening.mp3?v=1',
        title: 'A room at a summer school',
        intro: 'Listen to a girl at a summer school. A man shows her the room. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: 'First name: _____', a: ['Beth'] },
          { q: 'Room number: _____', a: ['12', 'twelve'] },
          { q: "The other girl's name: _____", a: ['Tess'] },
          { q: "Beth's bed is next to the _____", a: ['window'] },
          { q: 'The lamp is on the _____', a: ['desk'] },
          { q: 'The cupboard is behind the _____', a: ['door'] },
          { q: 'The mirror is on the _____', a: ['wall'] },
          { q: 'The towels are under the _____', a: ['bed'] },
          { q: 'The towels are in a _____ box', a: ['blue'] },
          { q: "Dinner is at _____ o'clock", a: ['6', 'six'] }
        ],
        words: [
          { w: 'summer school', emoji: '🏫', m: 'a school for a few weeks in the summer holidays', ex: 'You will hear a girl at a summer school.' },
          { w: 'next to', emoji: '↔️', m: 'very near, at the side of', ex: 'Your bed is next to the window.' },
          { w: 'window', emoji: '🪟', m: 'you can look out of it', ex: 'Your bed is next to the window.' },
          { w: 'lamp', emoji: '💡', m: 'it gives light', ex: 'The lamp is on the desk.' },
          { w: 'desk', emoji: '🖥️', m: 'a table where you work or study', ex: 'There is a desk and a lamp.' },
          { w: 'cupboard', emoji: '🗄️', m: 'you keep clothes or things in it', ex: 'Put your clothes in the cupboard.' },
          { w: 'behind', emoji: '🔙', m: 'at the back of', ex: "It's behind the door." },
          { w: 'mirror', emoji: '🪞', m: 'you can see your face in it', ex: "There's a mirror on the wall." },
          { w: 'towel', emoji: '🧺', m: 'you use it after a shower', ex: 'The towels are under your bed.' },
          { w: 'under', emoji: '⬇️', m: 'below something', ex: 'The towels are under your bed.' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step nine. You will hear a girl at a summer school. A man shows her the room. Listen and write the answers.', answers: [] },
          { who: 'Man', text: "Hello. Welcome to our summer school. What's your name?", answers: [] },
          { who: 'Woman', text: "Hi. My first name is Beth. I'll spell it for you.", answers: [] },
          { who: 'Woman', text: "That's B, E, T, H.", answers: [1] },
          { who: 'Man', text: "Thank you, Beth. You're in room twelve.", answers: [2] },
          { who: 'Woman', text: 'Room twelve. OK.', answers: [2] },
          { who: 'Man', text: "There's another girl in your room. Her name is Tess.", answers: [] },
          { who: 'Man', text: "That's T, E, double S.", answers: [3] },
          { who: 'Man', text: "Here's the room. Your bed is next to the window.", answers: [4] },
          { who: 'Woman', text: 'Next to the window? Great.', answers: [4] },
          { who: 'Man', text: "There's a desk too, and the lamp is on the desk.", answers: [5] },
          { who: 'Woman', text: 'Where can I put my clothes?', answers: [] },
          { who: 'Man', text: "In the cupboard. It's behind the door.", answers: [6] },
          { who: 'Woman', text: 'Is there a mirror in the room?', answers: [] },
          { who: 'Man', text: "Yes, there's a mirror on the wall.", answers: [7] },
          { who: 'Woman', text: 'And where are the towels?', answers: [] },
          { who: 'Man', text: "They're under your bed, in a blue box.", answers: [8, 9] },
          { who: 'Woman', text: 'Under the bed, in a blue box. Thanks.', answers: [8, 9] },
          { who: 'Man', text: "Dinner is at six o'clock, in the big room downstairs.", answers: [10] },
          { who: 'Woman', text: "Six o'clock. Thank you very much!", answers: [10] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "A Shopping Day",
        text: "Last Saturday, Anna and her mum went shopping because Anna needed new clothes for school.\n\n" +
          "They took the bus to the biggest shopping centre in the city. It was very crowded, so they made a plan. First, they went to a clothes shop on the second floor. Anna found a pair of dark blue jeans and a white shirt. She tried them on in the changing room. The jeans were too long, so the shop assistant brought her a smaller size. This time, they fit perfectly.\n\n" +
          "Next, they needed shoes. Anna liked a pair of black trainers, but they cost eighty pounds. \"That's too expensive,\" said her mum. Luckily, there was a sale in another shop, and they bought similar trainers for forty pounds.\n\n" +
          "By two o'clock, they were tired and hungry. They had lunch in a small café on the top floor. Anna had a chicken sandwich and an orange juice.\n\n" +
          "After lunch, Anna wanted to look at a bookshop. She loves reading, and she had some birthday money. She chose an adventure novel and a notebook with a green cover. At the cash desk, the shop assistant told her that students get a ten per cent discount, so she paid less than she expected.\n\n" +
          "On the way to the exit, they passed a small stand where a woman was selling handmade jewellery. Anna's mum stopped to look at a pair of silver earrings. \"They're beautiful,\" Anna said. \"You should buy them.\" Her mum wasn't sure because she didn't really need them. In the end, Anna used the rest of her birthday money to buy them as a surprise present for her mum. Her mum was very happy and wore them immediately.\n\n" +
          "They also went to a phone shop because Anna's screen was broken. The repair cost thirty pounds and took one hour, so they had a coffee while they waited.\n\n" +
          "Before going home, they stopped at the supermarket and bought food for the week. Anna's mum paid by card. It was a long but happy day.",
        words: [
          { w: "Go shopping", uz: "Xarid qilishga bormoq", emoji: "🛍️", ex: "Last Saturday, Anna and her mum went shopping because Anna needed new clothes for school." },
          { w: "Crowded", uz: "Gavjum", emoji: "👥", ex: "It was very crowded, so they made a plan." },
          { w: "Try on", uz: "Kiyib ko'rmoq", emoji: "👖", ex: "She tried them on in the changing room." },
          { w: "Changing room", uz: "Kiyinish xonasi", emoji: "🚪", ex: "She tried them on in the changing room." },
          { w: "Shop assistant", uz: "Sotuvchi", emoji: "🧑‍💼", ex: "The jeans were too long, so the shop assistant brought her a smaller size." },
          { w: "Size", uz: "O'lcham", emoji: "📏", ex: "The jeans were too long, so the shop assistant brought her a smaller size." },
          { w: "Fit", uz: "Mos kelmoq", emoji: "✅", ex: "This time, they fit perfectly." },
          { w: "Expensive", uz: "Qimmat", emoji: "💎", ex: "\"That's too expensive,\" said her mum." },
          { w: "Sale", uz: "Chegirma", emoji: "🏷️", ex: "Luckily, there was a sale in another shop, and they bought similar trainers for forty pounds." },
          { w: "Pay by card", uz: "Karta orqali to'lamoq", emoji: "💳", ex: "Anna's mum paid by card." }
        ],
        questions: [
          { type: "tf", q: "Anna and her mum went shopping on Sunday.", a: ["False"], line: 0 },
          { type: "tf", q: "They travelled to the shopping centre by bus.", a: ["True"], line: 1 },
          { type: "tf", q: "The first jeans were too short for Anna.", a: ["False"], line: 6 },
          { type: "tf", q: "They paid forty pounds for the trainers.", a: ["True"], line: 11 },
          { type: "tf", q: "They had lunch at home.", a: ["False"], line: 13 },
          { type: "open", q: "Why did Anna need new clothes?", keys: ["school"], line: 0 },
          { type: "open", q: "What did Anna find in the clothes shop?", keys: ["jeans","shirt"], line: 4 },
          { type: "open", q: "Why didn't they buy the first trainers?", keys: ["expensive","eighty","80"], line: 10 },
          { type: "open", q: "What did Anna buy for her mum?", keys: ["earring"], line: 20 },
          { type: "open", q: "Why did Anna pay less in the bookshop?", keys: ["discount","student"], line: 18 }
        ],
        retell: "Retell Anna's shopping day in your own words, from the bus to the supermarket."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "A Shopping Experience",
        instruction: "Write about a time you went shopping. Say where you went, who you were with, what you bought, and how you felt. Use the past simple.",
        words: [
          { w: "go shopping", uz: "xarid qilishga bormoq" },
          { w: "shopping centre", uz: "savdo markazi" },
          { w: "try on", uz: "kiyib ko'rmoq" },
          { w: "size", uz: "o'lcham" },
          { w: "price", uz: "narx" },
          { w: "expensive", uz: "qimmat" },
          { w: "cheap", uz: "arzon" },
          { w: "on sale", uz: "chegirmada" },
          { w: "pay", uz: "to'lamoq" },
          { w: "decide", uz: "qaror qilmoq" }
        ],
        minWords: 100, maxWords: 120, minutes: 20
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Shopping",
        words: [
          { w: "Shopping centre", uz: "Savdo markazi", emoji: "🏬", ex: "There is a big shopping centre near my house." },
          { w: "Supermarket", uz: "Supermarket", emoji: "🛒", ex: "We buy food at the supermarket." },
          { w: "Price", uz: "Narx", emoji: "🏷️", ex: "What is the price of this bag?" },
          { w: "Cheap", uz: "Arzon", emoji: "💲", ex: "These shoes are cheap." },
          { w: "Expensive", uz: "Qimmat", emoji: "💎", ex: "This phone is too expensive." },
          { w: "Try on", uz: "Kiyib ko'rmoq", emoji: "👗", ex: "Can I try on this jacket?" },
          { w: "Buy", uz: "Sotib olmoq", emoji: "🛍️", ex: "I want to buy a new T-shirt." },
          { w: "Sell", uz: "Sotmoq", emoji: "🤝", ex: "This shop sells books and pens." },
          { w: "Cash", uz: "Naqd pul", emoji: "💵", ex: "I pay in cash." },
          { w: "Shopping list", uz: "Xaridlar ro'yxati", emoji: "📝", ex: "My mum writes a shopping list." }
        ],
        questions: [
          { q: "Do you like shopping?", use: ["Yes / No, I … shopping","because …"] },
          { q: "Where do you usually go shopping?", use: ["I usually go to …","the supermarket / the shopping centre"] },
          { q: "What did you buy last?", use: ["The last thing I bought was …","it was cheap / expensive"] },
          { q: "Do you try on clothes before you buy them?", use: ["Yes, I always try on …","No, I …"] },
          { q: "Do you pay in cash or by card?", use: ["I usually pay in cash / by card","because …"] }
        ],
        part2: { topic: "Talk about a shop you like", hints: ["where it is and what it sells","how often you go there","why you like it"], seconds: 45 }
      }
    },
    {
      id: 'b10', no: 10, stage: 'Beginner', theme: 'My friend', emoji: '🧑‍🤝‍🧑',
      listening: {
        src: 'audio/skills/beg-10-listening.mp3?v=1',
        title: 'A new friend',
        intro: 'Listen to a boy and his mum. They talk about his new friend. Write ONE WORD or A NUMBER for each answer.',
        questions: [
          { q: "Friend's first name: _____", a: ['Nick'] },
          { q: 'Surname: _____', a: ['Grey'] },
          { q: 'Age: _____', a: ['11', 'eleven'] },
          { q: 'He likes: _____', a: ['football'] },
          { q: 'He plays every _____', a: ['Saturday'] },
          { q: 'His sister is _____ years old', a: ['7', 'seven'] },
          { q: 'Favourite food: _____', a: ['pasta'] },
          { q: "He doesn't like: _____", a: ['cheese'] },
          { q: 'Phone number: _____', a: ['07700 900 639', '07700900639'] },
          { q: 'The party is on _____', a: ['Friday'] }
        ],
        words: [
          { w: 'friend', emoji: '🤝', m: 'a person you like and spend time with', ex: 'Tell me about your new friend.' },
          { w: 'party', emoji: '🎉', m: 'a time when friends meet to eat, play and have fun', ex: 'I want to write a card for your party.' },
          { w: 'card', emoji: '💌', m: 'a small paper with a picture and a message', ex: 'I want to write a party card for him.' },
          { w: 'spell', emoji: '🔤', m: 'to say the letters of a word', ex: "I'll spell it for you." },
          { w: 'football', emoji: '⚽', m: 'a game with a ball and two teams', ex: 'He likes football.' },
          { w: 'sister', emoji: '👧', m: 'a girl with the same mum and dad as you', ex: "He's got a sister." },
          { w: 'pasta', emoji: '🍝', m: 'food from Italy, like spaghetti', ex: 'He loves pasta.' },
          { w: 'cheese', emoji: '🧀', m: 'a yellow or white food made from milk', ex: "He doesn't like cheese." },
          { w: 'phone number', emoji: '📱', m: 'the number you call', ex: 'Have you got his phone number?' },
          { w: 'call', emoji: '📞', m: 'to talk to someone on the phone', ex: "I'll call his mum." }
        ],
        transcript: [
          { who: 'Woman', text: 'Step ten. You will hear a boy and his mum. They talk about his new friend. Listen and write the answers.', answers: [] },
          { who: 'Woman', text: "Dan, I want to write a party card for your new friend. What's his name?", answers: [] },
          { who: 'Man', text: "His first name is Nick. I'll spell it for you.", answers: [] },
          { who: 'Man', text: "That's N, I, C, K.", answers: [1] },
          { who: 'Woman', text: "And what's his surname?", answers: [] },
          { who: 'Man', text: "That's G, R, E, Y.", answers: [2] },
          { who: 'Woman', text: 'How old is Nick?', answers: [] },
          { who: 'Man', text: "He's eleven, like me.", answers: [3] },
          { who: 'Woman', text: 'Eleven years old. OK.', answers: [3] },
          { who: 'Woman', text: 'What does he like?', answers: [] },
          { who: 'Man', text: 'He likes football. He plays every Saturday.', answers: [4, 5] },
          { who: 'Woman', text: 'Football on Saturday. Nice.', answers: [4, 5] },
          { who: 'Man', text: "He's got a little sister. She's seven years old.", answers: [6] },
          { who: 'Woman', text: 'Seven years old? OK.', answers: [6] },
          { who: 'Woman', text: 'And what food does he like?', answers: [] },
          { who: 'Man', text: "He loves pasta, but he doesn't like cheese.", answers: [7, 8] },
          { who: 'Woman', text: 'Pasta, but no cheese. OK.', answers: [7, 8] },
          { who: 'Woman', text: 'Have you got his phone number?', answers: [] },
          { who: 'Man', text: "Yes. It's oh seven seven double oh, nine double oh, six three nine.", answers: [9] },
          { who: 'Woman', text: 'Oh seven seven double oh, nine double oh, six three nine?', answers: [9] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "Good. I'll call his mum about your party on Friday.", answers: [10] },
          { who: 'Man', text: 'Thanks, Mum!', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "My Hometown",
        text: "I was born in Brookfield, a small town by a river in the north of England, and I have lived here all my life.\n\n" +
          "About twenty thousand people live in Brookfield. It is not famous, but it is a lovely place. The town centre has a market square, an old church and a lot of small shops and cafés. Every Thursday, farmers from nearby villages come to the market and sell fresh fruit, vegetables and cheese.\n\n" +
          "My favourite place is the park next to the river. In summer, people have picnics there, and children swim in the river. In winter, it is very quiet, and I like walking there with my dog.\n\n" +
          "Brookfield has two schools, a hospital and a small library. The library is my second favourite place. I often go there after school to read or study.\n\n" +
          "Of course, my town is not perfect. There is no cinema, so we have to take the train to a bigger city to watch new films. And there isn't much to do in the evenings.\n\n" +
          "Brookfield has a long history. The old church in the market square is more than five hundred years old, and some of the houses near the river are even older. In the past, the town was famous for making wool, and many people worked in small factories by the water. Today, one of these old factories is a museum, and you can see how people made wool two hundred years ago.\n\n" +
          "The town is changing, though. A few years ago, a new supermarket opened on the edge of town, and some small shops in the centre closed. My grandparents say the town was busier when they were young. But there are good changes too. Last year, the town opened a new sports centre with a swimming pool, and now there are more activities for young people.\n\n" +
          "Every August, Brookfield has a summer festival. There is live music in the market square, food stalls and a boat race on the river. People from nearby towns come to watch, and for one weekend the quiet little town is full of life.\n\n" +
          "Still, I love my hometown. People are friendly, and everyone knows everyone.",
        words: [
          { w: "Be born", uz: "Tug'ilmoq", emoji: "👶", ex: "I was born in Brookfield, a small town by a river in the north of England, and I have lived here all my life." },
          { w: "Hometown", uz: "Tug'ilib o'sgan shahar", emoji: "🏘️", ex: "Still, I love my hometown." },
          { w: "Famous", uz: "Mashhur", emoji: "⭐", ex: "It is not famous, but it is a lovely place." },
          { w: "Town centre", uz: "Shahar markazi", emoji: "🏙️", ex: "The town centre has a market square, an old church and a lot of small shops and cafés." },
          { w: "Nearby", uz: "Yaqin atrofdagi", emoji: "📍", ex: "Every Thursday, farmers from nearby villages come to the market and sell fresh fruit, vegetables and cheese." },
          { w: "Fresh", uz: "Yangi (toza)", emoji: "🥬", ex: "Every Thursday, farmers from nearby villages come to the market and sell fresh fruit, vegetables and cheese." },
          { w: "Have a picnic", uz: "Piknik qilmoq", emoji: "🧺", ex: "In summer, people have picnics there, and children swim in the river." },
          { w: "Quiet", uz: "Tinch", emoji: "🤫", ex: "In winter, it is very quiet, and I like walking there with my dog." },
          { w: "Take the train", uz: "Poyezdda bormoq", emoji: "🚆", ex: "There is no cinema, so we have to take the train to a bigger city to watch new films." },
          { w: "Friendly", uz: "Xushmuomala", emoji: "😊", ex: "People are friendly, and everyone knows everyone." }
        ],
        questions: [
          { type: "tf", q: "Brookfield is a big city.", a: ["False"], line: 0 },
          { type: "tf", q: "Farmers sell food at the market on Thursdays.", a: ["True"], line: 4 },
          { type: "tf", q: "Children swim in the river in winter.", a: ["False"], line: 7 },
          { type: "tf", q: "The writer often studies in the library.", a: ["True"], line: 10 },
          { type: "tf", q: "There is a cinema in the town centre.", a: ["False"], line: 12 },
          { type: "gap", q: "Farmers from nearby _____ come to the market every Thursday.", a: ["villages"], line: 4 },
          { type: "gap", q: "The writer's second favourite place in town is the _____.", a: ["library"], line: 9 },
          { type: "gap", q: "Many years ago, people in Brookfield worked in small factories that made _____.", a: ["wool"], line: 16 },
          { type: "gap", q: "Last year, a new sports centre with a swimming _____ opened.", a: ["pool"], line: 22 },
          { type: "gap", q: "During the summer festival, there is a boat _____ on the river.", a: ["race"], line: 24 }
        ],
        retell: "Retell the text in your own words. Describe Brookfield: its places, its good points and its bad points."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Hometown",
        instruction: "Describe your hometown for a visitor: where it is, what it is like, and which places you recommend.",
        words: [
          { w: "hometown", uz: "tug'ilib o'sgan shahar" },
          { w: "was born", uz: "tug'ilgan" },
          { w: "famous for", uz: "... bilan mashhur" },
          { w: "crowded", uz: "gavjum" },
          { w: "quiet", uz: "tinch" },
          { w: "city centre", uz: "shahar markazi" },
          { w: "nearby", uz: "yaqin atrofda" },
          { w: "visitors", uz: "mehmonlar, sayyohlar" },
          { w: "recommend", uz: "tavsiya qilmoq" }
        ],
        minWords: 100, maxWords: 120, minutes: 20
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09): topic + words with their meaning in the students' language (uz)
        topic: "Your City",
        words: [
          { w: "City centre", uz: "Shahar markazi", emoji: "🏙️", ex: "The city centre is always busy." },
          { w: "Park", uz: "Bog'", emoji: "🌳", ex: "We walk in the park on Sundays." },
          { w: "Shopping centre", uz: "Savdo markazi", emoji: "🏬", ex: "The shopping centre has a cinema." },
          { w: "Hospital", uz: "Kasalxona", emoji: "🏥", ex: "My mum works at the hospital." },
          { w: "Library", uz: "Kutubxona", emoji: "📚", ex: "I read books in the library." },
          { w: "Crowded", uz: "Odamlar bilan gavjum", emoji: "👥", ex: "The market is crowded on Saturdays." },
          { w: "Quiet", uz: "Tinch", emoji: "🤫", ex: "My street is quiet at night." },
          { w: "Beautiful", uz: "Chiroyli", emoji: "🌸", ex: "Our city is beautiful in spring." },
          { w: "Famous", uz: "Mashhur", emoji: "⭐", ex: "This building is famous." },
          { w: "Near", uz: "Yaqin", emoji: "📍", ex: "The school is near my house." }
        ],
        questions: [
          { q: "Where do you live?", use: ["I live in …","it is a big / small city","near …"] },
          { q: "What is your favourite place in your city?", use: ["My favourite place is …","because it is beautiful / quiet"] },
          { q: "Is your city crowded or quiet?", use: ["It is crowded / quiet","especially in …"] },
          { q: "What is your city famous for?", use: ["My city is famous for …","many tourists visit …"] },
          { q: "What is near your home?", use: ["There is a … near my home","a park / a library / a shop"] }
        ],
        part2: { topic: "Talk about your city", hints: ["where it is and how big it is","your favourite place there","what you like and don't like about it"], seconds: 45 }
      }
    },
    {
      id: 'e1', no: 11, stage: 'Elementary', theme: 'Meeting people', emoji: '👋',
      listening: {
        src: 'audio/skills/elem-1-listening.mp3?v=6',
        title: 'Checking in at a hotel',
        intro: 'Listen to a man checking in at a hotel. Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Surname: _____', a: ['Thompson'] },
          { q: 'First name: _____', a: ['Steven'] },
          { q: 'Room number: _____', a: ['214', 'two one four'] },
          { q: 'Phone number: _____', a: ['07700 900 123', '07700900123'] },
          { q: 'Home town: _____', a: ['Brighton'] },
          { q: 'Number of nights: _____', a: ['3', 'three'] },
          { q: 'Breakfast starts at: _____ a.m.', a: ['7.30', '7:30', '730', 'seven thirty', 'half past seven'] },
          { q: 'Car park: on _____ Street', a: ['Kingsley'] },
          { q: 'Opposite the hotel: a _____', a: ['supermarket', 'big supermarket'] },
          { q: 'Check-out time: _____ a.m.', a: ['11', 'eleven', '11.00', '11:00', "eleven o'clock", "11 o'clock"] }
        ],
        words: [
          { w: 'booking', emoji: '📝', m: 'a room or a table you ask for before you arrive', ex: "I've got a booking for tonight." },
          { w: 'surname', emoji: '🪪', m: 'your family name', ex: 'My surname is Thompson.' },
          { w: 'spell', emoji: '🔤', m: 'to say the letters of a word one by one', ex: 'Could you spell your surname, please?' },
          { w: 'floor', emoji: '🏢', m: 'one level of a building', ex: "Your room is on the second floor." },
          { w: 'stay', emoji: '🛏️', m: 'to live in a place for a short time', ex: "You're staying with us for three nights." },
          { w: 'ground floor', emoji: '⬇️', m: 'the level of a building that is on the street', ex: 'The restaurant is on the ground floor.' },
          { w: 'car park', emoji: '🅿️', m: 'a place where you leave your car', ex: 'Our car park is behind the hotel.' },
          { w: 'behind', emoji: '🔙', m: 'at the back of something', ex: 'The car park is behind the hotel.' },
          { w: 'opposite', emoji: '↔️', m: 'on the other side of the street from something', ex: "There's a supermarket opposite the hotel." },
          { w: 'check-out', emoji: '🧳', m: 'the time when you leave a hotel and give back the key', ex: "Check-out is at eleven o'clock." }
        ],
        transcript: [
          { who: 'Woman', text: 'Step eleven. You will hear a conversation at a hotel. Listen and complete the form.', answers: [] },
          { who: 'Woman', text: 'Good afternoon, and welcome to the Riverside Hotel. How can I help you?', answers: [] },
          { who: 'Man', text: "Hello. I've got a booking for tonight. My surname is Thompson.", answers: [] },
          { who: 'Woman', text: 'Lovely. Could you spell your surname for me, please?', answers: [] },
          { who: 'Man', text: "That's T, H, O, M, P, S, O, N.", answers: [1] },
          { who: 'Woman', text: "Thank you. And what's your first name?", answers: [] },
          { who: 'Man', text: "People often write my first name wrong, so I'll spell it for you.", answers: [] },
          { who: 'Man', text: "That's S, T, E, V, E, N.", answers: [2] },
          { who: 'Woman', text: "Perfect, thank you. Your room is number two one four. It's on the second floor.", answers: [3] },
          { who: 'Man', text: "Room two one four. That's great, thank you.", answers: [] },
          { who: 'Woman', text: 'Can I have a phone number, please?', answers: [] },
          { who: 'Man', text: "Of course. It's oh seven seven double oh, nine double oh, one two three.", answers: [4] },
          { who: 'Woman', text: "Oh seven seven double oh, nine double oh, one two three?", answers: [4] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Thank you. And where are you from?', answers: [] },
          { who: 'Man', text: "I'm from Brighton, on the south coast. I'm here for work this week.", answers: [5] },
          { who: 'Woman', text: "How nice. And you're staying with us for three nights, is that right?", answers: [6] },
          { who: 'Man', text: "Yes, that's right, three nights. What time is breakfast in the morning?", answers: [6] },
          { who: 'Woman', text: 'Breakfast starts at seven thirty, in the restaurant on the ground floor.', answers: [7] },
          { who: 'Man', text: "Seven thirty? Great.", answers: [7] },
          { who: 'Man', text: 'Lovely. And where can I leave my car?', answers: [] },
          { who: 'Woman', text: 'Our car park is behind the hotel, on Kingsley Street.', answers: [8] },
          { who: 'Man', text: 'Sorry, could you spell the name of the street for me?', answers: [] },
          { who: 'Woman', text: "That's K, I, N, G, S, L, E, Y.", answers: [8] },
          { who: 'Man', text: 'Thanks. Is there a shop near here? I need a few things.', answers: [] },
          { who: 'Woman', text: "Yes, there's a big supermarket opposite the hotel. It's open until ten in the evening.", answers: [9] },
          { who: 'Man', text: "That's very useful. And what time is check-out on my last day?", answers: [] },
          { who: 'Woman', text: "Check-out is at eleven o'clock in the morning. Here's your key, and enjoy your stay!", answers: [10] },
          { who: 'Man', text: "Eleven o'clock. OK, thank you.", answers: [10] },
          { who: 'Man', text: "Thank you very much. You've been very kind.", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "My First Big Trip",
        text: "Two years ago, I travelled abroad for the first time. My aunt invited me to visit her in Edinburgh, Scotland, for ten days during the summer holidays.\n\n" +
          "The journey was an adventure. My flight left at six in the morning, so I woke up at three. I was nervous because I was travelling alone, but a friendly flight attendant helped me find my seat. When the plane landed, my aunt was waiting for me at the airport with a big smile.\n\n" +
          "Edinburgh is an old and beautiful city. On my first day, we climbed the hill to Edinburgh Castle. From the top, we could see the whole city and the sea. The next day, we visited a museum and walked along the Royal Mile, the most famous street in the old town.\n\n" +
          "The weather surprised me. It was July, but it was cold and windy, and it rained almost every afternoon. I had to buy a warm jacket!\n\n" +
          "On the fourth day, my aunt took me on a day trip to the Highlands, the mountains in the north of Scotland. We left early in the morning by car. The landscape was amazing: green hills, dark lakes and small villages with stone houses. We stopped at Loch Ness, a long and deep lake. Many people believe a monster lives in it, and there are lots of shops selling toy monsters. We didn't see anything, of course, but I bought a toy monster for my little cousin.\n\n" +
          "I also tried some local food. One evening, my aunt cooked haggis, a traditional Scottish dish made with meat, onions and oats. I was not sure at first, but it was actually tasty. I also loved the shortbread, a sweet butter biscuit that people often eat with tea.\n\n" +
          "Every evening, I called my parents and told them about my day. They were happy because I sounded excited and not homesick. My mum said, \"We are proud of you. You are more independent than we thought.\"\n\n" +
          "The hardest part of the trip was saying goodbye. On my last day, my aunt and I walked around the old town one more time, and I took a lot of photos. At the airport, I almost cried.\n\n" +
          "The trip changed me. I became more confident, and I discovered that I love exploring new places. Next year, I am planning to visit my aunt again.",
        words: [
          { w: "Travel abroad", uz: "Chet elga sayohat qilmoq", emoji: "✈️", ex: "Two years ago, I travelled abroad for the first time." },
          { w: "For the first time", uz: "Birinchi marta", emoji: "1️⃣", ex: "Two years ago, I travelled abroad for the first time." },
          { w: "Invite", uz: "Taklif qilmoq", emoji: "💌", ex: "My aunt invited me to visit her in Edinburgh, Scotland, for ten days during the summer holidays." },
          { w: "Journey", uz: "Safar", emoji: "🧳", ex: "The journey was an adventure." },
          { w: "Flight attendant", uz: "Styuardessa", emoji: "🧑‍✈️", ex: "I was nervous because I was travelling alone, but a friendly flight attendant helped me find my seat." },
          { w: "Land", uz: "Qo'nmoq", emoji: "🛬", ex: "When the plane landed, my aunt was waiting for me at the airport with a big smile." },
          { w: "Climb", uz: "Ko'tarilmoq", emoji: "🧗", ex: "On my first day, we climbed the hill to Edinburgh Castle." },
          { w: "Windy", uz: "Shamolli", emoji: "🌬️", ex: "It was July, but it was cold and windy, and it rained almost every afternoon." },
          { w: "Confident", uz: "O'ziga ishongan", emoji: "💪", ex: "I became more confident, and I discovered that I love exploring new places." },
          { w: "Explore", uz: "Kashf qilmoq", emoji: "🧭", ex: "I became more confident, and I discovered that I love exploring new places." }
        ],
        questions: [
          { type: "tfng", q: "The writer made the journey to Scotland without the family.", a: ["True"], line: 4 },
          { type: "tfng", q: "The weather in Edinburgh was hot and sunny.", a: ["False"], line: 11 },
          { type: "tfng", q: "The writer saw the Loch Ness monster.", a: ["False"], line: 18 },
          { type: "tfng", q: "The writer's aunt works at the airport.", a: ["Not given"], line: 5 },
          { type: "tfng", q: "The writer liked the haggis in the end.", a: ["True"], line: 21 },
          { type: "gap", q: "The writer's flight left at six in the _____.", a: ["morning"], line: 3 },
          { type: "gap", q: "From the top of the castle hill, they could see the whole city and the _____.", a: ["sea"], line: 8 },
          { type: "gap", q: "In the Highlands, there are small villages with _____ houses.", a: ["stone"], line: 15 },
          { type: "gap", q: "Haggis is made with meat, onions and _____.", a: ["oats"], line: 20 },
          { type: "gap", q: "Shortbread is a sweet butter _____.", a: ["biscuit"], line: 22 },
          { type: "open", q: "Why was the writer nervous at the start of the journey?", keys: ["alone"], line: 4 },
          { type: "open", q: "Why did the writer have to buy a warm jacket?", keys: ["cold","wind","rain"], line: 11 },
          { type: "open", q: "What did the writer buy for the little cousin?", keys: ["monster","toy"], line: 18 },
          { type: "open", q: "How did the writer's parents feel about the trip?", keys: ["proud","happy"], line: 25 },
          { type: "open", q: "How did the trip change the writer?", keys: ["confident","explor","independent"], line: 30 }
        ],
        retell: "Retell the story of the first big trip in your own words. Talk about the flight, the city and the weather."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Last Holiday",
        instruction: "Write about your last holiday: where you went, what you did, and what you remember most. Use the past simple.",
        words: [
          { w: "holiday", uz: "ta'til" },
          { w: "travel", uz: "sayohat qilmoq" },
          { w: "stay", uz: "qolmoq, turmoq" },
          { w: "sightseeing", uz: "diqqatga sazovor joylarni ko'rish" },
          { w: "amazing", uz: "ajoyib" },
          { w: "weather", uz: "ob-havo" },
          { w: "take photos", uz: "rasmga olmoq" },
          { w: "the best part", uz: "eng yaxshi qismi" },
          { w: "unforgettable", uz: "unutilmas" }
        ],
        minWords: 100, maxWords: 120, minutes: 20
      },
      speaking: {
        words: [
          { w: 'meet', emoji: '🤝', ex: 'I met a new friend at the sports club.' },
          { w: 'introduce', emoji: '🙋', ex: 'Let me introduce my friend Tom.' },
          { w: 'nice to meet you', emoji: '😊', ex: 'Hello, Sarah. Nice to meet you!' },
          { w: 'classmate', emoji: '🎒', ex: 'My classmate sits next to me in English.' },
          { w: 'neighbour', emoji: '🏡', ex: 'Our new neighbour has got a big dog.' },
          { w: 'first time', emoji: '1️⃣', ex: 'It was the first time I saw him.' },
          { w: 'shy', emoji: '🙈', ex: 'She was a bit shy at first.' },
          { w: 'chat', emoji: '💬', ex: 'We chatted for an hour after the lesson.' },
          { w: 'get on well', emoji: '👍', ex: 'We get on well because we like the same music.' },
          { w: 'invite', emoji: '✉️', ex: 'I invited her to my birthday party.' }
        ],
        questions: [
          { q: 'How do you say hello to a new person?', use: ['I usually say …', 'Nice to meet you.', 'shake hands', 'smile'] },
          { q: 'Where do you usually meet new people?', use: ['I usually meet new people at …', 'school', 'a club', 'the park'] },
          { q: 'Is it easy for you to make new friends?', use: ['Yes, it is easy because …', "No, it isn't easy because …", 'shy', 'friendly'] },
          { q: 'Tell me about a new classmate or neighbour.', use: ['My new … is called …', "He's / She's …", 'from', 'friendly'] },
          { q: 'What do you like to talk about with new friends?', use: ['We usually talk about …', 'music', 'films', 'sport', 'school'] }
        ],
        part2: {
          topic: 'A person you met recently',
          hints: ['who this person is and where you met', 'what this person looks like and what he or she is like', 'what you talked about or did together'],
          seconds: 45
        }
      }
    },
    {
      id: 'e2', no: 12, stage: 'Elementary', theme: 'Family & friends', emoji: '👨‍👩‍👧',
      listening: {
        src: 'audio/skills/elem-2-listening.mp3?v=6',
        title: 'Joining a sports club',
        intro: 'Listen to a woman joining a sports club with her son. Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Surname: _____', a: ['Hughes'] },
          { q: "Mother's first name: _____", a: ['Rachel'] },
          { q: "Son's first name: _____", a: ['Callum'] },
          { q: "Son's age: _____", a: ['9', 'nine'] },
          { q: 'Sport for the son: _____', a: ['swimming'] },
          { q: 'Lessons on: _____ mornings', a: ['Saturday', 'Saturdays'] },
          { q: 'Address: 18 _____ Road', a: ['Hampton'] },
          { q: 'Phone number: _____', a: ['07700 900 452', '07700900452'] },
          { q: 'Cost: £_____ a month', a: ['30', 'thirty', '30.00', '£30'] },
          { q: 'For the first lesson, bring a _____', a: ['photo', 'photograph', 'photo of Callum'] }
        ],
        words: [
          { w: 'join', emoji: '🤝', m: 'to become a member of a club or a group', ex: "I'd like to join the club with my son." },
          { w: 'keen on', emoji: '😍', m: 'liking something very much', ex: "He's very keen on sport." },
          { w: 'form', emoji: '📋', m: 'a paper or a page where you write information about yourself', ex: "I'll fill in the form for you." },
          { w: 'son', emoji: '👦', m: 'a boy who is your child', ex: "What's your son's name?" },
          { w: 'energy', emoji: '⚡', m: 'the power to be busy and active for a long time', ex: "He's got lots of energy!" },
          { w: 'best friend', emoji: '👫', m: 'the friend you like most', ex: 'His best friend goes to your swimming club too.' },
          { w: 'lesson', emoji: '🏊', m: 'a time when someone teaches you something', ex: 'Our swimming lessons for children are on Saturday mornings.' },
          { w: 'free', emoji: '🆓', m: 'not busy; with time to do something', ex: "We're free at the weekend." },
          { w: 'a month', emoji: '📅', m: 'for each month', ex: "It's thirty pounds a month." },
          { w: 'membership card', emoji: '💳', m: 'a card that shows you are a member of a club', ex: 'Please bring a photo for his membership card.' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step twelve. You will hear a conversation at a sports club. Listen and complete the form.', answers: [] },
          { who: 'Man', text: 'Good morning, Greenfield Sports Club. How can I help you?', answers: [] },
          { who: 'Woman', text: "Hello. I'd like to join the club with my son, please. He's very keen on sport.", answers: [] },
          { who: 'Man', text: "Wonderful. I'll fill in the form for you. What's your surname, please?", answers: [] },
          { who: 'Woman', text: "My surname is Hughes. I'll spell it for you.", answers: [1] },
          { who: 'Woman', text: "That's H, U, G, H, E, S.", answers: [1] },
          { who: 'Man', text: "Thank you. And what's your first name?", answers: [] },
          { who: 'Woman', text: 'My first name is Rachel.', answers: [2] },
          { who: 'Man', text: "Lovely. And what's your son's name?", answers: [] },
          { who: 'Woman', text: 'His name is Callum. People often spell it wrong, so here it is.', answers: [3] },
          { who: 'Woman', text: "That's C, A, double L, U, M.", answers: [3] },
          { who: 'Man', text: 'Thanks. And how old is Callum?', answers: [] },
          { who: 'Woman', text: "He's nine years old, and he's got lots of energy!", answers: [4] },
          { who: 'Man', text: "I'm sure he has! Which sport would he like to do?", answers: [] },
          { who: 'Woman', text: 'He wants to learn swimming. His best friend goes to your swimming club too.', answers: [5] },
          { who: 'Man', text: 'Great. Our swimming lessons for children are on Saturday mornings.', answers: [6] },
          { who: 'Woman', text: "Saturday is perfect for us. We're free at the weekend.", answers: [6] },
          { who: 'Man', text: 'Good. Now, can I have your address, please?', answers: [] },
          { who: 'Woman', text: 'Yes, we live at eighteen Hampton Road.', answers: [7] },
          { who: 'Man', text: 'Could you spell the name of the road for me?', answers: [] },
          { who: 'Woman', text: "That's H, A, M, P, T, O, N.", answers: [7] },
          { who: 'Man', text: "Thank you. And what's the best phone number for you?", answers: [] },
          { who: 'Woman', text: "It's oh seven seven double oh, nine double oh, four five two.", answers: [8] },
          { who: 'Man', text: "Oh seven seven double oh, nine double oh, four five two?", answers: [8] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: "Perfect. For you and Callum together, it's thirty pounds a month.", answers: [9] },
          { who: 'Woman', text: "Thirty pounds a month?", answers: [9] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'That sounds fine. Do we need anything for the first lesson?', answers: [] },
          { who: 'Man', text: 'Yes, please bring a photo of Callum for his membership card.', answers: [10] },
          { who: 'Woman', text: 'No problem. Thank you very much for your help.', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "My Dreams for the Future",
        text: "Everyone has dreams. Some dreams are small, and some are very big. Here are the dreams of three teenagers.\n\n" +
          "Sara is sixteen and loves animals. She wants to become a vet. \"Right now, I'm studying biology and chemistry very hard,\" she says. \"After school, I'm going to apply to a university in London.\" Sara also volunteers at an animal shelter every Saturday. She feeds the dogs and cleans their cages.\n\n" +
          "Oliver, seventeen, has a different dream. He wants to start his own business. Last year, he started selling handmade phone cases online, and he already has more than two hundred customers. \"In ten years, I hope to have a small company with ten workers,\" he explains.\n\n" +
          "Mia is fifteen. Her dream is to travel around the world and write about it. She keeps a diary and writes something in it every day. She is also learning Spanish and French. \"I want to visit at least thirty countries,\" she says with a smile.\n\n" +
          "Not every dream is easy. Sara's marks in chemistry were not very good last year, and she was worried. She asked her teacher for help, and now she stays after school twice a week for extra lessons. Her marks are much better this year.\n\n" +
          "Oliver also had problems. At the beginning, nobody bought his phone cases, and he felt like giving up. Then his older sister helped him make short videos about his products and share them online. After that, orders started to come in. Last month, a local shop asked to sell his cases too. He spends most of his money on new materials, and he saves the rest.\n\n" +
          "Mia's parents were not happy about her plan at first. They wanted her to become a doctor or a lawyer. But after she showed them her travel blog, which has more than a thousand readers, they changed their minds. Now her father helps her plan short trips during the school holidays, and last summer they visited Portugal together. She wrote about the food, the beaches and the people she met, and her readers loved it.\n\n" +
          "All three teenagers agree that it is important to have a plan. \"A dream without a plan is just a wish,\" says Sara.\n\n" +
          "Their dreams are different, but they have one thing in common: they are all working hard today to make their dreams come true tomorrow.",
        words: [
          { w: "Become", uz: "Bo'lmoq (aylanmoq)", emoji: "🌱", ex: "She wants to become a vet." },
          { w: "Vet", uz: "Veterinar", emoji: "🐾", ex: "She wants to become a vet." },
          { w: "Apply to", uz: "Hujjat topshirmoq", emoji: "📝", ex: "\"After school, I'm going to apply to a university in London.\" Sara also volunteers at an animal shelter every Saturday." },
          { w: "Volunteer", uz: "Ko'ngilli bo'lib ishlamoq", emoji: "🤲", ex: "\"After school, I'm going to apply to a university in London.\" Sara also volunteers at an animal shelter every Saturday." },
          { w: "Animal shelter", uz: "Hayvonlar boshpanasi", emoji: "🏠", ex: "\"After school, I'm going to apply to a university in London.\" Sara also volunteers at an animal shelter every Saturday." },
          { w: "Start a business", uz: "Biznes boshlamoq", emoji: "💼", ex: "He wants to start his own business." },
          { w: "Customers", uz: "Mijozlar", emoji: "🧑‍🤝‍🧑", ex: "Last year, he started selling handmade phone cases online, and he already has more than two hundred customers." },
          { w: "Keep a diary", uz: "Kundalik yuritmoq", emoji: "📔", ex: "She keeps a diary and writes something in it every day." },
          { w: "Have in common", uz: "Umumiy jihati bor", emoji: "🔗", ex: "Their dreams are different, but they have one thing in common: they are all working hard today to make their dreams come true tomorrow." },
          { w: "Come true", uz: "Amalga oshmoq", emoji: "🌟", ex: "Their dreams are different, but they have one thing in common: they are all working hard today to make their dreams come true tomorrow." }
        ],
        questions: [
          { type: "tfng", q: "Sara would like to become a vet.", a: ["True"], line: 4 },
          { type: "tfng", q: "Oliver's phone cases sold well from the very beginning.", a: ["False"], line: 22 },
          { type: "tfng", q: "Mia's parents first wanted her to become a teacher.", a: ["False"], line: 28 },
          { type: "tfng", q: "Oliver's sister is a photographer.", a: ["Not given"], line: 23 },
          { type: "tfng", q: "More than a thousand people read Mia's blog.", a: ["True"], line: 29 },
          { type: "gap", q: "Sara volunteers at an animal _____ every Saturday.", a: ["shelter"], line: 6 },
          { type: "gap", q: "Sara stays after school twice a week for extra _____.", a: ["lessons"], line: 19 },
          { type: "gap", q: "Oliver's sister helped him make short _____ about his products.", a: ["videos"], line: 23 },
          { type: "gap", q: "Last summer, Mia and her father visited _____.", a: ["Portugal"], line: 30 },
          { type: "gap", q: "Sara says that a dream without a plan is just a _____.", a: ["wish"], line: 33 },
          { type: "open", q: "How did Sara make her chemistry marks better?", keys: ["lesson","teacher","after school"], line: 19 },
          { type: "open", q: "What does Oliver spend most of his money on?", keys: ["material"], line: 26 },
          { type: "open", q: "Why did Mia's parents change their minds?", keys: ["blog","reader"], line: 29 },
          { type: "open", q: "How many customers does Oliver have online?", keys: ["two hundred","200"], line: 10 },
          { type: "open", q: "What do all three teenagers agree about?", keys: ["plan"], line: 32 }
        ],
        retell: "Retell the text in your own words. Talk about each teenager's dream and what they are doing now."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Future Plans",
        instruction: "Write about your plans for the next five or ten years, and what you are doing now to make them happen.",
        words: [
          { w: "in the future", uz: "kelajakda" },
          { w: "going to", uz: "... moqchi (reja)" },
          { w: "hope", uz: "umid qilmoq" },
          { w: "become", uz: "bo'lmoq" },
          { w: "university", uz: "universitet" },
          { w: "save money", uz: "pul yig'moq" },
          { w: "dream", uz: "orzu" },
          { w: "achieve", uz: "erishmoq" },
          { w: "work hard", uz: "qattiq mehnat qilmoq" }
        ],
        minWords: 100, maxWords: 120, minutes: 20
      },
      speaking: {
        words: [
          { w: 'mum', emoji: '👩', ex: 'My mum is a doctor.' },
          { w: 'dad', emoji: '👨', ex: 'My dad likes cooking.' },
          { w: 'brother', emoji: '👦', ex: 'I have got one brother.' },
          { w: 'sister', emoji: '👧', ex: 'My sister is younger than me.' },
          { w: 'grandparents', emoji: '👵', ex: 'My grandparents live in a village.' },
          { w: 'cousin', emoji: '🧒', ex: 'My cousin and I play football together.' },
          { w: 'kind', emoji: '😊', ex: 'My grandma is very kind.' },
          { w: 'funny', emoji: '😂', ex: 'My brother is really funny.' },
          { w: 'tall', emoji: '📏', ex: 'My dad is tall and he has got short hair.' },
          { w: 'together', emoji: '🤝', ex: 'We watch films together on Sundays.' }
        ],
        questions: [
          { q: 'How many people are there in your family?', use: ['There are … people in my family.', 'I have got …', 'brothers', 'sisters'] },
          { q: 'Tell me about your best friend.', use: ['My best friend is …', "He's / She's …", 'kind', 'funny'] },
          { q: 'What do you do with your family at the weekend?', use: ['We usually …', 'together', 'at the weekend'] },
          { q: 'Have you got any cousins?', use: ['Yes, I have got …', "No, I haven't.", 'cousin', 'aunt', 'uncle'] },
          { q: 'Who is the funniest person in your family?', use: ['… is the funniest.', 'because he / she …', 'jokes'] }
        ],
        part2: {
          topic: 'Talk about a family member',
          hints: ['who this person is and how old he or she is', 'what this person looks like and what he or she is like', 'what you do together'],
          seconds: 45
        }
      }
    },
    {
      id: 'e3', no: 13, stage: 'Elementary', theme: 'My home', emoji: '🏠',
      listening: {
        src: 'audio/skills/elem-3-listening.mp3?v=6',
        title: 'Renting a room',
        intro: 'Listen to a man phoning about a room to rent. Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Owner: Mrs _____', a: ['Fletcher'] },
          { q: 'House number: _____', a: ['27', 'twenty-seven', 'twenty seven'] },
          { q: 'Street: _____ Street', a: ['Ashford'] },
          { q: 'The room is on the _____ floor.', a: ['top'] },
          { q: 'Furniture: a bed, a desk and a _____', a: ['wardrobe', 'big wardrobe'] },
          { q: 'Rent: £_____ a month', a: ['450', '£450', '450.00', 'four hundred and fifty', 'four hundred fifty'] },
          { q: 'Shares the bathroom with _____ other people', a: ['2', 'two'] },
          { q: 'At the end of the street: a _____', a: ['park', 'big park'] },
          { q: 'Can see the room on _____ evening', a: ['Thursday'] },
          { q: "Mrs Fletcher's mobile: _____", a: ['07700 900 718', '07700900718'] }
        ],
        words: [
          { w: 'advert', emoji: '📰', m: 'a short text that tells people about something to buy or rent', ex: "I'm calling about the room in your advert." },
          { w: 'owner', emoji: '🔑', m: 'the person something belongs to', ex: "I'm the owner of the house." },
          { w: 'rent', emoji: '💷', m: 'the money you pay every month to live in a place', ex: 'The rent is four hundred and fifty pounds a month.' },
          { w: 'top floor', emoji: '🔝', m: 'the highest level of a building', ex: "It's on the top floor." },
          { w: 'view', emoji: '🏞️', m: 'what you can see from a window or a place', ex: 'It has a lovely view of the garden.' },
          { w: 'furniture', emoji: '🛋️', m: 'things like beds, tables and chairs', ex: 'Is there any furniture in the room?' },
          { w: 'wardrobe', emoji: '🚪', m: 'a tall cupboard for your clothes', ex: "There's a big wardrobe for your clothes." },
          { w: 'bills', emoji: '🧾', m: 'money you pay for things like water and electricity', ex: 'That includes the bills.' },
          { w: 'share', emoji: '🍕', m: 'to have or use something together with other people', ex: 'You share the bathroom with two other people.' },
          { w: 'tidy', emoji: '🧹', m: 'clean, with everything in its place', ex: "They're both students, and they're very tidy." }
        ],
        transcript: [
          { who: 'Woman', text: 'Step thirteen. You will hear a phone call about a room to rent. Listen and complete the notes.', answers: [] },
          { who: 'Man', text: "Hello. I'm calling about the room in your advert. Is it still free?", answers: [] },
          { who: 'Woman', text: "Yes, it is. I'm the owner of the house. My name is Mrs Fletcher.", answers: [1] },
          { who: 'Man', text: 'Sorry, could you spell your name for me, please?', answers: [] },
          { who: 'Woman', text: "That's F, L, E, T, C, H, E, R.", answers: [1] },
          { who: 'Man', text: 'Thank you. And where is the house?', answers: [] },
          { who: 'Woman', text: "It's at twenty-seven Ashford Street, near the town centre.", answers: [2, 3] },
          { who: 'Man', text: 'Could you spell the name of the street, please?', answers: [] },
          { who: 'Woman', text: "That's A, S, H, F, O, R, D.", answers: [3] },
          { who: 'Man', text: "Thanks. And where's the room in the house?", answers: [] },
          { who: 'Woman', text: "It's on the top floor. It's quiet, and it has a lovely view of the garden.", answers: [4] },
          { who: 'Man', text: 'That sounds nice. Is there any furniture in the room?', answers: [] },
          { who: 'Woman', text: "Yes, there's a bed, a desk and a big wardrobe for your clothes.", answers: [5] },
          { who: 'Man', text: 'Great. How much is the rent?', answers: [] },
          { who: 'Woman', text: 'The rent is four hundred and fifty pounds a month. That includes the bills.', answers: [6] },
          { who: 'Man', text: "Four hundred and fifty pounds?", answers: [6] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: "That's fine for me. Do I share the bathroom?", answers: [] },
          { who: 'Woman', text: "Yes, you share it with two other people. They're both students, and they're very tidy.", answers: [7] },
          { who: 'Man', text: "And what's near the house? I like going running.", answers: [] },
          { who: 'Woman', text: "There's a big park at the end of the street. It's perfect for running.", answers: [8] },
          { who: 'Man', text: 'Can I come and see the room this week?', answers: [] },
          { who: 'Woman', text: "Yes, of course. Come on Thursday evening, after six o'clock.", answers: [9] },
          { who: 'Man', text: "Thursday is good for me. What's your phone number, in case I'm late?", answers: [9] },
          { who: 'Woman', text: 'My mobile number is oh seven seven double oh, nine double oh, seven one eight.', answers: [10] },
          { who: 'Man', text: "Oh seven seven double oh, nine double oh, seven one eight?", answers: [10] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: 'Thank you very much, Mrs Fletcher. See you on Thursday.', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "Different Jobs Around Us",
        text: "Every day, many people work to make our lives easier. We don't always notice them, but we need them.\n\n" +
          "Early in the morning, before most people wake up, bakers are already working. They start at four o'clock and make fresh bread for shops and cafés. At the same time, bus drivers get ready to take people to work and school.\n\n" +
          "Doctors and nurses work in hospitals day and night. Their job is very important, but it is also stressful. They often work long shifts, sometimes twelve hours without a proper rest.\n\n" +
          "Teachers do more than teach lessons. They prepare materials, check homework and help students with their problems. Many teachers say the best part of their job is seeing their students improve.\n\n" +
          "Some jobs are less visible. Cleaners keep our streets, offices and schools clean. Farmers grow the fruit and vegetables we buy in supermarkets. Delivery drivers bring parcels to our doors, even in rain and snow.\n\n" +
          "To learn more about these jobs, our class interviewed three workers in our town.\n\n" +
          "The first was Mr Hughes, a bus driver. He has driven the same route for fifteen years, and he knows many of his passengers by name. He starts at six in the morning and finishes at three in the afternoon. \"The worst part of the job is the traffic,\" he told us. \"But I love talking to people. Some old passengers tell me their life stories.\"\n\n" +
          "The second was Grace, a young nurse at the children's hospital. She decided to become a nurse after her little brother spent a month in hospital. She works three night shifts a week. \"Night shifts are tiring, and it is hard to sleep during the day,\" she said. \"But when a sick child smiles at me in the morning, I forget about being tired.\"\n\n" +
          "The third was Mr Wood, a farmer. He grows potatoes and wheat and keeps forty cows. He gets up at five o'clock every day, even on Sundays, because the animals need food and water. In summer, he often works fourteen hours a day. He told us that bad weather is his biggest problem. \"One storm can destroy a whole year of work,\" he explained.\n\n" +
          "All three said the same thing: every job is important, and every worker deserves respect.\n\n" +
          "Next time you buy bread, take a bus or get a parcel, remember the people behind these services. A simple \"thank you\" can make their day better.",
        words: [
          { w: "Notice", uz: "Payqamoq", emoji: "👀", ex: "We don't always notice them, but we need them." },
          { w: "Bakers", uz: "Novvoylar", emoji: "🥖", ex: "Early in the morning, before most people wake up, bakers are already working." },
          { w: "Get ready", uz: "Tayyorlanmoq", emoji: "🎒", ex: "At the same time, bus drivers get ready to take people to work and school." },
          { w: "Stressful", uz: "Asabiy (stressli)", emoji: "😣", ex: "Their job is very important, but it is also stressful." },
          { w: "Shifts", uz: "Smenalar", emoji: "🕐", ex: "They often work long shifts, sometimes twelve hours without a proper rest." },
          { w: "Prepare", uz: "Tayyorlamoq", emoji: "📝", ex: "They prepare materials, check homework and help students with their problems." },
          { w: "Improve", uz: "Yaxshilanmoq", emoji: "📈", ex: "Many teachers say the best part of their job is seeing their students improve." },
          { w: "Delivery drivers", uz: "Yetkazib beruvchilar", emoji: "🚚", ex: "Delivery drivers bring parcels to our doors, even in rain and snow." },
          { w: "Parcels", uz: "Posilkalar", emoji: "📦", ex: "Delivery drivers bring parcels to our doors, even in rain and snow." },
          { w: "Services", uz: "Xizmatlar", emoji: "🛎️", ex: "Next time you buy bread, take a bus or get a parcel, remember the people behind these services." }
        ],
        questions: [
          { type: "tfng", q: "Bakers start work before most people wake up.", a: ["True"], line: 2 },
          { type: "tfng", q: "Mr Hughes has been a bus driver for five years.", a: ["False"], line: 17 },
          { type: "tfng", q: "Grace usually works during the day.", a: ["False"], line: 23 },
          { type: "tfng", q: "Mr Wood's farm is the biggest in the area.", a: ["Not given"], line: 26 },
          { type: "tfng", q: "Mr Wood works on Sundays too.", a: ["True"], line: 27 },
          { type: "gap", q: "People who work in hospitals often work long _____.", a: ["shifts"], line: 7 },
          { type: "gap", q: "Delivery drivers bring _____ to our doors.", a: ["parcels"], line: 14 },
          { type: "gap", q: "Mr Hughes knows many of his _____ by name.", a: ["passengers"], line: 17 },
          { type: "gap", q: "Grace decided to become a nurse after her little _____ spent a month in hospital.", a: ["brother"], line: 22 },
          { type: "gap", q: "Mr Wood keeps forty _____ on his farm.", a: ["cows"], line: 26 },
          { type: "open", q: "What is the worst part of Mr Hughes's job?", keys: ["traffic"], line: 19 },
          { type: "open", q: "Why is it hard for Grace to sleep?", keys: ["night","day"], line: 24 },
          { type: "open", q: "What makes Grace forget about being tired?", keys: ["smile"], line: 25 },
          { type: "open", q: "Why does Mr Wood get up early every day?", keys: ["animal","food","water"], line: 27 },
          { type: "open", q: "What is Mr Wood's biggest problem?", keys: ["weather","storm"], line: 29 }
        ],
        retell: "Retell the text in your own words. Talk about at least four jobs and why they are important."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Dream Job",
        instruction: "Describe the job you would like to have: what the work is like, what skills it needs, and why you want to do it.",
        words: [
          { w: "dream job", uz: "orzudagi kasb" },
          { w: "earn", uz: "pul topmoq" },
          { w: "salary", uz: "maosh" },
          { w: "skills", uz: "ko'nikmalar" },
          { w: "experience", uz: "tajriba" },
          { w: "responsible", uz: "mas'uliyatli" },
          { w: "team", uz: "jamoa" },
          { w: "help people", uz: "odamlarga yordam bermoq" },
          { w: "challenging", uz: "sinovli, qiyin" }
        ],
        minWords: 110, maxWords: 130, minutes: 20
      },
      speaking: {
        words: [
          { w: 'house', emoji: '🏠', ex: 'I live in a house with a small garden.' },
          { w: 'flat', emoji: '🏢', ex: 'Our flat is on the fourth floor.' },
          { w: 'bedroom', emoji: '🛏️', ex: 'My bedroom is small but cosy.' },
          { w: 'kitchen', emoji: '🍳', ex: 'We eat dinner in the kitchen.' },
          { w: 'living room', emoji: '🛋️', ex: 'There is a big sofa in the living room.' },
          { w: 'garden', emoji: '🌳', ex: 'We have got flowers in the garden.' },
          { w: 'upstairs', emoji: '⬆️', ex: 'My bedroom is upstairs.' },
          { w: 'neighbours', emoji: '👋', ex: 'Our neighbours are very friendly.' },
          { w: 'quiet', emoji: '🤫', ex: 'My street is quiet at night.' },
          { w: 'comfortable', emoji: '😌', ex: 'My bed is very comfortable.' }
        ],
        questions: [
          { q: 'Do you live in a house or a flat?', use: ['I live in a …', 'house', 'flat', 'on the … floor'] },
          { q: 'How many rooms are there in your home?', use: ['There are … rooms.', "There's a …", 'bedroom', 'kitchen'] },
          { q: 'What is your favourite room? Why?', use: ['My favourite room is …', 'because …', 'comfortable'] },
          { q: 'What can you see from your window?', use: ['I can see …', 'street', 'garden', 'trees'] },
          { q: 'What is near your home?', use: ['There is a … near my home.', 'shop', 'park', 'school'] }
        ],
        part2: {
          topic: 'Talk about your home',
          hints: ['where it is and what kind of home it is', 'the rooms and your favourite room', "what you like or don't like about it"],
          seconds: 45
        }
      }
    },
    {
      id: 'e4', no: 14, stage: 'Elementary', theme: 'My day', emoji: '⏰',
      listening: {
        src: 'audio/skills/elem-4-listening.mp3?v=6',
        title: "Booking a doctor's appointment",
        intro: "Listen to a woman phoning a doctor's surgery. Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
        questions: [
          { q: 'Patient: Mrs _____', a: ['Lawson'] },
          { q: 'Doctor: Dr _____', a: ['Carter'] },
          { q: 'Problem: a bad _____ every afternoon', a: ['headache'] },
          { q: 'Day of the appointment: _____', a: ['Wednesday'] },
          { q: 'Time: _____ p.m.', a: ['4.15', '4:15', '415', 'four fifteen', 'quarter past four', 'a quarter past four'] },
          { q: 'Room number: _____', a: ['12', 'twelve'] },
          { q: 'Please bring your _____', a: ['medicine', 'medicines'] },
          { q: 'Arrive _____ minutes early', a: ['10', 'ten'] },
          { q: "Surgery's phone number: _____", a: ['01632 960 471', '01632960471'] },
          { q: 'Park next to the _____', a: ['library'] }
        ],
        words: [
          { w: 'surgery', emoji: '🏥', m: 'the place where you go to see a doctor', ex: 'Good morning, Oakfield Surgery.' },
          { w: 'appointment', emoji: '📅', m: 'a time when you agree to see someone, for example a doctor', ex: "I'd like to make an appointment with a doctor." },
          { w: 'usually', emoji: '🔁', m: 'on most days; most of the time', ex: 'Which doctor do you usually see?' },
          { w: 'headache', emoji: '🤕', m: 'a pain in your head', ex: "I've had a bad headache every afternoon." },
          { w: 'work too hard', emoji: '😓', m: 'to work a lot and get very tired', ex: "I think I'm working too hard." },
          { w: 'finish work', emoji: '🏁', m: 'to stop working at the end of the day', ex: 'I finish work at four o\'clock.' },
          { w: 'meeting', emoji: '👥', m: 'a time when people come together to talk about work', ex: 'On Mondays, we always have a long meeting.' },
          { w: 'medicine', emoji: '💊', m: 'something you take when you are ill, to get better', ex: 'Please bring any medicine you take at the moment.' },
          { w: 'arrive', emoji: '🚶', m: 'to get to a place', ex: 'Please arrive ten minutes early.' },
          { w: 'park', emoji: '🅿️', m: 'to leave your car in a place', ex: "It's better to park next to the library." }
        ],
        transcript: [
          { who: 'Woman', text: "Step fourteen. You will hear a phone call to a doctor's surgery. Listen and complete the notes.", answers: [] },
          { who: 'Man', text: 'Good morning, Oakfield Surgery. How can I help you?', answers: [] },
          { who: 'Woman', text: "Hello. I'd like to make an appointment with a doctor, please.", answers: [] },
          { who: 'Man', text: 'Of course. Can I have your surname, please?', answers: [] },
          { who: 'Woman', text: "Yes, it's Lawson. I'll spell it for you.", answers: [1] },
          { who: 'Woman', text: "That's L, A, W, S, O, N.", answers: [1] },
          { who: 'Man', text: 'Thank you, Mrs Lawson. Which doctor do you usually see?', answers: [] },
          { who: 'Woman', text: 'I usually see Doctor Carter.', answers: [2] },
          { who: 'Man', text: 'Doctor Carter. Let me just check the spelling on my computer.', answers: [2] },
          { who: 'Man', text: "That's C, A, R, T, E, R.", answers: [2] },
          { who: 'Woman', text: "Yes, that's right. She's very good.", answers: [] },
          { who: 'Man', text: "And what's the problem?", answers: [] },
          { who: 'Woman', text: "I've had a bad headache every afternoon this week. I think I'm working too hard.", answers: [3] },
          { who: 'Man', text: "I'm sorry to hear that. Doctor Carter is free on Monday at three thirty.", answers: [] },
          { who: 'Woman', text: "Monday is difficult for me. I work in an office until four o'clock, and on Mondays we always have a long meeting.", answers: [] },
          { who: 'Man', text: 'No problem. What about Wednesday? She is free at four fifteen.', answers: [4, 5] },
          { who: 'Woman', text: "Wednesday at four fifteen is perfect. I finish work at four, and the surgery is only five minutes from my office.", answers: [4, 5] },
          { who: 'Man', text: "Great. Her room is on the first floor. It's room twelve.", answers: [6] },
          { who: 'Woman', text: 'Room twelve, on the first floor. Do I need to bring anything?', answers: [6] },
          { who: 'Man', text: 'Yes, please bring any medicine you take at the moment.', answers: [7] },
          { who: 'Woman', text: "I'll bring it with me, then.", answers: [] },
          { who: 'Man', text: "And please arrive ten minutes early, because there's a short form to fill in.", answers: [8] },
          { who: 'Woman', text: "That's fine. Can I have the surgery's phone number, in case I'm late?", answers: [] },
          { who: 'Man', text: "Yes, it's oh one six three two, nine six oh, four seven one.", answers: [9] },
          { who: 'Woman', text: "Oh one six three two, nine six oh, four seven one?", answers: [9] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "Thank you. And where can I park? I'll come by car.", answers: [] },
          { who: 'Man', text: "Our car park is very small, so it's better to park next to the library. It's just across the road.", answers: [10] },
          { who: 'Woman', text: 'Thank you very much for your help. See you on Wednesday.', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "What People Wear Around the World",
        text: "Clothes are not only about fashion. In many countries, they also show history, culture and even the weather.\n\n" +
          "In Japan, the kimono is a traditional long robe with wide sleeves. Today, most Japanese people wear modern clothes, but they put on a kimono for special events like weddings and festivals.\n\n" +
          "In Scotland, some men wear a kilt, a knee-length skirt with a special pattern called tartan. Each family has its own tartan colours. Kilts are popular at weddings and sports events.\n\n" +
          "People in hot, dry places often wear long, loose clothes. This might sound strange, but loose cotton clothes protect the skin from the sun and keep the body cool. In many desert countries, men also cover their heads with a light scarf.\n\n" +
          "In very cold places like northern Canada, people wear thick coats, warm boots, hats and gloves. The Inuit people traditionally made warm clothes from animal skins.\n\n" +
          "Colours also have different meanings in different cultures. In many Western countries, brides wear white dresses at their weddings. But in India and China, red is the traditional colour for brides because it means happiness and good luck. In some countries, people wear black when someone dies, while in others they wear white.\n\n" +
          "In West Africa, people often wear clothes made from bright, colourful cloth with bold patterns. In Ghana, a special cloth called kente is made by hand from thin strips of material. In the past, only kings wore kente, but today people wear it at important celebrations. Each colour in kente has its own meaning: gold means wealth, and green means growth.\n\n" +
          "In the Andes mountains of South America, many people wear wool ponchos and hats. The ponchos are warm, and they protect people from wind and rain. Women often weave them by hand, and each village has its own colours and designs. A poncho can take a woman several weeks to make.\n\n" +
          "Some clothes are made for work. Firefighters wear special jackets that do not burn, and doctors wear clean uniforms to stop the spread of illness. In some schools, students wear uniforms too. People have different opinions about school uniforms: some say they make everyone equal, while others think students should be free to choose.\n\n" +
          "Fashion also changes with time. One hundred years ago, women in Europe rarely wore trousers. Today, trousers are normal for everyone. Many young people now buy second-hand clothes because they are cheaper and better for the planet.\n\n" +
          "In India, many women wear a sari, a long piece of cloth, often about six metres long, that they wrap around the body. Saris come in thousands of colours and designs, and some are decorated with gold thread. A girl often gets her first sari from her mother for an important family event.\n\n" +
          "Today, jeans and T-shirts are popular almost everywhere. However, traditional clothes are still important because they connect people with their past.",
        words: [
          { w: "Fashion", uz: "Moda", emoji: "👗", ex: "Clothes are not only about fashion." },
          { w: "Robe", uz: "Uzun to'n (xalat)", emoji: "👘", ex: "In Japan, the kimono is a traditional long robe with wide sleeves." },
          { w: "Put on", uz: "Kiymoq", emoji: "🧥", ex: "Today, most Japanese people wear modern clothes, but they put on a kimono for special events like weddings and festivals." },
          { w: "Weddings", uz: "To'ylar", emoji: "💒", ex: "Today, most Japanese people wear modern clothes, but they put on a kimono for special events like weddings and festivals." },
          { w: "Knee-length", uz: "Tizzagacha", emoji: "🦵", ex: "In Scotland, some men wear a kilt, a knee-length skirt with a special pattern called tartan." },
          { w: "Pattern", uz: "Naqsh", emoji: "🔳", ex: "In Scotland, some men wear a kilt, a knee-length skirt with a special pattern called tartan." },
          { w: "Loose", uz: "Keng (erkin)", emoji: "👕", ex: "People in hot, dry places often wear long, loose clothes." },
          { w: "Protect", uz: "Himoya qilmoq", emoji: "🛡️", ex: "This might sound strange, but loose cotton clothes protect the skin from the sun and keep the body cool." },
          { w: "Thick coats", uz: "Qalin paltolar", emoji: "🧥", ex: "In very cold places like northern Canada, people wear thick coats, warm boots, hats and gloves." },
          { w: "Connect", uz: "Bog'lamoq", emoji: "🔗", ex: "However, traditional clothes are still important because they connect people with their past." }
        ],
        questions: [
          { type: "tfng", q: "In India, brides traditionally wear red.", a: ["True"], line: 14 },
          { type: "tfng", q: "In the past, everyone in Ghana wore kente.", a: ["False"], line: 18 },
          { type: "tfng", q: "Ponchos protect people from wind and rain.", a: ["True"], line: 21 },
          { type: "tfng", q: "Kente is more expensive than other kinds of cloth.", a: ["Not given"], line: 17 },
          { type: "tfng", q: "A hundred years ago, women in Europe often wore trousers.", a: ["False"], line: 29 },
          { type: "gap", q: "The special pattern on a kilt is called _____.", a: ["tartan"], line: 4 },
          { type: "gap", q: "In India, a girl often gets her first sari from her _____.", a: ["mother"], line: 34 },
          { type: "gap", q: "In kente, the colour green means _____.", a: ["growth"], line: 19 },
          { type: "gap", q: "Women in the Andes often make ponchos by _____.", a: ["hand"], line: 22 },
          { type: "gap", q: "Many young people buy second-hand clothes because they are cheaper and better for the _____.", a: ["planet"], line: 31 },
          { type: "open", q: "Why is red the traditional colour for brides in India and China?", keys: ["happiness","luck"], line: 14 },
          { type: "open", q: "What is kente made from?", keys: ["strip","material"], line: 17 },
          { type: "open", q: "How long can it take to make a poncho?", keys: ["week"], line: 23 },
          { type: "open", q: "Why do doctors wear clean uniforms?", keys: ["illness","spread"], line: 25 },
          { type: "open", q: "Why are traditional clothes still important today?", keys: ["past","connect"], line: 36 }
        ],
        retell: "Retell the text in your own words. Talk about the clothes of at least three places."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Clothes",
        instruction: "Write about the clothes you like to wear every day and on special occasions, and explain why you like them.",
        words: [
          { w: "comfortable", uz: "qulay" },
          { w: "casual", uz: "kundalik, oddiy" },
          { w: "fashionable", uz: "zamonaviy" },
          { w: "outfit", uz: "kiyim to'plami" },
          { w: "match", uz: "mos kelmoq" },
          { w: "wear", uz: "kiymoq" },
          { w: "style", uz: "uslub" },
          { w: "second-hand", uz: "ishlatilgan" },
          { w: "on special occasions", uz: "maxsus holatlarda" }
        ],
        minWords: 110, maxWords: 130, minutes: 20
      },
      speaking: {
        words: [
          { w: 'get up', emoji: '⏰', ex: "I get up at seven o'clock." },
          { w: 'have breakfast', emoji: '🥣', ex: 'I have breakfast with my family.' },
          { w: 'go to school', emoji: '🏫', ex: 'I go to school by bus.' },
          { w: 'start work', emoji: '💼', ex: 'My mum starts work at nine.' },
          { w: 'lunch', emoji: '🥪', ex: 'I have lunch at one o\'clock.' },
          { w: 'homework', emoji: '📚', ex: 'I do my homework after dinner.' },
          { w: 'relax', emoji: '🛋️', ex: 'In the evening, I relax and watch TV.' },
          { w: 'go to bed', emoji: '🛏️', ex: 'I go to bed at about ten.' },
          { w: 'early', emoji: '🌅', ex: 'I get up early on weekdays.' },
          { w: 'late', emoji: '🌙', ex: 'On Sundays, I get up late.' }
        ],
        questions: [
          { q: 'What time do you usually get up?', use: ['I usually get up at …', 'early', 'late'] },
          { q: 'What do you have for breakfast?', use: ['I usually have …', 'tea', 'eggs', "I don't eat breakfast."] },
          { q: 'How do you get to school or work?', use: ['I go by …', 'bus', 'car', 'I walk.', 'It takes … minutes.'] },
          { q: 'What do you do in the evening?', use: ['In the evening, I …', 'homework', 'relax', 'watch TV'] },
          { q: 'What is your favourite day of the week? Why?', use: ['My favourite day is …', 'because …', "I don't have to …"] }
        ],
        part2: {
          topic: 'Talk about your favourite day of the week',
          hints: ['which day it is and what time you get up', 'what you do in the morning and in the afternoon', 'why you like this day'],
          seconds: 60
        }
      }
    },
    {
      id: 'e5', no: 15, stage: 'Elementary', theme: 'Food & cafés', emoji: '🍕',
      listening: {
        src: 'audio/skills/elem-5-listening.mp3?v=6',
        title: 'Ordering food for a party',
        intro: 'Listen to a man ordering food for a birthday party at a café. Complete the order form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Customer: Mr _____', a: ['Barton'] },
          { q: 'Day of the party: _____', a: ['Sunday'] },
          { q: 'Number of children: about _____', a: ['20', 'twenty'] },
          { q: 'Room: the _____ room', a: ['garden'] },
          { q: 'Main food: cheese and tomato _____', a: ['pizzas', 'pizza'] },
          { q: 'Price: £_____ each', a: ['8', 'eight', '£8', '8.00'] },
          { q: 'For a boy who can\'t eat cheese: _____ sandwiches', a: ['chicken'] },
          { q: 'Name on the cake: _____', a: ['Rosie'] },
          { q: 'Total price: £_____', a: ['120', '£120', '120.00', 'one hundred and twenty', 'a hundred and twenty'] },
          { q: 'Phone number: _____', a: ['07700 900 365', '07700900365'] }
        ],
        words: [
          { w: 'order', emoji: '🛒', m: 'to ask for food or drink that you want to buy', ex: "I'd like to order some food for a party." },
          { w: 'birthday party', emoji: '🎂', m: 'a party on the day someone was born', ex: "It's for my daughter's birthday party." },
          { w: 'daughter', emoji: '👧', m: 'a girl who is your child', ex: "Please write Rosie. That's my daughter's name." },
          { w: 'sunny', emoji: '☀️', m: 'bright, with a lot of light from the sun', ex: "The garden room is big and sunny." },
          { w: 'each', emoji: '1️⃣', m: 'for one of them', ex: "They're eight pounds each." },
          { w: 'enough', emoji: '👌', m: 'as much as you need', ex: 'One pizza is enough for three children.' },
          { w: 'anything else', emoji: '➕', m: 'some other thing', ex: 'Have you got anything else?' },
          { w: 'popular', emoji: '⭐', m: 'liked by a lot of people', ex: 'Our chocolate cake is very popular.' },
          { w: 'total', emoji: '🧮', m: 'all the money added together', ex: 'The total is one hundred and twenty pounds.' },
          { w: 'pay', emoji: '💰', m: 'to give money for something you buy', ex: 'Can I pay on the day?' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step fifteen. You will hear a phone call to a café. Listen and complete the order form.', answers: [] },
          { who: 'Woman', text: 'Hello, Sunflower Café. Jessica speaking. How can I help you?', answers: [] },
          { who: 'Man', text: "Hi. I'd like to order some food for my daughter's birthday party, please.", answers: [] },
          { who: 'Woman', text: 'How lovely! Can I take your surname first?', answers: [] },
          { who: 'Man', text: "Yes, it's Barton. I'll spell it for you.", answers: [1] },
          { who: 'Man', text: "That's B, A, R, T, O, N.", answers: [1] },
          { who: 'Woman', text: 'Thank you, Mr Barton. When is the party?', answers: [] },
          { who: 'Man', text: "It's on Sunday afternoon, here at the café.", answers: [2] },
          { who: 'Woman', text: 'Good, Sunday is a quiet day for us. How many children are coming?', answers: [2] },
          { who: 'Man', text: 'About twenty children, and a few parents too.', answers: [3] },
          { who: 'Woman', text: "We've got a lovely garden room at the back. It's big and sunny.", answers: [4] },
          { who: 'Man', text: 'Perfect. What food do you have for children?', answers: [] },
          { who: 'Woman', text: 'Most children love our cheese and tomato pizzas.', answers: [5] },
          { who: 'Man', text: 'Pizzas sound great. How much are they?', answers: [] },
          { who: 'Woman', text: "They're eight pounds each, and one pizza is enough for three children.", answers: [6] },
          { who: 'Man', text: "Eight pounds each?", answers: [6] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: "That's good. But one boy can't eat cheese. Have you got anything else?", answers: [] },
          { who: 'Woman', text: 'Yes, we can make some chicken sandwiches for him.', answers: [7] },
          { who: 'Man', text: 'Lovely. And can you make a birthday cake?', answers: [] },
          { who: 'Woman', text: 'Of course. Our chocolate cake is very popular. What name would you like on it?', answers: [] },
          { who: 'Man', text: "Please write Rosie. That's my daughter's name.", answers: [8] },
          { who: 'Man', text: "That's R, O, S, I, E.", answers: [8] },
          { who: 'Woman', text: "That's a beautiful name. So the total is one hundred and twenty pounds.", answers: [9] },
          { who: 'Man', text: "One hundred and twenty pounds?", answers: [9] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: "That's fine. Can I pay on the day?", answers: [] },
          { who: 'Woman', text: 'Yes, you can. Can I have a phone number, please?', answers: [] },
          { who: 'Man', text: "Sure. It's oh seven seven double oh, nine double oh, three six five.", answers: [10] },
          { who: 'Woman', text: "Oh seven seven double oh, nine double oh, three six five?", answers: [10] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Thank you, Mr Barton. We will see you and Rosie on Sunday!', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "How Do People Travel?",
        text: "Two hundred years ago, most people walked or rode horses. A journey between two cities could take several days. Today, we can travel across the world in less than a day.\n\n" +
          "Cars are the most common way to travel in many countries. They are comfortable, and you can go wherever you want. However, cars cause traffic jams and air pollution, especially in big cities.\n\n" +
          "That is why many cities are improving public transport. In London, millions of people use the Underground every day. In Tokyo, trains are so punctual that a delay of one minute is unusual.\n\n" +
          "Bicycles are becoming popular again. In Amsterdam, there are more bikes than people! Cycling is cheap, healthy and good for the environment.\n\n" +
          "For long distances, people usually fly. Planes are fast, but flying is expensive and produces a lot of pollution. Some travellers now choose high-speed trains instead. In Europe, some trains can travel at 300 kilometres per hour.\n\n" +
          "In some places, people travel in more unusual ways. In Venice, Italy, there are no cars in the old city. People walk or travel by boat on the canals. Even ambulances use boats! The famous boats there are called gondolas, and tourists love riding in them. In the mountains of Switzerland, cable cars carry people and skiers up to the top, and some villages can only be reached by train or cable car.\n\n" +
          "Technology is changing transport too. Electric cars are becoming more common because they do not produce pollution on the road. In Norway, more than eight out of ten new cars sold today are electric. Some cities are also testing buses without drivers, and companies are trying to use drones to deliver small parcels.\n\n" +
          "Travel also has rules that are different around the world. In Britain, Japan and Australia, people drive on the left side of the road, but in most other countries, they drive on the right. In Singapore, cars are very expensive because the government wants people to use public transport. Drivers there also have to pay to drive into the city centre.\n\n" +
          "For many people, the journey to work is the longest part of the day. In big cities like London or Tokyo, some people spend more than two hours a day travelling to and from work. To save time, more companies now let their workers work from home one or two days a week. This also means fewer cars on the roads and less pollution.\n\n" +
          "Finally, walking is still the healthiest way to travel. Doctors recommend walking at least 7,000 steps a day, and many cities are building new paths for walkers and cyclists.\n\n" +
          "Which way of travelling is the best? It depends on where you are going, how much money you have and how fast you need to get there.",
        words: [
          { w: "Common", uz: "Keng tarqalgan", emoji: "🚗", ex: "Cars are the most common way to travel in many countries." },
          { w: "Wherever", uz: "Qayerga bo'lsa ham", emoji: "🗺️", ex: "They are comfortable, and you can go wherever you want." },
          { w: "Traffic jams", uz: "Tirbandliklar", emoji: "🚦", ex: "However, cars cause traffic jams and air pollution, especially in big cities." },
          { w: "Air pollution", uz: "Havo ifloslanishi", emoji: "🏭", ex: "However, cars cause traffic jams and air pollution, especially in big cities." },
          { w: "Public transport", uz: "Jamoat transporti", emoji: "🚌", ex: "That is why many cities are improving public transport." },
          { w: "Punctual", uz: "O'z vaqtida keladigan", emoji: "⏱️", ex: "In Tokyo, trains are so punctual that a delay of one minute is unusual." },
          { w: "Delay", uz: "Kechikish", emoji: "⌛", ex: "In Tokyo, trains are so punctual that a delay of one minute is unusual." },
          { w: "Environment", uz: "Atrof-muhit", emoji: "🌳", ex: "Cycling is cheap, healthy and good for the environment." },
          { w: "Distances", uz: "Masofalar", emoji: "📏", ex: "For long distances, people usually fly." },
          { w: "It depends on", uz: "...ga bog'liq", emoji: "⚖️", ex: "It depends on where you are going, how much money you have and how fast you need to get there." }
        ],
        questions: [
          { type: "tfng", q: "There are no cars in the old city of Venice.", a: ["True"], line: 17 },
          { type: "tfng", q: "Most new cars sold in Norway are electric.", a: ["True"], line: 24 },
          { type: "tfng", q: "People in Japan drive on the right.", a: ["False"], line: 27 },
          { type: "tfng", q: "Electric cars are cheaper than other cars.", a: ["Not given"], line: 23 },
          { type: "tfng", q: "Two hundred years ago, a journey between two cities was always quick.", a: ["False"], line: 1 },
          { type: "gap", q: "In Tokyo, trains are so _____ that a one-minute delay is unusual.", a: ["punctual"], line: 8 },
          { type: "gap", q: "The famous boats in Venice are called _____.", a: ["gondolas"], line: 20 },
          { type: "gap", q: "In Switzerland, cable _____ carry skiers up the mountains.", a: ["cars"], line: 21 },
          { type: "gap", q: "Companies are trying to use _____ to deliver small parcels.", a: ["drones"], line: 25 },
          { type: "gap", q: "Doctors recommend walking at least 7,000 _____ a day.", a: ["steps"], line: 35 },
          { type: "open", q: "Why are electric cars becoming more common?", keys: ["pollution"], line: 23 },
          { type: "open", q: "Why are cars very expensive in Singapore?", keys: ["public transport","government"], line: 28 },
          { type: "open", q: "How long do some people in London or Tokyo spend travelling to and from work?", keys: ["two hours","2 hours","two","2"], line: 31 },
          { type: "open", q: "Why do some companies let their workers work from home?", keys: ["time"], line: 32 },
          { type: "open", q: "What does the best way of travelling depend on?", keys: ["money","where","fast"], line: 37 }
        ],
        retell: "Retell the text in your own words. Talk about the good and bad points of at least three ways to travel."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "How I Travel",
        instruction: "Write about how you travel to school or work and around your city. Compare different ways of travelling and say which one you prefer.",
        words: [
          { w: "public transport", uz: "jamoat transporti" },
          { w: "on foot", uz: "piyoda" },
          { w: "by bus", uz: "avtobusda" },
          { w: "traffic jam", uz: "tirbandlik" },
          { w: "journey", uz: "yo'l, safar" },
          { w: "it takes", uz: "... vaqt oladi" },
          { w: "save time", uz: "vaqtni tejamoq" },
          { w: "environment", uz: "atrof-muhit" },
          { w: "prefer", uz: "afzal ko'rmoq" },
          { w: "than", uz: "... dan ko'ra" }
        ],
        minWords: 110, maxWords: 130, minutes: 20
      },
      speaking: {
        words: [
          { w: 'breakfast', emoji: '🍳', ex: 'I have eggs for breakfast.' },
          { w: 'lunch', emoji: '🥗', ex: 'I usually have a salad for lunch.' },
          { w: 'dinner', emoji: '🍝', ex: 'We have dinner at seven o\'clock.' },
          { w: 'delicious', emoji: '😋', ex: "My mum's soup is delicious." },
          { w: 'spicy', emoji: '🌶️', ex: "I don't like spicy food." },
          { w: 'sweet', emoji: '🍰', ex: 'This cake is very sweet.' },
          { w: 'café', emoji: '☕', ex: 'There is a nice café near my school.' },
          { w: 'order', emoji: '📝', ex: 'I usually order a hot chocolate.' },
          { w: 'menu', emoji: '📋', ex: 'Can I see the menu, please?' },
          { w: 'cook', emoji: '👩‍🍳', ex: 'My dad likes to cook pasta.' }
        ],
        questions: [
          { q: 'What do you usually eat for lunch?', use: ['I usually have …', 'sandwich', 'soup', 'rice'] },
          { q: 'Do you like cooking? What can you cook?', use: ['I can cook …', "I can't cook.", 'pasta', 'eggs'] },
          { q: 'Is there a café or restaurant you like? Why?', use: ['I like …', 'because …', 'delicious', 'friendly'] },
          { q: 'Do you prefer sweet or spicy food?', use: ['I prefer …', 'sweet', 'spicy', "I don't like …"] },
          { q: "What food don't you like?", use: ["I don't like …", "because it's …", 'too spicy', 'too sweet'] }
        ],
        part2: {
          topic: 'Talk about food you like',
          hints: ['what the food is and what it tastes like', 'when and where you eat it', 'why you like it'],
          seconds: 60
        }
      }
    },
    {
      id: 'e6', no: 16, stage: 'Elementary', theme: 'Shopping', emoji: '🛍️',
      listening: {
        src: 'audio/skills/elem-6-listening.mp3?v=2',
        title: 'A lost bag at a shop',
        intro: 'Listen to a woman phoning a department store about a lost bag. Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Name: Mrs _____', a: ['Palmer'] },
          { q: 'Day she was in the shop: _____', a: ['Saturday'] },
          { q: 'Left the bag in the _____ department', a: ['shoe', 'shoes'] },
          { q: 'Colour of the bag: _____', a: ['dark green', 'green'] },
          { q: 'Inside the bag: a red _____', a: ['purse'] },
          { q: 'Money in the purse: about £_____', a: ['35', 'thirty-five', 'thirty five', '£35', '35.00'] },
          { q: 'Also inside: a pair of _____', a: ['sunglasses', 'sun glasses'] },
          { q: 'Address: 42 _____ Road', a: ['Ashby'] },
          { q: 'Phone number: _____', a: ['07700 900 846', '07700900846'] },
          { q: 'Collect the bag from the _____ desk', a: ['information'] }
        ],
        words: [
          { w: 'department store', emoji: '🏬', m: 'a big shop that sells many different things on different floors', ex: 'Good morning, Westgate Department Store.' },
          { w: 'leave (left)', emoji: '👜', m: 'to forget to take something with you', ex: 'I think I left my bag in your shop.' },
          { w: 'try on', emoji: '👢', m: 'to put on clothes or shoes in a shop to see if they are good for you', ex: 'I tried on some boots.' },
          { w: 'leather', emoji: '🐄', m: 'a strong material made from the skin of an animal', ex: "It's a small leather bag." },
          { w: 'strap', emoji: '🎒', m: 'a long thin piece of material for carrying a bag', ex: "It's dark green, with a long strap." },
          { w: 'purse', emoji: '👛', m: 'a small bag for your money and cards', ex: "There's a red purse inside it." },
          { w: 'a pair of', emoji: '🕶️', m: 'two things that you use together', ex: "There's a pair of sunglasses in a black case." },
          { w: 'case', emoji: '💼', m: 'a box or a bag that keeps something safe', ex: 'My sunglasses are in a black case.' },
          { w: 'ground floor', emoji: '🚪', m: 'the floor of a building at the same level as the street', ex: 'The information desk is on the ground floor.' },
          { w: 'collect', emoji: '🙌', m: 'to go to a place and take something that is waiting for you', ex: 'You can collect it from the information desk.' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step sixteen. You will hear a woman phoning a department store about a lost bag. Listen and complete the form.', answers: [] },
          { who: 'Man', text: 'Good morning, Westgate Department Store. Customer service. How can I help you?', answers: [] },
          { who: 'Woman', text: 'Hello. I think I left my bag in your shop. Has anyone found it?', answers: [] },
          { who: 'Man', text: "I can check for you. What's your surname, please?", answers: [] },
          { who: 'Woman', text: "It's Palmer. I'll spell it for you.", answers: [1] },
          { who: 'Woman', text: "That's P, A, L, M, E, R.", answers: [1] },
          { who: 'Man', text: 'Thank you, Mrs Palmer. When were you in the shop?', answers: [] },
          { who: 'Woman', text: 'I was here on Saturday morning, with my sister.', answers: [2] },
          { who: 'Man', text: 'And where do you think you left the bag?', answers: [] },
          { who: 'Woman', text: 'In the shoe department. I tried on some boots, and I put my bag on the floor.', answers: [3] },
          { who: 'Man', text: 'I see. What does the bag look like?', answers: [] },
          { who: 'Woman', text: "It's a small leather bag. It's dark green, with a long strap.", answers: [4] },
          { who: 'Man', text: "And what's inside the bag?", answers: [] },
          { who: 'Woman', text: "There's a red purse inside it.", answers: [5] },
          { who: 'Man', text: 'Is there any money in the purse?', answers: [] },
          { who: 'Woman', text: 'Yes, about thirty-five pounds.', answers: [6] },
          { who: 'Man', text: 'Thirty-five pounds?', answers: [6] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: 'Is there anything else in the bag?', answers: [] },
          { who: 'Woman', text: "Yes, there's a pair of sunglasses in a black case.", answers: [7] },
          { who: 'Man', text: "Good news, Mrs Palmer. I think we've got your bag here! Can I have your address, please?", answers: [] },
          { who: 'Woman', text: "Of course. I live at forty-two Ashby Road. I'll spell Ashby for you.", answers: [8] },
          { who: 'Woman', text: "That's A, S, H, B, Y.", answers: [8] },
          { who: 'Man', text: "Thank you. And what's your phone number?", answers: [] },
          { who: 'Woman', text: "It's oh seven seven double oh, nine double oh, eight four six.", answers: [9] },
          { who: 'Man', text: 'Oh seven seven double oh, nine double oh, eight four six?', answers: [9] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Can I come and get my bag today?', answers: [] },
          { who: 'Man', text: 'Yes, of course. You can collect it from the information desk on the ground floor.', answers: [10] },
          { who: 'Man', text: 'Please bring something with your name on it, like your driving licence.', answers: [] },
          { who: 'Woman', text: "Thank you so much! I'll come this afternoon.", answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "Amazing Animals",
        text: "The animal world is full of surprises. Here are some facts that might amaze you.\n\n" +
          "Elephants have excellent memories. They can remember places where they found water many years before. They also seem to show feelings: when a member of the group dies, other elephants often stand next to the body for hours.\n\n" +
          "Octopuses are some of the smartest animals in the sea. They have eight arms and three hearts, and they can change the colour of their skin in less than a second. In aquariums, some octopuses have learned to open jars to get food.\n\n" +
          "The cheetah is the fastest land animal. It can run at about 110 kilometres per hour, but only for a short time. After a fast run, it needs to rest for up to half an hour.\n\n" +
          "Some birds travel incredible distances. The Arctic tern flies from the north of the planet to the south and back every year. During its life, it can fly about the same distance as three trips to the Moon and back.\n\n" +
          "Dolphins are also very intelligent. They live in groups and communicate with each other using clicks and whistles. Each dolphin has its own special whistle, a bit like a name. Scientists have seen dolphins helping injured members of their group to swim to the surface to breathe. Some dolphins even use sea sponges to protect their noses when they look for food.\n\n" +
          "Some animals are amazing builders. Beavers cut down trees with their strong teeth and build dams across rivers. Their dams can be hundreds of metres long. Behind the dam, the water becomes a quiet pond, where the beavers build their home. In Canada, scientists found a beaver dam that is so big you can see it from space.\n\n" +
          "Other animals survive in very difficult places. Camels can travel for a week in the desert without drinking water. They store fat, not water, in their humps, and they can drink more than 100 litres of water in about ten minutes. They can also close their noses to keep out the sand. Polar bears, on the other hand, live in the freezing Arctic. Their thick fur and a layer of fat keep them warm, and they are excellent swimmers.\n\n" +
          "Even small animals can do incredible things. An ant can carry objects that are fifty times heavier than its own body. Honeybees dance to tell other bees where to find flowers with food. A hummingbird's heart can beat more than 1,000 times a minute.\n\n" +
          "Sadly, many amazing animals are in danger. Forests are being cut down, oceans are getting dirtier, and the climate is changing. Tigers, elephants and many kinds of sea turtles are now endangered. Zoos and national parks work hard to protect them, but we can help too: we can use less plastic, save water and learn more about the animals that share our planet.\n\n" +
          "Scientists are still discovering new species every year. Who knows what amazing animals we will find next?",
        words: [
          { w: "Surprises", uz: "Kutilmagan narsalar", emoji: "🎁", ex: "The animal world is full of surprises." },
          { w: "Amaze", uz: "Hayratlantirmoq", emoji: "😲", ex: "Here are some facts that might amaze you." },
          { w: "Memories", uz: "Xotira", emoji: "🧠", ex: "Elephants have excellent memories." },
          { w: "Feelings", uz: "Hissiyotlar", emoji: "❤️", ex: "They also seem to show feelings: when a member of the group dies, other elephants often stand next to the body for hours." },
          { w: "Smartest", uz: "Eng aqlli", emoji: "💡", ex: "Octopuses are some of the smartest animals in the sea." },
          { w: "In less than a second", uz: "Bir soniyadan kamroq vaqtda", emoji: "⚡", ex: "They have eight arms and three hearts, and they can change the colour of their skin in less than a second." },
          { w: "Fastest", uz: "Eng tez", emoji: "🐆", ex: "The cheetah is the fastest land animal." },
          { w: "Rest", uz: "Dam olmoq", emoji: "😴", ex: "After a fast run, it needs to rest for up to half an hour." },
          { w: "Incredible", uz: "Aql bovar qilmaydigan", emoji: "🤯", ex: "Some birds travel incredible distances." },
          { w: "Species", uz: "Turlar", emoji: "🦎", ex: "Each dolphin has its own special whistle, a bit like a name." }
        ],
        questions: [
          { type: "tfng", q: "Each dolphin has its own special whistle.", a: ["True"], line: 16 },
          { type: "tfng", q: "Camels keep water in their humps.", a: ["False"], line: 26 },
          { type: "tfng", q: "An ant can carry things much heavier than its own body.", a: ["True"], line: 31 },
          { type: "tfng", q: "Octopuses live longer than dolphins.", a: ["Not given"], line: 5 },
          { type: "tfng", q: "A cheetah can keep running fast for many hours.", a: ["False"], line: 9 },
          { type: "gap", q: "An octopus has eight arms and three _____.", a: ["hearts"], line: 6 },
          { type: "gap", q: "Beavers build _____ across rivers.", a: ["dams"], line: 20 },
          { type: "gap", q: "A polar bear's thick fur and a layer of _____ keep it warm.", a: ["fat"], line: 29 },
          { type: "gap", q: "Honeybees _____ to tell other bees where to find food.", a: ["dance"], line: 32 },
          { type: "gap", q: "Tigers, elephants and many kinds of sea turtles are now _____.", a: ["endangered"], line: 36 },
          { type: "open", q: "What do elephants often do when a member of their group dies?", keys: ["stand","body"], line: 4 },
          { type: "open", q: "How do dolphins help injured members of their group?", keys: ["surface","breathe","swim"], line: 17 },
          { type: "open", q: "What happens to the water behind a beaver dam?", keys: ["pond","quiet"], line: 22 },
          { type: "open", q: "How do camels keep the sand out of their noses?", keys: ["close"], line: 27 },
          { type: "open", q: "What can we do to help animals in danger?", keys: ["plastic","water","learn"], line: 37 }
        ],
        retell: "Retell the text in your own words. Tell at least one interesting fact about each animal."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Animal",
        instruction: "Write about your favourite animal: what it looks like, where it lives, what it eats, and why you like it.",
        words: [
          { w: "wild", uz: "yovvoyi" },
          { w: "pet", uz: "uy hayvoni" },
          { w: "intelligent", uz: "aqlli" },
          { w: "habitat", uz: "yashash muhiti" },
          { w: "feed on", uz: "... bilan oziqlanmoq" },
          { w: "protect", uz: "himoya qilmoq" },
          { w: "endangered", uz: "yo'qolib ketish xavfi ostida" },
          { w: "loyal", uz: "sodiq" },
          { w: "fascinating", uz: "hayratlanarli" }
        ],
        minWords: 120, maxWords: 140, minutes: 20
      },
      speaking: {
        words: [
          { w: 'shop', emoji: '🏪', ex: 'There is a small shop near my house.' },
          { w: 'shopping centre', emoji: '🏬', ex: 'We go to the shopping centre at the weekend.' },
          { w: 'market', emoji: '🧺', ex: 'My mum buys fruit at the market.' },
          { w: 'clothes', emoji: '👕', ex: 'I need some new clothes for school.' },
          { w: 'price', emoji: '🏷️', ex: 'The price of this jacket is thirty pounds.' },
          { w: 'cheap', emoji: '🪙', ex: 'These shoes are very cheap.' },
          { w: 'expensive', emoji: '💎', ex: 'That watch is too expensive for me.' },
          { w: 'size', emoji: '📏', ex: 'Have you got this T-shirt in a bigger size?' },
          { w: 'pay', emoji: '💳', ex: 'Can I pay by card?' },
          { w: 'present', emoji: '🎁', ex: 'I bought a present for my friend.' }
        ],
        questions: [
          { q: 'How often do you go shopping?', use: ['I go shopping …', 'once a week', 'at the weekend', 'not very often'] },
          { q: 'Do you like shopping for clothes? Why or why not?', use: ['I like …', "I don't like …", 'because …', 'boring', 'fun'] },
          { q: 'Where does your family usually buy food?', use: ['We usually buy …', 'supermarket', 'market', 'near our home'] },
          { q: 'Do you prefer shopping online or in shops?', use: ['I prefer …', 'online', 'in shops', 'easier', 'cheaper'] },
          { q: 'What was the last thing you bought?', use: ['I bought …', 'last week', 'it cost …', 'for my …'] }
        ],
        part2: {
          topic: 'Talk about a shop you like',
          hints: ['what the shop is and where it is', 'what you can buy there', 'why you like it'],
          seconds: 60
        }
      }
    },
    {
      id: 'e7', no: 17, stage: 'Elementary', theme: 'My town', emoji: '🏙️',
      listening: {
        src: 'audio/skills/elem-7-listening.mp3?v=2',
        title: 'At the tourist office',
        intro: 'Listen to a man asking about places in a town at the tourist office. Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Name: Mr _____', a: ['Barton'] },
          { q: 'Staying in town until: _____', a: ['Sunday', 'Sunday evening'] },
          { q: 'The museum is on _____ Street', a: ['Morley'] },
          { q: 'The museum opens at: _____', a: ['9.30', '9:30', 'nine thirty', 'half past nine', '9.30 am', '9:30 am', '9.30am', '9:30am'] },
          { q: 'The museum is closed on: _____', a: ['Mondays', 'Monday'] },
          { q: 'Ticket for an adult: £_____', a: ['6', 'six', '£6', '6.00', '£6.00', '6 pounds', 'six pounds'] },
          { q: 'Lunch: the _____ café, by the river', a: ['Old Mill', 'the Old Mill'] },
          { q: 'The castle closes at: _____', a: ["five o'clock", "5 o'clock", '5', 'five', '5 pm', '5pm', '5 p.m.', '5.00', '5:00', '5.00 pm', '5:00 pm', '17.00', '17:00'] },
          { q: 'The free town walk starts in the _____', a: ['market square'] },
          { q: 'Tourist office phone number: _____', a: ['07700 900 593', '07700900593'] }
        ],
        words: [
          { w: 'tourist office', emoji: 'ℹ️', m: 'a place where visitors can get maps and information about a town', ex: 'Good morning, and welcome to the tourist office.' },
          { w: 'on holiday', emoji: '🧳', m: 'away from home and work, visiting a new place for fun', ex: "I'm here on holiday, and I'd like to see the town." },
          { w: 'stay', emoji: '🏨', m: 'to live in a place for a short time', ex: 'How long are you staying in town?' },
          { w: 'museum', emoji: '🏛️', m: 'a building where you can look at old, interesting or beautiful things', ex: "I'd like to visit the museum." },
          { w: 'next to', emoji: '↔️', m: 'very near something, at its side', ex: 'The museum is next to the library.' },
          { w: 'closed', emoji: '🚫', m: 'not open, so you cannot go in', ex: "It's closed on Mondays." },
          { w: 'adult', emoji: '🧑', m: 'a person who is not a child any more', ex: 'A ticket for an adult is six pounds.' },
          { w: 'castle', emoji: '🏰', m: 'a big, strong, old building with high walls, where kings and queens lived', ex: 'The castle closes at five o\'clock.' },
          { w: 'free', emoji: '🆓', m: 'costing no money', ex: "There's also a free town walk on Saturday morning." },
          { w: 'square', emoji: '⛲', m: 'an open space in a town with buildings all around it', ex: 'It starts in the market square, at ten o\'clock.' }
        ],
        transcript: [
          { who: 'Woman', text: 'Step seventeen. You will hear a man at a tourist office. He is asking about places in the town. Listen and complete the notes.', answers: [] },
          { who: 'Woman', text: 'Good morning, and welcome to the tourist office. How can I help you?', answers: [] },
          { who: 'Man', text: "Hello. I'm here on holiday, and I'd like to see the town. Can you help me?", answers: [] },
          { who: 'Woman', text: 'Of course. Can I have your name, please? Then I can book a town walk for you.', answers: [] },
          { who: 'Man', text: "Yes, it's Barton. I'll spell it for you.", answers: [1] },
          { who: 'Man', text: "That's B, A, R, T, O, N.", answers: [1] },
          { who: 'Woman', text: 'Thank you, Mr Barton. How long are you staying in town?', answers: [] },
          { who: 'Man', text: "I'm here until Sunday. I go home on Sunday evening.", answers: [2] },
          { who: 'Woman', text: 'Lovely. What would you like to see first?', answers: [] },
          { who: 'Man', text: "I'd like to visit the museum. Where is it?", answers: [] },
          { who: 'Woman', text: "The town museum is on Morley Street, next to the library. I'll spell Morley for you.", answers: [3] },
          { who: 'Woman', text: "That's M, O, R, L, E, Y.", answers: [3] },
          { who: 'Man', text: 'Thank you. And what time does it open?', answers: [] },
          { who: 'Woman', text: 'It opens at nine thirty every morning.', answers: [4] },
          { who: 'Man', text: 'Nine thirty?', answers: [4] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: 'Is the museum open every day?', answers: [] },
          { who: 'Woman', text: "No, it isn't. It's closed on Mondays.", answers: [5] },
          { who: 'Man', text: 'OK. And how much is a ticket?', answers: [] },
          { who: 'Woman', text: 'A ticket for an adult is six pounds.', answers: [6] },
          { who: 'Man', text: 'Six pounds for an adult?', answers: [6] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: 'Great. Is there a good place for lunch near the museum?', answers: [] },
          { who: 'Woman', text: "Yes, try the Old Mill café. It's by the river, and the soup is lovely.", answers: [7] },
          { who: 'Man', text: 'Thank you. What about the castle? When does it close?', answers: [] },
          { who: 'Woman', text: "The castle closes at five o'clock, so go in the morning or early afternoon.", answers: [8] },
          { who: 'Man', text: "Five o'clock?", answers: [8] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: "There's also a free town walk on Saturday morning. Would you like to come?", answers: [] },
          { who: 'Man', text: 'Yes, please! Where does it start?', answers: [] },
          { who: 'Woman', text: "It starts in the market square, at ten o'clock.", answers: [9] },
          { who: 'Man', text: 'And can I phone you if I have a question?', answers: [] },
          { who: 'Woman', text: 'Of course. Our phone number is oh seven seven double oh, nine double oh, five nine three.', answers: [10] },
          { who: 'Man', text: 'Oh seven seven double oh, nine double oh, five nine three?', answers: [10] },
          { who: 'Woman', text: "Yes, that's right.", answers: [] },
          { who: 'Man', text: 'Thank you very much for your help. Goodbye!', answers: [] },
          { who: 'Woman', text: 'Goodbye, Mr Barton, and enjoy your stay!', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "Simple Habits for a Healthy Life",
        text: "You don't need an expensive gym or a special diet to be healthy. Small daily habits can make a big difference.\n\n" +
          "The first habit is drinking enough water. Our bodies are about sixty per cent water, and we lose some every day. Doctors usually recommend six to eight glasses a day. If you feel tired or have a headache, you might simply be thirsty.\n\n" +
          "The second habit is moving more. You don't have to run a marathon. Walking for thirty minutes a day, using the stairs instead of the lift or cycling to school is enough to keep your heart strong.\n\n" +
          "Sleep is the third important habit. Teenagers need eight to ten hours of sleep. Using your phone late at night makes it harder to fall asleep, so try to put it away an hour before bed.\n\n" +
          "Fourth, eat more fruit and vegetables and less sugar. Fast food is quick and tasty, but if you eat it every day, it can cause health problems.\n\n" +
          "Breakfast is another important part of a healthy day. Many teenagers skip breakfast because they get up late. However, people who eat a good breakfast usually have more energy and concentrate better at school. A healthy breakfast doesn't have to take long: a bowl of porridge with fruit, eggs on toast or yoghurt with nuts only takes a few minutes to prepare.\n\n" +
          "It is also important to spend less time sitting. Today, many people sit for eight or nine hours a day: at school or work, in cars and in front of screens. Some scientists say that sitting for too long is very bad for our health. If you study for a long time, stand up every hour, stretch your body and walk around for a few minutes.\n\n" +
          "Sunlight is good for us too. When our skin gets sunlight, our body makes vitamin D, which keeps our bones strong. Fifteen minutes outside on a sunny day is usually enough. In winter, when the days are short, some people feel tired and sad because they don't get enough sunlight. But be careful in summer: too much sun can burn your skin, so use sun cream and wear a hat.\n\n" +
          "Washing your hands is a simple habit that protects you from many illnesses. Doctors say we should wash our hands with soap for at least twenty seconds, especially before eating and after using public transport. It sounds easy, but studies show that many people wash their hands for only a few seconds.\n\n" +
          "Changing your habits is not easy. Experts say it takes about two months to make a new habit. The secret is to start small. For example, instead of trying to run five kilometres on the first day, start with a ten-minute walk. Write down your progress, and don't give up if you miss a day.\n\n" +
          "Finally, take care of your mind. Spend time with friends, go outside and take short breaks when you study. A healthy life is a happy life.",
        words: [
          { w: "Habits", uz: "Odatlar", emoji: "🔁", ex: "Small daily habits can make a big difference." },
          { w: "Make a difference", uz: "Ta'sir ko'rsatmoq", emoji: "✨", ex: "Small daily habits can make a big difference." },
          { w: "Recommend", uz: "Tavsiya qilmoq", emoji: "👩‍⚕️", ex: "Doctors usually recommend six to eight glasses a day." },
          { w: "Thirsty", uz: "Chanqagan", emoji: "💧", ex: "If you feel tired or have a headache, you might simply be thirsty." },
          { w: "Instead of", uz: "...ning o'rniga", emoji: "🔄", ex: "Walking for thirty minutes a day, using the stairs instead of the lift or cycling to school is enough to keep your heart strong." },
          { w: "Fall asleep", uz: "Uxlab qolmoq", emoji: "😴", ex: "Using your phone late at night makes it harder to fall asleep, so try to put it away an hour before bed." },
          { w: "Put away", uz: "Olib qo'ymoq", emoji: "📵", ex: "Using your phone late at night makes it harder to fall asleep, so try to put it away an hour before bed." },
          { w: "Cause", uz: "Sabab bo'lmoq", emoji: "⚠️", ex: "Fast food is quick and tasty, but if you eat it every day, it can cause health problems." },
          { w: "Take care of", uz: "G'amxo'rlik qilmoq", emoji: "💚", ex: "Finally, take care of your mind." },
          { w: "Take a break", uz: "Tanaffus qilmoq", emoji: "☕", ex: "Spend time with friends, go outside and take short breaks when you study." }
        ],
        questions: [
          { type: "tfng", q: "Teenagers need eight to ten hours of sleep.", a: ["True"], line: 10 },
          { type: "tfng", q: "Sitting for many hours every day is good for your body.", a: ["False"], line: 20 },
          { type: "tfng", q: "Our body makes vitamin D when our skin gets sunlight.", a: ["True"], line: 23 },
          { type: "tfng", q: "Porridge is the healthiest breakfast.", a: ["Not given"], line: 17 },
          { type: "tfng", q: "It takes about two weeks to make a new habit.", a: ["False"], line: 31 },
          { type: "gap", q: "Our bodies are about sixty per cent _____.", a: ["water"], line: 3 },
          { type: "gap", q: "People who eat a good breakfast usually concentrate better at _____.", a: ["school"], line: 16 },
          { type: "gap", q: "If you study for a long time, stand up every _____.", a: ["hour"], line: 21 },
          { type: "gap", q: "Vitamin D keeps our _____ strong.", a: ["bones"], line: 23 },
          { type: "gap", q: "We should wash our hands with soap for at least twenty _____.", a: ["seconds"], line: 28 },
          { type: "open", q: "Why do many teenagers skip breakfast?", keys: ["late"], line: 15 },
          { type: "open", q: "Why is using your phone late at night a problem?", keys: ["asleep","sleep"], line: 11 },
          { type: "open", q: "How can you protect your skin from too much sun?", keys: ["cream","hat"], line: 26 },
          { type: "open", q: "Why do some people feel tired and sad in winter?", keys: ["sunlight","light"], line: 25 },
          { type: "open", q: "What is the secret to making a new habit?", keys: ["small"], line: 32 }
        ],
        retell: "Retell the text in your own words. Explain the five healthy habits."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "How I Stay Healthy",
        instruction: "Write about what you do to stay healthy, and what you would like to change in your habits.",
        words: [
          { w: "healthy", uz: "sog'lom" },
          { w: "habits", uz: "odatlar" },
          { w: "exercise", uz: "jismoniy mashq qilmoq" },
          { w: "balanced diet", uz: "muvozanatli ovqatlanish" },
          { w: "avoid", uz: "... dan saqlanmoq" },
          { w: "get enough sleep", uz: "yetarlicha uxlamoq" },
          { w: "stress", uz: "stress, asabiylik" },
          { w: "fresh air", uz: "toza havo" },
          { w: "regularly", uz: "muntazam ravishda" },
          { w: "instead of", uz: "... o'rniga" }
        ],
        minWords: 120, maxWords: 140, minutes: 25
      },
      speaking: {
        words: [
          { w: 'town', emoji: '🏘️', ex: 'I live in a small town near the mountains.' },
          { w: 'city', emoji: '🏙️', ex: 'My uncle lives in a big city.' },
          { w: 'park', emoji: '🌳', ex: 'There is a beautiful park in the centre.' },
          { w: 'museum', emoji: '🏛️', ex: 'Our town has a small museum.' },
          { w: 'library', emoji: '📚', ex: 'I often study in the library.' },
          { w: 'bus station', emoji: '🚌', ex: 'The bus station is next to the market.' },
          { w: 'near', emoji: '📍', ex: 'My school is near my house.' },
          { w: 'far from', emoji: '🗺️', ex: 'The airport is far from the town centre.' },
          { w: 'busy', emoji: '🚗', ex: 'The main street is very busy in the evening.' },
          { w: 'quiet', emoji: '🤫', ex: 'My street is quiet at night.' }
        ],
        questions: [
          { q: 'Where do you live?', use: ['I live in …', 'a town', 'a city', 'a village', 'near …'] },
          { q: 'What is your favourite place in your town?', use: ['My favourite place is …', 'because …', 'the park', 'a café'] },
          { q: 'Is your town busy or quiet?', use: ['It is very …', 'busy', 'quiet', 'at the weekend', 'in the evening'] },
          { q: 'How do you get to school or work?', use: ['I go by …', 'bus', 'on foot', 'It takes … minutes.'] },
          { q: 'What can visitors see in your town?', use: ['They can see …', 'the market', 'old buildings', 'a good restaurant'] }
        ],
        part2: {
          topic: 'Talk about a place in your town',
          hints: ['what the place is and where it is', 'what people do there', 'why you like it'],
          seconds: 60
        }
      }
    },
    {
      id: 'e8', no: 18, stage: 'Elementary', theme: 'Free time', emoji: '🎨',
      listening: {
        src: 'audio/skills/elem-8-listening.mp3?v=2',
        title: 'Signing up for a course',
        intro: 'Listen to a woman signing up for a course at a community centre. Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        questions: [
          { q: 'Course: _____ for Beginners', a: ['Photography'] },
          { q: 'Name: Ms _____', a: ['Dalton'] },
          { q: 'Address: 12 _____ Road', a: ['Penford'] },
          { q: 'Day: _____', a: ['Thursday', 'Thursdays', 'Thursday evening', 'Thursday evenings'] },
          { q: 'The class starts at: _____', a: ['7.30', '7:30', 'seven thirty', 'half past seven', '7.30 pm', '7:30 pm', '7.30pm', '7:30pm', '19.30', '19:30'] },
          { q: 'Length of the course: _____ weeks', a: ['8', 'eight'] },
          { q: 'Price: £_____', a: ['45', 'forty-five', 'forty five', '£45', '45.00', '£45.00', '45 pounds', 'forty-five pounds'] },
          { q: 'Bring: a _____', a: ['notebook', 'note book'] },
          { q: 'The classes are on the _____ floor', a: ['second', '2nd', '2'] },
          { q: 'Community centre phone number: _____', a: ['07700 900 264', '07700900264'] }
        ],
        words: [
          { w: 'sign up', emoji: '✍️', m: 'to put your name on a list because you want to join something', ex: "I'd like to sign up for a course, please." },
          { w: 'community centre', emoji: '🏢', m: 'a building where people from the same town meet, learn and do activities', ex: 'Good evening, and welcome to Hillside Community Centre.' },
          { w: 'free time', emoji: '🕒', m: 'the time when you are not working or studying', ex: 'I want to do something new in my free time.' },
          { w: 'interested in', emoji: '🤩', m: 'wanting to know more about something or to do it', ex: 'Which course are you interested in?' },
          { w: 'photography', emoji: '📷', m: 'taking photos, as a hobby or as a job', ex: 'I want to do the photography course.' },
          { w: 'popular', emoji: '🌟', m: 'liked by a lot of people', ex: "That's a very popular course." },
          { w: 'cost', emoji: '💷', m: 'to have a price; to need this much money to buy or do it', ex: 'How much does it cost?' },
          { w: 'whole', emoji: '🧩', m: 'all of something, with no part missing', ex: "It's forty-five pounds for the whole course." },
          { w: 'notebook', emoji: '📓', m: 'a small book with empty pages for writing in', ex: 'Please bring a notebook to write in.' },
          { w: 'floor', emoji: '🛗', m: 'one level of a building, for example the ground floor or the first floor', ex: "They're on the second floor, in the big room at the end." }
        ],
        transcript: [
          { who: 'Woman', text: 'Step eighteen. You will hear a woman at a community centre. She wants to sign up for a course. Listen and complete the form.', answers: [] },
          { who: 'Man', text: 'Good evening, and welcome to Hillside Community Centre. How can I help you?', answers: [] },
          { who: 'Woman', text: "Hello. I'd like to sign up for a course, please. I want to do something new in my free time.", answers: [] },
          { who: 'Man', text: 'Great. Which course are you interested in?', answers: [] },
          { who: 'Woman', text: 'I want to do the photography course. I saw it on your website.', answers: [1] },
          { who: 'Man', text: "Photography for Beginners. That's a very popular course. Can I have your surname, please?", answers: [1] },
          { who: 'Woman', text: "Yes, it's Dalton. I'll spell it for you.", answers: [2] },
          { who: 'Woman', text: "That's D, A, L, T, O, N.", answers: [2] },
          { who: 'Man', text: "Thank you, Ms Dalton. And what's your address?", answers: [] },
          { who: 'Woman', text: "I live at number twelve, Penford Road. I'll spell Penford for you.", answers: [3] },
          { who: 'Woman', text: "That's P, E, N, F, O, R, D.", answers: [3] },
          { who: 'Man', text: 'Thank you. There are two groups for this course. One meets on Tuesday afternoon, and the other meets on Thursday evening. Which day is better for you?', answers: [] },
          { who: 'Woman', text: 'I work in the afternoons, so Thursday is better for me.', answers: [4] },
          { who: 'Man', text: 'No problem. The Thursday class starts at seven thirty in the evening.', answers: [5] },
          { who: 'Woman', text: 'Seven thirty?', answers: [5] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'And how long is the course?', answers: [] },
          { who: 'Man', text: "It's eight weeks long, and each class is two hours.", answers: [6] },
          { who: 'Woman', text: 'Eight weeks?', answers: [6] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Great. How much does it cost?', answers: [] },
          { who: 'Man', text: "It's forty-five pounds for the whole course.", answers: [7] },
          { who: 'Woman', text: 'Forty-five pounds for eight weeks?', answers: [7] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Do I need to bring a camera?', answers: [] },
          { who: 'Man', text: "No, you don't. You can take photos with your phone. But please bring a notebook to write in.", answers: [8] },
          { who: 'Woman', text: 'OK. And where are the classes?', answers: [] },
          { who: 'Man', text: "They're on the second floor, in the big room at the end.", answers: [9] },
          { who: 'Woman', text: "And can I phone you if I can't come one week?", answers: [] },
          { who: 'Man', text: 'Of course. Our phone number is oh seven seven double oh, nine double oh, two six four.', answers: [10] },
          { who: 'Woman', text: 'Oh seven seven double oh, nine double oh, two six four?', answers: [10] },
          { who: 'Man', text: "Yes, that's right.", answers: [] },
          { who: 'Woman', text: 'Thank you very much. See you on Thursday!', answers: [] },
          { who: 'Man', text: 'See you on Thursday, Ms Dalton. Enjoy the course!', answers: [] }
        ]
      },
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "How Technology Helps Us",
        text: "Think about your day. How many times do you use technology? For most of us, the answer is: all the time.\n\n" +
          "Technology helps us communicate. Fifty years ago, a letter to another country took weeks. Today, we can send a message or make a video call to anyone in the world in seconds. This is especially important for families who live far apart.\n\n" +
          "Technology also makes learning easier. Students can watch online lessons, use dictionaries on their phones and practise English with apps. If you don't understand something, you can find the answer on the internet in a few minutes.\n\n" +
          "In medicine, technology saves lives. Doctors use modern machines to find illnesses early. Some operations are now done with the help of robots, which are very precise.\n\n" +
          "Technology is useful at home too. Washing machines and dishwashers save us hours of housework every week, and maps on our phones help us find our way in a new city.\n\n" +
          "Technology is also changing the way people work. During the pandemic in 2020, millions of people started working from home using video calls and online tools. Many companies discovered that their workers could do their jobs well without coming to the office every day. Today, a lot of people work from home two or three days a week. They save time and money because they don't travel, but some people say they feel lonely without their colleagues.\n\n" +
          "Shopping has changed too. Twenty years ago, people usually went to shops to buy clothes, books or electronics. Now, many people order almost everything online, and it arrives at their door the next day. This is convenient, but many small shops have closed because they cannot compete with big online companies. Some supermarkets don't even need cashiers: customers scan their products themselves and pay with their phones.\n\n" +
          "In smart homes, you can control the lights, the heating and even the washing machine with your phone or your voice. Some fridges can tell you when the milk is finished, and robot vacuum cleaners clean the floor while you are at school. These machines save energy and time, but they are expensive, and some people worry about their privacy because the devices collect information about their lives.\n\n" +
          "Artificial intelligence, or AI, is one of the newest technologies. AI programs can translate languages, answer questions, write texts and even create pictures. Some students use AI to help them understand difficult topics. However, teachers worry that students might copy answers without thinking. Many schools now have rules about when students can use it. AI is a powerful tool, but it can make mistakes, so we should always check the information it gives us.\n\n" +
          "Technology also helps people with disabilities. For example, phones can read text aloud for people who cannot see well, and special apps can turn speech into text for people who cannot hear. Electric wheelchairs and smart home systems allow many people to live more independently.\n\n" +
          "But technology has some disadvantages. Spending too many hours in front of screens can be bad for our eyes and our sleep. The key is to use technology wisely.",
        words: [
          { w: "Communicate", uz: "Muloqot qilmoq", emoji: "💬", ex: "Technology helps us communicate." },
          { w: "Video call", uz: "Video qo'ng'iroq", emoji: "📹", ex: "Today, we can send a message or make a video call to anyone in the world in seconds." },
          { w: "Far apart", uz: "Bir-biridan uzoqda", emoji: "↔️", ex: "This is especially important for families who live far apart." },
          { w: "Apps", uz: "Ilovalar", emoji: "📱", ex: "Students can watch online lessons, use dictionaries on their phones and practise English with apps." },
          { w: "Save lives", uz: "Hayotni saqlab qolmoq", emoji: "🚑", ex: "In medicine, technology saves lives." },
          { w: "Illnesses", uz: "Kasalliklar", emoji: "🤒", ex: "Doctors use modern machines to find illnesses early." },
          { w: "Precise", uz: "Aniq", emoji: "🎯", ex: "Some operations are now done with the help of robots, which are very precise." },
          { w: "Housework", uz: "Uy ishlari", emoji: "🧺", ex: "Washing machines and dishwashers save us hours of housework every week, and maps on our phones help us find our way in a new city." },
          { w: "Disadvantages", uz: "Kamchiliklar", emoji: "👎", ex: "But technology has some disadvantages." },
          { w: "Wisely", uz: "Oqilona", emoji: "🦉", ex: "The key is to use technology wisely." }
        ],
        questions: [
          { type: "tfng", q: "Fifty years ago, a letter to another country took weeks.", a: ["True"], line: 4 },
          { type: "tfng", q: "Everyone who works from home is happy about it.", a: ["False"], line: 19 },
          { type: "tfng", q: "AI programs never make mistakes.", a: ["False"], line: 33 },
          { type: "tfng", q: "Robot vacuum cleaners are the most popular smart home devices.", a: ["Not given"], line: 26 },
          { type: "tfng", q: "Phones can read text aloud for people who cannot see well.", a: ["True"], line: 35 },
          { type: "gap", q: "Doctors use modern machines to find _____ early.", a: ["illnesses"], line: 11 },
          { type: "gap", q: "In some supermarkets, customers scan their products and pay with their _____.", a: ["phones"], line: 24 },
          { type: "gap", q: "AI programs can translate languages, answer questions and even create _____.", a: ["pictures"], line: 29 },
          { type: "gap", q: "Special apps can turn speech into _____ for people who cannot hear.", a: ["text"], line: 35 },
          { type: "gap", q: "Some people worry about their _____ because smart devices collect information.", a: ["privacy"], line: 27 },
          { type: "open", q: "Why do people who work from home save time and money?", keys: ["travel"], line: 19 },
          { type: "open", q: "Why have many small shops closed?", keys: ["compete","online"], line: 23 },
          { type: "open", q: "Why do teachers worry about AI?", keys: ["copy"], line: 31 },
          { type: "open", q: "Why should we always check the information AI gives us?", keys: ["mistake"], line: 33 },
          { type: "open", q: "What is the key to using technology?", keys: ["wisely"], line: 39 }
        ],
        retell: "Retell the text in your own words. Talk about how technology helps us and its disadvantages."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "Technology in My Life",
        instruction: "Write about how you use technology every day, how it helps you, and what problems it can cause.",
        words: [
          { w: "smartphone", uz: "smartfon" },
          { w: "apps", uz: "ilovalar" },
          { w: "online", uz: "onlayn" },
          { w: "keep in touch", uz: "aloqada bo'lmoq" },
          { w: "useful", uz: "foydali" },
          { w: "waste time", uz: "vaqtni behuda o'tkazmoq" },
          { w: "screen time", uz: "ekran oldida o'tkazilgan vaqt" },
          { w: "without", uz: "... siz" },
          { w: "search for", uz: "qidirmoq" },
          { w: "communicate", uz: "muloqot qilmoq" }
        ],
        minWords: 120, maxWords: 140, minutes: 25
      },
      speaking: {
        words: [
          { w: 'hobby', emoji: '🎨', ex: 'My favourite hobby is drawing.' },
          { w: 'free time', emoji: '🕒', ex: 'In my free time, I read books.' },
          { w: 'at the weekend', emoji: '📅', ex: 'At the weekend, I play football with my friends.' },
          { w: 'play', emoji: '⚽', ex: 'I play basketball twice a week.' },
          { w: 'watch films', emoji: '🎬', ex: 'I often watch films with my family.' },
          { w: 'listen to music', emoji: '🎧', ex: 'I listen to music on the bus.' },
          { w: 'draw', emoji: '🖍️', ex: 'My sister likes to draw animals.' },
          { w: 'club', emoji: '👥', ex: 'I go to a chess club after school.' },
          { w: 'relax', emoji: '😌', ex: 'I relax at home on Sunday evenings.' },
          { w: 'enjoy', emoji: '😊', ex: 'I really enjoy cooking for my friends.' }
        ],
        questions: [
          { q: 'What do you do in your free time?', use: ['In my free time, I …', 'I like …ing', 'read books', 'play games'] },
          { q: 'What do you usually do at the weekend?', use: ['At the weekend, I usually …', 'with my friends', 'go to the park', 'relax at home'] },
          { q: 'Do you play any sports?', use: ['Yes, I play …', "No, I don't, but I …", 'football', 'twice a week'] },
          { q: 'What kind of music or films do you like?', use: ['I really like …', 'funny films', 'pop music', 'My favourite … is …'] },
          { q: 'Would you like to join a club? Which one?', use: ["I'd like to join …", 'a sports club', 'a book club', 'because …'] }
        ],
        part2: {
          topic: 'Talk about a hobby you enjoy',
          hints: ['what the hobby is and when you started it', 'how often and where you do it', 'why you enjoy it'],
          seconds: 90
        }
      }
    },
    { id: 'e9', no: 19, stage: 'Elementary', theme: 'Travel', emoji: '🚆',
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "The Story Behind a Famous Movie",
        text: "In 1912, the Titanic was the biggest ship in the world. People said it could never sink. But on its first journey, from England to New York, it hit an iceberg in the Atlantic Ocean. More than 1,500 people died.\n\n" +
          "The real story of the Titanic is full of sad facts. The ship had about 2,200 people on board, but there were lifeboats for only about half of them. Many passengers did not believe the ship was in danger, so some of the first lifeboats left the ship half empty. The water was so cold that most people could survive in it for only a few minutes. About 700 people were rescued by another ship, the Carpathia, which arrived a few hours later.\n\n" +
          "Eighty-five years later, the director James Cameron made a film about this tragedy. He was interested in the ship for many years. Before filming, he travelled to the bottom of the ocean in a small submarine and saw the real Titanic. He went down twelve times!\n\n" +
          "Making the film was not easy. The team built a huge copy of the ship in Mexico, almost as long as the real one. They also used a giant water tank to film the scenes when the ship sinks. The actors spent many hours in cold water.\n\n" +
          "The actors also had to work hard. Leonardo DiCaprio played Jack, a poor young artist, and Kate Winslet played Rose, a rich young woman who is unhappy with her life. Many scenes were filmed in very cold water, and Kate Winslet later said that it was one of the hardest jobs of her life.\n\n" +
          "Cameron wanted every detail to be correct. The team studied old photos and plans of the ship, and they made exact copies of the plates, chairs, carpets and lamps. People who saw the film said it felt like travelling back in time.\n\n" +
          "Filming took much longer than planned. The team worked for more than six months, often at night, and the cost grew and grew. The studio was worried, and some newspapers wrote that the film would be a disaster. Cameron did not give up. He even agreed not to take his own salary to help pay for the film.\n\n" +
          "The music was also very important. The composer James Horner wrote the music for the film, and the song \"My Heart Will Go On\", sung by Céline Dion, became a huge hit all over the world. At first, Cameron did not want a song at the end of the film, but when he heard it, he changed his mind.\n\n" +
          "The film was very expensive, and many people thought it would fail. But when it came out in 1997, millions of people went to cinemas to see the love story of Jack and Rose. The film won eleven Oscars and became one of the most successful films in history.\n\n" +
          "Today, the real Titanic is still at the bottom of the Atlantic Ocean, almost four kilometres under the water. Scientists say that tiny living things are slowly eating the metal, and in a few decades, there may be nothing left of the ship. But thanks to the film, its story will not be forgotten.\n\n" +
          "Many visitors still go to the Titanic museum in Belfast, the city where the ship was built. It stands next to the place where workers built the Titanic more than a hundred years ago.",
        words: [
          { w: "Sink", uz: "Cho'kmoq", emoji: "🌊", ex: "People said it could never sink." },
          { w: "Iceberg", uz: "Aysberg", emoji: "🧊", ex: "But on its first journey, from England to New York, it hit an iceberg in the Atlantic Ocean." },
          { w: "Director", uz: "Rejissyor", emoji: "🎬", ex: "Eighty-five years later, the director James Cameron made a film about this tragedy." },
          { w: "Tragedy", uz: "Fojia", emoji: "😢", ex: "Eighty-five years later, the director James Cameron made a film about this tragedy." },
          { w: "Bottom", uz: "Tub (ost)", emoji: "⬇️", ex: "Before filming, he travelled to the bottom of the ocean in a small submarine and saw the real Titanic." },
          { w: "Submarine", uz: "Suv osti kemasi", emoji: "🚢", ex: "Before filming, he travelled to the bottom of the ocean in a small submarine and saw the real Titanic." },
          { w: "Filming", uz: "Suratga olish", emoji: "🎥", ex: "Eighty-five years later, the director James Cameron made a film about this tragedy." },
          { w: "Huge", uz: "Ulkan", emoji: "🐘", ex: "The team built a huge copy of the ship in Mexico, almost as long as the real one." },
          { w: "Fail", uz: "Muvaffaqiyatsizlikka uchramoq", emoji: "❌", ex: "The film was very expensive, and many people thought it would fail." },
          { w: "Successful", uz: "Muvaffaqiyatli", emoji: "🏆", ex: "The film won eleven Oscars and became one of the most successful films in history." }
        ],
        questions: [
          { type: "tfng", q: "The Titanic hit an iceberg on its first journey.", a: ["True"], line: 2 },
          { type: "tfng", q: "James Cameron saw the real Titanic only once.", a: ["False"], line: 12 },
          { type: "tfng", q: "At first, Cameron wanted a song at the end of the film.", a: ["False"], line: 30 },
          { type: "tfng", q: "Leonardo DiCaprio could swim well before filming started.", a: ["Not given"], line: 18 },
          { type: "tfng", q: "Cameron agreed not to take his own salary.", a: ["True"], line: 27 },
          { type: "gap", q: "The Titanic hit an _____ in the Atlantic Ocean.", a: ["iceberg"], line: 2 },
          { type: "gap", q: "The team built a huge copy of the ship in _____.", a: ["Mexico"], line: 14 },
          { type: "gap", q: "The music for the film was written by James _____.", a: ["Horner"], line: 29 },
          { type: "gap", q: "The real Titanic lies almost four _____ under the water.", a: ["kilometres","kilometers","km"], line: 34 },
          { type: "gap", q: "Tiny living things are slowly eating the _____ of the ship.", a: ["metal"], line: 35 },
          { type: "open", q: "Why did many people die when the Titanic sank?", keys: ["lifeboat","cold","half"], line: 5 },
          { type: "open", q: "Why did the team study old photos and plans of the ship?", keys: ["detail","correct","cop"], line: 20 },
          { type: "open", q: "Who sang \"My Heart Will Go On\"?", keys: ["céline","celine","dion"], line: 29 },
          { type: "open", q: "Why were the studio and some newspapers worried?", keys: ["cost","expensive","longer","money"], line: 24 },
          { type: "open", q: "What may happen to the real Titanic in a few decades?", keys: ["nothing","disappear"], line: 35 }
        ],
        retell: "Retell the text in your own words. Talk about the real ship, how the film was made and what happened when it came out."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Movie",
        instruction: "Write about your favourite film: what it is about, who the main characters are, and why you recommend it. Don't tell the ending!",
        words: [
          { w: "director", uz: "rejissyor" },
          { w: "main character", uz: "bosh qahramon" },
          { w: "plot", uz: "syujet" },
          { w: "take place", uz: "sodir bo'lmoq" },
          { w: "exciting", uz: "hayajonli" },
          { w: "scene", uz: "sahna" },
          { w: "actor", uz: "aktyor" },
          { w: "touching", uz: "ta'sirli" },
          { w: "ending", uz: "yakun, oxiri" },
          { w: "recommend", uz: "tavsiya qilmoq" }
        ],
        minWords: 120, maxWords: 140, minutes: 25
      }
    },
    { id: 'e10', no: 20, stage: 'Elementary', theme: 'Weather & holidays', emoji: '☀️',
      reading: {
        // the Reading Journey (teacher, 2026-11-09) — made by tools/build-readings.js from docs/reading-journey.json
        title: "Four Seasons of the Year",
        text: "Why do we have seasons? Many people think it is because the Earth is closer to the Sun in summer. In fact, the reason is different. The Earth is tilted, so during the year, different parts of the planet get more or less sunlight.\n\n" +
          "In spring, the days get longer and warmer. Trees grow new leaves, flowers appear, and many birds return from warmer countries. Farmers start planting their crops.\n\n" +
          "Summer is the hottest season. The sun rises early and sets late, so we have long evenings. Schools close for the holidays, and many families go to the beach or the mountains.\n\n" +
          "In autumn, the weather becomes cooler, and leaves turn yellow, orange and red before they fall. Farmers harvest fruit and vegetables. Some animals, like squirrels, collect food for the winter.\n\n" +
          "Winter is the coldest season. In many places, it snows, and lakes freeze. Some animals, like bears, sleep for most of the winter.\n\n" +
          "Seasons are not the same everywhere. Near the equator, in countries like Indonesia or Kenya, it is warm all year, and there is no real winter. Instead, many of these places have two seasons: a dry season and a rainy season. During the rainy season, heavy rain falls almost every afternoon, and rivers can flood.\n\n" +
          "In the far north and the far south of the planet, the seasons are extreme. In the north of Norway, the sun does not set for about two months in summer. People call this the midnight sun. In winter, the opposite happens, and the sun does not rise for several weeks. People there use bright lamps at home to feel more awake and cheerful.\n\n" +
          "Animals and plants are ready for the seasons too. Many trees lose their leaves in autumn to save water during the cold months. Some birds fly thousands of kilometres to warmer countries before winter, and they find their way using the sun and the stars. Other animals, like the Arctic fox, change the colour of their fur: it is brown in summer and white in winter, so they can hide in the snow.\n\n" +
          "Seasons affect our bodies and moods too. Many people feel more energetic in spring and summer, when the days are long and sunny. In winter, some people feel tired and sad because there is less light. Doctors call this the 'winter blues'. Spending time outside during the day and staying active can help.\n\n" +
          "Seasons also shape our traditions. In Japan, people celebrate spring with hanami, when they have picnics under the cherry trees. In many countries, autumn is the time for harvest festivals, when people thank nature for the food. And in cold countries, winter is the season for skiing, ice skating and cosy evenings at home.\n\n" +
          "Interestingly, when it is winter in the north of the planet, it is summer in the south. In Australia, people often celebrate the New Year on the beach!\n\n" +
          "Our planet's climate is changing, and this is affecting the seasons. In many places, spring now starts earlier than it did fifty years ago, and summers are becoming hotter. Some winters have less snow, which is a problem for animals, plants and even for ski resorts. Scientists say we must protect the environment so that future generations can enjoy all four seasons.\n\n" +
          "Which season is your favourite? Some people love the warm days of summer, while others prefer the colours of autumn or the snowy landscapes of winter. Every season has its own beauty, and each one brings something special.",
        words: [
          { w: "Seasons", uz: "Fasllar", emoji: "🍂", ex: "Why do we have seasons?" },
          { w: "In fact", uz: "Aslida", emoji: "💡", ex: "In fact, the reason is different." },
          { w: "Sunlight", uz: "Quyosh nuri", emoji: "☀️", ex: "The Earth is tilted, so during the year, different parts of the planet get more or less sunlight." },
          { w: "Appear", uz: "Paydo bo'lmoq", emoji: "🌷", ex: "Trees grow new leaves, flowers appear, and many birds return from warmer countries." },
          { w: "Return", uz: "Qaytmoq", emoji: "🐦", ex: "Trees grow new leaves, flowers appear, and many birds return from warmer countries." },
          { w: "Crops", uz: "Ekinlar", emoji: "🌾", ex: "Farmers start planting their crops." },
          { w: "Rise", uz: "Chiqmoq (quyosh)", emoji: "🌄", ex: "The sun rises early and sets late, so we have long evenings." },
          { w: "Harvest", uz: "Hosil yig'moq", emoji: "🧺", ex: "Farmers harvest fruit and vegetables." },
          { w: "Freeze", uz: "Muzlamoq", emoji: "❄️", ex: "In many places, it snows, and lakes freeze." },
          { w: "Celebrate", uz: "Nishonlamoq", emoji: "🎉", ex: "In Japan, people celebrate spring with hanami, when they have picnics under the cherry trees." }
        ],
        questions: [
          { type: "tfng", q: "We have seasons because the Earth is closer to the Sun in summer.", a: ["False"], line: 2 },
          { type: "tfng", q: "Near the equator, many places have a dry season and a rainy season.", a: ["True"], line: 18 },
          { type: "tfng", q: "In the north of Norway, the sun does not set for about two months in summer.", a: ["True"], line: 21 },
          { type: "tfng", q: "Hanami is the most popular festival in Japan.", a: ["Not given"], line: 35 },
          { type: "tfng", q: "Spring now starts later than it did fifty years ago.", a: ["False"], line: 41 },
          { type: "gap", q: "Many trees lose their leaves in autumn to save _____.", a: ["water"], line: 26 },
          { type: "gap", q: "People in the north of Norway use bright _____ at home in winter.", a: ["lamps"], line: 24 },
          { type: "gap", q: "Doctors call the sad, tired feeling some people have in winter the 'winter _____'.", a: ["blues"], line: 32 },
          { type: "gap", q: "In Japan, people have picnics under the _____ trees in spring.", a: ["cherry"], line: 35 },
          { type: "gap", q: "The Arctic fox's fur is _____ in winter.", a: ["white"], line: 28 },
          { type: "open", q: "Why do we really have seasons?", keys: ["tilt","sunlight"], line: 3 },
          { type: "open", q: "What is the midnight sun?", keys: ["not set","doesn't set","does not set"], line: 21 },
          { type: "open", q: "How do some birds find their way to warmer countries?", keys: ["sun","star"], line: 27 },
          { type: "open", q: "Why does the Arctic fox change the colour of its fur?", keys: ["hide"], line: 28 },
          { type: "open", q: "What do scientists say we must do?", keys: ["protect","environment"], line: 43 }
        ],
        retell: "Retell the text in your own words. Describe each season and explain why we have seasons."
      },
      writing: {
        // the Writing Journey (teacher, 2026-11-09) — made by tools/build-writings.js from docs/writing-journey.json
        topic: "My Favourite Season",
        instruction: "Write about your favourite season: what the weather is like, what you do at that time of year, and why you love it.",
        words: [
          { w: "season", uz: "fasl" },
          { w: "weather", uz: "ob-havo" },
          { w: "temperature", uz: "harorat" },
          { w: "outdoors", uz: "ochiq havoda" },
          { w: "celebrate", uz: "nishonlamoq" },
          { w: "remind me of", uz: "... ni eslatadi" },
          { w: "cosy", uz: "shinam" },
          { w: "colourful", uz: "rang-barang" },
          { w: "the best time", uz: "eng yaxshi vaqt" },
          { w: "spend", uz: "o'tkazmoq" }
        ],
        minWords: 120, maxWords: 150, minutes: 25
      }
    }
  ]
};

// Better words for the Writing check: a plain word the student used → livelier words to try next time.
var TA_BETTER_WORDS = {
  'good': ['great', 'excellent', 'wonderful'],
  'very good': ['excellent', 'brilliant', 'fantastic'],
  'nice': ['lovely', 'pleasant', 'beautiful'],
  'very nice': ['lovely', 'beautiful', 'delightful'],
  'big': ['large', 'huge', 'enormous'],
  'very big': ['huge', 'enormous'],
  'small': ['little', 'tiny'],
  'very small': ['tiny'],
  'happy': ['glad', 'pleased', 'cheerful'],
  'very happy': ['delighted', 'thrilled'],
  'sad': ['unhappy', 'upset'],
  'very sad': ['miserable', 'heartbroken'],
  'bad': ['awful', 'terrible', 'poor'],
  'very bad': ['terrible', 'awful', 'horrible'],
  'like': ['enjoy', 'love', 'am keen on'],
  'really like': ['love', 'adore'],
  'beautiful': ['gorgeous', 'stunning', 'lovely'],
  'pretty': ['lovely', 'attractive'],
  'funny': ['hilarious', 'amusing'],
  'interesting': ['fascinating', 'exciting'],
  'boring': ['dull', 'uninteresting'],
  'tired': ['exhausted', 'sleepy'],
  'very tired': ['exhausted', 'worn out'],
  'hungry': ['starving'],
  'cold': ['chilly', 'freezing'],
  'very cold': ['freezing'],
  'hot': ['warm', 'boiling'],
  'very hot': ['boiling', 'scorching'],
  'fast': ['quick', 'rapid'],
  'old': ['ancient', 'historic'],
  'new': ['modern', 'brand-new'],
  'clean': ['spotless', 'tidy'],
  'dirty': ['messy', 'untidy'],
  'scared': ['afraid', 'frightened', 'terrified'],
  'angry': ['cross', 'annoyed', 'furious'],
  'kind': ['friendly', 'generous', 'helpful'],
  'easy': ['simple', 'straightforward'],
  'hard': ['difficult', 'tough'],
  'a lot of': ['plenty of', 'many', 'lots of'],
  'go': ['travel', 'walk', 'head'],
  'say': ['tell', 'explain', 'reply'],
  'see': ['notice', 'watch', 'look at'],
  'get': ['receive', 'buy', 'become'],
  'want': ['would like', 'hope', 'wish'],
  'thing': ['object', 'item'],
  'fun': ['enjoyable', 'exciting', 'great fun'],
  'great': ['amazing', 'fantastic', 'brilliant']
};
