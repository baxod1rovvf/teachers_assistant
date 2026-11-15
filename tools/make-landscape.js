// Makes images/app/landscape.svg — the misty mountain picture behind the teacher's pages
// ("Mountain Air" design, teacher 2026-11-15). Drawn from code (no photo, no licence), a few KB.
// Usage: node tools/make-landscape.js
const fs = require('fs'), path = require('path');
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const W = 1600, H = 1000;
// a ridge line: a few sine waves + small noise, from x=0 to W
function ridge(base, amp, waves, step, peakAt, peakH) {
  const ph = waves.map(() => rnd() * Math.PI * 2);
  const pts = [];
  for (let x = -20; x <= W + 20; x += step) {
    let y = base;
    waves.forEach((w, i) => { y -= Math.sin(x / w + ph[i]) * amp / (i + 1); });
    y -= (rnd() - 0.5) * amp * 0.12;
    if (peakAt != null) y -= peakH * Math.exp(-Math.pow((x - peakAt) / 230, 2));
    pts.push([x, Math.round(y)]);
  }
  return 'M-20 ' + H + ' L' + pts.map(p => p.join(' ')).join(' L') + ' L' + (W + 20) + ' ' + H + 'Z';
}
const far = ridge(560, 70, [210, 95, 41], 16, 1180, 150);
const mid = ridge(660, 60, [260, 120, 47], 14, 300, 110);
const near = ridge(790, 34, [300, 140, 60], 12, null, 0);
// the mossy hill (bottom right) and a little grass on the left
const hill = 'M700 1000 C 820 890, 940 800, 1070 745 C 1150 712, 1230 696, 1310 704 C 1400 714, 1480 750, 1550 810 C 1590 845, 1620 900, 1640 1000 Z';
const grassL = 'M-20 1000 L-20 900 C 120 870, 260 880, 420 920 C 520 945, 600 975, 660 1000 Z';
let moss = '', flowers = '';
for (let i = 0; i < 260; i++) {         // moss texture on the hill: small light and dark tufts
  const x = 760 + rnd() * 860, top = 712 + Math.pow(Math.abs(x - 1300) / 560, 2) * 260;
  if (top > 990) continue;
  const y = top + 8 + Math.pow(rnd(), 0.8) * (1000 - top);
  moss += `<ellipse cx="${x | 0}" cy="${y | 0}" rx="${(4 + rnd() * 9) | 0}" ry="${(3 + rnd() * 5) | 0}" fill="${rnd() < 0.6 ? '#9CC466' : '#2F5A22'}"/>`;
}
const flower = (x, y, r) => `<circle cx="${x | 0}" cy="${y | 0}" r="${r.toFixed(1)}" fill="#D8442F"/><circle cx="${x | 0}" cy="${y | 0}" r="${(r * 0.38).toFixed(1)}" fill="#7A1D14"/>`;
for (let i = 0; i < 26; i++) {
  const x = 820 + rnd() * 760, top = 720 + Math.pow(Math.abs(x - 1300) / 560, 2) * 260;
  flowers += flower(x, top + 20 + rnd() * (980 - top), 4 + rnd() * 5);
}
for (let i = 0; i < 9; i++) flowers += flower(rnd() * 560, 925 + rnd() * 70, 3 + rnd() * 4);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3EBF1"/><stop offset=".45" stop-color="#EEF2F2"/><stop offset=".7" stop-color="#F5F1E9"/><stop offset="1" stop-color="#F2EEE6"/></linearGradient>
<radialGradient id="sun" cx="1150" cy="330" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFDF6" stop-opacity=".95"/><stop offset="1" stop-color="#FFFDF6" stop-opacity="0"/></radialGradient>
<linearGradient id="far" x1="0" y1="380" x2="0" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#A9B9C8"/><stop offset="1" stop-color="#E4E9EC"/></linearGradient>
<linearGradient id="mid" x1="0" y1="470" x2="0" y2="800" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7F95A8"/><stop offset="1" stop-color="#DCE3E6"/></linearGradient>
<linearGradient id="near" x1="0" y1="720" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#6E8783"/><stop offset="1" stop-color="#A9B8AE"/></linearGradient>
<linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F6F5" stop-opacity="0"/><stop offset=".5" stop-color="#F4F6F5" stop-opacity=".85"/><stop offset="1" stop-color="#F4F6F5" stop-opacity="0"/></linearGradient>
<linearGradient id="hill" x1="0" y1="640" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7AA548"/><stop offset=".5" stop-color="#4C7A2E"/><stop offset="1" stop-color="#2E5220"/></linearGradient>
<linearGradient id="grass" x1="0" y1="870" x2="0" y2="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7FA05A"/><stop offset="1" stop-color="#4A6E33"/></linearGradient>
<clipPath id="hc"><path d="${hill}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#sun)"/>
<path d="${far}" fill="url(#far)"/>
<rect y="560" width="${W}" height="170" fill="url(#mist)"/>
<path d="${mid}" fill="url(#mid)" opacity=".9"/>
<rect y="680" width="${W}" height="160" fill="url(#mist)"/>
<path d="${near}" fill="url(#near)" opacity=".75"/>
<rect y="800" width="${W}" height="140" fill="url(#mist)" opacity=".7"/>
<path d="${grassL}" fill="url(#grass)"/>
<path d="${hill}" fill="url(#hill)"/>
<g opacity=".45" clip-path="url(#hc)">${moss}</g>
${flowers}
</svg>`;
fs.writeFileSync(path.join(__dirname, '..', 'images', 'app', 'landscape.svg'), svg);
console.log('images/app/landscape.svg', svg.length, 'bytes');
