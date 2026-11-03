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
      "text": "Hello! What's your name? Hi, I'm Emma. How do you spell that? That's E, double M, A. Thanks, Emma. And what's your name? My name's Jack. Can you spell it for me? That's J, A, C, K. Oh, hello! Are you the new teacher? Yes, I am. I'm Mr Green. Green. How do you spell that? That's G, R, double E, N. Next, please. What's your name? My name's Sophie. Can you spell it, please? That's S, O, P, H, I, E. And what about you? I'm Lizzy. Lizzy. And the spelling? That's L, I, double Z, Y. Great. Thank you, everyone!",
      "script": "Narrator: Listening one. Spell your name. Listen and write the names.\nB: Hello! What's your name?\nB: Hi, I'm Emma.\nB: How do you spell that?\nB: That's E, double M, A.\nB: Thanks, Emma. And what's your name?\nB: My name's Jack.\nB: Can you spell it for me?\nB: That's J, A, C, K.\nB: Oh, hello! Are you the new teacher?\nB: Yes, I am. I'm Mr Green.\nB: Green. How do you spell that?\nB: That's G, R, double E, N.\nB: Next, please. What's your name?\nB: My name's Sophie.\nB: Can you spell it, please?\nB: That's S, O, P, H, I, E.\nB: And what about you?\nB: I'm Lizzy.\nB: Lizzy. And the spelling?\nB: That's L, I, double Z, Y.\nB: Great. Thank you, everyone!"
    },
    {
      "label": "Listening 2 — Numbers (5 people)",
      "src": "audio/course/b1l1-listening-2.mp3",
      "text": "Number one. Hi, I'm Tom, and I'm thirteen years old. Number two. This is my grandmother. She's seventy-two, but she still plays tennis! Number three. Hello, I'm Sara. My class is small. There are fifteen students in it. Number four. My name's Ben. I take the bus to school. It's bus number forty-eight. Number five. Our school is really big. We've got ninety computers!",
      "script": "Narrator: Listening two. Listen and circle the right number.\nNarrator: Number one.\nB: Hi, I'm Tom, and I'm thirteen years old.\nNarrator: Number two.\nB: This is my grandmother. She's seventy-two, but she still plays tennis!\nNarrator: Number three.\nB: Hello, I'm Sara. My class is small. There are fifteen students in it.\nNarrator: Number four.\nB: My name's Ben. I take the bus to school. It's bus number forty-eight.\nNarrator: Number five.\nB: Our school is really big. We've got ninety computers!"
    },
    {
      "label": "Listening 3 — A phone call to an English school",
      "src": "audio/course/b1l1-listening-3.mp3",
      "text": "Hello, Sunrise English School. Hello. I'd like English lessons for my son, please. Of course. What's his name? His name's Daniel Brooks. And how do you spell Brooks? That's B, R, double O, K, S. Thank you. How old is Daniel? He's twelve. Twelve, OK. And what's your phone number? It's oh double seven, four double five, two oh one. Oh double seven, four double five, two oh one. Lovely. His lesson is in room fourteen. Room fourteen. Thank you very much. Goodbye. Goodbye, and thank you for calling!",
      "script": "Narrator: Listening three. A phone call. Listen and complete.\nB: Hello, Sunrise English School.\nB: Hello. I'd like English lessons for my son, please.\nB: Of course. What's his name?\nB: His name's Daniel Brooks.\nB: And how do you spell Brooks?\nB: That's B, R, double O, K, S.\nB: Thank you. How old is Daniel?\nB: He's twelve.\nB: Twelve, OK. And what's your phone number?\nB: It's oh double seven, four double five, two oh one.\nB: Oh double seven, four double five, two oh one. Lovely. His lesson is in room fourteen.\nB: Room fourteen. Thank you very much. Goodbye.\nB: Goodbye, and thank you for calling!"
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


/* ---------- Block 1, Lesson 2: Hello! Names and countries ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[1], {
  // A 2-hour lesson (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude
  // (Kokoro voices, audio/course/*.mp3). Generated from a script; the slides (deck) and the handout come from `exercises`.
  skills: [
    "listening",
    "reading",
    "writing",
    "speaking"
  ],
  goals: [
    "Greet people at different times of the day and say \"Nice to meet you\"",
    "Use the verb \"be\": I'm, you're, he's, she's, we're, they're",
    "Say countries and nationalities — with capital letters",
    "Ask and answer: \"Where are you from?\" \"Are you…?\" \"Yes, I am. / No, I'm not.\""
  ],
  warmups: [
    {
      "emoji": "🔤",
      "title": "Spell it fast (from Lesson 1)",
      "time": "5 min",
      "how": "Say a name or a country. Pairs race to spell it on paper; the first right spelling held up wins a point."
    },
    {
      "emoji": "🎴",
      "title": "Find your twin",
      "time": "7 min",
      "how": "Every student gets a card with a name and a country; each card has one twin. Students ask \"Where are you from?\" until they find their twin."
    },
    {
      "emoji": "🕵️",
      "title": "Who am I?",
      "time": "7 min",
      "how": "A student is a famous person. The class asks \"Are you from the USA?\" \"Are you a singer?\" — answers only \"Yes, I am / No, I'm not.\""
    }
  ],
  exercises: [
    {
      "id": "greet",
      "type": "match",
      "skill": "reading",
      "title": "Match the greeting and the answer.",
      "items": [
        {
          "q": "Hello!",
          "a": "Hi!"
        },
        {
          "q": "Nice to meet you.",
          "a": "Nice to meet you too."
        },
        {
          "q": "How are you?",
          "a": "I'm fine, thanks."
        },
        {
          "q": "Goodbye!",
          "a": "Bye! See you!"
        },
        {
          "q": "What's your name?",
          "a": "I'm Lucy."
        },
        {
          "q": "Thank you!",
          "a": "You're welcome."
        }
      ]
    },
    {
      "id": "times",
      "type": "choose",
      "skill": "reading",
      "title": "Circle the right greeting.",
      "items": [
        {
          "q": "8 o'clock in the morning ☀️",
          "opts": [
            "Good morning",
            "Good evening",
            "Good night"
          ],
          "a": "a"
        },
        {
          "q": "2 o'clock in the afternoon 🌤️",
          "opts": [
            "Good evening",
            "Good afternoon",
            "Good morning"
          ],
          "a": "b"
        },
        {
          "q": "7 o'clock in the evening 🌙",
          "opts": [
            "Good afternoon",
            "Good morning",
            "Good evening"
          ],
          "a": "c"
        },
        {
          "q": "11 o'clock at night — you go to bed 🛏️",
          "opts": [
            "Good night",
            "Good morning",
            "Hello"
          ],
          "a": "a"
        },
        {
          "q": "You leave school.",
          "opts": [
            "Hello!",
            "Goodbye!",
            "Good morning!"
          ],
          "a": "b"
        },
        {
          "q": "You meet a new friend.",
          "opts": [
            "See you!",
            "Nice to meet you!",
            "Good night!"
          ],
          "a": "b"
        }
      ]
    },
    {
      "id": "lis_greet",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 1: Listen to five short dialogues. Circle the right answer.",
      "items": [
        {
          "q": "Dialogue 1 is in the…",
          "opts": [
            "morning",
            "afternoon",
            "evening"
          ],
          "a": "a"
        },
        {
          "q": "In dialogue 2, the new girl's name is…",
          "opts": [
            "Kate",
            "Katie",
            "Cathy"
          ],
          "a": "b"
        },
        {
          "q": "In dialogue 3, Mr Hill is…",
          "opts": [
            "fine",
            "tired",
            "happy"
          ],
          "a": "a"
        },
        {
          "q": "Dialogue 4 is in the…",
          "opts": [
            "morning",
            "afternoon",
            "evening"
          ],
          "a": "c"
        },
        {
          "q": "In dialogue 5, the boys say…",
          "opts": [
            "Hello!",
            "Nice to meet you!",
            "See you tomorrow!"
          ],
          "a": "c"
        }
      ],
      "listen": 0
    },
    {
      "id": "be",
      "type": "gap",
      "skill": "writing",
      "title": "Write am, is or are.",
      "items": [
        {
          "q": "I ___ from Canada.",
          "a": "am"
        },
        {
          "q": "She ___ my friend.",
          "a": "is"
        },
        {
          "q": "We ___ in class 7B.",
          "a": "are"
        },
        {
          "q": "They ___ from Japan.",
          "a": "are"
        },
        {
          "q": "He ___ twelve.",
          "a": "is"
        },
        {
          "q": "You ___ a good student!",
          "a": "are"
        },
        {
          "q": "It ___ a big school.",
          "a": "is"
        },
        {
          "q": "Tom and I ___ friends.",
          "a": "are"
        }
      ]
    },
    {
      "id": "becorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes.",
      "items": [
        {
          "q": "She are from Spain.",
          "a": "She is (She's) from Spain."
        },
        {
          "q": "I is twelve.",
          "a": "I am (I'm) twelve."
        },
        {
          "q": "They is my friends.",
          "a": "They are my friends."
        },
        {
          "q": "He from Italy.",
          "a": "He is (He's) from Italy."
        },
        {
          "q": "We is in class 6A.",
          "a": "We are in class 6A."
        }
      ]
    },
    {
      "id": "nat",
      "type": "match",
      "skill": "reading",
      "title": "Match the country and the nationality.",
      "items": [
        {
          "q": "Italy",
          "a": "Italian"
        },
        {
          "q": "Spain",
          "a": "Spanish"
        },
        {
          "q": "Japan",
          "a": "Japanese"
        },
        {
          "q": "the UK",
          "a": "British"
        },
        {
          "q": "the USA",
          "a": "American"
        },
        {
          "q": "France",
          "a": "French"
        },
        {
          "q": "China",
          "a": "Chinese"
        },
        {
          "q": "Germany",
          "a": "German"
        }
      ]
    },
    {
      "id": "natodd",
      "type": "odd",
      "skill": "reading",
      "title": "Which word is different? Circle it.",
      "items": [
        {
          "q": "Spain   France   German   Italy",
          "a": "German (a nationality)"
        },
        {
          "q": "Japanese   Chinese   Russia   British",
          "a": "Russia (a country)"
        },
        {
          "q": "morning   evening   Hello   afternoon",
          "a": "Hello (not a time of day)"
        },
        {
          "q": "he's   she's   it's   my",
          "a": "my"
        },
        {
          "q": "Hi   Hello   Goodbye   Good morning",
          "a": "Goodbye (not hello)"
        },
        {
          "q": "am   is   are   from",
          "a": "from"
        }
      ]
    },
    {
      "id": "lis_from",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 2: Five students at a summer school. Where are they from?",
      "items": [
        {
          "q": "Ken is from ____________.",
          "a": "Japan"
        },
        {
          "q": "Sophie is ____________.",
          "a": "French"
        },
        {
          "q": "Carlos is from ____________.",
          "a": "Spain"
        },
        {
          "q": "Mei is ____________.",
          "a": "Chinese"
        },
        {
          "q": "Jack is from ____________.",
          "a": "the USA"
        }
      ],
      "listen": 1
    },
    {
      "id": "short",
      "type": "choose",
      "skill": "speaking",
      "title": "Circle the right short answer.",
      "items": [
        {
          "q": "Are you from Italy? (✔)",
          "opts": [
            "Yes, I am.",
            "Yes, I'm.",
            "Yes, I is."
          ],
          "a": "a"
        },
        {
          "q": "Is she British? (✘)",
          "opts": [
            "No, she not.",
            "No, she isn't.",
            "No, she aren't."
          ],
          "a": "b"
        },
        {
          "q": "Are they from Spain? (✔)",
          "opts": [
            "Yes, they are.",
            "Yes, they is.",
            "Yes, they're."
          ],
          "a": "a"
        },
        {
          "q": "Is he your friend? (✔)",
          "opts": [
            "Yes, he's.",
            "Yes, he is.",
            "Yes, he am."
          ],
          "a": "b"
        },
        {
          "q": "Are you twelve? (✘)",
          "opts": [
            "No, I'm not.",
            "No, I amn't.",
            "No, I not."
          ],
          "a": "a"
        },
        {
          "q": "Is it a big school? (✘)",
          "opts": [
            "No, it isn't.",
            "No, it not.",
            "No, it aren't."
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "qorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the words in order. Write the question.",
      "items": [
        {
          "q": "from / you / are / where",
          "a": "Where are you from?"
        },
        {
          "q": "name / what's / your",
          "a": "What's your name?"
        },
        {
          "q": "she / is / American",
          "a": "Is she American?"
        },
        {
          "q": "you / are / how",
          "a": "How are you?"
        },
        {
          "q": "your / friend / he / is",
          "a": "Is he your friend?"
        },
        {
          "q": "they / where / from / are",
          "a": "Where are they from?"
        }
      ]
    },
    {
      "id": "lis_camp",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: At a summer camp. Listen and complete.",
      "items": [
        {
          "q": "The girl's name is Anna ____________.",
          "a": "Baker (B-A-K-E-R)"
        },
        {
          "q": "True or false: Anna is from Spain.  T / F",
          "a": "F — she's from Poland"
        },
        {
          "q": "Anna is ________ years old.",
          "a": "13"
        },
        {
          "q": "Her friend Rosa is ____________.",
          "a": "Mexican"
        },
        {
          "q": "True or false: They are in group B.  T / F",
          "a": "T"
        }
      ],
      "listen": 2
    },
    {
      "id": "camp_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read the camp profiles. True (T) or false (F)?",
      "items": [
        {
          "q": "Mei is Chinese.",
          "a": "T"
        },
        {
          "q": "Carlos is fifteen.",
          "a": "F (12)"
        },
        {
          "q": "Pablo is Carlos's brother.",
          "a": "T"
        },
        {
          "q": "Emma is American.",
          "a": "F (British)"
        },
        {
          "q": "Emma and Mei are in group A.",
          "a": "T"
        }
      ],
      "text": "Hi! I'm Mei. I'm thirteen and I'm from China. I'm Chinese. I'm at the summer camp with my friend Kate.\n\nHello! My name's Carlos. I'm twelve. I'm from Spain, so I'm Spanish. My brother Pablo is here too — he's fifteen.\n\nHi, I'm Emma. I'm from the UK — I'm British. I'm fourteen. My best friend here is Mei. We're in group A."
    },
    {
      "id": "camp_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "Where is Mei from?",
          "a": "She's from China."
        },
        {
          "q": "How old is Carlos?",
          "a": "He's twelve."
        },
        {
          "q": "What nationality is Carlos?",
          "a": "Spanish"
        },
        {
          "q": "Who is Emma's best friend?",
          "a": "Mei"
        },
        {
          "q": "How old is Pablo?",
          "a": "He's fifteen."
        }
      ]
    },
    {
      "id": "aboutme",
      "type": "write",
      "skill": "writing",
      "title": "Write about you and a friend.",
      "items": [
        {
          "q": "My name is…",
          "a": "(students' own)"
        },
        {
          "q": "I'm from…  I'm… (nationality)",
          "a": "(students' own)"
        },
        {
          "q": "I'm… years old.",
          "a": "(students' own)"
        },
        {
          "q": "My friend's name is…",
          "a": "(students' own)"
        },
        {
          "q": "He / She is from…",
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
          "q": "Good ___ ! (at 9 pm)",
          "opts": [
            "morning",
            "evening",
            "afternoon"
          ],
          "a": "b"
        },
        {
          "q": "They ___ from Italy.",
          "opts": [
            "is",
            "am",
            "are"
          ],
          "a": "c"
        },
        {
          "q": "the USA →",
          "opts": [
            "American",
            "Americish",
            "USA-ian"
          ],
          "a": "a"
        },
        {
          "q": "Is he French? — No, he ___.",
          "opts": [
            "isn't",
            "aren't",
            "not"
          ],
          "a": "a"
        },
        {
          "q": "Nice to meet you! — ",
          "opts": [
            "Nice to meet you too!",
            "Good night!",
            "I'm fine."
          ],
          "a": "a"
        },
        {
          "q": "Which needs a capital letter?",
          "opts": [
            "spanish",
            "Spanish",
            "both"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 2 (2 hours). Greet the class at the door: \"Good morning! / Good afternoon!\" Students need the handout (15 exercises)."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "👋",
          "text": "Greetings for every time of the day"
        },
        {
          "emoji": "🧩",
          "text": "Grammar: I'm, you're, he's, she's, we're, they're"
        },
        {
          "emoji": "🌍",
          "text": "Words: 12 countries and nationalities"
        },
        {
          "emoji": "🎧",
          "text": "Listening: dialogues, a summer school, a summer camp"
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
      "title": "From Lesson 1: can you remember?",
      "rows": [
        "How do you spell your name?",
        {
          "q": "What is 13 + 17?",
          "a": "thirty"
        },
        {
          "q": "Which letters sound like A?",
          "a": "H, J, K"
        },
        {
          "q": "How do we say 0 in a phone number?",
          "a": "\"oh\""
        },
        {
          "q": "What's the number after nineteen?",
          "a": "twenty"
        }
      ],
      "notes": "Ask around the class. Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Spell it fast",
      "emoji": "🔤",
      "minutes": 5,
      "text": "Listen to the word.\nWork with your partner: write it — fast!\nHold it up when you are ready. ✋\nRight spelling = 1 point",
      "notes": "Words: Spain, Japan, hello, morning, friend, twelve."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "👋",
          "word": "hello",
          "tr": "Hello! Hi!"
        },
        {
          "emoji": "🙋",
          "word": "goodbye",
          "tr": "Bye! See you!"
        },
        {
          "emoji": "🌍",
          "word": "country",
          "tr": "Spain, Japan"
        },
        {
          "emoji": "🏳️",
          "word": "nationality",
          "tr": "Spanish, Japanese"
        },
        {
          "emoji": "🤝",
          "word": "friend",
          "tr": "Lucy is my friend."
        },
        {
          "emoji": "📍",
          "word": "from",
          "tr": "I'm from Italy."
        },
        {
          "emoji": "☀️",
          "word": "morning",
          "tr": "Good morning!"
        },
        {
          "emoji": "🌙",
          "word": "evening",
          "tr": "Good evening!"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · GREETINGS",
      "title": "Hello and goodbye",
      "boxes": [
        {
          "head": "☀️ Morning (before 12)",
          "body": "Good morning!"
        },
        {
          "head": "🌤️ Afternoon (12 – 6)",
          "body": "Good afternoon!"
        },
        {
          "head": "🌙 Evening (after 6)",
          "body": "Good evening!"
        },
        {
          "head": "👋 Any time",
          "body": "Hello! · Hi!\nGoodbye! · Bye! · See you!"
        }
      ],
      "foot": "\"Good night!\" = when you go to bed 🛏️",
      "notes": "Show a clock time, students say the greeting. Then act out meeting / leaving."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · MEETING PEOPLE",
      "title": "Nice to meet you!",
      "boxes": [
        {
          "head": "🤝 New people",
          "body": "A: Hi, I'm Ben.\nB: Hi, Ben. I'm Lucy.\nA: Nice to meet you!\nB: Nice to meet you too!"
        },
        {
          "head": "😊 Friends",
          "body": "A: How are you?\nB: I'm fine, thanks. And you?\nA: I'm OK, thank you."
        }
      ],
      "foot": "Say \"Nice to meet you\" only the first time you meet someone",
      "notes": "Students stand up and meet three classmates."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Greeting mistakes everyone makes",
      "rows": [
        {
          "wrong": "Good night! (when you arrive)",
          "right": "Good evening! (Good night = goodbye)"
        },
        {
          "wrong": "Nice to meet you! (to your best friend)",
          "right": "Hi! / How are you?"
        },
        {
          "wrong": "I fine.",
          "right": "I'm fine."
        },
        {
          "wrong": "How are you? — I'm 12.",
          "right": "How are you? — I'm fine."
        },
        {
          "wrong": "Good afternoon! (at 9 am)",
          "right": "Good morning!"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "greet",
      "notes": "Handout exercise 1. Click each row to show the matching letter."
    },
    {
      "layout": "exercise",
      "ex": "times",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "Five short dialogues",
      "listen": 0,
      "text": "Five short dialogues: people meet and say goodbye.\nListen and circle the right answer (handout exercise 3).",
      "tips": [
        "Listen for the time of day",
        "Listen for names",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_greet",
      "notes": "Handout exercise 3 (Listening 1). Click to check."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 2 · THE VERB \"BE\"",
      "title": "I'm, you're, he's…",
      "tiles": [
        "I am → I'm",
        "you are → you're",
        "he is → he's",
        "she is → she's",
        "it is → it's",
        "we are → we're",
        "they are → they're"
      ],
      "notes": "Point at a student: \"He's Tom.\" \"She's Lucy.\" Then \"We're students.\"",
      "small": true,
      "cols": 4,
      "foot": "I → am · he / she / it → is · you / we / they → are"
    },
    {
      "layout": "exercise",
      "ex": "be",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "becorrect",
      "notes": "Handout exercise 5. Students find the mistake first, then click."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 3 · COUNTRIES",
      "title": "Countries and nationalities",
      "tiles": [
        "Italy Italian",
        "Spain Spanish",
        "the UK British",
        "the USA American",
        "Canada Canadian",
        "Mexico Mexican",
        "France French",
        "Germany German",
        "Russia Russian",
        "Japan Japanese",
        "China Chinese",
        "Turkey Turkish"
      ],
      "notes": "Say the country, students say the nationality. Clap the stress: ja-pa-NESE, ITA-ly / i-TA-li-an.",
      "small": true,
      "cols": 4,
      "foot": "Countries and nationalities start with a CAPITAL letter"
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Country mistakes everyone makes",
      "rows": [
        {
          "wrong": "I'm from Spanish.",
          "right": "I'm from Spain. / I'm Spanish."
        },
        {
          "wrong": "He is english.",
          "right": "He is English."
        },
        {
          "wrong": "I'm from USA.",
          "right": "I'm from the USA."
        },
        {
          "wrong": "She is Japan.",
          "right": "She is Japanese."
        },
        {
          "wrong": "Where you are from?",
          "right": "Where are you from?"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "nat",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "exercise",
      "ex": "natodd",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "game",
      "tag": "SPEAKING · PAIR WORK",
      "title": "Find your twin",
      "emoji": "🎴",
      "minutes": 7,
      "text": "Take a card. Walk and ask:\n\"Hi! What's your name?\"\n\"Where are you from?\"\nFind the student from the same country! 🔍",
      "notes": "Prepare cards in pairs: two \"Italy\", two \"Japan\"…"
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Where are they from?",
      "listen": 1,
      "text": "Five students at a summer school say where they are from.\nListen and complete (handout exercise 8).",
      "tips": [
        "A country — or a nationality?",
        "Use a capital letter",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_from",
      "notes": "Handout exercise 8 (Listening 2). Click to check."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · QUESTIONS",
      "title": "Are you…? Yes, I am!",
      "boxes": [
        {
          "head": "❓ Questions",
          "body": "Are you from Italy?\nIs he Spanish?\nIs she your friend?\nAre they twelve?"
        },
        {
          "head": "✅ Yes",
          "body": "Yes, I am.\nYes, he is.\nYes, she is.\nYes, they are."
        },
        {
          "head": "❌ No",
          "body": "No, I'm not.\nNo, he isn't.\nNo, she isn't.\nNo, they aren't."
        }
      ],
      "foot": "Short \"Yes\" answers never use 'm / 's: Yes, I am ✓ — Yes, I'm ✗",
      "notes": "Ask students yes/no questions about famous people."
    },
    {
      "layout": "exercise",
      "ex": "short",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "exercise",
      "ex": "qorder",
      "notes": "Handout exercise 10. Then pairs ask each other the questions."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Who am I?",
      "emoji": "🕵️",
      "minutes": 7,
      "text": "Think of a famous person.\nThe class asks: \"Are you from the USA?\" \"Are you a singer?\"\nAnswer only: \"Yes, I am.\" / \"No, I'm not.\"\n10 questions to guess!",
      "notes": "Start with a famous footballer."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "At a summer camp",
      "listen": 2,
      "text": "A camp leader meets two new girls.\nListen and complete (handout exercise 11):\nher surname, her country, her age and her friend.",
      "tips": [
        "The surname is spelled slowly",
        "Two true / false questions",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_camp",
      "notes": "Handout exercise 11 (Listening 3). Click to check."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Hello from summer camp!",
      "text": "Hi! I'm Mei. I'm thirteen and I'm from China. I'm Chinese. I'm at the summer camp with my friend Kate.\n\nHello! My name's Carlos. I'm twelve. I'm from Spain, so I'm Spanish. My brother Pablo is here too — he's fifteen.\n\nHi, I'm Emma. I'm from the UK — I'm British. I'm fourteen. My best friend here is Mei. We're in group A.",
      "tips": [
        "Name · Age · Country",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (3 min)."
    },
    {
      "layout": "exercise",
      "ex": "camp_tf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "camp_q",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "exercise",
      "ex": "aboutme",
      "notes": "Handout exercise 14. Then students read their text to a partner.",
      "minutes": 7
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — or two teams: the first right answer wins a point."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can say hello and goodbye",
        "I can use I'm, he's, she's, we're",
        "I can say countries and nationalities",
        "I can ask \"Where are you from?\""
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — Five short dialogues",
      "src": "audio/course/b1l2-listening-1.mp3",
      "text": "Dialogue number one. Listen. Good morning, Mrs Brown! Good morning, Tom. You're early today! Number two. Hi! I'm Katie. I'm new here. Oh, hi, Katie! Nice to meet you. I'm Ben. Nice to meet you too, Ben. Number three. Hello, Mr Hill. How are you? I'm fine, thank you. And you? Fine, thanks. Number four. Good evening! Come in, welcome to the party. Good evening! Thank you very much. Number five. Bye, Jack! See you tomorrow! Yes, see you tomorrow, Ben!",
      "script": "Narrator: Listening one. Listen to five short dialogues.\nNarrator: Dialogue number one. Listen.\nA: Good morning, Mrs Brown!\nB: Good morning, Tom. You're early today!\nNarrator: Number two.\nC: Hi! I'm Katie. I'm new here.\nD: Oh, hi, Katie! Nice to meet you. I'm Ben.\nC: Nice to meet you too, Ben.\nNarrator: Number three.\nE: Hello, Mr Hill. How are you?\nF: I'm fine, thank you. And you?\nE: Fine, thanks.\nNarrator: Number four.\nB: Good evening! Come in, welcome to the party.\nA: Good evening! Thank you very much.\nNarrator: Number five.\nD: Bye, Jack! See you tomorrow!\nA: Yes, see you tomorrow, Ben!"
    },
    {
      "label": "Listening 2 — Where are they from?",
      "src": "audio/course/b1l2-listening-2.mp3",
      "text": "Number one. Hello! My name's Ken, and I'm from Japan. Number two. Hi, I'm Sophie. I'm French. Number three. Hi there. I'm Carlos, from Spain. Number four. Hello, everyone. I'm Mei, and I'm Chinese. Number five. Hey! I'm Jack. I'm from the USA.",
      "script": "Narrator: Listening two. Five students at a summer school. Where are they from?\nNarrator: Number one.\nA: Hello! My name's Ken, and I'm from Japan.\nNarrator: Number two.\nB: Hi, I'm Sophie. I'm French.\nNarrator: Number three.\nC: Hi there. I'm Carlos, from Spain.\nNarrator: Number four.\nD: Hello, everyone. I'm Mei, and I'm Chinese.\nNarrator: Number five.\nE: Hey! I'm Jack. I'm from the USA."
    },
    {
      "label": "Listening 3 — At a summer camp",
      "src": "audio/course/b1l2-listening-3.mp3",
      "text": "Hello! Welcome to the camp. What's your name? Hello! My name is Anna Baker, and I am new here. Nice to meet you, Anna. How do you spell Baker? That's B, A, K, E, R. Thanks. Are you from Spain? No, I'm not. I'm from Poland. Poland, OK. And how old are you? I'm thirteen. And who's this with you? This is my friend Rosa. She's Mexican. Hi, Rosa! Right, you two are in group B. Group B? Great, thank you!",
      "script": "Narrator: Listening three. At a summer camp. Listen and complete.\nA: Hello! Welcome to the camp. What's your name?\nB: Hello! My name is Anna Baker, and I am new here.\nA: Nice to meet you, Anna. How do you spell Baker?\nB: That's B, A, K, E, R.\nA: Thanks. Are you from Spain?\nB: No, I'm not. I'm from Poland.\nA: Poland, OK. And how old are you?\nB: I'm thirteen.\nA: And who's this with you?\nB: This is my friend Rosa. She's Mexican.\nA: Hi, Rosa! Right, you two are in group B.\nC: Group B? Great, thank you!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
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
  // A 2-hour lesson (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude
  // (Kokoro voices, audio/course/*.mp3). Generated from a script; the slides (deck) and the handout come from `exercises`.
  skills: [
    "listening",
    "reading",
    "writing",
    "speaking"
  ],
  goals: [
    "Name family members (mother, uncle, cousin…)",
    "Use his / her and 's: \"Alex's sister\", \"her brother\"",
    "Use have got / has got — questions and short answers",
    "Ask and answer about ages: \"How old is your brother?\""
  ],
  warmups: [
    {
      "emoji": "🕵️",
      "title": "Who am I? (from Lesson 2)",
      "time": "5 min",
      "how": "A student is a famous person; the class asks yes/no questions with \"Are you…?\" to guess."
    },
    {
      "emoji": "🌳",
      "title": "Family tree guess",
      "time": "8 min",
      "how": "Students draw a family tree with first names only. The partner points: \"Who is this?\" \"How old is he?\""
    },
    {
      "emoji": "🗣️",
      "title": "Family whispers",
      "time": "5 min",
      "how": "Teams in lines whisper a sentence (\"Alex's aunt has got two sons\"); the last student writes it on the board."
    }
  ],
  exercises: [
    {
      "id": "pairs",
      "type": "match",
      "skill": "reading",
      "title": "Match the pairs: boy ↔ girl.",
      "items": [
        {
          "q": "brother",
          "a": "sister"
        },
        {
          "q": "father",
          "a": "mother"
        },
        {
          "q": "son",
          "a": "daughter"
        },
        {
          "q": "uncle",
          "a": "aunt"
        },
        {
          "q": "grandfather",
          "a": "grandmother"
        },
        {
          "q": "husband",
          "a": "wife"
        },
        {
          "q": "dad",
          "a": "mum"
        },
        {
          "q": "grandson",
          "a": "granddaughter"
        }
      ]
    },
    {
      "id": "tree",
      "type": "gap",
      "skill": "writing",
      "title": "Look at Alex's family tree on the slide. Complete.",
      "items": [
        {
          "q": "Kevin is Alex's ____________.",
          "a": "father"
        },
        {
          "q": "Diana is Alex's ____________.",
          "a": "mother"
        },
        {
          "q": "Zara is Alex's ____________.",
          "a": "sister"
        },
        {
          "q": "Kevin and Diana are Alex's ____________.",
          "a": "parents"
        },
        {
          "q": "Alex is Diana's ____________.",
          "a": "son"
        },
        {
          "q": "Zara is Kevin's ____________.",
          "a": "daughter"
        },
        {
          "q": "Paul is Kevin's brother. He's Alex's ____________.",
          "a": "uncle"
        },
        {
          "q": "Paul's son Sam is Alex's ____________.",
          "a": "cousin"
        }
      ]
    },
    {
      "id": "lis_photo",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 1: Sam talks about a family photo. Write the ages.",
      "items": [
        {
          "q": "Sam's mother: ________",
          "a": "41"
        },
        {
          "q": "Sam's father: ________",
          "a": "45"
        },
        {
          "q": "His sister Kate: ________",
          "a": "8"
        },
        {
          "q": "His grandmother: ________",
          "a": "72"
        },
        {
          "q": "His cousin Oliver: ________",
          "a": "15"
        }
      ],
      "listen": 0
    },
    {
      "id": "hisher",
      "type": "choose",
      "skill": "writing",
      "title": "Circle his or her.",
      "items": [
        {
          "q": "This is Tom. ___ sister is ten.",
          "opts": [
            "His",
            "Her"
          ],
          "a": "a"
        },
        {
          "q": "This is Sara. ___ father is a doctor.",
          "opts": [
            "His",
            "Her"
          ],
          "a": "b"
        },
        {
          "q": "Look at Mrs Hill and ___ son.",
          "opts": [
            "his",
            "her"
          ],
          "a": "b"
        },
        {
          "q": "Mr Brown and ___ daughter are here.",
          "opts": [
            "his",
            "her"
          ],
          "a": "a"
        },
        {
          "q": "My aunt and ___ husband live in London.",
          "opts": [
            "his",
            "her"
          ],
          "a": "b"
        },
        {
          "q": "Ben is with ___ grandfather.",
          "opts": [
            "his",
            "her"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "apos",
      "type": "write",
      "skill": "writing",
      "title": "Write it with 's.",
      "items": [
        {
          "q": "the bag of Tom",
          "a": "Tom's bag"
        },
        {
          "q": "the sister of Lucy",
          "a": "Lucy's sister"
        },
        {
          "q": "the car of my dad",
          "a": "my dad's car"
        },
        {
          "q": "the name of my mum",
          "a": "my mum's name"
        },
        {
          "q": "the dog of Harry",
          "a": "Harry's dog"
        },
        {
          "q": "the house of my grandma",
          "a": "my grandma's house"
        }
      ]
    },
    {
      "id": "havegot",
      "type": "gap",
      "skill": "writing",
      "title": "Write have got or has got.",
      "items": [
        {
          "q": "I ____________ two sisters.",
          "a": "have got"
        },
        {
          "q": "She ____________ a brother.",
          "a": "has got"
        },
        {
          "q": "We ____________ a big family.",
          "a": "have got"
        },
        {
          "q": "My uncle ____________ three children.",
          "a": "has got"
        },
        {
          "q": "They ____________ a dog.",
          "a": "have got"
        },
        {
          "q": "Tom ____________ a cousin in Canada.",
          "a": "has got"
        }
      ]
    },
    {
      "id": "famcorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes.",
      "items": [
        {
          "q": "He have got a sister.",
          "a": "He has got a sister."
        },
        {
          "q": "This is my dad. Her name is Robert.",
          "a": "His name is Robert."
        },
        {
          "q": "I have got 12 years.",
          "a": "I'm 12. / I'm 12 years old."
        },
        {
          "q": "My mother name is Mary.",
          "a": "My mother's name is Mary."
        },
        {
          "q": "She has got two brother.",
          "a": "She has got two brothers."
        }
      ]
    },
    {
      "id": "lis_have",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 2: \"Have you got…?\" Five children answer. True (T) or false (F)?",
      "items": [
        {
          "q": "Leo has got a sister.",
          "a": "F (two brothers)"
        },
        {
          "q": "Mia has got a cousin in Spain.",
          "a": "T"
        },
        {
          "q": "Jack has got a dog.",
          "a": "T"
        },
        {
          "q": "Amy's grandparents have got a big house.",
          "a": "F (a small house)"
        },
        {
          "q": "Daniel hasn't got a brother.",
          "a": "T"
        }
      ],
      "listen": 1
    },
    {
      "id": "famorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the words in order.",
      "items": [
        {
          "q": "got / I / sister / have / a",
          "a": "I have got a sister."
        },
        {
          "q": "old / how / your / is / brother",
          "a": "How old is your brother?"
        },
        {
          "q": "name / her / is / Mary",
          "a": "Her name is Mary."
        },
        {
          "q": "you / have / got / cousin / a",
          "a": "Have you got a cousin?"
        },
        {
          "q": "Tom's / is / this / dad",
          "a": "This is Tom's dad."
        },
        {
          "q": "has / she / got / two / sons",
          "a": "She has got two sons."
        }
      ]
    },
    {
      "id": "lis_new",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: Lucy, a new student, talks to her teacher. Listen and complete.",
      "items": [
        {
          "q": "Lucy's brother is called ____________.",
          "a": "Jake (J-A-K-E)"
        },
        {
          "q": "He is ________ years old.",
          "a": "17"
        },
        {
          "q": "Lucy's mum is a ____________.",
          "a": "nurse"
        },
        {
          "q": "Lucy has got ________ cousins.",
          "a": "3"
        },
        {
          "q": "Her grandmother is ________.",
          "a": "80"
        }
      ],
      "listen": 2
    },
    {
      "id": "fam_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read Nora's text. True (T) or false (F)?",
      "items": [
        {
          "q": "Nora has got two sisters.",
          "a": "F (one brother, one sister)"
        },
        {
          "q": "Harry is sixteen.",
          "a": "T"
        },
        {
          "q": "Nora's dad is a teacher.",
          "a": "F (a doctor)"
        },
        {
          "q": "Max is the family's dog.",
          "a": "T"
        },
        {
          "q": "Leo and Tom are Nora's cousins.",
          "a": "T"
        }
      ],
      "text": "Hi! I'm Nora. I'm thirteen. I've got one brother and one sister. My brother's name is Harry — he's sixteen. My sister Lily is nine.\n\nMy mum's name is Mary. She's a teacher. My dad is a doctor. His name is Robert. We've got a dog — his name is Max.\n\nMy grandparents live near us. Grandma is seventy and Grandpa is seventy-two. My aunt Jane has got two sons — my cousins, Leo and Tom."
    },
    {
      "id": "fam_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "How old is Lily?",
          "a": "She's nine."
        },
        {
          "q": "What's Nora's mum's name?",
          "a": "Mary"
        },
        {
          "q": "How old is Grandpa?",
          "a": "He's seventy-two."
        },
        {
          "q": "Who has got two sons?",
          "a": "Aunt Jane"
        },
        {
          "q": "What's the dog's name?",
          "a": "Max"
        }
      ]
    },
    {
      "id": "famodd",
      "type": "odd",
      "skill": "reading",
      "title": "Which word is different? Circle it.",
      "items": [
        {
          "q": "mother   sister   aunt   brother",
          "a": "brother (the others are women)"
        },
        {
          "q": "son   uncle   daughter   father",
          "a": "daughter"
        },
        {
          "q": "his   her   my   is",
          "a": "is"
        },
        {
          "q": "have   has   got   brother",
          "a": "brother"
        },
        {
          "q": "cousin   parent   uncle   dog",
          "a": "dog"
        },
        {
          "q": "twelve   eighty   old   forty",
          "a": "old"
        }
      ]
    },
    {
      "id": "myfamily",
      "type": "write",
      "skill": "writing",
      "title": "Write about your family (5 sentences).",
      "items": [
        {
          "q": "I've got…",
          "a": "(students' own)"
        },
        {
          "q": "My mother's name is…",
          "a": "(students' own)"
        },
        {
          "q": "My … is … years old.",
          "a": "(students' own)"
        },
        {
          "q": "My father is a…",
          "a": "(students' own)"
        },
        {
          "q": "My grandparents…",
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
          "q": "My mother's sister is my…",
          "opts": [
            "aunt",
            "uncle",
            "cousin"
          ],
          "a": "a"
        },
        {
          "q": "She ___ got a cat.",
          "opts": [
            "have",
            "has",
            "is"
          ],
          "a": "b"
        },
        {
          "q": "This is Ben. ___ mum is a nurse.",
          "opts": [
            "Her",
            "His",
            "He"
          ],
          "a": "b"
        },
        {
          "q": "the bag of Lucy =",
          "opts": [
            "Lucy bag",
            "Lucy's bag",
            "Lucys bag"
          ],
          "a": "b"
        },
        {
          "q": "Have you got a brother? — No, I ___.",
          "opts": [
            "haven't",
            "hasn't",
            "am not"
          ],
          "a": "a"
        },
        {
          "q": "My parents =",
          "opts": [
            "mum and dad",
            "brother and sister",
            "aunt and uncle"
          ],
          "a": "a"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 3 (2 hours). Bring a photo of your own family (on your phone is fine) — students love the teacher's photo. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "👪",
          "text": "Words: family — mother, uncle, cousin…"
        },
        {
          "emoji": "🔑",
          "text": "Grammar: his / her and 's"
        },
        {
          "emoji": "🎒",
          "text": "Grammar: have got / has got"
        },
        {
          "emoji": "🎧",
          "text": "Listening: a family photo, \"Have you got…?\", a new student"
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
      "title": "From Lesson 2: can you remember?",
      "rows": [
        "Where are you from?",
        {
          "q": "Japan → nationality?",
          "a": "Japanese"
        },
        {
          "q": "Say hello at 7 pm.",
          "a": "Good evening!"
        },
        {
          "q": "she is = ?",
          "a": "she's"
        },
        {
          "q": "Is he from Spain? — No, he…",
          "a": "isn't"
        }
      ],
      "notes": "Ask around the class. Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Who am I?",
      "emoji": "🕵️",
      "minutes": 5,
      "text": "Think of a famous person.\nThe class asks \"Are you…?\" questions.\n\"Yes, I am.\" / \"No, I'm not.\"",
      "notes": "From Lesson 2 — a quick round."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "👩",
          "word": "mother",
          "tr": "Mum"
        },
        {
          "emoji": "👨",
          "word": "father",
          "tr": "Dad"
        },
        {
          "emoji": "👧",
          "word": "sister",
          "tr": "Kate is my sister."
        },
        {
          "emoji": "👦",
          "word": "brother",
          "tr": "Harry is my brother."
        },
        {
          "emoji": "👵",
          "word": "grandmother",
          "tr": "Grandma"
        },
        {
          "emoji": "👴",
          "word": "grandfather",
          "tr": "Grandpa"
        },
        {
          "emoji": "👩‍🦰",
          "word": "aunt",
          "tr": "my mum's sister"
        },
        {
          "emoji": "🧔",
          "word": "uncle",
          "tr": "my dad's brother"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · FAMILY WORDS",
      "title": "My family",
      "tiles": [
        "👩 mother",
        "👨 father",
        "👧 sister",
        "👦 brother",
        "👵 grandmother",
        "👴 grandfather",
        "👩‍🦰 aunt",
        "🧔 uncle",
        "🧒 cousin",
        "👶 son",
        "👧 daughter",
        "👫 parents"
      ],
      "notes": "Point at the tiles, students say the word. \"Who is your mother's brother?\" → \"My uncle.\"",
      "small": true,
      "cols": 4,
      "foot": "parents = mother + father · grandparents = grandmother + grandfather"
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · A FAMILY TREE",
      "title": "Alex's family",
      "boxes": [
        {
          "head": "👨👩 Parents",
          "body": "Kevin + Diana"
        },
        {
          "head": "👦👧 Children",
          "body": "Alex and Zara"
        },
        {
          "head": "🧔 Uncle",
          "body": "Paul = Kevin's brother\nHis son Sam = Alex's cousin"
        }
      ],
      "foot": "Kevin is Alex's father · Zara is Alex's sister · Sam is Alex's cousin",
      "notes": "Draw the tree on the board as you explain. Exercise 2 uses it."
    },
    {
      "layout": "exercise",
      "ex": "pairs",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "tree",
      "notes": "Handout exercise 2 — leave the family tree on the board."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "Sam's family photo",
      "listen": 0,
      "text": "Sam shows a photo of his family.\nListen and write the ages (handout exercise 3).",
      "tips": [
        "Listen for -teen or -ty",
        "Five ages",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_photo",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 2 · HIS, HER AND 'S",
      "title": "Whose is it?",
      "boxes": [
        {
          "head": "👦 his",
          "body": "This is Tom.\nHIS sister is ten."
        },
        {
          "head": "👧 her",
          "body": "This is Sara.\nHER father is a doctor."
        },
        {
          "head": "✏️ 's",
          "body": "Tom's bag = the bag of Tom\nmy mum's name"
        }
      ],
      "foot": "Tom → his · Sara → her",
      "notes": "Hold up students' things: \"Whose pen is this?\" \"It's Ben's pen. It's his pen.\""
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "His / her / 's mistakes everyone makes",
      "rows": [
        {
          "wrong": "This is my dad. Her name is Robert.",
          "right": "His name is Robert."
        },
        {
          "wrong": "My mother name is Mary.",
          "right": "My mother's name is Mary."
        },
        {
          "wrong": "Tom bag",
          "right": "Tom's bag"
        },
        {
          "wrong": "Lucy and his brother",
          "right": "Lucy and her brother"
        },
        {
          "wrong": "She's name is Kate.",
          "right": "Her name is Kate."
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "hisher",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "apos",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · HAVE GOT",
      "title": "I've got a sister",
      "boxes": [
        {
          "head": "✅ I / you / we / they",
          "body": "I have got (I've got)\na sister."
        },
        {
          "head": "✅ he / she / it",
          "body": "She has got (she's got)\na brother."
        },
        {
          "head": "❌ Not",
          "body": "I haven't got a dog.\nHe hasn't got a cousin."
        },
        {
          "head": "❓ Questions",
          "body": "Have you got a pet?\n— Yes, I have. / No, I haven't.\nHas she got…? — Yes, she has."
        }
      ],
      "foot": "he / she / it → HAS got",
      "notes": "Students tell a partner 3 things they have got and 1 they haven't got."
    },
    {
      "layout": "exercise",
      "ex": "havegot",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "exercise",
      "ex": "famcorrect",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "game",
      "tag": "SPEAKING · PAIR WORK",
      "title": "Family tree guess",
      "emoji": "🌳",
      "minutes": 8,
      "text": "Draw your family tree — names only.\nYour partner points and asks:\n\"Who is this?\" — \"That's my aunt.\"\n\"How old is she?\" — \"She's 35.\"",
      "notes": "Walk around and help with ages."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Have you got…?",
      "listen": 1,
      "text": "A teacher asks five children \"Have you got…?\"\nListen: true or false? (handout exercise 8)",
      "tips": [
        "Listen for \"Yes, I have\" / \"No, I haven't\"",
        "Brothers, cousins, pets…",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_have",
      "notes": "Handout exercise 8 (Listening 2)."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · AGES",
      "title": "How old is he?",
      "boxes": [
        {
          "head": "❓ Ask",
          "body": "How old is your brother?\nHow old are your grandparents?"
        },
        {
          "head": "✅ Answer",
          "body": "He's seventeen.\nThey're seventy and seventy-two."
        },
        {
          "head": "⚠️ Careful",
          "body": "I'm 12. ✓\nI'm 12 years old. ✓\nI have 12 years. ✗"
        }
      ],
      "foot": "Remember from Lesson 1: thirTEEN ≠ THIRty",
      "notes": "Students ask three classmates about a family member's age."
    },
    {
      "layout": "exercise",
      "ex": "famorder",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "A new student",
      "listen": 2,
      "text": "Lucy is new at school. She talks to her teacher about her family.\nListen and complete (handout exercise 10).",
      "tips": [
        "A name is spelled slowly",
        "Numbers: ages and how many",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_new",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Nora's family",
      "text": "Hi! I'm Nora. I'm thirteen. I've got one brother and one sister. My brother's name is Harry — he's sixteen. My sister Lily is nine.\n\nMy mum's name is Mary. She's a teacher. My dad is a doctor. His name is Robert. We've got a dog — his name is Max.\n\nMy grandparents live near us. Grandma is seventy and Grandpa is seventy-two. My aunt Jane has got two sons — my cousins, Leo and Tom.",
      "tips": [
        "Who? How old? What job?",
        "Read, then do exercises 11 and 12"
      ],
      "notes": "Students read silently (4 min)."
    },
    {
      "layout": "exercise",
      "ex": "fam_tf",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "exercise",
      "ex": "fam_q",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "famodd",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "exercise",
      "ex": "myfamily",
      "notes": "Handout exercise 14. Then students read their text to a partner.",
      "minutes": 8
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — or a team quiz."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can name my family",
        "I can use his, her and 's",
        "I can say \"I've got…\" / \"She has got…\"",
        "I can ask \"How old is…?\""
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — Sam's family photo",
      "src": "audio/course/b1l3-listening-1.mp3",
      "text": "Hi, I'm Sam, and this is a photo of my family. Here's my mother. She's forty-one. My father is next to her. He's forty-five. The little girl is my sister, Kate. She's eight. And here's my grandmother. She's seventy-two. Oh, and that tall boy at the back is my cousin, Oliver. He's fifteen.",
      "script": "Narrator: Listening one. Sam talks about a family photo. Write the ages.\nA: Hi, I'm Sam, and this is a photo of my family. Here's my mother. She's forty-one.\nA: My father is next to her. He's forty-five.\nA: The little girl is my sister, Kate. She's eight.\nA: And here's my grandmother. She's seventy-two.\nA: Oh, and that tall boy at the back is my cousin, Oliver. He's fifteen."
    },
    {
      "label": "Listening 2 — Have you got…?",
      "src": "audio/course/b1l3-listening-2.mp3",
      "text": "Leo, have you got a sister? No, I haven't. But I've got two brothers. And you, Mia? Have you got any cousins? Yes, I have. One cousin. She lives in Spain. Jack, have you got a pet? Yes, a dog. His name's Rex. Amy, tell me about your grandparents. Well, they've got a small house near the sea. Daniel, have you got a brother? No, I haven't. I've only got a sister.",
      "script": "Narrator: Listening two. Have you got…? Five children answer. True or false?\nA: Leo, have you got a sister?\nB: No, I haven't. But I've got two brothers.\nA: And you, Mia? Have you got any cousins?\nC: Yes, I have. One cousin. She lives in Spain.\nA: Jack, have you got a pet?\nD: Yes, a dog. His name's Rex.\nA: Amy, tell me about your grandparents.\nE: Well, they've got a small house near the sea.\nA: Daniel, have you got a brother?\nF: No, I haven't. I've only got a sister."
    },
    {
      "label": "Listening 3 — A new student",
      "src": "audio/course/b1l3-listening-3.mp3",
      "text": "So, Lucy, tell me about your family. Have you got any brothers or sisters? Yes, I've got one brother. His name's Jake. How do you spell Jake? That's J, A, K, E. And how old is he? He's seventeen. What about your mum and dad? My mum's a nurse, and my dad's a taxi driver. Have you got any cousins? Yes, three cousins. And your grandparents? My grandmother lives with us. She's eighty!",
      "script": "Narrator: Listening three. Lucy, a new student, talks to her teacher. Listen and complete.\nA: So, Lucy, tell me about your family. Have you got any brothers or sisters?\nB: Yes, I've got one brother. His name's Jake.\nA: How do you spell Jake?\nB: That's J, A, K, E.\nA: And how old is he?\nB: He's seventeen.\nA: What about your mum and dad?\nB: My mum's a nurse, and my dad's a taxi driver.\nA: Have you got any cousins?\nB: Yes, three cousins.\nA: And your grandparents?\nB: My grandmother lives with us. She's eighty!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
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
  // A 2-hour lesson (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude
  // (Kokoro voices, audio/course/*.mp3). Generated from a script; the slides (deck) and the handout come from `exercises`.
  skills: [
    "listening",
    "reading",
    "writing",
    "speaking"
  ],
  goals: [
    "Name 14 classroom things",
    "Use a / an and plurals (pens, boxes, children)",
    "Use this / that / these / those",
    "Understand and give classroom instructions"
  ],
  warmups: [
    {
      "emoji": "🗣️",
      "title": "Family whispers (from Lesson 3)",
      "time": "5 min",
      "how": "Teams in lines whisper a sentence (\"Alex's aunt has got two sons\"); the last student writes it on the board."
    },
    {
      "emoji": "🛍️",
      "title": "Mystery bag",
      "time": "7 min",
      "how": "Classroom things in a bag. A student feels one without looking: \"Is it a ruler?\" — \"Yes, it is!\" / \"No, it isn't.\""
    },
    {
      "emoji": "🙋",
      "title": "Simon says",
      "time": "6 min",
      "how": "Give instructions; students do them only after \"Simon says…\"."
    }
  ],
  exercises: [
    {
      "id": "things",
      "type": "match",
      "skill": "reading",
      "title": "Match the picture and the word.",
      "items": [
        {
          "q": "✏️",
          "a": "pencil"
        },
        {
          "q": "🖊️",
          "a": "pen"
        },
        {
          "q": "📏",
          "a": "ruler"
        },
        {
          "q": "📕",
          "a": "book"
        },
        {
          "q": "🎒",
          "a": "bag"
        },
        {
          "q": "🪑",
          "a": "chair"
        },
        {
          "q": "🖥️",
          "a": "computer"
        },
        {
          "q": "🕒",
          "a": "clock"
        }
      ]
    },
    {
      "id": "aan",
      "type": "gap",
      "skill": "writing",
      "title": "Write a or an.",
      "items": [
        {
          "q": "___ pencil",
          "a": "a"
        },
        {
          "q": "___ eraser",
          "a": "an"
        },
        {
          "q": "___ apple",
          "a": "an"
        },
        {
          "q": "___ desk",
          "a": "a"
        },
        {
          "q": "___ umbrella",
          "a": "an"
        },
        {
          "q": "___ notebook",
          "a": "a"
        },
        {
          "q": "___ orange",
          "a": "an"
        },
        {
          "q": "___ ruler",
          "a": "a"
        }
      ]
    },
    {
      "id": "plurals",
      "type": "write",
      "skill": "writing",
      "title": "Write the plural.",
      "items": [
        {
          "q": "pen",
          "a": "pens"
        },
        {
          "q": "box",
          "a": "boxes"
        },
        {
          "q": "watch",
          "a": "watches"
        },
        {
          "q": "bus",
          "a": "buses"
        },
        {
          "q": "dictionary",
          "a": "dictionaries"
        },
        {
          "q": "child",
          "a": "children"
        },
        {
          "q": "woman",
          "a": "women"
        },
        {
          "q": "man",
          "a": "men"
        }
      ]
    },
    {
      "id": "plodd",
      "type": "odd",
      "skill": "reading",
      "title": "Which word is different? Circle it.",
      "items": [
        {
          "q": "pens   books   chair   desks",
          "a": "chair (one)"
        },
        {
          "q": "boxes   watch   buses   pencils",
          "a": "watch (one)"
        },
        {
          "q": "children   men   women   child",
          "a": "child (one)"
        },
        {
          "q": "an apple   an egg   an orange   an pen",
          "a": "an pen ✗ (a pen)"
        },
        {
          "q": "ruler   rubber   pencil   Monday",
          "a": "Monday"
        },
        {
          "q": "this   that   these   is",
          "a": "is"
        }
      ]
    },
    {
      "id": "lis_bag",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 1: What's in their bags? Circle the right answer.",
      "items": [
        {
          "q": "Sara has got ___ pens.",
          "opts": [
            "two",
            "three",
            "four"
          ],
          "a": "b"
        },
        {
          "q": "In Ben's bag there is a…",
          "opts": [
            "dictionary",
            "ruler",
            "phone"
          ],
          "a": "a"
        },
        {
          "q": "Lucy has got ___ notebooks.",
          "opts": [
            "two",
            "five",
            "twelve"
          ],
          "a": "a"
        },
        {
          "q": "Tom has got an…",
          "opts": [
            "apple",
            "orange",
            "umbrella"
          ],
          "a": "c"
        },
        {
          "q": "Mia's pencil case is…",
          "opts": [
            "big",
            "new",
            "small"
          ],
          "a": "b"
        }
      ],
      "listen": 0
    },
    {
      "id": "demo",
      "type": "choose",
      "skill": "writing",
      "title": "Circle this, that, these or those.",
      "items": [
        {
          "q": "___ is my pen. (in my hand)",
          "opts": [
            "This",
            "These",
            "Those"
          ],
          "a": "a"
        },
        {
          "q": "___ are my books. (on my desk)",
          "opts": [
            "This",
            "These",
            "That"
          ],
          "a": "b"
        },
        {
          "q": "Look at ___ window! (over there)",
          "opts": [
            "these",
            "that",
            "those"
          ],
          "a": "b"
        },
        {
          "q": "___ chairs over there are new.",
          "opts": [
            "That",
            "This",
            "Those"
          ],
          "a": "c"
        },
        {
          "q": "Is ___ your bag? (here)",
          "opts": [
            "this",
            "these",
            "those"
          ],
          "a": "a"
        },
        {
          "q": "What are ___ ? (over there)",
          "opts": [
            "that",
            "those",
            "this"
          ],
          "a": "b"
        }
      ]
    },
    {
      "id": "clcorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes.",
      "items": [
        {
          "q": "This is a apple.",
          "a": "This is an apple."
        },
        {
          "q": "I have got two pen.",
          "a": "I have got two pens."
        },
        {
          "q": "These is my books.",
          "a": "These are my books."
        },
        {
          "q": "Those boxs are big.",
          "a": "Those boxes are big."
        },
        {
          "q": "An book is on the desk.",
          "a": "A book is on the desk."
        }
      ]
    },
    {
      "id": "lis_lost",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 2: Lost and found. Listen and complete.",
      "items": [
        {
          "q": "The black bag is ____________'s.",
          "a": "Jack's"
        },
        {
          "q": "The red pen is ____________'s.",
          "a": "Emma's"
        },
        {
          "q": "Leo's ____________ are on the teacher's desk.",
          "a": "books"
        },
        {
          "q": "The umbrella is the ____________'s.",
          "a": "teacher's"
        },
        {
          "q": "Mia's pencil case is under the ____________.",
          "a": "chair"
        }
      ],
      "listen": 1
    },
    {
      "id": "instr",
      "type": "match",
      "skill": "reading",
      "title": "Match the instruction and the picture.",
      "items": [
        {
          "q": "Open your book.",
          "a": "📖"
        },
        {
          "q": "Close the door.",
          "a": "🚪"
        },
        {
          "q": "Stand up.",
          "a": "🧍"
        },
        {
          "q": "Sit down.",
          "a": "🪑"
        },
        {
          "q": "Listen.",
          "a": "👂"
        },
        {
          "q": "Write your name.",
          "a": "✍️"
        }
      ]
    },
    {
      "id": "lis_simon",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 3: Follow the teacher. What do the students do?",
      "items": [
        {
          "q": "First they…",
          "opts": [
            "stand up",
            "sit down",
            "open the window"
          ],
          "a": "a"
        },
        {
          "q": "Then they look at the…",
          "opts": [
            "door",
            "board",
            "clock"
          ],
          "a": "b"
        },
        {
          "q": "They open their books at page…",
          "opts": [
            "twelve",
            "twenty",
            "two"
          ],
          "a": "a"
        },
        {
          "q": "They write in their…",
          "opts": [
            "books",
            "notebooks",
            "bags"
          ],
          "a": "b"
        },
        {
          "q": "At the end they work…",
          "opts": [
            "alone",
            "in pairs",
            "in groups"
          ],
          "a": "b"
        }
      ],
      "listen": 2
    },
    {
      "id": "clorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the words in order.",
      "items": [
        {
          "q": "are / these / my / books",
          "a": "These are my books."
        },
        {
          "q": "this / what / is / English / in",
          "a": "What is this in English?"
        },
        {
          "q": "your / open / book / please",
          "a": "Open your book, please."
        },
        {
          "q": "that / is / bag / your",
          "a": "Is that your bag?"
        },
        {
          "q": "pens / those / are / blue",
          "a": "Those pens are blue."
        },
        {
          "q": "a / it's / ruler",
          "a": "It's a ruler."
        }
      ]
    },
    {
      "id": "room_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read about the classroom. True (T) or false (F)?",
      "items": [
        {
          "q": "The classroom is small.",
          "a": "F (big)"
        },
        {
          "q": "There are twenty desks.",
          "a": "T"
        },
        {
          "q": "The board is black.",
          "a": "F (white)"
        },
        {
          "q": "There is a clock on the wall.",
          "a": "T"
        },
        {
          "q": "There are two pens in the pencil case.",
          "a": "F (three)"
        }
      ],
      "text": "This is my classroom. It's big and it's got four windows. There are twenty desks and twenty-one chairs — one chair is for the teacher.\n\nThe board is white. Next to it is the teacher's computer. On the wall there's a big map of the world and a clock.\n\nMy desk is near the door. On my desk there are two books, a notebook and a pencil case. In my pencil case I've got three pens and a rubber."
    },
    {
      "id": "room_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "How many windows are there?",
          "a": "Four."
        },
        {
          "q": "How many chairs are there?",
          "a": "Twenty-one."
        },
        {
          "q": "What is next to the board?",
          "a": "The teacher's computer."
        },
        {
          "q": "Where is the desk?",
          "a": "Near the door."
        },
        {
          "q": "What is in the pencil case?",
          "a": "Three pens and a rubber."
        }
      ]
    },
    {
      "id": "mybag",
      "type": "write",
      "skill": "writing",
      "title": "Write about your bag and your desk.",
      "items": [
        {
          "q": "In my bag there is / are…",
          "a": "(students' own)"
        },
        {
          "q": "I've got… (how many?)",
          "a": "(students' own)"
        },
        {
          "q": "On my desk…",
          "a": "(students' own)"
        },
        {
          "q": "This is my… / These are my…",
          "a": "(students' own)"
        },
        {
          "q": "My favourite thing is…",
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
          "q": "___ umbrella",
          "opts": [
            "a",
            "an",
            "two"
          ],
          "a": "b"
        },
        {
          "q": "one child, two…",
          "opts": [
            "childs",
            "children",
            "childrens"
          ],
          "a": "b"
        },
        {
          "q": "___ are my pens. (here)",
          "opts": [
            "This",
            "These",
            "That"
          ],
          "a": "b"
        },
        {
          "q": "📏 =",
          "opts": [
            "rubber",
            "ruler",
            "pencil"
          ],
          "a": "b"
        },
        {
          "q": "What's this? —",
          "opts": [
            "It's a pen.",
            "They're a pen.",
            "Is a pen."
          ],
          "a": "a"
        },
        {
          "q": "\"Sit ___!\"",
          "opts": [
            "up",
            "down",
            "on"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 4 (2 hours). Bring a bag with classroom things for \"Mystery bag\". Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "🎒",
          "text": "Words: 14 classroom things"
        },
        {
          "emoji": "🍎",
          "text": "Grammar: a / an · one pen → two pens"
        },
        {
          "emoji": "👉",
          "text": "Grammar: this · that · these · those"
        },
        {
          "emoji": "🎧",
          "text": "Listening: bags, lost and found, the teacher's instructions"
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
      "title": "From Lesson 3: can you remember?",
      "rows": [
        {
          "q": "Your mother's brother is your…",
          "a": "uncle"
        },
        {
          "q": "This is Tom. ___ sister is ten.",
          "a": "His"
        },
        {
          "q": "She ___ got a cat.",
          "a": "has"
        },
        {
          "q": "the bag of Lucy = ?",
          "a": "Lucy's bag"
        },
        "How old is your father?"
      ],
      "notes": "Ask around the class. Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Mystery bag",
      "emoji": "🛍️",
      "minutes": 7,
      "text": "Feel the thing in the bag. Don't look!\n\"Is it a ruler?\"\n\"Yes, it is!\" / \"No, it isn't.\"\nThen: \"What's this in English?\"",
      "notes": "Use real classroom things."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "🖊️",
          "word": "pen",
          "tr": "I write with a pen."
        },
        {
          "emoji": "✏️",
          "word": "pencil",
          "tr": "a pencil and a rubber"
        },
        {
          "emoji": "📏",
          "word": "ruler",
          "tr": "30 cm"
        },
        {
          "emoji": "🧽",
          "word": "rubber",
          "tr": "eraser (US)"
        },
        {
          "emoji": "📕",
          "word": "book",
          "tr": "Open your book."
        },
        {
          "emoji": "📓",
          "word": "notebook",
          "tr": "Write in your notebook."
        },
        {
          "emoji": "🎒",
          "word": "bag",
          "tr": "my school bag"
        },
        {
          "emoji": "🪑",
          "word": "desk",
          "tr": "a desk and a chair"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · CLASSROOM THINGS",
      "title": "In the classroom",
      "tiles": [
        "🖊️ pen",
        "✏️ pencil",
        "📏 ruler",
        "🧽 rubber",
        "📕 book",
        "📓 notebook",
        "📚 dictionary",
        "🎒 bag",
        "🪑 chair",
        "🗄️ desk",
        "🖥️ computer",
        "🕒 clock",
        "🪟 window",
        "🚪 door"
      ],
      "notes": "Point at real things in the room. \"What's this?\" — \"It's a window.\"",
      "small": true,
      "cols": 5
    },
    {
      "layout": "exercise",
      "ex": "things",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 2 · A OR AN?",
      "title": "a pen, an apple",
      "boxes": [
        {
          "head": "a + consonant sound",
          "body": "a pen · a book · a desk\na ruler · a notebook"
        },
        {
          "head": "an + vowel sound (a e i o u)",
          "body": "an apple · an eraser\nan umbrella · an orange"
        },
        {
          "head": "⚠️ Listen to the sound",
          "body": "an hour (h is silent)\na university (sounds like \"you\")"
        }
      ],
      "foot": "Say it: a pen / an apple — an + a, e, i, o, u",
      "notes": "Show objects, students say \"a…\" or \"an…\"."
    },
    {
      "layout": "exercise",
      "ex": "aan",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · ONE → MANY",
      "title": "Plurals",
      "boxes": [
        {
          "head": "+ s",
          "body": "pen → pens\nbook → books"
        },
        {
          "head": "+ es",
          "body": "box → boxes\nwatch → watches\nbus → buses"
        },
        {
          "head": "y → ies",
          "body": "dictionary → dictionaries\nfamily → families"
        },
        {
          "head": "Special!",
          "body": "man → men\nwoman → women\nchild → children"
        }
      ],
      "foot": "Count things in the room: one window, two windows…",
      "notes": "Students count things in the classroom."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "a / an / plural mistakes everyone makes",
      "rows": [
        {
          "wrong": "a apple",
          "right": "an apple"
        },
        {
          "wrong": "an book",
          "right": "a book"
        },
        {
          "wrong": "two pen",
          "right": "two pens"
        },
        {
          "wrong": "boxs",
          "right": "boxes"
        },
        {
          "wrong": "childs",
          "right": "children"
        },
        {
          "wrong": "womans",
          "right": "women"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "plurals",
      "notes": "Handout exercise 3."
    },
    {
      "layout": "exercise",
      "ex": "plodd",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "What's in your bag?",
      "listen": 0,
      "text": "Five students say what is in their bags.\nListen and circle the right answer (handout exercise 5).",
      "tips": [
        "How many?",
        "What thing?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_bag",
      "notes": "Handout exercise 5 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · THIS, THAT, THESE, THOSE",
      "title": "Near or far?",
      "boxes": [
        {
          "head": "🤚 Near · one",
          "body": "This is my pen."
        },
        {
          "head": "🤚 Near · many",
          "body": "These are my pens."
        },
        {
          "head": "👉 Far · one",
          "body": "That is a door."
        },
        {
          "head": "👉 Far · many",
          "body": "Those are windows."
        }
      ],
      "foot": "What's this? — It's a ruler. · What are these? — They're pencils.",
      "notes": "Hold things / point at things. Students say the sentence."
    },
    {
      "layout": "exercise",
      "ex": "demo",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "exercise",
      "ex": "clcorrect",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Lost and found",
      "listen": 1,
      "text": "A teacher finds things in the classroom.\nWhose are they? Listen and complete (handout exercise 8).",
      "tips": [
        "Whose? → name + 's",
        "Where?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_lost",
      "notes": "Handout exercise 8 (Listening 2)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 5 · INSTRUCTIONS",
      "title": "Classroom instructions",
      "tiles": [
        "📖 Open your book",
        "📕 Close your book",
        "🧍 Stand up",
        "🪑 Sit down",
        "👂 Listen",
        "🔁 Listen and repeat",
        "👀 Look at the board",
        "✍️ Write your name",
        "👥 Work in pairs",
        "🙋 Put up your hand"
      ],
      "notes": "Say each instruction, students do it.",
      "small": true,
      "cols": 5
    },
    {
      "layout": "exercise",
      "ex": "instr",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Simon says",
      "emoji": "🙋",
      "minutes": 6,
      "text": "Do it only when you hear \"Simon says\"!\n\"Simon says: stand up.\" → stand up ✅\n\"Sit down.\" → don't move! ❌\nWrong move = you sit out.",
      "notes": "Use the instructions from the last slide."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "Follow the teacher",
      "listen": 2,
      "text": "A teacher gives instructions to her class.\nWhat do the students do? (handout exercise 10)",
      "tips": [
        "First… then… at the end…",
        "Listen for the page number",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_simon",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "exercise",
      "ex": "clorder",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "My classroom",
      "text": "This is my classroom. It's big and it's got four windows. There are twenty desks and twenty-one chairs — one chair is for the teacher.\n\nThe board is white. Next to it is the teacher's computer. On the wall there's a big map of the world and a clock.\n\nMy desk is near the door. On my desk there are two books, a notebook and a pencil case. In my pencil case I've got three pens and a rubber.",
      "tips": [
        "How many? Where? What?",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (4 min)."
    },
    {
      "layout": "exercise",
      "ex": "room_tf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "room_q",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "exercise",
      "ex": "mybag",
      "notes": "Handout exercise 14. Then students show their bag to a partner and talk.",
      "minutes": 7
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — or a team quiz."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can name classroom things",
        "I can use a / an and plurals",
        "I can use this, that, these, those",
        "I can follow classroom instructions"
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — What's in your bag?",
      "src": "audio/course/b1l4-listening-1.mp3",
      "text": "Number one. I'm Sara. In my bag I've got three pens and a notebook. Number two. I'm Ben. My bag is really heavy, because there's a big dictionary in it! Number three. Hi, I'm Lucy. I've got two notebooks, one for English and one for maths. Number four. I'm Tom. It's raining today, so I've got an umbrella in my bag. Number five. I'm Mia. Look, this is my new pencil case!",
      "script": "Narrator: Listening one. What's in their bags? Circle the right answer.\nNarrator: Number one.\nA: I'm Sara. In my bag I've got three pens and a notebook.\nNarrator: Number two.\nB: I'm Ben. My bag is really heavy, because there's a big dictionary in it!\nNarrator: Number three.\nC: Hi, I'm Lucy. I've got two notebooks, one for English and one for maths.\nNarrator: Number four.\nD: I'm Tom. It's raining today, so I've got an umbrella in my bag.\nNarrator: Number five.\nE: I'm Mia. Look, this is my new pencil case!"
    },
    {
      "label": "Listening 2 — Lost and found",
      "src": "audio/course/b1l4-listening-2.mp3",
      "text": "OK, everyone. Whose is this black bag? Jack, is it yours? Yes, it is! Thanks. And this red pen? Oh, that's my pen. I'm Emma. Leo, are these your books on my desk? Yes, they are. Sorry! And that umbrella by the door? That's my umbrella. Excuse me, where's my pencil case? Look, Mia. It's under your chair.",
      "script": "Narrator: Listening two. Lost and found. Listen and complete.\nA: OK, everyone. Whose is this black bag? Jack, is it yours?\nB: Yes, it is! Thanks.\nA: And this red pen?\nC: Oh, that's my pen. I'm Emma.\nA: Leo, are these your books on my desk?\nD: Yes, they are. Sorry!\nA: And that umbrella by the door? That's my umbrella.\nE: Excuse me, where's my pencil case?\nA: Look, Mia. It's under your chair."
    },
    {
      "label": "Listening 3 — Follow the teacher",
      "src": "audio/course/b1l4-listening-3.mp3",
      "text": "Good morning, everyone. Please stand up. Thank you. Sit down, please, and look at the board. Open your books at page twelve. That's page twelve. Take your notebooks and write the new words in them. Good! Next, work in pairs. Ask your partner: what's this in English?",
      "script": "Narrator: Listening three. Follow the teacher. What do the students do?\nA: Good morning, everyone. Please stand up.\nA: Thank you. Sit down, please, and look at the board.\nA: Open your books at page twelve. That's page twelve.\nA: Take your notebooks and write the new words in them.\nA: Good! Next, work in pairs. Ask your partner: what's this in English?"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
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
  // A 2-hour lesson (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude
  // (Kokoro voices, audio/course/*.mp3). Generated from a script; the slides (deck) and the handout come from `exercises`.
  skills: [
    "listening",
    "reading",
    "writing",
    "speaking"
  ],
  goals: [
    "Say the days of the week and the months",
    "Say dates with ordinal numbers: \"the third of May\"",
    "Use on / in / at with days, months and times",
    "Tell the time: o'clock, half past, quarter past / to"
  ],
  warmups: [
    {
      "emoji": "🙋",
      "title": "Simon says (from Lesson 4)",
      "time": "4 min",
      "how": "Classroom instructions — move only after \"Simon says\"."
    },
    {
      "emoji": "🎂",
      "title": "Birthday line",
      "time": "8 min",
      "how": "Students stand in order of their birthdays (January → December) — no writing, only \"When's your birthday?\""
    },
    {
      "emoji": "⏰",
      "title": "What's the time, Mr Wolf?",
      "time": "6 min",
      "how": "One student is the wolf; the class asks \"What's the time, Mr Wolf?\" and steps forward that many steps."
    }
  ],
  exercises: [
    {
      "id": "daysorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the days in order.",
      "items": [
        {
          "q": "Wednesday  Monday  Tuesday",
          "a": "Monday, Tuesday, Wednesday"
        },
        {
          "q": "Saturday  Friday  Sunday",
          "a": "Friday, Saturday, Sunday"
        },
        {
          "q": "Thursday  Wednesday  Friday",
          "a": "Wednesday, Thursday, Friday"
        },
        {
          "q": "Sunday  Tuesday  Monday",
          "a": "Sunday, Monday, Tuesday"
        },
        {
          "q": "Friday  Thursday  Saturday",
          "a": "Thursday, Friday, Saturday"
        }
      ]
    },
    {
      "id": "months",
      "type": "gap",
      "skill": "writing",
      "title": "Write the missing day or month.",
      "items": [
        {
          "q": "January, ____________, March",
          "a": "February"
        },
        {
          "q": "April, May, ____________",
          "a": "June"
        },
        {
          "q": "____________, August, September",
          "a": "July"
        },
        {
          "q": "October, ____________, December",
          "a": "November"
        },
        {
          "q": "Monday, ____________, Wednesday",
          "a": "Tuesday"
        },
        {
          "q": "Friday, Saturday, ____________",
          "a": "Sunday"
        },
        {
          "q": "The first month: ____________",
          "a": "January"
        },
        {
          "q": "The last month: ____________",
          "a": "December"
        }
      ]
    },
    {
      "id": "lis_bday",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 1: When's your birthday? Write the dates.",
      "items": [
        {
          "q": "Emma: the ________ of ____________",
          "a": "3rd of March"
        },
        {
          "q": "Jack: the ________ of ____________",
          "a": "21st of June"
        },
        {
          "q": "Lily: the ________ of ____________",
          "a": "12th of October"
        },
        {
          "q": "Sam: the ________ of ____________",
          "a": "30th of August"
        },
        {
          "q": "Mia: the ________ of ____________",
          "a": "1st of January"
        }
      ],
      "listen": 0
    },
    {
      "id": "ordinals",
      "type": "match",
      "skill": "reading",
      "title": "Match the number and the word.",
      "items": [
        {
          "q": "1st",
          "a": "first"
        },
        {
          "q": "2nd",
          "a": "second"
        },
        {
          "q": "3rd",
          "a": "third"
        },
        {
          "q": "5th",
          "a": "fifth"
        },
        {
          "q": "8th",
          "a": "eighth"
        },
        {
          "q": "12th",
          "a": "twelfth"
        },
        {
          "q": "20th",
          "a": "twentieth"
        },
        {
          "q": "31st",
          "a": "thirty-first"
        }
      ]
    },
    {
      "id": "dates",
      "type": "write",
      "skill": "writing",
      "title": "Write the dates in words.",
      "items": [
        {
          "q": "3 May",
          "a": "the third of May"
        },
        {
          "q": "1 January",
          "a": "the first of January"
        },
        {
          "q": "22 July",
          "a": "the twenty-second of July"
        },
        {
          "q": "15 October",
          "a": "the fifteenth of October"
        },
        {
          "q": "31 December",
          "a": "the thirty-first of December"
        }
      ]
    },
    {
      "id": "onin",
      "type": "gap",
      "skill": "writing",
      "title": "Write on, in or at.",
      "items": [
        {
          "q": "___ Monday",
          "a": "on"
        },
        {
          "q": "___ August",
          "a": "in"
        },
        {
          "q": "___ 7 o'clock",
          "a": "at"
        },
        {
          "q": "___ the 5th of June",
          "a": "on"
        },
        {
          "q": "___ 2027",
          "a": "in"
        },
        {
          "q": "___ half past four",
          "a": "at"
        },
        {
          "q": "___ the weekend",
          "a": "at"
        },
        {
          "q": "___ the morning",
          "a": "in"
        }
      ]
    },
    {
      "id": "times",
      "type": "write",
      "skill": "writing",
      "title": "Write the times in words.",
      "items": [
        {
          "q": "8:00",
          "a": "eight o'clock"
        },
        {
          "q": "9:30",
          "a": "half past nine"
        },
        {
          "q": "3:15",
          "a": "quarter past three"
        },
        {
          "q": "6:45",
          "a": "quarter to seven"
        },
        {
          "q": "11:10",
          "a": "ten past eleven"
        },
        {
          "q": "4:50",
          "a": "ten to five"
        }
      ]
    },
    {
      "id": "timechoose",
      "type": "choose",
      "skill": "reading",
      "title": "Circle the right time.",
      "items": [
        {
          "q": "half past seven",
          "opts": [
            "6:30",
            "7:30",
            "8:30"
          ],
          "a": "b"
        },
        {
          "q": "quarter to ten",
          "opts": [
            "9:45",
            "10:15",
            "10:45"
          ],
          "a": "a"
        },
        {
          "q": "twenty past two",
          "opts": [
            "2:40",
            "1:20",
            "2:20"
          ],
          "a": "c"
        },
        {
          "q": "quarter past one",
          "opts": [
            "1:15",
            "12:45",
            "1:45"
          ],
          "a": "a"
        },
        {
          "q": "ten to six",
          "opts": [
            "6:10",
            "5:50",
            "5:10"
          ],
          "a": "b"
        },
        {
          "q": "twelve o'clock",
          "opts": [
            "12:00",
            "2:00",
            "11:00"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "lis_time",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 2: What time is it? Circle the right time.",
      "items": [
        {
          "q": "The train leaves at…",
          "opts": [
            "7:15",
            "7:50",
            "6:15"
          ],
          "a": "a"
        },
        {
          "q": "The film starts at…",
          "opts": [
            "8:30",
            "8:00",
            "6:30"
          ],
          "a": "a"
        },
        {
          "q": "The shop closes at…",
          "opts": [
            "5:00",
            "9:00",
            "6:00"
          ],
          "a": "b"
        },
        {
          "q": "The English lesson is at…",
          "opts": [
            "10:45",
            "11:45",
            "10:15"
          ],
          "a": "a"
        },
        {
          "q": "The bus comes at…",
          "opts": [
            "4:20",
            "4:40",
            "2:20"
          ],
          "a": "b"
        }
      ],
      "listen": 1
    },
    {
      "id": "lis_plan",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: Jack and Lily plan a weekend. Listen and complete.",
      "items": [
        {
          "q": "They meet on ____________.",
          "a": "Saturday"
        },
        {
          "q": "They meet at ____________.",
          "a": "half past ten (10:30)"
        },
        {
          "q": "The cinema is on ____________ Street.",
          "a": "Green (G-R-double E-N)"
        },
        {
          "q": "The film finishes at ____________.",
          "a": "1 o'clock"
        },
        {
          "q": "Lily's birthday party is on the ________ of May.",
          "a": "20th"
        }
      ],
      "listen": 2
    },
    {
      "id": "dtcorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes.",
      "items": [
        {
          "q": "My birthday is in Monday.",
          "a": "on Monday"
        },
        {
          "q": "See you on 5 o'clock.",
          "a": "at 5 o'clock"
        },
        {
          "q": "I was born on May.",
          "a": "in May"
        },
        {
          "q": "It's the twelveth of June.",
          "a": "twelfth"
        },
        {
          "q": "school starts on monday.",
          "a": "School starts on Monday."
        }
      ]
    },
    {
      "id": "week_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read about Ben's week. True (T) or false (F)?",
      "items": [
        {
          "q": "Ben's birthday is in February.",
          "a": "T"
        },
        {
          "q": "School starts at eight o'clock.",
          "a": "F (half past eight)"
        },
        {
          "q": "He has got swimming on Tuesday and Thursday.",
          "a": "T"
        },
        {
          "q": "He plays football on Sunday.",
          "a": "F (Saturday)"
        },
        {
          "q": "His favourite month is July.",
          "a": "T"
        }
      ],
      "text": "Hi, I'm Ben. My birthday is on the 12th of February.\n\nOn weekdays I get up at seven o'clock. School starts at half past eight and finishes at three o'clock. On Tuesday and Thursday I've got swimming at five.\n\nOn Saturday I play football in the morning, and on Sunday I visit my grandparents. My favourite month is July — no school!"
    },
    {
      "id": "week_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "When is Ben's birthday?",
          "a": "On the 12th of February."
        },
        {
          "q": "What time does he get up?",
          "a": "At seven o'clock."
        },
        {
          "q": "When does school finish?",
          "a": "At three o'clock."
        },
        {
          "q": "What does he do on Sunday?",
          "a": "He visits his grandparents."
        },
        {
          "q": "Why is July his favourite month?",
          "a": "No school!"
        }
      ]
    },
    {
      "id": "myweek",
      "type": "write",
      "skill": "writing",
      "title": "Write about your week.",
      "items": [
        {
          "q": "My birthday is on…",
          "a": "(students' own)"
        },
        {
          "q": "On weekdays I get up at…",
          "a": "(students' own)"
        },
        {
          "q": "School starts at…",
          "a": "(students' own)"
        },
        {
          "q": "On Saturday I…",
          "a": "(students' own)"
        },
        {
          "q": "My favourite day is… because…",
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
          "q": "The day after Friday:",
          "opts": [
            "Thursday",
            "Saturday",
            "Sunday"
          ],
          "a": "b"
        },
        {
          "q": "12th =",
          "opts": [
            "twelveth",
            "twelfth",
            "twelve"
          ],
          "a": "b"
        },
        {
          "q": "I play football ___ Saturday.",
          "opts": [
            "in",
            "on",
            "at"
          ],
          "a": "b"
        },
        {
          "q": "7:30 =",
          "opts": [
            "half past seven",
            "half past six",
            "seven thirty past"
          ],
          "a": "a"
        },
        {
          "q": "How many months in a year?",
          "opts": [
            "ten",
            "twelve",
            "twenty"
          ],
          "a": "b"
        },
        {
          "q": "When's your birthday? — It's ___ May.",
          "opts": [
            "on",
            "in",
            "at"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 5 (2 hours), the last lesson before the review. Bring a clock with hands if you can. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "📆",
          "text": "Words: days of the week and months"
        },
        {
          "emoji": "🥇",
          "text": "Numbers: first, second, third… and dates"
        },
        {
          "emoji": "📍",
          "text": "Grammar: on · in · at"
        },
        {
          "emoji": "🕒",
          "text": "Telling the time · Listening: birthdays, times, weekend plans"
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
      "title": "From Lesson 4: can you remember?",
      "rows": [
        {
          "q": "a or an: ___ apple",
          "a": "an"
        },
        {
          "q": "one box, two…",
          "a": "boxes"
        },
        {
          "q": "___ are my pens. (here)",
          "a": "These"
        },
        {
          "q": "What's this in English? (point at a pen)",
          "a": "It's a pen."
        },
        {
          "q": "\"Open your…\"",
          "a": "book"
        }
      ],
      "notes": "Ask around the class. Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Simon says",
      "emoji": "🙋",
      "minutes": 4,
      "text": "Do it only after \"Simon says\"!\nSimon says: stand up · sit down · open your book · look at the window…",
      "notes": "Quick revision of Lesson 4."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "📅",
          "word": "day",
          "tr": "Monday"
        },
        {
          "emoji": "🗓️",
          "word": "week",
          "tr": "7 days"
        },
        {
          "emoji": "🎉",
          "word": "weekend",
          "tr": "Saturday + Sunday"
        },
        {
          "emoji": "🌙",
          "word": "month",
          "tr": "May"
        },
        {
          "emoji": "🎆",
          "word": "year",
          "tr": "2027"
        },
        {
          "emoji": "🎂",
          "word": "birthday",
          "tr": "the 3rd of May"
        },
        {
          "emoji": "🕒",
          "word": "clock",
          "tr": "It's 3 o'clock."
        },
        {
          "emoji": "📆",
          "word": "date",
          "tr": "the 2nd of November"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · DAYS",
      "title": "The days of the week",
      "tiles": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "notes": "Say the days, students repeat. Wednesday = \"WENZ-day\".",
      "small": true,
      "cols": 7,
      "foot": "Saturday + Sunday = the weekend 🎉 · Days start with a CAPITAL letter"
    },
    {
      "layout": "exercise",
      "ex": "daysorder",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 2 · MONTHS",
      "title": "The months of the year",
      "tiles": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "notes": "Say the months. \"Which month is your birthday?\" — students stand up when they hear their month.",
      "small": true,
      "cols": 4,
      "foot": "12 months · Months start with a CAPITAL letter"
    },
    {
      "layout": "exercise",
      "ex": "months",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "When's your birthday?",
      "listen": 0,
      "text": "A teacher asks five students about their birthdays.\nListen and write the dates (handout exercise 3).",
      "tips": [
        "the … of …",
        "Listen for -th / -st / -rd",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_bday",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 3 · ORDINAL NUMBERS",
      "title": "First, second, third…",
      "tiles": [
        "1st first",
        "2nd second",
        "3rd third",
        "4th fourth",
        "5th fifth",
        "6th sixth",
        "7th seventh",
        "8th eighth",
        "9th ninth",
        "10th tenth",
        "12th twelfth",
        "20th twentieth",
        "21st twenty-first",
        "22nd twenty-second",
        "30th thirtieth",
        "31st thirty-first"
      ],
      "notes": "Students say them in a chain.",
      "small": true,
      "cols": 4
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · DATES",
      "title": "When's your birthday?",
      "boxes": [
        {
          "head": "✍️ We write",
          "body": "3 May\n3rd May"
        },
        {
          "head": "🗣️ We say",
          "body": "the third of May"
        },
        {
          "head": "💬 Ask",
          "body": "When's your birthday?\n— It's on the 21st of October."
        }
      ],
      "foot": "What's the date today?",
      "notes": "Students ask three classmates \"When's your birthday?\""
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Date mistakes everyone makes",
      "rows": [
        {
          "wrong": "the twelveth",
          "right": "the twelfth"
        },
        {
          "wrong": "the fiveth",
          "right": "the fifth"
        },
        {
          "wrong": "the 3th of May",
          "right": "the 3rd of May"
        },
        {
          "wrong": "monday",
          "right": "Monday"
        },
        {
          "wrong": "in Monday",
          "right": "on Monday"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "ordinals",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "dates",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Birthday line",
      "emoji": "🎂",
      "minutes": 8,
      "text": "Stand in a line: January → December.\nNo writing — only English!\n\"When's your birthday?\"\n\"It's on the 5th of March.\"",
      "notes": "Check the line together at the end."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · ON, IN, AT",
      "title": "on Monday, in May, at 7",
      "boxes": [
        {
          "head": "📅 on",
          "body": "days and dates\non Monday\non the 5th of June"
        },
        {
          "head": "🗓️ in",
          "body": "months, years, parts of the day\nin May · in 2027\nin the morning"
        },
        {
          "head": "🕒 at",
          "body": "times\nat 7 o'clock\nat half past three\nat the weekend"
        }
      ],
      "foot": "on + day · in + month · at + time",
      "notes": "Say a word, students say \"on\", \"in\" or \"at\"."
    },
    {
      "layout": "exercise",
      "ex": "onin",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 5 · THE TIME",
      "title": "What time is it?",
      "boxes": [
        {
          "head": "🕐 o'clock",
          "body": "7:00 seven o'clock"
        },
        {
          "head": "🕧 half past",
          "body": "7:30 half past seven"
        },
        {
          "head": "🕒 quarter",
          "body": "7:15 quarter past seven\n7:45 quarter to eight"
        },
        {
          "head": "🕙 past / to",
          "body": "7:10 ten past seven\n7:50 ten to eight"
        }
      ],
      "foot": "What time is it? — It's half past seven.",
      "notes": "Move the clock hands; students say the time."
    },
    {
      "layout": "exercise",
      "ex": "times",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "exercise",
      "ex": "timechoose",
      "notes": "Handout exercise 8."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "What time is it?",
      "listen": 1,
      "text": "Five people say a time.\nListen and circle the right time (handout exercise 9).",
      "tips": [
        "past or to?",
        "quarter or half?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_time",
      "notes": "Handout exercise 9 (Listening 2)."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "What's the time, Mr Wolf?",
      "emoji": "🐺",
      "minutes": 6,
      "text": "One student is Mr Wolf.\nThe class: \"What's the time, Mr Wolf?\"\nWolf: \"It's three o'clock!\" → take 3 steps.\n\"It's dinner time!\" → run! 🏃",
      "notes": "Play in the corridor or at the back of the room."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "Plans for the weekend",
      "listen": 2,
      "text": "Jack and Lily plan to go to the cinema.\nListen and complete (handout exercise 10).",
      "tips": [
        "Day · time · street · date",
        "A street name is spelled slowly",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_plan",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "exercise",
      "ex": "dtcorrect",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Ben's week",
      "text": "Hi, I'm Ben. My birthday is on the 12th of February.\n\nOn weekdays I get up at seven o'clock. School starts at half past eight and finishes at three o'clock. On Tuesday and Thursday I've got swimming at five.\n\nOn Saturday I play football in the morning, and on Sunday I visit my grandparents. My favourite month is July — no school!",
      "tips": [
        "When? What time?",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (4 min)."
    },
    {
      "layout": "exercise",
      "ex": "week_tf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "week_q",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "exercise",
      "ex": "myweek",
      "notes": "Handout exercise 14. Then students read their week to a partner.",
      "minutes": 7
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — or a team quiz."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can say the days and months",
        "I can say dates: the 3rd of May",
        "I can use on, in, at",
        "I can tell the time"
      ],
      "foot": "Next: the review lesson, then the Block 1 exam! 🏁",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — When's your birthday?",
      "src": "audio/course/b1l5-listening-1.mp3",
      "text": "Emma, when is your birthday? It's on the third of March. And you, Jack? Mine's on the twenty-first of June. And what about you, Lily? My birthday is on the twelfth of October. Sam, when's your birthday? It's on the thirtieth of August. And what about you, Mia? Oh, mine is easy. It's on the first of January!",
      "script": "Narrator: Listening one. When's your birthday? Write the dates.\nA: Emma, when is your birthday?\nB: It's on the third of March.\nA: And you, Jack?\nC: Mine's on the twenty-first of June.\nA: And what about you, Lily?\nD: My birthday is on the twelfth of October.\nA: Sam, when's your birthday?\nE: It's on the thirtieth of August.\nA: And what about you, Mia?\nB: Oh, mine is easy. It's on the first of January!"
    },
    {
      "label": "Listening 2 — What time is it?",
      "src": "audio/course/b1l5-listening-2.mp3",
      "text": "Number one. The train to London leaves at quarter past seven. Number two. Hurry up! The film starts at half past eight. Number three. Excuse me, when does the shop close? It closes at nine o'clock. Number four. Our English lesson is at quarter to eleven today. Number five. The next bus comes at twenty to five.",
      "script": "Narrator: Listening two. What time is it? Circle the right time.\nNarrator: Number one.\nA: The train to London leaves at quarter past seven.\nNarrator: Number two.\nB: Hurry up! The film starts at half past eight.\nNarrator: Number three.\nC: Excuse me, when does the shop close?\nD: It closes at nine o'clock.\nNarrator: Number four.\nD: Our English lesson is at quarter to eleven today.\nNarrator: Number five.\nE: The next bus comes at twenty to five."
    },
    {
      "label": "Listening 3 — Plans for the weekend",
      "src": "audio/course/b1l5-listening-3.mp3",
      "text": "Hi, Lily! Do you want to go to the cinema on Saturday? Yes, good idea! What time? Let's meet at half past ten. OK. Where's the cinema? It's on Green Street. How do you spell Green? That's G, R, double E, N. And when does the film finish? It finishes at one o'clock. Perfect. Oh, and my birthday party is on the twentieth of May. Can you come? Yes, of course!",
      "script": "Narrator: Listening three. Jack and Lily plan a weekend. Listen and complete.\nA: Hi, Lily! Do you want to go to the cinema on Saturday?\nB: Yes, good idea! What time?\nA: Let's meet at half past ten.\nB: OK. Where's the cinema?\nA: It's on Green Street.\nB: How do you spell Green?\nA: That's G, R, double E, N.\nB: And when does the film finish?\nA: It finishes at one o'clock.\nB: Perfect. Oh, and my birthday party is on the twentieth of May. Can you come?\nA: Yes, of course!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
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
  // The review lesson (2 hours) (teacher, 2026-11-03): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude
  // (Kokoro voices, audio/course/*.mp3). Generated from a script; the slides (deck) and the handout come from `exercises`.
  title: "Block 1 review",
  emoji: "🔁",
  skills: [
    "listening",
    "reading",
    "writing",
    "speaking"
  ],
  goals: [
    "Practise everything from Lessons 1–5 with games and exercises",
    "Find what to practise again before the exam",
    "Know the exam: grammar, listening and reading online — writing on paper"
  ],
  warmups: [
    {
      "emoji": "🏃",
      "title": "Board race",
      "time": "8 min",
      "how": "Two teams, one marker each. Say a word (\"Wednesday\", \"children\", \"Japanese\"); one student from each team runs and writes it."
    },
    {
      "emoji": "🎯",
      "title": "Number bingo",
      "time": "7 min",
      "how": "3 × 3 grids with numbers 1–100; call tricky numbers (13/30, 14/40…)."
    },
    {
      "emoji": "🔍",
      "title": "Find someone who…",
      "time": "10 min",
      "how": "Students walk and ask the questions on the handout sheet (exercise 13) until they have a name for each line."
    }
  ],
  exercises: [
    {
      "id": "r_letters",
      "type": "odd",
      "skill": "listening",
      "title": "Lesson 1: Which letter has a different sound? Circle it.",
      "items": [
        {
          "q": "A   J   K   E",
          "a": "E"
        },
        {
          "q": "B   D   F   V",
          "a": "F"
        },
        {
          "q": "I   Y   E",
          "a": "E"
        },
        {
          "q": "M   N   S   T",
          "a": "T"
        },
        {
          "q": "Q   W   U   R",
          "a": "R"
        }
      ]
    },
    {
      "id": "r_numbers",
      "type": "write",
      "skill": "writing",
      "title": "Lesson 1: Write the numbers in words.",
      "items": [
        {
          "q": "14",
          "a": "fourteen"
        },
        {
          "q": "40",
          "a": "forty"
        },
        {
          "q": "19",
          "a": "nineteen"
        },
        {
          "q": "90",
          "a": "ninety"
        },
        {
          "q": "72",
          "a": "seventy-two"
        },
        {
          "q": "100",
          "a": "one hundred"
        }
      ]
    },
    {
      "id": "lis_rev1",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 1: A new member at the sports club. Listen and complete.",
      "items": [
        {
          "q": "Surname: ____________",
          "a": "Thompson (T-H-O-M-P-S-O-N)"
        },
        {
          "q": "Age: ________",
          "a": "13"
        },
        {
          "q": "Country: ____________",
          "a": "Canada"
        },
        {
          "q": "Phone: 078 ________ ________",
          "a": "366 914"
        },
        {
          "q": "Birthday: the ________ of ____________",
          "a": "4th of July"
        }
      ],
      "listen": 0
    },
    {
      "id": "r_be",
      "type": "gap",
      "skill": "writing",
      "title": "Lesson 2: Write am, is, are — or isn't / aren't.",
      "items": [
        {
          "q": "I ___ from the UK.",
          "a": "am"
        },
        {
          "q": "Lucy and Emma ___ my friends.",
          "a": "are"
        },
        {
          "q": "Is he Spanish? — No, he ___.",
          "a": "isn't"
        },
        {
          "q": "___ you twelve? — Yes, I am.",
          "a": "Are"
        },
        {
          "q": "Are they French? — No, they ___.",
          "a": "aren't"
        },
        {
          "q": "My teacher ___ British.",
          "a": "is"
        }
      ]
    },
    {
      "id": "r_nat",
      "type": "match",
      "skill": "reading",
      "title": "Lesson 2: Match the country and the nationality.",
      "items": [
        {
          "q": "Spain",
          "a": "Spanish"
        },
        {
          "q": "Japan",
          "a": "Japanese"
        },
        {
          "q": "the USA",
          "a": "American"
        },
        {
          "q": "Italy",
          "a": "Italian"
        },
        {
          "q": "France",
          "a": "French"
        },
        {
          "q": "China",
          "a": "Chinese"
        }
      ]
    },
    {
      "id": "r_family",
      "type": "choose",
      "skill": "writing",
      "title": "Lesson 3: Circle the right word.",
      "items": [
        {
          "q": "My mother's sister is my…",
          "opts": [
            "aunt",
            "uncle",
            "cousin"
          ],
          "a": "a"
        },
        {
          "q": "This is Ben. ___ sister is six.",
          "opts": [
            "Her",
            "His",
            "He"
          ],
          "a": "b"
        },
        {
          "q": "She ___ got two brothers.",
          "opts": [
            "have",
            "has",
            "is"
          ],
          "a": "b"
        },
        {
          "q": "Have you got a pet? — Yes, I ___.",
          "opts": [
            "have",
            "has",
            "am"
          ],
          "a": "a"
        },
        {
          "q": "the house of my grandma =",
          "opts": [
            "my grandma house",
            "my grandma's house",
            "my grandmas house"
          ],
          "a": "b"
        },
        {
          "q": "My parents =",
          "opts": [
            "mum and dad",
            "brother and sister",
            "aunt and uncle"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "lis_rev2",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 2: Two friends look at a photo. True (T) or false (F)?",
      "items": [
        {
          "q": "The photo is from Daniel's birthday.",
          "a": "T"
        },
        {
          "q": "Daniel's cousin is from Italy.",
          "a": "F (from Spain)"
        },
        {
          "q": "His cousin is fifteen.",
          "a": "T"
        },
        {
          "q": "The man with the camera is Daniel's uncle.",
          "a": "T"
        },
        {
          "q": "Daniel's grandmother has got a cat.",
          "a": "F (a dog)"
        }
      ],
      "listen": 1
    },
    {
      "id": "r_class",
      "type": "gap",
      "skill": "writing",
      "title": "Lesson 4: Write a / an, or the plural.",
      "items": [
        {
          "q": "___ umbrella",
          "a": "an"
        },
        {
          "q": "___ notebook",
          "a": "a"
        },
        {
          "q": "one box, two ____________",
          "a": "boxes"
        },
        {
          "q": "one child, three ____________",
          "a": "children"
        },
        {
          "q": "one dictionary, two ____________",
          "a": "dictionaries"
        },
        {
          "q": "___ apple",
          "a": "an"
        }
      ]
    },
    {
      "id": "r_demo",
      "type": "choose",
      "skill": "writing",
      "title": "Lesson 4: Circle this, that, these or those.",
      "items": [
        {
          "q": "___ is my bag. (here)",
          "opts": [
            "This",
            "These",
            "Those"
          ],
          "a": "a"
        },
        {
          "q": "___ are my books. (here)",
          "opts": [
            "That",
            "These",
            "This"
          ],
          "a": "b"
        },
        {
          "q": "Look at ___ birds! (over there)",
          "opts": [
            "these",
            "that",
            "those"
          ],
          "a": "c"
        },
        {
          "q": "Is ___ your pen? (over there)",
          "opts": [
            "that",
            "these",
            "those"
          ],
          "a": "a"
        },
        {
          "q": "What are ___ ? (here)",
          "opts": [
            "this",
            "that",
            "these"
          ],
          "a": "c"
        }
      ]
    },
    {
      "id": "r_time",
      "type": "gap",
      "skill": "writing",
      "title": "Lesson 5: Write on, in or at — and the time in words.",
      "items": [
        {
          "q": "___ Friday",
          "a": "on"
        },
        {
          "q": "___ December",
          "a": "in"
        },
        {
          "q": "___ six o'clock",
          "a": "at"
        },
        {
          "q": "7:30 = ____________",
          "a": "half past seven"
        },
        {
          "q": "9:45 = ____________",
          "a": "quarter to ten"
        },
        {
          "q": "3rd = ____________",
          "a": "third"
        }
      ]
    },
    {
      "id": "lis_rev3",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 3: A school day. Circle the right answer.",
      "items": [
        {
          "q": "Emma gets up at…",
          "opts": [
            "6:45",
            "7:15",
            "7:45"
          ],
          "a": "b"
        },
        {
          "q": "Her first lesson is…",
          "opts": [
            "English",
            "maths",
            "art"
          ],
          "a": "b"
        },
        {
          "q": "She has got lunch at…",
          "opts": [
            "twelve o'clock",
            "half past twelve",
            "one o'clock"
          ],
          "a": "b"
        },
        {
          "q": "On Wednesday she has got…",
          "opts": [
            "swimming",
            "football",
            "piano"
          ],
          "a": "a"
        },
        {
          "q": "Her favourite day is…",
          "opts": [
            "Monday",
            "Wednesday",
            "Friday"
          ],
          "a": "c"
        }
      ],
      "listen": 2
    },
    {
      "id": "mail_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read Sophie's e-mail. True (T) or false (F)?",
      "items": [
        {
          "q": "Sophie is twelve.",
          "a": "T"
        },
        {
          "q": "She is from Italy.",
          "a": "F (France)"
        },
        {
          "q": "Her birthday is in April.",
          "a": "T"
        },
        {
          "q": "She has got two sisters.",
          "a": "F (two brothers and a baby sister)"
        },
        {
          "q": "English is at nine o'clock on Friday.",
          "a": "T"
        }
      ],
      "text": "Hi Jack!\n\nMy name's Sophie and I'm your new e-friend! I'm twelve and I'm from Paris, in France. My birthday is on the 2nd of April.\n\nI've got a big family: my mum, my dad, two brothers and a baby sister. My brothers are fourteen and ten. My sister's name is Chloe — that's C-H-L-O-E.\n\nAt school my favourite day is Friday — I've got English at nine o'clock and art at half past two. Write soon! Sophie"
    },
    {
      "id": "findwho",
      "type": "write",
      "skill": "speaking",
      "title": "Find someone who… (ask and write a name).",
      "items": [
        {
          "q": "…has got a sister.  \"Have you got a sister?\"",
          "a": "(students' own)"
        },
        {
          "q": "…has a birthday in winter.  \"When's your birthday?\"",
          "a": "(students' own)"
        },
        {
          "q": "…can spell \"Wednesday\".  \"How do you spell Wednesday?\"",
          "a": "(students' own)"
        },
        {
          "q": "…gets up before 7 o'clock.  \"What time do you get up?\"",
          "a": "(students' own)"
        },
        {
          "q": "…has got a cousin in another country.  \"Have you got…?\"",
          "a": "(students' own)"
        }
      ]
    },
    {
      "id": "reply",
      "type": "write",
      "skill": "writing",
      "title": "Write a reply to Sophie (exam practice: 40–60 words).",
      "items": [
        {
          "q": "Hi Sophie! My name's…",
          "a": "(students' own)"
        },
        {
          "q": "I'm… years old and I'm from…",
          "a": "(students' own)"
        },
        {
          "q": "My birthday is on…",
          "a": "(students' own)"
        },
        {
          "q": "I've got… (family)",
          "a": "(students' own)"
        },
        {
          "q": "My favourite day is… because…",
          "a": "(students' own)"
        }
      ]
    },
    {
      "id": "quiz",
      "type": "choose",
      "skill": "speaking",
      "title": "Big team quiz! Say the answer first.",
      "items": [
        {
          "q": "W is said…",
          "opts": [
            "\"wee\"",
            "\"double U\"",
            "\"vee\""
          ],
          "a": "b"
        },
        {
          "q": "Japan →",
          "opts": [
            "Japanish",
            "Japanese",
            "Japan"
          ],
          "a": "b"
        },
        {
          "q": "She ___ got a dog.",
          "opts": [
            "have",
            "has",
            "is"
          ],
          "a": "b"
        },
        {
          "q": "one woman, two…",
          "opts": [
            "womans",
            "women",
            "womens"
          ],
          "a": "b"
        },
        {
          "q": "My birthday is ___ the 5th of May.",
          "opts": [
            "in",
            "at",
            "on"
          ],
          "a": "c"
        },
        {
          "q": "quarter past four =",
          "opts": [
            "4:15",
            "4:45",
            "3:45"
          ],
          "a": "a"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "The review lesson (2 hours): games and practice for Lessons 1–5. Note which exercises are hard — practise them again. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we review today",
      "rows": [
        {
          "emoji": "🔤",
          "text": "Lesson 1: letters, spelling, numbers"
        },
        {
          "emoji": "🌍",
          "text": "Lesson 2: greetings, \"be\", countries"
        },
        {
          "emoji": "👪",
          "text": "Lesson 3: family, his / her, have got"
        },
        {
          "emoji": "🎒",
          "text": "Lesson 4: a / an, plurals, this / these"
        },
        {
          "emoji": "🕒",
          "text": "Lesson 5: days, months, dates, the time"
        }
      ],
      "notes": "Ask: \"Which lesson was easy? Which was difficult?\""
    },
    {
      "layout": "questions",
      "tag": "WARM-UP",
      "title": "Quick questions from the block",
      "rows": [
        "How do you spell your surname?",
        "Where are you from?",
        "Have you got a brother?",
        {
          "q": "What's this? (point at a ruler)",
          "a": "It's a ruler."
        },
        "When's your birthday?"
      ],
      "notes": "Ask around the class — everyone answers one question."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Board race",
      "emoji": "🏃",
      "minutes": 8,
      "text": "Two teams. Listen to the word.\nRun and write it on the board — correctly!\n✅ = 1 point\nWords from all five lessons!",
      "notes": "Words: Wednesday, children, Japanese, uncle, twelfth, forty, umbrella."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "🔤",
          "word": "spell",
          "tr": "T-O-M"
        },
        {
          "emoji": "🔢",
          "word": "thirteen / thirty",
          "tr": "13 / 30"
        },
        {
          "emoji": "🌍",
          "word": "nationality",
          "tr": "British"
        },
        {
          "emoji": "👪",
          "word": "cousin",
          "tr": "my aunt's son"
        },
        {
          "emoji": "🎒",
          "word": "children",
          "tr": "one child"
        },
        {
          "emoji": "👉",
          "word": "those",
          "tr": "far, many"
        },
        {
          "emoji": "🥇",
          "word": "twelfth",
          "tr": "12th"
        },
        {
          "emoji": "🕒",
          "word": "quarter to",
          "tr": "9:45"
        }
      ],
      "notes": "Students say each word and an example — then click to check."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 1",
      "title": "Letters and numbers",
      "boxes": [
        {
          "head": "🔤 Spelling",
          "body": "How do you spell it?\nB - E - double L - A"
        },
        {
          "head": "🔢 Numbers",
          "body": "13 thirTEEN · 30 THIRty\n40 forty · 90 ninety"
        },
        {
          "head": "📞 Phone",
          "body": "0 = \"oh\" · 55 = \"double five\""
        }
      ],
      "foot": "The vowels: A E I O U",
      "notes": "Quick drill: spell three names, say three numbers."
    },
    {
      "layout": "exercise",
      "ex": "r_letters",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "r_numbers",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "At the sports club",
      "listen": 0,
      "text": "Oliver joins a sports club.\nListen and complete the form (handout exercise 3):\nsurname, age, country, phone, birthday.",
      "tips": [
        "The surname is spelled slowly",
        "Numbers: phone and date",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_rev1",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 2",
      "title": "Hello! Countries",
      "boxes": [
        {
          "head": "🧩 be",
          "body": "I am · he / she / it is\nyou / we / they are"
        },
        {
          "head": "❓ Short answers",
          "body": "Yes, I am. / No, I'm not.\nYes, he is. / No, he isn't."
        },
        {
          "head": "🌍 Capital letters",
          "body": "Spain → Spanish\nJapan → Japanese"
        }
      ],
      "foot": "Where are you from? — I'm from…",
      "notes": "Students ask each other \"Are you…?\" questions."
    },
    {
      "layout": "exercise",
      "ex": "r_be",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "r_nat",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 3",
      "title": "My family",
      "boxes": [
        {
          "head": "👪 Words",
          "body": "aunt · uncle · cousin\nparents · grandparents"
        },
        {
          "head": "🔑 his / her / 's",
          "body": "Tom → his · Sara → her\nTom's bag"
        },
        {
          "head": "🎒 have got",
          "body": "I have got · she has got\nHave you got…? — Yes, I have."
        }
      ],
      "foot": "he / she / it → HAS got",
      "notes": "Students tell a partner about one family member."
    },
    {
      "layout": "exercise",
      "ex": "r_family",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "A birthday photo",
      "listen": 1,
      "text": "Two friends look at a birthday photo.\nListen: true or false? (handout exercise 7)",
      "tips": [
        "Who is it?",
        "How old? Where from?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_rev2",
      "notes": "Handout exercise 7 (Listening 2)."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 4",
      "title": "Classroom things",
      "boxes": [
        {
          "head": "🍎 a / an",
          "body": "a pen · an apple"
        },
        {
          "head": "➕ Plurals",
          "body": "boxes · dictionaries\nmen · women · children"
        },
        {
          "head": "👉 this / these",
          "body": "near: this, these\nfar: that, those"
        }
      ],
      "foot": "What's this? — It's a… · What are these? — They're…",
      "notes": "Point at things; students say the sentence."
    },
    {
      "layout": "exercise",
      "ex": "r_class",
      "notes": "Handout exercise 8."
    },
    {
      "layout": "exercise",
      "ex": "r_demo",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 5",
      "title": "Days, dates and time",
      "boxes": [
        {
          "head": "📅 on / in / at",
          "body": "on Monday · in May · at 7"
        },
        {
          "head": "🥇 Dates",
          "body": "the 3rd of May\nfirst · second · third · twelfth"
        },
        {
          "head": "🕒 Time",
          "body": "half past · quarter past\nquarter to · ten to"
        }
      ],
      "foot": "When's your birthday? — It's on the…",
      "notes": "Show times on a clock."
    },
    {
      "layout": "exercise",
      "ex": "r_time",
      "notes": "Handout exercise 10."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "A school day",
      "listen": 2,
      "text": "Emma talks about her school day.\nListen and circle the right answer (handout exercise 11).",
      "tips": [
        "Times · subjects · days",
        "Circle a, b or c",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_rev3",
      "notes": "Handout exercise 11 (Listening 3)."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "The block's top mistakes",
      "rows": [
        {
          "wrong": "fourty",
          "right": "forty"
        },
        {
          "wrong": "I'm from Spanish.",
          "right": "I'm from Spain."
        },
        {
          "wrong": "She have got a dog.",
          "right": "She has got a dog."
        },
        {
          "wrong": "two childs",
          "right": "two children"
        },
        {
          "wrong": "in Monday",
          "right": "on Monday"
        },
        {
          "wrong": "I have 12 years.",
          "right": "I'm 12."
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "An e-mail from Sophie",
      "text": "Hi Jack!\n\nMy name's Sophie and I'm your new e-friend! I'm twelve and I'm from Paris, in France. My birthday is on the 2nd of April.\n\nI've got a big family: my mum, my dad, two brothers and a baby sister. My brothers are fourteen and ten. My sister's name is Chloe — that's C-H-L-O-E.\n\nAt school my favourite day is Friday — I've got English at nine o'clock and art at half past two. Write soon! Sophie",
      "tips": [
        "Name · age · country · family · school",
        "Read, then do exercise 12"
      ],
      "notes": "Students read silently (4 min)."
    },
    {
      "layout": "exercise",
      "ex": "mail_tf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "findwho",
      "notes": "Handout exercise 13 — students walk and ask.",
      "minutes": 8
    },
    {
      "layout": "exercise",
      "ex": "reply",
      "notes": "Handout exercise 14 — exam practice for the writing part.",
      "minutes": 10
    },
    {
      "layout": "list",
      "tag": "THE EXAM",
      "title": "What is in the Block 1 exam?",
      "rows": [
        {
          "emoji": "📱",
          "text": "Online (your phone, with your ID): grammar · listening · reading"
        },
        {
          "emoji": "📝",
          "text": "Grammar: be, have got, his / her, a / an, plurals, on / in / at"
        },
        {
          "emoji": "🎧",
          "text": "Listening: 3 recordings, 5 questions each, two times"
        },
        {
          "emoji": "📖",
          "text": "Reading: a short text about a student"
        },
        {
          "emoji": "✍️",
          "text": "Writing on paper: \"About me\", 40–60 words"
        }
      ],
      "notes": "Answer students' questions about the exam."
    },
    {
      "layout": "exercise",
      "ex": "quiz",
      "notes": "Handout exercise 15 — the big team quiz."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can spell, count and say dates",
        "I can talk about me, my family and my country",
        "I can use the grammar of Block 1",
        "I'm ready for the exam!"
      ],
      "foot": "Homework: the review test 📲 (30 questions) — then the exam!",
      "notes": "Send the review test link now (Course → Review test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — A new member at the sports club",
      "src": "audio/course/b1review-listening-1.mp3",
      "text": "Hello! Welcome to the sports club. What's your name? Hi. My name's Oliver Thompson. How do you spell Thompson? That's T, H, O, M, P, S, O, N. Thanks. How old are you, Oliver? I'm thirteen. And where are you from? I'm from Canada. OK. Can I have your phone number? Sure. It's oh seven eight, three double six, nine one four. And when's your birthday? It's on the fourth of July. Great. See you on Monday, then!",
      "script": "Narrator: Listening one. A new member at the sports club. Listen and complete.\nA: Hello! Welcome to the sports club. What's your name?\nB: Hi. My name's Oliver Thompson.\nA: How do you spell Thompson?\nB: That's T, H, O, M, P, S, O, N.\nA: Thanks. How old are you, Oliver?\nB: I'm thirteen.\nA: And where are you from?\nB: I'm from Canada.\nA: OK. Can I have your phone number?\nB: Sure. It's oh seven eight, three double six, nine one four.\nA: And when's your birthday?\nB: It's on the fourth of July.\nA: Great. See you on Monday, then!"
    },
    {
      "label": "Listening 2 — A birthday photo",
      "src": "audio/course/b1review-listening-2.mp3",
      "text": "Daniel, is this a photo from your birthday? Yes, it is. Look, this is my cousin Pablo. He's from Spain. How old is he? He's fifteen. And who's the man with the camera? That's my uncle. He's Pablo's dad. And this lady with the dog? That's my grandmother, and the dog is hers. He's called Rocky.",
      "script": "Narrator: Listening two. Two friends look at a photo. True or false?\nA: Daniel, is this a photo from your birthday?\nB: Yes, it is. Look, this is my cousin Pablo. He's from Spain.\nA: How old is he?\nB: He's fifteen.\nA: And who's the man with the camera?\nB: That's my uncle. He's Pablo's dad.\nA: And this lady with the dog?\nB: That's my grandmother, and the dog is hers. He's called Rocky."
    },
    {
      "label": "Listening 3 — A school day",
      "src": "audio/course/b1review-listening-3.mp3",
      "text": "I get up at quarter past seven, and school starts at half past eight. My first lesson is maths. After that I've got English. Lunch is at half past twelve. On Wednesday I go swimming after school. Friday is my favourite day, because we've got art and music!",
      "script": "Narrator: Listening three. Emma talks about her school day. Circle the right answer.\nA: I get up at quarter past seven, and school starts at half past eight.\nA: My first lesson is maths. After that I've got English.\nA: Lunch is at half past twelve.\nA: On Wednesday I go swimming after school.\nA: Friday is my favourite day, because we've got art and music!"
    }
  ],
  teacherScript: [
    "Play each listening twice. The full scripts are below. The review test (30 questions) is good exam practice — send its link at the end."
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
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
COURSE_BEGINNER.blocks[0].exam = {
  "title": "Block 1 exam",
  "emoji": "🏁",
  "skills": [
    "listening",
    "reading",
    "writing"
  ],
  "keepOrder": true,
  "intro": "Grammar, listening and reading are one online test (students open the link and enter their ID; it's marked automatically): 10 grammar + 15 listening (3 recordings × 5 questions) + 10 reading = 35. Writing is on paper — you mark it out of 10 and type the marks below. Total: 35 + 10 = 45.",
  "writing": {
    "max": 10
  },
  "listen": [
    {
      "label": "Part 2 — Recording 1: Jennifer (questions 11–15)",
      "src": "audio/course/b1exam-listening-1.mp3",
      "text": "Hello! My name is Jennifer. That's J, E, double N, I, F, E, R. I'm fourteen years old, and I'm from the UK. If you want to call me, my phone number is oh nine three, four four seven, two oh eight. Oh, and my birthday is on the eighteenth of April.",
      "script": "Narrator: Recording one. Questions eleven to fifteen. Listen to Jennifer.\nA: Hello! My name is Jennifer.\nA: That's J, E, double N, I, F, E, R.\nA: I'm fourteen years old, and I'm from the UK.\nA: If you want to call me, my phone number is oh nine three, four four seven, two oh eight.\nA: Oh, and my birthday is on the eighteenth of April."
    },
    {
      "label": "Part 2 — Recording 2: Daniel (questions 16–20)",
      "src": "audio/course/b1exam-listening-2.mp3",
      "text": "Hi, I'm Daniel. I'm from Germany, so I'm German. I've got two sisters, Anna and Lisa. There's a dictionary in my bag, and two pens. My English lesson is on Friday, at quarter past ten.",
      "script": "Narrator: Recording two. Questions sixteen to twenty. Listen to Daniel.\nA: Hi, I'm Daniel. I'm from Germany, so I'm German.\nA: I've got two sisters, Anna and Lisa.\nA: There's a dictionary in my bag, and two pens.\nA: My English lesson is on Friday, at quarter past ten."
    },
    {
      "label": "Part 2 — Recording 3: A phone message (questions 21–25)",
      "src": "audio/course/b1exam-listening-3.mp3",
      "text": "Hi Tom, it's Lucy! My birthday party is on Saturday. That's Saturday the ninth of May. It starts at three o'clock. My house is number forty-seven, Park Road. You can bring your cousin, too! Call me. My number is oh seven seven, five one two, three nine oh. Bye!",
      "script": "Narrator: Recording three. Questions twenty-one to twenty-five. Listen to Lucy's phone message.\nA: Hi Tom, it's Lucy! My birthday party is on Saturday. That's Saturday the ninth of May.\nA: It starts at three o'clock.\nA: My house is number forty-seven, Park Road.\nA: You can bring your cousin, too! Call me. My number is oh seven seven, five one two, three nine oh. Bye!"
    }
  ],
  "test": [
    {
      "part": "grammar",
      "q": "Grammar 1. My sister _____ ten years old.",
      "a": "is",
      "wrong": [
        "are",
        "am",
        "has"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 2. _____ you from Canada? — Yes, I am.",
      "a": "Are",
      "wrong": [
        "Is",
        "Am",
        "Have"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 3. They're from the USA. They're _____.",
      "a": "American",
      "wrong": [
        "USA",
        "Americish",
        "Amerikan"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 4. This is Jack. _____ father is a doctor.",
      "a": "His",
      "wrong": [
        "Her",
        "He",
        "Him"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 5. My grandparents _____ a big house.",
      "a": "have got",
      "wrong": [
        "has got",
        "is got",
        "are got"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 6. the car of my father = my _____ car",
      "a": "father's",
      "wrong": [
        "fathers",
        "father",
        "father is"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 7. I've got _____ orange.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 8. one child, four _____",
      "a": "children",
      "wrong": [
        "childs",
        "childrens",
        "child"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 9. _____ are my friends over there. (far)",
      "a": "Those",
      "wrong": [
        "That",
        "This",
        "These is"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 10. Her birthday is _____ the 9th of March.",
      "a": "on",
      "wrong": [
        "in",
        "at",
        "of"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 11. Her name is J-E-N-N-I-_____-E-R.",
      "a": "F",
      "wrong": [
        "V",
        "P",
        "S"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 12. Jennifer is _____ years old.",
      "a": "14",
      "wrong": [
        "40",
        "13",
        "4"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 13. Her phone number is 093 447 _____.",
      "a": "208",
      "wrong": [
        "280",
        "218",
        "802"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 14. Her birthday is on the _____ of April.",
      "a": "18th",
      "wrong": [
        "8th",
        "80th",
        "28th"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 15. Jennifer is from _____.",
      "a": "the UK",
      "wrong": [
        "the USA",
        "Canada",
        "Italy"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 16. Daniel is _____.",
      "a": "German",
      "wrong": [
        "Spanish",
        "French",
        "Turkish"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 17. Daniel has got two _____.",
      "a": "sisters",
      "wrong": [
        "brothers",
        "cousins",
        "sons"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 18. In his bag there is a _____.",
      "a": "dictionary",
      "wrong": [
        "ruler",
        "phone",
        "apple"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 19. His English lesson is on _____.",
      "a": "Friday",
      "wrong": [
        "Monday",
        "Thursday",
        "Saturday"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 20. His English lesson is at _____.",
      "a": "quarter past ten",
      "wrong": [
        "half past ten",
        "quarter to ten",
        "ten o'clock"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 21. Lucy's party is on _____.",
      "a": "Saturday",
      "wrong": [
        "Sunday",
        "Friday",
        "Monday"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 22. The date is the _____ of May.",
      "a": "9th",
      "wrong": [
        "5th",
        "19th",
        "29th"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 23. The party starts at _____.",
      "a": "three o'clock",
      "wrong": [
        "two o'clock",
        "half past three",
        "four o'clock"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 24. Lucy's house is number _____, Park Road.",
      "a": "47",
      "wrong": [
        "74",
        "17",
        "40"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 25. Lucy's phone number is 077 512 _____.",
      "a": "390",
      "wrong": [
        "309",
        "930",
        "319"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 26. Amy is _____ years old.",
      "a": "12",
      "wrong": [
        "15",
        "9",
        "73"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 27. She is from _____.",
      "a": "Bristol",
      "wrong": [
        "London",
        "Manchester",
        "Germany"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 28. She has got _____ brothers.",
      "a": "two",
      "wrong": [
        "three",
        "one",
        "four"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 29. Sam is _____.",
      "a": "nine",
      "wrong": [
        "fifteen",
        "twelve",
        "nineteen"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 30. Ben is Amy's _____.",
      "a": "brother",
      "wrong": [
        "father",
        "cousin",
        "uncle"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 31. Her grandmother is _____.",
      "a": "seventy-three",
      "wrong": [
        "thirty-seven",
        "seventy",
        "sixty-three"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 32. Her grandmother's birthday is on the _____ of January.",
      "a": "1st",
      "wrong": [
        "3rd",
        "21st",
        "31st"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 33. Amy's favourite day is _____.",
      "a": "Friday",
      "wrong": [
        "Monday",
        "Saturday",
        "Sunday"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 34. She has got art at _____.",
      "a": "half past two",
      "wrong": [
        "two o'clock",
        "quarter past two",
        "half past three"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 35. In her bag she has got four _____.",
      "a": "notebooks",
      "wrong": [
        "pencils",
        "dictionaries",
        "books"
      ]
    }
  ],
  "handout": {
    "title": "Block 1 exam — paper",
    "sections": [
      {
        "skill": "reading",
        "title": "Part 3: Read the text. Answer questions 26–35 on your phone.",
        "text": "Hello! My name is Amy and I'm twelve years old. I'm from Bristol, in the UK. I've got a big family: my mother, my father, two brothers and a grandmother. My brothers' names are Ben and Sam. Ben is fifteen and Sam is nine. My grandmother is seventy-three. Her birthday is on the 1st of January! My favourite day is Friday because I've got art at half past two. In my school bag I've got four notebooks, a pencil case and an English dictionary."
      },
      {
        "skill": "writing",
        "title": "Part 4: Write about yourself (40–60 words). Your name and age, where you are from, your family, your birthday, what is in your school bag.",
        "text": "________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n"
      }
    ],
    "teacherScript": [
      "Part 2: press 🔊 on each recording's slide and play it TWICE. Recording 1 → questions 11–15, recording 2 → 16–20, recording 3 → 21–25."
    ],
    "answers": [
      "Online part (35) is marked automatically.",
      "Writing (10): task — all five points: name/age, country, family, birthday, school bag (4) · grammar — am/is/are, have got, his/her (3) · words — enough and right (2) · spelling and capital letters (1)."
    ]
  },
  "teacherScript": [
    "Part 2: press 🔊 on each recording's slide and play it TWICE. Recording 1 → questions 11–15, recording 2 → 16–20, recording 3 → 21–25."
  ],
  "deck": [
    {
      "layout": "title",
      "notes": "The Block 1 exam (about 60 minutes). Before: phones charged, the exam paper printed, the online part's link copied (Course → Online part → Copy the link)."
    },
    {
      "layout": "list",
      "tag": "THE EXAM",
      "title": "Block 1 exam — how it works",
      "rows": [
        {
          "emoji": "📱",
          "text": "Open the link on your phone and enter your ID"
        },
        {
          "emoji": "📝",
          "text": "Part 1: Grammar — questions 1–10"
        },
        {
          "emoji": "🎧",
          "text": "Part 2: Listening — questions 11–25 (3 recordings, two times each)"
        },
        {
          "emoji": "📖",
          "text": "Part 3: Reading — questions 26–35 (the text is on your paper)"
        },
        {
          "emoji": "✍️",
          "text": "Part 4: Writing — on paper"
        }
      ],
      "notes": "Phones only for the exam. Check that everyone entered the right ID."
    },
    {
      "layout": "boxes",
      "tag": "PART 1",
      "title": "Grammar",
      "boxes": [
        {
          "head": "📝 Questions 1–10",
          "body": "Choose the right answer.\nDon't start the listening yet!"
        },
        {
          "head": "⏱️ Time",
          "body": "About 10 minutes"
        },
        {
          "head": "✋ Finished?",
          "body": "Wait for the listening.\nDon't talk — thank you!"
        }
      ],
      "foot": "Read every answer before you choose",
      "notes": "Start the timer if you like."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "PART 2 · LISTENING",
      "title": "Recording 1 — Jennifer",
      "listen": 0,
      "text": "Questions 11–15.\nJennifer talks about herself.\nYou hear the recording two times.",
      "tips": [
        "Her name is spelled slowly",
        "Age · phone · birthday · country"
      ],
      "notes": "Play twice, then go on."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "PART 2 · LISTENING",
      "title": "Recording 2 — Daniel",
      "listen": 1,
      "text": "Questions 16–20.\nDaniel talks about himself.\nYou hear the recording two times.",
      "tips": [
        "Nationality · family · bag",
        "Day and time of his lesson"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "PART 2 · LISTENING",
      "title": "Recording 3 — A phone message",
      "listen": 2,
      "text": "Questions 21–25.\nLucy leaves a message about her party.\nYou hear the recording two times.",
      "tips": [
        "Day · date · time",
        "House number · phone number"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Part 3: Reading — questions 26–35",
      "text": "Hello! My name is Amy and I'm twelve years old. I'm from Bristol, in the UK. I've got a big family: my mother, my father, two brothers and a grandmother. My brothers' names are Ben and Sam. Ben is fifteen and Sam is nine. My grandmother is seventy-three. Her birthday is on the 1st of January! My favourite day is Friday because I've got art at half past two. In my school bag I've got four notebooks, a pencil case and an English dictionary.",
      "tips": [
        "The text is on your paper too",
        "Answer on your phone"
      ],
      "notes": "Students read and answer on their phones (about 15 minutes)."
    },
    {
      "layout": "game",
      "tag": "PART 4 · ON PAPER",
      "title": "Writing: About me",
      "emoji": "✍️",
      "minutes": 20,
      "text": "Write about yourself — 40 to 60 words:\n• your name and age · where you are from\n• your family\n• your birthday\n• what is in your school bag",
      "notes": "Collect the papers. Mark them out of 10 and type the marks on the exam page."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "Press the button to send your online answers 📤",
        "Give your writing to your teacher",
        "Block 1 is complete! 🏆"
      ],
      "foot": "Well done, everyone! 🎉",
      "notes": "Check the marks table on the exam page as answers arrive."
    }
  ]
};

// every lesson's (and review's) handout is made from its exercises — the same ones its slides show
COURSE_BEGINNER.blocks.forEach(b => b.lessons.concat(b.review ? [b.review] : []).forEach(l => { if (l.exercises) l.handout = courseExerciseHandout(l); }));

const TA_COURSES = [COURSE_BEGINNER];
