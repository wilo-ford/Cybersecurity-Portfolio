import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Progressive enhancement: no WebGL download or work in the default mobile mode.
export default function CrystalWebGL({ open, paused, onUnavailable }) {
  const mount = useRef(null), controls = useRef({ open, paused }), wake = useRef(() => {});
  useEffect(() => { controls.current = { open, paused }; wake.current(); }, [open, paused]);
  useEffect(() => {
    const host = mount.current;
    let renderer;
    // Retain the last image when paused; costs one small capped drawing buffer.
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' }); }
    catch { onUnavailable?.(); return; }
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, .1, 40);
    camera.position.set(0, .4, 8.5); camera.lookAt(0, -.25, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture;scene.environmentIntensity=.45;
    room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0x70caff, 0x03102f, .8));
    const light = new THREE.DirectionalLight(0x8ccfff, 2); light.position.set(-3, 4, 3); scene.add(light);
    const blue = new THREE.PointLight(0x007dff, 24, 12); blue.position.set(1, -1, 2); scene.add(blue);
    const crystal = new THREE.Group(); scene.add(crystal); crystal.rotation.z = -.32;crystal.rotation.y=.5;crystal.scale.x=1.12;
    const tips = [new THREE.Vector3(0,1.65,0), new THREE.Vector3(0,-1.65,0)];
    const belt = [new THREE.Vector3(1.3,0,0),new THREE.Vector3(0,0,1.3),new THREE.Vector3(-1.3,0,0),new THREE.Vector3(0,0,-1.3)];
    const facets = [];
    for (let half=0; half<2; half++) for (let i=0; i<4; i++) {
      const vertices = half ? [tips[half],belt[(i+1)%4],belt[i]] : [tips[half],belt[i],belt[(i+1)%4]];
      const center = vertices.reduce((v,p)=>v.add(p),new THREE.Vector3()).multiplyScalar(1/3);
      const normal = new THREE.Vector3().crossVectors(vertices[1].clone().sub(vertices[0]),vertices[2].clone().sub(vertices[0])).normalize();
      if (normal.dot(center)<0) normal.negate();
      const localVertices=vertices.map(p=>p.clone().sub(center));
      const geometry = new THREE.BufferGeometry().setFromPoints(localVertices); geometry.computeVertexNormals();
      geometry.setAttribute('color',new THREE.Float32BufferAttribute([.38,.65,1,.9,.98,1,.12,.36,1],3));
      const material = new THREE.MeshPhysicalMaterial({color:i%2?0x287cff:0x5aafff,vertexColors:true,emissive:0x0049e0,emissiveIntensity:.35,metalness:.3,roughness:.06,transparent:true,opacity:i%2?.25:.38,transmission:0,thickness:.4,ior:1.46,clearcoat:1,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:.7});
      const group = new THREE.Group(); group.position.copy(center);
      group.add(new THREE.Mesh(geometry,material));
      const sheen=new THREE.BufferGeometry().setFromPoints([localVertices[0],localVertices[0].clone().lerp(localVertices[1],.12),localVertices[0].clone().lerp(localVertices[2],.9)].map(p=>p.clone().addScaledVector(normal,.005)));
      group.add(new THREE.Mesh(sheen,new THREE.MeshBasicMaterial({color:i%2?0x1e64ff:0x91dfff,transparent:true,opacity:i%2?.18:.36,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})));
      group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:0x4eabff,transparent:true,opacity:.95})));
      crystal.add(group); facets.push({group,center,normal,sign:half?-1:1});
    }
    const circuitry = new THREE.Group(); crystal.add(circuitry);
    const traceMat = new THREE.LineBasicMaterial({color:0x22d5ff,transparent:true,opacity:.85});
    for (let i=0;i<14;i++) {
      const side=i%2?1:-1,x=side*(.07+(i%7)*.1),y=.92-(i%7)*.15;
      const points=[[x,y,.28],[x,y-.42,.42],[x+side*.18,y-.6,.3],[x+side*.18,-.8+(i%4)*.13,.12]].map(p=>new THREE.Vector3(...p));
      circuitry.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),traceMat));
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.022,6,4),new THREE.MeshBasicMaterial({color:0xcaffff})); dot.position.copy(points[0]);circuitry.add(dot);
    }
    const network=new THREE.Group();crystal.add(network);
    const positions=[new THREE.Vector3(0,0,0)];
    for(let i=0;i<9;i++){const a=i*Math.PI*2/9;positions.push(new THREE.Vector3(Math.cos(a)*1.05,Math.sin(a)*1.12,Math.sin(a*3)*.6));}
    const segments=[];
    positions.forEach((p,i)=>{
      const dot=new THREE.Mesh(new THREE.SphereGeometry(i?.045:.095,10,8),new THREE.MeshBasicMaterial({color:i?0x79e5ff:0xffffff}));dot.position.copy(p);network.add(dot);
      if(i)segments.push(...p.toArray(),0,0,0,...p.toArray(),...positions[i===9?1:i+1].toArray());
    });
    network.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(segments,3)),new THREE.LineBasicMaterial({color:0x37bfff,transparent:true,opacity:.85})));
    const orbit=new THREE.Group();orbit.rotation.set(.75,.25,-.63);orbit.scale.x=1.16;scene.add(orbit);
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(2.02,.035,6,128),new THREE.MeshStandardMaterial({color:0x1666d9,metalness:.8,roughness:.15,emissive:0x0648b8,emissiveIntensity:.8})));
    orbit.add(new THREE.Mesh(new THREE.RingGeometry(1.96,2.08,128),new THREE.MeshStandardMaterial({color:0x247eff,emissive:0x005bff,emissiveIntensity:.7,metalness:.85,roughness:.15,side:THREE.DoubleSide})));
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(2.02,.09,5,128),new THREE.MeshBasicMaterial({color:0x087bff,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false})));
    for(const radius of [1.96,2.08])orbit.add(new THREE.Mesh(new THREE.TorusGeometry(radius,.009,4,128),new THREE.MeshBasicMaterial({color:0x80dfff,transparent:true,opacity:.85})));
    const trails=new THREE.Group();orbit.add(trails);
    for(let i=0;i<6;i++){
      const arc=new THREE.Mesh(new THREE.RingGeometry(1.96,2.08,12,1,0,.18),new THREE.MeshBasicMaterial({color:i%2?0xe8ffff:0x24bdff,side:THREE.DoubleSide}));arc.rotation.z=i*Math.PI/3;trails.add(arc);
      for(let j=1;j<5;j++){const trail=new THREE.Mesh(new THREE.RingGeometry(1.96,2.08,6,1,-j*.085,.08),new THREE.MeshBasicMaterial({color:0x14adff,transparent:true,opacity:(5-j)*.14,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));trail.rotation.z=i*Math.PI/3;trails.add(trail);}
    }
    const pedestal=new THREE.Group();pedestal.position.y=-2.08;pedestal.scale.x=1.16;scene.add(pedestal);
    const pedestalMat=new THREE.MeshStandardMaterial({color:0x010b21,metalness:.75,roughness:.17,envMapIntensity:.15});
    pedestal.add(new THREE.Mesh(new THREE.CylinderGeometry(1.87,1.98,.18,64),pedestalMat));
    const lowerBase=new THREE.Mesh(new THREE.CylinderGeometry(2.06,2.15,.12,64),pedestalMat);lowerBase.position.y=-.16;pedestal.add(lowerBase);
    const pulseMat=new THREE.MeshBasicMaterial({color:0x10bfff,transparent:true,opacity:.9});
    for(const radius of [1.55,1.88,2.1]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,radius===1.88?.035:.015,4,96),pulseMat);ring.rotation.x=Math.PI/2;ring.position.y=.12;pedestal.add(ring);}
    const baseHalo=new THREE.Mesh(new THREE.TorusGeometry(1.88,.12,6,96),new THREE.MeshBasicMaterial({color:0x007aff,transparent:true,opacity:.17,blending:THREE.AdditiveBlending,depthWrite:false}));baseHalo.rotation.x=Math.PI/2;baseHalo.position.y=.12;pedestal.add(baseHalo);
    const glow=new THREE.Mesh(new THREE.CircleGeometry(1.83,64),new THREE.MeshBasicMaterial({color:0x007aff,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));glow.rotation.x=-Math.PI/2;glow.position.y=.1;pedestal.add(glow);
    const particles=new THREE.Group();scene.add(particles);const coordinates=[];
    for(let i=0;i<48;i++)coordinates.push(Math.sin(i*32.7)*2.1,Math.cos(i*18.4)*1.9,Math.sin(i*27.1)*1.2);
    particles.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(coordinates,3)),new THREE.PointsMaterial({color:0x53c7ff,size:.022,transparent:true,opacity:.5,depthWrite:false})));
    scene.traverse(obj=>{if(obj.material?.isMeshBasicMaterial||obj.material?.isLineBasicMaterial)obj.material.toneMapped=false;});
    host.appendChild(renderer.domElement);host.dataset.ready='true';renderer.domElement.setAttribute('aria-hidden','true');
    let frame=0,last=0,time=0,visible=true,disposed=false,openness=0;
    function schedule(){if(!frame&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(render);}
    function render(now){
      frame=0;if(!visible||document.hidden||disposed)return;
      if(now-last<1000/30){schedule();return;}
      const dt=Math.min((now-last)/1000,.06);last=now;const {open,paused}=controls.current;
      const target=open?1:0;
      openness=matchMedia('(prefers-reduced-motion: reduce)').matches?target:THREE.MathUtils.damp(openness,target,5,dt);
      if(Math.abs(openness-target)<.001)openness=target;
      crystal.rotation.z=-.32;
      if(!paused){time+=dt;crystal.rotation.y=.5+time*.14;trails.rotation.z=time*.35;orbit.rotation.y=.25+Math.sin(time*.18)*.13;particles.rotation.y=time*.025;}
      crystal.position.y=(paused?0:Math.sin(time*.9)*.045)-openness*.06;
      crystal.scale.set(1.12*(1-openness*.1),1-openness*.1,1-openness*.1);
      facets.forEach(({group,center,normal,sign})=>{group.position.copy(center).addScaledVector(normal,openness*.75);group.position.y+=sign*openness*.08;group.rotation.y=openness*sign*.36;});
      circuitry.scale.setScalar(1-openness*.65);circuitry.visible=openness<.85;
      network.scale.setScalar(.32+openness*.68);network.visible=openness>.01;
      pulseMat.opacity=.65+(paused?0:Math.sin(time*1.7)*.17);
      host.dataset.progress=openness.toFixed(3);host.dataset.frames=String(Number(host.dataset.frames||0)+1);renderer.render(scene,camera);
      if(!paused||openness!==target)schedule();
    }
    wake.current=schedule;
    const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);schedule();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01});intersection.observe(host);
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();};document.addEventListener('visibilitychange',visibility);
    const contextLost=event=>{event.preventDefault();onUnavailable?.();};renderer.domElement.addEventListener('webglcontextlost',contextLost);schedule();
    return()=>{disposed=true;wake.current=()=>{};cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',contextLost);host.removeChild(renderer.domElement);const geometries=new Set(),materials=new Set();scene.traverse(obj=>{if(obj.geometry)geometries.add(obj.geometry);if(obj.material)materials.add(obj.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());environment.dispose();renderer.dispose();};
  }, []);
  return <div ref={mount} className="v2-webgl" data-open={String(open)} data-paused={String(paused)} aria-hidden="true"/>;
}
