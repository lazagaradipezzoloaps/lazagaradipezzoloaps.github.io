// "Isole" React: due componenti di React Bits montati sopra l'HTML gia' presente.
// Vengono caricati solo nelle pagine che li usano e solo se le animazioni sono attive.
import { createRoot } from 'react-dom/client';
import SplitText from './react-bits/SplitText.jsx';
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
    La Zagara
    <br /> di Pezzolo
  </>
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
