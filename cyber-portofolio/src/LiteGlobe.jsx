import { useEffect, useRef } from 'react';
import { africa, lands } from './globe-geometry.js';
const radians = Math.PI / 180;
function project([lon, lat], angle) {
  const a = lon * radians + angle,
    b = lat * radians;
  return [150 + 102 * Math.cos(b) * Math.sin(a), 150 - 102 * Math.sin(b), Math.cos(b) * Math.cos(a)];
}
function path(points, angle, close = false) {
  let d = '',
    pen = false;
  for (const p of points) {
    const [x, y, z] = project(p, angle);
    if (z < 0) {
      pen = false;
      continue;
    }
    d += (pen ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2);
    pen = true;
  }
  return d + (close ? 'Z' : '');
}
function outline(land) {
  const points = [];
  land.forEach((a, i) => {
    const b = land[(i + 1) % land.length];
    for (let t = 0; t < 1; t += .2) points.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  });
  points.push(land[0]);
  return points;
}
const continents = lands.map(outline),
  grids = [];
for (let lon = -180; lon < 180; lon += 30) grids.push(Array.from({
  length: 61
}, (_, i) => [lon, -90 + i * 3]));
for (let lat = -60; lat <= 60; lat += 30) grids.push(Array.from({
  length: 121
}, (_, i) => [-180 + i * 3, lat]));
export default function LiteGlobe({
  paused
}) {
  const svg = useRef(null),
    land = useRef(null),
    grid = useRef(null),
    gold = useRef(null),
    orbit = useRef(null),
    elapsed = useRef(0);
  useEffect(() => {
    let raf = 0,
      last = 0,
      alive = true;
    const draw = () => {
      if (!alive || !land.current || !grid.current || !gold.current || !orbit.current) return;
      const angle = -.34 + elapsed.current * .11;
      land.current.setAttribute('d', continents.map(c => path(c, angle)).join(''));
      grid.current.setAttribute('d', grids.map(c => path(c, angle)).join(''));
      gold.current.setAttribute('d', path(africa, angle, true));
      orbit.current.setAttribute('transform', `rotate(${elapsed.current * 3} 150 150)`);
    };
    draw();
    if (!paused) {
      const frame = now => {
        if (!alive) return;
        raf = requestAnimationFrame(frame);
        if (document.hidden) {
          last = now;
          return;
        }
        if (now - last < 1000 / 12) return;
        const delta = last ? Math.min((now - last) / 1000, .2) : 0;
        last = now;
        elapsed.current += delta;
        draw();
      };
      raf = requestAnimationFrame(frame);
    }
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [paused]);
  return <svg ref={svg} className="globe-static globe-lite" viewBox="0 0 300 300" role="img" aria-label="Globe africain animé, rendu léger"><defs><radialGradient id="liteOcean" cx="35%" cy="30%"><stop stopColor="#164377" /><stop offset=".65" stopColor="#051c3b" /><stop offset="1" stopColor="#020b21" /></radialGradient></defs><circle cx="150" cy="150" r="102" fill="url(#liteOcean)" stroke="#1ccfff" strokeWidth="2" /><path ref={grid} d={grids.map(c => path(c, -.34)).join('')} fill="none" stroke="#168ac5" strokeWidth=".7" opacity=".65" /><path ref={land} d={continents.map(c => path(c, -.34)).join('')} fill="none" stroke="#4aa9d7" strokeWidth=".9" /><path ref={gold} d={path(africa, -.34, true)} fill="#ffad39" fillOpacity=".3" stroke="#ffc16c" strokeWidth="1.4" /><g ref={orbit} fill="none" stroke="#2ce8ff"><ellipse cx="150" cy="150" rx="137" ry="49" transform="rotate(-24 150 150)" /><ellipse cx="150" cy="150" rx="127" ry="52" transform="rotate(57 150 150)" opacity=".7" /></g></svg>;
}
