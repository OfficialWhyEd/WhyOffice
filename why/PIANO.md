# WhyOffice: indirizzo per Claude (02/10/2026)

## Parti da questo chiarimento di Whyed

La repo agent-office e' la base dell'ambiente 3D. WhyOffice deve diventare il modo di entrare nel suo sistema personale: sessioni correnti, subagenti, cartelle, strumenti, lavori e risultati reali. Conservare il motore e il progetto E:\Dev\WhyOffice. GitHub resta uno strumento per il codice; non delimita tutto l'ufficio.

Letture selettive:
- why/01-SPECIFICA-WHYOFFICE.md: comprensione approfondita, evidenze sul codice, contratti proposti e percorso end-user.
- why/02-IDEE-COMPLEMENTARI.md: prima leggere la correzione di comprensione in apertura. Contiene 100 voci approfondite e 30 schede trasversali (101-130) con situazione, meccanismo, costo e prova proposta. Molte voci approfondiscono requisiti gia espressi: non presentarle come invenzioni nuove. Leggere poi solo il tema utile.
- E:\Lavori\WHYOFFICE-CHECKLIST-01-10.md: unica raccolta delle idee, comprese proposte GPT e correzioni. Cercare la categoria necessaria, senza riversare tutto automaticamente nel contesto.
- C:\Users\Whyed\AI-LOCALE\00-SPECIFICA.md: solo quando si collega il sistema Why locale.

## Prossima parte proposta da Codex, da validare con Whyed

Una dimostrazione completa del collegamento reale, non nuove stanze decorative:
1. Una sessione gia' aperta compare con la propria identita', senza avviarne una copia.
2. Badge e postazione mostrano stato osservato, ultimo aggiornamento e dati disponibili; un subagente reale e' distinto e collegato al padre.
3. Una stanza accede a una cartella non Git e un quadro apre un risultato reale, senza spostare i file.
4. Riavvio dell'ufficio senza perdita di associazioni o doppio conteggio dei token.
5. Misurazione e correzione del lag sul percorso usato da Whyed. Supporto iPad provato sul dispositivo reale prima di dichiararlo finito.

Prima di codice: validare la proposta tecnica concreta. Poi lavorare in un worktree secondo le regole della repo. Nessun hook globale o blocco su Claude/Codex installato implicitamente.

## Tre risultati dell'analisi che evitano errori

- La base accetta gia' una cartella locale senza repo obbligatoria. Estendere le risorse; non riscrivere il mondo da zero.
- usage.ts somma gia' i figli Claude nel lavoratore padre. Per la leaderboard separare consumo proprio, figli e totale, senza contarli due volte.
- Gli hook attuali si riferiscono a worker gia' registrati; Codex esclude figli nel suo percorso di hook/usage. Il badge delle sessioni esterne e dei subagenti richiede un adattatore preciso.

## Qualita' e stato

Whyed ha denunciato lag grave e distanza dal proprio sistema locale. Non presentarli come risolti. Ombre, outline, pixel ratio e video simultanei sono candidati di profiling, non diagnosi provate.
La prova gia' scritta con Playwright usa Chrome e dispositivi emulati; non certifica fluidita' di iPad/iPhone fisici.
Il documento di specifica e' preparazione di prodotto e proposta tecnica, non codice implementato. Le idee su identita', voci, turni, API, editing, didattica e addestramento restano conservate e collegate alle dipendenze.

## Piano precedente conservato

Il testo seguente e' il piano di Claude del 01/10, conservato integralmente come riferimento storico. Le spunte sono dichiarazioni di quel piano, non nuove verifiche. Ordine, metriche ('risparmio Opus'), 'emozioni vere', copertura Codex e completamento iPad vanno riletti alla luce della specifica del 02/10; non sono nuove decisioni di Whyed.

# WhyOffice: il piano (01/10/2026)

Repo: github.com/OfficialWhyEd/WhyOffice (privata). Cartella: E:\Dev\WhyOffice.
Lista principale delle idee: E:\Lavori\WHYOFFICE-CHECKLIST-01-10.md.
La tiene aggiornata Codex: rileggerla sempre prima di lavorare, e portare qui le idee nuove.
Altra lista: E:\Lavori\WHYOFFICE-VISIONE-01-10.md.

## L'idea in una riga
Un ufficio dove ogni sessione e ogni agente e' una persona.
Lavora, si stanca, guadagna, ti scrive. E tu vedi quanti token costa.

## Cosa abbiamo gia' (non si rifa' da zero)
agent-office fa gia' molto. Lo usiamo, non lo riscriviamo.
- Piani: ogni progetto e' un piano, con l'ascensore.
- Lavoratori alle scrivanie: Claude Code, Codex, OpenCode e altri. Terminale vivo sul portatile.
- Costo per lavoratore: token e spesa di ognuno.
- Limiti del piano Claude: 5 ore e settimana, come /usage.
- Agenti che gestiscono agenti: assumere, mandare a casa, scriversi (server MCP).
- Ufficio del capo, sala riunioni, quadri ai muri, lavagna, voce.
- Vista 2D per il telefono (/lite).
- Limite di lavoratori e monitor della macchina.
- Fatto da noi: stile Why e stanza Vetrina con i video.

## Cosa esiste fuori (da cui prendere)
- Sessioni Claude Code viste come personaggi: claude-office, agent-visualiser, pixel-agents.
  Leggono gli hook di Claude Code. Il capo e' la sessione, i subagenti sono dipendenti.
- API gratuite con fallback: FreeLLMAPI e free-llm-gateway.
  Un solo indirizzo, tanti fornitori gratis (Gemini, Groq, Cerebras, Mistral...), passa al prossimo quando uno finisce.
- Persone con memoria: struttura OpenClaw (SOUL, IDENTITY, MEMORY, HEARTBEAT, USER)
  e "Generative Agents" di Stanford (ricordi, riflessioni, piani della giornata).
- Voci gratis: Edge TTS, tante italiane e giapponesi.
- Alternativa a JEV pensata da Codex: CLM-8B (in C:\Users\Whyed\AI-LOCALE\02-RICERCA-CLM-8B.md).
  Sceglie tra azioni gia' pronte senza far scrivere il modello grande. Serve per spendere meno.
  Oggi non entra nella GTX 1050: va nella fase lontana.

## Le fasi
Ogni fase finisce con una cosa che tu vedi e provi. Una fase alla volta.

### Fase 0. Casa e programma
- [x] Repo WhyOffice sua, privata, con tutta la storia.
- [x] Un doppio clic per aprirlo: AVVIA-WHYOFFICE.cmd (rete di casa, con password).
- [x] Dall'iPad e dall'iPhone: tasto WhyOffice in WhyOcto. Provato con why/prova-ipad.mjs.
- [ ] Un vero programma, come WhyWidget: WhyOffice.exe con la sua icona e la sua finestra.
      Non una pagina del browser: un gioco a tutti gli effetti, si apre e si gioca.
      Strada: exe che accende l'ufficio e lo apre in una finestra sua a schermo intero.
- [x] Logo ufficiale: why/logo/whyoffice-logo-ufficiale.png (scatola aperta, "why" bianco, "Office" su nero).
- [ ] Secondo logo con Aphelios: da ritrovare.
- [ ] Il logo dentro: icona del programma, schermata di avvio, insegna 3D nell'ufficio.
Prova: lo apri dal PC e dall'iPad.

### Fase 1. Le sessioni vere entrano in ufficio
La base di tutto: senza i dati delle sessioni non c'e' cintura, classifica o turno.
- Un hook di Claude Code manda all'ufficio: sessione aperta, strumento usato, subagente partito, fine.
- La sessione principale (Opus) e' una persona alla sua scrivania, con il badge della sessione.
- I subagenti (Sonnet, Haiku) arrivano, lavorano accanto e se ne vanno.
- Codex entra anche lui (l'ufficio legge gia' le sue sessioni), fino al 14/10.
Prova: apri una sessione qui e la vedi sedersi in ufficio.

### Fase 2. Cintura, classifica, quadro dei token
- Ogni persona ha una cintura: tempo di lavoro e token usati.
- Efficienza = tempo utile diviso token. Piu' alta, cintura piu' alta.
- Classifica: top efficienza e top consumo.
- Quadro al muro: token di oggi e della settimana, e quanto abbiamo risparmiato.
- Risparmio = quanto avrebbe speso Opus da solo, meno quanto abbiamo speso davvero.
Prova: guardi il quadro e la classifica e tornano con /usage.

### Fase 3. Turni e riposo
- Ogni persona ha un limite di token per turno. Uno standard per tutti.
- Tu alzi o abbassi il limite di ognuno, dal tuo ufficio.
- Oppure lo decide il capoturno (un Haiku che segue solo questo).
- Chi arriva al limite va a riposo, in sala relax.
- Obiettivo: stare sempre sotto il 90% del giorno e della settimana.
- I guardiani (controllano e basta) non hanno turni.
Prova: un agente finisce il turno e lo vedi andare a riposare.

### Fase 4. Il piano delle API gratuite
- Un piano solo per loro, con FreeLLMAPI che gira in locale.
- Ogni dipendente non Claude e non Codex ha la sua chiave (anche piu' di una).
- Le chiavi stanno in E:\Chiavi. Le creo io dal browser quando servono.
- Lavorano con OpenCode, che parla con qualsiasi API.
- Opus pochissimo, pochi Sonnet, tanti Haiku. Il resto Gemini, Groq e gli altri gratis.
Prova: un dipendente Gemini fa un lavoro vero e la spesa resta zero.

### Fase 5. Le persone
- Ogni persona ha la sua cartella: chi e', carattere, ricordi, diario, battito (stile OpenClaw).
- Emozioni e stanchezza vere, legate ai token e alle ore.
- Paga mensile in punti, legata alla cintura.
- Orari: chi lavora la mattina, chi la sera, chi quando non ci sei.
- Ognuno ha la sua voce Edge.
- Nelle pause scelgono liberamente cosa fare: girare, guardare i quadri, scoprire il lavoro degli altri.
- Capiscono quando sei nervoso dal modo in cui scrivi, e si comportano di conseguenza.
Prova: parli con uno e risponde con la sua voce e il suo carattere.

### Fase 6. Casella e messaggi
- Casella "cose che non vanno": lamentele, scoperte belle, idee. Tu le apri una per una.
- Li' ti dico anche "ci sono troppe cose, fermiamoci".
- Ti scrivono: messaggi, email, poi chiamate con la loro voce.
Prova: trovi nella casella un biglietto di un agente e gli rispondi.

### Fase 7. Le stanze
- "Fammi una stanza X" con una frase.
- Una stanza per ogni progetto e skill, con un agente che la segue (prima: WhyMotion e video).
- Il tuo ufficio personale: telecamere su ogni stanza e statistiche di tutti.
- Stanza segreta dei file: ogni file e' un quadro che si apre.
- Quadri con i lavori degli agenti: risultati, codice, cose belle da mostrare. Accanto, la classifica.
- Stanze per esperimenti e altri usi, da decidere man mano.
- Piani e stanze che portano alle cartelle del PC. Teletrasporto.
- Zona tranquilla. Mini Aphi che gira per l'ufficio.
- Stanza lingue (giapponese con insegnante e compagni).
- Gli agenti stessi costruiscono le stanze.
Prova: chiedi una stanza e ci entri.

### Fase 8. Dipendenti speciali
- Ricercatore in loop: novita' su LLM e modelli System One. Lavora di notte.
- Ottimizzatori: comprimono e fanno risparmiare token, sempre.
- Guardiani.
Prova: la mattina trovi in casella cosa hanno scoperto.

### Fase 8b. Raccontare l'ufficio
- Montaggio interno: preparare e montare contenuti di quello che succede.
- Piu' avanti: WhyOffice in diretta e video delle stanze. Niente pubblicazione per ora.

### Fase 9. Lontano
Solo quando video e WhyMotion sono completi e deterministici.
- Modello locale dentro l'ufficio per le cose base.
- CLM-8B o JEV come System One: scelte veloci tra azioni pronte.
- Stanza allenamento: fine tuning, allineamento, anche psicologico, per ognuno.
- Reinforcement learning. Tanti motori in un unico punto.

## Regole del lavoro
- Una fase alla volta. Non si passa avanti senza la prova.
- Prima di partire scrivo "ho capito che vuoi X".
- Se ci sono troppe cose, te lo dico.
- Tutto si puo' annullare: ogni passo e' un commit.
- Gli aggiornamenti di agent-office li prendiamo dal remoto upstream, quando servono.

## Stato verificato (02/10/2026)
- Controllo tipi: nessun errore.
- Test: 457 passano, 56 falliscono. I falliti lanciano agenti finti, o leggono i percorsi
  con la barra di Linux: su Windows non vanno. Provato: client-registry fallisce uguale
  sul codice originale (commit 1bc3028), quindi non e' colpa nostra.
- Aperto da WhyOcto come iPad e iPhone: si arriva alla scelta del personaggio, zero errori.

## Attenzione
- Il PC ha una GTX 1050: "estremamente realistico" va dosato. L'iPad aiuta.
- Codex c'e' fino al 14/10: le cose che toccano lui prima di quella data.
