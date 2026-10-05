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

  // round 2 (the last): no connection while saving → "Try again", not counted yet
  await student.click('#hwcNextScreen .ta-btn');
  await student.evaluate(() => { window.__failWrites = 1000; });
  await answer();
  await expect(student.locator('#hwcRetryBtn')).toBeVisible({ timeout: 25000 });
  expect((await writes()).filter(x => x.startsWith('HWC_PROGRESS'))).toHaveLength(1);
  // connection back → saved straight away (the teacher sees the progress), then the send button
  await student.evaluate(() => { window.__failWrites = 0; });
  await student.click('#hwcRetryBtn');
  await expect(student.locator('#hwcSendBtn')).toBeVisible({ timeout: 10000 });
  w = await writes();
  expect(w.filter(x => x.startsWith('Sentences:r_'))).toHaveLength(2);
  expect(w.filter(x => x.startsWith('HWC_PROGRESS'))).toHaveLength(2);

  // "Send my answers": the check finds round 1's answers missing → sent again from this visit
  await student.evaluate(() => { const i = window.__fakeDocs.findIndex(d => d.type === 'Sentences' && d.code === HWC_ROUNDS[0].code); window.__fakeDocs.splice(i, 1); });
  await student.click('#hwcSendBtn');
  await expect(student.locator('#hwcSendAnim')).toBeVisible();
  await expect(student.locator('#hwcSavingTitle')).toContainText('Checking');
  await expect(student.locator('#hwcDone')).toHaveClass(/show/, { timeout: 15000 });
  await expect(student.locator('#hwcDone')).toContainText('All your answers have reached your teacher');
  expect((await writes()).filter(x => x.startsWith('Sentences:r_'))).toHaveLength(3);

  // checking with no connection → "Try again"
  await student.evaluate(() => { window.__failReads = 1; hwcSendNow(); });
  await expect(student.locator('#hwcRetryBtn')).toBeVisible({ timeout: 15000 });
  // answers from an earlier visit that never arrived (nothing here to send) → do that exercise again
  await student.evaluate(() => {
    delete hwcSaved[0];
    const i = window.__fakeDocs.findIndex(d => d.type === 'Sentences' && d.code === HWC_ROUNDS[0].code);
    window.__fakeDocs.splice(i, 1);
  });
  await student.click('#hwcRetryBtn');
  await expect(student.locator('#hwcRedoBtn')).toBeVisible({ timeout: 15000 });
  await expect(student.locator('#hwcSavingSub')).toContainText('Day one');
  await student.click('#hwcRedoBtn');
  await expect(student.locator('#hwcStageCount')).toHaveText('Exercise 1 of 2', { timeout: 8000 });
});

// Finishing leaves full screen. The full-screen guard used to treat that as cheating:
// it restarted the exercise and wiped the times, so Flashcard results said 0 seconds.
test('finishing an exercise in full screen keeps its time and its certificate (Flashcard, Sentences)', async ({ page, context }, info) => {
  await prepare(context);
  const fakeFullScreen = () => {
    window.__fs = false;
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => window.__fs ? document.documentElement : null });
    document.exitFullscreen = () => { window.__fs = false; document.dispatchEvent(new Event('fullscreenchange')); return Promise.resolve(); };
  };
  // Flashcard
  const fc = info.outputPath('flash.html');
  require('fs').writeFileSync(fc, template('FLASHCARD_TEMPLATE', { GROUPS_JSON: JSON.stringify([{ title: 'G1', words: [{ en: 'cat', uz: 'mushuk' }, { en: 'dog', uz: 'it' }] }]),
    QUIZ_DIRECTION: 'en2uz', QUIZ_MODE: 'choice', LOSE_PROGRESS: 'false', KEEP_PROGRESS_ON_BACK: 'false' }));
  await page.goto('file://' + fc);
  await page.evaluate(fakeFullScreen);
  const flash = await page.evaluate(async () => {
    studentName = 'Alice Test'; sessionActive = true; proctorArm();
    window.__fs = true; document.dispatchEvent(new Event('fullscreenchange'));   // in full screen
    groupTimes = [65000];                                                       // 65 s on the cards
    showCertificate();
    await new Promise(r => setTimeout(r, 800));
    return { secs: buildResultPayload().timeSeconds, cert: document.getElementById('slide-certificate').classList.contains('active') };
  });
  expect(flash).toEqual({ secs: 65, cert: true });
  // Sentences
  const sn = info.outputPath('sentences.html');
  require('fs').writeFileSync(sn, template('SENTENCES_TEMPLATE', { WORDS_JSON: '[]', SENTENCE_COUNT: '1', INSTRUCTIONS_JSON: '""', PICTURE_DATA: '' }));
  await page.goto('file://' + sn);
  await page.evaluate(fakeFullScreen);
  const sent = await page.evaluate(async () => {
    studentName = 'Alice Test'; sessionActive = true; proctorArm();
    window.__fs = true; document.dispatchEvent(new Event('fullscreenchange'));
    showCertificate();
    await new Promise(r => setTimeout(r, 800));
    return { warnings: violations, cert: document.getElementById('slide-certificate').classList.contains('active') };
  });
  expect(sent).toEqual({ warnings: 0, cert: true });
});

// A dictation inside a set: its page (with the mistakes) stays until "Next exercise".
test('Homework set: after a dictation, students stay on their mistakes until they press Next exercise', async ({ page, context }, info) => {
  test.setTimeout(60000);
  await prepare(context);
  await page.goto('/create.html');
  await page.waitForTimeout(1200);
  await hideNotices(page);
  const fillRound = async (title) => {
    await page.evaluate(() => selectHwcType('sentences'));
    await page.fill('#sn-title', title);
    await page.fill('#sn-instructions', 'Write about your day.');
    await page.evaluate(() => { const c = document.getElementById('sn-count'); c.value = '1'; c.dispatchEvent(new Event('input')); });
  };
  await page.evaluate(() => openHwcBuilder('homework'));
  await fillRound('One');
  await page.evaluate(() => hwcAddExercise());
  await fillRound('Two');
  const [download] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => hwcFinishAndCreate())]);
  const file = info.outputPath('set2.html');
  await download.saveAs(file);

  const student = await context.newPage();
  await student.goto('file://' + file);
  await student.fill('#hwcIdInput', '10001');
  await student.click('#hwcStart .ta-btn');
  await expect(student.locator('#hwcStageCount')).toHaveText('Exercise 1 of 2', { timeout: 8000 });
  // round 1 finishes as a dictation does: its answers, then "done"
  await student.evaluate(() => {
    window.postMessage({ taMergeEvent: 'round-result', id: 1, payload: { v: 1, type: 'Dictation', code: '123456', name: 'Alice Test', studentId: '10001', score: 80, date: new Date().toISOString() } }, '*');
    setTimeout(() => window.postMessage({ taMergeEvent: 'round-complete', identity: { name: 'Alice Test' } }, '*'), 100);
  });
  await expect(student.locator('#hwcReviewBar')).toBeVisible();
  await student.waitForTimeout(4000); // plenty of time: nothing moves on by itself
  await expect(student.locator('#hwcReviewBar')).toBeVisible();
  await expect(student.locator('#hwcNextScreen')).not.toHaveClass(/show/);
  expect(await student.evaluate(() => window.__writes.filter(w => w.type === 'Dictation').length)).toBe(1); // saved meanwhile
  // it sent no time of its own: the time the set measured is saved instead (never 00:00)
  expect(await student.evaluate(() => { const d = window.__fakeDocs.find(x => x.type === 'Dictation' && x.code === '123456'); return d.timeSeconds > 0 && d.timeFromSet === true; })).toBe(true);
  await student.click('#hwcReviewBtn');
  await expect(student.locator('#hwcStageCount')).toHaveText('Exercise 2 of 2', { timeout: 8000 });
  await expect(student.locator('#hwcReviewBar')).not.toBeVisible();
});

test('pressing Start checks only this student\'s points (not the whole points board) — the daily read limit', async ({ page, context }, info) => {
  // 400 points records on the board from other students and exercises (the real board had ~430)
  const docs = [];
  for (let i = 0; i < 400; i++) docs.push({ __id: 'pt' + i, v: 1, code: '654321', type: 'POINTS:Spelling', title: 'Old␟u' + i + '␟' + (20000 + i), name: 'S' + i, score: 10, date: new Date().toISOString(), submittedAt: new Date().toISOString() });
  docs.push({ __id: 'off1', v: 1, code: '654321', type: 'POINTS:DISABLE', title: 'Off␟999999', name: '', score: 0, date: new Date().toISOString() });
  await prepare(context, { docs });
  const file = info.outputPath('spelling.html');
  fs.writeFileSync(file, template('QUIZ_TEMPLATE', { TYPE_LABEL: 'Spelling', QUIZ_MODE: 'spelling', ITEM_COUNT: '1', HAS_MATCHING_ROUND: 'false', POINTS_AWARD: '10',
    ITEMS_JSON: JSON.stringify([{ word: 'apple', prompt: 'apple', options: ['apple', 'aple'], answer: 0 }]) }));
  await page.goto('file://' + file);
  await page.waitForFunction(() => typeof window.taCheckAward === 'function');
  const r = await page.evaluate(async () => {
    const before = window.__reads;
    const fresh = await taCheckAward(BOARD_CODE, EXERCISE_UID, '10001', EXERCISE_CODE);
    const used = window.__reads - before;
    // the award now carries the exercise and the student, so the next Start finds it
    taStudentId = '10001'; studentName = 'Alice Test';
    await taMaybeAwardPoints();
    const again = await taCheckAward(BOARD_CODE, EXERCISE_UID, '10001', EXERCISE_CODE);
    const other = await taCheckAward(BOARD_CODE, EXERCISE_UID, '10002', EXERCISE_CODE);
    const off = await taCheckAward(BOARD_CODE, EXERCISE_UID, '10002', '999999');
    return { fresh, used, again, other, off };
  });
  expect(r).toEqual({ fresh: 'none', used: 2, again: 'awarded', other: 'none', off: 'disabled' });
});
