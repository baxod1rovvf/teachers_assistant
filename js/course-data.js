/* ================= THE COURSE (2026-11-02) =================
   The teacher's course map: one shared course that every group of that level goes
   through. A BLOCK = 5 lessons + 1 review lesson + 1 exam (3 lessons a week → an exam
   every 2 weeks). Each block covers all four skills (listening, reading, writing,
   speaking) across its lessons, and every lesson starts with a warm-up / pair-work game.

   A lesson's material: slides (the teacher can change their text — kept in
   ta_course_edits), a printable exercises handout (with the teacher's script and answer
   key), and a 20-question revision test students do from a link with their ID.

   Only lessons with `slides` are ready; the others are on the map as "coming soon".
   To add a lesson's material, fill in the same fields as b1l1 below. */

const COURSE_SKILLS = {
  listening: { emoji: '🎧', label: 'Listening' },
  reading: { emoji: '📖', label: 'Reading' },
  writing: { emoji: '✍️', label: 'Writing' },
  speaking: { emoji: '🗣️', label: 'Speaking' }
};

const COURSE_BEGINNER = {
  id: 'beginner',
  title: 'Beginner English',
  emoji: '🌱',
  blocks: [
    {
      id: 'b1', title: 'Hello, world!', emoji: '👋', color: '#FF7AC6',
      lessons: [
        { id: 'b1l1', title: 'Letters and numbers', emoji: '🔤', skills: ['listening', 'speaking', 'writing'] },
        { id: 'b1l2', title: 'Hello! Names and countries', emoji: '🌍', skills: ['speaking', 'reading'] },
        { id: 'b1l3', title: 'My family', emoji: '👨‍👩‍👧', skills: ['reading', 'writing'] },
        { id: 'b1l4', title: 'Things in the classroom', emoji: '🎒', skills: ['listening', 'writing'] },
        { id: 'b1l5', title: 'Days, months and the time', emoji: '🕒', skills: ['listening', 'speaking'] }
      ]
    },
    {
      id: 'b2', title: 'My day', emoji: '☀️', color: '#FFB020',
      lessons: [
        { id: 'b2l1', title: 'Daily routines', emoji: '⏰', skills: ['speaking', 'listening'] },
        { id: 'b2l2', title: 'Food and drinks', emoji: '🍎', skills: ['reading', 'speaking'] },
        { id: 'b2l3', title: 'My home', emoji: '🏠', skills: ['reading', 'writing'] },
        { id: 'b2l4', title: 'Free time and hobbies', emoji: '⚽', skills: ['listening', 'speaking'] },
        { id: 'b2l5', title: 'Weather and clothes', emoji: '🌦️', skills: ['writing', 'listening'] }
      ]
    },
    {
      id: 'b3', title: 'People and places', emoji: '🏙️', color: '#2ED3A0',
      lessons: [
        { id: 'b3l1', title: 'Describing people', emoji: '🧑', skills: ['speaking', 'writing'] },
        { id: 'b3l2', title: 'My town', emoji: '🗺️', skills: ['reading', 'listening'] },
        { id: 'b3l3', title: 'Shopping', emoji: '🛍️', skills: ['speaking', 'listening'] },
        { id: 'b3l4', title: 'Jobs', emoji: '👩‍⚕️', skills: ['reading', 'writing'] },
        { id: 'b3l5', title: 'Can and can\'t', emoji: '💪', skills: ['speaking', 'writing'] }
      ]
    },
    {
      id: 'b4', title: 'Then and now', emoji: '⏳', color: '#4D9BFF',
      lessons: [
        { id: 'b4l1', title: 'Was and were', emoji: '📸', skills: ['reading', 'speaking'] },
        { id: 'b4l2', title: 'Last weekend', emoji: '🎉', skills: ['listening', 'writing'] },
        { id: 'b4l3', title: 'Famous people', emoji: '⭐', skills: ['reading', 'speaking'] },
        { id: 'b4l4', title: 'Holidays and travel', emoji: '✈️', skills: ['listening', 'writing'] },
        { id: 'b4l5', title: 'Telling a story', emoji: '📚', skills: ['writing', 'speaking'] }
      ]
    },
    {
      id: 'b5', title: 'Plans and dreams', emoji: '🚀', color: '#A97BFF',
      lessons: [
        { id: 'b5l1', title: 'Going to', emoji: '🗓️', skills: ['speaking', 'writing'] },
        { id: 'b5l2', title: 'Invitations', emoji: '💌', skills: ['reading', 'writing'] },
        { id: 'b5l3', title: 'Health and the body', emoji: '🩺', skills: ['listening', 'speaking'] },
        { id: 'b5l4', title: 'Comparing things', emoji: '⚖️', skills: ['reading', 'listening'] },
        { id: 'b5l5', title: 'My dream future', emoji: '🌟', skills: ['writing', 'speaking'] }
      ]
    },
    {
      id: 'b6', title: 'Ready for more', emoji: '🏆', color: '#FF6B6B',
      lessons: [
        { id: 'b6l1', title: 'Directions', emoji: '🧭', skills: ['listening', 'speaking'] },
        { id: 'b6l2', title: 'At a restaurant', emoji: '🍽️', skills: ['speaking', 'reading'] },
        { id: 'b6l3', title: 'Animals and nature', emoji: '🦁', skills: ['reading', 'writing'] },
        { id: 'b6l4', title: 'Rules: must and mustn\'t', emoji: '🚦', skills: ['listening', 'writing'] },
        { id: 'b6l5', title: 'My English journey', emoji: '🎓', skills: ['speaking', 'writing'] }
      ]
    }
  ]
};

/* ---------- Block 1, Lesson 1: Letters and numbers (ready) ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[0], {
  goals: ['Say and spell the English alphabet', 'Spell your name: "How do you spell it?"', 'Say numbers 0–100 and phone numbers'],
  warmups: [
    { emoji: '🏓', title: 'Number ping-pong', time: '5 min', how: 'Pairs count from 1 to 30, one number each, as fast as they can. Then the rule: instead of 3, 6, 9… (every number with 3 in it, or that 3 goes into) say "BUZZ!". A mistake = start again. The pair that reaches 30 first wins.' },
    { emoji: '🕵️', title: 'Spell & guess', time: '5 min', how: 'Student A thinks of a word from the board and spells it slowly, letter by letter. Student B writes the letters in the air with a finger and says the word as soon as they know it. Then swap.' }
  ],
  slides: [
    { emoji: '🔤🔢', title: 'Letters and numbers', body: 'Today we learn:\n• the English alphabet A–Z\n• how to spell your name\n• numbers 0–100 and phone numbers' },
    { emoji: '🏓', title: 'Warm-up: Number ping-pong', body: 'Work in pairs. Count 1 → 30, one number each.\nEvery number with 3 in it, or that 3 goes into → say "BUZZ!"\n1, 2, BUZZ, 4, 5, BUZZ, 7…' },
    { emoji: '🔤', title: 'The alphabet', body: 'A B C D E F G H I J K L M\nN O P Q R S T U V W X Y Z\n\n26 letters · 5 vowels: A E I O U' },
    { emoji: '🎵', title: 'Letters that sound alike', body: '/eɪ/  A H J K\n/iː/  B C D E G P T V\n/e/  F L M N S X Z\n/aɪ/  I Y   ·   /əʊ/  O\n/uː/  Q U W   ·   /ɑː/  R' },
    { emoji: '⚠️', title: 'Careful!', body: 'E /iː/ ≠ I /aɪ/\nG /dʒiː/ ≠ J /dʒeɪ/\nA /eɪ/ ≠ R /ɑː/\nTwo same letters: "double L" → B-E-double L-A' },
    { emoji: '💬', title: 'Spelling your name', body: 'A: What\'s your name?\nB: My name is Bella.\nA: How do you spell it?\nB: B-E-double L-A.\nA: Thank you!' },
    { emoji: '👥', title: 'Pair work: Spell it!', body: 'Ask 3 classmates. Write their names.\n"What\'s your name?" → "How do you spell it?"\nCheck: show them what you wrote. ✅' },
    { emoji: '🔢', title: 'Numbers 0–20', body: '0 zero · 1 one · 2 two · 3 three · 4 four · 5 five\n6 six · 7 seven · 8 eight · 9 nine · 10 ten\n11 eleven · 12 twelve · 13 thirteen · 14 fourteen · 15 fifteen\n16 sixteen · 17 seventeen · 18 eighteen · 19 nineteen · 20 twenty' },
    { emoji: '🔟', title: 'Tens and big numbers', body: '30 thirty · 40 forty · 50 fifty · 60 sixty\n70 seventy · 80 eighty · 90 ninety · 100 one hundred\n47 = forty-seven\n\n13 thirTEEN  ≠  30 THIRty' },
    { emoji: '📞', title: 'Phone numbers', body: 'A: What\'s your phone number?\nB: It\'s 0 9 1 – 5 5 7 – 2 0 3.\n"oh nine one, double five seven, two oh three"\n0 → "oh" · 55 → "double five"' },
    { emoji: '🎯', title: 'Game: Number bingo', body: 'Draw a 3 × 3 grid. Write 9 numbers from 1 to 100.\nListen to your teacher. Cross out the numbers you hear.\nThree in a line → shout "BINGO!" 🎉' },
    { emoji: '🏁', title: 'Well done!', body: 'Today you can:\n✅ say the alphabet\n✅ spell your name\n✅ say numbers and phone numbers\n\nHomework: the revision test (link from your teacher) 📲' }
  ],
  handout: {
    title: 'Letters and numbers',
    sections: [
      { skill: 'listening', title: 'Listen and circle the letter you hear.',
        items: ['1. A  E  I', '2. G  J  K', '3. B  P  V', '4. E  I  Y', '5. Q  U  W', '6. M  N  L', '7. A  H  R', '8. S  X  Z'] },
      { skill: 'listening', title: 'Listen and write the phone numbers.',
        items: ['1. ____________________', '2. ____________________', '3. ____________________'] },
      { skill: 'reading', title: 'Read the card and answer the questions.',
        text: 'STUDENT CARD\nName: Tom Kelly\nAge: 14\nPhone: 0 9 7 – 4 4 8 – 1 3 0\nClass: 7B',
        items: ['1. How do you spell his first name? __________', '2. How old is he? __________', '3. What is his phone number? __________', '4. Is "Kelly" his first name? __________'] },
      { skill: 'writing', title: 'Write the numbers in words.',
        items: ['7 ________________', '12 ________________', '15 ________________', '30 ________________', '48 ________________', '90 ________________', '100 ________________'] },
      { skill: 'writing', title: 'Make your own student card.',
        text: 'Name: ____________________\nAge: ____________________\nPhone: ____________________\nClass: ____________________' },
      { skill: 'speaking', title: 'Pair work: ask your partner and write the answers.',
        text: 'What\'s your name?  ____________________\nHow do you spell it?  ____________________\nHow old are you?  ____________________\nWhat\'s your phone number?  ____________________' }
    ],
    teacherScript: [
      'Letters: 1. E  2. J  3. P  4. I  5. U  6. N  7. R  8. Z',
      'Phone numbers: 1. 0 7 1 – 3 3 9 – 5 0 2   2. 0 9 9 – 2 1 4 – 8 6 0   3. 0 5 5 – 6 7 7 – 1 1 3'
    ],
    answers: [
      'Reading: 1. T-O-M  2. 14 (fourteen)  3. 097 448 130  4. No — "Kelly" is his last name (surname).',
      'Numbers: seven · twelve · fifteen · thirty · forty-eight · ninety · one hundred'
    ]
  },
  // 20 questions, each with 1 right answer and 3 wrong ones; "_____" is the gap
  test: [
    { q: 'A, B, C, _____, E', a: 'D', wrong: ['F', 'G', 'B'] },
    { q: '15 = _____', a: 'fifteen', wrong: ['fifty', 'five', 'sixteen'] },
    { q: '30 = _____', a: 'thirty', wrong: ['thirteen', 'three', 'forty'] },
    { q: '13 = _____', a: 'thirteen', wrong: ['thirty', 'three', 'fourteen'] },
    { q: 'The letter after K is _____.', a: 'L', wrong: ['J', 'M', 'N'] },
    { q: 'The letter before T is _____.', a: 'S', wrong: ['U', 'R', 'V'] },
    { q: '12 = _____', a: 'twelve', wrong: ['twenty', 'two', 'eleven'] },
    { q: '100 = _____', a: 'one hundred', wrong: ['ten', 'one thousand', 'ten hundred'] },
    { q: '47 = _____', a: 'forty-seven', wrong: ['fourty-seven', 'seventy-four', 'forty-six'] },
    { q: 'What\'s your name? — My name _____ Anna.', a: 'is', wrong: ['are', 'am', 'be'] },
    { q: 'How do you _____ it? — A-N-N-A.', a: 'spell', wrong: ['speak', 'tell', 'name'] },
    { q: 'In a phone number, 0 is often said _____.', a: 'oh', wrong: ['on', 'off', 'of'] },
    { q: '55 in a phone number: "double _____"', a: 'five', wrong: ['fifty', 'fives', 'two'] },
    { q: '8 + 9 = _____', a: 'seventeen', wrong: ['seventy', 'sixteen', 'eighteen'] },
    { q: '20 + 40 = _____', a: 'sixty', wrong: ['sixteen', 'fifty', 'seventy'] },
    { q: 'The English alphabet has _____ letters.', a: '26', wrong: ['24', '28', '33'] },
    { q: 'The vowels are A, E, I, O and _____.', a: 'U', wrong: ['Y', 'W', 'R'] },
    { q: 'B-O-O-K spells _____.', a: 'book', wrong: ['boot', 'look', 'cook'] },
    { q: '90 = _____', a: 'ninety', wrong: ['nineteen', 'ninty', 'nine'] },
    { q: 'How old are you? — I\'m _____.', a: 'fourteen', wrong: ['Anna', 'A-N-N-A', 'double four'] }
  ]
});

const TA_COURSES = [COURSE_BEGINNER];
