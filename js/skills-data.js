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
        title: "Amy's name card",
        text: "Hello! My name is Amy Hill. I am fifteen years old. I am a student. I am from Manchester. I live with my mum and my dad. My cat's name is Lily. I like music and books. My best friend is Jess. She is fifteen too.\n\n" +
          "My school is big and new. My favourite teacher is Mrs Taylor. She is very nice. I go to school by bus. My mum is a doctor, and my dad is a cook. At the weekend, I play the guitar with Jess. Lily sleeps on my bed every night.",
        questions: [
          { type: "tf", q: "Amy is fifteen.", a: ["True"], line: 2 },
          { type: "tf", q: "Amy is a teacher.", a: ["False"], line: 3 },
          { type: "tf", q: "Amy lives with her mum and her dad.", a: ["True"], line: 5 },
          { type: "tf", q: "Amy has got a dog.", a: ["False"], line: 6 },
          { type: "tf", q: "Jess is sixteen.", a: ["False"], line: 9 },
          { type: "tf", q: "Amy goes to school by bus.", a: ["True"], line: 13 },
          { type: "tf", q: "Amy's mum is a cook.", a: ["False"], line: 14 },
          { type: "choose", q: "What is Amy's surname?", opts: ["Hill","Green","Brown"], a: ["Hill"], line: 1 },
          { type: "choose", q: "Where is Amy from?", opts: ["London","Manchester","York"], a: ["Manchester"], line: 4 },
          { type: "choose", q: "What is the cat's name?", opts: ["Jess","Amy","Lily"], a: ["Lily"], line: 6 },
          { type: "choose", q: "What does Amy like?", opts: ["music and books","football and films","maths and art"], a: ["music and books"], line: 7 },
          { type: "choose", q: "Who is Amy's best friend?", opts: ["Lily","Jess","Kate"], a: ["Jess"], line: 8 },
          { type: "choose", q: "Who is Amy's favourite teacher?", opts: ["Mrs Taylor","Mrs Green","Mrs Brown"], a: ["Mrs Taylor"], line: 11 },
          { type: "choose", q: "What does Amy play at the weekend?", opts: ["football","the guitar","the piano"], a: ["the guitar"], line: 15 }
        ],
        words: [
          { w: 'name card', emoji: '📇', m: 'a small card with your name and a few things about you', ex: "Read Amy's name card." },
          { w: 'my name is', emoji: '📛', m: 'how you tell people your name', ex: 'My name is Amy Hill.' },
          { w: 'fifteen', emoji: '🔢', m: 'the number 15', ex: 'I am fifteen years old.' },
          { w: 'student', emoji: '🎒', m: 'a person who learns at a school', ex: 'I am a student.' },
          { w: 'live', emoji: '🏠', m: 'to have your home in a place', ex: 'I live with my mum and my dad.' },
          { w: 'mum', emoji: '👩', m: 'your mother', ex: 'I live with my mum.' },
          { w: 'dad', emoji: '👨', m: 'your father', ex: 'I live with my dad.' },
          { w: 'cat', emoji: '🐱', m: 'a small animal that lives in a home', ex: "My cat's name is Lily." },
          { w: 'music', emoji: '🎵', m: 'songs and sounds that you listen to', ex: 'I like music and books.' },
          { w: 'best friend', emoji: '🤝', m: 'the friend you like most', ex: 'My best friend is Jess.' }
        ]
      },
      writing: {
        topic: 'About me',
        task: 'Write an email to a new pen-friend about yourself.',
        points: ['your name and age', 'where you live', 'your family or your friends'],
        minWords: 50, maxWords: 70, minutes: 12
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
        title: 'Our class list',
        text: "This is our class list. We are Class 5B. There are eighteen students in our class. Our teacher is Mr Lee. Our classroom is Room 12. Sam is eleven years old. Ella is twelve. Max is eleven too. Ella has got two brothers. Sam has got one sister. There are six lessons every day.\n\n" +
          "Our classroom is big and sunny. It has got ten tables and a big whiteboard. Mr Lee is from London. He is a good teacher, and he is very funny. Our first lesson is at nine o'clock. Lunch is at half past twelve. There are four girls and two boys in my group. Ella sits next to me. Max sits behind us. Sam likes Maths, and Ella likes English. Max likes PE best. We go home at three o'clock.",
        questions: [
          { type: "tf", q: "There are eighteen students in the class.", a: ["True"], line: 2 },
          { type: "tf", q: "The classroom is Room 20.", a: ["False"], line: 4 },
          { type: "tf", q: "Sam is eleven.", a: ["True"], line: 5 },
          { type: "tf", q: "Max is twelve.", a: ["False"], line: 7 },
          { type: "tf", q: "There are six lessons every day.", a: ["True"], line: 10 },
          { type: "tf", q: "Mr Lee is from London.", a: ["True"], line: 13 },
          { type: "tf", q: "Lunch is at one o'clock.", a: ["False"], line: 16 },
          { type: "choose", q: "What class are they?", opts: ["Class 5B","Class 7B","Class 8B"], a: ["Class 5B"], line: 1 },
          { type: "choose", q: "Who is the teacher?", opts: ["Mr Hill","Mr Lee","Mrs Day"], a: ["Mr Lee"], line: 3 },
          { type: "choose", q: "How old is Ella?", opts: ["ten","eleven","twelve"], a: ["twelve"], line: 6 },
          { type: "choose", q: "How many brothers has Ella got?", opts: ["one","two","three"], a: ["two"], line: 8 },
          { type: "choose", q: "Who has got one sister?", opts: ["Sam","Ella","Max"], a: ["Sam"], line: 9 },
          { type: "choose", q: "How many tables are in the classroom?", opts: ["twelve","eighteen","ten"], a: ["ten"], line: 12 },
          { type: "choose", q: "What does Max like best?", opts: ["PE","Maths","English"], a: ["PE"], line: 21 }
        ],
        words: [
          { w: 'class list', emoji: '📋', m: 'a list of the students in a class', ex: 'This is our class list.' },
          { w: 'there are', emoji: '👉', m: 'we use it to say how many things or people', ex: 'There are eighteen students in our class.' },
          { w: 'eighteen', emoji: '🔢', m: 'the number 18', ex: 'There are eighteen students.' },
          { w: 'teacher', emoji: '👨‍🏫', m: 'a person who helps you learn at school', ex: 'Our teacher is Mr Lee.' },
          { w: 'classroom', emoji: '🏫', m: 'the room where you have lessons', ex: 'Our classroom is Room 12.' },
          { w: 'eleven', emoji: '1️⃣', m: 'the number 11', ex: 'Sam is eleven years old.' },
          { w: 'twelve', emoji: '🕛', m: 'the number 12', ex: 'Ella is twelve.' },
          { w: 'brother', emoji: '👦', m: 'a boy in your family, with the same mum and dad', ex: 'Ella has got two brothers.' },
          { w: 'sister', emoji: '👧', m: 'a girl in your family, with the same mum and dad', ex: 'Sam has got one sister.' },
          { w: 'lesson', emoji: '📚', m: 'a time when you learn something at school', ex: 'There are six lessons every day.' }
        ]
      },
      writing: {
        topic: 'My numbers',
        task: 'Write about the numbers in your life.',
        points: ['how old you are', 'your house or flat number and your classroom number', 'how many people there are in your family'],
        minWords: 60, maxWords: 80, minutes: 10
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
        title: 'My family photo',
        text: "Look at my family photo. My name is Holly and I am thirteen. The tall man is my dad, Tom. The woman next to him is my mum, Sarah. My big brother is Leo. He is seventeen. My little sister is Rosie. She is five. The old man is my grandad, Bill. He has got a white beard. Our cat, Toby, is on my grandad's knee.\n\n" +
          "This photo is from my grandad's birthday party. It was in the garden of our house. My dad is a bus driver, and my mum is a nurse. Leo plays the guitar, and he is very good. Rosie loves dolls and pink dresses. My grandad is seventy-five, but he is very happy and active. He lives with us in our house. My grandma is not in the photo, because she is the photographer! We have got a big cake on the table. It is a chocolate cake. Everyone in the photo is smiling.",
        questions: [
          { type: "tf", q: "Holly is thirteen.", a: ["True"], line: 1 },
          { type: "tf", q: "Holly's dad is short.", a: ["False"], line: 2 },
          { type: "tf", q: "Leo is Holly's little brother.", a: ["False"], line: 4 },
          { type: "tf", q: "Rosie is five.", a: ["True"], line: 7 },
          { type: "tf", q: "Grandad has got a beard.", a: ["True"], line: 9 },
          { type: "tf", q: "Holly's mum is a nurse.", a: ["True"], line: 13 },
          { type: "tf", q: "Holly's grandma is in the photo.", a: ["False"], line: 18 },
          { type: "choose", q: "Who is Sarah?", opts: ["Holly's mum","Holly's sister","Holly's grandma"], a: ["Holly's mum"], line: 3 },
          { type: "choose", q: "How old is Leo?", opts: ["seven","fifteen","seventeen"], a: ["seventeen"], line: 5 },
          { type: "choose", q: "Who is Rosie?", opts: ["Holly's little sister","Holly's mum","Holly's friend"], a: ["Holly's little sister"], line: 6 },
          { type: "choose", q: "Who is Bill?", opts: ["Holly's dad","Holly's grandad","Holly's brother"], a: ["Holly's grandad"], line: 8 },
          { type: "choose", q: "Who is Toby?", opts: ["the cat","the dog","the baby"], a: ["the cat"], line: 10 },
          { type: "choose", q: "Whose birthday party is in the photo?", opts: ["Holly's","Holly's grandad's","Rosie's"], a: ["Holly's grandad's"], line: 11 },
          { type: "choose", q: "What does Leo play?", opts: ["football","the piano","the guitar"], a: ["the guitar"], line: 14 }
        ],
        words: [
          { w: 'look at', emoji: '👀', m: 'to turn your eyes to something', ex: 'Look at my family photo.' },
          { w: 'man', emoji: '👨', m: 'a grown-up boy', ex: 'The tall man is my dad.' },
          { w: 'woman', emoji: '👩', m: 'a grown-up girl', ex: 'The woman next to him is my mum.' },
          { w: 'next to', emoji: '↔️', m: 'very near, at the side of', ex: 'The woman next to him is my mum.' },
          { w: 'big brother', emoji: '🧑', m: 'a brother who is older than you', ex: 'My big brother is Leo.' },
          { w: 'little sister', emoji: '👧', m: 'a sister who is younger than you', ex: 'My little sister is Rosie.' },
          { w: 'old', emoji: '⏳', m: 'not young', ex: 'The old man is my grandad.' },
          { w: 'grandad', emoji: '👴', m: 'the father of your mum or your dad', ex: 'The old man is my grandad, Bill.' },
          { w: 'beard', emoji: '🧔', m: 'hair on a man\'s face', ex: 'He has got a white beard.' },
          { w: 'knee', emoji: '🦵', m: 'the middle part of your leg', ex: "Our cat is on my grandad's knee." }
        ]
      },
      writing: {
        topic: 'My family',
        task: 'Write about your family.',
        points: ['how many people there are in your family', 'their names and how old they are', 'one thing about each person (tall, funny, kind…)'],
        minWords: 65, maxWords: 85, minutes: 15
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
        title: "What's in my bag?",
        text: "This is my school bag. It is red and black. In my bag, there are two books and a notebook. My pencil case is purple. There are three pencils, a pen and a rubber in it. I have got a bottle of water. It is blue. There is a banana for lunch. My phone is in my bag too. It is white. I have got my keys. They are small and silver.\n\n" +
          "I have got a small umbrella in my bag too. It is for rainy days. My bus card is in a small pocket. On Mondays, my sports shoes are in my bag, because I have got PE. They are white and blue. My glasses are in a brown box. My bag is very heavy every morning! In the afternoon, it is lighter, because I eat my banana and I drink my water.",
        questions: [
          { type: "tf", q: "The bag is red and black.", a: ["True"], line: 1 },
          { type: "tf", q: "There are three books in the bag.", a: ["False"], line: 2 },
          { type: "tf", q: "The pencil case is purple.", a: ["True"], line: 3 },
          { type: "tf", q: "The bottle of water is green.", a: ["False"], line: 6 },
          { type: "tf", q: "The phone is black.", a: ["False"], line: 9 },
          { type: "tf", q: "The sports shoes are white and blue.", a: ["True"], line: 16 },
          { type: "tf", q: "The bag is light in the morning.", a: ["False"], line: 18 },
          { type: "choose", q: "What else is in the bag with the books?", opts: ["a notebook","a ruler","a hat"], a: ["a notebook"], line: 2 },
          { type: "choose", q: "How many pencils are in the pencil case?", opts: ["two","three","four"], a: ["three"], line: 4 },
          { type: "choose", q: "What food is in the bag?", opts: ["an apple","a banana","a sandwich"], a: ["a banana"], line: 7 },
          { type: "choose", q: "The banana is for …", opts: ["breakfast","lunch","dinner"], a: ["lunch"], line: 7 },
          { type: "choose", q: "What colour are the keys?", opts: ["gold","silver","black"], a: ["silver"], line: 11 },
          { type: "choose", q: "When are the sports shoes in the bag?", opts: ["on Mondays","on Fridays","every day"], a: ["on Mondays"], line: 15 },
          { type: "choose", q: "Where are the glasses?", opts: ["in a small pocket","in a brown box","in the pencil case"], a: ["in a brown box"], line: 17 }
        ],
        words: [
          { w: 'school bag', emoji: '🎒', m: 'the bag you take to school', ex: 'This is my school bag.' },
          { w: 'notebook', emoji: '📓', m: 'a small book with empty pages for writing', ex: 'There are two books and a notebook.' },
          { w: 'purple', emoji: '🟣', m: 'a colour: red and blue together', ex: 'My pencil case is purple.' },
          { w: 'pencil', emoji: '✏️', m: 'you write or draw with it', ex: 'There are three pencils in it.' },
          { w: 'rubber', emoji: '🧽', m: 'a small thing that takes pencil off paper', ex: 'There is a rubber in my pencil case.' },
          { w: 'bottle', emoji: '💧', m: 'you keep water or milk in it', ex: 'I have got a bottle of water.' },
          { w: 'banana', emoji: '🍌', m: 'a long yellow fruit', ex: 'There is a banana for lunch.' },
          { w: 'phone', emoji: '📱', m: 'you call people with it', ex: 'My phone is in my bag too.' },
          { w: 'keys', emoji: '🔑', m: 'you open a door with them', ex: 'I have got my keys.' },
          { w: 'silver', emoji: '🥈', m: 'a grey colour that shines', ex: 'My keys are small and silver.' }
        ]
      },
      writing: {
        topic: 'My bag',
        task: 'Write about your bag and the things in it.',
        points: ['what colour your bag is', 'what is in your bag (books, pens…) and how many', 'your favourite thing in your bag and its colour'],
        minWords: 75, maxWords: 95, minutes: 15
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
        title: "Bell's Shop: our price list",
        text: "Welcome to Bell's Shop! We are at 36 King Street. We are open every day. Here is our price list. Bread is 85p. Milk is 60p. An apple is 30p, and a banana is 25p. A bottle of water is 50p. A small cake is 75p. Our cakes are very good! An ice cream is 90p. Children love it. A sandwich is £2. Birthday cards are 99p. Our phone number is 01632 960 714. Come and see us!\n\n" +
          "We have got a lot of fruit and vegetables too. Carrots are 40p, and a big orange is 45p. A box of eggs is £1.80. Our cheese is from a farm near the town. Cheese is £2.50. A small bottle of orange juice is 80p. We sell newspapers and magazines too. A newspaper is £1. We have got pens, pencils and notebooks for school. A notebook is £1.20. On Saturdays, children get a free sweet with every ice cream. The shop opens at seven o'clock in the morning and closes at nine o'clock in the evening.",
        questions: [
          { type: "tf", q: "The shop is open every day.", a: ["True"], line: 2 },
          { type: "tf", q: "Bread is 58p.", a: ["False"], line: 4 },
          { type: "tf", q: "A banana is 30p.", a: ["False"], line: 6 },
          { type: "tf", q: "A bottle of water is 50p.", a: ["True"], line: 7 },
          { type: "tf", q: "A sandwich is £2.", a: ["True"], line: 12 },
          { type: "tf", q: "A box of eggs is £1.80.", a: ["True"], line: 18 },
          { type: "tf", q: "The shop closes at seven o'clock in the evening.", a: ["False"], line: 27 },
          { type: "choose", q: "Where is the shop?", opts: ["36 King Street","63 King Street","36 Queen Street"], a: ["36 King Street"], line: 1 },
          { type: "choose", q: "How much is a small cake?", opts: ["57p","75p","70p"], a: ["75p"], line: 8 },
          { type: "choose", q: "How much is an ice cream?", opts: ["19p","90p","99p"], a: ["90p"], line: 10 },
          { type: "choose", q: "What is 99p?", opts: ["a birthday card","a cake","a sandwich"], a: ["a birthday card"], line: 13 },
          { type: "choose", q: "What is the shop's phone number?", opts: ["01632 960 714","01632 960 741","01632 690 714"], a: ["01632 960 714"], line: 14 },
          { type: "choose", q: "Where is the cheese from?", opts: ["a big supermarket","another country","a farm near the town"], a: ["a farm near the town"], line: 19 },
          { type: "choose", q: "What do children get on Saturdays?", opts: ["a free sweet","a free ice cream","a free notebook"], a: ["a free sweet"], line: 26 }
        ],
        words: [
          { w: 'shop', emoji: '🏪', m: 'a place where you buy things', ex: "Welcome to Bell's Shop!" },
          { w: 'price list', emoji: '📋', m: 'a list of things and how much they are', ex: 'Here is our price list.' },
          { w: 'open', emoji: '🔓', m: 'you can go in and buy things', ex: 'We are open every day.' },
          { w: 'bread', emoji: '🍞', m: 'a food made from flour; you make sandwiches with it', ex: 'Bread is 85p.' },
          { w: 'milk', emoji: '🥛', m: 'a white drink from cows', ex: 'Milk is 60p.' },
          { w: 'cake', emoji: '🍰', m: 'a sweet food for birthdays and parties', ex: 'A small cake is 75p.' },
          { w: 'ice cream', emoji: '🍦', m: 'a cold, sweet food', ex: 'An ice cream is 90p.' },
          { w: 'sandwich', emoji: '🥪', m: 'two pieces of bread with food between them', ex: 'A sandwich is £2.' },
          { w: 'birthday card', emoji: '💌', m: 'a card you give a friend on his or her birthday', ex: 'Birthday cards are 99p.' },
          { w: 'p (pence)', emoji: '🪙', m: 'small British money: 100p is £1', ex: 'Milk is 60p.' }
        ]
      },
      writing: {
        topic: 'Shopping list',
        task: 'You are going to the shop for your family. Write your shopping list in sentences.',
        points: ['what you need from the shop (five or six things)', 'how many of each thing — for example: two apples, one bottle of milk', 'how much each thing is — for example: The bread is 85p.'],
        minWords: 85, maxWords: 105, minutes: 15
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
        title: "Leo's school week",
        text: "My name is Leo and this is my school week. School starts at nine o'clock and finishes at three o'clock. On Monday, I have Maths and English. On Tuesday, I have Science and Art. Art is my favourite lesson! On Wednesday, I have Music. We sing songs. On Thursday, I have PE. We play football. On Friday, I have Maths again and a test. Lunch is at twelve o'clock every day. I don't go to school on Saturday and Sunday. On Saturday, I play with my friends.\n\n" +
          "In the morning, I get up at seven o'clock. I have breakfast with my sister, Mia. Mia is eight, and she goes to my school too. We walk to school with our mum. My best friend at school is Ben. Ben sits next to me in every lesson. My English teacher is Miss Brown. She reads stories to us. After school, I do my homework at four o'clock. I watch TV for one hour. Then we have dinner at six o'clock. I go to bed at nine o'clock. On Sunday, I visit my grandma and grandad. They live in a small house near the sea.",
        questions: [
          { type: "tf", q: "School starts at nine o'clock.", a: ["True"], line: 1 },
          { type: "tf", q: "Art is Leo's favourite lesson.", a: ["True"], line: 4 },
          { type: "tf", q: "Leo has PE on Monday.", a: ["False"], line: 7 },
          { type: "tf", q: "Lunch is at one o'clock.", a: ["False"], line: 10 },
          { type: "tf", q: "Leo goes to school on Sunday.", a: ["False"], line: 11 },
          { type: "tf", q: "Leo gets up at seven o'clock.", a: ["True"], line: 13 },
          { type: "tf", q: "Leo goes to school by bus.", a: ["False"], line: 16 },
          { type: "choose", q: "When does school finish?", opts: ["at two o'clock","at three o'clock","at four o'clock"], a: ["at three o'clock"], line: 1 },
          { type: "choose", q: "What does Leo have on Tuesday?", opts: ["Maths and English","Science and Art","Music"], a: ["Science and Art"], line: 3 },
          { type: "choose", q: "What do they do in Music?", opts: ["sing songs","play football","read books"], a: ["sing songs"], line: 6 },
          { type: "choose", q: "When is the test?", opts: ["on Monday","on Thursday","on Friday"], a: ["on Friday"], line: 9 },
          { type: "choose", q: "What does Leo do on Saturday?", opts: ["He goes to school.","He plays with his friends.","He has a test."], a: ["He plays with his friends."], line: 12 },
          { type: "choose", q: "Who is Leo's best friend at school?", opts: ["Mia","Ben","Tom"], a: ["Ben"], line: 17 },
          { type: "choose", q: "When does Leo do his homework?", opts: ["at six o'clock","at nine o'clock","at four o'clock"], a: ["at four o'clock"], line: 21 }
        ],
        words: [
          { w: 'week', emoji: '📆', m: 'seven days: Monday to Sunday', ex: 'This is my school week.' },
          { w: 'start', emoji: '▶️', m: 'to begin', ex: "School starts at nine o'clock." },
          { w: 'finish', emoji: '🏁', m: 'to stop at the end', ex: "School finishes at three o'clock." },
          { w: 'Maths', emoji: '➗', m: 'the lesson with numbers', ex: 'On Monday, I have Maths and English.' },
          { w: 'Science', emoji: '🔬', m: 'the lesson about plants, animals and the world', ex: 'On Tuesday, I have Science and Art.' },
          { w: 'Art', emoji: '🎨', m: 'the lesson where you draw and paint', ex: 'Art is my favourite lesson!' },
          { w: 'Music', emoji: '🎵', m: 'the lesson where you sing and play', ex: 'On Wednesday, I have Music.' },
          { w: 'PE', emoji: '⚽', m: 'the sports lesson at school', ex: 'On Thursday, I have PE.' },
          { w: 'test', emoji: '📝', m: 'questions the teacher gives to see what you know', ex: 'On Friday, I have a test.' },
          { w: 'lunch', emoji: '🍽️', m: 'the food you eat in the middle of the day', ex: "Lunch is at twelve o'clock." }
        ]
      },
      writing: {
        topic: 'My week',
        task: 'Write about your week.',
        points: ['what you do on two or three days of the week — for example: On Monday, I have English.', 'what time you start and finish school (or work)', 'your favourite day and why'],
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
        title: 'The Green Café menu',
        text: "Welcome to the Green Café! We are open every day from eight o'clock to six o'clock. For breakfast, we have eggs and toast for £3.50. Pancakes with fruit are £4. Children love our pancakes! For lunch, a cheese sandwich is £3. Chicken soup with bread is £4.50. Our soup is hot and very good on a cold day. A small pizza is £6. Tea and coffee are £1.50. Orange juice is £2, and a glass of milk is £1. For something sweet, try our chocolate cake for £2.50. Come and eat with us!\n\n" +
          "The café is in a small street near the station. It is green and white inside, and there are flowers on every table. The café has got twenty tables. On sunny days, you can sit in the garden. The cook is Mr Green. He makes the bread every morning. His wife, Anna, makes the cakes. We have got a special menu for children. It has small pizzas and small sandwiches. A children's lunch is £4. On Fridays, we have fish and chips for £7. Our café is busy at lunchtime. Please come early! We have free water for everyone.",
        questions: [
          { type: "tf", q: "The café is open every day.", a: ["True"], line: 1 },
          { type: "tf", q: "Eggs and toast are £4.", a: ["False"], line: 2 },
          { type: "tf", q: "Children love the pancakes.", a: ["True"], line: 4 },
          { type: "tf", q: "The soup is cold.", a: ["False"], line: 7 },
          { type: "tf", q: "A glass of milk is £1.", a: ["True"], line: 10 },
          { type: "tf", q: "The café has got twenty tables.", a: ["True"], line: 15 },
          { type: "tf", q: "Anna makes the bread.", a: ["False"], line: 18 },
          { type: "choose", q: "When does the café close?", opts: ["at five o'clock","at six o'clock","at eight o'clock"], a: ["at six o'clock"], line: 1 },
          { type: "choose", q: "How much is a cheese sandwich?", opts: ["£3","£4","£6"], a: ["£3"], line: 5 },
          { type: "choose", q: "What comes with the chicken soup?", opts: ["bread","toast","fruit"], a: ["bread"], line: 6 },
          { type: "choose", q: "What is £6?", opts: ["a small pizza","a big pizza","a cheese sandwich"], a: ["a small pizza"], line: 8 },
          { type: "choose", q: "What cake can you have?", opts: ["chocolate cake","lemon cake","apple cake"], a: ["chocolate cake"], line: 11 },
          { type: "choose", q: "Where is the café?", opts: ["near the station","near the park","near the school"], a: ["near the station"], line: 13 },
          { type: "choose", q: "What can you eat on Fridays?", opts: ["pizza","fish and chips","chicken soup"], a: ["fish and chips"], line: 23 }
        ],
        words: [
          { w: 'menu', emoji: '📋', m: 'a list of the food and drinks in a café', ex: 'Here is our menu.' },
          { w: 'breakfast', emoji: '🍳', m: 'the food you eat in the morning', ex: 'For breakfast, we have eggs and toast.' },
          { w: 'eggs', emoji: '🥚', m: 'food from a chicken; you can cook them', ex: 'We have eggs and toast for £3.50.' },
          { w: 'toast', emoji: '🍞', m: 'hot bread, brown on the outside', ex: 'We have eggs and toast for £3.50.' },
          { w: 'pancakes', emoji: '🥞', m: 'thin, round, sweet food from a pan', ex: 'Pancakes with fruit are £4.' },
          { w: 'cheese', emoji: '🧀', m: 'a yellow or white food made from milk', ex: 'A cheese sandwich is £3.' },
          { w: 'soup', emoji: '🍲', m: 'hot food you eat with a spoon', ex: 'Chicken soup with bread is £4.50.' },
          { w: 'coffee', emoji: '☕', m: 'a hot brown drink', ex: 'Tea and coffee are £1.50.' },
          { w: 'glass', emoji: '🥛', m: 'you drink water or milk from it', ex: 'A glass of milk is £1.' },
          { w: 'chocolate', emoji: '🍫', m: 'a sweet brown food', ex: 'Try our chocolate cake!' }
        ]
      },
      writing: {
        topic: 'My food',
        task: "Write about the food you like and the food you don't like.",
        points: ['what you have for breakfast', 'your favourite food and drink', "a food you don't like"],
        minWords: 100, maxWords: 120, minutes: 20
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
        title: 'Have you seen Bella?',
        text: "Have you seen our dog? Her name is Bella. She is a small dog, and she is three years old. She is white with a black ear. She has a red collar with her name on it. Bella is very friendly. She loves children, and she likes to play with a ball. She doesn't like cats! We lost her on Sunday afternoon in Green Park. She is very small, so please look under cars and in gardens. Bella eats a lot, and her favourite food is chicken. If you find her, please bring her to 12 Hill Road. Thank you!\n\n" +
          "Bella is a very good dog. She sleeps in a small bed in our kitchen. In the morning, she walks with my dad in the park. She can sit and give you her paw. Bella can't swim, so please look near the lake too. She is shy with men, but she likes women and children. Please don't run after her. Call her name, \"Bella!\", and show her some food. She will come to you. Our children are very sad. They want Bella to come home. You can call us at any time. My name is Kate, and our phone number is 07700 900 461. There is a small present for the person who finds her.",
        questions: [
          { type: "tf", q: "Bella is a big dog.", a: ["False"], line: 2 },
          { type: "tf", q: "Bella is three years old.", a: ["True"], line: 2 },
          { type: "tf", q: "She has a red collar.", a: ["True"], line: 4 },
          { type: "tf", q: "Bella likes cats.", a: ["False"], line: 7 },
          { type: "tf", q: "They lost Bella on Saturday.", a: ["False"], line: 8 },
          { type: "tf", q: "Bella sleeps in the kitchen.", a: ["True"], line: 14 },
          { type: "tf", q: "Bella can swim.", a: ["False"], line: 17 },
          { type: "choose", q: "What colour is Bella?", opts: ["black with a white ear","white with a black ear","brown and white"], a: ["white with a black ear"], line: 3 },
          { type: "choose", q: "What does Bella like to play with?", opts: ["a ball","a stick","a cat"], a: ["a ball"], line: 6 },
          { type: "choose", q: "Where did they lose her?", opts: ["in Green Park","in the garden","at school"], a: ["in Green Park"], line: 8 },
          { type: "choose", q: "What is Bella's favourite food?", opts: ["fish","chicken","cheese"], a: ["chicken"], line: 10 },
          { type: "choose", q: "Where do they live?", opts: ["12 Hill Road","21 Hill Road","12 Park Road"], a: ["12 Hill Road"], line: 11 },
          { type: "choose", q: "What is the owner's name?", opts: ["Bella","Anna","Kate"], a: ["Kate"], line: 25 },
          { type: "choose", q: "What should you do if you see Bella?", opts: ["call her name and show her some food","run after her","take her to the lake"], a: ["call her name and show her some food"], line: 20 }
        ],
        words: [
          { w: 'seen', emoji: '👀', m: 'from "see": Have you seen …? = Did you see …?', ex: 'Have you seen our dog?' },
          { w: 'ear', emoji: '👂', m: 'you hear with it', ex: 'She is white with a black ear.' },
          { w: 'collar', emoji: '🏷️', m: "a band round a dog's neck", ex: 'She has a red collar.' },
          { w: 'friendly', emoji: '😊', m: 'nice and kind to people', ex: 'Bella is very friendly.' },
          { w: 'children', emoji: '🧒', m: 'more than one child', ex: 'She loves children.' },
          { w: 'ball', emoji: '🎾', m: 'a round thing for games', ex: 'She likes to play with a ball.' },
          { w: 'lost', emoji: '😢', m: "from \"lose\": we can't find her", ex: 'We lost her on Sunday afternoon.' },
          { w: 'park', emoji: '🌳', m: 'a big green place with trees in a town', ex: 'We lost her in Green Park.' },
          { w: 'garden', emoji: '🌷', m: 'the place with grass and flowers next to a house', ex: 'Please look in gardens.' },
          { w: 'bring', emoji: '🤲', m: 'to come with something or someone', ex: 'Please bring her to 12 Hill Road.' }
        ]
      },
      writing: {
        topic: 'My pet',
        task: 'Write about your pet, or a pet you would like to have.',
        points: ['what animal it is and its name', 'how old it is and what colour it is', 'what it likes to eat or do'],
        minWords: 110, maxWords: 130, minutes: 20
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
        title: 'Welcome to my room',
        text: "Hi, I'm Jack, and this is my room. It is not very big, but I love it. The walls are light blue. My bed is next to the window. There is a small table next to my bed with a lamp and a clock on it. My desk is in the corner, and my computer is on it. I do my homework there every evening. There are a lot of books on the shelf above the desk. My clothes are in a big brown cupboard. There is a green rug on the floor. My cat, Tiger, often sleeps on it. On the wall, there is a poster of my favourite football team.\n\n" +
          "I like my room in the morning, because the sun comes in through the window. My curtains are white with small blue stars. Next to my cupboard, there is a big box of old toys. I don't play with them now, but I love them. My guitar is next to the desk. I play it every afternoon after school. My friends come to my room at the weekend, and we play computer games together. My mum says my room is often messy. It's true! On Saturday mornings, I clean my room. I put my books on the shelf and my clothes in the cupboard. Then my room looks great again.",
        questions: [
          { type: "tf", q: "Jack's room is very big.", a: ["False"], line: 1 },
          { type: "tf", q: "The walls are light blue.", a: ["True"], line: 2 },
          { type: "tf", q: "The bed is next to the door.", a: ["False"], line: 3 },
          { type: "tf", q: "There is a clock on the small table.", a: ["True"], line: 4 },
          { type: "tf", q: "Jack's clothes are in a white cupboard.", a: ["False"], line: 8 },
          { type: "tf", q: "Jack's curtains are white with small blue stars.", a: ["True"], line: 13 },
          { type: "tf", q: "Jack cleans his room on Sunday evenings.", a: ["False"], line: 21 },
          { type: "choose", q: "Where is the desk?", opts: ["in the corner","next to the bed","under the window"], a: ["in the corner"], line: 5 },
          { type: "choose", q: "When does Jack do his homework?", opts: ["in the morning","in the afternoon","in the evening"], a: ["in the evening"], line: 6 },
          { type: "choose", q: "Where are the books?", opts: ["on the floor","on the shelf","in the cupboard"], a: ["on the shelf"], line: 7 },
          { type: "choose", q: "Who sleeps on the rug?", opts: ["Jack","his dog","his cat"], a: ["his cat"], line: 10 },
          { type: "choose", q: "What is the poster of?", opts: ["a football team","a singer","a film"], a: ["a football team"], line: 11 },
          { type: "choose", q: "Where is Jack's guitar?", opts: ["under the bed","next to the desk","in the cupboard"], a: ["next to the desk"], line: 16 },
          { type: "choose", q: "What is next to the cupboard?", opts: ["a lamp","a big plant","a box of old toys"], a: ["a box of old toys"], line: 14 }
        ],
        words: [
          { w: 'wall', emoji: '🧱', m: 'the side of a room', ex: 'The walls are light blue.' },
          { w: 'light blue', emoji: '🩵', m: 'a pale blue colour, like the sky', ex: 'The walls are light blue.' },
          { w: 'clock', emoji: '⏰', m: 'it shows the time', ex: 'There is a lamp and a clock on the table.' },
          { w: 'corner', emoji: '📐', m: 'where two walls meet', ex: 'My desk is in the corner.' },
          { w: 'computer', emoji: '💻', m: 'you use it to write, play and go online', ex: 'My computer is on the desk.' },
          { w: 'homework', emoji: '📝', m: 'school work you do at home', ex: 'I do my homework there every evening.' },
          { w: 'shelf', emoji: '📚', m: 'a long flat board on the wall for books', ex: 'There are books on the shelf.' },
          { w: 'rug', emoji: '🟩', m: 'a small carpet on the floor', ex: 'There is a green rug on the floor.' },
          { w: 'floor', emoji: '⬇️', m: 'you walk on it in a room', ex: 'There is a rug on the floor.' },
          { w: 'poster', emoji: '🖼️', m: 'a big picture on the wall', ex: 'There is a poster of my favourite team.' }
        ]
      },
      writing: {
        topic: 'My room',
        task: 'Write about your room.',
        points: ['what is in your room: a bed, a desk, a cupboard…', 'where things are — for example: My lamp is on the desk.', 'what you like about your room'],
        minWords: 115, maxWords: 135, minutes: 20
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
        title: 'Meet my friend Sophie',
        text: "This is my best friend, Sophie. She is twelve years old, and she is in my class at school. She has long brown hair and big blue eyes. Sophie lives in a flat near the park with her mum, her dad and her little brother, Alfie. Alfie is five, and he is very funny. Sophie loves animals. She has two rabbits and a small grey cat. Her favourite subject at school is Science, but she doesn't like Maths. After school, we often go to the park together. We play tennis on Wednesdays, and on Saturdays we go swimming. Sophie's favourite food is pizza, and she drinks a lot of orange juice. Her birthday is in June. She is very kind.\n\n" +
          "Sophie and I are friends from when we were six years old. We sit together in every lesson. Sophie is very good at drawing, and she wants to be an artist. She draws animals and flowers in her notebook. Sophie's dad is a teacher at another school, and her mum works in a bank. Every summer, Sophie goes to the sea with her family. She sends me postcards from there. Sophie has a bike, and it is purple. We ride our bikes in the park on Sunday mornings. Sometimes Sophie comes to my house for dinner. My mum makes pizza for her, because it is her favourite food. Sophie is a great friend.",
        questions: [
          { type: "tf", q: "Sophie is eleven years old.", a: ["False"], line: 1 },
          { type: "tf", q: "Sophie has long brown hair.", a: ["True"], line: 2 },
          { type: "tf", q: "Alfie is Sophie's brother.", a: ["True"], line: 3 },
          { type: "tf", q: "Sophie likes Maths.", a: ["False"], line: 7 },
          { type: "tf", q: "Sophie's birthday is in July.", a: ["False"], line: 11 },
          { type: "tf", q: "Sophie wants to be an artist.", a: ["True"], line: 15 },
          { type: "tf", q: "Sophie's bike is pink.", a: ["False"], line: 20 },
          { type: "choose", q: "Where does Sophie live?", opts: ["in a house in the town","in a flat near the park","in a flat near the school"], a: ["in a flat near the park"], line: 3 },
          { type: "choose", q: "What pets has Sophie got?", opts: ["two cats and a rabbit","two rabbits and a cat","two dogs"], a: ["two rabbits and a cat"], line: 6 },
          { type: "choose", q: "What do they do on Saturdays?", opts: ["play tennis","go swimming","go to the park"], a: ["go swimming"], line: 9 },
          { type: "choose", q: "What does Sophie drink a lot of?", opts: ["milk","orange juice","water"], a: ["orange juice"], line: 10 },
          { type: "choose", q: "What is Sophie like?", opts: ["kind","funny","quiet"], a: ["kind"], line: 12 },
          { type: "choose", q: "Where does Sophie's mum work?", opts: ["in a bank","in a school","in a shop"], a: ["in a bank"], line: 17 },
          { type: "choose", q: "When do they ride their bikes in the park?", opts: ["on Saturday afternoons","on Sunday mornings","every evening"], a: ["on Sunday mornings"], line: 21 }
        ],
        words: [
          { w: 'best friend', emoji: '🤝', m: 'your number one friend', ex: 'This is my best friend, Sophie.' },
          { w: 'hair', emoji: '💇', m: 'it grows on your head', ex: 'She has long brown hair.' },
          { w: 'flat', emoji: '🏢', m: 'a home on one floor of a big building', ex: 'Sophie lives in a flat near the park.' },
          { w: 'little brother', emoji: '👦', m: 'a brother who is younger than you', ex: 'She has a little brother, Alfie.' },
          { w: 'funny', emoji: '😂', m: 'he or she makes you laugh', ex: 'Alfie is very funny.' },
          { w: 'rabbit', emoji: '🐰', m: 'a small animal with long ears', ex: 'She has two rabbits.' },
          { w: 'subject', emoji: '📚', m: 'a lesson at school, like Maths or Art', ex: 'Her favourite subject is Science.' },
          { w: 'together', emoji: '👫', m: 'with each other', ex: 'We often go to the park together.' },
          { w: 'birthday', emoji: '🎂', m: 'the day you were born, every year', ex: 'Her birthday is in June.' },
          { w: 'kind', emoji: '💛', m: 'nice and good to other people', ex: 'She is kind.' }
        ]
      },
      writing: {
        topic: 'My best friend',
        task: 'Write about your best friend.',
        points: ['his or her name and age, and what he or she looks like', 'what he or she likes', 'what you do together'],
        minWords: 125, maxWords: 145, minutes: 20
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
        title: "A pen-friend's profile",
        text: "Hi, my name is Lucy Green and I'm fifteen years old. I live in Bristol, a big city in the west of England. I live in a small flat with my mum, my dad and my little brother, Sam. Sam is eight and he loves football.\n\n" +
          "I go to Hillside School, and my favourite subject is art. I don't really like maths, because it's difficult for me. After school, I usually walk my dog, Biscuit, in the park near our flat. He's brown and white, and he's very friendly.\n\n" +
          "At the weekend, I play the guitar and I sometimes go swimming with my friends. I'm learning Spanish too, and I want to visit Spain one day. My favourite food is pizza, but I can't cook it!\n\n" +
          "I'm looking for a pen-friend from another country. I'd like to write emails in English every week and learn about your life. Please write to me soon!\n\n" +
          "Here is a little more about me. My mum is a dentist, and my dad works in a big supermarket near our flat. They are very busy, but on Sunday evenings we always have dinner together and talk about our week. My grandparents live in Wales, and we visit them in the summer holidays. Their house is near the mountains, and I love walking there.\n\n" +
          "I'm quite a quiet person, but I'm friendly when you know me. I love reading, especially stories about animals and adventures. I love pop music, and I can play some easy songs on my guitar. I also like taking photos of nature with my phone.\n\n" +
          "My school day starts at half past eight and finishes at half past three. I take the bus to school because it's too far to walk. My best friend at school is called Mia. She's very funny, and we sit together in most lessons.\n\n" +
          "In your first email, please tell me about your family, your school and your hobbies. What is your town like? What do people eat there? I can send you photos of Bristol and of Biscuit too!",
        questions: [
          { type: "tfng", q: "Lucy lives in a big city.", a: ["True"], line: 1 },
          { type: "tfng", q: "Lucy lives with her grandparents.", a: ["False"], line: 2 },
          { type: "tfng", q: "Sam plays in a football team.", a: ["Not given"], line: 3 },
          { type: "tfng", q: "Lucy likes maths.", a: ["False"], line: 5 },
          { type: "tfng", q: "Lucy's dog is friendly.", a: ["True"], line: 7 },
          { type: "tfng", q: "Lucy's mum is a dentist.", a: ["True"], line: 15 },
          { type: "tfng", q: "Lucy walks to school.", a: ["False"], line: 24 },
          { type: "gap", q: "Lucy lives in a small _____ with her family.", a: ["flat"], line: 2 },
          { type: "gap", q: "Lucy's favourite subject at school is _____.", a: ["art"], line: 4 },
          { type: "gap", q: "After school, Lucy walks her dog in the _____.", a: ["park"], line: 6 },
          { type: "gap", q: "Lucy wants a pen-friend from another _____.", a: ["country"], line: 11 },
          { type: "gap", q: "Lucy would like to write _____ in English every week.", a: ["emails","email"], line: 12 },
          { type: "gap", q: "Lucy's grandparents live in _____.", a: ["Wales"], line: 17 },
          { type: "choose", q: "How old is Lucy?", opts: ["thirteen","fifteen","eighteen"], a: ["fifteen"], line: 0 },
          { type: "choose", q: "Who is Biscuit?", opts: ["Lucy's brother","Lucy's dog","Lucy's friend"], a: ["Lucy's dog"], line: 6 },
          { type: "choose", q: "What does Lucy do at the weekend?", opts: ["She plays the guitar.","She plays football.","She cooks pizza."], a: ["She plays the guitar."], line: 8 },
          { type: "choose", q: "Which language is Lucy learning?", opts: ["French","Spanish","German"], a: ["Spanish"], line: 9 },
          { type: "choose", q: "What is Lucy's favourite food?", opts: ["pasta","fish and chips","pizza"], a: ["pizza"], line: 10 },
          { type: "choose", q: "When does Lucy's family always have dinner together?", opts: ["on Friday evenings","every evening","on Sunday evenings"], a: ["on Sunday evenings"], line: 16 },
          { type: "choose", q: "What does Lucy like taking photos of?", opts: ["nature","her friends","food"], a: ["nature"], line: 22 }
        ],
        words: [
          { w: 'pen-friend', emoji: '✉️', m: 'a friend in another place who you write to', ex: "I'm looking for a pen-friend from another country." },
          { w: 'profile', emoji: '📄', m: 'a short text about a person', ex: "Read Lucy's profile and answer the questions." },
          { w: 'flat', emoji: '🏠', m: 'a home on one floor of a bigger building', ex: 'I live in a small flat with my family.' },
          { w: 'subject', emoji: '📚', m: 'something you study at school, like maths or art', ex: 'My favourite subject is art.' },
          { w: 'favourite', emoji: '❤️', m: 'the one you like best', ex: 'My favourite food is pizza.' },
          { w: 'difficult', emoji: '🧩', m: 'not easy', ex: "I don't really like maths, because it's difficult for me." },
          { w: 'usually', emoji: '🔁', m: 'on most days; most of the time', ex: 'After school, I usually walk my dog.' },
          { w: 'friendly', emoji: '😊', m: 'kind and nice to people', ex: "He's brown and white, and he's very friendly." },
          { w: 'sometimes', emoji: '🔀', m: 'not always, but on some days', ex: 'I sometimes go swimming with my friends.' },
          { w: 'country', emoji: '🌍', m: 'a nation, like England or Spain', ex: 'I want a pen-friend from another country.' }
        ]
      },
      writing: {
        topic: 'An email to a new classmate',
        task: 'A new student has joined your class. Write an email to welcome him or her.',
        points: ['who you are and what you like about your class', 'your teacher and the other students', 'something you can do together after school'],
        minWords: 130, maxWords: 150, minutes: 25
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
        title: "Emma's family",
        text: "My name is Emma Baker and I'm sixteen. There are five people in my family: my mum, my dad, my two brothers and me. We also have a cat called Pepper.\n\n" +
          "My mum, Sarah, is a teacher at a primary school. She's kind and very patient. My dad, Mark, works in a bank in the city centre. He gets up very early, but he always makes breakfast for us.\n\n" +
          "My older brother, Daniel, is twenty and he studies music at university in Leeds. He only comes home in the holidays, so I miss him. My younger brother, Ben, is ten. He's funny, but he's sometimes very noisy!\n\n" +
          "My grandparents live in a village near the sea. We visit them every month, and my grandma always makes a big chocolate cake. My best friend is Chloe, and she lives in the next street. We go to the same school and we sit next to each other in every lesson. On Fridays, we watch films together at her house and eat lots of popcorn.\n\n" +
          "Our house is in a quiet street in Nottingham. It isn't very big, but it's warm and comfortable. My bedroom is at the top of the house, and I can see the park from my window. Ben and I often argue about the bathroom in the morning, because we both want it at the same time!\n\n" +
          "Every Sunday, the whole family has lunch together. My dad usually cooks roast chicken with potatoes and vegetables, and my mum makes the dessert. After lunch, we often go for a walk in the park with Pepper. Well, Pepper doesn't walk with us — she's a cat, so she sleeps on the sofa!\n\n" +
          "In the summer, we go on holiday together. Last year we went to Scotland, and we stayed in a small cottage near a lake. Daniel came with us, and we were very happy because the whole family was together again.\n\n" +
          "I love my family, but sometimes I want some quiet time. Then I go to my room, close the door and read a good book. My parents say that next year I can have my own laptop for school, and I'm very excited about that.",
        questions: [
          { type: "tfng", q: "Emma has got two brothers.", a: ["True"], line: 1 },
          { type: "tfng", q: "Emma's mum works in a bank.", a: ["False"], line: 3 },
          { type: "tfng", q: "Daniel plays the piano.", a: ["Not given"], line: 7 },
          { type: "tfng", q: "Emma's grandparents live in a big city.", a: ["False"], line: 11 },
          { type: "tfng", q: "Emma and Chloe go to the same school.", a: ["True"], line: 14 },
          { type: "tfng", q: "Emma's house is very big.", a: ["False"], line: 17 },
          { type: "tfng", q: "Emma can see the park from her bedroom window.", a: ["True"], line: 18 },
          { type: "gap", q: "Emma's family has got a cat called _____.", a: ["Pepper"], line: 2 },
          { type: "gap", q: "Emma's dad works in a _____ in the city centre.", a: ["bank"], line: 5 },
          { type: "gap", q: "Daniel studies music at _____ in Leeds.", a: ["university"], line: 7 },
          { type: "gap", q: "Ben is _____ years old.", a: ["ten","10"], line: 9 },
          { type: "gap", q: "Emma's grandma always makes a big chocolate _____.", a: ["cake"], line: 12 },
          { type: "gap", q: "Last year, the family stayed in a small cottage near a _____.", a: ["lake"], line: 25 },
          { type: "choose", q: "How old is Emma?", opts: ["fifteen","sixteen","seventeen"], a: ["sixteen"], line: 0 },
          { type: "choose", q: "What is Emma's mum like?", opts: ["kind and patient","funny and noisy","quiet and shy"], a: ["kind and patient"], line: 4 },
          { type: "choose", q: "What does Emma's dad do every morning?", opts: ["He makes breakfast.","He goes swimming.","He walks the cat."], a: ["He makes breakfast."], line: 6 },
          { type: "choose", q: "How often does Emma visit her grandparents?", opts: ["every week","every month","every year"], a: ["every month"], line: 12 },
          { type: "choose", q: "What do Emma and Chloe do on Fridays?", opts: ["They watch films.","They play tennis.","They cook dinner."], a: ["They watch films."], line: 15 },
          { type: "choose", q: "Who makes the dessert on Sundays?", opts: ["Emma's dad","Emma's mum","Emma's grandma"], a: ["Emma's mum"], line: 21 },
          { type: "choose", q: "What can Emma have next year?", opts: ["a new phone","a dog","her own laptop"], a: ["her own laptop"], line: 29 }
        ],
        words: [
          { w: 'primary school', emoji: '🏫', m: 'a school for children from about five to eleven years old', ex: 'My mum is a teacher at a primary school.' },
          { w: 'patient', emoji: '🧘', m: 'calm; not angry when you have to wait or help someone', ex: "She's kind and very patient." },
          { w: 'city centre', emoji: '🏙️', m: 'the main part of a city, with shops and offices', ex: 'My dad works in a bank in the city centre.' },
          { w: 'early', emoji: '🌅', m: 'before the usual time; at the start of the day', ex: 'He gets up very early.' },
          { w: 'older', emoji: '👴', m: 'born before someone else', ex: 'My older brother, Daniel, is twenty.' },
          { w: 'university', emoji: '🎓', m: 'a place where people study after school', ex: 'He studies music at university in Leeds.' },
          { w: 'miss', emoji: '😢', m: 'to feel sad because someone is not with you', ex: 'He only comes home in the holidays, so I miss him.' },
          { w: 'noisy', emoji: '🔊', m: 'making a lot of sound', ex: "He's funny, but he's sometimes very noisy!" },
          { w: 'village', emoji: '🏡', m: 'a very small town in the countryside', ex: 'My grandparents live in a village near the sea.' },
          { w: 'next to', emoji: '👉', m: 'very near; at the side of', ex: 'We sit next to each other in every lesson.' }
        ]
      },
      writing: {
        topic: 'My family',
        task: 'Write an email to a pen-friend about your family.',
        points: ['who is in your family', 'what each person is like and what they do', 'what you do together at the weekend'],
        minWords: 140, maxWords: 160, minutes: 25
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
        title: 'Two homes',
        text: "Tom Parker lives with his parents in a house in the countryside, near York. The house is old and it has got three bedrooms, a big kitchen and a living room with a fireplace. Tom's favourite room is the kitchen, because the family eats and talks there every evening. Behind the house, there is a large garden with apple trees. The nearest shop is three kilometres away, so Tom's mum drives to the supermarket once a week. Tom loves the quiet, but there isn't a bus to his school, so he cycles there every day.\n\n" +
          "Grace Turner lives in a flat on the ninth floor of a tall building in Manchester. The flat is small and modern, with one bedroom, a bathroom and an open kitchen. There isn't a garden, but there is a balcony with lots of plants. From the balcony, Grace can see the whole city at night. Her flat is very close to shops, cafés and a cinema. The only problem is the noise from the street, so she sometimes sleeps with earplugs. Grace says she never wants to live in the countryside, because she loves the busy city life.\n\n" +
          "Tom and Grace are cousins, and they visit each other a few times a year. When Grace comes to the countryside, she always finds it very quiet at first. In the evening, she can hear only the wind and the birds. Tom takes her on long bike rides along small roads between the fields, and they often stop at a farm to buy fresh eggs. Grace enjoys the fresh air, but after three or four days she always misses her flat.\n\n" +
          "When Tom visits Grace, he is always surprised by how many people there are in Manchester. They go to the cinema, eat in different cafés and visit museums. Tom likes the city, especially the football stadium, but he finds it tiring. He says the traffic is very slow, and he doesn't like the crowds on the trams.\n\n" +
          "Both homes have good and bad points. In the countryside, life is calm and there is a lot of space, but you need a car or a bike for everything. In the city, everything is close and there is always something to do, but it can be noisy and expensive. Tom and Grace often talk about this, and they never agree!",
        questions: [
          { type: "tfng", q: "Tom's house is new.", a: ["False"], line: 1 },
          { type: "tfng", q: "Tom's family eats in the kitchen.", a: ["True"], line: 2 },
          { type: "tfng", q: "Tom's school is in York.", a: ["Not given"], line: 5 },
          { type: "tfng", q: "Grace's flat has got a garden.", a: ["False"], line: 8 },
          { type: "tfng", q: "Grace's flat is near a cinema.", a: ["True"], line: 10 },
          { type: "tfng", q: "Tom and Grace are brother and sister.", a: ["False"], line: 13 },
          { type: "tfng", q: "After a few days in the countryside, Grace misses her flat.", a: ["True"], line: 17 },
          { type: "gap", q: "Tom's house has got three _____.", a: ["bedrooms"], line: 1 },
          { type: "gap", q: "There are apple trees in the _____ behind the house.", a: ["garden"], line: 3 },
          { type: "gap", q: "Tom cycles to school because there isn't a _____.", a: ["bus"], line: 5 },
          { type: "gap", q: "Grace has got lots of _____ on her balcony.", a: ["plants"], line: 8 },
          { type: "gap", q: "Because of the noise, Grace sometimes sleeps with _____.", a: ["earplugs"], line: 11 },
          { type: "gap", q: "Tom and Grace often stop at a farm to buy fresh _____.", a: ["eggs"], line: 16 },
          { type: "choose", q: "Where does Tom live?", opts: ["in a city","in the countryside","by the sea"], a: ["in the countryside"], line: 0 },
          { type: "choose", q: "How often does Tom's mum go to the supermarket?", opts: ["every day","once a week","once a month"], a: ["once a week"], line: 4 },
          { type: "choose", q: "Which floor is Grace's flat on?", opts: ["the third floor","the fifth floor","the ninth floor"], a: ["the ninth floor"], line: 6 },
          { type: "choose", q: "What can Grace see from her balcony at night?", opts: ["the sea","the whole city","the mountains"], a: ["the whole city"], line: 9 },
          { type: "choose", q: "What does Grace think about the countryside?", opts: ["She never wants to live there.","She wants to live there one day.","She goes there every weekend."], a: ["She never wants to live there."], line: 12 },
          { type: "choose", q: "What does Tom like most in Manchester?", opts: ["the football stadium","the trams","the museums"], a: ["the football stadium"], line: 20 },
          { type: "choose", q: "What does Tom say about the traffic in the city?", opts: ["It is very fast.","It is very slow.","There isn't any."], a: ["It is very slow."], line: 21 }
        ],
        words: [
          { w: 'countryside', emoji: '🌳', m: 'land with fields and farms, away from towns', ex: 'Tom lives in a house in the countryside.' },
          { w: 'fireplace', emoji: '🔥', m: 'a place in a wall where you can have a fire', ex: 'The living room has a fireplace.' },
          { w: 'large', emoji: '🐘', m: 'big', ex: 'There is a large garden with apple trees.' },
          { w: 'nearest', emoji: '📍', m: 'the one that is closest to you', ex: 'The nearest shop is three kilometres away.' },
          { w: 'once a week', emoji: '📆', m: 'one time every week', ex: "Tom's mum drives to the supermarket once a week." },
          { w: 'cycle', emoji: '🚲', m: 'to ride a bike', ex: 'He cycles to school every day.' },
          { w: 'modern', emoji: '✨', m: 'new and in today\'s style', ex: 'The flat is small and modern.' },
          { w: 'balcony', emoji: '🌇', m: 'a small place outside a flat, above the street, where you can stand or sit', ex: 'There is a balcony with lots of plants.' },
          { w: 'close to', emoji: '🤏', m: 'near', ex: 'Her flat is very close to shops.' },
          { w: 'noise', emoji: '📢', m: 'a loud sound that you don\'t like', ex: 'The only problem is the noise from the street.' }
        ]
      },
      writing: {
        topic: 'My home',
        task: 'Write an email to a friend about your home.',
        points: ['where your home is and what kind of home it is', 'the rooms in your home', 'your favourite room and why you like it'],
        minWords: 150, maxWords: 170, minutes: 25
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
        title: "A nurse's day",
        text: "Hannah Clarke is a nurse at a children's hospital in Liverpool. She works long days, from half past seven in the morning until eight o'clock in the evening. She works four days a week, so she has three days off.\n\n" +
          "On work days, Hannah gets up at six o'clock, when it is still dark in winter. She has a quick shower and a cup of tea, but she never eats breakfast at home. She takes the bus to the hospital, and the journey takes about forty minutes. She often reads a book on the bus, or she listens to music.\n\n" +
          "At the hospital, Hannah checks the children and gives them their medicine. She also talks to the parents, because they are often worried. At lunchtime, she eats a sandwich with the other nurses in a small kitchen. The afternoons are usually the busiest part of the day, with lots of new patients.\n\n" +
          "When she gets home, Hannah is very tired. She has dinner with her husband, Chris, and then she goes to bed at about ten o'clock. On her days off, she sleeps late, goes to a yoga class and visits her sister. Hannah says her job is hard, but she loves it, because she helps children every day.\n\n" +
          "Hannah started working at the hospital eight years ago. Before that, she studied nursing at university for three years. She remembers her first week very well, because she was very nervous. An older nurse, Margaret, helped her a lot and taught her many important things. Today, Hannah helps the new nurses in the same way.\n\n" +
          "The most difficult part of the job is when a child is very ill. Hannah tries to stay calm and smile, because the children need to feel safe. She often brings small toys and colouring books for them. Some children stay in the hospital for many weeks, so the nurses try to make the rooms bright and happy, with pictures on the walls.\n\n" +
          "Hannah's favourite moment is when a child is well again and goes home. The families sometimes send her cards and letters to say thank you. She keeps them all in a big box at home, and she reads them when she has a bad day.\n\n" +
          "Next year, Hannah wants to do a special course to become a senior nurse. It will be a lot of work, but she is excited. She says that every day at the hospital is different, and she is never bored.",
        questions: [
          { type: "tfng", q: "Hannah works at a hospital for children.", a: ["True"], line: 0 },
          { type: "tfng", q: "Hannah works five days a week.", a: ["False"], line: 2 },
          { type: "tfng", q: "Hannah drives to the hospital.", a: ["False"], line: 5 },
          { type: "tfng", q: "Hannah is tired when she gets home.", a: ["True"], line: 11 },
          { type: "tfng", q: "Hannah's husband is a doctor.", a: ["Not given"], line: 12 },
          { type: "tfng", q: "Hannah has worked at the hospital for eight years.", a: ["True"], line: 15 },
          { type: "tfng", q: "Hannah felt calm in her first week.", a: ["False"], line: 17 },
          { type: "gap", q: "On work days, Hannah gets up at _____ o'clock.", a: ["six","6"], line: 3 },
          { type: "gap", q: "Hannah never eats _____ at home.", a: ["breakfast"], line: 4 },
          { type: "gap", q: "Hannah often reads a _____ on the bus.", a: ["book"], line: 6 },
          { type: "gap", q: "At lunchtime, Hannah eats a _____ with the other nurses.", a: ["sandwich"], line: 9 },
          { type: "gap", q: "On her days off, Hannah goes to a _____ class.", a: ["yoga"], line: 13 },
          { type: "gap", q: "Hannah keeps the families' cards and letters in a big _____ at home.", a: ["box"], line: 26 },
          { type: "choose", q: "When does Hannah finish work?", opts: ["at six o'clock in the evening","at eight o'clock in the evening","at ten o'clock in the evening"], a: ["at eight o'clock in the evening"], line: 1 },
          { type: "choose", q: "How long is Hannah's journey to the hospital?", opts: ["about twenty minutes","about forty minutes","about an hour"], a: ["about forty minutes"], line: 5 },
          { type: "choose", q: "Why does Hannah talk to the parents?", opts: ["They are often worried.","They want to be nurses.","They bring her lunch."], a: ["They are often worried."], line: 8 },
          { type: "choose", q: "When is Hannah busiest at work?", opts: ["in the morning","at lunchtime","in the afternoon"], a: ["in the afternoon"], line: 10 },
          { type: "choose", q: "Why does Hannah love her job?", opts: ["She helps children every day.","She has long holidays.","The work is easy."], a: ["She helps children every day."], line: 14 },
          { type: "choose", q: "Who helped Hannah in her first week?", opts: ["a doctor","her husband","an older nurse"], a: ["an older nurse"], line: 18 },
          { type: "choose", q: "What does Hannah want to do next year?", opts: ["do a special course","work in another hospital","stop working"], a: ["do a special course"], line: 27 }
        ],
        words: [
          { w: 'nurse', emoji: '👩‍⚕️', m: 'a person whose job is to look after people who are ill', ex: "Hannah is a nurse at a children's hospital." },
          { w: 'days off', emoji: '🌴', m: 'days when you don\'t go to work', ex: 'She has three days off every week.' },
          { w: 'quick', emoji: '⚡', m: 'fast; not taking a long time', ex: 'She has a quick shower.' },
          { w: 'journey', emoji: '🛣️', m: 'the time you spend going from one place to another', ex: 'The journey takes about forty minutes.' },
          { w: 'check', emoji: '🔍', m: 'to look at something or someone to see if everything is OK', ex: 'Hannah checks the children every morning.' },
          { w: 'worried', emoji: '😟', m: 'unhappy because you think something bad can happen', ex: 'The parents are often worried.' },
          { w: 'lunchtime', emoji: '🥪', m: 'the time in the middle of the day when people eat', ex: 'At lunchtime, she eats a sandwich.' },
          { w: 'busiest', emoji: '🐝', m: 'with the most things to do', ex: 'The afternoons are the busiest part of the day.' },
          { w: 'patient', emoji: '🤒', m: 'a person who is ill and sees a doctor or a nurse', ex: 'There are lots of new patients in the afternoon.' },
          { w: 'sleep late', emoji: '😴', m: 'to get up later than usual in the morning', ex: 'On her days off, she sleeps late.' }
        ]
      },
      writing: {
        topic: 'My weekday',
        task: 'Write a short text about a normal weekday in your life.',
        points: ['what time you get up and what you do in the morning', 'what you do in the afternoon', 'what you do in the evening and when you go to bed'],
        minWords: 155, maxWords: 175, minutes: 25
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
        title: 'A café menu & review',
        text: "The Blue Door Café is a small family café on Market Street in Bath. It is open every day from eight in the morning until six in the evening.\n\n" +
          "Breakfast is served until eleven o'clock. The full English breakfast costs £7.50, and pancakes with fresh fruit cost £5. For lunch, there is soup of the day with bread for £4.50, a chicken salad for £6 and fish and chips for £8.95. Children under ten can have a small plate of any dish for half price. Tea is £2 and a large hot chocolate is £3.20.\n\n" +
          "Here is a review from a customer, Oliver Grant. My wife and I had lunch at the Blue Door Café last Saturday. It was very busy, so we waited fifteen minutes for a table. The waiter was friendly, and he brought us some bread while we waited. I had the fish and chips, and my wife had the soup. The fish was hot and fresh, but the chips were a bit cold. My wife loved her soup, and she asked the waiter for the recipe! The best thing was the dessert: a lemon cake made by the owner's grandmother. The prices are good, and the café is clean and bright. Next time, we want to come for breakfast and try the pancakes. I give the Blue Door Café four stars out of five.\n\n" +
          "The Blue Door Café belongs to the Hill family. Peter Hill opened it twenty years ago with his wife, Mary, and today their daughter, Lucy, helps them in the kitchen. The name comes from the old blue door at the front, which is more than a hundred years old. Inside, there are twelve wooden tables, old photos of Bath on the walls and lots of plants.\n\n" +
          "The café uses fresh food from local farms. The eggs come from a farm only five kilometres away, and the bread is made in the café every morning. In autumn and winter, there is a special menu with hot dishes like beef stew and apple pie. There are also dishes for people who don't eat meat, and the staff are happy to help if you have an allergy.\n\n" +
          "Here is a second review, from a student called Amy Ross. I come to the Blue Door Café on Monday mornings before my classes, because it is quiet and the Wi-Fi is free. I usually order a cup of tea and a piece of toast with jam. The staff remember my name, and they always ask about my studies. It's a perfect place to read or study for an hour. My only problem is that it closes at six, so I can't come in the evening. I give it five stars!\n\n" +
          "If you want to visit, it's a good idea to arrive before twelve o'clock, because the café is very busy at lunchtime, especially at the weekend.",
        questions: [
          { type: "tfng", q: "The café is open on Sundays.", a: ["True"], line: 1 },
          { type: "tfng", q: "You can order breakfast at twelve o'clock.", a: ["False"], line: 2 },
          { type: "tfng", q: "Children under ten pay less for a small plate.", a: ["True"], line: 5 },
          { type: "tfng", q: "Oliver and his wife sat at a table by the window.", a: ["Not given"], line: 9 },
          { type: "tfng", q: "Oliver's chips were hot.", a: ["False"], line: 12 },
          { type: "tfng", q: "Peter Hill opened the café twenty years ago.", a: ["True"], line: 19 },
          { type: "tfng", q: "The café buys its bread from a shop in Bath.", a: ["False"], line: 23 },
          { type: "gap", q: "The café is on _____ Street.", a: ["Market"], line: 0 },
          { type: "gap", q: "The pancakes come with fresh _____.", a: ["fruit"], line: 3 },
          { type: "gap", q: "Oliver and his wife waited _____ minutes for a table.", a: ["fifteen","15"], line: 9 },
          { type: "gap", q: "Oliver's wife asked for the _____ of the soup.", a: ["recipe"], line: 13 },
          { type: "gap", q: "The lemon cake was made by the owner's _____.", a: ["grandmother"], line: 14 },
          { type: "gap", q: "Inside the café, there are twelve wooden _____.", a: ["tables"], line: 21 },
          { type: "choose", q: "How much is the chicken salad?", opts: ["£4.50","£6","£8.95"], a: ["£6"], line: 4 },
          { type: "choose", q: "How much is a large hot chocolate?", opts: ["£2","£3.20","£5"], a: ["£3.20"], line: 6 },
          { type: "choose", q: "What did Oliver eat?", opts: ["the soup","fish and chips","pancakes"], a: ["fish and chips"], line: 11 },
          { type: "choose", q: "What was the best thing about the meal, for Oliver?", opts: ["the lemon cake","the bread","the hot chocolate"], a: ["the lemon cake"], line: 14 },
          { type: "choose", q: "How many stars does Oliver give the café?", opts: ["three","four","five"], a: ["four"], line: 17 },
          { type: "choose", q: "Why does Amy come to the café on Monday mornings?", opts: ["The food is cheaper then.","It is quiet and the Wi-Fi is free.","Her friends work there."], a: ["It is quiet and the Wi-Fi is free."], line: 27 },
          { type: "choose", q: "How many stars does Amy give the café?", opts: ["four","three","five"], a: ["five"], line: 32 }
        ],
        words: [
          { w: 'menu', emoji: '📜', m: 'a list of the food and drinks in a café or a restaurant', ex: 'Read the menu and choose your lunch.' },
          { w: 'served', emoji: '🍽️', m: 'given to customers in a café or a restaurant', ex: "Breakfast is served until eleven o'clock." },
          { w: 'fresh', emoji: '🥬', m: 'new and made or picked not long ago', ex: 'Pancakes come with fresh fruit.' },
          { w: 'dish', emoji: '🍲', m: 'one kind of food on a menu', ex: 'Children can have a small plate of any dish.' },
          { w: 'half price', emoji: '🏷️', m: 'for half of the usual money', ex: 'Children under ten can eat for half price.' },
          { w: 'review', emoji: '✍️', m: 'a text where someone says what they think about a place, a film or a book', ex: 'Here is a review from a customer.' },
          { w: 'waiter', emoji: '🤵', m: 'a person who brings food and drinks to the tables', ex: 'The waiter was friendly.' },
          { w: 'a bit', emoji: '🤏', m: 'a little', ex: 'The chips were a bit cold.' },
          { w: 'recipe', emoji: '📖', m: 'instructions that tell you how to cook something', ex: 'She asked the waiter for the recipe!' },
          { w: 'dessert', emoji: '🍰', m: 'sweet food you eat at the end of a meal', ex: 'The best thing was the dessert.' }
        ]
      },
      writing: {
        topic: 'My favourite meal',
        task: 'Write a short text about your favourite meal.',
        points: ['what the meal is and what is in it', 'who makes it and when you eat it', 'why you like it'],
        minWords: 165, maxWords: 185, minutes: 30
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
        title: 'Shopping in London',
        text: "London is one of the best cities in the world for shopping. Every year, millions of visitors come to the city to buy clothes, presents and souvenirs. You can find everything here, from cheap T-shirts to very expensive watches.\n\n" +
          "Oxford Street is the busiest shopping street in Europe. It has more than three hundred shops, from big department stores to small shoe shops. Most shops there are open from ten in the morning until nine in the evening. On Sundays, they open at twelve and close at six. If you want something special, visit Harrods, a famous department store in Knightsbridge. It is very big and very expensive, but many tourists go there just to look at its beautiful food hall.\n\n" +
          "For cheaper shopping, try one of London's street markets. Camden Market is popular with young people because it sells unusual clothes, old records and street food from many countries. Portobello Road Market in Notting Hill is famous for antiques, and it is busiest on Saturdays. Remember to bring some cash, because a few small stalls do not take cards.\n\n" +
          "Here are some tips for your shopping day. Go early in the morning, when the shops are still quiet. Wear comfortable shoes, because you will walk a lot. In January, many shops have big sales, and some clothes are half price. Finally, always keep your bag closed on busy streets, and never leave it on the floor. Have a great time, and happy shopping in London!\n\n" +
          "If you get tired of shopping, London has many other things to enjoy. Many of the city's big museums are free, and some of them have very good shops too. The museum shops sell books, toys and gifts, and the money helps the museums. They are great places to find a present for a friend or a member of your family.\n\n" +
          "In December, the shopping streets are full of Christmas lights. Oxford Street and Regent Street have beautiful decorations, and thousands of people come in the evening just to look at them. There are also Christmas markets in some parks, where you can buy hot drinks, cakes and small gifts. The shops are very busy before Christmas, so be patient!\n\n" +
          "Getting around London is easy. The Underground, called \"the Tube\", has stations near all the big shopping areas. The best way to pay is with a contactless bank card or an Oyster card. Buses are cheaper than the Tube, and from the top of a red double-decker bus you can see the city while you travel.\n\n" +
          "Finally, think about your budget. London can be very expensive, and it's easy to spend too much money. Before you go, decide how much you want to spend, and try to keep to it. Some visitors write a list of the things they want to buy. It's also a good idea to compare prices in a few shops before you buy something expensive.",
        questions: [
          { type: "tfng", q: "Oxford Street has more than three hundred shops.", a: ["True"], line: 4 },
          { type: "tfng", q: "Most shops on Oxford Street open at nine in the morning.", a: ["False"], line: 5 },
          { type: "tfng", q: "Harrods is a cheap place to shop.", a: ["False"], line: 8 },
          { type: "tfng", q: "Camden Market is open every day of the week.", a: ["Not given"], line: 10 },
          { type: "tfng", q: "In January, you can buy some clothes for half the usual price.", a: ["True"], line: 16 },
          { type: "tfng", q: "Many of London's big museums are free.", a: ["True"], line: 20 },
          { type: "tfng", q: "Buses are more expensive than the Tube.", a: ["False"], line: 30 },
          { type: "gap", q: "Oxford Street is the busiest shopping street in _____.", a: ["Europe"], line: 3 },
          { type: "gap", q: "Many tourists go to Harrods to see its beautiful food _____.", a: ["hall"], line: 8 },
          { type: "gap", q: "Portobello Road Market is famous for _____.", a: ["antiques"], line: 11 },
          { type: "gap", q: "Bring some _____, because a few small stalls do not take cards.", a: ["cash"], line: 12 },
          { type: "gap", q: "Wear comfortable _____, because you will walk a lot.", a: ["shoes"], line: 15 },
          { type: "gap", q: "In December, the shopping streets are full of Christmas _____.", a: ["lights"], line: 23 },
          { type: "choose", q: "When do the shops on Oxford Street close on Sundays?", opts: ["at six","at nine","at twelve"], a: ["at six"], line: 6 },
          { type: "choose", q: "Where is Harrods?", opts: ["in Camden","in Knightsbridge","in Notting Hill"], a: ["in Knightsbridge"], line: 7 },
          { type: "choose", q: "Why do young people like Camden Market?", opts: ["It is very quiet.","It has a famous food hall.","It sells unusual clothes."], a: ["It sells unusual clothes."], line: 10 },
          { type: "choose", q: "When is Portobello Road Market busiest?", opts: ["on Saturdays","on Sundays","on Mondays"], a: ["on Saturdays"], line: 11 },
          { type: "choose", q: "What is the best time to go shopping, the text says?", opts: ["late in the evening","at lunchtime","early in the morning"], a: ["early in the morning"], line: 14 },
          { type: "choose", q: "What is \"the Tube\"?", opts: ["the Underground","a red bus","a big shop"], a: ["the Underground"], line: 28 },
          { type: "choose", q: "What should you do before you go shopping, the text says?", opts: ["buy an Oyster card","decide how much you want to spend","visit a museum"], a: ["decide how much you want to spend"], line: 33 }
        ],
        words: [
          { w: 'souvenir', emoji: '🎁', m: 'a small thing you buy to remember a place you visited', ex: 'Visitors buy clothes, presents and souvenirs.' },
          { w: 'expensive', emoji: '💎', m: 'costing a lot of money', ex: 'Harrods is very big and very expensive.' },
          { w: 'department store', emoji: '🏬', m: 'a big shop that sells many different things on different floors', ex: 'Harrods is a famous department store.' },
          { w: 'busy (busiest)', emoji: '👥', m: 'full of people', ex: 'Oxford Street is the busiest shopping street in Europe.' },
          { w: 'market', emoji: '🧺', m: 'a place, often outside, where people sell things from tables', ex: 'Try one of London\'s street markets.' },
          { w: 'unusual', emoji: '🦄', m: 'different from most things; not ordinary', ex: 'Camden Market sells unusual clothes.' },
          { w: 'antiques', emoji: '🏺', m: 'old and beautiful things, for example furniture or clocks, that are worth a lot of money', ex: 'Portobello Road Market is famous for antiques.' },
          { w: 'cash', emoji: '💵', m: 'money in coins and notes, not a card', ex: 'Remember to bring some cash.' },
          { w: 'stall', emoji: '⛺', m: 'a small table or shop at a market', ex: 'A few small stalls do not take cards.' },
          { w: 'sale', emoji: '🏷️', m: 'a time when a shop sells things for less money than usual', ex: 'In January, many shops have big sales.' }
        ]
      },
      writing: {
        topic: 'A shopping trip',
        task: 'Write a short text about a shopping trip you remember.',
        points: ['where you went and who you went with', 'what you bought and how much it cost', 'how you felt about the trip'],
        minWords: 175, maxWords: 195, minutes: 30
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
        title: 'A town guide to Larkhaven',
        text: "Welcome to Larkhaven, a small town by the sea in the south-west of England. About twelve thousand people live here, and in summer many more come for their holidays. This guide tells you about the best places to visit.\n\n" +
          "Start your day in the old town, near the harbour. The streets here are narrow, and many of the houses are more than three hundred years old. On Market Street, there is a busy market every Wednesday and Saturday. You can buy fresh fish, local cheese and flowers there. Next, walk up the hill to Larkhaven Castle. It is open every day from ten in the morning until four in the afternoon, and a ticket costs eight pounds. From the top of the tower, you can see the whole town and the sea.\n\n" +
          "If it rains, visit the Sea Museum on Bridge Street. It tells the story of the town's fishermen, and children love its big model ships. The museum is free, but it is closed on Tuesdays. Next to the museum is the town library, which has a small café on the first floor.\n\n" +
          "Larkhaven is easy to explore on foot, because the centre is quite small. There is also a bus that goes along the coast every thirty minutes. You can hire a bike at the train station for twelve pounds a day.\n\n" +
          "In the evening, have dinner at one of the fish restaurants by the harbour. Then walk along the beach and watch the sunset. On Friday nights in summer, there is free music in the park. For maps and more information, visit the tourist office in the main square. Enjoy your visit to Larkhaven!\n\n" +
          "Larkhaven has a long history. More than seven hundred years ago, it was a small fishing village with only a few houses. The castle was built to protect the harbour from ships from other countries. Later, the town became rich from fishing and trade, and many of the beautiful old houses in the town centre were built by fishermen and sailors. Today, only a few boats still go out to fish every morning, but you can watch them come back into the harbour at about eleven o'clock.\n\n" +
          "If you like nature, the coast path is the perfect place for a long walk. It goes along the top of the cliffs, and on a clear day you can see seals and seabirds. The path can be wet and muddy after rain, so wear good boots. There are some steep parts, so it isn't a good walk for very young children.\n\n" +
          "There are many places to stay in Larkhaven, from big hotels by the beach to small guesthouses in the old town. There is also a campsite just outside the town. In July and August, the town is very busy, so it's a good idea to book a room early.\n\n" +
          "Every year in September, Larkhaven has a food festival. Local farmers, fishermen and cooks sell their food on the harbour, and there are cooking shows and music all weekend. Thousands of people come, and the hotels are often full, so plan your trip carefully if you want to visit then.",
        questions: [
          { type: "tfng", q: "Larkhaven is a town by the sea.", a: ["True"], line: 0 },
          { type: "tfng", q: "The market in the old town is open every day.", a: ["False"], line: 5 },
          { type: "tfng", q: "You have to pay to go into the Sea Museum.", a: ["False"], line: 12 },
          { type: "tfng", q: "The café in the library sells cakes.", a: ["Not given"], line: 13 },
          { type: "tfng", q: "There is a bus along the coast every half an hour.", a: ["True"], line: 15 },
          { type: "tfng", q: "Larkhaven was once a small fishing village.", a: ["True"], line: 23 },
          { type: "tfng", q: "The coast path is a good walk for very young children.", a: ["False"], line: 30 },
          { type: "gap", q: "At the market, you can buy fresh fish, local _____ and flowers.", a: ["cheese"], line: 6 },
          { type: "gap", q: "From the top of the castle _____, you can see the whole town and the sea.", a: ["tower"], line: 9 },
          { type: "gap", q: "Children love the big model _____ in the Sea Museum.", a: ["ships"], line: 11 },
          { type: "gap", q: "You can hire a _____ at the train station.", a: ["bike"], line: 16 },
          { type: "gap", q: "On Friday nights in summer, there is free _____ in the park.", a: ["music"], line: 19 },
          { type: "gap", q: "On a clear day, you can see seals and _____ from the coast path.", a: ["seabirds"], line: 28 },
          { type: "choose", q: "How many people live in Larkhaven?", opts: ["about two thousand","about twelve thousand","about twenty thousand"], a: ["about twelve thousand"], line: 1 },
          { type: "choose", q: "How old are many of the houses in the old town?", opts: ["about fifty years old","about a hundred years old","more than three hundred years old"], a: ["more than three hundred years old"], line: 4 },
          { type: "choose", q: "How much is a ticket for the castle?", opts: ["four pounds","eight pounds","twelve pounds"], a: ["eight pounds"], line: 8 },
          { type: "choose", q: "Why is Larkhaven easy to explore on foot?", opts: ["There are no cars.","The streets are very wide.","The centre is quite small."], a: ["The centre is quite small."], line: 14 },
          { type: "choose", q: "Where is the tourist office?", opts: ["by the harbour","in the main square","at the train station"], a: ["in the main square"], line: 20 },
          { type: "choose", q: "When do the fishing boats come back into the harbour?", opts: ["at about four o'clock","in the evening","at about eleven o'clock"], a: ["at about eleven o'clock"], line: 26 },
          { type: "choose", q: "When is Larkhaven's food festival?", opts: ["in September","in July","in August"], a: ["in September"], line: 34 }
        ],
        words: [
          { w: 'harbour', emoji: '⚓', m: 'a place by the sea where boats can stay safely', ex: 'Start your day in the old town, near the harbour.' },
          { w: 'narrow', emoji: '🤏', m: 'not wide; with only a little space from one side to the other', ex: 'The streets here are narrow.' },
          { w: 'local', emoji: '🏡', m: 'from the place where you are, not from far away', ex: 'You can buy fresh fish, local cheese and flowers there.' },
          { w: 'hill', emoji: '⛰️', m: 'a high piece of land, smaller than a mountain', ex: 'Walk up the hill to Larkhaven Castle.' },
          { w: 'tower', emoji: '🗼', m: 'a tall, narrow building or part of a building', ex: 'From the top of the tower, you can see the whole town.' },
          { w: 'model', emoji: '🚢', m: 'a small copy of something big', ex: 'Children love its big model ships.' },
          { w: 'explore', emoji: '🧭', m: 'to go around a new place to see what is there', ex: 'Larkhaven is easy to explore on foot.' },
          { w: 'on foot', emoji: '🚶', m: 'walking, not in a car or on a bus', ex: 'Larkhaven is easy to explore on foot.' },
          { w: 'coast', emoji: '🏖️', m: 'the land next to the sea', ex: 'There is also a bus that goes along the coast.' },
          { w: 'hire', emoji: '🚲', m: 'to pay money to use something for a short time', ex: 'You can hire a bike at the train station.' }
        ]
      },
      writing: {
        topic: 'My town',
        task: 'Write a short text about the town or city where you live.',
        points: ['where your town is and how big it is', 'two places you like there and why', 'what visitors can do in your town'],
        minWords: 180, maxWords: 200, minutes: 30
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
        title: 'Hobby club adverts',
        text: "Are you looking for something new to do in your free time? Here are five clubs in Millbrook that are looking for new members.\n\n" +
          "The Millbrook Walking Club goes for a long walk in the hills every Sunday morning. We meet at nine o'clock outside the train station, and we usually walk about ten kilometres. Wear good shoes, and bring some water and a snack. The club is free, and everyone is welcome.\n\n" +
          "Do you love board games? Come to Games Night at the Blue Door Café on Wednesdays, from seven until ten in the evening. We play old favourites like chess, and lots of new games too. It costs three pounds, and the price includes a hot drink.\n\n" +
          "The Millbrook Book Club meets in the town library on the first Thursday of every month. Each month we read one book, and then we talk about it over tea and biscuits. This month's book is a funny story about a family who move to a farm. New members are always welcome, and you don't have to finish the book!\n\n" +
          "Would you like to learn to cook? The Saturday Kitchen Club has cooking classes for beginners at Millbrook College. Every week, you learn to make a different dish, from simple soups to fresh pasta. Classes cost ten pounds, and you can take your food home with you. There are only eight places in each class, so book early.\n\n" +
          "The Millbrook Choir is looking for new singers. You don't need to read music, and you don't need a beautiful voice. You just need to enjoy singing. We practise every Tuesday evening in the Market Hall, and every summer we sing at a concert in the park. To join, just come to one of our practices and say hello!\n\n" +
          "We also asked some members why they love their clubs. Here is what they told us.\n\n" +
          "Jack, 34, joined the Walking Club last spring. \"I work in an office all week, so I really need to be outside at the weekend,\" he says. \"The hills around Millbrook are beautiful, and I've made a lot of new friends. After the walk, we sometimes have lunch together in a small pub in the village.\"\n\n" +
          "Sara, 19, goes to Games Night every week. \"I was very shy when I moved to Millbrook for university,\" she says. \"Board games are a great way to meet people, because you don't need to think about what to say. You just play and have fun! My favourite game is a card game about building cities.\"\n\n" +
          "Margaret, 71, is the oldest member of the Book Club. \"I've read books all my life, but it's much better to talk about them with other people,\" she says. \"Sometimes we don't agree at all, and that's the best part. Our members are of all ages, from eighteen to eighty!\"\n\n" +
          "Tom, 45, started the Kitchen Club classes in January. \"Before, I couldn't even cook an egg,\" he laughs. \"Now I make dinner for my family three times a week. My children love my pasta!\"\n\n" +
          "If you would like more information about any of these clubs, visit the Millbrook community website or look at the notice board in the town library. There is something for everyone, so why not try a new hobby this month?",
        questions: [
          { type: "tfng", q: "The Walking Club meets on Sunday mornings.", a: ["True"], line: 2 },
          { type: "tfng", q: "You have to pay to join the Walking Club.", a: ["False"], line: 5 },
          { type: "tfng", q: "Games Night finishes at eleven o'clock.", a: ["False"], line: 7 },
          { type: "tfng", q: "The Book Club meets in the town library.", a: ["True"], line: 10 },
          { type: "tfng", q: "The teacher at the Kitchen Club is a famous chef.", a: ["Not given"], line: 15 },
          { type: "tfng", q: "Jack works in an office.", a: ["True"], line: 27 },
          { type: "tfng", q: "Margaret is the youngest member of the Book Club.", a: ["False"], line: 33 },
          { type: "gap", q: "Walkers should wear good _____ and bring some water and a snack.", a: ["shoes"], line: 4 },
          { type: "gap", q: "At Games Night, the price includes a hot _____.", a: ["drink"], line: 9 },
          { type: "gap", q: "The Book Club talks about the book over tea and _____.", a: ["biscuits"], line: 11 },
          { type: "gap", q: "This month's book is about a family who move to a _____.", a: ["farm"], line: 12 },
          { type: "gap", q: "Every summer, the choir sings at a concert in the _____.", a: ["park"], line: 22 },
          { type: "gap", q: "Sara's favourite game is a card game about building _____.", a: ["cities"], line: 33 },
          { type: "choose", q: "How far does the Walking Club usually walk?", opts: ["about five kilometres","about ten kilometres","about twenty kilometres"], a: ["about ten kilometres"], line: 3 },
          { type: "choose", q: "When is Games Night?", opts: ["on Mondays","on Wednesdays","on Fridays"], a: ["on Wednesdays"], line: 7 },
          { type: "choose", q: "Where are the cooking classes?", opts: ["at the Blue Door Café","in the town library","at Millbrook College"], a: ["at Millbrook College"], line: 15 },
          { type: "choose", q: "Why should you book the cooking classes early?", opts: ["They are very cheap.","There are only eight places in each class.","The teacher is leaving soon."], a: ["There are only eight places in each class."], line: 18 },
          { type: "choose", q: "What do you need to join the choir?", opts: ["You need to read music.","You need a beautiful voice.","You need to enjoy singing."], a: ["You need to enjoy singing."], line: 21 },
          { type: "choose", q: "Why did Sara start going to Games Night?", opts: ["She loves chess.","She was shy and wanted to meet people.","Her teacher told her to."], a: ["She was shy and wanted to meet people."], line: 31 },
          { type: "choose", q: "How often does Tom cook dinner for his family now?", opts: ["every day","once a week","three times a week"], a: ["three times a week"], line: 38 }
        ],
        words: [
          { w: 'member', emoji: '🧑‍🤝‍🧑', m: 'a person who is part of a club or group', ex: 'Here are five clubs in Millbrook that are looking for new members.' },
          { w: 'snack', emoji: '🍎', m: 'a small amount of food that you eat between meals', ex: 'Wear good shoes, and bring some water and a snack.' },
          { w: 'board game', emoji: '🎲', m: 'a game that you play on a board, often with dice and small pieces', ex: 'Do you love board games?' },
          { w: 'include', emoji: '✅', m: 'to have something as one part of the whole', ex: 'It costs three pounds, and the price includes a hot drink.' },
          { w: 'biscuit', emoji: '🍪', m: 'a small, flat, dry cake, often sweet', ex: 'We talk about it over tea and biscuits.' },
          { w: 'dish', emoji: '🍝', m: 'food that is cooked in a special way, as part of a meal', ex: 'Every week, you learn to make a different dish.' },
          { w: 'book', emoji: '📅', m: 'to ask for a place, a seat or a ticket before the day', ex: 'There are only eight places in each class, so book early.' },
          { w: 'choir', emoji: '🎤', m: 'a group of people who sing together', ex: 'The Millbrook Choir is looking for new singers.' },
          { w: 'practise', emoji: '🔁', m: 'to do something again and again to get better at it', ex: 'We practise every Tuesday evening in the Market Hall.' },
          { w: 'concert', emoji: '🎶', m: 'a show where people play music or sing for other people', ex: 'Every summer we sing at a concert in the park.' }
        ]
      },
      writing: {
        topic: 'My free time',
        task: 'Write a short text about what you do in your free time.',
        points: ['what you like doing in your free time', 'when and where you do it, and who with', 'a new hobby you would like to try and why'],
        minWords: 190, maxWords: 210, minutes: 30
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
    { id: 'e9', no: 19, stage: 'Elementary', theme: 'Travel', emoji: '🚆' },
    { id: 'e10', no: 20, stage: 'Elementary', theme: 'Weather & holidays', emoji: '☀️' }
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
