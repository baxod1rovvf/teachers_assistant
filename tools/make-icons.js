// Makes css/icons.css from Lucide icons (ISC licence, https://lucide.dev — the set the teacher picked in WeWeb, 2026-11-07).
// Usage: node tools/make-icons.js <folder with lucide-static's icons/*.svg>
// Each icon becomes `.lc-<name>` (a span drawn in the text colour through a CSS mask) and a `--ic-<name>` variable
// for ::before icons. Add a name to NAMES and run it again to get a new icon.
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const NAMES = 'house sparkles map library chart-column graduation-cap search settings refresh-cw layers arrow-left-right puzzle spell-check target car mic rocket route pen-line languages clapperboard headphones trees dices presentation clipboard-check backpack school book-open message-circle trash-2 repeat link download calendar award zap plus users external-link bot send x clock trophy file-text log-out user image pencil check chevron-left ellipsis triangle-alert'.split(' ');
let vars = '', cls = '';
for (const n of NAMES) {
  let s = fs.readFileSync(path.join(dir, n + '.svg'), 'utf8').replace(/<!--.*?-->/s, '').replace(/class="[^"]*"/, '').replace(/\s+/g, ' ').replace(/> </g, '><').trim();
  s = s.replace('stroke="currentColor"', 'stroke="black"');
  const uri = 'url("data:image/svg+xml,' + encodeURIComponent(s).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%22/g, "'") + '")';
  vars += '  --ic-' + n + ': ' + uri + ';\n';
  cls += '.lc-' + n + ' { --ic: var(--ic-' + n + '); }\n';
}
const out = '/* Lucide icons (ISC licence, lucide.dev) — made by tools/make-icons.js, do not edit by hand. */\n:root {\n' + vars + '}\n' +
  '.lc { display: inline-block; width: 1.15em; height: 1.15em; flex: 0 0 auto; vertical-align: -0.18em; background: currentColor;\n' +
  '  -webkit-mask: var(--ic) center / contain no-repeat; mask: var(--ic) center / contain no-repeat; }\n' + cls;
fs.writeFileSync(path.join(__dirname, '..', 'css', 'icons.css'), out);
console.log(NAMES.length + ' icons → css/icons.css (' + out.length + ' bytes)');
