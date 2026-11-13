# Reads the teacher's Listening Journey files (docs/listening-journey-steps-*.md) and writes docs/listening-journey-transcripts.json:
# per step its title, format and the transcript paragraphs [{who, man, text}] (shown after "Analyze >").
import re, json, sys
voices = {x['src'].split('-')[-1].split('.')[0]: x for x in json.load(open('audio/skills/listening-journey-scripts.json'))}
# version 2 (2026-11-13, the teacher's rules for Steps 8–20) comes last: a step written there replaces the old one
out = {}
for f in ['docs/listening-journey-steps-1-7.md', 'docs/listening-journey-steps-8-20.md', 'docs/listening-journey-steps-8-20-v2.md']:
    md = open(f).read()
    for m in re.finditer(r'^# Step (\d+) --- (.+?)\n(.*?)(?=^# Step |^# Answer Key|^## Teacher|\Z)', md, re.S | re.M):
        n, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
        fm = re.search(r'\*\*(?:Audio format|Format):\*\*\s*(.+?)(?:\\|\s\\\||\n)', body)
        tr = body.split('## Audio transcript', 1)[1].split('## Questions', 1)[0]
        paras = [re.sub(r'\s+', ' ', p).strip().replace('\\', '') for p in tr.strip().split('\n\n') if p.strip()]
        lines, who = [], None
        sc = voices[str(n)]['lines']
        for p in paras:
            sp = re.match(r'\*\*([\w ]+?):\*\*\s*(.*)', p)
            if sp: who, text = sp.group(1), sp.group(2)
            else: text = p
            # the voice that says it (from the recording's script): a man's voice starts with "am_"
            v = next((l[0] for l in sc if l[1].startswith(text[:25]) or text.startswith(l[1][:25])), None)
            lines.append({'who': who or 'Speaker', 'man': bool(v and v.startswith('am_')), 'text': text})
        out[n] = {'no': n, 'title': title, 'format': fm.group(1).strip() if fm else '', 'transcript': lines}
out = [out[n] for n in sorted(out)]
json.dump(out, open('docs/listening-journey-transcripts.json', 'w'), ensure_ascii=False, indent=1)
for o in out: print(o['no'], o['title'], '|', o['format'], '|', len(o['transcript']), 'paragraphs', sum(1 for t in o['transcript'] if t['man']), 'by a man')
