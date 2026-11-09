// Skills course: how marks turn into IELTS-style bands (shared by the student page and Loom).
// - Listening and Reading: the score is scaled to 40 (round(correct / total x 40)), then the IELTS table below.
// - Writing estimate: 3 + 3 x length + 3 x (1 - mistakes per 100 words / 10, at least 0), rounded to the nearest half band,
//   kept between 1 and 9. length = words / minimum below the minimum, 1 inside the asked range, and 1 - (words - maximum) / maximum
//   above it (teacher, 2026-11-09: "the check should also focus on words counting" — 52 words for 25–35 asked got 7.5).
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

function skWritingBand(words, minWords, mistakes, checked, maxWords) {
  if (!(words > 0)) return 1;   // a blank writing (e.g. the time ran out on an empty box)
  var lengthPart = minWords > 0 ? Math.min(1, words / minWords) : 1;
  if (maxWords > 0 && words > maxWords) lengthPart = Math.max(0, 1 - (words - maxWords) / maxWords);
  var grammarPart = 1.5;
  if (checked) {
    var per100 = words > 0 ? (mistakes / words) * 100 : 0;
    grammarPart = 3 * Math.max(0, 1 - per100 / 10);
  }
  var band = Math.round((3 + 3 * lengthPart + grammarPart) * 2) / 2;
  return Math.max(1, Math.min(9, band));
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
