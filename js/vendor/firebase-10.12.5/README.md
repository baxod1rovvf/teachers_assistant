Firebase JavaScript SDK 10.12.5 (Apache License 2.0, © Google LLC) — the browser builds
`firebase-app.js`, `firebase-firestore.js` and `firebase-auth.js` from the npm package
`firebase@10.12.5` (the same files gstatic.com serves), with their import of
`firebase-app.js` pointed at this folder. Kept here so the app works even if gstatic.com
doesn't. Exercise files still load Firebase from gstatic.com (they open from anywhere).
