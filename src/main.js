const {Blockchain,Transactions} = require('./Blockchain')

let mintCoin = new Blockchain();
// console.log("Mining Block 1...")
// mintCoin.addBlock(new Block("20/03/2022", {Name:"Avadhoot",Age:20,Id:"T123"}));
// console.log("Mining Block 2...")
// mintCoin.addBlock(new Block("20/03/2022", {Name:"Aneesh",Age:21,Id:"T130"}));

//console.log("Is blockchain valid? " + mintCoin.isChainValid())

// console.log(JSON.stringify(mintCoin, null, 4));

mintCoin.addTransaction(new Transactions('address1','address2',500));
mintCoin.addTransaction(new Transactions('address2','addys-address',250));

console.log('\nStarting the miner...')

mintCoin.minePendingTransactions('addys-address')

console.log("\nBalance of addy is : ",mintCoin.getBalanceOfAddress('addys-address'))

console.log("Is chain valid?" , mintCoin.isChainValid())

console.log('\nStarting the miner again...')

// reward is not given to the miner until we mine the pending transaction of the miner.
mintCoin.minePendingTransactions('addys-address')

console.log("\nBalance of addy is : ",mintCoin.getBalanceOfAddress('addys-address'))

// tampering with the blockchain
mintCoin.chain[1].transactions[0].amount = 1

console.log("Is chain valid?" , mintCoin.isChainValid())

