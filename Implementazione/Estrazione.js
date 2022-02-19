class Estrazione {

    constructor() {
        this.path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
        this.path2 = "C:/Windows/System32/node_modules/web3";
        this.file_contratto = require(this.path1 + "Gestore_nft.json");
        this.Web3 = require(this.path2);
        this.string = JSON.stringify(this.file_contratto);
        this.objectValue = JSON.parse(this.string);
        this.indirizzo_contratto = this.objectValue['networks']['10']['address'];
        this.abi = this.objectValue['abi'];
    }





    async ottieniaccounts() {
        var web3;
        var accounts = [];
        for (let i = 0; i < 3; i++) {
            web3 = new this.Web3('http://localhost:2200' + i);
            await web3.eth.getAccounts().then((value) => {
                accounts.push(value[0]);
            }).catch((error) => {
                console.log("Si è verificato un errore!" + error)
            })
        }
        return accounts
    }



    getInfoByLotto(
        account_richiedente,
        id_lotto

    ) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })
        return new Promise((resolve) => {
        simpleContract.methods.getInfoByLotto(id_lotto).call({ from: account_richiedente })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((risorsa) => {
                if (risorsa != undefined) {
                    const { 0: nome, 1: lotto, 2: CO2, 3: tipologia, 4: lista_materie_prime, 5: token } = risorsa;
                    console.log("nome -> " + nome);
                    console.log("CO2 -> " + CO2);
                    console.log("lotto -> " + lotto);
                    console.log("tipologia -> " + tipologia);
                    if (lista_materie_prime == "") {
                        console.log("lotti materie prime utilizzate -> nessuna materia prima utilizzata");
                    }
                    else {
                        console.log("lotti materie prime utilizzate -> " + lista_materie_prime);
                    }
                    console.log("token -> " + token);
                    
                }
                resolve();});
    })}
    getInfoByNome(
        account_richiedente,
        nome
    ) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        return new Promise((resolve) => {
        simpleContract.methods.getInfoByNome(nome).call({ from: account_richiedente })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((value) => {
                if (value != undefined) {
                    // restituisce un vettore molto lungo in cui sono conttenuti gli elementi con il nome scelto,
                    // piu degli elementi vuoti, perciò andiamo a togliere le parti che non interessano, cioè eliminiamo
                    // gli elementi che non esistono (cioè quelli che hanno [6] = false)
                    var altri = true;
                    var i = 0;
                    while (altri) {
                        try {
                            if (value[i][6] == false) {
                                altri = false;
                            }
                            else {
                                console.log("---------------------");
                                console.log("nome -> " + value[i][0]);
                                console.log("lotto -> " + value[i][1]);
                                console.log("CO2 -> " + value[i][2]);
                                console.log("tipologia -> " + value[i][3]);
                                if (value[i][4] == "") {
                                    console.log("lotti materie prime utilizzate -> nessuna materia prima utilizzata");
                                }
                                else {
                                    console.log("lotti materie prime utilizzate -> " + value[i][4]);
                                }
                                console.log("token -> " + value[i][5]);
                                console.log("---------------------");

                            };
                        } catch (error) {
                            altri = false;
                        }
                        i++

                    }

                    console.log("In totale è stato trovato un numero pari a " + --i + " di materie prime/prodotti");
                }
resolve()
            });
    })}

    getInfoByToken(
        account_richiedente,
        id_token
    ) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        return new Promise((resolve) => {
        simpleContract.methods.getInfoByToken(id_token).call({ from: account_richiedente })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            ).then((risorsa) => {
                if (risorsa != undefined) {
                    const { 0: nome, 1: lotto, 2: CO2, 3: tipologia, 4: lista_materie_prime, 5: token } = risorsa;
                    console.log("nome -> " + nome);
                    console.log("CO2 -> " + CO2);
                    console.log("lotto -> " + lotto);
                    console.log("tipologia -> " + tipologia);
                    if (lista_materie_prime == "") {
                        console.log("lotti materie prime utilizzate -> nessuna materia prima utilizzata");
                    }
                    else {
                        console.log("lotti materie prime utilizzate -> " + lista_materie_prime);
                    } console.log("token -> " + token);
                }
            resolve()});

    })}

    getOwnerByToken(
        account_richiedente,
        id_token
    ) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        return new Promise((resolve) => {
        simpleContract.methods.getOwnerByToken(id_token).call({ from: account_richiedente })
            .catch((errore) => {
                console.log("errore: " + errore.message);
            }
            )
            .then((receipt) => {
                console.log(receipt)
                resolve();
            });
    })}


    
    controlloRuolo(
        indirizzo_da_controllare,
        ruolo
    ) {

        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto)

        return new Promise((resolve) => {
        simpleContract.methods.nonEsistente(ruolo, indirizzo_da_controllare).call()
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((receipt) => {
                // ritorna false se l'indirizzo ha il ruolo passato 
                resolve(receipt);
            });
    })}


}


module.exports = Estrazione;