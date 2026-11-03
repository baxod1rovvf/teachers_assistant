/* ================= THE COURSE (2026-11-02) =================
   The teacher's course map: one shared course that every group of that level goes
   through. A BLOCK = 5 lessons + 1 review lesson + 1 exam (3 lessons a week → an exam
   every 2 weeks). Each block covers all four skills (listening, reading, writing,
   speaking) across its lessons, and every lesson starts with a warm-up / pair-work game.

   A lesson's material: slides (the teacher can change their text — kept in
   ta_course_edits), a printable exercises handout (with the teacher's script and answer
   key), and a 20-question revision test students do from a link with their ID.

   Only lessons with `slides` are ready; the others are on the map as "coming soon".
   To add a lesson's material, fill in the same fields as c1l1 below. */

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

// The teacher's block themes (2026-11-03): Block 1 "Me", Block 2 "My things", Block 3 "My day" (Blocks 4–6 from the first plan).
// Block 1 has new ids (c1…) so nothing saved for the old Block 1 (b1…) gets mixed up with it.
// The teacher's block themes (2026-11-03): Block 1 "Me", Block 2 "My things", Block 3 "My day" (Blocks 4–6 from the first plan).
// Block 1 has new ids (c1…) so nothing saved for the old Block 1 (b1…) gets mixed up with it.
// The teacher's block themes (2026-11-03): Block 1 "Me", Block 2 "My things", Block 3 "My day" (Blocks 4–6 from the first plan).
// Block 1 has new ids (c1…) so nothing saved for the old Block 1 (b1…) gets mixed up with it.
// The teacher's block themes (2026-11-03): Block 1 "Me", Block 2 "My things", Block 3 "My day" (Blocks 4–6 from the first plan).
// Block 1 has new ids (c1…) so nothing saved for the old Block 1 (b1…) gets mixed up with it.
// The teacher's block themes (2026-11-03): Block 1 "Me", Block 2 "My things", Block 3 "My day" (Blocks 4–6 from the first plan).
// Block 1 has new ids (c1…) so nothing saved for the old Block 1 (b1…) gets mixed up with it.
const COURSE_BEGINNER = {
  id: 'beginner',
  title: 'Beginner English',
  emoji: '🌱',
  blocks: [
    {
      id: "c1", title: "Me", emoji: "🙋", color: "#FF7AC6",
      lessons: [
        { id: "c1l1", title: "Hello, numbers & countries", emoji: "👋", sub: "Words V1: greetings and class phrases, the alphabet, numbers 0–100, countries", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c1l2", title: "be: all forms", emoji: "🧩", sub: "Grammar G1: be — am / is / are, isn't / aren't, Am / Is / Are…? and short answers", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c1l3", title: "Things, colours & jobs", emoji: "🎨", sub: "Words V2: things in my bag and the classroom, 11 colours, jobs", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c1l4", title: "One pen, two pens", emoji: "✏️", sub: "Grammar G2: plurals -s, -es, -ies; men, women, children, people; this / that / these / those", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c1l5", title: "An apple, the apple", emoji: "🍎", sub: "Grammar G3: a / an / the", skills: ["listening", "reading", "writing", "speaking"] }
      ]
    },
    {
      id: "c2", title: "My things", emoji: "🎒", color: "#FFB020",
      review: { title: 'Review 2' }, exam: { title: 'Sunday exam #2' },
      lessons: [
        { id: "c2l1", title: "Family, people & pets", emoji: "👪", sub: "Words V3: family, people and pets", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c2l2", title: "have got: I've got a brother", emoji: "🎁", sub: "Grammar G4: have got / has got, haven't got, Have you got…?", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c2l3", title: "Food & drink", emoji: "🍕", sub: "Words V4: food and drink", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c2l4", title: "some & any: at the café", emoji: "☕", sub: "Grammar G5: some / any, There is / There are", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c2l5", title: "Whose is it? my, your, his, her + 's", emoji: "🔑", sub: "Grammar G6: my, your, his, her, our, their + 's", skills: ["listening", "reading", "writing", "speaking"] }
      ]
    },
    {
      id: "c3", title: "My day", emoji: "☀️", color: "#2ED3A0",
      review: { title: 'Review 3' }, exam: { title: 'Sunday exam #3' },
      lessons: [
        { id: "c3l1", title: "Wake up, Alex! My day", emoji: "⏰", sub: "Words V5: daily routines", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c3l2", title: "Lily plays, Alex plays: he / she + s", emoji: "⚽", sub: "Grammar G7: present simple, he / she / it + s", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c3l3", title: "What time is it? The clock, days & subjects", emoji: "🕒", sub: "Words V6: the time, days of the week, school subjects", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c3l4", title: "Do you like Mondays? don't, doesn't, Do / Does", emoji: "❓", sub: "Grammar G8: present simple negatives and questions", skills: ["listening", "reading", "writing", "speaking"] },
        { id: "c3l5", title: "Interview a star: wh-questions", emoji: "🎤", sub: "Grammar G9: what, where, when, who, how…", skills: ["listening", "reading", "writing", "speaking"] }
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

/* ---------- Block 1, Lesson 1: Hello, numbers & countries ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[0], {
  // A 2-hour lesson: many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Greet people and use class phrases (\"Can you repeat that, please?\")",
    "Say and spell the alphabet: \"How do you spell it?\"",
    "Say numbers 0–100 (thirTEEN or THIRty?) and phone numbers",
    "Say countries and nationalities"
  ],
  warmups: [
    {
      "emoji": "⛓️",
      "title": "Name chain",
      "time": "7 min",
      "how": "Student 1: \"I'm Anna.\" Student 2: \"She's Anna. I'm Alex.\" Student 3: \"She's Anna, he's Alex, I'm Lucy.\"… round the class."
    },
    {
      "emoji": "🎯",
      "title": "Number bingo",
      "time": "8 min",
      "how": "3 × 3 grids with numbers from 1 to 100; call numbers, three in a line wins."
    },
    {
      "emoji": "🎴",
      "title": "Find your twin",
      "time": "7 min",
      "how": "Cards with a name and a country; students ask \"Where are you from?\" until they find their twin."
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
      "id": "classphr",
      "type": "match",
      "skill": "speaking",
      "title": "What do you say? Match.",
      "items": [
        {
          "q": "You don't understand.",
          "a": "Sorry, I don't understand."
        },
        {
          "q": "You want to hear it again.",
          "a": "Can you repeat that, please?"
        },
        {
          "q": "You don't know a word.",
          "a": "What does \"ruler\" mean?"
        },
        {
          "q": "You point at a book.",
          "a": "What's this in English?"
        },
        {
          "q": "You don't know the answer.",
          "a": "I don't know."
        },
        {
          "q": "You are late.",
          "a": "Sorry I'm late!"
        },
        {
          "q": "You need help.",
          "a": "Can you help me, please?"
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
      "title": "Listening 2: Listen. Write the names.",
      "listen": 1,
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
      "title": "Listening 3: Listen and circle the right number.",
      "listen": 2,
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
          "q": "Canada   Mexico   Spanish   Japan",
          "a": "Spanish"
        },
        {
          "q": "the UK   the USA   China   French",
          "a": "French"
        },
        {
          "q": "American   Italian   Turkey   Mexican",
          "a": "Turkey"
        }
      ]
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
      "title": "Write about you.",
      "items": [
        {
          "q": "Hello! My name is…",
          "a": "(students' own)"
        },
        {
          "q": "How do you spell it? …",
          "a": "(students' own)"
        },
        {
          "q": "I'm… years old.",
          "a": "(students' own)"
        },
        {
          "q": "I'm from…  I'm… (nationality)",
          "a": "(students' own)"
        },
        {
          "q": "My phone number is…",
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
          "q": "Good ___ ! (at 8 am)",
          "opts": [
            "morning",
            "evening",
            "night"
          ],
          "a": "a"
        },
        {
          "q": "You don't understand. You say:",
          "opts": [
            "I don't know.",
            "Sorry, I don't understand.",
            "Goodbye!"
          ],
          "a": "b"
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
          "q": "Japan →",
          "opts": [
            "Japanish",
            "Japanese",
            "Japan"
          ],
          "a": "b"
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
      "notes": "Lesson 1 (2 hours). Smile, say \"Hello!\" and write your name on the board. Spell it aloud. Students need the handout (15 exercises)."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "👋",
          "text": "Words: greetings and class phrases"
        },
        {
          "emoji": "🔤",
          "text": "The alphabet: \"How do you spell it?\""
        },
        {
          "emoji": "🔢",
          "text": "Numbers 0–100 and phone numbers"
        },
        {
          "emoji": "🌍",
          "text": "Countries and nationalities"
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
      "notes": "It's the first lesson. Click to show each question; ask 3–4 students each."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Name chain",
      "emoji": "⛓️",
      "minutes": 7,
      "text": "Student 1: \"I'm Anna.\"\nStudent 2: \"She's Anna. I'm Alex.\"\nStudent 3: \"She's Anna, he's Alex, I'm Lucy.\"\n…and round the class!",
      "notes": "If someone forgets a name, the class helps."
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
          "emoji": "✍️",
          "word": "spell",
          "tr": "B - O - O - K"
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
          "emoji": "📞",
          "word": "phone number",
          "tr": "077 455 120"
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
      "foot": "\"Good night!\" = when you go to bed 🛏️ · \"Nice to meet you!\" = the first time",
      "notes": "Show a clock time, students say the greeting."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Greeting mistakes everyone makes",
      "rows": [
        {
          "wrong": "Good night! (when you arrive)",
          "right": "Good evening!"
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
      "notes": "Handout exercise 1."
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
      "text": "People meet and say goodbye.\nListen and circle the right answer (handout exercise 3).",
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
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 2 · CLASS PHRASES",
      "title": "In the classroom we say…",
      "tiles": [
        "🤔 Sorry, I don't understand.",
        "🔁 Can you repeat that, please?",
        "📕 What's this in English?",
        "❓ What does \"ruler\" mean?",
        "🤷 I don't know.",
        "⏰ Sorry I'm late!",
        "🙋 Can you help me, please?",
        "🚻 Can I go to the toilet?"
      ],
      "notes": "Say each phrase, students repeat. Use them all lesson!",
      "small": true,
      "cols": 4,
      "foot": "Put the phrases on the wall — use them every lesson"
    },
    {
      "layout": "exercise",
      "ex": "classphr",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 3 · THE ALPHABET",
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
      "notes": "Say the alphabet slowly, students repeat. Then boys and girls take turns.",
      "small": false,
      "mark": [
        "A",
        "E",
        "I",
        "O",
        "U"
      ],
      "foot": "Vowels: A E I O U · the others are consonants"
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · SOUNDS",
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
      "foot": "How do you spell it? — B - E - double L - A  (Bella)",
      "notes": "Groups race to say their line."
    },
    {
      "layout": "exercise",
      "ex": "letters",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Spell your name",
      "listen": 1,
      "text": "Five people say and spell their names.\nListen and write the names (handout exercise 6).",
      "tips": [
        "Listen for \"double\"",
        "Names start with a capital letter",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "names",
      "notes": "Handout exercise 6 (Listening 2)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 4 · NUMBERS 0–20",
      "title": "Numbers 0–20",
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
      "notes": "Count together, then backwards from 20.",
      "small": true,
      "cols": 7
    },
    {
      "layout": "boxes",
      "tag": "LESSON 4 · BIG NUMBERS",
      "title": "Tens, big numbers, phone numbers",
      "boxes": [
        {
          "head": "Tens",
          "body": "20 twenty · 30 thirty · 40 forty\n50 fifty · 60 sixty · 70 seventy\n80 eighty · 90 ninety · 100 one hundred"
        },
        {
          "head": "👂 The stress",
          "body": "13 thir-TEEN\n30 THIR-ty\n14 four-TEEN · 40 FOR-ty"
        },
        {
          "head": "📞 Phone numbers",
          "body": "0 → \"oh\"\n55 → \"double five\""
        }
      ],
      "foot": "13 thirTEEN  ≠  30 THIRty",
      "notes": "Clap the stress."
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
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "numwords",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "exercise",
      "ex": "choosenum",
      "notes": "Handout exercise 8."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "Numbers",
      "listen": 2,
      "text": "Five people say a number.\nListen and circle the right number (handout exercise 9).\nCareful: 13 or 30? 15 or 50?",
      "tips": [
        "-TEEN or -ty?",
        "Circle a, b or c",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "ages",
      "notes": "Handout exercise 9 (Listening 3)."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Number bingo",
      "emoji": "🎯",
      "minutes": 8,
      "text": "Draw a 3 × 3 grid.\nWrite 9 numbers from 1 to 100.\nListen and cross out the numbers you hear.\nThree in a line → \"BINGO!\" 🎉",
      "notes": "Call the tricky ones: 13/30, 14/40, 15/50."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 5 · COUNTRIES",
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
      "notes": "Say the country, students say the nationality.",
      "small": true,
      "cols": 4,
      "foot": "Countries and nationalities start with a CAPITAL letter"
    },
    {
      "layout": "exercise",
      "ex": "nat",
      "notes": "Handout exercise 10."
    },
    {
      "layout": "exercise",
      "ex": "natodd",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "game",
      "tag": "SPEAKING · PAIR WORK",
      "title": "Find your twin",
      "emoji": "🎴",
      "minutes": 7,
      "text": "Take a card. Walk and ask:\n\"Hi! What's your name?\"\n\"How do you spell it?\"\n\"Where are you from?\"\nFind the student from the same country! 🔍",
      "notes": "Two cards per country."
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
      "notes": "Handout exercise 14. Then students read it to a partner, who writes the phone number.",
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
        "I can say hello and goodbye",
        "I can spell my name",
        "I can say numbers 0–100",
        "I can say countries and nationalities"
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — Five short dialogues",
      "src": "audio/course/c1l1-listening-1.mp3",
      "text": "Dialogue number one. Listen. Good morning, Mrs Brown! Good morning, Tom. You're early today! Number two. Hi! I'm Katie. I'm new here. Oh, hi, Katie! Nice to meet you. I'm Ben. Nice to meet you too, Ben. Number three. Hello, Mr Hill. How are you? I'm fine, thank you. And you? Fine, thanks. Number four. Good evening! Come in, welcome to the party. Good evening! Thank you very much. Number five. Bye, Jack! See you tomorrow! Yes, see you tomorrow, Ben!",
      "script": "Narrator: Listening one. Listen to five short dialogues.\nNarrator: Dialogue number one. Listen.\nA: Good morning, Mrs Brown!\nB: Good morning, Tom. You're early today!\nNarrator: Number two.\nC: Hi! I'm Katie. I'm new here.\nD: Oh, hi, Katie! Nice to meet you. I'm Ben.\nC: Nice to meet you too, Ben.\nNarrator: Number three.\nE: Hello, Mr Hill. How are you?\nF: I'm fine, thank you. And you?\nE: Fine, thanks.\nNarrator: Number four.\nB: Good evening! Come in, welcome to the party.\nA: Good evening! Thank you very much.\nNarrator: Number five.\nD: Bye, Jack! See you tomorrow!\nA: Yes, see you tomorrow, Ben!"
    },
    {
      "label": "Listening 2 — Spell your name (5 people)",
      "src": "audio/course/c1l1-listening-2.mp3",
      "text": "Hello! What's your name? Hi, I'm Emma. How do you spell that? That's E, double M, A. Thanks, Emma. And what's your name? My name's Jack. Can you spell it for me? That's J, A, C, K. Oh, hello! Are you the new teacher? Yes, I am. I'm Mr Green. Green. How do you spell that? That's G, R, double E, N. Next, please. What's your name? My name's Sophie. Can you spell it, please? That's S, O, P, H, I, E. And what about you? I'm Lizzy. Lizzy. And the spelling? That's L, I, double Z, Y. Great. Thank you, everyone!",
      "script": "Narrator: Listening two. Spell your name. Listen and write the names.\nA: Hello! What's your name?\nB: Hi, I'm Emma.\nA: How do you spell that?\nB: That's E, double M, A.\nA: Thanks, Emma. And what's your name?\nC: My name's Jack.\nA: Can you spell it for me?\nC: That's J, A, C, K.\nA: Oh, hello! Are you the new teacher?\nD: Yes, I am. I'm Mr Green.\nA: Green. How do you spell that?\nD: That's G, R, double E, N.\nA: Next, please. What's your name?\nE: My name's Sophie.\nA: Can you spell it, please?\nE: That's S, O, P, H, I, E.\nA: And what about you?\nF: I'm Lizzy.\nA: Lizzy. And the spelling?\nF: That's L, I, double Z, Y.\nA: Great. Thank you, everyone!"
    },
    {
      "label": "Listening 3 — Numbers (5 people)",
      "src": "audio/course/c1l1-listening-3.mp3",
      "text": "Number one. Hi, I'm Tom, and I'm thirteen years old. Number two. This is my grandmother. She's seventy-two, but she still plays tennis! Number three. Hello, I'm Sara. My class is small. There are fifteen students in it. Number four. My name's Ben. I take the bus to school. It's bus number forty-eight. Number five. Our school is really big. We've got ninety computers!",
      "script": "Narrator: Listening three. Listen and circle the right number.\nNarrator: Number one.\nA: Hi, I'm Tom, and I'm thirteen years old.\nNarrator: Number two.\nA: This is my grandmother. She's seventy-two, but she still plays tennis!\nNarrator: Number three.\nB: Hello, I'm Sara. My class is small. There are fifteen students in it.\nNarrator: Number four.\nC: My name's Ben. I take the bus to school. It's bus number forty-eight.\nNarrator: Number five.\nD: Our school is really big. We've got ninety computers!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
  test: [
    {
      "q": "A, B, C, _____, E",
      "a": "D",
      "wrong": [
        "F",
        "G",
        "B"
      ]
    },
    {
      "q": "15 = _____",
      "a": "fifteen",
      "wrong": [
        "fifty",
        "five",
        "sixteen"
      ]
    },
    {
      "q": "30 = _____",
      "a": "thirty",
      "wrong": [
        "thirteen",
        "three",
        "forty"
      ]
    },
    {
      "q": "13 = _____",
      "a": "thirteen",
      "wrong": [
        "thirty",
        "three",
        "fourteen"
      ]
    },
    {
      "q": "The letter after K is _____.",
      "a": "L",
      "wrong": [
        "J",
        "M",
        "N"
      ]
    },
    {
      "q": "The letter before T is _____.",
      "a": "S",
      "wrong": [
        "U",
        "R",
        "V"
      ]
    },
    {
      "q": "What's your name? — My name _____ Anna.",
      "a": "is",
      "wrong": [
        "are",
        "am",
        "be"
      ]
    },
    {
      "q": "How do you _____ it? — A-N-N-A.",
      "a": "spell",
      "wrong": [
        "speak",
        "tell",
        "name"
      ]
    },
    {
      "q": "In a phone number, 0 is often said _____.",
      "a": "oh",
      "wrong": [
        "on",
        "off",
        "of"
      ]
    },
    {
      "q": "55 in a phone number: \"double _____\"",
      "a": "five",
      "wrong": [
        "fifty",
        "fives",
        "two"
      ]
    },
    {
      "q": "8 + 9 = _____",
      "a": "seventeen",
      "wrong": [
        "seventy",
        "sixteen",
        "eighteen"
      ]
    },
    {
      "q": "The English alphabet has _____ letters.",
      "a": "26",
      "wrong": [
        "24",
        "28",
        "33"
      ]
    },
    {
      "q": "The vowels are A, E, I, O and _____.",
      "a": "U",
      "wrong": [
        "Y",
        "W",
        "R"
      ]
    },
    {
      "q": "90 = _____",
      "a": "ninety",
      "wrong": [
        "nineteen",
        "ninty",
        "nine"
      ]
    },
    {
      "q": "I'm from Japan. I'm _____.",
      "a": "Japanese",
      "wrong": [
        "Japan",
        "Japanish",
        "Japanian"
      ]
    },
    {
      "q": "He's from China. He's _____.",
      "a": "Chinese",
      "wrong": [
        "Chinish",
        "China",
        "Chinan"
      ]
    },
    {
      "q": "She's from the UK. She's _____.",
      "a": "British",
      "wrong": [
        "UK",
        "Britain",
        "Britanish"
      ]
    },
    {
      "q": "Good _____! (at 8 in the morning)",
      "a": "morning",
      "wrong": [
        "evening",
        "night",
        "afternoon"
      ]
    },
    {
      "q": "Good _____! (at 7 in the evening)",
      "a": "evening",
      "wrong": [
        "morning",
        "afternoon",
        "day"
      ]
    },
    {
      "q": "Nice to _____ you!",
      "a": "meet",
      "wrong": [
        "see",
        "look",
        "know"
      ]
    }
  ]
});

/* ---------- Block 1, Lesson 2: be: all forms ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[1], {
  // A 2-hour lesson: many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Use am / is / are with I, you, he, she, it, we, they",
    "Make negatives: I'm not, he isn't, they aren't",
    "Ask Am / Is / Are…? and answer \"Yes, I am. / No, I'm not.\""
  ],
  warmups: [
    {
      "emoji": "🔤",
      "title": "Spell it fast (from Lesson 1)",
      "time": "5 min",
      "how": "Say a name or a country. Pairs race to spell it on paper."
    },
    {
      "emoji": "🕵️",
      "title": "Who am I?",
      "time": "7 min",
      "how": "A student is a famous person. The class asks \"Are you from the USA?\" \"Are you a singer?\" Answers only \"Yes, I am / No, I'm not.\""
    },
    {
      "emoji": "🔍",
      "title": "Find someone who…",
      "time": "8 min",
      "how": "Students walk and ask \"Are you…?\" questions (exercise 14)."
    }
  ],
  exercises: [
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
      "id": "short_forms",
      "type": "write",
      "skill": "writing",
      "title": "Write the short form.",
      "items": [
        {
          "q": "I am",
          "a": "I'm"
        },
        {
          "q": "you are",
          "a": "you're"
        },
        {
          "q": "he is",
          "a": "he's"
        },
        {
          "q": "she is",
          "a": "she's"
        },
        {
          "q": "it is",
          "a": "it's"
        },
        {
          "q": "we are",
          "a": "we're"
        },
        {
          "q": "they are",
          "a": "they're"
        }
      ]
    },
    {
      "id": "lis_friends",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 1: Meet my friends. Circle the right answer.",
      "items": [
        {
          "q": "Ken is…",
          "opts": [
            "eleven",
            "twelve",
            "twenty"
          ],
          "a": "b"
        },
        {
          "q": "Anna and Lisa are from…",
          "opts": [
            "London",
            "Paris",
            "Rome"
          ],
          "a": "c"
        },
        {
          "q": "Ben is a…",
          "opts": [
            "student",
            "teacher",
            "doctor"
          ],
          "a": "a"
        },
        {
          "q": "Mrs Brown's husband is a…",
          "opts": [
            "doctor",
            "teacher",
            "student"
          ],
          "a": "b"
        },
        {
          "q": "Max the dog is…",
          "opts": [
            "big",
            "not big",
            "sad"
          ],
          "a": "b"
        }
      ],
      "listen": 0
    },
    {
      "id": "negatives",
      "type": "write",
      "skill": "writing",
      "title": "Make it negative.",
      "items": [
        {
          "q": "She is Spanish.",
          "a": "She isn't Spanish."
        },
        {
          "q": "I am a teacher.",
          "a": "I'm not a teacher."
        },
        {
          "q": "They are from Italy.",
          "a": "They aren't from Italy."
        },
        {
          "q": "He is twelve.",
          "a": "He isn't twelve."
        },
        {
          "q": "We are in class 7B.",
          "a": "We aren't in class 7B."
        },
        {
          "q": "It is a big school.",
          "a": "It isn't a big school."
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
      "id": "lis_new",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 2: A new student. True (T) or false (F)?",
      "items": [
        {
          "q": "Tom is a new student.",
          "a": "T"
        },
        {
          "q": "Tom is from Canada.",
          "a": "F (the USA)"
        },
        {
          "q": "His sister is in class 6B.",
          "a": "T"
        },
        {
          "q": "Tom and his sister are twins.",
          "a": "F (she's ten, he's twelve)"
        },
        {
          "q": "Tom's teacher is nice.",
          "a": "T"
        }
      ],
      "listen": 1
    },
    {
      "id": "qa",
      "type": "match",
      "skill": "reading",
      "title": "Match the question and the answer.",
      "items": [
        {
          "q": "Are you twelve?",
          "a": "Yes, I am."
        },
        {
          "q": "Is she your sister?",
          "a": "No, she isn't. She's my cousin."
        },
        {
          "q": "Are they from Spain?",
          "a": "Yes, they are."
        },
        {
          "q": "Is it a good book?",
          "a": "Yes, it is!"
        },
        {
          "q": "Are we late?",
          "a": "No, we aren't."
        },
        {
          "q": "Is he a doctor?",
          "a": "No, he isn't. He's a nurse."
        }
      ]
    },
    {
      "id": "lis_register",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: The class register. Listen and complete.",
      "items": [
        {
          "q": "Sophie is ____________.",
          "a": "here"
        },
        {
          "q": "Jack isn't here. He's ________ today.",
          "a": "ill"
        },
        {
          "q": "Mia and Leo are at the ____________.",
          "a": "back"
        },
        {
          "q": "The new student's surname is ____________.",
          "a": "Hill (H-I-double L)"
        },
        {
          "q": "Harry is from ____________.",
          "a": "Australia"
        }
      ],
      "listen": 2
    },
    {
      "id": "class_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read Lucy's text. True (T) or false (F)?",
      "items": [
        {
          "q": "Lucy is in class 6B.",
          "a": "T"
        },
        {
          "q": "Mr Hill is old.",
          "a": "F (he isn't old)"
        },
        {
          "q": "Mia and Leo are in class 6B.",
          "a": "F (6A)"
        },
        {
          "q": "The school is new.",
          "a": "F (it isn't new)"
        },
        {
          "q": "The school is big.",
          "a": "T"
        }
      ],
      "text": "Hi, I'm Lucy. I'm eleven and I'm in class 6B. My teacher is Mr Hill. He isn't old, and he's very funny!\n\nMy best friends are Mia and Leo. They aren't in class 6B. They're in class 6A, but we're always together at lunch.\n\nOur school is big. It isn't new, but it's very nice. Are you in a big school too?"
    },
    {
      "id": "class_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "How old is Lucy?",
          "a": "She's eleven."
        },
        {
          "q": "Who is Lucy's teacher?",
          "a": "Mr Hill."
        },
        {
          "q": "Is Mr Hill funny?",
          "a": "Yes, he is."
        },
        {
          "q": "What class are Mia and Leo in?",
          "a": "6A."
        },
        {
          "q": "Is the school big?",
          "a": "Yes, it is."
        }
      ]
    },
    {
      "id": "aboutus",
      "type": "write",
      "skill": "writing",
      "title": "Write about you and a friend. Use am / is / are and isn't / aren't.",
      "items": [
        {
          "q": "I am… / I'm not…",
          "a": "(students' own)"
        },
        {
          "q": "My friend… is…",
          "a": "(students' own)"
        },
        {
          "q": "He / She isn't…",
          "a": "(students' own)"
        },
        {
          "q": "We are… / We aren't…",
          "a": "(students' own)"
        },
        {
          "q": "Our teacher is…",
          "a": "(students' own)"
        }
      ]
    },
    {
      "id": "findwho",
      "type": "write",
      "skill": "speaking",
      "title": "Find someone who… Ask \"Are you…?\" / \"Is your…?\" and write a name.",
      "items": [
        {
          "q": "…is twelve.  \"Are you twelve?\"",
          "a": "(students' own)"
        },
        {
          "q": "…is from another city.  \"Are you from…?\"",
          "a": "(students' own)"
        },
        {
          "q": "…is a big brother or sister.  \"Are you a big brother?\"",
          "a": "(students' own)"
        },
        {
          "q": "…has a mum who is a teacher.  \"Is your mum a teacher?\"",
          "a": "(students' own)"
        },
        {
          "q": "…is a fan of football.  \"Are you a football fan?\"",
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
          "q": "They ___ from Italy.",
          "opts": [
            "is",
            "am",
            "are"
          ],
          "a": "c"
        },
        {
          "q": "I ___ a teacher. I'm a student.",
          "opts": [
            "am not",
            "isn't",
            "aren't"
          ],
          "a": "a"
        },
        {
          "q": "___ he your brother?",
          "opts": [
            "Are",
            "Is",
            "Am"
          ],
          "a": "b"
        },
        {
          "q": "Are you twelve? — Yes, I ___.",
          "opts": [
            "am",
            "'m",
            "is"
          ],
          "a": "a"
        },
        {
          "q": "we are =",
          "opts": [
            "we're",
            "were",
            "we's"
          ],
          "a": "a"
        },
        {
          "q": "Is it a cat? — No, it ___.",
          "opts": [
            "isn't",
            "aren't",
            "not"
          ],
          "a": "a"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 2 (2 hours): the verb \"be\". Students need the handout (15 exercises)."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "🧩",
          "text": "Grammar: I'm, you're, he's, she's, it's, we're, they're"
        },
        {
          "emoji": "❌",
          "text": "Negatives: I'm not, he isn't, they aren't"
        },
        {
          "emoji": "❓",
          "text": "Questions: Am I…? Is he…? Are you…?"
        },
        {
          "emoji": "🎧",
          "text": "Listening: friends, a new student, the class register"
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
        {
          "q": "Say hello at 7 pm.",
          "a": "Good evening!"
        },
        "How do you spell your name?",
        {
          "q": "What's 13 + 17?",
          "a": "thirty"
        },
        {
          "q": "Japan → nationality?",
          "a": "Japanese"
        },
        {
          "q": "You don't understand. You say…",
          "a": "Sorry, I don't understand."
        }
      ],
      "notes": "Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Spell it fast",
      "emoji": "🔤",
      "minutes": 5,
      "text": "Listen to the word.\nWrite it with your partner, fast!\nHold it up when you are ready. ✋",
      "notes": "Words: Spain, Canada, Japanese, thirteen, forty."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "🙋",
          "word": "I",
          "tr": "I'm Ben."
        },
        {
          "emoji": "👉",
          "word": "you",
          "tr": "You're my friend."
        },
        {
          "emoji": "👦",
          "word": "he",
          "tr": "He's twelve."
        },
        {
          "emoji": "👧",
          "word": "she",
          "tr": "She's from Spain."
        },
        {
          "emoji": "🐶",
          "word": "it",
          "tr": "It's a dog."
        },
        {
          "emoji": "👫",
          "word": "we",
          "tr": "We're students."
        },
        {
          "emoji": "👥",
          "word": "they",
          "tr": "They're happy."
        },
        {
          "emoji": "✅",
          "word": "be",
          "tr": "am · is · are"
        }
      ],
      "notes": "Point at people: \"I\", \"you\", \"he\"… Click each card for an example."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · THE VERB \"BE\"",
      "title": "I am, you are, he is…",
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
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "short_forms",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "Meet my friends",
      "listen": 0,
      "text": "Five people talk about themselves and their friends.\nListen and circle the right answer (handout exercise 3).",
      "tips": [
        "Listen for am / is / are",
        "Ages, countries, jobs",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_friends",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 2 · NEGATIVES",
      "title": "I'm not, he isn't, they aren't",
      "boxes": [
        {
          "head": "🙋 I",
          "body": "I am not → I'm not\nI'm not a teacher."
        },
        {
          "head": "👦 he / she / it",
          "body": "is not → isn't\nShe isn't Spanish."
        },
        {
          "head": "👥 you / we / they",
          "body": "are not → aren't\nThey aren't from Italy."
        }
      ],
      "foot": "⚠️ I amn't ✗ → I'm not ✓",
      "notes": "Say true and false sentences about students: \"Ben isn't twenty!\""
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "\"Be\" mistakes everyone makes",
      "rows": [
        {
          "wrong": "I amn't twelve.",
          "right": "I'm not twelve."
        },
        {
          "wrong": "She are my friend.",
          "right": "She is (She's) my friend."
        },
        {
          "wrong": "He from Italy.",
          "right": "He's from Italy."
        },
        {
          "wrong": "They is students.",
          "right": "They are students."
        },
        {
          "wrong": "She not Spanish.",
          "right": "She isn't Spanish."
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "negatives",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "becorrect",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · QUESTIONS",
      "title": "Are you…? Yes, I am!",
      "boxes": [
        {
          "head": "❓ Questions",
          "body": "Am I late?\nAre you from Italy?\nIs he Spanish?\nAre they twelve?"
        },
        {
          "head": "✅ Yes",
          "body": "Yes, you are.\nYes, I am.\nYes, he is.\nYes, they are."
        },
        {
          "head": "❌ No",
          "body": "No, you aren't.\nNo, I'm not.\nNo, he isn't.\nNo, they aren't."
        }
      ],
      "foot": "Short \"Yes\" answers never use 'm / 's: Yes, I am ✓ · Yes, I'm ✗",
      "notes": "Ask students yes/no questions about themselves and famous people."
    },
    {
      "layout": "exercise",
      "ex": "qorder",
      "notes": "Handout exercise 6. Then pairs ask each other the questions."
    },
    {
      "layout": "exercise",
      "ex": "short",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "A new student",
      "listen": 1,
      "text": "A girl talks to Tom, a new student.\nListen: true or false? (handout exercise 8)",
      "tips": [
        "Yes, I am / No, I'm not",
        "Where from? How old?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_new",
      "notes": "Handout exercise 8 (Listening 2)."
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
      "layout": "exercise",
      "ex": "qa",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "The class register",
      "listen": 2,
      "text": "A teacher checks who is in class.\nListen and complete (handout exercise 10).",
      "tips": [
        "Who is here? Who isn't?",
        "A surname is spelled",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_register",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "My new class",
      "text": "Hi, I'm Lucy. I'm eleven and I'm in class 6B. My teacher is Mr Hill. He isn't old, and he's very funny!\n\nMy best friends are Mia and Leo. They aren't in class 6B. They're in class 6A, but we're always together at lunch.\n\nOur school is big. It isn't new, but it's very nice. Are you in a big school too?",
      "tips": [
        "Who? What class? What is it like?",
        "Read, then do exercises 11 and 12"
      ],
      "notes": "Students read silently (3 min)."
    },
    {
      "layout": "exercise",
      "ex": "class_tf",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "exercise",
      "ex": "class_q",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "aboutus",
      "notes": "Handout exercise 13.",
      "minutes": 7
    },
    {
      "layout": "exercise",
      "ex": "findwho",
      "notes": "Handout exercise 14: students walk and ask.",
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
        "I can use am, is, are",
        "I can say I'm not, he isn't, they aren't",
        "I can ask \"Are you…?\"",
        "I can answer \"Yes, I am. / No, I'm not.\""
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — Meet my friends",
      "src": "audio/course/c1l2-listening-1.mp3",
      "text": "Number one. This is my friend Ken. He's twelve, and he's from Japan. Number two. These are my cousins, Anna and Lisa. They aren't from London. They're from Rome. Number three. I'm Ben. I'm not a teacher. I'm a student, and I'm thirteen. Number four. Hello, I'm Mrs Brown. I'm a doctor, and my husband is a teacher. Number five. This is our dog, Max. He isn't big, but he's very happy!",
      "script": "Narrator: Listening one. Meet my friends. Circle the right answer.\nNarrator: Number one.\nA: This is my friend Ken. He's twelve, and he's from Japan.\nNarrator: Number two.\nB: These are my cousins, Anna and Lisa. They aren't from London. They're from Rome.\nNarrator: Number three.\nC: I'm Ben. I'm not a teacher. I'm a student, and I'm thirteen.\nNarrator: Number four.\nD: Hello, I'm Mrs Brown. I'm a doctor, and my husband is a teacher.\nNarrator: Number five.\nE: This is our dog, Max. He isn't big, but he's very happy!"
    },
    {
      "label": "Listening 2 — A new student",
      "src": "audio/course/c1l2-listening-2.mp3",
      "text": "Hi! Are you a new student? Yes, I am. My name's Tom. Are you from Canada, Tom? No, I'm not. I'm from the USA. Is your sister here too? Yes, she is. She's in class 6B. Are you and your sister twins? No, we aren't. She's ten and I'm twelve. And is your new teacher nice? Yes, she is. She's great!",
      "script": "Narrator: Listening two. A new student. True or false?\nA: Hi! Are you a new student?\nB: Yes, I am. My name's Tom.\nA: Are you from Canada, Tom?\nB: No, I'm not. I'm from the USA.\nA: Is your sister here too?\nB: Yes, she is. She's in class 6B.\nA: Are you and your sister twins?\nB: No, we aren't. She's ten and I'm twelve.\nA: And is your new teacher nice?\nB: Yes, she is. She's great!"
    },
    {
      "label": "Listening 3 — The class register",
      "src": "audio/course/c1l2-listening-3.mp3",
      "text": "Good morning, everyone. Is Sophie here? Yes, I'm here. Good. Is Jack here? No, he isn't. He's ill today. Oh dear. And what about Mia and Leo? Are they here? Yes, we are. We're at the back. And who are you? Are you a new student? Yes, I am. My name is Harry Hill. How do you spell Hill? That's H, I, double L. Thank you, Harry. Where are you from? I'm from Australia.",
      "script": "Narrator: Listening three. The class register. Listen and complete.\nA: Good morning, everyone. Is Sophie here?\nB: Yes, I'm here.\nA: Good. Is Jack here?\nC: No, he isn't. He's ill today.\nA: Oh dear. And what about Mia and Leo? Are they here?\nD: Yes, we are. We're at the back.\nA: And who are you? Are you a new student?\nE: Yes, I am. My name is Harry Hill.\nA: How do you spell Hill?\nE: That's H, I, double L.\nA: Thank you, Harry. Where are you from?\nE: I'm from Australia."
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
  test: [
    {
      "q": "I _____ from Italy.",
      "a": "am",
      "wrong": [
        "is",
        "are",
        "be"
      ]
    },
    {
      "q": "She _____ my friend.",
      "a": "is",
      "wrong": [
        "am",
        "are",
        "be"
      ]
    },
    {
      "q": "They _____ from Spain.",
      "a": "are",
      "wrong": [
        "is",
        "am",
        "be"
      ]
    },
    {
      "q": "_____ you from Russia? — Yes, I am.",
      "a": "Are",
      "wrong": [
        "Is",
        "Am",
        "Do"
      ]
    },
    {
      "q": "Is he Turkish? — No, he _____.",
      "a": "isn't",
      "wrong": [
        "aren't",
        "not",
        "don't"
      ]
    },
    {
      "q": "I'm Italian. I'm from _____.",
      "a": "Italy",
      "wrong": [
        "Italian",
        "Italish",
        "Italiany"
      ]
    },
    {
      "q": "_____ are you from? — I'm from Korea.",
      "a": "Where",
      "wrong": [
        "What",
        "Who",
        "How"
      ]
    },
    {
      "q": "What's your _____? — My name is Lucy.",
      "a": "name",
      "wrong": [
        "from",
        "country",
        "old"
      ]
    },
    {
      "q": "he is = _____",
      "a": "he's",
      "wrong": [
        "he're",
        "his",
        "he'm"
      ]
    },
    {
      "q": "they are = _____",
      "a": "they're",
      "wrong": [
        "they's",
        "their",
        "they'm"
      ]
    },
    {
      "q": "Ana is from Spain. _____ Spanish.",
      "a": "She's",
      "wrong": [
        "He's",
        "I'm",
        "They're"
      ]
    },
    {
      "q": "She _____ my sister. She's my cousin.",
      "a": "isn't",
      "wrong": [
        "aren't",
        "not",
        "am not"
      ]
    },
    {
      "q": "I _____ twelve. I'm eleven.",
      "a": "am not",
      "wrong": [
        "is not",
        "are not",
        "not am"
      ]
    },
    {
      "q": "_____ he your brother? — Yes, he is.",
      "a": "Is",
      "wrong": [
        "Are",
        "Am",
        "Be"
      ]
    },
    {
      "q": "Are they from Mexico? — No, they _____.",
      "a": "aren't",
      "wrong": [
        "isn't",
        "not",
        "don't"
      ]
    },
    {
      "q": "_____ I late? — No, you aren't.",
      "a": "Am",
      "wrong": [
        "Is",
        "Are",
        "Do"
      ]
    },
    {
      "q": "we are = _____",
      "a": "we're",
      "wrong": [
        "we's",
        "were",
        "we'm"
      ]
    },
    {
      "q": "My mum and dad _____ teachers.",
      "a": "are",
      "wrong": [
        "is",
        "am",
        "be"
      ]
    },
    {
      "q": "It _____ a cat. It's a dog!",
      "a": "isn't",
      "wrong": [
        "aren't",
        "am not",
        "not"
      ]
    },
    {
      "q": "Are you a student? — Yes, I _____.",
      "a": "am",
      "wrong": [
        "'m",
        "is",
        "are"
      ]
    }
  ]
});

/* ---------- Block 1, Lesson 3: Things, colours & jobs ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[2], {
  // A 2-hour lesson: many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Name things in a school bag and in the classroom",
    "Say 11 colours: \"What colour is it?\"",
    "Say jobs: \"She's a nurse. He's an engineer.\""
  ],
  warmups: [
    {
      "emoji": "🕵️",
      "title": "Who am I? (from Lesson 2)",
      "time": "5 min",
      "how": "A quick round of \"Are you…?\" questions about a famous person."
    },
    {
      "emoji": "🛍️",
      "title": "Mystery bag",
      "time": "7 min",
      "how": "Classroom things in a bag. A student feels one without looking: \"Is it a ruler?\" — \"Yes, it is!\""
    },
    {
      "emoji": "🎨",
      "title": "Colour hunt",
      "time": "5 min",
      "how": "Say a colour; students touch something of that colour in the room and say \"It's a red pen!\""
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
      "id": "thingsodd",
      "type": "odd",
      "skill": "reading",
      "title": "Which word is different? Circle it.",
      "items": [
        {
          "q": "pen   pencil   ruler   apple",
          "a": "apple"
        },
        {
          "q": "desk   chair   board   banana",
          "a": "banana"
        },
        {
          "q": "bag   red   blue   green",
          "a": "bag"
        },
        {
          "q": "teacher   doctor   pilot   pencil",
          "a": "pencil"
        },
        {
          "q": "window   door   clock   cook",
          "a": "cook"
        },
        {
          "q": "yellow   pink   nurse   brown",
          "a": "nurse"
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
      "id": "colours",
      "type": "match",
      "skill": "reading",
      "title": "Match the colour and the word.",
      "items": [
        {
          "q": "🔴",
          "a": "red"
        },
        {
          "q": "🟠",
          "a": "orange"
        },
        {
          "q": "🟡",
          "a": "yellow"
        },
        {
          "q": "🟢",
          "a": "green"
        },
        {
          "q": "🔵",
          "a": "blue"
        },
        {
          "q": "🟣",
          "a": "purple"
        },
        {
          "q": "🟤",
          "a": "brown"
        },
        {
          "q": "⚫",
          "a": "black"
        }
      ]
    },
    {
      "id": "colourgap",
      "type": "gap",
      "skill": "writing",
      "title": "Write the colour.",
      "items": [
        {
          "q": "Grass is ____________.",
          "a": "green"
        },
        {
          "q": "The sky is ____________.",
          "a": "blue"
        },
        {
          "q": "Snow is ____________.",
          "a": "white"
        },
        {
          "q": "A banana is ____________.",
          "a": "yellow"
        },
        {
          "q": "Chocolate is ____________.",
          "a": "brown"
        },
        {
          "q": "An orange is ____________.",
          "a": "orange"
        },
        {
          "q": "red + white = ____________",
          "a": "pink"
        },
        {
          "q": "black + white = ____________",
          "a": "grey"
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
      "id": "jobs",
      "type": "match",
      "skill": "reading",
      "title": "Where do they work? Match.",
      "items": [
        {
          "q": "teacher",
          "a": "a school"
        },
        {
          "q": "doctor",
          "a": "a hospital"
        },
        {
          "q": "farmer",
          "a": "a farm"
        },
        {
          "q": "cook",
          "a": "a restaurant"
        },
        {
          "q": "pilot",
          "a": "a plane"
        },
        {
          "q": "shop assistant",
          "a": "a shop"
        },
        {
          "q": "police officer",
          "a": "a police station"
        },
        {
          "q": "vet",
          "a": "an animal hospital"
        }
      ]
    },
    {
      "id": "jobschoose",
      "type": "choose",
      "skill": "reading",
      "title": "Circle the right job.",
      "items": [
        {
          "q": "He works in a hospital. He's a…",
          "opts": [
            "doctor",
            "farmer",
            "pilot"
          ],
          "a": "a"
        },
        {
          "q": "She flies a plane. She's a…",
          "opts": [
            "driver",
            "pilot",
            "cook"
          ],
          "a": "b"
        },
        {
          "q": "He makes food in a restaurant. He's a…",
          "opts": [
            "cook",
            "vet",
            "teacher"
          ],
          "a": "a"
        },
        {
          "q": "She helps sick animals. She's a…",
          "opts": [
            "nurse",
            "vet",
            "farmer"
          ],
          "a": "b"
        },
        {
          "q": "He drives a taxi. He's a…",
          "opts": [
            "pilot",
            "driver",
            "shop assistant"
          ],
          "a": "b"
        },
        {
          "q": "She works in a shop. She's a…",
          "opts": [
            "shop assistant",
            "police officer",
            "doctor"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "jobscorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Correct the mistakes.",
      "items": [
        {
          "q": "She is teacher.",
          "a": "She's a teacher."
        },
        {
          "q": "He is a engineer.",
          "a": "He's an engineer."
        },
        {
          "q": "My dad is doctor.",
          "a": "My dad is a doctor."
        },
        {
          "q": "They are a teachers.",
          "a": "They are teachers."
        },
        {
          "q": "What colour is it? — It's a red.",
          "a": "It's red."
        }
      ]
    },
    {
      "id": "lis_jobs",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 3: What do they do? Circle the right answer.",
      "items": [
        {
          "q": "Number 1: his dad is a…",
          "opts": [
            "doctor",
            "nurse",
            "driver"
          ],
          "a": "a"
        },
        {
          "q": "Number 2: she teaches…",
          "opts": [
            "English",
            "maths",
            "art"
          ],
          "a": "a"
        },
        {
          "q": "Number 3: the uncle is a…",
          "opts": [
            "vet",
            "farmer",
            "cook"
          ],
          "a": "b"
        },
        {
          "q": "Number 4: the mum is a…",
          "opts": [
            "pilot",
            "doctor",
            "cook"
          ],
          "a": "a"
        },
        {
          "q": "Number 5: he works in a…",
          "opts": [
            "school",
            "hospital",
            "restaurant"
          ],
          "a": "c"
        }
      ],
      "listen": 2
    },
    {
      "id": "colorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the words in order.",
      "items": [
        {
          "q": "colour / what / your / is / bag",
          "a": "What colour is your bag?"
        },
        {
          "q": "is / it / blue",
          "a": "It is blue."
        },
        {
          "q": "a / she / nurse / is",
          "a": "She is a nurse."
        },
        {
          "q": "job / your / what / is / dad's",
          "a": "What is your dad's job?"
        },
        {
          "q": "pen / my / red / is",
          "a": "My pen is red."
        },
        {
          "q": "an / he / engineer / is",
          "a": "He is an engineer."
        }
      ]
    },
    {
      "id": "jobs_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read Tom's text. True (T) or false (F)?",
      "items": [
        {
          "q": "Tom's mum is a doctor.",
          "a": "F (a nurse)"
        },
        {
          "q": "Her favourite colour is green.",
          "a": "T"
        },
        {
          "q": "Tom's dad works in a restaurant.",
          "a": "T"
        },
        {
          "q": "His car is black.",
          "a": "F (red)"
        },
        {
          "q": "Kate's pencil case is pink.",
          "a": "T"
        }
      ],
      "text": "Hi, I'm Tom. My mum is a nurse. She works in a big hospital, and her favourite colour is green.\n\nMy dad is a cook. He works in an Italian restaurant. His bag is black and his car is red.\n\nMy sister Kate is a student. She's fourteen. In her school bag there's a pink pencil case, a blue notebook and three yellow pencils."
    },
    {
      "id": "jobs_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "Where does Tom's mum work?",
          "a": "In a big hospital."
        },
        {
          "q": "What is Tom's dad's job?",
          "a": "He's a cook."
        },
        {
          "q": "What colour is his bag?",
          "a": "Black."
        },
        {
          "q": "How old is Kate?",
          "a": "Fourteen."
        },
        {
          "q": "How many yellow pencils are in Kate's bag?",
          "a": "Three."
        }
      ]
    },
    {
      "id": "mybag",
      "type": "write",
      "skill": "writing",
      "title": "Write about you.",
      "items": [
        {
          "q": "In my bag there is / are…",
          "a": "(students' own)"
        },
        {
          "q": "My pencil case is… (colour)",
          "a": "(students' own)"
        },
        {
          "q": "My favourite colour is…",
          "a": "(students' own)"
        },
        {
          "q": "My mum / dad is a…",
          "a": "(students' own)"
        },
        {
          "q": "I want to be a… (job)",
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
          "q": "📏 =",
          "opts": [
            "rubber",
            "ruler",
            "pencil"
          ],
          "a": "b"
        },
        {
          "q": "red + white =",
          "opts": [
            "pink",
            "purple",
            "orange"
          ],
          "a": "a"
        },
        {
          "q": "A pilot works in a…",
          "opts": [
            "plane",
            "farm",
            "shop"
          ],
          "a": "a"
        },
        {
          "q": "She's ___ engineer.",
          "opts": [
            "a",
            "an",
            "the"
          ],
          "a": "b"
        },
        {
          "q": "What colour is the sky?",
          "opts": [
            "It's blue.",
            "It's a blue.",
            "Is blue."
          ],
          "a": "a"
        },
        {
          "q": "A vet helps…",
          "opts": [
            "sick animals",
            "cars",
            "books"
          ],
          "a": "a"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 3 (2 hours): things, colours and jobs. Bring a bag with classroom things (Mystery bag). Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "🎒",
          "text": "Words: things in my bag and the classroom"
        },
        {
          "emoji": "🎨",
          "text": "Words: 11 colours · \"What colour is it?\""
        },
        {
          "emoji": "👩‍⚕️",
          "text": "Words: jobs · \"She's a nurse.\""
        },
        {
          "emoji": "🎧",
          "text": "Listening: bags, lost and found, jobs"
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
        {
          "q": "they are = ?",
          "a": "they're"
        },
        {
          "q": "She is Spanish. → negative?",
          "a": "She isn't Spanish."
        },
        {
          "q": "Are you twelve? — Yes, I…",
          "a": "am"
        },
        {
          "q": "___ he your friend?",
          "a": "Is"
        },
        {
          "q": "I ___ a teacher. (negative)",
          "a": "I'm not"
        }
      ],
      "notes": "Click to show each question, then its answer."
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
          "emoji": "📏",
          "word": "ruler",
          "tr": "30 cm"
        },
        {
          "emoji": "🎒",
          "word": "bag",
          "tr": "my school bag"
        },
        {
          "emoji": "🎨",
          "word": "colour",
          "tr": "red, blue, green"
        },
        {
          "emoji": "👩‍🏫",
          "word": "teacher",
          "tr": "Mrs Lee"
        },
        {
          "emoji": "👨‍⚕️",
          "word": "doctor",
          "tr": "in a hospital"
        },
        {
          "emoji": "👩‍🍳",
          "word": "cook",
          "tr": "in a restaurant"
        },
        {
          "emoji": "✈️",
          "word": "pilot",
          "tr": "in a plane"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 1 · THINGS",
      "title": "In my bag and in the classroom",
      "tiles": [
        "🖊️ pen",
        "✏️ pencil",
        "📏 ruler",
        "🧽 rubber",
        "📕 book",
        "📓 notebook",
        "📚 dictionary",
        "🎒 bag",
        "✂️ scissors",
        "🪑 chair",
        "🗄️ desk",
        "🖥️ computer",
        "🕒 clock",
        "🚪 door"
      ],
      "notes": "Point at real things: \"What's this?\" — \"It's a door.\"",
      "small": true,
      "cols": 5
    },
    {
      "layout": "exercise",
      "ex": "things",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "thingsodd",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "What's in your bag?",
      "listen": 0,
      "text": "Five students say what is in their bags.\nListen and circle the right answer (handout exercise 3).",
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
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 2 · COLOURS",
      "title": "11 colours",
      "tiles": [
        "🔴 red",
        "🟠 orange",
        "🟡 yellow",
        "🟢 green",
        "🔵 blue",
        "🟣 purple",
        "🩷 pink",
        "🟤 brown",
        "⚫ black",
        "⚪ white",
        "🩶 grey"
      ],
      "notes": "Say each colour; students point at something of that colour.",
      "small": true,
      "cols": 4,
      "foot": "What colour is it? — It's red. (no \"a\")"
    },
    {
      "layout": "exercise",
      "ex": "colours",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "colourgap",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Colour hunt",
      "emoji": "🎨",
      "minutes": 5,
      "text": "Listen to the colour.\nTouch something of that colour!\nSay: \"It's a red pen!\"\nThe last one is out.",
      "notes": "Speed up as you go."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "Lost and found",
      "listen": 1,
      "text": "A teacher finds things in the classroom.\nWhose are they? Listen and complete (handout exercise 6).",
      "tips": [
        "Colours and things",
        "Whose? → name + 's",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_lost",
      "notes": "Handout exercise 6 (Listening 2)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 3 · JOBS",
      "title": "Jobs",
      "tiles": [
        "👩‍🏫 teacher",
        "👨‍⚕️ doctor",
        "👩‍⚕️ nurse",
        "👨‍🌾 farmer",
        "👩‍🍳 cook",
        "👨‍✈️ pilot",
        "🧑‍🔧 engineer",
        "👮 police officer",
        "🧑‍💼 shop assistant",
        "🚕 driver",
        "🐾 vet",
        "🧑‍🎓 student"
      ],
      "notes": "Say the job, mime it; students guess.",
      "small": true,
      "cols": 4,
      "foot": "She's a nurse. He's an engineer. (a / an + job!)"
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Job and colour mistakes everyone makes",
      "rows": [
        {
          "wrong": "She is teacher.",
          "right": "She's a teacher."
        },
        {
          "wrong": "He is a engineer.",
          "right": "He's an engineer."
        },
        {
          "wrong": "It's a red.",
          "right": "It's red."
        },
        {
          "wrong": "What colour your bag?",
          "right": "What colour is your bag?"
        },
        {
          "wrong": "My favourite colour is a blue.",
          "right": "My favourite colour is blue."
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "jobs",
      "notes": "Handout exercise 7."
    },
    {
      "layout": "exercise",
      "ex": "jobschoose",
      "notes": "Handout exercise 8."
    },
    {
      "layout": "exercise",
      "ex": "jobscorrect",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "What do they do?",
      "listen": 2,
      "text": "Five people talk about jobs.\nListen and circle the right answer (handout exercise 10).",
      "tips": [
        "Listen for the job",
        "Where do they work?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_jobs",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "exercise",
      "ex": "colorder",
      "notes": "Handout exercise 11. Then pairs ask \"What colour is your…?\""
    },
    {
      "layout": "game",
      "tag": "SPEAKING · PAIR WORK",
      "title": "Guess my job",
      "emoji": "🕵️",
      "minutes": 7,
      "text": "Think of a job. Your partner asks:\n\"Do you work in a hospital?\" \"Are you a pilot?\"\nAnswer \"Yes\" or \"No\".\nSwap after 5 questions!",
      "notes": "Model one round with a strong student."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Tom's family",
      "text": "Hi, I'm Tom. My mum is a nurse. She works in a big hospital, and her favourite colour is green.\n\nMy dad is a cook. He works in an Italian restaurant. His bag is black and his car is red.\n\nMy sister Kate is a student. She's fourteen. In her school bag there's a pink pencil case, a blue notebook and three yellow pencils.",
      "tips": [
        "Jobs · colours · things",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (3 min)."
    },
    {
      "layout": "exercise",
      "ex": "jobs_tf",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "jobs_q",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "exercise",
      "ex": "mybag",
      "notes": "Handout exercise 14.",
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
        "I can name things in my bag",
        "I can say 11 colours",
        "I can say jobs: \"She's a nurse.\"",
        "I can ask \"What colour is it?\""
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — What's in your bag?",
      "src": "audio/course/c1l3-listening-1.mp3",
      "text": "Number one. I'm Sara. In my bag I've got three pens and a notebook. Number two. I'm Ben. My bag is really heavy, because there's a big dictionary in it! Number three. Hi, I'm Lucy. I've got two notebooks, one for English and one for maths. Number four. I'm Tom. It's raining today, so I've got an umbrella in my bag. Number five. I'm Mia. Look, this is my new pencil case!",
      "script": "Narrator: Listening one. What's in their bags? Circle the right answer.\nNarrator: Number one.\nA: I'm Sara. In my bag I've got three pens and a notebook.\nNarrator: Number two.\nB: I'm Ben. My bag is really heavy, because there's a big dictionary in it!\nNarrator: Number three.\nC: Hi, I'm Lucy. I've got two notebooks, one for English and one for maths.\nNarrator: Number four.\nD: I'm Tom. It's raining today, so I've got an umbrella in my bag.\nNarrator: Number five.\nE: I'm Mia. Look, this is my new pencil case!"
    },
    {
      "label": "Listening 2 — Lost and found",
      "src": "audio/course/c1l3-listening-2.mp3",
      "text": "OK, everyone. Whose is this black bag? Jack, is it yours? Yes, it is! Thanks. And this red pen? Oh, that's my pen. I'm Emma. Leo, are these your books on my desk? Yes, they are. Sorry! And that umbrella by the door? That's my umbrella. Excuse me, where's my pencil case? Look, Mia. It's under your chair.",
      "script": "Narrator: Listening two. Lost and found. Listen and complete.\nA: OK, everyone. Whose is this black bag? Jack, is it yours?\nB: Yes, it is! Thanks.\nA: And this red pen?\nC: Oh, that's my pen. I'm Emma.\nA: Leo, are these your books on my desk?\nD: Yes, they are. Sorry!\nA: And that umbrella by the door? That's my umbrella.\nE: Excuse me, where's my pencil case?\nA: Look, Mia. It's under your chair."
    },
    {
      "label": "Listening 3 — What do they do?",
      "src": "audio/course/c1l3-listening-3.mp3",
      "text": "Number one. My dad is a doctor. He works in a big hospital. Number two. I'm a teacher. I teach English at a school in London. Number three. My uncle is a farmer. He's got lots of cows and sheep. Number four. My mum is a pilot. She flies to Japan and the USA. Number five. I'm a cook. I work in a small restaurant in Paris.",
      "script": "Narrator: Listening three. What do they do? Circle the right answer.\nNarrator: Number one.\nA: My dad is a doctor. He works in a big hospital.\nNarrator: Number two.\nB: I'm a teacher. I teach English at a school in London.\nNarrator: Number three.\nC: My uncle is a farmer. He's got lots of cows and sheep.\nNarrator: Number four.\nD: My mum is a pilot. She flies to Japan and the USA.\nNarrator: Number five.\nE: I'm a cook. I work in a small restaurant in Paris."
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
  test: [
    {
      "q": "I write with a _____.",
      "a": "pen",
      "wrong": [
        "desk",
        "door",
        "window"
      ]
    },
    {
      "q": "You sit on a _____.",
      "a": "chair",
      "wrong": [
        "board",
        "ruler",
        "pencil"
      ]
    },
    {
      "q": "📏 = a _____",
      "a": "ruler",
      "wrong": [
        "rubber",
        "pencil",
        "clock"
      ]
    },
    {
      "q": "📚 = a _____",
      "a": "dictionary",
      "wrong": [
        "notebook",
        "bag",
        "desk"
      ]
    },
    {
      "q": "Grass is _____.",
      "a": "green",
      "wrong": [
        "blue",
        "red",
        "black"
      ]
    },
    {
      "q": "The sky is _____.",
      "a": "blue",
      "wrong": [
        "yellow",
        "brown",
        "pink"
      ]
    },
    {
      "q": "A banana is _____.",
      "a": "yellow",
      "wrong": [
        "purple",
        "grey",
        "green"
      ]
    },
    {
      "q": "black + white = _____",
      "a": "grey",
      "wrong": [
        "pink",
        "brown",
        "orange"
      ]
    },
    {
      "q": "red + white = _____",
      "a": "pink",
      "wrong": [
        "purple",
        "grey",
        "orange"
      ]
    },
    {
      "q": "What colour is your bag? — _____ black.",
      "a": "It's",
      "wrong": [
        "It's a",
        "Is",
        "They"
      ]
    },
    {
      "q": "A _____ works in a hospital.",
      "a": "doctor",
      "wrong": [
        "farmer",
        "pilot",
        "cook"
      ]
    },
    {
      "q": "A _____ flies a plane.",
      "a": "pilot",
      "wrong": [
        "driver",
        "vet",
        "teacher"
      ]
    },
    {
      "q": "A _____ helps sick animals.",
      "a": "vet",
      "wrong": [
        "cook",
        "nurse",
        "pilot"
      ]
    },
    {
      "q": "A farmer works on a _____.",
      "a": "farm",
      "wrong": [
        "plane",
        "shop",
        "school"
      ]
    },
    {
      "q": "She's _____ engineer.",
      "a": "an",
      "wrong": [
        "a",
        "the",
        "two"
      ]
    },
    {
      "q": "He's _____ teacher.",
      "a": "a",
      "wrong": [
        "an",
        "two",
        "the"
      ]
    },
    {
      "q": "My mum is _____. (job)",
      "a": "a nurse",
      "wrong": [
        "nurse",
        "an nurse",
        "the nurses"
      ]
    },
    {
      "q": "A cook makes _____.",
      "a": "food",
      "wrong": [
        "cars",
        "books",
        "planes"
      ]
    },
    {
      "q": "_____ colour is your pen?",
      "a": "What",
      "wrong": [
        "Who",
        "Where",
        "How"
      ]
    },
    {
      "q": "A shop assistant works in a _____.",
      "a": "shop",
      "wrong": [
        "farm",
        "hospital",
        "plane"
      ]
    }
  ]
});

/* ---------- Block 1, Lesson 4: One pen, two pens ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[3], {
  // A 2-hour lesson: many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Make plurals: pens, boxes, cities",
    "Use special plurals: men, women, children, people, feet, teeth",
    "Use this / that / these / those"
  ],
  warmups: [
    {
      "emoji": "🎨",
      "title": "Colour hunt (from Lesson 3)",
      "time": "5 min",
      "how": "Say a colour; students touch something of that colour: \"It's a red pen!\""
    },
    {
      "emoji": "🔢",
      "title": "Count the class",
      "time": "6 min",
      "how": "Students count things in the room: \"One window, two windows… one chair, two chairs…\""
    },
    {
      "emoji": "👉",
      "title": "This or that?",
      "time": "6 min",
      "how": "Point at near / far things. Students say \"This is a pen.\" \"Those are windows.\""
    }
  ],
  exercises: [
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
      "id": "rules",
      "type": "choose",
      "skill": "writing",
      "title": "Circle the right plural.",
      "items": [
        {
          "q": "one box, two…",
          "opts": [
            "boxs",
            "boxes",
            "boxies"
          ],
          "a": "b"
        },
        {
          "q": "one baby, two…",
          "opts": [
            "babys",
            "babies",
            "babyes"
          ],
          "a": "b"
        },
        {
          "q": "one bus, two…",
          "opts": [
            "buses",
            "buss",
            "busies"
          ],
          "a": "a"
        },
        {
          "q": "one city, two…",
          "opts": [
            "citys",
            "cities",
            "cityes"
          ],
          "a": "b"
        },
        {
          "q": "one watch, two…",
          "opts": [
            "watchs",
            "watches",
            "watchies"
          ],
          "a": "b"
        },
        {
          "q": "one boy, two…",
          "opts": [
            "boys",
            "boies",
            "boyes"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "lis_count",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 1: How many? Circle the right answer.",
      "items": [
        {
          "q": "Number 1: she has got ___ pencils.",
          "opts": [
            "three",
            "four",
            "five"
          ],
          "a": "b"
        },
        {
          "q": "Number 2: there are ___ boys in his class.",
          "opts": [
            "twelve",
            "twenty",
            "two"
          ],
          "a": "a"
        },
        {
          "q": "Number 3: how many cats?",
          "opts": [
            "two",
            "three",
            "five"
          ],
          "a": "b"
        },
        {
          "q": "Number 4: they've got ___ new computers.",
          "opts": [
            "six",
            "sixteen",
            "seven"
          ],
          "a": "a"
        },
        {
          "q": "Number 5: in his bag there are…",
          "opts": [
            "one dictionary",
            "two dictionaries",
            "two notebooks"
          ],
          "a": "b"
        }
      ],
      "listen": 0
    },
    {
      "id": "irregular",
      "type": "match",
      "skill": "reading",
      "title": "Match: one → many.",
      "items": [
        {
          "q": "man",
          "a": "men"
        },
        {
          "q": "woman",
          "a": "women"
        },
        {
          "q": "child",
          "a": "children"
        },
        {
          "q": "person",
          "a": "people"
        },
        {
          "q": "foot",
          "a": "feet"
        },
        {
          "q": "tooth",
          "a": "teeth"
        },
        {
          "q": "mouse",
          "a": "mice"
        },
        {
          "q": "fish",
          "a": "fish"
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
      "id": "lis_tidy",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 2: Tidy up! True (T) or false (F)?",
      "items": [
        {
          "q": "The socks are Ben's.",
          "a": "T"
        },
        {
          "q": "The book is Ben's.",
          "a": "F (Kate's)"
        },
        {
          "q": "The shoes by the door are Dad's.",
          "a": "T"
        },
        {
          "q": "Ben has got five new toy cars.",
          "a": "T"
        },
        {
          "q": "The toys are Kate's.",
          "a": "F (Ben's)"
        }
      ],
      "listen": 1
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
      "id": "count",
      "type": "gap",
      "skill": "writing",
      "title": "Write the plural.",
      "items": [
        {
          "q": "There are three ____________. (box)",
          "a": "boxes"
        },
        {
          "q": "I've got two ____________. (sister)",
          "a": "sisters"
        },
        {
          "q": "Five ____________ are in the park. (child)",
          "a": "children"
        },
        {
          "q": "We've got ten ____________. (dictionary)",
          "a": "dictionaries"
        },
        {
          "q": "Two ____________ are at the door. (man)",
          "a": "men"
        },
        {
          "q": "I brush my ____________. (tooth)",
          "a": "teeth"
        }
      ]
    },
    {
      "id": "lis_shop",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 3: At the toy shop. Listen and complete.",
      "items": [
        {
          "q": "The teddy bears are ________ pounds each.",
          "a": "9"
        },
        {
          "q": "The ____________ balls are three pounds.",
          "a": "red"
        },
        {
          "q": "He buys ________ teddy bears.",
          "a": "2"
        },
        {
          "q": "He buys three ____________.",
          "a": "balls"
        },
        {
          "q": "It's ________ pounds.",
          "a": "27"
        }
      ],
      "listen": 2
    },
    {
      "id": "room_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read about the room. True (T) or false (F)?",
      "items": [
        {
          "q": "The room is big.",
          "a": "F (small)"
        },
        {
          "q": "There are two windows.",
          "a": "T"
        },
        {
          "q": "There are four pencils on the desk.",
          "a": "T"
        },
        {
          "q": "The books are about cars.",
          "a": "F (animals)"
        },
        {
          "q": "The boxes are under the bed.",
          "a": "T"
        }
      ],
      "text": "This is my room. It's small, but I love it! There are two windows and a big bed.\n\nOn my desk there are three books, four pencils and a lamp. These are my favourite books. They're about animals.\n\nUnder the bed there are two boxes. Those boxes are full of old toys. My little brother wants them, but they're my toys!"
    },
    {
      "id": "room_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "How many windows are there?",
          "a": "Two."
        },
        {
          "q": "What is on the desk?",
          "a": "Three books, four pencils and a lamp."
        },
        {
          "q": "What are the books about?",
          "a": "Animals."
        },
        {
          "q": "Where are the boxes?",
          "a": "Under the bed."
        },
        {
          "q": "What is in the boxes?",
          "a": "Old toys."
        }
      ]
    },
    {
      "id": "myroom",
      "type": "write",
      "skill": "writing",
      "title": "Write about your room or your classroom.",
      "items": [
        {
          "q": "In my room there are… (how many?)",
          "a": "(students' own)"
        },
        {
          "q": "On my desk there are…",
          "a": "(students' own)"
        },
        {
          "q": "These are my…",
          "a": "(students' own)"
        },
        {
          "q": "Those are…",
          "a": "(students' own)"
        },
        {
          "q": "My favourite things are…",
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
          "q": "one child, two…",
          "opts": [
            "childs",
            "children",
            "childrens"
          ],
          "a": "b"
        },
        {
          "q": "one city, two…",
          "opts": [
            "citys",
            "cities",
            "cityes"
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
          "q": "one person, two…",
          "opts": [
            "persons",
            "people",
            "peoples"
          ],
          "a": "b"
        },
        {
          "q": "Look at ___ birds! (far)",
          "opts": [
            "these",
            "those",
            "this"
          ],
          "a": "b"
        },
        {
          "q": "one foot, two…",
          "opts": [
            "foots",
            "feet",
            "feets"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 4 (2 hours): plurals and this / that / these / those. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "➕",
          "text": "Grammar: one pen → two pens, boxes, cities"
        },
        {
          "emoji": "🧑‍🤝‍🧑",
          "text": "Special plurals: men, women, children, people"
        },
        {
          "emoji": "👉",
          "text": "this · that · these · those"
        },
        {
          "emoji": "🎧",
          "text": "Listening: how many?, tidy up, the toy shop"
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
          "q": "What colour is grass?",
          "a": "green"
        },
        {
          "q": "📏 = ?",
          "a": "a ruler"
        },
        {
          "q": "A pilot works in a…",
          "a": "plane"
        },
        {
          "q": "She's ___ engineer.",
          "a": "an"
        },
        "What colour is your bag?"
      ],
      "notes": "Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Colour hunt",
      "emoji": "🎨",
      "minutes": 5,
      "text": "Listen to the colour.\nTouch something of that colour!\nSay: \"It's a red pen!\"",
      "notes": "Quick revision of Lesson 3."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "1️⃣",
          "word": "one",
          "tr": "one pen"
        },
        {
          "emoji": "➕",
          "word": "plural",
          "tr": "pens, boxes"
        },
        {
          "emoji": "📦",
          "word": "box",
          "tr": "two boxes"
        },
        {
          "emoji": "🏙️",
          "word": "city",
          "tr": "two cities"
        },
        {
          "emoji": "👨",
          "word": "man",
          "tr": "two men"
        },
        {
          "emoji": "🧒",
          "word": "child",
          "tr": "two children"
        },
        {
          "emoji": "🤚",
          "word": "this / these",
          "tr": "near me"
        },
        {
          "emoji": "👉",
          "word": "that / those",
          "tr": "far from me"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · ONE → MANY",
      "title": "Plurals",
      "boxes": [
        {
          "head": "+ s",
          "body": "pen → pens\nbook → books\nboy → boys"
        },
        {
          "head": "+ es",
          "body": "box → boxes\nwatch → watches\nbus → buses"
        },
        {
          "head": "y → ies",
          "body": "baby → babies\ncity → cities\ndictionary → dictionaries"
        }
      ],
      "foot": "After s, x, ch, sh → + es · consonant + y → ies",
      "notes": "Count things in the room: one window, two windows…"
    },
    {
      "layout": "exercise",
      "ex": "plurals",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "rules",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "How many?",
      "listen": 0,
      "text": "Five people say how many things they have got.\nListen and circle the right answer (handout exercise 3).",
      "tips": [
        "Listen for the number",
        "One or many?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_count",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "tiles",
      "tag": "LESSON 2 · SPECIAL PLURALS",
      "title": "One man, two men",
      "tiles": [
        "man → men",
        "woman → women",
        "child → children",
        "person → people",
        "foot → feet",
        "tooth → teeth",
        "mouse → mice",
        "fish → fish"
      ],
      "notes": "Say \"one man\", students say \"two men!\" — faster and faster.",
      "small": true,
      "cols": 4,
      "foot": "No \"s\": two mans ✗ → two men ✓"
    },
    {
      "layout": "exercise",
      "ex": "irregular",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "Plural mistakes everyone makes",
      "rows": [
        {
          "wrong": "two pen",
          "right": "two pens"
        },
        {
          "wrong": "boxs",
          "right": "boxes"
        },
        {
          "wrong": "citys",
          "right": "cities"
        },
        {
          "wrong": "childs",
          "right": "children"
        },
        {
          "wrong": "womans",
          "right": "women"
        },
        {
          "wrong": "peoples",
          "right": "people"
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "plodd",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 3 · THIS, THAT, THESE, THOSE",
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
      "notes": "Hold things / point at things."
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
      "title": "Tidy up!",
      "listen": 1,
      "text": "Ben's mum asks him about things in his room.\nListen: true or false? (handout exercise 8)",
      "tips": [
        "these / those = many",
        "Whose? Ben's, Kate's, Dad's",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_tidy",
      "notes": "Handout exercise 8 (Listening 2)."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "This or that?",
      "emoji": "👉",
      "minutes": 6,
      "text": "Your partner points at something.\nNear? Say \"This is…\" / \"These are…\"\nFar? Say \"That is…\" / \"Those are…\"\nRight = 1 point!",
      "notes": "Pairs, then the whole class."
    },
    {
      "layout": "exercise",
      "ex": "clorder",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "exercise",
      "ex": "count",
      "notes": "Handout exercise 10."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "At the toy shop",
      "listen": 2,
      "text": "A boy buys toys in a shop.\nListen and complete (handout exercise 11).",
      "tips": [
        "How much? How many?",
        "these / those",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_shop",
      "notes": "Handout exercise 11 (Listening 3)."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "My room",
      "text": "This is my room. It's small, but I love it! There are two windows and a big bed.\n\nOn my desk there are three books, four pencils and a lamp. These are my favourite books. They're about animals.\n\nUnder the bed there are two boxes. Those boxes are full of old toys. My little brother wants them, but they're my toys!",
      "tips": [
        "How many? Where?",
        "Read, then do exercises 12 and 13"
      ],
      "notes": "Students read silently (3 min)."
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
      "ex": "myroom",
      "notes": "Handout exercise 14.",
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
        "I can make plurals: boxes, cities",
        "I can say men, women, children, people",
        "I can use this, that, these, those",
        "I can count things in the room"
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — How many?",
      "src": "audio/course/c1l4-listening-1.mp3",
      "text": "Number one. I've got four pencils in my pencil case. Number two. There are twelve boys in my class. Number three. My mum has got three cats and two dogs! Number four. We've got six new computers in our classroom. Number five. In my bag I've got two dictionaries and a notebook.",
      "script": "Narrator: Listening one. How many? Circle the right answer.\nNarrator: Number one.\nA: I've got four pencils in my pencil case.\nNarrator: Number two.\nB: There are twelve boys in my class.\nNarrator: Number three.\nC: My mum has got three cats and two dogs!\nNarrator: Number four.\nD: We've got six new computers in our classroom.\nNarrator: Number five.\nE: In my bag I've got two dictionaries and a notebook."
    },
    {
      "label": "Listening 2 — Tidy up!",
      "src": "audio/course/c1l4-listening-2.mp3",
      "text": "Ben, are these your socks on the floor? Yes, they are. Sorry, Mum! And is this your book? No, it isn't. That's Kate's book. What about those shoes by the door? Those are Dad's shoes. And these toys? They're my toys. I've got five new toy cars!",
      "script": "Narrator: Listening two. Tidy up! True or false?\nA: Ben, are these your socks on the floor?\nB: Yes, they are. Sorry, Mum!\nA: And is this your book?\nB: No, it isn't. That's Kate's book.\nA: What about those shoes by the door?\nB: Those are Dad's shoes.\nA: And these toys?\nB: They're my toys. I've got five new toy cars!"
    },
    {
      "label": "Listening 3 — At the toy shop",
      "src": "audio/course/c1l4-listening-3.mp3",
      "text": "Hello! Can I help you? Yes, please. How much are these teddy bears? They're nine pounds each. And those balls over there? The red balls are three pounds. OK. Two teddy bears and three balls, please. Here you are. That's twenty-seven pounds, please. Twenty-seven pounds. Here you are. Thank you!",
      "script": "Narrator: Listening three. At the toy shop. Listen and complete.\nA: Hello! Can I help you?\nB: Yes, please. How much are these teddy bears?\nA: They're nine pounds each.\nB: And those balls over there?\nA: The red balls are three pounds.\nB: OK. Two teddy bears and three balls, please.\nA: Here you are. That's twenty-seven pounds, please.\nB: Twenty-seven pounds. Here you are. Thank you!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
  test: [
    {
      "q": "one box, two _____",
      "a": "boxes",
      "wrong": [
        "boxs",
        "box",
        "boxies"
      ]
    },
    {
      "q": "one child, three _____",
      "a": "children",
      "wrong": [
        "childs",
        "childrens",
        "childes"
      ]
    },
    {
      "q": "one dictionary, two _____",
      "a": "dictionaries",
      "wrong": [
        "dictionarys",
        "dictionaryes",
        "dictionary"
      ]
    },
    {
      "q": "one woman, two _____",
      "a": "women",
      "wrong": [
        "womans",
        "womens",
        "woman"
      ]
    },
    {
      "q": "_____ is my pen. (here, in my hand)",
      "a": "This",
      "wrong": [
        "These",
        "Those",
        "They"
      ]
    },
    {
      "q": "_____ are my books. (here, on my desk)",
      "a": "These",
      "wrong": [
        "This",
        "That",
        "It"
      ]
    },
    {
      "q": "Look at _____ window over there!",
      "a": "that",
      "wrong": [
        "these",
        "those",
        "this is"
      ]
    },
    {
      "q": "_____ birds in the sky are beautiful. (far away)",
      "a": "Those",
      "wrong": [
        "That",
        "This",
        "These is"
      ]
    },
    {
      "q": "What's this in English? — _____ a ruler.",
      "a": "It's",
      "wrong": [
        "They're",
        "This",
        "Its"
      ]
    },
    {
      "q": "What are these? — _____ pencils.",
      "a": "They're",
      "wrong": [
        "It's",
        "This is",
        "There"
      ]
    },
    {
      "q": "one baby, two _____",
      "a": "babies",
      "wrong": [
        "babys",
        "babyes",
        "baby"
      ]
    },
    {
      "q": "one city, two _____",
      "a": "cities",
      "wrong": [
        "citys",
        "cityes",
        "city"
      ]
    },
    {
      "q": "one person, two _____",
      "a": "people",
      "wrong": [
        "persons",
        "peoples",
        "person"
      ]
    },
    {
      "q": "one foot, two _____",
      "a": "feet",
      "wrong": [
        "foots",
        "feets",
        "footes"
      ]
    },
    {
      "q": "one tooth, two _____",
      "a": "teeth",
      "wrong": [
        "tooths",
        "teeths",
        "toothes"
      ]
    },
    {
      "q": "one bus, two _____",
      "a": "buses",
      "wrong": [
        "buss",
        "busies",
        "bus"
      ]
    },
    {
      "q": "one boy, two _____",
      "a": "boys",
      "wrong": [
        "boies",
        "boyes",
        "boy"
      ]
    },
    {
      "q": "_____ shoes over there are Dad's.",
      "a": "Those",
      "wrong": [
        "That",
        "This",
        "These is"
      ]
    },
    {
      "q": "Are _____ your socks? (here) — Yes, they are.",
      "a": "these",
      "wrong": [
        "this",
        "that",
        "it"
      ]
    },
    {
      "q": "one mouse, two _____",
      "a": "mice",
      "wrong": [
        "mouses",
        "mices",
        "mouse"
      ]
    }
  ]
});

/* ---------- Block 1, Lesson 5: An apple, the apple ---------- */
Object.assign(COURSE_BEGINNER.blocks[0].lessons[4], {
  // A 2-hour lesson: many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  goals: [
    "Use a and an: a pen, an apple, an old bag",
    "Use the for a thing we know: the apple, the door",
    "Talk about a picture: There is a cat. The cat is black."
  ],
  warmups: [
    {
      "emoji": "➕",
      "title": "One, two! (from Lesson 4)",
      "time": "5 min",
      "how": "Say \"one box\"; students shout \"two boxes!\" Then man, child, city, tooth…"
    },
    {
      "emoji": "🍎",
      "title": "A or an?",
      "time": "6 min",
      "how": "Show a thing (or draw it). Students say \"a\" or \"an\" with it: \"an apple!\", \"a pen!\""
    },
    {
      "emoji": "🖼️",
      "title": "What's in the picture?",
      "time": "6 min",
      "how": "Show a picture for 20 seconds, then hide it. Pairs say: \"There is a dog. The dog is brown.\""
    }
  ],
  exercises: [
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
      "id": "aanadj",
      "type": "choose",
      "skill": "writing",
      "title": "a or an? Circle the right answer.",
      "items": [
        {
          "q": "It's ___ old book.",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        },
        {
          "q": "She's ___ English teacher.",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        },
        {
          "q": "It's ___ big apple.",
          "opts": [
            "a",
            "an"
          ],
          "a": "a"
        },
        {
          "q": "He's ___ engineer.",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        },
        {
          "q": "It's ___ new umbrella.",
          "opts": [
            "a",
            "an"
          ],
          "a": "a"
        },
        {
          "q": "I've got ___ orange pen.",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        }
      ]
    },
    {
      "id": "lis_picture",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 1: My picture. True (T) or false (F)?",
      "items": [
        {
          "q": "The house is big.",
          "a": "F (small)"
        },
        {
          "q": "The cat is black.",
          "a": "T"
        },
        {
          "q": "There is a red apple on the table.",
          "a": "T"
        },
        {
          "q": "The umbrella is by the window.",
          "a": "F (by the door)"
        },
        {
          "q": "The boy is her son.",
          "a": "T"
        }
      ],
      "listen": 0
    },
    {
      "id": "athe",
      "type": "gap",
      "skill": "writing",
      "title": "Write a, an or the.",
      "items": [
        {
          "q": "I've got ___ cat. ___ cat is white.",
          "a": "a · The"
        },
        {
          "q": "There's ___ apple on the desk. ___ apple is red.",
          "a": "an · The"
        },
        {
          "q": "Please open ___ door.",
          "a": "the"
        },
        {
          "q": "He's got ___ new bike. ___ bike is blue.",
          "a": "a · The"
        },
        {
          "q": "Look at ___ board, please.",
          "a": "the"
        },
        {
          "q": "She's ___ actor.",
          "a": "an"
        }
      ]
    },
    {
      "id": "athechoose",
      "type": "choose",
      "skill": "reading",
      "title": "Circle the right answer.",
      "items": [
        {
          "q": "Close ___ window, please. (in our classroom)",
          "opts": [
            "a",
            "the",
            "an"
          ],
          "a": "b"
        },
        {
          "q": "I want ___ sandwich.",
          "opts": [
            "a",
            "the",
            "an"
          ],
          "a": "a"
        },
        {
          "q": "My dad is ___ pilot.",
          "opts": [
            "a",
            "an",
            "the"
          ],
          "a": "a"
        },
        {
          "q": "There's a dog in the park. ___ dog is big.",
          "opts": [
            "A",
            "An",
            "The"
          ],
          "a": "c"
        },
        {
          "q": "Is there ___ eraser in your bag?",
          "opts": [
            "a",
            "an",
            "the"
          ],
          "a": "b"
        },
        {
          "q": "What's ___ time?",
          "opts": [
            "a",
            "the",
            "an"
          ],
          "a": "b"
        }
      ]
    },
    {
      "id": "artcorrect",
      "type": "correct",
      "skill": "writing",
      "title": "Find the mistake and write the sentence again.",
      "items": [
        {
          "q": "She's a English teacher.",
          "a": "She's an English teacher."
        },
        {
          "q": "I've got an pen.",
          "a": "I've got a pen."
        },
        {
          "q": "He is doctor.",
          "a": "He is a doctor."
        },
        {
          "q": "Open a door, please. (our classroom door)",
          "a": "Open the door, please."
        },
        {
          "q": "It's an big apple.",
          "a": "It's a big apple."
        }
      ]
    },
    {
      "id": "lis_pets",
      "type": "gap",
      "skill": "listening",
      "title": "Listening 2: My pets. Listen and complete.",
      "items": [
        {
          "q": "His dog is called ________.",
          "a": "Rex"
        },
        {
          "q": "The dog is big and ____________.",
          "a": "brown"
        },
        {
          "q": "His cat's name is ____________.",
          "a": "Snow"
        },
        {
          "q": "He has got two ____________ fish.",
          "a": "orange"
        },
        {
          "q": "The white rabbit is his ____________'s.",
          "a": "friend"
        }
      ],
      "listen": 1
    },
    {
      "id": "artodd",
      "type": "odd",
      "skill": "reading",
      "title": "Which one is different? Circle it.",
      "items": [
        {
          "q": "an apple · an egg · an orange · an banana",
          "a": "an banana (a banana)"
        },
        {
          "q": "a pen · a book · a umbrella · a desk",
          "a": "a umbrella (an umbrella)"
        },
        {
          "q": "an actor · an engineer · an doctor · an artist",
          "a": "an doctor (a doctor)"
        },
        {
          "q": "a red bag · a old bag · a big bag · a new bag",
          "a": "a old bag (an old bag)"
        }
      ]
    },
    {
      "id": "artorder",
      "type": "order",
      "skill": "writing",
      "title": "Put the words in order.",
      "items": [
        {
          "q": "is / the / cat / black / .",
          "a": "The cat is black."
        },
        {
          "q": "an / I've / orange / got / .",
          "a": "I've got an orange."
        },
        {
          "q": "teacher / is / she / an / English / .",
          "a": "She is an English teacher."
        },
        {
          "q": "the / please / open / window / ,",
          "a": "Open the window, please."
        },
        {
          "q": "a / there / dog / is / .",
          "a": "There is a dog."
        }
      ]
    },
    {
      "id": "lis_cafe",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 3: At the café. Circle the right answer.",
      "items": [
        {
          "q": "He wants…",
          "opts": [
            "an apple juice",
            "an orange juice",
            "a milk"
          ],
          "a": "b"
        },
        {
          "q": "The orange juice is…",
          "opts": [
            "£2",
            "£3",
            "£4"
          ],
          "a": "a"
        },
        {
          "q": "He wants a sandwich with…",
          "opts": [
            "cheese",
            "egg",
            "chicken"
          ],
          "a": "b"
        },
        {
          "q": "The sandwich is…",
          "opts": [
            "£2",
            "£4",
            "£5"
          ],
          "a": "b"
        },
        {
          "q": "He takes ___ for later.",
          "opts": [
            "a banana",
            "an orange",
            "an apple"
          ],
          "a": "c"
        }
      ],
      "listen": 2
    },
    {
      "id": "school_tf",
      "type": "tf",
      "skill": "reading",
      "title": "Read about Emma's first day. True (T) or false (F)?",
      "items": [
        {
          "q": "It's Emma's first day at a new school.",
          "a": "T"
        },
        {
          "q": "The school is small.",
          "a": "F (big)"
        },
        {
          "q": "The classroom is on the first floor.",
          "a": "T"
        },
        {
          "q": "Mrs Lee is a maths teacher.",
          "a": "F (English teacher)"
        },
        {
          "q": "Sophie has got an orange bag.",
          "a": "T"
        }
      ],
      "text": "My name's Emma. Today is my first day at a new school. I'm a bit nervous!\n\nThe school is big and it's very old. My classroom is on the first floor. There's a big window and a whiteboard.\n\nMy English teacher is Mrs Lee. She's nice and funny. In the class there's a girl with an orange bag. Her name's Sophie. The orange bag is new, and it's beautiful! Now Sophie is my friend."
    },
    {
      "id": "school_q",
      "type": "write",
      "skill": "reading",
      "title": "Read again. Answer the questions.",
      "items": [
        {
          "q": "Is the school new or old?",
          "a": "It's old."
        },
        {
          "q": "What is in the classroom?",
          "a": "A big window and a whiteboard."
        },
        {
          "q": "What is Mrs Lee like?",
          "a": "She's nice and funny."
        },
        {
          "q": "What colour is Sophie's bag?",
          "a": "Orange."
        },
        {
          "q": "Who is Emma's new friend?",
          "a": "Sophie."
        }
      ]
    },
    {
      "id": "jobsaan",
      "type": "gap",
      "skill": "writing",
      "title": "Write a or an + the job.",
      "items": [
        {
          "q": "👩‍⚕️ She's ____________.",
          "a": "a doctor"
        },
        {
          "q": "🧑‍🔧 He's ____________.",
          "a": "an engineer"
        },
        {
          "q": "🧑‍🎨 She's ____________.",
          "a": "an artist"
        },
        {
          "q": "👨‍🍳 He's ____________.",
          "a": "a cook"
        },
        {
          "q": "🧑‍✈️ She's ____________.",
          "a": "a pilot"
        },
        {
          "q": "🎭 He's ____________.",
          "a": "an actor"
        }
      ]
    },
    {
      "id": "mypicture",
      "type": "write",
      "skill": "writing",
      "title": "Draw a picture of your room or your street. Write about it.",
      "items": [
        {
          "q": "There is a… (one thing)",
          "a": "(students' own)"
        },
        {
          "q": "The … is… (colour / big / small)",
          "a": "(students' own)"
        },
        {
          "q": "There is an…",
          "a": "(students' own)"
        },
        {
          "q": "There are… (many things)",
          "a": "(students' own)"
        },
        {
          "q": "My favourite thing in the picture is…",
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
            "an"
          ],
          "a": "b"
        },
        {
          "q": "___ yellow bag",
          "opts": [
            "a",
            "an"
          ],
          "a": "a"
        },
        {
          "q": "Open ___ door, please.",
          "opts": [
            "a",
            "the"
          ],
          "a": "b"
        },
        {
          "q": "He's ___ artist.",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        },
        {
          "q": "I've got a dog. ___ dog is black.",
          "opts": [
            "A",
            "The"
          ],
          "a": "b"
        },
        {
          "q": "___ hour",
          "opts": [
            "a",
            "an"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "Lesson 5 (2 hours): a, an and the. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we learn today",
      "rows": [
        {
          "emoji": "🍎",
          "text": "Grammar: a pen, an apple, an old bag"
        },
        {
          "emoji": "👉",
          "text": "Grammar: the apple, the door (a thing we know)"
        },
        {
          "emoji": "🎧",
          "text": "Listening: my picture, my pets, at the café"
        },
        {
          "emoji": "📖",
          "text": "Reading: Emma's first day"
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
          "q": "one child, two…",
          "a": "children"
        },
        {
          "q": "one box, two…",
          "a": "boxes"
        },
        {
          "q": "one city, two…",
          "a": "cities"
        },
        {
          "q": "___ are my pens. (here)",
          "a": "These"
        },
        "How many windows are in our classroom?"
      ],
      "notes": "Click to show each question, then its answer."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "One, two!",
      "emoji": "➕",
      "minutes": 5,
      "text": "Your teacher says \"one box\".\nYou shout \"two boxes!\"\nFastest team gets a point!",
      "notes": "Quick revision of Lesson 4."
    },
    {
      "layout": "words",
      "tag": "LEAD-IN",
      "title": "Words for today",
      "cards": [
        {
          "emoji": "🍎",
          "word": "an apple",
          "tr": "An apple a day!"
        },
        {
          "emoji": "🍊",
          "word": "an orange",
          "tr": "I've got an orange."
        },
        {
          "emoji": "☂️",
          "word": "an umbrella",
          "tr": "It's an umbrella."
        },
        {
          "emoji": "🥚",
          "word": "an egg",
          "tr": "an egg sandwich"
        },
        {
          "emoji": "🏠",
          "word": "a house",
          "tr": "a small house"
        },
        {
          "emoji": "🐱",
          "word": "a cat",
          "tr": "The cat is black."
        },
        {
          "emoji": "🚪",
          "word": "the door",
          "tr": "Open the door, please."
        },
        {
          "emoji": "🖼️",
          "word": "a picture",
          "tr": "Look at the picture!"
        }
      ],
      "notes": "Say each word, students repeat. Ask \"Can you give an example?\" — then click the card to show one."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 1 · A OR AN?",
      "title": "a pen, an apple",
      "boxes": [
        {
          "head": "a + consonant sound",
          "body": "a pen\na book\na big apple"
        },
        {
          "head": "an + a, e, i, o, u sound",
          "body": "an apple\nan egg\nan old bag"
        },
        {
          "head": "Jobs",
          "body": "He's a doctor.\nShe's an engineer."
        }
      ],
      "foot": "Listen to the first sound: a umbrella ✗ → an umbrella ✓",
      "notes": "Say words fast; students answer \"a!\" or \"an!\"."
    },
    {
      "layout": "exercise",
      "ex": "aan",
      "notes": "Handout exercise 1."
    },
    {
      "layout": "exercise",
      "ex": "aanadj",
      "notes": "Handout exercise 2."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "My picture",
      "listen": 0,
      "text": "A woman talks about her picture.\nListen: true or false? (handout exercise 3)",
      "tips": [
        "a … then the …",
        "Where is it?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_picture",
      "notes": "Handout exercise 3 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "LESSON 2 · A OR THE?",
      "title": "a cat → the cat",
      "boxes": [
        {
          "head": "a / an = new, one of many",
          "body": "I've got a cat.\nThere's an apple."
        },
        {
          "head": "the = we know which one",
          "body": "The cat is black.\nThe apple is red."
        },
        {
          "head": "the = only one here",
          "body": "Open the door.\nLook at the board."
        }
      ],
      "foot": "First time: a / an · Second time: the",
      "notes": "Draw a cat on the board: \"This is a cat. The cat is happy.\""
    },
    {
      "layout": "exercise",
      "ex": "athe",
      "notes": "Handout exercise 4."
    },
    {
      "layout": "exercise",
      "ex": "athechoose",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "mistakes",
      "tag": "YOU FOUND IT",
      "title": "a / an / the mistakes everyone makes",
      "rows": [
        {
          "wrong": "He is doctor.",
          "right": "He is a doctor."
        },
        {
          "wrong": "a apple",
          "right": "an apple"
        },
        {
          "wrong": "an big apple",
          "right": "a big apple"
        },
        {
          "wrong": "a old book",
          "right": "an old book"
        },
        {
          "wrong": "Open a door, please.",
          "right": "Open the door, please."
        },
        {
          "wrong": "I've got cat.",
          "right": "I've got a cat."
        }
      ],
      "notes": "Read the wrong one: \"Is it right?\" Students find the problem, then click to show the right one."
    },
    {
      "layout": "exercise",
      "ex": "artcorrect",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "My pets",
      "listen": 1,
      "text": "A boy talks about his pets.\nListen and complete (handout exercise 7).",
      "tips": [
        "Names and colours",
        "a dog … the dog …",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_pets",
      "notes": "Handout exercise 7 (Listening 2)."
    },
    {
      "layout": "game",
      "tag": "GAME",
      "title": "Picture memory",
      "emoji": "🖼️",
      "minutes": 6,
      "text": "Look at a picture for 20 seconds.\nClose your eyes!\nSay: \"There is a dog. The dog is brown.\"\nRight = 1 point!",
      "notes": "Pairs or teams. Use any picture from the book or the internet."
    },
    {
      "layout": "exercise",
      "ex": "artodd",
      "notes": "Handout exercise 8."
    },
    {
      "layout": "exercise",
      "ex": "artorder",
      "notes": "Handout exercise 9."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "At the café",
      "listen": 2,
      "text": "A man buys food and a drink.\nListen and circle the right answer (handout exercise 10).",
      "tips": [
        "What does he want?",
        "How much?",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_cafe",
      "notes": "Handout exercise 10 (Listening 3)."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "My first day",
      "text": "My name's Emma. Today is my first day at a new school. I'm a bit nervous!\n\nThe school is big and it's very old. My classroom is on the first floor. There's a big window and a whiteboard.\n\nMy English teacher is Mrs Lee. She's nice and funny. In the class there's a girl with an orange bag. Her name's Sophie. The orange bag is new, and it's beautiful! Now Sophie is my friend.",
      "tips": [
        "a / an / the",
        "Read, then do exercises 11 and 12"
      ],
      "notes": "Students read silently (3 min)."
    },
    {
      "layout": "exercise",
      "ex": "school_tf",
      "notes": "Handout exercise 11."
    },
    {
      "layout": "exercise",
      "ex": "school_q",
      "notes": "Handout exercise 12."
    },
    {
      "layout": "exercise",
      "ex": "jobsaan",
      "notes": "Handout exercise 13."
    },
    {
      "layout": "game",
      "tag": "SPEAKING",
      "title": "Describe and draw",
      "emoji": "✏️",
      "minutes": 8,
      "text": "Student A describes a picture:\n\"There is a house. The house is small…\"\nStudent B draws it.\nThen compare!",
      "notes": "Pairs. Then swap."
    },
    {
      "layout": "exercise",
      "ex": "mypicture",
      "notes": "Handout exercise 14.",
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
        "I can say a pen, an apple, an old bag",
        "I can say a cat → the cat",
        "I can use the for things we know",
        "I can talk about a picture"
      ],
      "foot": "Homework: the revision test 📲 (link from your teacher)",
      "notes": "Send the revision test link now (Course → Revision test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — My picture",
      "src": "audio/course/c1l5-listening-1.mp3",
      "text": "This is my picture. There is a small house, and there is a cat in the garden. The cat is black. In the kitchen there is a table. On the table there is a red apple. There is an umbrella by the door, because it is a rainy day. And look, there is a boy at the window. The boy is my son, Harry. He is seven years old.",
      "script": "Narrator: Listening one. My picture. True or false?\nA: This is my picture. There is a small house, and there is a cat in the garden. The cat is black.\nA: In the kitchen there is a table. On the table there is a red apple.\nA: There is an umbrella by the door, because it is a rainy day.\nA: And look, there is a boy at the window. The boy is my son, Harry. He is seven years old."
    },
    {
      "label": "Listening 2 — My pets",
      "src": "audio/course/c1l5-listening-2.mp3",
      "text": "Hi! I love animals, and I have got lots of pets. I have got a dog. The dog is called Rex. He is big and brown. I have got a cat, too. The cat is white, so her name is Snow. And I have got two fish. The fish are orange and very small. Oh, and there is a white rabbit in the garden. The rabbit is not my rabbit. It is my friend's rabbit.",
      "script": "Narrator: Listening two. My pets. Listen and complete.\nA: Hi! I love animals, and I have got lots of pets.\nA: I have got a dog. The dog is called Rex. He is big and brown.\nA: I have got a cat, too. The cat is white, so her name is Snow.\nA: And I have got two fish. The fish are orange and very small.\nA: Oh, and there is a white rabbit in the garden. The rabbit is not my rabbit. It is my friend's rabbit."
    },
    {
      "label": "Listening 3 — At the café",
      "src": "audio/course/c1l5-listening-3.mp3",
      "text": "Good morning! What would you like? Hello. Can I have an orange juice, please? Sure. The orange juice is two pounds. And I would like a sandwich, please. An egg sandwich. OK. The egg sandwich is four pounds. Great. Oh, and can I have an apple, please? It's for later. Of course. Here you are. The apple is free today! Really? Thank you very much!",
      "script": "Narrator: Listening three. At the café. Circle the right answer.\nA: Good morning! What would you like?\nB: Hello. Can I have an orange juice, please?\nA: Sure. The orange juice is two pounds.\nB: And I would like a sandwich, please. An egg sandwich.\nA: OK. The egg sandwich is four pounds.\nB: Great. Oh, and can I have an apple, please? It's for later.\nA: Of course. Here you are. The apple is free today!\nB: Really? Thank you very much!"
    }
  ],
  teacherScript: [
    "Play each listening twice (🔊 on its slide or the Listening card). The full scripts are below."
  ],
  test: [
    {
      "q": "_____ apple",
      "a": "an",
      "wrong": [
        "a",
        "the a",
        "two"
      ]
    },
    {
      "q": "_____ pencil",
      "a": "a",
      "wrong": [
        "an",
        "two a",
        "an a"
      ]
    },
    {
      "q": "_____ eraser",
      "a": "an",
      "wrong": [
        "a",
        "one an",
        "the an"
      ]
    },
    {
      "q": "_____ umbrella",
      "a": "an",
      "wrong": [
        "a",
        "the an",
        "two"
      ]
    },
    {
      "q": "_____ orange",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "q": "_____ old book",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "an a"
      ]
    },
    {
      "q": "_____ big apple",
      "a": "a",
      "wrong": [
        "an",
        "two",
        "an a"
      ]
    },
    {
      "q": "She's _____ engineer.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "q": "He's _____ doctor.",
      "a": "a",
      "wrong": [
        "an",
        "two",
        "the a"
      ]
    },
    {
      "q": "I've got a cat. _____ cat is black.",
      "a": "The",
      "wrong": [
        "A",
        "An",
        "Two"
      ]
    },
    {
      "q": "Open _____ door, please.",
      "a": "the",
      "wrong": [
        "an",
        "two",
        "these"
      ]
    },
    {
      "q": "There's an apple on the desk. _____ apple is red.",
      "a": "The",
      "wrong": [
        "A",
        "An",
        "This are"
      ]
    },
    {
      "q": "My mum is _____ pilot.",
      "a": "a",
      "wrong": [
        "an",
        "the an",
        "two"
      ]
    },
    {
      "q": "Is there _____ eraser in your bag?",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    },
    {
      "q": "He is _____ actor.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    },
    {
      "q": "Look at _____ board, please.",
      "a": "the",
      "wrong": [
        "an",
        "two",
        "those"
      ]
    },
    {
      "q": "I want _____ egg sandwich.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    },
    {
      "q": "_____ new umbrella",
      "a": "a",
      "wrong": [
        "an",
        "two",
        "an a"
      ]
    },
    {
      "q": "It's _____ hour.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    },
    {
      "q": "Close _____ window, please.",
      "a": "the",
      "wrong": [
        "an",
        "two",
        "those"
      ]
    }
  ]
});

/* ---------- Block 1: Review 1 ---------- */
COURSE_BEGINNER.blocks[0].review = {
  // The review lesson (2 hours): many kinds of exercises; 3 listenings of 5 questions each, recorded by Claude (Kokoro voices,
  // audio/course/*.mp3; the computer's own voice reads the text if a file can't play). Generated from a script;
  // the slides (deck) and the handout are both made from `exercises`.
  title: "Review 1",
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
    "Know the exam: grammar, listening and reading online, writing on paper"
  ],
  warmups: [
    {
      "emoji": "🏃",
      "title": "Board race",
      "time": "8 min",
      "how": "Two teams, one marker each. Say a word (\"Japanese\", \"children\", \"umbrella\", \"engineer\"); one student from each team runs and writes it."
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
      "how": "Students walk and ask the questions on the handout (exercise 13) until they have a name for each line."
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
      "id": "r_nat",
      "type": "match",
      "skill": "reading",
      "title": "Lesson 1: Match the country and the nationality.",
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
          "q": "Favourite colour: ____________",
          "a": "blue"
        }
      ],
      "listen": 0
    },
    {
      "id": "r_be",
      "type": "gap",
      "skill": "writing",
      "title": "Lesson 2: Write am, is, are, or isn't / aren't.",
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
      "id": "r_jobs",
      "type": "choose",
      "skill": "reading",
      "title": "Lesson 3: Circle the right answer.",
      "items": [
        {
          "q": "She works in a hospital. She's a…",
          "opts": [
            "pilot",
            "doctor",
            "farmer"
          ],
          "a": "b"
        },
        {
          "q": "He works in a restaurant. He's a…",
          "opts": [
            "cook",
            "teacher",
            "driver"
          ],
          "a": "a"
        },
        {
          "q": "Grass is…",
          "opts": [
            "red",
            "green",
            "pink"
          ],
          "a": "b"
        },
        {
          "q": "📏 =",
          "opts": [
            "a ruler",
            "a rubber",
            "a pencil"
          ],
          "a": "a"
        },
        {
          "q": "What colour is the sky?",
          "opts": [
            "It's blue.",
            "It's a blue.",
            "Blue is."
          ],
          "a": "a"
        },
        {
          "q": "I write in my…",
          "opts": [
            "notebook",
            "window",
            "chair"
          ],
          "a": "a"
        }
      ]
    },
    {
      "id": "lis_rev2",
      "type": "tf",
      "skill": "listening",
      "title": "Listening 2: Two friends look at a class photo. True (T) or false (F)?",
      "items": [
        {
          "q": "Mr Brown is from Scotland.",
          "a": "T"
        },
        {
          "q": "Emma and Lucy are in Daniel's class now.",
          "a": "F (they aren't)"
        },
        {
          "q": "Jack's bag is green.",
          "a": "T"
        },
        {
          "q": "Jack's dad is a doctor.",
          "a": "F (a pilot; his mum is a doctor)"
        },
        {
          "q": "In the photo Daniel is next to the window.",
          "a": "T"
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
      "id": "r_athe",
      "type": "gap",
      "skill": "writing",
      "title": "Lesson 5: Write a, an or the.",
      "items": [
        {
          "q": "I've got ___ dog. ___ dog is brown.",
          "a": "a · The"
        },
        {
          "q": "She's ___ engineer.",
          "a": "an"
        },
        {
          "q": "Please close ___ door.",
          "a": "the"
        },
        {
          "q": "There's ___ orange in my bag.",
          "a": "an"
        },
        {
          "q": "He's ___ pilot.",
          "a": "a"
        },
        {
          "q": "Look at ___ board, please.",
          "a": "the"
        }
      ]
    },
    {
      "id": "lis_rev3",
      "type": "choose",
      "skill": "listening",
      "title": "Listening 3: At the school shop. Circle the right answer.",
      "items": [
        {
          "q": "She wants ___ pencils.",
          "opts": [
            "two",
            "three",
            "four"
          ],
          "a": "b"
        },
        {
          "q": "The pencils are…",
          "opts": [
            "blue",
            "black",
            "red"
          ],
          "a": "a"
        },
        {
          "q": "There are no ___ today.",
          "opts": [
            "rulers",
            "erasers",
            "notebooks"
          ],
          "a": "b"
        },
        {
          "q": "She buys ___ notebooks.",
          "opts": [
            "one",
            "two",
            "three"
          ],
          "a": "b"
        },
        {
          "q": "It's ___ pounds.",
          "opts": [
            "six",
            "five",
            "sixteen"
          ],
          "a": "a"
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
          "q": "Her dad is an engineer.",
          "a": "T"
        },
        {
          "q": "Her pencil case is blue.",
          "a": "F (green)"
        },
        {
          "q": "Chloe is Italian.",
          "a": "T"
        }
      ],
      "text": "Hi Jack! My name's Sophie and I'm your new e-friend! I'm twelve and I'm from Paris, in France, so I'm French.\n\nMy mum is a teacher and my dad is an engineer. My favourite colour is green.\n\nIn my school bag there are three notebooks, a green pencil case and an English dictionary. It's old, but it's good!\n\nMy best friend is Chloe. That's C-H-L-O-E. She isn't French, she's Italian. Write soon! Sophie"
    },
    {
      "id": "findwho",
      "type": "write",
      "skill": "speaking",
      "title": "Find someone who… (ask and write a name).",
      "items": [
        {
          "q": "…has got a blue bag.  \"What colour is your bag?\"",
          "a": "(students' own)"
        },
        {
          "q": "…is thirteen.  \"How old are you?\"",
          "a": "(students' own)"
        },
        {
          "q": "…can spell their surname fast.  \"How do you spell your surname?\"",
          "a": "(students' own)"
        },
        {
          "q": "…has got two notebooks today.  \"How many notebooks have you got?\"",
          "a": "(students' own)"
        },
        {
          "q": "…has a mum or dad who is a teacher.  \"Is your mum a teacher?\"",
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
          "q": "My mum is a / an… My dad is a / an…",
          "a": "(students' own)"
        },
        {
          "q": "My favourite colour is…",
          "a": "(students' own)"
        },
        {
          "q": "In my school bag there are…",
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
          "q": "They ___ from Spain.",
          "opts": [
            "is",
            "are",
            "am"
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
          "q": "She's ___ artist.",
          "opts": [
            "a",
            "an",
            "the"
          ],
          "a": "b"
        },
        {
          "q": "___ are my books. (here)",
          "opts": [
            "This",
            "These",
            "Those"
          ],
          "a": "b"
        }
      ]
    }
  ],
  deck: [
    {
      "layout": "title",
      "notes": "The review lesson (2 hours): games and practice for Lessons 1–5. Note which exercises are hard and practise them again. Students need the handout."
    },
    {
      "layout": "list",
      "tag": "TODAY",
      "title": "What we review today",
      "rows": [
        {
          "emoji": "👋",
          "text": "Lesson 1: hello, letters, numbers, countries"
        },
        {
          "emoji": "🧩",
          "text": "Lesson 2: be (am, is, are, isn't, aren't)"
        },
        {
          "emoji": "🎨",
          "text": "Lesson 3: things, colours, jobs"
        },
        {
          "emoji": "✏️",
          "text": "Lesson 4: plurals, this / these"
        },
        {
          "emoji": "🍎",
          "text": "Lesson 5: a, an, the"
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
        "Are you twelve?",
        {
          "q": "What's this? (point at a ruler)",
          "a": "It's a ruler."
        },
        "What colour is your bag?"
      ],
      "notes": "Ask around the class: everyone answers one question."
    },
    {
      "layout": "game",
      "tag": "WARM-UP GAME",
      "title": "Board race",
      "emoji": "🏃",
      "minutes": 8,
      "text": "Two teams. Listen to the word.\nRun and write it on the board, correctly!\n✅ = 1 point\nWords from all five lessons!",
      "notes": "Words: Japanese, children, umbrella, engineer, forty, purple, dictionaries."
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
          "emoji": "🧑‍⚕️",
          "word": "doctor",
          "tr": "She's a doctor."
        },
        {
          "emoji": "🎨",
          "word": "purple",
          "tr": "a purple bag"
        },
        {
          "emoji": "🧒",
          "word": "children",
          "tr": "one child"
        },
        {
          "emoji": "👉",
          "word": "those",
          "tr": "far, many"
        },
        {
          "emoji": "🍎",
          "word": "an",
          "tr": "an apple"
        }
      ],
      "notes": "Students say each word and an example, then click to check."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 1",
      "title": "Hello, numbers & countries",
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
          "head": "🌍 Countries",
          "body": "Spain → Spanish\nJapan → Japanese"
        }
      ],
      "foot": "Where are you from? — I'm from…",
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
      "layout": "exercise",
      "ex": "r_nat",
      "notes": "Handout exercise 3."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 1",
      "title": "At the sports club",
      "listen": 0,
      "text": "Oliver joins a sports club.\nListen and complete the form (handout exercise 4):\nsurname, age, country, phone, favourite colour.",
      "tips": [
        "The surname is spelled slowly",
        "Numbers: age and phone",
        "You hear it two times"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "exercise",
      "ex": "lis_rev1",
      "notes": "Handout exercise 4 (Listening 1)."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 2",
      "title": "be: all forms",
      "boxes": [
        {
          "head": "🧩 be",
          "body": "I am · he / she / it is\nyou / we / they are"
        },
        {
          "head": "🚫 Negative",
          "body": "I'm not · he isn't\nthey aren't"
        },
        {
          "head": "❓ Questions",
          "body": "Are you…? — Yes, I am.\nIs he…? — No, he isn't."
        }
      ],
      "foot": "he / she / it → IS · you / we / they → ARE",
      "notes": "Students ask each other \"Are you…?\" questions."
    },
    {
      "layout": "exercise",
      "ex": "r_be",
      "notes": "Handout exercise 5."
    },
    {
      "layout": "boxes",
      "tag": "REVIEW · LESSON 3",
      "title": "Things, colours & jobs",
      "boxes": [
        {
          "head": "🎒 Things",
          "body": "a pen · a ruler\na notebook · a dictionary"
        },
        {
          "head": "🎨 Colours",
          "body": "red · blue · green\npurple · pink · grey"
        },
        {
          "head": "🧑‍⚕️ Jobs",
          "body": "doctor · teacher · pilot\nengineer · cook · farmer"
        }
      ],
      "foot": "What colour is it? — It's blue.",
      "notes": "Point at things; students say the thing and its colour."
    },
    {
      "layout": "exercise",
      "ex": "r_jobs",
      "notes": "Handout exercise 6."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 2",
      "title": "A class photo",
      "listen": 1,
      "text": "Two friends look at a class photo.\nListen: true or false? (handout exercise 7)",
      "tips": [
        "Who is it?",
        "Where from? What job?",
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
      "title": "One pen, two pens",
      "boxes": [
        {
          "head": "➕ Plurals",
          "body": "pens · boxes\ncities · dictionaries"
        },
        {
          "head": "🧑‍🤝‍🧑 Special",
          "body": "men · women\nchildren · people"
        },
        {
          "head": "👉 this / these",
          "body": "near: this, these\nfar: that, those"
        }
      ],
      "foot": "What are these? — They're pencils.",
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
      "title": "An apple, the apple",
      "boxes": [
        {
          "head": "🍎 a / an",
          "body": "a pen · an apple\nan old bag"
        },
        {
          "head": "👉 the",
          "body": "a cat → the cat\nOpen the door."
        },
        {
          "head": "🧑‍⚕️ Jobs",
          "body": "He's a pilot.\nShe's an engineer."
        }
      ],
      "foot": "First time: a / an · Second time: the",
      "notes": "Draw something; students say \"a …\" then \"the …\"."
    },
    {
      "layout": "exercise",
      "ex": "r_athe",
      "notes": "Handout exercise 10."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "LISTENING 3",
      "title": "At the school shop",
      "listen": 2,
      "text": "A girl buys things at the school shop.\nListen and circle the right answer (handout exercise 11).",
      "tips": [
        "How many? What colour?",
        "How much?",
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
          "wrong": "She are my sister.",
          "right": "She is my sister."
        },
        {
          "wrong": "two childs",
          "right": "two children"
        },
        {
          "wrong": "He is doctor.",
          "right": "He is a doctor."
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
      "text": "Hi Jack! My name's Sophie and I'm your new e-friend! I'm twelve and I'm from Paris, in France, so I'm French.\n\nMy mum is a teacher and my dad is an engineer. My favourite colour is green.\n\nIn my school bag there are three notebooks, a green pencil case and an English dictionary. It's old, but it's good!\n\nMy best friend is Chloe. That's C-H-L-O-E. She isn't French, she's Italian. Write soon! Sophie",
      "tips": [
        "Name · age · country · family · school bag",
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
      "notes": "Handout exercise 13: students walk and ask.",
      "minutes": 8
    },
    {
      "layout": "exercise",
      "ex": "reply",
      "notes": "Handout exercise 14: exam practice for the writing part.",
      "minutes": 10
    },
    {
      "layout": "list",
      "tag": "THE EXAM",
      "title": "What is in Sunday exam #1?",
      "rows": [
        {
          "emoji": "📱",
          "text": "Online (your phone, with your ID): grammar · listening · reading"
        },
        {
          "emoji": "📝",
          "text": "Grammar: be, plurals, this / these, a / an / the"
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
      "notes": "Handout exercise 15: the big team quiz."
    },
    {
      "layout": "finish",
      "title": "Well done!",
      "rows": [
        "I can spell, count and say where I'm from",
        "I can talk about me, my things and jobs",
        "I can use the grammar of Block 1",
        "I'm ready for the exam!"
      ],
      "foot": "Homework: the review test 📲 (30 questions), then the exam!",
      "notes": "Send the review test link now (Course → Review test → Copy the link)."
    }
  ],
  listen: [
    {
      "label": "Listening 1 — A new member at the sports club",
      "src": "audio/course/c1review-listening-1.mp3",
      "text": "Hello! Welcome to the sports club. What's your name? Hi. My name's Oliver Thompson. How do you spell Thompson? That's T, H, O, M, P, S, O, N. Thanks. How old are you, Oliver? I'm thirteen. And where are you from? I'm from Canada. OK. Can I have your phone number? Sure. It's oh seven eight, three double six, nine one four. And what's your favourite colour? My favourite colour is blue. My bag is blue, too! Great. See you on Monday, then!",
      "script": "Narrator: Listening one. A new member at the sports club. Listen and complete.\nA: Hello! Welcome to the sports club. What's your name?\nB: Hi. My name's Oliver Thompson.\nA: How do you spell Thompson?\nB: That's T, H, O, M, P, S, O, N.\nA: Thanks. How old are you, Oliver?\nB: I'm thirteen.\nA: And where are you from?\nB: I'm from Canada.\nA: OK. Can I have your phone number?\nB: Sure. It's oh seven eight, three double six, nine one four.\nA: And what's your favourite colour?\nB: My favourite colour is blue. My bag is blue, too!\nA: Great. See you on Monday, then!"
    },
    {
      "label": "Listening 2 — A class photo",
      "src": "audio/course/c1review-listening-2.mp3",
      "text": "Daniel, is this your class photo? Yes, it is. Look, this is our teacher, Mr Brown. He's from Scotland. And who are these two girls? They're my friends, Emma and Lucy. They aren't in my class now. Who is the boy with the green bag? That's Jack. His mum is a doctor and his dad is a pilot. And where are you in the photo? I'm here, next to the window. Look, I've got a red jumper.",
      "script": "Narrator: Listening two. Two friends look at a class photo. True or false?\nA: Daniel, is this your class photo?\nB: Yes, it is. Look, this is our teacher, Mr Brown. He's from Scotland.\nA: And who are these two girls?\nB: They're my friends, Emma and Lucy. They aren't in my class now.\nA: Who is the boy with the green bag?\nB: That's Jack. His mum is a doctor and his dad is a pilot.\nA: And where are you in the photo?\nB: I'm here, next to the window. Look, I've got a red jumper."
    },
    {
      "label": "Listening 3 — At the school shop",
      "src": "audio/course/c1review-listening-3.mp3",
      "text": "Good morning! What would you like? Hello. I would like three pencils, please. Blue ones. Here you are, three blue pencils. Anything else? Yes, please. Can I have an eraser, too? Sorry, there are no erasers today. But we have got notebooks and rulers. OK. Then I would like two notebooks, please. Two notebooks. That's six pounds, please. Six pounds. Here you are. Thank you!",
      "script": "Narrator: Listening three. At the school shop. Circle the right answer.\nA: Good morning! What would you like?\nB: Hello. I would like three pencils, please. Blue ones.\nA: Here you are, three blue pencils. Anything else?\nB: Yes, please. Can I have an eraser, too?\nA: Sorry, there are no erasers today. But we have got notebooks and rulers.\nB: OK. Then I would like two notebooks, please.\nA: Two notebooks. That's six pounds, please.\nB: Six pounds. Here you are. Thank you!"
    }
  ],
  teacherScript: [
    "Play each listening twice. The full scripts are below. The review test (30 questions) is good exam practice: send its link at the end."
  ],
  test: [
    {
      "q": "15 = _____",
      "a": "fifteen",
      "wrong": [
        "fifty",
        "five",
        "sixteen"
      ]
    },
    {
      "q": "The letter after K is _____.",
      "a": "L",
      "wrong": [
        "J",
        "M",
        "N"
      ]
    },
    {
      "q": "How do you _____ it? — A-N-N-A.",
      "a": "spell",
      "wrong": [
        "speak",
        "tell",
        "name"
      ]
    },
    {
      "q": "8 + 9 = _____",
      "a": "seventeen",
      "wrong": [
        "seventy",
        "sixteen",
        "eighteen"
      ]
    },
    {
      "q": "90 = _____",
      "a": "ninety",
      "wrong": [
        "nineteen",
        "ninty",
        "nine"
      ]
    },
    {
      "q": "She's from the UK. She's _____.",
      "a": "British",
      "wrong": [
        "UK",
        "Britain",
        "Britanish"
      ]
    },
    {
      "q": "She _____ my friend.",
      "a": "is",
      "wrong": [
        "am",
        "are",
        "be"
      ]
    },
    {
      "q": "Is he Turkish? — No, he _____.",
      "a": "isn't",
      "wrong": [
        "aren't",
        "not",
        "don't"
      ]
    },
    {
      "q": "What's your _____? — My name is Lucy.",
      "a": "name",
      "wrong": [
        "from",
        "country",
        "old"
      ]
    },
    {
      "q": "Ana is from Spain. _____ Spanish.",
      "a": "She's",
      "wrong": [
        "He's",
        "I'm",
        "They're"
      ]
    },
    {
      "q": "_____ he your brother? — Yes, he is.",
      "a": "Is",
      "wrong": [
        "Are",
        "Am",
        "Be"
      ]
    },
    {
      "q": "we are = _____",
      "a": "we're",
      "wrong": [
        "we's",
        "were",
        "we'm"
      ]
    },
    {
      "q": "You sit on a _____.",
      "a": "chair",
      "wrong": [
        "board",
        "ruler",
        "pencil"
      ]
    },
    {
      "q": "Grass is _____.",
      "a": "green",
      "wrong": [
        "blue",
        "red",
        "black"
      ]
    },
    {
      "q": "black + white = _____",
      "a": "grey",
      "wrong": [
        "pink",
        "brown",
        "orange"
      ]
    },
    {
      "q": "A _____ works in a hospital.",
      "a": "doctor",
      "wrong": [
        "farmer",
        "pilot",
        "cook"
      ]
    },
    {
      "q": "A farmer works on a _____.",
      "a": "farm",
      "wrong": [
        "plane",
        "shop",
        "school"
      ]
    },
    {
      "q": "My mum is _____. (job)",
      "a": "a nurse",
      "wrong": [
        "nurse",
        "an nurse",
        "the nurses"
      ]
    },
    {
      "q": "one child, three _____",
      "a": "children",
      "wrong": [
        "childs",
        "childrens",
        "childes"
      ]
    },
    {
      "q": "_____ is my pen. (here, in my hand)",
      "a": "This",
      "wrong": [
        "These",
        "Those",
        "They"
      ]
    },
    {
      "q": "_____ birds in the sky are beautiful. (far away)",
      "a": "Those",
      "wrong": [
        "That",
        "This",
        "These is"
      ]
    },
    {
      "q": "one baby, two _____",
      "a": "babies",
      "wrong": [
        "babys",
        "babyes",
        "baby"
      ]
    },
    {
      "q": "one foot, two _____",
      "a": "feet",
      "wrong": [
        "foots",
        "feets",
        "footes"
      ]
    },
    {
      "q": "one boy, two _____",
      "a": "boys",
      "wrong": [
        "boies",
        "boyes",
        "boy"
      ]
    },
    {
      "q": "_____ pencil",
      "a": "a",
      "wrong": [
        "an",
        "two a",
        "an a"
      ]
    },
    {
      "q": "_____ orange",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "q": "She's _____ engineer.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "q": "Open _____ door, please.",
      "a": "the",
      "wrong": [
        "an",
        "two",
        "these"
      ]
    },
    {
      "q": "Is there _____ eraser in your bag?",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    },
    {
      "q": "I want _____ egg sandwich.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "these"
      ]
    }
  ]
};

/* ---------- Block 1: Sunday exam #1 ---------- */
// Beginner exam (teacher): grammar, listening, reading online (one Test link, kept in order) + writing on paper. 3 recordings × 5 questions.
COURSE_BEGINNER.blocks[0].exam = {
  "title": "Sunday exam #1",
  "emoji": "🏁",
  "skills": [
    "listening",
    "reading",
    "writing"
  ],
  "keepOrder": true,
  "intro": "Grammar, listening and reading are one online test (students open the link and enter their ID; it's marked automatically): 10 grammar + 15 listening (3 recordings × 5 questions) + 10 reading = 35. Writing is on paper: you mark it out of 10 and type the marks below. Total: 35 + 10 = 45.",
  "writing": {
    "max": 10
  },
  "listen": [
    {
      "label": "Part 2 — Recording 1: Jennifer (questions 11–15)",
      "src": "audio/course/c1exam-listening-1.mp3",
      "text": "Hello! My name is Jennifer. That's J, E, double N, I, F, E, R. I'm fourteen years old, and I'm from the UK. If you want to call me, my phone number is oh nine three, four four seven, two oh eight. Oh, and my favourite colour is purple.",
      "script": "Narrator: Recording one. Questions eleven to fifteen. Listen to Jennifer.\nA: Hello! My name is Jennifer.\nA: That's J, E, double N, I, F, E, R.\nA: I'm fourteen years old, and I'm from the UK.\nA: If you want to call me, my phone number is oh nine three, four four seven, two oh eight.\nA: Oh, and my favourite colour is purple."
    },
    {
      "label": "Part 2 — Recording 2: Daniel (questions 16–20)",
      "src": "audio/course/c1exam-listening-2.mp3",
      "text": "Hi, I'm Daniel. I'm from Germany, so I'm German. I've got two sisters, Anna and Lisa. My mum is a teacher and my dad is a pilot. My school bag is blue. There's a dictionary in my bag, and two pens.",
      "script": "Narrator: Recording two. Questions sixteen to twenty. Listen to Daniel.\nA: Hi, I'm Daniel. I'm from Germany, so I'm German.\nA: I've got two sisters, Anna and Lisa.\nA: My mum is a teacher and my dad is a pilot.\nA: My school bag is blue. There's a dictionary in my bag, and two pens."
    },
    {
      "label": "Part 2 — Recording 3: At the school shop (questions 21–25)",
      "src": "audio/course/c1exam-listening-3.mp3",
      "text": "Hello! What would you like? Hi! How much are the notebooks? The notebooks are two pounds each. OK, one notebook, please. And I would like three red pens. Three red pens. Here you are. Have you got English dictionaries? Yes, we have. The dictionaries are twelve pounds. That's a lot! It's OK, my brother has got a dictionary. No problem. Can I have your phone number for the school card? Sure. It's oh seven seven, five one two, three nine oh.",
      "script": "Narrator: Recording three. Questions twenty-one to twenty-five. Lucy is at the school shop.\nA: Hello! What would you like?\nB: Hi! How much are the notebooks?\nA: The notebooks are two pounds each.\nB: OK, one notebook, please. And I would like three red pens.\nA: Three red pens. Here you are.\nB: Have you got English dictionaries?\nA: Yes, we have. The dictionaries are twelve pounds.\nB: That's a lot! It's OK, my brother has got a dictionary.\nA: No problem. Can I have your phone number for the school card?\nB: Sure. It's oh seven seven, five one two, three nine oh."
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
        "have"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 2. _____ you from Canada? — Yes, I am.",
      "a": "Are",
      "wrong": [
        "Is",
        "Am",
        "Do"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 3. Tom and Ben _____ at school today. They're at home.",
      "a": "aren't",
      "wrong": [
        "isn't",
        "not",
        "am not"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 4. Is he Spanish? — No, he _____.",
      "a": "isn't",
      "wrong": [
        "aren't",
        "not",
        "is"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 5. one box, two _____",
      "a": "boxes",
      "wrong": [
        "boxs",
        "boxies",
        "box"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 6. one woman, three _____",
      "a": "women",
      "wrong": [
        "womans",
        "womens",
        "woman"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 7. _____ are my friends over there. (far)",
      "a": "Those",
      "wrong": [
        "That",
        "This",
        "These is"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 8. I've got _____ orange.",
      "a": "an",
      "wrong": [
        "a",
        "two",
        "the an"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 9. My dad is _____ pilot.",
      "a": "a",
      "wrong": [
        "an",
        "the an",
        "two"
      ]
    },
    {
      "part": "grammar",
      "q": "Grammar 10. I've got a cat. _____ cat is white.",
      "a": "The",
      "wrong": [
        "A",
        "An",
        "Two"
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
      "q": "Listening 14. Her favourite colour is _____.",
      "a": "purple",
      "wrong": [
        "pink",
        "blue",
        "grey"
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
        "dogs"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 18. Daniel's dad is _____.",
      "a": "a pilot",
      "wrong": [
        "a teacher",
        "a doctor",
        "an engineer"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 19. His school bag is _____.",
      "a": "blue",
      "wrong": [
        "black",
        "green",
        "red"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 20. In his bag there is a _____.",
      "a": "dictionary",
      "wrong": [
        "ruler",
        "phone",
        "apple"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 21. The notebooks are _____ pounds each.",
      "a": "2",
      "wrong": [
        "3",
        "12",
        "20"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 22. Lucy wants three _____ pens.",
      "a": "red",
      "wrong": [
        "blue",
        "black",
        "green"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 23. The dictionaries are _____ pounds.",
      "a": "12",
      "wrong": [
        "20",
        "2",
        "15"
      ]
    },
    {
      "part": "listening",
      "q": "Listening 24. Lucy's _____ has got a dictionary.",
      "a": "brother",
      "wrong": [
        "sister",
        "mum",
        "friend"
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
        "20"
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
      "q": "Reading 28. Amy's mum is _____.",
      "a": "a doctor",
      "wrong": [
        "an engineer",
        "a teacher",
        "a pilot"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 29. Her dad is _____.",
      "a": "an engineer",
      "wrong": [
        "a doctor",
        "a cook",
        "a farmer"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 30. Sam is _____.",
      "a": "nine",
      "wrong": [
        "fifteen",
        "twelve",
        "nineteen"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 31. Ben and Sam _____ at Amy's school.",
      "a": "aren't",
      "wrong": [
        "are",
        "is",
        "am"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 32. Amy's favourite colour is _____.",
      "a": "purple",
      "wrong": [
        "pink",
        "blue",
        "green"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 33. Her pencil case is _____.",
      "a": "purple",
      "wrong": [
        "red",
        "black",
        "yellow"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 34. In her bag there are four _____.",
      "a": "notebooks",
      "wrong": [
        "pens",
        "dictionaries",
        "books"
      ]
    },
    {
      "part": "reading",
      "q": "Reading 35. The old dictionary is her _____.",
      "a": "dad's",
      "wrong": [
        "mum's",
        "brother's",
        "teacher's"
      ]
    }
  ],
  "handout": {
    "title": "Sunday exam #1 — paper",
    "sections": [
      {
        "skill": "reading",
        "title": "Part 3: Read the text. Answer questions 26–35 on your phone.",
        "text": "Hello! My name is Amy and I'm twelve years old. I'm from Bristol, in the UK. My mum is a doctor and my dad is an engineer. I've got two brothers. Their names are Ben and Sam. Ben is fifteen and Sam is nine. They aren't at my school. My favourite colour is purple, so I've got a purple pencil case! In my school bag there are four notebooks, three pens and an old dictionary. The dictionary is my dad's."
      },
      {
        "skill": "writing",
        "title": "Part 4: Write about yourself (40–60 words). Your name and age, where you are from, your family and their jobs, your favourite colour, what is in your school bag.",
        "text": "________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n________________________________________________\n"
      }
    ],
    "teacherScript": [
      "Part 2: press 🔊 on each recording's slide and play it TWICE. Recording 1 → questions 11–15, recording 2 → 16–20, recording 3 → 21–25."
    ],
    "answers": [
      "Online part (35) is marked automatically.",
      "Writing (10): task: all five points (name/age, country, family and jobs, favourite colour, school bag) (4) · grammar: am/is/are, a/an, plurals (3) · words: enough and right (2) · spelling and capital letters (1)."
    ]
  },
  "teacherScript": [
    "Part 2: press 🔊 on each recording's slide and play it TWICE. Recording 1 → questions 11–15, recording 2 → 16–20, recording 3 → 21–25."
  ],
  "deck": [
    {
      "layout": "title",
      "notes": "Sunday exam #1 (about 60 minutes). Before: phones charged, the exam paper printed, the online part's link copied (Course → Online part → Copy the link)."
    },
    {
      "layout": "list",
      "tag": "THE EXAM",
      "title": "Sunday exam #1: how it works",
      "rows": [
        {
          "emoji": "📱",
          "text": "Open the link on your phone and enter your ID"
        },
        {
          "emoji": "📝",
          "text": "Part 1: Grammar, questions 1–10"
        },
        {
          "emoji": "🎧",
          "text": "Part 2: Listening, questions 11–25 (3 recordings, two times each)"
        },
        {
          "emoji": "📖",
          "text": "Part 3: Reading, questions 26–35 (the text is on your paper)"
        },
        {
          "emoji": "✍️",
          "text": "Part 4: Writing, on paper"
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
          "body": "Wait for the listening.\nDon't talk, thank you!"
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
        "Age · phone · colour · country"
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
        "Nationality · family · jobs",
        "His bag"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "skill",
      "skill": "listening",
      "tag": "PART 2 · LISTENING",
      "title": "Recording 3 — At the school shop",
      "listen": 2,
      "text": "Questions 21–25.\nLucy buys things at the school shop.\nYou hear the recording two times.",
      "tips": [
        "How much? How many?",
        "Phone number"
      ],
      "notes": "Play twice."
    },
    {
      "layout": "skill",
      "skill": "reading",
      "tag": "READING",
      "title": "Part 3: Reading, questions 26–35",
      "text": "Hello! My name is Amy and I'm twelve years old. I'm from Bristol, in the UK. My mum is a doctor and my dad is an engineer. I've got two brothers. Their names are Ben and Sam. Ben is fifteen and Sam is nine. They aren't at my school. My favourite colour is purple, so I've got a purple pencil case! In my school bag there are four notebooks, three pens and an old dictionary. The dictionary is my dad's.",
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
      "text": "Write about yourself, 40 to 60 words:\n• your name and age · where you are from\n• your family and their jobs\n• your favourite colour\n• what is in your school bag",
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
