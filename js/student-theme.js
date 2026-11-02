/* ================= ONE LOOK FOR EVERY STUDENT EXERCISE (2026-10-27; the playful design since 2026-11-02) =================
   The teacher asked for every exercise students get to look alike, and to look good on
   phones: the start screen (ID / name), the exercise's own buttons and top bar, the
   finish card — and, in a Homework/Class set, its own screens ("Next exercise",
   "Sending your answers", the certificate). This style sheet is added to every exercise
   file when it's made (taApplyStudentTheme in common.js — files made before keep their
   old look). It only touches what all exercises share; each game's own picture (the Car
   Game's road, Can Knockdown's room, the 3D maze, the rocket in space) stays as it is. */
const TA_STUDENT_THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700&display=swap');
:root {
  /* the app's playful design (2026-11-02): candy colours, "sticker" cards with a thick dark outline and a hard
     shadow they sink into when pressed, Fredoka headings */
  --tas-brand: #7B4DFF; --tas-brand-2: #FF5FB0; --tas-ink: #2B2140; --tas-soft: #5A4E72; --tas-faint: #7C6F95;
  --tas-line: #2B2140; --tas-field: #FFF7E8; --tas-card: #FFFFFF; --tas-ok: #12A979; --tas-bad: #E5484D;
  --tas-yellow: #FFD23F; --tas-pink: #FF7AC6; --tas-blue: #4D9BFF; --tas-green: #2ED3A0;
  --tas-radius: 24px; --tas-shadow: 0 7px 0 #2B2140, 0 22px 44px -18px rgba(43,33,64,.45);
  --tas-grad: linear-gradient(135deg, #FF5FB0 0%, #8B5CFF 55%, #4D7BFF 100%);
  --tas-font: 'Fredoka', 'Nunito', system-ui, sans-serif;
}
html { -webkit-text-size-adjust: 100%; }

/* ---------- the start screen: one card for every exercise ---------- */
.ta-login-card {
  background: var(--tas-card) !important; color: var(--tas-ink) !important;
  border: 3px solid var(--tas-line) !important; border-radius: 28px !important;
  box-shadow: var(--tas-shadow) !important; padding: 30px 26px 24px !important;
}
/* :is(#ta-theme, …) gives these rules an id's weight, above each template's own colours */
:is(#ta-theme, .ta-login-stage) .ta-login-form .eyebrow { display: none !important; }   /* the type shows once, as the chip */
.ta-login-card h1, .ta-login-card h2, .ta-login-form h1, .ta-login-form h2, :is(#ta-theme, .ta-login-stage) .ta-login-form .headline {
  font-family: var(--tas-font) !important; font-weight: 700 !important; color: var(--tas-ink) !important;
  font-size: clamp(1.45rem, 5.2vw, 2rem) !important; line-height: 1.18 !important; letter-spacing: -.01em; margin: 4px 0 6px !important;
}
.ta-login-type {
  background: var(--tas-yellow) !important; color: var(--tas-ink) !important; border: 2px solid var(--tas-line) !important;
  box-shadow: 0 3px 0 var(--tas-line) !important; transform: rotate(-2deg);
  border-radius: 999px !important; font-size: .76rem !important; font-weight: 700 !important; letter-spacing: .06em !important; padding: 5px 14px !important;
}
.ta-login-form .ta-underline, .ta-login-card .ta-underline { width: 64px !important; height: 6px !important; border-radius: 6px !important; background: linear-gradient(90deg, #FF6B6B, #FF9F43, #FFD23F, #2ED3A0, #4D9BFF, #A97BFF) !important; margin: 4px auto 14px !important; }
.ta-login-form p, .ta-login-card p { color: var(--tas-soft) !important; font-size: .95rem !important; line-height: 1.55 !important; }
.ta-login-form .results-hint, .ta-login-form .ta-footer { color: var(--tas-faint) !important; font-size: .78rem !important; }
:is(#ta-theme, body) #studentNameInput, :is(#ta-theme, body) #classCodeInput, .ta-login-form .ta-input-wrap {
  min-height: 54px !important; border-radius: 16px !important; background: var(--tas-field) !important;
  border: 2.5px solid var(--tas-line) !important; color: var(--tas-ink) !important;
  font-size: 1.06rem !important; font-weight: 700 !important; box-shadow: inset 0 3px 0 rgba(43,33,64,.08) !important; margin-bottom: 14px !important;
}
#studentNameInput, #classCodeInput { width: 100% !important; padding: 0 16px !important; text-align: center !important; font-family: inherit !important; }
.ta-login-form .ta-input-wrap { align-items: center; gap: 10px; padding: 0 16px !important; }   /* (no display here: a hidden class-code box must stay hidden) */
:is(#ta-theme, body) .ta-input-wrap #studentNameInput, :is(#ta-theme, body) .ta-input-wrap #classCodeInput {
  background: transparent !important; border: none !important; box-shadow: none !important; min-height: 50px !important; margin: 0 !important; padding: 0 !important; flex: 1; }
#studentNameInput:focus, #classCodeInput:focus, .ta-login-form .ta-input-wrap:focus-within {
  border-color: var(--tas-brand) !important; box-shadow: 0 0 0 5px rgba(123,77,255,.25) !important; outline: none !important;
}
:is(#ta-theme, .ta-login-card, .ta-login-stage) .ta-login-form :is(.btn-primary, .action-btn, .rd-start-btn, .start-btn, button[onclick*="taGate"], button[onclick*="start" i]:not(.btn-ghost):not(.ghost)) {
  width: 100% !important; min-height: 58px !important; border: 3px solid var(--tas-line) !important; border-radius: 18px !important;
  background: var(--tas-grad) !important; color: #fff !important; font-family: var(--tas-font) !important; font-weight: 700 !important; font-size: 1.15rem !important;
  box-shadow: 0 6px 0 var(--tas-line) !important; cursor: pointer; letter-spacing: .01em; text-shadow: 0 1px 0 rgba(0,0,0,.25);
  display: inline-flex !important; align-items: center; justify-content: center; gap: 8px;
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s cubic-bezier(.34,1.56,.64,1) !important;
}
:is(#ta-theme, .ta-login-card, .ta-login-stage) .ta-login-form :is(.btn-primary, .action-btn, .rd-start-btn, .start-btn, button[onclick*="taGate"], button[onclick*="start" i]:not(.btn-ghost):not(.ghost)):hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--tas-line) !important; }
:is(#ta-theme, .ta-login-card, .ta-login-stage) .ta-login-form :is(.btn-primary, .action-btn, .rd-start-btn, .start-btn, button[onclick*="taGate"], button[onclick*="start" i]:not(.btn-ghost):not(.ghost)):active { transform: translateY(5px); box-shadow: 0 1px 0 var(--tas-line) !important; }
.ta-login-card { animation: tasPopIn .5s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes tasPopIn { from { opacity: 0; transform: translateY(18px) scale(.94) rotate(-1.5deg); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .ta-login-card { animation: none; } }
.ta-login-form .btn-ghost { border-radius: 14px !important; border: 2.5px solid var(--tas-line) !important; box-shadow: 0 3px 0 var(--tas-line) !important; font-weight: 700 !important; }
/* the other exercises' name boxes (Dictation, English Content, IELTS) and Flashcard-style dividers */
:is(#ta-theme, body) .ta-login-form :is(#dcNameInput, #ecNameInput, #ilNameInput, #irNameInput, #iwNameInput) {
  width: 100% !important; min-height: 54px !important; border-radius: 16px !important; background: var(--tas-field) !important;
  border: 2.5px solid var(--tas-line) !important; color: var(--tas-ink) !important; font-size: 1.06rem !important; font-weight: 700 !important;
  text-align: center !important; box-shadow: inset 0 3px 0 rgba(43,33,64,.08) !important; font-family: inherit !important;
}
:is(#ta-theme, body) .ta-login-form :is(#dcNameInput, #ecNameInput, #ilNameInput, #irNameInput, #iwNameInput)::placeholder { color: var(--tas-faint) !important; }
:is(#ta-theme, body) .ta-login-form :is(#dcNameInput, #ecNameInput, #ilNameInput, #irNameInput, #iwNameInput):focus { border-color: var(--tas-brand) !important; box-shadow: 0 0 0 5px rgba(123,77,255,.25) !important; outline: none !important; }
:is(#ta-theme, .ta-login-stage) .ta-login-form .divider-dash { width: 64px !important; height: 6px !important; border-radius: 6px !important; border: none !important;
  background: linear-gradient(90deg, #FF6B6B, #FF9F43, #FFD23F, #2ED3A0, #4D9BFF, #A97BFF) !important; }
/* exercises whose start screen is the first slide of their card (Flashcard, Sentences, Spelling, Test…): that card is the sticker */
.deck-container:has(#slide-welcome.active) {
  background: var(--tas-card) !important; border: 3px solid var(--tas-line) !important; border-radius: 28px !important;
  box-shadow: var(--tas-shadow) !important; animation: tasPopIn .5s cubic-bezier(.34,1.56,.64,1) both;
}
/* the animation above the form: smaller on phones, the name and button come first */
@media (max-width: 560px) {
  .ta-login-card { padding: 22px 18px 18px !important; border-radius: 24px !important; width: min(560px, 94vw) !important; }
  .ta-login-stage.ta-login-narrow .ta-login-anim { width: 104px !important; font-size: 2.4rem !important; }
  .ta-login-form p { font-size: .9rem !important; }
}

/* ---------- inside the exercise: the same buttons and top bar everywhere ---------- */
.mode-toggle, .theme-toggle-btn, #soundToggle.icon-btn, #themeToggle.icon-btn {
  min-height: 38px !important; min-width: 38px; border-radius: 999px !important; padding: 0 12px !important;
  border: 2.5px solid var(--tas-line) !important; font-weight: 700 !important; font-size: .84rem !important;
  box-shadow: 0 3px 0 var(--tas-line) !important;
}
.btn-primary:not(.ta-login-form .btn-primary) { border-radius: 16px !important; font-weight: 700 !important; border: 2.5px solid var(--tas-line) !important; box-shadow: 0 4px 0 var(--tas-line) !important; }
.btn-primary:not(.ta-login-form .btn-primary):active { transform: translateY(3px); box-shadow: 0 1px 0 var(--tas-line) !important; }
/* the student's name tag: on a phone it covered the top bar — the start and finish cards show the name */
@media (max-width: 640px) { #taStudentBadge { display: none !important; } }

/* ---------- the finish card: one look for every exercise ---------- */
.certificate-card, .certificate-box, #endOverlay .panel-card, .ta-cert-box, .modal-card:not(.ta-login-card) {
  background: var(--tas-card) !important; color: var(--tas-ink) !important; border: 3px solid var(--tas-line) !important;
  border-radius: 28px !important; box-shadow: var(--tas-shadow) !important; animation: tasPopIn .5s cubic-bezier(.34,1.56,.64,1) both;
}
.certificate-box, .ta-cert-box { border: 3px solid var(--tas-line) !important; }
.cert-title, .certificate-box h1, #endOverlay .panel-card h1, .ta-cert-box h1, .modal-card h1, .modal-card h2 {
  font-family: var(--tas-font) !important; font-weight: 700 !important; color: var(--tas-ink) !important;
}
.student-name-cert, #certStudentName, #hwcCertName { color: var(--tas-ink) !important; font-family: var(--tas-font) !important;
  background: var(--tas-yellow); border: 2.5px solid var(--tas-line); border-radius: 14px; padding: 0 12px; box-shadow: 0 3px 0 var(--tas-line);
  display: inline-block; transform: rotate(-2deg); }
.cert-row, #endOverlay .row { border-radius: 12px !important; }
.results-actions button, #endOverlay .btn-ghost, .certificate-card .btn-ghost {
  border-radius: 14px !important; font-weight: 700 !important; min-height: 46px;
  border: 2.5px solid var(--tas-line) !important; box-shadow: 0 3px 0 var(--tas-line) !important;
}
.results-hint { color: var(--tas-soft) !important; }
@media (max-width: 560px) {
  .certificate-card, .certificate-box, #endOverlay .panel-card, .ta-cert-box { width: min(94vw, 460px) !important; padding: 22px 18px !important; }
}

/* ---------- a Homework / Class set: its own screens in the same look ---------- */
.ta-screen { background:
    radial-gradient(circle at 12% 18%, rgba(255,122,198,.35) 0 3px, transparent 4px) 0 0 / 140px 140px,
    radial-gradient(circle at 62% 42%, rgba(255,210,63,.45) 0 3px, transparent 4px) 0 0 / 170px 170px,
    radial-gradient(circle at 36% 78%, rgba(77,155,255,.35) 0 3px, transparent 4px) 0 0 / 120px 120px,
    #FFF5E1 !important; color: var(--tas-ink) !important; }
.ta-screen h1 { color: var(--tas-ink) !important; font-family: var(--tas-font) !important; font-size: clamp(1.45rem, 5.2vw, 2rem) !important; }
.ta-screen h1 .ta-accent { color: var(--tas-brand) !important; }
.ta-screen h1::after { content: ' 🎉'; }
.ta-screen p { color: var(--tas-soft) !important; }
.ta-screen .ta-underline { background: linear-gradient(90deg, #FF6B6B, #FF9F43, #FFD23F, #2ED3A0, #4D9BFF, #A97BFF) !important; height: 6px !important; border-radius: 6px !important; }
.ta-screen .ta-card { border-radius: 28px !important; box-shadow: var(--tas-shadow) !important; border: 3px solid var(--tas-line) !important; }
.ta-btn { background: var(--tas-grad) !important; border: 3px solid var(--tas-line) !important; border-radius: 18px !important; min-height: 56px; box-shadow: 0 6px 0 var(--tas-line) !important;
  font-family: var(--tas-font) !important; font-weight: 700 !important; text-shadow: 0 1px 0 rgba(0,0,0,.25); transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s cubic-bezier(.34,1.56,.64,1) !important; }
.ta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--tas-line) !important; }
.ta-btn:active { transform: translateY(5px); box-shadow: 0 1px 0 var(--tas-line) !important; }
#hwcNextScreen, #hwcSaving { gap: 12px !important; }
#hwcNextScreen > svg { width: 64px; height: 64px; padding: 14px; border-radius: 20px; background: var(--tas-yellow); border: 3px solid var(--tas-line); box-shadow: 0 5px 0 var(--tas-line); transform: rotate(-4deg); }
#hwcNextScreen .ta-btn, #hwcSaving .ta-btn { width: min(92vw, 380px); }
#hwcBar { background: #FFFFFF !important; color: var(--tas-ink) !important; border-bottom: 3px solid var(--tas-line); font-family: var(--tas-font); }
#hwcStageCount { color: var(--tas-brand); }
#hwcReviewBar { background: rgba(255,255,255,.97) !important; color: var(--tas-ink) !important; border-top: 3px solid var(--tas-line); box-shadow: none !important; }
.hwc-sent-note { color: var(--tas-ok) !important; }
`;
