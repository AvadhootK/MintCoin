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
        // hash of the block will not change if we do not change the contents of the block.
        // hence, nonce is used to change the contents and does not do anything.
        this.nonce = 0;         // used in proof of work
        this.hash = this.calculateHash();
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
        this.difficulty = 4;
        this.pendingTransactions = [];
        // mining rewards
        this.miningReward = 100
    }
    createGenesisBlock() {
        return new Block(Date.parse('2022-03-20'),[],"0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    minePendingTransactions(miningRewardAddress /* wallet address of the miner for giving reward*/) {

        const rewardTx = new Transactions(null,miningRewardAddress,this.miningReward)
        this.pendingTransactions.push(rewardTx)

        //console.log("Pending transactions before : ",this.pendingTransactions)

        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        //console.log("Block : ",block)
        console.log("Block successfully mined!");
        this.chain.push(block);

        console.log("Chain : ", this.chain)

        this.pendingTransactions=[]
        //console.log("Pending transactions after : ",this.pendingTransactions)
    }

    addTransaction(transaction) {

        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address')
        }

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

module.exports.Blockchain = Blockchain;
module.exports.Transactions = Transactions