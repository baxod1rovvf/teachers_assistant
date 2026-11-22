// made by tools/build-grammar.js from docs/grammar-journey.json — don't edit
window.TA_GRAMMAR = {
  v: 1,
  levels: [
    {
      id: "beginner", name: "Beginner", lessons: [
      {
        id: "g1", no: 1, title: "To Be (am/is/are) + A/An", v: 2,
        chunks: [
          {
            learn: {"title":"I am, you are, she is","story":["Tasavvur qil: ko‘chada ketyapsan va kimgadir «Men bolaman» deb aytding.","O‘zbekchada so‘zning oxiriga **-man** qo‘shamiz: bola**man**. Ingliz tilida esa so‘z oxiriga bunday narsa qo‘shilmaydi.","Shuning uchun **-man** so‘zdan ajralib, o‘rtaga chiqib oladi va alohida so‘z bo‘ladi: **am**.","Men bola**man** → **I am** a boy.","Bu kichkina so‘z kim haqida gapirayotganingga qarab o‘zgaradi:","• O‘zing haqingda: **I am** (men …man).","• Bitta boshqa odam yoki narsa haqida: **he is** (u — o‘g‘il bola yoki erkak), **she is** (u — qiz yoki ayol), **it is** (u — narsa yoki hayvon).","• Ro‘parangdagi odamga yoki ko‘pchilik haqida: **you are** (sen / siz), **we are** (biz), **they are** (ular).","Do‘stingni onangga tanishtiryapsan: «Bu Ali. U mening do‘stim.» → **He is** my friend.","Diqqat! O‘zbekchada «U bola» deymiz — oxirida hech narsa yo‘q. Ingliz tilida esa bu so‘z hech qachon tushib qolmaydi: **He is** a boy. «He boy» deyish — xato!","Gapirganda qisqartiramiz: I am → **I'm**, he is → **he's**, they are → **they're**."],"rule":"Am, is and are are one word in three forms. I → am. He, she, it (one person or thing) → is. You, we, they (two or more people) → are. This word is always in the sentence: He is a boy (not: He boy).","table":[["Who","be","Example"],["I","am","I am a boy."],["you","are","You are my friend."],["he","is","He is my brother."],["she","is","She is my sister."],["it","is","It is a cat."],["we","are","We are students."],["they","are","They are at home."]],"examples":["I am a boy.","I am a girl.","You are my friend.","He is my brother.","It is a dog.","We are at school."],"uz":"Men … → I am · U … → he / she / it is · Sen, Siz, Biz, Ular … → you / we / they are"},
            practise: [
              {"type":"choose","q":"I ___ a student.","options":["am","is","are"],"a":["am"],"hint":"With I, always use am."},
              {"type":"choose","q":"She ___ my sister.","options":["am","is","are"],"a":["is"],"hint":"With he, she and it, use is."},
              {"type":"gap","q":"We ___ in the park. (am / is / are)","a":["are"],"hint":"With we, use are."},
              {"type":"gap","q":"Tom and Lucy ___ friends. (am / is / are)","a":["are"],"hint":"Tom and Lucy = they, so use are."},
              {"type":"order","q":"Put the words in order.","words":["is","The","big","house"],"a":["The house is big."],"hint":"Start with The house, then is."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","story":["Do‘sting so‘radi: «Charchadingmi?» Sen esa charchamagansan. O‘zbekchada «emas» deymiz: «Men charchagan emasman».","Ingliz tilida **am / is / are** dan keyin **not** qo‘yamiz. **not** = «emas», «yo‘q».","I am **not** tired. → Men charchagan emasman.","He is **not** at home. → U uyda emas.","Qisqasi: is not → **isn't**, are not → **aren't**, I am not → **I'm not**.","Endi savol. O‘zbekchada so‘z oxiriga **-mi** qo‘shamiz: «Sen tayyormisan?»","Ingliz tilida esa **am / is / are** gapning boshiga yuguradi: You are ready. → **Are** you ready?","Javob qisqa bo‘ladi: Yes, I am. (Ha.) / No, I'm not. (Yo‘q.)"],"rule":"To say no, put not after am, is or are: I am not, he is not (isn't), they are not (aren't). To ask, put am, is or are first: Are you ready? Is he at home? Short answers: Yes, I am. / No, I'm not.","table":[["Negative","Question","Short answer"],["I am not (I'm not) tired.","Am I late?","Yes, you are. / No, you aren't."],["He is not (He isn't) here.","Is he at home?","Yes, he is. / No, he isn't."],["They are not (They aren't) ready.","Are they at school?","Yes, they are. / No, they aren't."]],"examples":["I am not tired.","He isn't at home.","We aren't hungry.","Are you ready? — Yes, I am.","Is it a cat? — No, it isn't."],"uz":"not = emas, yo‘q (am / is / are dan keyin keladi). Savolda am / is / are gapning boshiga chiqadi."},
            practise: [
              {"type":"choose","q":"He ___ a doctor. He is a teacher.","options":["isn't","aren't","am not"],"a":["isn't"],"hint":"With he, use is. The negative is isn't (is not)."},
              {"type":"gap","q":"I ___ not hungry.","a":["am"],"hint":"With I, use am: I am not."},
              {"type":"choose","q":"___ you happy?","options":["Am","Is","Are"],"a":["Are"],"hint":"In a question, are comes first with you."},
              {"type":"fix","q":"Which sentence is correct?","options":["Is she your mother?","She is your mother?","Are she your mother?"],"a":["Is she your mother?"],"hint":"In a question, is comes before she."},
              {"type":"order","q":"Put the words in order.","words":["they","Are","school","at"],"a":["Are they at school?"],"hint":"A question starts with Are, then they."}
            ]
          },
          {
            learn: {"title":"a or an?","story":["Bozorda sotuvchiga «Menga bitta olma bering» deysan. Ingliz tilida «bitta» — bu **a** yoki **an**.","Bitta narsa yoki bitta odam haqida gapirganda, uning oldiga doim **a** yoki **an** qo‘yiladi: **a** pen (bitta ruchka).","Qaysi birini tanlash keyingi so‘zning **birinchi tovushiga** bog‘liq:","• a, e, i, o, u tovushi bilan boshlansa → **an**: **an** apple (olma), **an** egg (tuxum).","• Boshqa tovush bilan boshlansa → **a**: **a** dog (it), **a** book (kitob).","Nega? «a apple» deb aytib ko‘r — tiling tutilib qoladi. «an apple» esa ravon chiqadi.","Kasb oldida ham qo‘yamiz. O‘zbekchada «Onam shifokor» deymiz, ingliz tilida esa: My mum is **a** doctor."],"rule":"Use a or an before one thing or one person. Use an before a, e, i, o, u sounds: an apple, an egg. Use a before other sounds: a dog, a book. Look at the next word: an old car, but a new car. Jobs too: She is a doctor.","table":[["a + other sounds","an + a, e, i, o, u sounds"],["a dog","an apple"],["a pen","an egg"],["a big house","an old house"],["a nurse","an engineer"]],"examples":["It is a dog.","This is an apple.","My mum is a doctor.","He is an actor.","It is an old car.","It is a new car."],"uz":"Bitta narsa oldidan a yoki an: a, e, i, o, u tovushi oldidan an (an apple), boshqalari oldidan a (a dog)."},
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
          {"type":"order","q":"Put the words in order.","words":["not","am","I","a","teacher"],"a":["I am not a teacher.","Am I not a teacher?"]}
        ]
      },
      {
        id: "g2", no: 2, title: "Subject Pronouns + Possessive Adjectives", v: 1,
        chunks: [
          {
            learn: {"title":"I, you, he, she, it, we, they","story":["Sinfingga yangi o‘quvchi keldi. Sen do‘stingga aytasan: «Bu Sardor. **U** juda kulgili.» Har safar «Sardor, Sardor» deb takrorlamaysan — ismning o‘rniga **u** deysan.","Ingliz tilida ham ismning o‘rniga kichkina so‘z ishlatiladi. Lekin o‘zbekchadagi bitta **u** o‘rniga uchta so‘z bor:","• o‘g‘il bola yoki erkak haqida → **he**: Tom is my friend. **He** is twelve.","• qiz bola yoki ayol haqida → **she**: Anna is a nurse. **She** is kind.","• narsa yoki hayvon haqida → **it**: This is my bag. **It** is new.","O‘zing va do‘sting birga → **we** (biz). Ko‘p odam yoki ko‘p narsa → **they** (ular).","Bu so‘zlar gap boshida, **am / is / are** dan oldin turadi."],"rule":"A subject pronoun takes the place of a name. It comes before the verb (am, is, are). Use he for a man or a boy, she for a woman or a girl, it for a thing or an animal, and they for two or more people or things.","table":[["One","Two or more"],["I","we"],["you","you"],["he / she / it","they"]],"examples":["Tom is my friend. He is twelve.","Anna is a nurse. She is very kind.","This is my bag. It is new.","Sam and I are in Class 5. We are classmates.","The books are on the table. They are heavy."],"uz":"O‘zbekchadagi “u” uchun ingliz tilida uchta so‘z bor: he — erkak, she — ayol, it — narsa yoki hayvon."},
            practise: [
              {"type":"choose","q":"Lucy is my cousin. ___ is ten.","options":["He","She","It"],"a":["She"],"hint":"Lucy is a girl, so use she."},
              {"type":"choose","q":"My dad is a driver. ___ is at work.","options":["He","She","They"],"a":["He"],"hint":"Dad is a man, so use he."},
              {"type":"choose","q":"The cat is black. ___ is very small.","options":["He","She","It"],"a":["It"],"hint":"Use it for an animal or a thing."},
              {"type":"gap","q":"Ben and Kate are students. ___ are in my class. (one word)","a":["They"],"hint":"Two people (not you or me) = they."},
              {"type":"gap","q":"My friend and I are in the park. ___ are happy. (one word)","a":["We"],"hint":"Another person + I = we."}
            ]
          },
          {
            learn: {"title":"my, your, his, her, its, our, their","story":["Tanaffusda kimdir ruchkangni olib qo‘ydi. Sen darrov aytasan: «Bu **mening** ruchkam!» → This is **my** pen!","O‘zbekchada «kimniki» ekanini so‘z oxiri bildiradi: ruchka**m**, ruchka**ng**, ruchka**si**. Ingliz tilida esa bu alohida so‘z bo‘lib, narsadan **oldin** keladi:","• men → **my** (mening): **my** pen","• sen / siz → **your** (sening, sizning): **your** pen","• u (o‘g‘il) → **his**, u (qiz) → **her**, u (narsa, hayvon) → **its**","• biz → **our**, ular → **their**","Qulay tomoni: narsa bitta bo‘lsin, ko‘p bo‘lsin — so‘z o‘zgarmaydi: **my** book, **my** books.","Diqqat: akang haqida — **his** car, opang haqida — **her** car. O‘zbekchada ikkalasi ham «uning mashinasi»."],"rule":"Possessive adjectives show who something belongs to. They come before a noun: my book, her phone. They are the same for one thing or many things: my book, my books. Be careful: his is for a man or a boy, her is for a woman or a girl.","table":[["Subject pronoun","Possessive adjective","Example"],["I","my","my bag"],["you","your","your bag"],["he","his","his bag"],["she","her","her bag"],["it","its","its bed (a dog's bed)"],["we","our","our bag"],["they","their","their bag"]],"examples":["This is my bag.","What is your name?","Tom is with his mother.","Her cat is white.","We are in our classroom.","Their house is very big."],"uz":"Bu so‘zlar narsa kimniki ekanini bildiradi va otdan oldin keladi: my book — mening kitobim."},
            practise: [
              {"type":"choose","q":"I am Tom. ___ name is Tom.","options":["My","I","Me"],"a":["My"],"hint":"Before a noun (name), use my."},
              {"type":"choose","q":"Kate is with ___ brother.","options":["his","her","its"],"a":["her"],"hint":"Kate is a girl, so use her."},
              {"type":"choose","q":"Mr Brown is in ___ car.","options":["his","her","their"],"a":["his"],"hint":"Mr Brown is a man, so use his."},
              {"type":"gap","q":"We are in ___ classroom. (we)","a":["our"],"hint":"we → our."},
              {"type":"fix","q":"Which sentence is correct?","options":["They are with their teacher.","They are with they teacher.","They are with there teacher."],"a":["They are with their teacher."],"hint":"they → their (it belongs to them)."}
            ]
          },
          {
            learn: {"title":"he or his? it's or its?","story":["Bu so‘zlar bir-biriga juda o‘xshaydi, lekin vazifasi boshqa: **he** — «u» (kim?), **his** — «uning» (kimning?).","Oilaviy suratni ko‘rsatyapsan: «**U** — amakim. **Uning** mashinasi qizil.» → **He** is my uncle. **His** car is red.","Oson yo‘l — keyingi so‘zga qara:","• keyin **am / is / are** kelsa → I, he, she, we, they","• keyin narsa (ot) kelsa → my, his, her, our, their","**it's** va **its** ham shunday: **it's** = it is (u — …). **its** = uning (narsa yoki hayvonniki).","It's a dog. **Its** name is Max. (Bu it. Uning ismi Maks.) Apostrof (') faqat «is» yashiringan joyda bo‘ladi."],"rule":"Before am, is, are (a verb), use I, he, she, we, they. Before a noun, use my, his, her, our, their. Be careful with it's and its: it's = it is. its = belonging to it (no apostrophe).","table":[["Before a verb","Before a noun"],["He is my uncle.","His car is red."],["She is a singer.","Her name is Mia."],["They are twins.","Their names are Jack and Sam."],["It's a dog. (it is)","Its name is Max."]],"examples":["She is a singer. Her name is Mia.","He is my uncle. His car is red.","They are twins. Their names are Jack and Sam.","It's a dog. Its name is Max.","We are in Class 7. Our teacher is Mrs Green."],"uz":"Fe’ldan oldin he, she, they, otdan oldin his, her, their keladi; its — “uning”, it’s esa it is."},
            practise: [
              {"type":"choose","q":"___ is my best friend.","options":["He","His"],"a":["He"],"hint":"Before is (a verb), use he."},
              {"type":"choose","q":"___ name is Lily.","options":["She","Her"],"a":["Her"],"hint":"Before a noun (name), use her."},
              {"type":"choose","q":"This is a bird. ___ wings are blue.","options":["It's","Its"],"a":["Its"],"hint":"its = belonging to it. it's = it is."},
              {"type":"gap","q":"Jack and Mia are my friends. ___ house is near my school. (they)","a":["Their"],"hint":"Before a noun (house), they → their."},
              {"type":"fix","q":"Which sentence is correct?","options":["Our teacher is from Canada.","We teacher is from Canada.","Us teacher is from Canada."],"a":["Our teacher is from Canada."],"hint":"Before a noun (teacher), we → our."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"My mother is a cook. ___ is at work.","options":["He","She","It"],"a":["She"]},
          {"type":"choose","q":"This is my phone. ___ is new.","options":["He","It","They"],"a":["It"]},
          {"type":"gap","q":"Tom and Sam are brothers. ___ are tall. (one word)","a":["They"]},
          {"type":"choose","q":"Emma, is this ___ pen?","options":["you","your","you're"],"a":["your"]},
          {"type":"choose","q":"My sisters ___ at school.","options":["am","is","are"],"a":["are"],"from":"g1"},
          {"type":"choose","q":"Max is with ___ dad.","options":["his","her","he"],"a":["his"]},
          {"type":"gap","q":"I am a student. ___ teacher is Mrs Green. (I)","a":["My"]},
          {"type":"fix","q":"Which sentence is correct?","options":["His name is Ben.","He name is Ben.","Him name is Ben."],"a":["His name is Ben."]},
          {"type":"choose","q":"We are in the park with ___ dog.","options":["our","we","us"],"a":["our"]},
          {"type":"choose","q":"This is ___ orange.","options":["a","an"],"a":["an"],"from":"g1"},
          {"type":"choose","q":"Lily and Kate are at home. ___ are sisters.","options":["They","Their","There"],"a":["They"]},
          {"type":"gap","q":"Anna is a doctor. ___ office is in the city centre. (she)","a":["Her","Anna's"]},
          {"type":"order","q":"Put the words in order.","words":["is","name","Her","Sophie"],"a":["Her name is Sophie."]},
          {"type":"choose","q":"The dog is in ___ bed.","options":["it's","its","it"],"a":["its"]},
          {"type":"gap","q":"I ___ not ready.","a":["am"],"from":"g1"},
          {"type":"fix","q":"Which sentence is correct?","options":["They are my parents. Their names are Tom and Lucy.","They are my parents. They names are Tom and Lucy."],"a":["They are my parents. Their names are Tom and Lucy."]},
          {"type":"order","q":"Put the words in order.","words":["our","This","is","classroom"],"a":["This is our classroom."]},
          {"type":"gap","q":"You and I are in the same class. ___ are classmates. (one word)","a":["We"]},
          {"type":"choose","q":"Mr and Mrs Brown are with ___ children.","options":["their","they","them"],"a":["their"]},
          {"type":"choose","q":"___ he your brother?","options":["Am","Is","Are"],"a":["Is"],"from":"g1"}
        ]
      },
      {
        id: "g3", no: 3, title: "Singular and Plural Nouns", v: 1,
        chunks: [
          {
            learn: {"title":"-s and -es","story":["Bozordan bitta olma emas, uchta olma olding. O‘zbekchada «uchta olma» deymiz — sondan keyin «olma» o‘zgarmaydi.","Ingliz tilida esa bittadan ko‘p bo‘lsa, so‘z oxiriga **-s** qo‘shiladi. Bu o‘zbekchadagi **-lar** ga o‘xshaydi: kitob**lar** → book**s**.","Farqi shundaki, sondan keyin ham **-s** qo‘yiladi: two book**s**, three apple**s**. («two book» — xato!)","Agar so‘z **s, ss, sh, ch, x** bilan tugasa, **-es** qo‘shamiz: bus → bus**es**, box → box**es**.","Ovoz chiqarib ayt: «boxs» — tilingga noqulay, «boxes» — ravon. Shuning uchun **-es**."],"rule":"Singular means one. Plural means two or more. Most nouns add -s: book → books. Nouns that end in -s, -ss, -sh, -ch or -x add -es: bus → buses, box → boxes. Some nouns that end in -o add -es too: tomato → tomatoes. After a number (two, three, ten…) the noun is plural: two books.","table":[["Ending","Rule","Example"],["most nouns","+ s","a cat → two cats"],["-s, -ss, -sh, -ch, -x","+ es","a bus → buses, a dish → dishes, a watch → watches"],["-o (some nouns)","+ es","a tomato → tomatoes, a potato → potatoes"]],"examples":["one pen → three pens","a class → two classes","a brush → brushes","a box → five boxes","My shoes are new.","The buses are full."],"uz":"Ko‘plikda otga -s yoki -es qo‘shiladi, o‘zbek tilidan farqli, sondan keyin ham: two books — ikkita kitob."},
            practise: [
              {"type":"choose","q":"one apple, two ___","options":["apple","apples","applees"],"a":["apples"],"hint":"Most nouns just add -s."},
              {"type":"gap","q":"one box, three ___","a":["boxes"],"hint":"Nouns that end in -x add -es."},
              {"type":"gap","q":"one watch, two ___","a":["watches"],"hint":"Nouns that end in -ch add -es."},
              {"type":"choose","q":"The ___ are on the table.","options":["dish","dishs","dishes"],"a":["dishes"],"hint":"Nouns that end in -sh add -es."},
              {"type":"fix","q":"Which sentence is correct?","options":["Tom is ten years old.","Tom is ten year old.","Tom is ten years olds."],"a":["Tom is ten years old."],"hint":"After a number like ten, the noun is plural: ten years."}
            ]
          },
          {
            learn: {"title":"-y → -ies and -f → -ves","story":["Ba’zi so‘zlarda -s qo‘shishdan oldin so‘zning oxiri biroz o‘zgaradi.","• oxiri undosh + **y** bo‘lsa: y → **ies**. baby → bab**ies** (chaqaloqlar), city → cit**ies** (shaharlar).","• oxiri unli + **y** bo‘lsa (ay, ey, oy): shunchaki **-s**. boy → boy**s**, day → day**s**, key → key**s**.","• oxiri **f** yoki **fe** bo‘lsa: → **ves**. leaf → lea**ves** (barglar), knife → kni**ves** (pichoqlar).","Kuzda bog‘da bitta barg emas, minglab barglar yotadi: The lea**ves** are yellow. (Barglar sariq.)"],"rule":"If a noun ends in a consonant + y, change y to i and add -es: baby → babies, city → cities. If it ends in a vowel + y (ay, ey, oy), just add -s: day → days, key → keys, boy → boys. Many nouns that end in -f or -fe change to -ves: leaf → leaves, knife → knives.","table":[["Ending","Rule","Example"],["consonant + y","y → ies","a baby → babies, a city → cities"],["vowel + y (ay, ey, oy)","+ s","a day → days, a key → keys, a boy → boys"],["-f / -fe","→ ves","a leaf → leaves, a knife → knives, a shelf → shelves"]],"examples":["one city → two cities","a lady → three ladies","a day → seven days","a toy → many toys","a shelf → two shelves","The leaves are yellow."],"uz":"Undosh + y → ies (babies), unli + y → -s (boys), -f / -fe → -ves (knives)."},
            practise: [
              {"type":"choose","q":"one baby, two ___","options":["babys","babies","babyes"],"a":["babies"],"hint":"b + y: change y to i and add -es."},
              {"type":"choose","q":"one boy, three ___","options":["boys","boies"],"a":["boys"],"hint":"o + y (a vowel + y): just add -s."},
              {"type":"gap","q":"one city, two ___","a":["cities"],"hint":"t + y: change y to i and add -es."},
              {"type":"gap","q":"one knife, four ___","a":["knives"],"hint":"-fe changes to -ves."},
              {"type":"fix","q":"Which sentence is correct?","options":["The keys are on the table.","The keies are on the table."],"a":["The keys are on the table."],"hint":"e + y (a vowel + y): just add -s."}
            ]
          },
          {
            learn: {"title":"Special plurals","story":["Ba’zi so‘zlar hech qanday qoidaga bo‘ysunmaydi — xuddi qaysar bolaga o‘xshab. Ularni she’r kabi yodlab olamiz:","• man → **men** (erkaklar), woman → **women** (ayollar), child → **children** (bolalar)","• person → **people** (odamlar), foot → **feet** (oyoqlar), tooth → **teeth** (tishlar), mouse → **mice** (sichqonlar)","Ba’zi so‘zlar umuman o‘zgarmaydi: one sheep → two **sheep** (qo‘ylar), one fish → two **fish** (baliqlar).","Ertalab tishingni yuvasan — bitta tish emas, ko‘p tish: I brush my **teeth**.","Hovlida bolalar o‘ynayapti: The **children** are in the garden."],"rule":"Some nouns have a special plural. Learn them by heart: man → men, woman → women, child → children, person → people, foot → feet, tooth → teeth, mouse → mice. A few nouns are the same in the plural: one sheep → two sheep, one fish → two fish.","table":[["Singular","Plural"],["man","men"],["woman","women"],["child","children"],["person","people"],["foot","feet"],["tooth","teeth"],["mouse","mice"],["sheep / fish","sheep / fish"]],"examples":["one man → two men","a child → three children","The children are in the garden.","Many people are in the shop.","My feet are cold.","Two sheep are in the field."],"uz":"Ba’zi otlarning ko‘pligi qoidaga bo‘ysunmaydi, ularni yodlab olish kerak: child — children, man — men, person — people."},
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
          {"type":"gap","q":"This is Tom. ___ bag is blue. (he)","a":["His","Tom's"],"from":"g2"},
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
            learn: {"title":"this and these (near)","story":["Qo‘lingda telefon bor. Do‘stingga ko‘rsatib aytasan: «**Bu** mening telefonim.» → **This** is my phone.","**this** = bu (bitta, yaqindagi, qo‘ling yetadigan narsa).","Endi qo‘lingda ikkita olma bor: «**Bular** mening olmalarim.» → **These** are my apples.","**these** = bular (ko‘p, yaqindagi narsalar).","Yodda tut: **this** + bitta narsa (this book), **these** + ko‘p narsa (these book**s**)."],"rule":"Use this for one thing near you (here). Use these for two or more things near you. this + a singular noun: this book. these + a plural noun: these books.","table":[["Near me (here)","Example"],["this + one thing","this book, this apple"],["these + two or more","these books, these apples"]],"examples":["This is my pen.","This bag is heavy.","These are my friends, Tom and Emma.","These shoes are new.","Is this your phone?"],"uz":"this — bu (bitta, yaqindagi narsa), these — bular (ko‘p, yaqindagi narsalar)."},
            practise: [
              {"type":"choose","q":"___ is my book.","options":["This","These"],"a":["This"],"hint":"One thing near you: this."},
              {"type":"choose","q":"___ are my pencils.","options":["This","These"],"a":["These"],"hint":"Two or more things near you: these."},
              {"type":"choose","q":"___ apples are green.","options":["This","These"],"a":["These"],"hint":"Apples = more than one, so use these."},
              {"type":"gap","q":"___ chair is new. (near me, one)","a":["This"],"hint":"One thing near you: this."},
              {"type":"fix","q":"Which sentence is correct?","options":["These are my keys.","This are my keys.","These is my keys."],"a":["These are my keys."],"hint":"Keys = more than one: these + are."}
            ]
          },
          {
            learn: {"title":"that and those (far)","story":["Derazadan uzoqdagi binoni ko‘rsatasan: «**Anavi** — bizning maktabimiz.» → **That** is our school.","**that** = anavi, ana u (bitta, uzoqdagi narsa).","Ko‘chaning narigi tomonida ota-onang turibdi: «**Anavilar** — ota-onam.» → **Those** are my parents.","**those** = anavilar (ko‘p, uzoqdagi narsalar).","O‘yna: yaqin narsaga tegib — **this / these**, uzoqdagisini barmoq bilan ko‘rsatib — **that / those**."],"rule":"Use that for one thing far from you (there). Use those for two or more things far from you. that + a singular noun: that house. those + a plural noun: those houses.","table":[["","One","Two or more"],["Near (here)","this","these"],["Far (there)","that","those"]],"examples":["That is our school.","That man is my uncle.","Those are my parents.","Those birds are very small.","Is that your car over there?"],"uz":"that — ana u / anavi (uzoqdagi bitta narsa), those — ana ular / anavilar (uzoqdagi narsalar)."},
            practise: [
              {"type":"choose","q":"___ is my house over there.","options":["That","Those"],"a":["That"],"hint":"One thing far away (over there): that."},
              {"type":"choose","q":"___ trees over there are very tall.","options":["That","Those"],"a":["Those"],"hint":"Two or more things far away: those."},
              {"type":"choose","q":"Is ___ your bike over there?","options":["that","those"],"a":["that"],"hint":"One thing far away: that."},
              {"type":"gap","q":"___ women over there are teachers. (far, two or more)","a":["Those"],"hint":"Two or more people far away: those."},
              {"type":"fix","q":"Which sentence is correct?","options":["That girls are my sisters.","Those girls are my sisters.","Those girl are my sisters."],"a":["Those girls are my sisters."],"hint":"Girls = more than one: those girls."}
            ]
          },
          {
            learn: {"title":"What's this? What are those?","story":["Ukang notanish narsani ko‘rib so‘raydi: «Bu nima?» → **What's this?**","Sen javob berasan: «Bu — soat.» Javobda yana «this» demaymiz, **it** deymiz: **It's** a clock.","Ko‘p narsa haqida so‘rasa: «Bular nima?» → **What are these?** Javob — **they**: **They're** keys.","Ha / yo‘q savoliga qisqa javob: Is that your coat? — Yes, **it is**. / No, **it isn't**.","Odam haqida so‘rasa — **Who**: Who is that? — **That's** my brother. (Anavi kim? — U mening akam.)"],"rule":"When you ask about this or that, answer with it: What's this? — It's a clock. When you ask about these or those, answer with they: What are these? — They're keys. Short answers: Yes, it is. / No, it isn't. Yes, they are. / No, they aren't.","table":[["Question","Answer"],["What's this? / What's that?","It's a pen."],["What are these? / What are those?","They're pens."],["Is this your bag?","Yes, it is. / No, it isn't."],["Are those your shoes?","Yes, they are. / No, they aren't."]],"examples":["What's this? — It's a map.","What are these? — They're grapes.","Who is that? — That's my brother.","Is that your coat? — Yes, it is.","Are these your glasses? — No, they aren't."],"uz":"this / that haqidagi savolga it bilan, these / those haqidagi savolga they bilan javob beriladi."},
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
            learn: {"title":"I have got, she has got","story":["O‘zbekchada «**Mening** velosipedim **bor**» deymiz. Ingliz tilida esa: **I have got** a bike.","**have got / has got** = «… bor» (kimdadir, kimningdir).","• I, you, we, they → **have got** (gapirganda: I**'ve got**)","• he, she, it → **has got** (gapirganda: she**'s got**)","Oilang haqida ham shunday: «Mening bitta akam bor» → I **have got** a brother.","Tashqi ko‘rinish ham: «Uning sochi uzun» → She **has got** long hair. (Unda uzun soch «bor».)"],"rule":"Use have got / has got to say what someone owns, and to talk about family and how someone looks. Use have got with I, you, we, they. Use has got with he, she, it. Short forms: I've got, you've got, he's got, she's got.","table":[["Person","Full form","Short form"],["I / you / we / they","have got","I've got / you've got / we've got / they've got"],["he / she / it","has got","he's got / she's got / it's got"]],"examples":["I have got a new bike.","We've got two cats.","Anna has got long hair.","Tom's got a brother and a sister.","The car has got four doors."],"uz":"have got / has got — “… bor” degani: I have got a bike — Mening velosipedim bor."},
            practise: [
              {"type":"choose","q":"I ___ got a sister.","options":["have","has"],"a":["have"],"hint":"With I, use have got."},
              {"type":"choose","q":"Ben ___ got a dog.","options":["have","has"],"a":["has"],"hint":"Ben = he, so use has got."},
              {"type":"gap","q":"They ___ got a big garden. (have / has)","a":["have"],"hint":"With they, use have got."},
              {"type":"gap","q":"My cat ___ got green eyes. (have / has)","a":["has"],"hint":"My cat = it, so use has got."},
              {"type":"order","q":"Put the words in order.","words":["got","She","a","has","phone","new"],"a":["She has got a new phone."],"hint":"She + has got + a new phone."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","story":["Do‘sting so‘raydi: «Uy hayvoning bormi?» Sening esa yo‘q.","«Yo‘q» uchun **not** qo‘shamiz: I **haven't got** a pet. (have + not → haven't)","he, she, it bilan: She **hasn't got** a car. (has + not → hasn't)","Savolda **have / has** gapning boshiga chiqadi: **Have** you got a pen? (Ruchkang bormi?)","Qisqa javobda **got** aytilmaydi: Yes, I **have**. / No, I **haven't**. Yes, she **has**. / No, she **hasn't**."],"rule":"Negative: haven't got / hasn't got. Question: put have or has first: Have you got a pen? Has she got a car? Short answers: Yes, I have. / No, I haven't. Yes, she has. / No, she hasn't. Don't say got in a short answer.","table":[["Negative","Question","Short answer"],["I haven't got a car.","Have you got a car?","Yes, I have. / No, I haven't."],["She hasn't got a car.","Has she got a car?","Yes, she has. / No, she hasn't."],["They haven't got a car.","Have they got a car?","Yes, they have. / No, they haven't."]],"examples":["I haven't got a pet.","Sam hasn't got a computer.","We haven't got much time.","Have you got a pen? — Yes, I have.","Has your sister got a job? — No, she hasn't.","Have they got a car? — Yes, they have."],"uz":"Inkor: haven't got / hasn't got (… yo‘q); so‘roqda have yoki has gap boshiga chiqadi."},
            practise: [
              {"type":"choose","q":"I ___ got a car.","options":["haven't","hasn't"],"a":["haven't"],"hint":"With I, use haven't got."},
              {"type":"choose","q":"Lucy ___ got a brother.","options":["haven't","hasn't"],"a":["hasn't"],"hint":"Lucy = she, so use hasn't got."},
              {"type":"choose","q":"___ you got a ruler?","options":["Have","Has"],"a":["Have"],"hint":"With you, the question starts with Have."},
              {"type":"gap","q":"Has Tom got a bike? — Yes, he ___.","a":["has"],"hint":"Has he…? — Yes, he has. (no got)"},
              {"type":"fix","q":"Which sentence is correct?","options":["Have they got a garden?","Has they got a garden?","They have got a garden?"],"a":["Have they got a garden?"],"hint":"With they, the question starts with Have."}
            ]
          },
          {
            learn: {"title":"'s = has or is?","story":["**'s** — kichkina, lekin ikki xil ma’noli: **is** yoki **has**.","Qanday bilamiz? Keyingi so‘zga qara:","• keyin **got** kelsa → has: She**'s got** a cat. (Uning mushugi bor.)","• got kelmasa → is: She**'s** tall. (U baland bo‘yli.)","Masalan: He**'s** a doctor. (U shifokor.) Lekin: He**'s got** a cold. (U shamollagan — unda shamollash «bor».)"],"rule":"'s can mean is or has. If got comes after it, 's means has: She's got a cat (She has got a cat). If there is no got, 's means is: She's tall (She is tall).","table":[["'s = has (got after it)","'s = is (no got)"],["He's got a cold.","He's a doctor."],["It's got two wheels.","It's cold today."],["Mia's got brown eyes.","Mia's eleven."]],"examples":["He's got a cold. (He has got a cold.)","He's a doctor. (He is a doctor.)","It's got two wheels. (It has got two wheels.)","It's cold today. (It is cold today.)","Mia's got brown eyes. (Mia has got brown eyes.)"],"uz":"'s dan keyin got kelsa — has, got kelmasa — is: She's got a cat, She's tall."},
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
            learn: {"title":"There is, there are","story":["Mehmonga kelgan do‘stingga uyingni ko‘rsatyapsan: «Oshxonada katta stol **bor**.»","Biror joyda nimadir **bor** ekanini aytish uchun **there is / there are** ishlatamiz.","• bitta narsa → **there is**: **There is** a cat in the garden. (Bog‘da mushuk bor.)","• ko‘p narsa → **there are**: **There are** three rooms in our flat. (Kvartiramizda uchta xona bor.)","O‘zbekchada joy gap boshida keladi («Bog‘da…»), ingliz tilida esa gap **there is** bilan boshlanadi, joy oxirida.","Farqi: **have got** — kimdadir bor; **there is** — qayerdadir bor.","Gapirganda qisqartiramiz: there is → **there's**."],"rule":"Use there is / there are to say that something is in a place. Use there is with one thing (a singular noun). Use there are with two or more things (a plural noun). Short form: there's.","table":[["","Example"],["There is (There's) + one thing","There is a bed in my room."],["There are + two or more","There are two windows in my room."]],"examples":["There is a cat in the garden.","There's a bank near my house.","There are three bedrooms in our flat.","There are many people in the park.","In my bag there is a book and there are two pens."],"uz":"Biror joyda bitta narsa bor bo‘lsa — there is, ko‘p narsa bo‘lsa — there are ishlatiladi."},
            practise: [
              {"type":"choose","q":"There ___ a table in the kitchen.","options":["is","are"],"a":["is"],"hint":"One table: there is."},
              {"type":"choose","q":"There ___ four chairs in the room.","options":["is","are"],"a":["are"],"hint":"Four chairs = more than one: there are."},
              {"type":"gap","q":"There ___ a big tree in our garden. (is / are)","a":["is"],"hint":"One tree: there is."},
              {"type":"gap","q":"There ___ two shops in my street. (is / are)","a":["are"],"hint":"Two shops = more than one: there are."},
              {"type":"order","q":"Put the words in order.","words":["is","There","a","clock","the","on","wall"],"a":["There is a clock on the wall."],"hint":"There is + a clock + on the wall."}
            ]
          },
          {
            learn: {"title":"Negatives and questions","story":["Onang so‘raydi: «Yaqin atrofda park **bormi**?» → **Is there** a park near here?","Savolda **is / are** oldinga chiqadi: **Is there** …? **Are there** …?","Yo‘q bo‘lsa — **not**: **There isn't** a TV in my room. (Xonamda televizor yo‘q.)","Ko‘p narsa yo‘q bo‘lsa: **There aren't** many students. (O‘quvchilar ko‘p emas.)","Sonini so‘rash: «Sinfingizda nechta o‘quvchi bor?» → **How many** students **are there** in your class?"],"rule":"Negative: there isn't / there aren't. Question: Is there…? Are there…? Short answers: Yes, there is. / No, there isn't. Yes, there are. / No, there aren't. To ask about a number, use How many … are there?","table":[["Negative","Question","Short answer"],["There isn't a lift.","Is there a lift?","Yes, there is. / No, there isn't."],["There aren't many trees.","Are there many trees?","Yes, there are. / No, there aren't."]],"examples":["There isn't a TV in my room.","There aren't many students in the classroom.","Is there a park near here? — Yes, there is.","Are there two bathrooms? — No, there aren't.","How many students are there in your class?"],"uz":"Inkor: there isn't / there aren't (… yo‘q); so‘roq: Is there…? / Are there…? (… bormi?)."},
            practise: [
              {"type":"choose","q":"There ___ a lift in this building.","options":["isn't","aren't"],"a":["isn't"],"hint":"One lift: there isn't."},
              {"type":"choose","q":"___ there a bank near here?","options":["Is","Are"],"a":["Is"],"hint":"One bank: Is there…?"},
              {"type":"choose","q":"Are there many cars in the street? — No, there ___.","options":["isn't","aren't"],"a":["aren't"],"hint":"Are there…? — No, there aren't."},
              {"type":"gap","q":"Is there a cafe in the park? — Yes, there ___.","a":["is"],"hint":"Is there…? — Yes, there is."},
              {"type":"order","q":"Put the words in order.","words":["many","How","are","there","students"],"a":["How many students are there?"],"hint":"How many + students + are there?"}
            ]
          },
          {
            learn: {"title":"There's a dog. It's big.","story":["Hikoya aytayotganingni tasavvur qil: «Bog‘da bir it bor. **U** juda katta.»","Birinchi marta aytganda — **there is**: **There's** a dog in the garden.","Keyin o‘sha it haqida davom etsang — **it**: **It's** very big.","Ko‘p narsa bo‘lsa — **they**: There are two cats. **They're** hungry.","Odam bo‘lsa — **he** yoki **she**: There's a new girl in our class. **She's** from Spain."],"rule":"Use there is / there are to say something is there for the first time. Then use it (one thing) or they (two or more) to say more about it: There's a dog in the garden. It's very big.","examples":["There's a new girl in our class. She's from Spain.","There's a box on the table. It's heavy.","There are two cats in the garden. They're hungry.","There's a cafe near my house. It's very nice.","There are three books on my desk. They're new."],"uz":"Avval there is / there are bilan aytiladi, keyin it yoki they bilan davom etiladi: There's a dog. It's big."},
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
            learn: {"title":"a / an or the?","story":["Do‘stingga aytasan: «Ko‘chada **bir** mushukni ko‘rdim.» Do‘sting u mushukni bilmaydi — bu qandaydir bitta mushuk → **a** cat.","Keyin davom etasan: «**O‘sha** mushuk qora edi.» Endi ikkalangiz qaysi mushuk ekanini bilasiz → **the** cat.","**a / an** = bir, qandaydir bitta (birinchi marta aytilganda).","**the** = o‘sha, bu (ikkalamiz biladigan aniq narsa).","I've got **a** cat and **a** dog. **The** cat is black and **the** dog is white.","Uyda «Eshikni yop» desang, qaysi eshikligi aniq: Close **the** door."],"rule":"Use a / an when you talk about one thing for the first time, or about any one of many: There's a cat in the garden. Use the when you and the listener know which thing you mean, for example because you talked about it before: The cat is black.","table":[["First time (any one)","We know which one"],["I've got a cat and a dog.","The cat is black and the dog is white."],["There's a man at the door.","The man is tall."],["She's got an apple.","The apple is red."]],"examples":["I've got a cat and a dog. The cat is black and the dog is white.","There's a man at the door. The man is very tall.","There's a book on the table. The book is new.","Where is the teacher?","The door is open."],"uz":"a / an — birinchi marta aytilgan har qanday narsa, the — ikkalamiz biladigan aniq narsa."},
            practise: [
              {"type":"choose","q":"I've got ___ apple and a banana.","options":["a","an","the"],"a":["an"],"hint":"First time, and apple starts with a vowel sound: an."},
              {"type":"choose","q":"I've got an apple and a banana. ___ apple is red.","options":["A","An","The"],"a":["The"],"hint":"We already know which apple, so use the."},
              {"type":"choose","q":"There's a man at the door. ___ man is tall.","options":["A","The"],"a":["The"],"hint":"We already know which man, so use the."},
              {"type":"gap","q":"There's ___ bird on the roof. (a / an / the)","a":["a"],"hint":"First time we talk about the bird: a."},
              {"type":"fix","q":"Which sentence is correct?","options":["She's got a dog. The dog is very small.","She's got the dog. A dog is very small."],"a":["She's got a dog. The dog is very small."],"hint":"First time: a dog. After that: the dog."}
            ]
          },
          {
            learn: {"title":"the: only one, and places we know","story":["Dunyoda faqat bitta bo‘lgan narsalar bor: quyosh, oy, osmon, dengiz. Ular haqida gapirganda hamma qaysi biri ekanini biladi.","Shuning uchun ularning oldiga doim **the**: **the** sun (quyosh), **the** moon (oy), **the** sky (osmon).","Mahallangdagi joylar ham shunday. «Onam do‘konda» — har kuni boradigan do‘koningiz → My mum is at **the** shop.","**the** park, **the** station, **the** bank — siz biladigan, yaqindagi joylar."],"rule":"Use the with things there is only one of: the sun, the moon, the sky, the sea. Use the with places in a town when we know which one we mean: the park, the station, the shop.","table":[["Only one","A place we know"],["the sun","the park"],["the moon","the station"],["the sky","the shop"],["the sea","the cinema"]],"examples":["The sun is very hot today.","The moon is beautiful tonight.","The sky is blue.","My mum is at the shop.","The children are in the park."],"uz":"Dunyoda bitta bo‘lgan narsalar oldidan the ishlatiladi: the sun — quyosh, the moon — oy, the sky — osmon."},
            practise: [
              {"type":"choose","q":"___ sun is in the sky.","options":["A","The"],"a":["The"],"hint":"There is only one sun: the sun."},
              {"type":"choose","q":"The stars are in ___ sky.","options":["a","the"],"a":["the"],"hint":"There is only one sky: the sky."},
              {"type":"gap","q":"My dad is at ___ station. (we know which station)","a":["the"],"hint":"We know which station: the."},
              {"type":"choose","q":"Is there ___ cafe near here?","options":["a","the"],"a":["a"],"hint":"Any cafe, first time: a."},
              {"type":"fix","q":"Which sentence is correct?","options":["The moon is very bright tonight.","A moon is very bright tonight.","Moon is very bright tonight."],"a":["The moon is very bright tonight."],"hint":"There is only one moon: the moon."}
            ]
          },
          {
            learn: {"title":"No article","story":["Ba’zan hech qanday so‘z kerak emas:","• ism, shahar, davlat oldidan: Tom, London, Spain. («the Tom» — xato!)","• bu iboralarda: **at home** (uyda), **at school** (maktabda), **at work** (ishda).","• hamma itlar, hamma mushuklar haqida umuman gapirganda: **Dogs** are friendly animals. (Itlar do‘stona hayvonlar.)","Yodda tut: **a** = bitta, shuning uchun ko‘plik bilan hech qachon: «a cats» — xato, **cats** — to‘g‘ri."],"rule":"Don't use a, an or the before names of people, cities and countries: Tom, London, Spain. Don't use them in these phrases: at home, at school, at work. Never use a / an with plural nouns: cats (not a cats).","table":[["No article","Not"],["Tom is my friend.","The Tom is my friend."],["London is a big city.","The London is a big city."],["She is at home.","She is at the home."],["Cats are good pets.","A cats are good pets."]],"examples":["Tom is at school.","My mum is at work.","London is a big city.","Spain is a beautiful country.","Dogs are friendly animals."],"uz":"Ism, shahar va davlat nomlari oldidan hamda at home, at school, at work iboralarida artikl yo‘q."},
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
            learn: {"title":"Can you count it?","story":["Dasturxonda olmalar bor — ularni sanash mumkin: bitta olma, ikkita olma → one apple, two apple**s**.","Endi suvni sanab ko‘r: «bitta suv, ikkita suv»? Bo‘lmaydi! Suvni, sutni, guruchni, shakarni sanab bo‘lmaydi.","• sanaladigan narsalar **-s** va **a / an** oladi: **an** apple, three egg**s**.","• sanalmaydiganlar na **-s**, na **a / an** oladi: water, milk, rice, bread, sugar, money, music.","Sanalmaydiganlar bilan **is** ishlatiladi: The milk **is** in the fridge. (Sut muzlatkichda.)","Pul ham sanalmaydi: so‘mni sanaysan, lekin «money» so‘zining o‘zi sanalmaydi — «two moneys» demaymiz."],"rule":"Countable nouns are things you can count: one apple, two apples. They have a plural, and you can use a / an with one. Uncountable nouns are things you can't count, like water, milk, rice, bread, money, sugar and music. They have no plural and no a / an, and they go with is: The water is cold.","table":[["Countable","Uncountable"],["an apple, two apples","water"],["a banana, bananas","milk"],["an egg, eggs","bread"],["a bottle, bottles","rice"],["a coin, coins","money"]],"examples":["I've got an apple.","There are three eggs in the fridge.","The milk is in the fridge.","Rice is good for you.","My money is in my bag."],"uz":"Sanaladigan otlar (apple) -s va a / an oladi, sanalmaydigan otlar (water, rice) esa olmaydi."},
            practise: [
              {"type":"choose","q":"Which word is uncountable?","options":["apple","milk","egg"],"a":["milk"],"hint":"You can't count milk, so it is uncountable."},
              {"type":"choose","q":"Which word is countable?","options":["bread","banana","water"],"a":["banana"],"hint":"You can count bananas: one banana, two bananas."},
              {"type":"fix","q":"Which sentence is correct?","options":["The water is cold.","The waters are cold.","A water is cold."],"a":["The water is cold."],"hint":"Water is uncountable: no -s, no a, and use is."},
              {"type":"fix","q":"Which sentence is correct?","options":["My money is in my bag.","My moneys are in my bag."],"a":["My money is in my bag."],"hint":"Money is uncountable: no -s, and use is."},
              {"type":"gap","q":"There ___ rice in the bowl. (is / are)","a":["is"],"hint":"Rice is uncountable, so use is."}
            ]
          },
          {
            learn: {"title":"a bottle of, a cup of, a piece of","story":["Choyxonada «bitta choy» deysan — aslida bu «bir piyola choy» degani.","Ingliz tilida sanalmaydigan narsani idish yoki bo‘lak bilan sanaymiz:","a **cup of** tea (bir piyola choy), a **bottle of** water (bir shisha suv), a **piece of** cake (bir bo‘lak tort), a **kilo of** rice (bir kilo guruch).","Ko‘p bo‘lsa, **-s** idishga qo‘shiladi, choyga emas: two **cups** of tea (ikki piyola choy).","«two cup of teas» — xato!"],"rule":"To count uncountable things, use a word for a container or an amount: a bottle of water, a cup of tea, a piece of cake, a kilo of rice. For more than one, put -s on the container word: two cups of tea (not two cup of teas).","table":[["Amount","Example"],["a bottle of","a bottle of water"],["a cup of","a cup of tea"],["a glass of","a glass of milk"],["a piece of","a piece of cake / paper"],["a kilo of","a kilo of rice"],["a loaf of","a loaf of bread"]],"examples":["a cup of coffee","two bottles of juice","three pieces of paper","There's a glass of milk on the table.","I've got two kilos of sugar."],"uz":"Sanalmaydigan narsani idish so‘zi bilan sanaymiz, -s idishga qo‘shiladi: two cups of tea — ikki piyola choy."},
            practise: [
              {"type":"choose","q":"a ___ of water","options":["bottle","piece"],"a":["bottle"],"hint":"Water is in a bottle: a bottle of water."},
              {"type":"choose","q":"a ___ of cake","options":["piece","bottle"],"a":["piece"],"hint":"We cut cake into pieces: a piece of cake."},
              {"type":"gap","q":"two ___ of tea (cup)","a":["cups"],"hint":"Put -s on the container word: two cups of tea."},
              {"type":"choose","q":"three ___ of bread","options":["loaves","loafs"],"a":["loaves"],"hint":"loaf → loaves (like leaf → leaves)."},
              {"type":"fix","q":"Which sentence is correct?","options":["I've got two glasses of milk.","I've got two glass of milks.","I've got two glasses of milks."],"a":["I've got two glasses of milk."],"hint":"The -es goes on glass, never on milk."}
            ]
          },
          {
            learn: {"title":"How many? How much?","story":["Bozorda sotuvchi so‘raydi: «Nechta olma?» yoki «Qancha guruch?»","• sanaladigan narsa uchun — **How many**: **How many** apples? (Nechta olma?)","• sanalmaydigan narsa uchun — **How much**: **How much** rice? (Qancha guruch?)","«Ko‘p» desang — ikkalasi bilan ham **a lot of**: **a lot of** books, **a lot of** milk.","Pul haqida: **How much** money have you got? (Qancha puling bor?)"],"rule":"Ask How many + a plural noun (countable): How many apples? Ask How much + an uncountable noun: How much water? A lot of works with both: a lot of books, a lot of milk.","table":[["Countable","Uncountable"],["How many eggs are there?","How much milk is there?"],["How many brothers have you got?","How much money have you got?"],["There are a lot of books.","There is a lot of snow."]],"examples":["How many brothers have you got?","How much money have you got?","How many students are there in your class?","How much milk is there in the fridge?","There are a lot of books in the library.","There is a lot of snow today."],"uz":"How many — nechta? (sanaladigan), how much — qancha? (sanalmaydigan), a lot of — ko‘p (ikkalasi bilan)."},
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
            learn: {"title":"some in positive sentences","story":["Onang so‘raydi: «Muzlatkichda nima bor?» Sen qarab aytasan: «Biroz sut va bir nechta tuxum bor.»","«biroz», «bir nechta» — ingliz tilida **some**.","There is **some** milk. (Biroz sut bor.) There are **some** eggs. (Bir nechta tuxum bor.)","**some** aniq sonni aytmaydi — nechtaligi muhim emas, shunchaki «bor».","Oddiy gaplarda (savol va inkor bo‘lmagan gaplarda) ishlatiladi."],"rule":"Use some in positive sentences with plural nouns and uncountable nouns. It means a few or a little — we don't say exactly how many or how much: There are some eggs. There is some milk.","table":[["","Plural (countable)","Uncountable"],["Positive (+)","There are some apples.","There is some milk."]],"examples":["There are some books on the shelf.","I've got some money.","There is some cheese in the fridge.","Some students are in the library.","We've got some new neighbours."],"uz":"some — “bir nechta / biroz”, darak gaplarda ishlatiladi: There is some milk — Biroz sut bor."},
            practise: [
              {"type":"choose","q":"There are ___ pens on the desk.","options":["some","a"],"a":["some"],"hint":"Pens is plural, so use some (not a)."},
              {"type":"choose","q":"There is ___ water in the glass.","options":["some","a"],"a":["some"],"hint":"Water is uncountable, so use some (not a)."},
              {"type":"gap","q":"I've got ___ friends in London. (some / any)","a":["some"],"hint":"A positive sentence: some."},
              {"type":"fix","q":"Which sentence is correct?","options":["There are some oranges in the bag.","There are a oranges in the bag.","There is some oranges in the bag."],"a":["There are some oranges in the bag."],"hint":"Oranges is plural: there are some oranges."},
              {"type":"order","q":"Put the words in order.","words":["some","There","is","bread"],"a":["There is some bread."],"hint":"There is + some + bread."}
            ]
          },
          {
            learn: {"title":"any in negatives and questions","story":["Endi muzlatkich bo‘m-bo‘sh: «Umuman tuxum yo‘q.» → There aren't **any** eggs.","Savol berganda ham **any**: «Sut bormi?» → Is there **any** milk?","Qoidasi oddiy: **some** — oddiy gapda, **any** — inkor (not) va savolda.","Have you got **any** brothers? (Akalaring bormi?) — No, I haven't got **any** brothers."],"rule":"Use any in negative sentences and in questions, with plural nouns and uncountable nouns: There aren't any eggs. Is there any milk? Have you got any brothers?","table":[["","Plural (countable)","Uncountable"],["Negative (-)","There aren't any eggs.","There isn't any milk."],["Question (?)","Are there any eggs?","Is there any milk?"]],"examples":["I haven't got any money.","There aren't any chairs in the room.","Is there any sugar?","Have you got any pets?","There isn't any juice in the fridge."],"uz":"any — inkor va so‘roqda: Is there any milk? — Sut bormi? There isn't any milk — Sut umuman yo‘q."},
            practise: [
              {"type":"choose","q":"There aren't ___ cars in the street.","options":["some","any"],"a":["any"],"hint":"A negative sentence (aren't): any."},
              {"type":"choose","q":"Have you got ___ sisters?","options":["some","any"],"a":["any"],"hint":"A question: any."},
              {"type":"gap","q":"Is there ___ rice? (some / any)","a":["any"],"hint":"A question: any."},
              {"type":"gap","q":"We haven't got ___ bread. (some / any)","a":["any"],"hint":"A negative sentence (haven't): any."},
              {"type":"fix","q":"Which sentence is correct?","options":["There isn't any tea.","There isn't some tea.","There aren't any tea."],"a":["There isn't any tea."],"hint":"Negative: any. Tea is uncountable, so isn't."}
            ]
          },
          {
            learn: {"title":"some when you offer or ask for something","story":["Mehmon keldi. Sen choy taklif qilasan: «Choy ichasizmi?» → Would you like **some** tea?","Bu savol, lekin **some** ishlatamiz! Chunki taklif qilyapsan va «ha» javobini kutyapsan.","Biror narsa so‘raganda ham shunday: «Menga biroz suv bera olasizmi?» → Can I have **some** water, please?","Esda tut: taklif va iltimosda — **some**."],"rule":"When you offer something or ask for something, use some in the question: Would you like some tea? Can I have some water, please?","table":[["Offer","Ask for"],["Would you like some cake?","Can I have some cake, please?"],["Would you like some apples?","Can I have some apples, please?"]],"examples":["Would you like some cake?","Can I have some paper, please?","Would you like some coffee? — Yes, please.","Can I have some apples, please?"],"uz":"Biror narsa taklif qilganda yoki so‘raganda so‘roq gapda ham some ishlatiladi: Would you like some tea? — Choy ichasizmi?"},
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
          {"type":"order","q":"Put the words in order.","words":["any","I","haven't","got","money"],"a":["I haven't got any money.","Haven't I got any money?"]},
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
            learn: {"title":"in, on, under","story":["Onang telefonini qidiryapti. Sen aytasan: «Telefon stol **ustida**.» → The phone is **on** the table.","O‘zbekchada joyni so‘z oxiri yoki keyingi so‘z bildiradi: stol**da**, quti **ichida**. Ingliz tilida esa kichkina so‘z narsadan **oldin** keladi.","• **in** = ichida: The milk is **in** the fridge. (Sut muzlatkich ichida.)","• **on** = ustida, yuzasida: The picture is **on** the wall. (Rasm devorda.)","• **under** = ostida: The shoes are **under** the bed. (Poyabzal karavot ostida.)","O‘yin: qalamni qutining ichiga, ustiga, ostiga qo‘yib, ovoz chiqarib ayt: **in** the box, **on** the box, **under** the box."],"rule":"Prepositions of place tell us where something is. in = inside something: in the box. on = on top of something, touching it: on the table, on the wall. under = below something: under the bed.","table":[["Preposition","Meaning","Example"],["in","inside","The keys are in my bag."],["on","on top of / touching","The book is on the desk."],["under","below","The cat is under the chair."]],"examples":["The milk is in the fridge.","My phone is on the table.","There's a picture on the wall.","The shoes are under the bed.","Tom is in the kitchen."],"uz":"in — ichida, on — ustida (yuzasida), under — ostida: The cat is under the chair — Mushuk stul ostida."},
            practise: [
              {"type":"choose","q":"The pens are ___ the box. (inside it)","options":["in","on","under"],"a":["in"],"hint":"Inside something: in."},
              {"type":"choose","q":"The lamp is ___ the desk. (on top of it)","options":["in","on","under"],"a":["on"],"hint":"On top of something: on."},
              {"type":"choose","q":"The dog is ___ the table. (below it)","options":["in","on","under"],"a":["under"],"hint":"Below something: under."},
              {"type":"gap","q":"There's a clock ___ the wall. (in / on / under)","a":["on"],"hint":"Touching a wall: on the wall."},
              {"type":"fix","q":"Which sentence is correct?","options":["My books are in my bag.","My books are in the my bag.","My books are my bag in."],"a":["My books are in my bag."],"hint":"in + my bag: the preposition comes before the place."}
            ]
          },
          {
            learn: {"title":"next to, between, behind, in front of, opposite, near","story":["Sinf suratini ko‘rsatyapsan: «Men Sardorning **yonida** turibman.» → I am **next to** Sardor.","• **next to** = yonida","• **between** = orasida (ikki narsaning o‘rtasida): B is **between** A and C.","• **in front of** = oldida: There's a tree **in front of** my window.","• **behind** = orqasida: The ball is **behind** the sofa.","• **opposite** = qarshisida (yuzma-yuz): The pharmacy is **opposite** the bank.","• **near** = yaqinida: Is there a bus stop **near** here?"],"rule":"next to = at the side of. between = in the middle of two things. in front of = before something, at its front. behind = at the back of something. opposite = on the other side, facing it. near = not far from.","table":[["Preposition","Example"],["next to","The bank is next to the cafe."],["between","The cafe is between the bank and the shop."],["in front of","The car is in front of the house."],["behind","The garden is behind the house."],["opposite","The school is opposite the park."],["near","My flat is near the station."]],"examples":["Sam is next to Anna in the photo.","The letter B is between A and C.","There's a tree in front of my window.","The ball is behind the sofa.","The pharmacy is opposite the bank.","Is there a bus stop near here?"],"uz":"next to — yonida, between — orasida, in front of — oldida, behind — orqasida, opposite — qarshisida, near — yaqinida."},
            practise: [
              {"type":"choose","q":"The number 5 is ___ 4 and 6.","options":["between","behind","under"],"a":["between"],"hint":"In the middle of two things: between."},
              {"type":"choose","q":"The garden is ___ the house, at the back.","options":["behind","in front of","on"],"a":["behind"],"hint":"At the back of something: behind."},
              {"type":"choose","q":"Tom is ___ Ben. They are side by side.","options":["next to","under","opposite"],"a":["next to"],"hint":"At the side of someone: next to."},
              {"type":"gap","q":"The cafe is ___ the park. It is on the other side of the street, facing it.","a":["opposite","across from"],"hint":"On the other side, facing it: opposite."},
              {"type":"gap","q":"The teacher is ___ the class, so everyone can see her. (three words)","a":["in front of"],"hint":"At the front of something: in front of."}
            ]
          },
          {
            learn: {"title":"at, in, on for places","story":["O‘zbekchadagi bitta **-da** qo‘shimchasi o‘rniga ingliz tilida uch xil so‘z bor:","• **at** — nuqta yoki biror ish qiladigan joy: **at** home (uyda), **at** school (maktabda), **at** the bus stop (bekatda).","• **in** — shahar, davlat, xona ichida: **in** Tashkent, **in** Uzbekistan, **in** the kitchen.","• **on** — qavat va transport: **on** the third floor (uchinchi qavatda), **on** the bus (avtobusda).","Bobong qishloqda, sen esa avtobusdasan: My grandpa is **in** the village. I am **on** the bus."],"rule":"Use at for a point or a place where you do something: at the door, at the bus stop, at home, at school, at work. Use in for cities, countries and rooms: in Paris, in Spain, in the bedroom. Use on for floors and for buses and trains: on the second floor, on the bus.","table":[["at","in","on"],["at the door","in London","on the first floor"],["at the bus stop","in Spain","on the bus"],["at school / at home / at work","in the kitchen","on the train"]],"examples":["There's someone at the door.","My sister is at school.","My grandparents are in Spain.","Our flat is on the third floor.","The children are on the bus."],"uz":"at — nuqta yoki joy (at home), in — shahar, davlat, xona ichida (in London), on — qavat, avtobus (on the bus)."},
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
          {"type":"gap","q":"The bank is ___ the post office. It is on the other side of the road, facing it.","a":["opposite","across from"]},
          {"type":"choose","q":"The garden is ___ the house. You can't see it from the street.","options":["behind","in front of","between"],"a":["behind"]},
          {"type":"gap","q":"My house is ___ the school. It's only two minutes away. (= not far from)","a":["near","close to","not far from"]},
          {"type":"choose","q":"a ___ of bread","options":["bottle","loaf","glass"],"a":["loaf"],"from":"g8"},
          {"type":"choose","q":"My cousins are ___ Italy.","options":["at","in","on"],"a":["in"]},
          {"type":"choose","q":"Our flat is ___ the fifth floor.","options":["at","in","on"],"a":["on"]},
          {"type":"order","q":"Put the words in order.","words":["are","My","under","shoes","the","bed"],"a":["My shoes are under the bed."]},
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
            learn: {"title":"I work, they play","story":["Har kuni ertalab nima qilasan? «Men soat yettida turaman. Maktabga avtobusda boraman.»","Har kuni, doim bo‘ladigan ishlar haqida **Present Simple** ishlatamiz: I **get up** at seven. We **go** to school by bus.","O‘zbekchada fe’l har kim uchun o‘zgaradi: bor**aman**, bor**asan**, bor**amiz**. Ingliz tilida I, you, we, they bilan fe’l o‘zgarmaydi: I **go**, you **go**, we **go**, they **go**.","Hamma biladigan haqiqatlar ham shunday: Cows **eat** grass. (Sigirlar o‘t yeydi.)"],"rule":"Use the present simple for habits and routines (things you do every day, every week…) and for facts (things that are always true). With I, you, we and they, use the verb as it is: I play, they work.","table":[["Person","Verb","Example"],["I","play","I play football."],["you","play","You play the guitar."],["we","play","We play chess."],["they","play","They play tennis."]],"examples":["I get up at seven o'clock.","We go to school by bus.","You speak English very well.","My parents work in a hospital.","Cows eat grass."],"uz":"Present Simple doim bo‘ladigan ishlar uchun; I, you, we, they bilan fe’l o‘zgarmaydi: I play."},
            practise: [
              {"type":"choose","q":"I ___ tea every morning.","options":["drink","drinks"],"a":["drink"],"hint":"With I, the verb has no -s."},
              {"type":"choose","q":"We ___ in a small flat.","options":["live","lives"],"a":["live"],"hint":"With we, the verb has no -s."},
              {"type":"gap","q":"They ___ football on Saturdays. (play)","a":["play"],"hint":"With they, the verb has no -s."},
              {"type":"gap","q":"My friends ___ to the same school. (go)","a":["go"],"hint":"My friends = they, so the verb has no -s."},
              {"type":"order","q":"Put the words in order.","words":["English","I","speak"],"a":["I speak English."],"hint":"Person + verb + what: I speak English."}
            ]
          },
          {
            learn: {"title":"he works, she plays","story":["Endi opang haqida gapir: «U bankda ishlaydi.» → She **works** in a bank.","Faqat **he, she, it** bilan (yoki bitta odam yoki narsa: Tom, opam, mushugim) fe’lga **-s** qo‘shiladi.","I work → She work**s**. They play → Tom play**s**.","Bu kichkina **-s** — eng ko‘p unutiladigan narsa! Uni o‘zbekchadagi **-di** bilan birga esla: u ishlay**di** → she work**s**.","Mushuging ham: My cat sleep**s** a lot. (Mushugim ko‘p uxlaydi.)"],"rule":"With he, she and it (and one person or thing, like Tom or my cat), add -s to the verb: she works, he plays, it rains. Don't forget the -s!","table":[["I / you / we / they","he / she / it"],["I work","she works"],["they play","he plays"],["you read","Tom reads"],["we sleep","my cat sleeps"]],"examples":["She works in a bank.","Tom plays the guitar.","My cat sleeps a lot.","It rains a lot in April.","Anna lives near the sea."],"uz":"he, she, it bilan fe’lga -s qo‘shiladi: She works — U ishlaydi. Bu -s ni unutmang!"},
            practise: [
              {"type":"choose","q":"She ___ in a shop.","options":["work","works"],"a":["works"],"hint":"With she, add -s: works."},
              {"type":"choose","q":"My brother ___ computer games.","options":["play","plays"],"a":["plays"],"hint":"My brother = he, so add -s: plays."},
              {"type":"gap","q":"Lucy ___ milk every day. (drink)","a":["drinks"],"hint":"Lucy = she, so add -s: drinks."},
              {"type":"gap","q":"The shop ___ at nine o'clock. (open)","a":["opens"],"hint":"The shop = it, so add -s: opens."},
              {"type":"fix","q":"Which sentence is correct?","options":["He likes pizza.","He like pizza.","He liking pizza."],"a":["He likes pizza."],"hint":"With he, add -s: likes."}
            ]
          },
          {
            learn: {"title":"goes, watches, studies, has","story":["Ba’zi fe’llarga oddiy -s emas, **-es** qo‘shiladi — aytish oson bo‘lishi uchun.","• **s, sh, ch, x, o** bilan tugasa → **-es**: watch → watch**es**, go → go**es**, wash → wash**es**.","• undosh + **y** → **ies**: study → stud**ies**. (unli + y → shunchaki -s: play → play**s**)","• **have** — alohida: he **has**.","Dadang haqida: My dad wash**es** the car on Sundays. (Dadam yakshanba kunlari mashinani yuvadi.)"],"rule":"Verbs that end in -s, -sh, -ch, -x or -o add -es: watch → watches, go → goes, do → does. If a verb ends in a consonant + y, change y to i and add -es: study → studies. If it ends in a vowel + y, just add -s: play → plays. have → has.","table":[["Ending","he / she / it","Example"],["most verbs","+ s","work → works"],["-s, -sh, -ch, -x, -o","+ es","watch → watches, go → goes, do → does"],["consonant + y","y → ies","study → studies, fly → flies"],["have","has","have → has"]],"examples":["He watches TV in the evening.","She goes to bed at ten.","My dad washes the car on Sundays.","Emma studies English.","Sam has breakfast at eight."],"uz":"-s, -sh, -ch, -x, -o dan keyin -es (goes), undosh + y → ies (studies), have → has."},
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
          {"type":"order","q":"Put the words in order.","words":["at","I","get","seven","up"],"a":["I get up at seven.","At seven I get up."]},
          {"type":"choose","q":"My parents ___ at home.","options":["is","am","are"],"a":["are"],"from":"g1"},
          {"type":"choose","q":"Emma and Lily ___ to music.","options":["listen","listens"],"a":["listen"]}
        ]
      },
      {
        id: "g12", no: 12, title: "Present Simple (Negative and Questions)", v: 1,
        chunks: [
          {
            learn: {"title":"don't and doesn't","story":["Do‘sting kofe taklif qildi, lekin sen kofe ichmaysan: «Men kofe ichmayman.» → I **don't** drink coffee.","O‘zbekchada fe’lga **-ma** qo‘shamiz: ich**ma**yman. Ingliz tilida esa fe’ldan oldin **don't** qo‘yamiz.","• I, you, we, they → **don't** (do not)","• he, she, it → **doesn't** (does not)","Diqqat: **doesn't** da «-s» allaqachon bor, shuning uchun fe’lga yana -s qo‘shilmaydi: My brother **doesn't like** fish. («doesn't likes» — xato!)","-s faqat bir joyda bo‘ladi: yo doesn't da, yo fe’lda — ikkalasida emas."],"rule":"To make a negative, use don't (do not) with I, you, we, they, and doesn't (does not) with he, she, it. Then use the verb as it is. After doesn't, the verb has no -s: She doesn't like fish (not She doesn't likes).","table":[["Person","Negative","Example"],["I / you / we / they","don't + verb","I don't eat meat."],["he / she / it","doesn't + verb","He doesn't eat meat."]],"examples":["I don't drink coffee.","We don't have lessons on Sunday.","My brother doesn't like fish.","It doesn't snow here in summer.","Anna doesn't work on Fridays."],"uz":"Inkor: don't / doesn't + fe’l; doesn't dan keyin fe’lga -s qo‘shilmaydi: She doesn't like fish."},
            practise: [
              {"type":"choose","q":"I ___ like tea.","options":["don't","doesn't"],"a":["don't"],"hint":"With I, use don't."},
              {"type":"choose","q":"He ___ play football.","options":["don't","doesn't"],"a":["doesn't"],"hint":"With he, use doesn't."},
              {"type":"choose","q":"She doesn't ___ in London.","options":["live","lives"],"a":["live"],"hint":"After doesn't, the verb has no -s."},
              {"type":"gap","q":"We ___ go to school on Sunday. (negative)","a":["don't","do not"],"hint":"With we, use don't (do not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["Tom doesn't watch TV.","Tom don't watch TV.","Tom doesn't watches TV."],"a":["Tom doesn't watch TV."],"hint":"Tom = he: doesn't + watch (no -s)."}
            ]
          },
          {
            learn: {"title":"Do you…? Does she…?","story":["O‘zbekchada savol uchun so‘z oxiriga **-mi** qo‘shamiz: Shaxmat o‘ynaysan**mi**?","Ingliz tilida esa gap boshiga yordamchi **Do** yoki **Does** qo‘yiladi: **Do** you play chess?","• I, you, we, they → **Do**: **Do** they go to school by bus?","• he, she, it → **Does**: **Does** your sister work?","**Does** dan keyin ham fe’lga -s qo‘shilmaydi: Does he **speak** French?","Qisqa javob: Yes, I **do**. / No, I **don't**. Yes, she **does**. / No, she **doesn't**."],"rule":"To ask a question, use Do with I, you, we, they and Does with he, she, it, then the person, then the verb: Do you like music? Does he speak French? After Does, the verb has no -s. Short answers: Yes, I do. / No, I don't. Yes, she does. / No, she doesn't.","table":[["Question","Short answer"],["Do you like music?","Yes, I do. / No, I don't."],["Does he speak French?","Yes, he does. / No, he doesn't."],["Do they live here?","Yes, they do. / No, they don't."]],"examples":["Do you play chess? — Yes, I do.","Does your sister work? — No, she doesn't.","Do they go to school by bus?","Does it rain a lot in your town?","Do we have homework today?"],"uz":"So‘roq Do yoki Does bilan boshlanadi, Does dan keyin fe’lga -s qo‘shilmaydi: Do you like music?"},
            practise: [
              {"type":"choose","q":"___ you like pizza?","options":["Do","Does"],"a":["Do"],"hint":"With you, start with Do."},
              {"type":"choose","q":"___ she speak English?","options":["Do","Does"],"a":["Does"],"hint":"With she, start with Does."},
              {"type":"choose","q":"Does Sam ___ a bike?","options":["have","has"],"a":["have"],"hint":"After Does, the verb has no -s: have."},
              {"type":"gap","q":"Do you live near here? — Yes, I ___.","a":["do"],"hint":"Do you…? — Yes, I do."},
              {"type":"gap","q":"Does your dad cook? — No, he ___.","a":["doesn't","does not"],"hint":"Does he…? — No, he doesn't."}
            ]
          },
          {
            learn: {"title":"Where do you…? What time does it…?","story":["Yangi tanishingdan so‘raysan: «Qayerda yashaysan?» → **Where** do you live?","Tartibi: **savol so‘zi** + do / does + kim + fe’l.","**Where** (qayerda), **When** (qachon), **What time** (soat nechada), **What** (nima), **How** (qanday).","«Kino soat nechada boshlanadi?» → **What time does** the film **start**?","«Maktabga qanday borasan?» → **How do** you go to school? — By bus. (Avtobusda.)"],"rule":"Question words come first: What, Where, When, What time, Who, How. Then do or does, then the person, then the verb: Where do you live? What time does the film start?","table":[["Question word","do / does","Person","Verb"],["Where","do","you","live?"],["What","does","she","eat for breakfast?"],["What time","do","they","get up?"],["How","does","he","go to school?"]],"examples":["Where do you work?","What does Tom do? — He's a doctor.","When do you play football?","What time does the lesson start?","How do you go to school? — By bus."],"uz":"Savol so‘zi, keyin do / does, keyin shaxs va fe’l: Where do you live? — Qayerda yashaysiz?"},
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
            learn: {"title":"always, usually, often, sometimes, rarely, never","story":["Tishingni qanchalik tez-tez yuvasan? Har kuni — **doim**. Kofe ichasanmi? — **Hech qachon**.","Bu so‘zlar ish qanchalik tez-tez bo‘lishini aytadi:","**always** (doim) → **usually** (odatda) → **often** (tez-tez) → **sometimes** (ba’zan) → **rarely** (kamdan-kam) → **never** (hech qachon).","I **always** brush my teeth. (Men doim tishimni yuvaman.)","Anna **never** drinks coffee. (Anna hech qachon kofe ichmaydi.)"],"rule":"Adverbs of frequency say how often something happens. always = every time. never = not at any time. The others are in between: usually, often, sometimes, rarely.","table":[["Word","How often"],["always","100% — every time"],["usually","about 90%"],["often","about 70%"],["sometimes","about 50%"],["rarely","about 10%"],["never","0% — not at any time"]],"examples":["I always brush my teeth in the morning.","We usually have dinner at seven.","Tom often plays computer games.","I sometimes walk to school.","My dad rarely watches TV.","Anna never drinks coffee."],"uz":"always — doim, usually — odatda, often — tez-tez, sometimes — ba’zan, rarely — kamdan-kam, never — hech qachon."},
            practise: [
              {"type":"choose","q":"I brush my teeth every morning and every evening. I ___ brush my teeth.","options":["always","never"],"a":["always"],"hint":"Every time = always."},
              {"type":"choose","q":"Sam doesn't like fish. He ___ eats fish.","options":["always","never"],"a":["never"],"hint":"Not at any time = never."},
              {"type":"choose","q":"Which word means about 50%: at some times, but not always?","options":["sometimes","never","always"],"a":["sometimes"],"hint":"About 50% = sometimes."},
              {"type":"choose","q":"Kate goes swimming five days a week. She ___ goes swimming.","options":["often","never","rarely"],"a":["often"],"hint":"Five days a week is a lot = often."},
              {"type":"gap","q":"I go to the cinema once a year. I ___ go to the cinema. (rarely / always)","a":["rarely"],"hint":"Once a year is not much = rarely."}
            ]
          },
          {
            learn: {"title":"Where does it go?","story":["Bu so‘zlarning gapdagi joyi muhim:","• oddiy fe’ldan **oldin**: I **often** play tennis. (Men tez-tez tennis o‘ynayman.)","• lekin **am / is / are** dan **keyin**: She is **always** happy. (U doim xursand.)","• inkorda don't / doesn't dan keyin: I don't **usually** eat meat. (Men odatda go‘sht yemayman.)","Oson yo‘l: «always» fe’lning oldida turadi, faqat **is** ning orqasiga yashirinadi."],"rule":"The adverb goes before the main verb: I often play tennis. But it goes after am, is, are: She is always happy. In a negative, it goes after don't / doesn't: I don't usually eat meat.","table":[["","Where","Example"],["a main verb (play, eat, go…)","before the verb","I often play tennis."],["am / is / are","after it","She is always happy."],["don't / doesn't","after it","I don't usually eat meat."]],"examples":["I usually get up at seven.","My mum often cooks rice.","We are never late for school.","He is sometimes tired after work.","They always visit their grandmother on Sunday."],"uz":"Bu so‘zlar asosiy fe’ldan oldin keladi (I often play), lekin am, is, are dan keyin keladi (She is always happy)."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I always get up early.","I get always up early.","Always I get up early."],"a":["I always get up early."],"hint":"The adverb goes before the main verb (get up)."},
              {"type":"fix","q":"Which sentence is correct?","options":["She is never late.","She never is late.","Never she is late."],"a":["She is never late."],"hint":"The adverb goes after is."},
              {"type":"order","q":"Put the words in order.","words":["always","We","walk","school","to"],"a":["We always walk to school."],"hint":"We + always + walk (the adverb before the verb)."},
              {"type":"order","q":"Put the words in order.","words":["is","He","often","hungry"],"a":["He is often hungry."],"hint":"He + is + often (the adverb after is)."},
              {"type":"fix","q":"Which sentence is correct?","options":["Anna never drinks coffee.","Anna drinks never coffee.","Anna never drink coffee."],"a":["Anna never drinks coffee."],"hint":"never goes before the verb, and Anna = she, so drinks."}
            ]
          },
          {
            learn: {"title":"How often? Once a week, twice a week","story":["Do‘sting so‘raydi: «Sportzalga qanchalik tez-tez borasan?» → **How often** do you go to the gym?","Javob: «Haftada uch marta» → **Three times a week**.","• bir marta → **once**, ikki marta → **twice**, uch marta → **three times**","• kunida → **a day**, haftada → **a week**, oyida → **a month**; har kuni → **every day**","Bular gapning **oxirida** keladi: We have English **twice a week**.","Diqqat: **never** o‘zi «yo‘q» ma’nosini beradi. O‘zbekchada «hech qachon ichmayman» deymiz, ingliz tilida esa bitta inkor yetarli: I **never** drink cola. («I don't never» — xato!)"],"rule":"Ask How often…? to find out how many times. Answer with an adverb, or with every day, once a week (one time), twice a week (two times), three times a month. These go at the end of the sentence. Never is already negative, so don't use it with don't: I never eat meat (not I don't never eat meat).","table":[["How many times?","We say"],["1 time","once a day / once a week"],["2 times","twice a week / twice a month"],["3 or more times","three times a week / four times a year"],["each day","every day"]],"examples":["How often do you go to the gym? — Three times a week.","I visit my grandparents every Sunday.","She calls her mum once a day.","We have English twice a week.","I never drink cola."],"uz":"How often…? — Qanchalik tez-tez? once a week — haftada bir marta, twice a week — haftada ikki marta."},
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
          {"type":"fix","q":"Which sentence is correct?","options":["We are often tired on Mondays.","We are tired on often Mondays.","Often are we tired on Mondays."],"a":["We are often tired on Mondays."]},
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
          {"type":"order","q":"Put the words in order.","words":["sometimes","I","to","walk","school"],"a":["I sometimes walk to school.","I walk to school sometimes.","Sometimes I walk to school."]},
          {"type":"fix","q":"Which sentence is correct?","options":["How often do you visit your aunt?","How often you visit your aunt?","How often does you visit your aunt?"],"a":["How often do you visit your aunt?"]},
          {"type":"choose","q":"Would you like ___ cake?","options":["some","any"],"a":["some"],"from":"g9"},
          {"type":"choose","q":"I see my best friend ___ day.","options":["every","many","once"],"a":["every"]}
        ]
      },
      {
        id: "g14", no: 14, title: "Object Pronouns + Possessive Pronouns", v: 1,
        chunks: [
          {
            learn: {"title":"me, him, her, us, them","story":["Og‘ir sumka ko‘tarib kelyapsan va do‘stingga aytasan: «**Menga** yordam ber!» → Help **me**!","Gap boshida «men» → **I**. Fe’ldan keyin «meni / menga» → **me**.","• I → **me**, he → **him**, she → **her**, we → **us**, they → **them** (you va it o‘zgarmaydi)","«Men u bilan futbol o‘ynayman» → I play football with **him**. («with he» — xato!)","«Men ularni har hafta ko‘rgani boraman» → I visit **them** every week.","Oson yo‘l: fe’ldan yoki with, for, to kabi so‘zdan keyin — **me, him, her, us, them**."],"rule":"Object pronouns come after a verb (help, like, see…) or after a preposition (with, for, to, at). I → me, you → you, he → him, she → her, it → it, we → us, they → them.","table":[["Subject (before the verb)","Object (after the verb)"],["I","me"],["you","you"],["he","him"],["she","her"],["it","it"],["we","us"],["they","them"]],"examples":["Can you help me?","Tom is my friend. I play football with him.","This is Anna. I often see her at school.","This song is great. I love it.","Our teacher helps us a lot.","My grandparents are kind. I visit them every week."],"uz":"Bu olmoshlar fe’l yoki predlogdan keyin keladi: help me — menga yordam ber, with him — u bilan."},
            practise: [
              {"type":"choose","q":"This is my friend Sam. I like ___.","options":["he","him","his"],"a":["him"],"hint":"After a verb (like), he → him."},
              {"type":"choose","q":"Lucy is nice. I often talk to ___.","options":["she","her","hers"],"a":["her"],"hint":"After to, she → her."},
              {"type":"choose","q":"Please wait for ___. I'm coming!","options":["I","me","my"],"a":["me"],"hint":"After for, I → me."},
              {"type":"gap","q":"My parents are great. I love ___. (they)","a":["them"],"hint":"After a verb (love), they → them."},
              {"type":"fix","q":"Which sentence is correct?","options":["The teacher helps us.","The teacher helps we.","The teacher helps our."],"a":["The teacher helps us."],"hint":"After a verb (helps), we → us."}
            ]
          },
          {
            learn: {"title":"mine, yours, his, hers, ours, theirs","story":["Sinfda kimdir telefonni o‘ziniki deb o‘ylayapti. Sen aytasan: «Bu telefon **meniki**!» → This phone is **mine**!","**mine** = meniki. Undan keyin narsaning nomi kelmaydi — u allaqachon aytilgan.","• my → **mine** (meniki), your → **yours** (seniki)","• his → **his** (uniki), her → **hers** (uniki)","• our → **ours** (bizniki), their → **theirs** (ularniki)","Bu so‘zlarda apostrof (') yo‘q: yours, hers — «your's» deb yozma!"],"rule":"Possessive pronouns stand alone — no noun comes after them: This book is mine (= my book). Compare: my bag → It's mine. her pen → It's hers. There is no apostrophe in yours, hers, ours or theirs.","table":[["Before a noun","Alone"],["my bag","mine"],["your bag","yours"],["his bag","his"],["her bag","hers"],["our bag","ours"],["their bag","theirs"]],"examples":["This phone is mine.","Is this pen yours?","That isn't my coat. It's hers.","The red car is ours.","These books aren't theirs.","My bike is old, but his is new."],"uz":"mine, yours, hers, ours, theirs — meniki, seniki, uniki, bizniki, ularniki; ulardan keyin ot kelmaydi."},
            practise: [
              {"type":"choose","q":"This is my bag. It's ___.","options":["my","mine","me"],"a":["mine"],"hint":"No noun after it: my → mine."},
              {"type":"choose","q":"Is this your pen? Is it ___?","options":["your","yours","you"],"a":["yours"],"hint":"No noun after it: your → yours."},
              {"type":"choose","q":"That's Anna's phone. It's ___.","options":["her","hers","she"],"a":["hers"],"hint":"No noun after it: her → hers."},
              {"type":"gap","q":"This is our house. It's ___. (we)","a":["ours"],"hint":"No noun after it: our → ours."},
              {"type":"fix","q":"Which sentence is correct?","options":["These shoes are theirs.","These shoes are their's.","These shoes are their."],"a":["These shoes are theirs."],"hint":"theirs has no apostrophe."}
            ]
          },
          {
            learn: {"title":"Whose is it? — It's Tom's.","story":["Sinfda egasiz sumka qoldi. O‘qituvchi so‘raydi: «Bu **kimning** sumkasi?» → **Whose** bag is this?","Javob: «Tomniki» → It's **Tom's**. Ismga **'s** qo‘shamiz — bu o‘zbekchadagi **-ning** yoki **-niki**.","Tom**'s** room — Tom**ning** xonasi; my sister**'s** room — opam**ning** xonasi.","Ko‘plikdagi so‘z -s bilan tugasa, faqat apostrof qo‘yiladi: my parents**'** car (ota-onamning mashinasi)."],"rule":"Ask Whose…? to find out who something belongs to. Answer with a name + 's (Tom's) or with mine, yours, his, hers, ours, theirs. When the noun is plural and ends in -s, add only an apostrophe: my parents' car (= the car of my parents).","table":[["Question","Answer"],["Whose bag is this?","It's mine. / It's Tom's."],["Whose shoes are these?","They're hers. / They're Emma's."],["Whose car is that?","It's my parents' car."]],"examples":["Whose bag is this? — It's mine.","Whose is this coat? — It's Emma's.","This is my sister's room.","Whose are these shoes? — They're Sam's.","My parents' house is near the park."],"uz":"Whose…? — Kimning…? Javobda ism + 's (Tom's — Tomniki) yoki mine, hers kabi so‘zlar ishlatiladi."},
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
          {"type":"gap","q":"Whose jacket is this? — It's ___. (Lucy)","a":["Lucy's","hers"]},
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
            learn: {"title":"Open the door. Don't run.","story":["Dars boshlandi. O‘qituvchi aytadi: «Kitoblaringizni oching!» → **Open** your books!","Buyruq gapda «sen / siz» aytilmaydi — gap darhol fe’l bilan boshlanadi: **Sit down.** (O‘tiring.) **Listen.** (Tinglang.)","«Qilma!» deyish uchun — **Don't** + fe’l: **Don't run!** (Yugurmang!)","Xushmuomala bo‘lish uchun **please** (iltimos) qo‘sh: **Please** sit down. / Sit down, **please**.","Pol ho‘l bo‘lsa: **Be careful!** (Ehtiyot bo‘ling!)"],"rule":"Use the imperative to give instructions, orders or advice. Start with the verb as it is — don't say you: Open your books. Sit down. For a negative, use Don't + verb: Don't run. Add please to be polite: Please sit down. / Sit down, please.","table":[["Positive","Negative"],["Open the window.","Don't open the window."],["Sit down, please.","Don't sit there."],["Be quiet.","Don't be late."]],"examples":["Open your books at page 10.","Listen and repeat.","Please sit down.","Don't talk in the library.","Be careful! The floor is wet.","Don't forget your homework."],"uz":"Buyruq gapda you aytilmaydi, gap fe’l bilan boshlanadi: Sit down — O‘tiring. Inkor: Don't + fe’l: Don't run — Yugurmang."},
            practise: [
              {"type":"choose","q":"___ the door, please. It's cold.","options":["Close","Closes","Closing"],"a":["Close"],"hint":"An instruction starts with the verb as it is: Close."},
              {"type":"choose","q":"___ late for school!","options":["Don't be","Not be","Don't"],"a":["Don't be"],"hint":"Negative: Don't + verb (be)."},
              {"type":"gap","q":"___ touch the oven. It's hot! (negative)","a":["Don't","Do not"],"hint":"Negative: Don't + verb."},
              {"type":"fix","q":"Which sentence is correct?","options":["Please be quiet.","Please are quiet.","Please you be quiet."],"a":["Please be quiet."],"hint":"Start with the verb as it is (be), with no you."},
              {"type":"order","q":"Put the words in order.","words":["your","Open","books"],"a":["Open your books."],"hint":"Start with the verb: Open."}
            ]
          },
          {
            learn: {"title":"Subject + verb + object","story":["O‘zbekchada fe’l gapning **oxirida** keladi: Men olmani yaxshi **ko‘raman**.","Ingliz tilida esa fe’l **egadan keyin darhol** keladi: I **like** apples.","Tartibi: **kim?** + **nima qiladi?** + **nimani / kimni?**","Men + yaxshi ko‘raman + olmani → I + **like** + apples.","Tom + yeydi + olmani → Tom + **eats** + an apple.","«I apples like» — xato! Fe’l hech qachon gap oxiriga qochmaydi."],"rule":"An English sentence usually goes like this: subject (who?) + verb (does what?) + object (what? / who?). I like apples. The verb comes right after the subject, not at the end of the sentence.","table":[["Subject (who?)","Verb (does what?)","Object (what?)"],["I","like","apples."],["My sister","reads","books."],["We","play","football."]],"examples":["Tom eats an apple.","My parents love music.","The children watch cartoons.","She speaks three languages.","We visit our grandparents."],"uz":"Ingliz gapida fe’l egadan keyin keladi, oxirida emas: I like apples — Men olmani yaxshi ko‘raman."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I like music.","I music like.","Like I music."],"a":["I like music."],"hint":"Subject + verb + object: I + like + music."},
              {"type":"fix","q":"Which sentence is correct?","options":["Anna reads books.","Anna books reads.","Reads Anna books."],"a":["Anna reads books."],"hint":"The verb comes right after the subject: Anna reads."},
              {"type":"order","q":"Put the words in order.","words":["football","We","play"],"a":["We play football."],"hint":"We (subject) + play (verb) + football (object)."},
              {"type":"order","q":"Put the words in order.","words":["milk","The","cat","drinks"],"a":["The cat drinks milk."],"hint":"The cat (subject) + drinks (verb) + milk (object)."},
              {"type":"order","q":"Put the words in order.","words":["English","teaches","Mrs","Green"],"a":["Mrs Green teaches English."],"hint":"Mrs Green (subject) + teaches (verb) + English (object)."}
            ]
          },
          {
            learn: {"title":"Where and when go at the end","story":["Gapga «qayerda?» va «qachon?» qo‘shsak, ular gapning **oxiriga** boradi.","Tartibi: kim + nima qiladi + nimani + **qayerda** + **qachon**.","I play football + **in the park** (qayerda?) + **on Saturdays** (qachon?).","O‘zbekchada esa vaqt ko‘pincha boshida keladi: «Shanba kunlari parkda futbol o‘ynayman.»","Yodla: avval **joy**, keyin **vaqt**."],"rule":"After the object, say where (the place), then when (the time): I play football (what) in the park (where) on Saturdays (when). Words like every day, on Sundays and after school don't go between the subject and the verb.","table":[["Subject","Verb","Object","Where?","When?"],["I","play","football","in the park","on Saturdays."],["She","has","lunch","at school","every day."],["We","watch","TV","at home","in the evening."]],"examples":["I meet my friends in the cafe on Fridays.","My dad reads the newspaper at home every morning.","They play tennis in the park after school.","Tom does his homework in his room in the evening.","We have English lessons at school on Mondays."],"uz":"Gap oxirida avval joy (qayerda?), keyin vaqt (qachon?) aytiladi: I play football in the park on Saturdays."},
            practise: [
              {"type":"fix","q":"Which sentence is correct?","options":["I go to the gym every day.","I every day go to the gym.","Go I to the gym every day."],"a":["I go to the gym every day."],"hint":"The time (every day) goes at the end."},
              {"type":"fix","q":"Which sentence is correct?","options":["We eat lunch at school every day.","We every day eat lunch at school.","We eat at school every day lunch."],"a":["We eat lunch at school every day."],"hint":"Subject + verb + object + where + when."},
              {"type":"order","q":"Put the words in order.","words":["in","I","play","the","park","football"],"a":["I play football in the park.","In the park I play football."],"hint":"I + play + football + in the park (where)."},
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
          {"type":"order","q":"Put the words in order.","words":["after","school","I","homework","my","do"],"a":["I do my homework after school.","After school I do my homework."]},
          {"type":"choose","q":"There ___ two bathrooms in our flat.","options":["is","are"],"a":["are"],"from":"g6"},
          {"type":"fix","q":"Which sentence is correct?","options":["Close your books, please.","Closes your books, please.","You closes your books, please."],"a":["Close your books, please."]}
        ]
      }
    ]
    },
    {
      id: "elementary", name: "Elementary", lessons: [
      {
        id: "g16", no: 16, title: "Present Continuous", v: 1,
        chunks: [
          {
            learn: {"title":"I am working, she is reading","rule":"Use the present continuous for an action that is happening now, at the moment of speaking. Make it with am / is / are + verb-ing: I am reading. She is cooking. They are playing. Time words: now, right now, at the moment, and Look! / Listen! at the start.","table":[["Person","be","Example"],["I","am ('m) + verb-ing","I'm working now."],["he / she / it","is ('s) + verb-ing","She's reading a book."],["you / we / they","are ('re) + verb-ing","They're playing football."]],"examples":["I'm doing my homework now.","Listen! The baby is crying.","Tom is talking to his friend at the moment.","We are waiting for the bus right now.","Look! It's snowing.","My parents are watching a film in the living room now."],"uz":"Present Continuous hozir bo‘layotgan ish uchun: am / is / are + fe’l-ing. I am reading — Men hozir o‘qiyapman."},
            practise: [
              {"type":"choose","q":"I ___ my homework now.","options":["am doing","is doing","are doing"],"a":["am doing"],"hint":"With I, use am + verb-ing: am doing."},
              {"type":"choose","q":"Look! The children ___ in the garden.","options":["are playing","is playing","play"],"a":["are playing"],"hint":"The children = they: are + playing. Look! shows it is happening now."},
              {"type":"gap","q":"She ___ a book at the moment. (read)","a":["is reading","'s reading"],"hint":"With she, use is + verb-ing: is reading."},
              {"type":"gap","q":"We ___ for the bus right now. (wait)","a":["are waiting","'re waiting"],"hint":"With we, use are + verb-ing: are waiting."},
              {"type":"order","q":"Put the words in order.","words":["is","He","TV","watching"],"a":["He is watching TV."],"hint":"He + is + watching + TV."}
            ]
          },
          {
            learn: {"title":"I'm not working. Are you working?","rule":"Negative: put not after am / is / are: I'm not sleeping. She isn't (is not) working. They aren't (are not) listening. Question: put am / is / are before the person: Are you listening? Is he sleeping? Short answers: Yes, I am. / No, I'm not. Yes, she is. / No, she isn't. With a question word: What are you doing?","table":[["","Example"],["Negative","I'm not cooking. / He isn't working. / We aren't playing."],["Question","Is she sleeping? / Are they coming?"],["Short answer","Yes, she is. / No, she isn't."],["Question word","What are you doing? / Where is he going?"]],"examples":["I'm not watching TV now. I'm reading.","Anna isn't working today. She's at home.","Are you listening to me? — Yes, I am.","Is it raining now? — No, it isn't.","What are you doing at the moment?","Where are they going?"],"uz":"Inkor: am / is / are + not + fe’l-ing. So‘roq: Are you listening? — Tinglayapsizmi?"},
            practise: [
              {"type":"choose","q":"He ___ sleeping now. He's reading.","options":["isn't","aren't","doesn't"],"a":["isn't"],"hint":"With he, the negative is isn't (is not) + verb-ing."},
              {"type":"choose","q":"___ they playing football now?","options":["Are","Is","Do"],"a":["Are"],"hint":"Question: Are + they + verb-ing."},
              {"type":"gap","q":"Is your sister cooking now? — No, she ___.","a":["isn't","is not"],"hint":"Is she…? — No, she isn't."},
              {"type":"gap","q":"What ___ you doing at the moment? (be)","a":["are"],"hint":"Question word + are + you + verb-ing."},
              {"type":"fix","q":"Which sentence is correct?","options":["Are you watching TV now?","Are you watch TV now?","Do you watching TV now?"],"a":["Are you watching TV now?"],"hint":"Question: Are + you + verb-ing (watching)."}
            ]
          },
          {
            learn: {"title":"making, swimming, lying","rule":"Most verbs just add -ing: read → reading, play → playing. If a verb ends in -e, drop the e: make → making, write → writing. If a short verb ends in one vowel + one consonant, double the last letter: sit → sitting, run → running, swim → swimming (but not w, x or y: play → playing). ie → y: lie → lying.","table":[["Verb ends in","Rule","Examples"],["most verbs","+ ing","read → reading, play → playing"],["-e","drop e + ing","make → making, write → writing"],["one vowel + one consonant","double + ing","sit → sitting, run → running, swim → swimming"],["-ie","ie → y + ing","lie → lying, tie → tying"]],"examples":["She is making a cake.","The children are swimming in the lake.","Why are you running?","Dad is sitting in the garden.","I'm writing an email to my friend."],"uz":"-e bilan tugasa, e tushib qoladi (make → making); qisqa fe’lda oxirgi undosh ikkilanadi (run → running)."},
            practise: [
              {"type":"choose","q":"She is ___ a cake now.","options":["making","makeing","makking"],"a":["making"],"hint":"make ends in -e: drop the e and add -ing."},
              {"type":"choose","q":"They are ___ in the sea now.","options":["swimming","swiming","swimeing"],"a":["swimming"],"hint":"swim: one vowel + one consonant, so double the m."},
              {"type":"gap","q":"Why are you ___? (run)","a":["running"],"hint":"run: double the n → running."},
              {"type":"gap","q":"I'm ___ an email now. (write)","a":["writing"],"hint":"write ends in -e: drop the e → writing."},
              {"type":"fix","q":"Which sentence is correct?","options":["He is sitting on the sofa.","He is siting on the sofa.","He is sit on the sofa."],"a":["He is sitting on the sofa."],"hint":"sit → sitting (double the t)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"Look! It ___.","options":["is raining","rains","are raining"],"a":["is raining"]},
          {"type":"choose","q":"I ___ to music right now.","options":["am listening","is listening","listen"],"a":["am listening"]},
          {"type":"gap","q":"They ___ dinner at the moment. (have)","a":["are having","'re having"]},
          {"type":"choose","q":"My brother ___ in a bank.","options":["work","works"],"a":["works"],"from":"g11"},
          {"type":"gap","q":"Listen! Somebody ___ the piano. (play)","a":["is playing","'s playing"]},
          {"type":"choose","q":"We ___ watching TV now. We're doing our homework.","options":["aren't","isn't","don't"],"a":["aren't"]},
          {"type":"gap","q":"Is Tom sleeping now? — Yes, he ___.","a":["is"]},
          {"type":"choose","q":"___ you waiting for the bus now?","options":["Are","Is","Do"],"a":["Are"]},
          {"type":"gap","q":"Does your mum drive? — No, she ___.","a":["doesn't","does not"],"from":"g12"},
          {"type":"gap","q":"The children are ___ in the pool now. (swim)","a":["swimming"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She is making a sandwich now.","She is makeing a sandwich now.","She making a sandwich now."],"a":["She is making a sandwich now."]},
          {"type":"order","q":"Put the words in order.","words":["are","What","doing","you"],"a":["What are you doing?"]},
          {"type":"choose","q":"Be quiet! The baby ___ now.","options":["is sleeping","sleeps","are sleeping"],"a":["is sleeping"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I am never late for school.","I never am late for school.","Never I am late for school."],"a":["I am never late for school."],"from":"g13"},
          {"type":"gap","q":"I ___ working today. I'm at home. (negative)","a":["'m not","am not"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Where are you going now?","Where you are going now?","Where are you go now?"],"a":["Where are you going now?"]},
          {"type":"order","q":"Put the words in order.","words":["sitting","is","My","garden","dad","the","in"],"a":["My dad is sitting in the garden."]},
          {"type":"choose","q":"The dog is ___ on the floor now.","options":["lying","lieing","lyeing"],"a":["lying"]},
          {"type":"choose","q":"This bag isn't mine. It's ___.","options":["hers","her","she"],"a":["hers"],"from":"g14"},
          {"type":"fix","q":"Which sentence is correct?","options":["Are they playing tennis now?","Are they play tennis now?","Do they playing tennis now?"],"a":["Are they playing tennis now?"]}
        ]
      },
      {
        id: "g17", no: 17, title: "Present Simple vs Present Continuous", v: 1,
        chunks: [
          {
            learn: {"title":"Every day or now?","rule":"Present simple = habits, routines and facts. Time words: every day, usually, often, never, on Mondays. I walk to school every day. Present continuous = an action happening now. Time words: now, right now, at the moment, Look!, Listen! I'm walking to school now. Look at the time words to choose.","table":[["","Present simple","Present continuous"],["Use","habits and facts","happening now"],["Time words","every day, usually, often, on Fridays","now, right now, at the moment, Look!"],["Example","She drinks tea every morning.","She is drinking tea now."],["Example","They play football on Sundays.","They are playing football at the moment."]],"examples":["I usually walk to school, but today I'm going by bus.","Tom plays tennis every Saturday.","Look! Tom is playing tennis right now.","It often rains in April.","Listen! It's raining now."],"uz":"Har kuni bo‘ladigan ish — Present Simple (I walk); hozir bo‘layotgan ish — Present Continuous (I'm walking)."},
            practise: [
              {"type":"choose","q":"I ___ to school every day.","options":["walk","am walking"],"a":["walk"],"hint":"every day = a habit → present simple."},
              {"type":"choose","q":"Look! The dog ___ the ball.","options":["is catching","catches"],"a":["is catching"],"hint":"Look! = it is happening now → present continuous."},
              {"type":"choose","q":"We usually ___ dinner at seven.","options":["have","are having"],"a":["have"],"hint":"usually = a habit → present simple."},
              {"type":"gap","q":"Be quiet! The baby ___ now. (sleep)","a":["is sleeping","'s sleeping"],"hint":"now → present continuous: is + sleeping."},
              {"type":"gap","q":"My dad ___ coffee every morning. (drink)","a":["drinks"],"hint":"every morning → present simple. My dad = he, so add -s."}
            ]
          },
          {
            learn: {"title":"do / does or am / is / are?","rule":"Present simple negatives and questions use do / does: Do you play chess? He doesn't work here. Present continuous uses am / is / are: Are you playing chess now? He isn't working today. Don't mix them: not Do you playing, not Are you play.","table":[["","Present simple","Present continuous"],["Negative","She doesn't play.","She isn't playing."],["Question","Do you play?","Are you playing?"],["Question word","What do you do?","What are you doing?"]],"examples":["Do you watch TV every evening? — Yes, I do.","Are you watching TV now? — No, I'm not.","She doesn't eat meat.","She isn't eating at the moment.","What do you do? — I'm a teacher.","What are you doing? — I'm cooking."],"uz":"What do you do? — Kasbingiz nima? What are you doing? — Hozir nima qilyapsiz?"},
            practise: [
              {"type":"choose","q":"___ you play the guitar every evening?","options":["Do","Are"],"a":["Do"],"hint":"every evening = a habit → Do you play…?"},
              {"type":"choose","q":"___ she reading now?","options":["Is","Does"],"a":["Is"],"hint":"now + reading → Is she reading?"},
              {"type":"choose","q":"He ___ work on Sundays.","options":["doesn't","isn't"],"a":["doesn't"],"hint":"on Sundays = a habit → doesn't + verb."},
              {"type":"gap","q":"What ___ you doing right now? (do / are)","a":["are"],"hint":"doing + right now → are."},
              {"type":"fix","q":"Which sentence is correct?","options":["Are you listening to me now?","Do you listening to me now?","Are you listen to me now?"],"a":["Are you listening to me now?"],"hint":"now → Are + you + listening."}
            ]
          },
          {
            learn: {"title":"want, like, know — no -ing","rule":"Some verbs are about feelings, thoughts and having, not actions: like, love, hate, want, need, know, understand, remember, have (= own). We use them in the present simple, even with now: I want a drink now (not I'm wanting). I know the answer (not I'm knowing). But have lunch, have a shower are actions, so they can take -ing: I'm having lunch now.","table":[["Verb","Right","Wrong"],["want","I want an apple now.","I'm wanting an apple now."],["know","She knows the answer.","She is knowing the answer."],["like","We like this song.","We are liking this song."],["need","I need help right now.","I'm needing help right now."],["understand","Do you understand me?","Are you understanding me?"]],"examples":["I'm hungry. I want a sandwich now.","Do you know the answer?","He doesn't understand the question.","We need some milk right now.","Tom is having lunch now. (have lunch = eat)"],"uz":"want, like, know, need kabi fe’llar odatda -ing olmaydi: I want water now — Hozir suv xohlayman."},
            practise: [
              {"type":"choose","q":"I ___ a glass of water now.","options":["want","am wanting"],"a":["want"],"hint":"want is a feeling, not an action: no -ing, even with now."},
              {"type":"choose","q":"She ___ the answer.","options":["knows","is knowing"],"a":["knows"],"hint":"know is a thought, not an action: present simple."},
              {"type":"choose","q":"Listen! Anna ___ a song.","options":["is singing","sings"],"a":["is singing"],"hint":"sing is an action, and Listen! = now → is singing."},
              {"type":"gap","q":"I ___ this film. It's great! (like)","a":["like"],"hint":"like is a feeling: present simple, no -ing."},
              {"type":"fix","q":"Which sentence is correct?","options":["Do you understand the question?","Are you understanding the question?","Does you understand the question?"],"a":["Do you understand the question?"],"hint":"understand: present simple → Do you understand…?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"My sister ___ to music every evening.","options":["listens","is listening"],"a":["listens"]},
          {"type":"choose","q":"Shh! I ___ to the news now.","options":["am listening","listen"],"a":["am listening"]},
          {"type":"gap","q":"They ___ football at the moment. (play)","a":["are playing","'re playing"]},
          {"type":"gap","q":"She ___ English every day. (study)","a":["studies"],"from":"g11"},
          {"type":"choose","q":"We ___ to the cinema on Fridays.","options":["go","are going"],"a":["go"]},
          {"type":"choose","q":"Now I ___ what you mean.","options":["understand","am understanding"],"a":["understand"]},
          {"type":"gap","q":"Look! The bus ___. (come)","a":["is coming","'s coming"]},
          {"type":"fix","q":"Which sentence is correct?","options":["What are you doing now?","What do you doing now?","What are you do now?"],"a":["What are you doing now?"]},
          {"type":"choose","q":"___ your brother live in London?","options":["Does","Do","Is"],"a":["Does"],"from":"g12"},
          {"type":"choose","q":"He usually ___ tea, but today he ___ coffee.","options":["drinks / is drinking","is drinking / drinks","drink / drinking"],"a":["drinks / is drinking"]},
          {"type":"gap","q":"My dad ___ work on Sundays. (negative)","a":["doesn't","does not"]},
          {"type":"gap","q":"Tom isn't at home. He ___ in the park right now. (run)","a":["is running","'s running"]},
          {"type":"order","q":"Put the words in order.","words":["playing","Are","chess","you"],"a":["Are you playing chess?"]},
          {"type":"order","q":"Put the words in order.","words":["usually","I","at","get","up","seven"],"a":["I usually get up at seven.","I get up at seven usually.","Usually I get up at seven.","At seven I usually get up."],"from":"g13"},
          {"type":"choose","q":"I ___ a new bike now. It's red.","options":["have","am having"],"a":["have"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She doesn't like coffee.","She isn't liking coffee.","She don't like coffee."],"a":["She doesn't like coffee."]},
          {"type":"gap","q":"The children are ___ in the lake now. (swim)","a":["swimming"],"from":"g16"},
          {"type":"choose","q":"What ___ your mum do? — She's a doctor.","options":["does","is"],"a":["does"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Listen! The birds are singing.","Listen! The birds sing.","Listen! The birds is singing."],"a":["Listen! The birds are singing."]},
          {"type":"gap","q":"I ___ some help right now. (need)","a":["need"]}
        ]
      },
      {
        id: "g18", no: 18, title: "Can and Cannot (Ability)", v: 1,
        chunks: [
          {
            learn: {"title":"I can swim","rule":"Use can + verb to say that someone is able to do something. Can is the same for every person — it never takes -s: I can swim. She can swim (not she cans). After can, use the verb as it is, with no to and no -s: He can speak French (not can to speak, not can speaks).","table":[["Person","can + verb","Example"],["I / you / we / they","can swim","We can swim."],["he / she / it","can play","She can play the piano."]],"examples":["I can ride a bike.","My little brother can count to a hundred.","Birds can fly.","Anna can speak three languages.","We can run very fast.","My grandma can make great cakes."],"uz":"can — qila olmoq. can hamma shaxs bilan bir xil, undan keyin fe’l to va -s qo‘shimchasisiz keladi: She can swim."},
            practise: [
              {"type":"choose","q":"She ___ play the guitar.","options":["can","cans","can to"],"a":["can"],"hint":"can is the same for every person: She can."},
              {"type":"choose","q":"Tom can ___ very fast.","options":["run","runs","to run"],"a":["run"],"hint":"After can, the verb as it is: run."},
              {"type":"gap","q":"My dad can ___ three languages. (speak)","a":["speak"],"hint":"After can, the verb as it is: speak."},
              {"type":"fix","q":"Which sentence is correct?","options":["He can play chess.","He cans play chess.","He can plays chess."],"a":["He can play chess."],"hint":"can + verb as it is, no -s anywhere."},
              {"type":"order","q":"Put the words in order.","words":["can","She","a","ride","horse"],"a":["She can ride a horse.","Can she ride a horse?"],"hint":"She + can + ride + a horse."}
            ]
          },
          {
            learn: {"title":"can't — Can you…?","rule":"Negative: cannot or can't (short form) + verb: I can't swim. Cats can't fly. Question: put can before the person: Can you swim? Can she cook? Short answers: Yes, I can. / No, I can't. With a question word: What can you cook? How many languages can you speak?","table":[["","Example"],["Negative","I can't (cannot) drive."],["Question","Can you drive?"],["Short answers","Yes, I can. / No, I can't."],["Question word","What can you cook?"]],"examples":["Penguins can't fly.","I can't hear you. Please speak louder.","Can you play tennis? — Yes, I can.","Can your sister drive? — No, she can't.","What languages can you speak?"],"uz":"Inkor: can't (cannot) + fe’l. So‘roq: Can you swim? — Suza olasizmi?"},
            practise: [
              {"type":"choose","q":"I ___ swim. I'm afraid of water.","options":["can't","can"],"a":["can't"],"hint":"Not able → can't."},
              {"type":"choose","q":"___ you speak German?","options":["Can","Are","Does can"],"a":["Can"],"hint":"Question: Can + person + verb."},
              {"type":"gap","q":"Can your brother cook? — No, he ___.","a":["can't","cannot","can not"],"hint":"Can he…? — No, he can't."},
              {"type":"gap","q":"Can you see the sea from your window? — Yes, I ___.","a":["can"],"hint":"Can you…? — Yes, I can."},
              {"type":"fix","q":"Which sentence is correct?","options":["Can she drive a car?","Does she can drive a car?","Can she drives a car?"],"a":["Can she drive a car?"],"hint":"Can + she + drive (no do / does, no -s)."}
            ]
          },
          {
            learn: {"title":"could, couldn't — in the past","rule":"For ability in the past, use could / couldn't + verb as it is: When I was six, I could read. Last year I couldn't swim, but now I can. Question: Could you swim when you were five? Short answers: Yes, I could. / No, I couldn't.","table":[["Now","Past"],["I can swim.","I could swim when I was five."],["She can't drive.","She couldn't drive last year."],["Can you read?","Could you read when you were four?"]],"examples":["I couldn't swim last year, but now I can.","My grandfather could run very fast when he was young.","We couldn't open the door yesterday.","Could you speak English when you were ten?","My sister could read when she was four."],"uz":"O‘tgan zamonda can o‘rniga could ishlatiladi: I could swim when I was five — Besh yoshimda suza olardim."},
            practise: [
              {"type":"choose","q":"When I was four, I ___ read.","options":["could","can"],"a":["could"],"hint":"In the past, use could."},
              {"type":"choose","q":"Last year she ___ ride a bike, but now she can.","options":["couldn't","can't"],"a":["couldn't"],"hint":"Last year = the past → couldn't."},
              {"type":"gap","q":"I ___ open the window yesterday. It was broken. (negative)","a":["couldn't","could not"],"hint":"Past + negative → couldn't (could not)."},
              {"type":"choose","q":"Now I ___ speak English well.","options":["can","could"],"a":["can"],"hint":"Now → can."},
              {"type":"fix","q":"Which sentence is correct?","options":["Could you swim when you were five?","Could you swam when you were five?","Did you could swim when you were five?"],"a":["Could you swim when you were five?"],"hint":"Could + person + verb as it is."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"My cat ___ climb trees.","options":["can","cans","can to"],"a":["can"]},
          {"type":"gap","q":"I can ___ the piano. (play)","a":["play"]},
          {"type":"choose","q":"Fish ___ walk.","options":["can't","can"],"a":["can't"]},
          {"type":"choose","q":"Look! The boys ___ football.","options":["are playing","play","is playing"],"a":["are playing"],"from":"g16"},
          {"type":"gap","q":"Can you ride a horse? — No, I ___.","a":["can't","cannot","can not"]},
          {"type":"choose","q":"___ your dad speak English?","options":["Can","Is","Are"],"a":["Can"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She can sing very well.","She can sings very well.","She cans sing very well."],"a":["She can sing very well."]},
          {"type":"order","q":"Put the words in order.","words":["you","Can","swim"],"a":["Can you swim?"]},
          {"type":"choose","q":"I ___ my homework now.","options":["am doing","do"],"a":["am doing"],"from":"g17"},
          {"type":"gap","q":"When I was five, I ___ ride a bike. (can, past)","a":["could"]},
          {"type":"choose","q":"Last year I ___ swim, but now I can.","options":["couldn't","can't","could"],"a":["couldn't"]},
          {"type":"gap","q":"What languages ___ you speak? (can)","a":["can"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Can he drive a car?","Does he can drive a car?","Can he drives a car?"],"a":["Can he drive a car?"]},
          {"type":"gap","q":"___ you like chocolate? (do / does)","a":["Do"],"from":"g12"},
          {"type":"order","q":"Put the words in order.","words":["can't","My","swim","sister"],"a":["My sister can't swim."]},
          {"type":"choose","q":"Penguins can't ___.","options":["fly","flies","to fly"],"a":["fly"]},
          {"type":"choose","q":"My uncle ___ in a big hotel.","options":["works","work"],"a":["works"],"from":"g11"},
          {"type":"gap","q":"Can you hear me? — Yes, I ___.","a":["can"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I couldn't open the door yesterday.","I can't open the door yesterday.","I couldn't opened the door yesterday."],"a":["I couldn't open the door yesterday."]},
          {"type":"choose","q":"___ you read when you were four?","options":["Could","Can","Were"],"a":["Could"]}
        ]
      },
      {
        id: "g19", no: 19, title: "Can (Permission and Requests)", v: 1,
        chunks: [
          {
            learn: {"title":"Can I…? — asking if it's OK","rule":"Use Can I…? to ask if it is OK to do something (to ask for permission): Can I open the window? Can I use your pen? Answers: Yes, you can. / Yes, of course. / Sure. / Sorry, you can't. / No, you can't.","table":[["Ask","Yes","No"],["Can I open the window?","Yes, of course.","Sorry, you can't. It's cold."],["Can I sit here?","Sure.","No, sorry. It's my friend's seat."],["Can we go home now?","Yes, you can.","No, you can't. The lesson isn't over."]],"examples":["Can I ask a question?","Can I borrow your pen? — Sure, here you are.","Can we watch TV now? — Yes, you can.","Can I go to the toilet, please?","Mum, can I go to Sam's house after school?"],"uz":"Can I…? — ruxsat so‘rash: Can I open the window? — Derazani ochsam maylimi?"},
            practise: [
              {"type":"choose","q":"___ I use your computer, please?","options":["Can","Am","Does"],"a":["Can"],"hint":"To ask for permission: Can I…?"},
              {"type":"choose","q":"Can I sit here? — Yes, of ___.","options":["course","sure","can"],"a":["course"],"hint":"A polite yes: Yes, of course."},
              {"type":"gap","q":"Can I open the window? — Yes, you ___.","a":["can"],"hint":"Can I…? — Yes, you can."},
              {"type":"gap","q":"Can we play outside now? — Sorry, you ___. It's raining.","a":["can't","cannot","can not"],"hint":"Can we…? — Sorry, you can't."},
              {"type":"order","q":"Put the words in order.","words":["I","Can","a","ask","question"],"a":["Can I ask a question?","I can ask a question."],"hint":"Can + I + ask + a question."}
            ]
          },
          {
            learn: {"title":"Can you…? Could you…? — asking for help","rule":"Use Can you…? to ask someone to do something for you: Can you help me? Could you…? is more polite — use it with teachers, older people and people you don't know: Could you open the door, please? Answers: Sure. / Of course. / Yes, no problem. / Sorry, I can't.","table":[["Request","How polite?","Answer"],["Can you help me?","friendly","Sure!"],["Could you help me, please?","more polite","Of course."],["Could you close the window, please?","more polite","Sorry, I can't. I'm busy."]],"examples":["Can you pass the salt, please?","Could you speak more slowly, please?","Can you help me with my homework? — Sure!","Could you tell me the time, please? — It's half past four.","Could you open the door for me? — Of course."],"uz":"Can you…? — iltimos; Could you…, please? — yanada xushmuomala: Could you help me, please? — Menga yordam bera olasizmi?"},
            practise: [
              {"type":"choose","q":"___ you help me, please? — Sure.","options":["Can","Do","Are"],"a":["Can"],"hint":"To ask someone to do something: Can you…?"},
              {"type":"choose","q":"You want to ask your teacher to say it again. Which is the most polite?","options":["Could you repeat that, please?","Repeat that.","You repeat that."],"a":["Could you repeat that, please?"],"hint":"Could you…, please? is the most polite."},
              {"type":"choose","q":"Could you close the door, please? — ___","options":["Of course.","Yes, I could.","Yes, I close."],"a":["Of course."],"hint":"Answer a request with Sure. / Of course. — not Yes, I could."},
              {"type":"gap","q":"___ you tell me the way to the station, please? (could / can — the more polite one)","a":["Could"],"hint":"Could is more polite than Can."},
              {"type":"fix","q":"Which sentence is correct?","options":["Could you open the window, please?","Could you to open the window, please?","Could you opening the window, please?"],"a":["Could you open the window, please?"],"hint":"Could you + verb as it is (no to, no -ing)."}
            ]
          },
          {
            learn: {"title":"Can I…? or Can you…? And May I…?","rule":"Be careful who does it. Can I…? = I want to do it: Can I use your phone? Can you…? = I want you to do it: Can you call me? May I…? means the same as Can I…?, but it is very polite — use it with teachers and in shops: May I come in? Also remember: borrow = take something for a short time (Can I borrow…?), lend = give something for a short time (Can you lend me…?).","table":[["Who does it?","Question"],["I do it (permission)","Can I / May I borrow your book?"],["you do it (request)","Can you / Could you lend me your book?"]],"examples":["May I come in? — Yes, come in.","Can I borrow your book? — Yes, here you are.","Can you lend me your book? — Sure.","May I have a glass of water, please?","Can you call me tonight? — Of course."],"uz":"Can I…? — o‘zim qilsam maylimi? Can you…? — siz qilib bera olasizmi? May I…? — juda xushmuomala."},
            practise: [
              {"type":"choose","q":"You want to use your friend's bike. You say: ___","options":["Can I use your bike?","Can you use your bike?"],"a":["Can I use your bike?"],"hint":"You want to do it → Can I…?"},
              {"type":"choose","q":"You want your friend to carry your bag. You say: ___","options":["Can you carry my bag?","Can I carry my bag?"],"a":["Can you carry my bag?"],"hint":"You want your friend to do it → Can you…?"},
              {"type":"choose","q":"In a shop: ___ have a bag, please?","options":["May I","May you","Do I"],"a":["May I"],"hint":"Very polite permission: May I…?"},
              {"type":"gap","q":"___ I come in? (very polite)","a":["May","Could"],"hint":"Very polite: May I…? (Could I…? is polite too.)"},
              {"type":"fix","q":"Which sentence is correct?","options":["Can I borrow your pencil?","Can I lend your pencil?","Can you borrow your pencil?"],"a":["Can I borrow your pencil?"],"hint":"borrow = take for a short time: Can I borrow…?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"___ I open the window? It's hot.","options":["Can","Do","Am"],"a":["Can"]},
          {"type":"gap","q":"Can I use your pen? — Yes, of ___.","a":["course"]},
          {"type":"choose","q":"___ you pass me the salt, please?","options":["Could","May","Do"],"a":["Could"]},
          {"type":"choose","q":"My little sister ___ read yet. She's only three.","options":["can't","can","couldn't"],"a":["can't"],"from":"g18"},
          {"type":"gap","q":"Can I watch TV now? — No, you ___. Do your homework first.","a":["can't","cannot","can not"]},
          {"type":"choose","q":"In class: ___ I go to the toilet, please?","options":["May","Am","Do"],"a":["May"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Could you help me, please?","Could you helping me, please?","Could you to help me, please?"],"a":["Could you help me, please?"]},
          {"type":"order","q":"Put the words in order.","words":["borrow","Can","your","I","book"],"a":["Can I borrow your book?","I can borrow your book."]},
          {"type":"gap","q":"___ run in the classroom! (negative)","a":["Don't","Do not"],"from":"g15"},
          {"type":"choose","q":"You want your friend to close the door. You say: ___","options":["Can you close the door?","Can I close the door?"],"a":["Can you close the door?"]},
          {"type":"gap","q":"___ you help me with my homework? — Sure. (can)","a":["Can","Could"]},
          {"type":"choose","q":"Can I sit here? — ___ The seat is free.","options":["Sure.","Yes, I can.","No, you can't."],"a":["Sure."]},
          {"type":"gap","q":"Shh! The baby ___ now. (sleep)","a":["is sleeping","'s sleeping"],"from":"g16"},
          {"type":"fix","q":"Which sentence is correct?","options":["May I have some water, please?","May I to have some water, please?","May I having some water, please?"],"a":["May I have some water, please?"]},
          {"type":"order","q":"Put the words in order.","words":["you","Could","the","open","door"],"a":["Could you open the door?"]},
          {"type":"choose","q":"Can you lend me your bike? means: ___","options":["Please give me your bike for a short time.","I want to give you my bike."],"a":["Please give me your bike for a short time."]},
          {"type":"choose","q":"Can you help ___? I can't open this box.","options":["me","my","I"],"a":["me"],"from":"g14"},
          {"type":"gap","q":"Can we go out to play? — Yes, you ___.","a":["can"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Can I borrow your ruler?","Can I lend your ruler?","Can I borrowing your ruler?"],"a":["Can I borrow your ruler?"]},
          {"type":"order","q":"Put the words in order.","words":["I","May","in","come"],"a":["May I come in?","I may come in."]}
        ]
      },
      {
        id: "g20", no: 20, title: "Like, Love, Hate + Gerund", v: 1,
        chunks: [
          {
            learn: {"title":"I like swimming","rule":"After like, love, enjoy, don't like and hate, use verb + -ing: I like swimming. She loves dancing. We hate getting up early. The -ing spelling is the same as in the present continuous: dance → dancing, swim → swimming. After like, love and hate you can also use to + verb (I like to swim) — both are right. After enjoy, only -ing: I enjoy reading.","table":[["Verb","+ verb-ing","Example"],["love","reading","I love reading."],["like","cooking","She likes cooking."],["enjoy","playing","We enjoy playing chess."],["don't like","waiting","I don't like waiting."],["hate","washing","He hates washing the dishes."]],"examples":["I love reading comics.","My dad likes cooking on Sundays.","We enjoy playing chess together.","Anna doesn't like flying.","Tom hates getting up early.","Do you like dancing?"],"uz":"like, love, enjoy, hate dan keyin fe’l -ing bilan keladi: I like swimming — Men suzishni yaxshi ko‘raman."},
            practise: [
              {"type":"choose","q":"I love ___ books.","options":["reading","read","reads"],"a":["reading"],"hint":"love + verb-ing: reading."},
              {"type":"choose","q":"She enjoys ___ to music.","options":["listening","listen","to listen"],"a":["listening"],"hint":"After enjoy, only verb-ing: listening."},
              {"type":"gap","q":"We like ___ in the sea. (swim)","a":["swimming","to swim"],"hint":"like + verb-ing: swim → swimming (double the m)."},
              {"type":"gap","q":"Tom hates ___ the dishes. (wash)","a":["washing","to wash"],"hint":"hate + verb-ing: washing."},
              {"type":"fix","q":"Which sentence is correct?","options":["He likes playing football.","He likes play football.","He like playing football."],"a":["He likes playing football."],"hint":"He likes (with -s) + playing."}
            ]
          },
          {
            learn: {"title":"Do you like…? I don't like…","rule":"Negatives and questions are made like the present simple, with do / does: I don't like running. She doesn't enjoy cooking. Do you like dancing? Does he love singing? The -ing verb stays the same.","table":[["","Example"],["Negative","I don't like cooking. / He doesn't like shopping."],["Question","Do you like dancing? / Does she enjoy swimming?"],["Short answer","Yes, I do. / No, she doesn't."],["Question word","What do you like doing?"]],"examples":["I don't like getting up early.","My brother doesn't enjoy doing homework.","Do you like drawing? — Yes, I do.","Does your mum like driving? — No, she doesn't.","What do you like doing at the weekend?"],"uz":"Inkor va so‘roq Present Simple kabi: Do you like dancing? — Raqs tushishni yoqtirasizmi?"},
            practise: [
              {"type":"choose","q":"She ___ like cooking.","options":["doesn't","don't","isn't"],"a":["doesn't"],"hint":"With she, use doesn't + like."},
              {"type":"choose","q":"___ you enjoy playing tennis?","options":["Do","Are","Does"],"a":["Do"],"hint":"With you, start with Do."},
              {"type":"gap","q":"Does Sam like drawing? — No, he ___.","a":["doesn't","does not"],"hint":"Does he…? — No, he doesn't."},
              {"type":"order","q":"Put the words in order.","words":["like","Do","dancing","you"],"a":["Do you like dancing?"],"hint":"Do + you + like + dancing."},
              {"type":"fix","q":"Which sentence is correct?","options":["What do you like doing?","What do you like do?","What are you like doing?"],"a":["What do you like doing?"],"hint":"What + do + you + like + verb-ing."}
            ]
          },
          {
            learn: {"title":"Swimming is fun. Good at drawing.","rule":"A verb + -ing can be the subject of a sentence, like a noun: Swimming is good for you. Reading is my hobby. After good at, bad at and interested in, use verb + -ing too: She is good at drawing. I'm bad at singing. He's interested in cooking.","table":[["Pattern","Example"],["verb-ing as the subject","Running is fun."],["good at + verb-ing","She's good at drawing."],["bad at + verb-ing","I'm bad at singing."],["interested in + verb-ing","He's interested in cooking."]],"examples":["Swimming is good for your health.","Reading is my favourite hobby.","My sister is good at drawing.","I'm bad at remembering names.","Tom is interested in taking photos."],"uz":"Fe’l + -ing ega bo‘la oladi: Swimming is fun — Suzish qiziqarli. good at dan keyin ham -ing: good at drawing."},
            practise: [
              {"type":"choose","q":"___ is good for you.","options":["Swimming","Swim","Swims"],"a":["Swimming"],"hint":"The subject is an -ing word: Swimming."},
              {"type":"choose","q":"She is good at ___.","options":["drawing","draw","draws"],"a":["drawing"],"hint":"good at + verb-ing."},
              {"type":"gap","q":"I'm bad at ___. (sing)","a":["singing"],"hint":"bad at + verb-ing: singing."},
              {"type":"gap","q":"He is interested in ___ photos. (take)","a":["taking"],"hint":"interested in + verb-ing: take → taking."},
              {"type":"fix","q":"Which sentence is correct?","options":["Reading is my hobby.","Read is my hobby.","Reads is my hobby."],"a":["Reading is my hobby."],"hint":"The subject is an -ing word: Reading."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I love ___ to music.","options":["listening","listen","listens"],"a":["listening"]},
          {"type":"gap","q":"My brother enjoys ___ football. (play)","a":["playing"]},
          {"type":"choose","q":"She hates ___ up early.","options":["getting","get","gets"],"a":["getting"]},
          {"type":"choose","q":"___ I borrow your pen, please?","options":["Can","Do","Am"],"a":["Can"],"from":"g19"},
          {"type":"gap","q":"We like ___ in the lake. (swim)","a":["swimming","to swim"]},
          {"type":"choose","q":"___ you like cooking?","options":["Do","Are","Does"],"a":["Do"]},
          {"type":"gap","q":"Does your sister like dancing? — Yes, she ___.","a":["does"]},
          {"type":"fix","q":"Which sentence is correct?","options":["My dad doesn't like driving.","My dad doesn't likes driving.","My dad don't like driving."],"a":["My dad doesn't like driving."]},
          {"type":"gap","q":"Can you swim? — No, I ___.","a":["can't","cannot","can not"],"from":"g18"},
          {"type":"choose","q":"___ is my favourite sport.","options":["Running","Run","Runs"],"a":["Running"]},
          {"type":"gap","q":"He is good at ___ pictures. (draw)","a":["drawing"]},
          {"type":"order","q":"Put the words in order.","words":["enjoy","I","books","reading"],"a":["I enjoy reading books."]},
          {"type":"choose","q":"Look! Tom ___ his bike.","options":["is riding","rides"],"a":["is riding"],"from":"g17"},
          {"type":"fix","q":"Which sentence is correct?","options":["She is bad at cooking.","She is bad at cook.","She is bad in cooking."],"a":["She is bad at cooking."]},
          {"type":"choose","q":"Anna doesn't enjoy ___.","options":["shopping","shop","to shop"],"a":["shopping"]},
          {"type":"order","q":"Put the words in order.","words":["like","doing","What","you","do"],"a":["What do you like doing?"]},
          {"type":"choose","q":"Where ___ your parents live?","options":["do","does"],"a":["do"],"from":"g12"},
          {"type":"gap","q":"My brother is interested in ___ old cars. (collect)","a":["collecting"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Do you like watching cartoons?","Do you like watch cartoons?","Are you like watching cartoons?"],"a":["Do you like watching cartoons?"]},
          {"type":"gap","q":"Tom loves ___ cakes. (make)","a":["making","to make"]}
        ]
      },
      {
        id: "g21", no: 21, title: "Infinitive with To", v: 1,
        chunks: [
          {
            learn: {"title":"I want to go","rule":"After want, need, would like, hope and learn, use to + verb: I want to go home. She needs to study. We would like to visit Rome. The verb after to stays as it is — no -s, no -ing: He wants to play (not to plays, not to playing).","table":[["Verb","+ to + verb","Example"],["want","to eat","I want to eat pizza."],["need","to study","She needs to study."],["would like","to visit","We would like to visit London."],["hope","to see","I hope to see you soon."],["learn","to swim","He is learning to swim."]],"examples":["I want to be a doctor.","She needs to buy some bread.","We would like to visit Paris.","My brother is learning to drive.","I hope to see you soon.","Tom wants to play, but he needs to finish his homework first."],"uz":"want, need, would like, hope, learn dan keyin to + fe’l keladi: I want to go home — Men uyga ketmoqchiman."},
            practise: [
              {"type":"choose","q":"I want ___ a new bike.","options":["to buy","buy","buying"],"a":["to buy"],"hint":"want + to + verb: to buy."},
              {"type":"choose","q":"She needs ___ her homework.","options":["to do","do","to does"],"a":["to do"],"hint":"need + to + verb as it is: to do."},
              {"type":"gap","q":"We would like ___ the museum. (visit)","a":["to visit"],"hint":"would like + to + verb: to visit."},
              {"type":"gap","q":"He is learning ___ the guitar. (play)","a":["to play"],"hint":"learn + to + verb: to play."},
              {"type":"fix","q":"Which sentence is correct?","options":["Anna wants to be a teacher.","Anna wants be a teacher.","Anna wants to is a teacher."],"a":["Anna wants to be a teacher."],"hint":"want + to + verb as it is: to be."}
            ]
          },
          {
            learn: {"title":"don't want to, Would you like to…?","rule":"Negative: don't / doesn't + want / need + to + verb: I don't want to go. He doesn't need to wear a uniform. Question: Do you want to…? Does she need to…? Would you like to…? is a polite invitation: Would you like to come to my party? — Yes, I'd love to. / Sorry, I can't.","table":[["","Example"],["Negative","I don't want to sleep. / She doesn't need to come."],["Question","Do you want to play? / Does he need to leave?"],["Invitation","Would you like to come? — Yes, I'd love to."]],"examples":["I don't want to watch this film.","You don't need to bring anything.","Do you want to play chess? — Yes, sure.","Does Tom need to get up early tomorrow?","Would you like to come to the cinema with us? — Yes, I'd love to."],"uz":"Would you like to…? — xushmuomala taklif: Would you like to come? — Kelishni xohlaysizmi?"},
            practise: [
              {"type":"choose","q":"I ___ want to go to bed.","options":["don't","doesn't","not"],"a":["don't"],"hint":"With I, use don't + want to."},
              {"type":"choose","q":"___ you like to come to my party?","options":["Would","Are","Does"],"a":["Would"],"hint":"A polite invitation: Would you like to…?"},
              {"type":"gap","q":"Does she need ___ a dress for the party? (buy)","a":["to buy"],"hint":"need + to + verb: to buy."},
              {"type":"gap","q":"Would you like to come with us? — Yes, I'd love ___.","a":["to"],"hint":"The short answer: Yes, I'd love to."},
              {"type":"order","q":"Put the words in order.","words":["want","Do","to","play","you"],"a":["Do you want to play?"],"hint":"Do + you + want + to + play."}
            ]
          },
          {
            learn: {"title":"Why? — to + verb","rule":"Use to + verb to say why someone does something (the reason): I go to the gym to get fit. She is saving money to buy a bike. Don't use for + verb for a reason: I go to the gym to get fit (not for get fit).","table":[["Action","Why? (to + verb)"],["I go to the gym","to get fit."],["She is saving money","to buy a bike."],["We use a dictionary","to check new words."],["He's going to the shop","to buy bread."]],"examples":["I go to the library to study.","She is saving money to buy a bike.","We use the internet to find information.","My dad gets up at six to catch the bus.","I'm learning English to get a good job."],"uz":"Sababni aytish uchun to + fe’l: I go to the gym to get fit — Sog‘lom bo‘lish uchun sport zaliga boraman."},
            practise: [
              {"type":"choose","q":"I go to the shop ___ bread.","options":["to buy","for buy","for buying"],"a":["to buy"],"hint":"Why? → to + verb: to buy."},
              {"type":"choose","q":"She studies hard ___ the exam.","options":["to pass","for pass","passing"],"a":["to pass"],"hint":"Why? → to + verb: to pass."},
              {"type":"gap","q":"My dad gets up early ___ the bus. (catch)","a":["to catch"],"hint":"Why? → to + verb: to catch."},
              {"type":"gap","q":"We use a dictionary ___ new words. (check)","a":["to check"],"hint":"Why? → to + verb: to check."},
              {"type":"fix","q":"Which sentence is correct?","options":["I'm learning English to get a good job.","I'm learning English for get a good job.","I'm learning English to getting a good job."],"a":["I'm learning English to get a good job."],"hint":"Why? → to + verb as it is: to get."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I want ___ a doctor.","options":["to be","be","being"],"a":["to be"]},
          {"type":"gap","q":"She needs ___ more water. (drink)","a":["to drink"]},
          {"type":"choose","q":"We would like ___ Rome.","options":["to visit","visit","visiting"],"a":["to visit"]},
          {"type":"choose","q":"My sister enjoys ___.","options":["dancing","to dance","dance"],"a":["dancing"],"from":"g20"},
          {"type":"gap","q":"I don't ___ to go out tonight. I'm tired. (want)","a":["want"]},
          {"type":"choose","q":"___ you like a cup of tea?","options":["Would","Are","Does"],"a":["Would"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He wants to play outside.","He wants play outside.","He wants to plays outside."],"a":["He wants to play outside."]},
          {"type":"order","q":"Put the words in order.","words":["to","I","learn","want","Spanish"],"a":["I want to learn Spanish."]},
          {"type":"choose","q":"My grandma can ___ very well.","options":["cook","cooks","to cook"],"a":["cook"],"from":"g18"},
          {"type":"gap","q":"I go to the park ___ football. (play)","a":["to play"]},
          {"type":"choose","q":"Does Tom need ___ early tomorrow?","options":["to get up","get up","getting up"],"a":["to get up"]},
          {"type":"gap","q":"Would you like to come to the cinema? — Yes, I'd love ___.","a":["to"]},
          {"type":"gap","q":"We ___ for the bus right now. (wait)","a":["are waiting","'re waiting"],"from":"g16"},
          {"type":"fix","q":"Which sentence is correct?","options":["She is saving money to buy a car.","She is saving money for buy a car.","She is saving money to buying a car."],"a":["She is saving money to buy a car."]},
          {"type":"order","q":"Put the words in order.","words":["to","you","Do","want","dance"],"a":["Do you want to dance?"]},
          {"type":"choose","q":"He is learning ___ a car.","options":["to drive","drive","drives"],"a":["to drive"]},
          {"type":"choose","q":"This is my bag. It's ___.","options":["mine","my","me"],"a":["mine"],"from":"g14"},
          {"type":"gap","q":"You don't ___ to bring food. We have a lot. (need)","a":["need"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I hope to see you soon.","I hope see you soon.","I hope seeing you soon."],"a":["I hope to see you soon."]},
          {"type":"choose","q":"I'm going to the library ___.","options":["to study","for study","studying"],"a":["to study"]}
        ]
      },
      {
        id: "g22", no: 22, title: "Prepositions of Time (In, On, At)", v: 1,
        chunks: [
          {
            learn: {"title":"at seven o'clock, at night","rule":"Use at with clock times: at 7 o'clock, at half past three, at 6:30. Also with meal times and some special times: at breakfast, at lunchtime, at night, at noon, at midnight.","table":[["at","Examples"],["clock times","at 8 o'clock, at half past six, at 7:15"],["meal times","at breakfast, at lunchtime, at dinner"],["special times","at night, at noon, at midnight"]],"examples":["The lesson starts at nine o'clock.","I go to bed at ten.","We have a break at half past eleven.","Owls hunt at night.","Let's meet at lunchtime.","The shop closes at 8:30."],"uz":"Soat va night bilan at: at seven o'clock — soat yettida, at night — kechasi."},
            practise: [
              {"type":"choose","q":"School starts ___ eight o'clock.","options":["at","on","in"],"a":["at"],"hint":"Clock time → at."},
              {"type":"choose","q":"I sleep ___ night.","options":["at","in","on"],"a":["at"],"hint":"We say at night."},
              {"type":"gap","q":"The film starts ___ half past seven. (in / on / at)","a":["at"],"hint":"Clock time → at."},
              {"type":"gap","q":"We have lunch ___ one o'clock. (in / on / at)","a":["at"],"hint":"Clock time → at."},
              {"type":"fix","q":"Which sentence is correct?","options":["The bus leaves at 6:15.","The bus leaves on 6:15.","The bus leaves in 6:15."],"a":["The bus leaves at 6:15."],"hint":"Clock time → at."}
            ]
          },
          {
            learn: {"title":"on Monday, on 5 May","rule":"Use on with days and dates: on Monday, on Fridays, on 5 May, on my birthday, on New Year's Day. Also with a day + part of the day: on Monday morning, on Saturday night.","table":[["on","Examples"],["days","on Monday, on Sundays"],["dates","on 5 May, on 21 June"],["special days","on my birthday, on New Year's Day"],["day + part of the day","on Friday evening, on Sunday morning"]],"examples":["I play football on Saturdays.","My birthday is on 14 March.","We don't go to school on Sunday.","See you on Monday!","What do you do on Friday evenings?"],"uz":"Hafta kunlari va sanalar bilan on: on Monday — dushanba kuni, on 5 May — 5-mayda."},
            practise: [
              {"type":"choose","q":"I have English ___ Tuesday.","options":["on","in","at"],"a":["on"],"hint":"Day → on."},
              {"type":"choose","q":"My birthday is ___ 3 April.","options":["on","in","at"],"a":["on"],"hint":"Date → on."},
              {"type":"gap","q":"We go swimming ___ Sundays. (in / on / at)","a":["on"],"hint":"Days → on."},
              {"type":"gap","q":"Let's meet ___ Friday evening. (in / on / at)","a":["on"],"hint":"Day + part of the day → on."},
              {"type":"fix","q":"Which sentence is correct?","options":["See you on Monday morning!","See you in Monday morning!","See you at Monday morning!"],"a":["See you on Monday morning!"],"hint":"Day + part of the day → on."}
            ]
          },
          {
            learn: {"title":"in May, in 2020, in the morning","rule":"Use in with longer times: months (in May), years (in 2026), seasons (in summer) and parts of the day (in the morning, in the afternoon, in the evening — but at night). Don't use in, on or at before every, next, last, this, today, tomorrow and yesterday: See you tomorrow (not on tomorrow). I go there every Friday.","table":[["Preposition","Use it with","Examples"],["in","months, years, seasons","in July, in 2010, in winter"],["in","parts of the day","in the morning, in the evening"],["at","clock times, night","at 5 o'clock, at night"],["on","days and dates","on Monday, on 1 May"],["no preposition","every, next, last, this, tomorrow","every day, next week, tomorrow"]],"examples":["It's very hot here in summer.","My sister was born in 2015.","I do my homework in the evening.","We have a test next Monday.","I go to the gym every day."],"uz":"Oy, yil, fasl va kun qismlari bilan in: in May, in the morning. every, next, tomorrow dan oldin predlog qo‘yilmaydi."},
            practise: [
              {"type":"choose","q":"It often snows ___ January.","options":["in","on","at"],"a":["in"],"hint":"Month → in."},
              {"type":"choose","q":"I get up early ___ the morning.","options":["in","on","at"],"a":["in"],"hint":"Part of the day → in the morning."},
              {"type":"gap","q":"Many people go to the beach ___ summer. (in / on / at)","a":["in"],"hint":"Season → in."},
              {"type":"choose","q":"We have a test ___.","options":["next Friday","on next Friday","in next Friday"],"a":["next Friday"],"hint":"No preposition before next."},
              {"type":"fix","q":"Which sentence is correct?","options":["I study in the evening and sleep at night.","I study at the evening and sleep at night.","I study on the evening and sleep at night."],"a":["I study in the evening and sleep at night."],"hint":"in the evening, but at night."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"The train leaves ___ 10:45.","options":["at","on","in"],"a":["at"]},
          {"type":"choose","q":"We don't have school ___ Sunday.","options":["on","in","at"],"a":["on"]},
          {"type":"gap","q":"My grandparents visit us ___ winter. (in / on / at)","a":["in"]},
          {"type":"choose","q":"I need ___ some milk.","options":["to buy","buy","buying"],"a":["to buy"],"from":"g21"},
          {"type":"gap","q":"I always feel tired ___ the afternoon. (in / on / at)","a":["in"]},
          {"type":"choose","q":"My birthday is ___ 2 July.","options":["on","in","at"],"a":["on"]},
          {"type":"choose","q":"I usually go to bed ___ midnight.","options":["at","in","on"],"a":["at"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The concert is on Saturday evening.","The concert is in Saturday evening.","The concert is at Saturday evening."],"a":["The concert is on Saturday evening."]},
          {"type":"gap","q":"Do you enjoy ___ in the rain? (walk)","a":["walking"],"from":"g20"},
          {"type":"choose","q":"Shakespeare was born ___ 1564.","options":["in","on","at"],"a":["in"]},
          {"type":"choose","q":"See you ___!","options":["tomorrow","on tomorrow","at tomorrow"],"a":["tomorrow"]},
          {"type":"gap","q":"We have dinner ___ seven o'clock. (in / on / at)","a":["at"]},
          {"type":"order","q":"Put the words in order.","words":["at","I","up","get","six"],"a":["I get up at six.","At six I get up."]},
          {"type":"choose","q":"My mum ___ dinner now.","options":["is cooking","cooks"],"a":["is cooking"],"from":"g17"},
          {"type":"fix","q":"Which sentence is correct?","options":["I go swimming every Friday.","I go swimming on every Friday.","I go swimming at every Friday."],"a":["I go swimming every Friday."]},
          {"type":"gap","q":"The shops are closed ___ New Year's Day. (in / on / at)","a":["on"]},
          {"type":"order","q":"Put the words in order.","words":["in","born","was","She","May"],"a":["She was born in May."]},
          {"type":"choose","q":"The cat is sleeping ___ the bed. (below it)","options":["under","on","in"],"a":["under"],"from":"g10"},
          {"type":"choose","q":"I do my homework ___ the evening.","options":["in","on","at"],"a":["in"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We have a holiday in August.","We have a holiday on August.","We have a holiday at August."],"a":["We have a holiday in August."]}
        ]
      },
      {
        id: "g23", no: 23, title: "Possessive 's and Whose", v: 1,
        chunks: [
          {
            learn: {"title":"Tom's bike","rule":"Use a name or a noun + 's to say who something belongs to: Tom's bike = the bike of Tom. my sister's room, the teacher's desk, the cat's food. The thing comes after 's: Anna's bag (not the bag Anna's).","table":[["Person","+ 's","Example"],["Tom","Tom's","Tom's bike"],["my mum","my mum's","my mum's car"],["the teacher","the teacher's","the teacher's desk"],["James","James's","James's hat"]],"examples":["This is Sam's bag.","My brother's name is Ben.","The dog's bed is in the kitchen.","Is that your dad's car?","I'm at my grandmother's house."],"uz":"Egalik 's bilan bildiriladi: Tom's bike — Tomning velosipedi."},
            practise: [
              {"type":"choose","q":"This is ___.","options":["Anna's book","the book Anna's","Anna book"],"a":["Anna's book"],"hint":"Person + 's + thing: Anna's book."},
              {"type":"choose","q":"___ car is red.","options":["My dad's","My dads","My dad"],"a":["My dad's"],"hint":"Person + 's: my dad's car."},
              {"type":"gap","q":"My sister has a cat. It's my ___ cat.","a":["sister's"],"hint":"The cat belongs to my sister: my sister's cat."},
              {"type":"gap","q":"The bike belongs to my brother. It's my ___ bike.","a":["brother's"],"hint":"The bike belongs to my brother: my brother's bike."},
              {"type":"fix","q":"Which sentence is correct?","options":["Is this Mark's pen?","Is this Marks pen?","Is this pen Mark?"],"a":["Is this Mark's pen?"],"hint":"Person + 's + thing: Mark's pen."}
            ]
          },
          {
            learn: {"title":"my parents' house, the children's toys","rule":"Plural nouns that end in -s add only an apostrophe ('): my parents' house, the girls' room, the students' books. Plurals that don't end in -s add 's: the children's toys, the men's shoes, people's names. Be careful: 's can also mean is: Tom's tall = Tom is tall.","table":[["Noun","Possessive","Example"],["one boy","boy's","the boy's ball (one boy)"],["two boys","boys'","the boys' ball (two or more boys)"],["children","children's","the children's toys"],["people","people's","people's names"]],"examples":["My parents' house is near the park.","The students' books are on the desk.","The children's toys are everywhere.","The boys' bedroom is upstairs.","Tom's tall (= Tom is tall), and Tom's sister (= the sister of Tom) is tall too."],"uz":"-s bilan tugagan ko‘plikka faqat ' qo‘shiladi: my parents' house — ota-onamning uyi; children's toys — bolalarning o‘yinchoqlari."},
            practise: [
              {"type":"choose","q":"My ___ car is new. (I have one brother.)","options":["brother's","brothers'"],"a":["brother's"],"hint":"One brother → brother's."},
              {"type":"choose","q":"The ___ room is big. (two girls)","options":["girls'","girl's","girls's"],"a":["girls'"],"hint":"Plural with -s → add only ': girls'."},
              {"type":"choose","q":"The ___ toys are in the box.","options":["children's","childrens'","childs'"],"a":["children's"],"hint":"children has no -s → add 's: children's."},
              {"type":"gap","q":"This is the house of my parents. It's my ___ house.","a":["parents'"],"hint":"parents ends in -s → add only ': parents'."},
              {"type":"choose","q":"Tom's tired. Here 's means ___.","options":["is","of Tom"],"a":["is"],"hint":"Tom's tired = Tom is tired."}
            ]
          },
          {
            learn: {"title":"Whose…?","rule":"Ask Whose…? to find out who something belongs to: Whose bag is this? — It's Anna's. Whose shoes are these? — They're my brother's. You can answer with 's or with mine, yours, his, hers, ours, theirs. Don't mix up whose and who's: who's = who is.","table":[["Question","Answer"],["Whose pen is this?","It's Tom's. / It's mine."],["Whose shoes are these?","They're my sister's. / They're hers."],["Whose is this coat?","It's my dad's. / It's his."]],"examples":["Whose phone is this? — It's Sam's.","Whose keys are these? — They're mine.","Whose is that red car? — It's my aunt's.","Who's that boy? — He's my cousin. (Who's = Who is)","Whose dog is that?"],"uz":"Whose…? — Kimning…? Whose bag is this? — Bu kimning sumkasi? Who's = Who is."},
            practise: [
              {"type":"choose","q":"___ pen is this? — It's mine.","options":["Whose","Who's","Who"],"a":["Whose"],"hint":"To ask who it belongs to: Whose…?"},
              {"type":"choose","q":"___ that girl? — She's my sister.","options":["Who's","Whose","Who"],"a":["Who's"],"hint":"Who's = Who is: Who is that girl?"},
              {"type":"gap","q":"___ shoes are these? — They're Tom's. (Who's / Whose)","a":["Whose"],"hint":"To ask who they belong to: Whose…?"},
              {"type":"choose","q":"Whose bag is this? — It's ___.","options":["Anna's","Anna","to Anna"],"a":["Anna's"],"hint":"Answer with 's: It's Anna's."},
              {"type":"order","q":"Put the words in order.","words":["is","Whose","this","coat"],"a":["Whose coat is this?","Whose is this coat?"],"hint":"Whose coat is this? (or Whose is this coat?)"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"This is ___.","options":["my sister's room","my sister room","the room my sister's"],"a":["my sister's room"]},
          {"type":"gap","q":"This car belongs to my uncle. It's my ___ car.","a":["uncle's"]},
          {"type":"choose","q":"___ bag is this? — It's Lucy's.","options":["Whose","Who's","Who"],"a":["Whose"]},
          {"type":"choose","q":"My lesson is ___ Monday.","options":["on","in","at"],"a":["on"],"from":"g22"},
          {"type":"choose","q":"The ___ classroom is on the first floor. (a lot of students)","options":["students'","student's","students's"],"a":["students'"]},
          {"type":"gap","q":"The toys belong to the children. They're the ___ toys.","a":["children's"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Is that your dad's car?","Is that your dads car?","Is that your car dad's?"],"a":["Is that your dad's car?"]},
          {"type":"order","q":"Put the words in order.","words":["is","Whose","this","umbrella"],"a":["Whose umbrella is this?","Whose is this umbrella?"]},
          {"type":"choose","q":"Whose book is this? — It's ___.","options":["mine","my","me"],"a":["mine"],"from":"g14"},
          {"type":"gap","q":"___ that man? — He's our new teacher.","a":["Who's","Who is"]},
          {"type":"choose","q":"This is my ___ house. They live in the village.","options":["grandparents'","grandparent's","grandparents's"],"a":["grandparents'"]},
          {"type":"gap","q":"I want ___ a new phone. (buy)","a":["to buy"],"from":"g21"},
          {"type":"fix","q":"Which sentence is correct?","options":["The men's shoes are black.","The mens' shoes are black.","The mans' shoes are black."],"a":["The men's shoes are black."]},
          {"type":"choose","q":"Whose shoes are these? — They're ___.","options":["my brother's","my brother","to my brother"],"a":["my brother's"]},
          {"type":"order","q":"Put the words in order.","words":["bedroom","My","is","sister's","small"],"a":["My sister's bedroom is small."]},
          {"type":"gap","q":"These are the books of the students. They're the ___ books.","a":["students'"]},
          {"type":"choose","q":"___ is that dog? — It's my neighbour's.","options":["Whose","Who's","Who"],"a":["Whose"]},
          {"type":"choose","q":"Tom's hungry. Here 's means ___.","options":["is","of Tom"],"a":["is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Whose keys are these?","Who's keys are these?","Whose are keys these?"],"a":["Whose keys are these?"]},
          {"type":"choose","q":"There are three ___ in the garden.","options":["children","childs","childrens"],"a":["children"],"from":"g3"}
        ]
      },
      {
        id: "g24", no: 24, title: "Much, Many, A Lot Of", v: 1,
        chunks: [
          {
            learn: {"title":"many books, much water","rule":"Use many with plural countable nouns (things you can count: books, friends, apples). Use much with uncountable nouns (things you can't count: water, money, time, milk). We use much and many mostly in questions and negatives: How many friends have you got? I haven't got much time.","table":[["","Countable (books)","Uncountable (water)"],["Question","How many books?","How much water?"],["Negative","not many books","not much water"]],"examples":["How many brothers have you got?","I don't have many friends here.","How much water do you drink?","We haven't got much time.","There aren't many people in the park.","Is there much milk in the fridge?"],"uz":"many — sanaladigan otlar bilan (many books), much — sanalmaydigan otlar bilan (much water)."},
            practise: [
              {"type":"choose","q":"How ___ apples do you want?","options":["many","much"],"a":["many"],"hint":"apples can be counted → many."},
              {"type":"choose","q":"I haven't got ___ money.","options":["much","many"],"a":["much"],"hint":"money can't be counted → much."},
              {"type":"gap","q":"There aren't ___ students in the class today. (much / many)","a":["many"],"hint":"students can be counted → many."},
              {"type":"gap","q":"How ___ sugar do you take in your tea? (much / many)","a":["much"],"hint":"sugar can't be counted → much."},
              {"type":"fix","q":"Which sentence is correct?","options":["How many sisters have you got?","How much sisters have you got?","How many sister have you got?"],"a":["How many sisters have you got?"],"hint":"sisters can be counted → How many + plural."}
            ]
          },
          {
            learn: {"title":"a lot of, lots of","rule":"Use a lot of (or lots of) with both countable and uncountable nouns: a lot of books, a lot of water. In positive sentences, a lot of is more natural than much or many: I have a lot of homework (not I have much homework). You can use a lot of in questions and negatives too.","table":[["","Countable (books)","Uncountable (water)"],["Positive","a lot of books","a lot of water"],["Negative","not many books / not a lot of books","not much water / not a lot of water"],["Question","How many books?","How much water?"]],"examples":["I have a lot of homework today.","There are lots of shops in this street.","She drinks a lot of water.","We don't have a lot of time.","My grandma has a lot of photos."],"uz":"a lot of — ko‘p; ikkala turdagi otlar bilan ishlatiladi: a lot of books, a lot of water."},
            practise: [
              {"type":"choose","q":"There are ___ people at the party.","options":["a lot of","much","a lot"],"a":["a lot of"],"hint":"Positive + countable or uncountable → a lot of."},
              {"type":"choose","q":"I drink ___ milk every day.","options":["a lot of","many","a lot"],"a":["a lot of"],"hint":"Positive sentence → a lot of milk."},
              {"type":"choose","q":"She has a lot ___ friends.","options":["of","the","from"],"a":["of"],"hint":"Don't forget of: a lot of friends."},
              {"type":"gap","q":"There are ___ trees in the park. (a lot of / much)","a":["a lot of","lots of","many"],"hint":"Positive sentence, trees can be counted → a lot of trees."},
              {"type":"fix","q":"Which sentence is correct?","options":["I have a lot of books.","I have a lot books.","I have much books."],"a":["I have a lot of books."],"hint":"Don't forget of: a lot of books."}
            ]
          },
          {
            learn: {"title":"How much? How many? A lot.","rule":"How many + plural noun asks about a number: How many pens have you got? How much + uncountable noun asks about an amount: How much juice is there? How much is it? / How much are they? asks about a price. At the end of a sentence, with no noun after it, say a lot (not a lot of): I like it a lot. He reads a lot.","table":[["Question","Answer"],["How many eggs do we need?","Six. / Not many."],["How much flour do we need?","500 grams. / Not much."],["How much is this T-shirt?","It's 10 dollars."],["Do you read a lot?","Yes, I read a lot."]],"examples":["How many eggs do we need? — Six.","How much flour do we need? — Not much.","How much is this T-shirt? — It's 10 dollars.","How much are these shoes?","My brother reads a lot."],"uz":"How many…? — Nechta? How much…? — Qancha? How much is it? — Bu necha pul?"},
            practise: [
              {"type":"choose","q":"How ___ is this bag? — It's 20 dollars.","options":["much","many"],"a":["much"],"hint":"A price → How much is it?"},
              {"type":"choose","q":"How ___ eggs do we need?","options":["many","much"],"a":["many"],"hint":"eggs can be counted → How many."},
              {"type":"choose","q":"My brother eats ___.","options":["a lot","a lot of","many"],"a":["a lot"],"hint":"At the end, with no noun after it → a lot."},
              {"type":"gap","q":"How ___ cheese is there in the fridge? (much / many)","a":["much"],"hint":"cheese can't be counted → How much."},
              {"type":"order","q":"Put the words in order.","words":["many","How","you","have","cousins","got"],"a":["How many cousins have you got?"],"hint":"How many + cousins + have + you + got?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"How ___ books have you got?","options":["many","much"],"a":["many"]},
          {"type":"choose","q":"There isn't ___ juice in the bottle.","options":["much","many"],"a":["much"]},
          {"type":"gap","q":"I don't have ___ friends in this town. (much / many)","a":["many"]},
          {"type":"choose","q":"Which word is uncountable?","options":["money","coin","bag"],"a":["money"],"from":"g8"},
          {"type":"choose","q":"She has ___ toys.","options":["a lot of","much","a lot"],"a":["a lot of"]},
          {"type":"gap","q":"How ___ milk do you drink a day? (much / many)","a":["much"]},
          {"type":"gap","q":"There are ___ cars in the street. (a lot of / much)","a":["a lot of","lots of","many"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We don't have much time.","We don't have many time.","We don't have much times."],"a":["We don't have much time."]},
          {"type":"choose","q":"This is my ___ room.","options":["brother's","brothers","brother"],"a":["brother's"],"from":"g23"},
          {"type":"choose","q":"How ___ is that jacket? — It's 50 dollars.","options":["much","many"],"a":["much"]},
          {"type":"order","q":"Put the words in order.","words":["a","I","coffee","lot","drink","of"],"a":["I drink a lot of coffee."]},
          {"type":"gap","q":"How ___ people are there in your family? (much / many)","a":["many"]},
          {"type":"gap","q":"There aren't ___ eggs in the fridge. (some / any)","a":["any"],"from":"g9"},
          {"type":"fix","q":"Which sentence is correct?","options":["My dad works a lot.","My dad works a lot of.","My dad works much of."],"a":["My dad works a lot."]},
          {"type":"choose","q":"There aren't ___ trees in the city centre.","options":["many","much"],"a":["many"]},
          {"type":"gap","q":"We haven't got ___ time. Hurry up! (much / many)","a":["much"]},
          {"type":"choose","q":"The shop opens ___ nine o'clock.","options":["at","on","in"],"a":["at"],"from":"g22"},
          {"type":"order","q":"Put the words in order.","words":["much","How","you","money","have","do"],"a":["How much money do you have?"]},
          {"type":"fix","q":"Which sentence is correct?","options":["There are a lot of people here.","There are a lot people here.","There are much people here."],"a":["There are a lot of people here."]},
          {"type":"choose","q":"Do you have ___ homework today?","options":["much","many"],"a":["much"]}
        ]
      },
      {
        id: "g25", no: 25, title: "Few, A Few, Little, A Little", v: 1,
        chunks: [
          {
            learn: {"title":"a few apples, a little milk","rule":"a few = some, a small number. Use it with plural countable nouns: a few friends, a few apples. a little = some, a small amount. Use it with uncountable nouns: a little milk, a little time. Both are positive: not many / not much, but enough.","table":[["","Countable (apples)","Uncountable (milk)"],["a small number / amount","a few apples","a little milk"],["Example","I have a few friends here.","There's a little milk in the fridge."]],"examples":["I have a few friends in this city.","Can I have a little sugar, please?","We need a few eggs for the cake.","There's a little milk in the fridge.","She speaks a little English."],"uz":"a few — bir nechta (sanaladigan otlar), a little — ozgina (sanalmaydigan otlar): a few apples, a little milk."},
            practise: [
              {"type":"choose","q":"I have ___ questions.","options":["a few","a little"],"a":["a few"],"hint":"questions can be counted → a few."},
              {"type":"choose","q":"Put ___ salt in the soup.","options":["a little","a few"],"a":["a little"],"hint":"salt can't be counted → a little."},
              {"type":"gap","q":"There are a ___ cars in the street. (few / little)","a":["few"],"hint":"cars can be counted → a few."},
              {"type":"gap","q":"Can I have a ___ water, please? (few / little)","a":["little"],"hint":"water can't be counted → a little."},
              {"type":"fix","q":"Which sentence is correct?","options":["We need a few tomatoes.","We need a little tomatoes.","We need a few tomato."],"a":["We need a few tomatoes."],"hint":"tomatoes can be counted → a few + plural."}
            ]
          },
          {
            learn: {"title":"few and little — almost none","rule":"Without a, few and little sound negative: almost none, not enough. few friends = almost no friends (sad). little time = almost no time (a problem). Compare: I have a few friends (good — I have some). I have few friends (sad — almost none). We often say very few / very little.","table":[["","Some, enough (positive)","Almost none (negative)"],["Countable","a few friends","few friends"],["Uncountable","a little money","little money"]],"examples":["He's lonely. He has very few friends.","Hurry up! We have very little time.","Few people know about this place.","I have a few friends, so I'm happy.","There's very little water in the desert."],"uz":"a artiklisiz few / little — juda kam, yetarli emas: He has few friends — Uning do‘stlari juda kam."},
            practise: [
              {"type":"choose","q":"Which means 'almost no friends'?","options":["few friends","a few friends"],"a":["few friends"],"hint":"Without a, few means almost none."},
              {"type":"choose","q":"Which means 'some money — enough'?","options":["a little money","little money"],"a":["a little money"],"hint":"With a, a little means some, enough."},
              {"type":"choose","q":"I can't buy the bike. I have very ___ money.","options":["little","a little","few"],"a":["little"],"hint":"money can't be counted, and almost none → very little."},
              {"type":"gap","q":"Don't worry, we have a ___ minutes before the train leaves. (few / little)","a":["few"],"hint":"minutes can be counted, and it's enough → a few."},
              {"type":"fix","q":"Which sentence is correct?","options":["There is little milk, so we can't make a cake.","There are little milk, so we can't make a cake.","There is few milk, so we can't make a cake."],"a":["There is little milk, so we can't make a cake."],"hint":"milk can't be counted → There is little milk."}
            ]
          },
          {
            learn: {"title":"Short answers: a lot, a few, not much, none","rule":"To answer How many…? or How much…?, you can use these words alone: How many cousins have you got? — A lot. / A few. / Not many. / None. How much tea do you want? — A little, please. / Not much. Remember: few / many for things you can count, little / much for things you can't count.","table":[["","Countable (How many?)","Uncountable (How much?)"],["a big number / amount","a lot","a lot"],["small, but some","a few","a little"],["small","not many","not much"],["zero","none","none"]],"examples":["How many photos have you got? — A lot!","How much milk do you want? — Just a little, please.","How many tickets are left? — Only a few.","How much homework do you have? — Not much.","How many sweets are in the box? — None. It's empty."],"uz":"Qisqa javoblar: a lot — ko‘p, a few / a little — ozgina, none — hech biri / umuman yo‘q."},
            practise: [
              {"type":"choose","q":"How much sugar do you want? — Just ___, please.","options":["a little","a few"],"a":["a little"],"hint":"sugar can't be counted → a little."},
              {"type":"choose","q":"How many tickets are left? — Only ___.","options":["a few","a little"],"a":["a few"],"hint":"tickets can be counted → a few."},
              {"type":"choose","q":"How many apples are in the bag? — ___. The bag is empty.","options":["None","A few","A lot"],"a":["None"],"hint":"Zero → None."},
              {"type":"gap","q":"How much money have you got? — Not ___. (much / many)","a":["much"],"hint":"money can't be counted → not much."},
              {"type":"gap","q":"How many friends have you got in this school? — Not ___. (much / many)","a":["many"],"hint":"friends can be counted → not many."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I have ___ friends in London.","options":["a few","a little"],"a":["a few"]},
          {"type":"choose","q":"Can I have ___ juice, please?","options":["a little","a few"],"a":["a little"]},
          {"type":"gap","q":"We need a ___ potatoes for the soup. (few / little)","a":["few"]},
          {"type":"choose","q":"How ___ brothers have you got?","options":["many","much"],"a":["many"],"from":"g24"},
          {"type":"choose","q":"Which means 'not enough time'?","options":["little time","a little time"],"a":["little time"]},
          {"type":"gap","q":"She speaks a ___ French. (few / little)","a":["little"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I have a few questions.","I have a little questions.","I have a few question."],"a":["I have a few questions."]},
          {"type":"order","q":"Put the words in order.","words":["a","I","need","help","little"],"a":["I need a little help."]},
          {"type":"gap","q":"___ pencil is this? — It's mine. (Who's / Whose)","a":["Whose"],"from":"g23"},
          {"type":"choose","q":"How many chairs are in the room? — ___. It's empty.","options":["None","A few","A little"],"a":["None"]},
          {"type":"choose","q":"Hurry! There's very ___ time.","options":["little","few","a few"],"a":["little"]},
          {"type":"gap","q":"How much bread do we have? — Not ___. (much / many)","a":["much"]},
          {"type":"choose","q":"My mum loves ___ in the garden.","options":["working","work","works"],"a":["working"],"from":"g20"},
          {"type":"fix","q":"Which sentence is correct?","options":["There are a few shops near my house.","There is a few shops near my house.","There are a little shops near my house."],"a":["There are a few shops near my house."]},
          {"type":"order","q":"Put the words in order.","words":["a","few","There","are","eggs","left"],"a":["There are a few eggs left."]},
          {"type":"choose","q":"Put ___ oil in the pan.","options":["a little","a few"],"a":["a little"]},
          {"type":"choose","q":"a ___ of bread","options":["piece","glass"],"a":["piece"],"from":"g8"},
          {"type":"gap","q":"How many cousins have you got? — Not ___. (much / many)","a":["many"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We have little money, so we can't go on holiday.","We have few money, so we can't go on holiday.","We have a few money, so we can't go on holiday."],"a":["We have little money, so we can't go on holiday."]},
          {"type":"choose","q":"He's sad because he has ___ friends — almost none.","options":["few","a few","a little"],"a":["few"]}
        ]
      },
      {
        id: "g26", no: 26, title: "Comparative Adjectives", v: 1,
        chunks: [
          {
            learn: {"title":"taller, bigger, easier","rule":"Use a comparative + than to compare two people or things: Tom is taller than Sam. Short adjectives (one syllable) add -er: tall → taller, old → older. Ending in -e: add -r: nice → nicer. One vowel + one consonant: double the last letter: big → bigger, hot → hotter. Ending in consonant + y: y → ier: easy → easier, happy → happier.","table":[["Adjective","Rule","Comparative"],["tall, old, cheap","+ er","taller, older, cheaper"],["nice, large","+ r","nicer, larger"],["big, hot, thin","double + er","bigger, hotter, thinner"],["easy, happy, busy","y → ier","easier, happier, busier"]],"examples":["My brother is taller than me.","Cats are smaller than dogs.","July is hotter than May.","This bag is cheaper than that one.","For me, English is easier than Chinese.","My new school is bigger than my old school."],"uz":"Ikki narsani solishtirish: qisqa sifat + -er + than: Tom is taller than Sam — Tom Samdan balandroq."},
            practise: [
              {"type":"choose","q":"An elephant is ___ than a horse.","options":["bigger","biger","more big"],"a":["bigger"],"hint":"big: one vowel + one consonant → double the g: bigger."},
              {"type":"choose","q":"Today is ___ than yesterday.","options":["hotter","hoter","more hot"],"a":["hotter"],"hint":"hot → hotter (double the t)."},
              {"type":"gap","q":"Maths is ___ than history for me. (easy)","a":["easier"],"hint":"easy: y → ier: easier."},
              {"type":"gap","q":"My dad is ___ than my mum. (old)","a":["older"],"hint":"Short adjective + er: older."},
              {"type":"fix","q":"Which sentence is correct?","options":["My sister is happier than me.","My sister is happyer than me.","My sister is more happy than me."],"a":["My sister is happier than me."],"hint":"happy: y → ier: happier."}
            ]
          },
          {
            learn: {"title":"more expensive, more interesting","rule":"Long adjectives (two or more syllables, not ending in -y) use more + adjective + than: expensive → more expensive, interesting → more interesting, beautiful → more beautiful. Don't use more and -er together: bigger (not more bigger).","table":[["Adjective","Comparative"],["expensive","more expensive"],["interesting","more interesting"],["beautiful","more beautiful"],["dangerous","more dangerous"],["comfortable","more comfortable"]],"examples":["A car is more expensive than a bike.","This book is more interesting than the film.","Tigers are more dangerous than cats.","My new chair is more comfortable than my old one.","Is Paris more beautiful than London?"],"uz":"Uzun sifatlar bilan more + sifat + than: more expensive than — …dan qimmatroq."},
            practise: [
              {"type":"choose","q":"A plane is ___ than a train.","options":["faster","more fast"],"a":["faster"],"hint":"fast is short → faster."},
              {"type":"choose","q":"Gold is ___ than silver.","options":["more expensive","expensiver","more expensiver"],"a":["more expensive"],"hint":"expensive is long → more expensive."},
              {"type":"gap","q":"This film is ___ than that one. (interesting)","a":["more interesting"],"hint":"interesting is long → more interesting."},
              {"type":"gap","q":"Lions are ___ than cats. (dangerous)","a":["more dangerous"],"hint":"dangerous is long → more dangerous."},
              {"type":"fix","q":"Which sentence is correct?","options":["This sofa is more comfortable than that chair.","This sofa is comfortabler than that chair.","This sofa is more comfortabler than that chair."],"a":["This sofa is more comfortable than that chair."],"hint":"comfortable is long → more comfortable (no -er)."}
            ]
          },
          {
            learn: {"title":"better, worse, further; than me","rule":"Some adjectives are irregular: good → better, bad → worse, far → further (or farther). After than, use me, him, her, us, them, or a name or a noun: She is older than me. To ask, use Which…? for things and Who…? for people: Which is bigger, the sun or the moon? Who is taller, you or your brother?","table":[["Adjective","Comparative"],["good","better"],["bad","worse"],["far","further / farther"]],"examples":["My English is better now than last year.","The weather today is worse than yesterday.","The station is further than the shop.","Is your bag heavier than mine?","Who is older, you or your sister? — I am."],"uz":"good → better, bad → worse, far → further: This film is better — Bu film yaxshiroq."},
            practise: [
              {"type":"choose","q":"This cake is ___ than that one. It's delicious!","options":["better","gooder","more good"],"a":["better"],"hint":"good → better."},
              {"type":"choose","q":"My cold is ___ today than yesterday. I feel terrible.","options":["worse","badder","more bad"],"a":["worse"],"hint":"bad → worse."},
              {"type":"gap","q":"The library is ___ than the park. (far)","a":["further","farther"],"hint":"far → further (or farther)."},
              {"type":"choose","q":"Anna is taller than ___.","options":["me","my"],"a":["me"],"hint":"After than, use me, him, her, us, them."},
              {"type":"fix","q":"Which sentence is correct?","options":["Which is bigger, a cat or a mouse?","Which is more big, a cat or a mouse?","Which is biger, a cat or a mouse?"],"a":["Which is bigger, a cat or a mouse?"],"hint":"big → bigger (double the g)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"A giraffe is ___ than a zebra.","options":["taller","more tall","tallest"],"a":["taller"]},
          {"type":"gap","q":"My room is ___ than my sister's room. (big)","a":["bigger"]},
          {"type":"choose","q":"A sports car is ___ than a small family car.","options":["more expensive","expensiver","most expensive"],"a":["more expensive"]},
          {"type":"choose","q":"Can I have ___ sugar in my tea?","options":["a little","a few"],"a":["a little"],"from":"g25"},
          {"type":"gap","q":"Today is ___ than yesterday. (cold)","a":["colder"]},
          {"type":"choose","q":"I got 9 and you got 6. My result is ___ than yours.","options":["better","gooder","worse"],"a":["better"]},
          {"type":"gap","q":"This exercise is ___ than the first one. (easy)","a":["easier"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Russia is bigger than France.","Russia is more big than France.","Russia is bigger that France."],"a":["Russia is bigger than France."]},
          {"type":"gap","q":"How ___ water do you drink a day? (much / many)","a":["much"],"from":"g24"},
          {"type":"order","q":"Put the words in order.","words":["than","My","brother","me","is","older"],"a":["My brother is older than me."]},
          {"type":"choose","q":"The weather is ___ today than yesterday. It's raining and cold.","options":["worse","badder","more bad"],"a":["worse"]},
          {"type":"gap","q":"This book is ___ than that one. (interesting)","a":["more interesting"]},
          {"type":"choose","q":"We usually go to the beach ___ July.","options":["in","on","at"],"a":["in"],"from":"g22"},
          {"type":"fix","q":"Which sentence is correct?","options":["My new bag is more expensive than my old one.","My new bag is expensiver than my old one.","My new bag is more expensive then my old one."],"a":["My new bag is more expensive than my old one."]},
          {"type":"choose","q":"Who is ___, you or your brother?","options":["younger","more young","youngest"],"a":["younger"]},
          {"type":"order","q":"Put the words in order.","words":["than","Cats","smaller","dogs","are"],"a":["Cats are smaller than dogs."]},
          {"type":"gap","q":"My new house is ___ from school than my old house. (far)","a":["further","farther"]},
          {"type":"gap","q":"My brother is good at ___. (swim)","a":["swimming"],"from":"g20"},
          {"type":"fix","q":"Which sentence is correct?","options":["Lucy is happier than her sister.","Lucy is happyer than her sister.","Lucy is more happier than her sister."],"a":["Lucy is happier than her sister."]},
          {"type":"choose","q":"Is a lion ___ than a dog?","options":["more dangerous","dangerouser","more dangerouser"],"a":["more dangerous"]}
        ]
      },
      {
        id: "g27", no: 27, title: "Superlative Adjectives", v: 1,
        chunks: [
          {
            learn: {"title":"the tallest, the biggest, the happiest","rule":"Use the superlative to compare one person or thing with all the others in a group: Tom is the tallest boy in our class. Short adjectives: the + adjective + -est: tall → the tallest. The spelling rules are the same as for -er: nice → the nicest, big → the biggest, happy → the happiest. Use in with places and groups: the tallest in the class, the biggest city in the world.","table":[["Adjective","Comparative","Superlative"],["tall","taller","the tallest"],["nice","nicer","the nicest"],["big","bigger","the biggest"],["happy","happier","the happiest"]],"examples":["Tom is the tallest boy in our class.","The blue whale is the biggest animal in the world.","This is the nicest cafe in town.","Friday is the happiest day of the week for me.","Who is the oldest person in your family?"],"uz":"“Eng …” ma’nosida: the + sifat + -est: the tallest — eng baland, the biggest — eng katta."},
            practise: [
              {"type":"choose","q":"Mount Everest is ___ mountain in the world.","options":["the highest","the higher","highest"],"a":["the highest"],"hint":"The whole group → the + -est: the highest."},
              {"type":"choose","q":"It's ___ day of the year.","options":["the hottest","the hotest","the most hot"],"a":["the hottest"],"hint":"hot → the hottest (double the t)."},
              {"type":"gap","q":"This is the ___ room in the house. (small)","a":["smallest"],"hint":"Short adjective → the + -est: the smallest."},
              {"type":"gap","q":"She is the ___ girl I know. (funny)","a":["funniest"],"hint":"funny: y → iest: the funniest."},
              {"type":"fix","q":"Which sentence is correct?","options":["He is the tallest student in the class.","He is the taller student in the class.","He is tallest student of the class."],"a":["He is the tallest student in the class."],"hint":"the + -est + in the class."}
            ]
          },
          {
            learn: {"title":"the most beautiful, the best, the worst","rule":"Long adjectives use the most + adjective: the most beautiful, the most expensive, the most interesting. Irregular: good → better → the best, bad → worse → the worst, far → further → the furthest.","table":[["Adjective","Comparative","Superlative"],["beautiful","more beautiful","the most beautiful"],["expensive","more expensive","the most expensive"],["good","better","the best"],["bad","worse","the worst"],["far","further","the furthest"]],"examples":["This is the most beautiful beach in the country.","It's the most expensive car in the shop.","Who is the best player in your team?","This is the worst film I know.","For me, maths is the most difficult subject."],"uz":"Uzun sifatlar: the most + sifat (the most beautiful — eng chiroyli); good → the best, bad → the worst."},
            practise: [
              {"type":"choose","q":"This is ___ book in the library.","options":["the most interesting","the interestingest","the more interesting"],"a":["the most interesting"],"hint":"interesting is long → the most interesting."},
              {"type":"choose","q":"She is ___ singer in our school.","options":["the best","the goodest","the better"],"a":["the best"],"hint":"good → the best."},
              {"type":"gap","q":"This is the ___ hotel in the city. (expensive)","a":["most expensive"],"hint":"expensive is long → the most expensive."},
              {"type":"gap","q":"Today is the ___ day of my life! Everything is going wrong. (bad)","a":["worst"],"hint":"bad → the worst."},
              {"type":"fix","q":"Which sentence is correct?","options":["It's the most dangerous animal in Africa.","It's the dangerousest animal in Africa.","It's the most dangerousest animal in Africa."],"a":["It's the most dangerous animal in Africa."],"hint":"dangerous is long → the most dangerous."}
            ]
          },
          {
            learn: {"title":"Two things or the whole group?","rule":"Two things → comparative + than: My bag is bigger than yours. Three or more (the whole group) → the + superlative: My bag is the biggest in the class. Don't use than after a superlative, and don't forget the before it.","table":[["How many?","Form","Example"],["two","-er / more + than","A car is faster than a bike."],["the whole group","the -est / the most","A plane is the fastest of the three."]],"examples":["Anna is older than Lucy, but Kate is the oldest.","A bus is bigger than a car. A plane is the biggest.","Tea is cheaper than coffee here.","This is the cheapest cafe in the street.","Maths is more difficult than art, but physics is the most difficult."],"uz":"Ikki narsa — -er / more + than; guruhdagi eng … — the -est / the most."},
            practise: [
              {"type":"choose","q":"Sam is 10, Ben is 12 and Tom is 14. Tom is ___ of the three.","options":["the oldest","older","the older"],"a":["the oldest"],"hint":"Three people → the + -est: the oldest."},
              {"type":"choose","q":"My phone is ___ than yours.","options":["newer","the newest","newest"],"a":["newer"],"hint":"Two things + than → newer."},
              {"type":"gap","q":"Russia is the ___ country in the world. (big)","a":["biggest"],"hint":"The whole world → the biggest."},
              {"type":"gap","q":"A mouse is ___ than a cat. (small)","a":["smaller"],"hint":"Two things + than → smaller."},
              {"type":"fix","q":"Which sentence is correct?","options":["She is the best student in the class.","She is the best student than the class.","She is best student in the class."],"a":["She is the best student in the class."],"hint":"the + superlative + in the class (no than)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"The cheetah is ___ animal on land.","options":["the fastest","the faster","fastest"],"a":["the fastest"]},
          {"type":"gap","q":"This is the ___ day of the year. (cold)","a":["coldest"]},
          {"type":"choose","q":"This is ___ film I know.","options":["the funniest","the funnyest","the funnier"],"a":["the funniest"]},
          {"type":"gap","q":"My sister is ___ than me. (young)","a":["younger"],"from":"g26"},
          {"type":"choose","q":"Who is ___ player in your team?","options":["the best","the goodest","the better"],"a":["the best"]},
          {"type":"gap","q":"It's the ___ shop in town. (expensive)","a":["most expensive"]},
          {"type":"fix","q":"Which sentence is correct?","options":["This is the biggest room in the house.","This is the bigest room in the house.","This is the most big room in the house."],"a":["This is the biggest room in the house."]},
          {"type":"order","q":"Put the words in order.","words":["the","is","She","girl","tallest","class","the","in"],"a":["She is the tallest girl in the class."]},
          {"type":"choose","q":"There are ___ people in the park today.","options":["a lot of","much","a lot"],"a":["a lot of"],"from":"g24"},
          {"type":"choose","q":"A dog is ___ than a mouse.","options":["bigger","the biggest","biggest"],"a":["bigger"]},
          {"type":"gap","q":"That's the ___ idea ever! Nobody likes it. (bad)","a":["worst"]},
          {"type":"choose","q":"Kate is 15, Lucy is 13 and Emma is 11. Emma is ___ of the three.","options":["the youngest","younger","the younger"],"a":["the youngest"]},
          {"type":"choose","q":"I hate ___ the dishes.","options":["washing","wash","washes"],"a":["washing"],"from":"g20"},
          {"type":"fix","q":"Which sentence is correct?","options":["Who is the oldest person in your family?","Who is the older person in your family?","Who is oldest person in your family?"],"a":["Who is the oldest person in your family?"]},
          {"type":"order","q":"Put the words in order.","words":["most","the","This","beautiful","is","park"],"a":["This is the most beautiful park.","This park is the most beautiful."]},
          {"type":"gap","q":"Summer is the ___ season of the year. (hot)","a":["hottest"]},
          {"type":"gap","q":"The sun ___ in the east. (rise)","a":["rises"],"from":"g11"},
          {"type":"choose","q":"Which is ___, Jupiter or the Earth?","options":["bigger","the biggest","biggest"],"a":["bigger"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Gold is the most expensive of the three metals.","Gold is the expensivest of the three metals.","Gold is most expensive than the three metals."],"a":["Gold is the most expensive of the three metals."]},
          {"type":"gap","q":"Who is the ___ student in your class? (good)","a":["best"]}
        ]
      },
      {
        id: "g28", no: 28, title: "Adjective Order", v: 1,
        chunks: [
          {
            learn: {"title":"A red car — the adjective comes first","rule":"In English, an adjective goes before the noun: a red car (not a car red). Adjectives never take -s: two red cars (not reds cars). After be, the adjective comes alone: The car is red.","table":[["Right","Wrong"],["a big house","a house big"],["blue eyes","eyes blue"],["three old books","three olds books"],["The house is big.","The house is bigs."]],"examples":["She has a red bike.","We live in a small flat.","I have two little sisters.","My dad drives a fast car.","These shoes are new."],"uz":"Sifat otdan oldin keladi va -s olmaydi: a red car — qizil mashina, red cars — qizil mashinalar."},
            practise: [
              {"type":"choose","q":"I have a ___.","options":["black cat","cat black"],"a":["black cat"],"hint":"The adjective goes before the noun: a black cat."},
              {"type":"choose","q":"They have two ___ cars.","options":["new","news"],"a":["new"],"hint":"Adjectives never take -s: two new cars."},
              {"type":"order","q":"Put the words in order.","words":["has","She","hair","long"],"a":["She has long hair."],"hint":"The adjective goes before the noun: long hair."},
              {"type":"fix","q":"Which sentence is correct?","options":["We live in a big house.","We live in a house big.","We live in a bigs house."],"a":["We live in a big house."],"hint":"Adjective before the noun, no -s: a big house."},
              {"type":"choose","q":"My grandma has two ___ dogs.","options":["little","littles"],"a":["little"],"hint":"Adjectives never take -s: two little dogs."}
            ]
          },
          {
            learn: {"title":"Opinion first: a beautiful old house","rule":"When there are two adjectives, the opinion (what you think: nice, beautiful, lovely, boring, ugly, funny) comes first. Then the fact (size, age, colour…): a beautiful old house, a nice big garden, a lovely red dress.","table":[["Opinion","Fact","Noun"],["a beautiful","old","house"],["a nice","big","garden"],["a lovely","red","dress"],["an ugly","green","sofa"]],"examples":["She has a lovely red dress.","We have a nice big garden.","It's a boring old film.","It's a funny little dog.","They live in a beautiful old house."],"uz":"Avval fikr (nice, beautiful), keyin fakt (big, old, red): a beautiful old house — chiroyli eski uy."},
            practise: [
              {"type":"choose","q":"It's a ___ house.","options":["beautiful old","old beautiful"],"a":["beautiful old"],"hint":"Opinion (beautiful) before fact (old)."},
              {"type":"choose","q":"She's wearing a ___ dress.","options":["lovely blue","blue lovely"],"a":["lovely blue"],"hint":"Opinion (lovely) before fact (blue)."},
              {"type":"order","q":"Put the words in order.","words":["a","nice","big","It's","garden"],"a":["It's a nice big garden."],"hint":"Opinion (nice) + fact (big) + garden."},
              {"type":"fix","q":"Which sentence is correct?","options":["He has a funny little dog.","He has a little funny dog.","He has a dog funny little."],"a":["He has a funny little dog."],"hint":"Opinion (funny) before fact (little)."},
              {"type":"choose","q":"That's an ___ chair.","options":["ugly old","old ugly"],"a":["ugly old"],"hint":"Opinion (ugly) before fact (old)."}
            ]
          },
          {
            learn: {"title":"Size, age, colour, material","rule":"Fact adjectives usually go in this order: size (big, small) → age (old, new, young) → colour (red, black) → where it is from (Italian, Chinese) → what it is made of (wooden, plastic, cotton) → the noun. The whole order: opinion – size – age – colour – origin – material. We rarely use more than three adjectives together.","table":[["Order","Examples"],["1 opinion","nice, beautiful, ugly"],["2 size","big, small, long"],["3 age","old, new, young"],["4 colour","red, black, white"],["5 origin","Italian, Chinese, French"],["6 material","wooden, plastic, cotton"]],"examples":["She has a big black dog.","He lives in a big old house.","It's a new red bike.","My mum has a beautiful Italian leather bag.","I have a small wooden box."],"uz":"Tartib: fikr – o‘lcham – yosh – rang – kelib chiqish – material: a big old house — katta eski uy."},
            practise: [
              {"type":"choose","q":"a ___ car","options":["small red","red small"],"a":["small red"],"hint":"Size (small) before colour (red)."},
              {"type":"choose","q":"a ___ table","options":["big wooden","wooden big"],"a":["big wooden"],"hint":"Size (big) before material (wooden)."},
              {"type":"order","q":"Put the words in order.","words":["a","black","big","has","He","dog"],"a":["He has a big black dog."],"hint":"Size (big) before colour (black)."},
              {"type":"choose","q":"She has ___ cat.","options":["a little black","a black little"],"a":["a little black"],"hint":"Size (little) before colour (black)."},
              {"type":"fix","q":"Which sentence is correct?","options":["I have a new blue bike.","I have a blue new bike.","I have a bike new blue."],"a":["I have a new blue bike."],"hint":"Age (new) before colour (blue)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I live in a ___.","options":["small flat","flat small"],"a":["small flat"]},
          {"type":"choose","q":"She has two ___ brothers.","options":["young","youngs"],"a":["young"]},
          {"type":"order","q":"Put the words in order.","words":["has","My","a","car","fast","dad"],"a":["My dad has a fast car."]},
          {"type":"choose","q":"It's ___ day of the year.","options":["the shortest","the shorter","shortest"],"a":["the shortest"],"from":"g27"},
          {"type":"choose","q":"We have a ___ garden.","options":["lovely big","big lovely"],"a":["lovely big"]},
          {"type":"choose","q":"It's a ___ bag.","options":["beautiful Italian","Italian beautiful"],"a":["beautiful Italian"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She has long black hair.","She has black long hair.","She has hair long black."],"a":["She has long black hair."]},
          {"type":"choose","q":"I have two ___ cats.","options":["white","whites"],"a":["white"]},
          {"type":"gap","q":"A plane is ___ than a car. (fast)","a":["faster"],"from":"g26"},
          {"type":"choose","q":"a ___ box","options":["small wooden","wooden small"],"a":["small wooden"]},
          {"type":"order","q":"Put the words in order.","words":["an","It's","old","ugly","sofa"],"a":["It's an ugly old sofa."]},
          {"type":"fix","q":"Which sentence is correct?","options":["He's wearing a nice white shirt.","He's wearing a white nice shirt.","He's wearing a nice whites shirt."],"a":["He's wearing a nice white shirt."]},
          {"type":"choose","q":"The ___ bedroom is upstairs. (two girls)","options":["girls'","girl's"],"a":["girls'"],"from":"g23"},
          {"type":"choose","q":"She has ___ eyes.","options":["big blue","blue big"],"a":["big blue"]},
          {"type":"order","q":"Put the words in order.","words":["new","a","red","I","want","bike"],"a":["I want a new red bike."]},
          {"type":"fix","q":"Which sentence is correct?","options":["They live in a big old house.","They live in an old big house.","They live in a house big old."],"a":["They live in a big old house."]},
          {"type":"gap","q":"My sister ___ got long hair. (have / has)","a":["has"],"from":"g5"},
          {"type":"choose","q":"a ___ T-shirt","options":["cheap cotton","cotton cheap"],"a":["cheap cotton"]},
          {"type":"choose","q":"It's a ___ town.","options":["lovely little","little lovely"],"a":["lovely little"]},
          {"type":"fix","q":"Which sentence is correct?","options":["My grandma has a beautiful old clock.","My grandma has an old beautiful clock.","My grandma has a beautifuls old clock."],"a":["My grandma has a beautiful old clock."]}
        ]
      },
      {
        id: "g29", no: 29, title: "Was / Were", v: 1,
        chunks: [
          {
            learn: {"title":"I was, you were","rule":"Was and were are the past of am, is and are. Use was with I, he, she, it (and one person or thing). Use were with you, we, they (and two or more). Past time words: yesterday, last night, last week, in 2020, two days ago.","table":[["Present","Past","Example"],["I am","I was","I was at home yesterday."],["he / she / it is","he / she / it was","She was ill last week."],["you / we / they are","you / we / they were","We were at school."]],"examples":["I was at the cinema last night.","My grandfather was a teacher.","It was cold yesterday.","We were in London in 2022.","The children were very tired after the trip."],"uz":"was / were — am, is, are ning o‘tgan zamoni: I was at home yesterday — Kecha uyda edim."},
            practise: [
              {"type":"choose","q":"I ___ at home yesterday.","options":["was","were"],"a":["was"],"hint":"With I, use was."},
              {"type":"choose","q":"They ___ in the park last Sunday.","options":["were","was"],"a":["were"],"hint":"With they, use were."},
              {"type":"gap","q":"It ___ very hot last summer. (be)","a":["was"],"hint":"With it, use was."},
              {"type":"gap","q":"My friends ___ at my party last night. (be)","a":["were"],"hint":"My friends = they → were."},
              {"type":"fix","q":"Which sentence is correct?","options":["We were tired last night.","We was tired last night.","We are tired last night."],"a":["We were tired last night."],"hint":"last night = the past; with we, use were."}
            ]
          },
          {
            learn: {"title":"wasn't, weren't — Were you…?","rule":"Negative: wasn't (was not), weren't (were not): I wasn't at school. They weren't hungry. Question: put was / were before the person: Were you at home? Was it expensive? Short answers: Yes, I was. / No, I wasn't. Yes, they were. / No, they weren't.","table":[["","Example"],["Negative","I wasn't at home. / They weren't hungry."],["Question","Was it expensive? / Were you at school?"],["Short answer","Yes, it was. / No, they weren't."],["Question word","Where were you yesterday?"]],"examples":["I wasn't at school yesterday. I was ill.","The shops weren't open on Sunday.","Were you at the party? — Yes, I was.","Was the film good? — No, it wasn't.","Where were you last night?"],"uz":"Inkor: wasn't / weren't. So‘roq: Were you at home? — Uyda edingizmi?"},
            practise: [
              {"type":"choose","q":"She ___ at work yesterday. She was at home.","options":["wasn't","weren't"],"a":["wasn't"],"hint":"With she, the negative is wasn't."},
              {"type":"choose","q":"___ you at school last Monday?","options":["Were","Was","Did"],"a":["Were"],"hint":"With you, use Were…?"},
              {"type":"gap","q":"Was the test difficult? — No, it ___.","a":["wasn't","was not"],"hint":"Was it…? — No, it wasn't."},
              {"type":"gap","q":"Were your parents at home? — Yes, they ___.","a":["were"],"hint":"Were they…? — Yes, they were."},
              {"type":"order","q":"Put the words in order.","words":["were","Where","you","yesterday"],"a":["Where were you yesterday?"],"hint":"Where + were + you + yesterday?"}
            ]
          },
          {
            learn: {"title":"There was, there were; I was born","rule":"Use there was with one thing or an uncountable noun, and there were with plural nouns: There was a cat in the garden. There were a lot of people. Negative: there wasn't / there weren't. To say when or where someone was born, use was / were born: I was born in 2010. Where were you born?","table":[["","Example"],["There was + one / uncountable","There was a big tree here. / There was some milk."],["There were + plural","There were two cats."],["Negative","There wasn't any bread. / There weren't many people."],["born","I was born in May. / They were born in Paris."]],"examples":["There was a party at school yesterday.","There were twenty students in the class.","There wasn't any milk in the fridge.","I was born on 3 June.","Where were your parents born?"],"uz":"There was / were — …bor edi: There were two cats — Ikkita mushuk bor edi. I was born — tug‘ilganman."},
            practise: [
              {"type":"choose","q":"There ___ a big tree in our garden last year.","options":["was","were"],"a":["was"],"hint":"One tree → There was."},
              {"type":"choose","q":"There ___ a lot of people at the concert yesterday.","options":["were","was"],"a":["were"],"hint":"people is plural → There were."},
              {"type":"gap","q":"There ___ any bread in the kitchen yesterday morning. (negative)","a":["wasn't","was not"],"hint":"bread, negative → There wasn't."},
              {"type":"choose","q":"I ___ born in 2011.","options":["was","were","am"],"a":["was"],"hint":"I was born…"},
              {"type":"fix","q":"Which sentence is correct?","options":["Where were you born?","Where was you born?","Where did you born?"],"a":["Where were you born?"],"hint":"With you: Where were you born?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"My dad ___ a footballer when he was young.","options":["was","were"],"a":["was"]},
          {"type":"gap","q":"We ___ at the beach yesterday. (be)","a":["were"]},
          {"type":"choose","q":"The weather ___ terrible last weekend.","options":["was","were"],"a":["was"]},
          {"type":"choose","q":"This is ___ cake in the shop.","options":["the most delicious","the deliciousest","more delicious"],"a":["the most delicious"],"from":"g27"},
          {"type":"gap","q":"I ___ at school yesterday. I was ill. (negative)","a":["wasn't","was not"]},
          {"type":"choose","q":"___ the shops open last Sunday?","options":["Were","Was","Did"],"a":["Were"]},
          {"type":"gap","q":"Was your teacher angry? — Yes, she ___.","a":["was"]},
          {"type":"fix","q":"Which sentence is correct?","options":["They weren't at home last night.","They wasn't at home last night.","They aren't at home last night."],"a":["They weren't at home last night."]},
          {"type":"choose","q":"I was born ___ 2012.","options":["in","on","at"],"a":["in"],"from":"g22"},
          {"type":"choose","q":"There ___ three bananas on the table yesterday morning.","options":["were","was"],"a":["were"]},
          {"type":"gap","q":"There ___ a cat in the garden yesterday morning. (be)","a":["was"]},
          {"type":"order","q":"Put the words in order.","words":["were","Where","born","you"],"a":["Where were you born?"]},
          {"type":"choose","q":"She has a ___ bag.","options":["beautiful red","red beautiful"],"a":["beautiful red"],"from":"g28"},
          {"type":"fix","q":"Which sentence is correct?","options":["Was the film good?","Were the film good?","Did the film good?"],"a":["Was the film good?"]},
          {"type":"order","q":"Put the words in order.","words":["wasn't","It","yesterday","cold"],"a":["It wasn't cold yesterday."]},
          {"type":"choose","q":"Where ___ you last night?","options":["were","was","did"],"a":["were"]},
          {"type":"choose","q":"There ___ a park near my house.","options":["is","are"],"a":["is"],"from":"g6"},
          {"type":"gap","q":"Were you tired after the game? — No, I ___.","a":["wasn't","was not"]},
          {"type":"fix","q":"Which sentence is correct?","options":["There were a lot of people at the party.","There was a lot of people at the party.","There were a lot of people at the party tomorrow."],"a":["There were a lot of people at the party."]},
          {"type":"choose","q":"My grandparents ___ born in a small village.","options":["were","was","are"],"a":["were"]}
        ]
      },
      {
        id: "g30", no: 30, title: "Past Simple (Regular and Irregular Verbs)", v: 1,
        chunks: [
          {
            learn: {"title":"worked, played — regular verbs","rule":"Use the past simple for finished actions in the past: yesterday, last week, in 2019, two days ago. Regular verbs add -ed: work → worked, play → played. The past simple is the same for every person: I worked, she worked, they worked.","table":[["Present","Past"],["I work","I worked"],["She plays","She played"],["We watch","We watched"],["They visit","They visited"]],"examples":["I watched a film last night.","We played football yesterday.","My mum cooked dinner yesterday.","They visited their grandma last Sunday.","She worked in a bank in 2015."],"uz":"Past Simple — tugagan ish; to‘g‘ri fe’llarga -ed qo‘shiladi: I watched TV yesterday — Kecha televizor ko‘rdim."},
            practise: [
              {"type":"choose","q":"I ___ TV last night.","options":["watched","watch","watching"],"a":["watched"],"hint":"last night = the past → watched."},
              {"type":"choose","q":"She ___ tennis yesterday.","options":["played","plays","playes"],"a":["played"],"hint":"yesterday = the past → played."},
              {"type":"gap","q":"We ___ our cousins last weekend. (visit)","a":["visited"],"hint":"Regular verb + ed: visited."},
              {"type":"gap","q":"My dad ___ in an office ten years ago. (work)","a":["worked"],"hint":"Regular verb + ed: worked."},
              {"type":"fix","q":"Which sentence is correct?","options":["They cleaned the house yesterday.","They clean the house yesterday.","They cleaneds the house yesterday."],"a":["They cleaned the house yesterday."],"hint":"yesterday = the past → cleaned."}
            ]
          },
          {
            learn: {"title":"lived, stopped, studied — spelling","rule":"Verbs ending in -e add only -d: live → lived, like → liked. A short verb with one vowel + one consonant doubles the last letter: stop → stopped, plan → planned. Consonant + y: y → ied: study → studied, cry → cried. Vowel + y: just add -ed: play → played, stay → stayed.","table":[["Verb ends in","Rule","Examples"],["-e","+ d","live → lived, dance → danced"],["one vowel + one consonant","double + ed","stop → stopped, plan → planned"],["consonant + y","y → ied","study → studied, carry → carried"],["vowel + y","+ ed","play → played, enjoy → enjoyed"]],"examples":["We lived in Paris for two years.","The bus stopped near the school.","I studied for the test all evening yesterday.","The baby cried all night.","We enjoyed the party last night."],"uz":"-e dan keyin faqat -d (lived), undosh + y → ied (studied), qisqa fe’lda oxirgi undosh ikkilanadi (stopped)."},
            practise: [
              {"type":"choose","q":"The car ___ at the traffic lights a minute ago.","options":["stopped","stoped","stopt"],"a":["stopped"],"hint":"stop: one vowel + one consonant → double the p: stopped."},
              {"type":"choose","q":"I ___ English last night.","options":["studied","studyed","studed"],"a":["studied"],"hint":"study: consonant + y → ied: studied."},
              {"type":"gap","q":"We ___ the film very much last night. (enjoy)","a":["enjoyed"],"hint":"enjoy: vowel + y → just add -ed: enjoyed."},
              {"type":"gap","q":"My grandparents ___ in a small village in 1990. (live)","a":["lived"],"hint":"live ends in -e → add only -d: lived."},
              {"type":"fix","q":"Which sentence is correct?","options":["The baby cried a lot yesterday.","The baby cryed a lot yesterday.","The baby crys a lot yesterday."],"a":["The baby cried a lot yesterday."],"hint":"cry: consonant + y → ied: cried."}
            ]
          },
          {
            learn: {"title":"went, had, saw — irregular verbs","rule":"Many common verbs are irregular — they don't add -ed. You need to learn them: go → went, have → had, see → saw, eat → ate, buy → bought, get → got, make → made, take → took, come → came, do → did.","table":[["Verb","Past","Verb","Past"],["go","went","eat","ate"],["have","had","buy","bought"],["see","saw","get","got"],["make","made","take","took"],["come","came","do","did"]],"examples":["I went to the cinema yesterday.","We had pizza for dinner last night.","She saw a famous actor in the street.","My dad bought a new car last month.","They came home at ten.","I got up at seven this morning."],"uz":"Noto‘g‘ri fe’llar -ed olmaydi, ularni yodlash kerak: go → went, see → saw, buy → bought."},
            practise: [
              {"type":"choose","q":"I ___ to the park yesterday.","options":["went","goed","go"],"a":["went"],"hint":"go → went."},
              {"type":"choose","q":"We ___ a great film last night.","options":["saw","seed","see"],"a":["saw"],"hint":"see → saw."},
              {"type":"gap","q":"She ___ a new dress last week. (buy)","a":["bought"],"hint":"buy → bought."},
              {"type":"gap","q":"They ___ pasta for lunch yesterday. (eat)","a":["ate"],"hint":"eat → ate."},
              {"type":"fix","q":"Which sentence is correct?","options":["I had a shower this morning.","I haved a shower this morning.","I has a shower this morning."],"a":["I had a shower this morning."],"hint":"have → had."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"We ___ football after school yesterday.","options":["played","play","plaied"],"a":["played"]},
          {"type":"gap","q":"I ___ my grandma last Sunday. (visit)","a":["visited"]},
          {"type":"choose","q":"She ___ to London in 2019.","options":["went","goed","goes"],"a":["went"]},
          {"type":"choose","q":"They ___ at home last night.","options":["were","was"],"a":["were"],"from":"g29"},
          {"type":"gap","q":"We ___ the dishes after dinner last night. (wash)","a":["washed"]},
          {"type":"choose","q":"The bus ___ in front of the school five minutes ago.","options":["stopped","stoped","stops"],"a":["stopped"]},
          {"type":"gap","q":"My brother ___ for his exam last weekend. (study)","a":["studied"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I saw Tom at the shop yesterday.","I seed Tom at the shop yesterday.","I see Tom at the shop yesterday."],"a":["I saw Tom at the shop yesterday."]},
          {"type":"choose","q":"My bag is ___ than yours.","options":["heavier","heavyer","more heavy"],"a":["heavier"],"from":"g26"},
          {"type":"choose","q":"We ___ a lot of photos on holiday last year.","options":["took","taked","take"],"a":["took"]},
          {"type":"gap","q":"I ___ up late this morning. (get)","a":["got"]},
          {"type":"order","q":"Put the words in order.","words":["went","We","yesterday","the","to","zoo"],"a":["We went to the zoo yesterday."]},
          {"type":"choose","q":"The party started ___ eight o'clock.","options":["at","on","in"],"a":["at"],"from":"g22"},
          {"type":"fix","q":"Which sentence is correct?","options":["She bought a new bike last month.","She buyed a new bike last month.","She buys a new bike last month."],"a":["She bought a new bike last month."]},
          {"type":"choose","q":"My parents ___ in Canada for five years. Now they live in the USA.","options":["lived","liveed","live"],"a":["lived"]},
          {"type":"gap","q":"We ___ a cake for Mum's birthday last week. (make)","a":["made"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He is always happy.","He always is happy.","Always he is happy."],"a":["He is always happy."],"from":"g13"},
          {"type":"order","q":"Put the words in order.","words":["had","I","breakfast","at","seven"],"a":["I had breakfast at seven.","At seven I had breakfast."]},
          {"type":"choose","q":"Tom ___ home at ten last night.","options":["came","comed","comes"],"a":["came"]},
          {"type":"gap","q":"I ___ my homework before dinner yesterday. (do)","a":["did"]}
        ]
      },
      {
        id: "g31", no: 31, title: "Past Simple (Negative and Questions)", v: 1,
        chunks: [
          {
            learn: {"title":"didn't + verb","rule":"Negative: didn't (did not) + the verb as it is. It's the same for every person and for regular and irregular verbs: I didn't go. She didn't watch TV. After didn't, never use the past form: He didn't see me (not didn't saw).","table":[["Positive","Negative"],["I worked.","I didn't work."],["She went.","She didn't go."],["They saw it.","They didn't see it."],["He had lunch.","He didn't have lunch."]],"examples":["I didn't go to school yesterday.","She didn't like the film.","We didn't have breakfast this morning.","My dad didn't buy the car. It was too expensive.","They didn't see us."],"uz":"Inkor: didn't + fe’lning oddiy shakli: I didn't go — Men bormadim. didn't dan keyin went emas, go."},
            practise: [
              {"type":"choose","q":"I ___ my homework yesterday.","options":["didn't do","didn't did","don't did"],"a":["didn't do"],"hint":"didn't + verb as it is: didn't do."},
              {"type":"choose","q":"She didn't ___ the bus this morning.","options":["catch","caught","catches"],"a":["catch"],"hint":"After didn't, the verb as it is: catch."},
              {"type":"gap","q":"We ___ TV last night. (not / watch)","a":["didn't watch","did not watch"],"hint":"didn't + watch."},
              {"type":"gap","q":"He didn't ___ to the party yesterday. (go)","a":["go"],"hint":"After didn't, the verb as it is: go (not went)."},
              {"type":"fix","q":"Which sentence is correct?","options":["They didn't see the film.","They didn't saw the film.","They don't saw the film."],"a":["They didn't see the film."],"hint":"didn't + see (not saw)."}
            ]
          },
          {
            learn: {"title":"Did you…? — Yes, I did.","rule":"Question: Did + person + verb as it is: Did you go? Did she like it? Short answers: Yes, I did. / No, I didn't. Be careful with be: Were you tired? (not Did you be tired?).","table":[["Question","Short answer"],["Did you see the match?","Yes, I did. / No, I didn't."],["Did she call you?","Yes, she did. / No, she didn't."],["Did they win?","Yes, they did. / No, they didn't."]],"examples":["Did you have a good weekend? — Yes, I did.","Did Tom call you? — No, he didn't.","Did they win the match yesterday?","Did your mum make this cake? — Yes, she did.","Were you at home? — No, I wasn't."],"uz":"So‘roq: Did + shaxs + fe’l: Did you go? — Bordingizmi? Javob: Yes, I did. / No, I didn't."},
            practise: [
              {"type":"choose","q":"___ you see Sam yesterday?","options":["Did","Do","Were"],"a":["Did"],"hint":"Past question: Did + you + verb."},
              {"type":"choose","q":"Did she ___ the test last week?","options":["pass","passed","passes"],"a":["pass"],"hint":"After Did, the verb as it is: pass."},
              {"type":"gap","q":"Did you enjoy the film? — Yes, I ___.","a":["did"],"hint":"Did you…? — Yes, I did."},
              {"type":"gap","q":"Did they win the game? — No, they ___.","a":["didn't","did not"],"hint":"Did they…? — No, they didn't."},
              {"type":"order","q":"Put the words in order.","words":["you","Did","breakfast","have"],"a":["Did you have breakfast?"],"hint":"Did + you + have + breakfast?"}
            ]
          },
          {
            learn: {"title":"What did you do? Where did you go?","rule":"With a question word: question word + did + person + verb as it is: What did you do? Where did she go? When did they arrive? What time did you get up? did already shows the past, so the verb doesn't change: Where did you go? (not Where did you went?).","table":[["Question word","did","Person","Verb"],["What","did","you","do?"],["Where","did","she","go?"],["What time","did","they","get up?"],["Why","did","he","leave?"]],"examples":["What did you do at the weekend? — I visited my friends.","Where did you go on holiday? — We went to Spain.","What time did you get up? — At eight.","Why did he leave early? — He was tired.","How did you get there? — By train."],"uz":"Savol so‘zi + did + shaxs + fe’l: Where did you go? — Qayerga bordingiz?"},
            practise: [
              {"type":"choose","q":"Where ___ you go last summer?","options":["did","were","do"],"a":["did"],"hint":"Past question: Where + did + you + go?"},
              {"type":"choose","q":"What did you ___ yesterday?","options":["do","did","done"],"a":["do"],"hint":"After did, the verb as it is: do."},
              {"type":"gap","q":"What time ___ you go to bed last night?","a":["did"],"hint":"Past question: What time + did + you + go?"},
              {"type":"order","q":"Put the words in order.","words":["did","What","eat","you"],"a":["What did you eat?"],"hint":"What + did + you + eat?"},
              {"type":"fix","q":"Which sentence is correct?","options":["Why did she cry?","Why did she cried?","Why she did cry?"],"a":["Why did she cry?"],"hint":"Why + did + she + cry (not cried)."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ to the party last night.","options":["didn't go","didn't went","don't went"],"a":["didn't go"]},
          {"type":"gap","q":"She didn't ___ the answer yesterday. (know)","a":["know"]},
          {"type":"choose","q":"___ you finish your homework yesterday?","options":["Did","Do","Were"],"a":["Did"]},
          {"type":"gap","q":"We ___ to the beach last weekend. (go)","a":["went"],"from":"g30"},
          {"type":"gap","q":"Did your brother call you? — Yes, he ___.","a":["did"]},
          {"type":"choose","q":"Where ___ they go on holiday last year?","options":["did","were","do"],"a":["did"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We didn't have lunch today.","We didn't had lunch today.","We not had lunch today."],"a":["We didn't have lunch today."]},
          {"type":"order","q":"Put the words in order.","words":["you","Did","the","film","like"],"a":["Did you like the film?"]},
          {"type":"choose","q":"___ you at school yesterday?","options":["Were","Did","Was"],"a":["Were"],"from":"g29"},
          {"type":"gap","q":"Did you see the match? — No, I ___.","a":["didn't","did not"]},
          {"type":"choose","q":"What time did the train ___ yesterday?","options":["leave","left","leaves"],"a":["leave"]},
          {"type":"gap","q":"I ___ breakfast this morning. I wasn't hungry. (not / have)","a":["didn't have","did not have"]},
          {"type":"choose","q":"How ___ money did you spend?","options":["much","many"],"a":["much"],"from":"g24"},
          {"type":"fix","q":"Which sentence is correct?","options":["What did you buy?","What did you bought?","What you did buy?"],"a":["What did you buy?"]},
          {"type":"order","q":"Put the words in order.","words":["did","Where","you","go","yesterday"],"a":["Where did you go yesterday?"]},
          {"type":"choose","q":"Did Anna ___ to you last week?","options":["write","wrote","writes"],"a":["write"]},
          {"type":"choose","q":"I need ___ to the bank today.","options":["to go","go","going"],"a":["to go"],"from":"g21"},
          {"type":"gap","q":"Why ___ he leave so early yesterday?","a":["did"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Did they win the game?","Did they won the game?","Do they won the game?"],"a":["Did they win the game?"]},
          {"type":"choose","q":"They didn't ___ us at the station.","options":["see","saw","seen"],"a":["see"]}
        ]
      },
      {
        id: "g32", no: 32, title: "Future with Will and Be Going To", v: 1,
        chunks: [
          {
            learn: {"title":"I'll help you — will","rule":"Use will + verb (short form 'll) for a decision you make at the moment of speaking: It's cold. I'll close the window. Use it for offers and promises: I'll help you. I'll call you tonight. And for predictions (what you think will happen): I think it will rain tomorrow. Negative: won't (will not).","table":[["Use","Example"],["a decision now","The phone is ringing. I'll answer it."],["an offer","That bag looks heavy. I'll carry it."],["a promise","I'll call you tonight."],["a prediction","I think you'll like this film."],["negative","I won't (will not) be late."]],"examples":["I'm thirsty. I think I'll have some water.","Don't worry, I'll help you with your homework.","I promise I won't tell anyone.","I think Anna will win the race.","Will you be at home tomorrow?"],"uz":"will — hozir qaror qilganda, taklif yoki va’da berganda: I'll help you — Men sizga yordam beraman."},
            practise: [
              {"type":"choose","q":"The phone is ringing. I ___ answer it. (a decision now)","options":["will","am going to"],"a":["will"],"hint":"A decision at the moment of speaking → will."},
              {"type":"choose","q":"I think it ___ rain tomorrow.","options":["will","wills","is"],"a":["will"],"hint":"A prediction → will + verb (no -s)."},
              {"type":"gap","q":"I promise I ___ be late again. (negative)","a":["won't","will not"],"hint":"A promise, negative → won't (will not)."},
              {"type":"gap","q":"That box looks heavy. I ___ carry it for you. (will — an offer)","a":["will","'ll"],"hint":"An offer → will ('ll)."},
              {"type":"fix","q":"Which sentence is correct?","options":["She will call you tonight.","She will calls you tonight.","She wills call you tonight."],"a":["She will call you tonight."],"hint":"will + verb as it is, no -s."}
            ]
          },
          {
            learn: {"title":"I'm going to visit my aunt — going to","rule":"Use am / is / are + going to + verb for plans — things you decided before now: I'm going to visit my aunt next week. We're going to buy a new car. Also use it when you can see that something is going to happen soon: Look at those clouds! It's going to rain.","table":[["Person","be + going to + verb","Example"],["I","am ('m) going to","I'm going to study tonight."],["he / she / it","is ('s) going to","She's going to travel next week."],["you / we / they","are ('re) going to","They're going to move house."]],"examples":["I'm going to study medicine at university.","My sister is going to get married in June.","We're going to watch a film tonight. We already have the tickets.","Look at the sky! It's going to rain.","Are you going to play football after school?","He isn't going to come to the party."],"uz":"be going to — oldindan qilingan reja: I'm going to visit my aunt next week — Kelasi hafta xolamnikiga bormoqchiman."},
            practise: [
              {"type":"choose","q":"I ___ going to visit my grandma on Sunday.","options":["am","is","are"],"a":["am"],"hint":"With I, use am going to."},
              {"type":"choose","q":"Look at those black clouds! It ___ rain.","options":["is going to","will to","going to"],"a":["is going to"],"hint":"We can see it now → It is going to rain."},
              {"type":"gap","q":"We ___ going to watch a film tonight. (be)","a":["are","'re"],"hint":"With we, use are going to."},
              {"type":"gap","q":"She ___ going to come to the party. She's ill. (negative)","a":["isn't","is not","'s not"],"hint":"With she, the negative is isn't (is not) going to."},
              {"type":"order","q":"Put the words in order.","words":["going","I'm","to","football","play"],"a":["I'm going to play football."],"hint":"I'm + going to + play + football."}
            ]
          },
          {
            learn: {"title":"will or going to?","rule":"Ask yourself: when did I decide? A plan made before now → going to: I'm going to see the dentist tomorrow (I have an appointment). A decision at the moment of speaking, an offer or a promise → will: Oh no, I forgot my pen! — Don't worry, I'll lend you mine.","table":[["Situation","Use","Example"],["a plan made before","going to","We're going to fly to Rome in May. We have the tickets."],["a decision now","will","I'm hungry. I'll make a sandwich."],["an offer","will","You look tired. I'll cook dinner."],["something we can see now","going to","Watch out! You're going to fall!"]],"examples":["A: We need milk. B: OK, I'll buy some.","I bought paint yesterday. I'm going to paint my room this weekend.","A: Somebody's at the door. B: I'll open it.","We're going to have a party on Saturday. We sent the invitations last week.","Look! That boy is going to fall off his bike!"],"uz":"Oldindan rejalashtirilgan ish — going to; hozir qaror qilingan ish, taklif yoki va’da — will."},
            practise: [
              {"type":"choose","q":"A: There's no bread. B: Oh, I ___ go and buy some. (decided just now)","options":["will","am going to"],"a":["will"],"hint":"A decision at the moment of speaking → will."},
              {"type":"choose","q":"I ___ visit Paris next month. I already have my tickets. (a plan)","options":["am going to","will"],"a":["am going to"],"hint":"A plan made before → going to."},
              {"type":"choose","q":"A: I can't open this jar. B: Give it to me. I ___ open it for you. (an offer)","options":["will","am going to"],"a":["will"],"hint":"An offer → will."},
              {"type":"gap","q":"We ___ going to move to a new flat next year. We bought it last month. (be)","a":["are","'re"],"hint":"A plan made before → We are going to…"},
              {"type":"fix","q":"Which sentence is correct?","options":["Look at the clouds! It's going to rain.","Look at the clouds! It's going rain.","Look at the clouds! It going to rain."],"a":["Look at the clouds! It's going to rain."],"hint":"It's (It is) + going to + rain."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"Someone is at the door. I ___ open it. (a decision now)","options":["will","am going to"],"a":["will"]},
          {"type":"choose","q":"We ___ going to visit our cousins next weekend.","options":["are","is","will"],"a":["are"]},
          {"type":"gap","q":"I promise I ___ forget your birthday. (negative of will)","a":["won't","will not"]},
          {"type":"choose","q":"___ you go out last night?","options":["Did","Were","Do"],"a":["Did"],"from":"g31"},
          {"type":"gap","q":"Look at that ball! It's going ___ hit the window.","a":["to"]},
          {"type":"choose","q":"I think you ___ love this book.","options":["will","are going","wills"],"a":["will"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She is going to study medicine.","She going to study medicine.","She is going to studies medicine."],"a":["She is going to study medicine."]},
          {"type":"order","q":"Put the words in order.","words":["going","We're","to","new","buy","a","car"],"a":["We're going to buy a new car."]},
          {"type":"gap","q":"We ___ a great time at the party last night. (have)","a":["had"],"from":"g30"},
          {"type":"choose","q":"A: I'm cold. B: I ___ close the window for you. (an offer)","options":["will","am going to"],"a":["will"]},
          {"type":"gap","q":"My sister ___ going to get married in June. (be)","a":["is","'s"]},
          {"type":"choose","q":"I ___ start a new job on Monday. I signed the contract last week. (a plan)","options":["am going to","will"],"a":["am going to"]},
          {"type":"gap","q":"Where ___ you yesterday? (be)","a":["were"],"from":"g29"},
          {"type":"fix","q":"Which sentence is correct?","options":["Will you help me, please?","Will you helping me, please?","Will you to help me, please?"],"a":["Will you help me, please?"]},
          {"type":"order","q":"Put the words in order.","words":["you","Are","going","to","tonight","study"],"a":["Are you going to study tonight?"]},
          {"type":"choose","q":"It's late. I think I ___ go to bed now. (a decision now)","options":["will","am going to"],"a":["will"]},
          {"type":"choose","q":"Listen! Someone ___ at the door.","options":["is knocking","knocks","knock"],"a":["is knocking"],"from":"g16"},
          {"type":"gap","q":"I ___ going to watch TV tonight. I have a lot of homework. (negative)","a":["'m not","am not"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I think it will be sunny tomorrow.","I think it wills be sunny tomorrow.","I think it will is sunny tomorrow."],"a":["I think it will be sunny tomorrow."]},
          {"type":"choose","q":"We ___ fly to Rome in May. We have the tickets. (a plan)","options":["are going to","will"],"a":["are going to"]}
        ]
      }
    ]
    },
    {
      id: "preintermediate", name: "Pre-Intermediate", lessons: [
      {
        id: "g33", no: 33, title: "Present Continuous for Future Arrangements", v: 1,
        chunks: [
          {
            learn: {"title":"I'm meeting Tom on Friday — fixed plans","rule":"We can use the present continuous (am / is / are + -ing) to talk about the future when a plan is already fixed — we have arranged a time, a place or other people, and it is often in our diary or calendar: I'm meeting Tom at six. We're flying to Rome on Monday. Always say when: tonight, tomorrow, on Friday, next week, at seven o'clock.","table":[["Person","be + -ing","Future time"],["I","am ('m) meeting","my friends tonight."],["he / she / it","is ('s) playing","tennis on Saturday."],["you / we / they","are ('re) flying","to Rome next week."]],"examples":["I'm meeting my friends tonight.","She's playing tennis with Anna on Saturday.","We're flying to Rome next Monday.","My parents are coming to dinner tomorrow.","I'm seeing the dentist at four o'clock this afternoon.","Tom is starting his new job on the first of June."],"uz":"Oldindan kelishilgan reja uchun Present Continuous ishlatiladi: I'm meeting Tom tomorrow — Ertaga Tom bilan uchrashaman."},
            practise: [
              {"type":"choose","q":"I ___ my grandparents next Sunday. It's in my diary.","options":["am visiting","visiting","visited"],"a":["am visiting"],"hint":"A fixed plan for the future → am + -ing: I am visiting."},
              {"type":"choose","q":"We ___ to Paris on Friday. We have the tickets.","options":["are flying","flying","flew"],"a":["are flying"],"hint":"A fixed plan → are + -ing: We are flying."},
              {"type":"gap","q":"She ___ her friends at the cinema at eight tonight. (meet — a fixed plan)","a":["is meeting","'s meeting","is going to meet","'s going to meet"],"hint":"A fixed plan → is + -ing: She is meeting."},
              {"type":"gap","q":"My brother ___ married in June. (get — a fixed plan)","a":["is getting","'s getting","is going to get","'s going to get"],"hint":"A fixed plan → is + -ing: is getting."},
              {"type":"fix","q":"Which sentence is correct?","options":["We're having a party on Saturday.","We having a party on Saturday.","We're have a party on Saturday."],"a":["We're having a party on Saturday."],"hint":"be + -ing: We're (We are) having."}
            ]
          },
          {
            learn: {"title":"Are you doing anything tonight? — negatives and questions","rule":"Negative: am not / isn't / aren't + -ing: I'm not working tomorrow. Question: Am / Is / Are + person + -ing: Are you doing anything this weekend? With a question word: What are you doing tonight? Where is she going on holiday? This is a very common way to ask about someone's plans.","table":[["Negative","Question"],["I'm not working on Saturday.","Are you working on Saturday?"],["She isn't coming to the party.","Is she coming to the party?"],["They aren't leaving until Monday.","When are they leaving?"]],"examples":["I'm not going to school tomorrow. It's a holiday.","Are you doing anything this evening?","What are you doing at the weekend?","Sam isn't coming to the meeting on Friday.","When are your cousins arriving?","Where are you going on holiday this summer?"],"uz":"Rejani so‘rash: What are you doing tonight? — Bugun kechqurun nima qilmoqchisiz?"},
            practise: [
              {"type":"choose","q":"___ you doing anything on Saturday evening?","options":["Are","Do","Is"],"a":["Are"],"hint":"Question: Are + you + -ing?"},
              {"type":"choose","q":"She ___ to the party tomorrow. She's ill.","options":["isn't coming","doesn't coming","not coming"],"a":["isn't coming"],"hint":"Negative: isn't + -ing."},
              {"type":"gap","q":"What ___ you doing this weekend? (be)","a":["are"],"hint":"Question: What + are + you + doing?"},
              {"type":"gap","q":"I ___ tomorrow. I have a day off. (not / work — a fixed plan)","a":["'m not working","am not working","'m not going to work","am not going to work"],"hint":"Negative with I: I'm not (I am not) + working."},
              {"type":"order","q":"Put the words in order.","words":["are","When","leaving","you"],"a":["When are you leaving?"],"hint":"When + are + you + leaving?"}
            ]
          },
          {
            learn: {"title":"Now or in the future? — the time word tells you","rule":"The same form, am / is / are + -ing, can be about now or about a future plan. The time words show which one: I'm working now (at this moment). I'm working tomorrow (a plan). Words for now: now, at the moment, Look!, Listen! Words for the future: tonight, tomorrow, this weekend, next week, on Monday, in July.","table":[["Now","A future plan"],["I'm cooking dinner now.","I'm cooking dinner for my friends on Saturday."],["Look! Anna is leaving.","Anna is leaving for Canada next month."],["We're watching a film at the moment.","We're watching a film tonight."]],"examples":["I'm reading a good book at the moment.","I'm meeting Kate for lunch tomorrow.","Listen! Someone is playing the piano.","We're playing in a concert next Friday.","She's working from home today.","He's travelling to China next month."],"uz":"Bir xil shakl hozirgi ishni ham, kelajakdagi rejani ham bildiradi — buni vaqt so‘zi (now, tomorrow) ko‘rsatadi."},
            practise: [
              {"type":"choose","q":"Which sentence is about a future plan?","options":["I'm meeting Kate tomorrow.","I'm meeting Kate now.","I met Kate yesterday."],"a":["I'm meeting Kate tomorrow."],"hint":"tomorrow = the future → a plan."},
              {"type":"choose","q":"We're having dinner with our neighbours ___.","options":["next Saturday","last Saturday","yesterday"],"a":["next Saturday"],"hint":"be + -ing with a future time = a plan."},
              {"type":"gap","q":"They ___ to London next week. (move — a fixed plan)","a":["are moving","'re moving","are going to move","'re going to move"],"hint":"A fixed plan → are + -ing: They are moving."},
              {"type":"gap","q":"Shh! The baby ___ at the moment. (sleep)","a":["is sleeping","'s sleeping"],"hint":"at the moment = now → is + -ing."},
              {"type":"fix","q":"Which sentence is correct?","options":["I'm seeing the doctor on Monday.","I seeing the doctor on Monday.","I'm see the doctor on Monday."],"a":["I'm seeing the doctor on Monday."],"hint":"I'm (I am) + seeing."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"We ___ to the cinema tonight. We have the tickets.","options":["are going","going","went"],"a":["are going"]},
          {"type":"gap","q":"My sister ___ married next month. (get — a fixed plan)","a":["is getting","'s getting","is going to get","'s going to get"]},
          {"type":"choose","q":"___ you doing anything tomorrow evening?","options":["Are","Do","Will"],"a":["Are"]},
          {"type":"choose","q":"I'm hungry. I think I ___ make a sandwich. (a decision now)","options":["will","am going to"],"a":["will"],"from":"g32"},
          {"type":"gap","q":"I ___ to the party on Saturday. I'm going to my cousin's wedding. (not / go — a fixed plan)","a":["'m not going","am not going","'m not going to go","am not going to go"]},
          {"type":"choose","q":"What ___ you doing this weekend?","options":["are","do","is"],"a":["are"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She's flying to New York on Monday.","She flying to New York on Monday.","She's fly to New York on Monday."],"a":["She's flying to New York on Monday."]},
          {"type":"order","q":"Put the words in order.","words":["are","They","tomorrow","coming"],"a":["They are coming tomorrow.","Are they coming tomorrow?","Tomorrow they are coming."]},
          {"type":"choose","q":"Be quiet! The baby ___.","options":["is sleeping","sleeps","sleep"],"a":["is sleeping"],"from":"g16"},
          {"type":"gap","q":"Where ___ you going on holiday this summer? (be)","a":["are"]},
          {"type":"choose","q":"Which sentence is about a future plan?","options":["We're playing tennis on Sunday.","We're playing tennis now.","We played tennis on Sunday."],"a":["We're playing tennis on Sunday."]},
          {"type":"gap","q":"He ___ his grandparents tomorrow. (visit — a fixed plan)","a":["is visiting","'s visiting","is going to visit","'s going to visit"]},
          {"type":"gap","q":"___ you see the match last night?","a":["Did"],"from":"g31"},
          {"type":"fix","q":"Which sentence is correct?","options":["Are you coming to my party?","Do you coming to my party?","Are you come to my party?"],"a":["Are you coming to my party?"]},
          {"type":"order","q":"Put the words in order.","words":["meeting","I'm","Kate","at","six"],"a":["I'm meeting Kate at six.","At six I'm meeting Kate."]},
          {"type":"choose","q":"My parents ___ home until late tonight.","options":["aren't coming","don't coming","not coming"],"a":["aren't coming"]},
          {"type":"choose","q":"I ___ at home yesterday evening.","options":["was","were","am"],"a":["was"],"from":"g29"},
          {"type":"gap","q":"We ___ dinner with Sam tonight. We booked a table. (have — a fixed plan)","a":["are having","'re having","are going to have","'re going to have"]},
          {"type":"choose","q":"When ___ your brother leaving for university?","options":["is","does","are"],"a":["is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I'm not working tomorrow.","I'm not work tomorrow.","I don't working tomorrow."],"a":["I'm not working tomorrow."]}
        ]
      },
      {
        id: "g34", no: 34, title: "Will vs Going To vs Present Continuous", v: 1,
        chunks: [
          {
            learn: {"title":"Three ways to talk about the future","rule":"will → a decision you make now, an offer or a promise: I'm cold. I'll close the window. be going to → a plan or intention you decided before: I'm going to learn Spanish this year. Present continuous → a fixed arrangement, with a time, a place or other people already arranged: I'm meeting Sam at the café at six.","table":[["Form","Use","Example"],["will","a decision now, an offer, a promise","I'm cold. I'll close the window."],["be going to","a plan or intention","I'm going to learn to drive this year."],["present continuous","a fixed arrangement (time, place, people)","I'm meeting Sam at the café at six."]],"examples":["A: The phone's ringing. B: I'll answer it.","I'll help you with those bags.","I'm going to save money for a new laptop.","We're going to paint the kitchen this summer.","I'm having lunch with my boss on Friday.","They're getting married on the 3rd of May."],"uz":"will — hozir qilingan qaror, going to — niyat, Present Continuous — aniq kelishilgan reja."},
            practise: [
              {"type":"choose","q":"A: The phone is ringing. B: I ___ answer it. (a decision now)","options":["will","am going to","am answering"],"a":["will"],"hint":"A decision at the moment of speaking → will."},
              {"type":"choose","q":"I ___ my cousins at the airport at six tomorrow. We arranged it last week.","options":["am meeting","meet","met"],"a":["am meeting"],"hint":"A fixed arrangement with a time and place → present continuous."},
              {"type":"gap","q":"I've decided. I ___ going to study medicine. (be)","a":["am","'m"],"hint":"A plan or intention → I am going to…"},
              {"type":"gap","q":"A: I'm thirsty. B: Wait, I ___ get you some water. (an offer)","a":["will","'ll"],"hint":"An offer → will ('ll)."},
              {"type":"fix","q":"Which sentence is correct?","options":["I'll carry your bag for you.","I'll carrying your bag for you.","I'll to carry your bag for you."],"a":["I'll carry your bag for you."],"hint":"An offer → I'll + verb (no to)."}
            ]
          },
          {
            learn: {"title":"Predictions: I think it will… / It's going to…","rule":"Both will and be going to can say what we expect to happen. Use will for what you think or believe — often after I think, I'm sure, maybe, probably: I'm sure you'll pass the exam. Use be going to when you can see something now that shows what will happen: Look at those clouds — it's going to rain. She's running very fast — she's going to win.","table":[["A prediction from…","Use","Example"],["what I think or believe","will","I'm sure you'll like the film."],["something I can see now","be going to","Watch out! That glass is going to fall."]],"examples":["I think it will be sunny tomorrow.","Maybe people will live on Mars one day.","I'm sure you'll pass the test.","Look at that man on the ladder! He's going to fall.","The sky is very dark. It's going to rain.","She's very tired. She's going to fall asleep."],"uz":"Fikrga asoslangan bashorat — will (I think…), ko‘rinib turgan belgiga asoslangan bashorat — going to."},
            practise: [
              {"type":"choose","q":"Look at those black clouds! It ___ rain. (I can see it now)","options":["is going to","will"],"a":["is going to"],"hint":"A prediction from what you can see now → going to."},
              {"type":"choose","q":"I'm sure you ___ enjoy the concert.","options":["will","are","wills"],"a":["will"],"hint":"I'm sure + will + verb (no -s)."},
              {"type":"gap","q":"Be careful! You ___ going to drop those plates! (be)","a":["are","'re"],"hint":"You can see it now → You are going to drop them."},
              {"type":"gap","q":"Don't worry about the test. I'm sure it ___ be difficult. (will — negative)","a":["won't","will not"],"hint":"Negative of will → won't (will not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["He's running too fast. He's going to fall.","He's running too fast. He's going fall.","He's running too fast. He going to fall."],"a":["He's running too fast. He's going to fall."],"hint":"He's (He is) + going to + fall."}
            ]
          },
          {
            learn: {"title":"Plan, arrangement or decision now?","rule":"Ask yourself two questions. Did I decide before now? If not — it's a decision now, an offer or a promise → will. If yes — is it only an intention (I have decided, but no details yet) → be going to; or is it arranged with a time, a place or other people → present continuous. For an arrangement, be going to is usually correct too.","table":[["Situation","Example"],["an intention (decided, no details yet)","I'm going to learn to swim this summer."],["a fixed arrangement (time, place, people)","I'm having lunch with Kate on Friday at one."],["a decision now (not a plan)","There's no milk. I'll get some."]],"examples":["A: We've got no bread. B: I'll go to the shop.","I'm going to start running in the mornings.","We're visiting my uncle in Leeds next weekend.","A: Are you free tomorrow? B: No, I'm working all day.","I'm going to tidy my room after dinner."],"uz":"Niyat — going to; vaqti va joyi kelishilgan reja — Present Continuous; hozir qilingan qaror — will."},
            practise: [
              {"type":"choose","q":"A: Are you free on Friday? B: No, I ___ my aunt. We arranged it last week.","options":["'m visiting","'ll visit","visit"],"a":["'m visiting"],"hint":"Arranged before, with a day → present continuous."},
              {"type":"choose","q":"A: I can't do this homework. B: Don't worry. I ___ help you. (an offer)","options":["'ll","'m going to","'m helping"],"a":["'ll"],"hint":"An offer → will ('ll)."},
              {"type":"gap","q":"We ___ going to paint the kitchen this weekend. We bought the paint yesterday. (be)","a":["are","'re"],"hint":"A plan made before → We are going to…"},
              {"type":"gap","q":"A: What are your plans for tomorrow? B: I ___ football with Ben at ten. (play — arranged)","a":["'m playing","am playing","'m going to play","am going to play"],"hint":"Arranged with Ben at ten → I'm (I am) playing."},
              {"type":"order","q":"Put the words in order.","words":["is","Anna","going","to","learn","Japanese"],"a":["Anna is going to learn Japanese.","Is Anna going to learn Japanese?"],"hint":"Anna + is going to + learn + Japanese."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"A: It's very hot in here. B: I ___ open the window. (a decision now)","options":["will","am going to","am opening"],"a":["will"]},
          {"type":"choose","q":"Look out! That box ___ fall on your head! (I can see it now)","options":["is going to","will","falls"],"a":["is going to"]},
          {"type":"gap","q":"I ___ my best friend at the café at four tomorrow. (meet — arranged)","a":["'m meeting","am meeting","'m going to meet","am going to meet"]},
          {"type":"gap","q":"I promise I ___ tell anyone. (negative of will)","a":["won't","will not"],"from":"g32"},
          {"type":"choose","q":"I'm sure you ___ love this book.","options":["will","are loving","wills"],"a":["will"]},
          {"type":"gap","q":"She has decided: she ___ going to study law. (be)","a":["is","'s"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I think it will snow tomorrow.","I think it snows tomorrow.","I think it will snows tomorrow."],"a":["I think it will snow tomorrow."]},
          {"type":"order","q":"Put the words in order.","words":["going","We're","to","a","house","buy"],"a":["We're going to buy a house."]},
          {"type":"choose","q":"A: We haven't got any bread. B: OK, I ___ some on my way home. (a decision now)","options":["'ll buy","'m buying","bought"],"a":["'ll buy"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Where did you go yesterday?","Where did you went yesterday?","Where you went yesterday?"],"a":["Where did you go yesterday?"],"from":"g31"},
          {"type":"gap","q":"Watch out! You ___ going to hit that tree! (be)","a":["are","'re"]},
          {"type":"choose","q":"My brother ___ his driving test next Tuesday at nine. It's booked.","options":["is taking","take","taking"],"a":["is taking"]},
          {"type":"choose","q":"She usually walks to school, but today she ___ the bus.","options":["is taking","takes","take"],"a":["is taking"],"from":"g16"},
          {"type":"fix","q":"Which sentence is correct?","options":["Are you going to watch the match tonight?","Are you going watch the match tonight?","Do you going to watch the match tonight?"],"a":["Are you going to watch the match tonight?"]},
          {"type":"order","q":"Put the words in order.","words":["will","Maybe","be","it","sunny","tomorrow"],"a":["Maybe it will be sunny tomorrow.","Maybe tomorrow it will be sunny."]},
          {"type":"gap","q":"A: Somebody is at the door. B: I ___ go. (a decision now)","a":["will","'ll"]},
          {"type":"gap","q":"My parents ___ a new car last month. (buy)","a":["bought"],"from":"g30"},
          {"type":"choose","q":"It's 8:55 and the lesson starts at nine. Hurry! We ___ be late!","options":["are going to","are being","be"],"a":["are going to"]},
          {"type":"gap","q":"I've got the tickets. We ___ to Rome on Friday morning. (fly — arranged)","a":["'re flying","are flying","'re going to fly","are going to fly"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Don't worry, I'll help you.","Don't worry, I'll helping you.","Don't worry, I'll to help you."],"a":["Don't worry, I'll help you."]}
        ]
      },
      {
        id: "g35", no: 35, title: "Past Continuous", v: 1,
        chunks: [
          {
            learn: {"title":"I was reading, they were playing","rule":"The past continuous = was / were + -ing. Use it for an action that was in progress (happening) at a time in the past: At eight o'clock last night I was watching TV (I started before eight and finished after eight). Use was with I, he, she, it and were with you, we, they.","table":[["Person","was / were + -ing","Example"],["I / he / she / it","was working","At ten she was working."],["you / we / they","were working","At ten we were working."]],"examples":["At eight o'clock last night I was watching TV.","She was reading a book at ten.","We were having dinner at seven.","It was raining all morning.","The children were playing in the garden.","This time yesterday I was sitting on a plane."],"uz":"Past Continuous — o‘tmishda ma’lum bir paytda davom etayotgan ish: At nine I was reading — Soat to‘qqizda kitob o‘qiyotgan edim."},
            practise: [
              {"type":"choose","q":"At nine o'clock last night I ___ TV.","options":["was watching","were watching","am watching"],"a":["was watching"],"hint":"Past, in progress, with I → was + -ing."},
              {"type":"choose","q":"They ___ football at four yesterday afternoon.","options":["were playing","was playing","are playing"],"a":["were playing"],"hint":"With they → were + -ing."},
              {"type":"gap","q":"At ten o'clock last night she ___ a book. (read — was/were + -ing)","a":["was reading"],"hint":"With she → was + reading."},
              {"type":"gap","q":"At seven yesterday evening we ___ dinner. (have — was/were + -ing)","a":["were having"],"hint":"With we → were + having."},
              {"type":"fix","q":"Which sentence is correct?","options":["It was raining all day yesterday.","It were raining all day yesterday.","It was rain all day yesterday."],"a":["It was raining all day yesterday."],"hint":"With it → was + -ing: was raining."}
            ]
          },
          {
            learn: {"title":"What were you doing? — negatives and questions","rule":"Negative: wasn't (was not) / weren't (were not) + -ing: I wasn't sleeping. Question: Was / Were + person + -ing: Were you sleeping? With a question word: What were you doing at eight? Short answers: Yes, I was. / No, I wasn't. Yes, they were. / No, they weren't.","table":[["Negative","Question","Short answer"],["I wasn't sleeping.","Were you sleeping?","Yes, I was. / No, I wasn't."],["She wasn't listening.","Was she listening?","Yes, she was. / No, she wasn't."],["They weren't working.","Were they working?","Yes, they were. / No, they weren't."]],"examples":["I wasn't sleeping at eleven. I was reading.","Sorry, I wasn't listening. Can you say that again?","Were you working at six yesterday? — Yes, I was.","What were you doing at midnight?","Was it snowing this morning? — No, it wasn't.","Why were they laughing?"],"uz":"So‘roq: Was / Were + shaxs + -ing: What were you doing? — Nima qilayotgan edingiz?"},
            practise: [
              {"type":"choose","q":"___ you sleeping at eleven last night?","options":["Were","Was","Did"],"a":["Were"],"hint":"Question with you → Were + you + -ing?"},
              {"type":"choose","q":"Sorry, I ___ listening. Can you say that again?","options":["wasn't","weren't","didn't"],"a":["wasn't"],"hint":"Negative with I → wasn't + -ing."},
              {"type":"gap","q":"What ___ you doing at eight o'clock yesterday evening?","a":["were"],"hint":"Question with you → What + were + you + doing?"},
              {"type":"gap","q":"They ___ at three yesterday. They were at the beach. (not / work — was/were + -ing)","a":["weren't working","were not working"],"hint":"Negative with they → weren't (were not) + working."},
              {"type":"order","q":"Put the words in order.","words":["was","What","doing","she"],"a":["What was she doing?"],"hint":"What + was + she + doing?"}
            ]
          },
          {
            learn: {"title":"The sun was shining… — setting the scene","rule":"We often begin a story with the past continuous to describe the scene — what was happening around us: It was a cold evening. Snow was falling and people were hurrying home. We also use it for two longer actions that were happening at the same time: Mum was cooking and Dad was reading. Don't use it with state verbs like know, like, want, need: I knew the answer (not I was knowing).","table":[["Use","Example"],["the scene of a story","The sun was shining and the birds were singing."],["two actions at the same time","Mum was cooking and Dad was reading the paper."],["state verbs → past simple","I wanted a drink. (not I was wanting)"]],"examples":["It was a beautiful morning. The sun was shining.","People were sitting in the park and children were playing.","I was doing my homework and my brother was playing games.","Everybody was talking and laughing.","I didn't know the answer. (not wasn't knowing)"],"uz":"Hikoyada vaziyatni tasvirlash uchun Past Continuous ishlatiladi; know, like, want kabi fe’llar -ing olmaydi."},
            practise: [
              {"type":"choose","q":"It was a lovely day. The sun ___ and the birds were singing.","options":["was shining","were shining","shining"],"a":["was shining"],"hint":"The sun = it → was + -ing."},
              {"type":"choose","q":"I ___ the answer to the last question.","options":["knew","was knowing","were knowing"],"a":["knew"],"hint":"know is a state verb → no -ing: knew."},
              {"type":"gap","q":"Mum was cooking and Dad ___ the newspaper. (read — was/were + -ing)","a":["was reading"],"hint":"Two actions at the same time → was reading."},
              {"type":"gap","q":"At midnight we ___ to music and dancing. (listen — was/were + -ing)","a":["were listening"],"hint":"With we → were + listening."},
              {"type":"fix","q":"Which sentence is correct?","options":["She wanted a glass of water.","She was wanting a glass of water.","She were wanting a glass of water."],"a":["She wanted a glass of water."],"hint":"want is a state verb → past simple: wanted."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"At six o'clock yesterday we ___ dinner.","options":["were having","was having","are having"],"a":["were having"]},
          {"type":"gap","q":"At ten last night I ___ a film. (watch — was/were + -ing)","a":["was watching"]},
          {"type":"choose","q":"___ it raining when you left home?","options":["Was","Were","Did"],"a":["Was"]},
          {"type":"choose","q":"She didn't ___ me an email yesterday.","options":["send","sent","sends"],"a":["send"],"from":"g31"},
          {"type":"gap","q":"They ___ at four yesterday. They were at the cinema. (not / study — was/were + -ing)","a":["weren't studying","were not studying"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The children were playing in the garden.","The children was playing in the garden.","The children were play in the garden."],"a":["The children were playing in the garden."]},
          {"type":"choose","q":"What ___ you doing at midnight?","options":["were","was","did"],"a":["were"]},
          {"type":"order","q":"Put the words in order.","words":["was","He","a","shower","having"],"a":["He was having a shower.","Was he having a shower?"]},
          {"type":"choose","q":"We ___ a great film last weekend.","options":["saw","seed","see"],"a":["saw"],"from":"g30"},
          {"type":"gap","q":"It ___ all morning, so we stayed at home. (snow — was/were + -ing)","a":["was snowing"]},
          {"type":"choose","q":"I ___ his name, but I forgot it.","options":["knew","was knowing","were knowing"],"a":["knew"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Were you sleeping at eleven?","Was you sleeping at eleven?","Did you sleeping at eleven?"],"a":["Were you sleeping at eleven?"]},
          {"type":"gap","q":"Was Tom working yesterday afternoon? — No, he ___.","a":["wasn't","was not"]},
          {"type":"choose","q":"My parents ___ going to buy a new car next year.","options":["are","is","will"],"a":["are"],"from":"g32"},
          {"type":"order","q":"Put the words in order.","words":["were","What","doing","they"],"a":["What were they doing?"]},
          {"type":"choose","q":"This time yesterday I ___ on the beach.","options":["was lying","were lying","am lying"],"a":["was lying"]},
          {"type":"choose","q":"This test is ___ than the last one.","options":["easier","easyer","more easy"],"a":["easier"],"from":"g26"},
          {"type":"gap","q":"My brother was playing games and my sister ___ to music. (listen — was/were + -ing)","a":["was listening"]},
          {"type":"choose","q":"Sorry, we ___ attention. Can you explain it again?","options":["weren't paying","wasn't paying","didn't paying"],"a":["weren't paying"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I wasn't working at five.","I weren't working at five.","I wasn't work at five."],"a":["I wasn't working at five."]}
        ]
      },
      {
        id: "g36", no: 36, title: "Past Simple vs Past Continuous", v: 1,
        chunks: [
          {
            learn: {"title":"I was walking home when it started to rain","rule":"Use the two tenses together when a short action happens in the middle of a longer one. The longer action (it was already happening) → past continuous. The short action (it interrupted the longer one) → past simple, often after when: I was having a shower when the phone rang.","table":[["Longer action (past continuous)","Short action (past simple)"],["I was having a shower","when the phone rang."],["We were watching TV","when the lights went out."],["She was walking home","when it started to rain."]],"examples":["I was having a shower when the phone rang.","We were watching TV when the lights went out.","She was walking home when it started to rain.","Tom was cooking when he cut his finger.","When I arrived, they were having dinner.","What were you doing when I called you?"],"uz":"Uzoq davom etgan ish — Past Continuous, uni bo‘lgan qisqa ish — Past Simple: I was reading when he came — U kelganda kitob o‘qiyotgan edim."},
            practise: [
              {"type":"choose","q":"I ___ a bath when the phone rang. (the longer action)","options":["was having","had","have"],"a":["was having"],"hint":"The longer action → past continuous: was having."},
              {"type":"choose","q":"We were watching TV when the lights ___ out. (the short action)","options":["went","were going","go"],"a":["went"],"hint":"The short action → past simple: went."},
              {"type":"gap","q":"She ___ home when she saw the accident. (walk — the longer action)","a":["was walking"],"hint":"The longer action → was + walking."},
              {"type":"gap","q":"Tom was cooking when he ___ his finger. (cut — the short action)","a":["cut"],"hint":"The short action → past simple: cut (cut – cut – cut)."},
              {"type":"fix","q":"Which sentence is correct?","options":["When I arrived, they were having dinner.","When I arrived, they was having dinner.","When I arrived, they having dinner."],"a":["When I arrived, they were having dinner."],"hint":"they → were + having."}
            ]
          },
          {
            learn: {"title":"while and when","rule":"Use while before the longer action — it means 'during the time that': While I was walking to school, I met an old friend. Use when before the short action: I was walking to school when I met an old friend. Two longer actions at the same time: While I was cooking, my sister was setting the table.","table":[["","Example"],["while + the longer action","While I was walking to school, I met an old friend."],["when + the short action","I was walking to school when I met an old friend."],["while + two longer actions","While I was cooking, my sister was setting the table."]],"examples":["While I was waiting for the bus, it started to rain.","The phone rang while we were having dinner.","I was walking home when I saw a fox.","While Dad was washing the car, Mum was watering the garden.","She fell asleep while she was watching the film."],"uz":"while dan keyin davom etayotgan ish (Past Continuous), when dan keyin ko‘pincha qisqa ish (Past Simple) keladi."},
            practise: [
              {"type":"choose","q":"___ I was waiting for the bus, it started to rain.","options":["While","During","Then"],"a":["While"],"hint":"while + the longer action (was waiting)."},
              {"type":"choose","q":"I was walking home ___ I saw a fox.","options":["when","while","during"],"a":["when"],"hint":"when + the short action (saw)."},
              {"type":"gap","q":"While we ___ dinner, the lights went out. (have — the longer action)","a":["were having"],"hint":"while + the longer action → were having."},
              {"type":"gap","q":"While Dad was washing the car, Mum ___ the garden. (water — was/were + -ing)","a":["was watering"],"hint":"Two longer actions at the same time → was watering."},
              {"type":"order","q":"Put the words in order.","words":["was","She","sleeping","when","her","brother","arrived"],"a":["She was sleeping when her brother arrived.","Her brother arrived when she was sleeping.","When her brother arrived she was sleeping.","When she was sleeping her brother arrived."],"hint":"She was sleeping (longer) + when + her brother arrived (short)."}
            ]
          },
          {
            learn: {"title":"When she arrived, we had dinner / we were having dinner","rule":"Past simple + when + past simple = one action after the other: When Kate arrived, we had dinner (first Kate arrived, then we ate). Past continuous + when + past simple = the first action had already started: When Kate arrived, we were having dinner (we were in the middle of dinner). For a list of actions in a story, one after another, use the past simple: I got up, had a shower and went out.","table":[["Sentence","Meaning"],["When Kate arrived, we had dinner.","First Kate arrived, then we ate."],["When Kate arrived, we were having dinner.","We were already eating when she came."],["I opened the door and saw a cat.","Two actions, one after the other."]],"examples":["When the film ended, we went home.","When I got to the station, my train was leaving.","She opened the box and found a ring.","When the teacher came in, the students were talking.","When the teacher came in, the students stood up."],"uz":"When she came, we had lunch — u kelgach, tushlik qildik; we were having lunch — u kelganda tushlik qilayotgan edik."},
            practise: [
              {"type":"choose","q":"Which sentence means 'we started eating before Kate came'?","options":["When Kate arrived, we were having dinner.","When Kate arrived, we had dinner."],"a":["When Kate arrived, we were having dinner."],"hint":"were having = we were already in the middle of dinner."},
              {"type":"choose","q":"First the alarm rang, then I got up. → When the alarm rang, I ___ up.","options":["got","was getting"],"a":["got"],"hint":"One action after the other → past simple: got."},
              {"type":"gap","q":"I opened the door and ___ a big dog. (see)","a":["saw"],"hint":"Actions one after the other → past simple: saw."},
              {"type":"gap","q":"When we got to the station, the train ___. We had to run! (leave — was/were + -ing)","a":["was leaving"],"hint":"The train had already started to leave → was leaving."},
              {"type":"fix","q":"Which sentence is correct?","options":["The phone rang while I was having a shower.","The phone rang while I was have a shower.","The phone rang while I were having a shower."],"a":["The phone rang while I was having a shower."],"hint":"I → was + having."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ dinner when my friend called. (the longer action)","options":["was cooking","cooked","cook"],"a":["was cooking"]},
          {"type":"choose","q":"We were sitting in the garden when it ___ to rain. (the short action)","options":["started","was starting","starts"],"a":["started"]},
          {"type":"gap","q":"She ___ to music when the teacher came in. (listen — the longer action)","a":["was listening"]},
          {"type":"gap","q":"What time ___ you get up yesterday?","a":["did"],"from":"g31"},
          {"type":"choose","q":"___ I was cleaning my room, I found an old photo.","options":["While","During","Then"],"a":["While"]},
          {"type":"gap","q":"While the children were playing, their parents ___ coffee. (drink — was/were + -ing)","a":["were drinking"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He broke his leg while he was skiing.","He broke his leg while he skiing.","He broke his leg while he were skiing."],"a":["He broke his leg while he was skiing."]},
          {"type":"order","q":"Put the words in order.","words":["was","It","when","raining","we","left"],"a":["It was raining when we left.","We left when it was raining.","When we left it was raining.","When it was raining we left."]},
          {"type":"choose","q":"When the film ended, we ___ home. (first the film ended, then we left)","options":["went","were going"],"a":["went"]},
          {"type":"choose","q":"My dad ___ dinner for us last night.","options":["made","maked","make"],"a":["made"],"from":"g30"},
          {"type":"gap","q":"I ___ a shower when the doorbell rang. (have — the longer action)","a":["was having"]},
          {"type":"choose","q":"What were you doing when the accident ___?","options":["happened","was happening","happens"],"a":["happened"]},
          {"type":"choose","q":"The weather ___ terrible last weekend.","options":["was","were","is"],"a":["was"],"from":"g29"},
          {"type":"fix","q":"Which sentence is correct?","options":["When I got home, my sister was watching TV.","When I got home, my sister watching TV.","When I was get home, my sister was watching TV."],"a":["When I got home, my sister was watching TV."]},
          {"type":"gap","q":"We were walking in the park when we ___ an old friend. (meet — the short action)","a":["met"]},
          {"type":"order","q":"Put the words in order.","words":["were","We","dinner","having","when","the","lights","went","out"],"a":["We were having dinner when the lights went out.","The lights went out when we were having dinner.","When the lights went out we were having dinner.","When we were having dinner the lights went out."]},
          {"type":"choose","q":"A: I don't understand this word. B: I ___ explain it. (an offer)","options":["will","am going to"],"a":["will"],"from":"g32"},
          {"type":"gap","q":"When I arrived at the party, everybody ___. The music was very loud. (dance — was/were + -ing)","a":["was dancing"]},
          {"type":"choose","q":"Which sentence means 'first she came, then we ate'?","options":["When she came, we had lunch.","When she came, we were having lunch."],"a":["When she came, we had lunch."]},
          {"type":"fix","q":"Which sentence is correct?","options":["They were playing tennis when it started to rain.","They was playing tennis when it started to rain.","They were playing tennis when it was start to rain."],"a":["They were playing tennis when it started to rain."]}
        ]
      },
      {
        id: "g37", no: 37, title: "Used To (Past Habits and States)", v: 1,
        chunks: [
          {
            learn: {"title":"I used to play football — past habits","rule":"Use used to + verb for things you did often or regularly in the past but don't do now: I used to play football every day (now I don't). It's the same for every person: I used to, she used to, they used to. After used to, use the verb as it is: used to go (not used to went).","table":[["Then (a past habit)","Now"],["I used to walk to school.","Now I go by bus."],["She used to play the piano.","She doesn't play now."],["We used to go to the beach every summer.","Now we go to the mountains."]],"examples":["I used to play football every day after school.","My grandad used to work on a farm.","We used to go to the beach every summer.","She used to eat a lot of sweets, but now she doesn't.","My dad used to smoke, but he stopped ten years ago."],"uz":"used to + fe’l — o‘tmishda odat bo‘lgan, hozir esa yo‘q ish: I used to play football — Oldin futbol o‘ynardim."},
            practise: [
              {"type":"choose","q":"When I was a child, I ___ play in the park every day.","options":["used to","was used","using to"],"a":["used to"],"hint":"A past habit → used to + verb."},
              {"type":"choose","q":"My dad used to ___ to work by bike.","options":["go","went","going"],"a":["go"],"hint":"After used to, the verb as it is: go."},
              {"type":"gap","q":"She ___ a lot of chocolate, but now she eats fruit. (eat — used to)","a":["used to eat"],"hint":"A past habit → used to + eat."},
              {"type":"gap","q":"We ___ to the beach every summer when I was young. (go — used to)","a":["used to go"],"hint":"A past habit → used to + go."},
              {"type":"fix","q":"Which sentence is correct?","options":["They used to visit us every summer.","They used to visited us every summer.","They were used to visit us every summer."],"a":["They used to visit us every summer."],"hint":"used to + the verb as it is: visit."}
            ]
          },
          {
            learn: {"title":"I used to have long hair — past states","rule":"used to is also for situations that were true for a long time in the past but aren't true now: I used to have long hair (now it's short). There used to be a cinema here (now there isn't). Don't use used to for one action at one time — use the past simple: I visited Rome last year (not I used to visit Rome last year).","table":[["","Example"],["a past state","I used to have long hair. (Now it's short.)"],["there used to be","There used to be a shop here. (Now it's gone.)"],["one action, one time → past simple","I visited Rome in 2019."]],"examples":["My mum used to have long hair.","There used to be a cinema in our town.","This town used to be very quiet.","We used to live in London.","I used to be afraid of dogs, but now I love them."],"uz":"used to o‘tmishdagi holatni ham bildiradi: There used to be a cinema here — Bu yerda oldin kinoteatr bor edi."},
            practise: [
              {"type":"choose","q":"There ___ a cinema in our street, but now it's a supermarket.","options":["used to be","used to is","used be"],"a":["used to be"],"hint":"A past situation → used to be."},
              {"type":"choose","q":"I ___ to Spain last summer. (one time)","options":["went","used to go"],"a":["went"],"hint":"One action at one time → past simple."},
              {"type":"gap","q":"My mum ___ long hair, but now it's short. (have — used to)","a":["used to have"],"hint":"A past state → used to + have."},
              {"type":"gap","q":"This town ___ very quiet, but now it's busy. (be — used to)","a":["used to be"],"hint":"A past state → used to + be."},
              {"type":"fix","q":"Which sentence is correct?","options":["I bought this jacket last week.","I used to buy this jacket last week.","I used buy this jacket last week."],"a":["I bought this jacket last week."],"hint":"One action at one time (last week) → past simple."}
            ]
          },
          {
            learn: {"title":"Did you use to…? — negatives and questions","rule":"Negative: didn't (did not) + use to + verb: I didn't use to like coffee (but now I do). Question: Did + person + use to + verb? Did you use to play football? After did and didn't, write use to (without d) — just like didn't go, didn't play. Short answers: Yes, I did. / No, I didn't.","table":[["Negative","Question","Short answer"],["I didn't use to like vegetables.","Did you use to like vegetables?","Yes, I did. / No, I didn't."],["She didn't use to wear glasses.","Did she use to wear glasses?","Yes, she did. / No, she didn't."]],"examples":["I didn't use to like coffee, but now I drink it every day.","He didn't use to wear glasses.","Did you use to walk to school?","Did your parents use to live here? — Yes, they did.","Where did you use to go on holiday?"],"uz":"Inkor va so‘roqda did dan keyin use to yoziladi: Did you use to swim? — Oldin suzarmidingiz?"},
            practise: [
              {"type":"choose","q":"I ___ like vegetables, but now I love them.","options":["didn't use to","not used to","don't used to"],"a":["didn't use to"],"hint":"Negative → didn't use to + verb."},
              {"type":"choose","q":"___ you use to live in a flat?","options":["Did","Do","Were"],"a":["Did"],"hint":"Question → Did + you + use to + verb?"},
              {"type":"gap","q":"Did you use to play tennis? — Yes, I ___.","a":["did"],"hint":"Did you…? — Yes, I did."},
              {"type":"gap","q":"She ___ wear glasses, but now she does. (not / use to)","a":["didn't use to","did not use to"],"hint":"Negative → didn't (did not) use to."},
              {"type":"order","q":"Put the words in order.","words":["use","Did","to","you","swim"],"a":["Did you use to swim?"],"hint":"Did + you + use to + swim?"}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"When I was young, I ___ climb trees.","options":["used to","use","was"],"a":["used to"]},
          {"type":"gap","q":"My grandparents ___ on a farm. Now they live in a flat. (live — used to)","a":["used to live"]},
          {"type":"choose","q":"There ___ a park here, but now there are houses.","options":["used to be","used to is","used be"],"a":["used to be"]},
          {"type":"choose","q":"___ your sister call you last night?","options":["Did","Was","Does"],"a":["Did"],"from":"g31"},
          {"type":"gap","q":"Did you use to have a pet? — No, I ___.","a":["didn't","did not"]},
          {"type":"choose","q":"We ___ to the cinema last Saturday. (one time)","options":["went","used to go"],"a":["went"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He used to be very shy.","He used to was very shy.","He used be very shy."],"a":["He used to be very shy."]},
          {"type":"order","q":"Put the words in order.","words":["used","We","to","live","here"],"a":["We used to live here."]},
          {"type":"gap","q":"I ___ my keys yesterday, but I found them later. (lose)","a":["lost"],"from":"g30"},
          {"type":"gap","q":"I ___ like fish, but now I love it. (not / use to)","a":["didn't use to","did not use to"]},
          {"type":"choose","q":"Where ___ you use to go on holiday when you were a child?","options":["did","were","do"],"a":["did"]},
          {"type":"fix","q":"Which sentence is correct?","options":["My sister didn't use to like cats.","My sister didn't used to liked cats.","My sister doesn't use to like cats."],"a":["My sister didn't use to like cats."]},
          {"type":"gap","q":"Look at the sky! It's ___ to rain.","a":["going"],"from":"g32"},
          {"type":"gap","q":"This street ___ very busy, but now it's quiet. (be — used to)","a":["used to be"]},
          {"type":"order","q":"Put the words in order.","words":["you","Did","use","to","glasses","wear"],"a":["Did you use to wear glasses?"]},
          {"type":"choose","q":"I ___ my leg in 2020. (one time)","options":["broke","used to break"],"a":["broke"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Were you at the party?","Was you at the party?","Did you at the party?"],"a":["Were you at the party?"],"from":"g29"},
          {"type":"gap","q":"She ___ a lot of sweets when she was a child. (eat — used to)","a":["used to eat"]},
          {"type":"choose","q":"My brother used to ___ a bike to school.","options":["ride","rode","riding"],"a":["ride"]},
          {"type":"fix","q":"Which sentence is correct?","options":["They used to walk to school.","They used to walked to school.","They used walk to school."],"a":["They used to walk to school."]}
        ]
      },
      {
        id: "g38", no: 38, title: "Present Perfect (Introduction)", v: 1,
        chunks: [
          {
            learn: {"title":"I have finished — have / has + past participle","rule":"The present perfect = have / has + past participle (the third form of the verb). Use have with I, you, we, they and has with he, she, it. Short forms: I've, you've, we've, they've, he's, she's, it's. For regular verbs the past participle ends in -ed, like the past simple: work → worked, finish → finished.","table":[["Person","have / has","Past participle","Short form"],["I / you / we / they","have","finished","I've finished"],["he / she / it","has","finished","She's finished"]],"examples":["I have finished my homework.","She has cleaned her room.","We've painted the kitchen.","He's started a new job.","They have opened a new shop in our street.","My parents have travelled to many countries."],"uz":"Present Perfect = have / has + fe’lning 3-shakli: I have finished — Men tugatdim."},
            practise: [
              {"type":"choose","q":"I ___ finished my homework.","options":["have","has","am"],"a":["have"],"hint":"With I → have + past participle."},
              {"type":"choose","q":"She has ___ her room.","options":["cleaned","clean","cleaning"],"a":["cleaned"],"hint":"has + past participle: cleaned."},
              {"type":"gap","q":"We ___ painted the living room. (have / has)","a":["have","'ve"],"hint":"With we → have."},
              {"type":"gap","q":"He has ___ a new job. (start)","a":["started"],"hint":"Regular verb → past participle with -ed: started."},
              {"type":"fix","q":"Which sentence is correct?","options":["They have opened a new shop.","They has opened a new shop.","They have open a new shop."],"a":["They have opened a new shop."],"hint":"they → have + opened."}
            ]
          },
          {
            learn: {"title":"seen, gone, done — irregular past participles","rule":"Many common verbs have an irregular past participle. Sometimes it is the same as the past simple (buy – bought – bought), sometimes it is different (see – saw – seen). Learn them in threes: verb – past simple – past participle.","table":[["Verb","Past simple","Past participle"],["be","was / were","been"],["go","went","gone"],["see","saw","seen"],["do","did","done"],["eat","ate","eaten"],["write","wrote","written"],["break","broke","broken"],["buy","bought","bought"],["lose","lost","lost"]],"examples":["I've seen this film.","She has lost her keys.","We've bought a new car.","He's broken his arm.","They have eaten all the cake.","I've written three emails this morning."],"uz":"Noto‘g‘ri fe’llarning 3-shaklini yodlang: go – went – gone, see – saw – seen, write – wrote – written."},
            practise: [
              {"type":"choose","q":"I have ___ this film before.","options":["seen","saw","see"],"a":["seen"],"hint":"see – saw – seen: have + seen."},
              {"type":"choose","q":"Oh no! I've ___ my phone.","options":["lost","lose","losed"],"a":["lost"],"hint":"lose – lost – lost: have + lost."},
              {"type":"gap","q":"She has ___ a letter to her grandma. (write)","a":["written"],"hint":"write – wrote – written."},
              {"type":"gap","q":"They have ___ all the pizza. (eat)","a":["eaten"],"hint":"eat – ate – eaten."},
              {"type":"fix","q":"Which sentence is correct?","options":["He has broken his arm.","He has broke his arm.","He has breaked his arm."],"a":["He has broken his arm."],"hint":"break – broke – broken."}
            ]
          },
          {
            learn: {"title":"I've lost my keys! — news and results","rule":"Use the present perfect for something that happened in the past when we don't say when, and it is important now: I've lost my keys (I can't open the door now). It is also used to give news: Tom has passed his exam! Negative: haven't / hasn't + past participle. Question: Have / Has + person + past participle? Short answers: Yes, I have. / No, she hasn't.","table":[["Negative","Question","Short answer"],["I haven't finished.","Have you finished?","Yes, I have. / No, I haven't."],["She hasn't called.","Has she called?","Yes, she has. / No, she hasn't."]],"examples":["I've lost my keys. I can't get into the house.","Good news! Anna has passed her driving test.","I haven't finished my homework, so I can't go out.","Has Tom called you? — No, he hasn't.","Have you cleaned your room? — Yes, I have."],"uz":"Natijasi hozir muhim bo‘lgan ish: I've lost my keys — Kalitlarimni yo‘qotib qo‘ydim (hozir eshikni ocha olmayman)."},
            practise: [
              {"type":"choose","q":"___ you cleaned your room?","options":["Have","Has","Are"],"a":["Have"],"hint":"Question with you → Have + you + past participle?"},
              {"type":"choose","q":"She ___ called me. I'm still waiting.","options":["hasn't","haven't","isn't"],"a":["hasn't"],"hint":"Negative with she → hasn't + past participle."},
              {"type":"gap","q":"Has Tom finished his homework? — No, he ___.","a":["hasn't","has not"],"hint":"Has he…? — No, he hasn't."},
              {"type":"gap","q":"I can't go out. I ___ my homework. (not / finish — present perfect)","a":["haven't finished","have not finished"],"hint":"Negative with I → haven't (have not) + finished."},
              {"type":"order","q":"Put the words in order.","words":["has","She","her","lost","bag"],"a":["She has lost her bag.","Has she lost her bag?"],"hint":"She + has + lost + her bag."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"We ___ bought a new car.","options":["have","has","are"],"a":["have"]},
          {"type":"gap","q":"He has ___ his leg. (break)","a":["broken"]},
          {"type":"choose","q":"I have ___ to London three times.","options":["been","be","was"],"a":["been"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I didn't see him yesterday.","I didn't saw him yesterday.","I not saw him yesterday."],"a":["I didn't see him yesterday."],"from":"g31"},
          {"type":"gap","q":"Great news! My brother ___ passed his driving test! (have / has)","a":["has","'s"]},
          {"type":"choose","q":"Oh no! Someone has ___ my bike!","options":["taken","took","take"],"a":["taken"]},
          {"type":"gap","q":"They have ___ a cake for your birthday. (make)","a":["made"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Have you seen my keys?","Have you saw my keys?","Has you seen my keys?"],"a":["Have you seen my keys?"]},
          {"type":"choose","q":"She ___ to the shops an hour ago.","options":["went","gone","goed"],"a":["went"],"from":"g30"},
          {"type":"gap","q":"Have you eaten? — Yes, I ___.","a":["have"]},
          {"type":"order","q":"Put the words in order.","words":["you","Have","the","film","seen"],"a":["Have you seen the film?","You have seen the film."]},
          {"type":"choose","q":"Tom ___ his homework, so he can't play now.","options":["hasn't done","haven't done","hasn't did"],"a":["hasn't done"]},
          {"type":"choose","q":"At seven this morning I ___ breakfast.","options":["was having","were having","am having"],"a":["was having"],"from":"g35"},
          {"type":"gap","q":"I ___ my phone. Can I use yours? (lose — present perfect)","a":["have lost","'ve lost"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She has written a book.","She has wrote a book.","She has writed a book."],"a":["She has written a book."]},
          {"type":"choose","q":"Good news! We ___ the match!","options":["have won","has won","have win"],"a":["have won"]},
          {"type":"gap","q":"I ___ the guitar, but I stopped. (play — used to)","a":["used to play"],"from":"g37"},
          {"type":"gap","q":"___ she called you? (have / has)","a":["Has"]},
          {"type":"order","q":"Put the words in order.","words":["haven't","I","the","finished","book"],"a":["I haven't finished the book.","Haven't I finished the book?"]},
          {"type":"choose","q":"They ___ seen the new film. They want to see it on Saturday.","options":["haven't","hasn't","isn't"],"a":["haven't"]}
        ]
      },
      {
        id: "g39", no: 39, title: "Present Perfect with Ever, Never, Just, Already, Yet", v: 1,
        chunks: [
          {
            learn: {"title":"Have you ever…? I've never… — experiences","rule":"Use the present perfect for experiences — things that happened (or didn't happen) at any time in your life up to now. Ask with ever (= at any time): Have you ever been to London? Answer with never (= not at any time): I've never been there. ever and never go between have / has and the past participle. been to = visited a place and came back.","table":[["","Example"],["ever (in questions)","Have you ever eaten sushi?"],["never (= not ever)","I've never been to Japan."],["short answers","Yes, I have. / No, I haven't. / No, never."]],"examples":["Have you ever been to London?","I've never eaten sushi.","Has she ever ridden a horse?","My grandma has never used a computer.","Have you ever met a famous person? — No, never."],"uz":"ever so‘roqda ishlatiladi: Have you ever been to Japan? — Hech qachon Yaponiyada bo‘lganmisiz? never — hech qachon."},
            practise: [
              {"type":"choose","q":"Have you ___ been to Italy?","options":["ever","since","yet"],"a":["ever"],"hint":"A question about any time in your life → ever."},
              {"type":"choose","q":"I've ___ seen snow. I'd love to see it.","options":["never","ever","yet"],"a":["never"],"hint":"Not at any time → never."},
              {"type":"gap","q":"___ you ever ridden a horse? (have / has)","a":["Have"],"hint":"Question with you → Have + you + ever + past participle?"},
              {"type":"gap","q":"She has ___ eaten Indian food. She doesn't know what it tastes like. (never / ever)","a":["never"],"hint":"Not at any time → never."},
              {"type":"order","q":"Put the words in order.","words":["ever","Have","you","Paris","been","to"],"a":["Have you ever been to Paris?"],"hint":"Have + you + ever + been to + Paris?"}
            ]
          },
          {
            learn: {"title":"just and already","rule":"just = a very short time ago: I've just had lunch (a few minutes ago). already = before now, often earlier than someone expected: She's already finished her homework (and it's only five o'clock!). just and already usually go between have / has and the past participle. already can also go at the end: She's finished already.","table":[["Word","Meaning","Example"],["just","a very short time ago","I've just had lunch."],["already","before now, earlier than expected","She's already left. / She's left already."]],"examples":["I've just seen Tom. He's in the library.","The film has just started.","We've already eaten, thanks.","She's already left. You missed her.","Have you finished already? That was quick!"],"uz":"just — hozirgina: I've just eaten — Hozirgina ovqatlandim; already — allaqachon: She's already left — U allaqachon ketdi."},
            practise: [
              {"type":"choose","q":"I'm not hungry. I've ___ had lunch. (a few minutes ago)","options":["just","yet","ever"],"a":["just"],"hint":"A very short time ago → just."},
              {"type":"choose","q":"She has ___ finished her homework — before dinner! (earlier than expected)","options":["already","yet","ever"],"a":["already"],"hint":"Earlier than expected → already."},
              {"type":"gap","q":"The bus has ___ left. We missed it by one minute. (a very short time ago)","a":["just"],"hint":"A very short time ago → just."},
              {"type":"gap","q":"Don't buy milk. I ___ already bought some. (have / has)","a":["have","'ve"],"hint":"With I → have + already + past participle."},
              {"type":"fix","q":"Which sentence is correct?","options":["I've just seen your brother.","I've just saw your brother.","Just I've seen your brother."],"a":["I've just seen your brother."],"hint":"have + just + past participle (seen)."}
            ]
          },
          {
            learn: {"title":"Have you finished yet? — yet","rule":"Use yet in questions and negatives. It means 'until now' and goes at the end of the sentence: Have you finished yet? I haven't finished yet. In positive sentences use already, not yet: I've already finished.","table":[["","Example"],["question","Have you done your homework yet?"],["negative","I haven't done it yet."],["positive → already","I've already done it."]],"examples":["Have you finished yet?","I haven't read the book yet.","Has the film started yet? — No, not yet.","They haven't arrived yet.","I've already seen it, but Sam hasn't seen it yet."],"uz":"yet so‘roq va inkorda, gap oxirida keladi: I haven't finished yet — Hali tugatmadim."},
            practise: [
              {"type":"choose","q":"Have you done your homework ___?","options":["yet","never","just"],"a":["yet"],"hint":"A question about 'until now' → yet, at the end."},
              {"type":"choose","q":"I haven't seen the new film ___.","options":["yet","already","just"],"a":["yet"],"hint":"A negative about 'until now' → yet, at the end."},
              {"type":"gap","q":"The shop hasn't opened ___. It opens at ten. (yet / already)","a":["yet"],"hint":"A negative → yet, at the end."},
              {"type":"gap","q":"Have they arrived yet? — No, they ___.","a":["haven't","have not"],"hint":"Have they…? — No, they haven't."},
              {"type":"fix","q":"Which sentence is correct?","options":["I haven't finished yet.","I haven't finished already.","I have finished yet."],"a":["I haven't finished yet."],"hint":"Negative → yet at the end."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"Have you ___ eaten Thai food?","options":["ever","yet","since"],"a":["ever"]},
          {"type":"gap","q":"I've ___ been on a plane. I'm a bit scared. (never / ever)","a":["never"]},
          {"type":"choose","q":"Is Tom here? — No, he's ___ gone home. You missed him by a minute.","options":["just","yet","ever"],"a":["just"]},
          {"type":"gap","q":"She has ___ her keys. (lose)","a":["lost"],"from":"g38"},
          {"type":"gap","q":"I haven't cleaned my room ___. I'll do it later. (yet / already)","a":["yet"]},
          {"type":"choose","q":"We've ___ seen this film. Let's watch something else.","options":["already","yet","ever"],"a":["already"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Has she ever been to Spain?","Has she ever went to Spain?","Has she been ever to Spain?"],"a":["Has she ever been to Spain?"]},
          {"type":"order","q":"Put the words in order.","words":["just","I've","lunch","had"],"a":["I've just had lunch."]},
          {"type":"choose","q":"I ___ a letter to my aunt last week.","options":["wrote","writed","written"],"a":["wrote"],"from":"g30"},
          {"type":"gap","q":"My grandad has ___ used a smartphone. He doesn't want one. (never / ever)","a":["never"]},
          {"type":"choose","q":"The train hasn't arrived ___.","options":["yet","already","just"],"a":["yet"]},
          {"type":"gap","q":"Has the film started yet? — No, it ___.","a":["hasn't","has not"]},
          {"type":"gap","q":"Did you enjoy the concert? — Yes, I ___.","a":["did"],"from":"g31"},
          {"type":"fix","q":"Which sentence is correct?","options":["I've already done it.","I've yet done it.","I've done already it."],"a":["I've already done it."]},
          {"type":"order","q":"Put the words in order.","words":["yet","haven't","They","arrived"],"a":["They haven't arrived yet.","Haven't they arrived yet?"]},
          {"type":"choose","q":"My mum has ___ cooked dinner. It's on the table.","options":["already","yet","ever"],"a":["already"]},
          {"type":"choose","q":"I was having a shower when the phone ___. (the short action)","options":["rang","was ringing","rings"],"a":["rang"],"from":"g36"},
          {"type":"gap","q":"I'm not hungry. I've ___ eaten. (a very short time ago)","a":["just"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Have you ever tried Mexican food?","Did you ever tried Mexican food?","Have you ever try Mexican food?"],"a":["Have you ever tried Mexican food?"]},
          {"type":"choose","q":"She hasn't called me ___.","options":["yet","already","just"],"a":["yet"]}
        ]
      },
      {
        id: "g40", no: 40, title: "Present Perfect with For and Since", v: 1,
        chunks: [
          {
            learn: {"title":"How long have you lived here?","rule":"Use the present perfect to say how long something has continued from the past until now: I've lived here for ten years (I started ten years ago, and I still live here). Ask with How long: How long have you known Sam? Don't use the present simple for this: I've lived here for ten years (not I live here for ten years).","table":[["Question","Answer"],["How long have you lived here?","I've lived here for ten years."],["How long has she had her car?","She's had it since 2020."],["How long have they known each other?","They've known each other for a long time."]],"examples":["I've lived in this town for ten years.","How long have you known your best friend?","She's had her dog for three years.","We've known them for a long time.","How long has your dad worked at the bank?"],"uz":"Hozirgacha davom etayotgan holat: I've lived here for five years — Besh yildan beri shu yerda yashayman."},
            practise: [
              {"type":"choose","q":"I ___ in this town for ten years. I still live here.","options":["have lived","live","lived"],"a":["have lived"],"hint":"From the past until now → present perfect: have lived."},
              {"type":"choose","q":"How long ___ you known your best friend?","options":["have","do","did"],"a":["have"],"hint":"How long + have + you + past participle?"},
              {"type":"gap","q":"She ___ her car for three years. (have — present perfect)","a":["has had","'s had"],"hint":"have – had – had: she has had."},
              {"type":"gap","q":"How long ___ Tom worked here? (have / has)","a":["has"],"hint":"Tom = he → has."},
              {"type":"fix","q":"Which sentence is correct?","options":["We've known them for a long time.","We know them for a long time.","We've knew them for a long time."],"a":["We've known them for a long time."],"hint":"From the past until now → have + known."}
            ]
          },
          {
            learn: {"title":"for or since?","rule":"Use for with a period of time — how long: for two hours, for three days, for ten years, for a long time. Use since with a point in time — when it started: since ten o'clock, since Monday, since 2015, since I was a child.","table":[["for + a period of time","since + a point in time"],["for two hours","since ten o'clock"],["for three days","since Monday"],["for six months","since January"],["for ten years","since 2015"],["for a long time","since I was a child"]],"examples":["I've been here for two hours.","I've been here since ten o'clock.","She's lived in Paris for five years.","She's lived in Paris since 2020.","I've known him since we were children."],"uz":"for — qancha vaqt (for two years — ikki yildan beri), since — qachondan (since 2020 — 2020-yildan beri)."},
            practise: [
              {"type":"choose","q":"I've been here ___ two hours.","options":["for","since"],"a":["for"],"hint":"two hours = a period of time → for."},
              {"type":"choose","q":"She's lived in Paris ___ 2018.","options":["since","for"],"a":["since"],"hint":"2018 = a point in time → since."},
              {"type":"gap","q":"We've had this dog ___ six years. (for / since)","a":["for"],"hint":"six years = a period → for."},
              {"type":"gap","q":"He has worked at the bank ___ last summer. (for / since)","a":["since"],"hint":"last summer = when it started → since."},
              {"type":"fix","q":"Which sentence is correct?","options":["I've known him since we were children.","I've known him for we were children.","I know him since we were children."],"a":["I've known him since we were children."],"hint":"when it started → since; until now → have known."}
            ]
          },
          {
            learn: {"title":"I haven't seen her for ages","rule":"With negatives, for and since say how long something hasn't happened: I haven't seen Tom for a month. She hasn't eaten since breakfast. With be, use have been / has been: I've been ill since Friday. How long have you been a teacher?","table":[["","Example"],["negative + for","I haven't seen my cousin for two years."],["negative + since","It hasn't rained since March."],["be → have / has been","She's been at this school since September."]],"examples":["I haven't seen my cousin for two years.","It hasn't rained since March.","We haven't eaten since breakfast.","I've been ill since Friday.","How long have you been a teacher? — For six years."],"uz":"Inkorda: I haven't seen her for a month — Uni bir oydan beri ko‘rganim yo‘q."},
            practise: [
              {"type":"choose","q":"I ___ my cousin since Christmas.","options":["haven't seen","didn't see","don't see"],"a":["haven't seen"],"hint":"since → present perfect: haven't seen."},
              {"type":"choose","q":"She ___ ill since Monday.","options":["has been","is","was"],"a":["has been"],"hint":"since → present perfect of be: has been."},
              {"type":"gap","q":"It ___ for weeks. The garden is very dry. (not / rain — present perfect)","a":["hasn't rained","has not rained"],"hint":"it → hasn't (has not) + rained."},
              {"type":"gap","q":"How long have you ___ a teacher? (be)","a":["been"],"hint":"be – was – been: have + been."},
              {"type":"order","q":"Put the words in order.","words":["for","haven't","I","him","seen","months"],"a":["I haven't seen him for months.","For months I haven't seen him.","Haven't I seen him for months?"],"hint":"I + haven't seen + him + for months."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"We've lived in this flat ___ 2019.","options":["since","for"],"a":["since"]},
          {"type":"gap","q":"I've known Anna ___ ten years. (for / since)","a":["for"]},
          {"type":"choose","q":"How long ___ she worked at the hospital?","options":["has","does","is"],"a":["has"]},
          {"type":"gap","q":"I ___ like coffee, but now I love it. (not / use to)","a":["didn't use to","did not use to"],"from":"g37"},
          {"type":"gap","q":"He ___ in London since 2015. (live — present perfect)","a":["has lived","'s lived"]},
          {"type":"choose","q":"I haven't eaten anything ___ seven o'clock this morning.","options":["since","for"],"a":["since"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She has had her phone for two years.","She has her phone for two years.","She has had her phone since two years."],"a":["She has had her phone for two years."]},
          {"type":"order","q":"Put the words in order.","words":["since","here","has","He","Monday","been"],"a":["He has been here since Monday.","Has he been here since Monday?","Since Monday he has been here."]},
          {"type":"gap","q":"We ___ a lot of photos on holiday last summer. (take)","a":["took"],"from":"g30"},
          {"type":"choose","q":"They've been friends ___ a long time.","options":["for","since"],"a":["for"]},
          {"type":"gap","q":"How long ___ you had this bike? (have / has)","a":["have"]},
          {"type":"choose","q":"Where ___ you buy those shoes?","options":["did","were","have"],"a":["did"],"from":"g31"},
          {"type":"fix","q":"Which sentence is correct?","options":["I haven't seen her since June.","I didn't see her since June.","I haven't seen her for June."],"a":["I haven't seen her since June."]},
          {"type":"gap","q":"It ___ cold since Monday. (be — present perfect)","a":["has been","'s been"]},
          {"type":"choose","q":"My parents ___ married for twenty years.","options":["have been","are","has been"],"a":["have been"]},
          {"type":"gap","q":"At five o'clock yesterday they ___ in the park. (walk — was/were + -ing)","a":["were walking"],"from":"g35"},
          {"type":"order","q":"Put the words in order.","words":["have","How","long","you","here","lived"],"a":["How long have you lived here?"]},
          {"type":"gap","q":"I haven't been to the cinema ___ months. (for / since)","a":["for"]},
          {"type":"choose","q":"She has been at this school ___ she was eleven.","options":["since","for"],"a":["since"]},
          {"type":"fix","q":"Which sentence is correct?","options":["How long have you known Ben?","How long do you know Ben?","How long have you knew Ben?"],"a":["How long have you known Ben?"]}
        ]
      },
      {
        id: "g41", no: 41, title: "Present Perfect vs Past Simple", v: 1,
        chunks: [
          {
            learn: {"title":"I've been to Rome / I went to Rome in 2019","rule":"Use the past simple when you say or ask when something happened — a finished time: yesterday, last week, in 2010, two days ago, when I was a child. Use the present perfect when you don't say when — for life experiences or a past action that matters now: I've been to Rome (in my life). Never use the present perfect with a finished time: I saw him yesterday (not I've seen him yesterday).","table":[["Present perfect (no finished time)","Past simple (a finished time)"],["I've been to Rome.","I went to Rome in 2019."],["She's lost her keys.","She lost her keys yesterday."],["Have you ever met a pop star?","When did you meet him?"]],"examples":["I've been to Rome twice.","I went to Rome in 2019 and in 2022.","She's lost her keys. She can't get in.","She lost her keys yesterday, but she found them today.","I saw Tom an hour ago."],"uz":"Aniq o‘tgan vaqt (yesterday, in 2010, ago) aytilsa — Past Simple, vaqt aytilmasa — Present Perfect."},
            practise: [
              {"type":"choose","q":"I ___ Tom yesterday.","options":["saw","have seen"],"a":["saw"],"hint":"yesterday = a finished time → past simple."},
              {"type":"choose","q":"She ___ to the USA three times so far.","options":["has been","went"],"a":["has been"],"hint":"so far = until now → present perfect."},
              {"type":"gap","q":"We ___ to the beach last Sunday. (go — one word)","a":["went"],"hint":"last Sunday = a finished time → past simple: went."},
              {"type":"gap","q":"___ you ever eaten sushi? (have / did)","a":["Have"],"hint":"ever = in your life until now → Have you ever…?"},
              {"type":"fix","q":"Which sentence is correct?","options":["I lost my phone two days ago.","I've lost my phone two days ago.","I have lose my phone two days ago."],"a":["I lost my phone two days ago."],"hint":"two days ago = a finished time → past simple: lost."}
            ]
          },
          {
            learn: {"title":"Look for the time word","rule":"The time word often tells you which tense to use. Present perfect: ever, never, just, already, yet, so far, for and since (until now), How long…? Past simple: yesterday, last week / month / year, … ago, in 2015, on Monday, when I was ten, When…?","table":[["Present perfect","Past simple"],["ever, never","yesterday"],["just, already, yet","last week / month / year"],["for, since (until now)","… ago"],["so far, How long…?","in 2015, on Monday, when I was ten"]],"examples":["I've just seen Kate. / I saw Kate an hour ago.","Have you finished yet? / Did you finish at six?","She's lived here since 2020. / She moved here in 2020.","I've never been to Africa. / I went to Egypt when I was ten."],"uz":"Vaqt so‘ziga qarang: ago, yesterday, last … — Past Simple; ever, never, just, yet, since — Present Perfect."},
            practise: [
              {"type":"choose","q":"They ___ married in 2015.","options":["got","have got"],"a":["got"],"hint":"in 2015 = a finished time → past simple: got."},
              {"type":"choose","q":"We ___ in this house since 2015.","options":["have lived","lived"],"a":["have lived"],"hint":"since = until now → present perfect."},
              {"type":"gap","q":"I ___ the new film yet. (not / see)","a":["haven't seen","have not seen"],"hint":"yet → present perfect: haven't seen."},
              {"type":"gap","q":"He ___ his arm two weeks ago. (break — one word)","a":["broke"],"hint":"ago → past simple: broke."},
              {"type":"order","q":"Put the words in order.","words":["ago","left","She","an","hour"],"a":["She left an hour ago.","An hour ago she left."],"hint":"ago → past simple: She left + an hour ago."}
            ]
          },
          {
            learn: {"title":"Have you ever…? — Yes, I went there last year","rule":"In a conversation we often start with the present perfect (an experience or some news) and then use the past simple for the details — when, where, how: A: Have you ever been to London? B: Yes, I have. I went there last summer. Questions with When…? and What time…? always take the past simple: When did you arrive? (not When have you arrived?).","table":[["Present perfect (the news / experience)","Past simple (the details)"],["Have you ever been to London?","Yes. I went there last summer."],["I've broken my arm!","How did it happen? — I fell off my bike."],["Kate has passed her exam!","When did she get the results?"]],"examples":["A: Have you ever been to London? B: Yes, I went there last summer.","A: I've broken my arm! B: Oh no! How did it happen?","Kate has passed her exam. She got the results this morning.","A: Have you seen Sam? B: Yes, I saw him at lunch.","When did you arrive?"],"uz":"Avval yangilik Present Perfect bilan aytiladi, keyin tafsilotlar Past Simple bilan: When did you go? — Qachon bordingiz?"},
            practise: [
              {"type":"choose","q":"A: Have you ever been to Italy? B: Yes, I ___ there two years ago.","options":["went","have gone","have been"],"a":["went"],"hint":"two years ago → past simple: went."},
              {"type":"choose","q":"When ___ you arrive?","options":["did","have"],"a":["did"],"hint":"When…? → past simple: When did you…?"},
              {"type":"gap","q":"A: I've lost my wallet! B: Oh no! Where ___ you lose it? (did / have)","a":["did"],"hint":"A detail (where?) → past simple: Where did you…?"},
              {"type":"gap","q":"A: ___ you ever met a famous person? (have / did) B: Yes, I met a singer last year.","a":["Have"],"hint":"ever = in your life → Have you ever…?"},
              {"type":"fix","q":"Which sentence is correct?","options":["What time did you get up?","What time have you got up?","What time did you got up?"],"a":["What time did you get up?"],"hint":"What time…? → past simple: did + get."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ my grandparents last weekend.","options":["visited","have visited"],"a":["visited"]},
          {"type":"choose","q":"___ you ever been to Spain?","options":["Have","Did"],"a":["Have"]},
          {"type":"gap","q":"She ___ to Paris in 2019. (move — one word)","a":["moved"]},
          {"type":"choose","q":"I haven't finished my homework ___.","options":["yet","already","just"],"a":["yet"],"from":"g39"},
          {"type":"gap","q":"We ___ lunch an hour ago. (have — one word)","a":["had"]},
          {"type":"choose","q":"They ___ here since 2010.","options":["have worked","worked"],"a":["have worked"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I saw a good film last night.","I've seen a good film last night.","I have saw a good film last night."],"a":["I saw a good film last night."]},
          {"type":"order","q":"Put the words in order.","words":["did","When","arrive","you"],"a":["When did you arrive?"]},
          {"type":"gap","q":"I've lived here ___ 2018. (for / since)","a":["since"],"from":"g40"},
          {"type":"gap","q":"A: I've passed my driving test! B: Great! When ___ you take it? (did / have)","a":["did"]},
          {"type":"choose","q":"I ___ five emails so far today.","options":["have written","wrote"],"a":["have written"]},
          {"type":"gap","q":"We ___ TV when the lights went out. (watch — the longer action)","a":["were watching"],"from":"g36"},
          {"type":"choose","q":"When I was a child, I ___ in a village.","options":["lived","have lived"],"a":["lived"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Have you finished your homework yet?","Did you finished your homework yet?","Have you finish your homework yet?"],"a":["Have you finished your homework yet?"]},
          {"type":"gap","q":"They ___ to Rome two years ago. (go — one word)","a":["went"]},
          {"type":"order","q":"Put the words in order.","words":["ever","Have","ridden","you","a","horse"],"a":["Have you ever ridden a horse?"]},
          {"type":"choose","q":"What ___ you do last weekend?","options":["did","have","were"],"a":["did"],"from":"g31"},
          {"type":"gap","q":"I ___ this film before. Let's watch something else. (see — present perfect)","a":["have seen","'ve seen"]},
          {"type":"choose","q":"We ___ each other since we were five.","options":["have known","knew"],"a":["have known"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She went to Italy last summer.","She has gone to Italy last summer.","She has went to Italy last summer."],"a":["She went to Italy last summer."]}
        ]
      },
      {
        id: "g42", no: 42, title: "Modal Verbs: Must, Have To, Should", v: 1,
        chunks: [
          {
            learn: {"title":"must and have to — it's necessary","rule":"Use must or have to + verb to say that something is necessary. They often mean the same: I must go now. / I have to go now. must is the same for every person and has no to after it: She must go (not she musts go, not must to go). have to changes: I have to, she has to; questions with do / does: Do you have to…? For the past, use had to: I had to work yesterday (must has no past form).","table":[["must","have to"],["I must go.","I have to go."],["She must study.","She has to study."],["—","Do you have to work on Saturdays?"],["—","Past: We had to wait."]],"examples":["I must call my mum tonight.","You must wear a seatbelt in the car.","She has to get up at six every day.","We have to wear a uniform at school.","Do you have to work on Saturdays?","I had to wait for an hour yesterday."],"uz":"must va have to — majburiyat: I have to go — Ketishim kerak. O‘tgan zamonda: had to."},
            practise: [
              {"type":"choose","q":"She ___ get up early for work.","options":["has to","have to","must to"],"a":["has to"],"hint":"she → has to (or must, with no to)."},
              {"type":"choose","q":"You must ___ your passport at the airport.","options":["show","to show","showing"],"a":["show"],"hint":"must + the verb as it is, no to."},
              {"type":"gap","q":"Yesterday I ___ stay at school until five. (have to — past)","a":["had to"],"hint":"The past of must / have to → had to."},
              {"type":"gap","q":"___ you have to wear a uniform at school? (do / does)","a":["Do"],"hint":"Question with you → Do you have to…?"},
              {"type":"fix","q":"Which sentence is correct?","options":["He has to work on Saturdays.","He have to work on Saturdays.","He musts work on Saturdays."],"a":["He has to work on Saturdays."],"hint":"he → has to; must never takes -s."}
            ]
          },
          {
            learn: {"title":"should — advice","rule":"Use should + verb to give advice or to say what is a good idea: You should see a doctor. Negative: shouldn't (should not) = it's a bad idea: You shouldn't eat so much sugar. Question: Should I…? Like must, should is the same for every person and has no to after it.","table":[["","Example"],["advice","You should drink more water."],["negative","You shouldn't stay up so late."],["question","What should I do?"]],"examples":["You look tired. You should go to bed.","You shouldn't drive so fast.","He should study more for the test.","Should I bring anything to the party?","What should I wear to the interview?"],"uz":"should — maslahat: You should see a doctor — Shifokorga borganingiz ma’qul."},
            practise: [
              {"type":"choose","q":"You have a bad cold. You ___ stay in bed.","options":["should","shouldn't"],"a":["should"],"hint":"A good idea → should."},
              {"type":"choose","q":"You ___ eat so many sweets. They're bad for your teeth.","options":["shouldn't","should"],"a":["shouldn't"],"hint":"A bad idea → shouldn't."},
              {"type":"gap","q":"He should ___ more water. (drink)","a":["drink"],"hint":"should + the verb as it is."},
              {"type":"gap","q":"It's very late. You ___ go to bed now. (advice — should / shouldn't)","a":["should"],"hint":"A good idea → should."},
              {"type":"order","q":"Put the words in order.","words":["I","should","What","do"],"a":["What should I do?"],"hint":"What + should + I + do?"}
            ]
          },
          {
            learn: {"title":"necessary or a good idea?","rule":"must and have to = it's necessary (strong). should = it's a good idea (advice, not so strong). For things that are necessary, must and have to are usually both correct: You must / have to show your ticket. Use should when it's only advice: You should try this cake — it's delicious!","table":[["How strong?","Example"],["necessary (must / have to)","All passengers must / have to wear a seatbelt."],["a good idea (should)","You should take an umbrella. It looks cloudy."]],"examples":["You must / have to have a ticket to get on the train.","Drivers must / have to stop at a red light.","You should try this cake. It's delicious!","You should read this book. You'll love it.","You should visit Paris one day."],"uz":"must / have to — majburiyat (shart), should — maslahat (shunday qilish yaxshi)."},
            practise: [
              {"type":"choose","q":"This cake is delicious. You ___ try it! (a good idea, not necessary)","options":["should","has to","must to"],"a":["should"],"hint":"A good idea → should."},
              {"type":"gap","q":"Students ___ wear a uniform at our school. It's a rule. (necessary — must / have to)","a":["must","have to"],"hint":"Necessary → must or have to."},
              {"type":"gap","q":"You look ill. You ___ see a doctor. (advice)","a":["should"],"hint":"Advice → should."},
              {"type":"choose","q":"Which word means 'it's a good idea'?","options":["should","must","have to"],"a":["should"],"hint":"should = advice, a good idea."},
              {"type":"fix","q":"Which sentence is correct?","options":["You should take an umbrella.","You should to take an umbrella.","You should taking an umbrella."],"a":["You should take an umbrella."],"hint":"should + the verb as it is."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I ___ go now. My bus leaves in five minutes.","options":["have to","has to","having to"],"a":["have to"]},
          {"type":"gap","q":"She ___ wear glasses for reading now. (have to)","a":["has to"]},
          {"type":"choose","q":"You ___ eat so much fast food. It's not healthy.","options":["shouldn't","should","must"],"a":["shouldn't"]},
          {"type":"choose","q":"I've had this phone ___ two years.","options":["for","since"],"a":["for"],"from":"g40"},
          {"type":"gap","q":"We ___ wait for the bus for forty minutes yesterday. (have to — past)","a":["had to"]},
          {"type":"fix","q":"Which sentence is correct?","options":["You must be quiet in the library.","You must to be quiet in the library.","You musts be quiet in the library."],"a":["You must be quiet in the library."]},
          {"type":"choose","q":"___ I wear a jacket? It's a bit cold.","options":["Should","Must to","Have"],"a":["Should"]},
          {"type":"order","q":"Put the words in order.","words":["should","You","a","doctor","see"],"a":["You should see a doctor.","Should you see a doctor?"]},
          {"type":"choose","q":"I ___ walk to school, but now I take the bus.","options":["used to","use","was"],"a":["used to"],"from":"g37"},
          {"type":"gap","q":"Does he ___ work at weekends? (have to)","a":["have to"]},
          {"type":"choose","q":"In many countries, you ___ have a licence to drive a car.","options":["have to","having to","has to"],"a":["have to"]},
          {"type":"gap","q":"Don't touch that! You ___ play with fire. (should — negative)","a":["shouldn't","should not"]},
          {"type":"choose","q":"While I ___ to school, I met an old friend.","options":["was walking","were walking","walk"],"a":["was walking"],"from":"g36"},
          {"type":"fix","q":"Which sentence is correct?","options":["She has to study for her exams.","She have to study for her exams.","She has study for her exams."],"a":["She has to study for her exams."]},
          {"type":"gap","q":"Visitors ___ show their ticket at the door. It's a rule. (necessary — must / have to)","a":["must","have to"]},
          {"type":"order","q":"Put the words in order.","words":["have","Do","to","we","early","leave"],"a":["Do we have to leave early?"]},
          {"type":"gap","q":"Have you ___ been to Canada? (ever / never)","a":["ever"],"from":"g39"},
          {"type":"choose","q":"It's a great book. You ___ read it. (advice)","options":["should","should to","shoulds"],"a":["should"]},
          {"type":"choose","q":"My mum ___ work last Saturday.","options":["had to","must","has to"],"a":["had to"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Did you have to work yesterday?","Did you had to work yesterday?","Did you must work yesterday?"],"a":["Did you have to work yesterday?"]}
        ]
      },
      {
        id: "g43", no: 43, title: "Mustn't vs Don't Have To", v: 1,
        chunks: [
          {
            learn: {"title":"mustn't — don't do it!","rule":"mustn't (must not) + verb = don't do it — it's not allowed, or it's very important not to do it: You mustn't smoke here. You mustn't tell anyone — it's a secret. mustn't is the same for every person and has no to after it.","table":[["","Example"],["not allowed","You mustn't use your phone in the exam."],["very important not to","You mustn't forget your passport."]],"examples":["You mustn't park here.","Students mustn't use phones in class.","You mustn't touch the cooker. It's hot.","We mustn't be late for the exam.","You mustn't tell anyone. It's a secret."],"uz":"mustn't — taqiq: You mustn't smoke here — Bu yerda chekish mumkin emas."},
            practise: [
              {"type":"choose","q":"You ___ use your phone during the exam. It's not allowed.","options":["mustn't","don't have to"],"a":["mustn't"],"hint":"Not allowed → mustn't."},
              {"type":"choose","q":"You mustn't ___ in the library.","options":["shout","to shout","shouting"],"a":["shout"],"hint":"mustn't + the verb as it is."},
              {"type":"gap","q":"You ___ swim here. It's dangerous. (must — negative)","a":["mustn't","must not"],"hint":"Don't do it → mustn't (must not)."},
              {"type":"gap","q":"Children ___ play with matches. (must — negative)","a":["mustn't","must not"],"hint":"Don't do it → mustn't (must not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["You mustn't be late.","You mustn't to be late.","You don't must be late."],"a":["You mustn't be late."],"hint":"mustn't + the verb as it is, no to."}
            ]
          },
          {
            learn: {"title":"don't have to — it isn't necessary","rule":"don't / doesn't have to + verb = it isn't necessary, but you can if you want: You don't have to come (but you can). She doesn't have to work on Sundays. Past: didn't have to: I didn't have to wait.","table":[["Person","Not necessary"],["I / you / we / they","don't have to"],["he / she / it","doesn't have to"],["the past (everyone)","didn't have to"]],"examples":["You don't have to bring food. There's lots here.","She doesn't have to wear a uniform at her new school.","We don't have to get up early tomorrow. It's Saturday!","He doesn't have to pay. It's free.","I didn't have to wait. The doctor saw me at once."],"uz":"don't have to — majbur emassiz: You don't have to come — Kelishingiz shart emas."},
            practise: [
              {"type":"choose","q":"It's Sunday. I ___ go to school.","options":["don't have to","doesn't have to","mustn't"],"a":["don't have to"],"hint":"Not necessary, with I → don't have to."},
              {"type":"choose","q":"She ___ cook tonight. We're going to a restaurant.","options":["doesn't have to","don't have to","doesn't has to"],"a":["doesn't have to"],"hint":"she → doesn't have to."},
              {"type":"gap","q":"You ___ pay. The museum is free. (have to — negative)","a":["don't have to","do not have to"],"hint":"Not necessary → don't (do not) have to."},
              {"type":"gap","q":"He ___ wear a suit at work. (have to — negative)","a":["doesn't have to","does not have to"],"hint":"he → doesn't (does not) have to."},
              {"type":"order","q":"Put the words in order.","words":["have","You","don't","to","come"],"a":["You don't have to come.","Don't you have to come?"],"hint":"You + don't have to + come."}
            ]
          },
          {
            learn: {"title":"mustn't or don't have to?","rule":"They are very different! mustn't = don't do it (it isn't allowed). don't have to = you can do it or not — it isn't necessary. You mustn't eat in class (it's against the rules). You don't have to eat now (you can eat later if you like).","table":[["mustn't (Don't!)","don't have to (not necessary)"],["You mustn't run near the pool.","You don't have to swim. You can sit and watch."],["You mustn't open this door.","You don't have to close the door."]],"examples":["You mustn't cross the road on red.","You don't have to wear a tie. It's a party.","Students mustn't cheat in exams.","You don't have to answer every question.","We mustn't make a noise. The baby is sleeping."],"uz":"mustn't — qilmang, mumkin emas; don't have to — shart emas, xohlasangiz qilasiz."},
            practise: [
              {"type":"choose","q":"You ___ drive faster than 50 km/h here. It's the law.","options":["mustn't","don't have to"],"a":["mustn't"],"hint":"It's not allowed → mustn't."},
              {"type":"choose","q":"You ___ bring a towel. The hotel gives you one.","options":["don't have to","mustn't"],"a":["don't have to"],"hint":"Not necessary → don't have to."},
              {"type":"choose","q":"Which sentence means 'it isn't necessary'?","options":["You don't have to come.","You mustn't come."],"a":["You don't have to come."],"hint":"don't have to = not necessary."},
              {"type":"gap","q":"Students ___ cheat in exams. (must — negative)","a":["mustn't","must not"],"hint":"Not allowed → mustn't (must not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["You don't have to help me. I can do it.","You doesn't have to help me. I can do it.","You don't have help me. I can do it."],"a":["You don't have to help me. I can do it."],"hint":"you → don't + have to + verb."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"You ___ smoke in the hospital. It's not allowed.","options":["mustn't","don't have to"],"a":["mustn't"]},
          {"type":"choose","q":"We ___ hurry. The film starts in two hours.","options":["don't have to","mustn't"],"a":["don't have to"]},
          {"type":"gap","q":"You ___ tell anyone. It's a secret! (must — negative)","a":["mustn't","must not"]},
          {"type":"gap","q":"You look tired. You ___ go to bed early. (advice)","a":["should"],"from":"g42"},
          {"type":"gap","q":"She ___ get up early on Sundays. (have to — negative)","a":["doesn't have to","does not have to"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He doesn't have to work tomorrow.","He don't have to work tomorrow.","He doesn't has to work tomorrow."],"a":["He doesn't have to work tomorrow."]},
          {"type":"choose","q":"You ___ take photos in the museum. Photos are not allowed.","options":["mustn't","don't have to"],"a":["mustn't"]},
          {"type":"order","q":"Put the words in order.","words":["mustn't","You","late","be"],"a":["You mustn't be late.","Mustn't you be late?"]},
          {"type":"choose","q":"I ___ my wallet yesterday.","options":["lost","have lost"],"a":["lost"],"from":"g41"},
          {"type":"gap","q":"I ___ cook dinner last night. My dad cooked. (have to — negative, past)","a":["didn't have to","did not have to"]},
          {"type":"choose","q":"The test is easy. You ___ study all night.","options":["don't have to","mustn't"],"a":["don't have to"]},
          {"type":"gap","q":"She has worked here ___ 2020. (for / since)","a":["since"],"from":"g40"},
          {"type":"fix","q":"Which sentence is correct?","options":["You mustn't touch the paintings.","You mustn't to touch the paintings.","You don't must touch the paintings."],"a":["You mustn't touch the paintings."]},
          {"type":"gap","q":"Passengers ___ open the doors while the train is moving. (must — negative)","a":["mustn't","must not"]},
          {"type":"choose","q":"Which sentence means 'Don't do it!'?","options":["You mustn't eat here.","You don't have to eat here."],"a":["You mustn't eat here."]},
          {"type":"choose","q":"___ your parents coming to the concert tomorrow?","options":["Are","Do","Is"],"a":["Are"],"from":"g33"},
          {"type":"order","q":"Put the words in order.","words":["have","doesn't","He","to","pay"],"a":["He doesn't have to pay.","Doesn't he have to pay?"]},
          {"type":"gap","q":"You ___ come to the meeting if you're busy. (have to — negative)","a":["don't have to","do not have to"]},
          {"type":"choose","q":"You ___ forget your passport. You can't fly without it.","options":["mustn't","don't have to"],"a":["mustn't"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We didn't have to pay for the tickets.","We didn't had to pay for the tickets.","We don't had to pay for the tickets."],"a":["We didn't have to pay for the tickets."]}
        ]
      },
      {
        id: "g44", no: 44, title: "Could, May, Might", v: 1,
        chunks: [
          {
            learn: {"title":"I could swim when I was six — could for the past","rule":"could is the past of can: I could swim when I was six (I was able to swim). Negative: couldn't (could not): I couldn't open the door. Question: Could you see the stage? Like can, could is the same for every person and is followed by the verb as it is, with no to.","table":[["Present","Past"],["I can swim.","I could swim when I was six."],["She can't come today.","She couldn't come yesterday."],["Can you see it?","Could you see it?"]],"examples":["I could read when I was four.","My grandad could run very fast when he was young.","I couldn't sleep last night. It was too hot.","We couldn't find the hotel, so we asked a policeman.","Could you hear the music from your room?"],"uz":"could — can ning o‘tgan zamoni: I could swim when I was six — Olti yoshimda suza olardim."},
            practise: [
              {"type":"choose","q":"When I was five, I ___ read.","options":["could","can","could to"],"a":["could"],"hint":"The past of can → could."},
              {"type":"choose","q":"I ___ sleep last night. It was very hot.","options":["couldn't","can't","couldn't to"],"a":["couldn't"],"hint":"The past of can't → couldn't."},
              {"type":"gap","q":"She ___ speak French when she was ten, but she forgot it. (can — past)","a":["could"],"hint":"The past of can → could."},
              {"type":"gap","q":"We ___ find the hotel last night, so we asked a policeman. (can — past, negative)","a":["couldn't","could not"],"hint":"The past of can't → couldn't (could not)."},
              {"type":"fix","q":"Which sentence is correct?","options":["My grandad could run very fast.","My grandad could ran very fast.","My grandad could to run very fast."],"a":["My grandad could run very fast."],"hint":"could + the verb as it is."}
            ]
          },
          {
            learn: {"title":"It might rain — might, may and could for maybe","rule":"Use might, may or could + verb to say that something is possible — maybe it will happen, maybe not: It might rain later. = Maybe it will rain. All three are correct here: It might / may / could rain. Negative: might not / may not: I might not come. = Maybe I won't come. (couldn't is different — it means impossible.)","table":[["","Example"],["might","I might go to the party. (maybe)"],["may","She may be at home. (maybe)"],["could","It could snow tonight. (maybe)"],["might not / may not","We might not have time. (maybe not)"]],"examples":["Take an umbrella. It might rain later.","I'm not sure where Tom is. He may be at the gym.","Be careful! That dog could bite.","I might not come to the party. I'm very tired.","We may go to the beach on Sunday."],"uz":"might / may / could — ehtimol: It might rain — Yomg‘ir yog‘ishi mumkin."},
            practise: [
              {"type":"choose","q":"Take an umbrella. It ___ rain later.","options":["might","might to","mights"],"a":["might"],"hint":"might + the verb as it is, no -s, no to."},
              {"type":"choose","q":"I'm not sure, but Tom ___ be at home.","options":["may","is may","mays"],"a":["may"],"hint":"may + the verb as it is."},
              {"type":"gap","q":"I'm not sure. I ___ go to the party. (maybe — one word)","a":["might","may","could"],"hint":"Maybe → might, may or could."},
              {"type":"gap","q":"We ___ have time to see the museum. We'll see. (maybe not — two words)","a":["might not","may not","mightn't"],"hint":"Maybe not → might not or may not."},
              {"type":"fix","q":"Which sentence is correct?","options":["She might be late.","She might is late.","She might to be late."],"a":["She might be late."],"hint":"might + be (the verb as it is)."}
            ]
          },
          {
            learn: {"title":"will or might? — sure or not sure","rule":"Use will when you are sure: I'll be at home tonight. Use might, may or could when you are not sure: I might be at home tonight — I don't know yet. Use won't when you are sure something will not happen: She won't come. She's in Spain.","table":[["How sure?","Example"],["sure — yes","She'll be here at six. She always comes at six."],["not sure","She might / may / could be here at six. I don't know."],["sure — no","She won't be here. She's in Spain."]],"examples":["I'll see you tomorrow at school.","I might see you tomorrow. I'm not sure.","Tom won't be at the party. He's ill.","It may snow this weekend.","Don't worry. I'll definitely call you."],"uz":"Ishonchingiz komil bo‘lsa — will, ishonchingiz komil bo‘lmasa — might / may / could."},
            practise: [
              {"type":"choose","q":"I'm not sure what to do on Saturday. I ___ go shopping.","options":["might","will","mights"],"a":["might"],"hint":"Not sure → might."},
              {"type":"choose","q":"Don't worry, I ___ definitely call you tonight. I promise.","options":["will","might"],"a":["will"],"hint":"Sure (definitely, I promise) → will."},
              {"type":"gap","q":"She isn't sure about the job. She ___ say no. (not sure — might / may)","a":["might","may","could"],"hint":"Not sure → might or may."},
              {"type":"gap","q":"He's in Paris this week, so he ___ come to the meeting. (sure — will, negative)","a":["won't","will not"],"hint":"Sure it will not happen → won't (will not)."},
              {"type":"order","q":"Put the words in order.","words":["might","It","snow","tonight"],"a":["It might snow tonight.","Might it snow tonight?","Tonight it might snow."],"hint":"It + might + snow + tonight."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"When she was four, she ___ ride a bike.","options":["could","can","could to"],"a":["could"]},
          {"type":"gap","q":"I ___ find my keys this morning. (can — past, negative)","a":["couldn't","could not"]},
          {"type":"choose","q":"Take a coat. It ___ be cold this evening.","options":["might","might to","mights"],"a":["might"]},
          {"type":"choose","q":"You ___ wear a suit. It's an informal party.","options":["don't have to","mustn't"],"a":["don't have to"],"from":"g43"},
          {"type":"gap","q":"I'm not sure, but we ___ go to the beach tomorrow. (maybe — one word)","a":["might","may","could"]},
          {"type":"fix","q":"Which sentence is correct?","options":["They might be at home.","They might are at home.","They mights be at home."],"a":["They might be at home."]},
          {"type":"choose","q":"I'm sure he ___ pass the exam. He studied very hard.","options":["will","might"],"a":["will"]},
          {"type":"order","q":"Put the words in order.","words":["couldn't","She","door","the","open"],"a":["She couldn't open the door.","Couldn't she open the door?"]},
          {"type":"gap","q":"I ___ to the cinema yesterday. (go — one word)","a":["went"],"from":"g41"},
          {"type":"gap","q":"We ___ have enough money for the trip. We'll see. (maybe not — two words)","a":["might not","may not","mightn't"]},
          {"type":"choose","q":"Last year I ___ speak any English. Now I can!","options":["couldn't","can't","mightn't"],"a":["couldn't"]},
          {"type":"fix","q":"Which sentence is correct?","options":["He has to wear a uniform.","He have to wear a uniform.","He has to wears a uniform."],"a":["He has to wear a uniform."],"from":"g42"},
          {"type":"gap","q":"Ask Sam. He ___ know the answer. (maybe — one word)","a":["might","may","could"]},
          {"type":"choose","q":"Which sentence means 'Maybe it will rain'?","options":["It might rain.","It will rain.","It rained."],"a":["It might rain."]},
          {"type":"fix","q":"Which sentence is correct?","options":["I could play chess when I was seven.","I could played chess when I was seven.","I can play chess when I was seven."],"a":["I could play chess when I was seven."]},
          {"type":"choose","q":"I've ___ finished my homework. Can I go out now?","options":["just","yet","ever"],"a":["just"],"from":"g39"},
          {"type":"order","q":"Put the words in order.","words":["may","She","late","be"],"a":["She may be late.","May she be late?"]},
          {"type":"gap","q":"I'm sure the shop ___ be open tomorrow. It's a holiday. (sure — will, negative)","a":["won't","will not"]},
          {"type":"choose","q":"My grandma ___ dance very well when she was young.","options":["could","might","may"],"a":["could"]},
          {"type":"fix","q":"Which sentence is correct?","options":["You might need a jacket tonight.","You might needing a jacket tonight.","You might to need a jacket tonight."],"a":["You might need a jacket tonight."]}
        ]
      },
      {
        id: "g45", no: 45, title: "Zero Conditional", v: 1,
        chunks: [
          {
            learn: {"title":"If you heat ice, it melts — facts","rule":"Use the zero conditional for facts and things that are always true: If you heat ice, it melts. Both parts use the present simple: If + present simple, present simple. When the if part comes first, put a comma after it.","table":[["If + present simple,","present simple"],["If you heat ice,","it melts."],["If it rains,","the grass gets wet."],["If you mix red and white,","you get pink."]],"examples":["If you heat water to 100°C, it boils.","If you mix blue and yellow, you get green.","If plants don't get water, they die.","If it rains, the ground gets wet.","If you press this button, the machine starts."],"uz":"Zero Conditional — doim to‘g‘ri bo‘ladigan narsalar: If you heat ice, it melts — Muzni isitsangiz, u eriydi."},
            practise: [
              {"type":"choose","q":"If you heat ice, it ___.","options":["melts","melted","melting"],"a":["melts"],"hint":"A fact → present simple in both parts: it melts."},
              {"type":"choose","q":"If you ___ blue and yellow, you get green.","options":["mix","mixed","mixing"],"a":["mix"],"hint":"If + present simple: you mix."},
              {"type":"gap","q":"If plants ___ get water, they die. (not)","a":["don't","do not"],"hint":"Present simple negative with plants (they) → don't."},
              {"type":"gap","q":"If you heat water to 100°C, it ___. (boil — present simple)","a":["boils"],"hint":"A fact → present simple: it boils."},
              {"type":"fix","q":"Which sentence is correct?","options":["If you drop glass, it breaks.","If you drop glass, it break.","If you dropped glass, it breaks."],"a":["If you drop glass, it breaks."],"hint":"Present simple in both parts: drop … breaks."}
            ]
          },
          {
            learn: {"title":"If I'm tired, I go to bed early — habits","rule":"We also use the zero conditional for things that always happen in our lives. Here if means the same as when: If / When I'm tired, I go to bed early. The if part can come first or second. If it comes first, use a comma. If it comes second, don't use a comma: I go to bed early if I'm tired.","table":[["if first (comma)","if second (no comma)"],["If I'm late, my teacher gets angry.","My teacher gets angry if I'm late."],["When it's sunny, we eat outside.","We eat outside when it's sunny."]],"examples":["If I drink coffee in the evening, I can't sleep.","My dog barks if someone knocks on the door.","When it's sunny, we eat in the garden.","If my sister is sad, she listens to music.","I walk to school if it isn't raining."],"uz":"If gap boshida kelsa, undan keyin vergul qo‘yiladi; gap oxirida kelsa, vergul kerak emas."},
            practise: [
              {"type":"choose","q":"My dog barks ___ someone knocks on the door.","options":["if","what","who"],"a":["if"],"hint":"if (= when) joins the two parts."},
              {"type":"choose","q":"If I ___ coffee in the evening, I can't sleep.","options":["drink","drank","drinking"],"a":["drink"],"hint":"If + present simple: I drink."},
              {"type":"gap","q":"My mum gets angry if I ___ late. (be)","a":["am","'m"],"hint":"Present simple of be with I → am."},
              {"type":"gap","q":"When it's sunny, we ___ outside. (eat)","a":["eat"],"hint":"Present simple with we → eat."},
              {"type":"order","q":"Put the words in order.","words":["If","it","rains,","the","grass","gets","wet"],"a":["If it rains, the grass gets wet."],"hint":"If + it rains, + the grass gets wet."}
            ]
          },
          {
            learn: {"title":"What happens if…? — questions and negatives","rule":"Ask about facts with What happens if…? or What do you do if…?: What happens if you put ice in the sun? Use don't / doesn't in either part: If you don't sleep, you feel tired. If it's cold, my car doesn't start.","table":[["","Example"],["question","What happens if you mix red and blue?"],["negative in the if part","If you don't eat, you get hungry."],["negative in the result","If it rains, we don't play football."]],"examples":["What happens if you mix red and blue? — You get purple.","What do you do if you feel ill at school?","If you don't sleep, you feel tired.","If it's cold, my car doesn't start.","If my brother doesn't eat breakfast, he gets angry."],"uz":"So‘roq: What happens if…? — Agar … bo‘lsa, nima bo‘ladi?"},
            practise: [
              {"type":"choose","q":"What ___ if you mix red and blue?","options":["happens","happen","happened"],"a":["happens"],"hint":"What + happens + if…? (present simple)"},
              {"type":"choose","q":"If it's cold, my car ___ start.","options":["doesn't","don't","isn't"],"a":["doesn't"],"hint":"my car = it → doesn't."},
              {"type":"gap","q":"If you ___ sleep enough, you feel tired. (not)","a":["don't","do not"],"hint":"Present simple negative with you → don't."},
              {"type":"gap","q":"What ___ you do if you feel ill at school? (do / does)","a":["do"],"hint":"Question with you → What do you do…?"},
              {"type":"fix","q":"Which sentence is correct?","options":["If you don't water plants, they die.","If you don't water plants, they dies.","If you doesn't water plants, they die."],"a":["If you don't water plants, they die."],"hint":"you → don't; they → die."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"If you heat chocolate, it ___.","options":["melts","melt","melting"],"a":["melts"]},
          {"type":"gap","q":"If you mix red and white, you ___ pink. (get — present simple)","a":["get"]},
          {"type":"choose","q":"If it ___, the streets get wet.","options":["rains","rain","rained"],"a":["rains"]},
          {"type":"gap","q":"I'm not sure. I ___ stay at home tonight. (maybe — one word)","a":["might","may","could"],"from":"g44"},
          {"type":"gap","q":"If babies are hungry, they ___. (cry — present simple)","a":["cry"]},
          {"type":"fix","q":"Which sentence is correct?","options":["If you press this button, the door opens.","If you press this button, the door open.","If you pressed this button, the door opens."],"a":["If you press this button, the door opens."]},
          {"type":"choose","q":"My sister gets angry if I ___ her clothes.","options":["borrow","borrows","borrowed"],"a":["borrow"]},
          {"type":"order","q":"Put the words in order.","words":["If","you","heat","ice,","it","melts"],"a":["If you heat ice, it melts."]},
          {"type":"choose","q":"You ___ eat more vegetables. They're good for you. (advice)","options":["should","should to","shoulds"],"a":["should"],"from":"g42"},
          {"type":"gap","q":"If you ___ eat, you get hungry. (not)","a":["don't","do not"]},
          {"type":"choose","q":"What happens if you ___ water to 0°C?","options":["cool","cools","cooled"],"a":["cool"]},
          {"type":"choose","q":"___ you ever been to London?","options":["Have","Did","Were"],"a":["Have"],"from":"g41"},
          {"type":"fix","q":"Which sentence is correct?","options":["If it's sunny, we eat outside.","If it's sunny, we eats outside.","If it's sunny, we ate outside."],"a":["If it's sunny, we eat outside."]},
          {"type":"gap","q":"When I'm tired, I ___ to bed early. (go)","a":["go"]},
          {"type":"choose","q":"If you don't water plants, they ___.","options":["die","dies","died"],"a":["die"]},
          {"type":"gap","q":"She has ___ a new car. (buy)","a":["bought"],"from":"g38"},
          {"type":"order","q":"Put the words in order.","words":["happens","What","if","you","press","button","this"],"a":["What happens if you press this button?","If you press this button what happens?"]},
          {"type":"gap","q":"Our dog ___ if someone rings the doorbell. (bark — present simple)","a":["barks"]},
          {"type":"choose","q":"If you ___ in the sun for too long, you get burnt.","options":["stay","stays","stayed"],"a":["stay"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Ice melts if you heat it.","Ice melt if you heat it.","Ice melts if you heats it."],"a":["Ice melts if you heat it."]}
        ]
      },
      {
        id: "g46", no: 46, title: "First Conditional", v: 1,
        chunks: [
          {
            learn: {"title":"If it rains, I'll stay at home","rule":"Use the first conditional for something that is possible in the future, and its result: If it rains tomorrow, I'll stay at home. The if part: present simple (not will!). The result: will / 'll + verb. If you study, you'll pass (not If you will study).","table":[["If + present simple,","will + verb"],["If it rains tomorrow,","I'll (I will) stay at home."],["If you study hard,","you'll pass the exam."],["If she doesn't hurry,","she'll miss the bus."]],"examples":["If it rains tomorrow, I'll stay at home.","If you study hard, you'll pass the exam.","If I see Tom, I'll tell him.","If we leave now, we'll catch the train.","You'll feel better if you take this medicine."],"uz":"First Conditional — kelajakda bo‘lishi mumkin bo‘lgan holat: If it rains, I'll stay at home — Yomg‘ir yog‘sa, uyda qolaman."},
            practise: [
              {"type":"choose","q":"If it ___ tomorrow, we'll go to the beach.","options":["is sunny","will be sunny","sunny"],"a":["is sunny"],"hint":"The if part → present simple (not will): is sunny."},
              {"type":"choose","q":"If you study hard, you ___ the exam.","options":["will pass","passed","passing"],"a":["will pass"],"hint":"The result → will + verb."},
              {"type":"gap","q":"If I see Tom, I ___ tell him. (will)","a":["will","'ll"],"hint":"The result → will ('ll) + verb."},
              {"type":"gap","q":"If you ___ now, you'll catch the bus. (leave)","a":["leave"],"hint":"The if part → present simple: leave."},
              {"type":"fix","q":"Which sentence is correct?","options":["If it rains, we'll stay at home.","If it will rain, we'll stay at home.","If it rains, we'll staying at home."],"a":["If it rains, we'll stay at home."],"hint":"If + present simple (rains), will + verb (stay)."}
            ]
          },
          {
            learn: {"title":"If you don't hurry, you'll be late","rule":"Use don't / doesn't in the if part and won't (will not) in the result: If you don't hurry, you'll be late. If it rains, we won't go out. Questions: What will you do if…? Will you come if…?","table":[["","Example"],["negative in the if part","If you don't hurry, you'll miss the bus."],["negative result","If it's cold, we won't go swimming."],["question","What will you do if you fail the test?"]],"examples":["If you don't hurry, you'll be late.","If it's cold tomorrow, we won't go swimming.","If she doesn't call, I'll be worried.","What will you do if it rains?","Will you come to the party if I invite you?"],"uz":"Inkor: If you don't hurry, you'll be late — Shoshilmasangiz, kechikasiz."},
            practise: [
              {"type":"choose","q":"If you don't hurry, you ___ the train.","options":["'ll miss","missed","'ll missed"],"a":["'ll miss"],"hint":"The result → 'll (will) + verb: 'll miss."},
              {"type":"choose","q":"If it's cold tomorrow, we ___ swimming.","options":["won't go","don't will go","not go"],"a":["won't go"],"hint":"A negative result → won't + verb."},
              {"type":"gap","q":"What ___ you do if you lose your phone? (will)","a":["will"],"hint":"Question → What will you do if…?"},
              {"type":"gap","q":"If she ___ the bus, she'll be late. (not / catch)","a":["doesn't catch","does not catch"],"hint":"The if part, she → doesn't (does not) + catch."},
              {"type":"order","q":"Put the words in order.","words":["will","you","What","do","if","it","rains"],"a":["What will you do if it rains?","If it rains what will you do?"],"hint":"What + will + you + do + if it rains?"}
            ]
          },
          {
            learn: {"title":"if or when? — maybe or sure","rule":"Use if for something that may or may not happen: If I see Anna, I'll tell her (maybe I'll see her). Use when for something you are sure will happen: When I get home, I'll call you (I will get home). After if and when, use the present simple for the future: When I finish (not When I will finish).","table":[["","Example"],["if = maybe","If I find your book, I'll give it to you."],["when = sure","When I finish work, I'll call you."]],"examples":["If I have time, I'll help you.","When I get home, I'll have a shower.","If it's sunny tomorrow, we'll have a picnic.","When the film ends, we'll go for a pizza.","I'll text you when I arrive."],"uz":"if — ehtimol (bo‘lishi ham, bo‘lmasligi ham mumkin), when — albatta bo‘ladigan ish; ikkalasidan keyin Present Simple keladi."},
            practise: [
              {"type":"choose","q":"___ I get home, I'll have a shower. (I'm sure I'll get home)","options":["When","If"],"a":["When"],"hint":"Sure → when."},
              {"type":"choose","q":"___ I have time, I'll help you. (maybe I'll have time)","options":["If","When"],"a":["If"],"hint":"Maybe → if."},
              {"type":"gap","q":"When I ___ my homework, I'll call you. (finish)","a":["finish","have finished","'ve finished"],"hint":"After when → present simple (not will): finish."},
              {"type":"gap","q":"If you ___ my keys, please tell me. (find)","a":["find","have found","'ve found"],"hint":"After if → present simple (not will): find."},
              {"type":"fix","q":"Which sentence is correct?","options":["I'll text you when I arrive.","I'll text you when I will arrive.","I text you when I will arrive."],"a":["I'll text you when I arrive."],"hint":"After when → present simple: arrive."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"If it ___ this weekend, we'll stay at home.","options":["rains","will rain","rained"],"a":["rains"]},
          {"type":"gap","q":"If you eat all that cake, you ___ feel sick. (will)","a":["will","'ll"]},
          {"type":"choose","q":"If you don't hurry, you ___ late.","options":["'ll be","be","are being"],"a":["'ll be"]},
          {"type":"gap","q":"If you heat ice, it ___. (melt — present simple)","a":["melts"],"from":"g45"},
          {"type":"gap","q":"If she ___ hard, she'll pass. (study)","a":["studies","has studied","'s studied"]},
          {"type":"fix","q":"Which sentence is correct?","options":["If I see Ben, I'll give him the book.","If I will see Ben, I'll give him the book.","If I see Ben, I'll gives him the book."],"a":["If I see Ben, I'll give him the book."]},
          {"type":"choose","q":"What will you do if you ___ the bus?","options":["miss","will miss","missed"],"a":["miss"]},
          {"type":"order","q":"Put the words in order.","words":["will","you","What","do","if","you","fail"],"a":["What will you do if you fail?","If you fail what will you do?"]},
          {"type":"choose","q":"You ___ be late for the exam. The doors close at nine.","options":["mustn't","don't have to"],"a":["mustn't"],"from":"g43"},
          {"type":"gap","q":"If it's cold tomorrow, we ___ go to the park. (will — negative)","a":["won't","will not"]},
          {"type":"choose","q":"___ I finish work, I'll call you. (I'm sure I'll finish)","options":["When","If"],"a":["When"]},
          {"type":"gap","q":"I ___ open the window. It was stuck. (can — past, negative)","a":["couldn't","could not"],"from":"g44"},
          {"type":"fix","q":"Which sentence is correct?","options":["If you don't water the plant, it will die.","If you not water the plant, it will die.","If you don't water the plant, it will dies."],"a":["If you don't water the plant, it will die."]},
          {"type":"gap","q":"I'll call you when I ___ home. (get)","a":["get","have got","'ve got"]},
          {"type":"choose","q":"If we ___ the train, we'll get a taxi.","options":["miss","will miss","missing"],"a":["miss"]},
          {"type":"choose","q":"I've lived here ___ ten years.","options":["for","since"],"a":["for"],"from":"g40"},
          {"type":"order","q":"Put the words in order.","words":["If","you","hurry,","you'll","catch","the","bus"],"a":["If you hurry, you'll catch the bus."]},
          {"type":"gap","q":"If he ___ come, we'll start without him. (not)","a":["doesn't","does not"]},
          {"type":"choose","q":"She'll be angry if you ___ her.","options":["don't call","not call","doesn't call"],"a":["don't call"]},
          {"type":"fix","q":"Which sentence is correct?","options":["Will you come if I invite you?","Will you come if I will invite you?","Do you will come if I invite you?"],"a":["Will you come if I invite you?"]}
        ]
      },
      {
        id: "g47", no: 47, title: "When, While, Before, After, As Soon As", v: 1,
        chunks: [
          {
            learn: {"title":"before and after","rule":"before and after show the order of two actions. I brush my teeth before I go to bed (first teeth, then bed). After I finish school, I go home (first school, then home). They can join two parts of a sentence, or come before a noun: before dinner, after the lesson.","table":[["","Example","Order"],["before","I wash my hands before I eat.","1 wash → 2 eat"],["after","I eat after I wash my hands.","1 wash → 2 eat"],["+ a noun","We go for a walk after dinner.","1 dinner → 2 walk"]],"examples":["I always brush my teeth before I go to bed.","After I finish school, I go to the gym.","We went for a walk after dinner.","Before you leave, close the windows.","She did her homework after the lesson."],"uz":"before — …dan oldin, after — …dan keyin: I wash my hands before I eat — Ovqatlanishdan oldin qo‘limni yuvaman."},
            practise: [
              {"type":"choose","q":"I always brush my teeth ___ I go to bed. (first teeth, then bed)","options":["before","after"],"a":["before"],"hint":"First teeth, then bed → before."},
              {"type":"choose","q":"We go for a walk ___ dinner. (first dinner, then the walk)","options":["after","before"],"a":["after"],"hint":"First dinner, then the walk → after."},
              {"type":"gap","q":"Wash your hands ___ you eat. (first wash, then eat — before / after)","a":["before"],"hint":"First wash, then eat → before."},
              {"type":"gap","q":"___ the film ended, we went for a pizza. (first the film, then pizza — before / after)","a":["After","When","Once","As soon as"],"hint":"First the film, then pizza → after."},
              {"type":"fix","q":"Which sentence is correct?","options":["I'll call you after I finish work.","I'll call you after I will finish work.","I call you after I will finish work."],"a":["I'll call you after I finish work."],"hint":"After the word 'after' → present simple for the future: finish."}
            ]
          },
          {
            learn: {"title":"when and while","rule":"when = at the time that. Use it with a short action or with a time of your life: When the phone rang, I answered it. When I was ten, I lived in Rome. while = during the time that. Use it with a longer action: While I was waiting, I read a magazine. Use when (not while) with ages and times of life: when I was a child.","table":[["","Example"],["when + a short action","When the bell rang, the students left."],["when + an age / a time of life","When I was five, I learned to swim."],["while + a longer action","While I was waiting, I read a magazine."]],"examples":["When the bell rang, everyone stood up.","When I was a child, I was afraid of the dark.","While I was waiting for the bus, I read a magazine.","My phone rang while I was having a shower.","When she was young, she lived in Paris."],"uz":"when — qisqa ish yoki hayot davri bilan (when I was ten — o‘n yoshimda), while — davom etayotgan ish paytida."},
            practise: [
              {"type":"choose","q":"___ I was ten, I moved to London.","options":["When","During"],"a":["When"],"hint":"An age → when."},
              {"type":"choose","q":"I read a magazine ___ I was waiting for the bus.","options":["while","during"],"a":["while"],"hint":"A longer action (was waiting) → while."},
              {"type":"gap","q":"My phone rang ___ I was having a shower. (while / during)","a":["while","when","as"],"hint":"A longer action (was having) → while."},
              {"type":"gap","q":"___ the bell rang, everyone stood up. (when / while)","a":["When","As","As soon as","Once","After"],"hint":"A short action (rang) → when."},
              {"type":"order","q":"Put the words in order.","words":["When","she","was","young,","she","lived","in","Paris"],"a":["When she was young, she lived in Paris."],"hint":"When + she was young, + she lived in Paris."}
            ]
          },
          {
            learn: {"title":"as soon as — and no will after time words","rule":"as soon as = immediately when: I'll call you as soon as I arrive (the moment I arrive). After when, before, after and as soon as, use the present simple to talk about the future — not will: I'll phone you when I get home (not when I will get home).","table":[["","Example"],["as soon as (past)","As soon as I saw her, I knew something was wrong."],["as soon as (future)","I'll text you as soon as I land."],["time word + present for the future","We'll have dinner after Dad gets home."]],"examples":["I'll call you as soon as I arrive.","As soon as I saw the dog, I ran.","We'll have dinner after Dad gets home.","Before you go out, close the windows.","She'll be happy when she sees you."],"uz":"as soon as — …bilanoq: I'll call you as soon as I arrive — Yetib borishim bilanoq qo‘ng‘iroq qilaman."},
            practise: [
              {"type":"choose","q":"I'll call you as soon as I ___ home.","options":["get","will get","got"],"a":["get"],"hint":"After as soon as → present simple for the future: get."},
              {"type":"choose","q":"We'll have lunch after Dad ___ back.","options":["comes","will come","come"],"a":["comes"],"hint":"After the word 'after' → present simple for the future: Dad comes."},
              {"type":"gap","q":"I'll text you as soon ___ I land. (one word)","a":["as"],"hint":"as soon as — three words: as + soon + as."},
              {"type":"gap","q":"Before you ___ out, close the windows. (go)","a":["go"],"hint":"After before → present simple: you go."},
              {"type":"fix","q":"Which sentence is correct?","options":["As soon as I finish, I'll help you.","As soon as I will finish, I'll help you.","As soon as I finished, I'll help you."],"a":["As soon as I finish, I'll help you."],"hint":"After as soon as → present simple for the future: finish."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I always have a shower ___ I go to bed.","options":["before","during"],"a":["before"]},
          {"type":"gap","q":"We'll go to the park after it ___ raining. (stop)","a":["stops","has stopped","'s stopped"]},
          {"type":"choose","q":"___ I was a child, I was afraid of the dark.","options":["When","During","Then"],"a":["When"]},
          {"type":"gap","q":"If you leave now, you ___ catch the train. (will)","a":["will","'ll"],"from":"g46"},
          {"type":"gap","q":"I'll call you as soon as I ___ the results. (get)","a":["get","have got","'ve got"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She'll be happy when she sees you.","She'll be happy when she will see you.","She is happy when she will see you."],"a":["She'll be happy when she sees you."]},
          {"type":"choose","q":"I fell asleep ___ I was watching the film.","options":["while","during"],"a":["while"]},
          {"type":"order","q":"Put the words in order.","words":["As","soon","as","I","arrive,","I'll","call","you"],"a":["As soon as I arrive, I'll call you."]},
          {"type":"choose","q":"If you mix blue and yellow, you ___ green.","options":["get","got","getting"],"a":["get"],"from":"g45"},
          {"type":"gap","q":"Wash the fruit ___ you eat it. (first wash, then eat — before / after)","a":["before"]},
          {"type":"choose","q":"We'll start the lesson as soon as everyone ___ here.","options":["is","will be","be"],"a":["is"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I was reading when the lights went out.","I was reading when the lights were go out.","I were reading when the lights went out."],"a":["I was reading when the lights went out."],"from":"g36"},
          {"type":"gap","q":"___ I was waiting for the train, I called my mum. (when / while — a longer action)","a":["While","When","As"]},
          {"type":"choose","q":"Let's go for a walk ___ lunch. (first lunch, then the walk)","options":["after","before"],"a":["after"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I'll tell you after I talk to him.","I'll tell you after I will talk to him.","I tell you after I will talk to him."],"a":["I'll tell you after I talk to him."]},
          {"type":"choose","q":"When I was six, I ___ ride a bike.","options":["could","can","could to"],"a":["could"],"from":"g44"},
          {"type":"order","q":"Put the words in order.","words":["When","she","got","home,","she","made","dinner"],"a":["When she got home, she made dinner."]},
          {"type":"gap","q":"Please turn off the lights ___ you leave the room. (before / after)","a":["before","when","as"]},
          {"type":"choose","q":"As soon as I ___ the news, I called my sister.","options":["heard","hear","was hearing"],"a":["heard"]},
          {"type":"gap","q":"I'll do my homework after I ___ dinner. (have)","a":["have","have had","'ve had"]}
        ]
      },
      {
        id: "g48", no: 48, title: "Relative Clauses (Who, Which, That, Where)", v: 1,
        chunks: [
          {
            learn: {"title":"the man who lives next door — who / that for people","rule":"Use who or that to say which person you mean or to give more information about a person: A dentist is a person who looks after your teeth. That's the girl who won the race. For people, who and that are both correct. Don't add he / she after who: the man who lives next door (not the man who he lives next door).","table":[["Person","who / that","More information"],["the woman","who / that","lives next door"],["a teacher","who / that","helps students"],["the boy","who / that","broke the window"]],"examples":["A pilot is a person who flies planes.","That's the man who sold me my car.","I have a friend that speaks five languages.","The girl who won the race is my cousin.","Do you know the woman who lives next door?"],"uz":"Odamlar uchun who yoki that: the man who lives next door — qo‘shni uyda yashaydigan odam."},
            practise: [
              {"type":"choose","q":"A nurse is a person ___ looks after sick people.","options":["who","which","where"],"a":["who"],"hint":"A person → who (or that)."},
              {"type":"choose","q":"That's the boy ___ broke my window.","options":["that","which","where"],"a":["that"],"hint":"A person → that (or who)."},
              {"type":"gap","q":"I know a woman ___ speaks Chinese. (who / which)","a":["who","that"],"hint":"A person → who (or that)."},
              {"type":"gap","q":"The man ___ lives next door is a doctor. (who / where)","a":["who","that"],"hint":"A person → who (or that)."},
              {"type":"fix","q":"Which sentence is correct?","options":["The girl who sits next to me is very funny.","The girl who she sits next to me is very funny.","The girl which sits next to me is very funny."],"a":["The girl who sits next to me is very funny."],"hint":"A person → who; no she after who."}
            ]
          },
          {
            learn: {"title":"the bus which goes to the station — which / that for things","rule":"Use which or that for things and animals: This is the bus which goes to the station. I've lost the book that you gave me. Both are correct. Don't add it: the phone which I bought (not the phone which I bought it).","table":[["Thing","which / that","More information"],["the bus","which / that","goes to the centre"],["a machine","which / that","washes clothes"],["the cake","which / that","my mum made"]],"examples":["A fridge is a machine which keeps food cold.","This is the bus that goes to the airport.","I loved the film which we saw last night.","Where's the cake that I bought?","We have a dog which loves swimming."],"uz":"Narsa va hayvonlar uchun which yoki that: the book which I read — men o‘qigan kitob."},
            practise: [
              {"type":"choose","q":"A fridge is a machine ___ keeps food cold.","options":["which","who","where"],"a":["which"],"hint":"A thing → which (or that)."},
              {"type":"choose","q":"I liked the film ___ we watched yesterday.","options":["that","who","where"],"a":["that"],"hint":"A thing → that (or which)."},
              {"type":"gap","q":"This is the bus ___ goes to the station. (which / who)","a":["which","that"],"hint":"A thing → which (or that)."},
              {"type":"gap","q":"Where's the cake ___ I bought this morning? (which / who)","a":["which","that"],"hint":"A thing → which (or that)."},
              {"type":"fix","q":"Which sentence is correct?","options":["This is the phone which I bought last week.","This is the phone which I bought it last week.","This is the phone who I bought last week."],"a":["This is the phone which I bought last week."],"hint":"A thing → which; no it at the end."}
            ]
          },
          {
            learn: {"title":"the house where I was born — where for places","rule":"Use where for places. It means 'in that place' or 'at that place': This is the house where I was born. A library is a place where you can borrow books. After where comes a full sentence with its own person: where I was born, where we had lunch.","table":[["Place","where","More information"],["the house","where","I grew up"],["a library","where","you borrow books"],["the café","where","we first met"]],"examples":["This is the town where my mum grew up.","A bakery is a shop where you can buy bread.","That's the restaurant where we had my birthday dinner.","Do you remember the hotel where we stayed?","I want to live in a city where there are lots of parks."],"uz":"Joy uchun where: the house where I was born — men tug‘ilgan uy."},
            practise: [
              {"type":"choose","q":"This is the school ___ I studied.","options":["where","who","which"],"a":["where"],"hint":"A place → where."},
              {"type":"choose","q":"A bakery is a shop ___ you can buy bread.","options":["where","who","what"],"a":["where"],"hint":"A place → where."},
              {"type":"gap","q":"That's the café ___ we first met. (who / where)","a":["where"],"hint":"A place → where."},
              {"type":"gap","q":"A hospital is a place ___ doctors and nurses work. (who / where)","a":["where"],"hint":"A place → where."},
              {"type":"order","q":"Put the words in order.","words":["where","This","I","the","is","house","live"],"a":["This is the house where I live.","Is this the house where I live?","The house where I live is this."],"hint":"This is + the house + where I live."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"A teacher is a person ___ helps students learn.","options":["who","which","where"],"a":["who"]},
          {"type":"gap","q":"I've got a friend ___ plays the guitar. (who / which)","a":["who","that"]},
          {"type":"choose","q":"This is the train ___ goes to Oxford.","options":["which","who","where"],"a":["which"]},
          {"type":"gap","q":"I'll phone you when I ___ to London. (get)","a":["get","have got","'ve got"],"from":"g47"},
          {"type":"gap","q":"That's the hotel ___ we stayed last summer. (who / where)","a":["where"]},
          {"type":"fix","q":"Which sentence is correct?","options":["The man who lives next door is a pilot.","The man which lives next door is a pilot.","The man who he lives next door is a pilot."],"a":["The man who lives next door is a pilot."]},
          {"type":"choose","q":"I've lost the book ___ you gave me.","options":["that","who","where"],"a":["that"]},
          {"type":"order","q":"Put the words in order.","words":["who","the","That's","girl","won","race","the"],"a":["That's the girl who won the race."]},
          {"type":"fix","q":"Which sentence is correct?","options":["If you call me, I'll come.","If you will call me, I'll come.","If you call me, I'll coming."],"a":["If you call me, I'll come."],"from":"g46"},
          {"type":"gap","q":"A camera is a thing ___ takes photos. (which / who)","a":["which","that"]},
          {"type":"choose","q":"A museum is a place ___ you can see old and famous things.","options":["where","who","which"],"a":["where"]},
          {"type":"gap","q":"If you mix red and yellow, you ___ orange. (get — present simple)","a":["get"],"from":"g45"},
          {"type":"gap","q":"Do you know the woman ___ is talking to Tom? (who / which)","a":["who","that"]},
          {"type":"fix","q":"Which sentence is correct?","options":["This is the cake which my mum made.","This is the cake who my mum made.","This is the cake which my mum made it."],"a":["This is the cake which my mum made."]},
          {"type":"choose","q":"Is this the street ___ you live?","options":["where","which","who"],"a":["where"]},
          {"type":"choose","q":"You ___ come tomorrow. The lesson is cancelled.","options":["don't have to","mustn't"],"a":["don't have to"],"from":"g43"},
          {"type":"order","q":"Put the words in order.","words":["is","A","pilot","a","person","who","flies","planes"],"a":["A pilot is a person who flies planes.","Is a pilot a person who flies planes?","A person who flies planes is a pilot."]},
          {"type":"gap","q":"I like films ___ make me laugh. (which / who)","a":["which","that"]},
          {"type":"choose","q":"The students ___ passed the test got a prize.","options":["who","which","where"],"a":["who"]},
          {"type":"gap","q":"That's the park ___ I learned to ride a bike. (which / where)","a":["where"]}
        ]
      },
      {
        id: "g49", no: 49, title: "Gerund vs Infinitive", v: 1,
        chunks: [
          {
            learn: {"title":"I enjoy swimming — verb + -ing","rule":"Some verbs are followed by the -ing form of another verb (a gerund): enjoy, finish, avoid, mind, practise, keep. I enjoy swimming. She finished writing her essay. Do you mind waiting? Don't use to after these verbs: I enjoy reading (not enjoy to read).","table":[["Verb","+ -ing","Example"],["enjoy","+ -ing","I enjoy cooking."],["finish","+ -ing","Have you finished eating?"],["avoid","+ -ing","She avoids eating sugar."],["mind","+ -ing","Do you mind opening the window?"],["practise","+ -ing","I practise speaking English every day."],["keep","+ -ing","He keeps forgetting my name."]],"examples":["I enjoy swimming in the sea.","She finished writing her essay at midnight.","Do you mind waiting for a few minutes?","He avoids driving in the city.","I practise playing the piano every day.","My little brother keeps asking questions."],"uz":"enjoy, finish, avoid, mind, practise, keep fe’llaridan keyin -ing shakl keladi: I enjoy reading — Men kitob o‘qishni yoqtiraman."},
            practise: [
              {"type":"choose","q":"I enjoy ___ in the sea.","options":["swimming","to swim","swim"],"a":["swimming"],"hint":"enjoy + -ing."},
              {"type":"choose","q":"Have you finished ___ your homework?","options":["doing","to do","do"],"a":["doing"],"hint":"finish + -ing."},
              {"type":"gap","q":"Do you mind ___ the door, please? (close)","a":["closing"],"hint":"mind + -ing: closing."},
              {"type":"gap","q":"She avoids ___ fast food. (eat)","a":["eating"],"hint":"avoid + -ing: eating."},
              {"type":"fix","q":"Which sentence is correct?","options":["He keeps losing his keys.","He keeps to lose his keys.","He keeps lose his keys."],"a":["He keeps losing his keys."],"hint":"keep + -ing: losing."}
            ]
          },
          {
            learn: {"title":"I want to travel — verb + to + verb","rule":"Other verbs are followed by to + verb (an infinitive): want, decide, hope, plan, agree, refuse, promise, would like ('d like). I want to travel. We decided to stay at home. She refused to answer. Don't use -ing after these verbs: I want to go (not want going). Negative: put not before to: I promise not to be late.","table":[["Verb","+ to + verb","Example"],["want","to","I want to learn Spanish."],["decide","to","We decided to leave early."],["hope","to","She hopes to become a doctor."],["plan","to","They're planning to move."],["agree / refuse","to","He agreed to help. / He refused to help."],["promise","to","I promise to call you."]],"examples":["I want to travel around the world.","We decided to stay at home.","She hopes to become a doctor.","They're planning to buy a house.","He refused to answer my question.","I promise not to be late."],"uz":"want, decide, hope, plan, agree, refuse, promise dan keyin to + fe’l keladi: I want to travel — Men sayohat qilishni xohlayman."},
            practise: [
              {"type":"choose","q":"I want ___ a new phone.","options":["to buy","buying","buy"],"a":["to buy"],"hint":"want + to + verb."},
              {"type":"choose","q":"We decided ___ at home.","options":["to stay","staying","stay"],"a":["to stay"],"hint":"decide + to + verb."},
              {"type":"gap","q":"She hopes ___ a doctor one day. (become — to + verb)","a":["to become"],"hint":"hope + to + verb: to become."},
              {"type":"gap","q":"He refused ___ my question. (answer — to + verb)","a":["to answer"],"hint":"refuse + to + verb: to answer."},
              {"type":"order","q":"Put the words in order.","words":["to","I'd","travel","like"],"a":["I'd like to travel."],"hint":"I'd like + to + travel."}
            ]
          },
          {
            learn: {"title":"good at drawing — -ing after prepositions","rule":"After a preposition (at, in, of, about, for, without…), always use the -ing form: I'm good at drawing. Thanks for helping me. She left without saying goodbye. The -ing form can also be the subject of a sentence: Swimming is good for you. Remember: like, love, hate and start can take both forms: I like reading. / I like to read.","table":[["","Example"],["preposition + -ing","I'm interested in learning Japanese."],["preposition + -ing","Thank you for coming."],["-ing as the subject","Reading is my favourite hobby."],["like / love / hate + both","I love dancing. / I love to dance."]],"examples":["I'm good at drawing.","Thank you for helping me.","She left without saying goodbye.","I'm thinking about buying a new bike.","Swimming is good exercise.","Reading is my favourite hobby."],"uz":"Predlogdan keyin (at, in, for, without) doim -ing keladi: I'm good at drawing — Men rasm chizishni yaxshi bilaman."},
            practise: [
              {"type":"choose","q":"I'm good at ___ pictures.","options":["drawing","to draw","draw"],"a":["drawing"],"hint":"at (a preposition) + -ing."},
              {"type":"choose","q":"Thank you for ___ me.","options":["helping","to help","help"],"a":["helping"],"hint":"for (a preposition) + -ing."},
              {"type":"gap","q":"She's interested in ___ Japanese. (learn)","a":["learning"],"hint":"in (a preposition) + -ing: learning."},
              {"type":"gap","q":"___ is good exercise. (swim — the subject of the sentence)","a":["Swimming"],"hint":"-ing as the subject: Swimming."},
              {"type":"fix","q":"Which sentence is correct?","options":["He left without saying goodbye.","He left without to say goodbye.","He left without say goodbye."],"a":["He left without saying goodbye."],"hint":"without (a preposition) + -ing."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"I really enjoy ___ cakes.","options":["baking","to bake","bake"],"a":["baking"]},
          {"type":"gap","q":"We plan ___ to Spain next summer. (travel — to + verb)","a":["to travel"]},
          {"type":"choose","q":"She agreed ___ me with my project.","options":["to help","helping","help"],"a":["to help"]},
          {"type":"gap","q":"A dentist is a person ___ looks after your teeth. (who / which)","a":["who","that"],"from":"g48"},
          {"type":"gap","q":"Have you finished ___ the book? (read)","a":["reading"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I want to learn French.","I want learning French.","I want learn French."],"a":["I want to learn French."]},
          {"type":"choose","q":"Do you mind ___ a little?","options":["waiting","to wait","wait"],"a":["waiting"]},
          {"type":"order","q":"Put the words in order.","words":["decided","She","to","stay","home","at"],"a":["She decided to stay at home."]},
          {"type":"choose","q":"I'll call you as soon as I ___ the results.","options":["get","will get","got"],"a":["get"],"from":"g47"},
          {"type":"gap","q":"I'm tired of ___ for the bus. (wait)","a":["waiting"]},
          {"type":"choose","q":"He promised ___ late again.","options":["not to be","not being","not be"],"a":["not to be"]},
          {"type":"choose","q":"If you ___ hard, you'll pass the exam.","options":["study","will study","studied"],"a":["study"],"from":"g46"},
          {"type":"gap","q":"My brother is very good at ___ football. (play)","a":["playing"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She avoids driving at night.","She avoids to drive at night.","She avoids drive at night."],"a":["She avoids driving at night."]},
          {"type":"choose","q":"I hope ___ you again soon.","options":["to see","seeing","see"],"a":["to see"]},
          {"type":"gap","q":"It ___ snow tomorrow. I'm not sure. (maybe — one word)","a":["might","may","could"],"from":"g44"},
          {"type":"order","q":"Put the words in order.","words":["is","Reading","my","hobby","favourite"],"a":["Reading is my favourite hobby.","My favourite hobby is reading.","Is reading my favourite hobby?"]},
          {"type":"gap","q":"They refused ___ for the broken window. (pay — to + verb)","a":["to pay"]},
          {"type":"choose","q":"Thanks for ___ me to your party.","options":["inviting","to invite","invite"],"a":["inviting"]},
          {"type":"fix","q":"Which sentence is correct?","options":["I'm thinking about buying a new bike.","I'm thinking about to buy a new bike.","I'm thinking about buy a new bike."],"a":["I'm thinking about buying a new bike."]}
        ]
      },
      {
        id: "g50", no: 50, title: "Too and Enough", v: 1,
        chunks: [
          {
            learn: {"title":"too hot, too small — too + adjective","rule":"too + adjective = more than is good or possible — it's a problem: This coffee is too hot (I can't drink it). These shoes are too small. Add to + verb to say what you can't do: The box is too heavy to carry. Don't mix up too and very: very hot = hot, but OK; too hot = a problem.","table":[["too + adjective","Result"],["This tea is too hot.","I can't drink it."],["The bag is too heavy to carry.","I can't carry it."],["He is too young to drive.","He can't drive."]],"examples":["This coffee is too hot. I'll wait a minute.","These shoes are too small for me.","The box is too heavy to carry.","He's too young to drive.","It's too cold to swim today."],"uz":"too + sifat — haddan tashqari (muammo): This tea is too hot — Bu choy haddan tashqari issiq (ichib bo‘lmaydi)."},
            practise: [
              {"type":"choose","q":"I can't drink this tea. It's ___ hot.","options":["too","enough","many"],"a":["too"],"hint":"A problem (I can't drink it) → too + adjective."},
              {"type":"choose","q":"These jeans are ___ small. I need a bigger size.","options":["too","enough","much"],"a":["too"],"hint":"A problem → too + adjective."},
              {"type":"gap","q":"He's ___ young to drive a car. He's only twelve. (too / enough)","a":["too"],"hint":"A problem (he can't drive) → too + young."},
              {"type":"gap","q":"This box is too heavy ___ carry. (one word)","a":["to"],"hint":"too + adjective + to + verb."},
              {"type":"fix","q":"Which sentence is correct?","options":["It's too cold to swim today.","It's too much cold to swim today.","It's cold too to swim today."],"a":["It's too cold to swim today."],"hint":"too + adjective: too cold."}
            ]
          },
          {
            learn: {"title":"old enough, not big enough — adjective + enough","rule":"adjective + enough = as much as you need: She's old enough to drive. Look at the word order: enough comes after the adjective — old enough (not enough old). Negative: not + adjective + enough = less than you need: The water isn't warm enough for swimming.","table":[["adjective + enough","Example"],["old enough","She's old enough to vote."],["big enough","Is the room big enough for ten people?"],["not warm enough","It isn't warm enough to sit outside."]],"examples":["She's eighteen. She's old enough to vote.","Is your room big enough for a desk?","The water isn't warm enough for swimming.","I'm not tall enough to reach the top shelf.","He didn't run fast enough to win."],"uz":"sifat + enough — yetarlicha: She's old enough to drive — Uning mashina haydashga yoshi yetadi."},
            practise: [
              {"type":"choose","q":"She's eighteen. She's ___ to vote.","options":["old enough","enough old","old too"],"a":["old enough"],"hint":"adjective + enough: old enough."},
              {"type":"choose","q":"The room isn't ___ for all of us.","options":["big enough","enough big","big too"],"a":["big enough"],"hint":"not + adjective + enough."},
              {"type":"gap","q":"Are you tall ___ to reach the top shelf? (too / enough)","a":["enough"],"hint":"As tall as you need → tall enough."},
              {"type":"gap","q":"It isn't warm ___ to swim. (too / enough)","a":["enough"],"hint":"not + warm + enough."},
              {"type":"order","q":"Put the words in order.","words":["isn't","He","enough","strong"],"a":["He isn't strong enough.","Isn't he strong enough?"],"hint":"He isn't + strong + enough."}
            ]
          },
          {
            learn: {"title":"enough time, too many people — with nouns","rule":"enough goes before a noun: We have enough chairs. I don't have enough time. With nouns, use too many + plural nouns and too much + uncountable nouns: There are too many people here. I drank too much coffee.","table":[["","Example"],["enough + noun","Have we got enough eggs for the cake?"],["not enough + noun","There isn't enough milk."],["too many + plural noun","There are too many cars in the city."],["too much + uncountable noun","You put too much salt in the soup."]],"examples":["We have enough chairs for everyone.","I don't have enough time to finish.","There are too many people on this bus.","I drank too much coffee today.","Is there enough milk for two cups?"],"uz":"enough otdan oldin keladi: enough money — yetarli pul; too many / too much — haddan ortiq ko‘p."},
            practise: [
              {"type":"choose","q":"We don't have ___ for everyone.","options":["enough chairs","too chairs","chairs too"],"a":["enough chairs"],"hint":"enough + noun: enough chairs."},
              {"type":"choose","q":"There are ___ people on this bus. I can't move!","options":["too many","too much","much"],"a":["too many"],"hint":"people = plural → too many."},
              {"type":"gap","q":"I can't buy it. I haven't got ___ money. (too / enough)","a":["enough"],"hint":"enough + noun: enough money."},
              {"type":"gap","q":"You put too ___ sugar in my tea. (much / many)","a":["much"],"hint":"sugar = uncountable → too much."},
              {"type":"fix","q":"Which sentence is correct?","options":["I don't have enough time.","I don't have enough of time.","I don't have too time."],"a":["I don't have enough time."],"hint":"enough + noun: enough time."}
            ]
          }
        ],
        test: [
          {"type":"choose","q":"This soup is ___ hot. I'll wait a few minutes.","options":["too","enough","many"],"a":["too"]},
          {"type":"gap","q":"Is the water warm ___ for a swim? (too / enough)","a":["enough"]},
          {"type":"choose","q":"He's sixteen. He isn't ___ to drive.","options":["old enough","enough old","old too"],"a":["old enough"]},
          {"type":"choose","q":"I enjoy ___ to music.","options":["listening","to listen","listen"],"a":["listening"],"from":"g49"},
          {"type":"gap","q":"These shoes are ___ big. I need a smaller size. (too / enough)","a":["too"]},
          {"type":"fix","q":"Which sentence is correct?","options":["We haven't got enough eggs.","We haven't got enough of eggs.","We haven't got too eggs."],"a":["We haven't got enough eggs."]},
          {"type":"choose","q":"There's ___ traffic in the city centre.","options":["too much","too many","enough of"],"a":["too much"]},
          {"type":"order","q":"Put the words in order.","words":["too","is","It","to","cold","swim"],"a":["It is too cold to swim.","Is it too cold to swim?"]},
          {"type":"choose","q":"This is the café ___ we first met.","options":["where","which","who"],"a":["where"],"from":"g48"},
          {"type":"gap","q":"I can't reach it. I'm not tall ___. (too / enough)","a":["enough"]},
          {"type":"choose","q":"I ate ___ cakes at the party. Now I feel sick.","options":["too many","too much","much"],"a":["too many"]},
          {"type":"fix","q":"Which sentence is correct?","options":["If you heat butter, it melts.","If you heat butter, it melt.","If you heats butter, it melts."],"a":["If you heat butter, it melts."],"from":"g45"},
          {"type":"gap","q":"This bag is too heavy ___ carry. (one word)","a":["to"]},
          {"type":"fix","q":"Which sentence is correct?","options":["She isn't old enough to watch this film.","She isn't enough old to watch this film.","She isn't old too to watch this film."],"a":["She isn't old enough to watch this film."]},
          {"type":"choose","q":"Have we got ___ for a cake?","options":["enough flour","too flour","flour too"],"a":["enough flour"]},
          {"type":"gap","q":"Yesterday we ___ walk home because there were no buses. (have to — past)","a":["had to"],"from":"g42"},
          {"type":"order","q":"Put the words in order.","words":["enough","have","We","time","don't"],"a":["We don't have enough time.","Don't we have enough time?"]},
          {"type":"gap","q":"There are too ___ cars on the road today. (much / many)","a":["many"]},
          {"type":"choose","q":"The film was ___ boring. I fell asleep.","options":["too","enough","many"],"a":["too"]},
          {"type":"fix","q":"Which sentence is correct?","options":["You drink too much coffee.","You drink too many coffee.","You drink coffee too many."],"a":["You drink too much coffee."]}
        ]
      }
    ]
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
