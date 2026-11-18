import { useEffect, useRef, useState } from 'react';
const terminalName = 'mohamed';
const commands = [{
  command: 'whoami',
  output: [terminalName],
  duration: 3500
}, {
  command: 'hostname',
  output: ['kali'],
  duration: 3500
}, {
  command: 'ip a',
  output: ['inet 192.0.2.10/24 brd 192.0.2.255'],
  duration: 4000
}, {
  command: 'nmap -sV lab.local',
  output: ['PORT    STATE  SERVICE  VERSION', '22/tcp  open   ssh      OpenSSH', '80/tcp  open   http     Apache httpd', 'Nmap done: 1 host up'],
  duration: 8000
}];
const cycle = commands.reduce((sum, item) => sum + item.duration, 0);
export default function TerminalScreen({
  paused,
  transform,
  visible
}) {
  const elapsed = useRef(0),
    [time, setTime] = useState(0);
  useEffect(() => {
    if (paused || !visible) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        dt = now - last;
      last = now;
      if (!document.hidden) {
        elapsed.current += dt;
        setTime(elapsed.current);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [paused, visible]);
  let remaining = time % cycle,
    index = 0;
  while (remaining >= commands[index].duration) {
    remaining -= commands[index].duration;
    index++;
  }
  const current = commands[index],
    typed = current.command.slice(0, Math.floor(remaining / 90));
  const outputCount = Math.max(0, Math.floor((remaining - current.command.length * 90 - 200) / 250));
  const prompt = (command, key) => <p key={key}><b>{terminalName}㉿kali</b>:~$ {command}</p>;
  return <div className="terminal-plane" style={{
    transform
  }} aria-label="Terminal Kali Linux animé, démonstration locale"><div className="terminal-title"><div><i /><i /><i /></div><span>{terminalName}@kali: ~</span><span>⌕</span></div><div className="terminal-body"><svg className="kali-dragon" viewBox="0 0 180 100" aria-hidden="true"><path d="M6 27Q66 18 128 48L106 26 146 47 165 47 176 58 160 56 167 67 151 60Q158 77 143 84L147 70Q118 45 61 42L92 37Q43 20 6 27M17 15Q82 14 119 36M24 51Q82 37 129 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>{commands.slice(0, index).map((item, i) => <div key={item.command}>{prompt(item.command, 'p' + i)}{item.output.map(line => <p key={line}>{line}</p>)}</div>)}<p className="terminal-current"><b>{terminalName}㉿kali</b>:~$ {typed}{outputCount === 0 && <span className="terminal-cursor">▌</span>}</p>{current.output.slice(0, outputCount).map(line => <p key={line}>{line}</p>)}{outputCount >= current.output.length && <p><b>{terminalName}㉿kali</b>:~$ <span className="terminal-cursor">▌</span></p>}</div></div>;
}
