# WhyOffice: il piano (01/10/2026)

Repo: github.com/OfficialWhyEd/WhyOffice (privata). Cartella: E:\Dev\WhyOffice.
Liste di partenza: E:\Lavori\WHYOFFICE-VISIONE-01-10.md e WHYOFFICE-CHECKLIST-01-10.md.

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
- [ ] Un doppio clic per aprirlo: AVVIA-WHYOFFICE.cmd.
- [ ] Aprirlo dall'iPad. Serve un tuo si': apre l'ufficio alla rete di casa, con password.
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

## Attenzione
- Il PC ha una GTX 1050: "estremamente realistico" va dosato. L'iPad aiuta.
- Codex c'e' fino al 14/10: le cose che toccano lui prima di quella data.
