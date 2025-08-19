/* global ol, mviewer */
export function getCandidatePointFeatures(map, layerIds) {
  const srcs = [];
  const pushIfVector = (ly) => {
    const s = ly?.getSource?.(); if (!s) return;
    const isVector = (s instanceof ol.source.Vector) || (s instanceof ol.source.Cluster);
    if (!isVector) return;
    srcs.push(s instanceof ol.source.Cluster ? s.getSource() : s);
  };

  if (Array.isArray(layerIds) && layerIds.length) {
    layerIds.forEach((id) => {
      const cfg = mviewer.getLayer(id);
      if (cfg?.layer) pushIfVector(cfg.layer);
    });
  } else {
    map.getLayers().forEach(pushIfVector);
  }

  const feats = [];
  srcs.forEach((s) => {
    (s.getFeatures?.() || []).forEach((f) => {
      const g = f.getGeometry?.();
      if (g?.getType?.() === 'Point') feats.push(f);
    });
  });
  return feats;
}
