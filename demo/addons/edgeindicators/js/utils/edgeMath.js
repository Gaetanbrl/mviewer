export function projectToEdge(pixel, centerPx, size, margin) {
  const { x, y } = pixel; const { w, h } = size;
  const dx = x - centerPx[0]; const dy = y - centerPx[1];
  const tx = dx > 0 ? (w - margin - centerPx[0]) / dx : (margin - centerPx[0]) / dx;
  const ty = dy > 0 ? (h - margin - centerPx[1]) / dy : (margin - centerPx[1]) / dy;
  let t = Math.min(tx, ty); if (t < 0) t = Math.max(tx, ty);
  const ix = centerPx[0] + dx * t; const iy = centerPx[1] + dy * t;
  const cx = Math.min(Math.max(ix, margin), w - margin);
  const cy = Math.min(Math.max(iy, margin), h - margin);
  const side = cy <= margin ? 'top' : cy >= h - margin ? 'bottom' : cx <= margin ? 'left' : 'right';
  return { cx, cy, side };
}
export function bearingDeg(pixel, centerPx) {
  const dx = pixel.x - centerPx[0]; const dy = pixel.y - centerPx[1];
  return Math.atan2(dy, dx) * 180 / Math.PI;
}
export function formatDist(meters, unit) {
  if (unit === 'm') return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
