// The exercises students open: every template's code is valid, and the
// builders that caused real problems work end to end.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { prepare, watchErrors, hideNotices, template, rawTemplate } = require('./support/app');

const TEMPLATES = fs.readFileSync(path.join(__dirname, '../js/exercise-templates.js'), 'utf8')
  .split('\n').filter(l => l.startsWith('const ')).map(l => l.slice(6, l.indexOf(' =')));

test('every exercise type\'s scripts are valid code', () => {
  expect(TEMPLATES.length).toBeGreaterThan(10);
  for (const name of TEMPLATES) {
    const html = rawTemplate(name);
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="(?:module|text\/plain)")[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    scripts.forEach((code, i) => {
      // placeholders the builder fills with data (lists, numbers…) → a stand-in value
      const filled = code.replace(/__[A-Z_]+__/g, '0');
      expect(() => new Function(filled), `${name}, script ${i}`).not.toThrow();
    });
  }
});

// A tiny picture (PNG) for the Sentences builder.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGElEQVR4nGP8z8DAwMDAxMDAwMDAwAAAHuAB/7c3E9cAAAAASUVORK5CYII=', 'base64');

test('Sentences: multi-line instructions, a title with quotes and a picture work — also inside a Homework set', async ({ page, context }, info) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => switchTo('sentences'));
  await page.fill('#sn-title', 'Review "Apex" \\ test');
  await page.fill('#sn-instructions', 'Write 10 sentences using:\n1. Find __ (Adj)\n2. Look (adj)');
  await page.setInputFiles('#sn-picture-input', { name: 'park.png', mimeType: 'image/png', buffer: PNG });
  await expect(page.locator('#sn-picture-preview')).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#panel-sentences .create-btn')]);
  const file = info.outputPath('sentences.html');
  await download.saveAs(file);
  expect(errors).toEqual([]);

  // opened the way a Homework/Class set opens it: the student's details are handed over
  const student = await context.newPage();
  const studentErrors = watchErrors(student);
  await student.addInitScript(() => {
    if (!window.__named) { window.__named = 1; window.name = 'ta_merge_identity:' + JSON.stringify({ id: '10001', name: 'Alice Test', code: '' }); }
  });
  await student.goto('file://' + file);
  await expect(student.locator('#slide-sentences')).toHaveClass(/active/, { timeout: 5000 });
  await expect(student.locator('#topInstruction')).toHaveText('Write 10 sentences using:\n1. Find __ (Adj)\n2. Look (adj)');
  await expect(student.locator('.sentence-title')).toHaveText('Review "Apex" \\ test');
  await expect(student.locator('#sentencePicture')).toBeVisible();
  expect(studentErrors.filter(e => !/module|import|Failed to fetch/i.test(e))).toEqual([]);
});

// Speech recognition as a phone's Chrome behaves: it can't use a microphone this page already holds.
const FAKE_SPEECH = `(() => {
  const mode = window.__recMode;
  if (mode === 'none') { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; return; }
  let live = 0;
  const gum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = c => gum(c).then(s => { live++; s.getTracks().forEach(t => { const st = t.stop.bind(t); t.stop = () => { if (t.readyState !== 'ended') live--; st(); }; }); return s; });
  class Rec { start() { setTimeout(() => {
      if (mode === 'android' && live > 0) { this.onerror && this.onerror({ error: 'audio-capture' }); this.onend && this.onend(); return; }
      this.onstart && this.onstart(); }, 30); }
    stop() { this.onend && this.onend(); } abort() {} }
  window.SpeechRecognition = window.webkitSpeechRecognition = Rec;
})();`;
const ANDROID = 'Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36';

test.describe('Pronunciation microphone', () => {
  for (const tpl of ['PRONUNCIATION_FLASH_TEMPLATE', 'PRONUNCIATION_GAME_TEMPLATE']) {
    for (const [mode, ua, expected] of [
      ['desktop', undefined, /Microphone is on/],
      ['android', ANDROID, /Microphone is on/],            // the phone bug fixed on 2026-09-30
      ['none', undefined, /can't listen to speech/]]) {
      test(`${tpl.replace('_TEMPLATE', '').toLowerCase()} on ${mode}`, async ({ browser }, info) => {
        const ctx = await browser.newContext(ua ? { userAgent: ua } : {});
        await ctx.grantPermissions(['microphone'], { origin: 'http://localhost:4173' });
        await ctx.addInitScript(m => { window.__recMode = m; }, mode);
        await ctx.addInitScript(FAKE_SPEECH);
        await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
        const dir = path.join(__dirname, '..', 'test-results', 'served');
        fs.mkdirSync(dir, { recursive: true });
        const name = `pr-${tpl}-${mode}-${info.workerIndex}.html`;
        fs.writeFileSync(path.join(dir, name), template(tpl));
        const p = await ctx.newPage();
        await p.goto('/test-results/served/' + name);
        await expect(p.locator('#micStatus')).toHaveText(expected, { timeout: 5000 });
        await ctx.close();
      });
    }
  }
  test('opened inside Telegram on a phone, it offers "Open in Chrome" with its link', async ({ browser }, info) => {
    const ctx = await browser.newContext({ userAgent: ANDROID.replace(')', '; wv)') + ' Telegram-Android/11.2' });
    const file = info.outputPath('pr.html');
    fs.writeFileSync(file, template('PRONUNCIATION_FLASH_TEMPLATE', { TA_APP_URL: 'https://example.github.io/ta/', EXERCISE_UID: 'xabc123' }));
    const p = await ctx.newPage();
    await p.goto('file://' + file);
    await expect(p.locator('#taOpenChrome')).toBeVisible({ timeout: 5000 });
    expect(await p.evaluate(() => TA_PLAY_URL)).toBe('https://example.github.io/ta/play.html?x=xabc123');
    await ctx.close();
  });
});

// A 3-second tone as a WAV file (stereo, 44.1 kHz): what a teacher might choose.
function wav(seconds = 3) {
  const rate = 44100, ch = 2, n = rate * seconds, bytes = n * ch * 2;
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0); b.writeUInt32LE(36 + bytes, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(ch, 22); b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * ch * 2, 28);
  b.writeUInt16LE(ch * 2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(bytes, 40);
  for (let i = 0; i < n; i++) { const v = Math.round(Math.sin(i * 2 * Math.PI * 440 / rate) * 12000); b.writeInt16LE(v, 44 + i * 4); b.writeInt16LE(v, 46 + i * 4); }
  return b;
}

test('Dictation: the chosen audio is made much smaller, and still as long', async ({ page, context }) => {
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  await page.evaluate(() => switchTo('dictation'));
  const audio = wav(3);
  await page.setInputFiles('#panel-dictation input[type=file][onchange*="dc"]', { name: 'lesson.wav', mimeType: 'audio/wav', buffer: audio });
  await page.waitForFunction(() => !!TA_MEDIA_B64.dc, null, { timeout: 60000 });
  const r = await page.evaluate(async () => {
    const small = Uint8Array.from(atob(TA_MEDIA_B64.dc), c => c.charCodeAt(0));
    const ctx = new AudioContext();
    const a = await ctx.decodeAudioData(small.buffer);
    return { bytes: small.length, seconds: a.duration, mime: TA_MEDIA_PACKED.dc && TA_MEDIA_PACKED.dc.mime };
  });
  expect(r.mime).toBe('audio/mpeg');
  expect(r.bytes).toBeLessThan(audio.length / 5);
  expect(r.seconds).toBeGreaterThan(2.9);
  expect(r.seconds).toBeLessThan(3.2);
  await expect(page.locator('#dc-media-name')).toContainText('made smaller');
  expect(errors).toEqual([]);
});

// A Homework/Class set counts an exercise as done only when the student's
// answers are saved (before: a failed upload still counted it, with no answers).
test('Homework set: an exercise counts as done only once its answers are saved', async ({ page, context }, info) => {
  test.setTimeout(90000);
  await prepare(context);
  const errors = watchErrors(page);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  const fillRound = async (title) => {
    await page.evaluate(() => selectHwcType('sentences'));
    await page.fill('#sn-title', title);
    await page.fill('#sn-instructions', 'Write about your day.');
    await page.evaluate(() => { const c = document.getElementById('sn-count'); c.value = '2'; c.dispatchEvent(new Event('input')); });
  };
  await page.evaluate(() => openHwcBuilder('homework'));
  await fillRound('Day one');
  await page.evaluate(() => hwcAddExercise());
  await fillRound('Day two');
  const [download] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => hwcFinishAndCreate())]);
  const file = info.outputPath('set.html');
  await download.saveAs(file);
  expect(errors).toEqual([]);

  const student = await context.newPage();
  await student.goto('file://' + file);
  await student.fill('#hwcIdInput', '10001');
  await student.click('#hwcStart .ta-btn');
  const round = student.frameLocator('#hwcFrame');
  const answer = async () => {
    await expect(round.locator('#slide-sentences')).toHaveClass(/active/, { timeout: 8000 });
    const boxes = round.locator('.sentence-space textarea');
    await expect(boxes).toHaveCount(2);
    await boxes.nth(0).fill('I woke up early.');
    await boxes.nth(1).fill('I went to school.');
    await round.locator('.sentence-submit-btn').click();
  };
  const writes = () => student.evaluate(() => window.__writes.map(w => w.type + ':' + w.id));

  // round 1: saved by the set itself, then marked done
  await answer();
  await expect(student.locator('#hwcNextScreen')).toHaveClass(/show/, { timeout: 8000 });
  let w = await writes();
  expect(w.filter(x => x.startsWith('Sentences:r_'))).toHaveLength(1);
  expect(w.filter(x => x.startsWith('HWC_PROGRESS'))).toHaveLength(1);
  // the round didn't send a copy of its own (no doubles in Results)
  const roundWrites = await student.frames().find(f => f !== student.mainFrame()).evaluate(() => (window.__writes || []).map(x => x.type));
  expect(roundWrites.filter(t => t === 'Sentences')).toHaveLength(0);

  // round 2: no connection → not done, "Try again"
  await student.click('#hwcNextScreen .ta-btn');
  await student.evaluate(() => { window.__failWrites = 1000; });
  await answer();
  await expect(student.locator('#hwcSaving')).toHaveClass(/show/);
  await expect(student.locator('#hwcRetryBtn')).toBeVisible({ timeout: 20000 });
  await expect(student.locator('#hwcSavingTitle')).toContainText("haven't reached");
  w = await writes();
  expect(w.filter(x => x.startsWith('HWC_PROGRESS'))).toHaveLength(1);
  // connection back → saved, then the certificate
  await student.evaluate(() => { window.__failWrites = 0; });
  await student.click('#hwcRetryBtn');
  await expect(student.locator('#hwcDone')).toHaveClass(/show/, { timeout: 10000 });
  w = await writes();
  expect(w.filter(x => x.startsWith('Sentences:r_'))).toHaveLength(2);
  expect(w.filter(x => x.startsWith('HWC_PROGRESS'))).toHaveLength(2);
});
