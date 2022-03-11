const form = require('../Implementazione/form');
const assert = require('../node_modules/assert')

  describe("testing del validatore_nome", async function () {
  
      it(`CORRETTO: validatore_nome`, () => {
        let nome = "latte";
        assert.equal(form.validatore_nome(nome),true)
      });


    it(`ECCEZIONE: validatore_nome (nome con carattere speciale)`, () => {
        let nome = "latt'e";
        assert.equal(form.validatore_nome(nome),"Sono ammesse lettere dalla A alla Z e numeri da 0 a 9")
      });


      it(`ECCEZIONE: validatore_nome (nome non inserito)`, () => {
        let nome = "";
        assert.equal(form.validatore_nome(nome),"Inserire un nome con meno di 32 caratteri")
      });

      it(`ECCEZIONE: validatore_nome (nome più di 32 caratteri)`, () => {
        let nome = "latteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        assert.equal(form.validatore_nome(nome),"Inserire un nome con meno di 32 caratteri")
      });
    });



    describe("testing del validatore_lotto", async function () {

      it(`CORRETTO: validatore_lotto`, () => {
        let lotto = 100;
        assert.equal(form.validatore_lotto(lotto),true)
      });


      it(`ECCEZIONE: validatore_lotto (lotto non numerico)`, () => {
        let lotto = "100ddddd";
        assert.equal(form.validatore_lotto(lotto),"Inserire un intero > 0 e minore di 2^256-1")
      });

      it(`ECCEZIONE: validatore_lotto (lotto non è un numero intero)`, () => {
        let lotto = "10.4";
        assert.equal(form.validatore_lotto(lotto),"Inserire un intero > 0 e minore di 2^256-1")
      });


      it(`ECCEZIONE: validatore_lotto (lotto superiore alla massima dimensione)`, () => {
        let lotto = 100000000000000000000000000000000000000000000000000000000000000000000000000;
        assert.equal(form.validatore_lotto(lotto),"Inserire un intero > 0 e minore di 2^256-1")
      });

      it(`ECCEZIONE: validatore_lotto (lotto minore di 1)`, () => {
        let lotto = 0;
        assert.equal(form.validatore_lotto(lotto),"Inserire un intero > 0 e minore di 2^256-1")
      });

    });






    describe("testing del validatore_CO2", async function () {


      it(`CORRETTO: validatore_CO2`, () => {
        let CO2 = 345;
        assert.equal(form.validatore_CO2(CO2),true)
      });

      it(`ECCEZIONE: validatore_CO2 (CO2 non numerico)`, () => {
        let CO2 = "345vv";
        assert.equal(form.validatore_CO2(CO2),"Inserire un intero positivo a 32 bit")
      });

      it(`ECCEZIONE: validatore_CO2 (CO2 non è un numero intero)`, () => {
        let CO2 = "6.8";
        assert.equal(form.validatore_CO2(CO2),"Inserire un intero positivo a 32 bit")
      });


      it(`ECCEZIONE: validatore_CO2 (CO2 superiore alla massima dimensione)`, () => {
        let CO2 = 3459999999999999;
        assert.equal(form.validatore_CO2(CO2),"Inserire un intero positivo a 32 bit")
      });

      it(`ECCEZIONE: validatore_CO2 (CO2 minore di 1)`, () => {
        let CO2 = 0;
        assert.equal(form.validatore_CO2(CO2),"Inserire un intero positivo a 32 bit")
      });

  });