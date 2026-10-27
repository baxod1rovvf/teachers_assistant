/* ================= ONE LOOK FOR EVERY STUDENT EXERCISE (2026-10-27) =================
   The teacher asked for every exercise students get to look alike, and to look good on
   phones: the start screen (ID / name), the exercise's own buttons and top bar, the
   finish card — and, in a Homework/Class set, its own screens ("Next exercise",
   "Sending your answers", the certificate). This style sheet is added to every exercise
   file when it's made (taApplyStudentTheme in common.js — files made before keep their
   old look). It only touches what all exercises share; each game's own picture (the Car
   Game's road, Can Knockdown's room, the 3D maze, the rocket in space) stays as it is. */
const TA_STUDENT_THEME_CSS = `
:root {
  --tas-brand: #4F46E5; --tas-brand-2: #7C3AED; --tas-ink: #14151F; --tas-soft: #5B5E73; --tas-faint: #8A8DA3;
  --tas-line: rgba(20,21,31,.10); --tas-field: #F1F2F8; --tas-card: #FFFFFF; --tas-ok: #0E9F6E; --tas-bad: #E11D48;
  --tas-radius: 24px; --tas-shadow: 0 26px 60px -26px rgba(30,27,75,.5), 0 2px 8px rgba(30,27,75,.06);
  /* a mesh of neighbouring hues (indigo → violet), top-left → bottom-right — no linear gradients (2026-10-27) */
  --tas-grad: radial-gradient(130% 130% at 0% 0%, #818CF8 0%, transparent 55%), radial-gradient(130% 130% at 100% 100%, #8B5CF6 0%, transparent 60%), #5B4BF5;
}
html { -webkit-text-size-adjust: 100%; }

/* ---------- the start screen: one card for every exercise ---------- */
.ta-login-card {
  background: var(--tas-card) !important; color: var(--tas-ink) !important;
  border: 1px solid var(--tas-line) !important; border-radius: 28px !important;
  box-shadow: var(--tas-shadow) !important; padding: 30px 26px 24px !important;
}
/* :is(#ta-theme, …) gives these rules an id's weight, above each template's own colours */
:is(#ta-theme, .ta-login-stage) .ta-login-form .eyebrow { display: none !important; }   /* the type shows once, as the chip */
.ta-login-card h1, .ta-login-card h2, .ta-login-form h1, .ta-login-form h2, :is(#ta-theme, .ta-login-stage) .ta-login-form .headline {
  font-family: 'Space Grotesk', system-ui, sans-serif !important; font-weight: 800 !important; color: var(--tas-ink) !important;
  font-size: clamp(1.45rem, 5.2vw, 2rem) !important; line-height: 1.18 !important; letter-spacing: -.01em; margin: 4px 0 6px !important;
}
.ta-login-type {
  background: rgba(79,70,229,.10) !important; color: var(--tas-brand) !important;
  border-radius: 999px !important; font-size: .74rem !important; letter-spacing: .08em !important; padding: 5px 12px !important;
}
.ta-login-form .ta-underline, .ta-login-card .ta-underline { width: 40px !important; height: 4px !important; border-radius: 4px !important; background: var(--tas-grad) !important; margin: 4px auto 14px !important; }
.ta-login-form p, .ta-login-card p { color: var(--tas-soft) !important; font-size: .95rem !important; line-height: 1.55 !important; }
.ta-login-form .results-hint, .ta-login-form .ta-footer { color: var(--tas-faint) !important; font-size: .78rem !important; }
:is(#ta-theme, body) #studentNameInput, :is(#ta-theme, body) #classCodeInput, .ta-login-form .ta-input-wrap {
  min-height: 54px !important; border-radius: 16px !important; background: var(--tas-field) !important;
  border: 1.5px solid var(--tas-line) !important; color: var(--tas-ink) !important;
  font-size: 1.04rem !important; font-weight: 700 !important; box-shadow: none !important; margin-bottom: 12px !important;
}
#studentNameInput, #classCodeInput { width: 100% !important; padding: 0 16px !important; text-align: center !important; font-family: inherit !important; }
.ta-login-form .ta-input-wrap { align-items: center; gap: 10px; padding: 0 16px !important; }   /* (no display here: a hidden class-code box must stay hidden) */
:is(#ta-theme, body) .ta-input-wrap #studentNameInput, :is(#ta-theme, body) .ta-input-wrap #classCodeInput {
  background: transparent !important; border: none !important; box-shadow: none !important; min-height: 50px !important; margin: 0 !important; padding: 0 !important; flex: 1; }
#studentNameInput:focus, #classCodeInput:focus, .ta-login-form .ta-input-wrap:focus-within {
  border-color: var(--tas-brand) !important; box-shadow: 0 0 0 4px rgba(79,70,229,.16) !important; outline: none !important;
}
:is(#ta-theme, .ta-login-card, .ta-login-stage) .ta-login-form :is(.btn-primary, .action-btn, .rd-start-btn, .start-btn, button[onclick*="taGate"], button[onclick*="start" i]:not(.btn-ghost):not(.ghost)) {
  width: 100% !important; min-height: 56px !important; border: none !important; border-radius: 18px !important;
  background: var(--tas-grad) !important; color: #fff !important; font-weight: 800 !important; font-size: 1.05rem !important;
  box-shadow: 0 14px 30px -12px rgba(79,70,229,.65) !important; cursor: pointer; letter-spacing: .01em;
  display: inline-flex !important; align-items: center; justify-content: center; gap: 8px;
}
.ta-login-form .btn-ghost { border-radius: 14px !important; }
/* the animation above the form: smaller on phones, the name and button come first */
@media (max-width: 560px) {
  .ta-login-card { padding: 22px 18px 18px !important; border-radius: 24px !important; width: min(560px, 94vw) !important; }
  .ta-login-stage.ta-login-narrow .ta-login-anim { width: 104px !important; font-size: 2.4rem !important; }
  .ta-login-form p { font-size: .9rem !important; }
}

/* ---------- inside the exercise: the same buttons and top bar everywhere ---------- */
.mode-toggle, .theme-toggle-btn, #soundToggle.icon-btn, #themeToggle.icon-btn {
  min-height: 38px !important; min-width: 38px; border-radius: 999px !important; padding: 0 12px !important;
  border: 1.5px solid var(--tas-line) !important; font-weight: 800 !important; font-size: .82rem !important;
  box-shadow: 0 4px 12px -6px rgba(30,27,75,.3) !important;
}
.btn-primary:not(.ta-login-form .btn-primary) { border-radius: 16px !important; font-weight: 800 !important; }
/* the student's name tag: on a phone it covered the top bar — the start and finish cards show the name */
@media (max-width: 640px) { #taStudentBadge { display: none !important; } }

/* ---------- the finish card: one look for every exercise ---------- */
.certificate-card, .certificate-box, #endOverlay .panel-card, .ta-cert-box, .modal-card:not(.ta-login-card) {
  background: var(--tas-card) !important; color: var(--tas-ink) !important; border: 1px solid var(--tas-line) !important;
  border-radius: 28px !important; box-shadow: var(--tas-shadow) !important;
}
.certificate-box, .ta-cert-box { border: 1px solid var(--tas-line) !important; }
.cert-title, .certificate-box h1, #endOverlay .panel-card h1, .ta-cert-box h1, .modal-card h1, .modal-card h2 {
  font-family: 'Space Grotesk', system-ui, sans-serif !important; font-weight: 800 !important; color: var(--tas-ink) !important;
}
.student-name-cert, #certStudentName, #hwcCertName { color: var(--tas-brand) !important; font-family: 'Space Grotesk', system-ui, sans-serif !important; }
.cert-row, #endOverlay .row { border-radius: 12px !important; }
.results-actions button, #endOverlay .btn-ghost, .certificate-card .btn-ghost {
  border-radius: 14px !important; font-weight: 800 !important; min-height: 46px;
}
.results-hint { color: var(--tas-soft) !important; }
@media (max-width: 560px) {
  .certificate-card, .certificate-box, #endOverlay .panel-card, .ta-cert-box { width: min(94vw, 460px) !important; padding: 22px 18px !important; }
}

/* ---------- a Homework / Class set: its own screens in the same look ---------- */
.ta-screen { background: radial-gradient(900px 520px at 0% 0%, #E0E7FF 0%, transparent 60%), radial-gradient(800px 480px at 100% 100%, #F3E8FF 0%, transparent 60%), #F3F4FA !important; color: var(--tas-ink) !important; }
.ta-screen h1 { color: var(--tas-ink) !important; font-family: 'Space Grotesk', system-ui, sans-serif !important; font-size: clamp(1.45rem, 5.2vw, 2rem) !important; }
.ta-screen h1 .ta-accent { color: var(--tas-brand) !important; }
.ta-screen p { color: var(--tas-soft) !important; }
.ta-screen .ta-underline { background: var(--tas-grad) !important; height: 4px !important; border-radius: 4px !important; }
.ta-screen .ta-card { border-radius: 28px !important; box-shadow: var(--tas-shadow) !important; border: 1px solid var(--tas-line) !important; }
.ta-btn { background: var(--tas-grad) !important; border-radius: 18px !important; min-height: 56px; box-shadow: 0 14px 30px -12px rgba(79,70,229,.65) !important; }
#hwcNextScreen, #hwcSaving { gap: 12px !important; }
#hwcNextScreen > svg { width: 64px; height: 64px; padding: 14px; border-radius: 20px; background: #fff; box-shadow: var(--tas-shadow); }
#hwcNextScreen .ta-btn, #hwcSaving .ta-btn { width: min(92vw, 380px); }
#hwcBar { background: #FFFFFF !important; color: var(--tas-ink) !important; border-bottom: 1px solid var(--tas-line); }
#hwcStageCount { color: var(--tas-brand); }
#hwcReviewBar { background: rgba(255,255,255,.97) !important; color: var(--tas-ink) !important; border-top: 1px solid var(--tas-line); box-shadow: 0 -12px 30px -14px rgba(30,27,75,.35) !important; }
.hwc-sent-note { color: var(--tas-ok) !important; }
`;
