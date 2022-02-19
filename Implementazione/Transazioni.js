

class Transazioni {

    constructor(nodo_selezionato) {
        this.path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
        this.path2 = "C:/Windows/System32/node_modules/web3";
        this.file_contratto = require(this.path1 + "Gestore_nft.json");
        this.Web3 = require(this.path2);
        this.web3 = new this.Web3("http://localhost:2200" + nodo_selezionato);
        this.string = JSON.stringify(this.file_contratto);
        this.objectValue = JSON.parse(this.string);
        this.indirizzo_contratto = this.objectValue['networks']['10']['address'];
        this.abi = this.objectValue['abi'];
    }

    aggiungiAttore(
        account_richiedente,
        account,
        tipologia
    ) {

        var simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        // creiamo una promise in modo che quando viene chiamato questo metodo il chiamante aspetti fino a che
        // non venga attivato il resolve (cioè quando si entra nel then ed è perciò stata creata la ricevuta)
        return new Promise((resolve) => {
            simpleContract.methods.aggiungiAttore(tipologia, account)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Ops, sembra che qualcosa sia andato storto: " + errore.message);
                }).then((ricevuta) => {
                    if (ricevuta != undefined) console.log(ricevuta)
                    resolve()
                });
        })
    }

    aggiungiMateriaPrima(
        account_richiedente,
        id_lotto,
        CO2,
        nome
    ) {

        var simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        return new Promise((resolve) => {
            simpleContract.methods.creaMateriaPrima(id_lotto, CO2, nome)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Ops, sembra che qualcosa sia andato storto: " + errore.message);
                }).then((ricevuta) => {
                    if (ricevuta != undefined) console.log(ricevuta)
                    resolve()
                });
        })
    }

    creaProdotto(
        account_richiedente,
        nome_attivita,
        consumo_attivita,
        nome_prodotto,
        materie_prime,
        id_lotto) {
        var simpleContract = new this.web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        console.log(nome_attivita)
        console.log(consumo_attivita)
        console.log(nome_prodotto)
        console.log(materie_prime)
        console.log(id_lotto)

        return new Promise((resolve) => {
            simpleContract.methods.creaProdotto(nome_attivita, consumo_attivita, nome_prodotto, materie_prime, id_lotto)
                .send({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Ops, sembra che qualcosa sia andato storto: " + errore.message);
                }).then((ricevuta) => {
                    if (ricevuta != undefined) console.log(ricevuta)
                    resolve()
                });
        })



    }


}


module.exports = Transazioni;
