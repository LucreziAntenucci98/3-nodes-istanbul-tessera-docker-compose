var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/network/node_modules/web3";
var file_contratto = require(path1 + "Gestore_nft.json");
var Web3 = require(path2);
var string = JSON.stringify(file_contratto);
var objectValue = JSON.parse(string);
var indirizzo_contratto = objectValue['networks']['10']['address'];
var abi = objectValue['abi'];
var bytecode = objectValue['bytecode'];
//const Web3 = require('web3');



class Estrazione {

    constructor() {}



        
        
    async ottieniaccounts () {
        var web3;
        var accounts=[];
        for (let i = 0; i < 3; i++) {
            web3 = new Web3('http://localhost:2200' + i);
            await web3.eth.getAccounts().then((value) => {
              accounts.push(value[0]);
            }).catch((error) => {
              console.log("Si è verificato un errore!" + error)
            })
          }
        return accounts  
    }
    
    
        
    getInfoByLotto(
        account,
        id_lotto

    ) {
        let web3 = new Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: account })

        simpleContract.methods.getInfoByLotto(id_lotto).call({ from: account })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((risorsa) => {
                if (risorsa != undefined) {
                    const { 0: nome, 1: CO2, 2: lotto, 3: tipologia, 4: lista_materie_prime, 5: token } = risorsa;
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
            });
    }
    getInfoByNome(
        account,
        nome
    ) {
        let web3 = new Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: account })

        simpleContract.methods.getInfoByNome(nome).call({ from: account })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((value) => {
                if (value != undefined) {
                    // restituisce un vettore molto lungo in cui sono conytenuti gli elementi con il nome scelto,
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

            });
    }

    getInfoByToken(
        account,
        id_token
    ) {
        let web3 = new Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: account })

        simpleContract.methods.getInfoByToken(id_token).call({ from: account })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            ).then((risorsa) => {
                if (risorsa != undefined) {
                    const { 0: nome, 1: CO2, 2: lotto, 3: tipologia, 4: lista_materie_prime, 5: token } = risorsa;
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
            });

    }

    OwnerbyToken(
        account,
        id_token
    ) {
        let web3 = new Web3("http://localhost:22000");
        var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: account })

        simpleContract.methods.getOwnerByToken(id_token).call({ from: account })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((receipt) => {
                console.log("ricevuta finale: ");
                console.log(receipt);
            });
    }
}


module.exports = Estrazione;