async function resetAllPoints() {
  if (!confirm('Reset ALL points for every student on this board? The leaderboard will go back to zero, but the Dashboard\'s exercise-completion counts stay — only the point totals reset.')) return;
  if (!window.deleteAllPointsForBoard) { showToast('Still connecting — try again in a moment.'); return; }
  showToast('Resetting…', 'ok');
  const res = await window.deleteAllPointsForBoard(getPointsBoardCode());
  if (res.ok) {
    showToast('✅ Reset ' + res.count + ' point record' + (res.count === 1 ? '' : 's') + ' to 0.', 'ok');
  } else {
    showToast('⚠️ Could not reset points — check your internet connection.');
  }
}

async function deleteAllPointsEntirely() {
  if (!confirm('Delete ALL points records entirely for every student on this board? This is permanent — unlike Reset, this also brings exercise-completion counts and Statistics back to 0. This cannot be undone.')) return;
  if (!window.deleteAllPointsEntirelyForBoard) { showToast('Still connecting — try again in a moment.'); return; }
  showToast('Deleting…', 'ok');
  const res = await window.deleteAllPointsEntirelyForBoard(getPointsBoardCode());
  if (res.ok) {
    showToast('✅ Deleted ' + res.count + ' record' + (res.count === 1 ? '' : 's') + ' entirely.', 'ok');
  } else {
    showToast('⚠️ Could not delete — check your internet connection.');
  }
}
let __pointsBoardList = [];

function renderPointsBoard() {
  const codeDisplay = document.getElementById('pointsBoardCodeDisplay');
  if (codeDisplay) codeDisplay.textContent = getPointsBoardCode();
  const wrap = document.getElementById('pointsBoardWrap');
  if (!wrap) return;

  const entries = window.__pointsLedger || [];
  const byStudent = {};
  entries.forEach(e => {
    if (!e || !e.studentId) return;
    const key = String(e.studentId).trim().toLowerCase();
    if (!byStudent[key]) byStudent[key] = { total: 0, items: [] };
    byStudent[key].total += (e.points || 0);
    byStudent[key].items.push(e);
  });

  // Only students currently in the roster are shown — this is what makes
  // "Remove Student" actually remove them from the table, even though
  // their historical point entries still exist in Firestore. Each group
  // gets its own ranking.
  const buckets = getRosterByGroup();
  const flat = [];
  const sections = buckets.map(b => {
    const list = b.students.map(s => {
      const earned = byStudent[String(s.id).trim().toLowerCase()];
      return {
        id: s.id,
        displayName: s.name,
        total: earned ? earned.total : 0,
        items: earned ? earned.items.slice().sort((a, c) => new Date(a.date || 0) - new Date(c.date || 0)) : []
      };
    });
    list.sort((a, c) => c.total - a.total || a.displayName.localeCompare(c.displayName));
    return { name: b.name, list: list };
  });
  sections.forEach(sec => sec.list.forEach(st => { st.__idx = flat.length; flat.push(st); }));
  __pointsBoardList = flat;

  if (!flat.length) { wrap.innerHTML = '<div class="empty-results">No students added yet.</div>'; return; }

  let html = '';
  sections.forEach(sec => {
    if (!sec.list.length && sections.length > 1) {
      html += '<div class="points-group-block"><div class="points-group-label"><h3>' + escapeForHtml(sec.name) + '</h3><span>0 students</span></div>' +
        '<div class="empty-results">No students in this group yet.</div></div>';
      return;
    }
    const groupTotal = sec.list.reduce((a, st) => a + st.total, 0);
    html += '<div class="points-group-block"><div class="points-group-label"><h3>' + escapeForHtml(sec.name) + '</h3>' +
      '<span>' + sec.list.length + ' student' + (sec.list.length === 1 ? '' : 's') + ' · 🪙 ' + groupTotal + '</span></div>';
    html += '<div class="points-table">';
    html += '<div class="points-table-head"><span>Student</span><span>Points</span></div>';
    sec.list.forEach(st => {
      const exerciseCount = st.items.filter(it => (it.exerciseType || '') !== 'Bonus' && (it.exerciseType || '') !== 'Removed').length;
      html += '<div class="points-table-row" onclick="openPointsModal(' + st.__idx + ')">' +
        '<span>' + escapeForHtml(st.displayName) + '<br><small class="student-exercise-count">✅ ' + exerciseCount + ' exercise' + (exerciseCount === 1 ? '' : 's') + '</small></span>' +
        '<span class="points-cell">' +
          '<button class="pt-adjust-btn minus" type="button" onclick="event.stopPropagation(); showPointsAmountPopover(this, ' + jsAttr(st.id) + ', ' + jsAttr(st.displayName) + ', -1);">−</button>' +
          '<span class="pt-adjust-value">🪙 ' + st.total + '</span>' +
          '<button class="pt-adjust-btn plus" type="button" onclick="event.stopPropagation(); showPointsAmountPopover(this, ' + jsAttr(st.id) + ', ' + jsAttr(st.displayName) + ', 1);">+</button>' +
        '</span>' +
        '</div>';
    });
    html += '</div></div>';
  });
  wrap.innerHTML = html;
}

let pointsPopoverCtx = null;

function showPointsAmountPopover(btnEl, id, name, sign) {
  pointsPopoverCtx = { id, name, sign, btnEl };
  const pop = document.getElementById('pointsAmountPopover');
  const input = document.getElementById('pointsAmountInput');
  const label = document.getElementById('pointsAmountLabel');
  if (!pop || !input || !label) return;

  label.textContent = (sign > 0 ? 'Give points to ' : 'Take points from ') + name;
  input.value = '5';

  const rect = btnEl.getBoundingClientRect();
  pop.style.display = 'block'; // measure before positioning
  const popWidth = pop.offsetWidth || 170;
  let left = rect.left + rect.width / 2 - popWidth / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - popWidth - 8));
  pop.style.top = (window.scrollY + rect.bottom + 10) + 'px';
  pop.style.left = (window.scrollX + left) + 'px';
  const arrow = pop.querySelector('.pt-amount-arrow');
  if (arrow) arrow.style.left = (rect.left + rect.width / 2 - left) + 'px';

  pop.classList.add('show');
  input.focus();
  input.select();
}

function hidePointsAmountPopover() {
  const pop = document.getElementById('pointsAmountPopover');
  if (pop) { pop.classList.remove('show'); pop.style.display = ''; }
  pointsPopoverCtx = null;
}

async function confirmPointsAmount() {
  if (!pointsPopoverCtx) return;
  const input = document.getElementById('pointsAmountInput');
  const n = parseInt((input.value || '').trim(), 10);
  if (!Number.isFinite(n) || n <= 0) { showToast('Enter a whole number greater than 0.'); return; }
  const { id, name, sign, btnEl } = pointsPopoverCtx;
  let originX = window.innerWidth / 2, originY = window.innerHeight / 3;
  if (btnEl && btnEl.getBoundingClientRect) {
    const r = btnEl.getBoundingClientRect();
    originX = r.left + r.width / 2;
    originY = r.top + r.height / 2;
  }
  hidePointsAmountPopover();
  const ok = await adjustStudentPoints(id, name, n * sign);
  if (ok && sign > 0) {
    taPointsChime();
    taConfettiBurst(originX, originY, 22);
  }
}

document.addEventListener('click', (e) => {
  const pop = document.getElementById('pointsAmountPopover');
  if (!pop || !pop.classList.contains('show')) return;
  if (pop.contains(e.target) || e.target.closest('.pt-adjust-btn')) return;
  hidePointsAmountPopover();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== 'Escape') return;
  const pop = document.getElementById('pointsAmountPopover');
  if (!pop || !pop.classList.contains('show')) return;
  if (e.key === 'Enter' && document.activeElement === document.getElementById('pointsAmountInput')) {
    confirmPointsAmount();
  } else if (e.key === 'Escape') {
    hidePointsAmountPopover();
  }
});
async function adjustStudentPoints(id, name, delta) {
  const uid = 'manual-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const teacherName = getTeacherName() || 'Teacher';
  const packedTitle = 'By teacher' + '\u241F' + uid + '\u241F' + id + '\u241F' + teacherName;
  const payload = {
    v: 1,
    code: getPointsBoardCode(),
    builtAt: new Date().toISOString(),
    type: 'POINTS:Bonus',
    title: packedTitle,
    name: name,
    score: delta,
    warnings: 0,
    timeSeconds: 0,
    timeDisplay: '00:00',
    date: new Date().toISOString()
  };
  if (!window.taAwardPoints) { showToast('Points system is still connecting — try again in a moment.'); return false; }
  const res = await window.taAwardPoints(payload);
  if (res !== 'ok') { showToast("Couldn't save that — check your internet connection."); return false; }
  return true;
}

function openPointsModal(idx) {
  const s = __pointsBoardList[idx];
  if (!s) return;
  const backdrop = document.getElementById('pointsModalBackdrop');
  const titleEl = document.getElementById('pointsModalTitle');
  const totalEl = document.getElementById('pointsModalTotal');
  const bodyEl = document.getElementById('pointsModalBody');
  if (!backdrop || !titleEl || !totalEl || !bodyEl) return;

  titleEl.textContent = s.displayName + ' — ID ' + s.id;
  totalEl.textContent = '🪙 ' + s.total + ' points total';

  const rows = taBuildRows(s.items, s.displayName);

  if (!rows.length) {
    bodyEl.innerHTML = '<div class="empty-results">No points earned yet.</div>' +
      '<button class="mini-btn danger" type="button" style="margin-top:16px;" onclick="removePointsStudent(' + jsAttr(s.id) + '); closePointsModal();">🗑 Remove Student</button>';
  } else {
    bodyEl.innerHTML = rows.map(it => {
      const sign = it.points >= 0 ? '+' : '';
      return '<div class="pm-row"><span>' + escapeForHtml(it.label) + '</span><span style="color:var(--brand); font-weight:700; white-space:nowrap;">' + sign + it.points + it.suffix + '</span></div>';
    }).join('') +
    '<button class="mini-btn danger" type="button" style="margin-top:16px;" onclick="removePointsStudent(' + jsAttr(s.id) + '); closePointsModal();">🗑 Remove Student</button>';
  }

  backdrop.classList.add('show');
}

/* Every entry is shown on its own line — a real exercise as
   "Type: Title", a teacher adjustment as "Bonus: By Teacher <name>". */
function taBuildRows(items, fallbackName) {
  return items.map(it => {
    if ((it.exerciseType || '') === 'Bonus') {
      return { label: 'Bonus: By Teacher ' + (it.teacherName || 'Teacher'), points: it.points || 0, suffix: ' points' };
    }
    if ((it.exerciseType || '') === 'Removed') {
      return { label: 'Removed by Teacher', points: it.points || 0, suffix: ' points' };
    }
    return { label: (it.exerciseType || 'Exercise') + ': ' + (it.exerciseTitle || ''), points: it.points || 0, suffix: '' };
  });
}

function closePointsModal() {
  const backdrop = document.getElementById('pointsModalBackdrop');
  if (backdrop) backdrop.classList.remove('show');
}

function buildPointsBoardHtml(boardCode) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Points Leaderboard</title>
<style>
  body{font-family:'Segoe UI',system-ui,sans-serif;background:radial-gradient(circle at 15% -10%, #33245c, transparent 55%), radial-gradient(circle at 100% 110%, #1b3a3a, transparent 50%), #170f2b;color:#f2eefb;margin:0;padding:24px 16px;min-height:100vh;}
  h1{text-align:center;font-size:1.6rem;margin-bottom:4px;letter-spacing:.3px;}
  .sub{text-align:center;color:#b3a6d6;margin-bottom:24px;}
  .wrap{max-width:560px;margin:0 auto;}
  .board{border:1.5px solid #4a3b78;border-radius:14px;overflow:hidden;background:#241a42;box-shadow:0 10px 30px -10px rgba(0,0,0,.5);}
  .head,.row{display:grid;grid-template-columns:70px 1fr 90px;gap:10px;align-items:center;padding:12px 16px;}
  .head{font-size:.72rem;letter-spacing:.5px;text-transform:uppercase;color:#4ade80;background:rgba(74,222,128,.08);border-bottom:1.5px solid #4a3b78;}
  .row{cursor:pointer;border-bottom:1px solid #362a58;font-size:1rem;}
  .row:last-of-type{border-bottom:none;}
  .row:hover{background:rgba(255,255,255,.04);}
  .row .pts{font-weight:800;color:#4ade80;text-align:right;}
  .empty{text-align:center;color:#b3a6d6;margin-top:40px;}
  .grp{font-size:1.05rem;font-weight:800;margin:26px 2px 10px;display:flex;justify-content:space-between;gap:10px;}
  .grp:first-child{margin-top:0;}
  .grp small{color:#b3a6d6;font-weight:700;font-size:.8rem;}
  .board .empty{margin:0;padding:18px;}
  .modal-backdrop{display:none;position:fixed;inset:0;z-index:999;background:rgba(10,4,24,.75);align-items:center;justify-content:center;padding:20px;}
  .modal-backdrop.show{display:flex;}
  .modal{position:relative;width:100%;max-width:420px;max-height:80vh;overflow-y:auto;background:#1e1538;border:1.5px solid #4a3b78;border-radius:16px;padding:26px 24px;box-shadow:0 24px 60px -20px rgba(0,0,0,.65);}
  .modal-close{position:absolute;top:14px;right:14px;background:none;border:none;color:#b3a6d6;font-size:1.1rem;cursor:pointer;padding:4px;}
  .modal-close:hover{color:#f2eefb;}
  .modal-title{font-weight:800;font-size:1.2rem;margin-bottom:4px;padding-right:20px;}
  .modal-total{color:#4ade80;font-weight:800;font-size:1rem;margin-bottom:16px;}
  .modal-body{color:#cfc4ea;font-size:.9rem;line-height:1.9;}
  .modal-body .pm-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid #362a58;}
  .modal-body .pm-row:last-child{border-bottom:none;}
</style>
</head>
<body>
  <h1>🪙 Points Leaderboard</h1>
  <div class="sub">Tap a row to see which exercises earned those points</div>
  <div class="wrap" id="wrap"><div class="empty">Loading…</div></div>

  <div class="modal-backdrop" id="modalBackdrop" onclick="if(event.target===this) closeModal();">
    <div class="modal">
      <button class="modal-close" type="button" onclick="closeModal()">✕</button>
      <div class="modal-title" id="modalTitle"></div>
      <div class="modal-total" id="modalTotal"></div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  </div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyCefg2YghdSneABh0ZOUu3-snO4soVw0lA",
    authDomain: "teachers-assistant-app-ccd1a.firebaseapp.com",
    projectId: "teachers-assistant-app-ccd1a",
    storageBucket: "teachers-assistant-app-ccd1a.firebasestorage.app",
    messagingSenderId: "185909682129",
    appId: "1:185909682129:web:21fd63e09809eac82d8af0",
    measurementId: "G-7P60GBSYEM"
  };
  const ROSTER = ${JSON.stringify(getPointsRoster())};
  const GROUPS = ${JSON.stringify(getRosterByGroup().map(b => ({ name: b.name, ids: b.students.map(x => x.id) })))};
  const BOARD_CODE = ${JSON.stringify(boardCode)};
  let currentList = [];

  function nameFor(id, fallback) {
    const r = ROSTER.find(s => s.id === id);
    return r ? r.name : fallback;
  }

  function esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function parseDoc(v) {
    if (!v || typeof v.type !== 'string' || v.type.indexOf('POINTS:') !== 0 || v.type === 'POINTS:DISABLE') return null;
    if (typeof v.title !== 'string') return null;
    const parts = v.title.split('\\u241F');
    if (parts.length < 3) return null;
    return {
      exerciseTitle: parts[0],
      uid: parts[1],
      studentId: parts[2],
      teacherName: parts[3] || 'Teacher',
      exerciseType: v.type.slice(7),
      studentName: v.name || parts[2],
      points: v.score || 0
    };
  }

  function buildRows(items, fallbackName) {
    return items.map(it => {
      if ((it.exerciseType || '') === 'Bonus') {
        return { label: 'Bonus: By Teacher ' + (it.teacherName || 'Teacher'), points: it.points || 0, suffix: ' points' };
      }
      return { label: (it.exerciseType || 'Exercise') + ': ' + (it.exerciseTitle || ''), points: it.points || 0, suffix: '' };
    });
  }

  window.openModal = function (idx) {
    const s = currentList[idx];
    if (!s) return;
    document.getElementById('modalTitle').textContent = s.displayName + ' — ID ' + s.id;
    document.getElementById('modalTotal').textContent = '🪙 ' + s.total + ' points total';
    const bodyEl = document.getElementById('modalBody');
    const rows = buildRows(s.items, s.displayName);
    if (!rows.length) {
      bodyEl.innerHTML = '<div class="empty" style="margin-top:0;">No points earned yet.</div>';
    } else {
      bodyEl.innerHTML = rows.map(it => {
        const sign = it.points >= 0 ? '+' : '';
        return '<div class="pm-row"><span>' + esc(it.label) + '</span><span style="color:#facc15;font-weight:700;white-space:nowrap;">' + sign + it.points + it.suffix + '</span></div>';
      }).join('');
    }
    document.getElementById('modalBackdrop').classList.add('show');
  };

  window.closeModal = function () {
    document.getElementById('modalBackdrop').classList.remove('show');
  };

  function render(entries) {
    const wrap = document.getElementById('wrap');
    const byStudent = {};
    entries.forEach(e => {
      if (!e || !e.studentId) return;
      const k = String(e.studentId).trim().toLowerCase();
      if (!byStudent[k]) byStudent[k] = { total: 0, name: e.studentName || e.studentId, items: [] };
      byStudent[k].total += (e.points || 0);
      byStudent[k].items.push(e);
    });
    // Only students still in the roster at download time appear here —
    // matches the teacher's app, so a removed student is gone when shared.
    const list = ROSTER.map(s => {
      const earned = byStudent[String(s.id).trim().toLowerCase()];
      return {
        id: s.id,
        displayName: s.name,
        total: earned ? earned.total : 0,
        items: earned ? earned.items.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0)) : []
      };
    }).sort((a, b) => b.total - a.total);
    currentList = list;

    if (!list.length) { wrap.innerHTML = '<div class="empty">No points earned yet.</div>'; return; }

    const sections = (GROUPS && GROUPS.length) ? GROUPS : [{ name: '', ids: list.map(s => s.id) }];
    let html = '';
    sections.forEach(g => {
      const rows = list.map((s, idx) => ({ s: s, idx: idx })).filter(o => g.ids.indexOf(o.s.id) !== -1);
      if (g.name) html += '<div class="grp"><span>' + esc(g.name) + '</span><small>' + rows.length + ' student' + (rows.length === 1 ? '' : 's') + '</small></div>';
      html += '<div class="board">';
      if (!rows.length) { html += '<div class="empty">No students in this group.</div></div>'; return; }
      html += '<div class="head"><span>ID</span><span>Student</span><span>Points</span></div>';
      rows.forEach(o => {
        html += '<div class="row" onclick="openModal(' + o.idx + ')">' +
          '<span>' + esc(o.s.id) + '</span><span>' + esc(o.s.displayName) + '</span><span class="pts">🪙 ' + o.s.total + '</span></div>';
      });
      html += '</div>';
    });
    wrap.innerHTML = html;
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const q = query(collection(db, 'results'), where('code', '==', BOARD_CODE));
    onSnapshot(q, snap => render(snap.docs.map(d => parseDoc(d.data())).filter(Boolean)), err => {
      document.getElementById('wrap').innerHTML = '<div class="empty">Could not connect. Check your internet connection.</div>';
    });
  } catch (e) {
    document.getElementById('wrap').innerHTML = '<div class="empty">Could not connect. Check your internet connection.</div>';
  }
<\/script>
</body>
</html>`;
}

function downloadPointsBoard() {
  const code = getPointsBoardCode();
  const html = buildPointsBoardHtml(code);
  downloadFile('Points_Leaderboard.html', html);
  showToast('Leaderboard downloaded! Board code: ' + code, 'ok');
}

/* ================= PAGE START ================= */
taOnTab('points', function () {
  renderPointsBoard();
  if (window.startPointsSync) window.startPointsSync(getPointsBoardCode());
});
taStartPage('points');
