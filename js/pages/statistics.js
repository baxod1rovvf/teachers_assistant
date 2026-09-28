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

  // Ten types don't fit one chart on a phone, so they're shown as two groups of five.
  const groups = [
    { title: '✍️ Words & writing', types: ['Word Order', 'Make a Word', 'Flashcard', 'Spelling', 'Sentences'] },
    { title: '🎧 Speaking, reading & listening', types: ['Pronunciation', 'Test', 'BilingualReader', 'EnglishContent', 'Dictation'] }
  ];
  const displayLabels = {
    'BilingualReader': 'Bidirectional Language',
    'EnglishContent': 'English Content'
  };

  const colors = {
    'Word Order': '#4f7df3', 'Make a Word': '#2dd4bf', 'Flashcard': '#fb923c',
    'Pronunciation': '#34d399', 'Spelling': '#8b7bf7', 'Test': '#ef5f74',
    'Sentences': '#4f9de0', 'BilingualReader': '#2f6fd6', 'EnglishContent': '#e14e4e', 'Dictation': '#8b5cf6'
  };

  function chartSvg(types) {
    const W = 520, H = 300, padL = 36, padR = 34, padT = 30, padB = 62;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const rawMax = Math.max.apply(null, types.map(t => typeCounts[t] || 0));
    const niceMax = Math.max(4, Math.ceil(rawMax / 4) * 4); // 0-based axis, rounded to a clean step
    const stepY = plotH / niceMax;
    const stepX = types.length > 1 ? plotW / (types.length - 1) : 0;
    const xAt = i => padL + (types.length > 1 ? i * stepX : plotW / 2);
    const yAt = v => padT + plotH - (v * stepY);

    let gridSvg = '';
    const gridLines = 4;
    for (let g = 0; g <= gridLines; g++) {
      const v = Math.round((niceMax / gridLines) * g);
      const y = yAt(v);
      gridSvg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--border)" stroke-width="1"/>';
      gridSvg += '<text x="' + (padL - 8) + '" y="' + (y + 5) + '" text-anchor="end" font-size="14" fill="var(--ink-faint)">' + v + '</text>';
    }

    const points = types.map((t, i) => ({ x: xAt(i), y: yAt(typeCounts[t] || 0), t, v: typeCounts[t] || 0 }));
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');

    let dotsSvg = '';
    points.forEach(p => {
      const color = colors[p.t] || 'var(--brand)';
      const label = displayLabels[p.t] || p.t;
      dotsSvg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="7" fill="' + color + '" stroke="var(--surface-page)" stroke-width="2.5"/>';
      dotsSvg += '<text x="' + p.x + '" y="' + (p.y - 15) + '" text-anchor="middle" font-size="16" font-weight="800" fill="var(--ink)">' + p.v + '</text>';
      const words = label.split(' ');
      const lines = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [label];
      lines.forEach((line, li) => {
        dotsSvg += '<text x="' + p.x + '" y="' + (H - 36 + li * 18 + (lines.length === 1 ? 9 : 0)) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink-soft)">' + escapeForHtml(line) + '</text>';
      });
    });

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%; height:auto; display:block;">' +
        gridSvg +
        '<line x1="' + padL + '" y1="' + yAt(0) + '" x2="' + (W - padR) + '" y2="' + yAt(0) + '" stroke="var(--ink-faint)" stroke-width="1.5"/>' +
        '<path d="' + linePath + '" fill="none" stroke="var(--brand)" stroke-width="3"/>' +
        dotsSvg +
      '</svg>';
  }

  wrap.innerHTML = '<div class="stats-chart-grid">' + groups.map(g =>
    '<div class="chart-wrap stats-chart"><div class="stats-chart-title">' + g.title + '</div>' + chartSvg(g.types) + '</div>'
  ).join('') + '</div>';
}

/* ================= PAGE START ================= */
taOnTab('dashboard', renderDashboard);
taStartPage('dashboard');
