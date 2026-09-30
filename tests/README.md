# Automatic tests

They open the app in a real browser (Chromium) and check what the teacher relies on:
every page opens, the exercise builders (Sentences, Pronunciation's microphone,
Dictation audio), results (read once, then only new ones), Top 5 per group,
"Didn't do it", Checked, dictation scoring, exercise links (play.html, 7 days),
the database warnings, the lesson and finished-exercise warnings.

- **The real database is never touched**: `support/fake-firestore.js` stands in for
  Firebase, and `support/data.js` is a made-up class (no real students).
- **On GitHub** they run by themselves for every push (`.github/workflows/tests.yml`);
  a red ✗ next to a commit means something broke.
- **Here**: `npm install`, then `npm test` (or, with a browser already installed,
  `PW_CHROMIUM=/path/to/chromium npm test`).

When you add or change a feature, add a test for it in the matching file.
