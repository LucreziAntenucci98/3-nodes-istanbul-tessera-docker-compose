var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/node_modules/web3";

// estraggo l'indirizzo, l'ABI ed il bytecode dello smart contract da chiamare
const file_contratto = require(path1 + "Gestore_nft.json");

const string = JSON.stringify(file_contratto); //trasformo il contratto in stringa
const objectValue = JSON.parse(string); //trasformo in array
const indirizzo_contratto = objectValue['networks']['10']['address']; //chiavi dell'array
const abi = objectValue['abi'];
const bytecode = objectValue['bytecode'];
//console.log(objectValue['networks']['10']['address']);

//collegamento al nodo 1
const Web3 = require(path2);

let web3 = new Web3("http://localhost:22000");


//operazione svolta con l'account 1 del nodo 1
web3.eth.getAccounts().then((valore) => {
    try {
        estrai(valore[0]);
    } catch (errore) {
        console.error(errore.name + ': ---' + errore.message);
    };
});

function estrai(acc) {

    var nome = "colazione";


    var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: acc })

    var owner = simpleContract.methods.getInfoByNome(nome).call({ from: acc })
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
                            if(value[i][4] == "") {
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