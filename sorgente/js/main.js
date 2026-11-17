// La Zagara di Pezzolo APS – script del sito
// Tutto il contenuto e' gia' nell'HTML: questo file aggiunge solo menu, eventi e animazioni.
// Con "Riduci movimento" attivo nel sistema, le animazioni non partono.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
const movimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- menu su schermi piccoli ---------- */
function menu() {
  const bottone = document.querySelector('.menu-bottone');
  const nav = document.getElementById('menu');
  if (!bottone || !nav) return;
  const imposta = aperto => {
    bottone.setAttribute('aria-expanded', String(aperto));
    nav.classList.toggle('aperta', aperto);
  };
  bottone.addEventListener('click', () => imposta(bottone.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('aperta')) {
      imposta(false);
      bottone.focus();
    }
  });
  window.matchMedia('(min-width: 62.01rem)').addEventListener('change', e => e.matches && imposta(false));
}

/* ---------- bordo della testata quando si scorre ---------- */
function testata() {
  const t = document.querySelector('.testata');
  if (!t) return;
  const aggiorna = () => t.classList.toggle('scorsa', window.scrollY > 8);
  aggiorna();
  window.addEventListener('scroll', aggiorna, { passive: true });
}

/* ---------- eventi: quelli passati escono dai "prossimi" ---------- */
function eventi() {
  const oggi = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
  const passati = document.querySelector('[data-eventi="passati"]');
  document.querySelectorAll('[data-eventi="prossimi"]').forEach(lista => {
    lista.querySelectorAll('.evento').forEach(ev => {
      if (ev.dataset.data < oggi) {
        if (passati) passati.prepend(ev);
        else ev.remove();
      }
    });
    const max = Number(lista.dataset.max) || Infinity;
    lista.querySelectorAll('.evento').forEach((ev, i) => {
      ev.hidden = i >= max;
    });
    const vuoto = lista.nextElementSibling;
    if (vuoto && vuoto.classList.contains('eventi__vuoto')) vuoto.hidden = Boolean(lista.querySelector('.evento:not([hidden])'));
  });
  if (passati) {
    const blocco = passati.closest('[data-se-vuoto]');
    if (blocco) blocco.hidden = !passati.querySelector('.evento');
  }
}

/* ---------- scorrimento morbido ---------- */
function scorrimento() {
  const lenis = new Lenis({
    duration: 1.05,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* ---------- il muretto a secco si costruisce, pietra su pietra ---------- */
function muretti() {
  document.querySelectorAll('.muretto').forEach(svg => {
    const pietre = [...svg.querySelectorAll('.pietra')];
    const fuga = svg.querySelector('.muretto__fuga');
    const file = [...new Set(pietre.map(p => p.dataset.fila))].sort();
    gsap.set(pietre, {
      opacity: 0,
      y: -48,
      rotation: () => gsap.utils.random(-8, 8),
      transformOrigin: '50% 100%'
    });
    gsap.set(fuga, { opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(fuga, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0);
    file.forEach((fila, i) => {
      tl.to(
        pietre.filter(p => p.dataset.fila === fila),
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.75,
          ease: 'back.out(1.5)',
          stagger: { each: 0.014, from: 'random' }
        },
        0.12 + i * 0.32
      );
    });

    const ritardo = svg.closest('.eroe') ? 0.35 : 0.1;
    ScrollTrigger.create({
      trigger: svg,
      start: 'top 94%',
      once: true,
      onEnter: () => gsap.delayedCall(ritardo, () => tl.play())
    });
  });
}

/* ---------- la foto di apertura scorre un po' piu' lenta della pagina ---------- */
function fotoEroe() {
  const foto = document.querySelector('.eroe__foto img');
  if (!foto) return;
  gsap.set(foto, { scale: 1.08, transformOrigin: '50% 30%' });
  gsap.to(foto, {
    yPercent: 6,
    ease: 'none',
    scrollTrigger: { trigger: '.eroe', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ---------- il logo compare con calma, dopo il titolo ---------- */
function logoEroe() {
  const logo = document.querySelector('.eroe__sigillo');
  if (!logo) return;
  gsap.fromTo(logo, { opacity: 0, scale: 0.82, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 });
}

menu();
testata();
eventi();

if (movimento) {
  scorrimento();
  muretti();
  fotoEroe();
  logoEroe();
  html.classList.add('pronto');
}

// le isole React si caricano solo se le animazioni sono attive e non e' attivo il risparmio dati
const risparmio = navigator.connection && navigator.connection.saveData;
if (movimento && !risparmio && document.querySelector('[data-isola]')) {
  // su schermi piccoli il nastro decorativo e' nascosto: non lo montiamo
  if (window.innerWidth < 768) document.querySelectorAll('[data-isola="nastro"]').forEach(n => n.removeAttribute('data-isola'));
  import('./isole.js').then(m => m.montaIsole());
}
