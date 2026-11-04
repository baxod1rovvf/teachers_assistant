# Makes the skills course's listening recordings (audio/skills/*.mp3) with Kokoro — an open voice model (Apache-2.0).
# Setup (once, outside the project):
#   python3 -m venv venv && ./venv/bin/pip install kokoro-onnx soundfile
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx  (save as kokoro.onnx)
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin        (save as voices.bin)
# Check by ear (recommended): ./venv/bin/pip install sherpa-onnx, download and unpack
#   https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2
# and run with ASR_DIR=<that folder>: every line is checked by a speech recogniser and made again (other speed) until it is
# heard right; lines still not right are printed with ⚠️ (one-word lines garble — write full sentences).
# Run:  ./venv/bin/python tools/make-course-audio.py <folder with kokoro.onnx + voices.bin> audio/skills/elementary-scripts.json audio/skills
# Spelled names (a line like "E. double M. A.") are said as "That's E, double M, A." with the pauses between letters stretched.
# A scripts file: [{ "src": "audio/skills/….mp3", "lines": [[voice, text], …] }] — bf_* / bm_* are British voices; letters are
# written "K. A. M." so each is said on its own. American voices and accent (teacher, 2026-11-04: the British one dropped its
# 'r's — "four" sounded like "faw", "form" like "farm"): woman af_heart, man am_michael. Needs ffmpeg. Keep `transcript` in js/skills-data.js in step.
# Makes the course's listening audio with Kokoro (Apache-2.0): one voice per speaker, pauses between lines,
# the stress of -teen numbers on "-TEEN" (the lesson teaches thirTEEN vs THIRty).
import os, sys, re, json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model_dir, spec_file, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
ONLY = sys.argv[4].split(',') if len(sys.argv) > 4 else None     # e.g. "1" or "2,3": remake only these levels
def timed_model(folder):
    # Kokoro works out how long each sound lasts but the published file doesn't report it. Adding that number as an
    # output (once, saved next to the model; needs `pip install onnx`) tells us exactly where each spelled letter ends.
    out = folder + '/kokoro-timed.onnx'
    if not os.path.exists(out):
        import onnx
        m = onnx.load(folder + '/kokoro.onnx')
        m.graph.node.append(onnx.helper.make_node('Identity', ['/encoder/Clip_output_0'], ['duration']))
        m.graph.output.append(onnx.helper.make_empty_tensor_value_info('duration'))
        onnx.save(m, out)
    return out
k = Kokoro(timed_model(model_dir), model_dir + '/voices.bin')
assert k.has_timings, 'the model does not report timings'
spec = json.load(open(spec_file))
SPELLING = re.compile(r'^\s*(?:(?:double )?[A-Z]\.\s*)+$')            # "E. double M. A."
DIGIT = r"(?:double oh|double \w+|oh|zero|one|two|three|four|five|six|seven|eight|nine)"
PHONE = re.compile(DIGIT + r"(?:,? " + DIGIT + r"){5,}")
def slow_phone(text):
    """A phone number slowly, like a real exam recording (teacher, 2026-11-04): a short pause after every digit and a longer
    one after every group — "oh seven seven double oh, nine double oh, …" → "oh, seven, seven, double oh. nine, double oh. …"."""
    def fix(m):
        groups = [g.strip() for g in m.group(0).split(',')]
        return '. '.join(', '.join(re.findall(DIGIT, g)) for g in groups)
    return PHONE.sub(fix, text)
def say(text, voice, speed):
    phone = bool(PHONE.search(text))
    if phone: text = slow_phone(text)
    ph = k.tokenizer.phonemize(text, 'en-us')
    ph = re.sub(r'ˈ([^\sˈˌ,.!?]*?)tiːn', r'\1tˈiːn', ph)                # thirTEEN, fourTEEN…
    if phone: return k.create(ph, voice=voice, speed=speed, lang='en-us', is_phonemes=True, clause_pause=0.3, sentence_pause=0.8)
    return k.create(ph, voice=voice, speed=speed, lang='en-us', is_phonemes=True)
# Optional check by ear (a speech recogniser): set ASR_DIR to a sherpa-onnx Whisper folder (base.en). Each spelling is
# made in a few slightly different ways until the recogniser hears exactly the right letters.
ASR = None
if os.environ.get('ASR_DIR'):
    import sherpa_onnx
    D = os.environ['ASR_DIR']
    ASR = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=D + '/base.en-encoder.int8.onnx', decoder=D + '/base.en-decoder.int8.onnx',
                                                     tokens=D + '/base.en-tokens.txt', language='en', task='transcribe', num_threads=4)
def heard(audio, sr):
    x = np.interp(np.arange(0, len(audio), sr / 16000), np.arange(len(audio)), audio).astype(np.float32)
    st = ASR.create_stream(); st.accept_waveform(16000, x); ASR.decode_stream(st)
    return st.result.text
def letters_of(text):
    text = re.sub(r'\([^)]*\)', '', text)                         # the recogniser's own notes, e.g. "(buzzer)"
    t = re.sub(r"^\W*(so\W+)?(that'?s|it'?s|ok)\W*", '', text.strip(), flags=re.I).upper()
    t = re.sub(r'DOUBLE\W*([A-Z])', r'\1\1', t)
    return re.sub(r'[^A-Z]', '', t)
def spell_slow(letters, voice, speed, gap=0.7, first_gap=0.9):
    """Each letter is said as the last word of its own little sentence, "The letter T." — a letter inside a list is said in a
    quarter of a second and sounded cut off (teacher, 2026-11-04: "not spelled to the end … should be slow and relaxed"),
    while the last word of a sentence is said in full. ("That's S." ran the two s sounds together — S sounded like F.)
    The model's timings show where the letter starts; it is kept with its quiet ending (the hiss of S), and the letters
    are joined with a relaxed pause (~1.3 s from one letter to the next, like a real exam recording). "That's" comes first,
    then a calm pause before the first letter."""
    def clean(seg, sr, loud):
        idx = np.where(np.abs(seg) > loud)[0]
        seg = seg[max(0, idx[0] - int(sr * .015)):idx[-1] + int(sr * .12)].copy()
        f, g = int(sr * 0.012), int(sr * 0.03)
        seg[:f] *= np.linspace(0, 1, f); seg[-g:] *= np.linspace(1, 0, g)
        return seg
    # "That's." on its own: before a letter it was said quickly with a clipped s ("that's" not finished — teacher)
    a, sr = k.create("That's.", voice=voice, speed=speed, lang='en-us')
    out = [clean(a, sr, 0.0015 * np.abs(a).max()), np.zeros(int(sr * first_gap), dtype=a.dtype)]
    letters_from = sum(len(p) for p in out)
    for letter in letters:
        a, sr, t = k.create_timed('The letter ' + letter + '.', voice=voice, speed=speed, lang='en-us', clause_pause=0)
        c = int([x for x in t if x.phoneme == ' '][1].start * sr)
        out += [clean(a[c:], sr, 0.0015 * np.abs(a).max()), np.zeros(int(sr * gap), dtype=a.dtype)]
    return np.concatenate(out[:-1]), sr, letters_from
def best_spelling(letters, voice):
    want = ''.join(l[-1] * (2 if l.startswith('double') else 1) for l in letters)
    first = None
    for speed in [0.8, 0.75, 0.85, 0.7]:
        audio, sr, cut = spell_slow(letters, voice, speed)
        if first is None: first = (audio, sr)
        if not ASR: return audio, sr
        h = heard(audio[cut:], sr)                     # the letters alone (a recogniser adds words after a lone "That's")
        if letters_of(h) == want:
            print('   ✓ spelling', want, '←', repr(h))
            return audio, sr
    print('   ⚠️ spelling', want, 'not heard exactly — check by ear')
    return first

NUMS = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
NUMS.update({'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90})
ORD = {'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'fifth': 5, 'sixth': 6, 'seventh': 7, 'eighth': 8, 'ninth': 9, 'tenth': 10, 'eleventh': 11, 'twelfth': 12,
       'thirteenth': 13, 'fourteenth': 14, 'fifteenth': 15, 'sixteenth': 16, 'seventeenth': 17, 'eighteenth': 18, 'nineteenth': 19, 'twentieth': 20, 'thirtieth': 30}
def words(t):
    """lower-case words, numbers as digits ("forty-eight" → 48, "twenty-first" → 21, "oh nine" → 0 9), so a recogniser's digits match"""
    t = t.lower().replace('’', "'").replace('-', ' ')
    w = re.findall(r"[a-z0-9']+", t)
    out, i = [], 0
    while i < len(w):
        x = w[i]
        if x in NUMS and NUMS[x] >= 20 and i + 1 < len(w) and (w[i + 1] in NUMS and NUMS[w[i + 1]] < 10 or w[i + 1] in ORD and ORD[w[i + 1]] < 10):
            out.append(str(NUMS[x] + (NUMS.get(w[i + 1]) or ORD.get(w[i + 1])))); i += 2; continue
        if x in NUMS: out.append(str(NUMS[x]))
        elif x in ORD: out.append(str(ORD[x]))
        elif x == 'oh' and (i + 1 < len(w) and (w[i + 1] in NUMS or w[i + 1] == 'double') or i > 0 and w[i - 1] in NUMS): out.append('0')
        elif x == 'double' and i + 1 < len(w):                          # "double oh" → 0 0, "double five" → 5 5
            d = str(0 if w[i + 1] == 'oh' else NUMS.get(w[i + 1], w[i + 1])); out.append(d); out.append(d); i += 2; continue
        elif re.fullmatch(r'\d+(st|nd|rd|th)', x): out.append(re.sub(r'\D', '', x))
        elif re.fullmatch(r'\d+', x): out.extend(list(x) if len(x) >= 3 else [x])
        elif x == 'okay': out.append('ok')
        else: out.append(x[:-2] if x.endswith("'s") and len(x) > 3 else x)
        i += 1
    # phone numbers: digits one by one
    flat = []
    for x in out: flat.extend(list(x) if x.isdigit() and len(x) >= 3 else [x])
    return flat
import difflib
def line_ok(text, h):
    a, b = words(text), words(h)
    names = [n.lower() for n in re.findall(r"\b[A-Z][a-z]+\b", text) if n not in ('I', 'Hello', 'Hi', 'Good', 'Thank', 'Yes', 'No', 'OK', 'And', 'My', 'This', 'The', 'Our', 'Look', 'Number',
             'Listening', 'Dialogue', 'What', 'How', 'Is', 'Are', 'Can', 'Next', 'Sorry', 'Great', 'Perfect', 'Of', 'Oh', 'Bye', 'Welcome', 'That', 'So', 'Let', 'Excuse', 'Hurry',
             'Mine', 'They', 'She', 'He', 'Questions', 'Recording', 'Call', 'Bring', 'Twelve', 'It', 'In', 'On', 'At', 'We', 'Please', 'Thank', 'Now', 'Good', 'Then', 'Oliver', 'Mister', 'Mrs', 'Mr', 'Hey', 'There', 'Tell', 'Who', 'When', 'Where', 'Have', 'Has', 'You', 'Do', 'Write', 'Circle', 'Listen', 'Five', 'Two', 'True', 'Or', 'Ms')]
    names_ok = all(any(n == w or n + 's' == w or w.startswith(n) for w in b) for n in names)
    return difflib.SequenceMatcher(None, a, b).ratio() >= 0.8 and names_ok
def best_line(text, voice, speed):
    if not ASR: return say(text, voice, speed)
    first = None
    for sp in [speed, speed - 0.06, speed + 0.04, speed - 0.12]:
        audio, sr = say(text, voice, sp)
        if first is None: first = (audio, sr)
        pad = np.concatenate([np.zeros(int(sr * 0.3), dtype=audio.dtype), audio, np.zeros(int(sr * 0.3), dtype=audio.dtype)])
        h = heard(pad, sr)
        if line_ok(text, h): return audio, sr
    print('   ⚠️ line', repr(text), '— heard', repr(h))
    return first

for n, item in enumerate(spec, 1):
    if ONLY and str(n) not in ONLY: continue
    parts, sr = [], 24000
    for i, line in enumerate(item['lines']):
        voice, text = line[0], line[1]
        write_pause = line[2] if len(line) > 2 else 0          # seconds for students to write after an answer
        letters = re.findall(r'(?:double )?[A-Z]', text) if SPELLING.match(text) else None
        if letters:
            # Spelling (teacher, 2026-11-03: "it should be iy double em ey", and slow for beginners). A letter said on its own
            # comes out garbled, so the whole spelling is one sentence — "That's E, double M, A." — and then the short
            # letters are said in full, one by one, with a relaxed pause (spell_slow).
            audio, sr = best_spelling(letters, voice)
            parts.append(audio)
            parts.append(np.zeros(int(sr * max(1.2, write_pause)), dtype=audio.dtype))
            continue
        # numbers ("oh nine one, double five…") a little slower than the rest
        # Like a real exam recording (teacher's sample, 2026-11-04): normal speed, quick turns between speakers, and a
        # real pause after each answer so students can write. Phone numbers a little slower.
        speed = 0.75 if PHONE.search(text) else 0.95
        if text.rstrip().endswith('!'): speed += 0.05                 # excited lines a little livelier
        audio, sr = best_line(text, voice, speed)
        parts.append(audio)
        gap = 2.0 if i == 0 else max(0.25, write_pause)        # the next speaker answers at once (teacher: no waiting)
        if i + 1 < len(item['lines']) and SPELLING.match(item['lines'][i + 1][1]): gap = max(gap, 1.0)   # don't rush into a spelling
        parts.append(np.zeros(int(sr * gap), dtype=audio.dtype))
    wav = out_dir + '/tmp.wav'
    sf.write(wav, np.concatenate(parts), sr)
    out = out_dir + '/' + item['src'].split('/')[-1]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '64k', out], check=True)
    print(out, round(sum(len(p) for p in parts) / sr, 1), 's')
