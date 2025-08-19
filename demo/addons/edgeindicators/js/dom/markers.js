export function createMarker({ left, top, side, angleDeg, label, distance, colors }) {
  const el = document.createElement('div');
  el.className = 'mv-edge';
  el.dataset.side = side;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  if (colors?.bg) el.style.background = colors.bg;
  if (colors?.text) el.style.color = colors.text;
  if (colors?.border) el.style.borderColor = colors.border;

  const arrow = document.createElement('div');
  arrow.className = 'mv-chevron';
  arrow.style.rotate = `${angleDeg}deg`;

  const name = document.createElement('span');
  name.textContent = label;

  const badge = document.createElement('span');
  badge.className = 'mv-badge';
  badge.textContent = distance;

  el.append(arrow, name, badge);
  return el;
}
