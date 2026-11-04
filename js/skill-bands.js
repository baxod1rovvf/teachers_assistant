// Skills course: how marks turn into IELTS-style bands (shared by the student page and Loom).
// - Listening and Reading: the score is scaled to 40 (round(correct / total x 40)), then the IELTS table below.
// - Writing estimate: 3 + 3 x (words / minimum, at most 1) + 3 x (1 - mistakes per 100 words / 10, at least 0),
//   rounded to the nearest half band, kept between 1 and 9. If the grammar check didn't run, the last part is 1.5.
//   The teacher's own mark replaces this estimate.
// - Overall: the average of the skills present, rounded like IELTS (x.25 goes up to x.5, x.75 to the next whole band).
// - CEFR from Overall: 8.5-9 C2 / 7-8 C1 / 5.5-6.5 B2 / 4-5 B1 / 3-3.5 A2 / below that A1.

// [lowest score out of 40, band] from the top down.
var SK_BAND_TABLE = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5],
  [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [1, 2]];

function skBand(correct, total) {
  if (!total || total <= 0 || !(correct > 0)) return 0;
  var n = Math.round(Math.min(correct, total) / total * 40);
  for (var i = 0; i < SK_BAND_TABLE.length; i++) if (n >= SK_BAND_TABLE[i][0]) return SK_BAND_TABLE[i][1];
  return 0;
}

function skWritingBand(words, minWords, mistakes, checked) {
  var lengthPart = minWords > 0 ? Math.min(1, words / minWords) : 1;
  var grammarPart = 1.5;
  if (checked) {
    var per100 = words > 0 ? (mistakes / words) * 100 : 0;
    grammarPart = 3 * Math.max(0, 1 - per100 / 10);
  }
  var band = Math.round((3 + 3 * lengthPart + grammarPart) * 2) / 2;
  return Math.max(1, Math.min(9, band));
}

function skOverall(bands) {
  var have = (bands || []).filter(function (b) { return typeof b === 'number' && !isNaN(b); });
  if (!have.length) return null;
  var mean = have.reduce(function (s, b) { return s + b; }, 0) / have.length;
  return Math.floor(mean * 2 + 0.5) / 2;
}

function skCefr(band) {
  if (band >= 8.5) return 'C2';
  if (band >= 7) return 'C1';
  if (band >= 5.5) return 'B2';
  if (band >= 4) return 'B1';
  if (band >= 3) return 'A2';
  return 'A1';
}

function skBandColour(band) {
  if (band >= 6.5) return 'good';
  if (band >= 5.5) return 'mid';
  return 'low';
}
