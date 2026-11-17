# Sito della Zagara di Pezzolo APS – istruzioni per lavorarci

Sito statico pubblicato con GitHub Pages dal ramo `main` (cartella principale).
Chi lo aggiorna di solito è Salvo, chiedendo le modifiche in chat. Rispondi in italiano.

## Come è fatto

- `sorgente/pagine/*.html` – il testo delle pagine. In cima a ogni file c'è un'intestazione
  (`titolo`, `descrizione`, `percorso`, `classe`). Si modificano QUI, non negli HTML della radice.
- `sorgente/layout.html` – testata, menu e piede comuni a tutte le pagine.
- `sorgente/css/sito.css` – stile (colori e misure in `:root`).
- `sorgente/js/main.js` – menu, eventi passati, scorrimento morbido (Lenis), muretto animato (GSAP).
- `sorgente/js/isole.js` – tre componenti React Bits usati solo in home: titolo animato (SplitText),
  sigillo che ruota (CircularText), nastro con i nomi delle aree (CurvedLoop).
- `sorgente/js/react-bits/` – copie dei componenti con la loro licenza (MIT + Commons Clause): non toglierla.
- `contenuti/sito.json` – dati dell'associazione (email, PEC, link WhatsApp, indirizzo, RUNTS, url del sito).
- `contenuti/eventi.json` – gli eventi.
- `contenuti/foto.json` – le foto usate con `{{foto:nome}}` (testo alternativo, misure).
- `strumenti/build.mjs` – costruisce tutto. `strumenti/immagini.py` prepara le foto.

Gli HTML nella radice (`index.html`, `chi-siamo/index.html`, …), `assets/css/sito.css`, `assets/js/`,
`sitemap.xml` e `robots.txt` sono GENERATI: dopo ogni modifica esegui `npm install` (se manca
`node_modules`) e `npm run build`, poi fai commit di sorgenti e file generati insieme.

## Segnaposto utilizzabili nelle pagine

`{{sito.email}}`, `{{sito.pec}}`, `{{sito.whatsapp}}`, `{{sito.indirizzo}}`, … (chiavi di `sito.json`)
`{{icona:nome}}` (icone in `strumenti/icone.mjs`), `{{fiorellino}}`, `{{foto:nome}}`,
`{{muretto:seme:file}}` (muretto a secco: seme = numero qualsiasi, file = 2 o 3),
`{{eventi:prossimi}}`, `{{eventi:prossimi:3}}`, `{{eventi:passati}}`.

## Operazioni frequenti

**Aggiungere un evento** – aggiungi un oggetto a `contenuti/eventi.json`:
`id` (minuscole-con-trattini), `data` (AAAA-MM-GG), `ora` (HH:MM, facoltativa), `titolo`, `luogo`,
`testo`, `nota` (facoltativa, es. "Aperto a tutte e a tutti"). Poi `npm run build`.
Gli eventi passati escono da soli dai "prossimi" (lo fa il JavaScript nel browser) e finiscono
in "Appuntamenti passati" nella pagina Eventi.

**Aggiungere una foto** – `python3 strumenti/immagini.py <foto.jpg> <nome> 800 1400`
(toglie EXIF e GPS), poi una voce in `contenuti/foto.json` con un testo alternativo che descriva
davvero la foto, e `{{foto:nome}}` nella pagina.

**Collegare il dominio lazagaradipezzolo.it** – crea il file `CNAME` con `lazagaradipezzolo.it`,
cambia `url` in `contenuti/sito.json` in `https://lazagaradipezzolo.it`, `npm run build`, commit.
Su Aruba: record A `@` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153;
CNAME `www` → `lazagaradipezzoloaps.github.io`. Non toccare i record MX e quelli della PEC.
Poi in GitHub → Settings → Pages: dominio personalizzato e "Enforce HTTPS".

## Regole sui contenuti (decise con l'associazione)

- Non inventare dati, numeri o fatti storici su Pezzolo. Se manca qualcosa, chiedi.
  Sul sito pubblicato niente segnaposto tra parentesi quadre: usa un testo provvisorio neutro.
- NON scrivere che volontarie e volontari sono assicurati finché l'assicurazione non è attiva
  (obbligo art. 18 del Codice del Terzo Settore: ricordarlo se si parla di volontariato).
- La protezione civile è nello statuto ma non va sul sito.
- Cariche sempre al femminile. Tono accogliente, giovane, inclusivo: "socie e soci",
  "volontarie e volontari". Si scrive "Radici e Futuro" (con la "e").
- Niente newsletter e niente moduli: i contatti passano da email e community WhatsApp.
  Il telefono per ora non va pubblicato. Non citare l'autore del libro delle storie.
- Nelle comunicazioni restano denominazione con "APS", sede, codice fiscale e dati RUNTS (sono nel piede).

## Stile

Colori: Verde Peloritano #3E4C22 (principale), Verde notte #1F2A14 (testo), Crema zagara #FCF9F2
(sfondo), Crema antico #F3EEDF (fasce), Oro stame #CFA73E (bottoni, SOLO con testo scuro),
Verde foglia #4F7A13 (icone), Terracotta #8A4F40 (date). Ocra e azzurro solo decorativi.
Caratteri: Fraunces (titoli) e Atkinson Hyperlegible Next (testo), ospitati nel sito.
Al massimo un bottone oro per sezione. Testo almeno 18px, link sottolineati, bottoni alti almeno 48px,
focus visibile. Con "Riduci movimento" attivo non parte nessuna animazione e il sito deve
funzionare anche senza JavaScript. Le animazioni restano poche e lente: il muretto che si costruisce
è l'elemento caratteristico, non aggiungerne altre a ogni sezione.

## Controlli prima del commit

`npm run build`, poi apri le pagine (anche a 390px di larghezza) e verifica che non ci siano
errori in console né scorrimento orizzontale.
