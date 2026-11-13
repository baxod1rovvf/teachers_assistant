# Makes a Listening Journey recording with OmniVoice — the voice model inside VoiceStudio (github.com/debpalash/voicestudio) —
# for steps marked "engine": "omnivoice" in audio/skills/listening-journey-scripts.json (teacher, 2026-11-13: Step 9 with the
# "Energetic Male" voice). The other steps are made by tools/make-course-audio.py (Kokoro), which skips these.
# Model k2-fsa/OmniVoice from Hugging Face: code Apache-2.0, weights CC-BY-NC (non-commercial use — the teacher was told).
#
# "voices": { id: "male, young adult, high pitch" | { "instruct": …, "seed": n } } — each voice is designed once from its
# description (VoiceStudio's "Energetic" personality is "young adult, high pitch"; + "male" = Energetic Male), the reference
# clip is checked by ear, then every line clones that clip, so the voice stays the same from line to line. A voice id starting
# with "am_" is a man (the transcript tool reads that). Each line is checked by Whisper (ASR_DIR) and made again with another
# seed until heard right; a spelled word ("B. R. O. O. K. S.") is said "That's B, R, O, O, K, S." slowly, the letters spaced
# ~1.3 s apart like the Kokoro recordings; a phone number is said digit by digit, slower.
#
# Setup (outside the project): python3 -m venv ov && ./ov/bin/pip install torch torchaudio "transformers>=5.10" accelerate
#   pydub numpy soundfile huggingface_hub hf_xet sherpa-onnx ; git clone https://github.com/debpalash/voicestudio
# Run: OMNIVOICE_SRC=<voicestudio folder> ASR_DIR=<sherpa-onnx-whisper-base.en folder> ./ov/bin/python \
#        tools/make-omnivoice-audio.py audio/skills/listening-journey-scripts.json audio/skills 9
import os, sys, re, json, subprocess, difflib, numpy as np, soundfile as sf, torch
sys.path.insert(0, os.environ['OMNIVOICE_SRC'])
from omnivoice.models.omnivoice import OmniVoice
from pydub import AudioSegment
from pydub.silence import detect_nonsilent

spec_file, out_dir = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3].split(',') if len(sys.argv) > 3 else None
spec = json.load(open(spec_file))
model = OmniVoice.from_pretrained(os.environ.get('OMNIVOICE_MODEL', 'k2-fsa/OmniVoice'), device_map='cpu', dtype=torch.float32)
SR = model.sampling_rate
REF_TEXT = "Hello there! It's a lovely day today, and I'm really happy to help you with anything you need."

# ---- the same text rules as tools/make-course-audio.py (keep in step) ----
SPELLING = re.compile(r'^\s*(?:(?:double )?[A-Z]\.\s*)+$')            # "E. double M. A."
DIGIT = r"(?:double oh|double \w+|oh|zero|one|two|three|four|five|six|seven|eight|nine)"
PHONE = re.compile(DIGIT + r"(?:,? " + DIGIT + r"){5,}", re.I)
def slow_phone(text):
    """a phone number digit by digit: a short pause after every digit, a longer one after every group"""
    def fix(m):
        groups = [g.strip() for g in m.group(0).split(',')]
        return '. '.join(', '.join(re.findall(DIGIT, g, re.I)) for g in groups)
    return PHONE.sub(fix, text)
NUMS = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
NUMS.update({'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90})
def words(t):
    """lower-case words, numbers as digits, phone numbers digit by digit — so a recogniser's digits match the script"""
    t = t.lower().replace('’', "'").replace('-', ' ')
    w = re.findall(r"[a-z0-9']+", t)
    out, i = [], 0
    while i < len(w):
        x = w[i]
        if x in NUMS and NUMS[x] >= 20 and i + 1 < len(w) and w[i + 1] in NUMS and NUMS[w[i + 1]] < 10:
            out.append(str(NUMS[x] + NUMS[w[i + 1]])); i += 2; continue
        if x in NUMS: out.append(str(NUMS[x]))
        elif x == 'oh' and (i + 1 < len(w) and w[i + 1] in NUMS or i > 0 and w[i - 1] in NUMS): out.append('0')
        elif re.fullmatch(r'\d+', x): out.extend(list(x) if len(x) >= 3 else [x])
        else: out.append(x[:-2] if x.endswith("'s") and len(x) > 3 else x)
        i += 1
    flat = []
    for x in out: flat.extend(list(x) if x.isdigit() and len(x) >= 3 else [x])
    return flat
def line_ok(text, h):
    return difflib.SequenceMatcher(None, words(text), words(h)).ratio() >= 0.8
def letters_of(text):
    text = re.sub(r'\([^)]*\)', '', text)
    t = re.sub(r"^\W*(so\W+)?(that'?s|it'?s|ok)\W*", '', text.strip(), flags=re.I).upper()
    t = re.sub(r'DOUBLE\W*([A-Z])', r'\1\1', t)
    return re.sub(r'[^A-Z]', '', t)

# ---- the listener (Whisper, sherpa-onnx) ----
import sherpa_onnx
D = os.environ['ASR_DIR']
ASR = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=D + '/base.en-encoder.int8.onnx', decoder=D + '/base.en-decoder.int8.onnx',
                                                 tokens=D + '/base.en-tokens.txt', language='en', task='transcribe', num_threads=4)
def heard(audio):
    pad = np.concatenate([np.zeros(int(SR * 0.3), np.float32), audio, np.zeros(int(SR * 0.3), np.float32)])
    x = np.interp(np.arange(0, len(pad), SR / 16000), np.arange(len(pad)), pad).astype(np.float32)
    st = ASR.create_stream(); st.accept_waveform(16000, x); ASR.decode_stream(st)
    return st.result.text

def gen(text, prompt=None, instruct=None, seed=0, speed=None):
    kw = dict(text=text, language='English', seed=seed)
    if prompt is not None: kw['voice_clone_prompt'] = prompt
    if instruct: kw['instruct'] = instruct
    if speed: kw['speed'] = speed
    return model.generate(**kw)[0].squeeze(0).float().numpy()

def voice_prompt(vid, v):
    """design the voice once (checked by ear), then a clone prompt that every line uses"""
    instruct, seed = (v, None) if isinstance(v, str) else (v['instruct'], v.get('seed'))
    for s in ([seed] if seed is not None else range(1, 9)):
        ref = gen(REF_TEXT, instruct=instruct, seed=s)
        h = heard(ref)
        if line_ok(REF_TEXT, h):
            print(f'   voice {vid} ({instruct}): seed {s} ✓', flush=True)
            sf.write(f'{out_dir}/tmp-voice-{vid}.wav', ref, SR)
            return model.create_voice_clone_prompt(ref_audio=(torch.from_numpy(ref).unsqueeze(0), SR), ref_text=REF_TEXT)
        print(f'   voice {vid} seed {s}: heard {h!r}', flush=True)
    raise SystemExit(f'voice {vid}: no clear reference — try other seeds')

def respace(audio, n_letters):
    """'That's' + each letter on its own, ~1.3 s from one letter to the next (like the Kokoro recordings)"""
    seg = AudioSegment((np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes(), frame_rate=SR, sample_width=2, channels=1)
    parts = detect_nonsilent(seg, min_silence_len=90, silence_thresh=seg.dBFS - 18)
    if len(parts) != n_letters + 1: return None
    out = []
    for k, (a, b) in enumerate(parts):
        chunk = audio[int(a * SR / 1000):int(b * SR / 1000)]
        out.append(chunk)
        if k < len(parts) - 1: out.append(np.zeros(int(SR * (0.9 if k == 0 else max(0.4, 1.3 - len(chunk) / SR))), np.float32))
    return np.concatenate(out)

def spelled(letters, prompt):
    want = ''.join(l[-1] * 2 if l.startswith('double') else l for l in letters)
    text = "That's " + ', '.join(letters) + '.'
    first = None
    for s in range(1, 13):
        a = gen(text, prompt, seed=s, speed=0.7)
        if first is None: first = a
        h = heard(a)
        if letters_of(h) == want:
            spaced = respace(a, len(letters))
            print('   ✓ spelling', want, '←', repr(h), '(spaced)' if spaced is not None else '', flush=True)
            return spaced if spaced is not None else a
    print('   ⚠️ spelling', want, 'not heard exactly — check by ear', flush=True)
    return first

def line(text, prompt):
    phone = bool(PHONE.search(text))
    said = slow_phone(text) if phone else text
    first = None
    for s in range(1, 7):
        a = gen(said, prompt, seed=s, speed=0.8 if phone else None)
        if first is None: first = a
        h = heard(a)
        if line_ok(text, h): return a
    print('   ⚠️ line', repr(text), '— heard', repr(h), flush=True)
    return first

for n, item in enumerate(spec, 1):
    if ONLY and str(n) not in ONLY: continue
    if item.get('engine') != 'omnivoice': continue
    prompts = {vid: voice_prompt(vid, v) for vid, v in item['voices'].items()}
    parts = []
    for i, ln in enumerate(item['lines']):
        vid, text = ln[0], ln[1]
        pause = ln[2] if len(ln) > 2 else 0
        if SPELLING.match(text):
            parts.append(spelled(re.findall(r'(?:double )?[A-Z]', text), prompts[vid]))
            parts.append(np.zeros(int(SR * max(1.2, pause)), np.float32))
            continue
        parts.append(line(text, prompts[vid]))
        gap = 2.0 if i == 0 else max(0.25, pause)
        if i + 1 < len(item['lines']) and SPELLING.match(item['lines'][i + 1][1]): gap = max(gap, 1.0)
        parts.append(np.zeros(int(SR * gap), np.float32))
        print(f'  {i + 1}/{len(item["lines"])}', flush=True)
    wav = out_dir + '/tmp-omnivoice.wav'
    sf.write(wav, np.concatenate(parts), SR)
    out = out_dir + '/' + item['src'].split('/')[-1]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '64k', out], check=True)
    for f in [wav] + [f'{out_dir}/tmp-voice-{v}.wav' for v in prompts]:
        if os.path.exists(f): os.remove(f)
    print(out, round(sum(len(p) for p in parts) / SR, 1), 's', flush=True)
