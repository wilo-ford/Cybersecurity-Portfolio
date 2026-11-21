export default function Brand({compact=false}) {
  return <span className={'brand-mark v2-brand'+(compact?' compact':'')} aria-hidden="true">MA<span>.</span></span>;
}
