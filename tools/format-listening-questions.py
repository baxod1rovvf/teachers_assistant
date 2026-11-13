# Writes docs/listening-journey-questions.json back in its hand-made layout (one question per line), so an edit made by a
# script changes only the lines it touched: python3 tools/format-listening-questions.py
import json
P = 'docs/listening-journey-questions.json'
Q = json.load(open(P))
out = []
for e in Q:
    head = json.dumps({k: v for k, v in e.items() if k != 'sections'}, ensure_ascii=False)[:-1] + ','
    secs = []
    for s in e['sections']:
        sh = json.dumps({k: v for k, v in s.items() if k != 'qs'}, ensure_ascii=False)[:-1] + ', "qs": [\n'
        secs.append('  ' + sh + ',\n'.join('   ' + json.dumps(q, ensure_ascii=False) for q in s['qs']) + ']}')
    out.append(head + '\n "sections": [\n' + ',\n'.join(secs) + ']}')
open(P, 'w').write('[\n' + ',\n'.join(out) + '\n]\n')
