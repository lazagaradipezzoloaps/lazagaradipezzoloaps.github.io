// Disegna un muretto a secco in SVG: pietre irregolari e arrotondate su piu' file,
// con le fughe scure tra una pietra e l'altra. Lo stesso "seme" da' sempre lo stesso disegno.

const TONI = ['#CDBB9C', '#C2AC8A', '#D8C9AE', '#B59E7C', '#C9A97F', '#BCA584', '#D2BF9F', '#AE9573', '#C7B496'];

function generatore(seme) {
  let s = seme >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

const f = n => Math.round(n * 10) / 10;

// poligono -> path con angoli arrotondati
function arrotonda(punti, raggio) {
  const n = punti.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p = punti[i];
    const prec = punti[(i - 1 + n) % n];
    const succ = punti[(i + 1) % n];
    const lp = Math.hypot(prec[0] - p[0], prec[1] - p[1]);
    const ls = Math.hypot(succ[0] - p[0], succ[1] - p[1]);
    const r = Math.min(raggio, lp / 2, ls / 2);
    const a = [p[0] + ((prec[0] - p[0]) * r) / lp, p[1] + ((prec[1] - p[1]) * r) / lp];
    const b = [p[0] + ((succ[0] - p[0]) * r) / ls, p[1] + ((succ[1] - p[1]) * r) / ls];
    d += `${i === 0 ? 'M' : 'L'}${f(a[0])},${f(a[1])}Q${f(p[0])},${f(p[1])} ${f(b[0])},${f(b[1])}`;
  }
  return d + 'Z';
}

/**
 * @param {object} o
 * @param {number} o.seme   numero che decide il disegno
 * @param {number} o.file   quante file di pietre (2 o 3)
 * @param {string} o.classe classi CSS aggiuntive
 */
export function muretto({ seme = 7, file = 3, classe = '' } = {}) {
  const caso = generatore(seme);
  const W = 2400;
  const passo = 30;
  const cima = 16;
  const alt = Array.from({ length: file }, (_, i) => 30 + i * 5 + caso() * 6); // in basso pietre piu' alte
  const H = Math.round(cima + alt.reduce((a, b) => a + b, 0));

  // linee orizzontali ondulate tra una fila e l'altra (dall'alto in basso)
  const linee = [];
  let y = cima;
  for (let i = 0; i < file; i++) {
    const punti = [];
    let onda = 0;
    for (let x = -passo * 2; x <= W + passo * 2; x += passo) {
      onda = onda * 0.6 + (caso() - 0.5) * (i === 0 ? 3 : 9);
      punti.push([x, y + onda]);
    }
    linee.push(punti);
    y += alt[i];
  }
  linee.push(null); // il fondo
  const fondo = H + 4;

  const quota = (linea, x) => {
    if (!linea) return fondo;
    const i = Math.max(0, Math.min(linea.length - 2, Math.floor((x + passo * 2) / passo)));
    const [x0, y0] = linea[i];
    const [x1, y1] = linea[i + 1];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  };
  const tratto = (linea, xa, xb) => {
    if (!linea) return [];
    const dentro = linea.filter(([x]) => x > Math.min(xa, xb) + 4 && x < Math.max(xa, xb) - 4);
    return xa < xb ? dentro : dentro.reverse();
  };

  const pietre = [];
  const aggiungi = (punti, fila, raggio) => {
    const tono = TONI[Math.floor(caso() * TONI.length)];
    pietre.push(`<path class="pietra" data-fila="${fila}" fill="${tono}" d="${arrotonda(punti, raggio)}"/>`);
  };

  for (let r = 0; r < file; r++) {
    const su = linee[r];
    const giu = linee[r + 1];
    const fila = file - 1 - r; // 0 = fila piu' bassa
    let xs = -60 - caso() * 60;
    let inc = (caso() - 0.5) * 18;
    while (xs < W + 60) {
      const zeppa = caso() < 0.12;
      const w = zeppa ? 26 + caso() * 14 : 64 + caso() * 96 + (fila === 0 ? 24 : 0);
      const xe = xs + w;
      const nuovaInc = (caso() - 0.5) * 18;
      const xa = xs + inc / 2, xb = xe + nuovaInc / 2, xc = xe - nuovaInc / 2, xd = xs - inc / 2;
      const a = [xa, quota(su, xa)], b = [xb, quota(su, xb)], c = [xc, quota(giu, xc)], d = [xd, quota(giu, xd)];

      if (r === 0) {
        // pietra di coronamento: sommita' bombata e un po' asimmetrica
        const gobba = 6 + caso() * 10;
        const picco = 0.3 + caso() * 0.4;
        const sopra = [];
        for (let k = 1; k < 8; k++) {
          const t = k / 8;
          const forma = t < picco ? Math.sin((t / picco) * Math.PI / 2) : Math.cos(((t - picco) / (1 - picco)) * Math.PI / 2);
          const x = a[0] + (b[0] - a[0]) * t;
          sopra.push([x, a[1] + (b[1] - a[1]) * t - gobba * Math.pow(Math.max(forma, 0), 0.6)]);
        }
        aggiungi([a, ...sopra, b, c, ...tratto(giu, c[0], d[0]), d], fila, 7);
      } else if (!zeppa && w > 90 && caso() < 0.3) {
        // pietra spezzata in due, una sopra l'altra
        const t = 0.4 + caso() * 0.2;
        const ma = [a[0] + (d[0] - a[0]) * t, a[1] + (d[1] - a[1]) * t];
        const mb = [b[0] + (c[0] - b[0]) * (1 - t + (caso() - 0.5) * 0.2), b[1] + (c[1] - b[1]) * (1 - t)];
        aggiungi([a, ...tratto(su, a[0], b[0]), b, mb, ma], fila, 6);
        aggiungi([ma, mb, c, ...tratto(giu, c[0], d[0]), d], fila, 6);
      } else {
        aggiungi([a, ...tratto(su, a[0], b[0]), b, c, ...tratto(giu, c[0], d[0]), d], fila, zeppa ? 5 : 8);
      }
      xs = xe;
      inc = nuovaInc;
    }
  }
  const base = `<path class="muretto__fuga" d="M-80,${cima + 4} H${W + 80} V${fondo} H-80Z"/>`;
  return `<svg class="muretto ${classe}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${base}<g class="muretto__pietre">${pietre.join('')}</g></svg>`;
}
