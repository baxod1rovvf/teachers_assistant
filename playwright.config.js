// Automatic tests (npm test). They open the app in a real browser with a
// stand-in database (tests/support/fake-firestore.js) — the real Firebase
// database is never touched — and made-up students (tests/support/data.js).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 1400, height: 950 },
    launchOptions: Object.assign(
      // a stand-in microphone that is always allowed (Pronunciation tests)
      { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
      // a browser that is already installed (e.g. PW_CHROMIUM=/opt/pw-browsers/chromium)
      process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    url: 'http://localhost:4173/index.html',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'ignore'
  }
});
