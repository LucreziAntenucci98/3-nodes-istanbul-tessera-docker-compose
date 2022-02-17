const Web3 = require('web3');
var web3;
var accounts=[];

//ottengo gli address
async function ottieniaccounts () {
for (let i = 0; i < 3; i++) {
    web3 = new Web3('http://localhost:2200' + i);
    await web3.eth.getAccounts().then((value) => {
      accounts.push(value[0]);
    }).catch((error) => {
      console.log("Si è verificato un errore!" + error)
    });
  }
}
async function stampa (){
    await ottieniaccounts().then(()=>{
        console.log(accounts);

    });
    
}
var a=stampa();