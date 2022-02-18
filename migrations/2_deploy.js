
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