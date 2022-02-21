class Call {

    constructor() {
        this.path1 = "/Users/alessandro/Documents/vscode/CarbonFootprint_Project/network/prova/build/contracts/";
        this.path2 = "/Users/alessandro/Documents/vscode/CarbonFootprint_Project/node_modules/web3";
        this.file_contratto = require(this.path1 + "Gestore_nft.json");
        this.Web3 = require(this.path2);
        this.string = JSON.stringify(this.file_contratto);
        this.objectValue = JSON.parse(this.string);
        this.indirizzo_contratto = this.objectValue['networks']['10']['address'];
        this.abi = this.objectValue['abi'];
    }




    // funzione che restituisce i 3 account collegati ai 3 nodi
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





    // riceve il lotto ed il richiedente e ritorna le informazioni relative alla risorsa con quel lotto
    getInfoByLotto(account_richiedente,lotto){
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })
        
        // uso la promise affinché chi chiama la funzione possa usare await per aspettare che termini l'esecuzione
        return new Promise((resolve) => {
            // funzione dello smart contract che prende un lotto e ritorna le info della risorsa con quel lotto
            // se il lotto non appartiene a nessuna risorsa allora restituisce un errore
            simpleContract.methods.getInfoByLotto(lotto).call({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Errore: " + errore.message);
                })
                .then((risorsa) => {
                    // chiamo la funzione che formatta i dati restituiti dalla chiamata allo smart contract
                    this.stampa_risorsa(risorsa)
                    resolve();
                });
            //parentesi che chiude la "return new promise"
        })

    }











    // riceve il nome ed il richiedente e ritorna la lista di risorse con quel nome
    getInfoByNome(account_richiedente,nome) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        // uso la promise affinché chi chiama la funzione possa usare await per aspettare che termini l'esecuzione
        return new Promise((resolve) => {
            // funzione dello smart contract che prende un nome e ritorna una lista di info con un elemento per
            // ogni risorsa con quel nome 
            simpleContract.methods.getInfoByNome(nome).call({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Ops, qualcosa è andato storto: " + errore.message);
                })
                .then((value) => {
                    if (value != undefined) {
                        // la chiamata allo smart contract restituisce un vettore molto lungo in cui sono contenuti gli 
                        // elementi con il nome scelto, piu degli elementi vuoti 
                        // perciò ciclo fino a che non arrivo ad avere un elemento vuoto, da li in poi sono tutti vuoti
                        var altri = true;
                        var i = 0;
                        for(i; altri==true; i++) {
                            try {
                                //eliminiamo gli elementi vuoti (cioè quelli che hanno [8], exists, = false)
                                // se l'elemento corrente è vuoto allora mi fermo
                                if (value[i][8] == false) {
                                    altri = false;
                                }
                                else {
                                    // se l'elemento corrente non è vuoto (cioè non entro nell'if), allora stampo 
                                    // il prodotto/materia prima corrente
                                    console.log("---------------------");
                                    // chiamo la funzione che formatta i dati restituiti dalla chiamata allo smart contract
                                    this.stampa_risorsa(value[i])
                                    console.log("---------------------");

                                };
                            } catch (error) {
                                // se c'è un errore termino la stampa delle informazioni
                                altri = false;
                            }
                        }
                        console.log("In totale è stato trovato un numero pari a " + --i + " di materie prime/prodotti");
                    }
                    resolve()
                });
            //parentesi che chiude la "return new promise"
        })
    }







    // riceve il token ed il richiedente e ritorna le informazioni relative alla risorsa con quel token
        getInfoByToken(account_richiedente,id_token){
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        // uso la promise affinché chi chiama la funzione possa usare await per aspettare che termini l'esecuzione
        return new Promise((resolve) => {
                        // funzione dello smart contract che prende il token e ritorna le info della risorsa con quel token
                        // se il token non appartiene a nessuna risorsa allora restituisce un errore
                        simpleContract.methods.getInfoByToken(id_token).call({ from: account_richiedente })
                .catch((errore) => {
                    console.log("erroreeeeee: " + errore.message);
                }
                ).then((risorsa) => {
                    // chiamo la funzione che formatta i dati restituiti dalla chiamata allo smart contract
                    this.stampa_risorsa(risorsa)
                    resolve()
                });
            //parentesi che chiude la "return new promise"
        })
    }








    getOwnerByToken(account_richiedente,id_token) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto, { from: account_richiedente })

        // uso la promise affinché chi chiama la funzione possa usare await per aspettare che termini l'esecuzione
        return new Promise((resolve) => {
                        // funzione dello smart contract che prende un token e ritorna l'address del possessore
            // se il token non appartiene a nessuna risorsa allora restituisce un errore

            simpleContract.methods.getOwnerByToken(id_token).call({ from: account_richiedente })
                .catch((errore) => {
                    console.log("Errore: " + errore.message);
                }
                )
                .then((receipt) => {
                    // se non c'è stato alcun errore stampo la ricevuta (cioè l'indirizzo del possessore)
                    if (receipt != undefined) console.log(receipt)
                    resolve();
                });
            //parentesi che chiude la "return new promise"
        })
    }







    // funzione che riceve un indirizzo da controllare ed un ruolo e ritorna falso se l'indirizzo ha già quel ruolo
    controlloRuolo(indirizzo_da_controllare,ruolo) {
        let web3 = new this.Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(this.abi, this.indirizzo_contratto)

        // uso la promise affinché chi chiama la funzione possa usare await per aspettare che termini l'esecuzione
        return new Promise((resolve) => {
            // funzione dello smart contract che restituisce vero se l'attore non ha quel ruolo
            simpleContract.methods.nonEsistente(ruolo, indirizzo_da_controllare).call()
                .catch((errore) => {
                    console.log("Errore: " + errore.message);
                }
                )
                .then((receipt) => {
                    // ritorna false se l'indirizzo ha il ruolo passato 
                    resolve(receipt);
                });
            //parentesi che chiude la "return new promise"
        })
    }





    // funzione per formattare i risultati forniti dalle call
    stampa_risorsa(risorsa) {
        if (risorsa != undefined) {
            // andiamo a scomporre la risorsa in 7 attributi in modo da poterli manipolare separatamente
            const { 0: nome, 1: lotto, 2: nomi_attivita, 3: consumi_attivita, 4: CO2, 5: tipologia, 6: lista_materie_prime, 7: token } = risorsa;
            console.log("nome -> " + nome);
            console.log("CO2_totale -> " + CO2);
            console.log("token -> " + token);
            console.log("lotto -> " + lotto);
            console.log("tipologia -> " + tipologia);

            // nel caso in cui le attivita, i consumi o la lista materie prime siano vuote
            // scriviamo che non esitono
            if (nomi_attivita == "") {
                console.log("lista attivita svolte -> nessuna attivita svolta");
            }
            else {
                console.log("lista attivita svolte -> " + nomi_attivita);
            }

            if (consumi_attivita == "") {
                console.log("lista consumi attivita svolte -> nessun consumo disponibile");
            }
            else {
                console.log("lista consumi attivita svolte -> " + consumi_attivita);
            }

            if (lista_materie_prime == "") {
                console.log("lotti materie prime utilizzate -> nessuna materia prima utilizzata");
            }
            else {
                console.log("lotti materie prime utilizzate -> " + lista_materie_prime);
            }
        }
    }


}


module.exports = Call;