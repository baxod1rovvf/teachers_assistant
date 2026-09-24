function renderDashboard() {
  const wrap = document.getElementById('dashboardWrap');
  if (!wrap) return;

  // Statistics is for the teacher's own students only. A completion only
  // counts if what the student typed matched a roster entry (confirming
  // they're really one of this teacher's students) — typing an arbitrary
  // name with no roster match is left out.
  const entries = window.__pointsLedger || [];
  const typeCounts = {};
  const rosterIdx = taRosterIndex();
  entries.forEach(e => {
    if (!e || (e.exerciseType || '') === 'Bonus' || (e.exerciseType || '') === 'Removed') return;
    if (!rosterStudentForId(e.studentId, rosterIdx)) return;
    const t = e.exerciseType || 'Other';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  // Completions for types that never award points (English Content,
  // Bidirectional Language) come from a separate, non-points results feed \u2014
  // see startPlainCompletionsSync \u2014 since they'd never appear above.
  (window.__plainCompletions || []).forEach(r => {
    if (!r || typeof r.type !== 'string' || !rosterStudentForResult(r, rosterIdx)) return;
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const order = ['Word Order', 'Make a Word', 'Flashcard', 'Pronunciation', 'Spelling', 'Test', 'Sentences', 'BilingualReader', 'EnglishContent', 'Dictation'];
  const types = order;
  const displayLabels = {
    'BilingualReader': 'Bidirectional Language',
    'EnglishContent': 'English Content'
  };

  const colors = {
    'Word Order': '#4f7df3', 'Make a Word': '#2dd4bf', 'Flashcard': '#fb923c',
    'Pronunciation': '#34d399', 'Spelling': '#8b7bf7', 'Test': '#ef5f74',
    'Sentences': '#4f9de0', 'BilingualReader': '#2f6fd6', 'EnglishContent': '#e14e4e', 'Dictation': '#8b5cf6'
  };

  const W = 980, H = 280, padL = 34, padR = 20, padT = 24, padB = 52;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const rawMax = Math.max.apply(null, types.map(t => typeCounts[t] || 0));
  const niceMax = Math.max(4, Math.ceil(rawMax / 4) * 4); // 0-based axis, rounded to a clean step
  const stepY = plotH / niceMax;
  const stepX = types.length > 1 ? plotW / (types.length - 1) : 0;

  function xAt(i) { return padL + (types.length > 1 ? i * stepX : plotW / 2); }
  function yAt(v) { return padT + plotH - (v * stepY); }

  let gridSvg = '';
  const gridLines = 4;
  for (let g = 0; g <= gridLines; g++) {
    const v = Math.round((niceMax / gridLines) * g);
    const y = yAt(v);
    gridSvg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"/>';
    gridSvg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="var(--ink-faint)">' + v + '</text>';
  }

  const points = types.map((t, i) => ({ x: xAt(i), y: yAt(typeCounts[t] || 0), t, v: typeCounts[t] || 0 }));
  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');

  let dotsSvg = '';
  points.forEach(p => {
    const color = colors[p.t] || 'var(--brand)';
    const label = displayLabels[p.t] || p.t;
    dotsSvg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="5" fill="' + color + '" stroke="var(--surface-page)" stroke-width="2"/>';
    dotsSvg += '<text x="' + p.x + '" y="' + (p.y - 12) + '" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">' + p.v + '</text>';
    if (label.indexOf(' ') !== -1) {
      const words = label.split(' ');
      dotsSvg += '<text x="' + p.x + '" y="' + (H - 26) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-soft)">' + escapeForHtml(words[0]) + '</text>';
      dotsSvg += '<text x="' + p.x + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-soft)">' + escapeForHtml(words.slice(1).join(' ')) + '</text>';
    } else {
      dotsSvg += '<text x="' + p.x + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-soft)">' + escapeForHtml(label) + '</text>';
    }
  });

  const svg =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%; height:auto; max-width:980px;">' +
      gridSvg +
      '<line x1="' + padL + '" y1="' + yAt(0) + '" x2="' + (W - padR) + '" y2="' + yAt(0) + '" stroke="var(--ink-faint)" stroke-width="1.5"/>' +
      '<path d="' + linePath + '" fill="none" stroke="var(--brand)" stroke-width="2.5"/>' +
      dotsSvg +
    '</svg>';

  wrap.innerHTML = '<div class="chart-wrap">' + svg + '</div>';
}

/* ================= PAGE START ================= */
taOnTab('dashboard', renderDashboard);
taStartPage('dashboard');
