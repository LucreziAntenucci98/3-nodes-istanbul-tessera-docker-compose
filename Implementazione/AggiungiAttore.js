var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/node_modules/web3";

const file_contratto = require (path1+"Gestore_nft.json");

const string = JSON.stringify(file_contratto);
const objectValue = JSON.parse(string);
const indirizzo_contratto = objectValue['networks']['10']['address'];
const abi = objectValue['abi'];
const bytecode = objectValue['bytecode'];
console.log(objectValue['networks']['10']['address']);
 
//collegamento al nodo 1
const Web3 = require(path2);
 
let web3 = new Web3("http://localhost:22000")

//operazione svolta con l'account 1 del nodo 1
web3.eth.getAccounts().then((valore) => {
    try {
        aggiungi(valore[0]);
        } catch (errore){
    console.error(errore.name + ': ---' + errore.message);
};
 });
//creo un contratto finto , chiama il metodo aggiungi attore
function aggiungi(acc) {
 
    var simpleContract = new web3.eth.Contract(abi,indirizzo_contratto, {from:acc})

    simpleContract.methods.aggiungiAttore("produttore",acc)  //produttore,trasformatore,cliente
    .send({from:acc})
    .on('receipt', function(receipt){ //evento che si verifica alla ricezione della ricevuta(ottenuta dall'operazione del 1 nodo)
    // receipt example
    console.log(receipt);
    })
    .catch((errore) => {
    console.log("erroreeeeee: " + errore.message);}
    )
    .then((receipt) => { //operazione andata a buon fine 
        console.log("ricevuta finale: ")
        console.log(receipt);
    });
 
}