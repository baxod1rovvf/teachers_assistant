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
/* Points live on Students & Points (students.js draws the groups and students).
   When new points arrive, only the numbers change — a full redraw would wipe
   what the teacher is typing into the add-student form. */
function renderPointsBoard() {
  document.querySelectorAll('[data-pts-for]').forEach(el => {
    el.textContent = '🪙 ' + pointsTotalFor(el.getAttribute('data-pts-for'));
  });
  document.querySelectorAll('[data-group-pts]').forEach(el => {
    const gid = el.getAttribute('data-group-pts');
    const b = getRosterByGroup().find(x => x.id === gid);
    el.textContent = '🪙 ' + (b ? b.students.reduce((a, st) => a + pointsTotalFor(st.id), 0) : 0);
  });
  const open = document.getElementById('pointsModalBackdrop');
  if (open && open.classList.contains('show') && open.dataset.student) openStudentPoints(open.dataset.student);
}
window.renderPointsBoard = renderPointsBoard;

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

// A student's points, one line per exercise or teacher's bonus (tap their 🪙 total).
function openStudentPoints(id) {
  const st = getPointsRoster().find(s => String(s.id) === String(id));
  if (!st) return;
  const backdrop = document.getElementById('pointsModalBackdrop');
  const titleEl = document.getElementById('pointsModalTitle');
  const totalEl = document.getElementById('pointsModalTotal');
  const bodyEl = document.getElementById('pointsModalBody');
  if (!backdrop || !titleEl || !totalEl || !bodyEl) return;
  const key = String(st.id).trim().toLowerCase();
  const items = (window.__pointsLedger || []).filter(e => e && e.studentId && String(e.studentId).trim().toLowerCase() === key)
    .sort((a, c) => new Date(a.date || 0) - new Date(c.date || 0));
  backdrop.dataset.student = st.id;
  titleEl.textContent = st.name + ' — ID ' + st.id;
  totalEl.textContent = '🪙 ' + items.reduce((a, e) => a + (e.points || 0), 0) + ' points total';
  const rows = taBuildRows(items, st.name);
  bodyEl.innerHTML = rows.length
    ? rows.map(it => {
        const sign = it.points >= 0 ? '+' : '';
        return '<div class="pm-row"><span>' + escapeForHtml(it.label) + '</span><span style="color:var(--brand); font-weight:700; white-space:nowrap;">' + sign + it.points + it.suffix + '</span></div>';
      }).join('')
    : '<div class="empty-results">No points earned yet.</div>';
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
  if (backdrop) { backdrop.classList.remove('show'); delete backdrop.dataset.student; }
}
