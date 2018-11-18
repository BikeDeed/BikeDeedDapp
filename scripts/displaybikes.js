module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var BikeDeed = contract(require('../build/contracts/BikeDeed.json'));
var web3 = new Web3(provider);

const _creator = web3.eth.accounts[0];

BikeDeed.setProvider(provider);
BikeDeed.defaults({from: _creator, gas: 900000 });

const displayBikes = async () => {
  let deed = await BikeDeed.deployed();
  let deedIds = await deed.ids();

  const FIELD_SERIAL_NUMBER = 0
  const FIELD_MANUFACTURER = 1
  const FIELD_IPFS_HASH = 2
  const FIELD_DATE_CREATED = 3
  const FIELD_DATE_DELETED = 4

  let bikeStructs = []
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];
    var bikeDeed = await deed.deeds(deedId);
    const bike = {
      /*
        name:  web3.toAscii(bikeDeed[FIELD_NAME]),
        serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
        manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
        */
        name:  bikeDeed[FIELD_SERIAL_NUMBER] + bikeDeed[FIELD_MANUFACTURER],
        serialNumber: bikeDeed[FIELD_SERIAL_NUMBER],
        manufacturer: bikeDeed[FIELD_MANUFACTURER],
        ipfsHash: bikeDeed[FIELD_IPFS_HASH],
        dateCreated: bikeDeed[FIELD_DATE_CREATED],
        dateDeleted: bikeDeed[FIELD_DATE_DELETED]
    }
    bikeStructs.push(bike)
  }

  console.log('bikeStructs =', bikeStructs)

}

displayBikes();

}
