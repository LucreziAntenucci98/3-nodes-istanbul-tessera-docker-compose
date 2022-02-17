/*var cf= artifacts.require("CarbonFootprint");
var gen = artifacts.require("Generica");
var nft = artifacts.require("Gestore_nft");


module.exports = async function (deployer) {
    deployer.deploy(cf);
    deployer.link(cf,nft);
    deployer.deploy(gen);
    deployer.link(gen,nft);
    deployer.deploy(nft);
}*/

const Web3 = require('web3');
var web3;
var accounts=[];
var cf= artifacts.require("CarbonFootprint");
var gen = artifacts.require("Generica");
var nft = artifacts.require("Gestore_nft");

module.exports = async function (deployer) {
deployer.deploy(cf);
deployer.link(cf,nft);
deployer.deploy(gen);
deployer.link(gen,nft);
deployer.deploy(nft);
}
//ottengo gli address degli utenti che si connettono
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

////////////////////////////////////////////////////////////


/*var CarbonFootprint = artifacts.require("CarbonFootprint");
var Generica = artifacts.require("Generica");
var Gestore_nft = artifacts.require("Gestore_nft");

module.exports = function(deployer) {
  deployer.deploy(CarbonFootprint).then(function() {
    deployer.deploy(Generica).then(function() {
      deployer.deploy(Gestore_nft, CarbonFootprint.address,Generica.address);
    })
  });
};*/