export function calcScore(p) {
  const L = p.stats.loves;
  const F = p.stats.favorites;
  const V = p.stats.views;

  const shared = new Date(p.history.shared);
  const now = new Date();
  const diff = (now - shared) / (1000 * 60 * 60 * 24);
  const D = Math.floor(diff);

  return ((L * 3) + (F * 2) + (V * 0.2)) / Math.sqrt(D + 1);
}
