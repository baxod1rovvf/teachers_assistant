# Teacher's Assistant

The app is split into one HTML page per sidebar section. The pages link to each other through the sidebar.

| Page | Sidebar section | Page script |
| --- | --- | --- |
| `index.html` | 🎓 Dashboard (start page) | `js/pages/main.js` |
| `create.html` | ➕ Create (picker, every exercise builder, Homework & Class, IELTS) | `js/pages/create.js` + `js/exercise-templates.js` |
| `statistics.html` | 📊 Statistics | `js/pages/statistics.js` |
| `my-exercises.html` | 📁 My Exercises | `js/pages/my-exercises.js` |
| `students.html` | 👥 Students | `js/pages/students.js` |
| `results.html` | Results | `js/pages/results.js` |
| `points.html` | Points & Rewards | `js/pages/points.js` |
| `settings.html` | ⚙️ Settings | `js/pages/settings.js` |
| `CP.html` | Control Panel (admin: teacher accounts) | self-contained |

Every page also loads these shared files:

- `css/style.css`: all styles
- `js/accounts.js`: sign-in, and keeps each teacher's saved data separate
- `js/lottie.min.js` + `js/animations.js`: the animation library and its animation data
- `js/common.js`: shared code (page switching, toasts and Undo toasts, sounds, students/groups data, exercises list, results storage, lesson schedule and reminders, lesson plans, theme, profile picture, login screen, assistant robot)
- `js/firebase.js`: live results, points and account sync

Switching sections in the sidebar doesn't reload the app. The first time you open a section, its panels and script are added to the page you're on (`taNavigate()` in `js/common.js`). After that, switching is instant, just like the old single file. Once the app has loaded, the other sections are downloaded in the background. Opening or refreshing any section's address directly still works.

On GitHub Pages the address bar shows clean names without `.html`: `…/teachers_assistant/index`, `…/students`, `…/create`, and so on. A builder can be opened directly with a link like `…/create#flashcard`.

## Getting a link to the app (GitHub Pages)

1. On GitHub, open the repository and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Pick the branch (for example `main`) and the folder `/ (root)`, then click **Save**.
4. Wait 1–2 minutes and refresh the page. The link appears at the top:
   `https://<your-username>.github.io/teachers_assistant/`

That link opens the Dashboard (shown as `…/teachers_assistant/index`). The Control Panel is at `…/teachers_assistant/CP.html`.

## Saved work

- **Drafts:** while a builder is open, its form is saved in this browser every few seconds. Opening the builder again after closing the tab offers **Restore** or **Discard**.
- **Use again:** every exercise in My Exercises keeps its builder form. **✏️ Use again** reopens the builder filled in. Exercises made before this was added get their word list back (for the list builders). A Homework/Class set reopens with every round rebuilt and the last round open; rounds can be taken out of a set with ✕ in the "Added so far" list.
- **Undo:** deleting an exercise, removing a student, deleting a group, discarding a draft and **Reset All** happen straight away and can be undone from the message at the top (or with Ctrl+Z) for a few seconds.

- **Same words, another exercise:** Flashcard, Spelling, Make a Word, Pronunciation and Sentences have a **↪ Use these words in** bar that carries the word list (and the title, if the other builder has none) into another of them. Word Order and Test do the same with sentences. Words already there aren't added twice, Flashcard keeps its translations, and it can be undone. In a Homework/Class round the same bar reads **↪ Next round with the same words**: it adds the round to the set and starts the next round in the chosen type with the same words and title.

- **Fill translations:** Flashcard's **🌐 Fill empty translations** machine-translates every word that has no translation yet (Uzbek by default; the language is a setting), using the same free service as Bidirectional Language.
- **Usual settings:** points, time limit, design, quiz type and the other settings are remembered per exercise type from the last exercise made, and Reset All goes back to them. Titles, words and instructions are never carried over.

- **Exercises for a group:** every builder has a **For group** picker. My Exercises shows each exercise's group (click it to change it), filters by group, and search finds group names. A group on the Students page links to its exercises.

The code is in the "SAVED WORK" and "USE THE SAME WORDS" sections of `js/pages/create.js` (`taCaptureBuilder` / `taRestoreBuilder`).

## Getting around and sharing

- **Search (Ctrl+K, ⌘K on a Mac, or `/`):** jump to any section, builder, group, student (by name or ID) or exercise (by title, code or a word in it). There's also a 🔍 Search button in the sidebar.
- **Add many students:** in an open group, **📋 Add many** takes a pasted class list (`Name, ID` per line, or two columns copied from Excel/Google Sheets) or a CSV file. A preview shows what will be added; students without an ID get the next free number, and IDs already in use are skipped.
- **Backup:** Settings → 💾 Backup downloads one `.json` file with the account's data. **Restore from file** downloads the current data first (`…_before-restore.json`), then replaces it and reloads.
- **Worksheet:** My Exercises → **🖨 Worksheet** turns a word-list exercise (Flashcard, Spelling, Make a Word, Pronunciation, Sentences, Word Order, Test) into a printable page: matching, circle the spelling, unscramble, gap-fill… with the answer key on its own page.
- **Share:** My Exercises → **📤 Share** gives a ready message for the class chat, sends the exercise file through the phone's share sheet (or downloads it on a computer), and can show the class code in big numbers for the classroom screen.

## Installing as an app

`manifest.webmanifest`, the icons in `images/app/` and the service worker `sw.js` let teachers install the app (Settings → 📲 Install on this device, or the browser's own install option; on iPhone/iPad: Safari → Share → Add to Home Screen). Installed or not, pages the browser has loaded open without a connection: pages are fetched from the network first and saved for offline use; styles, scripts and images are served from the saved copy and refreshed in the background. Because file addresses carry `?v=…`, bumping the version is still what makes browsers pick up new code. The service worker only handles this site's own files, never Firebase.
