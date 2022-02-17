var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/network/node_modules/web3";

// estraggo l'indirizzo, l'ABI ed il bytecode dello smart contract da chiamare
const file_contratto = require (path1+"Gestore_nft.json");
 
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
        } catch (errore){
    console.error(errore.name + ': ---' + errore.message);
};
 });
 
function estrai(acc) {
 
    var nome = "latte"; 
    
 
    var simpleContract = new web3.eth.Contract(abi,indirizzo_contratto, {from:acc})

    var owner = simpleContract.methods.getInfoByNome(nome).call({from:acc})
    .catch((errore) => {
    console.log("erroreeeeee: " + errore.message);}
    )
    .then((receipt) => {
        console.log("ricevuta finale: ");
        console.log(receipt);
    });

    
    
    
 
}