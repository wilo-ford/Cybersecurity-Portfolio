import { useId } from 'react';

// Interactive vector geometry for devices that opt out of WebGL; never a screenshot.
export default function CrystalFallback({open,paused}) {
  const id='crystal'+useId().replace(/\W/g,'');
  const shards=['318,52 195,171 309,145','318,52 309,145 408,160','195,171 309,145 275,294','309,145 408,160 275,294','318,52 195,171 291,190','318,52 291,190 408,160','195,171 291,190 275,294','291,190 408,160 275,294'];
  const nodes=[[300,170],[240,139],[286,111],[349,134],[371,192],[323,238],[267,231],[226,192],[315,187],[288,153]];
  return <div className={'v2-crystal-system v2-vector-system'+(open?' is-open':'')+(paused?' is-paused':'')} aria-hidden="true"><svg viewBox="90 15 420 365" className="v2-vector-crystal">
    <defs>
      <linearGradient id={id+'glass'} x1="0" x2="1" y1="0" y2=".8"><stop stopColor="#e1f7ff" stopOpacity=".9"/><stop offset=".16" stopColor="#1269ff" stopOpacity=".52"/><stop offset=".6" stopColor="#041e57" stopOpacity=".3"/><stop offset="1" stopColor="#89caff" stopOpacity=".75"/></linearGradient>
      <linearGradient id={id+'metal'} x1="0" x2="1"><stop stopColor="#091c39"/><stop offset=".22" stopColor="#6a93bf"/><stop offset=".38" stopColor="#0b2243"/><stop offset=".7" stopColor="#0f376c"/><stop offset=".9" stopColor="#638fb5"/><stop offset="1" stopColor="#07182e"/></linearGradient>
      <filter id={id+'light'} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
      <radialGradient id={id+'halo'}><stop stopColor="#c3faff"/><stop offset=".2" stopColor="#12caff" stopOpacity=".7"/><stop offset="1" stopColor="#0067ff" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="300" cy="355" rx="210" ry="40" fill={'url(#'+id+'halo)'} opacity=".35"/>
    <path d="M112 337V350C135 386 466 386 488 350V337Z" fill={'url(#'+id+'metal)'} stroke="#4598e5"/>
    <ellipse cx="300" cy="337" rx="188" ry="26" fill="#06172c" stroke="#4ebaff" strokeWidth="2"/>
    <ellipse cx="300" cy="332" rx="175" ry="22" fill={'url(#'+id+'metal)'} stroke="#b5efff"/>
    <ellipse cx="300" cy="333" rx="170" ry="19" fill="none" stroke="#00baff" strokeWidth="5" filter={'url(#'+id+'light)'}/>
    <ellipse cx="300" cy="331" rx="153" ry="16" fill="#08315b" stroke="#30bcff"/>
    <ellipse cx="300" cy="327" rx="90" ry="20" fill={'url(#'+id+'halo)'}/>
    <g className="v2-vector-network">{nodes.slice(1).map(([x,y],i)=><path key={i} d={`M300 170L${x} ${y}L${nodes[(i+2)%nodes.length].join(' ')}`} fill="none" stroke="#58caff"/>)}{nodes.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="13" fill={'url(#'+id+'halo)'}/><circle cx={x} cy={y} r={i?2:4} fill="#d3faff"/></g>)}</g>
    <g className="v2-vector-shards">{shards.map((points,i)=><polygon key={i} points={points} fill={'url(#'+id+'glass)'} stroke="#9bc9ff" strokeWidth={i<4?.6:1.3} opacity={i<4?.4:.8} style={{'--dx':`${i%2?42:-42}px`,'--dy':`${i%4<2?-12:15}px`,'--turn':`${i%2?12:-12}deg`}}/>)}</g>
    <g className="v2-vector-traces" fill="none" stroke="#25ccff" strokeWidth=".8">{Array.from({length:13},(_,i)=>{const x=245+i*8,y=131+(i%4)*9;return <g key={i}><path d={`M${x} ${y}V${y+27}L${x+10} ${y+37}V${242-(i%5)*13}`}/><circle cx={x} cy={y} r="1.6" fill="#b3faff"/></g>;})}</g>
    <g transform="rotate(-34 300 175)"><ellipse cx="300" cy="175" rx="180" ry="46" fill="none" stroke="#006fff" strokeWidth="12" opacity=".45" filter={'url(#'+id+'light)'}/><ellipse cx="300" cy="175" rx="180" ry="46" fill="none" stroke={'url(#'+id+'metal)'} strokeWidth="8"/><ellipse cx="300" cy="175" rx="183" ry="49" fill="none" stroke="#80d9ff"/><ellipse cx="300" cy="175" rx="177" ry="43" fill="none" stroke="#a8eeff"/><ellipse className="v2-vector-orbit-light" cx="300" cy="175" rx="180" ry="46" fill="none" stroke="#d8fbff" strokeWidth="7" strokeDasharray="12 122"/></g>
    <circle cx="318" cy="52" r="12" fill={'url(#'+id+'halo)'}/><circle cx="275" cy="294" r="16" fill={'url(#'+id+'halo)'}/>
  </svg></div>;
}
