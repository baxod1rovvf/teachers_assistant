/* ================= COURSE SLIDES: editor + Teach mode (2026-11-03) =================
   The teacher's model (a screenshot of a slide editor): thumbnails on the left with ↑ ↓ ⧉ 🙈 🗑,
   a toolbar (+ Slide, Text, Heading, Picture, Shape, Sticker, Timer, Listen, ↶ ↷, Original, File, ▶ Teach),
   the slide in the middle (click = select, double-click = type, drag = move, corner = size, Delete = remove),
   and on the right the slide's background, "Skip in teach mode", teacher notes — or the chosen thing's look and
   "🙈 Hidden until I click" (shown in Teach mode only when the teacher clicks).

   A slide: { bg, bgImg, skip, notes, items: [ { id, type: text|shape|picture|audio|timer, x, y, w, h (on a
   1600 × 900 slide), text, fs, color, fill, bold, font: head|body, align, radius, src, say, seconds, hidden } ] }.
   A lesson's ready-made slides come from its `deck` in course-data.js (layouts below), or — lessons not redone
   yet — from its simple `slides` ({emoji, title, body}). The teacher's changes: ta_course_edits[lessonId] =
   { v: 2, slides } (the whole deck; "Original" removes it). Old text-only changes ({ index: {title, body} }) still
   apply to simple slides. */
const SL_W = 1600, SL_H = 900;
const SL_INK = '#2B2140';
const SL_COLORS = ['#FFFFFF', '#FFF5E1', '#F3F0FA', '#2B2140', '#FF6B6B', '#FF9F43', '#FFD23F', '#2ED3A0', '#22C3D6', '#4D9BFF', '#A97BFF', '#FF7AC6'];
const SL_STICKERS = ['⭐', '🎉', '✅', '❌', '❓', '💡', '👏', '😀', '🤔', '👂', '🗣️', '✍️', '📖', '🎧', '🔤', '🔢', '🏆', '🎯', '⏰', '📞', '❤️', '👍', '👉', '🧠'];
let slUid = 0;
function slId() { return 'i' + Date.now().toString(36) + (slUid++).toString(36); }
function slClone(x) { return JSON.parse(JSON.stringify(x)); }
function slTint(c, pct) { return 'color-mix(in srgb, ' + c + ' ' + pct + '%, #FFFFFF)'; }

/* ---------- ready-made slides from a lesson's deck (layouts) ---------- */
function slText(x, y, w, h, text, o) { return Object.assign({ id: slId(), type: 'text', x, y, w, h, text, fs: 36, color: SL_INK, font: 'body', align: 'left' }, o || {}); }
function slShape(x, y, w, h, fill, o) { return Object.assign({ id: slId(), type: 'shape', x, y, w, h, fill, radius: 0 }, o || {}); }
function slFrame(accent, tag, title) {
  return [slShape(0, 0, 18, SL_H, accent),
    slText(110, 64, 1300, 44, tag, { fs: 24, bold: true, color: accent, spacing: 4 }),
    slText(110, 108, 1380, 96, title, { fs: 62, bold: true, font: 'head' })];
}
function slBuildDeck(stop) {
  const l = stop.lesson, accent = stop.block.color, exNo = {};
  (l.exercises || []).forEach((e, i) => { exNo[e.id] = i + 1; });
  return l.deck.map(d => {
    const s = { bg: '#FFFFFF', items: [], notes: d.notes || '' };
    const add = a => { s.items = s.items.concat(a); };
    if (d.layout === 'title') {
      s.items = [slShape(0, 0, 18, SL_H, accent),
        slText(1080, 60, 470, 760, String(stop.kind === 'lesson' ? stop.no : stop.kind === 'review' ? '🔁' : '🏁'), { fs: 600, bold: true, font: 'head', color: slTint(accent, 35), align: 'center' }),
        slText(110, 170, 900, 50, 'LOOM', { fs: 34, bold: true, spacing: 12 }),
        slText(110, 228, 900, 40, stop.course.title.toUpperCase() + ' · ' + (stop.kind === 'lesson' ? 'LESSON ' + stop.no : stop.kind === 'review' ? 'REVIEW' : 'EXAM'), { fs: 24, bold: true, color: accent, spacing: 5 }),
        slText(110, 300, 960, 280, l.title, { fs: 110, bold: true, font: 'head' }),
        slText(110, 620, 960, 60, 'Block ' + stop.blockNo + ' · ' + stop.block.title, { fs: 40, color: '#5A4E72' }),
        slShape(110, 700, 90, 10, accent, { radius: 5 }),
        slText(1300, 640, 200, 200, l.emoji, { fs: 140, align: 'center' })];
    } else if (d.layout === 'list') {
      add(slFrame(accent, d.tag, d.title));
      d.rows.forEach((r, i) => add(slText(110, 240 + i * 116, 1380, 96, (r.emoji ? r.emoji + '   ' : '') + r.text, { fs: 40, fill: i === d.rows.length - 1 ? slTint(accent, 22) : '#F6F3FB', radius: 18, pad: 24, valign: 'middle' })));
    } else if (d.layout === 'questions') {
      add(slFrame(accent, d.tag, d.title));
      d.rows.forEach((q, i) => add(slText(110, 240 + i * 116, 1380, 96, (i + 1) + '.  ' + q, { fs: 44, fill: '#F6F3FB', radius: 18, pad: 24, valign: 'middle', hidden: true })));
    } else if (d.layout === 'words') {
      add(slFrame(accent, d.tag, d.title));
      const cols = 4, cw = 330, gap = 20;
      d.cards.forEach((c, i) => {
        const x = 110 + (i % cols) * (cw + gap), y = 240 + Math.floor(i / cols) * 300;
        add(slText(x, y, cw, 270, c.emoji + '\n' + c.word, { fs: 46, bold: true, align: 'center', fill: slTint(SL_COLORS[4 + (i % 8)], 22), radius: 24, pad: 20 }));
        if (c.tr) add(slText(x + 20, y + 196, cw - 40, 54, c.tr, { fs: 30, align: 'center', color: '#5A4E72', fill: '#FFFFFF', radius: 14, valign: 'middle', hidden: true }));
      });
    } else if (d.layout === 'boxes') {
      add(slFrame(accent, d.tag, d.title));
      const n = d.boxes.length, cols = n <= 4 ? n : 4, rows = Math.ceil(n / cols), gap = 20;
      const bw = Math.floor((1380 - (cols - 1) * gap) / cols), bh = Math.floor((d.foot ? 470 : 560) / rows) - gap;
      d.boxes.forEach((b, i) => {
        const x = 110 + (i % cols) * (bw + gap), y = 236 + Math.floor(i / cols) * (bh + gap), col = SL_COLORS[4 + (i % 8)];
        add(slShape(x, y, bw, bh, slTint(col, 24), { radius: 22 }));
        add(slText(x + 22, y + 16, bw - 44, 56, b.head, { fs: 36, bold: true, font: 'head', color: SL_INK }));
        add(slText(x + 22, y + 76, bw - 44, bh - 90, b.body, { fs: n > 4 ? 40 : 32, bold: n > 4 }));
      });
      if (d.foot) add(slText(110, 760, 1380, 90, d.foot, { fs: 38, bold: true, fill: slTint(accent, 25), radius: 18, pad: 22, valign: 'middle', align: 'center' }));
    } else if (d.layout === 'mistakes') {
      add(slFrame(accent, d.tag, d.title));
      d.rows.forEach((r, i) => {
        const y = 236 + i * 104;
        add(slText(110, y, 640, 88, '✗  ' + r.wrong, { fs: 34, fill: '#FFE3E3', color: '#B4232A', radius: 16, pad: 20, valign: 'middle', strike: false }));
        add(slText(770, y, 60, 88, '→', { fs: 40, bold: true, align: 'center', valign: 'middle' }));
        add(slText(850, y, 640, 88, '✓  ' + r.right, { fs: 34, bold: true, fill: '#DDF8EE', color: '#0B7A55', radius: 16, pad: 20, valign: 'middle', hidden: true }));
      });
    } else if (d.layout === 'exercise') {
      const ex = (l.exercises || []).find(e => e.id === d.ex);
      if (!ex) return s;
      const no = exNo[ex.id];
      add(slFrame(accent, 'EXERCISE ' + no + ' · ' + COURSE_SKILLS[ex.skill].emoji + ' ' + COURSE_SKILLS[ex.skill].label.toUpperCase(), ex.title));
      add(slText(1250, 64, 240, 44, '📄 Handout ex. ' + no, { fs: 24, bold: true, color: '#5A4E72', align: 'right' }));
      const two = ex.items.length > 4, rows = two ? Math.ceil(ex.items.length / 2) : ex.items.length;
      const rh = Math.min(110, Math.floor(500 / rows)), qw = two ? 470 : 1000, aw = two ? 190 : 360;
      ex.items.forEach((it, i) => {
        const col = two ? Math.floor(i / rows) : 0, row = two ? i % rows : i;
        const x = 110 + col * 710, y = 236 + row * (rh + 14);
        add(slText(x, y, qw, rh, (i + 1) + '.  ' + it.q, { fs: 38, fill: '#F6F3FB', radius: 16, pad: 20, valign: 'middle' }));
        add(slText(x + qw + 14, y, aw, rh, it.a, { fs: 36, bold: true, fill: '#DDF8EE', color: '#0B7A55', radius: 16, pad: 14, valign: 'middle', align: 'center', hidden: true }));
      });
      if (typeof ex.listen === 'number' && l.listen && l.listen[ex.listen]) add({ id: slId(), type: 'audio', x: 1130, y: 790, w: 360, h: 80, label: '🔊 Listen', say: l.listen[ex.listen].text });
    } else if (d.layout === 'skill') {
      add(slFrame(accent, d.tag + ' · ' + COURSE_SKILLS[d.skill].emoji, d.title));
      add(slText(110, 240, 900, 480, d.text, { fs: 40, fill: '#F6F3FB', radius: 22, pad: 30 }));
      (d.tips || []).forEach((t, i) => add(slText(1060, 240 + i * 130, 430, 110, t, { fs: 34, bold: true, fill: slTint(SL_COLORS[6 + i], 30), radius: 18, pad: 20, valign: 'middle', align: 'center' })));
      if (typeof d.listen === 'number' && l.listen && l.listen[d.listen]) add({ id: slId(), type: 'audio', x: 110, y: 760, w: 380, h: 90, label: '🔊 Listen', say: l.listen[d.listen].text });
    } else if (d.layout === 'finish') {
      s.items = [slShape(0, 0, 18, SL_H, accent),
        slText(110, 90, 1380, 130, d.title + ' 🎉', { fs: 96, bold: true, font: 'head', align: 'center' })];
      d.rows.forEach((r, i) => add(slText(330, 260 + i * 104, 940, 88, '✅  ' + r, { fs: 40, fill: '#DDF8EE', radius: 18, pad: 22, valign: 'middle' })));
      if (d.foot) add(slText(260, 720, 1080, 100, d.foot, { fs: 38, bold: true, fill: slTint(accent, 30), radius: 50, pad: 20, valign: 'middle', align: 'center' }));
    }
    return s;
  });
}
/* lessons not redone yet: their simple slides ({emoji, title, body}) as editable slides */
function slFromSimple(stop) {
  const accent = stop.block.color;
  const old = (courseRead(LS_COURSE_EDITS, {})[stop.id]) || {};
  return stop.lesson.slides.map((x, i) => {
    const e = old.v ? null : old[i];
    return { bg: '#FFFFFF', notes: '', items: [slShape(0, 0, 18, SL_H, accent),
      slText(100, 70, 1400, 150, x.emoji, { fs: 110, align: 'center' }),
      slText(100, 230, 1400, 110, e && typeof e.title === 'string' ? e.title : x.title, { fs: 72, bold: true, font: 'head', align: 'center' }),
      slText(160, 370, 1280, 480, e && typeof e.body === 'string' ? e.body : x.body, { fs: 42, align: 'center' })] };
  });
}
function slOriginal(stop) { return stop.lesson.deck ? slBuildDeck(stop) : stop.lesson.slides ? slFromSimple(stop) : []; }
function slEdited(stopId) { const e = courseRead(LS_COURSE_EDITS, {})[stopId]; return e && e.v === 2 && Array.isArray(e.slides) ? e : null; }
function slDeck(stop) { const e = slEdited(stop.id); return e ? slClone(e.slides) : slOriginal(stop); }
function slSave(stopId, slides) {
  const all = courseRead(LS_COURSE_EDITS, {});
  all[stopId] = { v: 2, at: new Date().toISOString(), slides: slides };
  courseWrite(LS_COURSE_EDITS, all);
  const size = JSON.stringify(all).length;
  if (size > 2500000 && !slSave.warned) { slSave.warned = true; showToast('⚠️ Your slides have many pictures (' + Math.round(size / 1e6 * 10) / 10 + ' MB). Browser storage is small — use fewer or smaller pictures.'); }
}
function slResetToOriginal(stopId) {
  const all = courseRead(LS_COURSE_EDITS, {});
  delete all[stopId];
  courseWrite(LS_COURSE_EDITS, all);
}

/* ---------- drawing a slide (editor, thumbnails, Teach mode, printing) ---------- */
function slItemHtml(it, mode, revealed) {
  const hide = it.hidden && mode === 'teach' && !(revealed && revealed.has(it.id));
  const st = ['left:' + it.x + 'px', 'top:' + it.y + 'px', 'width:' + it.w + 'px', 'height:' + it.h + 'px'];
  const cls = ['sl-item', 'sl-' + it.type, it.hidden ? 'sl-hidden' : '', hide ? 'sl-concealed' : '', mode === 'teach' && it.hidden && !hide ? 'sl-revealed' : ''];
  let inner = '';
  if (it.type === 'text') {
    st.push('font-size:' + (it.fs || 36) + 'px', 'color:' + (it.color || SL_INK), 'text-align:' + (it.align || 'left'),
      'font-weight:' + (it.bold ? 700 : 600), 'font-family:' + (it.font === 'head' ? "'Fredoka','Nunito',sans-serif" : "'Nunito',sans-serif"),
      'background:' + (it.fill || 'transparent'), 'border-radius:' + (it.radius || 0) + 'px', 'padding:' + (it.pad || 0) + 'px',
      'letter-spacing:' + (it.spacing || 0) + 'px', 'justify-content:' + (it.valign === 'middle' ? 'center' : 'flex-start'));
    inner = '<div class="sl-txt">' + escapeForHtml(it.text || '') + '</div>';
  } else if (it.type === 'shape') {
    st.push('background:' + (it.fill || '#FFD23F'), 'border-radius:' + (it.radius === 'circle' ? '50%' : (it.radius || 0) + 'px'));
  } else if (it.type === 'picture') {
    inner = it.src ? '<img src="' + escapeForHtml(it.src) + '" alt="" draggable="false" style="object-fit:' + (it.fit || 'contain') + '">' : '';
    if (it.radius) st.push('border-radius:' + it.radius + 'px', 'overflow:hidden');
  } else if (it.type === 'audio') {
    inner = '<span class="sl-btn-face">' + escapeForHtml(it.label || '🔊 Listen') + '</span>';
  } else if (it.type === 'timer') {
    const t = Math.max(0, Math.round(it.seconds || 60));
    inner = '<span class="sl-btn-face">⏱ <b data-timer>' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0') + '</b></span>';
  }
  return '<div class="' + cls.filter(Boolean).join(' ') + '" data-id="' + it.id + '" style="' + st.join(';') + '">' + inner +
    (mode === 'edit' && it.hidden ? '<span class="sl-hidden-badge" title="Hidden until you click (Teach mode)">🙈</span>' : '') + '</div>';
}
function slSlideHtml(s, mode, revealed) {
  return '<div class="sl-canvas" style="width:' + SL_W + 'px;height:' + SL_H + 'px;background:' + (s.bg || '#FFFFFF') +
    (s.bgImg ? ';background-image:url(' + escapeForHtml(s.bgImg) + ');background-size:cover;background-position:center' : '') + '">' +
    (s.items || []).map(it => slItemHtml(it, mode, revealed)).join('') + '</div>';
}
// a scaled slide inside a box of the given width
function slScaledHtml(s, width, mode, revealed) {
  const k = width / SL_W;
  return '<div class="sl-scale" style="width:' + width + 'px;height:' + Math.round(SL_H * k) + 'px"><div class="sl-scale-in" style="transform:scale(' + k + ')">' + slSlideHtml(s, mode, revealed) + '</div></div>';
}

/* ---------- pictures: made smaller before they're kept ---------- */
function slShrinkPicture(file, max) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('not a picture')); return; }
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('bad picture'));
      img.onload = () => {
        const k = Math.min(1, (max || 1400) / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const png = /png|gif|webp/.test(file.type) && c.width * c.height < 600 * 600;
        resolve({ src: png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.8), w: c.width, h: c.height });
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
function slPickFile(accept) {
  return new Promise(resolve => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = accept;
    inp.onchange = () => resolve(inp.files && inp.files[0]);
    inp.click();
  });
}

/* ================= THE EDITOR ================= */
let SLE = null;   // { stopId, slides, cur, sel, undo: [], redo: [], editing }
function courseOpenSlideEditor(stopId) {
  const stop = courseFindStop(stopId);
  if (!stop) return;
  SLE = { stopId, slides: slDeck(stop), cur: 0, sel: null, undo: [], redo: [], editing: false };
  let el = document.getElementById('slEditor');
  if (!el) {
    el = document.createElement('div');
    el.id = 'slEditor';
    el.className = 'sl-editor';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Slides');
    document.body.appendChild(el);
  }
  const where = stop.course.title.replace(' English', '') + ' · ' + (stop.kind === 'lesson' ? 'Lesson ' + stop.no : stop.kind === 'review' ? 'Review' : 'Exam') + ' — ' + stop.lesson.title;
  el.innerHTML =
    '<div class="sle-top"><div class="sle-brand">🖥️ <b>Slides</b> <span>' + escapeForHtml(where) + '</span></div>' +
      '<div class="sle-top-btns"><button type="button" class="mini-btn" onclick="slFullScreen(\'slEditor\')">⛶ Full screen</button>' +
      '<button type="button" class="mini-btn sle-close" onclick="slCloseEditor()">✕ Close</button></div></div>' +
    '<div class="sle-tools" role="toolbar" aria-label="Add to the slide">' +
      '<button type="button" onclick="slAddSlide()" title="New slide after this one">➕ Slide</button>' +
      '<button type="button" onclick="slAdd(\'text\')" title="Text">🅣 Text</button>' +
      '<button type="button" onclick="slAdd(\'heading\')" title="Heading">🅗 Heading</button>' +
      '<button type="button" onclick="slAddPicture()" title="Picture (or drag a picture file onto the slide)">🖼️ Picture</button>' +
      '<button type="button" onclick="slAdd(\'shape\')" title="Shape">🟪 Shape</button>' +
      '<button type="button" onclick="slStickerMenu(event)" title="Sticker">😀 Sticker</button>' +
      '<button type="button" onclick="slAdd(\'timer\')" title="Timer — click it in Teach mode to start">⏱️ Timer</button>' +
      '<button type="button" onclick="slAdd(\'audio\')" title="Listen button — the computer reads your text aloud">🔊 Listen</button>' +
      '<span class="sle-sep"></span>' +
      '<button type="button" id="slUndoBtn" onclick="slUndo()" title="Undo" data-kbd="Ctrl Z">↶</button>' +
      '<button type="button" id="slRedoBtn" onclick="slRedo()" title="Redo" data-kbd="Ctrl Y">↷</button>' +
      '<span class="sle-grow"></span>' +
      '<button type="button" onclick="slOriginalAsk()" title="Go back to the ready-made slides">↩️ Original</button>' +
      '<button type="button" onclick="slFileMenu(event)" title="Download, load or print the slides">📁 File</button>' +
      '<button type="button" class="sle-teach" onclick="courseTeach(SLE.stopId, SLE.cur)">▶️ Teach</button>' +
    '</div>' +
    '<div class="sle-body"><aside class="sle-thumbs" id="slThumbs"></aside>' +
      '<main class="sle-stage-wrap"><div class="sle-stage" id="slStage"></div><div class="sle-hint">Click to select · double-click text to type · drag to move · drag the corner to resize · Delete removes</div></main>' +
      '<aside class="sle-panel" id="slPanel"></aside></div>';
  slDraw();
  document.addEventListener('keydown', slKey);
  window.addEventListener('resize', slDrawStage);
  const stage = document.getElementById('slStage');
  stage.addEventListener('dragover', e => { e.preventDefault(); });
  stage.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) slAddPicture(f); });
}
function slCloseEditor() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  slCommitText();
  const el = document.getElementById('slEditor');
  if (el) el.remove();
  document.removeEventListener('keydown', slKey);
  window.removeEventListener('resize', slDrawStage);
  SLE = null;
  if (window.renderCourse) renderCourse();
}
function slFullScreen(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}
function slSlide() { return SLE.slides[SLE.cur]; }
function slItem(id) { return (slSlide().items || []).find(i => i.id === (id || SLE.sel)); }

// every change: remember the old state (undo), keep, redraw
function slChange(fn, keepSel) {
  SLE.undo.push(JSON.stringify({ slides: SLE.slides, cur: SLE.cur }));
  if (SLE.undo.length > 60) SLE.undo.shift();
  SLE.redo = [];
  fn();
  if (!keepSel && SLE.sel && !slItem()) SLE.sel = null;
  slSave(SLE.stopId, SLE.slides);
  slDraw();
}
function slUndo() {
  if (!SLE || !SLE.undo.length) return;
  SLE.redo.push(JSON.stringify({ slides: SLE.slides, cur: SLE.cur }));
  const st = JSON.parse(SLE.undo.pop());
  SLE.slides = st.slides; SLE.cur = Math.min(st.cur, SLE.slides.length - 1); SLE.sel = null;
  slSave(SLE.stopId, SLE.slides); slDraw();
}
function slRedo() {
  if (!SLE || !SLE.redo.length) return;
  SLE.undo.push(JSON.stringify({ slides: SLE.slides, cur: SLE.cur }));
  const st = JSON.parse(SLE.redo.pop());
  SLE.slides = st.slides; SLE.cur = Math.min(st.cur, SLE.slides.length - 1); SLE.sel = null;
  slSave(SLE.stopId, SLE.slides); slDraw();
}

function slDraw() { slDrawThumbs(); slDrawStage(); slDrawPanel(); }
function slDrawThumbs() {
  const el = document.getElementById('slThumbs');
  if (!el) return;
  el.innerHTML = SLE.slides.map((s, i) =>
    '<div class="sle-thumb' + (i === SLE.cur ? ' on' : '') + (s.skip ? ' skipped' : '') + '" data-i="' + i + '" onclick="slGo(' + i + ')">' +
      '<span class="sle-thumb-no">' + (i + 1) + '</span>' + slScaledHtml(s, 196, 'thumb') +
      (s.skip ? '<span class="sle-thumb-skip" title="Skipped in Teach mode">🙈</span>' : '') +
      (i === SLE.cur ? '<div class="sle-thumb-tools" onclick="event.stopPropagation()">' +
        '<button type="button" title="Move up" onclick="slMoveSlide(-1)"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" title="Move down" onclick="slMoveSlide(1)"' + (i === SLE.slides.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '<button type="button" title="Duplicate slide" onclick="slDuplicateSlide()">⧉</button>' +
        '<button type="button" title="Skip in Teach mode" onclick="slToggleSkip()">' + (s.skip ? '👁️' : '🙈') + '</button>' +
        '<button type="button" title="Delete slide" onclick="slDeleteSlide()">🗑️</button></div>' : '') +
    '</div>').join('') +
    '<button type="button" class="sle-new" onclick="slAddSlide()">➕ New slide</button>';
  const on = el.querySelector('.sle-thumb.on');
  if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
}
function slStageScale() {
  const wrap = document.querySelector('.sle-stage-wrap');
  if (!wrap) return 0.5;
  return Math.max(0.2, Math.min((wrap.clientWidth - 48) / SL_W, (wrap.clientHeight - 70) / SL_H));
}
function slDrawStage() {
  const el = document.getElementById('slStage');
  if (!el || !SLE) return;
  const k = slStageScale();
  el.style.width = Math.round(SL_W * k) + 'px';
  el.style.height = Math.round(SL_H * k) + 'px';
  el.innerHTML = '<div class="sl-scale-in" style="transform:scale(' + k + ')">' + slSlideHtml(slSlide(), 'edit') + '</div>';
  el.dataset.k = k;
  if (SLE.sel) {
    const node = el.querySelector('.sl-item[data-id="' + SLE.sel + '"]');
    if (node) { node.classList.add('sl-selected'); node.insertAdjacentHTML('beforeend', '<span class="sl-handle" data-handle="1"></span>'); }
  }
  el.onpointerdown = slPointerDown;
  el.ondblclick = slDblClick;
}

/* ---------- select, move, resize, type ---------- */
function slPointerDown(e) {
  if (SLE.editing) { if (e.target.closest('[contenteditable]')) return; slCommitText(); }
  const node = e.target.closest('.sl-item');
  if (!node) { if (SLE.sel) { SLE.sel = null; slDrawStage(); slDrawPanel(); } return; }
  const id = node.dataset.id, it = slItem(id);
  if (!it) return;
  if (SLE.sel !== id) { SLE.sel = id; slDrawStage(); slDrawPanel(); }
  const k = Number(document.getElementById('slStage').dataset.k) || 1;
  const resize = !!e.target.closest('[data-handle]');
  const start = { x: e.clientX, y: e.clientY, ix: it.x, iy: it.y, iw: it.w, ih: it.h };
  let moved = false, before = JSON.stringify({ slides: SLE.slides, cur: SLE.cur });
  const nodeNow = () => document.querySelector('#slStage .sl-item[data-id="' + id + '"]');
  const move = ev => {
    const dx = (ev.clientX - start.x) / k, dy = (ev.clientY - start.y) / k;
    if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return;
    moved = true;
    if (resize) { it.w = Math.max(30, Math.round(start.iw + dx)); it.h = Math.max(20, Math.round(start.ih + dy)); }
    else { it.x = Math.round(Math.max(-it.w + 20, Math.min(SL_W - 20, start.ix + dx))); it.y = Math.round(Math.max(-it.h + 20, Math.min(SL_H - 20, start.iy + dy))); }
    const n = nodeNow();
    if (n) { n.style.left = it.x + 'px'; n.style.top = it.y + 'px'; n.style.width = it.w + 'px'; n.style.height = it.h + 'px'; }
  };
  const up = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    if (moved) {
      SLE.undo.push(before); SLE.redo = [];
      slSave(SLE.stopId, SLE.slides); slDrawThumbs(); slDrawPanel();
    }
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
  e.preventDefault();
}
function slDblClick(e) {
  const node = e.target.closest('.sl-item.sl-text');
  if (!node) return;
  slEditText(node.dataset.id);
}
function slEditText(id) {
  const node = document.querySelector('#slStage .sl-item[data-id="' + id + '"] .sl-txt');
  if (!node) return;
  SLE.sel = id; SLE.editing = id;
  node.setAttribute('contenteditable', 'plaintext-only');
  node.setAttribute('spellcheck', 'false');
  node.focus();
  const r = document.createRange(); r.selectNodeContents(node);
  const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  node.addEventListener('blur', slCommitText, { once: true });
}
function slCommitText() {
  if (!SLE || !SLE.editing) return;
  const id = SLE.editing;
  SLE.editing = false;
  const node = document.querySelector('#slStage .sl-item[data-id="' + id + '"] .sl-txt');
  const it = slItem(id);
  if (!node || !it) return;
  const text = node.innerText.replace(/\n$/, '');
  if (text !== it.text) slChange(() => { it.text = text; }, true);
  else slDrawStage();
}
function slKey(e) {
  if (!SLE || document.getElementById('slTeach')) return;
  const typing = e.target && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
  if (typing) { if (e.key === 'Escape' && SLE.editing) e.target.blur(); return; }
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? slRedo() : slUndo(); return; }
  if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); slRedo(); return; }
  if (mod && e.key.toLowerCase() === 'd' && SLE.sel) { e.preventDefault(); slDuplicateItem(); return; }
  if ((e.key === 'Delete' || e.key === 'Backspace') && SLE.sel) { e.preventDefault(); slDeleteItem(); return; }
  if (e.key === 'Enter' && SLE.sel && slItem() && slItem().type === 'text') { e.preventDefault(); slEditText(SLE.sel); return; }
  if (e.key === 'Escape') { if (SLE.sel) { SLE.sel = null; slDrawStage(); slDrawPanel(); } else slCloseEditor(); return; }
  const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  if (arrows[e.key]) {
    e.preventDefault();
    if (SLE.sel) { const it = slItem(), st = e.shiftKey ? 20 : 4; slChange(() => { it.x += arrows[e.key][0] * st; it.y += arrows[e.key][1] * st; }, true); }
    else if (arrows[e.key][0] || arrows[e.key][1]) slGo(SLE.cur + (arrows[e.key][0] || arrows[e.key][1]));
  }
}

/* ---------- slides ---------- */
function slGo(i) { slCommitText(); SLE.cur = Math.max(0, Math.min(SLE.slides.length - 1, i)); SLE.sel = null; slDraw(); }
function slAddSlide() {
  const stop = courseFindStop(SLE.stopId);
  slChange(() => {
    SLE.slides.splice(SLE.cur + 1, 0, { bg: '#FFFFFF', notes: '', items: [slShape(0, 0, 18, SL_H, stop.block.color), slText(110, 108, 1380, 96, 'New slide', { fs: 62, bold: true, font: 'head' })] });
    SLE.cur++; SLE.sel = null;
  });
}
function slMoveSlide(d) {
  const j = SLE.cur + d;
  if (j < 0 || j >= SLE.slides.length) return;
  slChange(() => { const s = SLE.slides.splice(SLE.cur, 1)[0]; SLE.slides.splice(j, 0, s); SLE.cur = j; });
}
function slDuplicateSlide() {
  slChange(() => { const s = slClone(slSlide()); s.items.forEach(i => { i.id = slId(); }); SLE.slides.splice(SLE.cur + 1, 0, s); SLE.cur++; SLE.sel = null; });
}
function slToggleSkip() { slChange(() => { slSlide().skip = !slSlide().skip; }); }
function slDeleteSlide() {
  if (SLE.slides.length <= 1) { showToast('A lesson needs at least one slide.'); return; }
  slChange(() => { SLE.slides.splice(SLE.cur, 1); SLE.cur = Math.min(SLE.cur, SLE.slides.length - 1); SLE.sel = null; });
  showToast('Slide deleted — press ↶ to bring it back.', 'ok');
}

/* ---------- things on a slide ---------- */
function slAdd(kind, extra) {
  const stop = courseFindStop(SLE.stopId);
  let it;
  if (kind === 'text') it = slText(500, 400, 600, 110, 'Type here', { fs: 40 });
  else if (kind === 'heading') it = slText(110, 108, 1380, 96, 'Heading', { fs: 62, bold: true, font: 'head' });
  else if (kind === 'shape') it = slShape(600, 300, 400, 260, slTint(stop.block.color, 40), { radius: 24 });
  else if (kind === 'sticker') it = slText(700, 350, 200, 200, extra, { fs: 140, align: 'center' });
  else if (kind === 'timer') it = { id: slId(), type: 'timer', x: 1220, y: 40, w: 300, h: 90, seconds: 120 };
  else if (kind === 'audio') it = { id: slId(), type: 'audio', x: 110, y: 760, w: 380, h: 90, label: '🔊 Listen', say: 'Type what the computer should read aloud.' };
  else if (kind === 'picture') it = Object.assign({ id: slId(), type: 'picture', fit: 'contain' }, extra);
  if (!it) return;
  slChange(() => { slSlide().items.push(it); SLE.sel = it.id; }, true);
  if (kind === 'text' || kind === 'heading') setTimeout(() => slEditText(it.id), 30);
}
async function slAddPicture(file) {
  file = file || await slPickFile('image/*');
  if (!file) return;
  try {
    const p = await slShrinkPicture(file, 1400);
    const k = Math.min(1, 900 / p.w, 600 / p.h);
    const w = Math.round(p.w * k), h = Math.round(p.h * k);
    slAdd('picture', { src: p.src, x: Math.round((SL_W - w) / 2), y: Math.round((SL_H - h) / 2), w, h });
  } catch (e) { showToast('Couldn\'t open that picture — try a JPG or PNG.'); }
}
function slStickerMenu(e) {
  slPopup(e.currentTarget, '<div class="sle-stickers">' + SL_STICKERS.map(s => '<button type="button" onclick="slClosePopup();slAdd(\'sticker\',\'' + s + '\')">' + s + '</button>').join('') + '</div>');
}
function slDeleteItem() { const id = SLE.sel; slChange(() => { slSlide().items = slSlide().items.filter(i => i.id !== id); SLE.sel = null; }); }
function slDuplicateItem() {
  const it = slItem(); if (!it) return;
  const c = slClone(it); c.id = slId(); c.x += 30; c.y += 30;
  slChange(() => { slSlide().items.push(c); SLE.sel = c.id; }, true);
}
function slLayer(d) {
  const items = slSlide().items, i = items.findIndex(x => x.id === SLE.sel), j = i + d;
  if (i < 0 || j < 0 || j >= items.length) return;
  slChange(() => { const x = items.splice(i, 1)[0]; items.splice(j, 0, x); }, true);
}
function slSet(prop, value) {
  const it = slItem(); if (!it) return;
  slChange(() => { if (value === null) delete it[prop]; else it[prop] = value; }, true);
}
function slSetSlide(prop, value) { slChange(() => { if (value === null) delete slSlide()[prop]; else slSlide()[prop] = value; }, true); }
async function slBackgroundPicture() {
  const f = await slPickFile('image/*');
  if (!f) return;
  try { const p = await slShrinkPicture(f, 1600); slSetSlide('bgImg', p.src); } catch (e) { showToast('Couldn\'t open that picture — try a JPG or PNG.'); }
}
async function slReplacePicture() {
  const f = await slPickFile('image/*');
  if (!f) return;
  try { const p = await slShrinkPicture(f, 1400); slSet('src', p.src); } catch (e) { showToast('Couldn\'t open that picture — try a JPG or PNG.'); }
}

/* ---------- the panel on the right ---------- */
function slSwatches(cur, onPick, withNone) {
  return '<div class="sle-swatches">' + (withNone ? '<button type="button" class="sle-sw none' + (!cur || cur === 'transparent' ? ' on' : '') + '" title="None" onclick="' + onPick + '(null)">∅</button>' : '') +
    SL_COLORS.map(c => '<button type="button" class="sle-sw' + (String(cur).toUpperCase() === c ? ' on' : '') + '" style="background:' + c + '" title="' + c + '" onclick="' + onPick + '(\'' + c + '\')"></button>').join('') + '</div>';
}
function slDrawPanel() {
  const el = document.getElementById('slPanel');
  if (!el) return;
  const s = slSlide(), it = SLE.sel ? slItem() : null;
  const undo = document.getElementById('slUndoBtn'), redo = document.getElementById('slRedoBtn');
  if (undo) undo.disabled = !SLE.undo.length;
  if (redo) redo.disabled = !SLE.redo.length;
  if (!it) {
    el.innerHTML = '<div class="sle-sec"><div class="sle-h">Slide ' + (SLE.cur + 1) + ' of ' + SLE.slides.length + '</div>' +
      '<p class="sle-tip">Click anything on the slide to change it. <b>Double-click</b> text to type. Add new things from the top bar; drag a picture file onto the slide to add it.</p></div>' +
      '<div class="sle-sec"><div class="sle-h">Background</div>' + slSwatches(s.bg || '#FFFFFF', 'slPickBg') +
      '<div class="sle-row"><button type="button" class="mini-btn" onclick="slBackgroundPicture()">🖼️ Background picture</button>' +
      (s.bgImg ? '<button type="button" class="mini-btn" onclick="slSetSlide(\'bgImg\', null)">Remove</button>' : '') + '</div>' +
      '<label class="sle-check"><input type="checkbox"' + (s.skip ? ' checked' : '') + ' onchange="slSetSlide(\'skip\', this.checked || null)"> Skip this slide in Teach mode</label></div>' +
      '<div class="sle-sec"><div class="sle-h">Teacher notes</div><textarea id="slNotes" rows="6" placeholder="Only you see these (press N in Teach mode).">' + escapeForHtml(s.notes || '') + '</textarea></div>' +
      '<div class="sle-sec sle-row"><button type="button" class="mini-btn" onclick="slDuplicateSlide()">⧉ Duplicate slide</button><button type="button" class="mini-btn danger" onclick="slDeleteSlide()">🗑️ Delete slide</button></div>';
    const notes = document.getElementById('slNotes');
    notes.addEventListener('change', () => slSetSlide('notes', notes.value || null));
    return;
  }
  const kindName = { text: 'Text', shape: 'Shape', picture: 'Picture', audio: 'Listen button', timer: 'Timer' }[it.type];
  let html = '<div class="sle-sec"><div class="sle-h">' + kindName + '</div>' +
    '<label class="sle-check sle-hide"><input type="checkbox"' + (it.hidden ? ' checked' : '') + ' onchange="slSet(\'hidden\', this.checked || null)"> 🙈 Hidden until I click (Teach mode)</label>' +
    '<p class="sle-tip">In Teach mode a click shows the hidden things one by one, in their layer order — or click right on one to show it.</p></div>';
  if (it.type === 'text') {
    html += '<div class="sle-sec"><div class="sle-h">Text</div><div class="sle-row">' +
      '<button type="button" class="mini-btn" onclick="slSet(\'fs\', Math.max(12, (slItem().fs || 36) - 4))" title="Smaller">A−</button>' +
      '<span class="sle-val">' + (it.fs || 36) + '</span>' +
      '<button type="button" class="mini-btn" onclick="slSet(\'fs\', (slItem().fs || 36) + 4)" title="Bigger">A+</button>' +
      '<button type="button" class="mini-btn' + (it.bold ? ' solid' : '') + '" onclick="slSet(\'bold\', !slItem().bold || null)" title="Bold"><b>B</b></button>' +
      '<button type="button" class="mini-btn' + (it.font === 'head' ? ' solid' : '') + '" onclick="slSet(\'font\', slItem().font === \'head\' ? \'body\' : \'head\')" title="Heading font">H</button></div>' +
      '<div class="sle-row">' + ['left', 'center', 'right'].map(a => '<button type="button" class="mini-btn' + ((it.align || 'left') === a ? ' solid' : '') + '" onclick="slSet(\'align\', \'' + a + '\')">' + { left: '⇤', center: '↔', right: '⇥' }[a] + '</button>').join('') +
      '<button type="button" class="mini-btn' + (it.valign === 'middle' ? ' solid' : '') + '" onclick="slSet(\'valign\', slItem().valign === \'middle\' ? null : \'middle\')" title="Middle (up and down)">↕</button>' +
      '<button type="button" class="mini-btn" onclick="slEditText(SLE.sel)">✏️ Type</button></div>' +
      '<div class="sle-h2">Colour</div>' + slSwatches(it.color || SL_INK, 'slPickColor') +
      '<div class="sle-h2">Fill</div>' + slSwatches(it.fill, 'slPickFill', true) +
      '<div class="sle-row"><button type="button" class="mini-btn' + (it.radius ? ' solid' : '') + '" onclick="slSet(\'radius\', slItem().radius ? null : 18); if (!slItem().pad) slSet(\'pad\', 18)">▢ Rounded box</button></div></div>';
  } else if (it.type === 'shape') {
    html += '<div class="sle-sec"><div class="sle-h">Fill</div>' + slSwatches(it.fill, 'slPickFill') +
      '<div class="sle-row">' + [[0, '■ Square'], [24, '▢ Rounded'], ['circle', '● Circle']].map(([r, t]) => '<button type="button" class="mini-btn' + (String(it.radius || 0) === String(r) ? ' solid' : '') + '" onclick="slSet(\'radius\', ' + (typeof r === 'string' ? '\'circle\'' : r) + ')">' + t + '</button>').join('') + '</div></div>';
  } else if (it.type === 'picture') {
    html += '<div class="sle-sec"><div class="sle-row"><button type="button" class="mini-btn" onclick="slReplacePicture()">🖼️ Replace picture</button>' +
      '<button type="button" class="mini-btn' + (it.fit === 'cover' ? ' solid' : '') + '" onclick="slSet(\'fit\', slItem().fit === \'cover\' ? \'contain\' : \'cover\')">✂️ Fill the box</button></div></div>';
  } else if (it.type === 'audio') {
    html += '<div class="sle-sec"><div class="sle-h">Button text</div><input type="text" id="slAudioLabel" value="' + escapeForHtml(it.label || '') + '">' +
      '<div class="sle-h2">What the computer reads aloud</div><textarea id="slAudioSay" rows="6">' + escapeForHtml(it.say || '') + '</textarea>' +
      '<div class="sle-row"><button type="button" class="mini-btn" onclick="slSpeak(slItem().say)">🔊 Try it</button></div></div>';
  } else if (it.type === 'timer') {
    html += '<div class="sle-sec"><div class="sle-h">Minutes</div><div class="sle-row">' + [1, 2, 3, 5, 10].map(m => '<button type="button" class="mini-btn' + (it.seconds === m * 60 ? ' solid' : '') + '" onclick="slSet(\'seconds\', ' + m * 60 + ')">' + m + '</button>').join('') + '</div>' +
      '<p class="sle-tip">In Teach mode, click the timer to start or pause it.</p></div>';
  }
  html += '<div class="sle-sec"><div class="sle-row"><button type="button" class="mini-btn" onclick="slLayer(1)" title="In front of others">⬆ Forward</button><button type="button" class="mini-btn" onclick="slLayer(-1)" title="Behind others">⬇ Back</button></div>' +
    '<div class="sle-row"><button type="button" class="mini-btn" onclick="slDuplicateItem()">⧉ Duplicate</button><button type="button" class="mini-btn danger" onclick="slDeleteItem()">🗑️ Delete</button></div></div>';
  el.innerHTML = html;
  const lab = document.getElementById('slAudioLabel'), say = document.getElementById('slAudioSay');
  if (lab) lab.addEventListener('change', () => slSet('label', lab.value));
  if (say) say.addEventListener('change', () => slSet('say', say.value));
}
function slPickBg(c) { slSetSlide('bg', c); }
function slPickColor(c) { slSet('color', c); }
function slPickFill(c) { slSet('fill', c); }

/* ---------- Original, File ---------- */
function slOriginalAsk() {
  const m = taModal('↩️ Go back to the original slides?', '<p class="ta-modal-text">All your changes to this lesson\'s slides will be lost.</p>' +
    '<div class="ta-modal-btns"><button type="button" class="mini-btn danger" data-act="yes">↩️ Use the original slides</button><button type="button" class="mini-btn" data-act="no">Keep my slides</button></div>');
  m.body.querySelector('[data-act="yes"]').onclick = () => {
    m.close();
    slResetToOriginal(SLE.stopId);
    const stop = courseFindStop(SLE.stopId);
    SLE.undo.push(JSON.stringify({ slides: SLE.slides, cur: SLE.cur }));
    SLE.slides = slOriginal(stop); SLE.cur = Math.min(SLE.cur, SLE.slides.length - 1); SLE.sel = null;
    slDraw();
    showToast('The original slides are back. (↶ brings yours back.)', 'ok');
  };
  m.body.querySelector('[data-act="no"]').onclick = () => m.close();
}
function slFileMenu(e) {
  slPopup(e.currentTarget, '<div class="sle-menu">' +
    '<button type="button" onclick="slClosePopup();slDownload()">⬇️ Download these slides (a file)</button>' +
    '<button type="button" onclick="slClosePopup();slLoadFile()">⬆️ Load slides from a file</button>' +
    '<button type="button" onclick="slClosePopup();slPrint()">🖨️ Print the slides</button></div>');
}
function slDownload() {
  const stop = courseFindStop(SLE.stopId);
  const blob = new Blob([JSON.stringify({ loomSlides: 1, lesson: SLE.stopId, title: stop.lesson.title, slides: SLE.slides })], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'slides-' + stop.lesson.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function slLoadFile() {
  const f = await slPickFile('.json,application/json');
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (!data || !Array.isArray(data.slides) || !data.slides.length) throw new Error('no slides');
    slChange(() => { SLE.slides = data.slides; SLE.cur = 0; SLE.sel = null; });
    showToast('Slides loaded: ' + data.slides.length + '.', 'ok');
  } catch (e) { showToast('That file has no slides in it.'); }
}
function slPrint() {
  const w = window.open('', '_blank');
  if (!w) { showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.'); return; }
  const css = Array.from(document.styleSheets).map(ss => { try { return Array.from(ss.cssRules).filter(r => /\.sl-/.test(r.cssText)).map(r => r.cssText).join('\n'); } catch (e) { return ''; } }).join('\n');
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Slides</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@600;700&display=swap"><style>' + css +
    '@page{size:A4 landscape;margin:8mm}body{margin:0}.pg{break-after:page;display:flex;justify-content:center}.sl-concealed{visibility:visible!important}</style></head><body>' +
    SLE.slides.map(s => '<div class="pg">' + slScaledHtml(s, 1060, 'thumb') + '</div>').join('') + '<script>setTimeout(function(){print()},600)<\/script></body></html>');
  w.document.close();
}
function slPopup(anchor, html) {
  slClosePopup();
  const p = document.createElement('div');
  p.className = 'sle-popup'; p.id = 'slePopup';
  p.innerHTML = html;
  document.body.appendChild(p);
  const r = anchor.getBoundingClientRect();
  p.style.top = (r.bottom + 6) + 'px';
  p.style.left = Math.max(8, Math.min(window.innerWidth - p.offsetWidth - 8, r.left)) + 'px';
  setTimeout(() => document.addEventListener('pointerdown', slPopupAway), 0);
}
function slPopupAway(e) { if (!e.target.closest('#slePopup')) slClosePopup(); }
function slClosePopup() { const p = document.getElementById('slePopup'); if (p) p.remove(); document.removeEventListener('pointerdown', slPopupAway); }

/* ---------- 🔊 the computer reads aloud ---------- */
function slSpeak(text, onEnd) {
  if (!('speechSynthesis' in window)) { showToast('This browser can\'t read aloud — please read the text yourself.'); return false; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text || '');
  const voices = synth.getVoices();
  u.voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || null;
  u.lang = u.voice ? u.voice.lang : 'en-GB';
  u.rate = 0.85;
  if (onEnd) u.onend = u.onerror = onEnd;
  synth.speak(u);
  return true;
}

/* ================= TEACH MODE ================= */
let SLT = null;   // { stopId, slides, i, revealed: Set, timers: {} }
function courseTeach(stopId, from) {
  const stop = courseFindStop(stopId);
  if (!stop) return;
  if (SLE) slCommitText();
  const slides = SLE && SLE.stopId === stopId ? slClone(SLE.slides) : slDeck(stop);
  const shown = slides.map((s, i) => i).filter(i => !slides[i].skip);
  if (!shown.length) { showToast('Every slide is set to "Skip in Teach mode".'); return; }
  let i = typeof from === 'number' ? from : shown[0];
  if (slides[i] && slides[i].skip) i = shown.find(j => j > i) !== undefined ? shown.find(j => j > i) : shown[shown.length - 1];
  SLT = { stopId, slides, i, revealed: new Set(), timers: {}, notes: false };
  const el = document.createElement('div');
  el.id = 'slTeach';
  el.className = 'sl-teach';
  el.innerHTML = '<div class="slt-stage" id="sltStage"></div>' +
    '<div class="slt-bar"><button type="button" onclick="sltBack()" title="Back (←)">←</button><span id="sltCount"></span>' +
    '<button type="button" onclick="sltNext()" title="Next (→, space or click)">→</button>' +
    '<button type="button" onclick="sltToggleNotes()" title="Teacher notes (N)">📝</button>' +
    '<button type="button" onclick="slFullScreen(\'slTeach\')" title="Full screen (F)">⛶</button>' +
    '<button type="button" onclick="sltExit()" title="Stop teaching (Esc)">✕</button></div>' +
    '<div class="slt-notes" id="sltNotes" hidden></div>';
  document.body.appendChild(el);
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  document.addEventListener('keydown', sltKey);
  window.addEventListener('resize', sltDraw);
  el.addEventListener('click', sltClick);
  sltDraw();
}
function sltSlide() { return SLT.slides[SLT.i]; }
function sltHiddenLeft() { return (sltSlide().items || []).filter(it => it.hidden && !SLT.revealed.has(it.id)); }
function sltDraw() {
  if (!SLT) return;
  const stage = document.getElementById('sltStage');
  if (!stage) return;
  const k = Math.min(window.innerWidth / SL_W, (window.innerHeight - 56) / SL_H);
  stage.style.width = Math.round(SL_W * k) + 'px';
  stage.style.height = Math.round(SL_H * k) + 'px';
  stage.innerHTML = '<div class="sl-scale-in" style="transform:scale(' + k + ')">' + slSlideHtml(sltSlide(), 'teach', SLT.revealed) + '</div>';
  stage.dataset.k = k;
  const shown = SLT.slides.map((s, i) => i).filter(i => !SLT.slides[i].skip);
  const left = sltHiddenLeft().length;
  document.getElementById('sltCount').textContent = (shown.indexOf(SLT.i) + 1) + ' / ' + shown.length + (left ? ' · 🙈 ' + left : '');
  const notes = document.getElementById('sltNotes');
  notes.hidden = !SLT.notes;
  notes.textContent = sltSlide().notes || 'No notes for this slide.';
  Object.keys(SLT.timers).forEach(id => sltTimerShow(id));
}
function sltNext() {
  const left = sltHiddenLeft();
  if (left.length) { SLT.revealed.add(left[0].id); sltDraw(); return; }
  const next = SLT.slides.findIndex((s, j) => j > SLT.i && !s.skip);
  if (next === -1) { sltDraw(); showToast('🏁 That was the last slide.', 'ok'); return; }
  sltGo(next, false);
}
function sltBack() {
  let prev = -1;
  for (let j = SLT.i - 1; j >= 0; j--) if (!SLT.slides[j].skip) { prev = j; break; }
  if (prev === -1) return;
  sltGo(prev, true);
}
function sltGo(i, showAll) {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  SLT.i = i;
  SLT.revealed = new Set(showAll ? (SLT.slides[i].items || []).filter(it => it.hidden).map(it => it.id) : []);
  sltDraw();
}
function sltClick(e) {
  if (e.target.closest('.slt-bar, .slt-notes')) return;
  const node = e.target.closest('.sl-item');
  const it = node && (sltSlide().items || []).find(x => x.id === node.dataset.id);
  if (it && it.type === 'audio') { sltPlay(it, node); return; }
  if (it && it.type === 'timer') { sltTimer(it); return; }
  // a click right on a hidden thing's place shows that one
  const stage = document.getElementById('sltStage'), k = Number(stage.dataset.k) || 1, r = stage.getBoundingClientRect();
  const x = (e.clientX - r.left) / k, y = (e.clientY - r.top) / k;
  const hit = sltHiddenLeft().slice().reverse().find(h => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h);
  if (hit) { SLT.revealed.add(hit.id); sltDraw(); return; }
  sltNext();
}
function sltPlay(it, node) {
  const face = node.querySelector('.sl-btn-face');
  if (node.classList.contains('playing')) { window.speechSynthesis && window.speechSynthesis.cancel(); node.classList.remove('playing'); if (face) face.textContent = it.label || '🔊 Listen'; return; }
  if (slSpeak(it.say, () => { node.classList.remove('playing'); if (face) face.textContent = it.label || '🔊 Listen'; })) {
    node.classList.add('playing');
    if (face) face.textContent = '⏹ Stop';
  }
}
function sltTimer(it) {
  const t = SLT.timers[it.id] || (SLT.timers[it.id] = { left: Math.round(it.seconds || 60), run: null });
  if (t.run) { clearInterval(t.run); t.run = null; sltTimerShow(it.id); return; }
  if (t.left <= 0) t.left = Math.round(it.seconds || 60);
  t.run = setInterval(() => {
    t.left--;
    if (t.left <= 0) { clearInterval(t.run); t.run = null; t.left = 0; if (typeof taConfettiBurst === 'function') try { taConfettiBurst(window.innerWidth / 2, window.innerHeight / 3, 30); } catch (e) { /* ignore */ } }
    sltTimerShow(it.id);
  }, 1000);
  sltTimerShow(it.id);
}
function sltTimerShow(id) {
  const t = SLT && SLT.timers[id], node = document.querySelector('#sltStage .sl-item[data-id="' + id + '"]');
  if (!t || !node) return;
  const b = node.querySelector('[data-timer]');
  if (b) b.textContent = Math.floor(t.left / 60) + ':' + String(t.left % 60).padStart(2, '0');
  node.classList.toggle('running', !!t.run);
  node.classList.toggle('done', t.left === 0);
}
function sltToggleNotes() { SLT.notes = !SLT.notes; sltDraw(); }
function sltKey(e) {
  if (!SLT) return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(e.key) !== -1) { e.preventDefault(); sltNext(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(e.key) !== -1) { e.preventDefault(); sltBack(); }
  else if (e.key === 'n' || e.key === 'N') sltToggleNotes();
  else if (e.key === 'f' || e.key === 'F') slFullScreen('slTeach');
  else if (e.key === 'Escape' && !document.fullscreenElement) sltExit();
  e.stopPropagation();
}
function sltExit() {
  if (!SLT) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  Object.keys(SLT.timers).forEach(id => SLT.timers[id].run && clearInterval(SLT.timers[id].run));
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  const el = document.getElementById('slTeach');
  if (el) el.remove();
  document.removeEventListener('keydown', sltKey);
  window.removeEventListener('resize', sltDraw);
  const at = SLT.i;
  SLT = null;
  if (SLE) { SLE.cur = Math.min(at, SLE.slides.length - 1); SLE.sel = null; slDraw(); }
}
document.addEventListener('fullscreenchange', () => { if (SLT) setTimeout(sltDraw, 50); if (SLE) setTimeout(slDrawStage, 50); });
