// "Isole" React: tre componenti di React Bits montati sopra l'HTML gia' presente.
// Vengono caricati solo nelle pagine che li usano e solo se le animazioni sono attive.
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import SplitText from './react-bits/SplitText.jsx';
import CircularText from './react-bits/CircularText.jsx';
import CurvedLoop from './react-bits/CurvedLoop.jsx';

const AREE = [
  'Tutti per uno',
  'Custodi del borgo',
  'Il filo della memoria',
  'Vieni a scoprirci',
  'Generazioni in moto',
  'Digitale per tutti'
];

const TITOLO = (
  <>
    Radici <em>e</em> Futuro
  </>
);

// fiore di zagara al centro del sigillo
const Fiore = () => (
  <svg viewBox="-32 -32 64 64" aria-hidden="true" focusable="false">
    <path d="M-3 9 C-12 13 -17 20 -16 25 C-10 25 -4 19 -2 12Z" fill="#4F7A13" />
    <path d="M3 9 C12 13 17 20 16 25 C10 25 4 19 2 12Z" fill="#4F7A13" />
    <g fill="#FCF9F2" stroke="#3E4C22" strokeWidth="1.6" strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map(r => (
        <path key={r} transform={`rotate(${r})`} d="M0 -3 C-6.5 -10 -6 -20 0 -25 C6 -20 6.5 -10 0 -3Z" />
      ))}
    </g>
    <circle r="5" fill="#CFA73E" />
    <circle r="2" fill="#3E4C22" />
  </svg>
);

const monta = {
  titolo(el) {
    createRoot(el).render(
      <SplitText
        tag="h1"
        className="eroe__titolo"
        text={TITOLO}
        splitType="chars"
        effect="rise"
        trigger="load"
        delay={42}
        duration={1.15}
        textAlign="left"
      />
    );
    el.classList.add('montata');
  },

  sigillo(el) {
    const lato = el.clientWidth || 160;
    createRoot(el).render(
      <CircularText
        text="LA ZAGARA DI PEZZOLO • RADICI E FUTURO • "
        spinDuration={40}
        onHover="slowDown"
        size={lato}
        fontSize={Math.round(lato * 0.078)}
        fontWeight={700}
      >
        <Fiore />
      </CircularText>
    );
    gsap.from(el, { scale: 0.7, opacity: 0, rotation: -30, duration: 1.3, ease: 'power3.out', delay: 0.9 });
  },

  nastro(el) {
    createRoot(el).render(
      <CurvedLoop
        marqueeText={AREE.join('   ·   ')}
        separator="·"
        speed={0.45}
        curveAmount={90}
        direction="left"
        interactive={false}
        fontSize={46}
        fontWeight={400}
        edgeFade={0.14}
        shape="arc"
      />
    );
  }
};

export function montaIsole() {
  document.querySelectorAll('[data-isola]').forEach(el => {
    const fn = monta[el.dataset.isola];
    if (fn) fn(el);
  });
}
