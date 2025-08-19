/* global mviewer, ol */
import { createMarker } from './dom/markers.js';
import { projectToEdge, bearingDeg, formatDist } from './utils/edgeMath.js';
import { getCandidatePointFeatures } from './utils/vectorSources.js';

// ——— détecte l'id <application id="..."> ———
function detectApplicationId() {
  // essai 1: API mviewer
  if (mviewer?.getApp && typeof mviewer.getApp === 'function') {
    const app = mviewer.getApp();
    if (app?.id) return app.id;
  }
  // essai 2: propriétés usuelles
  if (mviewer?.app?.id) return mviewer.app.id;
  if (window?.app?.id) return window.app.id;
  // essai 3: meta HTML éventuelle
  const meta = document.querySelector('meta[name="application-id"]');
  if (meta?.content) return meta.content.trim();
  return null;
}

// ——— options par application ———
const raw = (mviewer.customComponents?.edgeindicators?.options) || {};
const appId = detectApplicationId();
const opts = (appId && raw[appId]) ? raw[appId] : raw; // fallback si pas de clé

const LAYER_ID = opts.layerId ?? null;
const LABEL_ATTR = opts.labelAttr ?? 'id';
const KEY_ATTR = opts.keyAttr ?? 'id';
const MAX = Number.isFinite(opts.maxMarkers) ? opts.maxMarkers : 12;
const MARGIN = Number.isFinite(opts.margin) ? opts.margin : 8;
const UNIT = opts.distanceUnit === 'm' ? 'm' : 'km';
const MIN_ZOOM = Number.isFinite(opts.minZoom) ? opts.minZoom : 15;
const DIST_MODE = (opts.distanceMode === 'within') ? 'within' : 'all';
const DIST_THRESH = Number.isFinite(opts.distanceThresholdMeters) ? opts.distanceThresholdMeters : 1000;
const DEFAULT_COLORS = Object.assign({ bg:'#131a22', text:'#e6eef7', border:'#4ea1ff' }, opts.defaultColors || {});

const map = mviewer.getMap();

// conteneur
function ensureContainer() {
  let el = document.getElementById('mv-edge-markers');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'mv-edge-markers';
  el.className = 'mv-edge-markers';
  map.getViewport().appendChild(el);
  return el;
}
const container = ensureContainer();

// couleurs par point: key -> {bg,text,border}
const perFeatureColors = new Map();

// helpers
function enabled() {
  const z = map.getView().getZoom();
  return Number.isFinite(z) && z >= MIN_ZOOM;
}
function featureKey(f) {
  return f.get(KEY_ATTR) ?? f.getId();
}
function featureLabel(f) {
  return f.get(LABEL_ATTR) ?? f.getId() ?? 'Point';
}
function getColorsFor(f) {
  const k = featureKey(f);
  return perFeatureColors.get(k) || DEFAULT_COLORS;
}

// rendu
function update() {
  if (!enabled()) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = '';

  const size = map.getSize(); if (!size) return;
  const [w, h] = size;
  const centerPx = [w / 2, h / 2];
  const center = map.getView().getCenter(); if (!center) return;
  const centerLL = ol.proj.toLonLat(center);

  const feats = getCandidatePointFeatures(map, LAYER_ID ? [LAYER_ID] : []);
  const ranked = feats.map((f) => {
    const c = f.getGeometry().getCoordinates();
    const d = ol.sphere.getDistance(centerLL, ol.proj.toLonLat(c));
    return { f, c, d };
  }).sort((a, b) => a.d - b.d);

  let count = 0;
  for (const it of ranked) {
    if (count >= MAX) break;
    if (DIST_MODE === 'within' && it.d > DIST_THRESH) continue;

    const px = map.getPixelFromCoordinate(it.c); if (!px) continue;
    const [x, y] = px;
    if (x >= 0 && x <= w && y >= 0 && y <= h) continue;

    const { cx, cy, side } = projectToEdge({ x, y }, centerPx, { w, h }, MARGIN);
    const angle = bearingDeg({ x, y }, centerPx);
    const distLabel = formatDist(it.d, UNIT);
    const colors = getColorsFor(it.f);

    const el = createMarker({
      left: cx, top: cy, side,
      angleDeg: angle,
      label: featureLabel(it.f),
      distance: distLabel,
      colors
    });
    container.appendChild(el);
    count++;
  }
}

// événements
map.on('postrender', update);
// écoute la couche correspondant à LAYER_ID si précisé
if (LAYER_ID) {
  const cfg = mviewer.getLayer(LAYER_ID);
  if (cfg?.layer?.getSource) {
    const src = cfg.layer.getSource();
    src.on('change', update);
    src.on('addfeature', update);
    src.on('removefeature', update);
  }
} else {
  // sinon écoute toutes les couches vecteur
  map.getLayers().forEach((ly) => {
    const src = ly?.getSource?.();
    src?.on?.('change', update);
    src?.on?.('addfeature', update);
    src?.on?.('removefeature', update);
  });
}
update();

/* =========================
   API publique par application
   ========================= */
mviewer.customComponents = mviewer.customComponents || {};
mviewer.customComponents.edgeindicators = mviewer.customComponents.edgeindicators || {};
mviewer.customComponents.edgeindicators.api = {
  /**
   * Mise à jour couleur d’un point (fond et texte).
   * @param {string|number} key valeur KEY_ATTR ou feature id
   * @param {{bg?:string,text?:string,border?:string}} colors
   */
  setFeatureColorsById(key, colors) {
    if (!key) return;
    const cur = perFeatureColors.get(key) || {};
    perFeatureColors.set(key, Object.assign({}, cur, colors));
    update();
  },
  clearFeatureColors() {
    perFeatureColors.clear();
    update();
  }
};
