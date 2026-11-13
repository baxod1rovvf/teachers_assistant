// Skills course: how marks turn into IELTS-style bands (shared by the student page and Loom).
// - Listening and Reading: the score is scaled to 40 (round(correct / total x 40)), then the IELTS table below.
// - Writing estimate: 3 + 3 x length + 3 x (1 - mistakes per 100 words / 10, at least 0), rounded to the nearest half band,
//   kept between 1 and 9. length = words / minimum below the minimum, 1 from the minimum up; more words than the maximum add
//   half a band (teacher, 2026-11-09: writing more must not lower the band — it raises it a little).
//   If the grammar check didn't run, the last part is 1.5. Only real mistakes count (skCountsAsMistake).
//   A blank writing (0 words) is band 1. The teacher's own mark replaces this estimate.
// - Overall: the average of the skills present, rounded like IELTS (x.25 goes up to x.5, x.75 to the next whole band).
// - CEFR from Overall: 8.5-9 C2 / 7-8 C1 / 5.5-6.5 B2 / 4-5 B1 / 3-3.5 A2 / below that A1.

// [lowest score out of 40, band] from the top down.
var SK_BAND_TABLE = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5],
  [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [1, 2]];

function skBand(correct, total) {
  if (!total || total <= 0 || !(correct > 0)) return 0;
  var n = Math.round(Math.min(correct, total) / total * 40);
  for (var i = 0; i < SK_BAND_TABLE.length; i++) if (n >= SK_BAND_TABLE[i][0]) return SK_BAND_TABLE[i][1];
  return 0;
}

function skOverall(bands) {
  var have = (bands || []).filter(function (b) { return typeof b === 'number' && !isNaN(b); });
  if (!have.length) return null;
  var mean = have.reduce(function (s, b) { return s + b; }, 0) / have.length;
  return Math.floor(mean * 2 + 0.5) / 2;
}

function skCefr(band) {
  if (band >= 8.5) return 'C2';
  if (band >= 7) return 'C1';
  if (band >= 5.5) return 'B2';
  if (band >= 4) return 'B1';
  if (band >= 3) return 'A2';
  return 'A1';
}

function skBandColour(band) {
  if (band >= 6.5) return 'good';
  if (band >= 5.5) return 'mid';
  return 'low';
}

// Which grammar-check findings count as mistakes (teacher, 2026-11-09: the check "says the i inside pencils should be uppercase",
// flags spaces and names). Not counted: extra spaces between words, American/British spelling ("favorite"), and spelling
// "mistakes" in words that start with a capital letter — those are names (Mohlaroy → "Molar"). `m` = { bad, message, rule?, kind? }
// (results sent before 2026-11-09 have only bad/fix/message, so the message is read too).
function skCountsAsMistake(m) {
  if (!m) return false;
  var bad = String(m.bad == null ? '' : m.bad), msg = String(m.message || ''), rule = String(m.rule || '');
  if (rule === 'WHITESPACE_RULE' || /consecutive spaces/i.test(msg) || (bad && !bad.trim())) return false;
  if (/\b(American|British) English\b/i.test(msg) || /^EN_GB_SIMPLE_REPLACE|AMERICAN|BRITISH/i.test(rule)) return false;
  var spelling = m.kind === 'misspelling' || /^MORFOLOGIK/i.test(rule) || /spelling mistake/i.test(msg);
  if (spelling && /^[A-Z\u00C0-\u024F\u0400-\u042F]/.test(bad.trim())) return false;
  return true;
}

/* An ID as the app compares it (teacher, 2026-11-09: a student who typed his ID was listed under "name only").
   Small differences in how an ID is typed don't matter: case, spaces/dots/dashes inside ("10 001"), a leading "ID"/"№"/"#",
   leading zeros ("0071" = "71"), full-width digits (NFKC) and Cyrillic letters that look Latin (А12 = A12). */
var TA_ID_LOOKALIKE = { 'а': 'a', 'в': 'b', 'е': 'e', 'к': 'k', 'м': 'm', 'н': 'h', 'о': 'o', 'р': 'p', 'с': 'c', 'т': 't', 'у': 'y', 'х': 'x', 'і': 'i' };
function taIdKey(v) {
  var s = String(v == null ? '' : v);
  try { s = s.normalize('NFKC'); } catch (e) { /* old browser */ }
  s = s.trim().toLowerCase().replace(/[авекмнорстухі]/g, function (c) { return TA_ID_LOOKALIKE[c] || c; });
  s = s.replace(/^(?:id|№|#|no\.?)(?:\s*[:.#-]\s*|\s+|(?=\d))(?=\S)/, '').replace(/[\s._\-#'"`]/g, '');
  if (/^\d+$/.test(s)) s = s.replace(/^0+(?=\d)/, '');
  return s;
}
if (typeof window !== 'undefined') window.taIdKey = taIdKey;

/* The course's class list online (teacher, 2026-11-09: "student can only enter exercise with ID"): Copy link puts the group's
   list under the link's code with each ID scrambled — sha256("<code>|<taIdKey(id)>"), first 24 hex — so the page can check a
   typed ID while nobody can read the IDs from the database. Resolves to '' where the browser can't hash (very old). */
function skClassHash(code, id) {
  var key = taIdKey(id);
  if (!key || typeof crypto === 'undefined' || !crypto.subtle || typeof TextEncoder === 'undefined') return Promise.resolve('');
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(code) + '|' + key)).then(function (buf) {
    return Array.from(new Uint8Array(buf)).map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 24);
  }, function () { return ''; });
}
/* Does a typed name fit the name on the list? Case, ʻ ’ ' marks and order don't matter; one word of 3+ letters is enough
   ("Mohlaroy" fits "Yuldasheva Mohlaroy"; "Mohla" fits too — the start of a name). */
function skNameFits(typed, listed) {
  var words = function (v) { return String(v || '').toLowerCase().replace(/[ʻʼ’'`‘]/g, '').split(/[^\p{L}\p{N}]+/u).filter(function (w) { return w.length >= 3; }); };
  var a = words(typed), b = words(listed);
  return a.some(function (x) { return b.some(function (y) { return y === x || y.indexOf(x) === 0 || x.indexOf(y) === 0; }); });
}

/* Reading Journey's WH-questions (teacher, 2026-11-09): an answer is right when it has one of the question's main words.
   Case, accents (café = cafe), punctuation and thousands commas (1,500 = 1500) don't matter. A one-word key matches a word
   that starts with it ("dream" → "dreams", "explor" → "exploring"); keys of 1–2 letters or digits must be the whole word
   ("2" is not "20"); a key of several words is looked for as a phrase ("enough time"). */
function skOpenRight(answer, keys) {
  var clean = function (v) {
    var t = String(v == null ? '' : v).toLowerCase();
    try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { /* old browser */ }
    return t.replace(/[’‘`]/g, "'").replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  };
  var given = clean(answer);
  if (!given) return false;
  var words = given.split(' ');
  return (keys || []).some(function (k) {
    var key = clean(k);
    if (!key) return false;
    if (key.indexOf(' ') !== -1) return (' ' + given + ' ').indexOf(' ' + key) !== -1;
    if (key.length <= 2 || /^\d+$/.test(key)) return words.indexOf(key) !== -1;
    return words.some(function (w) { return w.indexOf(key) === 0; });
  });
}

/* ---------- Writing Journey (teacher, 2026-11-09) ----------
   skAskedWords(text, words): which asked words the student used — other forms count (use → used/uses/using, try → tried,
   meet → met, spend → spent, child → children), and a phrase may have up to 3 words inside it ("get along really well
   with" counts for "get along with"). Returns { used: [w], missing: [w] } in the task's order. */
var SK_IRREGULAR = { be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'], was: ['was', 'were'], born: ['born'], meet: ['met'], spend: ['spent'],
  take: ['took', 'taken'], buy: ['bought'], go: ['went', 'gone', 'goes'], have: ['has', 'had', 'having'], make: ['made'], get: ['got', 'gotten'],
  become: ['became'], wear: ['wore', 'worn'], feed: ['fed'], keep: ['kept'], do: ['did', 'does', 'done'], pay: ['paid'], choose: ['chose', 'chosen'],
  child: ['children'], come: ['came'], see: ['saw', 'seen'], eat: ['ate', 'eaten'], drink: ['drank'], swim: ['swam'], begin: ['began'], know: ['knew'],
  think: ['thought'], bring: ['brought'], teach: ['taught'], feel: ['felt'], leave: ['left'], find: ['found'], tell: ['told'], say: ['said'],
  sleep: ['slept'], win: ['won'], lose: ['lost'], run: ['ran'], write: ['wrote', 'written'], read: ['read'], put: ['put'], cost: ['cost'],
  hang: ['hung'], share: ['shared'], i: ['i'], me: ['me', 'my'], would: ['would', "i'd"], am: ['am', "i'm"] };
function skWordForms(w) {
  var f = [w, w + 's', w + 'es', w + 'ed', w + 'd', w + 'ing', w + "'s", w + 'er', w + 'est', w + 'ly'];
  if (/[^aeiou]y$/.test(w)) { var b = w.slice(0, -1); f.push(b + 'ies', b + 'ied', b + 'ier', b + 'iest', b + 'ily'); }
  if (/e$/.test(w)) f.push(w.slice(0, -1) + 'ing', w.slice(0, -1) + 'ed');
  if (/[^aeiou][aeiou][bdgklmnprt]$/.test(w)) { var d = w + w.slice(-1); f.push(d + 'ed', d + 'ing', d + 'er'); }
  if (/f$/.test(w)) f.push(w.slice(0, -1) + 'ves');
  return f.concat(SK_IRREGULAR[w] || []);
}
function skAskedWords(text, words) {
  var clean = function (v) { return String(v == null ? '' : v).toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9' -]+/g, ' ').replace(/\s+/g, ' ').trim(); };
  var toks = clean(text).replace(/-/g, ' ').split(' ').filter(Boolean);
  var used = [], missing = [];
  (words || []).forEach(function (item) {
    var w = typeof item === 'string' ? item : item.w;
    var parts = clean(w).replace(/-/g, ' ').split(' ').filter(Boolean);
    var forms = parts.map(skWordForms);
    var found = false;
    for (var i = 0; i < toks.length && !found; i++) {
      if (forms[0].indexOf(toks[i]) === -1) continue;
      var at = i, ok = true;
      for (var k = 1; k < parts.length; k++) {
        var hit = -1;
        for (var j = at + 1; j <= Math.min(toks.length - 1, at + 4); j++) if (forms[k].indexOf(toks[j]) !== -1) { hit = j; break; }
        if (hit < 0) { ok = false; break; }
        at = hit;
      }
      if (ok) found = true;
    }
    (found ? used : missing).push(w);
  });
  return { used: used, missing: missing };
}
/* The final score of an AI-checked writing (the teacher's 9-point system): grammar 0–3 + vocabulary 0–2 + structure 0–2 +
   task 0–2, then −0.5 when the writing is shorter than the minimum (never for writing more); nearest half band, 1–9. */
function skWritingAiBand(scores, words, minWords) {
  var part = function (v, max) { v = Number(v); return isFinite(v) ? Math.max(0, Math.min(max, v)) : 0; };
  var s = scores || {};
  var total = part(s.grammar, 3) + part(s.vocabulary, 2) + part(s.structure, 2) + part(s.task, 2);
  if (minWords > 0 && words < minWords) total -= 0.5;
  return Math.max(1, Math.min(9, Math.round(total * 2) / 2));
}
