// MintCoin - Cryptocurrency

const SHA256 = require('crypto-js/sha256')

class Transactions {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// creating a single block
class Block{
    constructor(timestamp,transactions,previousHash='') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;         // used in proof of work
    }
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // check if hash starts with enough zeros.
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash()
        }

        console.log("Block mined: " + this.hash)
    }
}

// proof of work/mining
// blockchain
class Blockchain{
    constructor() {
        this.chain=[this.createGenesisBlock()]
        this.difficulty = 2;
        this.pendingTransactions = [];
        // mining rewards
        this.miningReward = 100
    }
    createGenesisBlock() {
        return new Block(Date.parse('2022-03-20'),"Genesis","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    minePendingTransactions(miningRewardAddress /* wallet address of the miner for giving reward*/) {

        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        //console.log("Block : ",block)
        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions=[
            new Transactions(null,miningRewardAddress,this.miningReward)
        ]
        //console.log("Pending transactions : ",this.pendingTransactions)
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    // balance is never stored, we have to get it from the blockchain where it is stored.
    // we have to go through all the transactions involved in our address and calculate it.
    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            // console.log("Const block of this.chain : ",block)
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for(let i=1;i<this.chain.length;i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash!==currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.previousHash!==previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
}


let mintCoin = new Blockchain();
// console.log("Mining Block 1...")
// mintCoin.addBlock(new Block("20/03/2022", {Name:"Avadhoot",Age:20,Id:"T123"}));
// console.log("Mining Block 2...")
// mintCoin.addBlock(new Block("20/03/2022", {Name:"Aneesh",Age:21,Id:"T130"}));

//console.log("Is blockchain valid? " + mintCoin.isChainValid())

// console.log(JSON.stringify(mintCoin, null, 4));

mintCoin.createTransaction(new Transactions('address1','address2',500));
mintCoin.createTransaction(new Transactions('address2','address1',250));

console.log('\nStarting the miner...')

mintCoin.minePendingTransactions('addys-address')

console.log("\nBalance of addy is : ",mintCoin.getBalanceOfAddress('addys-address'))

console.log('\nStarting the miner again...')

// reward is not given to the miner until we mine the pending transaction of the miner.
mintCoin.minePendingTransactions('addys-address')

console.log("\nBalance of addy is : ",mintCoin.getBalanceOfAddress('addys-address'))



