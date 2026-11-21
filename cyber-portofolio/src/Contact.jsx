import { useRef, useState } from 'react';
import { Mail, Phone, MessageCircle, ArrowUpRight, Send, MapPin, Copy, Check, Github, Linkedin } from 'lucide-react';
import { profile } from './content';
export default function Contact() {
  const [name, setName] = useState(''),
    [subject, setSubject] = useState('Échange professionnel'),
    [message, setMessage] = useState('');
  const [preparedUrl, setPreparedUrl] = useState(''),
    [copied, setCopied] = useState(false),
    [copyStatus, setCopyStatus] = useState('');
  const messageField = useRef(null);
  const whatsappBase = `https://wa.me/${profile.whatsapp}`;
  function prepareMessage(event) {
    event.preventDefault();
    if (!message.trim()) {
      messageField.current.setCustomValidity('Écrivez votre message avant de continuer.');
      messageField.current.reportValidity();
      return;
    }
    const text = ['Bonjour Mohamed,', name.trim() ? `Je m’appelle ${name.trim()}.` : null, `Sujet : ${subject}`, '', message.trim()].filter(line => line !== null).join('\n');
    const url = whatsappBase + '?text=' + encodeURIComponent(text);
    setPreparedUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyStatus('Adresse e-mail copiée.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyStatus('Adresse à copier : ' + profile.email);
    }
  }
  return <section id="contact" className="section page-width contact-section contact-redesigned">
    <header className="contact-heading"><p className="eyebrow"><span>06</span> CONTACT</p><h2>Le prochain chapitre<br />commence par <em>un échange.</em></h2><p className="contact-summary">{profile.opportunity}</p></header>
    <div className="contact-layout">
      <div className="contact-details">
        <div className="contact-methods" aria-label="Mes coordonnées">
          <a className="contact-method contact-email" href={'mailto:' + profile.email}><span className="contact-method-icon"><Mail size={22} strokeWidth={1.5} /></span><span className="contact-method-copy"><span className="contact-method-label">E-mail</span><strong className="contact-method-value">{profile.email}</strong><small className="contact-method-note">M’envoyer un e-mail</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
          <a className="contact-method contact-phone" href={'tel:' + profile.phone}><span className="contact-method-icon"><Phone size={22} strokeWidth={1.5} /></span><span className="contact-method-copy"><span className="contact-method-label">Téléphone</span><strong className="contact-method-value">{profile.phoneDisplay}</strong><small className="contact-method-note">Bénin · indicatif +229</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
          <a className="contact-method contact-whatsapp" href={whatsappBase} target="_blank" rel="noopener noreferrer"><span className="contact-method-icon"><MessageCircle size={23} strokeWidth={1.5} /></span><span className="contact-method-copy"><span className="contact-method-label">WhatsApp</span><strong className="contact-method-value">{profile.phoneInternationalDisplay}</strong><small className="contact-method-note">Ouvrir une conversation</small></span><ArrowUpRight className="contact-method-arrow" size={18} /></a>
        </div>
        <div className="contact-secondary"><button className="text-button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Adresse copiée' : 'Copier l’e-mail'}</button>{profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={16} />GitHub <ArrowUpRight size={13} /></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} />LinkedIn <ArrowUpRight size={13} /></a>}</div>
        <p className="contact-location"><MapPin size={15} />{profile.location}</p><p className="contact-copy-status" role="status">{copyStatus}</p>
      </div>
      <form className="whatsapp-form" onSubmit={prepareMessage} aria-labelledby="whatsapp-form-title">
        <div className="form-heading"><span className="form-heading-icon"><MessageCircle size={24} /></span><div><h3 id="whatsapp-form-title">Écrivez-moi sur WhatsApp</h3><p>Une proposition de stage, une mission ou une question ?</p></div></div>
        <div className="contact-fields-row"><div className="contact-field"><label htmlFor="contact-name">Votre nom <small>(facultatif)</small></label><input id="contact-name" type="text" autoComplete="name" maxLength={80} placeholder="Comment vous appeler ?" value={name} onChange={event => {
              setName(event.target.value);
              setPreparedUrl('');
            }} /></div><div className="contact-field"><label htmlFor="contact-subject">Sujet</label><select id="contact-subject" value={subject} onChange={event => {
              setSubject(event.target.value);
              setPreparedUrl('');
            }}><option>Échange professionnel</option><option>Stage ou recrutement</option><option>Mission freelance</option><option>Question technique</option><option>Autre demande</option></select></div></div>
        <div className="contact-field message-field"><label htmlFor="contact-message">Votre message</label><textarea ref={messageField} id="contact-message" required rows={6} maxLength={2000} placeholder="Présentez-moi votre besoin ou votre projet…" value={message} onChange={event => {
            event.target.setCustomValidity('');
            setMessage(event.target.value);
            setPreparedUrl('');
          }} /><span className="message-length">{message.length} / 2000</span></div>
        <button className="whatsapp-submit" type="submit" aria-describedby="whatsapp-help"><Send size={17} />Continuer sur WhatsApp<ArrowUpRight size={17} /></button>
        <p id="whatsapp-help" className="whatsapp-help">WhatsApp s’ouvrira avec votre message prérempli. Vous pourrez le relire avant de l’envoyer.</p>
        {preparedUrl && <p className="whatsapp-ready" role="status">Votre message est prêt. <a href={preparedUrl} target="_blank" rel="noopener noreferrer">Ouvrir WhatsApp <ArrowUpRight size={12} /></a></p>}
      </form>
    </div>
  </section>;
}
