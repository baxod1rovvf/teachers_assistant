// Skills course: the content of every step (2026-11-05: 20 steps — Beginner b1…b10 = Steps 1–10, then Elementary
// e1…e10 = Steps 11–20; e1…e10 were "Level 1…10" before, and old links ?lv=N open eN). Four skills each.
// Read by the student page (skill.html) and by Loom's Course tab. English names and places only (the teacher's rule; the teacher's own Listening Journey has a few others).
// A step: { id (stable: kept in links, ta_skills_links keys and results), no (its shown number = position),
//   stage: 'Beginner' | 'Elementary', theme, emoji, listening?, reading?, writing?, speaking? }.
//
// listening: the teacher's Listening Journey (2026-11-10) — made by tools/build-listenings.js (never edit it here): src = the
//   recording (audio/skills/listen-step-N.mp3, made with tools/make-course-audio.py from audio/skills/listening-journey-scripts.json),
//   questions[i] = { type: choose | tf | gap | open, q, a (accepted answers, the first is shown as right), opts?, keys? (open), sec
//   (the heading of its group) }, transcript[] = { who, man, text, answers: the question numbers answered in that paragraph }.
// reading: text = sentences; `line` is a sentence's index when the text is split with /(?<=[.!?])\s+/
//   (a blank line between paragraphs is fine). Question types: tfng ('True' / 'False' / 'Not given'), tf ('True' /
//   'False' — beginner steps), gap, choose (answers are the option's own text). Any number of questions.
// speaking: questions[i] = { q, use: words the student can use }. Nothing is recorded or sent.
// A step without any of the four skills is "Coming soon".

var TA_SKILLS = {
  steps: [
    {
      id: 'b1', no: 1, stage: 'Beginner', theme: 'Daily Routine', emoji: '⏰',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-1.mp3?v=1",
        title: "A Student's Daily Routine",
        intro: "Listen to Daniel talking about his day. Then answer the 10 questions.",
        questions: [
          {"type":"choose","q":"What time does Daniel usually wake up?","opts":["6:30","7:00","7:30"],"a":["7:00"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How does Daniel usually travel to school?","opts":["By bus","By car","On foot"],"a":["On foot"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is Daniel's favourite subject?","opts":["English","Mathematics","History"],"a":["English"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time does school finish?","opts":["12:30","2:00","2:30"],"a":["2:30"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does Daniel sometimes do before going to bed?","opts":["Plays football","Reads a book","Watches a film"],"a":["Reads a book"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"Daniel usually has cereal with milk for breakfast.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"His school is about fifteen minutes away on foot.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Daniel finds mathematics easier than English.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"He usually does his homework after taking a short rest.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Daniel prepares his school bag in the evening.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Daniel","man":true,"text":"Hello! My name is Daniel, and I'm a student. Today, I'm going to tell you about my daily routine.","answers":[]},
          {"who":"Daniel","man":true,"text":"On weekdays, I usually wake up at seven o'clock. I don't like getting up early, especially when the weather is cold, but I have to get ready for school. First, I wash my face and brush my teeth. Then I get dressed and go to the kitchen. My mother usually prepares breakfast for the family. I normally have eggs, bread, and tea. Sometimes I eat cereal with milk if I don't have much time.","answers":[1,6]},
          {"who":"Daniel","man":true,"text":"I leave home at about half past seven. My school is not very far away, so I usually walk there. It takes around fifteen minutes. I like walking because I can get some fresh air before my lessons start. If it rains, my father sometimes drives me to school.","answers":[2,7]},
          {"who":"Daniel","man":true,"text":"Lessons begin at eight o'clock. I study different subjects, including English, mathematics, history, and science. English is my favourite subject because I enjoy learning new words and speaking with my classmates. Mathematics is a little more difficult for me, but I try to practise it every day.","answers":[3,8]},
          {"who":"Daniel","man":true,"text":"We have a short break at ten thirty. I usually talk to my friends or buy something small to eat. Our lunch break is at twelve thirty. I often bring a sandwich and some fruit from home, but sometimes I eat lunch in the school cafeteria.","answers":[]},
          {"who":"Daniel","man":true,"text":"School finishes at two thirty. When I get home, I have lunch if I'm hungry and then take a short rest. After that, I do my homework. I usually spend about one hour on it, but some days I need more time.","answers":[4,9]},
          {"who":"Daniel","man":true,"text":"In the evening, I like listening to music, watching videos, or playing computer games. I also help my parents with small jobs around the house. For example, I sometimes wash the dishes or tidy my room.","answers":[]},
          {"who":"Daniel","man":true,"text":"We usually have dinner together at seven thirty. After dinner, I prepare my school bag and choose my clothes for the next day. I don't want to do these things in the morning because I'm often in a hurry.","answers":[10]},
          {"who":"Daniel","man":true,"text":"Before going to bed, I sometimes read a few pages of a book. I usually go to bed at ten thirty. I know that getting enough sleep is important, so I try not to stay up late.","answers":[5]},
          {"who":"Daniel","man":true,"text":"That's my usual weekday. My weekends are quite different because I don't have to go to school.","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b2', no: 2, stage: 'Beginner', theme: 'Family', emoji: '👨‍👩‍👧',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-2.mp3?v=1",
        title: "A Family Conversation",
        intro: "Listen to two friends, Emma and Jack, talking about their families. Then answer the 10 questions.",
        questions: [
          {"type":"choose","q":"How many people are in Jack's family?","opts":["Four","Five","Six"],"a":["Five"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How old is Jack's younger brother?","opts":["Eight","Ten","Thirteen"],"a":["Eight"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does Jack's father do?","opts":["He is a teacher.","He is an engineer.","He is a doctor."],"a":["He is an engineer."],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Who helps Jack with mathematics?","opts":["His mother","His father","His sister"],"a":["His sister"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"Jack's grandparents live in the same house.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Emma shares a bedroom with her younger sister.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Jack's father enjoys cooking.","a":["True"],"sec":"True or False?"},
          {"type":"gap","q":"Jack's mother works at a _____ school.","a":["primary","primary school"],"sec":"Complete the sentences. Write ONE word."},
          {"type":"gap","q":"Jack's grandmother made chicken _____ for lunch.","a":["soup"],"sec":"Complete the sentences. Write ONE word."},
          {"type":"gap","q":"Emma decides to call her grandparents in the _____.","a":["evening"],"sec":"Complete the sentences. Write ONE word."}
        ],
        transcript: [
          {"who":"Emma","man":false,"text":"Hi, Jack! How was your weekend?","answers":[]},
          {"who":"Jack","man":true,"text":"It was great, thanks. I spent most of it with my family. We had a small family lunch on Sunday.","answers":[]},
          {"who":"Emma","man":false,"text":"That sounds nice. How many people are there in your family?","answers":[]},
          {"who":"Jack","man":true,"text":"There are five of us: my parents, my older sister, my younger brother, and me. My grandparents live in another town, but they visit us quite often.","answers":[1,5]},
          {"who":"Emma","man":false,"text":"Do you get along well with your brother and sister?","answers":[]},
          {"who":"Jack","man":true,"text":"Most of the time! My sister is twenty, so she's older than me by three years. She's quite responsible and always helps me with my studies. My younger brother is only eight. He's funny and energetic, but sometimes he makes a lot of noise.","answers":[2]},
          {"who":"Emma","man":false,"text":"I have a younger sister too. She's ten, and we share a bedroom. Sometimes we argue because she takes my things without asking.","answers":[6]},
          {"who":"Jack","man":true,"text":"I understand that! My brother sometimes uses my headphones. I tell him to ask me first, but he forgets.","answers":[]},
          {"who":"Emma","man":false,"text":"What do your parents do?","answers":[]},
          {"who":"Jack","man":true,"text":"My father is an engineer. He works in an office and usually comes home at six. My mother is a teacher. She works at a primary school not far from our house.","answers":[3,8]},
          {"who":"Emma","man":false,"text":"Does your mother help you with your homework?","answers":[]},
          {"who":"Jack","man":true,"text":"Sometimes, especially with English. But my sister is better at mathematics, so I usually ask her for help with that subject.","answers":[4]},
          {"who":"Emma","man":false,"text":"What do you usually do together as a family?","answers":[]},
          {"who":"Jack","man":true,"text":"We often have dinner together. At weekends, we sometimes watch a film or visit my grandparents. My father also enjoys cooking, so he prepares special meals on Sundays.","answers":[7]},
          {"who":"Emma","man":false,"text":"What did you do at your family lunch yesterday?","answers":[]},
          {"who":"Jack","man":true,"text":"My grandmother made her famous chicken soup, and my father prepared a big dish of plov. We also had a salad and some fruit. After lunch, we sat in the garden and talked.","answers":[9]},
          {"who":"Emma","man":false,"text":"That sounds lovely. I don't see my grandparents very often because they live far away.","answers":[]},
          {"who":"Jack","man":true,"text":"You should call them more often. My grandmother really enjoys talking on the phone. She always asks me about school and my friends.","answers":[]},
          {"who":"Emma","man":false,"text":"You're right. I'll call them this evening.","answers":[10]},
          {"who":"Jack","man":true,"text":"That's a good idea. Family is important, even when everyone is busy.","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b3', no: 3, stage: 'Beginner', theme: 'Home & Living', emoji: '🏠',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-3.mp3?v=1",
        title: "Finding a New House",
        intro: "Listen to Michael talking to an estate agent about a house to rent. Then answer the 10 questions.",
        questions: [
          {"type":"choose","q":"How many bedrooms does Michael want?","opts":["Two","Three","Four"],"a":["Three"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is Michael's preferred monthly budget?","opts":["$700","$750","$800"],"a":["$800"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does the first house have instead of a garden?","opts":["A balcony","A garage","A swimming pool"],"a":["A balcony"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How long does it take to travel from the second house to the city centre by bus?","opts":["5 minutes","10 minutes","20 minutes"],"a":["20 minutes"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"The first house is in a quiet neighbourhood.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The second house has two bathrooms.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Electricity is included in the second house's rent.","a":["False"],"sec":"True or False?"},
          {"type":"gap","q":"The second house has a lovely _____.","a":["garden"],"sec":"Complete the notes. Write ONE word."},
          {"type":"gap","q":"The nearest supermarket is about five minutes away on _____.","a":["foot"],"sec":"Complete the notes. Write ONE word."},
          {"type":"gap","q":"Michael will visit the house on _____ at four o'clock.","a":["Thursday"],"sec":"Complete the notes. Write ONE word."}
        ],
        transcript: [
          {"who":"Agent","man":false,"text":"Good morning. Welcome to Green Homes. How can I help you?","answers":[]},
          {"who":"Michael","man":false,"text":"Good morning. I'm looking for a house to rent. My family and I want to move next month.","answers":[]},
          {"who":"Agent","man":false,"text":"Of course. How many bedrooms do you need?","answers":[]},
          {"who":"Michael","man":true,"text":"Three bedrooms would be perfect. We have two children, and they need their own space. We would also like a small garden.","answers":[1]},
          {"who":"Agent","man":false,"text":"I see. Do you have a monthly budget?","answers":[]},
          {"who":"Michael","man":true,"text":"We'd prefer to pay around eight hundred dollars a month. We could pay a little more for the right house, but we don't want anything too expensive.","answers":[2]},
          {"who":"Agent","man":false,"text":"I have two possible houses. The first one is in the city centre. It has three bedrooms, a large kitchen, and a comfortable living room. There is a supermarket across the street, and the bus stop is only two minutes away.","answers":[5]},
          {"who":"Michael","man":true,"text":"That sounds convenient. Does it have a garden?","answers":[]},
          {"who":"Agent","man":false,"text":"Unfortunately, no. It has a small balcony instead. The rent is seven hundred and fifty dollars per month.","answers":[3]},
          {"who":"Michael","man":true,"text":"Hmm. We really want a garden because our children enjoy playing outside. What about the second house?","answers":[]},
          {"who":"Agent","man":false,"text":"The second house is in a quieter neighbourhood, about twenty minutes from the city centre by bus. It has three bedrooms, two bathrooms, and a lovely garden. There is also a small park nearby.","answers":[4,6,8]},
          {"who":"Michael","man":true,"text":"That sounds much better. Is there a supermarket in the area?","answers":[]},
          {"who":"Agent","man":false,"text":"Yes. There is one about five minutes away on foot. There is also a primary school near the park.","answers":[9]},
          {"who":"Michael","man":true,"text":"Excellent. How much is the rent?","answers":[]},
          {"who":"Agent","man":false,"text":"Eight hundred and twenty dollars per month. Water and heating are included, but electricity is not.","answers":[7]},
          {"who":"Michael","man":true,"text":"That's a little above our budget, but it might be possible. Is the house furnished?","answers":[]},
          {"who":"Agent","man":false,"text":"It has a sofa, a dining table, and some kitchen cupboards. However, there are no beds or wardrobes.","answers":[]},
          {"who":"Michael","man":true,"text":"That's fine. We have our own beds. Can we visit the house this week?","answers":[]},
          {"who":"Agent","man":false,"text":"Certainly. I have an appointment available on Thursday at four in the afternoon.","answers":[]},
          {"who":"Michael","man":true,"text":"Thursday at four works for me. I'll come with my wife.","answers":[10]},
          {"who":"Agent","man":false,"text":"Great. Could I have your phone number so I can confirm the appointment?","answers":[]},
          {"who":"Michael","man":false,"text":"Of course. I'll give it to you now.","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b4', no: 4, stage: 'Beginner', theme: 'Food & Meals', emoji: '🍽️',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-4.mp3?v=1",
        title: "Food Around the World",
        intro: "Listen to a short talk about food around the world. Then answer the 11 questions.",
        questions: [
          {"type":"choose","q":"Which two dishes are especially popular in Italy?","opts":["Sushi and soup","Pizza and pasta","Tacos and curry"],"a":["Pizza and pasta"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is an important part of Japanese food?","opts":["Rice","Potatoes","Bread"],"a":["Rice"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What do people use to make some Mexican dishes spicy?","opts":["Cheese","Peppers","Olive oil"],"a":["Peppers"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Which Indian food is mentioned in the talk?","opts":["Curry","Plov","Somsa"],"a":["Curry"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"Italian families often enjoy eating together at weekends.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"All Japanese sushi contains meat.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Vegetarian food is common in many parts of India.","a":["True"],"sec":"True or False?"},
          {"type":"gap","q":"Uzbek plov is usually made with rice, meat, carrots, onions and _____.","a":["oil"],"sec":"Complete the sentences. Write ONE word."},
          {"type":"gap","q":"People often prepare plov for family _____.","a":["celebrations","celebration"],"sec":"Complete the sentences. Write ONE word."},
          {"type":"gap","q":"Tacos are made with small _____.","a":["tortillas","tortilla"],"sec":"Complete the sentences. Write ONE word."},
          {"type":"gap","q":"Food can bring people _____.","a":["together"],"sec":"Complete the sentences. Write ONE word."}
        ],
        transcript: [
          {"who":"Speaker","man":false,"text":"Hello, everyone! Today, we're going to talk about food around the world. Food is an important part of every culture. People in different countries eat different meals, use different ingredients, and have their own cooking traditions.","answers":[]},
          {"who":"Speaker","man":false,"text":"Let's start with Italy. Italian food is famous in many countries. Pizza and pasta are two of the most popular dishes. Italian people often use tomatoes, cheese, olive oil, and fresh vegetables. Many families enjoy eating together, especially at weekends. A traditional Italian meal can take quite a long time because people like talking while they eat.","answers":[1,5]},
          {"who":"Speaker","man":false,"text":"Now, let's travel to Japan. Rice is an important part of Japanese food. Many people eat rice with fish, vegetables, and soup. Sushi is one of the most famous Japanese dishes. It usually contains rice and fish, although there are different types. Japanese meals are often simple and carefully prepared.","answers":[2,6]},
          {"who":"Speaker","man":false,"text":"In Mexico, food is usually full of flavour. Tacos are very popular. People put meat, vegetables, cheese, or beans inside small tortillas. Some Mexican dishes are spicy because cooks use different kinds of peppers. However, not every Mexican meal is hot. There are also many sweet dishes and desserts.","answers":[3,10]},
          {"who":"Speaker","man":false,"text":"Let's visit India. Indian food is known for its spices. People use ingredients such as rice, potatoes, tomatoes, and different spices. Curry is a popular dish, and there are many different versions. Some people eat meat, while others prefer vegetarian meals. In fact, vegetarian food is very common in many parts of India.","answers":[4,7]},
          {"who":"Speaker","man":false,"text":"Finally, let's talk about Uzbekistan. Uzbek cuisine has a long history and many traditional dishes. Plov is probably the most famous one. It is usually made with rice, meat, carrots, onions, and oil. People often prepare it for family celebrations and special events. Other popular dishes include somsa, manti, and shashlik.","answers":[8,9]},
          {"who":"Speaker","man":false,"text":"Although food is different around the world, it brings people together. Families share meals, friends meet at restaurants, and people celebrate important moments with special dishes.","answers":[11]},
          {"who":"Speaker","man":false,"text":"So, next time you try food from another country, remember that you are also learning something about its culture. Thank you for listening!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b5', no: 5, stage: 'Beginner', theme: 'Free Time', emoji: '🎮',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-5.mp3?v=1",
        title: "Weekend Plans",
        intro: "Listen to two friends, Emma and Daniel, making plans for Saturday. Then answer the 12 questions.",
        questions: [
          {"type":"choose","q":"Why does Emma want to visit different places?","opts":["Her cousin is visiting.","She has a school project.","She wants to buy a camera."],"a":["Her cousin is visiting."],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is Sophie interested in?","opts":["Cooking","Photography","Sports"],"a":["Photography"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How much is a student ticket to the museum?","opts":["$5","$8","$10"],"a":["$5"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How will Emma travel to the meeting place?","opts":["By bus","By bicycle","By taxi"],"a":["By taxi"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Emma","opts":["Wants to take photographs","Will bring a camera","Will come by bicycle"],"a":["Will bring a camera"],"sec":"Match the people with their plans."},
          {"type":"choose","q":"Daniel","opts":["Wants to take photographs","Will bring a camera","Will come by bicycle"],"a":["Will come by bicycle"],"sec":"Match the people with their plans."},
          {"type":"choose","q":"Sophie","opts":["Wants to take photographs","Will bring a camera","Will come by bicycle"],"a":["Wants to take photographs"],"sec":"Match the people with their plans."},
          {"type":"gap","q":"Meeting day: _____","a":["Saturday"],"sec":"Complete the notes."},
          {"type":"gap","q":"Meeting time: _____","a":["10:00","10","ten","ten o'clock","10 o'clock","10.00","10 am","10:00 am","10 a.m."],"sec":"Complete the notes."},
          {"type":"gap","q":"Meeting place: in front of the central _____","a":["library"],"sec":"Complete the notes."},
          {"type":"tf","q":"The Italian restaurant only serves meat dishes.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Daniel suggests meeting at 9:30, but Emma prefers 10:00.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Emma","man":false,"text":"Hi, Daniel! Are you busy this Saturday?","answers":[]},
          {"who":"Daniel","man":true,"text":"Not really. Why are you asking?","answers":[]},
          {"who":"Emma","man":false,"text":"My cousin is visiting us this weekend. I want to show her around the city, but I don't know where to take her.","answers":[1]},
          {"who":"Daniel","man":true,"text":"That's nice! What's her name?","answers":[]},
          {"who":"Emma","man":false,"text":"Her name is Sophie. She's seventeen, and she's really interested in photography. She loves taking pictures of interesting buildings and beautiful places.","answers":[2,7]},
          {"who":"Daniel","man":true,"text":"Then you should take her to the old part of the city. There are some beautiful historical buildings there. The streets are quite narrow, but they look amazing in photographs.","answers":[]},
          {"who":"Emma","man":false,"text":"That's a good idea. Is there anything else we can do?","answers":[]},
          {"who":"Daniel","man":true,"text":"Well, there's a new art exhibition at the city museum. It opened last Monday. My sister went there yesterday, and she said it was really interesting.","answers":[]},
          {"who":"Emma","man":false,"text":"Does it cost much?","answers":[]},
          {"who":"Daniel","man":true,"text":"No, the tickets are quite cheap. I think they're around five dollars for students. Adults pay eight dollars.","answers":[3]},
          {"who":"Emma","man":false,"text":"Perfect! What about lunch? I don't want to spend the whole day walking around without eating anything.","answers":[]},
          {"who":"Daniel","man":true,"text":"There's a small Italian restaurant near the museum. I went there with my family last month. The food was delicious, and the prices were reasonable.","answers":[]},
          {"who":"Emma","man":false,"text":"Does it serve vegetarian food? Sophie doesn't eat meat.","answers":[]},
          {"who":"Daniel","man":true,"text":"Yes, they have several vegetarian dishes. My sister ordered a vegetable pizza, and she really enjoyed it.","answers":[11]},
          {"who":"Emma","man":false,"text":"Great. Maybe we can invite some other friends too.","answers":[]},
          {"who":"Daniel","man":true,"text":"Sure. What about Mark and Lisa? They usually have free time on Saturdays.","answers":[]},
          {"who":"Emma","man":false,"text":"I'll send them a message tonight. By the way, what time should we meet?","answers":[]},
          {"who":"Daniel","man":true,"text":"How about nine thirty in the morning? We can meet in front of the central library.","answers":[10]},
          {"who":"Emma","man":false,"text":"Isn't that a little early? I usually wake up at nine on Saturdays!","answers":[]},
          {"who":"Daniel","man":true,"text":"Come on, Emma! We have a lot to see. But we can make it ten o'clock if you prefer.","answers":[12]},
          {"who":"Emma","man":false,"text":"Ten is much better. I'll probably take a taxi because the bus is always crowded in the morning.","answers":[4,9]},
          {"who":"Daniel","man":true,"text":"I think I'll come by bicycle. The weather forecast says it will be sunny, so it should be a pleasant ride.","answers":[6]},
          {"who":"Emma","man":false,"text":"Excellent. I'll bring my camera, and Sophie can use my old phone to take pictures too.","answers":[5]},
          {"who":"Daniel","man":true,"text":"Sounds like a plan! Don't forget to charge your camera tonight.","answers":[]},
          {"who":"Emma","man":false,"text":"I won't. See you on Saturday!","answers":[8]},
          {"who":"Daniel","man":true,"text":"See you!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b6', no: 6, stage: 'Beginner', theme: 'Friends', emoji: '🤝',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-6.mp3?v=1",
        title: "Two Friends Talking",
        intro: "Listen to two friends, Oliver and Sam, talking about a sports club. Then answer the 13 questions.",
        questions: [
          {"type":"tf","q":"Sam goes to basketball training three times a week.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"There are twenty people in Sam's basketball group.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Sam's coach is unfriendly.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Sam also goes swimming on Sundays.","a":["True"],"sec":"True or False?"},
          {"type":"gap","q":"Each basketball training session lasts about _____ minutes.","a":["90","ninety","90 minutes","ninety minutes"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The club costs _____ dollars per month.","a":["30","thirty","30 dollars","thirty dollars"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Oliver needs to bring comfortable _____.","a":["trainers"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The sports centre is next to the city _____ pool.","a":["swimming","swimming pool"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"choose","q":"What does Sam's group practise?","opts":["Running and cycling","Passing and shooting","Swimming and jumping"],"a":["Passing and shooting"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time does Saturday training start?","opts":["10:00","10:45","11:00"],"a":["11:00"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Why does Sam arrive early?","opts":["To meet his coach","To get ready","To help other students"],"a":["To get ready"],"sec":"Choose the correct answer."},
          {"type":"open","q":"Which bus can Oliver take to reach the sports centre?","keys":["6","six"],"a":["6"],"sec":"Answer the questions."},
          {"type":"open","q":"What does Sam suggest Oliver should do first to become more active?","keys":["one activity","activity"],"a":["one activity"],"sec":"Answer the questions."}
        ],
        transcript: [
          {"who":"Oliver","man":true,"text":"Hey, Sam! I haven't seen you for a few days. How are things?","answers":[]},
          {"who":"Sam","man":true,"text":"Pretty good, thanks. I've been quite busy recently. I've started going to a new sports club.","answers":[]},
          {"who":"Oliver","man":true,"text":"Really? What kind of sport do you do there?","answers":[]},
          {"who":"Sam","man":true,"text":"I play basketball three times a week. I've always liked basketball, but I never had enough time to practise regularly.","answers":[1]},
          {"who":"Oliver","man":true,"text":"That's great! Do you play with your school friends?","answers":[]},
          {"who":"Sam","man":true,"text":"Sometimes. But the club has different groups. My group has twelve people, and most of them are around my age. Our coach is very friendly, but he expects us to work hard.","answers":[2,3]},
          {"who":"Oliver","man":true,"text":"How long are your training sessions?","answers":[]},
          {"who":"Sam","man":true,"text":"About ninety minutes. We usually start with some simple exercises to warm up. Then we practise passing, shooting, and working as a team. At the end, we play a short match.","answers":[5,9]},
          {"who":"Oliver","man":true,"text":"That sounds fun. I used to play basketball when I was younger, but I stopped because I didn't have a good team.","answers":[]},
          {"who":"Sam","man":true,"text":"You should join us! We need one more player for our Saturday group.","answers":[]},
          {"who":"Oliver","man":true,"text":"I'd love to, but I'm not very good at basketball anymore.","answers":[]},
          {"who":"Sam","man":true,"text":"Don't worry about that. Nobody expects you to be perfect. The important thing is to practise and enjoy the game.","answers":[]},
          {"who":"Oliver","man":true,"text":"You're right. How much does the club cost?","answers":[]},
          {"who":"Sam","man":true,"text":"It's thirty dollars a month. You can also pay for three months together, which is a little cheaper.","answers":[6]},
          {"who":"Oliver","man":true,"text":"That's not too expensive. Do I need to bring anything?","answers":[]},
          {"who":"Sam","man":true,"text":"Just sports clothes, comfortable trainers, and a bottle of water. They have basketballs at the club, so you don't need to buy one.","answers":[7]},
          {"who":"Oliver","man":true,"text":"Nice. Where is it?","answers":[]},
          {"who":"Sam","man":true,"text":"It's next to the city swimming pool, about ten minutes from the central bus station. You can take bus number six. It stops right outside the sports centre.","answers":[8,12]},
          {"who":"Oliver","man":true,"text":"I know that area. What time do you train on Saturdays?","answers":[]},
          {"who":"Sam","man":true,"text":"Our session starts at eleven in the morning. But I usually arrive fifteen minutes early because I like to get ready before training.","answers":[10,11]},
          {"who":"Oliver","man":true,"text":"I think I'll come with you this Saturday. Can I watch first?","answers":[]},
          {"who":"Sam","man":true,"text":"Of course! You can watch the first half, and then you can join us if you want.","answers":[]},
          {"who":"Oliver","man":true,"text":"Great. By the way, do you do any other activities?","answers":[]},
          {"who":"Sam","man":true,"text":"I also go swimming on Sundays. It's a good way to relax after a busy week. I used to spend most of my weekends playing computer games, but now I prefer doing something active.","answers":[4]},
          {"who":"Oliver","man":true,"text":"I should probably do the same. I spend too much time sitting at home.","answers":[]},
          {"who":"Sam","man":true,"text":"You don't have to change everything at once. Just start with one activity you enjoy.","answers":[13]},
          {"who":"Oliver","man":true,"text":"Good advice. I'll see you on Saturday, then.","answers":[]},
          {"who":"Sam","man":true,"text":"See you! And don't forget your water bottle!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b7', no: 7, stage: 'Beginner', theme: 'School & Education', emoji: '🏫',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-7.mp3?v=1",
        title: "A School Announcement",
        intro: "Listen to an announcement at a school. Then answer the 13 questions.",
        questions: [
          {"type":"gap","q":"Library opening time: _____","a":["8:30","8.30","eight thirty","half past eight","8:30 am","8:30 a.m.","8.30 am"],"sec":"Complete the notes."},
          {"type":"gap","q":"Maximum number of books: _____","a":["3","three"],"sec":"Complete the notes."},
          {"type":"gap","q":"English club meeting day: _____","a":["Friday"],"sec":"Complete the notes."},
          {"type":"gap","q":"English club room: Room _____","a":["12","twelve","Room 12","Room twelve"],"sec":"Complete the notes."},
          {"type":"tf","q":"The school sports day will take place on Thursday.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Students should bring water to the sports day.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Students need to prepare something before the English club meeting.","a":["False"],"sec":"True or False?"},
          {"type":"choose","q":"Where will the science exhibition take place?","opts":["In the library","In the main hall","In Room 12"],"a":["In the main hall"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time will the science exhibition finish?","opts":["12:00","1:00","3:15"],"a":["1:00"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is not allowed in the exhibition area?","opts":["Notebooks","Cameras","Food and drinks"],"a":["Food and drinks"],"sec":"Choose the correct answer."},
          {"type":"open","q":"Where are the students going on their school trip?","keys":["history museum","museum"],"a":["history museum"],"sec":"Answer the questions."},
          {"type":"open","q":"How long will the bus journey take?","keys":["40","forty"],"a":["40"],"sec":"Answer the questions."},
          {"type":"open","q":"How much does the museum ticket cost?","keys":["4","four"],"a":["4"],"sec":"Answer the questions."}
        ],
        transcript: [
          {"who":"Teacher","man":false,"text":"Good morning, students!","answers":[]},
          {"who":"Teacher","man":false,"text":"I have some important information about activities at our school next week. Please listen carefully and write down anything you need to remember.","answers":[]},
          {"who":"Teacher","man":false,"text":"First, let's talk about the school library. From Monday, the library will open at eight thirty in the morning instead of nine. It will close at four thirty in the afternoon. Students can borrow up to three books at a time. You can keep each book for two weeks. If you need more time, you can ask the librarian to extend the borrowing period.","answers":[1,2]},
          {"who":"Teacher","man":false,"text":"Next, we are organising a school sports day on Wednesday. It will take place on the school playground, starting at ten o'clock. There will be several activities, including football, basketball, volleyball, and running competitions. Students who want to take part should give their names to their class teachers before Tuesday afternoon. Remember to wear comfortable sports clothes and bring a bottle of water.","answers":[5,6]},
          {"who":"Teacher","man":false,"text":"Now, some information about the English club. We have decided to change the meeting day. The club usually meets on Thursday, but next week it will meet on Friday at three fifteen. The meeting will be in Room 12, not Room 8. We will watch a short film and discuss the characters and the story. You don't need to prepare anything before the meeting.","answers":[3,4,7]},
          {"who":"Teacher","man":false,"text":"There is also a science exhibition in the main hall next Thursday. Students from different classes have prepared small projects about animals, plants, and the environment. The exhibition will open at nine in the morning and finish at one o'clock. You can visit it with your classmates during your free lesson. Please remember that food and drinks are not allowed in the exhibition area.","answers":[8,9,10]},
          {"who":"Teacher","man":false,"text":"Finally, I want to remind everyone about the school trip. We are going to the history museum on Friday, the twenty-first of this month. The bus will leave from the school entrance at eight fifteen, so please arrive at least fifteen minutes early. The journey will take about forty minutes. You should bring a packed lunch, a notebook, and a pen. The school will pay for the bus, but students need to bring money for their museum tickets. The ticket costs four dollars.","answers":[11,12,13]},
          {"who":"Teacher","man":false,"text":"If you have any questions about these activities, please speak to your class teacher. Thank you for listening, and have a good day!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b8', no: 8, stage: 'Beginner', theme: 'Hobbies & Sports', emoji: '⚽',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-8.mp3?v=2",
        title: "An Interview About Hobbies",
        intro: "Listen to a radio interview with Olivia about her hobbies. Then answer the 14 questions.",
        questions: [
          {"type":"gap","q":"Olivia's surname: _____","a":["Green"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Olivia started taking photos _____ years ago.","a":["two","2","two years","2 years"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Her first camera was a present from her _____.","a":["uncle"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"She likes taking pictures of birds and _____.","a":["flowers"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The park where she takes photos: _____ Park","a":["Maple","Maple Park"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"When does Olivia usually go to the park?","opts":["Saturday morning","Sunday afternoon","Friday evening"],"a":["Saturday morning"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Why does she go then?","opts":["Her friends are there","It's quiet","The light is better"],"a":["It's quiet"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does Olivia usually bake with her grandmother?","opts":["Bread","Biscuits","Pizza"],"a":["Biscuits"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Where do they find their recipes?","opts":["On a website","In an old notebook","In a magazine"],"a":["In an old notebook"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"Olivia made a chocolate cake for her best friend's birthday.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"On weekdays, Olivia does her homework before her hobbies.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The competition is only for adults.","a":["False"],"sec":"True or False?"},
          {"type":"gap","q":"The last day to send photos: the _____ of May","a":["15th","15","fifteenth"],"sec":"Complete the notes. Write a date or a number."},
          {"type":"gap","q":"The competition office's phone number: _____","a":["0794 621 830"],"sec":"Complete the notes. Write a date or a number."}
        ],
        transcript: [
          {"who":"Presenter","man":true,"text":"Welcome to Teen Life. Today we're talking about hobbies. Our guest is Olivia Green. Olivia, could you spell your surname for our listeners?","answers":[]},
          {"who":"Olivia","man":false,"text":"Of course. Green. That's G-R-E-E-N.","answers":[1]},
          {"who":"Presenter","man":true,"text":"Thank you. So, what do you enjoy doing in your free time?","answers":[]},
          {"who":"Olivia","man":false,"text":"Photography is my favourite hobby. I started two years ago, when my uncle gave me his old camera. I like taking pictures of nature, especially birds and flowers.","answers":[2,3,4]},
          {"who":"Presenter","man":true,"text":"Where do you take your photos?","answers":[]},
          {"who":"Olivia","man":false,"text":"Usually in Maple Park, near my house. Maple. That's M-A-P-L-E. It has a lake and lots of tall trees. I go there on Saturday mornings, because it's quiet and there aren't many people.","answers":[5,6,7]},
          {"who":"Presenter","man":true,"text":"Do you have another hobby?","answers":[]},
          {"who":"Olivia","man":false,"text":"Yes, I love baking with my grandmother. We usually make biscuits. She has an old notebook full of family recipes, and we try a new one every week. Last month, I made a chocolate cake for my best friend's birthday. It was a big surprise!","answers":[8,9,10]},
          {"who":"Presenter","man":true,"text":"How do you find time for all this?","answers":[]},
          {"who":"Olivia","man":false,"text":"During the week, I do my homework first. Then I have some free time in the evening. At weekends, I have more time for my hobbies.","answers":[11]},
          {"who":"Presenter","man":true,"text":"Do you have a goal for this year?","answers":[]},
          {"who":"Olivia","man":false,"text":"Yes! I'd like to enter a photography competition. It's for teenagers aged thirteen to seventeen, and you can send up to five photos. The last day to send them is the fifteenth of May. I don't expect to win, but I want to learn from the experience.","answers":[12,13]},
          {"who":"Presenter","man":true,"text":"That sounds great. How can our listeners find out more?","answers":[]},
          {"who":"Olivia","man":false,"text":"They can call the competition office. The number is oh seven nine four, six two one, eight three zero.","answers":[14]},
          {"who":"Presenter","man":true,"text":"Oh seven nine four, six two one, eight three zero?","answers":[]},
          {"who":"Olivia","man":false,"text":"Yes, that's right.","answers":[]},
          {"who":"Presenter","man":true,"text":"Thank you, Olivia, and good luck!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b9', no: 9, stage: 'Beginner', theme: 'Shopping', emoji: '🛍️',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-9.mp3?v=2",
        title: "At the Shopping Centre",
        intro: "Listen to a customer talking to an assistant at a shopping centre. Then answer the 14 questions.",
        questions: [
          {"type":"gap","q":"The cousin's surname: _____","a":["Brooks"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The bookshop is on the _____ floor.","a":["second","2nd","2","second floor","2nd floor","2 floor"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The bookshop is next to the _____.","a":["cinema"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The customer's brother is _____ years old.","a":["ten","10","ten years","10 years"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The name of the toy shop: _____","a":["Toybox"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The wooden building set costs $_____.","a":["18.50","18,50","18.5"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"Where is the food court?","opts":["Near the main entrance","Near the car park entrance","Next to the bookshop"],"a":["Near the car park entrance"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does the café sell?","opts":["Pizza","Sandwiches","Ice cream"],"a":["Sandwiches"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time does the centre close today?","opts":["7 p.m.","8 p.m.","9 p.m."],"a":["9 p.m."],"sec":"Choose the correct answer."},
          {"type":"tf","q":"The centre closes later on Sundays.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"There is an ATM next to the customer service desk.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The customer can call the information desk if she can't find her cousin.","a":["True"],"sec":"True or False?"},
          {"type":"gap","q":"The information desk's phone number: _____","a":["0207 491 356"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Gift wrapping at the customer service desk is _____.","a":["free"],"sec":"Complete the notes. Write ONE word or A NUMBER."}
        ],
        transcript: [
          {"who":"Assistant","man":true,"text":"Good afternoon, and welcome to the shopping centre! How can I help you today?","answers":[]},
          {"who":"Customer","man":false,"text":"Hi. I'm meeting my cousin here, but I can't find her.","answers":[]},
          {"who":"Assistant","man":true,"text":"No problem! What's her name? I can call her over the speakers.","answers":[]},
          {"who":"Customer","man":false,"text":"Hannah Brooks.","answers":[]},
          {"who":"Assistant","man":true,"text":"Brooks? How do you spell that?","answers":[]},
          {"who":"Customer","man":false,"text":"Brooks. That's B-R-O-O-K-S.","answers":[1]},
          {"who":"Assistant","man":true,"text":"Great, thanks! Did she say where to meet?","answers":[]},
          {"who":"Customer","man":false,"text":"She said near the bookshop.","answers":[]},
          {"who":"Assistant","man":true,"text":"The bookshop is on the second floor, next to the cinema. You can take the lift right behind you.","answers":[2,3]},
          {"who":"Customer","man":false,"text":"Thank you. I also need a present for my little brother. He's ten, and he loves building things.","answers":[4]},
          {"who":"Assistant","man":true,"text":"Then you should try Toybox. That's T-O-Y-B-O-X. It's a toy shop near the main entrance. They have a great wooden building set for just eighteen dollars and fifty cents.","answers":[5,6]},
          {"who":"Customer","man":false,"text":"Perfect. Is there somewhere to eat?","answers":[]},
          {"who":"Assistant","man":true,"text":"Yes! The food court is near the car park entrance. There's a little café there that sells really good sandwiches.","answers":[7,8]},
          {"who":"Customer","man":false,"text":"And what time does the centre close today?","answers":[]},
          {"who":"Assistant","man":true,"text":"Today is Saturday, so we close at nine p.m. On Sundays, we close earlier.","answers":[9,10]},
          {"who":"Customer","man":false,"text":"Is there an ATM?","answers":[]},
          {"who":"Assistant","man":true,"text":"Yes, right next to the customer service desk.","answers":[11]},
          {"who":"Customer","man":false,"text":"OK. And what if I still can't find my cousin?","answers":[]},
          {"who":"Assistant","man":true,"text":"Just call us at the information desk. The number is oh two oh seven, four nine one, three five six.","answers":[12,13]},
          {"who":"Customer","man":false,"text":"Oh two oh seven, four nine one, three five six?","answers":[]},
          {"who":"Assistant","man":true,"text":"That's right!","answers":[]},
          {"who":"Customer","man":false,"text":"One more thing. Can I get the present wrapped?","answers":[]},
          {"who":"Assistant","man":true,"text":"Of course! Gift wrapping is free at the customer service desk.","answers":[14]},
          {"who":"Customer","man":false,"text":"Wonderful. Thank you so much!","answers":[]},
          {"who":"Assistant","man":true,"text":"You're welcome. Have a great day!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
      id: 'b10', no: 10, stage: 'Beginner', theme: 'Your City', emoji: '🏙️',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-10.mp3?v=2",
        title: "A Tour of My City",
        intro: "Listen to a guide at the start of a city tour. Then answer the 15 questions.",
        questions: [
          {"type":"gap","q":"The guide's surname: _____","a":["Wilson"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Before it was a museum, the building was a _____.","a":["school"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The museum is closed on _____.","a":["Mondays","Monday"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"In the museum, you can see old _____ and photos of the city.","a":["maps"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The name of the park: _____ Park","a":["Riverside","Riverside Park"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"What does the park have?","opts":["A swimming pool","Two playgrounds","A zoo"],"a":["Two playgrounds"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How much does fresh juice cost at the café?","opts":["$2","$3","$4"],"a":["$3"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is the market famous for?","opts":["Old books","Fresh fruit and vegetables","Clothes"],"a":["Fresh fruit and vegetables"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"The market is very busy on Saturday mornings.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The group will have lunch at half past one.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The library has four floors.","a":["False"],"sec":"True or False?"},
          {"type":"gap","q":"The top floor of the library is a quiet _____ area.","a":["study","study area"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"If you get lost, meet at the library _____.","a":["entrance"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The guide's phone number: _____","a":["0781 352 649"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Bring an _____ because it might rain.","a":["umbrella","umbrella because"],"sec":"Complete the notes. Write ONE word or A NUMBER."}
        ],
        transcript: [
          {"who":"Guide","man":true,"text":"Good morning, everyone, and welcome to our city tour! My name is Peter Wilson, and I'll be your guide today. Wilson. That's W-I-L-S-O-N.","answers":[1]},
          {"who":"Guide","man":true,"text":"We're starting here in the main square, the biggest square in the city. Our first stop is the City Museum, just across the road. The building is very old. Before it was a museum, it was a school. The museum is closed on Mondays, so we're lucky it's Tuesday today! Inside, you can see old maps and photos of the city.","answers":[2,3,4]},
          {"who":"Guide","man":true,"text":"Next, we'll walk to Riverside Park. Riverside. That's R-I-V-E-R-S-I-D-E. The park is next to the river. It has a long walking path, two playgrounds and a small café. At the café, fresh juice costs three dollars, and it's really good!","answers":[5,6,7]},
          {"who":"Guide","man":true,"text":"After the park, we'll visit the market. It's famous for fresh fruit and vegetables. It's very busy on Saturday mornings, but today it will be quiet. Then, at half past twelve, we'll have lunch at a small restaurant near the market.","answers":[8,9,10]},
          {"who":"Guide","man":true,"text":"Our last stop is the City Library. It has three floors, and the top floor is a quiet study area. If you get lost, please meet us at the library entrance. You can also call me. My number is oh seven eight one, three five two, six four nine. That's oh seven eight one, three five two, six four nine.","answers":[11,12,13,14]},
          {"who":"Guide","man":true,"text":"Oh, and bring an umbrella. It might rain this afternoon. Enjoy the tour!","answers":[15]}
        ]
        // LISTENING JOURNEY END
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
      id: 'e1', no: 11, stage: 'Elementary', theme: 'Holidays', emoji: '🏖️',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-11.mp3?v=2",
        title: "An Unforgettable Holiday",
        intro: "Listen to Tom talking about a holiday. Then answer the 16 questions.",
        questions: [
          {"type":"gap","q":"Tom's surname: _____","a":["Fisher"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The family travelled by _____.","a":["train"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"They left home at a quarter to _____ in the morning.","a":["seven","7"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Tom's _____ was waiting at the station.","a":["uncle","uncle was"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"What did their room have?","opts":["A kitchen","A balcony","A TV"],"a":["A balcony"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What did Tom eat on the first evening?","opts":["Pasta","Fish and chips","Vegetable soup and grilled chicken"],"a":["Vegetable soup and grilled chicken"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What animal did they see in the forest?","opts":["A fox","A deer","A rabbit"],"a":["A fox"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Where did they take photos?","opts":["At a lake","On a bridge","At a waterfall"],"a":["At a waterfall"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"It was sunny all day during the walk.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"There were horses at the farm.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The dog at the farm was unfriendly.","a":["False"],"sec":"True or False?"},
          {"type":"gap","q":"The dog's name: _____","a":["Max"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The dog played with Tom's _____.","a":["sister"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The farmer's phone number: _____","a":["0123 648 597"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"They stayed for _____ days.","a":["five","5","five days","5 days"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"They came home on the _____ of July.","a":["15th","15","fifteenth"],"sec":"Complete the notes. Write ONE word or A NUMBER."}
        ],
        transcript: [
          {"who":"Tom","man":true,"text":"Hi! My name is Tom Fisher. Fisher. That's F-I-S-H-E-R. Today I'm going to tell you about the best holiday I've ever had.","answers":[1]},
          {"who":"Tom","man":true,"text":"Last summer, my family went to a small town in the mountains. We went by train. We left home very early, at a quarter to seven in the morning, and the journey took four hours. My uncle was waiting for us at the station.","answers":[2,3,4]},
          {"who":"Tom","man":true,"text":"We stayed in a small guesthouse with a beautiful garden. Our room had a balcony with a view of the mountains.","answers":[5]},
          {"who":"Tom","man":true,"text":"On the first evening, we ate at a local restaurant. I had vegetable soup and grilled chicken. My little sister had pasta.","answers":[6]},
          {"who":"Tom","man":true,"text":"The next morning, we went hiking with a guide. She showed us a safe path through the forest. We saw lots of birds and even a small fox! Later, we stopped at a waterfall and took photos. It was sunny in the morning, but in the afternoon it became cloudy and windy.","answers":[7,8,9]},
          {"who":"Tom","man":true,"text":"On the third day, we visited a farm. There were goats, sheep and chickens, and a friendly dog called Max. Max. That's M-A-X. He followed us everywhere and played with my sister.","answers":[10,11,12,13]},
          {"who":"Tom","man":true,"text":"The farmer told us that visitors should always phone first. His number is oh one two three, six four eight, five nine seven. That's oh one two three, six four eight, five nine seven.","answers":[14]},
          {"who":"Tom","man":true,"text":"We stayed for five days and came home on the fifteenth of July. I loved the mountain walk, but my sister says playing with Max was the best part!","answers":[15,16]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Holidays",
        words: [
          { w: "Holiday", uz: "Ta'til", emoji: "🏖️", ex: "We go on holiday every summer." },
          { w: "Travel", uz: "Sayohat qilmoq", emoji: "✈️", ex: "I love to travel with my family." },
          { w: "Visit", uz: "Tashrif buyurmoq", emoji: "🏛️", ex: "Last year we visited London." },
          { w: "Hotel", uz: "Mehmonxona", emoji: "🏨", ex: "Our hotel was near the sea." },
          { w: "Beach", uz: "Plyaj", emoji: "🌊", ex: "We swam and played on the beach." },
          { w: "Mountain", uz: "Tog'", emoji: "⛰️", ex: "We walked up a high mountain." },
          { w: "Take photos", uz: "Rasmga olmoq", emoji: "📸", ex: "I took a lot of photos on holiday." },
          { w: "Enjoy the trip", uz: "Sayohatdan zavqlanmoq", emoji: "😊", ex: "We all enjoyed the trip very much." },
          { w: "Weather", uz: "Ob-havo", emoji: "🌤️", ex: "The weather was sunny and warm." },
          { w: "Memorable", uz: "Esda qolarli", emoji: "⭐", ex: "It was a memorable holiday." }
        ],
        questions: [
          { q: "Where do you like to go on holiday?", use: ["I like to go to …","the beach","the mountains","because …"] },
          { q: "Do you prefer the beach or the mountains? Why?", use: ["I prefer … because …","swim","walk","fresh air"] },
          { q: "Who do you usually travel with?", use: ["I usually travel with …","my family","my friends"] },
          { q: "What do you like to do on holiday?", use: ["I like to …","take photos","visit new places","relax"] },
          { q: "Where did you go on your last holiday?", use: ["Last summer I went to …","We stayed in a hotel","It was …"] }
        ],
        part2: { topic: "Talk about a memorable holiday", hints: ["where you went and who you went with","what you did there and what the weather was like","why it was memorable"], seconds: 45 }
      }
    },
    {
      id: 'e2', no: 12, stage: 'Elementary', theme: 'Future Plans', emoji: '🚀',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-12.mp3?v=2",
        title: "Talking About Future Dreams",
        intro: "Listen to a teacher talking to a student, Emma, about her dreams for the future. Then answer the 16 questions.",
        questions: [
          {"type":"gap","q":"Emma's surname: _____","a":["Clarke"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Emma wants to become a _____.","a":["doctor"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Her favourite subject is _____.","a":["biology"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"She needs to improve her _____.","a":["chemistry"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The university she likes: _____ University","a":["Oakwood","Oakwood University"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"How far is the university from Emma's home?","opts":["Ten minutes","An hour","Two hours"],"a":["An hour"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does Emma's best friend want to be?","opts":["A doctor","A teacher","A computer programmer"],"a":["A computer programmer"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Who does Emma's brother like helping?","opts":["Younger players","His grandparents","His classmates"],"a":["Younger players"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"The teacher says a dream needs a plan.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The teacher suggests reviewing science for an hour a day.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Students should write down two goals.","a":["True"],"sec":"True or False?"},
          {"type":"gap","q":"The bigger goal is for the next _____ years.","a":["three","3","three years","3 years"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The next lesson is on the _____ of November.","a":["22nd","22","twenty-second","twenty second"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The next lesson is in Room _____.","a":["14","fourteen","Room 14","Room fourteen"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The school office's phone number: _____","a":["0161 496 203"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Emma will talk to her _____ about her plan.","a":["parents","parents about"],"sec":"Complete the notes. Write ONE word or A NUMBER."}
        ],
        transcript: [
          {"who":"Teacher","man":true,"text":"Good morning, everyone. Today we're talking about our dreams for the future. Emma, would you like to start? First, please tell us your full name for the new class list.","answers":[]},
          {"who":"Emma","man":false,"text":"Sure. I'm Emma Clarke. Clarke. That's C-L-A-R-K-E.","answers":[1]},
          {"who":"Teacher","man":true,"text":"Thanks, Emma. So, what do you want to be?","answers":[]},
          {"who":"Emma","man":false,"text":"I want to become a doctor, because I enjoy helping people. Biology is my favourite subject, but I need to improve my chemistry.","answers":[2,3,4]},
          {"who":"Teacher","man":true,"text":"That's a great dream. Where would you like to study?","answers":[]},
          {"who":"Emma","man":false,"text":"At Oakwood University. Oakwood. That's O-A-K-W-O-O-D. It has a very good medical school, and it's only an hour from my home.","answers":[5,6]},
          {"who":"Teacher","man":true,"text":"Wonderful. And what about your friends? Do you know their dreams?","answers":[]},
          {"who":"Emma","man":false,"text":"Yes! My best friend wants to be a computer programmer. She already makes small websites. And my brother wants to be a football coach, because he loves helping younger players.","answers":[7,8]},
          {"who":"Teacher","man":true,"text":"Those are great goals. But remember, a dream needs a plan. You should choose small steps. For example, Emma, you could review science for thirty minutes a day.","answers":[9,10]},
          {"who":"Emma","man":false,"text":"Should we write our goals down?","answers":[]},
          {"who":"Teacher","man":true,"text":"Yes. Write one small goal for this month and one bigger goal for the next three years. Bring your plans to our next lesson on the twenty-second of November. We'll meet in Room fourteen. If you have any questions, call the school office. The number is oh one six one, four nine six, two oh three.","answers":[11,12,13,14,15]},
          {"who":"Emma","man":false,"text":"Oh one six one, four nine six, two oh three?","answers":[]},
          {"who":"Teacher","man":true,"text":"That's right.","answers":[]},
          {"who":"Emma","man":false,"text":"Great. I'll talk to my parents about my plan tonight.","answers":[16]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Future Plans",
        words: [
          { w: "Future", uz: "Kelajak", emoji: "🔮", ex: "I think about my future a lot." },
          { w: "Plan", uz: "Reja", emoji: "🗒️", ex: "My plan is to study at university." },
          { w: "Dream", uz: "Orzu", emoji: "💭", ex: "My dream is to live by the sea." },
          { w: "Goal", uz: "Maqsad", emoji: "🎯", ex: "My goal this year is to speak English well." },
          { w: "Hope", uz: "Umid qilmoq", emoji: "🤞", ex: "I hope to visit London one day." },
          { w: "Travel abroad", uz: "Chet elga sayohat qilmoq", emoji: "🌍", ex: "I want to travel abroad after school." },
          { w: "Find a job", uz: "Ish topmoq", emoji: "💼", ex: "My brother wants to find a job in the city." },
          { w: "Learn a language", uz: "Til o'rganmoq", emoji: "🗣️", ex: "I'm going to learn a language every year." },
          { w: "Become", uz: "Bo'lmoq", emoji: "👩‍⚕️", ex: "I want to become a doctor." },
          { w: "In the future", uz: "Kelajakda", emoji: "🚀", ex: "In the future, I'm going to have a big family." }
        ],
        questions: [
          { q: "What are your plans for next year?", use: ["Next year I'm going to …","study","work hard"] },
          { q: "What do you want to become in the future?", use: ["I want to become a …","because …"] },
          { q: "Do you want to travel abroad? Where?", use: ["Yes, I hope to travel to …","I'd like to see …"] },
          { q: "Which language do you want to learn next?", use: ["I want to learn …","because …"] },
          { q: "What is your biggest dream?", use: ["My dream is to …","I hope …","one day"] }
        ],
        part2: { topic: "Talk about your plans for the future", hints: ["what you want to do after school","what job you want to find","one big dream you hope to make true"], seconds: 45 }
      }
    },
    {
      id: 'e3', no: 13, stage: 'Elementary', theme: 'Jobs & Careers', emoji: '💼',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-13.mp3?v=2",
        title: "Different People, Different Jobs",
        intro: "Listen to a radio interview with Lucy, a careers adviser, about three jobs. Then answer the 17 questions.",
        questions: [
          {"type":"gap","q":"Lucy's surname: _____","a":["Foster"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The hotel is near the railway _____.","a":["station"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Receptionists welcome guests and help them _____ in.","a":["check"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The morning shift starts at half past _____.","a":["seven","7"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The name of the hotel: the _____ Hotel","a":["Sunrise","Sunrise Hotel"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"choose","q":"Why is English useful for receptionists?","opts":["The hotel is in England","Guests come from different countries","They write many emails"],"a":["Guests come from different countries"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Who does the photographer take pictures for?","opts":["Families, shops and local events","Newspapers","Only schools"],"a":["Families, shops and local events"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Where does the photographer often work?","opts":["At home","Only in her studio","In different places"],"a":["In different places"],"sec":"Choose the correct answer."},
          {"type":"tf","q":"The bus route goes past the hospital.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"One bus journey takes about fifteen minutes.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The bus driver doesn't like meeting people.","a":["False"],"sec":"True or False?"},
          {"type":"gap","q":"Drivers need to be calm and _____.","a":["careful"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Drivers need the right driving _____.","a":["licence","license"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The careers office's phone number: _____","a":["0203 768 145"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The office is open every _____.","a":["weekday"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Lucy's advice: try different _____.","a":["things"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"A positive _____ is useful in every job.","a":["attitude","attitude is"],"sec":"Complete the notes. Write ONE word or A NUMBER."}
        ],
        transcript: [
          {"who":"Presenter","man":true,"text":"Welcome to Careers Today! My guest is a careers adviser, Lucy Foster. Lucy, can you spell your surname for us?","answers":[]},
          {"who":"Lucy","man":false,"text":"Of course. Foster. That's F-O-S-T-E-R.","answers":[1]},
          {"who":"Presenter","man":true,"text":"Today we're talking about three different jobs. Let's start with hotel receptionists.","answers":[]},
          {"who":"Lucy","man":false,"text":"Sure. Last month I visited a hotel in the city centre, near the railway station. Receptionists welcome guests and help them check in. Their morning shift starts at half past seven. The hotel is called the Sunrise Hotel. Sunrise. That's S-U-N-R-I-S-E.","answers":[2,3,4,5]},
          {"who":"Presenter","man":true,"text":"What skills do receptionists need?","answers":[]},
          {"who":"Lucy","man":false,"text":"They need to be polite, patient and organised. Speaking English is useful too, because the guests come from different countries.","answers":[6]},
          {"who":"Presenter","man":true,"text":"Our second job is photographer.","answers":[]},
          {"who":"Lucy","man":false,"text":"Yes. I spoke to a photographer who takes pictures for families, shops and local events. She sometimes works in her studio, but she often travels to different places. She uses a camera, lights and a computer.","answers":[7,8]},
          {"who":"Presenter","man":true,"text":"And finally, bus drivers.","answers":[]},
          {"who":"Lucy","man":false,"text":"I met a bus driver who starts work very early. His route goes through the city centre and past the hospital. One journey takes about fifty minutes. He likes meeting people and helping them get to work and school.","answers":[9,10,11]},
          {"who":"Presenter","man":true,"text":"What do drivers need?","answers":[]},
          {"who":"Lucy","man":false,"text":"They need to be calm and careful, and they need the right driving licence.","answers":[12,13]},
          {"who":"Presenter","man":true,"text":"If our listeners want advice about jobs, how can they contact you?","answers":[]},
          {"who":"Lucy","man":false,"text":"They can call our careers office. The number is oh two oh three, seven six eight, one four five.","answers":[14]},
          {"who":"Presenter","man":true,"text":"Oh two oh three, seven six eight, one four five?","answers":[]},
          {"who":"Lucy","man":false,"text":"Yes, that's right. The office is open every weekday.","answers":[15]},
          {"who":"Presenter","man":true,"text":"Thank you, Lucy. What's your best advice for young people?","answers":[]},
          {"who":"Lucy","man":false,"text":"Try different things, and remember that good communication and a positive attitude are useful in every job.","answers":[16,17]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Jobs & Careers",
        words: [
          { w: "Job", uz: "Ish", emoji: "💼", ex: "My mother has a good job." },
          { w: "Career", uz: "Kasbiy faoliyat", emoji: "📈", ex: "He started his career as a teacher." },
          { w: "Teacher", uz: "O'qituvchi", emoji: "👩‍🏫", ex: "Our teacher helps us every day." },
          { w: "Doctor", uz: "Shifokor", emoji: "👨‍⚕️", ex: "A doctor works in a hospital." },
          { w: "Engineer", uz: "Muhandis", emoji: "👷", ex: "My uncle is an engineer. He builds bridges." },
          { w: "Office", uz: "Ofis", emoji: "🏢", ex: "My father works in an office." },
          { w: "Salary", uz: "Maosh", emoji: "💰", ex: "Doctors usually get a good salary." },
          { w: "Colleague", uz: "Hamkasb", emoji: "🤝", ex: "She has lunch with her colleagues." },
          { w: "Hard-working", uz: "Mehnatkash", emoji: "💪", ex: "My sister is very hard-working." },
          { w: "Experience", uz: "Tajriba", emoji: "🧰", ex: "He has ten years of experience." }
        ],
        questions: [
          { q: "What do your parents do?", use: ["My mother is a …","My father works in …"] },
          { q: "What job do you want to do in the future?", use: ["I want to be a …","because …"] },
          { q: "Is it better to work in an office or outside? Why?", use: ["I think it's better to work … because …"] },
          { q: "Which jobs get a good salary in your country?", use: ["I think … get a good salary","doctors","engineers"] },
          { q: "Are you a hard-working person?", use: ["Yes, I am. I …","I always …","I sometimes …"] }
        ],
        part2: { topic: "Talk about a job you would like to do", hints: ["what the job is and where people do it","what a person in this job does every day","why you would like this job"], seconds: 45 }
      }
    },
    {
      id: 'e4', no: 14, stage: 'Elementary', theme: 'Clothes & Fashion', emoji: '👕',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-14.mp3?v=1",
        title: "Shopping for Clothes",
        intro: "Listen to a customer buying a birthday present in a clothes shop. Then answer the 17 questions.",
        questions: [
          {"type":"choose","q":"Who is the customer buying clothes for?","opts":["Her father","Her brother","Her friend"],"a":["Her brother"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Which jacket does she choose?","opts":["The dark blue one","The black one","The grey one"],"a":["The grey one"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How many pockets does the grey jacket have?","opts":["Two","Three","Four"],"a":["Three"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What colour is the T-shirt she buys?","opts":["White","Green","Blue"],"a":["Green"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"The brother's name: _____","a":["Yusuf"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The grey jacket costs $_____.","a":["35","thirty-five","35.00"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The green T-shirt costs $_____.","a":["14","fourteen","14.00"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"Clothes can be returned within _____ days.","a":["30","thirty","30 days","thirty days"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The dark blue jacket costs _____ dollars.","a":["48","forty-eight","forty eight","48 dollars","forty-eight dollars","forty eight dollars"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The white T-shirt costs _____ dollars.","a":["12","twelve","12 dollars","twelve dollars"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The total bill is _____ dollars.","a":["49","forty-nine","forty nine","49 dollars","forty-nine dollars","forty nine dollars"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The customer pays by _____.","a":["card"],"sec":"Complete the notes. Write ONE word or A NUMBER."},
          {"type":"tf","q":"Yusuf prefers formal clothes.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The grey jacket has one inside pocket.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The customer buys the white T-shirt.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"A receipt is needed to return an item.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The customer asks for a gift bag.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Assistant","man":false,"text":"Hello! Welcome to Style Street. Can I help you?","answers":[]},
          {"who":"Customer","man":false,"text":"I'm looking for a jacket for my brother. His name is Yusuf. Yusuf is Y-U-S-U-F. His birthday is next week.","answers":[1,5]},
          {"who":"Assistant","man":false,"text":"Does he prefer casual or formal clothes?","answers":[]},
          {"who":"Customer","man":false,"text":"Casual clothes. He likes simple jackets without bright colours.","answers":[13]},
          {"who":"Assistant","man":false,"text":"This dark blue jacket costs forty-eight dollars. We have medium and large sizes.","answers":[9]},
          {"who":"Customer","man":false,"text":"Could I see the medium one?","answers":[]},
          {"who":"Assistant","man":false,"text":"Certainly. The changing rooms are at the back, next to the mirrors.","answers":[]},
          {"who":"Customer","man":false,"text":"It looks good, but it's a little expensive. Do you have something cheaper?","answers":[]},
          {"who":"Assistant","man":false,"text":"This grey jacket costs thirty-five dollars. It's lighter and good for spring or autumn. It has two outside pockets and one small pocket inside.","answers":[3,6,14]},
          {"who":"Customer","man":false,"text":"That's useful. My brother carries his phone and keys. I'll take it. Can I also buy a T-shirt?","answers":[2]},
          {"who":"Assistant","man":false,"text":"Of course. We have white and green T-shirts. The white one costs twelve dollars, and the green one costs fourteen dollars.","answers":[7,10]},
          {"who":"Customer","man":false,"text":"I'll take the green one. What is your return policy?","answers":[4,15]},
          {"who":"Assistant","man":false,"text":"You can return or exchange clothes within thirty days if you have the receipt and the items are unworn.","answers":[8,16]},
          {"who":"Customer","man":false,"text":"Can I pay by card?","answers":[12]},
          {"who":"Assistant","man":false,"text":"Yes. Your total is forty-nine dollars.","answers":[11]},
          {"who":"Customer","man":false,"text":"Here is my card. Could you put everything in a gift bag?","answers":[17]},
          {"who":"Assistant","man":false,"text":"Certainly. Would you like a name on the gift label?","answers":[]},
          {"who":"Customer","man":false,"text":"Yes, please write Yusuf. That's Y-U-S-U-F. And write, \"Happy birthday! From your sister.\"","answers":[]},
          {"who":"Assistant","man":false,"text":"No problem. Here you are. Have a lovely day!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Clothes & Fashion",
        words: [
          { w: "T-shirt", uz: "Futbolka", emoji: "👕", ex: "I wear a T-shirt in summer." },
          { w: "Jeans", uz: "Jinsi shim", emoji: "👖", ex: "These jeans are my favourite." },
          { w: "Jacket", uz: "Kurtka", emoji: "🧥", ex: "Take a jacket. It's cold outside." },
          { w: "Trainers", uz: "Sport oyoq kiyimi", emoji: "👟", ex: "I wear trainers to school." },
          { w: "Comfortable", uz: "Qulay", emoji: "🛋️", ex: "My trainers are very comfortable." },
          { w: "Casual", uz: "Kundalik", emoji: "🙂", ex: "At the weekend I wear casual clothes." },
          { w: "Formal", uz: "Rasmiy", emoji: "👔", ex: "My father wears formal clothes at work." },
          { w: "Wear", uz: "Kiyib yurmoq", emoji: "🧢", ex: "I usually wear a cap in summer." },
          { w: "Fit", uz: "Mos kelmoq", emoji: "📏", ex: "This jacket doesn't fit me. It's too big." },
          { w: "Favourite colour", uz: "Sevimli rang", emoji: "🎨", ex: "My favourite colour is blue." }
        ],
        questions: [
          { q: "What do you usually wear at the weekend?", use: ["At the weekend I usually wear …","jeans","a T-shirt","trainers"] },
          { q: "What is your favourite colour for clothes?", use: ["My favourite colour is …","I often wear …"] },
          { q: "Do you like casual or formal clothes? Why?", use: ["I like … clothes because …","comfortable"] },
          { q: "What do you wear to school or work?", use: ["I wear …","a uniform","formal clothes"] },
          { q: "Where do you buy your clothes?", use: ["I buy my clothes at …","a shop","the market","online"] }
        ],
        part2: { topic: "Talk about your favourite clothes", hints: ["what the clothes are and what colour they are","when and where you wear them","why you like them"], seconds: 60 }
      }
    },
    {
      id: 'e5', no: 15, stage: 'Elementary', theme: 'Transport', emoji: '🚆',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-15.mp3?v=1",
        title: "A Journey by Train",
        intro: "Listen to an announcement at a train station and two passengers talking. Then answer the 18 questions.",
        questions: [
          {"type":"choose","q":"Which platform does the Lakeside train leave from?","opts":["2","3","4"],"a":["4"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time does the Hilltown train leave?","opts":["9:20","9:45","10:30"],"a":["9:45"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How long is the journey to Lakeside?","opts":["1 hour 20 minutes","2 hours 10 minutes","2 hours 30 minutes"],"a":["2 hours 10 minutes"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What time does the return train leave?","opts":["6:15","6:30","7:15"],"a":["6:15"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"The friend's first name: _____","a":["Anna"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The friend's surname: _____","a":["Miller"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The street name: _____ Street","a":["Garden","Garden Street"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The house number: _____","a":["18","eighteen"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The dog's name: _____","a":["Charlie"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The ticket costs $_____.","a":["26.50","26,50","26.5"],"sec":"Complete the notes."},
          {"type":"gap","q":"The passenger comes back on _____ evening.","a":["Sunday","Sunday evening"],"sec":"Complete the notes."},
          {"type":"gap","q":"The shop is next to Platform _____.","a":["3","three","Platform 3","Platform three"],"sec":"Complete the notes."},
          {"type":"gap","q":"The shop closes at _____ p.m.","a":["8","eight","8:00","8.00","8 p","eight p","8:00 p","8.00 p"],"sec":"Complete the notes."},
          {"type":"tf","q":"The train to Westport is leaving earlier than planned.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The passenger bought the ticket online.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Anna lives near the lake.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The passenger plans to visit a nature park.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Every seat has a power socket.","a":["False"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Announcement","man":false,"text":"Good morning, passengers. The train to Lakeside will depart from Platform 4 at nine twenty. The train to Hilltown leaves from Platform 2 at nine forty-five. The train to Westport is delayed and is now expected to leave at ten thirty.","answers":[1,2,14]},
          {"who":"Announcement","man":false,"text":"The journey to Lakeside takes approximately two hours and ten minutes. There is a café on the train where passengers can buy sandwiches, drinks and snacks.","answers":[3]},
          {"who":"Passenger 1","man":false,"text":"Excuse me. Could you tell me where Platform 4 is?","answers":[]},
          {"who":"Passenger 2","man":true,"text":"Walk straight ahead, then turn left after the information desk.","answers":[]},
          {"who":"Passenger 1","man":false,"text":"Thank you. I'm travelling to Lakeside to visit my friend, Anna Miller. Anna is A-N-N-A, and Miller is M-I-L-L-E-R. She lives near the lake.","answers":[5,6,16]},
          {"who":"Passenger 2","man":true,"text":"Do you know her address?","answers":[]},
          {"who":"Passenger 1","man":false,"text":"Yes, it's 18 Garden Street. Garden is G-A-R-D-E-N, and Street is S-T-R-E-E-T.","answers":[7,8]},
          {"who":"Passenger 2","man":true,"text":"Have you bought your ticket?","answers":[]},
          {"who":"Passenger 1","man":false,"text":"Yes, online yesterday. It cost twenty-six dollars and fifty cents. It's a return ticket. I'm coming back on Sunday evening. My return train leaves Lakeside at six fifteen.","answers":[4,10,11,15]},
          {"who":"Passenger 2","man":true,"text":"What will you do there?","answers":[]},
          {"who":"Passenger 1","man":false,"text":"Anna wants to show me the town centre and a nature park. She also has a dog called Charlie. Charlie is C-H-A-R-L-I-E. He loves walking near the water.","answers":[9,17]},
          {"who":"Passenger 2","man":true,"text":"Does the train have Wi-Fi?","answers":[]},
          {"who":"Passenger 1","man":false,"text":"I think so, but I heard the signal can be weak. Are there power sockets?","answers":[]},
          {"who":"Passenger 2","man":true,"text":"There are sockets under some seats. There's also a small shop next to Platform 3. It opens at seven in the morning and closes at eight in the evening.","answers":[12,13,18]},
          {"who":"Announcement","man":false,"text":"The nine twenty train to Lakeside is now ready for boarding at Platform 4. Please board through the front and middle doors. Do not leave bags unattended.","answers":[]},
          {"who":"Passenger 1","man":false,"text":"That's my train. Thanks for your help!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Transport",
        words: [
          { w: "Bus", uz: "Avtobus", emoji: "🚌", ex: "I go to school by bus." },
          { w: "Train", uz: "Poyezd", emoji: "🚆", ex: "The train to the capital is fast." },
          { w: "Taxi", uz: "Taksi", emoji: "🚕", ex: "We took a taxi to the airport." },
          { w: "Bicycle", uz: "Velosiped", emoji: "🚲", ex: "I ride my bicycle in the park." },
          { w: "Car", uz: "Mashina", emoji: "🚗", ex: "My father drives a white car." },
          { w: "Traffic", uz: "Yo'l harakati", emoji: "🚦", ex: "There is a lot of traffic in the morning." },
          { w: "Traffic jam", uz: "Tirbandlik", emoji: "🚙", ex: "We were in a traffic jam for an hour." },
          { w: "Journey", uz: "Safar", emoji: "🗺️", ex: "The journey to my grandma's house takes two hours." },
          { w: "Travel by bus", uz: "Avtobusda sayohat qilmoq", emoji: "🎫", ex: "I like to travel by bus because it's cheap." },
          { w: "On foot", uz: "Piyoda", emoji: "🚶", ex: "My school is near, so I go on foot." }
        ],
        questions: [
          { q: "How do you go to school or work?", use: ["I go by … / on foot","It takes … minutes"] },
          { q: "Do you like to travel by train? Why?", use: ["Yes, I do, because …","No, I don't, because …"] },
          { q: "Is there a lot of traffic in your city?", use: ["Yes, there is a lot of traffic in the morning","traffic jams"] },
          { q: "Can you ride a bicycle?", use: ["Yes, I can. I ride it …","No, I can't, but …"] },
          { q: "What is the best way to travel in your city? Why?", use: ["I think the best way is … because …","fast","cheap"] }
        ],
        part2: { topic: "Talk about a long journey you made", hints: ["where you went and how you travelled","how long the journey took and who was with you","what you liked or didn't like about it"], seconds: 60 }
      }
    },
    {
      id: 'e6', no: 16, stage: 'Elementary', theme: 'Animals & Pets', emoji: '🐾',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-16.mp3?v=1",
        title: "An Interesting Animal Story",
        intro: "Listen to an interview with Noah, a young volunteer who helps animals. Then answer the 18 questions.",
        questions: [
          {"type":"choose","q":"What animal did Noah's family find?","opts":["A cat","A dog","A rabbit"],"a":["A dog"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is his cat's name?","opts":["Bella","Rocky","Daisy"],"a":["Bella"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Where does Noah volunteer?","opts":["Happy Tails Centre","Green Animal Hospital","Oak School"],"a":["Happy Tails Centre"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"When was Rocky adopted?","opts":["March","April","May"],"a":["April"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"Noah's surname: _____","a":["Reed"],"sec":"Spelling."},
          {"type":"gap","q":"The cat's name: _____","a":["Bella"],"sec":"Spelling."},
          {"type":"gap","q":"The animal centre: _____ Centre","a":["Happy Tails","Happy Tails Centre"],"sec":"Spelling."},
          {"type":"gap","q":"The street name: _____ Street","a":["Oak","Oak Street"],"sec":"Spelling."},
          {"type":"gap","q":"The dog's name: _____","a":["Rocky"],"sec":"Spelling."},
          {"type":"gap","q":"Bella is _____ years old.","a":["3","three","3 years","three years"],"sec":"Numbers and details."},
          {"type":"gap","q":"Noah feeds Bella _____ a day.","a":["twice","2 times","two times"],"sec":"Numbers and details."},
          {"type":"gap","q":"Last week there were _____ dogs and eleven cats.","a":["24","twenty-four","twenty four","24 dogs","twenty-four dogs","twenty four dogs"],"sec":"Numbers and details."},
          {"type":"gap","q":"The centre's phone number (in digits): _____","a":["020 774 519"],"sec":"Numbers and details."},
          {"type":"tf","q":"Bella has black and brown fur.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Noah changes Bella's water every day.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Rocky was confident when he arrived.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Rocky's new family had a large garden.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Visitors should contact the centre before visiting.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Presenter","man":false,"text":"Welcome to Animal Friends. Today our guest is a young volunteer called Noah Reed. Noah is N-O-A-H, and Reed is R-E-E-D.","answers":[5]},
          {"who":"Presenter","man":false,"text":"How did you become interested in helping animals?","answers":[]},
          {"who":"Noah","man":true,"text":"My family once found a small dog near our home. He looked tired and didn't have a collar. We gave him water and contacted an animal centre. The centre helped us find his owner. After that, I became interested in animal care.","answers":[1]},
          {"who":"Presenter","man":false,"text":"Do you have a pet?","answers":[]},
          {"who":"Noah","man":true,"text":"Yes, I have a cat called Bella. Bella is B-E-L-L-A. She's three years old and has white and grey fur. She's friendly, but she doesn't like loud noises. I feed her twice a day and change her water every day.","answers":[2,6,10,11,14,15]},
          {"who":"Presenter","man":false,"text":"Where do you volunteer?","answers":[]},
          {"who":"Noah","man":true,"text":"At Happy Tails Centre. Happy is H-A-P-P-Y, and Tails is T-A-I-L-S. It's on Oak Street. Oak is O-A-K. The centre looks after dogs and cats that need temporary homes.","answers":[3,7,8]},
          {"who":"Presenter","man":false,"text":"What do you do there?","answers":[]},
          {"who":"Noah","man":true,"text":"I clean the animals' areas, prepare food and take dogs for walks. I also speak to visitors about responsible pet ownership.","answers":[]},
          {"who":"Presenter","man":false,"text":"Is there an animal you remember especially well?","answers":[]},
          {"who":"Noah","man":true,"text":"Yes, a dog called Rocky. Rocky is R-O-C-K-Y. He arrived in March. At first, he was nervous and stayed in a corner. Volunteers gave him time and treated him gently. After a few weeks, he became more confident and started playing with other dogs.","answers":[9,16]},
          {"who":"Presenter","man":false,"text":"Did Rocky find a home?","answers":[]},
          {"who":"Noah","man":true,"text":"Yes. A family visited in April. They had two children and a large garden. They adopted Rocky and sent us a photograph a month later. He looked very happy.","answers":[4,17]},
          {"who":"Presenter","man":false,"text":"How many animals does the centre usually have?","answers":[]},
          {"who":"Noah","man":true,"text":"Around thirty, but the number changes. Last week, there were twenty-four dogs and eleven cats. The centre needs volunteers, food, blankets and cleaning supplies.","answers":[12]},
          {"who":"Presenter","man":false,"text":"How can people help?","answers":[]},
          {"who":"Noah","man":true,"text":"They can volunteer or donate useful items. They should contact the centre before visiting. The phone number is 020 774 519. That's zero two zero, seven seven four, five one nine.","answers":[13,18]},
          {"who":"Presenter","man":false,"text":"Thank you, Noah. Small acts of kindness can make a difference.","answers":[]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Animals & Pets",
        words: [
          { w: "Pet", uz: "Uy hayvoni", emoji: "🐾", ex: "Have you got a pet?" },
          { w: "Dog", uz: "It", emoji: "🐕", ex: "Our dog likes to play in the garden." },
          { w: "Cat", uz: "Mushuk", emoji: "🐈", ex: "My cat sleeps on my bed." },
          { w: "Bird", uz: "Qush", emoji: "🐦", ex: "A small bird sings outside my window." },
          { w: "Rabbit", uz: "Quyon", emoji: "🐇", ex: "My little sister has a white rabbit." },
          { w: "Feed", uz: "Ovqat bermoq", emoji: "🥕", ex: "I feed my cat twice a day." },
          { w: "Take care of", uz: "G'amxo'rlik qilmoq", emoji: "🤲", ex: "I take care of our dog when my parents are busy." },
          { w: "Wild animals", uz: "Yovvoyi hayvonlar", emoji: "🦁", ex: "We saw wild animals at the zoo." },
          { w: "Friendly", uz: "Do'stona", emoji: "🙂", ex: "Our dog is very friendly." },
          { w: "Cute", uz: "Yoqimtoy", emoji: "🥰", ex: "Look at this cute rabbit!" }
        ],
        questions: [
          { q: "Have you got a pet? What is it?", use: ["Yes, I've got a …","No, I haven't, but I'd like a …"] },
          { q: "Do you like dogs or cats more? Why?", use: ["I like … more because …","friendly","cute"] },
          { q: "Who takes care of pets in your family?", use: ["… takes care of our …","feed","play with"] },
          { q: "What is your favourite wild animal?", use: ["My favourite wild animal is …","It lives in …"] },
          { q: "Did you see any animals at a zoo or farm?", use: ["Yes, I saw …","It was …"] }
        ],
        part2: { topic: "Talk about a pet you have or would like to have", hints: ["what animal it is and what it looks like","how you take care of it (or would take care of it)","why you like this animal"], seconds: 60 }
      }
    },
    {
      id: 'e7', no: 17, stage: 'Elementary', theme: 'Health & Lifestyle', emoji: '💪',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-17.mp3?v=1",
        title: "Healthy Habits and Daily Life",
        intro: "Listen to a podcast about healthy habits. Then answer the 19 questions.",
        questions: [
          {"type":"choose","q":"What is the podcast called?","opts":["Healthy World","Everyday Choices","Better Living"],"a":["Everyday Choices"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What bedtime does she suggest for someone who wakes up at seven?","opts":["8:30","10:30 or 11:00","Midnight"],"a":["10:30 or 11:00"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How much water does the presenter's bottle hold?","opts":["500 ml","650 ml","750 ml"],"a":["750 ml"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How does Thomas travel to work?","opts":["By bus","On foot","By car"],"a":["On foot"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How long is the study break she talks about?","opts":["5 minutes","10 minutes","25 minutes"],"a":["5 minutes"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"The presenter's first name: _____","a":["Rachel"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The presenter's surname: _____","a":["Moore"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The neighbour's first name: _____","a":["Thomas"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"The listener's town: _____","a":["Brookfield"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"Thomas's office is _____ minutes from his home.","a":["25","twenty-five","twenty five","25 minutes","twenty-five minutes","twenty five minutes"],"sec":"Spelling and numbers."},
          {"type":"gap","q":"Keep a water _____ nearby.","a":["bottle","bottle nearby"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Playing _____ is one way to move more.","a":["outside","outside is"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Daniel works from nine until _____.","a":["5","five","5:00","5 pm","5 p.m."],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"Daniel could walk for _____ minutes after lunch.","a":["10","ten","10 minutes","ten minutes"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"gap","q":"The podcast is called _____ Choices.","a":["Everyday","Everyday Choices"],"sec":"Complete the sentences. Write ONE word or A NUMBER."},
          {"type":"tf","q":"The presenter says everyone needs expensive equipment to be healthy.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The presenter recommends eating a variety of foods.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Thomas drives to work every day.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The presenter suggests changing every habit in one day.","a":["False"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Rachel","man":false,"text":"Hello, and welcome to Everyday Choices, a podcast about simple habits that can make daily life better. I'm your presenter, Rachel Moore. Rachel is R-A-C-H-E-L, and Moore is M-O-O-R-E.","answers":[1,6,7]},
          {"who":"Rachel","man":false,"text":"Today we're talking about healthy habits. Some people think a healthy lifestyle requires expensive food, special equipment or lots of free time. However, many useful habits are simple.","answers":[16]},
          {"who":"Rachel","man":false,"text":"Let's begin with sleep. Having a regular sleeping routine can help you feel more organised. If you wake up at seven, you might choose to go to bed at around ten thirty or eleven. People need different amounts of sleep, but enough rest is important.","answers":[2]},
          {"who":"Rachel","man":false,"text":"The second habit is drinking water. Some people forget to drink during busy days. One useful idea is to keep a bottle nearby. My bottle holds seven hundred and fifty millilitres. I fill it in the morning and take it to work.","answers":[3,11]},
          {"who":"Rachel","man":false,"text":"Another habit is eating a variety of foods. Fruit, vegetables, grains and other foods can all be part of balanced meals. You don't need to eat the same thing every day. You could have eggs and bread for breakfast, rice with vegetables for lunch, and soup for dinner.","answers":[17]},
          {"who":"Rachel","man":false,"text":"Movement is important too. You don't have to join a sports club. Walking, cycling, dancing and playing outside are all ways to move more. My neighbour, Thomas Hill, is a good example. Thomas is T-H-O-M-A-S, and Hill is H-I-L-L. He walks to work every day. His office is twenty-five minutes from his home.","answers":[4,8,10,12,18]},
          {"who":"Rachel","man":false,"text":"It's also useful to take short breaks when studying. If you sit for a long time, stand up, stretch gently or walk around. Some people study for twenty-five minutes and then take a five-minute break.","answers":[5]},
          {"who":"Rachel","man":false,"text":"Rest and enjoyable activities matter as well. Reading, listening to music and spending time with friends can help people relax.","answers":[]},
          {"who":"Rachel","man":false,"text":"Now, here's a message from Daniel in Brookfield. Brookfield is B-R-O-O-K-F-I-E-L-D. Daniel works from nine until five and often feels tired in the evening. He wants to become more active.","answers":[9,13]},
          {"who":"Rachel","man":false,"text":"My suggestion is to start with a small change. Daniel could walk for ten minutes after lunch or take the stairs instead of the lift. He could also prepare a simple meal at home.","answers":[14]},
          {"who":"Rachel","man":false,"text":"Remember, you don't need to change everything in one day. Choose one or two realistic goals and practise them regularly. A healthy lifestyle is built through small choices repeated over time. Thank you for listening to Everyday Choices.","answers":[15,19]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Health & Lifestyle",
        words: [
          { w: "Healthy", uz: "Sog'lom", emoji: "🥗", ex: "I try to eat healthy food." },
          { w: "Unhealthy", uz: "Nosog'lom", emoji: "🍟", ex: "Chips and cola are unhealthy." },
          { w: "Exercise", uz: "Jismoniy mashq", emoji: "🏃", ex: "I do exercise every morning." },
          { w: "Sleep well", uz: "Yaxshi uxlamoq", emoji: "😴", ex: "I sleep well when I go to bed early." },
          { w: "Drink water", uz: "Suv ichmoq", emoji: "💧", ex: "Drink water when you play sport." },
          { w: "Fresh fruit", uz: "Yangi meva", emoji: "🍎", ex: "I eat fresh fruit every day." },
          { w: "Feel tired", uz: "Charchoqni his qilmoq", emoji: "🥱", ex: "I feel tired after a long day." },
          { w: "Feel better", uz: "O'zini yaxshiroq his qilmoq", emoji: "😌", ex: "I feel better after a walk." },
          { w: "Daily habits", uz: "Kundalik odatlar", emoji: "📅", ex: "Good daily habits keep you healthy." },
          { w: "Keep fit", uz: "Formada bo'lmoq", emoji: "💪", ex: "My father plays football to keep fit." }
        ],
        questions: [
          { q: "What do you do to keep fit?", use: ["To keep fit, I …","run","swim","walk"] },
          { q: "Do you eat healthy food?", use: ["Yes, I eat …","fresh fruit","Sometimes I eat unhealthy food like …"] },
          { q: "How many hours do you sleep?", use: ["I usually sleep … hours","I sleep well when …"] },
          { q: "What do you do when you feel tired?", use: ["When I feel tired, I …","Then I feel better"] },
          { q: "What is one good daily habit you have?", use: ["Every day I …","drink water","do exercise"] }
        ],
        part2: { topic: "Talk about how you stay healthy", hints: ["what you eat and drink","what exercise you do and how often","one habit you want to change"], seconds: 60 }
      }
    },
    {
      id: 'e8', no: 18, stage: 'Elementary', theme: 'Technology', emoji: '📱',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-18.mp3?v=1",
        title: "How Technology Changes Our Lives",
        intro: "Listen to a school radio programme about technology. Then answer the 19 questions.",
        questions: [
          {"type":"choose","q":"What is the programme called?","opts":["School Voices","Student Life","Digital World"],"a":["School Voices"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How long does Emily use her language app each day?","opts":["5 minutes","15 minutes","30 minutes"],"a":["15 minutes"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What does Jack mainly use his laptop for?","opts":["Shopping","School projects","Sports"],"a":["School projects"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is the website called?","opts":["Learn Online","Study World","Online School"],"a":["Learn Online"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is Emily's favourite device?","opts":["Her laptop","Her tablet","Her camera"],"a":["Her tablet"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"Emily's surname: _____","a":["Parker"],"sec":"Spelling."},
          {"type":"gap","q":"Jack's surname: _____","a":["Brown"],"sec":"Spelling."},
          {"type":"gap","q":"The website's name: _____","a":["Learn Online"],"sec":"Spelling."},
          {"type":"gap","q":"The tablet's name: _____","a":["Nova"],"sec":"Spelling."},
          {"type":"gap","q":"The shop's name: _____","a":["Tech Corner"],"sec":"Spelling."},
          {"type":"gap","q":"Emily paid $_____ for her tablet.","a":["180","one hundred and eighty","180.00"],"sec":"Numbers and details."},
          {"type":"gap","q":"The shop's street number: _____","a":["42","forty-two"],"sec":"Numbers and details."},
          {"type":"gap","q":"The street name: _____ Road","a":["Market","Market Road"],"sec":"Numbers and details."},
          {"type":"gap","q":"Some lessons on Learn Online are _____ minutes long.","a":["10","ten","10 minutes","ten minutes"],"sec":"Numbers and details."},
          {"type":"tf","q":"Emily puts her phone away when she studies.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Jack believes everything on the internet is correct.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Emily thinks teachers may share more materials online.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Jack thinks technology will completely replace teachers.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Jack recommends spending some time away from screens.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Host","man":true,"text":"Welcome to School Voices. Today's topic is technology. Our guests are Emily Parker and Jack Brown.","answers":[1]},
          {"who":"Emily","man":false,"text":"Emily is E-M-I-L-Y, and Parker is P-A-R-K-E-R.","answers":[6]},
          {"who":"Jack","man":false,"text":"Jack is J-A-C-K, and Brown is B-R-O-W-N.","answers":[7]},
          {"who":"Host","man":true,"text":"Emily, how often do you use your phone?","answers":[]},
          {"who":"Emily","man":false,"text":"Every day. I use it to message friends, check my school timetable, listen to music and find information. I also use a language-learning app for about fifteen minutes a day. Smartphones make life easier because I can contact my family and find directions. However, I sometimes watch too many short videos, so I put my phone away when studying.","answers":[2,15]},
          {"who":"Host","man":true,"text":"Jack, what about you?","answers":[]},
          {"who":"Jack","man":true,"text":"I use my laptop more than my phone because I do school projects on it. I also learn computer skills through free online lessons. I often use a website called Learn Online. Learn is L-E-A-R-N, and Online is O-N-L-I-N-E. It has short lessons about typing, presentations and spreadsheets. Some lessons are ten minutes long.","answers":[3,4,8,14]},
          {"who":"Host","man":true,"text":"Do you use technology for entertainment?","answers":[]},
          {"who":"Jack","man":true,"text":"Yes. I watch films, play games and listen to podcasts. But I try to finish homework first. Otherwise, I can lose track of time.","answers":[]},
          {"who":"Host","man":true,"text":"What should students remember about online safety?","answers":[]},
          {"who":"Emily","man":false,"text":"Use strong passwords and avoid sharing private information with strangers. Think carefully before posting photographs or personal details.","answers":[]},
          {"who":"Jack","man":true,"text":"Also, check information before believing or sharing it. Not everything online is correct. If I read an unusual story, I look for another reliable source.","answers":[16]},
          {"who":"Host","man":true,"text":"Will technology change schools in the future?","answers":[]},
          {"who":"Emily","man":false,"text":"Probably. Students may use more digital books and interactive lessons. Teachers can share materials online, which makes studying at home easier.","answers":[17]},
          {"who":"Jack","man":true,"text":"Technology will help teachers, but it won't replace them. Students still need people to explain difficult ideas and answer questions.","answers":[18]},
          {"who":"Host","man":true,"text":"Emily, do you have a favourite device?","answers":[]},
          {"who":"Emily","man":false,"text":"My favourite is my tablet, Nova. Nova is N-O-V-A. I use it to read and draw. I bought it last year for one hundred and eighty dollars.","answers":[5,9,11]},
          {"who":"Host","man":true,"text":"Jack?","answers":[]},
          {"who":"Jack","man":true,"text":"I like my wireless headphones. I bought them at Tech Corner. Tech is T-E-C-H, and Corner is C-O-R-N-E-R. The shop is at 42 Market Road. Market is M-A-R-K-E-T, and Road is R-O-A-D.","answers":[10,12,13]},
          {"who":"Host","man":true,"text":"Give us one final piece of advice.","answers":[]},
          {"who":"Emily","man":false,"text":"Make sure technology helps you reach your goals.","answers":[]},
          {"who":"Jack","man":true,"text":"Learn to use digital tools, but spend time away from screens too.","answers":[19]},
          {"who":"Host","man":true,"text":"Thank you both!","answers":[]}
        ]
        // LISTENING JOURNEY END
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
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Technology",
        words: [
          { w: "Smartphone", uz: "Smartfon", emoji: "📱", ex: "I use my smartphone every day." },
          { w: "Laptop", uz: "Noutbuk", emoji: "💻", ex: "I do my homework on my laptop." },
          { w: "Internet", uz: "Internet", emoji: "🌐", ex: "The internet is very fast at school." },
          { w: "Website", uz: "Veb-sayt", emoji: "🖥️", ex: "This website has good English games." },
          { w: "Application", uz: "Ilova", emoji: "📲", ex: "I learn words with an application." },
          { w: "Download", uz: "Yuklab olmoq", emoji: "⬇️", ex: "I downloaded a new game yesterday." },
          { w: "Upload", uz: "Yuklamoq", emoji: "⬆️", ex: "She uploads photos to the internet." },
          { w: "Search for", uz: "Qidirmoq", emoji: "🔍", ex: "I search for information online." },
          { w: "Online", uz: "Onlayn", emoji: "🟢", ex: "I talk to my friends online." },
          { w: "Useful", uz: "Foydali", emoji: "👍", ex: "A laptop is very useful for students." }
        ],
        questions: [
          { q: "What do you use your smartphone for?", use: ["I use it to …","talk to friends","play games","take photos"] },
          { q: "What is your favourite application? Why?", use: ["My favourite application is … because …"] },
          { q: "How many hours are you online every day?", use: ["I'm online for about … hours","I think it's too much / OK"] },
          { q: "What do you search for on the internet?", use: ["I search for …","music","films","information for school"] },
          { q: "Is technology useful for learning? Why?", use: ["Yes, it is useful because …","websites","applications"] }
        ],
        part2: { topic: "Talk about a piece of technology you use every day", hints: ["what it is and when you got it","what you use it for","why it is useful for you"], seconds: 90 }
      }
    },
    { id: 'e9', no: 19, stage: 'Elementary', theme: 'Movies & Music', emoji: '🎬',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-19.mp3?v=1",
        title: "Behind the Scenes of a Movie",
        intro: "Listen to an interview with Sophie, who works on a film. Then answer the 20 questions.",
        questions: [
          {"type":"choose","q":"What is Sophie's job?","opts":["Actor","Production assistant","Director"],"a":["Production assistant"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"What is the film called?","opts":["The Secret Garden","The Green House","The Lost Village"],"a":["The Secret Garden"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"Where are most scenes filmed?","opts":["Willow Creek","Studio North","The city centre"],"a":["Willow Creek"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How many people are in the team?","opts":["25","40","45"],"a":["45"],"sec":"Choose the correct answer."},
          {"type":"choose","q":"How long will the film last?","opts":["1 hour 20 minutes","1 hour 40 minutes","2 hours"],"a":["1 hour 40 minutes"],"sec":"Choose the correct answer."},
          {"type":"gap","q":"Sophie's surname: _____","a":["Turner"],"sec":"Spelling."},
          {"type":"gap","q":"The village: _____","a":["Willow Creek"],"sec":"Spelling."},
          {"type":"gap","q":"The studio: _____","a":["Studio North"],"sec":"Spelling."},
          {"type":"gap","q":"The main actor's first name: _____","a":["Oliver"],"sec":"Spelling."},
          {"type":"gap","q":"The main character's name: _____","a":["Leo"],"sec":"Spelling."},
          {"type":"gap","q":"The girl actor's first name: _____","a":["Hannah"],"sec":"Spelling."},
          {"type":"gap","q":"The dog's name: _____","a":["Biscuit"],"sec":"Spelling."},
          {"type":"gap","q":"Filming takes about _____ weeks.","a":["12","twelve","12 weeks","twelve weeks"],"sec":"Numbers and dates."},
          {"type":"gap","q":"The first trailer comes out on the _____ of October.","a":["5th","5","fifth"],"sec":"Numbers and dates."},
          {"type":"gap","q":"The film comes to cinemas on the _____ of December.","a":["18th","18","eighteenth"],"sec":"Numbers and dates."},
          {"type":"gap","q":"Willow Creek is _____ kilometres from the nearest large city.","a":["40","forty","40 kilometres","forty kilometres"],"sec":"Numbers and dates."},
          {"type":"tf","q":"Production assistants only work with actors.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Editors work on the film after filming finishes.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Biscuit always follows instructions immediately.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"The team may film an indoor scene if the weather changes.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Presenter","man":true,"text":"Welcome to Film Makers. Today we're speaking to a production assistant called Sophie Turner. Sophie is S-O-P-H-I-E, and Turner is T-U-R-N-E-R.","answers":[1,6]},
          {"who":"Presenter","man":true,"text":"What does a production assistant do?","answers":[]},
          {"who":"Sophie","man":false,"text":"I help the film team organise daily work. I prepare schedules, check equipment, help actors find the correct places and communicate with different departments. It's busy because many people work together.","answers":[17]},
          {"who":"Presenter","man":true,"text":"What film are you working on?","answers":[]},
          {"who":"Sophie","man":false,"text":"A family adventure film called The Secret Garden. The Secret is T-H-E, then S-E-C-R-E-T. Garden is G-A-R-D-E-N. It's about two children who discover an unusual garden near their grandmother's house.","answers":[2]},
          {"who":"Presenter","man":true,"text":"Where are you filming?","answers":[]},
          {"who":"Sophie","man":false,"text":"Most scenes are filmed in Willow Creek. Willow is W-I-L-L-O-W, and Creek is C-R-E-E-K. It's about forty kilometres from the nearest large city. We also film indoor scenes at Studio North. Studio is S-T-U-D-I-O, and North is N-O-R-T-H.","answers":[3,7,8,16]},
          {"who":"Presenter","man":true,"text":"How long does filming take?","answers":[]},
          {"who":"Sophie","man":false,"text":"About twelve weeks. After that, editors work on the film for several months. They choose the best scenes, add music, improve the sound and prepare the final version.","answers":[13,18]},
          {"who":"Presenter","man":true,"text":"How many people are in the team?","answers":[]},
          {"who":"Sophie","man":false,"text":"About forty-five people, including the director, camera operators, actors, costume designers and sound assistants.","answers":[4]},
          {"who":"Presenter","man":true,"text":"Tell us about the main actors.","answers":[]},
          {"who":"Sophie","man":false,"text":"The main character is played by Oliver James. Oliver is O-L-I-V-E-R, and James is J-A-M-E-S. He plays a boy called Leo. Leo is L-E-O. His sister is played by Hannah Price. Hannah is H-A-N-N-A-H, and Price is P-R-I-C-E.","answers":[9,10,11]},
          {"who":"Presenter","man":true,"text":"Is there an animal in the film?","answers":[]},
          {"who":"Sophie","man":false,"text":"Yes, a small dog called Biscuit. Biscuit is B-I-S-C-U-I-T. He's friendly, but sometimes he doesn't follow instructions. We take a short break and try again.","answers":[12,19]},
          {"who":"Presenter","man":true,"text":"When will the film be released?","answers":[]},
          {"who":"Sophie","man":false,"text":"The cinema release is planned for the eighteenth of December. The first trailer will come out on the fifth of October. The film will last about one hour and forty minutes.","answers":[5,14,15]},
          {"who":"Presenter","man":true,"text":"What is the most difficult part of your job?","answers":[]},
          {"who":"Sophie","man":false,"text":"Keeping everything organised when the weather changes. If it rains during an outdoor scene, we may change the schedule and record an indoor scene instead.","answers":[20]},
          {"who":"Presenter","man":true,"text":"What advice would you give someone interested in films?","answers":[]},
          {"who":"Sophie","man":false,"text":"Be organised, communicate clearly and be ready to learn. There are many jobs behind the camera, not only acting and directing.","answers":[]}
        ]
        // LISTENING JOURNEY END
      },
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
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Movies & Music",
        words: [
          { w: "Movie", uz: "Film", emoji: "🎬", ex: "We watched a funny movie last night." },
          { w: "Actor", uz: "Aktyor", emoji: "🤵", ex: "He is my favourite actor." },
          { w: "Actress", uz: "Aktrisa", emoji: "👩", ex: "The actress in this film is very good." },
          { w: "Comedy", uz: "Komediya", emoji: "😂", ex: "I love comedies because they make me laugh." },
          { w: "Action film", uz: "Jangari film", emoji: "💥", ex: "My brother likes action films." },
          { w: "Cartoon", uz: "Multfilm", emoji: "🐭", ex: "Children love cartoons." },
          { w: "Singer", uz: "Qo'shiqchi", emoji: "🎤", ex: "She is a famous singer." },
          { w: "Song", uz: "Qo'shiq", emoji: "🎵", ex: "This song is on the radio every day." },
          { w: "Lyrics", uz: "Qo'shiq matni", emoji: "📝", ex: "I know all the lyrics of this song." },
          { w: "Favourite character", uz: "Sevimli qahramon", emoji: "🦸", ex: "My favourite character in the film is the little dog." }
        ],
        questions: [
          { q: "What kind of movies do you like?", use: ["I like …","comedies","action films","cartoons","because …"] },
          { q: "Who is your favourite actor or actress?", use: ["My favourite … is …","He / She plays in …"] },
          { q: "What music do you listen to?", use: ["I usually listen to …","pop","rock","folk music"] },
          { q: "Who is your favourite singer?", use: ["My favourite singer is …","I like the song …"] },
          { q: "Do you watch movies at home or at the cinema?", use: ["I usually watch movies …","with my family","because …"] }
        ],
        part2: { topic: "Talk about your favourite movie", hints: ["what the movie is called and what kind of movie it is","who your favourite character is","why you like it (don't tell the ending!)"], seconds: 90 }
      }
    },
    { id: 'e10', no: 20, stage: 'Elementary', theme: 'Weather & Seasons', emoji: '☀️',
      listening: {
        // LISTENING JOURNEY — the teacher's (2026-11-10); made by tools/build-listenings.js from docs/listening-journey-*.json
        src: "audio/skills/listen-step-20.mp3?v=1",
        title: "Weather and Life Around the World",
        intro: "Listen to a radio report about the weather in four cities. Then answer the 20 questions.",
        questions: [
          {"type":"choose","q":"Erik Hansen","opts":["Nairobi","Sydney","Oslo","Tokyo"],"a":["Oslo"],"sec":"Match the reporter with the city."},
          {"type":"choose","q":"Grace Mwangi","opts":["Nairobi","Sydney","Oslo","Tokyo"],"a":["Nairobi"],"sec":"Match the reporter with the city."},
          {"type":"choose","q":"Kenji Sato","opts":["Nairobi","Sydney","Oslo","Tokyo"],"a":["Tokyo"],"sec":"Match the reporter with the city."},
          {"type":"choose","q":"Mia Collins","opts":["Nairobi","Sydney","Oslo","Tokyo"],"a":["Sydney"],"sec":"Match the reporter with the city."},
          {"type":"gap","q":"The presenter's first name: _____","a":["Laura"],"sec":"Spelling."},
          {"type":"gap","q":"The presenter's surname: _____","a":["Smith"],"sec":"Spelling."},
          {"type":"gap","q":"The first name of the reporter in Oslo: _____","a":["Erik"],"sec":"Spelling."},
          {"type":"gap","q":"The surname of the reporter in Nairobi: _____","a":["Mwangi"],"sec":"Spelling."},
          {"type":"gap","q":"The surname of the reporter in Tokyo: _____","a":["Sato"],"sec":"Spelling."},
          {"type":"gap","q":"The Australian city: _____","a":["Sydney"],"sec":"Spelling."},
          {"type":"gap","q":"Oslo today: _____ °C","a":["-3","minus 3","minus three","−3"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"gap","q":"Nairobi today: _____ °C","a":["26","twenty-six"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"gap","q":"Tokyo today: _____ °C","a":["18","eighteen"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"gap","q":"Sydney today: _____ °C","a":["31","thirty-one"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"gap","q":"Nairobi tomorrow: _____ °C","a":["27","twenty-seven"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"gap","q":"Sydney tomorrow: _____ °C","a":["30","thirty"],"sec":"Temperatures today and tomorrow. Write a number."},
          {"type":"tf","q":"Oslo is having a warm and sunny day.","a":["False"],"sec":"True or False?"},
          {"type":"tf","q":"Nairobi's rainy season is expected to begin next month.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"Tokyo is famous for cherry blossoms in spring.","a":["True"],"sec":"True or False?"},
          {"type":"tf","q":"The presenter recommends drinking water on very hot days.","a":["True"],"sec":"True or False?"}
        ],
        transcript: [
          {"who":"Presenter","man":false,"text":"Welcome to World Weather Today. I'm your presenter, Laura Smith. Laura is L-A-U-R-A, and Smith is S-M-I-T-H. Today we're visiting four cities to find out how weather affects daily life.","answers":[5,6]},
          {"who":"Presenter","man":false,"text":"Our first report comes from Oslo, the capital of Norway. Oslo is O-S-L-O. Our reporter is Erik Hansen. Erik is E-R-I-K, and Hansen is H-A-N-S-E-N.","answers":[7]},
          {"who":"Erik","man":true,"text":"Good morning from Oslo! It's a cold winter morning. The temperature is minus three degrees Celsius, and there is light snow. Many people are wearing warm coats, hats and gloves. The roads are slippery, so drivers are moving slowly. Some children have outdoor winter activities at school.","answers":[1,11,17]},
          {"who":"Presenter","man":false,"text":"Thank you. Now let's travel to Nairobi in Kenya. Our reporter is Grace Mwangi. Grace is G-R-A-C-E, and Mwangi is M-W-A-N-G-I.","answers":[8]},
          {"who":"Grace","man":false,"text":"Hello from Nairobi! It's warm and sunny. The temperature is twenty-six degrees. Many people enjoy spending time outside. The rainy season is expected to begin next month, so people are preparing their gardens and checking their roofs.","answers":[2,12,18]},
          {"who":"Presenter","man":false,"text":"Our next stop is Tokyo, Japan. Tokyo is T-O-K-Y-O. Our reporter is Kenji Sato. Kenji is K-E-N-J-I, and Sato is S-A-T-O.","answers":[9]},
          {"who":"Kenji","man":true,"text":"Good afternoon from Tokyo. It's cloudy and eighteen degrees. There is a light wind, but no rain. The stations are busy because many people travel by train. In spring, Tokyo is famous for its cherry blossoms. Visitors go to parks to see the flowers and take photographs.","answers":[3,13,19]},
          {"who":"Presenter","man":false,"text":"Finally, let's visit Sydney in Australia. Sydney is S-Y-D-N-E-Y. Our reporter is Mia Collins. Mia is M-I-A, and Collins is C-O-L-L-I-N-S.","answers":[10]},
          {"who":"Mia","man":false,"text":"Hello from Sydney! It's a bright summer day. The temperature is thirty-one degrees. Many people are going to the beach, swimming or having lunch outside. In summer, it can become very hot. People should drink water, use sun protection and look for shade during the hottest part of the day.","answers":[4,14]},
          {"who":"Presenter","man":false,"text":"Thank you to all our reporters. Weather can be very different around the world. In one city, people may wear winter coats, while in another, they enjoy a sunny day at the beach.","answers":[]},
          {"who":"Presenter","man":false,"text":"Weather affects transport, school activities, work and travel plans. Before leaving home, it's useful to check the forecast and choose suitable clothes. Take an umbrella if rain is expected. Wear warm clothes in cold weather. On very hot days, drink enough water and avoid staying in the sun for too long.","answers":[20]},
          {"who":"Presenter","man":false,"text":"Here are tomorrow's temperatures. Oslo will be minus one degree. Nairobi will be twenty-seven degrees. Tokyo will be nineteen degrees, and Sydney will be thirty degrees.","answers":[15,16]},
          {"who":"Presenter","man":false,"text":"That's all for World Weather Today. Thank you for listening!","answers":[]}
        ]
        // LISTENING JOURNEY END
      },
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
      },
      speaking: {
        // the teacher's Speaking Journey (2026-11-09) — made by tools/build-speaking.js from docs/speaking-journey-11-20.json
        topic: "Weather & Seasons",
        words: [
          { w: "Sunny", uz: "Quyoshli", emoji: "☀️", ex: "It is sunny today, so we can play outside." },
          { w: "Cloudy", uz: "Bulutli", emoji: "☁️", ex: "The sky is cloudy this morning." },
          { w: "Rainy", uz: "Yomg'irli", emoji: "🌧️", ex: "Take an umbrella. It's a rainy day." },
          { w: "Windy", uz: "Shamolli", emoji: "🌬️", ex: "It's very windy near the sea." },
          { w: "Snowy", uz: "Qorli", emoji: "❄️", ex: "In winter it is snowy in the mountains." },
          { w: "Warm", uz: "Iliq", emoji: "🌡️", ex: "Spring is warm in my country." },
          { w: "Cold", uz: "Sovuq", emoji: "🥶", ex: "It's cold in January." },
          { w: "Season", uz: "Fasl", emoji: "🍂", ex: "Autumn is my favourite season." },
          { w: "Weather forecast", uz: "Ob-havo ma'lumoti", emoji: "📺", ex: "The weather forecast says it will rain tomorrow." },
          { w: "Temperature", uz: "Harorat", emoji: "🌡️", ex: "The temperature is 35 degrees today." }
        ],
        questions: [
          { q: "What is the weather like today?", use: ["Today it is …","sunny","cloudy","cold","warm"] },
          { q: "What is your favourite season? Why?", use: ["My favourite season is … because …"] },
          { q: "What do you do on a rainy day?", use: ["On a rainy day, I …","stay at home","watch films"] },
          { q: "Do you like snowy weather?", use: ["Yes, I do, because …","No, I don't, because …","cold"] },
          { q: "Do you watch the weather forecast?", use: ["Yes, I watch it …","It tells me the temperature"] }
        ],
        part2: { topic: "Talk about your favourite season", hints: ["what the weather and temperature are like","what you do in this season","why you love it"], seconds: 90 }
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
