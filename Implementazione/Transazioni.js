var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/network/node_modules/web3";
var file_contratto = require(path1 + "Gestore_nft.json");
var Web3 = require(path2);
var string = JSON.stringify(file_contratto);
var objectValue = JSON.parse(string);
var indirizzo_contratto = objectValue['networks']['10']['address'];
var abi = objectValue['abi'];
var bytecode = objectValue['bytecode'];

class Transazioni {

    constructor() {
       
    }

    aggiungiAttore(
        account,
        tipologia
    ) {
        let web3 = new Web3("http://localhost:22000")

        var simpleContract = new web3.eth.Contract(abi, indirizzo_contratto, { from: account })

        simpleContract.methods.aggiungiAttore(tipologia, account)  //produttore,trasformatore,cliente
            .send({ from: account })
            .on('receipt', function (receipt) { //evento che si verifica alla ricezione della ricevuta(ottenuta dall'operazione del 1 nodo)
                // receipt example
                console.log(receipt);
            })
            .catch((errore) => {
                console.log("erroreeeeee: " + errore.message);
            }
            )
            .then((receipt) => { //operazione andata a buon fine 
                console.log("ricevuta finale: ")
                console.log(receipt);
            });

    }

aggiungiMateriaPrima (
    account,
    id_lotto,
    CO2,
    nome
)


{
    
    let web3 = new Web3("http://localhost:22000")
    var simpleContract = new web3.eth.Contract(abi,indirizzo_contratto, {from:account})

    simpleContract.methods.creaMateriaPrima(id_lotto,CO2,nome)
    .send({from:account})
    .on('receipt', function(receipt){
    // receipt example
    console.log(receipt);
    })
    .catch((errore) => {
    console.log("erroreeeeee: " + errore.message);}
    )
    .then((receipt) => {
        console.log("ricevuta finale: ");
        console.log(receipt);
    });
 
    
    

}

creaProdotto(
     account,
     nome_attivita,
     consumo_attivita,
     nome_prodotto,
     materie_prime, 
     id_lotto)

     {
        let web3 = new Web3("http://localhost:22000")
        var simpleContract = new web3.eth.Contract(abi,indirizzo_contratto, {from:account})

        simpleContract.methods.creaProdotto(nome_attivita,consumo_attivita,nome_prodotto,materie_prime,id_lotto)
        .send({from:account})
        .on('receipt', function(receipt){
        // receipt example
        console.log(receipt);
        })
        .catch((errore) => {
        console.log("erroreeeeee: " + errore.message);}
        )
        .then((receipt) => {
            console.log("ricevuta finale: ");
            console.log(receipt);
        });
     
        
        
     }


}


module.exports = Transazioni;
