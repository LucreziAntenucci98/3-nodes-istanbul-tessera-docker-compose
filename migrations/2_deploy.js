
const footprint= artifacts.require("CarbonFootprint");
const generica = artifacts.require("Generica");
const gestore = artifacts.require("Gestore_nft");

module.exports = async function (deployer) {
deployer.deploy(footprint);
deployer.link(footprint,gestore);
deployer.deploy(generica);
deployer.link(generica,gestore);
deployer.deploy(gestore);
}