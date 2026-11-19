# Makes the Dictation Journey's audio with OmniVoice (github.com/k2-fsa/OmniVoice; weights CC-BY-NC — the teacher was told):
# one MP3 per sentence, audio/dictation/d<N>-s<k>.mp3, and the whole passage, audio/dictation/d<N>.mp3 (the sentences with a
# pause between them), for the teacher to play in class. Teacher, 2026-11-19: "create only the first dictation's audio, then if
# I like it, you'll create the others."
#
# The voice is the Listening Journey's "Energetic Male" (VoiceStudio's "male, young adult, high pitch", seed 4): designed once
# from a reference line, then every sentence clones it, so it sounds the same throughout. Every sentence is checked by Whisper
# (ASR_DIR = a sherpa-onnx whisper base.en folder) and made again with another seed until it is heard right.
# The sentences come from docs/dictation-journey.md, split by dictation_sentences() — keep it in step with
# tools/build-dictations.js (tests/dictation-content.spec.js compares the counts with the files).
#
# Setup (outside the project): python3 -m venv ov && ./ov/bin/pip install torch torchaudio numpy "transformers>=5.3" accelerate
#   pydub soundfile huggingface_hub hf_xet sherpa-onnx audioop-lts ; git clone https://github.com/k2-fsa/OmniVoice ;
#   ./ov/bin/pip install --no-deps -e OmniVoice
# Run: ASR_DIR=<whisper folder> ./ov/bin/python tools/make-dictation-audio.py docs/dictation-journey.md audio/dictation 1
#      (a list "1,2,5" or a range "1-20")
import os, sys, re, json, hashlib, difflib, subprocess, numpy as np, soundfile as sf, torch
from omnivoice.models.omnivoice import OmniVoice
from pydub import AudioSegment
from pydub.silence import detect_nonsilent

src, out_dir = sys.argv[1], sys.argv[2]
def wanted(arg):
    s = set()
    for part in arg.split(','):
        a, _, b = part.partition('-')
        s.update(range(int(a), int(b or a) + 1))
    return s
ONLY = wanted(sys.argv[3]) if len(sys.argv) > 3 else None

VOICE = {'instruct': 'male, young adult, high pitch', 'seed': 4}   # "Energetic Male" (Listening Steps 9–20)
SPEED = float(os.environ.get('DICTATION_SPEED', '0.9'))            # a little slower than the listening recordings
GAP_S = 1.2                                                        # silence between sentences in the whole passage
REF_TEXT = "Hello there! It's a lovely day today, and I'm really happy to help you with anything you need."

# ---- the passages and their sentences ----
ABBR = r'(?:Mr|Mrs|Ms|Dr|St|e\.g|i\.e|vs)'   # "6 p.m. Visitors" ends a sentence; "Mr Wilson" never does
def dictation_sentences(text):
    """sentences end at . ! ? (also before a closing quote) followed by a space and a capital or a quote — not after Mr/Mrs/Dr/a.m./p.m."""
    t = text.strip()
    out, start = [], 0
    for m in re.finditer(r'[.!?]["”’]?(?=\s+["“‘]?[A-Z0-9])', t):
        before = t[start:m.end()]
        if re.search(r'\b' + ABBR + r'\.$', before): continue
        out.append(before.strip()); start = m.end()
    if t[start:].strip(): out.append(t[start:].strip())
    return out
def passages(md):
    items = []
    for m in re.finditer(r'^## Dictation (\d+) — ([^\n]+)\n(.+?)(?=\n\n|\Z)', md, re.M | re.S):
        items.append({'no': int(m.group(1)), 'title': m.group(2).strip(), 'text': m.group(3).strip()})
    return items

if __name__ != '__main__': raise SystemExit
items = [i for i in passages(open(src, encoding='utf-8').read()) if not ONLY or i['no'] in ONLY]
if not items: raise SystemExit('no dictation found')
os.makedirs(out_dir, exist_ok=True)

model = OmniVoice.from_pretrained(os.environ.get('OMNIVOICE_MODEL', 'k2-fsa/OmniVoice'), device_map='cpu', dtype=torch.float32)
SR = model.sampling_rate

import sherpa_onnx
D = os.environ['ASR_DIR']
ASR = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=D + '/base.en-encoder.int8.onnx', decoder=D + '/base.en-decoder.int8.onnx',
                                                 tokens=D + '/base.en-tokens.txt', language='en', task='transcribe', num_threads=4)
def heard(audio, pad_s=1.0):
    pad = np.concatenate([np.zeros(int(SR * pad_s), np.float32), audio, np.zeros(int(SR * pad_s), np.float32)])
    x = np.interp(np.arange(0, len(pad), SR / 16000), np.arange(len(pad)), pad).astype(np.float32)
    st = ASR.create_stream(); st.accept_waveform(16000, x); ASR.decode_stream(st)
    return st.result.text
NUMS = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
NUMS.update({'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90})
def words(t):
    w = re.findall(r"[a-z0-9']+", t.lower().replace('’', "'").replace('-', ' '))
    # British and American spellings are the same word to the checker (Whisper writes "favorite color" for "favourite colour")
    w = [re.sub(r'(?<=[a-z])our$', 'or', re.sub(r'(?<=[a-z]{3})is(e|ed|ing)$', r'iz\1', x)) for x in w]
    return [str(NUMS[x]) if x in NUMS else x for x in w]
def line_ok(text, h): return difflib.SequenceMatcher(None, words(text), words(h)).ratio() >= 0.85

CACHE = os.environ.get('OMNIVOICE_CACHE', os.path.expanduser('~/omnivoice-cache'))
os.makedirs(CACHE, exist_ok=True)
def gen(text, prompt=None, instruct=None, seed=0, speed=None, voice=''):
    key = hashlib.sha1(json.dumps([voice, text, instruct, seed, speed, REF_TEXT]).encode()).hexdigest()
    f = os.path.join(CACHE, key + '.npy')
    if os.path.exists(f): return np.load(f)
    torch.manual_seed(seed); np.random.seed(seed)   # this OmniVoice takes no seed argument: the seed picks the take
    kw = dict(text=text, language='English')
    if prompt is not None: kw['voice_clone_prompt'] = prompt
    if instruct: kw['instruct'] = instruct
    if speed: kw['speed'] = speed
    a = model.generate(**kw)[0]
    a = a.squeeze().float().numpy() if torch.is_tensor(a) else np.asarray(a, dtype=np.float32).squeeze()   # VoiceStudio's copy gives a tensor, k2-fsa's an array
    np.save(f, a)
    return a
def trim(a):
    seg = AudioSegment((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes(), frame_rate=SR, sample_width=2, channels=1)
    parts = detect_nonsilent(seg, min_silence_len=80, silence_thresh=seg.dBFS - 30)
    if not parts: return a
    return a[max(0, int((parts[0][0] - 120) * SR / 1000)):int((parts[-1][1] + 150) * SR / 1000)]

ref = gen(REF_TEXT, instruct=VOICE['instruct'], seed=VOICE['seed'], voice='design')
print('voice reference heard:', heard(ref), flush=True)
PROMPT = model.create_voice_clone_prompt(ref_audio=(torch.from_numpy(ref).unsqueeze(0), SR), ref_text=REF_TEXT)
VKEY = VOICE['instruct'] + '|' + str(VOICE['seed'])

def sentence(text):
    first = None
    for s in range(1, 9):
        a = gen(text, PROMPT, seed=s, speed=SPEED, voice=VKEY)
        if first is None: first = a
        h = heard(a)
        if line_ok(text, h): return trim(a), True
    print('   ⚠️', repr(text), '— heard', repr(h), flush=True)
    return trim(first), False

def mp3(a, path):
    wav = path[:-4] + '.wav'
    sf.write(wav, np.clip(a, -1, 1), SR)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '22050', '-b:a', '64k', path], check=True)
    os.remove(wav)

for it in items:
    sents = dictation_sentences(it['text'])
    print(f"Dictation {it['no']} — {it['title']}: {len(sents)} sentences", flush=True)
    clips = []
    for k, s in enumerate(sents, 1):
        a, ok = sentence(s)
        mp3(a, f"{out_dir}/d{it['no']}-s{k}.mp3")
        clips.append(a)
        print(f"   {'✓' if ok else '⚠️'} s{k} ({len(a) / SR:.1f} s): {s}", flush=True)
    gap = np.zeros(int(SR * GAP_S), np.float32)
    whole = np.concatenate([x for c in clips for x in (c, gap)][:-1])
    mp3(whole, f"{out_dir}/d{it['no']}.mp3")
    print(f"   whole passage: {len(whole) / SR:.1f} s", flush=True)
