function renderDashboard() {
  const wrap = document.getElementById('dashboardWrap');
  if (!wrap) return;

  // Statistics is for the teacher's own students only. A completion only
  // counts if what the student typed matched a roster entry (confirming
  // they're really one of this teacher's students) — typing an arbitrary
  // name with no roster match is left out.
  // Each exercise type gets its own chart: how many completions on each of the
  // last 7 days, and today compared with yesterday. Types aren't compared with each other.
  const DAYS = 7;
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const dayStart = i => { const d = new Date(today0); d.setDate(d.getDate() - (DAYS - 1 - i)); return d; };   // i = 0 … 6 (6 = today)
  const first = dayStart(0).getTime();
  const dayIndex = when => {
    const t = Date.parse(when || '');
    if (!t || t < first) return -1;
    const d = new Date(t); d.setHours(0, 0, 0, 0);
    const i = Math.round((d.getTime() - first) / 86400000);
    return i >= 0 && i < DAYS ? i : -1;
  };
  const perType = {};
  const count = (type, when) => {
    const i = dayIndex(when);
    if (i === -1) return;
    (perType[type] || (perType[type] = new Array(DAYS).fill(0)))[i]++;
  };
  const entries = window.__pointsLedger || [];
  const rosterIdx = taRosterIndex();
  entries.forEach(e => {
    if (!e || (e.exerciseType || '') === 'Bonus' || (e.exerciseType || '') === 'Removed') return;
    if (!rosterStudentForId(e.studentId, rosterIdx)) return;
    count(e.exerciseType || 'Other', e.date);
  });
  // Completions for types that never award points (English Content,
  // Bidirectional Language) come from a separate, non-points results feed —
  // see startPlainCompletionsSync — since they'd never appear above.
  (window.__plainCompletions || []).forEach(r => {
    if (!r || typeof r.type !== 'string' || !rosterStudentForResult(r, rosterIdx)) return;
    count(r.type, r.date);
  });

  const displayLabels = {
    'BilingualReader': 'Bidirectional Language',
    'EnglishContent': 'English Content'
  };
  const colors = {
    'Word Order': '#4f7df3', 'Make a Word': '#14b8a6', 'Flashcard': '#f97316',
    'Pronunciation': '#22c55e', 'Spelling': '#8b7bf7', 'Can Knockdown': '#f03a52', 'Car Game': '#e0a526', 'Rocket Game': '#5b7cfa', 'Maze': '#c9a35a', 'Test': '#ef5f74',
    'Sentences': '#4f9de0', 'BilingualReader': '#2f6fd6', 'EnglishContent': '#e14e4e', 'Dictation': '#8b5cf6'
  };
  const dayLabel = i => i === DAYS - 1 ? 'Today' : i === DAYS - 2 ? 'Yesterday' : dayStart(i).toLocaleDateString(undefined, { weekday: 'short' });
  const dayLong = i => dayStart(i).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  function chartSvg(type, days) {
    const color = colors[type] || 'var(--brand)';
    const W = 520, H = 210, padL = 22, padR = 22, padT = 30, padB = 34;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const max = Math.max(2, Math.max.apply(null, days));
    const xAt = i => padL + i * plotW / (DAYS - 1);
    const yAt = v => padT + plotH - v / max * plotH;
    const pts = days.map((v, i) => [xAt(i), yAt(v)]);
    const bottom = yAt(0);
    const solid = pts.slice(0, DAYS - 1).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = 'M' + pts[0][0] + ',' + bottom + ' ' + pts.map(p => 'L' + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + ' L' + pts[DAYS - 1][0] + ',' + bottom + ' Z';
    const avg = days.reduce((a, b) => a + b, 0) / DAYS;
    const gid = 'scfill-' + type.replace(/[^a-z0-9]/gi, '');
    let svg = '<svg class="sc-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + escapeForHtml((displayLabels[type] || type) + ': ' + days.join(', ') + ' in the last 7 days') + '">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity="0.28"/><stop offset="1" stop-color="' + color + '" stop-opacity="0.03"/></linearGradient></defs>';
    for (let g = 0; g <= 2; g++) {
      const y = padT + plotH * g / 2;
      svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"/>';
    }
    svg += '<path d="' + area + '" fill="url(#' + gid + ')"/>';
    if (avg > 0) svg += '<line class="sc-avg" x1="' + padL + '" y1="' + yAt(avg).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yAt(avg).toFixed(1) + '" stroke="var(--ink-faint)" stroke-width="1" stroke-dasharray="3 4"><title>Average: ' + (Math.round(avg * 10) / 10) + ' a day</title></line>';
    svg += '<path d="' + solid + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    // today isn't over yet: its piece of the line is dashed (the "tail")
    svg += '<path class="sc-tail" d="M' + pts[DAYS - 2][0].toFixed(1) + ',' + pts[DAYS - 2][1].toFixed(1) + ' L' + pts[DAYS - 1][0].toFixed(1) + ',' + pts[DAYS - 1][1].toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-dasharray="7 6" stroke-linecap="round"/>';
    pts.forEach((p, i) => {
      const half = plotW / (DAYS - 1) / 2;
      svg += '<g class="sc-day">' +
        '<rect x="' + (p[0] - half).toFixed(1) + '" y="0" width="' + (half * 2).toFixed(1) + '" height="' + H + '" fill="transparent"/>' +
        '<line class="sc-hover" x1="' + p[0].toFixed(1) + '" y1="' + padT + '" x2="' + p[0].toFixed(1) + '" y2="' + bottom + '" stroke="var(--ink-faint)" stroke-width="1"/>' +
        '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (i === DAYS - 1 ? 6 : 4.5) + '" fill="' + color + '" stroke="var(--surface)" stroke-width="2"/>' +
        '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] - 12).toFixed(1) + '" text-anchor="middle" font-size="15" font-weight="800" fill="var(--ink)">' + days[i] + '</text>' +
        '<text x="' + p[0].toFixed(1) + '" y="' + (H - 10) + '" text-anchor="' + (i === 0 ? 'start' : i === DAYS - 1 ? 'end' : 'middle') + '" font-size="13" font-weight="' + (i === DAYS - 1 ? 800 : 600) + '" fill="' + (i === DAYS - 1 ? 'var(--ink)' : 'var(--ink-faint)') + '">' + escapeForHtml(dayLabel(i)) + '</text>' +
        '<title>' + escapeForHtml(dayLong(i) + ': ' + days[i] + (days[i] === 1 ? ' time' : ' times')) + '</title>' +
      '</g>';
    });
    return svg + '</svg>';
  }

  function vsYesterday(days) {
    const diff = days[DAYS - 1] - days[DAYS - 2];
    if (!diff) return '<span class="sc-change same">= <span>same as yesterday</span></span>';
    return '<span class="sc-change ' + (diff > 0 ? 'up' : 'down') + '">' + (diff > 0 ? '▲ ' : '▼ ') + '<b>' + Math.abs(diff) + '</b> <span>' + (diff > 0 ? 'more' : 'fewer') + ' than yesterday</span></span>';
  }

  const types = Object.keys(perType)
    .map(t => ({ t, days: perType[t], week: perType[t].reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.week - a.week || a.t.localeCompare(b.t));
  if (!types.length) {
    wrap.innerHTML = '<div class="empty-results">No exercises were done in the last 7 days.</div>';
    return;
  }
  wrap.innerHTML = '<div class="stats-chart-grid">' + types.map(x =>
    '<div class="chart-wrap stats-chart" data-type="' + escapeForHtml(x.t) + '">' +
      '<div class="sc-head"><div class="stats-chart-title"><span class="sc-dot" style="background:' + (colors[x.t] || 'var(--brand)') + '"></span>' + escapeForHtml(displayLabels[x.t] || x.t) + '</div>' +
        '<div class="sc-today"><b>' + x.days[DAYS - 1] + '</b> <span>today</span> ' + vsYesterday(x.days) + '</div></div>' +
      chartSvg(x.t, x.days) +
      '<div class="sc-week"><b>' + x.week + '</b> <span>in the last 7 days</span></div>' +
    '</div>'
  ).join('') + '</div>';
}

/* ================= PAGE START ================= */
taOnTab('dashboard', renderDashboard);
taStartPage('dashboard');
