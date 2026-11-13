# Makes a Listening Journey recording with OmniVoice — the voice model inside VoiceStudio (github.com/debpalash/voicestudio) —
# for steps marked "engine": "omnivoice" in audio/skills/listening-journey-scripts.json (teacher, 2026-11-13: Step 9 with the
# "Energetic Male" voice). The other steps are made by tools/make-course-audio.py (Kokoro), which skips these.
# Model k2-fsa/OmniVoice from Hugging Face: code Apache-2.0, weights CC-BY-NC (non-commercial use — the teacher was told).
#
# "voices": { id: "male, young adult, high pitch" | { "instruct": …, "seed": n } } — each voice is designed once from its
# description (VoiceStudio's "Energetic" personality is "young adult, high pitch"; + "male" = Energetic Male), the reference
# clip is checked by ear, then every line clones that clip, so the voice stays the same from line to line. A voice id starting
# with "am_" is a man (the transcript tool reads that). Each line is checked by Whisper (ASR_DIR) and made again with another
# seed until heard right. The FIRST spelled word ("B. R. O. O. K. S.") is "That's." then every letter made on its own ("B.",
# checked by ear) ~1.3 s apart like the Kokoro recordings; the SECOND is said in one go, fast ("That's T, O, Y, B, O, X." —
# the teacher's choice after hearing both, 2026-11-13). A phone number is said digit by digit, slower.
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

# Every clip is kept (OMNIVOICE_CACHE, default: a folder next to the voicestudio checkout), so a rerun after a small change only
# makes the lines that changed — a whole recording takes this CPU ~30 minutes.
import hashlib
CACHE = os.environ.get('OMNIVOICE_CACHE', os.path.join(os.path.dirname(os.path.abspath(os.environ['OMNIVOICE_SRC'])), 'omnivoice-cache'))
os.makedirs(CACHE, exist_ok=True)
def gen(text, prompt=None, instruct=None, seed=0, speed=None, voice=''):
    key = hashlib.sha1(json.dumps([voice, text, instruct, seed, speed, REF_TEXT]).encode()).hexdigest()
    f = os.path.join(CACHE, key + '.npy')
    if os.path.exists(f): return np.load(f)
    kw = dict(text=text, language='English', seed=seed)
    if prompt is not None: kw['voice_clone_prompt'] = prompt
    if instruct: kw['instruct'] = instruct
    if speed: kw['speed'] = speed
    a = model.generate(**kw)[0].squeeze(0).float().numpy()
    np.save(f, a)
    return a

def pitch(a):
    """median voice pitch in Hz (a man ~85–180, a woman ~165–255): VoiceStudio's "high pitch" can make a man sound like a
    boy, so each designed voice's pitch is printed — pin a seed that sounds right (Step 9's Energetic Male: seed 4, ~167 Hz)"""
    out = []
    for i in range(0, len(a) - 2048, 1024):
        x = a[i:i + 2048] - a[i:i + 2048].mean()
        if np.sqrt((x ** 2).mean()) < 0.02: continue
        c = np.correlate(x, x, 'full')[2047:]
        lo, hi = int(SR / 400), int(SR / 70); k = lo + int(np.argmax(c[lo:hi]))
        if c[k] > 0.3 * c[0]: out.append(SR / k)
    return round(float(np.median(out))) if out else 0

def voice_prompt(vid, v):
    """design the voice once (checked by ear), then a clone prompt that every line uses"""
    instruct, seed = (v, None) if isinstance(v, str) else (v['instruct'], v.get('seed'))
    for s in ([seed] if seed is not None else range(1, 9)):
        ref = gen(REF_TEXT, instruct=instruct, seed=s, voice='design')
        h = heard(ref)
        if line_ok(REF_TEXT, h):
            print(f'   voice {vid} ({instruct}): seed {s} ✓, pitch {pitch(ref)} Hz', flush=True)
            sf.write(f'{out_dir}/tmp-voice-{vid}.wav', ref, SR)
            p = model.create_voice_clone_prompt(ref_audio=(torch.from_numpy(ref).unsqueeze(0), SR), ref_text=REF_TEXT)
            return (p, f'{instruct}|{s}')
        print(f'   voice {vid} seed {s}: heard {h!r}', flush=True)
    raise SystemExit(f'voice {vid}: no clear reference — try other seeds')

# How a recogniser writes a letter said on its own ("O" → "oh", "Y" → "why", "X" → "ex"…)
NAMES = {'A': 'a ay eh', 'B': 'b bee be', 'C': 'c see sea', 'D': 'd dee', 'E': 'e ee', 'F': 'f ef', 'G': 'g gee', 'H': 'h aitch',
         'I': 'i eye aye', 'J': 'j jay', 'K': 'k kay', 'L': 'l el', 'M': 'm em', 'N': 'n en', 'O': 'o oh', 'P': 'p pee pea',
         'Q': 'q queue cue', 'R': 'r are ar our', 'S': 's ess es', 'T': 't tee tea', 'U': 'u you', 'V': 'v vee', 'W': 'w double',
         'X': 'x ex', 'Y': 'y why', 'Z': 'z zee zed'}
def trim(a):
    """the sound without the silence around it"""
    seg = AudioSegment((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes(), frame_rate=SR, sample_width=2, channels=1)
    # gentle: a soft first sound (the "k" of K) must stay — cut tighter, K was heard as "hey"
    parts = detect_nonsilent(seg, min_silence_len=60, silence_thresh=seg.dBFS - 30)
    if not parts: return a
    return a[max(0, int((parts[0][0] - 90) * SR / 1000)):int((parts[-1][1] + 70) * SR / 1000)]

def one_letter(L, prompt):
    """one letter said on its own ("B."), checked by ear; "double O" is said as one clip"""
    p, voice = prompt
    double = L.startswith('double ')
    text = ('Double ' + L[-1] if double else L) + '.'
    first = None
    for s in range(1, 9):
        a = trim(gen(text, p, seed=s, voice=voice))
        if first is None: first = a
        toks = re.findall(r"[a-z]+", heard(a).lower())
        if double: toks = [t for t in toks if t != 'double']
        if toks and toks[0] in NAMES[L[-1]].split() and len(a) < 1.6 * SR: return a
    print('   ⚠️ letter', L, 'not heard clearly — check by ear', flush=True)
    return first

def spelled_fast(letters, prompt):
    """the second spelled word in a recording (teacher, 2026-11-13, after hearing Step 9: "Brooks should be spelled in fixed
    mode, then Toybox in fast mode"): the whole spelling in one go, "That's T, O, Y, B, O, X." — checked by ear"""
    p, voice = prompt
    want = ''.join(l[-1] * 2 if l.startswith('double') else l for l in letters)
    text = "That's " + ', '.join(letters) + '.'
    first = None
    for s in range(1, 13):
        a = gen(text, p, seed=s, speed=0.7, voice=voice)
        if first is None: first = a
        if letters_of(heard(a)) == want:
            print('   ✓ spelling', want, 'in one go (fast)', flush=True)
            return a
    print('   ⚠️ spelling', want, 'not heard exactly — check by ear', flush=True)
    return first

def spelled(letters, prompt):
    """the first spelled word, like the Kokoro recordings (teacher, 2026-11-04): "That's." on its own, a calm pause, then every letter in full on its
    own, ~1.3 s from one letter to the next — never run together"""
    out = [trim(line("That's.", prompt)), np.zeros(int(SR * 0.9), np.float32)]
    for k, L in enumerate(letters):
        clip = one_letter(L, prompt)
        out.append(clip)
        if k < len(letters) - 1: out.append(np.zeros(int(SR * max(0.45, 1.3 - len(clip) / SR)), np.float32))
    print('   ✓ spelling', ''.join(L[-1] * (2 if L.startswith('double') else 1) for L in letters), 'letter by letter', flush=True)
    return np.concatenate(out)

def line(text, prompt):
    phone = bool(PHONE.search(text))
    said = slow_phone(text) if phone else text
    first = None
    for s in range(1, 7):
        a = gen(said, prompt[0], seed=s, speed=0.8 if phone else None, voice=prompt[1])
        if first is None: first = a
        h = heard(a)
        if line_ok(text, h): return a
    print('   ⚠️ line', repr(text), '— heard', repr(h), flush=True)
    return first

for n, item in enumerate(spec, 1):
    if ONLY and str(n) not in ONLY: continue
    if item.get('engine') != 'omnivoice': continue
    prompts = {vid: voice_prompt(vid, v) for vid, v in item['voices'].items()}
    parts, n_spelled = [], 0
    for i, ln in enumerate(item['lines']):
        vid, text = ln[0], ln[1]
        pause = ln[2] if len(ln) > 2 else 0
        if SPELLING.match(text):
            # the first spelled word slowly, letter by letter; the second in one go (the teacher's choice, Step 9)
            parts.append((spelled if n_spelled == 0 else spelled_fast)(re.findall(r'(?:double )?[A-Z]', text), prompts[vid]))
            n_spelled += 1
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
