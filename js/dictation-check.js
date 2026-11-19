/* The Dictation Journey's checker (teacher, 2026-11-19). A student hears one sentence and types it; dcCheck(expected, typed)
   says whether it's right and marks the words. Loaded on the student page (skill.html) and the teacher's Course page, so it
   stands on its own (no common.js, no DOM).
   "Right" = the same words: spelling exact (British and American spellings stay different — it's a spelling exercise),
   contractions as in the passage ("I'm" ≠ "I am"); case, punctuation, curly/straight apostrophes, hyphen vs space and accents
   (café/cafe) don't matter — capitals/punctuation only give a gentle note. Numbers count in digits or in words, the way the
   recording says them (tools/make-dictation-audio.py spoken()): both sides become the same keys —
     12 = twelve · 7:20 = 7.20 = seven twenty · 9:00 = nine o'clock = 9 · 22:00 = twenty-two hundred · 05:30 = five thirty ·
     1987 = nineteen eighty-seven · 14 August = 14th August = the fourteenth of August · 9 a.m. = 9am = nine A M (→ 9 am) ·
     AZ 418 = AZ418 = A Z four one eight · 126 = one hundred and twenty-six · 12,000 = 12 000 = 12.000 = twelve thousand.
   Ordinals stay ordinals outside a date ("first" = "1st" ≠ "one"); a passage's "o'clock" must be typed (only "9:00" with no
   o'clock written takes "9" or "nine o'clock"); Doctor = Dr, Mister = Mr (the voice says them in full); a hyphenated word may
   be typed joined ("wellbeing" for "well-being").
   dcWordKeys(s) gives those keys; dcCheck lines the keys up (weighted edit distance, like taDictAlign in common.js: a similar
   word is one wrong word, an unrelated one is an extra + a missing word). */
(function () {
  var UNITS = {}, TENS = {}, ORD_UNITS = {}, ORD_TENS = {};
  'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'
    .split(' ').forEach(function (w, i) { UNITS[w] = i; });
  'twenty thirty forty fifty sixty seventy eighty ninety'.split(' ').forEach(function (w, i) { TENS[w] = 20 + 10 * i; });
  ('first second third fourth fifth sixth seventh eighth ninth tenth eleventh twelfth thirteenth fourteenth fifteenth sixteenth ' +
    'seventeenth eighteenth nineteenth').split(' ').forEach(function (w, i) { ORD_UNITS[w] = i + 1; });
  'twentieth thirtieth fortieth fiftieth sixtieth seventieth eightieth ninetieth'.split(' ').forEach(function (w, i) { ORD_TENS[w] = 20 + 10 * i; });
  var MONTHS = {};
  'january february march april may june july august september october november december'.split(' ').forEach(function (m) { MONTHS[m] = 1; });
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  // the text's pieces with where they are: times "7:20"/"7.20", numbers "12,000", "14th", digits, words (with ' inside)
  var PIECE = /(\d{1,2}[:.]\d{2})(?!\d)|(\d{1,3}(?:[,. \u00A0\u202F]\d{3})+)(?!\d)|(\d+)(st|nd|rd|th)(?![A-Za-z])|(\d+)|([A-Za-zÀ-ɏ]+(?:'[A-Za-zÀ-ɏ]+)*'?)/g;
  function prep(s) {
    var text = String(s == null ? '' : s).normalize('NFC');
    // apostrophe look-alikes → ' (one character for one, so places stay the same)
    return { text: text, plain: text.replace(/[‘’ʼʻ`´]/g, "'") };
  }
  var ALIAS = { doctor: 'dr', mister: 'mr' };   // the voice says "Doctor Harris", "Mister Wilson"
  var ABBR = { dr: 1, mr: 1, mrs: 1, ms: 1, st: 1 };   // "Mrs." = "Mrs": the dot isn't a punctuation mistake
  function wordKey(w) { return w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function pieces(plain) {
    var out = [], m;
    PIECE.lastIndex = 0;
    while ((m = PIECE.exec(plain))) {
      var s = m.index, e = s + m[0].length;
      if (m[1]) { var hm = m[1].split(/[:.]/); out.push({ kind: 't', h: +hm[0], m: hm[1], s: s, e: e }); }
      else if (m[2]) { var d = m[2].replace(/[^0-9]/g, ''); out.push({ kind: 'n', dig: d, val: +d, s: s, e: e }); }
      else if (m[3]) out.push({ kind: 'n', val: +m[3], ord: true, s: s, e: e });
      else if (m[5]) out.push({ kind: 'n', dig: m[5], val: +m[5], s: s, e: e });
      else {
        var w = m[6];
        // a closing quote after a word isn't part of it — only the plural's "students'" keeps it
        if (/'$/.test(w) && !/s'$/i.test(w)) { w = w.slice(0, -1); e--; }
        var wk = wordKey(w);
        out.push({ kind: 'w', k: has(ALIAS, wk) ? ALIAS[wk] : wk, s: s, e: e });
      }
    }
    return out;
  }

  // number words from toks[i] on: "one hundred and twenty-six", "twenty-two hundred", "twelve thousand", "twenty-first"
  function numberWords(toks, i) {
    var total = 0, cur = 0, last = null, ord = false, j = i, words = 0;
    var isW = function (t) { return t && t.kind === 'w'; };
    for (; j < toks.length && isW(toks[j]); ) {
      var w = toks[j].k;
      var afterBig = last === null || last === 'hundred' || last === 'thousand' || last === 'and';
      if (has(UNITS, w)) {
        var v = UNITS[w];
        if (v === 0) { if (last !== null) break; j++; words++; last = 'zero'; break; }
        if (!(afterBig || (last === 'tens' && v < 10))) break;
        cur += v; last = v < 10 ? 'unit' : 'teen'; j++; words++;
      } else if (has(ORD_UNITS, w)) {
        var ov = ORD_UNITS[w];
        if (!(afterBig || (last === 'tens' && ov < 10))) break;
        cur += ov; ord = true; j++; words++; break;
      } else if (has(TENS, w)) {
        if (!afterBig) break;
        cur += TENS[w]; last = 'tens'; j++; words++;
      } else if (has(ORD_TENS, w)) {
        if (!afterBig) break;
        cur += ORD_TENS[w]; ord = true; j++; words++; break;
      } else if (w === 'hundred') {
        if (!(last === 'unit' || last === 'teen' || last === 'tens') || cur >= 100) break;
        cur *= 100; last = 'hundred'; j++; words++;
      } else if (w === 'thousand') {
        if (!(last === 'unit' || last === 'teen' || last === 'tens' || last === 'hundred') || !cur) break;
        total += cur * 1000; cur = 0; last = 'thousand'; j++; words++;
      } else if (w === 'and') {
        var nx = isW(toks[j + 1]) ? toks[j + 1].k : '';
        if (!(last === 'hundred' || last === 'thousand')) break;
        if (!((has(UNITS, nx) && UNITS[nx] > 0) || has(TENS, nx) || has(ORD_UNITS, nx) || has(ORD_TENS, nx))) break;
        last = 'and'; j++;
      } else break;
    }
    if (!words) return null;
    return { kind: 'n', val: total + cur, ord: ord, words: true, small: words === 1, s: toks[i].s, e: toks[j - 1].e, end: j };
  }

  var isNum = function (t) { return t && (t.kind === 'n' || t.kind === 't'); };
  var isInt = function (t) { return t && t.kind === 'n' && !t.ord && !t.code; };
  var isWord = function (t, re) { return t && t.kind === 'w' && re.test(t.k); };
  var merge = function (a, b, extra) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in extra || {}) o[k] = extra[k]; o.s = Math.min(a.s, b.s); o.e = Math.max(a.e, b.e); return o; };

  function tokens(plain, foldOclock) {
    var p = pieces(plain), t = [], i, x;
    // number words → numbers
    for (i = 0; i < p.length; ) {
      if (p[i].kind === 'w') { x = numberWords(p, i); if (x) { t.push(x); i = x.end; continue; } }
      t.push(p[i]); i++;
    }
    // "nine o'clock" = 9 (only when the passage doesn't write "o'clock" itself); "seven oh five" = 7:05
    var u = [];
    for (i = 0; i < t.length; i++) {
      x = t[i];
      if (foldOclock && isWord(x, /^o'clock$/) && isNum(u[u.length - 1])) { u[u.length - 1] = merge(u[u.length - 1], x); continue; }
      if (isWord(x, /^(oh|o)$/) && isInt(u[u.length - 1]) && u[u.length - 1].val <= 24 && isInt(t[i + 1]) && t[i + 1].val <= 9 && (!t[i + 1].dig || t[i + 1].dig.length === 1)) {
        u[u.length - 1] = merge(u[u.length - 1], t[i + 1], { kind: 't', h: u[u.length - 1].val, m: '0' + t[i + 1].val, said: true }); i++; continue;
      }
      u.push(x);
    }
    // single digits one after another are a code: "four one eight" = 418
    t = [];
    for (i = 0; i < u.length; i++) {
      var single = function (y) { return isInt(y) && y.val <= 9 && (y.dig ? y.dig.length === 1 : y.small); };
      if (single(u[i]) && single(u[i + 1])) {
        var run = u[i], digs = String(u[i].val);
        while (single(u[i + 1])) { i++; digs += u[i].val; run = merge(run, u[i]); }
        t.push(merge(run, run, { dig: digs, val: +digs, code: true, words: false })); continue;
      }
      t.push(u[i]);
    }
    // two numbers said together are a time or a year: "seven twenty" = 7:20, "nineteen eighty-seven" = 1987, "9 00" = 9:00
    u = [];
    for (i = 0; i < t.length; i++) {
      var a = t[i], b = t[i + 1];
      if (isInt(a) && a.val <= 24 && (!a.dig || a.dig.length <= 2) && isInt(b) &&
          ((b.words && b.val >= 10 && b.val <= 99) || (b.dig && b.dig.length === 2))) {
        u.push(merge(a, b, { kind: 't', h: a.val, m: pad2(b.val), said: !b.dig })); i++; continue;
      }
      u.push(a);
    }
    // a.m. / am / "a m" after a number
    t = [];
    for (i = 0; i < u.length; i++) {
      x = u[i];
      if (isNum(t[t.length - 1]) && x.kind === 'w') {
        if (/^[ap]m$/.test(x.k)) { t.push({ kind: 'am', k: x.k, s: x.s, e: x.e }); continue; }
        if (/^[ap]$/.test(x.k) && isWord(u[i + 1], /^m$/)) {
          var end = u[i + 1].e + (plain.charAt(u[i + 1].e) === '.' ? 1 : 0);   // "a.m." with its last dot
          t.push({ kind: 'am', k: x.k + 'm', s: x.s, e: end }); i++; continue;
        }
      }
      // letters spelled one by one before a number: "A Z four one eight" = AZ 418
      if (x.kind === 'w' && x.k.length === 1 && isWord(u[i + 1], /^[a-z]$/)) {
        var j = i, letters = '';
        while (isWord(u[j], /^[a-z]$/)) { letters += u[j].k; j++; }
        if (isNum(u[j])) { t.push({ kind: 'w', k: letters, s: x.s, e: u[j - 1].e, spelled: true }); i = j - 1; continue; }
      }
      t.push(x);
    }
    // dates: "the fourteenth of August" = "14 August"; "the twelfth and the thirteenth of September" = "12 and 13 September"
    u = [];
    for (i = 0; i < t.length; i++) {
      if (isWord(t[i], /^of$/) && t[i - 1] && t[i - 1].kind === 'n' && t[i + 1] && t[i + 1].kind === 'w' && has(MONTHS, t[i + 1].k)) {
        u[u.length - 1] = merge(u[u.length - 1], t[i]); continue;
      }
      u.push(t[i]);
    }
    for (i = u.length - 1; i >= 0; i--) {
      if (u[i].kind !== 'n') continue;
      var nx = u[i + 1];
      if (nx && nx.kind === 'w' && has(MONTHS, nx.k)) u[i].date = true;
      else if (isWord(nx, /^and$/)) {
        var k2 = i + 2; if (isWord(u[k2], /^the$/)) k2++;
        if (u[k2] && u[k2].date) u[i].date = true;
      }
    }
    t = [];
    for (i = 0; i < u.length; i++) {
      if (isWord(u[i], /^the$/) && u[i + 1] && u[i + 1].date) { t.push(merge(u[i + 1], u[i])); i++; continue; }
      t.push(u[i]);
    }
    // the keys
    t.forEach(function (y) {
      if (y.kind === 't') {
        y.k = y.m === '00' && y.h <= 12 ? String(y.h) : y.h + ':' + y.m;
      } else if (y.kind === 'n') {
        var v = y.val;
        if (y.ord) y.k = y.date ? String(v) : v + 'th';   // "14th August" = "14 August"; "first" = "1st" ≠ "one"
        else if (y.code || (y.dig && y.dig.length > 1 && y.dig[0] === '0')) y.k = y.dig;
        else if ((v >= 1000 && v <= 2099) || (v % 100 === 0 && v >= 2100 && v <= 2400)) y.k = Math.floor(v / 100) + ':' + pad2(v % 100);   // years, "twenty-two hundred"
        else y.k = String(v);
      }
    });
    return t;
  }

  function lev(x, y) {
    var prev = [], i, j;
    for (j = 0; j <= y.length; j++) prev.push(j);
    for (i = 1; i <= x.length; i++) {
      var cur = [i];
      for (j = 1; j <= y.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[y.length];
  }
  var similar = function (x, y) { return (1 - lev(x, y) / (Math.max(x.length, y.length) || 1)) >= 0.5; };
  var numeric = /^[\d:]+(th)?$/;
  // similar words (also as typed: "to" for "two"), or two numbers: one wrong word; else a missed word + an extra one
  function sub(a, b) {
    if (a.k === b.k) return 0;
    return similar(a.k, b.k) || similar(a.low, b.low) || (numeric.test(a.k) && numeric.test(b.k)) ? 0.9 : 2.2;
  }
  function align(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d.push(new Array(n + 1).fill(0)); d[i][0] = i; }
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + sub(a[i - 1], b[j - 1]));
    var ops = [];
    i = m; j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + sub(a[i - 1], b[j - 1])) { ops.push({ type: a[i - 1].k === b[j - 1].k ? 'ok' : 'wrong', e: a[i - 1], t: b[j - 1] }); i--; j--; }
      else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.push({ type: 'missing', e: a[i - 1] }); i--; }
      else { ops.push({ type: 'extra', t: b[j - 1] }); j--; }
    }
    return ops.reverse();
  }

  // the punctuation after a token (and before the first): quotes made straight; hyphens and apostrophes aren't punctuation here
  // a.m./p.m. and Mr/Mrs/Dr: their own dot isn't counted ("2 p.m., and" still needs its comma)
  function punctAfter(p, toks, idx) {
    var from = idx < 0 ? 0 : toks[idx].e, to = idx + 1 < toks.length ? toks[idx + 1].s : p.plain.length;
    var tok = idx < 0 ? null : toks[idx], raw = p.plain.slice(from, to);
    if (tok && tok.kind === 'am') raw = raw.replace(/\./g, '');
    else if (tok && tok.kind === 'w' && has(ABBR, tok.k)) raw = raw.replace(/^\./, '');
    return raw.replace(/[“”„«»]/g, '"').replace(/[\s'\-‐-―]/g, '');
  }

  // "well-being" typed "wellbeing": a hyphenated word of the passage counts as one word when the student joined it
  function joinHyphened(p, te, tt) {
    var typedKeys = {}, out = [], i;
    tt.forEach(function (x) { typedKeys[x.k] = 1; });
    for (i = 0; i < te.length; i++) {
      var j = i, joined = te[i].k;
      while (te[j].kind === 'w' && te[j + 1] && te[j + 1].kind === 'w' && /^[-\u2010\u2011]$/.test(p.plain.slice(te[j].e, te[j + 1].s))) { j++; joined += te[j].k; }
      if (j > i && te[i].kind === 'w' && has(typedKeys, joined)) { out.push({ kind: 'w', k: joined, s: te[i].s, e: te[j].e }); i = j; continue; }
      out.push(te[i]);
    }
    return out;
  }

  function dcWordKeys(s) { return tokens(prep(s).plain, false).map(function (t) { return t.k; }); }

  function dcCheck(expected, typed) {
    expected = String(expected == null ? '' : expected);
    // junk can't freeze the page: the alignment grows with both lengths
    var pe = prep(expected), pt = prep(String(typed == null ? '' : typed).slice(0, 4 * expected.length + 50));
    var te = tokens(pe.plain, false);
    var fold = !te.some(function (x) { return x.k === "o'clock"; });
    var tt = tokens(pt.plain, fold);
    te = joinHyphened(pe, te, tt);
    te.forEach(function (x) { x.low = wordKey(pe.plain.slice(x.s, x.e)); });
    tt.forEach(function (x) { x.low = wordKey(pt.plain.slice(x.s, x.e)); });
    var ops = align(te, tt);
    var surf = function (p, tok) { return p.text.slice(tok.s, tok.e); };
    var caps = false, punct = false, ok = true, parts = [];
    if (punctAfter(pe, te, -1) !== punctAfter(pt, tt, -1)) punct = true;
    ops.forEach(function (o) {
      if (o.type === 'ok') parts.push({ text: surf(pt, o.t), state: 'ok' });
      else if (o.type === 'wrong') parts.push({ text: surf(pt, o.t), state: 'wrong', want: surf(pe, o.e) });
      else if (o.type === 'missing') parts.push({ text: surf(pe, o.e), state: 'missing' });
      else parts.push({ text: surf(pt, o.t), state: 'extra' });
      if (o.type !== 'ok') ok = false;
      if (o.e && o.t) {
        if (o.type === 'ok' && o.e.kind === 'w' && o.t.kind === 'w') {
          var a = surf(pe, o.e), b = surf(pt, o.t);
          if (a !== b && a.toLowerCase() === b.toLowerCase()) caps = true;
        }
        if (punctAfter(pe, te, te.indexOf(o.e)) !== punctAfter(pt, tt, tt.indexOf(o.t))) punct = true;
      }
    });
    var note = caps && punct ? 'Check the capital letters and punctuation.' : caps ? 'Check the capital letters.' : punct ? 'Check the punctuation.' : '';
    return { ok: ok, parts: parts, note: note };
  }

  window.dcCheck = dcCheck;
  window.dcWordKeys = dcWordKeys;
})();
