# Green-chain (DOBBIAMO MODIFICARE I LIMITI DEI VALORI DI CO2 SIA SULLE FORM CHE NEL CODICE SOLIDITY)

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

Avviare Docker-desktop e posizionarsi nella cartella di progetto precedentemente scaricata, aprire il prompt di comando ed eseguire:

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
può assegnare ruoli a se stesso e agli altri account attraverso l'operazione "Inserimento Attore".
I ruoli disponibili sono 3: produttore, consumatore e cliente.
Inizialmente gli account non hanno un ruolo, ma l'amministratore può decidere di assegnare anche più ruoli allo stesso account.

Dopo aver selezionato l'account con cui procedere, è possibile scegliere una tra 8 operazioni possibili:
- Transazioni:
  - [Inserimento Attore](#inserimento-attore)
  - [Inserimento Materia Prima](#inserimento-materia-prima)
  - [Crea Prodotto](#crea-prodotto)
  - [Trasferimento Materia Prima](#trasferimento-materia-prima)
- Estrazione Informazioni:
  - [Possessore a partire dal Token](#possessore-a-partire-dal-token)
  - [Informazioni a partire dal Token](#informazioni-a-partire-dal-token)
  - [Informazioni a partire dal lotto](#informazioni-a-partire-dal-lotto)
  - [Informazioni a partire dal Nome](#informazioni-a-partire-dal-nome)
  
  
  
 È possibile spostarsi nel menu tramite le frecce direzionali e selezionare un'operazioni premendo il tasto "Enter".
 Una volta scelta l'operazione da svolgere sarà fornita la corrispondente form in cui sono chieste le informazioni per portare a termine l'operazione. 

 In caso di errore o di corretta esecuzione dell'operazione, il programma fornirà il seguente input:
 
 ```bash
? Vuoi continuare a svolgere operazioni? (Y/N):
```
Se si vuole continuare con l'account corrente allora inserire "Y" o "y", altrimenti digitare "N" o "n" ed il programma terminerà (sarà necessario rieseguirlo con il comando sopra definito "node interfaccia.js")

### Inserimento Attore

Operazione che fornisce una form in cui inserire l'account a cui assegnare il nuovo ruolo ed il ruolo stesso. 

**Attenzione:** <br />
***Nel caso in cui si cerchi di assegnare un ruolo ad un attore che già lo ricopre, verrà fornito un messaggio di errore.*** <br />
***Nel caso in cui l'account con cui si è autenticati non sia quello con privilegi di amministratore, verrà fornito un errore.*** 

### Inserimento Materia Prima

Operazione che fornisce una form in cui inserire nome, lotto e quantita di CO2 relativa alla materia prima da inserire. <br />
Ciò comporta l'aggiunta di una nuova materia prima al catalogo, con un token che è dato dal token dell'ultima materia prima inserita + 1

**Attenzione:** <br />
***Nel caso in cui il lotto inserito appartenga ad un prodotto/materia prima già presente nel catalogo, verrà fornito un messaggio di errore.*** <br />
***Nel caso in cui l'account con cui si è autenticati non sia un produttore, verrà fornito un errore.***

### Crea Prodotto

Per ottenere un prodotto è necessario svolgere più attività ed utilizzare più materie prime. Alla luce di ciò quest'operazione richiede il numero di materie prime utilizzate ed il numero di attività svolte; successivamente fornisce una form in cui inserire nome e lotto del nuovo prodotto, più le informazioni relative alle attivita svolte (nome e consumo di CO2) e alle materie prime utilizzate (numero del lotto). <br />
Tale operazione va ad aggiungere un nuovo prodotto, contrassegnando le risorse utilizzate per produrlo come "tipologia: utilizzata" 

**Attenzione:** <br />
***Nel caso in cui il lotto inserito appartenga ad un prodotto/materia prima già presente nel catalogo, verrà fornito un messaggio di errore.*** <br />
***Nel caso in cui l'account con cui si è autenticati non sia un trasformatore, verrà fornito un errore.*** <br />
***Nel caso in cui l'account con cui si è autenticati non sia in possesso di tutte le materie prime inserite o esse non esistano nel catalogo, verrà fornito un errore.***


### Trasferimento Materia Prima

Operazione che fornisce una form in cui inserire lotto della materia prima da trasferire e l'account destinatario. <br />
In tal modo viene cambiato il possessore della materia prima


**Attenzione:** <br />
***Nel caso in cui l'account con cui si è autenticati non sia in possesso della materia prima inserita o essa non esista nel catalogo, verrà fornito un errore.***


 ### Possessore a partire dal Token

Operazione che fornisce una form in cui inserire il token della materia prima/prodotto e restituisce l'address del possessore.

**Attenzione:** <br />
***Nel caso in cui il token inserito non appartenga ad un prodotto/materia prima presente nel catalogo, verrà fornito un messaggio di errore.*** <br />


### Informazioni a partire dal Token

Operazione che fornisce una form in cui inserire il token della materia prima/prodotto e ne restituisce le informazioni: nome, lotto, CO2, tipologia (materia prima, prodotto trasformato, utilizzata), lotti materie prime utilizzate per la produzione (nel caso in cui venga restituito un prodotto trasformato) e token.

**Attenzione:** <br />
***Nel caso in cui il token inserito non appartenga ad un prodotto/materia prima presente nel catalogo, verrà fornito un messaggio di errore.*** <br />


### Informazioni a partire dal Lotto

Operazione che fornisce una form in cui inserire il lotto della materia prima/prodotto e ne restituisce le informazioni: nome, lotto, CO2, tipologia (materia prima, prodotto trasformato, utilizzata), lotti materie prime utilizzate per la produzione (nel caso in cui venga restituito un prodotto trasformato) e token.

**Attenzione:** <br />
***Nel caso in cui il lotto inserito non appartenga ad un prodotto/materia prima presente nel catalogo, verrà fornito un messaggio di errore.*** <br />


### Informazioni a partire dal Nome

Operazione che fornisce una form in cui inserire il nome della materia prima/prodotto e ne restituisce le informazioni: nome, lotto, CO2, tipologia (materia prima, prodotto trasformato, utilizzata), lotti materie prime utilizzate per la produzione (nel caso in cui venga restituito un prodotto trasformato) e token.
Poiché più materie prime/prodotti possono avere lo stesso nome, tale operazione fornirà tutte le risorse che rispettano i criteri di ricerca, attraverso una lista 

**Attenzione:** <br /> 
***Nel caso in cui il nome inserito non appartenga ad un prodotto/materia prima presente nel catalogo, verrà fornito un messaggio di errore.*** <br />



 ## Problematiche
 
 Nel caso in cui siano presenti dei bug siete pregati di segnalarli aprendo un Issue, prenderemo in esame la richiesta il prima possibile.
 
 
 
