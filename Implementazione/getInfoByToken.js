var path1 = "C:/Windows/System32/network/3-nodes-istanbul-tessera-docker-compose/build/contracts/";
var path2 = "C:/Windows/System32/node_modules/web3";

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
 
    var id_token = 6; //il token corrisponde all'id della prima materia prima inserita
    
 
    var simpleContract = new web3.eth.Contract(abi,indirizzo_contratto, {from:acc})

    simpleContract.methods.getInfoByToken(id_token).call({from:acc})
    .catch((errore) => {
    console.log("erroreeeeee: " + errore.message);}
    ).then((risorsa) => {
        if(risorsa!=undefined) {
        const {0: nome, 1: CO2, 2: lotto, 3:tipologia, 4:lista_materie_prime, 5:token} = risorsa;
        console.log("nome -> " + nome); 
        console.log("CO2 -> " + CO2); 
        console.log("lotto -> " + lotto); 
        console.log("tipologia -> " + tipologia); 
        if(lista_materie_prime == "") {
            console.log("lotti materie prime utilizzate -> nessuna materia prima utilizzata");
        } 
        else {
        console.log("lotti materie prime utilizzate -> " + lista_materie_prime); 
        }        console.log("token -> " + token); 
        }
    });
    



    
    
    
 
}