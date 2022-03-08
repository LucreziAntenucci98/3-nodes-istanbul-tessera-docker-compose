const Call = require("../Implementazione/call");
const Send = require("../Implementazione/send");
const sinon = require("sinon");
const assert = require("assert");




describe("Inserimento attore", async function () {

  var estrazione = new Call();
  it("CORRETTO: l'account 1 assegna a se stesso il ruolo di produttore", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiAttore(accounts[0], accounts[0], "produttore")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Operazione andata a buon fine"));
    console.log("ciaociao")
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE:l'account 1 ha già assegnato a se stesso il ruolo di produttore", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiAttore(accounts[0], accounts[0], "produttore")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Account gia' presente con questo ruolo"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: l'account 2 non può assegnare ruoli", async function () {
    var transazioni = new Send(1);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiAttore(accounts[1], accounts[1], "produttore")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Ownable: caller is not the owner"));
    // restore the original function
    stub.restore();
  });

});










describe("Inserimento materia prima", async function () {

  var estrazione = new Call();
  it("CORRETTO: l'account è un produttore, perciò può inserire materia prime", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[0], 200, 250, "latte")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Operazione andata a buon fine"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: l'account non è un produttore, perciò non può inserire materia prime", async function () {
    var transazioni = new Send(1);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[1], 100, 250, "cioccolato")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Solo i produttori possono aggiungere materie prime"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: inserimento di una materia prima con lotto già presente", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[0], 200, 50, "cioccolato")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Id lotto gia' presente"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: inserimento di una materia prima con lotto pari a 0", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[0], 0, 60, "caffè")
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Id lotto non valido"));
    // restore the original function
    stub.restore();
  });})










  describe("Aggiunta Prodotto Trasformato", async function () {
    var estrazione = new Call();

  it("CORRETTO: l'account è un trasformatore, perciò può inserire prodotti trasformati", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiAttore(accounts[0], accounts[0], "trasformatore")
    stub.restore();
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [200], 10000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Operazione andata a buon fine"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: errore perché l'attore inserisce un numero di materie prime uguale di 5", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto","attività3","attività4","attività5"], [250,400,100,300,200], "latte parzialmente scremato", [200], 10000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Errore nell'inserimento del numero di materie prime o di attivita'"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: viene inserito un lotto già presente", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [200], 200)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Il lotto inserito e' gia' presente"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: l'account non è un trasformatore, perciò non può inserire prodotti trasformati", async function () {
    var transazioni = new Send(1);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[1], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [200], 20000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Solo i trasformatori possono aggiungere un prodotto trasformato"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: una delle materie prime utilizzate non è presente", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [34], 20000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Materia prima non presente"));
    // restore the original function
    stub.restore();});

    it("ECCEZIONE: una delle materie prime utilizzate non è in possesso del richiedente", async function () {
      var transazioni = new Send(0);
      var accounts = await estrazione.ottieniaccounts();
      // controllo i valori stampati nella console
      let stub = sinon.stub(console, "log");
      await transazioni.aggiungiAttore(accounts[0], accounts[1], "produttore")
      var transazioni = new Send(1);
      await transazioni.aggiungiMateriaPrima(accounts[1], 222, 60, "caffè")
      stub.restore();
      var transazioni = new Send(0);
      stub = sinon.stub(console, "log");
      await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [222], 20000)
      // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
      assert(stub.calledWith(sinon.match("Errore: Returned error: execution reverted: Non sei in possesso della materia prima con lotto")));
      // restore the original function
      stub.restore();
  });

  it("ECCEZIONE: uno dei lotti inseriti non corrisponde ad una materia prima", async function () {
  var accounts = await estrazione.ottieniaccounts();
    var transazioni = new Send(0);
    // controllo i valori stampati nella console
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [250,400], "latte parzialmente scremato", [200], 20000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith(sinon.match("Errore: Returned error: execution reverted: L'elemento con lotto pari a")));
    // restore the original function
    stub.restore();
  })

  it("ECCEZIONE: la somma dei contributi di CO2 supera la massima capacità", async function () {
  var accounts = await estrazione.ottieniaccounts();
  // controllo i valori stampati nella console
    var transazioni = new Send(0);
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[0], 11, 60, "caffè")
    stub.restore();
    stub = sinon.stub(console, "log");
    await transazioni.creaProdotto(accounts[0], ["lavorazione","trasporto"], [4294967290,5], "latte parzialmente scremato", [11], 20000)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Si e' verificato un errore di overflow"));
    // restore the original function
    stub.restore();
  })


})












  describe("Trasferimento Risorsa", async function () {
    var estrazione = new Call();

    it("CORRETTO: l'utente trasferisce con successo la risorsa", async function () {
      var transazioni = new Send(0);
      var accounts = await estrazione.ottieniaccounts();
      stub = sinon.stub(console, "log");
      await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 10000)
      // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
      assert(stub.calledWith("Operazione andata a buon fine"));
      // restore the original function
      stub.restore();
    });

    it("ECCEZIONE: l'utente non può inserire il suo stesso account come ricevitore", async function () {
      var transazioni = new Send(0);
      var accounts = await estrazione.ottieniaccounts();
      // controllo i valori stampati nella console
      let stub = sinon.stub(console, "log");
      await transazioni.trasferimentoRisorsa(accounts[0], accounts[0], 11)
      // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
      assert(stub.calledWith("Errore: Returned error: execution reverted: Il destinatario ed il richiedente non possono coincidere"));
      // restore the original function
      stub.restore();
    });

    it("ECCEZIONE: il ricevitore deve essere un produttore/trasformatore o cliente", async function () {
      var transazioni = new Send(0);
      var accounts = await estrazione.ottieniaccounts();
      // controllo i valori stampati nella console
      let stub = sinon.stub(console, "log");
      await transazioni.trasferimentoRisorsa(accounts[0], accounts[2], 11)
      // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
      assert(stub.calledWith("Errore: Returned error: execution reverted: Il destinatario deve essere un produttore, trasformatore o cliente"));
      // restore the original function
      stub.restore();
    });

  it("ECCEZIONE: la risorsa deve appartenere al catalogo", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.trasferimentoRisorsa(accounts[0], accounts[2], 10)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Il lotto inserito non corrisponde ad una risorsa del catalogo"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: il lotto inserito non deve appartenere ad una risorsa utilizzata", async function () {
    var transazioni = new Send(0);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 200)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Il lotto inserito non corrisponde ad una risorsa del catalogo"));
    // restore the original function
    stub.restore();
  });

  it("ECCEZIONE: l'attore deve possedere la risorsa", async function () {
    var transazioni = new Send(1);
    var accounts = await estrazione.ottieniaccounts();
    // controllo i valori stampati nella console
    let stub = sinon.stub(console, "log");
    await transazioni.aggiungiMateriaPrima(accounts[1], 400, 60, "caffè")
    stub.restore();
    transazioni = new Send(0);
    stub = sinon.stub(console, "log");
    await transazioni.trasferimentoRisorsa(accounts[0], accounts[1], 400)
    // il metodo restituisce vero se l'argomento passato tra parentesi corrisponde ai valori stampati in precedenza sulla console
    assert(stub.calledWith("Errore: Returned error: execution reverted: Non sei in possesso della risorsa"));
    // restore the original function
    stub.restore();
  });


})



