// Makes css/skill-dark.css: the students' course page (skill.html) in Loom's dark "Teacher Studio" look
// (teacher, 2026-11-08: "now change course exercises design"). It reads the student page's rules in css/style.css
// (the "SKILLS COURSE — STUDENT PAGE" block) and writes, for every rule, only its colours, borders, shadows and fonts
// turned dark — so the layout stays in one place. Run `node tools/make-skill-dark.js` after changing those rules.
// The selectors get `#skBody.sk-studio` in front: that outweighs the student theme (js/student-theme.js) added last to the page.
const fs = require('fs'), path = require('path');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
const from = css.indexOf('SKILLS COURSE — STUDENT PAGE'), to = css.indexOf("/* The students' course page (skill.html) keeps");
const block = css.slice(css.indexOf('*/', from) + 2, to);

const INK = '#F3F4F8', SOFT = '#B4B8C7', CARD = '#161922', CARD2 = '#1C202B', LINE = 'rgba(255,255,255,0.1)', BRAND = '#818CF8';
const BG = { // a light colour used as a background → its dark twin
  '#fff': CARD, '#ffffff': CARD, '#fffdf7': CARD, '#fff7e8': CARD2, '#f4f0e8': CARD2, '#f1ebff': CARD2, '#f1eaff': CARD2,
  '#ffd23f': 'rgba(99,102,241,0.18)', '#fff1b8': '#242937', '#ffe98a': 'rgba(251,191,36,0.16)', '#ffe3e3': 'rgba(244,63,94,0.15)',
  '#ddf8ee': 'rgba(16,185,129,0.15)', '#b8f2c8': 'rgba(16,185,129,0.15)', '#d9f7ff': 'rgba(99,102,241,0.18)', '#2ed3a0': 'rgba(16,185,129,0.25)',
  '#7b4dff': '#6366F1', '#8b5cff': '#6366F1', '#2b2140': '#0E1017', '#c9bfa9': 'rgba(255,255,255,0.15)', '#ff8a8a': 'rgba(244,63,94,0.25)'
};
const FG = { // a colour used for text/lines → its dark-page twin
  '#2b2140': INK, '#5a4e72': SOFT, '#7b4dff': BRAND, '#8b5cff': BRAND, '#a61e35': '#FB7185', '#c5283d': '#FB7185', '#e5484d': '#FB7185',
  '#ff8a8a': '#FB7185', '#12a979': '#34D399', '#0b7a57': '#34D399', '#2ed3a0': '#34D399', '#e0457b': '#F472B6', '#b8336a': '#F472B6',
  '#7a5b00': '#FBBF24', '#2f5fc4': BRAND, '#4d7bff': BRAND, '#ffd23f': '#FBBF24', '#c9bfa9': 'rgba(255,255,255,0.25)', '#fff': '#fff', '#ffffff': '#fff'
};
const hexRe = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const mapAll = (v, table) => v.replace(hexRe, h => table[h.toLowerCase()] || h);

function convert(prop, val) {
  const v = val.replace(/!important/, '').trim();
  if (prop === 'font-family' || prop === 'font') return v.indexOf('Fredoka') !== -1 || v.indexOf('Nunito') !== -1 ? v.replace(/'Fredoka'|'Nunito'/g, "'Plus Jakarta Sans'") : null;
  if (prop === 'box-shadow') return /#2B2140|#2b2140/.test(v) ? 'none' : mapAll(v, BG);
  if (prop === 'text-shadow') return 'none';
  if (prop === 'transform') return /rotate/.test(v) ? 'none' : null;
  if (prop === 'background' || prop === 'background-color') {
    if (/linear-gradient\(135deg, #FF5FB0/i.test(v)) return '#6366F1';
    return mapAll(v, BG);
  }
  if (prop === 'color' || prop === 'outline' || prop === 'outline-color' || prop === 'text-decoration-color' || prop === 'caret-color' || prop === 'accent-color') return mapAll(v, FG);
  if (/^border(-(top|right|bottom|left))?(-color)?$/.test(prop)) {
    if (/#2B2140/i.test(v)) return v.replace(/\b(2\.5|3|2)px\b/, '1px').replace(/#2B2140/i, LINE);
    return mapAll(v, FG);
  }
  return null;
}

let out = '/* made by tools/make-skill-dark.js — do not edit by hand */\n';
const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
let m, media = '';
// handle @media blocks: keep their inner rules inside the same @media
const parts = block.split(/(@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\})/);
for (const part of parts) {
  if (!part.trim()) continue;
  const isMedia = part.startsWith('@media');
  const head = isMedia ? part.slice(0, part.indexOf('{')).trim() : '';
  const body = isMedia ? part.slice(part.indexOf('{') + 1, part.lastIndexOf('}')) : part;
  let chunk = '';
  ruleRe.lastIndex = 0;
  while ((m = ruleRe.exec(body))) {
    const sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!sel || sel.startsWith('@')) continue;
    if (/^@keyframes|^\d+%|^from|^to$/.test(sel)) continue;
    const decls = [];
    m[2].split(';').forEach(d => {
      const i = d.indexOf(':'); if (i < 0) return;
      const prop = d.slice(0, i).trim().toLowerCase(), val = d.slice(i + 1).trim();
      const nv = convert(prop, val);
      if (nv !== null && nv !== val.replace(/!important/, '').trim()) decls.push(prop + ': ' + nv + ' !important');
    });
    if (!decls.length) continue;
    const sels = sel.split(',').map(s => s.trim()).filter(Boolean).map(s => s.replace(/^body\.sk-body|^\.sk-body/, '') ).map(s => '#skBody.sk-studio' + (s && !s.startsWith(':') && !s.startsWith('.sk-body') ? ' ' : '') + s);
    chunk += sels.join(', ') + ' { ' + decls.join('; ') + '; }\n';
  }
  out += isMedia ? head + ' {\n' + chunk + '}\n' : chunk;
}
out += `
/* the page, the start card (the student theme's .ta-login-* look), inputs and the Start button */
#skBody.sk-studio { background: #0E1017 !important; color: ${INK} !important; color-scheme: dark; }
#skBody.sk-studio, #skBody.sk-studio * { font-family: 'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif !important; }
#skBody.sk-studio .sk-card { border-radius: 18px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.25), 0 8px 24px -12px rgba(0,0,0,0.5) !important; }
#skBody.sk-studio :is(.ta-login-card, .ta-login-form) { background: ${CARD} !important; color: ${INK} !important; border-color: ${LINE} !important; box-shadow: none !important; }
#skBody.sk-studio .sk-start-card { background: ${CARD} !important; border: 1px solid ${LINE} !important; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.7) !important; }
#skBody.sk-studio :is(.ta-login-form h1, .ta-login-form h2, .ta-login-form .headline, .ta-login-form p, .ta-login-form label) { color: ${INK} !important; }
#skBody.sk-studio .ta-login-form p { color: ${SOFT} !important; }
#skBody.sk-studio .ta-login-type { background: rgba(99,102,241,0.18) !important; color: #C7D2FE !important; border: 1px solid rgba(129,140,248,0.35) !important; box-shadow: none !important; transform: none !important; }
#skBody.sk-studio .ta-underline { background: #6366F1 !important; height: 3px !important; border: 0 !important; }
#skBody.sk-studio :is(input[type="text"], input:not([type]), textarea, select, .sk-gap) { background: #12141C !important; color: ${INK} !important; border: 1px solid ${LINE} !important; box-shadow: none !important; border-radius: 12px !important; }
#skBody.sk-studio :is(input, textarea, select)::placeholder { color: #868B9C !important; }
#skBody.sk-studio :is(input, textarea, select):focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.3) !important; outline: none !important; }
#skBody.sk-studio :is(.start-btn, .sk-btn-main) { background: #6366F1 !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: 0 8px 22px -8px rgba(99,102,241,0.6) !important; text-shadow: none !important; border-radius: 12px !important; }
#skBody.sk-studio :is(.start-btn, .sk-btn-main):hover { background: #7376F5 !important; transform: translateY(-1px) !important; }
#skBody.sk-studio .sk-btn:not(.sk-btn-main) { background: #1C202B !important; color: ${INK} !important; border: 1px solid ${LINE} !important; box-shadow: none !important; border-radius: 12px !important; }
#skBody.sk-studio .sk-btn:not(.sk-btn-main):hover { background: #242937 !important; transform: none !important; }
#skBody.sk-studio .sk-opt { box-shadow: none !important; }
#skBody.sk-studio .sk-opt:hover:not(:disabled) { transform: none !important; }
#skBody.sk-studio .sk-opt.on b { color: #fff !important; }
#skBody.sk-studio .sk-score { color: #fff !important; border: 1px solid rgba(129,140,248,0.35) !important; box-shadow: none !important; }
#skBody.sk-studio audio { color-scheme: dark; }
#skBody.sk-studio .sk-uz { color: #A5B4FC !important; }   /* Speaking words' Uzbek meaning */
/* the student theme names the name box and the Start button by id, so these use the page's id twice to stay on top */
#skBody#skBody.sk-studio :is(#studentNameInput, #skIdInput) { background: #12141C !important; color: ${INK} !important; border: 1px solid ${LINE} !important; box-shadow: none !important; }
#skBody#skBody.sk-studio :is(#studentNameInput, #skIdInput):focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.3) !important; }
#skBody#skBody.sk-studio .ta-login-form :is(.start-btn, button) { background: #6366F1 !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.08) !important; box-shadow: 0 8px 22px -8px rgba(99,102,241,0.6) !important; text-shadow: none !important; }
#skBody#skBody.sk-studio .ta-login-form :is(.start-btn, button):hover { background: #7376F5 !important; transform: translateY(-1px) !important; }
`;
fs.writeFileSync(path.join(__dirname, '..', 'css', 'skill-dark.css'), out);
console.log('css/skill-dark.css: ' + out.split('\n').length + ' lines');
