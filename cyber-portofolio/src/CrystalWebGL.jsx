import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Bounded real-time geometry; small glow sprites avoid an expensive bloom pass.
export default function CrystalWebGL({ open, paused, onUnavailable }) {
  const mount=useRef(null),controls=useRef({open,paused}),wake=useRef(()=>{});
  useEffect(()=>{controls.current={open,paused};wake.current();},[open,paused]);
  useEffect(()=>{
    const host=mount.current;let renderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});}
    catch{onUnavailable?.();return;}
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(29,1,.1,40);
    camera.position.set(0,.15,10.6);camera.lookAt(0,-.35,0);
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));renderer.transmissionResolutionScale=.5;renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
    const environment=pmrem.fromScene(room,.02);scene.environment=environment.texture;room.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xb4dfff,0x02091c,1.2));
    for(const [color,power,position] of [[0xb9eaff,5,[-3,4,4]],[0x3478ff,4,[4,1,2]],[0xffd3a3,1,[-4,-1,2]]]){
      const light=new THREE.DirectionalLight(color,power);light.position.set(...position);scene.add(light);
    }
    const lightCanvas=document.createElement('canvas');lightCanvas.width=128;lightCanvas.height=128;
    const ctx=lightCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);
    [[0,'rgba(255,255,255,1)'],[.035,'rgba(225,254,255,1)'],[.12,'rgba(55,203,255,.75)'],[.32,'rgba(0,104,255,.18)'],[1,'rgba(0,55,255,0)']].forEach(([stop,color])=>gradient.addColorStop(stop,color));
    ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const glowTexture=new THREE.CanvasTexture(lightCanvas);
    const glowMaterial=new THREE.SpriteMaterial({map:glowTexture,color:0x86deff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
    function glow(parent,position,size=.35){const star=new THREE.Sprite(glowMaterial);star.position.copy(position);star.scale.setScalar(size);parent.add(star);return star;}
    function tubes(points,radius,material,closed=false){
      const parts=[];for(let i=0;i<points.length-(closed?0:1);i++)parts.push(new THREE.TubeGeometry(new THREE.LineCurve3(points[i],points[(i+1)%points.length]),1,radius,4,false));
      const merged=mergeGeometries(parts);parts.forEach(g=>g.dispose());return new THREE.Mesh(merged,material);
    }
    const crystal=new THREE.Group();crystal.rotation.set(.05,-.48,-.05);crystal.scale.x=1.24;scene.add(crystal);
    const tips=[new THREE.Vector3(0,1.58,0),new THREE.Vector3(0,-1.58,0)];
    const belt=[new THREE.Vector3(1.19,0,0),new THREE.Vector3(0,0,1.19),new THREE.Vector3(-1.19,0,0),new THREE.Vector3(0,0,-1.19)];
    const facets=[],edgeMaterial=new THREE.MeshBasicMaterial({color:0xa8caff,transparent:true,opacity:.82,toneMapped:false});
    const glassMaterial=new THREE.MeshPhysicalMaterial({color:0x1058d4,metalness:.12,roughness:.065,transparent:true,opacity:.12,envMapIntensity:.9,clearcoat:1,clearcoatRoughness:.035,side:THREE.FrontSide,depthWrite:false});
    for(let half=0;half<2;half++)for(let i=0;i<4;i++){
      let vertices=half?[tips[half],belt[(i+1)%4],belt[i]]:[tips[half],belt[i],belt[(i+1)%4]];
      const center=vertices.reduce((v,p)=>v.add(p),new THREE.Vector3()).multiplyScalar(1/3);
      const normal=new THREE.Vector3().crossVectors(vertices[1].clone().sub(vertices[0]),vertices[2].clone().sub(vertices[0])).normalize();
      if(normal.dot(center)<0){vertices=[vertices[0],vertices[2],vertices[1]];normal.negate();}
      const local=vertices.map(p=>p.clone().sub(center));
      // Each independent triangular prism has front, back and thin side faces.
      const front=local.map(p=>p.clone().addScaledVector(normal,.018)),back=local.map(p=>p.clone().addScaledVector(normal,-.018));
      const positions=[],triangle=(a,b,c)=>positions.push(...a.toArray(),...b.toArray(),...c.toArray());
      triangle(...front);triangle(back[2],back[1],back[0]);
      for(let n=0;n<3;n++){const j=(n+1)%3;triangle(front[n],back[n],front[j]);triangle(front[j],back[n],back[j]);}
      const prism=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3));prism.computeVertexNormals();
      const shard=new THREE.Group();shard.position.copy(center);shard.add(new THREE.Mesh(prism,glassMaterial));
      const filmGeometry=new THREE.BufferGeometry().setFromPoints(front);filmGeometry.computeVertexNormals();
      filmGeometry.setAttribute('barycentric',new THREE.Float32BufferAttribute([1,0,0,0,1,0,0,0,1],3));
      const film=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.FrontSide,uniforms:{uShard:{value:i+half*.7}},
        vertexShader:`attribute vec3 barycentric;varying vec3 vBary,vNormal,vView;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vView=-p.xyz;vNormal=normalize(normalMatrix*normal);vBary=barycentric;gl_Position=projectionMatrix*p;}`,
        fragmentShader:`uniform float uShard;varying vec3 vBary,vNormal,vView;void main(){vec3 N=normalize(vNormal),V=normalize(vView);float f=pow(1.-abs(dot(N,V)),2.);float d=min(vBary.x,min(vBary.y,vBary.z));float edge=1.-smoothstep(.002,.023,d);float band=pow(max(0.,sin(vBary.x*3.8+vBary.y*1.7+uShard)),28.);float prism=pow(max(0.,1.-vBary.y),7.)*.1;vec3 color=mix(vec3(.015,.10,.7),vec3(.5,.78,1.),clamp(f+edge*.75+band,0.,1.));gl_FragColor=vec4(color,.035+f*.18+edge*.40+band*.30+prism);}`});
      shard.add(new THREE.Mesh(filmGeometry,film));shard.add(tubes(front,.007,edgeMaterial,true));
      // Narrow prism highlights, rather than an opaque fill across each face.
      if(i<2){
        const bevel=new THREE.BufferGeometry().setFromPoints([front[0],front[1],front[0].clone().lerp(front[2],.22)]);
        bevel.setAttribute('color',new THREE.Float32BufferAttribute([.8,.95,1,.12,.4,1,.04,.16,.8],3));
        shard.add(new THREE.Mesh(bevel,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:i===0?.72:.4,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.FrontSide,toneMapped:false})));
      }
      // Etched traces stay attached to their glass fragment during the opening.
      const lines=[],terminals=[],point=(a,b)=>local[0].clone().multiplyScalar(1-a-b).addScaledVector(local[1],a).addScaledVector(local[2],b).addScaledVector(normal,-.025);
      for(let n=0;n<5;n++){
        const a=.12+n*.115,b=.1+(n%2)*.065,route=[point(a,b),point(a,b+.16),point(a+.06,b+.22),point(a+.06,b+.30)];
        for(let j=0;j<3;j++)lines.push(...route[j].toArray(),...route[j+1].toArray());terminals.push(...route[0].toArray());
      }
      const circuit=new THREE.Group();shard.add(circuit);
      circuit.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(lines,3)),new THREE.LineBasicMaterial({color:0x26d7ff,transparent:true,opacity:.85,toneMapped:false})));
      circuit.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(terminals,3)),new THREE.PointsMaterial({map:glowTexture,color:0x8feeff,size:.08,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})));
      crystal.add(shard);facets.push({shard,center,normal,circuit,index:facets.length});
    }
    const vertexLights=new THREE.Group();crystal.add(vertexLights);tips.forEach(p=>glow(vertexLights,p,.42));belt.forEach(p=>glow(vertexLights,p,.2));
    const network=new THREE.Group();scene.add(network);const phi=(1+Math.sqrt(5))/2;
    const nodes=[[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]].map(p=>new THREE.Vector3(...p).normalize().multiplyScalar(.91));
    const connections=[];
    nodes.forEach((p,i)=>{
      glow(network,p,.32);const sphere=new THREE.Mesh(new THREE.SphereGeometry(.029,8,6),new THREE.MeshBasicMaterial({color:0xc7f7ff,toneMapped:false}));sphere.position.copy(p);network.add(sphere);
      for(let j=i+1;j<nodes.length;j++)if(p.distanceTo(nodes[j])<1.05)connections.push(...p.toArray(),...nodes[j].toArray());
      if(i%3===0)connections.push(...p.toArray(),0,0,0);
    });
    network.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(connections,3)),new THREE.LineBasicMaterial({color:0x4bcaff,transparent:true,opacity:.75,toneMapped:false})));
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.12,0),new THREE.MeshBasicMaterial({color:0xd3faff,wireframe:true,toneMapped:false}));network.add(core);glow(network,new THREE.Vector3(),.6);
    // Pitch the ribbon, then tilt its parent: a diagonal ellipse rather than a hoop.
    const orbitPivot=new THREE.Group();orbitPivot.rotation.z=.58;orbitPivot.position.y=-.13;orbitPivot.scale.setScalar(1.30);scene.add(orbitPivot);
    const orbit=new THREE.Group();orbit.rotation.x=1.22;orbitPivot.add(orbit);
    orbit.add(new THREE.Mesh(new THREE.RingGeometry(2.05,2.16,144),new THREE.MeshStandardMaterial({color:0x0d58af,metalness:.94,roughness:.12,emissive:0x005bff,emissiveIntensity:.65,side:THREE.DoubleSide,envMapIntensity:2})));
    for(const radius of [2.05,2.16])orbit.add(new THREE.Mesh(new THREE.TorusGeometry(radius,.009,4,144),new THREE.MeshBasicMaterial({color:0xa8efff,toneMapped:false})));
    orbit.add(new THREE.Mesh(new THREE.TorusGeometry(2.105,.065,6,128),new THREE.MeshBasicMaterial({color:0x097bff,transparent:true,opacity:.13,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})));
    const trails=new THREE.Group();orbit.add(trails);
    for(let i=0;i<7;i++){
      const arc=new THREE.Mesh(new THREE.RingGeometry(2.055,2.155,8,1,0,.075),new THREE.MeshBasicMaterial({color:i%2?0xc8f6ff:0x39caff,side:THREE.DoubleSide,toneMapped:false}));arc.rotation.z=i*Math.PI*2/7;trails.add(arc);
      const a=i*Math.PI*2/7;glow(trails,new THREE.Vector3(Math.cos(a)*2.105,Math.sin(a)*2.105,.012),i%2?.42:.28);
      for(let j=1;j<5;j++){const tail=new THREE.Mesh(new THREE.RingGeometry(2.055,2.155,5,1,-j*.065,.06),new THREE.MeshBasicMaterial({color:0x159aff,transparent:true,opacity:(5-j)*.16,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));tail.rotation.z=a;trails.add(tail);}
    }
    const pedestal=new THREE.Group();pedestal.position.set(0,-1.96,0);pedestal.scale.x=1.14;scene.add(pedestal);
    const chrome=new THREE.MeshPhysicalMaterial({color:0x153965,metalness:.96,roughness:.12,clearcoat:1,envMapIntensity:2.4});
    const darkGlass=new THREE.MeshBasicMaterial({color:0x03132e});
    for(const [top,bottom,height,y] of [[1.93,1.98,.10,.1],[2.12,2.15,.12,-.04],[2.2,2.24,.07,-.15]]){
      const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,96),[chrome,darkGlass,darkGlass]);cylinder.position.y=y;pedestal.add(cylinder);
    }
    const pulseMaterial=new THREE.MeshBasicMaterial({color:0x21cfff,transparent:true,opacity:.85,toneMapped:false});
    for(const [radius,y,width] of [[1.93,.16,.012],[2.14,.025,.025],[2.22,-.11,.008],[1.7,.165,.008]]){
      const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,width,4,128),pulseMaterial);ring.rotation.x=Math.PI/2;ring.position.y=y;pedestal.add(ring);
    }
    const floorGlow=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uPulse:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform float uPulse;void main(){float r=length(vUv-.5)*2.;float ring=exp(-pow((r-.87)*36.,2.));float center=exp(-r*r*8.);gl_FragColor=vec4(.015,.47,1.,(ring*.75+center*.30)*uPulse*(1.-smoothstep(.9,1.,r)));}`});
    const disk=new THREE.Mesh(new THREE.CircleGeometry(2.43,96),floorGlow);disk.rotation.x=-Math.PI/2;disk.position.y=.168;pedestal.add(disk);
    glow(pedestal,new THREE.Vector3(0,.2,.1),1.3);glow(pedestal,new THREE.Vector3(-1.45,.16,1.2),.5);
    const particles=new THREE.Group();scene.add(particles);const dust=[];
    for(let i=0;i<36;i++)dust.push(Math.sin(i*32.7)*1.9,Math.cos(i*18.4)*1.7,Math.sin(i*27.1)*.9);
    particles.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(dust,3)),new THREE.PointsMaterial({map:glowTexture,color:0x63c7ff,size:.07,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})));
    host.appendChild(renderer.domElement);host.dataset.ready='true';renderer.domElement.setAttribute('aria-hidden','true');
    let frame=0,last=0,time=0,visible=true,disposed=false,openness=0,lastTarget=0,transitionFrom=0,transitionStart=0;
    function schedule(){if(!frame&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(render);}
    function render(now){
      frame=0;if(!visible||document.hidden||disposed)return;
      if(now-last<1000/30){schedule();return;}
      const dt=Math.min((now-last)/1000,.06);last=now;const {open,paused}=controls.current,target=open?1:0;
      if(target!==lastTarget){transitionFrom=openness;transitionStart=now;lastTarget=target;}
      const transition=Math.min(1,(now-transitionStart)/1100),ease=1-Math.pow(1-transition,3);
      openness=matchMedia('(prefers-reduced-motion: reduce)').matches?target:transitionFrom+(target-transitionFrom)*ease;
      if(transition===1)openness=target;
      if(!paused)time+=dt;
      crystal.rotation.y=-.48+time*.075;crystal.position.y=paused?0:Math.sin(time*.8)*.035;
      facets.forEach(({shard,center,normal,circuit,index})=>{const direction=normal.clone();direction.y*=.32;direction.normalize();shard.position.copy(center).addScaledVector(direction,openness*.96);shard.rotation.set(openness*normal.y*.3,openness*(index%2?1:-1)*.48,openness*normal.x*.17);circuit.visible=openness<.93;});
      vertexLights.visible=openness<.08;network.visible=openness>.01;network.scale.setScalar(.2+openness*.9);network.rotation.set(.2,time*.17,.12);core.rotation.y=time*.4;
      trails.rotation.z=time*.24;orbitPivot.rotation.z=.58+Math.sin(time*.12)*.025;particles.rotation.y=time*.025;
      pulseMaterial.opacity=.78+(paused?0:Math.sin(time*1.3)*.13);floorGlow.uniforms.uPulse.value=paused?1:1+Math.sin(time*1.3)*.12;
      host.dataset.progress=openness.toFixed(3);host.dataset.frames=String(Number(host.dataset.frames||0)+1);renderer.render(scene,camera);
      if(!paused||openness!==target)schedule();
    }
    wake.current=schedule;
    const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);schedule();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01});intersection.observe(host);
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();};document.addEventListener('visibilitychange',visibility);
    const contextLost=event=>{event.preventDefault();onUnavailable?.();};renderer.domElement.addEventListener('webglcontextlost',contextLost);schedule();
    return()=>{disposed=true;wake.current=()=>{};cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',contextLost);host.removeChild(renderer.domElement);const geometries=new Set(),materials=new Set();scene.traverse(obj=>{if(obj.geometry)geometries.add(obj.geometry);if(obj.material)for(const material of Array.isArray(obj.material)?obj.material:[obj.material])materials.add(material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());glowTexture.dispose();environment.dispose();renderer.dispose();};
  },[]);
  return <div ref={mount} className="v2-webgl" data-open={String(open)} data-paused={String(paused)} aria-hidden="true"/>;
}
