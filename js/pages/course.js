/* ================= COURSE — the four skill courses (2026-11-04) =================
   Listening, Reading, Writing and Speaking, Elementary, 10 levels each (content: js/skills-data.js, TA_SKILLS).
   The students' page is skill.html?s=<skill>&lv=<n>&c=<code> (speaking: no code — nothing is sent).
   - ta_skills_links  { "<groupId>|<skill>|<level>": { uid, code } }  (synced, in the backup) — the My Exercises item
                      made at the first "Copy link" for that level + skill + group, so Results / Statistics / Top 5 work;
                      the code is kept so a sent link stays valid even if the item is deleted (it comes back the same).
                      The link itself: taSkillLink / taSkillItemLink in common.js (My Exercises uses them too).
   - ta_skills_marks  the teacher's writing marks { "<code>|<studentId>": band } (common.js skWritingBandFor; synced, in the backup)
   - ta_course_group  the group picked on this device (not synced)
   - ta_skills_open   the skill open on this device (not synced) */
const LS_COURSE_GROUP = 'ta_course_group';
const LS_SKILLS_LINKS = 'ta_skills_links';
const LS_SKILLS_OPEN = 'ta_skills_open';
const SK_SKILLS = [
  { key: 'listening', label: 'Listening', emoji: '🎧', color: 'var(--c-blue)', about: 'A recording and questions to answer while you listen.', results: true },
  { key: 'reading', label: 'Reading', emoji: '📖', color: 'var(--c-green)', about: 'A text to read and questions about it.', results: true },
  { key: 'writing', label: 'Writing', emoji: '✍️', color: 'var(--c-orange)', about: 'A short text, checked for mistakes, with a band.', results: true },
  { key: 'speaking', label: 'Speaking', emoji: '🗣️', color: 'var(--c-pink)', about: 'Words, questions and a short talk. Nothing is recorded.', results: false }
];

function skSkill(key) { return SK_SKILLS.find(s => s.key === key) || null; }
function skLevels() { return (window.TA_SKILLS && TA_SKILLS.elementary && TA_SKILLS.elementary.levels) || []; }
function skLevel(no) { return skLevels().find(l => l.no === Number(no)) || null; }
function skWriteLinks(v) {
  try { localStorage.setItem(LS_SKILLS_LINKS, JSON.stringify(v)); } catch (e) { showToast('⚠️ Couldn\'t save — the browser\'s storage is full.'); }
}
function skOpenSkill() {
  let k = '';
  try { k = localStorage.getItem(LS_SKILLS_OPEN) || ''; } catch (e) { /* ignore */ }
  return skSkill(k) ? k : '';
}
function skGroupId() {
  let id = '';
  try { id = localStorage.getItem(LS_COURSE_GROUP) || ''; } catch (e) { /* ignore */ }
  const groups = getStudentGroups();
  return groups.some(g => g.id === id) ? id : (groups[0] ? groups[0].id : '');
}
function skGroup(g) {
  if (g && typeof g === 'object') return g;
  const id = g || skGroupId();
  return getStudentGroups().find(x => x.id === id) || null;
}
function skLinkKey(skill, level, group) { return group.id + '|' + skill + '|' + Number(level); }
/* { uid, code } kept for a level + skill + group (an old entry was just the uid) */
function skLinkEntry(skill, level, g) {
  const v = taSkillsLinks()[skLinkKey(skill, level, g)];
  if (!v) return null;
  if (typeof v === 'object') return v.uid ? v : null;
  const item = getRecentExercises().find(e => e.uid === v);
  return { uid: v, code: item ? item.code : '' };
}
function skItemFor(skill, level, group) {
  const g = skGroup(group);
  if (!g) return null;
  const e = skLinkEntry(skill, level, g);
  return e ? getRecentExercises().find(x => x.uid === e.uid) || null : null;
}
/* The My Exercises item for a level + skill + group: made at the first call, the same one after that.
   A link once sent must keep working: if the teacher deleted the item, it comes back with the same code and uid. */
function skEnsureItem(skill, level, group) {
  const g = skGroup(group), lv = skLevel(level), s = skSkill(skill);
  if (!g || !lv || !s || skill === 'speaking') return null;
  const key = skLinkKey(skill, level, g), kept = skLinkEntry(skill, level, g);
  const list = getRecentExercises();
  let item = kept ? list.find(e => e.uid === kept.uid) : null;
  if (item) {
    if (!item.skill || typeof taSkillsLinks()[key] !== 'object') {   // made before skill/level/code were kept
      item.skill = skill; item.level = lv.no; saveRecentExercises(list);
      const links = taSkillsLinks(); links[key] = { uid: item.uid, code: item.code }; skWriteLinks(links);
    }
    return item;
  }
  const uid = (kept && kept.code && kept.uid) || generateExerciseUid();
  const code = (kept && kept.code) || generateClassCode();
  // the Create page's form (if it's loaded in the background) has nothing to do with this item
  const snap = window.taSnapshotForMyExercises;
  window.taSnapshotForMyExercises = null;
  try {
    pushRecentExercise({ title: 'Level ' + lv.no + ' · ' + lv.theme + ' — ' + s.label + ' (' + g.name + ')', typeLabel: s.label + ' course',
      code: code, uid: uid, groupId: g.id, contentSummary: 'Level ' + lv.no + ' · ' + s.label });
  } finally { window.taSnapshotForMyExercises = snap; }
  const now = getRecentExercises();
  item = now.find(e => e.uid === uid) || null;
  if (item) { item.skill = skill; item.level = lv.no; saveRecentExercises(now); }
  const links = taSkillsLinks();
  links[key] = { uid: uid, code: code };
  skWriteLinks(links);
  return item;
}
/* The students' link. Listening/Reading/Writing carry the group's code (the item is made if needed). */
function skLinkFor(skill, level, group) {
  if (skill === 'speaking') return taSkillLink(skill, level);
  const item = skEnsureItem(skill, level, group);
  return item ? taSkillLink(skill, level, item.code) : '';
}
window.skLinkFor = skLinkFor;
window.skEnsureItem = skEnsureItem;

function renderCourse() {
  const wrap = document.getElementById('courseWrap');
  if (!wrap) return;
  const groups = getStudentGroups(), gid = skGroupId(), g = skGroup(gid);
  const open = skOpenSkill();
  let html = '<div class="sk-groups"><span class="sk-groups-label">👥 Group:</span>' +
    (groups.length
      ? groups.map(x => '<button type="button" class="myex-type-chip' + (x.id === gid ? ' active' : '') + '" onclick="skPickGroup(' + jsAttr(x.id) + ')" translate="no">' + escapeForHtml(x.name) + '</button>').join('')
      : '<span class="sk-hint">Add a group on the Students page first — each group gets its own links.</span>') + '</div>';
  if (!open) {
    html += '<div class="sk-skills">' + SK_SKILLS.map(s => {
      const ready = skLevels().filter(l => l[s.key]).length;
      return '<button type="button" class="sk-skill-card" style="--skc:' + s.color + '" onclick="skOpen(' + jsAttr(s.key) + ')">' +
        '<span class="sk-skill-emoji">' + s.emoji + '</span><span class="sk-skill-name">' + s.label + '</span>' +
        '<span class="sk-skill-about">' + escapeForHtml(s.about) + '</span>' +
        '<span class="sk-skill-count">Elementary · ' + ready + ' of ' + skLevels().length + ' levels ready</span></button>';
    }).join('') + '</div>';
    wrap.innerHTML = html;
    return;
  }
  const s = skSkill(open);
  html += '<button type="button" class="back-to-picker-btn" onclick="skOpen(\'\')">← All skills</button>' +
    '<div class="sk-skill-head" style="--skc:' + s.color + '"><span class="sk-skill-emoji">' + s.emoji + '</span><div><h3>' + s.label + '</h3>' +
    '<div class="sk-skill-level">Elementary · 10 levels</div></div></div>' +
    '<div class="sk-levels" style="--skc:' + s.color + '">' + skLevels().map(lv => skTileHtml(s, lv, g)).join('') + '</div>';
  wrap.innerHTML = html;
}
function skTileSub(c) { return c.title || c.topic || (c.part2 && (c.part2.topic || c.part2.title)) || ''; }
function skTileHtml(s, lv, g) {
  const c = lv[s.key];
  let html = '<div class="sk-level-tile' + (c ? '' : ' soon') + '" data-level="' + lv.no + '">' +
    '<div class="sk-tile-top"><span class="sk-tile-emoji">' + lv.emoji + '</span><div class="sk-tile-name"><b>Level ' + lv.no + ' · ' + escapeForHtml(lv.theme) + '</b>' +
    (c && skTileSub(c) ? '<span>' + escapeForHtml(skTileSub(c)) + '</span>' : '') + '</div></div>';
  if (!c) return html + '<span class="sk-soon-tag">🛠️ Coming soon</span></div>';
  const item = g && s.results ? skItemFor(s.key, lv.no, g) : null;
  html += '<div class="sk-tile-btns"><button type="button" class="mini-btn" onclick="skTry(' + jsAttr(s.key) + ', ' + lv.no + ')">▶️ Try</button>' +
    (g ? '<button type="button" class="mini-btn solid" onclick="skCopyLink(' + jsAttr(s.key) + ', ' + lv.no + ')">🔗 Copy link for ' + escapeForHtml(g.name) + '</button>' : '') +
    (item ? '<button type="button" class="mini-btn" onclick="taNavigate(\'results.html?exercise=' + encodeURIComponent(item.uid) + '\')">📊 View Results</button>' : '') +
    (s.results && skHasTableResults(lv.no, g) ? '<button type="button" class="mini-btn sk-rt-open" onclick="skOpenTable(' + lv.no + ')">🏆 Results table</button>' : '') + '</div>';
  if (!g) html += '<p class="sk-hint">Add a group on the Students page first.</p>';
  return html + '</div>';
}

function skPickGroup(id) {
  try { localStorage.setItem(LS_COURSE_GROUP, id); } catch (e) { /* ignore */ }
  renderCourse();
}
function skOpen(key) {
  try { if (key) localStorage.setItem(LS_SKILLS_OPEN, key); else localStorage.removeItem(LS_SKILLS_OPEN); } catch (e) { /* ignore */ }
  renderCourse();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function skTry(skill, level) {
  const w = window.open(taSkillLink(skill, level) + '&preview=1', '_blank');
  if (!w) showToast('⚠️ The browser blocked the new tab. Allow pop-ups for this site and press again.');
}
function skCopyLink(skill, level) {
  const g = skGroup();
  if (!g) { showToast('Add a group on the Students page first.'); return; }
  const url = skLinkFor(skill, level, g);
  if (!url) return;
  const msg = '🔗 Link copied — send it to ' + g.name + '. It always works.';
  const show = () => taModal('🔗 The link for ' + escapeForHtml(g.name), '<input type="text" class="ta-input" readonly value="' + escapeForHtml(url) + '" aria-label="The link">');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast(msg, 'ok'), show);
  else show();
  renderCourse();
}

/* ================= RESULTS TABLE (per level + group) =================
   The group's students who did any of the level's Listening / Reading / Writing, ranked by Overall
   (equal Overall → the same place: 1, 2, 2, 2, 5). Each skill: the best try (highest band); a writing's band
   is the teacher's mark (ta_skills_marks) if given, else the page's estimate. Overall = skOverall of the bands
   that exist, with its CEFR. The same table is drawn on a canvas for "⬇️ Download picture" (the teacher posts
   it to the group's chat). */
const SK_TABLE_SKILLS = ['listening', 'reading', 'writing'];
const SK_MEDALS = ['🥇', '🥈', '🥉'];
/* the results of a code (kept on this device), newest first, without those cleared by "Delete all results" */
function skResultsFor(code) {
  if (!code) return [];
  const seen = new Set(), out = [];
  const cutoff = typeof resetCutoffFor === 'function' ? resetCutoffFor(code) : '';
  (window.__allResults || []).concat(typeof collectResults === 'function' ? collectResults(code).visible : []).forEach(r => {
    if (!r || r.code !== code || isResetMarker(r)) return;
    if (cutoff && String(r.date || '') <= cutoff) return;
    const sig = resultSignature(r);
    if (seen.has(sig)) return;
    seen.add(sig);
    out.push(r);
  });
  return out;
}
function skCodeFor(skill, level, g) { const e = skLinkEntry(skill, level, g); return e ? e.code : ''; }
function skResultBand(skill, r) {
  if (skill === 'writing') return skWritingBandFor(r);
  if (typeof r.band === 'number') return r.band;
  return typeof r.correct === 'number' && r.total ? skBand(r.correct, r.total) : null;
}
function skResultRaw(skill, r) {
  if (skill === 'writing') return (typeof r.words === 'number' ? r.words : 0) + ' words';
  return typeof r.correct === 'number' && r.total ? r.correct + ' / ' + r.total : '';
}
function skTableRows(level, groupId) {
  const g = skGroup(groupId);
  if (!g) return [];
  const idx = taRosterIndex(), students = {};
  SK_TABLE_SKILLS.forEach(skill => {
    skResultsFor(skCodeFor(skill, level, g)).forEach(r => {
      const st = rosterStudentForResult(r, idx);
      if (!st || st.group !== g.id) return;
      const band = skResultBand(skill, r);
      if (typeof band !== 'number') return;
      const key = String(st.id).trim().toLowerCase();
      const row = students[key] || (students[key] = { name: st.name, studentId: st.id, listening: null, reading: null, writing: null });
      const cur = row[skill];
      if (!cur || band > cur.band || (band === cur.band && String(r.date || '') > cur.date)) row[skill] = { band: band, raw: skResultRaw(skill, r), date: String(r.date || '') };
    });
  });
  const rows = Object.keys(students).map(k => {
    const row = students[k];
    SK_TABLE_SKILLS.forEach(s => { if (row[s]) delete row[s].date; });
    row.overall = skOverall(SK_TABLE_SKILLS.map(s => row[s] ? row[s].band : null));
    row.cefr = row.overall === null ? '' : skCefr(row.overall);
    return row;
  });
  rows.sort((a, b) => (b.overall - a.overall) || a.name.localeCompare(b.name));
  rows.forEach(row => { row.place = 1 + rows.filter(o => o.overall > row.overall).length; });
  return rows;
}
window.skTableRows = skTableRows;
function skHasTableResults(level, g) {
  return !!g && SK_TABLE_SKILLS.some(s => skResultsFor(skCodeFor(s, level, g)).length);
}
function skTableMeta(level, g) {
  const lv = skLevel(level);
  return { level: lv ? lv.no : Number(level), title: 'Level ' + (lv ? lv.no : level) + ' · ' + (lv ? lv.theme : ''), group: g ? g.name : '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) };
}
function skPlaceText(p) { return SK_MEDALS[p - 1] || String(p); }
function skTableHtml(rows, meta) {
  const esc = escapeForHtml;
  const cell = (v, cls) => v
    ? '<div class="' + cls + ' ' + skBandColour(v.band) + '"><b>' + v.band + '</b><small>' + esc(v.raw) + '</small></div>'
    : '<div class="' + cls + ' none">—</div>';
  const avg = skOverall(rows.map(r => r.overall));
  return '<div class="sk-rt">' +
    '<div class="sk-rt-head"><div class="sk-rt-brand" translate="no">🧶 loom</div>' +
      '<div class="sk-rt-title">🏆 ' + esc(meta.title) + '</div>' +
      '<div class="sk-rt-meta"><span translate="no">👥 ' + esc(meta.group) + '</span><span>📅 ' + esc(meta.date) + '</span></div>' +
      '<div class="sk-rt-chips">' + SK_TABLE_SKILLS.map(k => { const s = skSkill(k); return '<span class="sk-rt-chip sk-rt-' + k + '">' + s.emoji + ' ' + s.label + '</span>'; }).join('') + '</div></div>' +
    '<div class="sk-rt-scroll"><div class="sk-rt-grid">' +
      '<div class="sk-rt-cols"><span>#</span><span></span><span>Student</span>' + SK_TABLE_SKILLS.map(k => '<span>' + skSkill(k).emoji + ' ' + skSkill(k).label + '</span>').join('') + '<span>Overall</span></div>' +
      rows.map(r => '<div class="sk-rt-row">' +
        '<span class="sk-rt-place' + (r.place <= 3 ? ' medal' : '') + '" aria-label="Place ' + r.place + '">' + skPlaceText(r.place) + '</span>' +
        '<span class="res-avatar" style="background:' + avatarColorForName(r.name) + ';">' + esc(initialsForName(r.name)) + '</span>' +
        '<span class="sk-rt-name" translate="no">' + esc(r.name) + '</span>' +
        SK_TABLE_SKILLS.map(k => cell(r[k], 'sk-rt-cell')).join('') +
        (r.overall === null ? '<div class="sk-rt-overall none">—</div>'
          : '<div class="sk-rt-overall ' + skBandColour(r.overall) + '"><b>' + r.overall + '</b><small>' + r.cefr + '</small></div>') +
      '</div>').join('') +
    '</div></div>' +
    '<div class="sk-rt-foot"><span>Group average: <b>' + (avg === null ? '—' : avg) + '</b></span><span>' + rows.length + (rows.length === 1 ? ' student' : ' students') + '</span></div>' +
  '</div>';
}
let skTableOpen = null;   // { level, groupId, modal }
function skOpenTable(level) {
  const g = skGroup();
  if (!g) return;
  const modal = taModal('🏆 Results table', '', { onClose: () => { skTableOpen = null; } });
  const box = modal.el.querySelector('.points-modal');
  if (box) box.classList.add('sk-rt-modal');
  skTableOpen = { level: Number(level), groupId: g.id, modal: modal };
  skRenderTable();
}
function skRenderTable() {
  if (!skTableOpen) return;
  const g = skGroup(skTableOpen.groupId), rows = skTableRows(skTableOpen.level, skTableOpen.groupId);
  const meta = skTableMeta(skTableOpen.level, g);
  skTableOpen.modal.body.innerHTML = (rows.length ? skTableHtml(rows, meta)
      : '<div class="empty-results">No results from ' + escapeForHtml(meta.group) + '\'s students for this level yet.</div>') +
    '<div class="sk-rt-actions"><span class="sk-hint">Ready to post to the group\'s chat.</span>' +
    (rows.length ? '<button type="button" class="mini-btn solid" onclick="skDownloadTable()">⬇️ Download picture</button>' : '') + '</div>';
}
function skSlug(s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'group'; }
async function skDownloadTable() {
  if (!skTableOpen) return;
  const g = skGroup(skTableOpen.groupId), rows = skTableRows(skTableOpen.level, skTableOpen.groupId), meta = skTableMeta(skTableOpen.level, g);
  try {
    const blob = await skDrawTablePng(rows, meta);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'level-' + meta.level + '-' + skSlug(meta.group) + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    showToast('⬇️ Picture saved — post it to ' + meta.group + '\'s chat.', 'ok');
  } catch (e) {
    showToast('⚠️ Couldn\'t make the picture in this browser. Try Chrome, or take a screenshot of the table.');
  }
}
/* The same table as a PNG (2× for sharp text on phones). Fonts: Fredoka / Nunito when the page has them. */
const SK_PNG = { page: '#FFF5E1', card: '#FFFFFF', line: '#2B2140', ink: '#2B2140', soft: '#5A4E72', head: '#2B2140', headInk: '#FFF7EC',
  good: ['#D6F7EA', '#0B6B4B', '#2ED3A0'], mid: ['#FFF1C2', '#7A5600', '#FFD23F'], low: ['#FFE0E0', '#A31F1F', '#FF6B6B'],
  chips: { listening: '#4D9BFF', reading: '#2ED3A0', writing: '#FF9F43' }, avatars: ['#4D9BFF', '#22C3D6', '#A97BFF', '#FF9F43', '#FF7AC6', '#2ED3A0', '#FF6B6B', '#FFD23F'] };
async function skDrawTablePng(rows, meta) {
  const has = f => { try { return document.fonts && document.fonts.check(f); } catch (e) { return false; } };
  try { if (document.fonts && document.fonts.load) await Promise.race([Promise.all([document.fonts.load('700 20px Fredoka'), document.fonts.load('700 16px Nunito')]), new Promise(r => setTimeout(r, 1500))]); } catch (e) { /* offline */ }
  const HEAD_F = has('700 20px Fredoka') ? 'Fredoka, sans-serif' : 'sans-serif';
  const BODY_F = has('700 16px Nunito') ? 'Nunito, sans-serif' : 'sans-serif';
  const W = 960, PAD = 28, HEAD_H = 168, COLS_H = 40, ROW_H = 78, FOOT_H = 64;
  const H = PAD + HEAD_H + 16 + COLS_H + rows.length * ROW_H + FOOT_H + PAD;
  const S = 2, cv = document.createElement('canvas');
  cv.width = W * S; cv.height = H * S;
  const x = cv.getContext('2d');
  x.scale(S, S);
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  const text = (t, X, Y, font, color, align) => { x.font = font; x.fillStyle = color; x.textAlign = align || 'left'; x.textBaseline = 'middle'; x.fillText(t, X, Y); };
  const fit = (t, font, max) => { x.font = font; if (x.measureText(t).width <= max) return t; while (t.length > 1 && x.measureText(t + '…').width > max) t = t.slice(0, -1); return t + '…'; };
  // page + card with a hard shadow
  x.fillStyle = SK_PNG.page; x.fillRect(0, 0, W, H);
  const cardX = PAD, cardY = PAD, cardW = W - 2 * PAD, cardH = H - 2 * PAD;
  rr(cardX, cardY + 6, cardW, cardH, 22); x.fillStyle = SK_PNG.line; x.fill();
  rr(cardX, cardY, cardW, cardH, 22); x.fillStyle = SK_PNG.card; x.fill(); x.lineWidth = 3; x.strokeStyle = SK_PNG.line; x.stroke();
  // header
  x.save(); rr(cardX, cardY, cardW, cardH, 22); x.clip(); x.fillStyle = SK_PNG.head; x.fillRect(cardX, cardY, cardW, HEAD_H); x.restore();
  rr(cardX, cardY, cardW, cardH, 22); x.lineWidth = 3; x.strokeStyle = SK_PNG.line; x.stroke();
  const hx = cardX + 28;
  text('loom', hx, cardY + 30, '700 18px ' + HEAD_F, '#FFD23F');
  text('🏆 ' + meta.title, hx, cardY + 66, '700 30px ' + HEAD_F, SK_PNG.headInk);
  text(meta.group + '  ·  ' + meta.date, hx, cardY + 102, '700 17px ' + BODY_F, '#D8CDEB');
  let cx = hx;
  SK_TABLE_SKILLS.forEach(k => {
    const s = skSkill(k), label = s.emoji + ' ' + s.label;
    x.font = '700 15px ' + BODY_F;
    const w = x.measureText(label).width + 26;
    rr(cx, cardY + 122, w, 30, 15); x.fillStyle = SK_PNG.chips[k]; x.fill();
    text(label, cx + 13, cardY + 137, '700 15px ' + BODY_F, SK_PNG.line);
    cx += w + 10;
  });
  // columns
  const colX = { place: cardX + 26, avatar: cardX + 74, name: cardX + 120 };
  const cellW = 116, ovW = 124, gap = 12;
  const ovX = cardX + cardW - 24 - ovW;
  const skX = SK_TABLE_SKILLS.map((k, i) => ovX - gap - (SK_TABLE_SKILLS.length - i) * (cellW + gap) + gap);
  let y = cardY + HEAD_H + 16;
  const colFont = '700 14px ' + BODY_F;
  text('#', colX.place + 14, y + COLS_H / 2, colFont, SK_PNG.soft, 'center');
  text('Student', colX.name, y + COLS_H / 2, colFont, SK_PNG.soft);
  SK_TABLE_SKILLS.forEach((k, i) => text(skSkill(k).emoji + ' ' + skSkill(k).label, skX[i] + cellW / 2, y + COLS_H / 2, colFont, SK_PNG.soft, 'center'));
  text('Overall', ovX + ovW / 2, y + COLS_H / 2, colFont, SK_PNG.soft, 'center');
  y += COLS_H;
  const drawCell = (v, X, w, sub, strong) => {
    const cy = y + 7, h = ROW_H - 18;
    if (!v) { rr(X, cy, w, h, 14); x.fillStyle = '#F4EEE2'; x.fill(); text('—', X + w / 2, cy + h / 2, '700 22px ' + HEAD_F, '#A99CC4', 'center'); return; }
    const c = SK_PNG[skBandColour(v.band)];
    if (strong) { rr(X, cy + 3, w, h, 14); x.fillStyle = SK_PNG.line; x.fill(); }
    rr(X, cy, w, h, 14); x.fillStyle = c[0]; x.fill(); x.lineWidth = 2; x.strokeStyle = strong ? SK_PNG.line : c[2]; x.stroke();
    text(String(v.band), X + w / 2, cy + h / 2 - 9, '700 26px ' + HEAD_F, c[1], 'center');
    text(sub, X + w / 2, cy + h / 2 + 16, '700 13px ' + BODY_F, c[1], 'center');
  };
  rows.forEach((r, i) => {
    if (i % 2 === 1) { x.fillStyle = '#FFF9EE'; x.fillRect(cardX + 2, y, cardW - 4, ROW_H); }
    x.strokeStyle = '#EFE6D6'; x.lineWidth = 1; x.beginPath(); x.moveTo(cardX + 16, y); x.lineTo(cardX + cardW - 16, y); x.stroke();
    const mid = y + ROW_H / 2;
    text(skPlaceText(r.place), colX.place + 14, mid, (r.place <= 3 ? '26px ' : '700 20px ') + HEAD_F, SK_PNG.ink, 'center');
    let h = 0; for (let k = 0; k < r.name.length; k++) h = (h * 31 + r.name.charCodeAt(k)) >>> 0;
    x.beginPath(); x.arc(colX.avatar + 19, mid, 19, 0, Math.PI * 2); x.fillStyle = SK_PNG.avatars[h % SK_PNG.avatars.length]; x.fill();
    x.lineWidth = 2; x.strokeStyle = SK_PNG.line; x.stroke();
    text(initialsForName(r.name), colX.avatar + 19, mid + 1, '700 14px ' + HEAD_F, SK_PNG.line, 'center');
    text(fit(r.name, '700 18px ' + BODY_F, skX[0] - colX.name - 12), colX.name, mid, '700 18px ' + BODY_F, SK_PNG.ink);
    SK_TABLE_SKILLS.forEach((k, j) => drawCell(r[k], skX[j], cellW, r[k] ? r[k].raw : ''));
    drawCell(r.overall === null ? null : { band: r.overall }, ovX, ovW, r.cefr, true);
    y += ROW_H;
  });
  // footer
  x.strokeStyle = SK_PNG.line; x.lineWidth = 2; x.beginPath(); x.moveTo(cardX + 16, y + 4); x.lineTo(cardX + cardW - 16, y + 4); x.stroke();
  const avg = skOverall(rows.map(r => r.overall));
  text('Group average: ' + (avg === null ? '—' : avg) + '  ·  ' + rows.length + (rows.length === 1 ? ' student' : ' students'), cardX + 28, y + FOOT_H / 2 + 2, '700 18px ' + HEAD_F, SK_PNG.ink);
  return new Promise((resolve, reject) => cv.toBlob(b => b ? resolve(b) : reject(new Error('no picture')), 'image/png'));
}
window.skDrawTablePng = skDrawTablePng;

/* firebase.js calls this when results change: the tiles' buttons and an open results table follow. */
window.taCourseResultsChanged = function () { if (skOpenSkill()) renderCourse(); skRenderTable(); };

/* ================= PAGE START ================= */
window.addEventListener('storage', e => { if (e.key && /ta_skills_links|ta_student_groups|ta_recent_exercises/.test(e.key)) renderCourse(); });
taOnTab('course', renderCourse);
taStartPage('course');
