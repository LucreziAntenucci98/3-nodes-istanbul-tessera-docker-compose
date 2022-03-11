const Call = require("../Implementazione/call");
const Send = require("../Implementazione/send");
const assert = require("assert");




describe("Inserimento attore", async function () {

  let estrazione = new Call();
  it("CORRETTO: l'account 1 assegna a se stesso il ruolo di produttore", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiAttore(accounts[0], accounts[0], "produttore");
    assert.equal("Operazione andata a buon fine", response);
  });

  it("ECCEZIONE: l'account 1 ha già assegnato a se stesso il ruolo di produttore", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiAttore(accounts[0], accounts[0], "produttore");
    assert.equal("Errore: Returned error: execution reverted: Account gia' presente con questo ruolo", response);
  });

  it("ECCEZIONE: l'account 2 non può assegnare ruoli", async function () {
    let transazioni = new Send(1);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiAttore(accounts[1], accounts[1], "produttore");
    assert.equal("Errore: Returned error: execution reverted: Ownable: caller is not the owner", response);
  });

});










describe("Inserimento materia prima", async function () {

  let estrazione = new Call();
  it("CORRETTO: l'account è un produttore, perciò può inserire materia prime", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiMateriaPrima(accounts[0], 200, 250, "latte");
    assert.equal("Operazione andata a buon fine", response);
  });

  it("ECCEZIONE: l'account non è un produttore, perciò non può inserire materia prime", async function () {
    let transazioni = new Send(1);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiMateriaPrima(accounts[1], 100, 250, "cioccolato");
    assert.equal("Errore: Returned error: execution reverted: Solo i produttori possono aggiungere materie prime", response);
  });

  it("ECCEZIONE: inserimento di una materia prima con lotto già presente", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiMateriaPrima(accounts[0], 200, 30, "caffe");
    assert.equal("Errore: Returned error: execution reverted: Id lotto gia' presente", response);
  });

  it("ECCEZIONE: inserimento di una materia prima con lotto pari a 0", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.aggiungiMateriaPrima(accounts[0], 0, 30, "caffe");
    assert.equal("Errore: Returned error: execution reverted: Id lotto non valido", response);
  });
});









describe("Aggiunta Prodotto Trasformato", async function () {
  let estrazione = new Call();

  it("CORRETTO: l'account è un trasformatore, perciò può inserire prodotti trasformati", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    // assegno il ruolo di trasformatore così da poter inserire prodotti trasformati
    await transazioni.aggiungiAttore(accounts[0], accounts[0], "trasformatore");
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [200], 10000);
    assert.equal("Operazione andata a buon fine", response);
  });

  it("ECCEZIONE: errore perché l'attore inserisce un numero di materie prime uguale di 5", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto", "attività3", "attività4", "attività5"], [250, 400, 100, 300, 200], "latte parzialmente scremato", [200], 10000);
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert.equal("Errore: Returned error: execution reverted: Errore nell'inserimento del numero di materie prime o di attivita'", response);
  });

  it("ECCEZIONE: viene inserito un lotto già presente", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [200], 200);
    assert.equal("Errore: Returned error: execution reverted: Il lotto inserito e' gia' presente", response);
  });

  it("ECCEZIONE: l'account non è un trasformatore, perciò non può inserire prodotti trasformati", async function () {
    let transazioni = new Send(1);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.creaProdotto(accounts[1], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [200], 20000);
    assert.equal("Errore: Returned error: execution reverted: Solo i trasformatori possono aggiungere un prodotto trasformato", response);
  });

  it("ECCEZIONE: una delle materie prime utilizzate non è presente", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [34], 20000);
    assert(response.includes("Errore: Returned error: execution reverted: Nel catalogo non e' presente alcuna materia prima con lotto pari a "));
  });

  it("ECCEZIONE: una delle materie prime utilizzate non è in possesso del richiedente", async function () {
    let accounts = await estrazione.ottieniaccounts();
    let transazioni = new Send(0);
    // assegno il ruolo di trasformatore all'attore 2, gli faccio inserire una risorsa e provo a trasferirla dal mio account
    await transazioni.aggiungiAttore(accounts[0], accounts[1], "produttore");
    transazioni = new Send(1);
    await transazioni.aggiungiMateriaPrima(accounts[1], 222, 60, "caffè");
    transazioni = new Send(0);
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [222], 20000);
    assert(response.includes("Errore: Returned error: execution reverted: Non sei in possesso della materia prima con lotto"));
  });

  it("ECCEZIONE: uno dei lotti inseriti non corrisponde ad una materia prima", async function () {
    let accounts = await estrazione.ottieniaccounts();
    let transazioni = new Send(0);
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [250, 400], "latte parzialmente scremato", [200], 20000);
    assert(response.includes("Errore: Returned error: execution reverted: L'elemento con lotto pari a"));
  });

  it("ECCEZIONE: la somma dei contributi di CO2 supera la massima capacità", async function () {
    let accounts = await estrazione.ottieniaccounts();
    let transazioni = new Send(0);
    await transazioni.aggiungiMateriaPrima(accounts[0], 11, 60, "caffè");
    let response = await transazioni.creaProdotto(accounts[0], ["lavorazione", "trasporto"], [4294967290, 5], "latte parzialmente scremato", [11], 20000);
    assert.equal("Errore: Returned error: execution reverted: Si e' verificato un errore di overflow", response);
  });


});












describe("Trasferimento Risorsa", async function () {
  let estrazione = new Call();

  it("CORRETTO: l'utente trasferisce con successo la risorsa", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 10000);
    assert.equal("Operazione andata a buon fine", response);
  });

  it("ECCEZIONE: l'utente non può inserire il suo stesso account come ricevitore", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[0], 11);
    assert.equal("Errore: Returned error: execution reverted: Il destinatario ed il richiedente non possono coincidere", response);
  });

  it("ECCEZIONE: il ricevitore deve essere un produttore/trasformatore o cliente", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[2], 11);
    assert.equal("Errore: Returned error: execution reverted: Il destinatario deve essere un produttore, trasformatore o cliente", response);
  });

  it("ECCEZIONE: la risorsa deve appartenere al catalogo", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[2], 10);
    assert.equal("Errore: Returned error: execution reverted: Il lotto inserito non corrisponde ad una risorsa del catalogo", response);
  });

  it("ECCEZIONE: il lotto inserito non deve appartenere ad una risorsa utilizzata", async function () {
    let transazioni = new Send(0);
    let accounts = await estrazione.ottieniaccounts();
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 200);
    assert.equal("Errore: Returned error: execution reverted: Il lotto inserito non corrisponde ad una risorsa del catalogo", response);
  });

  it("ECCEZIONE: l'attore deve possedere la risorsa", async function () {
    let transazioni = new Send(1);
    let accounts = await estrazione.ottieniaccounts();
    await transazioni.aggiungiMateriaPrima(accounts[1], 400, 60, "caffè");
    transazioni = new Send(0);
    let response = await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 400);
    assert.equal("Errore: Returned error: execution reverted: Non sei in possesso della risorsa", response);
  });

});