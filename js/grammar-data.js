// made by tools/build-grammar.js from docs/grammar-journey.json — don't edit
window.TA_GRAMMAR = {
  v: 1,
  levels: [
    {
      id: "beginner", name: "Beginner", lessons: [
      {
        id: "g1", no: 1, title: "To Be (am/is/are) + A/An", v: 1,
        chunks: [
          {
            learn: {"title":"I am, you are, she is","rule":"Use am, is or are to say who someone is, what something is, how someone feels or where someone is. Use am with I. Use is with he, she, it and one person or thing. Use are with you, we, they and two or more people or things. In speaking we often use short forms: I'm, she's, they're.","table":[["Person","be","Short form"],["I","am","I'm"],["you","are","you're"],["he / she / it","is","he's / she's / it's"],["we","are","we're"],["they","are","they're"]],"examples":["I am a student.","You are my friend.","Tom is ten years old.","It is cold today.","We're in the classroom.","Anna and Sam are at home."],"uz":"I bilan am, he / she / it bilan is, you / we / they bilan are ishlatiladi. Bu o‘zbek tilidagi -man, -san, -dir qo‘shimchalariga o‘xshaydi: I am a student — Men talabaman."},
            practise: [
              {"type":"choose","q":"I ___ a student.","options":["am","is","are"],"a":["am"],"hint":"With I, always use am."},
              {"type":"choose","q":"She ___ my sister.","options":["am","is","are"],"a":["is"],"hint":"With he, she and it, use is."},
              {"type":"gap","q":"We ___ in the park. (am / is / are)","a":["are"],"hint":"With we, use are."},
              {"type":"gap","q":"Tom and Lucy ___ friends. (am / is / are)","a":["are"],"hint":"Tom and Lucy = they, so use are."},
              {"type":"order","q":"Put the words in order.","words":["is","The","big","house"],"a":["The house is big."],"hint":"Start with The house, then is."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","rule":"To make a negative, put not after am, is or are: I am not, she is not. Short forms: I'm not, isn't, aren't. To ask a question, put am, is or are before the person: Are you OK? Is he at home? Answer with a short answer: Yes, I am. / No, I'm not.","table":[["Negative","Question","Short answer"],["I am not (I'm not) tired.","Am I late?","Yes, you are. / No, you aren't."],["He is not (He isn't) here.","Is he at home?","Yes, he is. / No, he isn't."],["They are not (They aren't) ready.","Are they at school?","Yes, they are. / No, they aren't."]],"examples":["I am not tired.","Sam isn't at school today.","We aren't hungry.","Are you a teacher? — Yes, I am.","Is it hot today? — No, it isn't.","Where are your books?"],"uz":"Inkor gapda am, is, are dan keyin not qo‘yiladi: I am not tired — Men charchamaganman. So‘roq gapda am, is, are gapning boshiga chiqadi: Are you OK?"},
            practise: [
              {"type":"choose","q":"He ___ a doctor. He is a teacher.","options":["isn't","aren't","am not"],"a":["isn't"],"hint":"With he, use is. The negative is isn't (is not)."},
              {"type":"gap","q":"I ___ not hungry.","a":["am"],"hint":"With I, use am: I am not."},
              {"type":"choose","q":"___ you happy?","options":["Am","Is","Are"],"a":["Are"],"hint":"In a question, are comes first with you."},
              {"type":"fix","q":"Which sentence is correct?","options":["Is she your mother?","She is your mother?","Are she your mother?"],"a":["Is she your mother?"],"hint":"In a question, is comes before she."},
              {"type":"order","q":"Put the words in order.","words":["they","Are","school","at"],"a":["Are they at school?"],"hint":"A question starts with Are, then they."}
            ]
          },
          {
            learn: {"title":"a or an?","rule":"Use a or an before one person or thing. Use an before a vowel sound (a, e, i, o, u): an apple, an egg. Use a before other sounds: a cat, a book. Look at the next word: an old car, but a new car. Use a or an with jobs too: She is a doctor.","table":[["a + other sounds","an + a, e, i, o, u sounds"],["a dog","an apple"],["a pen","an egg"],["a big house","an old house"],["a nurse","an engineer"]],"examples":["It is a dog.","This is an orange.","My mum is a nurse.","He is an actor.","It is an old car.","It is a new car."],"uz":"a / an — bitta degan ma’noni beradi. Unli tovush (a, e, i, o, u) oldidan an, boshqa so‘zlar oldidan a qo‘yiladi. Kasb oldidan ham qo‘yiladi: She is a doctor — U shifokor."},
            practise: [
              {"type":"choose","q":"This is ___ apple.","options":["a","an"],"a":["an"],"hint":"Apple starts with a vowel sound (a), so use an."},
              {"type":"choose","q":"It is ___ dog.","options":["a","an"],"a":["a"],"hint":"Dog starts with d, not a vowel, so use a."},
              {"type":"gap","q":"My father is ___ engineer. (a / an)","a":["an"],"hint":"Engineer starts with a vowel sound (e), so use an."},
              {"type":"choose","q":"It is ___ old house.","options":["a","an"],"a":["an"],"hint":"Look at the next word: old starts with o, so use an."},
              {"type":"fix","q":"Which sentence is correct?","options":["She is doctor.","She is a doctor.","She is an doctor."],"a":["She is a doctor."],"hint":"Use a before a job: a doctor."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ fourteen years old.","options":["am","is","are"],"a":["am"]},
          {"type":"choose","q":"My brother ___ a student.","options":["am","is","are"],"a":["is"]},
          {"type":"gap","q":"Anna and I ___ good friends. (am / is / are)","a":["are"]},
          {"type":"choose","q":"This is ___ egg.","options":["a","an"],"a":["an"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He is a teacher.","He is teacher.","He a teacher."],"a":["He is a teacher."]},
          {"type":"choose","q":"It ___ cold today.","options":["am","is","are"],"a":["is"]},
          {"type":"gap","q":"She is ___ artist. (a / an)","a":["an"]},
          {"type":"order","q":"Put the words in order.","words":["is","My","name","Tom"],"a":["My name is Tom."]},
          {"type":"gap","q":"I ___ not at home. I'm at school.","a":["am"]},
          {"type":"choose","q":"They ___ at work today. They are at home.","options":["isn't","aren't","am not"],"a":["aren't"]},
          {"type":"choose","q":"Max is ___ pilot.","options":["a","an"],"a":["a"]},
          {"type":"gap","q":"Sam ___ in the kitchen. He is in the garden. (use not)","a":["isn't","is not"]},
          {"type":"choose","q":"___ your sister a nurse?","options":["Am","Is","Are"],"a":["Is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["They is my friends.","They are my friends.","They am my friends."],"a":["They are my friends."]},
          {"type":"choose","q":"Are you a student? — Yes, I ___.","options":["am","is","are"],"a":["am"]},
          {"type":"order","q":"Put the words in order.","words":["you","Are","ready"],"a":["Are you ready?"]},
          {"type":"gap","q":"Is it your bag? — No, it ___.","a":["isn't","is not"]},
          {"type":"choose","q":"It is ___ interesting book.","options":["a","an"],"a":["an"]},
          {"type":"gap","q":"You ___ in my class. (am / is / are)","a":["are"]},
          {"type":"order","q":"Put the words in order.","words":["not","am","I","a","teacher"],"a":["I am not a teacher."]}
        ]
      },
      {
        id: "g2", no: 2, title: "Subject Pronouns + Possessive Adjectives", v: 1,
        chunks: [
          {
            learn: {"title":"I, you, he, she, it, we, they","rule":"A subject pronoun takes the place of a name. It comes before the verb (am, is, are). Use he for a man or a boy, she for a woman or a girl, it for a thing or an animal, and they for two or more people or things.","table":[["One","Two or more"],["I","we"],["you","you"],["he / she / it","they"]],"examples":["Tom is my friend. He is twelve.","Anna is a nurse. She is very kind.","This is my bag. It is new.","Sam and I are in Class 5. We are classmates.","The books are on the table. They are heavy."],"uz":"O‘zbek tilida bitta “u” bor, ingliz tilida esa uchta: he — erkak yoki o‘g‘il bola, she — ayol yoki qiz bola, it — narsa yoki hayvon."},
            practise: [
              {"type":"choose","q":"Lucy is my cousin. ___ is ten.","options":["He","She","It"],"a":["She"],"hint":"Lucy is a girl, so use she."},
              {"type":"choose","q":"My dad is a driver. ___ is at work.","options":["He","She","They"],"a":["He"],"hint":"Dad is a man, so use he."},
              {"type":"choose","q":"The cat is black. ___ is very small.","options":["He","She","It"],"a":["It"],"hint":"Use it for an animal or a thing."},
              {"type":"gap","q":"Ben and Kate are students. ___ are in my class. (Ben and Kate)","a":["They"],"hint":"Two people (not you or me) = they."},
              {"type":"gap","q":"My friend and I are in the park. ___ are happy. (my friend and I)","a":["We"],"hint":"Another person + I = we."}
            ]
          },
          {
            learn: {"title":"my, your, his, her, its, our, their","rule":"Possessive adjectives show who something belongs to. They come before a noun: my book, her phone. They are the same for one thing or many things: my book, my books. Be careful: his is for a man or a boy, her is for a woman or a girl.","table":[["Subject pronoun","Possessive adjective","Example"],["I","my","my bag"],["you","your","your bag"],["he","his","his bag"],["she","her","her bag"],["it","its","its bed (a dog's bed)"],["we","our","our bag"],["they","their","their bag"]],"examples":["This is my bag.","What is your name?","Tom is with his mother.","Her cat is white.","We are in our classroom.","Their house is very big."],"uz":"Bu so‘zlar narsa kimniki ekanini bildiradi va otdan oldin keladi: my book — mening kitobim. his — erkak kishiniki, her — ayol kishiniki."},
            practise: [
              {"type":"choose","q":"I am Tom. ___ name is Tom.","options":["My","I","Me"],"a":["My"],"hint":"Before a noun (name), use my."},
              {"type":"choose","q":"Kate is with ___ brother.","options":["his","her","its"],"a":["her"],"hint":"Kate is a girl, so use her."},
              {"type":"choose","q":"Mr Brown is in ___ car.","options":["his","her","their"],"a":["his"],"hint":"Mr Brown is a man, so use his."},
              {"type":"gap","q":"We are in ___ classroom. (we)","a":["our"],"hint":"we → our."},
              {"type":"fix","q":"Which sentence is correct?","options":["They are with their teacher.","They are with they teacher.","They are with there teacher."],"a":["They are with their teacher."],"hint":"they → their (it belongs to them)."}
            ]
          },
          {
            learn: {"title":"he or his? it's or its?","rule":"Before am, is, are (a verb), use I, he, she, we, they. Before a noun, use my, his, her, our, their. Be careful with it's and its: it's = it is. its = belonging to it (no apostrophe).","table":[["Before a verb","Before a noun"],["He is my uncle.","His car is red."],["She is a singer.","Her name is Mia."],["They are twins.","Their names are Jack and Sam."],["It's a dog. (it is)","Its name is Max."]],"examples":["She is a singer. Her name is Mia.","He is my uncle. His car is red.","They are twins. Their names are Jack and Sam.","It's a dog. Its name is Max.","We are in Class 7. Our teacher is Mrs Green."],"uz":"Fe’l (am, is, are) oldidan I, he, she, they, ot oldidan esa my, his, her, their ishlatiladi. it’s = it is, its esa “uning” degani."},
            practise: [
              {"type":"choose","q":"___ is my best friend.","options":["He","His"],"a":["He"],"hint":"Before is (a verb), use he."},
              {"type":"choose","q":"___ name is Lily.","options":["She","Her"],"a":["Her"],"hint":"Before a noun (name), use her."},
              {"type":"choose","q":"This is a bird. ___ wings are blue.","options":["It's","Its"],"a":["Its"],"hint":"its = belonging to it. it's = it is."},
              {"type":"gap","q":"Jack and Mia are my friends. ___ house is near my school. (Jack and Mia)","a":["Their"],"hint":"Before a noun (house), they → their."},
              {"type":"fix","q":"Which sentence is correct?","options":["Our teacher is from Canada.","We teacher is from Canada.","Us teacher is from Canada."],"a":["Our teacher is from Canada."],"hint":"Before a noun (teacher), we → our."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"My mother is a cook. ___ is at work.","options":["He","She","It"],"a":["She"]},
          {"type":"choose","q":"This is my phone. ___ is new.","options":["He","It","They"],"a":["It"]},
          {"type":"gap","q":"Tom and Sam are brothers. ___ are tall. (Tom and Sam)","a":["They"]},
          {"type":"choose","q":"Emma, is this ___ pen?","options":["you","your","you're"],"a":["your"]},
          {"type":"choose","q":"My sisters ___ at school.","options":["am","is","are"],"a":["are"],"from":"g1"},
          {"type":"choose","q":"Max is with ___ dad.","options":["his","her","he"],"a":["his"]},
          {"type":"gap","q":"I am a student. ___ teacher is Mrs Green. (I)","a":["My"]},
          {"type":"fix","q":"Which sentence is correct?","options":["His name is Ben.","He name is Ben.","Him name is Ben."],"a":["His name is Ben."]},
          {"type":"choose","q":"We are in the park with ___ dog.","options":["our","we","us"],"a":["our"]},
          {"type":"choose","q":"This is ___ orange.","options":["a","an"],"a":["an"],"from":"g1"},
          {"type":"choose","q":"Lily and Kate are at home. ___ are sisters.","options":["They","Their","There"],"a":["They"]},
          {"type":"gap","q":"Anna is a doctor. ___ office is in the city centre. (Anna)","a":["Her"]},
          {"type":"order","q":"Put the words in order.","words":["is","name","Her","Sophie"],"a":["Her name is Sophie."]},
          {"type":"choose","q":"The dog is in ___ bed.","options":["it's","its","it"],"a":["its"]},
          {"type":"gap","q":"I ___ not ready.","a":["am"],"from":"g1"},
          {"type":"fix","q":"Which sentence is correct?","options":["They are my parents. Their names are Tom and Lucy.","They are my parents. They names are Tom and Lucy."],"a":["They are my parents. Their names are Tom and Lucy."]},
          {"type":"order","q":"Put the words in order.","words":["our","This","is","classroom"],"a":["This is our classroom."]},
          {"type":"gap","q":"You and I are in the same class. ___ are classmates. (you and I)","a":["We"]},
          {"type":"choose","q":"Mr and Mrs Brown are with ___ children.","options":["their","they","them"],"a":["their"]},
          {"type":"choose","q":"___ he your brother?","options":["Am","Is","Are"],"a":["Is"],"from":"g1"}
        ]
      },
      {
        id: "g3", no: 3, title: "Singular and Plural Nouns", v: 1,
        chunks: [
          {
            learn: {"title":"-s and -es","rule":"Singular means one. Plural means two or more. Most nouns add -s: book → books. Nouns that end in -s, -ss, -sh, -ch or -x add -es: bus → buses, box → boxes. Some nouns that end in -o add -es too: tomato → tomatoes. After a number (two, three, ten…) the noun is plural: two books.","table":[["Ending","Rule","Example"],["most nouns","+ s","a cat → two cats"],["-s, -ss, -sh, -ch, -x","+ es","a bus → buses, a dish → dishes, a watch → watches"],["-o (some nouns)","+ es","a tomato → tomatoes, a potato → potatoes"]],"examples":["one pen → three pens","a class → two classes","a brush → brushes","a box → five boxes","My shoes are new.","The buses are full."],"uz":"Ko‘plikda otga -s yoki -es qo‘shiladi (books — kitoblar). Diqqat: o‘zbek tilidan farqli, sondan keyin ham -s qo‘shiladi: two books — ikkita kitob."},
            practise: [
              {"type":"choose","q":"one apple, two ___","options":["apple","apples","applees"],"a":["apples"],"hint":"Most nouns just add -s."},
              {"type":"gap","q":"one box, three ___","a":["boxes"],"hint":"Nouns that end in -x add -es."},
              {"type":"gap","q":"one watch, two ___","a":["watches"],"hint":"Nouns that end in -ch add -es."},
              {"type":"choose","q":"The ___ are on the table.","options":["dish","dishs","dishes"],"a":["dishes"],"hint":"Nouns that end in -sh add -es."},
              {"type":"fix","q":"Which sentence is correct?","options":["Tom is ten years old.","Tom is ten year old.","Tom is ten years olds."],"a":["Tom is ten years old."],"hint":"After a number like ten, the noun is plural: ten years."}
            ]
          },
          {
            learn: {"title":"-y → -ies and -f → -ves","rule":"If a noun ends in a consonant + y, change y to i and add -es: baby → babies, city → cities. If it ends in a vowel + y (ay, ey, oy), just add -s: day → days, key → keys, boy → boys. Many nouns that end in -f or -fe change to -ves: leaf → leaves, knife → knives.","table":[["Ending","Rule","Example"],["consonant + y","y → ies","a baby → babies, a city → cities"],["vowel + y (ay, ey, oy)","+ s","a day → days, a key → keys, a boy → boys"],["-f / -fe","→ ves","a leaf → leaves, a knife → knives, a shelf → shelves"]],"examples":["one city → two cities","a lady → three ladies","a day → seven days","a toy → many toys","a shelf → two shelves","The leaves are yellow."],"uz":"Undosh + y bo‘lsa, y → ies bo‘ladi (baby → babies). Unli + y bo‘lsa, faqat -s qo‘shiladi (boy → boys). -f / -fe ko‘pincha -ves ga aylanadi (knife → knives)."},
            practise: [
              {"type":"choose","q":"one baby, two ___","options":["babys","babies","babyes"],"a":["babies"],"hint":"b + y: change y to i and add -es."},
              {"type":"choose","q":"one boy, three ___","options":["boys","boies"],"a":["boys"],"hint":"o + y (a vowel + y): just add -s."},
              {"type":"gap","q":"one city, two ___","a":["cities"],"hint":"t + y: change y to i and add -es."},
              {"type":"gap","q":"one knife, four ___","a":["knives"],"hint":"-fe changes to -ves."},
              {"type":"fix","q":"Which sentence is correct?","options":["The keys are on the table.","The keies are on the table."],"a":["The keys are on the table."],"hint":"e + y (a vowel + y): just add -s."}
            ]
          },
          {
            learn: {"title":"Special plurals","rule":"Some nouns have a special plural. Learn them by heart: man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice. A few nouns are the same in the plural: one sheep → two sheep, one fish → two fish.","table":[["Singular","Plural"],["man","men"],["woman","women"],["child","children"],["person","people"],["foot","feet"],["tooth","teeth"],["mouse","mice"],["sheep / fish","sheep / fish"]],"examples":["one man → two men","a child → three children","The children are in the garden.","Many people are in the shop.","My feet are cold.","Two sheep are in the field."],"uz":"Ba’zi otlarning ko‘pligi qoidaga bo‘ysunmaydi, ularni yodlab olish kerak: child — children, man — men, person — people."},
            practise: [
              {"type":"choose","q":"one child, two ___","options":["childs","children","childrens"],"a":["children"],"hint":"child → children (a special plural)."},
              {"type":"choose","q":"one man, three ___","options":["mans","men","mens"],"a":["men"],"hint":"man → men (a special plural)."},
              {"type":"gap","q":"one tooth, two ___","a":["teeth"],"hint":"tooth → teeth, like foot → feet."},
              {"type":"gap","q":"one woman, five ___","a":["women"],"hint":"woman → women, like man → men."},
              {"type":"fix","q":"Which sentence is correct?","options":["Two people are at the door.","Two peoples are at the door.","Two people is at the door."],"a":["Two people are at the door."],"hint":"person → people (already plural, so use are)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"one cat, two ___","options":["cat","cats","cates"],"a":["cats"]},
          {"type":"gap","q":"one bus, three ___","a":["buses"]},
          {"type":"choose","q":"one city, two ___","options":["citys","cities","cityes"],"a":["cities"]},
          {"type":"choose","q":"My uncle is ___ actor.","options":["a","an"],"a":["an"],"from":"g1"},
          {"type":"gap","q":"one day, seven ___","a":["days"]},
          {"type":"choose","q":"one child, four ___","options":["children","childs","childrens"],"a":["children"]},
          {"type":"gap","q":"one leaf, many ___","a":["leaves"]},
          {"type":"fix","q":"Which sentence is correct?","options":["My sister is twelve years old.","My sister is twelve year old."],"a":["My sister is twelve years old."]},
          {"type":"choose","q":"one dish, two ___","options":["dishs","dishes","dishies"],"a":["dishes"]},
          {"type":"choose","q":"Lucy and Ben are here. ___ are my cousins.","options":["They","Their","We"],"a":["They"],"from":"g2"},
          {"type":"gap","q":"one foot, two ___","a":["feet"]},
          {"type":"choose","q":"one person, ten ___","options":["person","people","peoples"],"a":["people"]},
          {"type":"order","q":"Put the words in order.","words":["are","The","children","happy"],"a":["The children are happy."]},
          {"type":"gap","q":"one toy, many ___","a":["toys"]},
          {"type":"gap","q":"This is Tom. ___ bag is blue. (Tom)","a":["His"],"from":"g2"},
          {"type":"choose","q":"one mouse, two ___","options":["mouses","mice","mices"],"a":["mice"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The boxes are heavy.","The boxs are heavy.","The boxes is heavy."],"a":["The boxes are heavy."]},
          {"type":"gap","q":"one shelf, three ___","a":["shelves"]},
          {"type":"choose","q":"___ the children at school?","options":["Is","Are","Am"],"a":["Are"],"from":"g1"},
          {"type":"choose","q":"one sheep, five ___","options":["sheeps","sheep","sheepes"],"a":["sheep"]}
        ]
      },
      {
        id: "g4", no: 4, title: "This, That, These, Those", v: 1,
        chunks: [
          {
            learn: {"title":"this and these (near)","rule":"Use this for one thing near you (here). Use these for two or more things near you. this + a singular noun: this book. these + a plural noun: these books.","table":[["Near me (here)","Example"],["this + one thing","this book, this apple"],["these + two or more","these books, these apples"]],"examples":["This is my pen.","This bag is heavy.","These are my friends, Tom and Emma.","These shoes are new.","Is this your phone?"],"uz":"this — bu (bitta, yaqindagi narsa), these — bular (ko‘p, yaqindagi narsalar)."},
            practise: [
              {"type":"choose","q":"___ is my book.","options":["This","These"],"a":["This"],"hint":"One thing near you: this."},
              {"type":"choose","q":"___ are my pencils.","options":["This","These"],"a":["These"],"hint":"Two or more things near you: these."},
              {"type":"choose","q":"___ apples are green.","options":["This","These"],"a":["These"],"hint":"Apples = more than one, so use these."},
              {"type":"gap","q":"___ chair is new. (near me, one)","a":["This"],"hint":"One thing near you: this."},
              {"type":"fix","q":"Which sentence is correct?","options":["These are my keys.","This are my keys.","These is my keys."],"a":["These are my keys."],"hint":"Keys = more than one: these + are."}
            ]
          },
          {
            learn: {"title":"that and those (far)","rule":"Use that for one thing far from you (there). Use those for two or more things far from you. that + a singular noun: that house. those + a plural noun: those houses.","table":[["","One","Two or more"],["Near (here)","this","these"],["Far (there)","that","those"]],"examples":["That is our school.","That man is my uncle.","Those are my parents.","Those birds are very small.","Is that your car over there?"],"uz":"that — u (bitta, uzoqdagi narsa), those — ular (ko‘p, uzoqdagi narsalar)."},
            practise: [
              {"type":"choose","q":"___ is my house over there.","options":["That","Those"],"a":["That"],"hint":"One thing far away (over there): that."},
              {"type":"choose","q":"___ trees over there are very tall.","options":["That","Those"],"a":["Those"],"hint":"Two or more things far away: those."},
              {"type":"choose","q":"Is ___ your bike over there?","options":["that","those"],"a":["that"],"hint":"One thing far away: that."},
              {"type":"gap","q":"___ women over there are teachers. (far, two or more)","a":["Those"],"hint":"Two or more people far away: those."},
              {"type":"fix","q":"Which sentence is correct?","options":["That girls are my sisters.","Those girls are my sisters.","Those girl are my sisters."],"a":["Those girls are my sisters."],"hint":"Girls = more than one: those girls."}
            ]
          },
          {
            learn: {"title":"What's this? What are those?","rule":"When you ask about this or that, answer with it: What's this? — It's a clock. When you ask about these or those, answer with they: What are these? — They're keys. Short answers: Yes, it is. / No, it isn't. Yes, they are. / No, they aren't.","table":[["Question","Answer"],["What's this? / What's that?","It's a pen."],["What are these? / What are those?","They're pens."],["Is this your bag?","Yes, it is. / No, it isn't."],["Are those your shoes?","Yes, they are. / No, they aren't."]],"examples":["What's this? — It's a map.","What are these? — They're grapes.","Who is that? — That's my brother.","Is that your coat? — Yes, it is.","Are these your glasses? — No, they aren't."],"uz":"this / that haqidagi savolga it bilan, these / those haqidagi savolga they bilan javob beriladi: What are these? — They're keys."},
            practise: [
              {"type":"choose","q":"What is this? — ___ a lamp.","options":["It's","They're"],"a":["It's"],"hint":"this = one thing, so answer with it."},
              {"type":"choose","q":"What are those? — ___ birds.","options":["It's","They're"],"a":["They're"],"hint":"those = two or more, so answer with they."},
              {"type":"choose","q":"Are these your socks? — Yes, they ___.","options":["is","are"],"a":["are"],"hint":"these → they → are."},
              {"type":"gap","q":"Is that your dog? — No, it ___.","a":["isn't","is not"],"hint":"that → it → isn't (is not)."},
              {"type":"order","q":"Put the words in order.","words":["these","What","are"],"a":["What are these?"],"hint":"Start with What, then are."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"___ is my brother, Sam.","options":["This","These"],"a":["This"]},
          {"type":"choose","q":"___ books are very old.","options":["This","These"],"a":["These"]},
          {"type":"choose","q":"one glass, two ___","options":["glass","glasses","glassies"],"a":["glasses"],"from":"g3"},
          {"type":"choose","q":"___ house over there is very big.","options":["That","Those"],"a":["That"]},
          {"type":"gap","q":"___ cars over there are fast. (far, two or more)","a":["Those"]},
          {"type":"fix","q":"Which sentence is correct?","options":["This shoes are new.","These shoes are new.","These shoe are new."],"a":["These shoes are new."]},
          {"type":"choose","q":"What are these? — ___ cherries.","options":["It's","They're"],"a":["They're"]},
          {"type":"choose","q":"Mia is with ___ mum.","options":["his","her","she"],"a":["her"],"from":"g2"},
          {"type":"choose","q":"Is this your umbrella? — Yes, it ___.","options":["is","are"],"a":["is"]},
          {"type":"gap","q":"___ cup in my hand is hot. (near me, one)","a":["This"]},
          {"type":"order","q":"Put the words in order.","words":["that","Who","is"],"a":["Who is that?"]},
          {"type":"choose","q":"Are those your friends? — No, they ___.","options":["isn't","aren't"],"a":["aren't"]},
          {"type":"gap","q":"one man, three ___","a":["men"],"from":"g3"},
          {"type":"choose","q":"___ are my parents over there.","options":["That","Those","These"],"a":["Those"]},
          {"type":"gap","q":"What is that? — ___ a plane. (it is)","a":["It's","It is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Is this your pen?","Are this your pen?","Is these your pen?"],"a":["Is this your pen?"]},
          {"type":"order","q":"Put the words in order.","words":["are","Those","my","shoes"],"a":["Those are my shoes."]},
          {"type":"choose","q":"___ flowers here are for you.","options":["This","These","Those"],"a":["These"]},
          {"type":"gap","q":"These books ___ heavy. (am / is / are)","a":["are"],"from":"g1"},
          {"type":"choose","q":"Is ___ bird over there a parrot?","options":["this","that","these"],"a":["that"]}
        ]
      },
      {
        id: "g5", no: 5, title: "Have Got / Has Got", v: 1,
        chunks: [
          {
            learn: {"title":"I have got, she has got","rule":"Use have got / has got to say what someone owns, and to talk about family and how someone looks. Use have got with I, you, we, they. Use has got with he, she, it. Short forms: I've got, you've got, he's got, she's got.","table":[["Person","Full form","Short form"],["I / you / we / they","have got","I've got / you've got / we've got / they've got"],["he / she / it","has got","he's got / she's got / it's got"]],"examples":["I have got a new bike.","We've got two cats.","Anna has got long hair.","Tom's got a brother and a sister.","The car has got four doors."],"uz":"have got / has got — “… bor” degani: I have got a bike — Mening velosipedim bor. he, she, it bilan has got ishlatiladi."},
            practise: [
              {"type":"choose","q":"I ___ got a sister.","options":["have","has"],"a":["have"],"hint":"With I, use have got."},
              {"type":"choose","q":"Ben ___ got a dog.","options":["have","has"],"a":["has"],"hint":"Ben = he, so use has got."},
              {"type":"gap","q":"They ___ got a big garden. (have / has)","a":["have"],"hint":"With they, use have got."},
              {"type":"gap","q":"My cat ___ got green eyes. (have / has)","a":["has"],"hint":"My cat = it, so use has got."},
              {"type":"order","q":"Put the words in order.","words":["got","She","a","has","phone","new"],"a":["She has got a new phone."],"hint":"She + has got + a new phone."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","rule":"Negative: haven't got / hasn't got. Question: put have or has first: Have you got a pen? Has she got a car? Short answers: Yes, I have. / No, I haven't. Yes, she has. / No, she hasn't. Don't say got in a short answer.","table":[["Negative","Question","Short answer"],["I haven't got a car.","Have you got a car?","Yes, I have. / No, I haven't."],["She hasn't got a car.","Has she got a car?","Yes, she has. / No, she hasn't."],["They haven't got a car.","Have they got a car?","Yes, they have. / No, they haven't."]],"examples":["I haven't got a pet.","Sam hasn't got a computer.","We haven't got much time.","Have you got a pen? — Yes, I have.","Has your sister got a job? — No, she hasn't.","Have they got a car? — Yes, they have."],"uz":"Inkor: haven't got / hasn't got (… yo‘q). So‘roq gapda have yoki has gap boshiga chiqadi: Have you got a pen? — Ruchkangiz bormi?"},
            practise: [
              {"type":"choose","q":"I ___ got a car.","options":["haven't","hasn't"],"a":["haven't"],"hint":"With I, use haven't got."},
              {"type":"choose","q":"Lucy ___ got a brother.","options":["haven't","hasn't"],"a":["hasn't"],"hint":"Lucy = she, so use hasn't got."},
              {"type":"choose","q":"___ you got a ruler?","options":["Have","Has"],"a":["Have"],"hint":"With you, the question starts with Have."},
              {"type":"gap","q":"Has Tom got a bike? — Yes, he ___.","a":["has"],"hint":"Has he…? — Yes, he has. (no got)"},
              {"type":"fix","q":"Which sentence is correct?","options":["Have they got a garden?","Has they got a garden?","They have got a garden?"],"a":["Have they got a garden?"],"hint":"With they, the question starts with Have."}
            ]
          },
          {
            learn: {"title":"'s = has or is?","rule":"'s can mean is or has. If got comes after it, 's means has: She's got a cat (She has got a cat). If there is no got, 's means is: She's tall (She is tall).","table":[["'s = has (got after it)","'s = is (no got)"],["He's got a cold.","He's a doctor."],["It's got two wheels.","It's cold today."],["Mia's got brown eyes.","Mia's eleven."]],"examples":["He's got a cold. (He has got a cold.)","He's a doctor. (He is a doctor.)","It's got two wheels. (It has got two wheels.)","It's cold today. (It is cold today.)","Mia's got brown eyes. (Mia has got brown eyes.)"],"uz":"'s ikki xil ma’noda keladi: undan keyin got kelsa — has, got kelmasa — is: She's got a cat (has), She's tall (is)."},
            practise: [
              {"type":"choose","q":"She's got a new bag. Here 's = ___","options":["is","has"],"a":["has"],"hint":"got comes after 's, so 's = has."},
              {"type":"choose","q":"She's twelve. Here 's = ___","options":["is","has"],"a":["is"],"hint":"There is no got, so 's = is."},
              {"type":"choose","q":"My dad's got a beard. Here 's = ___","options":["is","has"],"a":["has"],"hint":"got comes after 's, so 's = has."},
              {"type":"gap","q":"He's ___ two sisters. (He has got two sisters.)","a":["got"],"hint":"He's got = he has got."},
              {"type":"fix","q":"Which sentence is correct?","options":["She's got short hair.","She's short hair.","She has short hair got."],"a":["She's got short hair."],"hint":"She's got = she has got."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"We ___ got a new teacher.","options":["have","has"],"a":["have"]},
          {"type":"choose","q":"My grandmother ___ got a garden.","options":["have","has"],"a":["has"]},
          {"type":"gap","q":"I ___ got a computer. (negative)","a":["haven't","have not"]},
          {"type":"choose","q":"___ your brother got a car?","options":["Have","Has"],"a":["Has"]},
          {"type":"choose","q":"___ are my pens here on the desk.","options":["This","These","Those"],"a":["These"],"from":"g4"},
          {"type":"gap","q":"Have you got a pet? — No, I ___.","a":["haven't","have not"]},
          {"type":"choose","q":"Kate ___ got a sister. She's got two brothers.","options":["hasn't","haven't"],"a":["hasn't"]},
          {"type":"order","q":"Put the words in order.","words":["you","Have","got","a","pen"],"a":["Have you got a pen?"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He has got blue eyes.","He have got blue eyes.","He has blue eyes got."],"a":["He has got blue eyes."]},
          {"type":"gap","q":"one baby, two ___","a":["babies"],"from":"g3"},
          {"type":"choose","q":"They've got a big house. Here 've = ___","options":["have","are"],"a":["have"]},
          {"type":"gap","q":"Has your phone got a camera? — Yes, it ___.","a":["has"]},
          {"type":"choose","q":"The cat ___ got a long tail.","options":["have","has"],"a":["has"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Has she got a bike? — Yes, she has.","Has she got a bike? — Yes, she has got.","Has she got a bike? — Yes, she have."],"a":["Has she got a bike? — Yes, she has."]},
          {"type":"choose","q":"Tom and I are friends. ___ are in the same class.","options":["They","We","Our"],"a":["We"],"from":"g2"},
          {"type":"choose","q":"He's got a cold. Here 's = ___","options":["is","has"],"a":["has"]},
          {"type":"order","q":"Put the words in order.","words":["haven't","We","got","car","a"],"a":["We haven't got a car."]},
          {"type":"gap","q":"My friends ___ got a football. (have / has)","a":["have"]},
          {"type":"choose","q":"Are you tired? — No, I'm ___.","options":["no","not","isn't"],"a":["not"],"from":"g1"},
          {"type":"choose","q":"___ the children got their books?","options":["Have","Has"],"a":["Have"]}
        ]
      },
      {
        id: "g6", no: 6, title: "There Is / There Are", v: 1,
        chunks: [
          {
            learn: {"title":"There is, there are","rule":"Use there is / there are to say that something is in a place. Use there is with one thing (a singular noun). Use there are with two or more things (a plural noun). Short form: there's.","table":[["","Example"],["There is (There's) + one thing","There is a bed in my room."],["There are + two or more","There are two windows in my room."]],"examples":["There is a cat in the garden.","There's a bank near my house.","There are three bedrooms in our flat.","There are many people in the park.","In my bag there is a book and there are two pens."],"uz":"There is / there are — biror joyda “… bor” degani: There is a bed in my room — Xonamda karavot bor. Bitta narsa — there is, ko‘p narsa — there are."},
            practise: [
              {"type":"choose","q":"There ___ a table in the kitchen.","options":["is","are"],"a":["is"],"hint":"One table: there is."},
              {"type":"choose","q":"There ___ four chairs in the room.","options":["is","are"],"a":["are"],"hint":"Four chairs = more than one: there are."},
              {"type":"gap","q":"There ___ a big tree in our garden. (is / are)","a":["is"],"hint":"One tree: there is."},
              {"type":"gap","q":"There ___ two shops in my street. (is / are)","a":["are"],"hint":"Two shops = more than one: there are."},
              {"type":"order","q":"Put the words in order.","words":["is","There","a","clock","the","on","wall"],"a":["There is a clock on the wall."],"hint":"There is + a clock + on the wall."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","rule":"Negative: there isn't / there aren't. Question: Is there…? Are there…? Short answers: Yes, there is. / No, there isn't. Yes, there are. / No, there aren't. To ask about a number, use How many … are there?","table":[["Negative","Question","Short answer"],["There isn't a lift.","Is there a lift?","Yes, there is. / No, there isn't."],["There aren't many trees.","Are there many trees?","Yes, there are. / No, there aren't."]],"examples":["There isn't a TV in my room.","There aren't many students in the classroom.","Is there a park near here? — Yes, there is.","Are there two bathrooms? — No, there aren't.","How many students are there in your class?"],"uz":"Inkorda is / are dan keyin not qo‘yiladi: there isn't, there aren't (… yo‘q). So‘roqda is / are gap boshiga chiqadi: Is there a park? — Park bormi?"},
            practise: [
              {"type":"choose","q":"There ___ a lift in this building.","options":["isn't","aren't"],"a":["isn't"],"hint":"One lift: there isn't."},
              {"type":"choose","q":"___ there a bank near here?","options":["Is","Are"],"a":["Is"],"hint":"One bank: Is there…?"},
              {"type":"choose","q":"Are there many cars in the street? — No, there ___.","options":["isn't","aren't"],"a":["aren't"],"hint":"Are there…? — No, there aren't."},
              {"type":"gap","q":"Is there a cafe in the park? — Yes, there ___.","a":["is"],"hint":"Is there…? — Yes, there is."},
              {"type":"order","q":"Put the words in order.","words":["many","How","are","there","students"],"a":["How many students are there?"],"hint":"How many + students + are there?"}
            ]
          },
          {
            learn: {"title":"There's a dog. It's big.","rule":"Use there is / there are to say something is there for the first time. Then use it (one thing) or they (two or more) to say more about it: There's a dog in the garden. It's very big.","examples":["There's a new girl in our class. She's from Spain.","There's a box on the table. It's heavy.","There are two cats in the garden. They're hungry.","There's a cafe near my house. It's very nice.","There are three books on my desk. They're new."],"uz":"Biror narsa haqida birinchi marta there is / there are bilan aytiladi, keyin u haqida it yoki they bilan gapiriladi: There's a dog. It's big."},
            practise: [
              {"type":"choose","q":"There's a cup on the desk. ___ is blue.","options":["It","There"],"a":["It"],"hint":"We already know about the cup, so use it."},
              {"type":"choose","q":"___ is a museum in our town.","options":["It","There"],"a":["There"],"hint":"First time we talk about the museum: there is."},
              {"type":"choose","q":"There are two bags in the car. ___ are heavy.","options":["There","They"],"a":["They"],"hint":"We already know about the bags (two or more), so use they."},
              {"type":"gap","q":"___ is a big park near my school. (It / There)","a":["There"],"hint":"First time we talk about the park: there is."},
              {"type":"fix","q":"Which sentence is correct?","options":["There's a dog in the garden. It's very friendly.","It's a dog in the garden. There's very friendly."],"a":["There's a dog in the garden. It's very friendly."],"hint":"First there is, then it."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"There ___ a sofa in the living room.","options":["is","are"],"a":["is"]},
          {"type":"choose","q":"There ___ six apples in the bag.","options":["is","are"],"a":["are"]},
          {"type":"gap","q":"There ___ a bus stop near my house. (is / are)","a":["is"]},
          {"type":"choose","q":"My sister ___ got curly hair.","options":["have","has"],"a":["has"],"from":"g5"},
          {"type":"choose","q":"There ___ a hospital in our village.","options":["isn't","aren't"],"a":["isn't"]},
          {"type":"gap","q":"There ___ many cars in the street today. It's quiet. (negative)","a":["aren't","are not"]},
          {"type":"choose","q":"___ there a toilet on this floor?","options":["Is","Are"],"a":["Is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["There are two cats in the garden.","There is two cats in the garden.","It are two cats in the garden."],"a":["There are two cats in the garden."]},
          {"type":"choose","q":"___ boys over there are my cousins.","options":["That","Those","These"],"a":["Those"],"from":"g4"},
          {"type":"choose","q":"___ there two beds in the room?","options":["Is","Are"],"a":["Are"]},
          {"type":"gap","q":"Are there many trees in the park? — Yes, there ___.","a":["are"]},
          {"type":"order","q":"Put the words in order.","words":["are","There","three","in","bedrooms","house","our"],"a":["There are three bedrooms in our house."]},
          {"type":"choose","q":"Is there a pool in the hotel? — No, there ___.","options":["isn't","aren't"],"a":["isn't"]},
          {"type":"gap","q":"one class, three ___","a":["classes"],"from":"g3"},
          {"type":"choose","q":"There's a new shop in town. ___ is very big.","options":["There","It"],"a":["It"]},
          {"type":"order","q":"Put the words in order.","words":["many","How","are","there","chairs"],"a":["How many chairs are there?"]},
          {"type":"gap","q":"There ___ two pictures on the wall. (is / are)","a":["are"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Is there a phone in your room?","Are there a phone in your room?","There is a phone in your room?"],"a":["Is there a phone in your room?"]},
          {"type":"choose","q":"Is this ___ book, Sam?","options":["you","your","you're"],"a":["your"],"from":"g2"},
          {"type":"choose","q":"There ___ an egg in the fridge.","options":["is","are"],"a":["is"]}
        ]
      },
      {
        id: "g7", no: 7, title: "Articles (A, An, The)", v: 1,
        chunks: [
          {
            learn: {"title":"a / an or the?","rule":"Use a / an when you talk about one thing for the first time, or about any one of many: There's a cat in the garden. Use the when you and the listener know which thing you mean, for example because you talked about it before: The cat is black.","table":[["First time (any one)","We know which one"],["I've got a cat and a dog.","The cat is black and the dog is white."],["There's a man at the door.","The man is tall."],["She's got an apple.","The apple is red."]],"examples":["I've got a cat and a dog. The cat is black and the dog is white.","There's a man at the door. The man is very tall.","There's a book on the table. The book is new.","Where is the teacher?","The door is open."],"uz":"a / an — har qanday bitta narsa yoki birinchi marta aytilgan narsa, the — ikkalamiz biladigan aniq narsa. O‘zbek tilida artikl yo‘q, shuning uchun uni tushirib qoldirmang."},
            practise: [
              {"type":"choose","q":"I've got ___ apple and a banana.","options":["a","an","the"],"a":["an"],"hint":"First time, and apple starts with a vowel sound: an."},
              {"type":"choose","q":"I've got an apple and a banana. ___ apple is red.","options":["A","An","The"],"a":["The"],"hint":"We already know which apple, so use the."},
              {"type":"choose","q":"There's a man at the door. ___ man is tall.","options":["A","The"],"a":["The"],"hint":"We already know which man, so use the."},
              {"type":"gap","q":"There's ___ bird on the roof. (a / an / the)","a":["a"],"hint":"First time we talk about the bird: a."},
              {"type":"fix","q":"Which sentence is correct?","options":["She's got a dog. The dog is very small.","She's got the dog. A dog is very small."],"a":["She's got a dog. The dog is very small."],"hint":"First time: a dog. After that: the dog."}
            ]
          },
          {
            learn: {"title":"the: only one, and places we know","rule":"Use the with things there is only one of: the sun, the moon, the sky, the sea. Use the with places in a town when we know which one we mean: the park, the station, the shop.","table":[["Only one","A place we know"],["the sun","the park"],["the moon","the station"],["the sky","the shop"],["the sea","the cinema"]],"examples":["The sun is very hot today.","The moon is beautiful tonight.","The sky is blue.","My mum is at the shop.","The children are in the park."],"uz":"Dunyoda bitta bo‘lgan narsalar oldidan the ishlatiladi: the sun — quyosh, the moon — oy, the sky — osmon."},
            practise: [
              {"type":"choose","q":"___ sun is in the sky.","options":["A","The"],"a":["The"],"hint":"There is only one sun: the sun."},
              {"type":"choose","q":"The stars are in ___ sky.","options":["a","the"],"a":["the"],"hint":"There is only one sky: the sky."},
              {"type":"gap","q":"My dad is at ___ station. (we know which station)","a":["the"],"hint":"We know which station: the."},
              {"type":"choose","q":"Is there ___ cafe near here?","options":["a","the"],"a":["a"],"hint":"Any cafe, first time: a."},
              {"type":"fix","q":"Which sentence is correct?","options":["The moon is very bright tonight.","A moon is very bright tonight.","Moon is very bright tonight."],"a":["The moon is very bright tonight."],"hint":"There is only one moon: the moon."}
            ]
          },
          {
            learn: {"title":"No article","rule":"Don't use a, an or the before names of people, cities and countries: Tom, London, Spain. Don't use them in these phrases: at home, at school, at work. Never use a / an with plural nouns: cats (not a cats).","table":[["No article","Not"],["Tom is my friend.","The Tom is my friend."],["London is a big city.","The London is a big city."],["She is at home.","She is at the home."],["Cats are good pets.","A cats are good pets."]],"examples":["Tom is at school.","My mum is at work.","London is a big city.","Spain is a beautiful country.","Dogs are friendly animals."],"uz":"Ism, shahar va davlat nomlari oldidan hamda at home, at school, at work iboralarida artikl ishlatilmaydi: My mum is at work — Onam ishda."},
            practise: [
              {"type":"choose","q":"My brother is at ___.","options":["home","the home","a home"],"a":["home"],"hint":"We say at home, with no article."},
              {"type":"choose","q":"___ is a big city.","options":["London","The London","A London"],"a":["London"],"hint":"No article before the name of a city."},
              {"type":"choose","q":"My dad is at ___ now.","options":["work","the work","a work"],"a":["work"],"hint":"We say at work, with no article."},
              {"type":"fix","q":"Which sentence is correct?","options":["Cats are good pets.","A cats are good pets."],"a":["Cats are good pets."],"hint":"Never use a / an with a plural noun (cats)."},
              {"type":"gap","q":"Emma is ill. She is at ___ today, in bed.","a":["home"],"hint":"We say at home, with no article."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I've got ___ umbrella.","options":["a","an"],"a":["an"]},
          {"type":"choose","q":"There's a cat in the garden. ___ cat is grey.","options":["A","The"],"a":["The"]},
          {"type":"choose","q":"___ moon is very big tonight.","options":["A","The"],"a":["The"]},
          {"type":"choose","q":"There ___ two banks in this street.","options":["is","are"],"a":["are"],"from":"g6"},
          {"type":"gap","q":"My uncle is ___ farmer. (a job)","a":["a"]},
          {"type":"choose","q":"My parents are at ___.","options":["work","the work","a work"],"a":["work"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I've got a dog. The dog's name is Rex.","I've got the dog. A dog's name is Rex."],"a":["I've got a dog. The dog's name is Rex."]},
          {"type":"choose","q":"Paris is ___ beautiful city.","options":["a","an","the"],"a":["a"]},
          {"type":"gap","q":"I ___ got a brother. I've got two sisters. (negative)","a":["haven't","have not"],"from":"g5"},
          {"type":"gap","q":"The children are at ___ today. It's Sunday. (the place where you live)","a":["home"]},
          {"type":"choose","q":"It's ___ old castle.","options":["a","an"],"a":["an"]},
          {"type":"order","q":"Put the words in order.","words":["sky","The","blue","is"],"a":["The sky is blue."]},
          {"type":"fix","q":"Which sentence is correct?","options":["She's a nurse.","She's nurse.","She's an nurse."],"a":["She's a nurse."]},
          {"type":"choose","q":"Are ___ your keys here on the table?","options":["this","these","that"],"a":["these"],"from":"g4"},
          {"type":"gap","q":"Sam has got a bike and a scooter. ___ bike is red. (a / an / the)","a":["The"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Sophie is my best friend.","The Sophie is my best friend."],"a":["Sophie is my best friend."]},
          {"type":"order","q":"Put the words in order.","words":["is","at","My","work","mum"],"a":["My mum is at work."]},
          {"type":"choose","q":"There are many fish in ___ sea.","options":["a","the"],"a":["the"]},
          {"type":"choose","q":"one woman, two ___","options":["womans","women","womens"],"a":["women"],"from":"g3"},
          {"type":"choose","q":"Is there ___ hospital in your town?","options":["a","an","the"],"a":["a"]}
        ]
      },
      {
        id: "g8", no: 8, title: "Countable and Uncountable Nouns", v: 1,
        chunks: [
          {
            learn: {"title":"Can you count it?","rule":"Countable nouns are things you can count: one apple, two apples. They have a plural, and you can use a / an with one. Uncountable nouns are things you can't count, like water, milk, rice, bread, money, sugar and music. They have no plural and no a / an, and they go with is: The water is cold.","table":[["Countable","Uncountable"],["an apple, two apples","water"],["a banana, bananas","milk"],["an egg, eggs","bread"],["a bottle, bottles","rice"],["a coin, coins","money"]],"examples":["I've got an apple.","There are three eggs in the fridge.","The milk is in the fridge.","Rice is good for you.","My money is in my bag."],"uz":"Sanaladigan otlar (apple — olma) ko‘plikda -s oladi va a / an bilan keladi. Sanalmaydigan otlar (water — suv, rice — guruch) -s ham, a / an ham olmaydi."},
            practise: [
              {"type":"choose","q":"Which word is uncountable?","options":["apple","milk","egg"],"a":["milk"],"hint":"You can't count milk, so it is uncountable."},
              {"type":"choose","q":"Which word is countable?","options":["bread","banana","water"],"a":["banana"],"hint":"You can count bananas: one banana, two bananas."},
              {"type":"fix","q":"Which sentence is correct?","options":["The water is cold.","The waters are cold.","A water is cold."],"a":["The water is cold."],"hint":"Water is uncountable: no -s, no a, and use is."},
              {"type":"fix","q":"Which sentence is correct?","options":["My money is in my bag.","My moneys are in my bag."],"a":["My money is in my bag."],"hint":"Money is uncountable: no -s, and use is."},
              {"type":"gap","q":"There ___ rice in the bowl. (is / are)","a":["is"],"hint":"Rice is uncountable, so use is."}
            ]
          },
          {
            learn: {"title":"a bottle of, a cup of, a piece of","rule":"To count uncountable things, use a word for a container or an amount: a bottle of water, a cup of tea, a piece of cake, a kilo of rice. For more than one, put -s on the container word: two cups of tea (not two cup of teas).","table":[["Amount","Example"],["a bottle of","a bottle of water"],["a cup of","a cup of tea"],["a glass of","a glass of milk"],["a piece of","a piece of cake / paper"],["a kilo of","a kilo of rice"],["a loaf of","a loaf of bread"]],"examples":["a cup of coffee","two bottles of juice","three pieces of paper","There's a glass of milk on the table.","I've got two kilos of sugar."],"uz":"Sanalmaydigan narsani sanash uchun idish yoki o‘lchov so‘zi ishlatiladi: a cup of tea — bir piyola choy. Ko‘plik -s idish so‘ziga qo‘shiladi: two cups of tea."},
            practise: [
              {"type":"choose","q":"a ___ of water","options":["bottle","piece"],"a":["bottle"],"hint":"Water is in a bottle: a bottle of water."},
              {"type":"choose","q":"a ___ of cake","options":["piece","bottle"],"a":["piece"],"hint":"We cut cake into pieces: a piece of cake."},
              {"type":"gap","q":"two ___ of tea (cup)","a":["cups"],"hint":"Put -s on the container word: two cups of tea."},
              {"type":"choose","q":"three ___ of bread","options":["loaves","loafs"],"a":["loaves"],"hint":"loaf → loaves (like leaf → leaves)."},
              {"type":"fix","q":"Which sentence is correct?","options":["two glasses of milk","two glass of milks","two glasses of milks"],"a":["two glasses of milk"],"hint":"The -es goes on glass, never on milk."}
            ]
          },
          {
            learn: {"title":"How many? How much?","rule":"Ask How many + a plural noun (countable): How many apples? Ask How much + an uncountable noun: How much water? A lot of works with both: a lot of books, a lot of milk.","table":[["Countable","Uncountable"],["How many eggs are there?","How much milk is there?"],["How many brothers have you got?","How much money have you got?"],["There are a lot of books.","There is a lot of snow."]],"examples":["How many brothers have you got?","How much money have you got?","How many students are there in your class?","How much milk is there in the fridge?","There are a lot of books in the library.","There is a lot of snow today."],"uz":"How many — sanaladigan otlar bilan (nechta?), how much — sanalmaydigan otlar bilan (qancha?). A lot of — ikkalasi bilan ham (ko‘p)."},
            practise: [
              {"type":"choose","q":"How ___ apples are there?","options":["much","many"],"a":["many"],"hint":"Apples are countable: how many."},
              {"type":"choose","q":"How ___ sugar is there?","options":["much","many"],"a":["much"],"hint":"Sugar is uncountable: how much."},
              {"type":"choose","q":"How ___ chairs are there in the room?","options":["much","many"],"a":["many"],"hint":"Chairs are countable: how many."},
              {"type":"gap","q":"How ___ milk have you got? (much / many)","a":["much"],"hint":"Milk is uncountable: how much."},
              {"type":"order","q":"Put the words in order.","words":["many","How","there","are","cups"],"a":["How many cups are there?"],"hint":"How many + cups + are there?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"Which word is uncountable?","options":["rice","egg","bag"],"a":["rice"]},
          {"type":"choose","q":"Which word is countable?","options":["sugar","chair","milk"],"a":["chair"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The bread is fresh.","The breads are fresh.","A bread is fresh."],"a":["The bread is fresh."]},
          {"type":"gap","q":"My aunt is ___ engineer. (a / an)","a":["an"],"from":"g7"},
          {"type":"choose","q":"The juice ___ cold.","options":["is","are"],"a":["is"]},
          {"type":"choose","q":"a ___ of milk","options":["glass","piece"],"a":["glass"]},
          {"type":"gap","q":"two ___ of water (bottle)","a":["bottles"]},
          {"type":"choose","q":"a ___ of paper","options":["piece","bottle"],"a":["piece"]},
          {"type":"choose","q":"___ there a supermarket near your house?","options":["Is","Are"],"a":["Is"],"from":"g6"},
          {"type":"choose","q":"How ___ eggs are there?","options":["much","many"],"a":["many"]},
          {"type":"choose","q":"How ___ money have you got?","options":["much","many"],"a":["much"]},
          {"type":"gap","q":"How ___ tea is there in the pot? (much / many)","a":["much"]},
          {"type":"order","q":"Put the words in order.","words":["of","a","coffee","cup"],"a":["a cup of coffee"]},
          {"type":"choose","q":"Lily ___ got a new phone.","options":["have","has"],"a":["has"],"from":"g5"},
          {"type":"fix","q":"Which sentence is correct?","options":["My hair is long.","My hairs are long."],"a":["My hair is long."]},
          {"type":"gap","q":"How ___ students are there in your class? (much / many)","a":["many"]},
          {"type":"choose","q":"There are a lot of ___ in the park.","options":["tree","trees"],"a":["trees"]},
          {"type":"fix","q":"Which sentence is correct?","options":["There is a lot of water in the bottle.","There are a lot of water in the bottle."],"a":["There is a lot of water in the bottle."]},
          {"type":"gap","q":"one knife, two ___","a":["knives"],"from":"g3"},
          {"type":"order","q":"Put the words in order.","words":["much","How","is","there","rice"],"a":["How much rice is there?"]}
        ]
      },
      {
        id: "g9", no: 9, title: "Some and Any", v: 1,
        chunks: [
          {
            learn: {"title":"some in positive sentences","rule":"Use some in positive sentences with plural nouns and uncountable nouns. It means a few or a little — we don't say exactly how many or how much: There are some eggs. There is some milk.","table":[["","Plural (countable)","Uncountable"],["Positive (+)","There are some apples.","There is some milk."]],"examples":["There are some books on the shelf.","I've got some money.","There is some cheese in the fridge.","Some students are in the library.","We've got some new neighbours."],"uz":"some — “bir nechta / biroz” degani. Darak gaplarda ko‘plikdagi va sanalmaydigan otlar bilan ishlatiladi: There is some milk — Biroz sut bor."},
            practise: [
              {"type":"choose","q":"There are ___ pens on the desk.","options":["some","a"],"a":["some"],"hint":"Pens is plural, so use some (not a)."},
              {"type":"choose","q":"There is ___ water in the glass.","options":["some","a"],"a":["some"],"hint":"Water is uncountable, so use some (not a)."},
              {"type":"gap","q":"I've got ___ friends in London. (some / any)","a":["some"],"hint":"A positive sentence: some."},
              {"type":"fix","q":"Which sentence is correct?","options":["There are some oranges in the bag.","There are a oranges in the bag.","There is some oranges in the bag."],"a":["There are some oranges in the bag."],"hint":"Oranges is plural: there are some oranges."},
              {"type":"order","q":"Put the words in order.","words":["some","There","is","bread"],"a":["There is some bread."],"hint":"There is + some + bread."}
            ]
          },
          {
            learn: {"title":"any in negatives and questions","rule":"Use any in negative sentences and in questions, with plural nouns and uncountable nouns: There aren't any eggs. Is there any milk? Have you got any brothers?","table":[["","Plural (countable)","Uncountable"],["Negative (-)","There aren't any eggs.","There isn't any milk."],["Question (?)","Are there any eggs?","Is there any milk?"]],"examples":["I haven't got any money.","There aren't any chairs in the room.","Is there any sugar?","Have you got any pets?","There isn't any juice in the fridge."],"uz":"any — inkor va so‘roq gaplarda ishlatiladi: Is there any milk? — Sut bormi? There isn't any milk — Umuman sut yo‘q."},
            practise: [
              {"type":"choose","q":"There aren't ___ cars in the street.","options":["some","any"],"a":["any"],"hint":"A negative sentence (aren't): any."},
              {"type":"choose","q":"Have you got ___ sisters?","options":["some","any"],"a":["any"],"hint":"A question: any."},
              {"type":"gap","q":"Is there ___ rice? (some / any)","a":["any"],"hint":"A question: any."},
              {"type":"gap","q":"We haven't got ___ bread. (some / any)","a":["any"],"hint":"A negative sentence (haven't): any."},
              {"type":"fix","q":"Which sentence is correct?","options":["There isn't any tea.","There isn't some tea.","There aren't any tea."],"a":["There isn't any tea."],"hint":"Negative: any. Tea is uncountable, so isn't."}
            ]
          },
          {
            learn: {"title":"some when you offer or ask for something","rule":"When you offer something or ask for something, use some in the question: Would you like some tea? Can I have some water, please?","table":[["Offer","Ask for"],["Would you like some cake?","Can I have some cake, please?"],["Would you like some apples?","Can I have some apples, please?"]],"examples":["Would you like some cake?","Can I have some paper, please?","Would you like some coffee? — Yes, please.","Can I have some apples, please?"],"uz":"Biror narsa taklif qilganda yoki so‘raganda so‘roq gapda ham some ishlatiladi: Would you like some tea? — Choy ichasizmi?"},
            practise: [
              {"type":"choose","q":"Would you like ___ juice?","options":["some","any"],"a":["some"],"hint":"An offer (Would you like…?): some."},
              {"type":"choose","q":"Can I have ___ water, please?","options":["some","any"],"a":["some"],"hint":"Asking for something (Can I have…?): some."},
              {"type":"choose","q":"Sorry, there isn't ___ milk.","options":["some","any"],"a":["any"],"hint":"A negative sentence (isn't): any."},
              {"type":"gap","q":"Would you like ___ biscuits? (some / any)","a":["some"],"hint":"An offer: some."},
              {"type":"order","q":"Put the words in order.","words":["you","Would","like","some","tea"],"a":["Would you like some tea?"],"hint":"Would you like + some + tea?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"There are ___ flowers in the garden.","options":["some","any"],"a":["some"]},
          {"type":"choose","q":"There aren't ___ shops in my village.","options":["some","any"],"a":["any"]},
          {"type":"gap","q":"I've got ___ good news for you! (some / any)","a":["some"]},
          {"type":"choose","q":"How ___ bottles of water are there?","options":["much","many"],"a":["many"],"from":"g8"},
          {"type":"choose","q":"Have you got ___ brothers or sisters?","options":["some","any"],"a":["any"]},
          {"type":"gap","q":"There isn't ___ cheese in the fridge. (some / any)","a":["any"]},
          {"type":"choose","q":"Would you like ___ soup?","options":["some","any"],"a":["some"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We haven't got any homework today.","We haven't got some homework today."],"a":["We haven't got any homework today."]},
          {"type":"choose","q":"Which word is uncountable?","options":["cup","money","coin"],"a":["money"],"from":"g8"},
          {"type":"choose","q":"There ___ some milk in the jug.","options":["is","are"],"a":["is"]},
          {"type":"choose","q":"There ___ some eggs in the box.","options":["is","are"],"a":["are"]},
          {"type":"gap","q":"Can I have ___ water, please? (some / any)","a":["some"]},
          {"type":"order","q":"Put the words in order.","words":["any","I","haven't","got","money"],"a":["I haven't got any money."]},
          {"type":"gap","q":"There ___ a computer in the classroom. (is / are)","a":["is"],"from":"g6"},
          {"type":"fix","q":"Which sentence is correct?","options":["There are some apples on the table.","There are any apples on the table.","There is any apples on the table."],"a":["There are some apples on the table."]},
          {"type":"choose","q":"Sorry, there isn't ___ sugar.","options":["some","any"],"a":["any"]},
          {"type":"order","q":"Put the words in order.","words":["some","There","are","cups","the","in","cupboard"],"a":["There are some cups in the cupboard."]},
          {"type":"gap","q":"There aren't ___ chairs in the room. (some / any)","a":["any"]},
          {"type":"choose","q":"My friends are with ___ teacher.","options":["their","they","there"],"a":["their"],"from":"g2"},
          {"type":"choose","q":"I've got ___ new shoes.","options":["some","any"],"a":["some"]}
        ]
      },
      {
        id: "g10", no: 10, title: "Prepositions of Place", v: 1,
        chunks: [
          {
            learn: {"title":"in, on, under","rule":"Prepositions of place tell us where something is. in = inside something: in the box. on = on top of something, touching it: on the table, on the wall. under = below something: under the bed.","table":[["Preposition","Meaning","Example"],["in","inside","The keys are in my bag."],["on","on top of / touching","The book is on the desk."],["under","below","The cat is under the chair."]],"examples":["The milk is in the fridge.","My phone is on the table.","There's a picture on the wall.","The shoes are under the bed.","Tom is in the kitchen."],"uz":"in — ichida, on — ustida (yuzasida), under — ostida: The cat is under the chair — Mushuk stul ostida."},
            practise: [
              {"type":"choose","q":"The pens are ___ the box. (inside it)","options":["in","on","under"],"a":["in"],"hint":"Inside something: in."},
              {"type":"choose","q":"The lamp is ___ the desk. (on top of it)","options":["in","on","under"],"a":["on"],"hint":"On top of something: on."},
              {"type":"choose","q":"The dog is ___ the table. (below it)","options":["in","on","under"],"a":["under"],"hint":"Below something: under."},
              {"type":"gap","q":"There's a clock ___ the wall. (in / on / under)","a":["on"],"hint":"Touching a wall: on the wall."},
              {"type":"fix","q":"Which sentence is correct?","options":["My books are in my bag.","My books are in the my bag.","My books are my bag in."],"a":["My books are in my bag."],"hint":"in + my bag: the preposition comes before the place."}
            ]
          },
          {
            learn: {"title":"next to, between, behind, in front of, opposite, near","rule":"next to = at the side of. between = in the middle of two things. in front of = before something, at its front. behind = at the back of something. opposite = on the other side, facing it. near = not far from.","table":[["Preposition","Example"],["next to","The bank is next to the cafe."],["between","The cafe is between the bank and the shop."],["in front of","The car is in front of the house."],["behind","The garden is behind the house."],["opposite","The school is opposite the park."],["near","My flat is near the station."]],"examples":["Sam is next to Anna in the photo.","The letter B is between A and C.","There's a tree in front of my window.","The ball is behind the sofa.","The pharmacy is opposite the bank.","Is there a bus stop near here?"],"uz":"next to — yonida, between — o‘rtasida (ikki narsa orasida), in front of — oldida, behind — orqasida, opposite — qarshisida, near — yaqinida."},
            practise: [
              {"type":"choose","q":"The number 5 is ___ 4 and 6.","options":["between","behind","under"],"a":["between"],"hint":"In the middle of two things: between."},
              {"type":"choose","q":"The garden is ___ the house, at the back.","options":["behind","in front of","on"],"a":["behind"],"hint":"At the back of something: behind."},
              {"type":"choose","q":"Tom is ___ Ben. They are side by side.","options":["next to","under","opposite"],"a":["next to"],"hint":"At the side of someone: next to."},
              {"type":"gap","q":"The cafe is ___ the park. It is on the other side of the street, facing it.","a":["opposite"],"hint":"On the other side, facing it: opposite."},
              {"type":"gap","q":"The teacher is ___ the class, so everyone can see her. (three words)","a":["in front of"],"hint":"At the front of something: in front of."}
            ]
          },
          {
            learn: {"title":"at, in, on for places","rule":"Use at for a point or a place where you do something: at the door, at the bus stop, at home, at school, at work. Use in for cities, countries and rooms: in Paris, in Spain, in the bedroom. Use on for floors and for buses and trains: on the second floor, on the bus.","table":[["at","in","on"],["at the door","in London","on the first floor"],["at the bus stop","in Spain","on the bus"],["at school / at home / at work","in the kitchen","on the train"]],"examples":["There's someone at the door.","My sister is at school.","My grandparents are in Spain.","Our flat is on the third floor.","The children are on the bus."],"uz":"at — biror nuqtada yoki joyda (at home — uyda, at school — maktabda), in — shahar, davlat yoki xona ichida (in London), on — qavatda yoki avtobusda (on the bus)."},
            practise: [
              {"type":"choose","q":"My mum is ___ work.","options":["at","in","on"],"a":["at"],"hint":"We say at work."},
              {"type":"choose","q":"They are ___ Paris.","options":["at","in","on"],"a":["in"],"hint":"A city: in."},
              {"type":"choose","q":"Our classroom is ___ the first floor.","options":["at","in","on"],"a":["on"],"hint":"A floor: on."},
              {"type":"choose","q":"Anna is ___ the bus stop.","options":["at","in","on"],"a":["at"],"hint":"A point where you wait: at the bus stop."},
              {"type":"fix","q":"Which sentence is correct?","options":["Sam is at home.","Sam is in home.","Sam is on home."],"a":["Sam is at home."],"hint":"We say at home."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"The keys are ___ my pocket.","options":["in","on","under"],"a":["in"]},
          {"type":"choose","q":"There is a carpet ___ the floor.","options":["in","on","under"],"a":["on"]},
          {"type":"choose","q":"My slippers are ___ the bed. (below it)","options":["in","on","under"],"a":["under"]},
          {"type":"choose","q":"There aren't ___ eggs in the fridge.","options":["some","any"],"a":["any"],"from":"g9"},
          {"type":"choose","q":"B is ___ A and C.","options":["between","next","behind"],"a":["between"]},
          {"type":"gap","q":"The bank is ___ the post office. It is on the other side of the road, facing it.","a":["opposite"]},
          {"type":"choose","q":"The garden is ___ the house. You can't see it from the street.","options":["behind","in front of","between"],"a":["behind"]},
          {"type":"gap","q":"My house is ___ the school. It's only two minutes away. (not far from)","a":["near","close to"]},
          {"type":"choose","q":"a ___ of bread","options":["bottle","loaf","glass"],"a":["loaf"],"from":"g8"},
          {"type":"choose","q":"My cousins are ___ Italy.","options":["at","in","on"],"a":["in"]},
          {"type":"choose","q":"Our flat is ___ the fifth floor.","options":["at","in","on"],"a":["on"]},
          {"type":"order","q":"Put the words in order.","words":["is","The","under","ball","the","chair"],"a":["The ball is under the chair."]},
          {"type":"fix","q":"Which sentence is correct?","options":["The bank is next to the cafe.","The bank is next the cafe.","The bank is next of the cafe."],"a":["The bank is next to the cafe."]},
          {"type":"choose","q":"___ sky is grey today.","options":["A","The"],"a":["The"],"from":"g7"},
          {"type":"gap","q":"The car is ___ the house, so we can see it from the window. (three words)","a":["in front of"]},
          {"type":"order","q":"Put the words in order.","words":["in","My","is","phone","my","bag"],"a":["My phone is in my bag."]},
          {"type":"gap","q":"The picture is ___ the wall. (in / on / under)","a":["on"]},
          {"type":"fix","q":"Which sentence is correct?","options":["They are on the bus.","They are at the bus."],"a":["They are on the bus."]},
          {"type":"choose","q":"___ is my school over there.","options":["This","That","These"],"a":["That"],"from":"g4"},
          {"type":"choose","q":"There's someone ___ the door.","options":["at","in","on"],"a":["at"]}
        ]
      },
      {
        id: "g11", no: 11, title: "Present Simple (Affirmative)", v: 1,
        chunks: [
          {
            learn: {"title":"I work, they play","rule":"Use the present simple for habits and routines (things you do every day, every week…) and for facts (things that are always true). With I, you, we and they, use the verb as it is: I play, they work.","table":[["Person","Verb","Example"],["I","play","I play football."],["you","play","You play the guitar."],["we","play","We play chess."],["they","play","They play tennis."]],"examples":["I get up at seven o'clock.","We go to school by bus.","You speak English very well.","My parents work in a hospital.","Cows eat grass."],"uz":"Present Simple har kuni, doimo bo‘ladigan ish-harakatlar va haqiqatlar uchun ishlatiladi. I, you, we, they bilan fe’l o‘zgarmaydi: I play — Men o‘ynayman."},
            practise: [
              {"type":"choose","q":"I ___ tea every morning.","options":["drink","drinks"],"a":["drink"],"hint":"With I, the verb has no -s."},
              {"type":"choose","q":"We ___ in a small flat.","options":["live","lives"],"a":["live"],"hint":"With we, the verb has no -s."},
              {"type":"gap","q":"They ___ football on Saturdays. (play)","a":["play"],"hint":"With they, the verb has no -s."},
              {"type":"gap","q":"My friends ___ to the same school. (go)","a":["go"],"hint":"My friends = they, so the verb has no -s."},
              {"type":"order","q":"Put the words in order.","words":["English","I","speak"],"a":["I speak English."],"hint":"Person + verb + what: I speak English."}
            ]
          },
          {
            learn: {"title":"he works, she plays","rule":"With he, she and it (and one person or thing, like Tom or my cat), add -s to the verb: she works, he plays, it rains. Don't forget the -s!","table":[["I / you / we / they","he / she / it"],["I work","she works"],["they play","he plays"],["you read","Tom reads"],["we sleep","my cat sleeps"]],"examples":["She works in a bank.","Tom plays the guitar.","My cat sleeps a lot.","It rains a lot in April.","Anna lives near the sea."],"uz":"he, she, it bilan fe’lga -s qo‘shiladi: She works — U ishlaydi. Bu -s ni unutmang!"},
            practise: [
              {"type":"choose","q":"She ___ in a shop.","options":["work","works"],"a":["works"],"hint":"With she, add -s: works."},
              {"type":"choose","q":"My brother ___ computer games.","options":["play","plays"],"a":["plays"],"hint":"My brother = he, so add -s: plays."},
              {"type":"gap","q":"Lucy ___ milk every day. (drink)","a":["drinks"],"hint":"Lucy = she, so add -s: drinks."},
              {"type":"gap","q":"The shop ___ at nine o'clock. (open)","a":["opens"],"hint":"The shop = it, so add -s: opens."},
              {"type":"fix","q":"Which sentence is correct?","options":["He likes pizza.","He like pizza.","He liking pizza."],"a":["He likes pizza."],"hint":"With he, add -s: likes."}
            ]
          },
          {
            learn: {"title":"goes, watches, studies, has","rule":"Verbs that end in -s, -sh, -ch, -x or -o add -es: watch → watches, go → goes, do → does. If a verb ends in a consonant + y, change y to i and add -es: study → studies. If it ends in a vowel + y, just add -s: play → plays. have → has.","table":[["Ending","he / she / it","Example"],["most verbs","+ s","work → works"],["-s, -sh, -ch, -x, -o","+ es","watch → watches, go → goes, do → does"],["consonant + y","y → ies","study → studies, fly → flies"],["have","has","have → has"]],"examples":["He watches TV in the evening.","She goes to bed at ten.","My dad washes the car on Sundays.","Emma studies English.","Sam has breakfast at eight."],"uz":"-s, -sh, -ch, -x, -o bilan tugagan fe’llarga -es qo‘shiladi (goes). Undosh + y bo‘lsa, y → ies (studies). have esa has bo‘ladi."},
            practise: [
              {"type":"choose","q":"She ___ to school by bus.","options":["gos","goes"],"a":["goes"],"hint":"go ends in -o, so add -es: goes."},
              {"type":"choose","q":"He ___ TV every evening.","options":["watchs","watches"],"a":["watches"],"hint":"watch ends in -ch, so add -es: watches."},
              {"type":"gap","q":"My sister ___ French. (study)","a":["studies"],"hint":"d + y: change y to i and add -es: studies."},
              {"type":"gap","q":"Tom ___ lunch at one o'clock. (have)","a":["has"],"hint":"With he, have → has."},
              {"type":"fix","q":"Which sentence is correct?","options":["The bird flies over the house.","The bird flys over the house.","The bird fly over the house."],"a":["The bird flies over the house."],"hint":"l + y: change y to i and add -es: flies."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ my homework after school.","options":["do","does"],"a":["do"]},
          {"type":"choose","q":"My mother ___ coffee in the morning.","options":["drink","drinks"],"a":["drinks"]},
          {"type":"gap","q":"We ___ English on Mondays. (study)","a":["study"]},
          {"type":"choose","q":"The cat is ___ the sofa. (below it)","options":["in","on","under"],"a":["under"],"from":"g10"},
          {"type":"gap","q":"He ___ to work by car. (go)","a":["goes"]},
          {"type":"choose","q":"The baby ___ a lot.","options":["cry","crys","cries"],"a":["cries"]},
          {"type":"choose","q":"They ___ in a big city.","options":["live","lives"],"a":["live"]},
          {"type":"gap","q":"Anna ___ her teeth twice a day. (brush)","a":["brushes"]},
          {"type":"gap","q":"We haven't got ___ milk. (some / any)","a":["any"],"from":"g9"},
          {"type":"fix","q":"Which sentence is correct?","options":["My father works in an office.","My father work in an office.","My father working in an office."],"a":["My father works in an office."]},
          {"type":"choose","q":"Our lesson ___ at nine.","options":["start","starts"],"a":["starts"]},
          {"type":"gap","q":"Ben ___ a shower every morning. (have)","a":["has"]},
          {"type":"order","q":"Put the words in order.","words":["plays","Sam","tennis"],"a":["Sam plays tennis."]},
          {"type":"choose","q":"My dad is ___ engineer.","options":["a","an"],"a":["an"],"from":"g7"},
          {"type":"choose","q":"The sun ___ in the east.","options":["rise","rises"],"a":["rises"]},
          {"type":"gap","q":"My cat ___ on my bed. (sleep)","a":["sleeps"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She does her homework.","She dos her homework.","She do her homework."],"a":["She does her homework."]},
          {"type":"order","q":"Put the words in order.","words":["at","I","get","seven","up"],"a":["I get up at seven."]},
          {"type":"choose","q":"My parents ___ at home.","options":["is","am","are"],"a":["are"],"from":"g1"},
          {"type":"choose","q":"Emma and Lily ___ to music.","options":["listen","listens"],"a":["listen"]}
        ]
      },
      {
        id: "g12", no: 12, title: "Present Simple (Negative and Questions)", v: 1,
        chunks: [
          {
            learn: {"title":"don't and doesn't","rule":"To make a negative, use don't (do not) with I, you, we, they, and doesn't (does not) with he, she, it. Then use the verb as it is. After doesn't, the verb has no -s: She doesn't like fish (not She doesn't likes).","table":[["Person","Negative","Example"],["I / you / we / they","don't + verb","I don't eat meat."],["he / she / it","doesn't + verb","He doesn't eat meat."]],"examples":["I don't drink coffee.","We don't have lessons on Sunday.","My brother doesn't like fish.","It doesn't snow here in summer.","Anna doesn't work on Fridays."],"uz":"Inkor gap: don't / doesn't + fe’l. doesn't dan keyin fe’lga -s qo‘shilmaydi: She doesn't like fish — U baliqni yoqtirmaydi."},
            practise: [
              {"type":"choose","q":"I ___ like tea.","options":["don't","doesn't"],"a":["don't"],"hint":"With I, use don't."},
              {"type":"choose","q":"He ___ play football.","options":["don't","doesn't"],"a":["doesn't"],"hint":"With he, use doesn't."},
              {"type":"choose","q":"She doesn't ___ in London.","options":["live","lives"],"a":["live"],"hint":"After doesn't, the verb has no -s."},
              {"type":"gap","q":"We ___ go to school on Sunday. (negative)","a":["don't","do not"],"hint":"With we, use don't (do not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["Tom doesn't watch TV.","Tom don't watch TV.","Tom doesn't watches TV."],"a":["Tom doesn't watch TV."],"hint":"Tom = he: doesn't + watch (no -s)."}
            ]
          },
          {
            learn: {"title":"Do you…? Does she…?","rule":"To ask a question, use Do with I, you, we, they and Does with he, she, it, then the person, then the verb: Do you like music? Does he speak French? After Does, the verb has no -s. Short answers: Yes, I do. / No, I don't. Yes, she does. / No, she doesn't.","table":[["Question","Short answer"],["Do you like music?","Yes, I do. / No, I don't."],["Does he speak French?","Yes, he does. / No, he doesn't."],["Do they live here?","Yes, they do. / No, they don't."]],"examples":["Do you play chess? — Yes, I do.","Does your sister work? — No, she doesn't.","Do they go to school by bus?","Does it rain a lot in your town?","Do we have homework today?"],"uz":"So‘roq gap Do yoki Does bilan boshlanadi: Do you like music? — Siz musiqani yoqtirasizmi? Does dan keyin ham fe’lga -s qo‘shilmaydi."},
            practise: [
              {"type":"choose","q":"___ you like pizza?","options":["Do","Does"],"a":["Do"],"hint":"With you, start with Do."},
              {"type":"choose","q":"___ she speak English?","options":["Do","Does"],"a":["Does"],"hint":"With she, start with Does."},
              {"type":"choose","q":"Does Sam ___ a bike?","options":["have","has"],"a":["have"],"hint":"After Does, the verb has no -s: have."},
              {"type":"gap","q":"Do you live near here? — Yes, I ___.","a":["do"],"hint":"Do you…? — Yes, I do."},
              {"type":"gap","q":"Does your dad cook? — No, he ___.","a":["doesn't","does not"],"hint":"Does he…? — No, he doesn't."}
            ]
          },
          {
            learn: {"title":"Where do you…? What time does it…?","rule":"Question words come first: What, Where, When, What time, Who, How. Then do or does, then the person, then the verb: Where do you live? What time does the film start?","table":[["Question word","do / does","Person","Verb"],["Where","do","you","live?"],["What","does","she","eat for breakfast?"],["What time","do","they","get up?"],["How","does","he","go to school?"]],"examples":["Where do you work?","What does Tom do? — He's a doctor.","When do you play football?","What time does the lesson start?","How do you go to school? — By bus."],"uz":"Savol so‘zi (What, Where, When…) birinchi keladi, keyin do / does, keyin shaxs va fe’l: Where do you live? — Qayerda yashaysiz?"},
            practise: [
              {"type":"choose","q":"Where ___ you live?","options":["do","does"],"a":["do"],"hint":"With you, use do."},
              {"type":"choose","q":"What time ___ the shop open?","options":["do","does"],"a":["does"],"hint":"The shop = it, so use does."},
              {"type":"order","q":"Put the words in order.","words":["do","What","you","eat"],"a":["What do you eat?"],"hint":"Question word + do + person + verb."},
              {"type":"gap","q":"Where ___ your sister work? (do / does)","a":["does"],"hint":"Your sister = she, so use does."},
              {"type":"fix","q":"Which sentence is correct?","options":["What does he want?","What does he wants?","What he does want?"],"a":["What does he want?"],"hint":"What + does + he + want (no -s after does)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ eat meat.","options":["don't","doesn't"],"a":["don't"]},
          {"type":"choose","q":"My sister ___ like cats.","options":["don't","doesn't"],"a":["doesn't"]},
          {"type":"gap","q":"They ___ watch TV in the morning. (negative)","a":["don't","do not"]},
          {"type":"choose","q":"She ___ a shower every morning.","options":["have","has"],"a":["has"],"from":"g11"},
          {"type":"choose","q":"He doesn't ___ to music.","options":["listen","listens"],"a":["listen"]},
          {"type":"choose","q":"___ your parents speak English?","options":["Do","Does"],"a":["Do"]},
          {"type":"choose","q":"___ Tom play the piano?","options":["Do","Does"],"a":["Does"]},
          {"type":"gap","q":"Do you like ice cream? — Yes, I ___.","a":["do"]},
          {"type":"gap","q":"My brother ___ TV every evening. (watch)","a":["watches"],"from":"g11"},
          {"type":"gap","q":"Does Anna live in Paris? — No, she ___.","a":["doesn't","does not"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Does she work here?","Do she work here?","Does she works here?"],"a":["Does she work here?"]},
          {"type":"choose","q":"Where ___ he go after school?","options":["do","does"],"a":["does"]},
          {"type":"order","q":"Put the words in order.","words":["you","Do","play","football"],"a":["Do you play football?"]},
          {"type":"choose","q":"The picture is ___ the wall.","options":["in","on","under"],"a":["on"],"from":"g10"},
          {"type":"gap","q":"What time ___ you get up? (do / does)","a":["do"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We don't have a car.","We doesn't have a car.","We don't has a car."],"a":["We don't have a car."]},
          {"type":"order","q":"Put the words in order.","words":["does","Where","she","live"],"a":["Where does she live?"]},
          {"type":"choose","q":"What ___ your father do? — He's a pilot.","options":["do","does"],"a":["does"]},
          {"type":"choose","q":"How ___ water is there?","options":["much","many"],"a":["much"],"from":"g8"},
          {"type":"fix","q":"Which sentence is correct?","options":["It doesn't rain much here in summer.","It don't rain much here in summer.","It doesn't rains much here in summer."],"a":["It doesn't rain much here in summer."]}
        ]
      },
      {
        id: "g13", no: 13, title: "Adverbs of Frequency", v: 1,
        chunks: [
          {
            learn: {"title":"always, usually, often, sometimes, rarely, never","rule":"Adverbs of frequency say how often something happens. always = every time. never = not at any time. The others are in between: usually, often, sometimes, rarely.","table":[["Word","How often"],["always","100% — every time"],["usually","about 90%"],["often","about 70%"],["sometimes","about 50%"],["rarely","about 10%"],["never","0% — not at any time"]],"examples":["I always brush my teeth in the morning.","We usually have dinner at seven.","Tom often plays computer games.","I sometimes walk to school.","My dad rarely watches TV.","Anna never drinks coffee."],"uz":"Bu so‘zlar ish qanchalik tez-tez bo‘lishini bildiradi: always — doim, usually — odatda, often — tez-tez, sometimes — ba’zan, rarely — kamdan-kam, never — hech qachon."},
            practise: [
              {"type":"choose","q":"I brush my teeth every morning and every evening. I ___ brush my teeth.","options":["always","never"],"a":["always"],"hint":"Every time = always."},
              {"type":"choose","q":"Sam doesn't like fish. He ___ eats fish.","options":["always","never"],"a":["never"],"hint":"Not at any time = never."},
              {"type":"choose","q":"Which word means about 50%: at some times, but not always?","options":["sometimes","never","always"],"a":["sometimes"],"hint":"About 50% = sometimes."},
              {"type":"choose","q":"Kate goes swimming five days a week. She ___ goes swimming.","options":["often","never","rarely"],"a":["often"],"hint":"Five days a week is a lot = often."},
              {"type":"gap","q":"I go to the cinema once a year. I ___ go to the cinema. (rarely / always)","a":["rarely"],"hint":"Once a year is not much = rarely."}
            ]
          },
          {
            learn: {"title":"Where does it go?","rule":"The adverb goes before the main verb: I often play tennis. But it goes after am, is, are: She is always happy. In a negative, it goes after don't / doesn't: I don't usually eat meat.","table":[["","Where","Example"],["a main verb (play, eat, go…)","before the verb","I often play tennis."],["am / is / are","after it","She is always happy."],["don't / doesn't","after it","I don't usually eat meat."]],"examples":["I usually get up at seven.","My mum often cooks rice.","We are never late for school.","He is sometimes tired after work.","They always visit their grandmother on Sunday."],"uz":"Bu so‘zlar asosiy fe’ldan oldin keladi (I often play), lekin am, is, are dan keyin keladi (She is always happy)."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I always get up early.","I get always up early.","Always I get up early."],"a":["I always get up early."],"hint":"The adverb goes before the main verb (get up)."},
              {"type":"fix","q":"Which sentence is correct?","options":["She is never late.","She never is late.","Never she is late."],"a":["She is never late."],"hint":"The adverb goes after is."},
              {"type":"order","q":"Put the words in order.","words":["always","We","walk","school","to"],"a":["We always walk to school."],"hint":"We + always + walk (the adverb before the verb)."},
              {"type":"order","q":"Put the words in order.","words":["is","He","often","hungry"],"a":["He is often hungry."],"hint":"He + is + often (the adverb after is)."},
              {"type":"fix","q":"Which sentence is correct?","options":["Anna never drinks coffee.","Anna drinks never coffee.","Anna never drink coffee."],"a":["Anna never drinks coffee."],"hint":"never goes before the verb, and Anna = she, so drinks."}
            ]
          },
          {
            learn: {"title":"How often? Once a week, twice a week","rule":"Ask How often…? to find out how many times. Answer with an adverb, or with every day, once a week (one time), twice a week (two times), three times a month. These go at the end of the sentence. Never is already negative, so don't use it with don't: I never eat meat (not I don't never eat meat).","table":[["How many times?","We say"],["1 time","once a day / once a week"],["2 times","twice a week / twice a month"],["3 or more times","three times a week / four times a year"],["each day","every day"]],"examples":["How often do you go to the gym? — Three times a week.","I visit my grandparents every Sunday.","She calls her mum once a day.","We have English twice a week.","I never drink cola."],"uz":"How often…? — Qanchalik tez-tez…? Javob: every day — har kuni, once a week — haftada bir marta, twice a week — haftada ikki marta."},
            practise: [
              {"type":"choose","q":"___ often do you play tennis?","options":["How","What","When"],"a":["How"],"hint":"Ask How often…? to find out how many times."},
              {"type":"choose","q":"once a week = ___","options":["one time a week","two times a week"],"a":["one time a week"],"hint":"once = one time."},
              {"type":"gap","q":"I go swimming two times a week. = I go swimming ___ a week.","a":["twice"],"hint":"two times = twice."},
              {"type":"fix","q":"Which sentence is correct?","options":["I never eat meat.","I don't never eat meat."],"a":["I never eat meat."],"hint":"never is already negative: don't use it with don't."},
              {"type":"order","q":"Put the words in order.","words":["often","How","you","do","read"],"a":["How often do you read?"],"hint":"How often + do + you + read?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"Mia goes to bed at ten every night. She ___ goes to bed at ten.","options":["always","never"],"a":["always"]},
          {"type":"choose","q":"I don't like football. I ___ watch it.","options":["often","never"],"a":["never"]},
          {"type":"choose","q":"Which word means about 50%?","options":["sometimes","always","never"],"a":["sometimes"]},
          {"type":"choose","q":"___ your brother like music?","options":["Do","Does"],"a":["Does"],"from":"g12"},
          {"type":"fix","q":"Which sentence is correct?","options":["He usually has toast for breakfast.","He has usually toast for breakfast.","Usually has he toast for breakfast."],"a":["He usually has toast for breakfast."]},
          {"type":"fix","q":"Which sentence is correct?","options":["We are often tired on Monday.","We are tired on often Monday.","Often are we tired on Monday."],"a":["We are often tired on Monday."]},
          {"type":"order","q":"Put the words in order.","words":["never","I","coffee","drink"],"a":["I never drink coffee."]},
          {"type":"gap","q":"I go to the dentist two times a year. = I go to the dentist ___ a year.","a":["twice"]},
          {"type":"gap","q":"I ___ like milk. (negative)","a":["don't","do not"],"from":"g12"},
          {"type":"choose","q":"___ often does your brother play chess?","options":["How","What","Where"],"a":["How"]},
          {"type":"gap","q":"We have English on Monday, Wednesday and Friday. We have English three ___ a week.","a":["times"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She never eats sweets.","She doesn't never eat sweets.","She never eat sweets."],"a":["She never eats sweets."]},
          {"type":"order","q":"Put the words in order.","words":["always","My","is","dad","busy"],"a":["My dad is always busy."]},
          {"type":"gap","q":"My mum ___ to work at eight. (go)","a":["goes"],"from":"g11"},
          {"type":"choose","q":"Tom plays football on most days. He ___ plays football.","options":["usually","never","rarely"],"a":["usually"]},
          {"type":"gap","q":"Lucy watches TV once or twice a year. She ___ watches TV. (rarely / often)","a":["rarely"]},
          {"type":"order","q":"Put the words in order.","words":["sometimes","I","to","walk","school"],"a":["I sometimes walk to school.","I walk to school sometimes."]},
          {"type":"fix","q":"Which sentence is correct?","options":["How often do you visit your aunt?","How often you visit your aunt?","How often does you visit your aunt?"],"a":["How often do you visit your aunt?"]},
          {"type":"choose","q":"Would you like ___ cake?","options":["some","any"],"a":["some"],"from":"g9"},
          {"type":"choose","q":"I see my best friend ___ day.","options":["every","many","once"],"a":["every"]}
        ]
      },
      {
        id: "g14", no: 14, title: "Object Pronouns + Possessive Pronouns", v: 1,
        chunks: [
          {
            learn: {"title":"me, him, her, us, them","rule":"Object pronouns come after a verb (help, like, see…) or after a preposition (with, for, to, at). I → me, you → you, he → him, she → her, it → it, we → us, they → them.","table":[["Subject (before the verb)","Object (after the verb)"],["I","me"],["you","you"],["he","him"],["she","her"],["it","it"],["we","us"],["they","them"]],"examples":["Can you help me?","Tom is my friend. I play football with him.","This is Anna. I often see her at school.","This song is great. I love it.","Our teacher helps us a lot.","My grandparents are kind. I visit them every week."],"uz":"Bu olmoshlar fe’l yoki predlogdan keyin keladi: help me — menga yordam ber, with him — u bilan, I love it — Men uni yaxshi ko‘raman."},
            practise: [
              {"type":"choose","q":"This is my friend Sam. I like ___.","options":["he","him","his"],"a":["him"],"hint":"After a verb (like), he → him."},
              {"type":"choose","q":"Lucy is nice. I often talk to ___.","options":["she","her","hers"],"a":["her"],"hint":"After to, she → her."},
              {"type":"choose","q":"Please wait for ___. I'm coming!","options":["I","me","my"],"a":["me"],"hint":"After for, I → me."},
              {"type":"gap","q":"My parents are great. I love ___. (they)","a":["them"],"hint":"After a verb (love), they → them."},
              {"type":"fix","q":"Which sentence is correct?","options":["The teacher helps us.","The teacher helps we.","The teacher helps our."],"a":["The teacher helps us."],"hint":"After a verb (helps), we → us."}
            ]
          },
          {
            learn: {"title":"mine, yours, his, hers, ours, theirs","rule":"Possessive pronouns stand alone — no noun comes after them: This book is mine (= my book). Compare: my bag → It's mine. her pen → It's hers. There is no apostrophe in yours, hers, ours or theirs.","table":[["Before a noun","Alone"],["my bag","mine"],["your bag","yours"],["his bag","his"],["her bag","hers"],["our bag","ours"],["their bag","theirs"]],"examples":["This phone is mine.","Is this pen yours?","That isn't my coat. It's hers.","The red car is ours.","These books aren't theirs.","My bike is old, but his is new."],"uz":"mine, yours, hers, ours, theirs — “meniki, seniki, uniki, bizniki, ularniki” degani. Ulardan keyin ot kelmaydi: This is mine — Bu meniki."},
            practise: [
              {"type":"choose","q":"This is my bag. It's ___.","options":["my","mine","me"],"a":["mine"],"hint":"No noun after it: my → mine."},
              {"type":"choose","q":"Is this your pen? Is it ___?","options":["your","yours","you"],"a":["yours"],"hint":"No noun after it: your → yours."},
              {"type":"choose","q":"That's Anna's phone. It's ___.","options":["her","hers","she"],"a":["hers"],"hint":"No noun after it: her → hers."},
              {"type":"gap","q":"This is our house. It's ___. (we)","a":["ours"],"hint":"No noun after it: our → ours."},
              {"type":"fix","q":"Which sentence is correct?","options":["These shoes are theirs.","These shoes are their's.","These shoes are their."],"a":["These shoes are theirs."],"hint":"theirs has no apostrophe."}
            ]
          },
          {
            learn: {"title":"Whose is it? — It's Tom's.","rule":"Ask Whose…? to find out who something belongs to. Answer with a name + 's (Tom's) or with mine, yours, his, hers, ours, theirs. When the noun is plural and ends in -s, add only an apostrophe: my parents' car (= the car of my parents).","table":[["Question","Answer"],["Whose bag is this?","It's mine. / It's Tom's."],["Whose shoes are these?","They're hers. / They're Emma's."],["Whose car is that?","It's my parents' car."]],"examples":["Whose bag is this? — It's mine.","Whose is this coat? — It's Emma's.","This is my sister's room.","Whose are these shoes? — They're Sam's.","My parents' house is near the park."],"uz":"Whose…? — Kimning…? Javobda ism + 's (Tom's — Tomniki) yoki mine, hers kabi so‘zlar ishlatiladi."},
            practise: [
              {"type":"choose","q":"___ book is this?","options":["Who","Whose","Who's"],"a":["Whose"],"hint":"To ask who it belongs to: Whose."},
              {"type":"choose","q":"Whose pen is this? — It's ___.","options":["Tom","Tom's","Toms"],"a":["Tom's"],"hint":"Name + 's: Tom's."},
              {"type":"gap","q":"Whose cat is this? — It's ___. (= my cat, one word)","a":["mine"],"hint":"my cat → mine."},
              {"type":"fix","q":"Which sentence is correct?","options":["This is my brother's room.","This is my brothers room.","This is my brother room."],"a":["This is my brother's room."],"hint":"Name or noun + 's: my brother's room."},
              {"type":"order","q":"Put the words in order.","words":["coat","Whose","this","is"],"a":["Whose coat is this?","Whose is this coat?"],"hint":"Whose + coat + is + this?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I like Sam. I often play with ___.","options":["he","him","his"],"a":["him"]},
          {"type":"choose","q":"Can you help ___, please? I can't open this.","options":["I","me","my"],"a":["me"]},
          {"type":"gap","q":"Where are my keys? I can't find ___. (they)","a":["them"]},
          {"type":"choose","q":"She is ___ late. She's always on time.","options":["never","always","often"],"a":["never"],"from":"g13"},
          {"type":"choose","q":"Our grandmother often visits ___.","options":["we","us","our"],"a":["us"]},
          {"type":"choose","q":"This is Kate. Do you know ___?","options":["she","her","hers"],"a":["her"]},
          {"type":"choose","q":"That bike is ___. I've got the key.","options":["my","mine","me"],"a":["mine"]},
          {"type":"choose","q":"Is this umbrella ___?","options":["your","yours","you"],"a":["yours"]},
          {"type":"choose","q":"Where ___ your cousins live?","options":["do","does"],"a":["do"],"from":"g12"},
          {"type":"gap","q":"This is their car. It's ___. (they)","a":["theirs"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The black bag is hers.","The black bag is her.","The black bag is her's."],"a":["The black bag is hers."]},
          {"type":"choose","q":"___ phone is this? — It's mine.","options":["Who","Whose","Who's"],"a":["Whose"]},
          {"type":"gap","q":"Whose jacket is this? — It's ___. (Lucy)","a":["Lucy's"]},
          {"type":"gap","q":"Have you got a bike? — Yes, I ___.","a":["have"],"from":"g5"},
          {"type":"fix","q":"Which sentence is correct?","options":["My bag is blue and yours is red.","My bag is blue and your is red.","Mine bag is blue and yours is red."],"a":["My bag is blue and yours is red."]},
          {"type":"order","q":"Put the words in order.","words":["him","I","with","go","school","to"],"a":["I go to school with him.","I go with him to school."]},
          {"type":"choose","q":"That's our new house. Do you like ___?","options":["it","its","it's"],"a":["it"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Is this book yours?","Is this book your?","Is this book you?"],"a":["Is this book yours?"]},
          {"type":"choose","q":"This is Mr Brown and ___ wife.","options":["his","her","he"],"a":["his"],"from":"g2"},
          {"type":"order","q":"Put the words in order.","words":["ours","That","is","dog"],"a":["That dog is ours."]}
        ]
      },
      {
        id: "g15", no: 15, title: "Imperatives and Basic Sentence Structure", v: 1,
        chunks: [
          {
            learn: {"title":"Open the door. Don't run.","rule":"Use the imperative to give instructions, orders or advice. Start with the verb as it is — don't say you: Open your books. Sit down. For a negative, use Don't + verb: Don't run. Add please to be polite: Please sit down. / Sit down, please.","table":[["Positive","Negative"],["Open the window.","Don't open the window."],["Sit down, please.","Don't sit there."],["Be quiet.","Don't be late."]],"examples":["Open your books at page 10.","Listen and repeat.","Please sit down.","Don't talk in the library.","Be careful! The floor is wet.","Don't forget your homework."],"uz":"Buyruq gapda you aytilmaydi, gap fe’l bilan boshlanadi: Sit down — O‘tiring. Inkor: Don't + fe’l: Don't run — Yugurmang."},
            practise: [
              {"type":"choose","q":"___ the door, please. It's cold.","options":["Close","Closes","Closing"],"a":["Close"],"hint":"An instruction starts with the verb as it is: Close."},
              {"type":"choose","q":"___ late for school!","options":["Don't be","Not be","Don't"],"a":["Don't be"],"hint":"Negative: Don't + verb (be)."},
              {"type":"gap","q":"___ touch the oven. It's hot! (negative)","a":["Don't","Do not"],"hint":"Negative: Don't + verb."},
              {"type":"fix","q":"Which sentence is correct?","options":["Please be quiet.","Please are quiet.","Please you be quiet."],"a":["Please be quiet."],"hint":"Start with the verb as it is (be), with no you."},
              {"type":"order","q":"Put the words in order.","words":["your","Open","books"],"a":["Open your books."],"hint":"Start with the verb: Open."}
            ]
          },
          {
            learn: {"title":"Subject + verb + object","rule":"An English sentence usually goes like this: subject (who?) + verb (does what?) + object (what? / who?). I like apples. The verb comes right after the subject, not at the end of the sentence.","table":[["Subject (who?)","Verb (does what?)","Object (what?)"],["I","like","apples."],["My sister","reads","books."],["We","play","football."]],"examples":["Tom eats an apple.","My parents love music.","The children watch cartoons.","She speaks three languages.","We visit our grandparents."],"uz":"Ingliz tilida gap tartibi: ega + fe’l + to‘ldiruvchi (I like apples). O‘zbek tilida fe’l gap oxirida keladi (Men olmani yaxshi ko‘raman), ingliz tilida esa egadan keyin keladi."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I like music.","I music like.","Like I music."],"a":["I like music."],"hint":"Subject + verb + object: I + like + music."},
              {"type":"fix","q":"Which sentence is correct?","options":["Anna reads books.","Anna books reads.","Reads Anna books."],"a":["Anna reads books."],"hint":"The verb comes right after the subject: Anna reads."},
              {"type":"order","q":"Put the words in order.","words":["football","We","play"],"a":["We play football."],"hint":"We (subject) + play (verb) + football (object)."},
              {"type":"order","q":"Put the words in order.","words":["milk","The","cat","drinks"],"a":["The cat drinks milk."],"hint":"The cat (subject) + drinks (verb) + milk (object)."},
              {"type":"order","q":"Put the words in order.","words":["English","teaches","Mrs","Green"],"a":["Mrs Green teaches English."],"hint":"Mrs Green (subject) + teaches (verb) + English (object)."}
            ]
          },
          {
            learn: {"title":"Where and when go at the end","rule":"After the object, say where (the place), then when (the time): I play football (what) in the park (where) on Saturdays (when). Words like every day, on Sundays and after school don't go between the subject and the verb.","table":[["Subject","Verb","Object","Where?","When?"],["I","play","football","in the park","on Saturdays."],["She","has","lunch","at school","every day."],["We","watch","TV","at home","in the evening."]],"examples":["I meet my friends in the cafe on Fridays.","My dad reads the newspaper at home every morning.","They play tennis in the park after school.","Tom does his homework in his room in the evening.","We have English lessons at school on Mondays."],"uz":"Gap oxirida avval joy (qayerda?), keyin vaqt (qachon?) aytiladi: I play football in the park on Saturdays."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I go to the gym every day.","I every day go to the gym.","Go I to the gym every day."],"a":["I go to the gym every day."],"hint":"The time (every day) goes at the end."},
              {"type":"fix","q":"Which sentence is correct?","options":["We eat lunch at school every day.","We every day eat lunch at school.","We eat at school every day lunch."],"a":["We eat lunch at school every day."],"hint":"Subject + verb + object + where + when."},
              {"type":"order","q":"Put the words in order.","words":["in","I","play","the","park","football"],"a":["I play football in the park."],"hint":"I + play + football + in the park (where)."},
              {"type":"order","q":"Put the words in order.","words":["on","Sundays","They","their","grandmother","visit"],"a":["They visit their grandmother on Sundays."],"hint":"They + visit + their grandmother + on Sundays (when)."},
              {"type":"fix","q":"Which sentence is correct?","options":["My brother works in a bank.","My brother in a bank works.","In a bank works my brother."],"a":["My brother works in a bank."],"hint":"Subject + verb, then the place: My brother works in a bank."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"___ your name here, please.","options":["Write","Writes","Writing"],"a":["Write"]},
          {"type":"choose","q":"___ run in the corridor!","options":["Don't","Not","No"],"a":["Don't"]},
          {"type":"gap","q":"___ quiet, please. The baby is asleep. (be)","a":["Be"]},
          {"type":"choose","q":"Can you help ___? We're lost.","options":["we","us","our"],"a":["us"],"from":"g14"},
          {"type":"fix","q":"Which sentence is correct?","options":["Don't be late.","Don't late.","Not be late."],"a":["Don't be late."]},
          {"type":"order","q":"Put the words in order.","words":["sit","Please","down"],"a":["Please sit down."]},
          {"type":"gap","q":"___ forget your keys! (negative)","a":["Don't","Do not"]},
          {"type":"fix","q":"Which sentence is correct?","options":["My mother cooks dinner.","My mother dinner cooks.","Cooks my mother dinner."],"a":["My mother cooks dinner."]},
          {"type":"order","q":"Put the words in order.","words":["often","She","is","tired"],"a":["She is often tired."],"from":"g13"},
          {"type":"order","q":"Put the words in order.","words":["tea","drinks","Tom"],"a":["Tom drinks tea."]},
          {"type":"fix","q":"Which sentence is correct?","options":["We watch films at home.","We films watch at home.","We at home watch films."],"a":["We watch films at home."]},
          {"type":"choose","q":"Which sentence is an instruction?","options":["Open the window.","She opens the window.","He is at the window."],"a":["Open the window."]},
          {"type":"order","q":"Put the words in order.","words":["the","park","in","They","play","football"],"a":["They play football in the park."]},
          {"type":"choose","q":"My uncle ___ in a bank.","options":["work","works"],"a":["works"],"from":"g11"},
          {"type":"fix","q":"Which sentence is correct?","options":["I visit my aunt on Sundays.","I my aunt visit on Sundays.","Visit I my aunt on Sundays."],"a":["I visit my aunt on Sundays."]},
          {"type":"order","q":"Put the words in order.","words":["English","speaks","Lucy","well"],"a":["Lucy speaks English well."]},
          {"type":"gap","q":"Please ___ the window. It's hot in here. (open)","a":["open"]},
          {"type":"order","q":"Put the words in order.","words":["after","school","I","homework","my","do"],"a":["I do my homework after school."]},
          {"type":"choose","q":"There ___ two bathrooms in our flat.","options":["is","are"],"a":["are"],"from":"g6"},
          {"type":"fix","q":"Which sentence is correct?","options":["Close your books, please.","Closes your books, please.","You closes your books, please."],"a":["Close your books, please."]}
        ]
      }
    ]
    },
    {
      id: "elementary", name: "Elementary", lessons: []
    },
    {
      id: "preintermediate", name: "Pre-Intermediate", lessons: []
    },
    {
      id: "intermediate", name: "Intermediate", lessons: []
    },
    {
      id: "upperintermediate", name: "Upper-Intermediate", lessons: []
    },
    {
      id: "advanced", name: "Advanced", lessons: []
    },
    {
      id: "intensive", name: "Intensive", lessons: []
    }
  ]
};
