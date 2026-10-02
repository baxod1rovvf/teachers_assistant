/* ================= INTERFACE LANGUAGE (English / Oʻzbekcha / Русский) =================
   The app is written in English. When a teacher picks another language,
   this file swaps the interface text as it appears: labels, buttons,
   headings, placeholders, tooltips, pop-up messages and confirmations.
   It watches the page, so text drawn later (lists, messages, sections
   opened later) is translated too.

   - Text is matched whole, ignoring emoji and symbols at either end, so
     "🎓 Dashboard" and "Dashboard" share one entry (TA_I18N_ROWS in
     js/i18n-strings.js: [English, Uzbek, Russian]).
   - Things teachers type (exercise titles, student and group names) sit in
     elements marked translate="no" and are never changed.
   - Exercise files for students stay in English: they're English lessons.
   The choice is per device (not per account), so the sign-in screen uses
   it too. Loaded right after accounts.js on every page. */
(function () {
  var LANGS = { en: 'English', uz: 'Oʻzbekcha', ru: 'Русский' };
  var raw = window.taRaw;
  var lang = 'en';
  try { lang = (raw ? raw.get('ta_ui_lang') : localStorage.getItem('ta_ui_lang')) || 'en'; } catch (e) { lang = 'en'; }
  if (!LANGS[lang]) lang = 'en';

  window.taUiLang = function () { return lang; };
  window.taUiLangs = LANGS;
  window.taSetUiLang = function (l) {
    if (!LANGS[l] || l === lang) return;
    try { if (raw) raw.set('ta_ui_lang', l); else localStorage.setItem('ta_ui_lang', l); } catch (e) { /* ignore */ }
    location.reload();
  };
  // Translation of one piece of English (identity in English).
  window.taT = function (s) { return lang === 'en' ? String(s) : tr(String(s)); };

  if (lang === 'en') return;
  document.documentElement.lang = lang;
  // the word list, only for teachers who use another language (same ?v= as this file)
  if (!window.TA_I18N_ROWS && document.readyState === 'loading') {
    var me = document.currentScript, src = me ? me.getAttribute('src') : 'js/i18n.js';
    document.write('<script src="' + src.replace('i18n.js', 'i18n-strings.js') + '"><\/script>');
  }

  var col = lang === 'uz' ? 1 : 2;
  var dict = null;
  function table() {
    if (dict) return dict;
    if (!window.TA_I18N_ROWS) return {}; // not loaded yet
    dict = Object.create(null);
    window.TA_I18N_ROWS.forEach(function (r) { if (r[col]) dict[r[0]] = r[col]; });
    return dict;
  }

  // Emoji, symbols and spaces around the words are kept as they are
  // (quotes and end punctuation belong to the words).
  var KEEP = /["'“”‘’«»….!?:)]/;
  function isEdge(ch) {
    if (KEEP.test(ch)) return false;
    return /[\s\u00A0\u2000-\u2BFF\u2E00-\u2E7F\uFE0F\u200D\u20E3+•·#№✕×]/.test(ch);
  }
  function splitEdges(s) {
    var i = 0;
    var lead = s.match(/^\s*[.,;:)]+\s+/); // ". Everything…" after a bold word
    if (lead) i = lead[0].length;
    while (i < s.length) {
      var c = s.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF) { i += 2; continue; } // emoji
      if (isEdge(s[i])) { i++; continue; }
      break;
    }
    var j = s.length;
    while (j > i) {
      var c2 = s.charCodeAt(j - 1);
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) { j -= 2; continue; }
      if (isEdge(s[j - 1])) { j--; continue; }
      break;
    }
    return [s.slice(0, i), s.slice(i, j), s.slice(j)];
  }

  function runPatterns(x) {
    for (var k = 0; k < PATTERNS.length; k++) {
      var mm = x.match(PATTERNS[k][0]);
      if (mm) { var out = PATTERNS[k][1](mm); if (out) return out; }
    }
    return null;
  }
  function lookup(core) {
    var d = table();
    if (d[core]) return d[core];
    // the same text with end punctuation: "Word." / "Word…" / "Word:" / "Word!"
    var m = core.match(/^(.*?)(\.\.\.|[.:!?…,]+)$/);
    var base = m ? m[1] : core, end = m ? m[2] : '';
    if (m && d[base]) return d[base] + end;
    var out = runPatterns(core);
    if (out) return out;
    if (m) {
      out = runPatterns(base);
      if (out) return /[.!?…:]$/.test(out) ? out : out + end;
    }
    return null;
  }

  function tr(s) {
    if (!s || !/[A-Za-z]{2}/.test(s)) return s;
    var parts = splitEdges(s);
    if (!parts[1]) return s;
    var t = lookup(parts[1].replace(/\s+/g, ' '));
    return t ? parts[0] + t + parts[2] : s;
  }
  // translate a name that may or may not be known (used inside patterns)
  function trName(x) { var t = lookup(x); return t || x; }
  function n(num, one, few, many) { // Russian plural forms
    var a = Math.abs(num) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    if (b > 1 && b < 5) return few;
    if (b === 1) return one;
    return many;
  }

  /* Messages with names or numbers in them. Each: [regex on the English, fn(match) -> translation]. */
  var UZ = lang === 'uz';
  var PATTERNS = [
    [/^(.+) — Teacher's Assistant$/, function (m) { return trName(m[1]) + ' — Teacher\'s Assistant'; }],
    [/^Create "(.+)"$/, function (m) { return UZ ? '“' + trName(m[1]) + '” yaratish' : 'Создать «' + trName(m[1]) + '»'; }],
    [/^([a-z]{2}(?:-[A-Z]{2})?) — (.+)$/, function (m) { return m[1] + ' — ' + trName(m[2]); }],
    [/^(\d+) (words?|sentences?|students?|exercises?|slides?|groups?|points?|items?|rounds?|tries|seconds?|student\(s\))$/, function (m) {
      var k = +m[1], w = m[2].replace(/s$|\(s\)$/, '');
      var uz = { word: 'soʻz', sentence: 'gap', student: 'oʻquvchi', exercise: 'mashq', slide: 'slayd', group: 'guruh', point: 'ball', item: 'element', round: 'bosqich', trie: 'urinish', tries: 'urinish', second: 'soniya' };
      var ru = { word: ['слово', 'слова', 'слов'], sentence: ['предложение', 'предложения', 'предложений'], student: ['ученик', 'ученика', 'учеников'],
        exercise: ['упражнение', 'упражнения', 'упражнений'], slide: ['слайд', 'слайда', 'слайдов'], group: ['группа', 'группы', 'групп'],
        point: ['балл', 'балла', 'баллов'], item: ['элемент', 'элемента', 'элементов'], round: ['раунд', 'раунда', 'раундов'],
        trie: ['попытка', 'попытки', 'попыток'], tries: ['попытка', 'попытки', 'попыток'], second: ['секунда', 'секунды', 'секунд'] };
      if (UZ) return uz[w] ? k + ' ' + uz[w] : null;
      return ru[w] ? k + ' ' + n(k, ru[w][0], ru[w][1], ru[w][2]) : null;
    }],
    [/^(\d+) of (\d+)$/, function (m) { return UZ ? m[2] + ' tadan ' + m[1] : m[1] + ' из ' + m[2]; }],
    [/^(\d+) seconds — (.+)$/, function (m) { return UZ ? m[1] + ' soniya — ' + trName(m[2]) : m[1] + ' ' + n(+m[1], 'секунда', 'секунды', 'секунд') + ' — ' + trName(m[2]); }],
    [/^(\d+) — no points$/, function (m) { return UZ ? m[1] + ' — ballsiz' : m[1] + ' — без баллов'; }],
    [/^Student · ID (.+)$/, function (m) { return (UZ ? 'Oʻquvchi · ID ' : 'Ученик · ID ') + m[1]; }],
    [/^(.+) · code (\w+)$/, function (m) { return trName(m[1]) + (UZ ? ' · kod ' : ' · код ') + m[2]; }],
    [/^(No code set|Code: (\S+)) · (.+)$/, function (m) { return (m[2] ? (UZ ? 'Kod: ' : 'Код: ') + m[2] : (UZ ? 'Kod qoʻyilmagan' : 'Без кода')) + ' · ' + m[3]; }],
    [/^(\d+) pts$/, function (m) { return m[1] + (UZ ? ' ball' : ' ' + n(+m[1], 'балл', 'балла', 'баллов')); }],
    [/^Slide (\d+)$/, function (m) { return (UZ ? 'Slayd ' : 'Слайд ') + m[1]; }],
    [/^Signed in as$/, function () { return UZ ? 'Kirgan hisob:' : 'Вы вошли как'; }],
    [/^Removed "(.+)" from My Exercises$/, function (m) { return UZ ? '“' + m[1] + '” Mashqlarimdan olib tashlandi.' : '«' + m[1] + '» убрано из «Моих упражнений».'; }],
    [/^"(.+)" is back$/, function (m) { return UZ ? '“' + m[1] + '” qaytarildi.' : '«' + m[1] + '» возвращено.'; }],
    [/^"(.+)" downloaded!?(.*)$/, function (m) { return UZ ? '“' + m[1] + '” yuklab olindi!' + m[2] : '«' + m[1] + '» скачано!' + m[2]; }],
    [/^"(.+)" is ready to edit\.?(.*)$/, function (m) { return (UZ ? '“' + m[1] + '” tahrirlashga tayyor.' : '«' + m[1] + '» готово к редактированию.') + (m[2] ? ' ' + tr(m[2].trim()) : ''); }],
    [/^Removed (.+) \(ID (.+)\)$/, function (m) { return UZ ? m[1] + ' (ID ' + m[2] + ') olib tashlandi.' : m[1] + ' (ID ' + m[2] + ') удалён(а).'; }],
    [/^(.+) is back$/, function (m) { return UZ ? m[1] + ' qaytarildi.' : m[1] + ' возвращён(а).'; }],
    [/^Added (\d+) students? to (.+)$/, function (m) { return UZ ? m[2] + ' guruhiga ' + m[1] + ' ta oʻquvchi qoʻshildi.' : 'В «' + m[2] + '» добавлено ' + m[1] + ' ' + n(+m[1], 'ученик', 'ученика', 'учеников') + '.'; }],
    [/^Add (\d+) students?$/, function (m) { return UZ ? m[1] + ' ta oʻquvchini qoʻshish' : 'Добавить ' + m[1] + ' ' + n(+m[1], 'ученика', 'учеников', 'учеников'); }],
    [/^Add many students to (.+)$/, function (m) { return UZ ? m[1] + ': koʻp oʻquvchi qoʻshish' : 'Добавить учеников: ' + m[1]; }],
    [/^ID already used by (.+) — skipped$/, function (m) { return UZ ? 'Bu ID ' + m[1] + 'da bor — oʻtkazib yuborildi' : 'Этот ID уже у ' + m[1] + ' — пропущено'; }],
    [/^Deleted "(.+)"(.*)$/, function (m) {
      var rest = m[2].match(/its (\d+) students? moved to "(.+)" with their points/);
      if (UZ) return '“' + m[1] + '” oʻchirildi' + (rest ? ' — ' + rest[1] + ' ta oʻquvchi ballari bilan “' + rest[2] + '”ga oʻtkazildi.' : '.');
      return '«' + m[1] + '» удалена' + (rest ? ' — ' + rest[1] + ' ' + n(+rest[1], 'ученик переведён', 'ученика переведены', 'учеников переведены') + ' в «' + rest[2] + '» с баллами.' : '.');
    }],
    [/^Added group "(.+)"$/, function (m) { return UZ ? '“' + m[1] + '” guruhi qoʻshildi.' : 'Группа «' + m[1] + '» добавлена.'; }],
    [/^Added (.+) \(ID (.+)\)(?: to (.+))?$/, function (m) { return UZ ? m[1] + ' (ID ' + m[2] + ') qoʻshildi' + (m[3] ? ' — ' + m[3] : '') + '.' : m[1] + ' (ID ' + m[2] + ') добавлен(а)' + (m[3] ? ' в «' + m[3] + '»' : '') + '.'; }],
    [/^That ID is already used by (.+)\. Each student needs a unique ID$/, function (m) { return UZ ? 'Bu ID allaqachon ' + m[1] + 'da bor. Har bir oʻquvchining IDsi boshqacha boʻlishi kerak.' : 'Этот ID уже у ' + m[1] + '. У каждого ученика должен быть свой ID.'; }],
    [/^(\d+) words? added to (.+?)( \((\d+) already there\))?\.(.*)$/, function (m) {
      var k = +m[1];
      var base = UZ ? k + ' ta soʻz “' + trName(m[2]) + '”ga qoʻshildi' + (m[3] ? ' (' + m[4] + ' tasi allaqachon bor)' : '') + '.'
        : k + ' ' + n(k, 'слово добавлено', 'слова добавлены', 'слов добавлено') + ' в «' + trName(m[2]) + '»' + (m[3] ? ' (' + m[4] + ' уже были)' : '') + '.';
      return base + (m[5] ? ' ' + tr(m[5].trim()) : '');
    }],
    [/^(\d+) sentences? added to (.+?)( \((\d+) already there\))?\.?$/, function (m) {
      var k = +m[1];
      return UZ ? k + ' ta gap “' + trName(m[2]) + '”ga qoʻshildi' + (m[3] ? ' (' + m[4] + ' tasi allaqachon bor)' : '') + '.'
        : k + ' ' + n(k, 'предложение добавлено', 'предложения добавлены', 'предложений добавлено') + ' в «' + trName(m[2]) + '»' + (m[3] ? ' (' + m[4] + ' уже были)' : '') + '.';
    }],
    [/^All of these (words|sentences) are already in (.+)$/, function (m) { return UZ ? 'Bularning hammasi “' + trName(m[2]) + '”da allaqachon bor.' : 'Всё это уже есть в «' + trName(m[2]) + '».'; }],
    [/^Taken out of (.+) again$/, function (m) { return UZ ? '“' + trName(m[1]) + '”dan qayta olib tashlandi.' : 'Снова убрано из «' + trName(m[1]) + '».'; }],
    [/^Round (\d+) added\. Round (\d+): (.+) with the same (\d+) (words?|sentences?)\.(.*)$/, function (m) {
      var word = /^w/.test(m[5]);
      return (UZ ? m[1] + '-bosqich qoʻshildi. ' + m[2] + '-bosqich: “' + trName(m[3]) + '”, xuddi shu ' + m[4] + ' ta ' + (word ? 'soʻz' : 'gap') + ' bilan.'
        : 'Раунд ' + m[1] + ' добавлен. Раунд ' + m[2] + ': «' + trName(m[3]) + '» с теми же ' + m[4] + ' ' + (word ? n(+m[4], 'словом', 'словами', 'словами') : n(+m[4], 'предложением', 'предложениями', 'предложениями')) + '.') +
        (m[6] ? ' ' + tr(m[6].trim()) : '');
    }],
    [/^Back to round (\d+)$/, function (m) { return UZ ? m[1] + '-bosqichga qaytildi.' : 'Назад к раунду ' + m[1] + '.'; }],
    [/^Took "(.+)" out of the set$/, function (m) { return UZ ? '“' + m[1] + '” toʻplamdan olib tashlandi.' : '«' + m[1] + '» убрано из набора.'; }],
    [/^Translated (\d+) words?\. Check them — machine translation can be wrong$/, function (m) { return UZ ? m[1] + ' ta soʻz tarjima qilindi. Tekshirib chiqing — mashina tarjimasi xato qilishi mumkin.' : 'Переведено ' + m[1] + ' ' + n(+m[1], 'слово', 'слова', 'слов') + '. Проверьте — машинный перевод может ошибаться.'; }],
    [/^Translated (\d+), but (\d+) failed — type those by hand$/, function (m) { return UZ ? m[1] + ' tasi tarjima qilindi, ' + m[2] + ' tasi boʻlmadi — ularni qoʻlda yozing.' : 'Переведено ' + m[1] + ', но ' + m[2] + ' не удалось — впишите их вручную.'; }],
    [/^Add some (words|sentences) first$/, function (m) { return UZ ? 'Avval ' + (m[1] === 'words' ? 'soʻz' : 'gap') + ' qoʻshing.' : 'Сначала добавьте ' + (m[1] === 'words' ? 'слова' : 'предложения') + '.'; }],
    [/^Please finish filling in this exercise first — then its (words|sentences) carry over$/, function () { return UZ ? 'Avval bu mashqni toʻldirib boʻling — keyin soʻzlari oʻtadi.' : 'Сначала заполните это упражнение — потом слова перейдут дальше.'; }],
    [/^"(.+)" is now for (.+)$/, function (m) { return UZ ? '“' + m[1] + '” endi ' + m[2] + ' uchun.' : '«' + m[1] + '» теперь для «' + m[2] + '».'; }],
    [/^"(.+)" isn't linked to a group now$/, function (m) { return UZ ? '“' + m[1] + '” endi hech qaysi guruhga bogʻlanmagan.' : '«' + m[1] + '» больше не привязано к группе.'; }],
    [/^Which group is "(.+)" for\?$/, function (m) { return UZ ? '“' + m[1] + '” qaysi guruh uchun?' : 'Для какой группы «' + m[1] + '»?'; }],
    [/^Renamed to "(.+)"$/, function (m) { return UZ ? 'Yangi nom: “' + m[1] + '”.' : 'Новое название: «' + m[1] + '».'; }],
    [/^\+(\d+) more$/, function (m) { return UZ ? 'yana ' + m[1] + ' ta' : 'ещё ' + m[1]; }],
    [/^Share "(.+)"$/, function (m) { return UZ ? '“' + m[1] + '”ni ulashish' : 'Поделиться «' + m[1] + '»'; }],
    [/^Nothing matches(.*)$/, function (m) { return UZ ? 'Hech narsa topilmadi.' : 'Ничего не найдено.'; }],
    [/^"(.+)" reopened: (\d+) rounds? added, the last one is open to check\. Then add more or press Create$/, function (m) {
      return UZ ? '“' + m[1] + '” qayta ochildi: ' + m[2] + ' ta bosqich qoʻshildi, oxirgisi tekshirish uchun ochiq. Keyin yana qoʻshing yoki “Yaratish”ni bosing.'
        : '«' + m[1] + '» открыто снова: добавлено ' + m[2] + ' ' + n(+m[2], 'раунд', 'раунда', 'раундов') + ', последний открыт для проверки. Затем добавьте ещё или нажмите «Создать».';
    }],
    [/^Last backup from this device: (.+)$/, function (m) { return (UZ ? 'Bu qurilmadan oxirgi zaxira nusxa: ' : 'Последняя резервная копия с этого устройства: ') + m[1] + '.'; }],
    [/^Made (.+) from account (.+)$/, function (m) { return UZ ? m[1] + ' da, ' + m[2] + ' hisobidan olingan.' : 'Создано ' + m[1] + ', аккаунт ' + m[2] + '.'; }],
    [/^Unfinished work — (.+)$/, function (m) { return (UZ ? 'Tugallanmagan ish — ' : 'Незаконченная работа — ') + m[1]; }],
    [/^saved (just now|\d+ (?:min|hours?|days?) ago)$/, function (m) {
      var t = m[1];
      if (t === 'just now') return UZ ? 'hozirgina saqlandi' : 'сохранено только что';
      var k = parseInt(t, 10);
      if (/min/.test(t)) return UZ ? k + ' daqiqa oldin saqlandi' : 'сохранено ' + k + ' мин назад';
      if (/hour/.test(t)) return UZ ? k + ' soat oldin saqlandi' : 'сохранено ' + k + ' ' + n(k, 'час', 'часа', 'часов') + ' назад';
      return UZ ? k + ' kun oldin saqlandi' : 'сохранено ' + k + ' ' + n(k, 'день', 'дня', 'дней') + ' назад';
    }],
    [/^(\d+) (correct|wrong|missed|extra)$/, function (m) {
      var uz = { correct: 'toʻgʻri', wrong: 'xato', missed: 'tushib qolgan', extra: 'ortiqcha' };
      var ru = { correct: 'верно', wrong: 'ошибок', missed: 'пропущено', extra: 'лишних' };
      return m[1] + ' ' + (UZ ? uz : ru)[m[2]];
    }],
    [/^(\d)\/5 — (.+)$/, function (m) { return m[1] + '/5 — ' + trName(m[2]); }],
    [/^(\d+) results?$/, function (m) { return UZ ? m[1] + ' ta natija' : m[1] + ' ' + n(+m[1], 'результат', 'результата', 'результатов'); }],
    [/^In (\d+) weeks$/, function (m) { return UZ ? m[1] + ' haftadan keyin' : 'Через ' + m[1] + ' ' + n(+m[1], 'неделю', 'недели', 'недель'); }],
    [/^Get one exercise from "(.+)"$/, function (m) { return UZ ? '“' + m[1] + '” dan bitta mashq olish' : 'Одно упражнение из «' + m[1] + '»'; }],
    [/^Added "(.+)" to My Exercises$/, function (m) { return UZ ? '“' + m[1] + '” Mashqlarimga qoʻshildi.' : '«' + m[1] + '» добавлено в «Мои упражнения».'; }],
    [/^(\d+) exercises?$/, function (m) { return UZ ? m[1] + ' ta mashq' : m[1] + ' ' + n(+m[1], 'упражнение', 'упражнения', 'упражнений'); }]
  ];

  /* ---------- applying it to the page ---------- */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1 };
  var ATTRS = ['placeholder', 'title', 'aria-label'];
  function skipped(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP_TAGS[e.tagName] || e.isContentEditable) return true;
      if (e.getAttribute('translate') === 'no') return true;
    }
    return false;
  }
  // "<span>2</span> words": the word agrees with the number just before it (Russian)
  function countBefore(node) {
    var prev = node.previousSibling;
    var num = prev && prev.nodeType === 1 ? prev.textContent.trim() : '';
    return /^\d+$/.test(num) ? num : null;
  }
  function doText(node) {
    var v = node.__taOrig || node.nodeValue;
    if (!v || !/[A-Za-z]{2}/.test(v) || !node.parentElement || skipped(node.parentElement)) return;
    var t = tr(v);
    var num = countBefore(node);
    if (num !== null) {
      var parts = splitEdges(v);
      var counted = parts[1] && runPatterns(num + ' ' + parts[1]);
      if (counted) t = parts[0] + counted.replace(/^\d+ /, '') + parts[2];
    }
    if (t !== v) { node.__taOrig = v; node.__taLast = t; if (node.nodeValue !== t) node.nodeValue = t; }
  }
  // a number changed: its word after it may need another ending
  function recount(el) {
    var next = el && el.nextSibling;
    if (next && next.nodeType === 3 && next.__taOrig) doText(next);
  }
  function doAttrs(el) {
    // a text box's own placeholder is translated; what's typed in it never is
    if (el.nodeType !== 1 || el.getAttribute('translate') === 'no' || (el.parentElement && skipped(el.parentElement))) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (v && /[A-Za-z]{2}/.test(v)) { var t = tr(v); if (t !== v) el.setAttribute(ATTRS[i], t); }
    }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && el.value) { var tv = tr(el.value); if (tv !== el.value) el.value = tv; }
  }
  function doTree(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    if (skipped(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (nd) {
        if (nd.nodeType === 1) {
          if (nd.getAttribute('translate') === 'no') return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS[nd.tagName]) { doAttrs(nd); return NodeFilter.FILTER_REJECT; }
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nd;
    while ((nd = w.nextNode())) { if (nd.nodeType === 3) doText(nd); else doAttrs(nd); }
  }

  var obs = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === 'childList') { for (var j = 0; j < m.addedNodes.length; j++) doTree(m.addedNodes[j]); recount(m.target); }
      else if (m.type === 'characterData') {
        var tn = m.target;
        if (tn.nodeValue !== tn.__taLast) { tn.__taOrig = null; doText(tn); } // the app wrote new text (not our translation)
        recount(tn.parentElement);
      }
      else if (m.type === 'attributes') doAttrs(m.target);
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  // everything already on the page (and the tab title) once it's all there
  function all() { doTree(document.body); var t = document.querySelector('title'); if (t && t.firstChild) doText(t.firstChild); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();

  // the browser's own OK/Cancel and question boxes
  var c = window.confirm, p = window.prompt, a = window.alert;
  window.confirm = function (msg) { return c.call(window, tr(String(msg))); };
  window.prompt = function (msg, def) { return p.call(window, tr(String(msg)), def); };
  window.alert = function (msg) { return a.call(window, tr(String(msg))); };
})();

/* The language picker: on the sign-in card and in Settings. */
function taLangPickerHtml() {
  var cur = window.taUiLang ? window.taUiLang() : 'en';
  var langs = window.taUiLangs || { en: 'English' };
  return Object.keys(langs).map(function (k) {
    return '<button type="button" class="lang-choice' + (k === cur ? ' active' : '') + '" translate="no" onclick="taSetUiLang(\'' + k + '\')">' + langs[k] + '</button>';
  }).join('');
}
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('taLoginForm');
  if (form && !form.querySelector('.lang-pick')) {
    var row = document.createElement('div');
    row.className = 'lang-pick';
    row.innerHTML = taLangPickerHtml();
    form.appendChild(row);
  }
});
