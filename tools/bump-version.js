// Gives every page a new ?v= stamp, so browsers load the changed CSS/JS files
// instead of their old copies. Run after changing any CSS/JS: `npm run stamp`.
// The stamp is the date plus a letter: 20261001a, 20261001b, … (a new day starts at "a").
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const found = new Set();
pages.forEach(f => (fs.readFileSync(path.join(root, f), 'utf8').match(/\?v=(\d{8}[a-z]+)/g) || []).forEach(m => found.add(m.slice(3))));
const current = [...found].sort((a, b) => a.length - b.length || a.localeCompare(b)).pop() || '';
const d = new Date();
const today = String(d.getFullYear()) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
function nextLetters(s) { // a → b … z → za
  return s.slice(-1) === 'z' ? s + 'a' : s.slice(0, -1) + String.fromCharCode(s.charCodeAt(s.length - 1) + 1);
}
const next = current.startsWith(today) ? today + nextLetters(current.slice(8)) : today + 'a';
let changed = 0;
pages.forEach(f => {
  const p = path.join(root, f);
  const s = fs.readFileSync(p, 'utf8');
  const t = s.replace(/\?v=\d{8}[a-z]+/g, '?v=' + next);
  if (t !== s) { fs.writeFileSync(p, t); changed++; }
});
console.log('Stamp ' + (current || '(none)') + ' → ' + next + ' in ' + changed + ' page' + (changed === 1 ? '' : 's') + '.');
