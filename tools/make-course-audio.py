# Makes the Course's listening recordings (audio/course/*.mp3) with Kokoro — an open voice model (Apache-2.0).
# Setup (once, outside the project):
#   python3 -m venv venv && ./venv/bin/pip install kokoro-onnx soundfile
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx  (save as kokoro.onnx)
#   curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin        (save as voices.bin)
# Run:  ./venv/bin/python tools/make-course-audio.py <folder with kokoro.onnx + voices.bin> audio/course/b1l1-scripts.json audio/course
# A scripts file: [{ "src": "audio/course/….mp3", "lines": [[voice, text], …] }] — bf_* / bm_* are British voices; letters are
# written "K. A. M." so each is said on its own. Needs ffmpeg. Keep the "text" in course-data.js's `listen` in step.
# Makes the course's listening audio with Kokoro (Apache-2.0): one voice per speaker, pauses between lines,
# the stress of -teen numbers on "-TEEN" (the lesson teaches thirTEEN vs THIRty).
import sys, re, json, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model_dir, spec_file, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
k = Kokoro(model_dir + '/kokoro.onnx', model_dir + '/voices.bin')
spec = json.load(open(spec_file))
for item in spec:
    parts, sr = [], 24000
    for i, (voice, text) in enumerate(item['lines']):
        ph = k.tokenizer.phonemize(text, 'en-gb')
        ph = re.sub(r'ˈ([^\sˈˌ,.!?]*?)tiːn', r'\1tˈiːn', ph)          # thirTEEN, fourTEEN…
        audio, sr = k.create(ph, voice=voice, speed=0.88, lang='en-gb', is_phonemes=True)
        parts.append(audio)
        gap = 1.4 if i == 0 or voice == 'bf_emma' else 0.7                  # a longer pause after the narrator
        parts.append(np.zeros(int(sr * gap), dtype=audio.dtype))
    wav = out_dir + '/tmp.wav'
    sf.write(wav, np.concatenate(parts), sr)
    out = out_dir + '/' + item['src'].split('/')[-1]
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '64k', out], check=True)
    print(out, round(sum(len(p) for p in parts) / sr, 1), 's')
