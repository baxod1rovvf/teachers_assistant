// Skills course (2026-11-04): the content of every level — Elementary, 10 levels, four skills each.
// Read by the student page (skill.html) and by Loom's Course tab. English names and places only (the teacher's rule).
//
// listening: src = the recording (made with tools/make-course-audio.py from audio/skills/elementary-scripts.json —
//   keep `transcript` in step with that file; a spelled line is written as the recording says it: "That's T, H, …").
//   questions[i].a = accepted answers, the first is the one shown as right. transcript[].answers = the question
//   numbers (1–10) whose answer is said in that line.
// reading: text = sentences; `line` is a sentence's index when the text is split with /(?<=[.!?])\s+/
//   (a blank line between paragraphs is fine). tfng answers are 'True' / 'False' / 'Not given'; choose answers are
//   the option's own text.
// speaking: questions[i] = { q, use: words the student can use }. Nothing is recorded or sent.
// A level with only { no, theme, emoji } is "Coming soon".

var TA_SKILLS = {
  elementary: {
    title: 'Elementary',
    levels: [
      {
        no: 1, theme: 'Meeting people', emoji: '👋',
        listening: {
          src: 'audio/skills/elem-1-listening.mp3',
          title: 'Checking in at a hotel',
          intro: 'Listen to a man checking in at a hotel. Complete the form. Write ONE WORD or A NUMBER for each answer.',
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
            { w: 'booking', m: 'a room or a table you ask for before you arrive', ex: "I've got a booking for tonight." },
            { w: 'surname', m: 'your family name', ex: 'My surname is Thompson.' },
            { w: 'spell', m: 'to say the letters of a word one by one', ex: 'Could you spell your surname, please?' },
            { w: 'floor', m: 'one level of a building', ex: "Your room is on the second floor." },
            { w: 'stay', m: 'to live in a place for a short time', ex: "You're staying with us for three nights." },
            { w: 'ground floor', m: 'the level of a building that is on the street', ex: 'The restaurant is on the ground floor.' },
            { w: 'car park', m: 'a place where you leave your car', ex: 'Our car park is behind the hotel.' },
            { w: 'behind', m: 'at the back of something', ex: 'The car park is behind the hotel.' },
            { w: 'opposite', m: 'on the other side of the street from something', ex: "There's a supermarket opposite the hotel." },
            { w: 'check-out', m: 'the time when you leave a hotel and give back the key', ex: "Check-out is at eleven o'clock." }
          ],
          transcript: [
            { who: 'Woman', text: 'Level one. You will hear a conversation at a hotel. Listen and complete the form.', answers: [] },
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
            { who: 'Woman', text: 'Thank you. And where are you from?', answers: [] },
            { who: 'Man', text: "I'm from Brighton, on the south coast. I'm here for work this week.", answers: [5] },
            { who: 'Woman', text: "How nice. And you're staying with us for three nights, is that right?", answers: [6] },
            { who: 'Man', text: "Yes, that's right, three nights. What time is breakfast in the morning?", answers: [6] },
            { who: 'Woman', text: 'Breakfast starts at seven thirty, in the restaurant on the ground floor.', answers: [7] },
            { who: 'Man', text: 'Lovely. And where can I leave my car?', answers: [] },
            { who: 'Woman', text: 'Our car park is behind the hotel, on Kingsley Street.', answers: [8] },
            { who: 'Man', text: 'Sorry, could you spell the name of the street for me?', answers: [] },
            { who: 'Woman', text: "That's K, I, N, G, S, L, E, Y.", answers: [8] },
            { who: 'Man', text: 'Thanks. Is there a shop near here? I need a few things.', answers: [] },
            { who: 'Woman', text: "Yes, there's a big supermarket opposite the hotel. It's open until ten in the evening.", answers: [9] },
            { who: 'Man', text: "That's very useful. And what time is check-out on my last day?", answers: [] },
            { who: 'Woman', text: "Check-out is at eleven o'clock in the morning. Here's your key, and enjoy your stay!", answers: [10] },
            { who: 'Man', text: "Thank you very much. You've been very kind.", answers: [] }
          ]
        },
        reading: {
          title: "A pen-friend's profile",
          text: "Hi, my name is Lucy Green and I'm fifteen years old. I live in Bristol, a big city in the west of England. " +
            "I live in a small flat with my mum, my dad and my little brother, Sam. Sam is eight and he loves football.\n\n" +
            "I go to Hillside School, and my favourite subject is art. I don't really like maths, because it's difficult for me. " +
            "After school, I usually walk my dog, Biscuit, in the park near our flat. He's brown and white, and he's very friendly.\n\n" +
            "At the weekend, I play the guitar and I sometimes go swimming with my friends. I'm learning Spanish too, and I want to visit Spain one day. " +
            "My favourite food is pizza, but I can't cook it!\n\n" +
            "I'm looking for a pen-friend from another country. I'd like to write emails in English every week and learn about your life. " +
            "Please write to me soon!",
          questions: [
            { type: 'tfng', q: 'Lucy lives in a big city.', a: ['True'], line: 1 },
            { type: 'tfng', q: 'Lucy has a sister.', a: ['False'], line: 2 },
            { type: 'tfng', q: 'Sam plays in a football team.', a: ['Not given'], line: 3 },
            { type: 'tfng', q: 'Lucy likes maths.', a: ['False'], line: 5 },
            { type: 'tfng', q: "Lucy's dog is friendly.", a: ['True'], line: 7 },
            { type: 'gap', q: 'Lucy lives in a small _____ with her family.', a: ['flat'], line: 2 },
            { type: 'gap', q: "Lucy's favourite subject at school is _____.", a: ['art'], line: 4 },
            { type: 'gap', q: 'After school, Lucy walks her dog in the _____.', a: ['park'], line: 6 },
            { type: 'gap', q: 'Lucy wants a pen-friend from another _____.', a: ['country'], line: 11 },
            { type: 'gap', q: 'Lucy would like to write _____ in English every week.', a: ['emails', 'email'], line: 12 },
            { type: 'choose', q: 'How old is Lucy?', opts: ['thirteen', 'fifteen', 'eighteen'], a: ['fifteen'], line: 0 },
            { type: 'choose', q: 'Who is Biscuit?', opts: ["Lucy's brother", "Lucy's dog", "Lucy's friend"], a: ["Lucy's dog"], line: 6 },
            { type: 'choose', q: 'What does Lucy do at the weekend?', opts: ['She plays the guitar.', 'She plays football.', 'She cooks pizza.'], a: ['She plays the guitar.'], line: 8 },
            { type: 'choose', q: 'Which language is Lucy learning?', opts: ['French', 'Spanish', 'German'], a: ['Spanish'], line: 9 },
            { type: 'choose', q: "What is Lucy's favourite food?", opts: ['pasta', 'fish and chips', 'pizza'], a: ['pizza'], line: 10 }
          ],
          words: [
            { w: 'pen-friend', m: 'a friend in another place who you write to', ex: "I'm looking for a pen-friend from another country." },
            { w: 'profile', m: 'a short text about a person', ex: "Read Lucy's profile and answer the questions." },
            { w: 'flat', m: 'a home on one floor of a bigger building', ex: 'I live in a small flat with my family.' },
            { w: 'subject', m: 'something you study at school, like maths or art', ex: 'My favourite subject is art.' },
            { w: 'favourite', m: 'the one you like best', ex: 'My favourite food is pizza.' },
            { w: 'difficult', m: 'not easy', ex: "I don't really like maths, because it's difficult for me." },
            { w: 'usually', m: 'on most days; most of the time', ex: 'After school, I usually walk my dog.' },
            { w: 'friendly', m: 'kind and nice to people', ex: "He's brown and white, and he's very friendly." },
            { w: 'sometimes', m: 'not always, but on some days', ex: 'I sometimes go swimming with my friends.' },
            { w: 'country', m: 'a nation, like England or Spain', ex: 'I want a pen-friend from another country.' }
          ]
        },
        writing: {
          topic: 'About me',
          task: 'Write an email to a new pen-friend about yourself.',
          points: ['your name, your age and where you live', 'your family or your friends', 'what you like doing in your free time'],
          minWords: 40, maxWords: 60, minutes: 15
        },
        speaking: {
          words: [
            { w: 'name', emoji: '📛', ex: 'My name is Anna.' },
            { w: 'years old', emoji: '🎂', ex: "I'm fourteen years old." },
            { w: 'come from', emoji: '🌍', ex: 'I come from a small town.' },
            { w: 'live', emoji: '🏠', ex: 'I live in a flat with my family.' },
            { w: 'family', emoji: '👨‍👩‍👧', ex: "There are four people in my family." },
            { w: 'student', emoji: '🎒', ex: "I'm a student at a big school." },
            { w: 'free time', emoji: '⚽', ex: 'In my free time, I play football.' },
            { w: 'favourite', emoji: '❤️', ex: 'My favourite colour is blue.' },
            { w: 'best friend', emoji: '🤝', ex: 'My best friend is very funny.' },
            { w: 'speak', emoji: '🗣️', ex: 'I speak two languages.' }
          ],
          questions: [
            { q: "What's your name?", use: ['My name is …', 'You can call me …'] },
            { q: 'Where are you from?', use: ["I'm from …", 'I come from …'] },
            { q: 'Who do you live with?', use: ['I live with my …', 'mum', 'dad', 'brother', 'sister'] },
            { q: 'Are you a student, or do you work?', use: ["I'm a student at …", 'I work at …', 'My favourite subject is …'] },
            { q: 'What do you like doing in your free time?', use: ['I like …ing', 'In my free time, I …', 'at the weekend'] }
          ],
          part2: {
            topic: 'Talk about yourself',
            hints: ['your name, your age and where you are from', 'your family and your home', 'what you like doing in your free time'],
            seconds: 45
          }
        }
      },
      { no: 2, theme: 'Family & friends', emoji: '👨‍👩‍👧' },
      { no: 3, theme: 'My home', emoji: '🏠' },
      { no: 4, theme: 'My day', emoji: '⏰' },
      { no: 5, theme: 'Food & cafés', emoji: '🍕' },
      { no: 6, theme: 'Shopping', emoji: '🛍️' },
      { no: 7, theme: 'My town', emoji: '🏙️' },
      { no: 8, theme: 'Free time', emoji: '🎨' },
      { no: 9, theme: 'Travel', emoji: '🚆' },
      { no: 10, theme: 'Weather & holidays', emoji: '☀️' }
    ]
  }
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
