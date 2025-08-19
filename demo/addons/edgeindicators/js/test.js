export const addParisTestPoints = (source) => {
  const paris3857 = ol.proj.fromLonLat([2.3522, 48.8566]);
  const [px, py] = paris3857;

  const offsets = [
    [  5000,   5000],
    [ -5000,   5000],
    [  5000,  -5000],
    [ -5000,  -5000],
    [ 10000,      0],
    [ -10000,     0],
    [     0,  10000],
    [     0, -10000]
  ];

  offsets.forEach((off, i) => {
    const feat = new ol.Feature({
      name: `Test ${i+1}`,
      geometry: new ol.geom.Point([px + off[0], py + off[1]])
    });
    source.addFeature(feat);
  });
};