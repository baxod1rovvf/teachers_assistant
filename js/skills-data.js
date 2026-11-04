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
          src: 'audio/skills/elem-1-listening.mp3?v=4',
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
            { type: 'tfng', q: 'Lucy lives with her grandparents.', a: ['False'], line: 2 },
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
      {
        no: 2, theme: 'Family & friends', emoji: '👨‍👩‍👧',
        listening: {
          src: 'audio/skills/elem-2-listening.mp3?v=4',
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
            { w: 'join', m: 'to become a member of a club or a group', ex: "I'd like to join the club with my son." },
            { w: 'keen on', m: 'liking something very much', ex: "He's very keen on sport." },
            { w: 'form', m: 'a paper or a page where you write information about yourself', ex: "I'll fill in the form for you." },
            { w: 'son', m: 'a boy who is your child', ex: "What's your son's name?" },
            { w: 'energy', m: 'the power to be busy and active for a long time', ex: "He's got lots of energy!" },
            { w: 'best friend', m: 'the friend you like most', ex: 'His best friend goes to your swimming club too.' },
            { w: 'lesson', m: 'a time when someone teaches you something', ex: 'Our swimming lessons for children are on Saturday mornings.' },
            { w: 'free', m: 'not busy; with time to do something', ex: "We're free at the weekend." },
            { w: 'a month', m: 'for each month', ex: "It's thirty pounds a month." },
            { w: 'membership card', m: 'a card that shows you are a member of a club', ex: 'Please bring a photo for his membership card.' }
          ],
          transcript: [
            { who: 'Woman', text: 'Level two. You will hear a conversation at a sports club. Listen and complete the form.', answers: [] },
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
          text: "My name is Emma Baker and I'm sixteen. There are five people in my family: my mum, my dad, my two brothers and me. " +
            "We also have a cat called Pepper.\n\n" +
            "My mum, Sarah, is a teacher at a primary school. She's kind and very patient. " +
            "My dad, Mark, works in a bank in the city centre. He gets up very early, but he always makes breakfast for us.\n\n" +
            "My older brother, Daniel, is twenty and he studies music at university in Leeds. He only comes home in the holidays, so I miss him. " +
            "My younger brother, Ben, is ten. He's funny, but he's sometimes very noisy!\n\n" +
            "My grandparents live in a village near the sea. We visit them every month, and my grandma always makes a big chocolate cake. " +
            "My best friend is Chloe, and she lives in the next street. We go to the same school and we sit next to each other in every lesson. " +
            "On Fridays, we watch films together at her house and eat lots of popcorn.",
          questions: [
            { type: 'tfng', q: 'Emma has got two brothers.', a: ['True'], line: 1 },
            { type: 'tfng', q: "Emma's mum works in a bank.", a: ['False'], line: 3 },
            { type: 'tfng', q: 'Daniel plays the piano.', a: ['Not given'], line: 7 },
            { type: 'tfng', q: "Emma's grandparents live in a big city.", a: ['False'], line: 11 },
            { type: 'tfng', q: 'Emma and Chloe go to the same school.', a: ['True'], line: 14 },
            { type: 'gap', q: "Emma's family has got a cat called _____.", a: ['Pepper'], line: 2 },
            { type: 'gap', q: "Emma's dad works in a _____ in the city centre.", a: ['bank'], line: 5 },
            { type: 'gap', q: 'Daniel studies music at _____ in Leeds.', a: ['university'], line: 7 },
            { type: 'gap', q: 'Ben is _____ years old.', a: ['ten', '10'], line: 9 },
            { type: 'gap', q: 'Emma\'s grandma always makes a big chocolate _____.', a: ['cake'], line: 12 },
            { type: 'choose', q: 'How old is Emma?', opts: ['fifteen', 'sixteen', 'seventeen'], a: ['sixteen'], line: 0 },
            { type: 'choose', q: "What is Emma's mum like?", opts: ['kind and patient', 'funny and noisy', 'quiet and shy'], a: ['kind and patient'], line: 4 },
            { type: 'choose', q: "What does Emma's dad do every morning?", opts: ['He makes breakfast.', 'He goes swimming.', 'He walks the cat.'], a: ['He makes breakfast.'], line: 6 },
            { type: 'choose', q: 'How often does Emma visit her grandparents?', opts: ['every week', 'every month', 'every year'], a: ['every month'], line: 12 },
            { type: 'choose', q: 'What do Emma and Chloe do on Fridays?', opts: ['They watch films.', 'They play tennis.', 'They cook dinner.'], a: ['They watch films.'], line: 15 }
          ],
          words: [
            { w: 'primary school', m: 'a school for children from about five to eleven years old', ex: 'My mum is a teacher at a primary school.' },
            { w: 'patient', m: 'calm; not angry when you have to wait or help someone', ex: "She's kind and very patient." },
            { w: 'city centre', m: 'the main part of a city, with shops and offices', ex: 'My dad works in a bank in the city centre.' },
            { w: 'early', m: 'before the usual time; at the start of the day', ex: 'He gets up very early.' },
            { w: 'older', m: 'born before someone else', ex: 'My older brother, Daniel, is twenty.' },
            { w: 'university', m: 'a place where people study after school', ex: 'He studies music at university in Leeds.' },
            { w: 'miss', m: 'to feel sad because someone is not with you', ex: 'He only comes home in the holidays, so I miss him.' },
            { w: 'noisy', m: 'making a lot of sound', ex: "He's funny, but he's sometimes very noisy!" },
            { w: 'village', m: 'a very small town in the countryside', ex: 'My grandparents live in a village near the sea.' },
            { w: 'next to', m: 'very near; at the side of', ex: 'We sit next to each other in every lesson.' }
          ]
        },
        writing: {
          topic: 'My family',
          task: 'Write an email to a pen-friend about your family.',
          points: ['who is in your family', 'what each person is like and what they do', 'what you do together at the weekend'],
          minWords: 40, maxWords: 60, minutes: 15
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
        no: 3, theme: 'My home', emoji: '🏠',
        listening: {
          src: 'audio/skills/elem-3-listening.mp3?v=4',
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
            { w: 'advert', m: 'a short text that tells people about something to buy or rent', ex: "I'm calling about the room in your advert." },
            { w: 'owner', m: 'the person something belongs to', ex: "I'm the owner of the house." },
            { w: 'rent', m: 'the money you pay every month to live in a place', ex: 'The rent is four hundred and fifty pounds a month.' },
            { w: 'top floor', m: 'the highest level of a building', ex: "It's on the top floor." },
            { w: 'view', m: 'what you can see from a window or a place', ex: 'It has a lovely view of the garden.' },
            { w: 'furniture', m: 'things like beds, tables and chairs', ex: 'Is there any furniture in the room?' },
            { w: 'wardrobe', m: 'a tall cupboard for your clothes', ex: "There's a big wardrobe for your clothes." },
            { w: 'bills', m: 'money you pay for things like water and electricity', ex: 'That includes the bills.' },
            { w: 'share', m: 'to have or use something together with other people', ex: 'You share the bathroom with two other people.' },
            { w: 'tidy', m: 'clean, with everything in its place', ex: "They're both students, and they're very tidy." }
          ],
          transcript: [
            { who: 'Woman', text: 'Level three. You will hear a phone call about a room to rent. Listen and complete the notes.', answers: [] },
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
          text: "Tom Parker lives with his parents in a house in the countryside, near York. " +
            "The house is old and it has got three bedrooms, a big kitchen and a living room with a fireplace. " +
            "Tom's favourite room is the kitchen, because the family eats and talks there every evening. " +
            "Behind the house, there is a large garden with apple trees. " +
            "The nearest shop is three kilometres away, so Tom's mum drives to the supermarket once a week. " +
            "Tom loves the quiet, but there isn't a bus to his school, so he cycles there every day.\n\n" +
            "Grace Turner lives in a flat on the ninth floor of a tall building in Manchester. " +
            "The flat is small and modern, with one bedroom, a bathroom and an open kitchen. " +
            "There isn't a garden, but there is a balcony with lots of plants. " +
            "From the balcony, Grace can see the whole city at night. " +
            "Her flat is very close to shops, cafés and a cinema. " +
            "The only problem is the noise from the street, so she sometimes sleeps with earplugs. " +
            "Grace says she never wants to live in the countryside, because she loves the busy city life.",
          questions: [
            { type: 'tfng', q: "Tom's house is new.", a: ['False'], line: 1 },
            { type: 'tfng', q: "Tom's family eats in the kitchen.", a: ['True'], line: 2 },
            { type: 'tfng', q: "Tom's school is in York.", a: ['Not given'], line: 5 },
            { type: 'tfng', q: "Grace's flat has got a garden.", a: ['False'], line: 8 },
            { type: 'tfng', q: "Grace's flat is near a cinema.", a: ['True'], line: 10 },
            { type: 'gap', q: "Tom's house has got three _____.", a: ['bedrooms'], line: 1 },
            { type: 'gap', q: 'There are apple trees in the _____ behind the house.', a: ['garden'], line: 3 },
            { type: 'gap', q: "Tom cycles to school because there isn't a _____.", a: ['bus'], line: 5 },
            { type: 'gap', q: 'Grace has got lots of _____ on her balcony.', a: ['plants'], line: 8 },
            { type: 'gap', q: 'Because of the noise, Grace sometimes sleeps with _____.', a: ['earplugs'], line: 11 },
            { type: 'choose', q: 'Where does Tom live?', opts: ['in a city', 'in the countryside', 'by the sea'], a: ['in the countryside'], line: 0 },
            { type: 'choose', q: "How often does Tom's mum go to the supermarket?", opts: ['every day', 'once a week', 'once a month'], a: ['once a week'], line: 4 },
            { type: 'choose', q: "Which floor is Grace's flat on?", opts: ['the third floor', 'the fifth floor', 'the ninth floor'], a: ['the ninth floor'], line: 6 },
            { type: 'choose', q: 'What can Grace see from her balcony at night?', opts: ['the sea', 'the whole city', 'the mountains'], a: ['the whole city'], line: 9 },
            { type: 'choose', q: 'What does Grace think about the countryside?', opts: ['She never wants to live there.', 'She wants to live there one day.', 'She goes there every weekend.'], a: ['She never wants to live there.'], line: 12 }
          ],
          words: [
            { w: 'countryside', m: 'land with fields and farms, away from towns', ex: 'Tom lives in a house in the countryside.' },
            { w: 'fireplace', m: 'a place in a wall where you can have a fire', ex: 'The living room has a fireplace.' },
            { w: 'large', m: 'big', ex: 'There is a large garden with apple trees.' },
            { w: 'nearest', m: 'the one that is closest to you', ex: 'The nearest shop is three kilometres away.' },
            { w: 'once a week', m: 'one time every week', ex: "Tom's mum drives to the supermarket once a week." },
            { w: 'cycle', m: 'to ride a bike', ex: 'He cycles to school every day.' },
            { w: 'modern', m: 'new and in today\'s style', ex: 'The flat is small and modern.' },
            { w: 'balcony', m: 'a small place outside a flat, above the street, where you can stand or sit', ex: 'There is a balcony with lots of plants.' },
            { w: 'close to', m: 'near', ex: 'Her flat is very close to shops.' },
            { w: 'noise', m: 'a loud sound that you don\'t like', ex: 'The only problem is the noise from the street.' }
          ]
        },
        writing: {
          topic: 'My home',
          task: 'Write an email to a friend about your home.',
          points: ['where your home is and what kind of home it is', 'the rooms in your home', 'your favourite room and why you like it'],
          minWords: 40, maxWords: 60, minutes: 15
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
        no: 4, theme: 'My day', emoji: '⏰',
        listening: {
          src: 'audio/skills/elem-4-listening.mp3?v=4',
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
            { w: 'surgery', m: 'the place where you go to see a doctor', ex: 'Good morning, Oakfield Surgery.' },
            { w: 'appointment', m: 'a time when you agree to see someone, for example a doctor', ex: "I'd like to make an appointment with a doctor." },
            { w: 'usually', m: 'on most days; most of the time', ex: 'Which doctor do you usually see?' },
            { w: 'headache', m: 'a pain in your head', ex: "I've had a bad headache every afternoon." },
            { w: 'work too hard', m: 'to work a lot and get very tired', ex: "I think I'm working too hard." },
            { w: 'finish work', m: 'to stop working at the end of the day', ex: 'I finish work at four o\'clock.' },
            { w: 'meeting', m: 'a time when people come together to talk about work', ex: 'On Mondays, we always have a long meeting.' },
            { w: 'medicine', m: 'something you take when you are ill, to get better', ex: 'Please bring any medicine you take at the moment.' },
            { w: 'arrive', m: 'to get to a place', ex: 'Please arrive ten minutes early.' },
            { w: 'park', m: 'to leave your car in a place', ex: "It's better to park next to the library." }
          ],
          transcript: [
            { who: 'Woman', text: "Level four. You will hear a phone call to a doctor's surgery. Listen and complete the notes.", answers: [] },
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
          text: "Hannah Clarke is a nurse at a children's hospital in Liverpool. " +
            "She works long days, from half past seven in the morning until eight o'clock in the evening. " +
            "She works four days a week, so she has three days off.\n\n" +
            "On work days, Hannah gets up at six o'clock, when it is still dark in winter. " +
            "She has a quick shower and a cup of tea, but she never eats breakfast at home. " +
            "She takes the bus to the hospital, and the journey takes about forty minutes. " +
            "She often reads a book on the bus, or she listens to music.\n\n" +
            "At the hospital, Hannah checks the children and gives them their medicine. " +
            "She also talks to the parents, because they are often worried. " +
            "At lunchtime, she eats a sandwich with the other nurses in a small kitchen. " +
            "The afternoons are usually the busiest part of the day, with lots of new patients.\n\n" +
            "When she gets home, Hannah is very tired. " +
            "She has dinner with her husband, Chris, and then she goes to bed at about ten o'clock. " +
            "On her days off, she sleeps late, goes to a yoga class and visits her sister. " +
            "Hannah says her job is hard, but she loves it, because she helps children every day.",
          questions: [
            { type: 'tfng', q: 'Hannah works at a hospital for children.', a: ['True'], line: 0 },
            { type: 'tfng', q: 'Hannah works five days a week.', a: ['False'], line: 2 },
            { type: 'tfng', q: 'Hannah drives to the hospital.', a: ['False'], line: 5 },
            { type: 'tfng', q: 'Hannah is tired when she gets home.', a: ['True'], line: 11 },
            { type: 'tfng', q: "Hannah's husband is a doctor.", a: ['Not given'], line: 12 },
            { type: 'gap', q: 'On work days, Hannah gets up at _____ o\'clock.', a: ['six', '6'], line: 3 },
            { type: 'gap', q: 'Hannah never eats _____ at home.', a: ['breakfast'], line: 4 },
            { type: 'gap', q: 'Hannah often reads a _____ on the bus.', a: ['book'], line: 6 },
            { type: 'gap', q: 'At lunchtime, Hannah eats a _____ with the other nurses.', a: ['sandwich'], line: 9 },
            { type: 'gap', q: 'On her days off, Hannah goes to a _____ class.', a: ['yoga'], line: 13 },
            { type: 'choose', q: 'When does Hannah finish work?', opts: ["at six o'clock in the evening", "at eight o'clock in the evening", "at ten o'clock in the evening"], a: ["at eight o'clock in the evening"], line: 1 },
            { type: 'choose', q: "How long is Hannah's journey to the hospital?", opts: ['about twenty minutes', 'about forty minutes', 'about an hour'], a: ['about forty minutes'], line: 5 },
            { type: 'choose', q: 'Why does Hannah talk to the parents?', opts: ['They are often worried.', 'They want to be nurses.', 'They bring her lunch.'], a: ['They are often worried.'], line: 8 },
            { type: 'choose', q: 'When is Hannah busiest at work?', opts: ['in the morning', 'at lunchtime', 'in the afternoon'], a: ['in the afternoon'], line: 10 },
            { type: 'choose', q: 'Why does Hannah love her job?', opts: ['She helps children every day.', 'She has long holidays.', 'The work is easy.'], a: ['She helps children every day.'], line: 14 }
          ],
          words: [
            { w: 'nurse', m: 'a person whose job is to look after people who are ill', ex: "Hannah is a nurse at a children's hospital." },
            { w: 'days off', m: 'days when you don\'t go to work', ex: 'She has three days off every week.' },
            { w: 'quick', m: 'fast; not taking a long time', ex: 'She has a quick shower.' },
            { w: 'journey', m: 'the time you spend going from one place to another', ex: 'The journey takes about forty minutes.' },
            { w: 'check', m: 'to look at something or someone to see if everything is OK', ex: 'Hannah checks the children every morning.' },
            { w: 'worried', m: 'unhappy because you think something bad can happen', ex: 'The parents are often worried.' },
            { w: 'lunchtime', m: 'the time in the middle of the day when people eat', ex: 'At lunchtime, she eats a sandwich.' },
            { w: 'busiest', m: 'with the most things to do', ex: 'The afternoons are the busiest part of the day.' },
            { w: 'patient', m: 'a person who is ill and sees a doctor or a nurse', ex: 'There are lots of new patients in the afternoon.' },
            { w: 'sleep late', m: 'to get up later than usual in the morning', ex: 'On her days off, she sleeps late.' }
          ]
        },
        writing: {
          topic: 'My weekday',
          task: 'Write a short text about a normal weekday in your life.',
          points: ['what time you get up and what you do in the morning', 'what you do in the afternoon', 'what you do in the evening and when you go to bed'],
          minWords: 50, maxWords: 70, minutes: 20
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
        no: 5, theme: 'Food & cafés', emoji: '🍕',
        listening: {
          src: 'audio/skills/elem-5-listening.mp3?v=4',
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
            { w: 'order', m: 'to ask for food or drink that you want to buy', ex: "I'd like to order some food for a party." },
            { w: 'birthday party', m: 'a party on the day someone was born', ex: "It's for my daughter's birthday party." },
            { w: 'daughter', m: 'a girl who is your child', ex: "Please write Rosie. That's my daughter's name." },
            { w: 'sunny', m: 'bright, with a lot of light from the sun', ex: "The garden room is big and sunny." },
            { w: 'each', m: 'for one of them', ex: "They're eight pounds each." },
            { w: 'enough', m: 'as much as you need', ex: 'One pizza is enough for three children.' },
            { w: 'anything else', m: 'some other thing', ex: 'Have you got anything else?' },
            { w: 'popular', m: 'liked by a lot of people', ex: 'Our chocolate cake is very popular.' },
            { w: 'total', m: 'all the money added together', ex: 'The total is one hundred and twenty pounds.' },
            { w: 'pay', m: 'to give money for something you buy', ex: 'Can I pay on the day?' }
          ],
          transcript: [
            { who: 'Woman', text: 'Level five. You will hear a phone call to a café. Listen and complete the order form.', answers: [] },
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
          text: "The Blue Door Café is a small family café on Market Street in Bath. " +
            "It is open every day from eight in the morning until six in the evening.\n\n" +
            "Breakfast is served until eleven o'clock. " +
            "The full English breakfast costs £7.50, and pancakes with fresh fruit cost £5. " +
            "For lunch, there is soup of the day with bread for £4.50, a chicken salad for £6 and fish and chips for £8.95. " +
            "Children under ten can have a small plate of any dish for half price. " +
            "Tea is £2 and a large hot chocolate is £3.20.\n\n" +
            "Here is a review from a customer, Oliver Grant. " +
            "My wife and I had lunch at the Blue Door Café last Saturday. " +
            "It was very busy, so we waited fifteen minutes for a table. " +
            "The waiter was friendly, and he brought us some bread while we waited. " +
            "I had the fish and chips, and my wife had the soup. " +
            "The fish was hot and fresh, but the chips were a bit cold. " +
            "My wife loved her soup, and she asked the waiter for the recipe! " +
            "The best thing was the dessert: a lemon cake made by the owner's grandmother. " +
            "The prices are good, and the café is clean and bright. " +
            "Next time, we want to come for breakfast and try the pancakes. " +
            "I give the Blue Door Café four stars out of five.",
          questions: [
            { type: 'tfng', q: 'The café is open on Sundays.', a: ['True'], line: 1 },
            { type: 'tfng', q: "You can order breakfast at twelve o'clock.", a: ['False'], line: 2 },
            { type: 'tfng', q: 'Children under ten pay less for a small plate.', a: ['True'], line: 5 },
            { type: 'tfng', q: 'Oliver and his wife sat at a table by the window.', a: ['Not given'], line: 9 },
            { type: 'tfng', q: "Oliver's chips were hot.", a: ['False'], line: 12 },
            { type: 'gap', q: 'The café is on _____ Street.', a: ['Market'], line: 0 },
            { type: 'gap', q: 'The pancakes come with fresh _____.', a: ['fruit'], line: 3 },
            { type: 'gap', q: 'Oliver and his wife waited _____ minutes for a table.', a: ['fifteen', '15'], line: 9 },
            { type: 'gap', q: "Oliver's wife asked for the _____ of the soup.", a: ['recipe'], line: 13 },
            { type: 'gap', q: "The lemon cake was made by the owner's _____.", a: ['grandmother'], line: 14 },
            { type: 'choose', q: 'How much is the chicken salad?', opts: ['£4.50', '£6', '£8.95'], a: ['£6'], line: 4 },
            { type: 'choose', q: 'How much is a large hot chocolate?', opts: ['£2', '£3.20', '£5'], a: ['£3.20'], line: 6 },
            { type: 'choose', q: 'What did Oliver eat?', opts: ['the soup', 'fish and chips', 'pancakes'], a: ['fish and chips'], line: 11 },
            { type: 'choose', q: 'What was the best thing about the meal, for Oliver?', opts: ['the lemon cake', 'the bread', 'the hot chocolate'], a: ['the lemon cake'], line: 14 },
            { type: 'choose', q: 'How many stars does Oliver give the café?', opts: ['three', 'four', 'five'], a: ['four'], line: 17 }
          ],
          words: [
            { w: 'menu', m: 'a list of the food and drinks in a café or a restaurant', ex: 'Read the menu and choose your lunch.' },
            { w: 'served', m: 'given to customers in a café or a restaurant', ex: "Breakfast is served until eleven o'clock." },
            { w: 'fresh', m: 'new and made or picked not long ago', ex: 'Pancakes come with fresh fruit.' },
            { w: 'dish', m: 'one kind of food on a menu', ex: 'Children can have a small plate of any dish.' },
            { w: 'half price', m: 'for half of the usual money', ex: 'Children under ten can eat for half price.' },
            { w: 'review', m: 'a text where someone says what they think about a place, a film or a book', ex: 'Here is a review from a customer.' },
            { w: 'waiter', m: 'a person who brings food and drinks to the tables', ex: 'The waiter was friendly.' },
            { w: 'a bit', m: 'a little', ex: 'The chips were a bit cold.' },
            { w: 'recipe', m: 'instructions that tell you how to cook something', ex: 'She asked the waiter for the recipe!' },
            { w: 'dessert', m: 'sweet food you eat at the end of a meal', ex: 'The best thing was the dessert.' }
          ]
        },
        writing: {
          topic: 'My favourite meal',
          task: 'Write a short text about your favourite meal.',
          points: ['what the meal is and what is in it', 'who makes it and when you eat it', 'why you like it'],
          minWords: 50, maxWords: 70, minutes: 20
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
