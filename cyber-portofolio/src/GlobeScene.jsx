import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { africa, lands } from './globe-geometry.js';
function point(lon, lat, r = 1) {
  const a = THREE.MathUtils.degToRad(lon),
    b = THREE.MathUtils.degToRad(lat);
  return new THREE.Vector3(r * Math.cos(b) * Math.sin(a), r * Math.sin(b), r * Math.cos(b) * Math.cos(a));
}
function inside(x, y, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i],
      b = poly[j];
    if (a[1] > y !== b[1] > y && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
export default function GlobeScene({
  paused,
  onUnavailable
}) {
  const host = useRef(null),
    pauseRef = useRef(paused);
  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const el = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch {
      onUnavailable();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(37, 1, .1, 30);
    camera.position.set(0, 0, 4.7);
    const earth = new THREE.Group();
    scene.add(earth);
    earth.rotation.y = -.34;
    earth.rotation.z = .1;
    scene.add(new THREE.AmbientLight('#4974d9', 2));
    const lamp = new THREE.DirectionalLight('#6eb6ff', 1.2);
    lamp.position.set(-2, 3, 4);
    scene.add(lamp);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(.99, 48, 32), new THREE.MeshPhongMaterial({
      color: '#04152c',
      shininess: 35,
      specular: '#0b3c5b',
      transparent: true,
      opacity: .9
    }));
    earth.add(sphere);
    const lineMat = new THREE.LineBasicMaterial({
        color: '#126ba4',
        transparent: true,
        opacity: .6
      }),
      outlineMat = new THREE.LineBasicMaterial({
        color: '#4aa9d7',
        transparent: true,
        opacity: .65
      }),
      orange = new THREE.LineBasicMaterial({
        color: '#ffc16c'
      });
    const line = (points, mat, parent = earth) => {
      const obj = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat);
      parent.add(obj);
      return obj;
    };
    for (let lat = -60; lat <= 60; lat += 20) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 3) pts.push(point(lon, lat, 1.003));
      line(pts, lineMat);
    }
    for (let lon = -180; lon < 180; lon += 20) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(point(lon, lat, 1.003));
      line(pts, lineMat);
    }
    lands.forEach((land, i) => {
      const pts = [];
      for (let j = 0; j < land.length; j++) {
        const a = land[j],
          b = land[(j + 1) % land.length];
        for (let k = 0; k < 5; k++) pts.push(point(a[0] + (b[0] - a[0]) * k / 5, a[1] + (b[1] - a[1]) * k / 5, 1.012));
      }
      pts.push(pts[0]);
      line(pts, i === 0 ? orange : outlineMat);
    });
    const africaFaces = [];
    for (let lat = -36; lat < 38; lat += 2) for (let lon = -18; lon < 52; lon += 2) {
      if (inside(lon + 1, lat + 1, africa)) {
        const a = point(lon, lat, 1.008),
          b = point(lon + 2, lat, 1.008),
          c = point(lon + 2, lat + 2, 1.008),
          d = point(lon, lat + 2, 1.008);
        africaFaces.push(...a.toArray(), ...b.toArray(), ...c.toArray(), ...a.toArray(), ...c.toArray(), ...d.toArray());
      }
    }
    const africaGeo = new THREE.BufferGeometry();
    africaGeo.setAttribute('position', new THREE.Float32BufferAttribute(africaFaces, 3));
    earth.add(new THREE.Mesh(africaGeo, new THREE.MeshBasicMaterial({
      color: '#ff9a24',
      transparent: true,
      opacity: .28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })));
    const goldPoints = [],
      bluePoints = [];
    for (let lat = -56; lat < 75; lat += 2.0) for (let lon = -178; lon < 178; lon += 2.0) {
      let index = lands.findIndex(l => inside(lon, lat, l));
      if (index >= 0) (index === 0 ? goldPoints : bluePoints).push(...point(lon, lat, 1.015).toArray());
    }
    for (const [vertices, color, size] of [[goldPoints, '#ffae36', .018], [bluePoints, '#2975b9', .012]]) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      earth.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: .95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })));
    }
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.04, 40, 28), new THREE.ShaderMaterial({
      vertexShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',
      fragmentShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){float a=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.0);gl_FragColor=vec4(0.0,0.65,1.0,a*0.7);}',
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide
    }));
    scene.add(atmosphere);
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const orbitMat = new THREE.LineBasicMaterial({
      color: '#1bcfff',
      transparent: true,
      opacity: .8
    });
    for (let i = 0; i < 3; i++) {
      const pts = [];
      for (let t = 0; t <= 128; t++) {
        const a = t / 128 * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * 1.3, Math.sin(a) * .46, 0));
      }
      const o = line(pts, orbitMat, orbitGroup);
      o.rotation.set(.45 + i * .63, .15 + i * .7, -.4 + i * .7);
    }
    const stars = [];
    for (let i = 0; i < 70; i++) {
      const lon = i * 137.508,
        lat = Math.asin(2 * (i + .5) / 70 - 1) * 180 / Math.PI;
      stars.push(...point(lon, lat, 1.025).toArray());
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    earth.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: '#a2e9ff',
      size: .022,
      transparent: true,
      blending: THREE.AdditiveBlending
    })));
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let last = 0,
      raf = 0,
      target = 0;
    const move = e => {
      const r = el.getBoundingClientRect();
      target = (e.clientX - r.left - r.width / 2) / r.width * .3;
    };
    const leave = () => target = 0;
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    const lost = e => {
      e.preventDefault();
      onUnavailable();
    };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (document.hidden || pauseRef.current) {
        last = now;
        return;
      }
      if (now - last < 1000 / 24) return;
      const dt = Math.min((now - last) / 1000, .08);
      last = now;
      if (!document.hidden && !pauseRef.current) {
        earth.rotation.y += dt * .11;
        orbitGroup.rotation.y += dt * .16;
        scene.rotation.y += (target - scene.rotation.y) * .04;
      }
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      const geometries = new Set(),
        materials = new Set();
      scene.traverse(o => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) materials.add(o.material);
      });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="globe-webgl" ref={host} role="img" aria-label="Globe terrestre 3D interactif avec l’Afrique illuminée en orange" />;
}
