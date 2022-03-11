const node_modules_path = require("./config").node_modules_path;
const contracts_path = require("./config").contracts_path;
class Send {

    constructor(nodo_selezionato) {
        this.file_contratto = require(contracts_path + "Gestore_nft.json");
        this.Web3 = require(node_modules_path+"web3");
        this.web3 = new this.Web3("http://localhost:2200" + nodo_selezionato);
        this.string = JSON.stringify(this.file_contratto);
        this.objectValue = JSON.parse(this.string);
        this.indirizzo_contratto = this.objectValue.networks['10'].address;
        this.abi = this.objectValue.abi;
    }


    // funzione che riceve l'account richiedente, l'account a cui assegnare il ruolo ed il ruolo stesso
    aggiungiAttore(account_richiedente,account,tipologia) {
        let simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente });

        // creiamo una promise in modo che quando viene chiamato questo metodo il chiamante aspetti fino a che
        // non venga attivato il resolve (cioè quando si entra nel then ed è perciò stata creata la ricevuta)
        return new Promise((resolve) => {
            // funzione dello smart contract che riceve un account ed una tipologia e se l'attore non ha già quel
            // ruolo glielo assegna, altrimenti restituisce un errore
            simpleContract.methods.aggiungiAttore(tipologia, account)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    resolve("Errore: " + errore.message);
                }).then((ricevuta) => {
                    resolve("Operazione andata a buon fine");
                });
        });
    }







    // funzione che riceve l'account richiedente, un lotto, un nome ed un valore di CO2 e crea la materia prima 
    aggiungiMateriaPrima(account_richiedente,lotto,CO2,nome) {
        let simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente });
        // creiamo una promise in modo che quando viene chiamato questo metodo il chiamante aspetti fino a che
        // non venga attivato il resolve (cioè quando si entra nel then ed è perciò stata creata la ricevuta)
        return new Promise((resolve) => {
            // funzione dello smart contract che riceve un lotto, un valore di CO2 ed un nome e crea la materia prima
            // nel caso in cui il lotto esista già, o l'attore richiedente non sia un produttore restituisce errore 
            simpleContract.methods.creaMateriaPrima(lotto, CO2, nome)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    resolve("Errore: " + errore.message);
                }).then((ricevuta) => {
                    // se non ci sono stati errori stampo la ricevuta
                    resolve("Operazione andata a buon fine");
                });
        });
    }

    trasferimentoRisorsa(account_richiedente,destinatario,lotto){
        let simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente });
        // creiamo una promise in modo che quando viene chiamato questo metodo il chiamante aspetti fino a che
        // non venga attivato il resolve (cioè quando si entra nel then ed è perciò stata creata la ricevuta)
        return new Promise((resolve) => {
            // funzione dello smart contract che riceve un lotto, un valore di CO2 ed un nome e crea la materia prima
            // nel caso in cui il lotto esista già, o l'attore richiedente non sia un produttore restituisce errore 
            simpleContract.methods.trasferimentoRisorsa(destinatario,lotto)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    resolve("Errore: " + errore.message);
                }).then((ricevuta) => {
                    // se non ci sono stati errori stampo la ricevuta
                    resolve("Operazione andata a buon fine");
                });
        });

    }



    // funzione che riceve l'account richiedente, una vettore con i nomi delle attività, un vettore con i consumi
    // delle attività, il nome del nuovo prodotto, un vettore con i lotti delle materie prime utilizzate per la
    // produzione ed il lotto del nuovo prodotto
    creaProdotto(account_richiedente,nome_attivita,consumo_attivita,nome_prodotto,materie_prime,lotto) {
        let simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente });
        // creiamo una promise in modo che quando viene chiamato questo metodo il chiamante aspetti fino a che
        // non venga attivato il resolve (cioè quando si entra nel then ed è perciò stata creata la ricevuta)
        return new Promise((resolve) => {
            // funzione dello smart contract che riceve un vettore di strighe (nomi delle attività), un vettore di 
            // interi (consumi delle attività), il nome del nuovo prodotto, un vettore di interi (lotti delle materie prime utilizzate) ed il lotto del nuovo prodotto
            // restituisce errore se il richiedente non è un trasformatore, se il lottodel nuovo prodotto è già presente nel 
            // catalogo e se il richiedente non posside le materie prime che ha inserito (o esse non esistono)
            simpleContract.methods.creaProdotto(nome_attivita, consumo_attivita, nome_prodotto, materie_prime, lotto)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    resolve("Errore: " + errore.message);
                }).then((ricevuta) => {
                    // se non ci sono stati errori stampo la ricevuta
                    resolve("Operazione andata a buon fine");
                });
        });
    }
}
module.exports = Send;