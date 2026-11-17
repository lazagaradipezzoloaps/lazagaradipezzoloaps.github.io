// Costruisce il sito: pagine HTML (da sorgente/pagine + layout), CSS e JavaScript.
// Uso: npm run build
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import * as esbuild from 'esbuild';
import { muretto } from './muretto.mjs';
import { icona, fiorellino } from './icone.mjs';

const RADICE = new URL('..', import.meta.url).pathname;
const leggi = p => readFileSync(join(RADICE, p), 'utf8');
const scrivi = (p, testo) => {
  mkdirSync(dirname(join(RADICE, p)), { recursive: true });
  writeFileSync(join(RADICE, p), testo);
};

const sito = JSON.parse(leggi('contenuti/sito.json'));
const foto = JSON.parse(leggi('contenuti/foto.json'));
const eventi = JSON.parse(leggi('contenuti/eventi.json')).sort((a, b) => a.data.localeCompare(b.data));

// ---------- JavaScript ----------
rmSync(join(RADICE, 'assets/js'), { recursive: true, force: true });
await esbuild.build({
  entryPoints: [join(RADICE, 'sorgente/js/main.js')],
  outdir: join(RADICE, 'assets/js'),
  bundle: true,
  splitting: true,
  format: 'esm',
  minify: true,
  target: ['es2020', 'safari15'],
  jsx: 'automatic',
  loader: { '.js': 'jsx', '.css': 'empty' },
  chunkNames: 'parti/[name]-[hash]',
  legalComments: 'none',
  banner: {
    js: '/*! La Zagara di Pezzolo APS. Usa GSAP (GreenSock, licenza standard gratuita), Lenis (MIT, darkroom.engineering) e componenti React Bits (MIT + Commons Clause, (c) 2026 David Haz). Licenze in /assets/js/LICENZE-terze-parti.txt */'
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning'
});
scrivi(
  'assets/js/LICENZE-terze-parti.txt',
  [
    'Componenti di terze parti usati in questo sito',
    '',
    '== React Bits (SplitText, CurvedLoop) ==',
    leggi('sorgente/js/react-bits/LICENSE-react-bits.md'),
    '',
    '== GSAP ==',
    'GSAP (c) GreenSock / Webflow. Licenza standard "no charge": https://gsap.com/standard-license',
    '',
    '== Lenis ==',
    'Lenis (c) darkroom.engineering. Licenza MIT: https://github.com/darkroomengineering/lenis/blob/main/LICENSE',
    '',
    '== React, React DOM, Motion ==',
    'React e React DOM (c) Meta Platforms, Inc. - Licenza MIT. Motion (c) Motion Division - Licenza MIT.',
    '',
    '== Caratteri ==',
    'Fraunces (SIL Open Font License 1.1) e Atkinson Hyperlegible Next (SIL Open Font License 1.1): vedi /assets/fonts/'
  ].join('\n')
);

// ---------- CSS ----------
const cssSorgente = [
  leggi('sorgente/css/sito.css'),
  leggi('sorgente/js/react-bits/CurvedLoop.css'),
  leggi('sorgente/css/ritocchi-react-bits.css')
].join('\n');
const css = (await esbuild.transform(cssSorgente, { loader: 'css', minify: true, target: ['safari15', 'chrome100', 'firefox100'] })).code;
scrivi('assets/css/sito.css', css);

const versione = createHash('sha1')
  .update(css)
  .update(readFileSync(join(RADICE, 'assets/js/main.js')))
  .digest('hex')
  .slice(0, 8);

// ---------- Eventi ----------
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const oggi = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());

function schedaEvento(e, livello = 3) {
  const [a, m, g] = e.data.split('-').map(Number);
  const giornoSettimana = GIORNI[new Date(Date.UTC(a, m - 1, g)).getUTCDay()];
  const quando = `${giornoSettimana[0].toUpperCase()}${giornoSettimana.slice(1)} ${g} ${MESI[m - 1]} ${a}${e.ora ? `, ore ${e.ora}` : ''}`;
  return `<article class="evento" id="${e.id}" data-data="${e.data}">
  <p class="evento__data" aria-hidden="true"><span class="evento__giorno">${g}</span><span class="evento__mese">${MESI[m - 1].slice(0, 3)}</span></p>
  <div class="evento__corpo">
    <h${livello} class="evento__titolo">${e.titolo}</h${livello}>
    <p class="evento__quando">${icona('ora', 'icona icona--piccola')}<time datetime="${e.data}${e.ora ? `T${e.ora}` : ''}">${quando}</time></p>
    <p class="evento__dove">${icona('luogo', 'icona icona--piccola')}<span>${e.luogo}</span></p>
    <p class="evento__testo">${e.testo}</p>${e.nota ? `\n    <p class="evento__nota">${e.nota}</p>` : ''}
  </div>
</article>`;
}

const VUOTO = `<p class="eventi__vuoto"%NASCOSTO%>Stiamo preparando i prossimi appuntamenti. Per non perderli, entra nella <a href="${sito.whatsapp}">community WhatsApp</a>.</p>`;

function blocchiEventi(tipo, max) {
  if (tipo === 'prossimi') {
    const lista = eventi.filter(e => e.data >= oggi);
    return `<div class="eventi" data-eventi="prossimi"${max ? ` data-max="${max}"` : ''}>
${lista.map(e => schedaEvento(e)).join('\n')}
</div>
${VUOTO.replace('%NASCOSTO%', lista.length ? ' hidden' : '')}`;
  }
  const passati = eventi.filter(e => e.data < oggi).reverse();
  return `<div class="eventi eventi--passati" data-eventi="passati">
${passati.map(e => schedaEvento(e)).join('\n')}
</div>`;
}

// ---------- Pagine ----------
const MENU = [
  ['/chi-siamo/', 'Chi siamo'],
  ['/cosa-facciamo/', 'Cosa facciamo'],
  ['/eventi/', 'Eventi'],
  ['/il-borgo/', 'Il borgo'],
  ['/contatti/', 'Contatti']
];

// {{foto:nome}} -> <picture> con le misure in webp e jpg (dati in contenuti/foto.json)
function picture(nome, sizes) {
  const f = foto[nome];
  if (!f) throw new Error(`Foto sconosciuta: ${nome}`);
  const sz = sizes || f.sizes;
  const set = est => f.larghezze.map(w => `/assets/img/${nome}-${w}.${est} ${w}w`).join(', ');
  const piu = f.larghezze[f.larghezze.length - 1];
  return `<picture><source type="image/webp" srcset="${set('webp')}" sizes="${sz}"><img src="/assets/img/${nome}-${piu}.jpg" srcset="${set('jpg')}" sizes="${sz}" width="${f.larghezza}" height="${f.altezza}" alt="${f.alt.replace(/"/g, '&quot;')}" loading="lazy" decoding="async"></picture>`;
}

function sostituisci(testo, pagina) {
  return testo
    .replace(/\{\{sito\.(\w+)\}\}/g, (_, k) => {
      if (!(k in sito)) throw new Error(`Dato del sito mancante: ${k}`);
      return sito[k];
    })
    .replace(/\{\{icona:([\w-]+)(?::([\w -]+))?\}\}/g, (_, n, c) => icona(n, c ? `icona ${c}` : 'icona'))
    .replace(/\{\{muretto:(\d+):(\d)(?::([\w -]+))?\}\}/g, (_, s, n, c) => muretto({ seme: +s, file: +n, classe: c || '' }))
    .replace(/\{\{eventi:(prossimi|passati)(?::(\d+))?\}\}/g, (_, t, m) => blocchiEventi(t, m && +m))
    .replace(/\{\{foto:([\w-]+)(?:\|([^}]+))?\}\}/g, (_, n, sz) => picture(n, sz && sz.trim()))
    .replace(/\{\{fiorellino\}\}/g, () => fiorellino())
    .replace(/\{\{nascondi-se-nessun-passato\}\}/g, () => (eventi.some(e => e.data < oggi) ? '' : ' hidden'))
    .replace(/\{\{pagina\.(\w+)\}\}/g, (_, k) => pagina[k] ?? '');
}

function leggiPagina(file) {
  const grezzo = leggi(`sorgente/pagine/${file}`);
  const m = grezzo.match(/^<!--\n([\s\S]*?)\n-->\n/);
  if (!m) throw new Error(`Intestazione mancante in ${file}`);
  const meta = Object.fromEntries(
    m[1].split('\n').filter(Boolean).map(r => {
      const i = r.indexOf(':');
      return [r.slice(0, i).trim(), r.slice(i + 1).trim()];
    })
  );
  return { ...meta, corpo: grezzo.slice(m[0].length) };
}

const layout = leggi('sorgente/layout.html');
const pagine = readdirSync(join(RADICE, 'sorgente/pagine')).filter(f => f.endsWith('.html'));
const mappa = [];

for (const file of pagine) {
  const p = leggiPagina(file);
  const menu = MENU.map(([href, nome]) => {
    const attuale = p.percorso === href || (p.sezione && p.sezione === href);
    return `<li><a href="${href}"${attuale ? ' aria-current="page"' : ''}>${nome}</a></li>`;
  }).join('\n          ');
  const partecipaAttuale = p.percorso === '/partecipa/' ? ' aria-current="page"' : '';
  const urlPagina = p.percorso === '/404.html' ? sito.url + '/' : sito.url + p.percorso;
  const html = sostituisci(
    layout
      .replace('{{menu}}', () => menu)
      .replace('{{partecipaAttuale}}', () => partecipaAttuale)
      .replace('{{contenuto}}', () => p.corpo.trim())
      .replace('{{testaExtra}}', () => (p.percorso === '/' ? datiStrutturati() : ''))
      .replace(/\{\{versione\}\}/g, () => versione)
      .replace(/\{\{urlPagina\}\}/g, () => urlPagina)
      .replace('{{robots}}', p.percorso === '/404.html' ? '<meta name="robots" content="noindex">' : ''),
    p
  );
  const uscita = p.percorso === '/' ? 'index.html' : p.percorso === '/404.html' ? '404.html' : `${p.percorso.slice(1)}index.html`;
  scrivi(uscita, html);
  if (p.percorso !== '/404.html') mappa.push(p.percorso);
}

function datiStrutturati() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: sito.denominazione,
    alternateName: sito.nome,
    url: sito.url + '/',
    logo: sito.url + '/assets/img/logo-sigillo-512.webp',
    email: sito.email,
    taxID: sito.codiceFiscale,
    foundingDate: '2026-09-23',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Piazza Pezzolo n. 21',
      postalCode: '98138',
      addressLocality: 'Messina',
      addressRegion: 'ME',
      addressCountry: 'IT'
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(org)}</script>`;
}

// mappa del sito e robots
scrivi(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${mappa
    .sort()
    .map(u => `  <url><loc>${sito.url}${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);
scrivi('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${sito.url}/sitemap.xml\n`);
if (!existsSync(join(RADICE, '.nojekyll'))) scrivi('.nojekyll', '');

console.log(`Sito costruito: ${pagine.length} pagine, versione ${versione}`);
