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

/* Exercise kinds (teacher, 2026-11-03: "add different types of exercises"): gap (fill the gap), choose (a/b/c — circle),
   tf (true / false), match (numbers ↔ words: the right column is shown in a–z order), order (put in order), odd (odd one
   out), correct (correct the mistake), write (write / answer). How a question and its answer are shown — the same on the
   slides and in the handout: */
function courseExQ(e, it) {
  if (e.type === 'choose') return it.q + '     ' + it.opts.map((o, i) => 'abc'[i] + ') ' + o).join('     ');
  if (e.type === 'tf') return it.q + '     T / F';
  return it.q;
}
function courseExA(e, it) {
  if (e.type === 'choose') return it.a + ') ' + it.opts['abc'.indexOf(it.a)];
  if (e.type === 'match') return courseMatchRight(e).indexOf(it.a) >= 0 ? 'abcdefghij'[courseMatchRight(e).indexOf(it.a)] + ') ' + it.a : it.a;
  return it.a;
}
function courseMatchRight(e) { return e.items.map(it => it.a).slice().sort(); }
function courseExOwn(it) { return /^\(students/.test(it.a); }   // "(students' own)" — no answer to show
/* A lesson's handout made from its exercises — the same exercises its slides show (teacher, 2026-11-03) */
function courseExerciseHandout(lesson) {
  return {
    title: lesson.title,
    sections: lesson.exercises.map(e => ({ skill: e.skill, title: e.title, text: e.text,
      items: e.items.map((it, k) => (k + 1) + '. ' + courseExQ(e, it) + (e.type === 'match' ? '   ____' : /_{3}|T \/ F|^(choose|odd|tf)$/.test(courseExQ(e, it) + '|' + e.type) || e.type === 'choose' || e.type === 'odd' || e.type === 'tf' ? '' : '  →  ______________')),
      right: e.type === 'match' ? courseMatchRight(e).map((a, i) => 'abcdefghij'[i] + ') ' + a) : null })),
    teacherScript: lesson.teacherScript || [],
    answers: lesson.exercises.map((e, i) => 'Exercise ' + (i + 1) + ': ' + (e.items.every(courseExOwn) ? 'students\' own answers' : e.items.map((it, k) => (k + 1) + ' ' + courseExA(e, it)).join(' · ')))
  };
}

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
  // A 2-hour lesson (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, with audio made
  // by Claude (Kokoro voices, audio/course/*.mp3 — the computer's own voice reads the text if a file can't play).
  // Generated from a script; the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Say and spell the English alphabet (and know the letters that sound alike)",
    "Spell names: \"How do you spell it?\" — double letters, capital letters",
    "Say numbers 0–100 (13 thirTEEN ≠ 30 THIRty) and phone numbers",
    "Understand names, ages and phone numbers in three listenings"
  ],
  warmups: [
    {
      "emoji": "🗣️",
      "title": "Hello! Let's talk",
      "time": "5 min",
      "how": "Ask the questions on slide 3 around the class (it's the first lesson — there is no last lesson to revise)."
    },
    {
      "emoji": "⛓️",
      "title": "Name chain",
      "time": "7 min",
      "how": "Student 1: \"I'm Anna.\" Student 2: \"She's Anna. I'm Alex.\" Student 3: \"She's Anna, he's Alex, I'm Lucy.\"… The chain goes round the class."
    },
    {
      "emoji": "🎯",
      "title": "Number bingo",
      "time": "8 min",
      "how": "Students draw a 3 × 3 grid with 9 numbers from 1 to 100. Call numbers; three in a line → \"BINGO!\" (slide 25)."
    },
    {
      "emoji": "🏓",
      "title": "Number ping-pong",
      "time": "5 min",
      "how": "Pairs count to 30, one number each; every number with 3 in it or that 3 goes into → \"BUZZ!\"."
    }
  ],
  exercises: [
    {
      "id": "odd",
      "type": "odd",
      "skill": "listening",
      "title": "Say the letters. Which letter has a different sound? Circle it.",
      "items": [
        {
          "q": "A   H   J   B",
          "a": "B"
        },
        {
          "q": "B   C   F   D",
          "a": "F"
        },
        {
          "q": "F   L   M   E",
          "a": "E"
        },
        {
          "q": "I   Y   K",
          "a": "K"
        },
        {
          "q": "Q   U   W   O",
          "a": "O"
        },
        {
          "q": "G   P   T   J",
          "a": "J"
        }
      ]
    },
    {
      "id": "letters",
      "type": "gap",
      "skill": "writing",
      "title": "Write the missing letters.",
      "items": [
        {
          "q": "A  B  ___  D",
          "a": "C"
        },
        {
          "q": "F  ___  H",
          "a": "G"
        },
        {
          "q": "___  K  L",
          "a": "J"
        },
        {
          "q": "M  N  ___",
          "a": "O"
        },
        {
          "q": "R  ___  T",
          "a": "S"
        },
        {
          "q": "W  X  ___  Z",
          "a": "Y"
        },
        {
          "q": "The letter after P: ___",
          "a": "Q"
        },
        {
          "q": "The vowels: A, E, I, O, ___",
          "a": "U"
        }
      ]
    },
    {
      "id": "names",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 1: Listen. Write the names.",
      "listen": 0,
      "items": [
        {
          "q": "1st student:  ____________",
          "a": "Emma"
        },
        {
          "q": "2nd student:  ____________",
          "a": "Jack"
        },
        {
          "q": "The teacher:  Mr ____________",
          "a": "Green"
        },
        {
          "q": "4th student:  ____________",
          "a": "Sophie"
        },
        {
          "q": "5th student:  ____________",
          "a": "Lizzy"
        }
      ]
    },
    {
      "id": "order",
      "type": "order",
      "skill": "writing",
      "title": "Put the letters in order. Write the word.",
      "items": [
        {
          "q": "o - b - o - k",
          "a": "book"
        },
        {
          "q": "m - e - a - n",
          "a": "name"
        },
        {
          "q": "l - p - s - e - l",
          "a": "spell"
        },
        {
          "q": "n - o - h - e - p",
          "a": "phone"
        },
        {
          "q": "t - e - t - l - r - e",
          "a": "letter"
        },
        {
          "q": "b - m - u - n - e - r",
          "a": "number"
        }
      ]
    },
    {
      "id": "capitals",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes. Names start with a capital letter.",
      "items": [
        {
          "q": "my name is anna.",
          "a": "My name is Anna."
        },
        {
          "q": "his name is tom kelly.",
          "a": "His name is Tom Kelly."
        },
        {
          "q": "How do you spell? — L-O-L-A.",
          "a": "How do you spell it?"
        },
        {
          "q": "B-E-L-A  (Bella)",
          "a": "B-E-double L-A"
        },
        {
          "q": "i'm from london.",
          "a": "I'm from London."
        }
      ]
    },
    {
      "id": "match",
      "type": "match",
      "skill": "reading",
      "title": "Match the numbers and the words.",
      "items": [
        {
          "q": "3",
          "a": "three"
        },
        {
          "q": "8",
          "a": "eight"
        },
        {
          "q": "11",
          "a": "eleven"
        },
        {
          "q": "12",
          "a": "twelve"
        },
        {
          "q": "14",
          "a": "fourteen"
        },
        {
          "q": "16",
          "a": "sixteen"
        },
        {
          "q": "19",
          "a": "nineteen"
        },
        {
          "q": "20",
          "a": "twenty"
        }
      ]
    },
    {
      "id": "numwords",
      "type": "write",
      "skill": "writing",
      "title": "Write the numbers in words.",
      "items": [
        {
          "q": "13",
          "a": "thirteen"
        },
        {
          "q": "30",
          "a": "thirty"
        },
        {
          "q": "40",
          "a": "forty"
        },
        {
          "q": "48",
          "a": "forty-eight"
        },
        {
          "q": "90",
          "a": "ninety"
        },
        {
          "q": "55",
          "a": "fifty-five"
        },
        {
          "q": "67",
          "a": "sixty-seven"
        },
        {
          "q": "100",
          "a": "one hundred"
        }
      ]
    },
    {
      "id": "choosenum",
      "type": "choose",
      "skill": "reading",
      "title": "Circle the right number.",
      "items": [
        {
          "q": "fifteen",
          "opts": [
            "50",
            "15",
            "5"
          ],
          "a": "b"
        },
        {
          "q": "sixty",
          "opts": [
            "16",
            "66",
            "60"
          ],
          "a": "c"
        },
        {
          "q": "nineteen",
          "opts": [
            "19",
            "90",
            "9"
          ],
          "a": "a"
        },
        {
          "q": "seventy-one",
          "opts": [
            "17",
            "71",
            "77"
          ],
          "a": "b"
        },
        {
          "q": "eighty-four",
          "opts": [
            "48",
            "84",
            "80"
          ],
          "a": "b"
        },
        {
          "q": "thirty-three",
          "opts": [
            "33",
            "13",
            "303"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "ages",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 2: Listen and circle the right number.",
      "listen": 1,
      "items": [
        {
          "q": "Tom is ___ years old.",
          "opts": [
            "13",
            "30",
            "3"
          ],
          "a": "a"
        },
        {
          "q": "His grandmother is ___.",
          "opts": [
            "62",
            "72",
            "27"
          ],
          "a": "b"
        },
        {
          "q": "There are ___ students in Sara's class.",
          "opts": [
            "50",
            "15",
            "16"
          ],
          "a": "b"
        },
        {
          "q": "Ben's bus is number ___.",
          "opts": [
            "48",
            "84",
            "44"
          ],
          "a": "a"
        },
        {
          "q": "The school has ___ computers.",
          "opts": [
            "19",
            "90",
            "99"
          ],
          "a": "b"
        }
      ]
    },
    {
      "id": "saynum",
      "type": "write",
      "skill": "speaking",
      "title": "How do you say these phone numbers? Write, then say them to your partner.",
      "items": [
        {
          "q": "077 455 120",
          "a": "oh double seven, four double five, one two oh"
        },
        {
          "q": "090 336 818",
          "a": "oh nine oh, double three six, eight one eight"
        },
        {
          "q": "055 100 247",
          "a": "oh double five, one double oh, two four seven"
        },
        {
          "q": "099 712 663",
          "a": "oh double nine, seven one two, double six three"
        }
      ]
    },
    {
      "id": "call",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: A phone call. Listen and complete.",
      "listen": 2,
      "items": [
        {
          "q": "The boy's name is Daniel ____________.",
          "a": "Brooks"
        },
        {
          "q": "True or false: Daniel is thirteen.  T / F",
          "a": "F — he's twelve"
        },
        {
          "q": "The phone number is 077 ________ ________.",
          "a": "455 201"
        },
        {
          "q": "The lesson is in room ________.",
          "a": "14"
        },
        {
          "q": "True or false: \"Brooks\" has double O.  T / F",
          "a": "T"
        }
      ]
    },
    {
      "id": "cardstf",
      "type": "tf",
      "skill": "reading",
      "title": "Read the student cards. True (T) or false (F)?",
      "text": "STUDENT CARD 1\nName: Nora Smith\nAge: 13 · Class: 7A\nPhone: 090 112 456\n\nSTUDENT CARD 2\nName: Tom Kelly\nAge: 14 · Class: 8B\nPhone: 097 448 130\n\nSTUDENT CARD 3\nName: Lizzy Moon\nAge: 12 · Class: 6C\nPhone: 055 300 819",
      "items": [
        {
          "q": "Nora is thirteen.",
          "a": "T"
        },
        {
          "q": "Tom is in class 7A.",
          "a": "F (8B)"
        },
        {
          "q": "Lizzy's phone number starts with 055.",
          "a": "T"
        },
        {
          "q": "Tom is forty.",
          "a": "F (14)"
        },
        {
          "q": "\"Lizzy\" has double Z.",
          "a": "T"
        }
      ]
    },
    {
      "id": "cardsq",
      "type": "write",
      "skill": "reading",
      "title": "Read the student cards again. Answer the questions.",
      "items": [
        {
          "q": "How old is Lizzy?",
          "a": "She's twelve."
        },
        {
          "q": "What class is Tom in?",
          "a": "8B"
        },
        {
          "q": "How do you spell Tom's surname?",
          "a": "K-E-double L-Y"
        },
        {
          "q": "Who is in class 7A?",
          "a": "Nora"
        },
        {
          "q": "What's Lizzy's phone number?",
          "a": "oh double five, three double oh, eight one nine"
        }
      ]
    },
    {
      "id": "mycard",
      "type": "write",
      "skill": "writing",
      "title": "Make your own student card. Then read it to your partner.",
      "items": [
        {
          "q": "Name:",
          "a": "(students' own)"
        },
        {
          "q": "Age:",
          "a": "(students' own)"
        },
        {
          "q": "Class:",
          "a": "(students' own)"
        },
        {
          "q": "Phone:",
          "a": "(students' own)"
        },
        {
          "q": "My name in letters:  __ - __ - __ - __ - __",
          "a": "(students' own)"
        }
      ]
    },
    {
      "id": "quiz",
      "type": "choose",
      "skill": "speaking",
      "title": "Team quiz! Say the answer first.",
      "items": [
        {
          "q": "How many letters are in the alphabet?",
          "opts": [
            "24",
            "26",
            "28"
          ],
          "a": "b"
        },
        {
          "q": "Which is a vowel?",
          "opts": [
            "B",
            "K",
            "E"
          ],
          "a": "c"
        },
        {
          "q": "\"double L\" means…",
          "opts": [
            "LL",
            "L2",
            "LLL"
          ],
          "a": "a"
        },
        {
          "q": "thirty =",
          "opts": [
            "13",
            "30",
            "33"
          ],
          "a": "b"
        },
        {
          "q": "In a phone number, 0 is…",
          "opts": [
            "\"oh\"",
            "\"of\"",
            "\"on\""
          ],
          "a": "a"
        },
        {
          "q": "How do you spell 40?",
          "opts": [
            "fourty",
            "forty",
            "fourtee"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "The very first lesson (2 hours). Smile, say \"Hello!\" and write your name on the board — spell it aloud. Students need the handout (15 exercises)."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "🔤",
          "text": "Words: the alphabet A–Z · numbers 0–100"
        },
        {
          "emoji": "🎵",
          "text": "Sounds: letters that sound alike · thirTEEN or THIRty?"
        },
        {
          "emoji": "🗣️",
          "text": "Speaking: \"How do you spell it?\" · phone numbers"
        },
        {
          "emoji": "🎧",
          "text": "Listening: names, numbers, a phone call"
        },
        {
          "emoji": "📝",
          "text": "Revision test: 20 questions at the end"
        }
      ],
      "notes": "Read the list quickly — 1 minute."
    },
    {
      "layout": "questions",
      "tag": "WARM-UP",
      "title": "Hello! Let's talk",
      "rows": [
        "What's your name?",
        "How old are you?",
        "Where are you from?",
        "Can you say A, B, C…?",
        "Count from 1 to 10!"
      ],
      "notes": "Click to show each question; ask 3–4 students each. 5 minutes."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Name chain",
      "emoji": "⛓️",
      "minutes": 7,
      "text": "Student 1: \"I'm Anna.\"\nStudent 2: \"She's Anna. I'm Alex.\"\nStudent 3: \"She's Anna, he's Alex, I'm Lucy.\"\n…and round the class!",
      "notes": "Start the timer. If someone forgets a name, the class helps."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "🔤",
          "word": "letter",
          "tr": "A, B, C"
        },
        {
          "emoji": "🔢",
          "word": "number",
          "tr": "1, 2, 3"
        },
        {
          "emoji": "📛",
          "word": "name",
          "tr": "Anna, Tom"
        },
        {
          "emoji": "✍️",
          "word": "spell",
          "tr": "B - O - O - K"
        },
        {
          "emoji": "🅰️",
          "word": "vowel",
          "tr": "A E I O U"
        },
        {
          "emoji": "📞",
          "word": "phone number",
          "tr": "077 455 120"
        },
        {
          "emoji": "✌️",
          "word": "double",
          "tr": "LL = double L"
        },
        {
          "emoji": "⭕",
          "word": "zero / oh",
          "tr": "0"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · THE ALPHABET",
      "title": "The alphabet: 26 letters",
      "tiles": [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      "mark": [
        "A",
        "E",
        "I",
        "O",
        "U"
      ],
      "foot": "Vowels: A E I O U · the others are consonants",
      "notes": "Say the alphabet slowly, students repeat. Then faster. Then boys / girls take turns letter by letter."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · SOUNDS",
      "title": "Letters that sound alike",
      "boxes": [
        {
          "head": "/eɪ/  (day)",
          "body": "A  H  J  K"
        },
        {
          "head": "/iː/  (see)",
          "body": "B  C  D  E  G  P  T  V"
        },
        {
          "head": "/e/  (pen)",
          "body": "F  L  M  N  S  X  Z"
        },
        {
          "head": "/aɪ/  (my)",
          "body": "I  Y"
        },
        {
          "head": "/əʊ/  (no)",
          "body": "O"
        },
        {
          "head": "/uː/  (you)",
          "body": "Q  U  W"
        },
        {
          "head": "/ɑː/  (car)",
          "body": "R"
        }
      ],
      "foot": "Say each group fast: \"A H J K!\" \"B C D E G P T V!\"",
      "notes": "Groups race to say their line. Point at a group, students say it."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Letter mistakes everyone makes",
      "rows": [
        {
          "wrong": "E sounds like /aɪ/",
          "right": "E is /iː/ — I is /aɪ/"
        },
        {
          "wrong": "G and J sound the same",
          "right": "G /dʒiː/ — J /dʒeɪ/"
        },
        {
          "wrong": "A and R sound the same",
          "right": "A /eɪ/ — R /ɑː/"
        },
        {
          "wrong": "W = \"wee\"",
          "right": "W = \"double U\""
        },
        {
          "wrong": "H = \"hech\"",
          "right": "H = /eɪtʃ/ (\"aitch\")"
        },
        {
          "wrong": "Z = \"zi\"",
          "right": "Z = \"zed\" (UK) / \"zee\" (US)"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "odd",
      "notes": "Handout exercise 1. Students say the letters aloud in pairs and circle. Click to check."
    },
    {
      "layout": "exercise",
      "ex": "letters",
      "notes": "Handout exercise 2. 3 minutes, then check."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "Spell your name",
      "listen": 0,
      "text": "Five people say and spell their names.\nListen and write the names (handout exercise 3).\n\nYou hear it two times. 🎧",
      "tips": [
        "Listen for \"double\": double E = EE",
        "Names start with a capital letter",
        "Write each letter you hear"
      ],
      "notes": "Play twice. Then the next slide shows the answers one by one."
    },
    {
      "layout": "exercise",
      "ex": "names",
      "notes": "Handout exercise 3 (Listening 1). Play again if needed, then click to show the names."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 2 · SPELLING NAMES",
      "title": "How do you spell it?",
      "boxes": [
        {
          "head": "💬 Ask",
          "body": "A: What's your name?\nB: Bella.\nA: How do you spell it?\nB: B - E - double L - A."
        },
        {
          "head": "✌️ Double letters",
          "body": "LL = double L (Bella)\nEE = double E (Green)\nZZ = double Z (Lizzy)\nOO = double O (Brooks)"
        },
        {
          "head": "🔠 Capital letters",
          "body": "Names: Anna, Tom Kelly\nCities: London\nI: I'm Alex"
        }
      ],
      "foot": "\"Can you spell it, please?\" — polite! 🙂",
      "notes": "Model the dialogue with a strong student. Then 3 pairs say it in front of the class."
    },
    {
      "layout": "exercise",
      "ex": "order",
      "notes": "Handout exercise 4. Pairs race. Click to check."
    },
    {
      "layout": "exercise",
      "ex": "capitals",
      "notes": "Handout exercise 5. Students correct, then compare with a partner."
    },
    {
      "layout": "game",
      "tag": "SPEAKING · PAIR WORK",
      "title": "Spell it!",
      "emoji": "👥",
      "minutes": 5,
      "text": "Ask 4 classmates:\n\"What's your name?\"\n\"How do you spell it?\"\nWrite the names. Show them — is it right? ✅",
      "notes": "Start the timer. Walk around and listen for \"double\"."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 3 · NUMBERS 0–20",
      "title": "Numbers 0–20",
      "cols": 7,
      "tiles": [
        "0 zero",
        "1 one",
        "2 two",
        "3 three",
        "4 four",
        "5 five",
        "6 six",
        "7 seven",
        "8 eight",
        "9 nine",
        "10 ten",
        "11 eleven",
        "12 twelve",
        "13 thirteen",
        "14 fourteen",
        "15 fifteen",
        "16 sixteen",
        "17 seventeen",
        "18 eighteen",
        "19 nineteen",
        "20 twenty"
      ],
      "small": true,
      "notes": "Count together, then backwards from 20. Clap on 11 and 12 — they are special (no \"-teen\")."
    },
    {
      "layout": "exercise",
      "ex": "match",
      "notes": "Handout exercise 6. Click each row to show the matching letter."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · BIG NUMBERS",
      "title": "Tens and big numbers",
      "boxes": [
        {
          "head": "Tens",
          "body": "20 twenty · 30 thirty · 40 forty\n50 fifty · 60 sixty · 70 seventy\n80 eighty · 90 ninety · 100 one hundred"
        },
        {
          "head": "Big numbers",
          "body": "21 = twenty-one\n47 = forty-seven\n85 = eighty-five\n(don't forget the -)"
        },
        {
          "head": "👂 Listen to the stress",
          "body": "13 thir-TEEN\n30 THIR-ty\n14 four-TEEN · 40 FOR-ty"
        }
      ],
      "foot": "13 thirTEEN  ≠  30 THIRty",
      "notes": "Clap the stress. Game: say a number — students show 13 or 30 with fingers."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Number mistakes everyone makes",
      "rows": [
        {
          "wrong": "fourty",
          "right": "forty (no U!)"
        },
        {
          "wrong": "ninty",
          "right": "ninety"
        },
        {
          "wrong": "twentyone",
          "right": "twenty-one"
        },
        {
          "wrong": "thirteen = 30",
          "right": "thirteen = 13 · thirty = 30"
        },
        {
          "wrong": "hundred",
          "right": "one hundred"
        },
        {
          "wrong": "I am 14 years.",
          "right": "I'm 14. / I'm 14 years old."
        }
      ],
      "notes": "Students find each mistake, then click."
    },
    {
      "layout": "exercise",
      "ex": "numwords",
      "notes": "Handout exercise 7. 4 minutes."
    },
    {
      "layout": "exercise",
      "ex": "choosenum",
      "notes": "Handout exercise 8. Read aloud together after checking."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Numbers",
      "listen": 1,
      "text": "Five people say a number.\nListen and circle the right number (handout exercise 9).\n\nCareful: 13 or 30? 15 or 50?",
      "tips": [
        "Listen for the stress: -TEEN or -ty?",
        "Circle a, b or c",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "ages",
      "notes": "Handout exercise 9 (Listening 2). Click to check."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Number bingo",
      "emoji": "🎯",
      "minutes": 8,
      "text": "Draw a 3 × 3 grid.\nWrite 9 numbers from 1 to 100.\nListen to your teacher. Cross out the numbers you hear.\nThree in a line → \"BINGO!\" 🎉",
      "notes": "Call numbers like 13/30, 14/40, 15/50 — the tricky ones!"
    },
    {
      "layout": "boxes",
      "tag": "LESSON 5 · PHONE NUMBERS",
      "title": "What's your phone number?",
      "boxes": [
        {
          "head": "💬 Ask",
          "body": "A: What's your phone number?\nB: It's 091 557 203.\nA: Sorry, can you say it again?"
        },
        {
          "head": "🗣️ Say it",
          "body": "0 → \"oh\"\n55 → \"double five\"\n091 557 203 →\n\"oh nine one, double five seven, two oh three\""
        },
        {
          "head": "✋ Groups",
          "body": "Say the numbers in groups of three and stop a little after each group."
        }
      ],
      "foot": "Never say \"fifty-five\" in a phone number!",
      "notes": "Drill: you say a number, students repeat. Then made-up numbers in pairs."
    },
    {
      "layout": "exercise",
      "ex": "saynum",
      "notes": "Handout exercise 10. Students write, then say to a partner. Click to check."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "A phone call",
      "listen": 2,
      "text": "A mother calls an English school.\nListen and complete (handout exercise 11):\nher son's name, his age, the phone number and the room.",
      "tips": [
        "Spelling: listen for \"double\"",
        "Two true / false questions",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "call",
      "notes": "Handout exercise 11 (Listening 3). Click to check."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Student cards",
      "text": "STUDENT CARD 1\nName: Nora Smith\nAge: 13 · Class: 7A\nPhone: 090 112 456\n\nSTUDENT CARD 2\nName: Tom Kelly\nAge: 14 · Class: 8B\nPhone: 097 448 130\n\nSTUDENT CARD 3\nName: Lizzy Moon\nAge: 12 · Class: 6C\nPhone: 055 300 819",
      "tips": [
        "Name · Age · Class · Phone",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (3 min). Then exercises 12 and 13."
    },
    {
      "layout": "exercise",
      "ex": "cardstf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "cardsq",
      "notes": "Handout exercise 13. Students answer in full where they can."
    },
    {
      "layout": "exercise",
      "ex": "mycard",
      "minutes": 6,
      "notes": "Handout exercise 14. Students write their card, then read it to a partner, who writes the phone number. 3 students read theirs to the class."
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — or play it as a team quiz: two teams, the first correct answer gets a point."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can say and spell the alphabet",
        "I can spell my name",
        "I can say numbers 0–100",
        "I can say a phone number"
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — Spell your name (5 people)",
      "src": "audio/course/b1l1-listening-1.mp3",
      "text": "Hello! What's your name? Emma. How do you spell it? E. double M. A. And what's your name? Jack. How do you spell it? J. A. C. K. Hello! Are you the teacher? Yes, I am. I'm Mr Green. How do you spell Green? G. R. double E. N. Next, please. What's your name? Sophie. Can you spell it, please? S. O. P. H. I. E. And you? I'm Lizzy. How do you spell it? L. I. double Z. Y. Thank you, everyone!",
      "script": "Narrator: Listening one. Spell your name. Listen and write the names.\nA: Hello! What's your name?\nB: Emma.\nA: How do you spell it?\nB: E. double M. A.\nA: And what's your name?\nB: Jack.\nA: How do you spell it?\nB: J. A. C. K.\nA: Hello! Are you the teacher?\nB: Yes, I am. I'm Mr Green.\nA: How do you spell Green?\nB: G. R. double E. N.\nA: Next, please. What's your name?\nB: Sophie.\nA: Can you spell it, please?\nB: S. O. P. H. I. E.\nA: And you?\nB: I'm Lizzy.\nA: How do you spell it?\nB: L. I. double Z. Y.\nA: Thank you, everyone!"
    },
    {
      "label": "Listening 2 — Numbers (5 people)",
      "src": "audio/course/b1l1-listening-2.mp3",
      "text": "Number one. Hi, I'm Tom. I'm thirteen years old. Number two. This is my grandmother. She's seventy-two. Number three. I'm Sara. There are fifteen students in my class. Number four. My name's Ben. I go to school on bus number forty-eight. Number five. Our school is big. It has ninety computers!",
      "script": "Narrator: Listening two. Listen and circle the right number.\nNarrator: Number one.\nB: Hi, I'm Tom. I'm thirteen years old.\nNarrator: Number two.\nB: This is my grandmother. She's seventy-two.\nNarrator: Number three.\nB: I'm Sara. There are fifteen students in my class.\nNarrator: Number four.\nB: My name's Ben. I go to school on bus number forty-eight.\nNarrator: Number five.\nA: Our school is big. It has ninety computers!"
    },
    {
      "label": "Listening 3 — A phone call to an English school",
      "src": "audio/course/b1l1-listening-3.mp3",
      "text": "Hello, Sunrise English School. Hello! I want English lessons for my son. Of course. What's his name? Daniel Brooks. How do you spell Brooks? B. R. double O. K. S. Thank you. And how old is Daniel? He's twelve. Twelve. OK. What's your phone number? It's oh double seven, four double five, two oh one. Oh double seven, four double five, two oh one. Great. The lesson is in room fourteen. Room fourteen. Thank you! Goodbye. Goodbye!",
      "script": "Narrator: Listening three. A phone call. Listen and complete.\nA: Hello, Sunrise English School.\nB: Hello! I want English lessons for my son.\nA: Of course. What's his name?\nB: Daniel Brooks.\nA: How do you spell Brooks?\nB: B. R. double O. K. S.\nA: Thank you. And how old is Daniel?\nB: He's twelve.\nA: Twelve. OK. What's your phone number?\nB: It's oh double seven, four double five, two oh one.\nA: Oh double seven, four double five, two oh one. Great. The lesson is in room fourteen.\nB: Room fourteen. Thank you! Goodbye.\nA: Goodbye!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
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

COURSE_BEGINNER.blocks[0].lessons[0].handout = courseExerciseHandout(COURSE_BEGINNER.blocks[0].lessons[0]);

/* ---------- Block 1, Lesson 2: Hello! Names and countries ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[1], {
  goals: ['Greet people and say "Nice to meet you"', 'Use I\'m / you\'re / he\'s / she\'s (the verb "be")', 'Say where people are from: countries and nationalities'],
  warmups: [
    { emoji: '🔤', title: 'Spell it fast (from Lesson 1)', time: '5 min', how: 'Say a name or a country ("Turkey!"). Pairs race to spell it on a piece of paper. The first pair to hold it up with the right spelling gets a point. 6–8 words.' },
    { emoji: '🎴', title: 'Find your twin', time: '7 min', how: 'Give every student a card with a name and a country — each card has one twin. Students walk around: "Hi! What\'s your name?" "Where are you from?" until they find the classmate with the same country. Pairs sit down together.' }
  ],
  slides: [
    { emoji: '🌍👋', title: 'Hello! Names and countries', body: 'Today we learn:\n• greetings\n• I\'m · you\'re · he\'s · she\'s\n• countries and nationalities' },
    { emoji: '🔤', title: 'Warm-up: Spell it fast', body: 'Listen to the word.\nWrite it with your partner — fast!\nHold it up when you are ready. ✋' },
    { emoji: '👋', title: 'Greetings', body: 'Hello! · Hi!\nGood morning ☀️ (before 12)\nGood afternoon 🌤️ (12 – 6)\nGood evening 🌙 (after 6)\nGoodbye! · Bye! · See you!' },
    { emoji: '🤝', title: 'Nice to meet you', body: 'A: Hi, I\'m Adam. What\'s your name?\nB: I\'m Lucy.\nA: Nice to meet you, Lucy.\nB: Nice to meet you too!' },
    { emoji: '🧩', title: 'The verb "be"', body: 'I am → I\'m\nyou are → you\'re\nhe is → he\'s · she is → she\'s · it is → it\'s\nwe are → we\'re · they are → they\'re' },
    { emoji: '🗺️', title: 'Countries', body: 'Italy · Canada · Russia · Turkey\nthe UK · the USA · China · Japan\nKorea · Germany · France · Spain' },
    { emoji: '🏳️', title: 'Nationalities', body: 'Italy → Italian · Canada → Canadian\nRussia → Russian · Korea → Korean · Germany → German\nTurkey → Turkish · the UK → British · Spain → Spanish\nthe USA → American\nChina → Chinese · Japan → Japanese\nFrance → French' },
    { emoji: '❓', title: 'Where are you from?', body: 'A: Where are you from?\nB: I\'m from Italy. I\'m Italian.\nA: Where is Ken from?\nB: He\'s from Japan. He\'s Japanese.' },
    { emoji: '✅', title: 'Yes or no?', body: 'Are you from Spain?\n→ Yes, I am. / No, I\'m not.\nIs she British?\n→ Yes, she is. / No, she isn\'t.' },
    { emoji: '🎴', title: 'Pair work: Find your twin', body: 'Take a card. Walk and ask:\n"What\'s your name?"\n"Where are you from?"\nFind the student from the same country! 🔍' },
    { emoji: '📖', title: 'Read: Hello from Mei', body: 'Hello! I\'m Mei. I\'m thirteen.\nI\'m from China. I\'m Chinese.\nMy best friend is Ana. She\'s from Spain.\nShe\'s Spanish. We\'re in class 7B.' },
    { emoji: '🏁', title: 'Well done!', body: 'Today you can:\n✅ say hello and goodbye\n✅ use I\'m / he\'s / she\'s\n✅ say where you are from\n\nHomework: the revision test 📲' }
  ],
  handout: {
    title: 'Hello! Names and countries',
    sections: [
      { skill: 'listening', title: 'Listen. Where are they from? Match.',
        items: ['1. Ken  ·  a) the USA', '2. Sophie  ·  b) Japan', '3. Jack  ·  c) Turkey', '4. Elif  ·  d) France'] },
      { skill: 'reading', title: 'Read and write T (true) or F (false).',
        text: 'Hi! I\'m Carlos. I\'m twelve and I\'m from Spain. My friend Emma is from the UK. She\'s British. Her brother Tom is fourteen. They\'re in my school.',
        items: ['1. Carlos is Spanish. ___', '2. Carlos is fourteen. ___', '3. Emma is American. ___', '4. Tom is Emma\'s brother. ___'] },
      { skill: 'writing', title: 'Write the nationality.',
        items: ['Italy → __________', 'Russia → __________', 'China → __________', 'Turkey → __________', 'the USA → __________', 'Germany → __________'] },
      { skill: 'writing', title: 'Write am, is or are.',
        items: ['1. I ____ from Italy.', '2. She ____ Japanese.', '3. We ____ in class 7B.', '4. ____ you from Russia?', '5. He ____ my friend.', '6. They ____ from France.'] },
      { skill: 'speaking', title: 'Pair work: ask three classmates and write.',
        text: 'Name  ·  Country  ·  Nationality\n1. ______________________________\n2. ______________________________\n3. ______________________________' }
    ],
    teacherScript: ['Read the four introductions aloud (or press 🔊): Ken — Japan; Sophie — France; Jack — the USA; Elif — Turkey.'],
    answers: [
      'Listening: 1 b · 2 d · 3 a · 4 c',
      'Reading: 1 T · 2 F (twelve) · 3 F (British) · 4 T',
      'Nationalities: Italian · Russian · Chinese · Turkish · American · German',
      'am / is / are: 1 am · 2 is · 3 are · 4 Are · 5 is · 6 are'
    ]
  },
  listen: [
    { label: 'Exercise 1 — where are they from?', text: 'One. Hello, my name is Ken. I am from Japan. Two. Hi! I am Sophie. I am French — I am from France. Three. Hello, I am Jack. I am from the USA. I am American. Four. Hi, my name is Elif. I am from Turkey.' }
  ],
  test: [
    { q: 'I _____ from Italy.', a: 'am', wrong: ['is', 'are', 'be'] },
    { q: 'She _____ my friend.', a: 'is', wrong: ['am', 'are', 'be'] },
    { q: 'They _____ from Spain.', a: 'are', wrong: ['is', 'am', 'be'] },
    { q: '_____ you from Russia? — Yes, I am.', a: 'Are', wrong: ['Is', 'Am', 'Do'] },
    { q: 'Is he Turkish? — No, he _____.', a: 'isn\'t', wrong: ['aren\'t', 'not', 'don\'t'] },
    { q: 'I\'m from Japan. I\'m _____.', a: 'Japanese', wrong: ['Japan', 'Japanish', 'Japanian'] },
    { q: 'He\'s from China. He\'s _____.', a: 'Chinese', wrong: ['Chinish', 'China', 'Chinan'] },
    { q: 'She\'s from the UK. She\'s _____.', a: 'British', wrong: ['UK', 'Britain', 'Britanish'] },
    { q: 'We\'re from the USA. We\'re _____.', a: 'American', wrong: ['USA', 'Americish', 'Amerikan'] },
    { q: 'I\'m Italian. I\'m from _____.', a: 'Italy', wrong: ['Italian', 'Italish', 'Italiany'] },
    { q: 'Good _____! (at 8 in the morning)', a: 'morning', wrong: ['evening', 'night', 'afternoon'] },
    { q: 'Good _____! (at 7 in the evening)', a: 'evening', wrong: ['morning', 'afternoon', 'day'] },
    { q: 'Nice to _____ you!', a: 'meet', wrong: ['see', 'look', 'know'] },
    { q: '_____ are you from? — I\'m from Korea.', a: 'Where', wrong: ['What', 'Who', 'How'] },
    { q: 'What\'s your _____? — My name is Lucy.', a: 'name', wrong: ['from', 'country', 'old'] },
    { q: 'he is = _____', a: 'he\'s', wrong: ['he\'re', 'his', 'he\'m'] },
    { q: 'they are = _____', a: 'they\'re', wrong: ['they\'s', 'their', 'they\'m'] },
    { q: 'Ana is from Spain. _____ Spanish.', a: 'She\'s', wrong: ['He\'s', 'I\'m', 'They\'re'] },
    { q: 'How do you spell "France"? — F-R-A-_____-C-E', a: 'N', wrong: ['M', 'S', 'R'] },
    { q: 'Goodbye! — _____!', a: 'Bye', wrong: ['Hello', 'Thanks', 'Morning'] }
  ]
});

/* ---------- Block 1, Lesson 3: My family ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[2], {
  goals: ['Name family members', 'Use his / her and \'s ("Alex\'s sister")', 'Use have got / has got and say ages'],
  warmups: [
    { emoji: '🌍', title: 'Who am I? (from Lesson 2)', time: '5 min', how: 'One student thinks of a famous person. The class asks yes/no questions: "Are you from the USA?" "Are you a woman?" "Are you a singer?" Ten questions to guess.' },
    { emoji: '🌳', title: 'Family tree guess', time: '8 min', how: 'Students draw a simple family tree with only first names. The partner points and asks: "Who is this?" — "That\'s my aunt." "How old is she?" — "She\'s 35." Then swap.' }
  ],
  slides: [
    { emoji: '👨‍👩‍👧‍👦', title: 'My family', body: 'Today we learn:\n• family words\n• his / her and \'s\n• I have got · she has got' },
    { emoji: '🌍', title: 'Warm-up: Who am I?', body: 'Think of a famous person.\nThe class asks: "Are you from…?" "Are you a…?"\nAnswer only: "Yes, I am." / "No, I\'m not."' },
    { emoji: '👪', title: 'Family words', body: 'mother 👩 · father 👨 → parents\nsister 👧 · brother 👦\ngrandmother 👵 · grandfather 👴 → grandparents\naunt · uncle · cousin\ndaughter · son' },
    { emoji: '🌳', title: 'Alex\'s family', body: 'Kevin + Diana → Alex, Zara\nKevin is Alex\'s father.\nDiana is Alex\'s mother.\nZara is Alex\'s sister.' },
    { emoji: '🔑', title: 'His or her?', body: 'Alex → HIS sister\nZara → HER brother\nThis is my friend Tom. His mother is a teacher.\nThis is Sara. Her father is a doctor.' },
    { emoji: '✏️', title: '\'s = belongs to', body: 'Alex\'s sister = the sister of Alex\nmy mother\'s name\nTom\'s brother is 17.\n⚠️ "Alex\'s a student" = Alex IS a student' },
    { emoji: '🎒', title: 'have got / has got', body: 'I / you / we / they have got → I\'ve got two sisters.\nhe / she has got → She\'s got a brother.\nHave you got a cousin? — Yes, I have. / No, I haven\'t.' },
    { emoji: '🎂', title: 'How old…?', body: 'How old is your brother?\n— He\'s seventeen.\nHow old are your grandparents?\n— They\'re seventy and sixty-eight.' },
    { emoji: '👥', title: 'Pair work: Family tree guess', body: 'Draw your family tree (names only).\nAsk: "Who is this?" "How old is she?"\nTell: "This is my uncle. His name is…"' },
    { emoji: '📝', title: 'Write about your family', body: 'My name is Nora. I\'m 13.\nI\'ve got a brother and a sister.\nMy brother\'s name is Jack. He\'s 16.\nMy mother is a teacher. Her name is Mary.' },
    { emoji: '🏁', title: 'Well done!', body: 'Today you can:\n✅ name your family\n✅ use his / her and \'s\n✅ say "I\'ve got…"\n\nHomework: the revision test 📲' }
  ],
  handout: {
    title: 'My family',
    sections: [
      { skill: 'listening', title: 'Listen to Sam. Write the ages.',
        items: ['mother: ______', 'father: ______', 'sister Kate: ______', 'grandmother: ______'] },
      { skill: 'reading', title: 'Read and answer.',
        text: 'Hi, I\'m Nora. I\'m thirteen. I\'ve got one brother and one sister. My brother\'s name is Jack — he\'s sixteen. My sister Lily is nine. My mother\'s name is Mary. She\'s a teacher. My father is a doctor. His name is Robert.',
        items: ['1. How old is Nora? __________', '2. What\'s her brother\'s name? __________', '3. How old is Lily? __________', '4. What is her mother\'s job? __________', '5. What\'s her father\'s name? __________'] },
      { skill: 'writing', title: 'Write his or her.',
        items: ['1. This is Tom. ____ sister is ten.', '2. This is Sara. ____ father is a doctor.', '3. Alex and ____ brother are at school.', '4. My aunt and ____ son live in London.'] },
      { skill: 'writing', title: 'Write have got or has got.',
        items: ['1. I ________ two brothers.', '2. She ________ a cousin.', '3. We ________ a big family.', '4. My uncle ________ three children.'] },
      { skill: 'writing', title: 'Write about your family (5–6 sentences).',
        text: '________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________' }
    ],
    teacherScript: ['Read Sam\'s text aloud (or press 🔊).'],
    answers: [
      'Listening: mother 41 · father 45 · sister Kate 8 · grandmother 72',
      'Reading: 1 thirteen · 2 Jack · 3 nine · 4 a teacher · 5 Robert',
      'his / her: 1 His · 2 Her · 3 his · 4 her',
      'have / has got: 1 have got · 2 has got · 3 have got · 4 has got'
    ]
  },
  listen: [
    { label: 'Exercise 1 — Sam\'s family', text: 'Hi, I am Sam. This is my family. My mother is forty-one. My father is forty-five. My sister\'s name is Kate. She is eight. And this is my grandmother. She is seventy-two.' }
  ],
  test: [
    { q: 'My mother\'s mother is my _____.', a: 'grandmother', wrong: ['aunt', 'sister', 'cousin'] },
    { q: 'My father\'s brother is my _____.', a: 'uncle', wrong: ['cousin', 'son', 'grandfather'] },
    { q: 'My aunt\'s son is my _____.', a: 'cousin', wrong: ['brother', 'uncle', 'nephew'] },
    { q: 'My mother and father are my _____.', a: 'parents', wrong: ['grandparents', 'cousins', 'children'] },
    { q: 'This is Tom. _____ sister is ten.', a: 'His', wrong: ['Her', 'He', 'Him'] },
    { q: 'This is Sara. _____ brother is a doctor.', a: 'Her', wrong: ['His', 'She', 'Hers'] },
    { q: 'I _____ two sisters.', a: 'have got', wrong: ['has got', 'am got', 'got have'] },
    { q: 'She _____ a cousin in London.', a: 'has got', wrong: ['have got', 'is got', 'got has'] },
    { q: '_____ you got a brother? — Yes, I have.', a: 'Have', wrong: ['Has', 'Are', 'Do'] },
    { q: 'Has he got a sister? — No, he _____.', a: 'hasn\'t', wrong: ['haven\'t', 'isn\'t', 'doesn\'t'] },
    { q: 'The sister of Alex = Alex\'s _____', a: 'sister', wrong: ['sisters', 'brother', 'mother'] },
    { q: '_____ old is your brother? — He\'s 17.', a: 'How', wrong: ['What', 'Who', 'Where'] },
    { q: 'My grandparents _____ seventy.', a: 'are', wrong: ['is', 'am', 'has'] },
    { q: 'Zara is a girl. She is Alex\'s _____.', a: 'sister', wrong: ['brother', 'son', 'uncle'] },
    { q: 'Alex is a boy. He is his parents\' _____.', a: 'son', wrong: ['daughter', 'aunt', 'mother'] },
    { q: 'Who is this? — _____ my aunt.', a: 'That\'s', wrong: ['Those', 'She', 'Her'] },
    { q: 'I\'ve got = I _____ got', a: 'have', wrong: ['has', 'am', 'is'] },
    { q: 'My uncle\'s wife is my _____.', a: 'aunt', wrong: ['cousin', 'sister', 'niece'] },
    { q: 'Where is your mother _____? — She\'s from Canada.', a: 'from', wrong: ['in', 'at', 'of'] },
    { q: 'Forty-five = _____', a: '45', wrong: ['54', '40', '55'] }
  ]
});

/* ---------- Block 1, Lesson 4: Things in the classroom ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[3], {
  goals: ['Name 14 classroom things', 'Use a / an and plurals (pens, boxes, children)', 'Use this / that / these / those and understand classroom instructions'],
  warmups: [
    { emoji: '👪', title: 'Family whispers (from Lesson 3)', time: '5 min', how: 'Teams stand in lines. Whisper a sentence to the first student ("Alex\'s aunt has got two sons"). It travels down the line; the last student writes it on the board. The closest sentence wins.' },
    { emoji: '🛍️', title: 'Mystery bag', time: '7 min', how: 'Put classroom things in a bag. A student feels one without looking and guesses: "Is it a ruler?" The class answers "Yes, it is!" / "No, it isn\'t." Then: "What\'s this in English?"' }
  ],
  slides: [
    { emoji: '🎒✏️', title: 'Things in the classroom', body: 'Today we learn:\n• classroom things\n• a / an and plurals\n• this · that · these · those\n• classroom instructions' },
    { emoji: '👂', title: 'Warm-up: Family whispers', body: 'Stand in a line.\nWhisper the sentence to the next student.\nThe last student writes it on the board. 📝' },
    { emoji: '🖊️', title: 'Classroom things', body: 'pen · pencil · rubber (eraser) · ruler\nbook · notebook · dictionary · bag\ndesk · chair · board · window · door · computer' },
    { emoji: '🍎', title: 'a or an?', body: 'a + consonant sound: a pen · a book · a desk\nan + vowel sound (a e i o u): an apple · an eraser · an umbrella\n⚠️ an hour · a university' },
    { emoji: '➕', title: 'One → many', body: 'pen → pens · book → books\nbox → boxes · watch → watches · bus → buses\ndictionary → dictionaries\nman → men · woman → women · child → children' },
    { emoji: '👉', title: 'this · that · these · those', body: 'near me 🤚: this pen · these pens\nfar from me 👉: that door · those windows' },
    { emoji: '❓', title: 'What\'s this in English?', body: 'A: What\'s this in English?\nB: It\'s a ruler.\nA: What are these?\nB: They\'re pencils.\nA: How do you spell it?' },
    { emoji: '📣', title: 'Classroom instructions', body: 'Open your book. · Close your book.\nListen and repeat. · Work in pairs.\nStand up. · Sit down.\nLook at the board. · Write your name.' },
    { emoji: '🙋', title: 'Game: Simon says', body: 'Do it only when you hear "Simon says"!\n"Simon says: stand up." → stand up ✅\n"Sit down." → don\'t move! ❌' },
    { emoji: '🛍️', title: 'Pair work: Mystery bag', body: 'Feel the thing. Don\'t look!\n"Is it a pen?" — "Yes, it is!" / "No, it isn\'t."\n"What\'s this in English?"' },
    { emoji: '🏁', title: 'Well done!', body: 'Today you can:\n✅ name things in the classroom\n✅ use a / an and plurals\n✅ use this, that, these, those\n\nHomework: the revision test 📲' }
  ],
  handout: {
    title: 'Things in the classroom',
    sections: [
      { skill: 'listening', title: 'Listen. What is in Sara\'s bag? Tick ✓.',
        items: ['☐ a pen', '☐ a ruler', '☐ two pencils', '☐ a dictionary', '☐ an apple', '☐ a notebook', '☐ a phone', '☐ three books'] },
      { skill: 'listening', title: 'Listen to your teacher and do it.',
        text: 'Stand up · Sit down · Open your book · Close your notebook · Look at the window · Write your name' },
      { skill: 'writing', title: 'Write a or an.',
        items: ['1. ____ pencil', '2. ____ eraser', '3. ____ apple', '4. ____ desk', '5. ____ umbrella', '6. ____ notebook'] },
      { skill: 'writing', title: 'Write the plural.',
        items: ['pen → __________', 'box → __________', 'watch → __________', 'dictionary → __________', 'child → __________', 'woman → __________'] },
      { skill: 'reading', title: 'Read and answer.',
        text: 'This is my classroom. It\'s big. There are twenty desks and twenty-one chairs. The board is white. These are my books, and that is my teacher\'s computer. Those windows are very big.',
        items: ['1. Is the classroom small? __________', '2. How many desks are there? __________', '3. What colour is the board? __________', '4. Whose computer is that? __________'] }
    ],
    teacherScript: ['Exercise 1: press 🔊 (Sara\'s bag). Exercise 2: say the instructions in any order; students do them.'],
    answers: [
      'Sara\'s bag: a pen ✓ · two pencils ✓ · an apple ✓ · a notebook ✓ · three books ✓ (no ruler, dictionary or phone)',
      'a / an: 1 a · 2 an · 3 an · 4 a · 5 an · 6 a',
      'Plurals: pens · boxes · watches · dictionaries · children · women',
      'Reading: 1 No, it isn\'t (it\'s big). · 2 twenty · 3 white · 4 the teacher\'s'
    ]
  },
  listen: [
    { label: 'Exercise 1 — Sara\'s bag', text: 'Hi, I am Sara. What is in my bag? I have got a pen, two pencils and a notebook. I have got three books. And I have got an apple for lunch!' }
  ],
  test: [
    { q: 'I write with a _____.', a: 'pen', wrong: ['desk', 'door', 'window'] },
    { q: 'You sit on a _____.', a: 'chair', wrong: ['board', 'ruler', 'pencil'] },
    { q: '_____ apple', a: 'an', wrong: ['a', 'the a', 'two'] },
    { q: '_____ pencil', a: 'a', wrong: ['an', 'two a', 'an a'] },
    { q: '_____ eraser', a: 'an', wrong: ['a', 'one an', 'the an'] },
    { q: 'one box, two _____', a: 'boxes', wrong: ['boxs', 'box', 'boxies'] },
    { q: 'one child, three _____', a: 'children', wrong: ['childs', 'childrens', 'childes'] },
    { q: 'one dictionary, two _____', a: 'dictionaries', wrong: ['dictionarys', 'dictionaryes', 'dictionary'] },
    { q: 'one woman, two _____', a: 'women', wrong: ['womans', 'womens', 'woman'] },
    { q: '_____ is my pen. (here, in my hand)', a: 'This', wrong: ['These', 'Those', 'They'] },
    { q: '_____ are my books. (here, on my desk)', a: 'These', wrong: ['This', 'That', 'It'] },
    { q: 'Look at _____ window over there!', a: 'that', wrong: ['these', 'those', 'this is'] },
    { q: '_____ birds in the sky are beautiful. (far away)', a: 'Those', wrong: ['That', 'This', 'These is'] },
    { q: 'What\'s this in English? — _____ a ruler.', a: 'It\'s', wrong: ['They\'re', 'This', 'Its'] },
    { q: 'What are these? — _____ pencils.', a: 'They\'re', wrong: ['It\'s', 'This is', 'There'] },
    { q: '_____ your book, please. (page 10!)', a: 'Open', wrong: ['Sit', 'Stand', 'Listen'] },
    { q: 'Work in _____. (two students)', a: 'pairs', wrong: ['pears', 'peers', 'parts'] },
    { q: 'Listen and _____. (say it again)', a: 'repeat', wrong: ['return', 'remember', 'read'] },
    { q: 'Stand up! — Now sit _____.', a: 'down', wrong: ['up', 'on', 'in'] },
    { q: 'r-u-l-e-r = _____', a: 'ruler', wrong: ['rubber', 'river', 'rule'] }
  ]
});

/* ---------- Block 1, Lesson 5: Days, months and the time ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[4], {
  goals: ['Say the days of the week and the months', 'Say dates with ordinal numbers: "the 3rd of May"', 'Tell the time and use on / in / at'],
  warmups: [
    { emoji: '🙋', title: 'Simon says (from Lesson 4)', time: '4 min', how: 'Play "Simon says" with classroom instructions: "Simon says: open your book… Simon says: stand up… sit down!" Anyone who moves without "Simon says" sits out.' },
    { emoji: '🎂', title: 'Birthday line', time: '8 min', how: 'Students stand in a line in the order of their birthdays (January → December) — without writing, only by asking "When\'s your birthday?" "It\'s on the 5th of March." Check the line together at the end.' }
  ],
  slides: [
    { emoji: '📅🕒', title: 'Days, months and the time', body: 'Today we learn:\n• days and months\n• dates: the 3rd of May\n• telling the time\n• on · in · at' },
    { emoji: '🙋', title: 'Warm-up: Simon says', body: 'Listen carefully!\nMove only after "Simon says". 😄' },
    { emoji: '📆', title: 'Days of the week', body: 'Monday · Tuesday · Wednesday · Thursday\nFriday · Saturday · Sunday\nSaturday + Sunday = the weekend 🎉\n⚠️ Always a capital letter!' },
    { emoji: '🗓️', title: 'Months', body: 'January · February · March · April\nMay · June · July · August\nSeptember · October · November · December' },
    { emoji: '🥇', title: 'First, second, third…', body: '1st first · 2nd second · 3rd third · 4th fourth\n5th fifth · 8th eighth · 9th ninth · 12th twelfth\n20th twentieth · 21st twenty-first · 22nd twenty-second\n30th thirtieth · 31st thirty-first' },
    { emoji: '🎂', title: 'Dates', body: 'We write: 3 May · 3rd May\nWe say: "the third of May"\nWhen\'s your birthday? — It\'s on the 21st of October.\nWhat\'s the date today? — It\'s the…' },
    { emoji: '📍', title: 'on · in · at', body: 'on + days and dates: on Monday · on the 5th of June\nin + months and years: in July · in 2026\nat + times: at 7 o\'clock · at half past three' },
    { emoji: '🕒', title: 'What time is it?', body: '7:00 seven o\'clock · 7:30 half past seven\n7:15 quarter past seven · 7:45 quarter to eight\n7:10 ten past seven · 7:50 ten to eight\nor simply: seven fifty' },
    { emoji: '🗒️', title: 'My week', body: 'On Monday I\'ve got English at 9 o\'clock.\nOn Wednesday I\'ve got football at half past four.\nOn Saturday I get up at ten! 😴' },
    { emoji: '🎂', title: 'Pair work: Birthday line', body: 'Ask: "When\'s your birthday?"\nStand in order: January → December.\nNo writing — only English! 🗣️' },
    { emoji: '🏁', title: 'Well done!', body: 'Today you can:\n✅ say days and months\n✅ say dates\n✅ tell the time\n\nNext: the review lesson, then the exam! 🏁' }
  ],
  handout: {
    title: 'Days, months and the time',
    sections: [
      { skill: 'listening', title: 'Listen and complete James\'s timetable.',
        items: ['Monday — English at ______', '______ — football at 4:30', 'Thursday — piano at ______', 'Saturday — get up at ______'] },
      { skill: 'writing', title: 'Write the times in words.',
        items: ['8:00 ______________', '9:30 ______________', '3:15 ______________', '6:45 ______________', '11:10 ______________'] },
      { skill: 'writing', title: 'Write on, in or at.',
        items: ['1. ____ Friday', '2. ____ August', '3. ____ 6 o\'clock', '4. ____ the 2nd of March', '5. ____ 2027', '6. ____ half past four'] },
      { skill: 'reading', title: 'Read and answer.',
        text: 'My name is Ben. My birthday is on the 12th of February. On weekdays I get up at seven o\'clock. School starts at half past eight. On Tuesday and Thursday I\'ve got swimming at five. My favourite day is Saturday!',
        items: ['1. When is Ben\'s birthday? __________', '2. What time does school start? __________', '3. When has he got swimming? __________', '4. What is his favourite day? __________'] },
      { skill: 'speaking', title: 'Ask five classmates: "When\'s your birthday?"',
        text: 'Name · Birthday\n1. ______________________\n2. ______________________\n3. ______________________\n4. ______________________\n5. ______________________' }
    ],
    teacherScript: ['Exercise 1: press 🔊 (James\'s week), twice.'],
    answers: [
      'Timetable: Monday — English at 9 o\'clock · Wednesday — football · Thursday — piano at 6:15 · Saturday — get up at 10',
      'Times: eight o\'clock · half past nine · quarter past three · quarter to seven · ten past eleven',
      'on / in / at: 1 on · 2 in · 3 at · 4 on · 5 in · 6 at',
      'Reading: 1 the 12th of February · 2 half past eight · 3 on Tuesday and Thursday (at five) · 4 Saturday'
    ]
  },
  listen: [
    { label: 'Exercise 1 — James\'s week', text: 'Hi, I am James. On Monday I have got English at nine o\'clock. On Wednesday I have got football at half past four. On Thursday I have got piano at quarter past six. And on Saturday I get up at ten o\'clock!' }
  ],
  test: [
    { q: 'Monday, Tuesday, _____, Thursday', a: 'Wednesday', wrong: ['Wensday', 'Friday', 'Sunday'] },
    { q: 'Saturday and Sunday are the _____.', a: 'weekend', wrong: ['weekday', 'week', 'holiday'] },
    { q: 'The month after March is _____.', a: 'April', wrong: ['May', 'February', 'August'] },
    { q: 'The last month of the year is _____.', a: 'December', wrong: ['November', 'January', 'October'] },
    { q: '3rd = _____', a: 'third', wrong: ['three', 'threeth', 'thirdth'] },
    { q: '2nd = _____', a: 'second', wrong: ['twoth', 'two', 'secondth'] },
    { q: '21st = _____', a: 'twenty-first', wrong: ['twenty-one', 'twenty-oneth', 'twentieth-first'] },
    { q: 'My birthday is _____ the 5th of June.', a: 'on', wrong: ['in', 'at', 'of'] },
    { q: 'We have got a holiday _____ August.', a: 'in', wrong: ['on', 'at', 'of'] },
    { q: 'The lesson starts _____ 9 o\'clock.', a: 'at', wrong: ['in', 'on', 'of'] },
    { q: 'I play football _____ Saturday.', a: 'on', wrong: ['in', 'at', 'to'] },
    { q: '7:30 = half _____ seven', a: 'past', wrong: ['to', 'after', 'of'] },
    { q: '6:45 = quarter _____ seven', a: 'to', wrong: ['past', 'of', 'before'] },
    { q: '8:00 = eight _____', a: 'o\'clock', wrong: ['hours', 'times', 'clock'] },
    { q: '2:15 = quarter past _____', a: 'two', wrong: ['three', 'one', 'fifteen'] },
    { q: '_____ time is it? — It\'s ten o\'clock.', a: 'What', wrong: ['How', 'Which', 'When'] },
    { q: '_____ your birthday? — It\'s in May.', a: 'When\'s', wrong: ['What\'s', 'Where\'s', 'Who\'s'] },
    { q: 'What\'s the _____ today? — It\'s the 2nd of November.', a: 'date', wrong: ['day', 'time', 'month'] },
    { q: 'There are _____ days in a week.', a: 'seven', wrong: ['five', 'six', 'twelve'] },
    { q: 'There are _____ months in a year.', a: 'twelve', wrong: ['ten', 'seven', 'twenty'] }
  ]
});

/* ---------- Block 1: the review lesson ---------- */
COURSE_BEGINNER.blocks[0].review = {
  title: 'Block 1 review', emoji: '🔁', skills: ['listening', 'reading', 'writing', 'speaking'],
  goals: ['Practise everything from Lessons 1–5 with games', 'Know what is in the exam: grammar, listening, reading, writing', 'Find what to practise again before the exam'],
  warmups: [
    { emoji: '🏃', title: 'Board race', time: '8 min', how: 'Two teams, one marker each. Say a word ("Wednesday", "children", "Japanese"). One student from each team runs and writes it. Right spelling = 1 point. Everyone gets a turn.' },
    { emoji: '🔍', title: 'Find someone who…', time: '10 min', how: 'Students use the sheet on the handout. They walk and ask: "Have you got a sister?" "Is your birthday in May?" When someone says yes, they write that name. First to fill five lines wins.' }
  ],
  slides: [
    { emoji: '🔁🎮', title: 'Block 1 review', body: 'Games from Lessons 1–5:\n🔤 letters and numbers · 🌍 countries\n👪 family · 🎒 classroom · 🕒 days and time\nThen: what\'s in the exam?' },
    { emoji: '🏃', title: 'Round 1: Board race', body: 'Two teams. Listen to the word.\nRun, write it on the board — correctly!\n✅ = 1 point' },
    { emoji: '🎯', title: 'Round 2: Number bingo', body: 'Draw a 3 × 3 grid. Write 9 numbers from 1 to 100.\nListen and cross out.\nThree in a line → "BINGO!" 🎉' },
    { emoji: '🌍', title: 'Round 3: Where are they from?', body: 'Ken → Japan → Japanese\nSophie → France → ?\nCarlos → Spain → ?\nElif → Turkey → ?\nYou → ? → ?' },
    { emoji: '👪', title: 'Round 4: Family quiz', body: 'My mother\'s mother is my…?\nMy uncle\'s son is my…?\nThis is Tom. ___ sister is ten. (his / her)\nShe ___ got two brothers. (have / has)' },
    { emoji: '🎒', title: 'Round 5: What\'s in the bag?', body: 'Look for 10 seconds. Close your eyes!\nWhat\'s missing?\n"Is it a ruler?" "Are they pencils?"' },
    { emoji: '🕒', title: 'Round 6: Time race', body: 'Say it first!\n7:30 · 9:15 · 4:45 · 12:00\nthe 1st of May · the 22nd of July\non / in / at: ___ Monday · ___ June · ___ 5 o\'clock' },
    { emoji: '🔍', title: 'Find someone who…', body: '…has got a sister.\n…has a birthday in winter.\n…has got a dictionary in their bag.\n…gets up before 7 o\'clock.\n…can spell "Wednesday".' },
    { emoji: '🏁', title: 'The exam', body: 'Next lesson — the Block 1 exam:\n📝 grammar · 🎧 listening · 📖 reading — on your phone, with your ID\n✍️ writing — on paper\nPractise: the review test 📲' }
  ],
  handout: {
    title: 'Block 1 review',
    sections: [
      { skill: 'listening', title: 'Listen and write the numbers and letters.',
        items: ['1. ______', '2. ______', '3. ______', '4. ______', '5. ______', '6. ______'] },
      { skill: 'writing', title: 'Countries and nationalities. Complete.',
        items: ['Japan → __________', '__________ → Turkish', 'the UK → __________', '__________ → Chinese'] },
      { skill: 'writing', title: 'Choose the right word.',
        items: ['1. This is Alex. (His / Her) mother is a nurse.', '2. I (have got / has got) two cousins.', '3. (This / These) are my books.', '4. My birthday is (in / on / at) the 3rd of May.', '5. I\'ve got (a / an) umbrella.', '6. They (is / are) from Russia.'] },
      { skill: 'reading', title: 'Read and write T (true) or F (false).',
        text: 'Hi! I\'m Megan. I\'m from London. I\'ve got one brother, Tim. He\'s eleven. His birthday is on the 30th of September. In my bag I\'ve got two notebooks and an English book. My English lesson is on Monday at half past nine.',
        items: ['1. Megan has got a sister. ___', '2. Tim is eleven. ___', '3. Tim\'s birthday is in September. ___', '4. Her English lesson is on Tuesday. ___'] },
      { skill: 'speaking', title: 'Find someone who… (write a name)',
        text: '…has got a sister: __________\n…has a birthday in winter: __________\n…has got a dictionary in their bag: __________\n…gets up before 7 o\'clock: __________\n…can spell "Wednesday": __________' }
    ],
    teacherScript: ['Exercise 1: press 🔊 (numbers and letters).'],
    answers: [
      'Listening: 1. 17 · 2. 70 · 3. W · 4. 48 · 5. J · 6. 0 9 9 – 3 1 5',
      'Nationalities: Japanese · Turkey · British · China',
      'Choose: 1 His · 2 have got · 3 These · 4 on · 5 an · 6 are',
      'Reading: 1 F · 2 T · 3 T · 4 F'
    ]
  },
  listen: [
    { label: 'Exercise 1 — numbers and letters', text: 'Number one: seventeen. Number two: seventy. Number three: the letter W. Number four: forty-eight. Number five: the letter J. Number six: oh double nine, three one five.' }
  ],
  test: [
    { q: 'X, Y, _____', a: 'Z', wrong: ['W', 'V', 'S'] },
    { q: '19 = _____', a: 'nineteen', wrong: ['ninety', 'nine', 'ninteen'] },
    { q: '70 = _____', a: 'seventy', wrong: ['seventeen', 'seven', 'seventy-one'] },
    { q: 'How do you _____ your name?', a: 'spell', wrong: ['speak', 'say it', 'name'] },
    { q: 'He _____ from Turkey.', a: 'is', wrong: ['are', 'am', 'have'] },
    { q: 'We _____ students.', a: 'are', wrong: ['is', 'am', 'has'] },
    { q: 'Are they from Japan? — Yes, they _____.', a: 'are', wrong: ['is', 'do', 'have'] },
    { q: 'She\'s from France. She\'s _____.', a: 'French', wrong: ['France', 'Frenchy', 'Francish'] },
    { q: 'I\'m from Korea. I\'m _____.', a: 'Korean', wrong: ['Korea', 'Koreish', 'Korese'] },
    { q: 'Good _____! (at 3 pm)', a: 'afternoon', wrong: ['morning', 'night', 'evening'] },
    { q: 'My father\'s father is my _____.', a: 'grandfather', wrong: ['uncle', 'brother', 'cousin'] },
    { q: 'This is Lucy. _____ brother is 16.', a: 'Her', wrong: ['His', 'She', 'Hers'] },
    { q: 'Tom _____ two cousins.', a: 'has got', wrong: ['have got', 'is got', 'got has'] },
    { q: 'Have you got a sister? — No, I _____.', a: 'haven\'t', wrong: ['hasn\'t', 'am not', 'don\'t'] },
    { q: 'the brother of Sara = _____ brother', a: 'Sara\'s', wrong: ['Saras', 'Sara is', 'Sara'] },
    { q: '_____ umbrella', a: 'an', wrong: ['a', 'two', 'an a'] },
    { q: 'one watch, two _____', a: 'watches', wrong: ['watchs', 'watch', 'watchies'] },
    { q: 'one man, two _____', a: 'men', wrong: ['mans', 'mens', 'man'] },
    { q: '_____ are my pencils. (here)', a: 'These', wrong: ['This', 'That', 'It'] },
    { q: 'What\'s _____ over there? — It\'s a door.', a: 'that', wrong: ['these', 'those', 'they'] },
    { q: '_____ the window, please. (it\'s cold!)', a: 'Close', wrong: ['Open', 'Sit', 'Write'] },
    { q: 'Thursday, _____, Saturday', a: 'Friday', wrong: ['Monday', 'Sunday', 'Wednesday'] },
    { q: 'The month after June is _____.', a: 'July', wrong: ['May', 'August', 'January'] },
    { q: '5th = _____', a: 'fifth', wrong: ['fiveth', 'five', 'fifeth'] },
    { q: '12th = _____', a: 'twelfth', wrong: ['twelveth', 'twelve', 'twentieth'] },
    { q: 'The party is _____ Saturday.', a: 'on', wrong: ['in', 'at', 'of'] },
    { q: 'School starts _____ September.', a: 'in', wrong: ['on', 'at', 'of'] },
    { q: 'I get up _____ 7 o\'clock.', a: 'at', wrong: ['in', 'on', 'to'] },
    { q: '9:15 = quarter _____ nine', a: 'past', wrong: ['to', 'of', 'after'] },
    { q: '4:45 = quarter to _____', a: 'five', wrong: ['four', 'six', 'forty-five'] }
  ]
};

/* ---------- Block 1: the exam (Beginner: grammar, listening, reading online · writing on paper) ---------- */
COURSE_BEGINNER.blocks[0].exam = {
  title: 'Block 1 exam', emoji: '🏁', skills: ['listening', 'reading', 'writing'], keepOrder: true,
  intro: 'Grammar, listening and reading are one online test (students open the link and enter their ID; it\'s marked automatically). Writing is on paper — you mark it out of 10 and type the marks below. Total: 30 + 10 = 40.',
  slides: [
    { emoji: '🏁📝', title: 'Block 1 exam', body: 'Today: the exam for Lessons 1–5.\n📱 Part 1–3 on your phone: grammar, listening, reading\n✍️ Part 4 on paper: writing\nPhones: open the link and enter your ID.' },
    { emoji: '📝', title: 'Part 1: Grammar', body: 'Questions 1–12.\nChoose the right answer.\nThen wait — don\'t start the listening yet! ✋' },
    { emoji: '🎧', title: 'Part 2: Listening', body: 'Questions 13–20.\nListen to Jennifer and Daniel.\nYou hear each text two times. 🔁' },
    { emoji: '📖', title: 'Part 3: Reading', body: 'Hello! My name is Amy and I\'m twelve years old. I\'m from Bristol, in the UK. I\'ve got a big family: my mother, my father, two brothers and a grandmother. My brothers\' names are Ben and Sam. Ben is fifteen and Sam is nine. My grandmother is seventy-three. Her birthday is on the 1st of January! My favourite day is Friday because I\'ve got art at half past two. In my school bag I\'ve got four notebooks, a pencil case and an English dictionary.' },
    { emoji: '✍️', title: 'Part 4: Writing (on paper)', body: 'Write about yourself — 40 to 60 words:\n• your name and age · where you are from\n• your family\n• your birthday\n• what is in your school bag' },
    { emoji: '🎉', title: 'Finished!', body: 'Press the button to send your answers. 📤\nGive your writing to your teacher.\nWell done — Block 1 is complete! 🏆' }
  ],
  handout: {
    title: 'Block 1 exam — paper',
    sections: [
      { skill: 'reading', title: 'Part 3: Read the text. Answer questions 21–30 on your phone.',
        text: 'Hello! My name is Amy and I\'m twelve years old. I\'m from Bristol, in the UK. I\'ve got a big family: my mother, my father, two brothers and a grandmother. My brothers\' names are Ben and Sam. Ben is fifteen and Sam is nine. My grandmother is seventy-three. Her birthday is on the 1st of January! My favourite day is Friday because I\'ve got art at half past two. In my school bag I\'ve got four notebooks, a pencil case and an English dictionary.' },
      { skill: 'writing', title: 'Part 4: Write about yourself (40–60 words). Your name and age, where you are from, your family, your birthday, what is in your school bag.',
        text: '________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________' }
    ],
    teacherScript: ['Part 2: press 🔊 for each text and play it TWICE. Students answer questions 13–16 (Jennifer) and 17–20 (Daniel) on their phones.'],
    answers: [
      'Online part (30) is marked automatically.',
      'Writing (10): task — all five points: name/age, country, family, birthday, school bag (4) · grammar — am/is/are, have got, his/her (3) · words — enough and right (2) · spelling and capital letters (1).'
    ]
  },
  listen: [
    { label: 'Part 2 — Text 1: Jennifer (questions 13–16)', text: 'Hello! My name is Jennifer. That\'s J, E, double N, I, F, E, R. I am fourteen years old and I am from the UK. My phone number is oh nine three, four four seven, two oh eight. My birthday is on the eighteenth of April.' },
    { label: 'Part 2 — Text 2: Daniel (questions 17–20)', text: 'Hi, I am Daniel and I am German — I am from Germany. I have got two sisters, Anna and Lisa. In my bag I have got a dictionary and two pens. My English lesson is on Friday at quarter past ten.' }
  ],
  writing: { max: 10 },
  test: [
    { part: 'grammar', q: 'Grammar 1. My sister _____ ten years old.', a: 'is', wrong: ['are', 'am', 'has'] },
    { part: 'grammar', q: 'Grammar 2. _____ you from Canada? — Yes, I am.', a: 'Are', wrong: ['Is', 'Am', 'Have'] },
    { part: 'grammar', q: 'Grammar 3. They\'re from the USA. They\'re _____.', a: 'American', wrong: ['USA', 'Americish', 'Amerikan'] },
    { part: 'grammar', q: 'Grammar 4. This is Jack. _____ father is a doctor.', a: 'His', wrong: ['Her', 'He', 'Him'] },
    { part: 'grammar', q: 'Grammar 5. My grandparents _____ a big house.', a: 'have got', wrong: ['has got', 'is got', 'are got'] },
    { part: 'grammar', q: 'Grammar 6. the car of my father = my _____ car', a: 'father\'s', wrong: ['fathers', 'father', 'father is'] },
    { part: 'grammar', q: 'Grammar 7. I\'ve got _____ orange.', a: 'an', wrong: ['a', 'two', 'the an'] },
    { part: 'grammar', q: 'Grammar 8. one child, four _____', a: 'children', wrong: ['childs', 'childrens', 'child'] },
    { part: 'grammar', q: 'Grammar 9. _____ are my friends over there. (far)', a: 'Those', wrong: ['That', 'This', 'These is'] },
    { part: 'grammar', q: 'Grammar 10. Her birthday is _____ the 9th of March.', a: 'on', wrong: ['in', 'at', 'of'] },
    { part: 'grammar', q: 'Grammar 11. The lesson starts _____ half past eight.', a: 'at', wrong: ['on', 'in', 'to'] },
    { part: 'grammar', q: 'Grammar 12. 22nd = _____', a: 'twenty-second', wrong: ['twenty-two', 'twenty-twoth', 'twentieth-second'] },
    { part: 'listening', q: 'Listening 13. Her name is J-E-N-N-I-_____-E-R.', a: 'F', wrong: ['V', 'P', 'S'] },
    { part: 'listening', q: 'Listening 14. Jennifer is _____ years old.', a: '14', wrong: ['40', '13', '4'] },
    { part: 'listening', q: 'Listening 15. Her phone number is 093 447 _____.', a: '208', wrong: ['280', '218', '802'] },
    { part: 'listening', q: 'Listening 16. Her birthday is on the _____ of April.', a: '18th', wrong: ['8th', '80th', '28th'] },
    { part: 'listening', q: 'Listening 17. Daniel is _____.', a: 'German', wrong: ['Spanish', 'French', 'Turkish'] },
    { part: 'listening', q: 'Listening 18. Daniel has got two _____.', a: 'sisters', wrong: ['brothers', 'cousins', 'sons'] },
    { part: 'listening', q: 'Listening 19. In his bag there is a _____.', a: 'dictionary', wrong: ['ruler', 'phone', 'apple'] },
    { part: 'listening', q: 'Listening 20. His English lesson is at _____.', a: 'quarter past ten', wrong: ['half past ten', 'quarter to ten', 'ten o\'clock'] },
    { part: 'reading', q: 'Reading 21. Amy is _____ years old.', a: '12', wrong: ['15', '9', '73'] },
    { part: 'reading', q: 'Reading 22. She is from _____.', a: 'Bristol', wrong: ['London', 'Manchester', 'Germany'] },
    { part: 'reading', q: 'Reading 23. She has got _____ brothers.', a: 'two', wrong: ['three', 'one', 'four'] },
    { part: 'reading', q: 'Reading 24. Sam is _____.', a: 'nine', wrong: ['fifteen', 'twelve', 'nineteen'] },
    { part: 'reading', q: 'Reading 25. Ben is Amy\'s _____.', a: 'brother', wrong: ['father', 'cousin', 'uncle'] },
    { part: 'reading', q: 'Reading 26. Her grandmother is _____.', a: 'seventy-three', wrong: ['thirty-seven', 'seventy', 'sixty-three'] },
    { part: 'reading', q: 'Reading 27. Her grandmother\'s birthday is on the _____ of January.', a: '1st', wrong: ['3rd', '21st', '31st'] },
    { part: 'reading', q: 'Reading 28. Amy\'s favourite day is _____.', a: 'Friday', wrong: ['Monday', 'Saturday', 'Sunday'] },
    { part: 'reading', q: 'Reading 29. She has got art at _____.', a: 'half past two', wrong: ['two o\'clock', 'quarter past two', 'half past three'] },
    { part: 'reading', q: 'Reading 30. In her bag she has got four _____.', a: 'notebooks', wrong: ['pencils', 'dictionaries', 'books'] }
  ]
};

const TA_COURSES = [COURSE_BEGINNER];
