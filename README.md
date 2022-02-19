# Green-chain

Green-chain è un'applicazione che consente di inserire prodotti e materie prime all'interno di una blockchain costituita da 3 nodi, in modo da garantire una completa tracciabilità dei dati.

## Prerequisiti

È necessario aver installato precedentemente i seguenti tool:
- [docker desktop](https://www.docker.com/products/docker-desktop) 
- [node.js](https://nodejs.org/it/download/) 

Dopo aver installato Node.js sarà anche necessario scaricare le seguenti librerie:
- truffle@5.4.29
- web3
- chalk@2.4 
- boxen@4.0
- clear
- clui
- figlet
- inquirer

Per installare tali librerie basta aprire il prompt ed eseguire:

```bash
npm install {nome_libreria} 
```


## Installazione

Avviare Docker-desktop
Scaricare la cartella di progetto nella propria macchina, aprire il prompt di comando ed eseguire:

```bash
truffle deploy
```

Attendere finché l'operazione non va a buon fine.
Fatto ciò, posizionarsi nella cartella "implementazione" e lanciare il comando:

```bash
node interfaccia.js
```

## Utilizzo

La schermata iniziale del programma fornisce un'interfaccia in cui è possibile scegliere tra 3 account utenti, il primo dei quali ha privilegi di amministratore, cioè
può assegnare ruoli a se stesso e agli altri account.
I ruoli disponibili sono 3: produttore, consumatore e cliente.
Inizialmente gli account non hanno un ruolo, ma l'amministratore può decidere di assegnare anche più ruoli allo stesso account.

Dopo aver selezionato l'account con cui procedere, è possibile scegliere una tra 8 operazioni possibili:
- Transazioni:
  - Inserimento Attore (solo amministratore)
  - Inserimento Materia Prima (solo produttore)
  - Crea Prodotto (solo trasformatore)
  - Trasferimento Materia Prima (solo chi possiede la materia prima)
- Estrazione Informazioni:
  - Possessore a partire dal Token
  - Informazioni a partire dal Token
  - Informazioni a partire dal lotto
  - Informazioni a partire dal Nome
  
  
  
 È possibile spostarsi nel menu tramite le frecce direzionali e selezionare un'operazioni premendo il tasto "Enter".
 Una volta scelta l'operazione da svolgere sarà fornita la corrispondente form in cui sono chieste le informazioni per portare a termine l'operazione. 
 
 ##Problematiche
 Nel caso in cui siano presenti dei bug siete pregati di segnalarli aprendo un Issue, prenderemo in esame la richiesta il prima possibile.
 
 
 
