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
// The leaderboard shows each group as a block; tapping one shows that group's students.
let pointsOpenGroup = null;
function openPointsGroup(groupId) { pointsOpenGroup = groupId; renderPointsBoard(); }
function closePointsGroup() { pointsOpenGroup = null; renderPointsBoard(); }

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
    return { id: b.id, name: b.name, list: list };
  });
  sections.forEach(sec => sec.list.forEach(st => { st.__idx = flat.length; flat.push(st); }));
  __pointsBoardList = flat;

  if (!flat.length) { wrap.innerHTML = '<div class="empty-results">No students added yet.</div>'; return; }

  if (pointsOpenGroup !== null && !sections.some(sec => sec.id === pointsOpenGroup)) pointsOpenGroup = null;

  /* ---------- one group opened: its students' points ---------- */
  if (pointsOpenGroup !== null) {
    const sec = sections.find(x => x.id === pointsOpenGroup);
    const groupTotal = sec.list.reduce((a, st) => a + st.total, 0);
    let html = '<div class="group-detail-head"><div class="gd-left">' +
      '<button class="mini-btn" type="button" onclick="closePointsGroup()">← All groups</button>' +
      '<h3>' + escapeForHtml(sec.name) + '</h3>' +
      '<span class="student-group-count">' + sec.list.length + ' student' + (sec.list.length === 1 ? '' : 's') + ' · 🪙 ' + groupTotal + '</span>' +
    '</div></div>';
    if (!sec.list.length) {
      wrap.innerHTML = html + '<div class="empty-results">No students in this group yet.</div>';
      return;
    }
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
    html += '</div>';
    wrap.innerHTML = html;
    return;
  }

  /* ---------- all groups as blocks ---------- */
  let html = '<div class="group-block-list">';
  sections.forEach(sec => {
    const groupTotal = sec.list.reduce((a, st) => a + st.total, 0);
    const leader = sec.list[0];
    const sub = sec.list.length + ' student' + (sec.list.length === 1 ? '' : 's') +
      (leader && leader.total > 0 ? ' · 🥇 ' + leader.displayName : '');
    html += '<div class="group-block' + (sec.id === '' ? ' unassigned' : '') + '" role="button" tabindex="0" ' +
        'onclick="openPointsGroup(' + jsAttr(sec.id) + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openPointsGroup(' + jsAttr(sec.id) + ');}">' +
      '<div class="group-block-main">' +
        '<div class="group-block-title"><b>' + escapeForHtml(sec.name) + '</b></div>' +
        '<div class="group-block-sub">' + escapeForHtml(sub) + '</div>' +
      '</div>' +
      '<div class="group-block-side">' +
        '<span class="group-block-pts">🪙 ' + groupTotal + '</span>' +
        '<span class="group-block-chevron" aria-hidden="true">›</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';
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

/* ================= PAGE START ================= */
taOnTab('points', function () {
  pointsOpenGroup = null;
  renderPointsBoard();
  if (window.startPointsSync) window.startPointsSync(getPointsBoardCode());
});
taStartPage('points');
