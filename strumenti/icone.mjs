// Icone a linea disegnate per il sito (viewBox 32x32, tratto = colore del testo).
// Uso nelle pagine: {{icona:nome}}

const ICONE = {
  // Tutti per uno: borsa della spesa con un cuore
  'tutti-per-uno':
    '<path d="M7 11h18l-1.4 14.6a2.2 2.2 0 0 1-2.2 2H10.6a2.2 2.2 0 0 1-2.2-2Z"/><path d="M12 11V9.5a4 4 0 0 1 8 0V11"/><path d="M16 23.6s-3.9-2.3-3.9-4.9a1.95 1.95 0 0 1 3.9-.5 1.95 1.95 0 0 1 3.9.5c0 2.6-3.9 4.9-3.9 4.9Z"/>',
  // Custodi del borgo: muretto con un germoglio
  'custodi-del-borgo':
    '<path d="M4.5 16.5h23v10h-23Z"/><path d="M4.5 21.5h23M11 16.5v5M20 16.5v5M7.5 21.5v5M15.5 21.5v5M23.5 21.5v5"/><path d="M16 16.5v-5"/><path d="M16 11.5c0-3.2 2.6-5.4 6.4-5.4 0 3.6-2.6 5.4-6.4 5.4Z"/><path d="M16 13.2c0-2.6-2.1-4.3-5.2-4.3 0 2.9 2.1 4.3 5.2 4.3Z"/>',
  // Il filo della memoria: rocchetto con il filo che si svolge
  'il-filo-della-memoria':
    '<path d="M9 5.5h14M9 26.5h14"/><path d="M11 5.5v21M21 5.5v21"/><path d="M11 11l10-2M11 15l10-2M11 19l10-2M11 23l10-2"/><path d="M21 20.5c3.6.4 6 2.6 5.2 5.4-.6 2-3 2.2-3.6.6"/>',
  // Vieni a scoprirci: cartello con le indicazioni
  'vieni-a-scoprirci':
    '<path d="M16 4v24M11 28h10"/><path d="M16 7h8.5l3 3-3 3H16Z"/><path d="M16 15.5H7.5l-3 3 3 3H16"/>',
  // Generazioni in moto: pallone
  'generazioni-in-moto':
    '<circle cx="16" cy="16" r="11.5"/><path d="M16 11.2l4.3 3.1-1.6 5h-5.4l-1.6-5Z"/><path d="M16 11.2V4.6M20.3 14.3l6-2.2M18.7 19.3l3.6 5.4M13.3 19.3l-3.6 5.4M11.7 14.3l-6-2.2"/>',
  // Digitale per tutti: telefono con un cuore sullo schermo
  'digitale-per-tutti':
    '<rect x="8.5" y="3.5" width="15" height="25" rx="2.6"/><path d="M14 24.6h4"/><path d="M16 18.4s-3.2-1.9-3.2-4a1.6 1.6 0 0 1 3.2-.4 1.6 1.6 0 0 1 3.2.4c0 2.1-3.2 4-3.2 4Z"/>',
  // WhatsApp (fumetto con cornetta, disegnato a linea)
  whatsapp:
    '<path d="M16 4.5A11.5 11.5 0 0 0 6.1 21.8L4.5 27.5l5.9-1.5A11.5 11.5 0 1 0 16 4.5Z"/><path d="M12.4 10.6c.4-.5 1.1-.5 1.5 0l1 1.6c.3.5.2 1-.2 1.4l-.6.6a6.4 6.4 0 0 0 3 3l.6-.6c.4-.4.9-.5 1.4-.2l1.6 1c.5.4.5 1.1 0 1.5-.9.9-2.2 1.2-3.4.7a10.9 10.9 0 0 1-5.6-5.6c-.5-1.2-.2-2.5.7-3.4Z"/>',
  // Email
  email: '<rect x="4" y="7.5" width="24" height="17" rx="2.5"/><path d="M5 9l11 8.5L27 9"/>',
  // Luogo
  luogo: '<path d="M16 28s-8.5-8.3-8.5-15a8.5 8.5 0 0 1 17 0c0 6.7-8.5 15-8.5 15Z"/><circle cx="16" cy="13" r="3.2"/>',
  // Orologio
  ora: '<circle cx="16" cy="16" r="11.5"/><path d="M16 9.5V16l4.2 2.6"/>',
  // Documento
  documento: '<path d="M9 4h10l6 6v16.5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 8 26.5v-21A1.5 1.5 0 0 1 9.5 4Z"/><path d="M19 4v6h6M12 16h8M12 20.5h8"/>'
};

export function icona(nome, classe = 'icona') {
  const disegno = ICONE[nome];
  if (!disegno) throw new Error(`Icona sconosciuta: ${nome}`);
  return `<svg class="${classe}" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${disegno}</svg>`;
}

// Piccolo fiore di zagara pieno (petali del colore del testo, centro oro)
export function fiorellino(classe = 'fiorellino') {
  const petali = [0, 72, 144, 216, 288].map(r => `<ellipse transform="rotate(${r})" cx="0" cy="-6.6" rx="4.3" ry="6.4"/>`).join('');
  return `<svg class="${classe}" viewBox="-14 -14 28 28" width="20" height="20" aria-hidden="true" focusable="false"><g fill="currentColor">${petali}</g><circle r="3.1" fill="#CFA73E"/></svg>`;
}
