# Makes the Course's listening recordings (audio/course/*.mp3) with Kokoro — an open voice model (Apache-2.0).
# Setup (once, outside the project):
#   python3 -m venv venv && ./venv/bin/pip install kokoro-onnx soundfile
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx  (save as kokoro.onnx)
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin        (save as voices.bin)
# Check by ear (recommended): ./venv/bin/pip install sherpa-onnx, download and unpack
#   https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2
# and run with ASR_DIR=<that folder>: every line is checked by a speech recogniser and made again (other speed) until it is
# heard right; lines still not right are printed with ⚠️ (one-word lines garble — write full sentences).
# Run:  ./venv/bin/python tools/make-course-audio.py <folder with kokoro.onnx + voices.bin> audio/course/b1l1-scripts.json audio/course
# Spelled names (a line like "E. double M. A.") are said as "That's E, double M, A." with the pauses between letters stretched.
# A scripts file: [{ "src": "audio/course/….mp3", "lines": [[voice, text], …] }] — bf_* / bm_* are British voices; letters are
# written "K. A. M." so each is said on its own. Needs ffmpeg. Keep the "text" in course-data.js's `listen` in step.
# Makes the course's listening audio with Kokoro (Apache-2.0): one voice per speaker, pauses between lines,
# the stress of -teen numbers on "-TEEN" (the lesson teaches thirTEEN vs THIRty).
import os, sys, re, json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model_dir, spec_file, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
k = Kokoro(model_dir + '/kokoro.onnx', model_dir + '/voices.bin')
spec = json.load(open(spec_file))
SPELLING = re.compile(r'^\s*(?:(?:double )?[A-Z]\.\s*)+$')            # "E. double M. A."
def say(text, voice, speed):
    ph = k.tokenizer.phonemize(text, 'en-gb')
    ph = re.sub(r'ˈ([^\sˈˌ,.!?]*?)tiːn', r'\1tˈiːn', ph)                # thirTEEN, fourTEEN…
    return k.create(ph, voice=voice, speed=speed, lang='en-gb', is_phonemes=True)
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
    t = re.sub(r"^\W*(so\W+)?(that'?s|it'?s|ok)\W*", '', text.strip(), flags=re.I).upper()
    t = re.sub(r'DOUBLE\W*([A-Z])', r'\1\1', t)
    return re.sub(r'[^A-Z]', '', t)
def best_spelling(letters, voice):
    want = ''.join(l[-1] * (2 if l.startswith('double') else 1) for l in letters)
    tries = [("That's " + ', '.join(letters) + '.', 0.75), ("That's, " + ', '.join(letters) + '.', 0.75), ("That's " + ', '.join(letters) + '.', 0.7),
             ("That's, " + ', '.join(letters) + '.', 0.8), ("OK. " + ', '.join(letters) + '.', 0.75), ("That's " + ', '.join(letters) + '.', 0.85)]
    first = None
    for text, speed in tries:
        audio, sr = say(text, voice, speed)
        if first is None: first = (audio, sr)
        if not ASR: return audio, sr
        h = heard(audio, sr)
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
        elif x == 'double' and i + 1 < len(w): out.append(str(NUMS.get(w[i + 1], w[i + 1]))); out.append(str(NUMS.get(w[i + 1], w[i + 1]))); i += 2; continue
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
    for sp in [speed, speed - 0.06, speed + 0.06, speed - 0.12]:
        audio, sr = say(text, voice, sp)
        if first is None: first = (audio, sr)
        pad = np.concatenate([np.zeros(int(sr * 0.3), dtype=audio.dtype), audio, np.zeros(int(sr * 0.3), dtype=audio.dtype)])
        h = heard(pad, sr)
        if line_ok(text, h): return audio, sr
    print('   ⚠️ line', repr(text), '— heard', repr(h))
    return first

def stretch_pauses(x, sr, target):
    """Make every quiet gap inside the speech (between words / letters) about `target` seconds long."""
    frame = int(sr * 0.01)
    n = len(x) // frame
    rms = np.array([np.sqrt(np.mean(x[i * frame:(i + 1) * frame] ** 2)) for i in range(n)])
    quiet = rms < max(0.004, 0.03 * rms.max())
    out, i, last = [], 0, 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if i > 0 and j < n and (j - i) >= 4:          # an inner gap of 40 ms or more
                mid = (i + j) // 2 * frame
                out.append(x[last:mid]); out.append(np.zeros(max(0, int(sr * target) - (j - i) * frame), dtype=x.dtype)); last = mid
            i = j
        else:
            i += 1
    out.append(x[last:])
    return np.concatenate(out)

for item in spec:
    parts, sr = [], 24000
    for i, (voice, text) in enumerate(item['lines']):
        letters = re.findall(r'(?:double )?[A-Z]', text) if SPELLING.match(text) else None
        if letters:
            # Spelling (teacher, 2026-11-03: "it should be iy double em ey", and slow for beginners). A letter said on its own
            # comes out garbled, so the whole spelling is one sentence — "That's E, double M, A." — and then the short
            # pauses between the letters are stretched to ~0.9 s, so students have time to write.
            audio, sr = best_spelling(letters, voice)
            parts.append(stretch_pauses(audio, sr, 0.9))
            parts.append(np.zeros(int(sr * 1.2), dtype=audio.dtype))
            continue
        # numbers ("oh nine one, double five…") a little slower than the rest
        speed = 0.76 if re.search(r'\b(oh|double)\b', text) else 0.85
        audio, sr = best_line(text, voice, speed)
        parts.append(audio)
        gap = 1.4 if i == 0 or voice == 'bf_emma' else 0.8                  # a longer pause after the narrator
        parts.append(np.zeros(int(sr * gap), dtype=audio.dtype))
    wav = out_dir + '/tmp.wav'
    sf.write(wav, np.concatenate(parts), sr)
    out = out_dir + '/' + item['src'].split('/')[-1]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '64k', out], check=True)
    print(out, round(sum(len(p) for p in parts) / sr, 1), 's')
