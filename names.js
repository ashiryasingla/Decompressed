// ─── names.js ────────────────────────────────────────────────────────────────
// Deterministic and random anonymous name generation.

const ADJ = [
  'Quiet', 'Still', 'Soft', 'Calm', 'Gentle', 'Warm', 'Kind', 'Pale',
  'Deep', 'Light', 'Tender', 'Clear', 'Safe', 'Brave', 'Open', 'Shy',
  'Bold', 'Wild', 'Free', 'Slow', 'Bright', 'Misty',
];
const NNS = [
  'River', 'Birch', 'Stone', 'Cloud', 'Flame', 'Harbor', 'Ember', 'Rain',
  'Shore', 'Petal', 'Candle', 'Cedar', 'Meadow', 'Tide', 'Willow', 'Brook',
  'Fern', 'Moss', 'Leaf', 'Mist', 'Dawn', 'Pine',
];

/**
 * Deterministic name from a seed string (e.g. email).
 * Same email always produces the same name.
 */
export function randName(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const ai = Math.abs(h)      % ADJ.length;
  const ni = Math.abs(h >> 4) % NNS.length;
  return `${ADJ[ai]} ${NNS[ni]}`;
}

/** Fully random name (used for the signup preview). */
export function randNameRandom() {
  return `${ADJ[0 | Math.random() * ADJ.length]} ${NNS[0 | Math.random() * NNS.length]}`;
}