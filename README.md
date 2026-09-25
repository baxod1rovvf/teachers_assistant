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
- `js/common.js`: shared code (page switching, toasts, sounds, students/groups data, exercises list, results storage, lesson schedule and reminders, lesson plans, theme, profile picture, login screen, assistant robot)
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
