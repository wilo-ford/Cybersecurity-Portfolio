import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Lazy-loaded, capped WebGL enhancement. The CSS crystal remains the fallback.
export default function CrystalWebGL({ open, paused, onUnavailable }) {
  const mount = useRef(null);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      onUnavailable?.();
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, .3, 8.6);
    const crystal = new THREE.Group();
    scene.add(crystal);
    const geometry = new THREE.OctahedronGeometry(1.65, 0);
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x9bdfff, transparent: true, opacity: .58, roughness: .13,
      metalness: .12, transmission: .15, clearcoat: 1, clearcoatRoughness: .1,
      flatShading: true, side: THREE.DoubleSide, depthWrite: false
    });
    const solid = new THREE.Mesh(geometry, glass);
    crystal.add(solid);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xd8f5ff, transparent: true, opacity: .85 })
    );
    crystal.add(edges);
    // Illuminated circuitry is attached to the rotating crystal.
    const traces = [];
    const circuitPoints = [
      [[0,1.2,.72],[0,.82,1.08],[.28,.82,1.08],[.28,.43,1.38]],
      [[-.62,.7,.72],[-.34,.5,1.18],[-.34,.1,1.42],[0,.1,1.58]],
      [[.75,.45,.45],[.52,.2,1.03],[.52,-.24,1.05],[.18,-.5,1.12]],
      [[-.65,-.2,.58],[-.45,-.5,.95],[-.12,-.5,1.1],[-.12,-.95,.7]],
      [[.12,1.05,.85],[.12,.62,1.27],[-.12,.62,1.27],[-.12,.35,1.44]]
    ];
    const traceMat = new THREE.LineBasicMaterial({ color: 0x1edfff, transparent: true, opacity: .95 });
    for (const path of circuitPoints) {
      const vectors = path.map(([x,y,z]) => new THREE.Vector3(x,y,z));
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vectors), traceMat);
      crystal.add(line);
      traces.push(line);
      const terminal = new THREE.Mesh(new THREE.SphereGeometry(.045,7,7),new THREE.MeshBasicMaterial({color:0x7ffcff}));
      terminal.position.copy(vectors[vectors.length-1]);
      crystal.add(terminal);
      traces.push(terminal);
    }
    const shards = [];
    const shardGeo = new THREE.TetrahedronGeometry(.46, 0);
    for (let i = 0; i < 8; i++) {
      const shard = new THREE.Mesh(shardGeo, glass.clone());
      shard.material.opacity = .55;
      shard.position.copy(new THREE.Vector3(Math.cos(i * Math.PI / 4) * .4, Math.sin(i * Math.PI / 4) * .4, 0));
      crystal.add(shard);
      shards.push(shard);
    }
    const nodes = new THREE.Group();
    scene.add(nodes);
    const points = [];
    for (let i = 0; i < 7; i++) {
      const a = i * Math.PI * 2 / 7;
      points.push(new THREE.Vector3(Math.cos(a) * 1.35, Math.sin(a) * 1.2, Math.sin(a * 2) * .6));
    }
    const dotGeo = new THREE.SphereGeometry(.065, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xc6f4ff });
    points.forEach(point => {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.copy(point);
      nodes.add(dot);
    });
    const segments = [];
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      segments.push(...points[i].toArray(), ...points[next].toArray());
      segments.push(...points[i].toArray(), 0, 0, 0);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x8bdfff, transparent: true, opacity: .7 }));
    nodes.add(lines);
    const ringGeo = new THREE.TorusGeometry(1.95, .012, 4, 96);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xa6e7ff, transparent: true, opacity: .75 }));
    ring.rotation.x = 1.18;
    ring.rotation.y = -.24;
    scene.add(ring);
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.02,.038,5,112),
      new THREE.MeshBasicMaterial({color:0x168bff,transparent:true,opacity:.42})
    );
    outerRing.rotation.copy(ring.rotation);
    scene.add(outerRing);
    const glints = new THREE.Group();
    scene.add(glints);
    for (let i=0;i<12;i++) {
      const a=i*Math.PI/6;
      const sparkle=new THREE.Mesh(new THREE.SphereGeometry(i%3===0?.038:.018,6,6),new THREE.MeshBasicMaterial({color:i%3===0?0xf4ffff:0x3baaff}));
      sparkle.position.set(Math.cos(a)*2.01,Math.sin(a)*.78,Math.sin(a)*.45);
      glints.add(sparkle);
    }
    scene.add(new THREE.AmbientLight(0xb2e3ff, 1.7));
    const key = new THREE.PointLight(0xc5f0ff, 25);
    key.position.set(-2, 3, 4);
    scene.add(key);
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.4));
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let frame = 0;
    let last = 0;
    let visible = true;
    let stopped = false;
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(host);
    let openness = open ? 1 : 0;
    const animate = (now) => {
      if (stopped) return;
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden || now - last < 1000 / 24) return;
      last = now;
      const target = host.dataset.open === 'true' ? 1 : 0;
      openness += (target - openness) * .075;
      const still = host.dataset.paused === 'true';
      if (!still) {
        crystal.rotation.y += .005;
        ring.rotation.z += .002;
        outerRing.rotation.z += .002;
        glints.rotation.z += .001;
        nodes.rotation.y += .002;
      }
      solid.scale.setScalar(1 - openness * .55);
      edges.scale.setScalar(1 - openness * .55);
      solid.material.opacity = .58 * (1 - openness * .85);
      edges.material.opacity = .85 * (1 - openness * .8);
      traces.forEach(trace => { trace.visible = openness < .9; trace.scale.setScalar(Math.max(.001, 1 - openness * .55)); });
      shards.forEach((shard, i) => {
        const a = i * Math.PI / 4;
        shard.position.set(Math.cos(a) * (0.3 + openness * 1.45), Math.sin(a) * (0.3 + openness * 1.35), Math.sin(a * 2) * openness * .6);
        shard.rotation.y = openness * (i + 1) * .35;
        shard.scale.setScalar(.001 + openness * .95);
      });
      nodes.scale.setScalar(.001 + openness * .999);
      nodes.visible = openness > .02;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      observer.disconnect();
      host.removeChild(renderer.domElement);
      scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) { const materials = Array.isArray(obj.material) ? obj.material : [obj.material]; materials.forEach(mat => mat.dispose()); } });
      renderer.dispose();
    };
  }, []);
  return <div ref={mount} className="v2-webgl" data-open={String(open)} data-paused={String(paused)} aria-hidden="true" />;
}
