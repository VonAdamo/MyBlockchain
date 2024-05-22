import { createHash } from "../utilities/crypto.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
    constructor() {
        //Blockchain
        this.chain = [];
        //Nodes - medlemmar, användare
        this.memberNodes = [];
        //Main Url - Min egen nod
        this.nodeUrl = process.argv[3];
        //Genesis Block
        this.createBlock(Date.now(), "0", "0", [], 1337, process.env.DIFFICULTY);
    }
    
    createBlock(timestamp, preHash, hash, nonce, difficulty, data) {
        
        const block = new Block(
            timestamp,
            this.chain.length + 1, 
            preHash, 
            hash, 
            nonce,
            difficulty,
            data
        );

        this.chain.push(block);
        return block;
    };

    getLastBlock(){
        return this.chain.at(-1);
    };

    hashBlock(timestamp, preHash, data, nonce, difficulty){
        const args = timestamp.toString() + preHash + JSON.stringify(data) + nonce + difficulty;
        console.log(args);
        const hash = createHash(args);
        console.log("hashBlock", hash);
        return hash;
    };

    validateChain(blockchain) {
        let isValid = true;

        console.log("inside validate chain")

        for(let i = 1; i < blockchain.length; i++) {
            const block = blockchain[i];
            console.log(block);
            const lastBlock = blockchain[i - 1];

            const hash = this.hashBlock( block.timestamp, lastBlock.hash, block.data );
            console.log("ValidateChain", hash);
            if(hash !== block.hash) isValid = false;
            console.log("lastHash", block.preHash, lastBlock.hash)
            if(block.preHash !== lastBlock.hash) isValid = false;
        }
        console.log("isValid", isValid);
        return isValid;
    };

    proofOFWork(preHash, data){
        const lastBlock = this.getLastBlock();
        let difficulty, hash, timestamp;
        let nonce = 0;
        
        do {
            nonce++;
            timestamp = Date.now();

            difficulty = this.difficultyLevel(lastBlock, timestamp);
            hash = this.hashBlock(timestamp, preHash, data, nonce, difficulty); 

        } while(hash.substring(0, difficulty) !== "0".repeat(difficulty));

        console.log("Proof of Workd", nonce,difficulty,timestamp );
            return {nonce,difficulty,timestamp};
        
    };

    difficultyLevel(lastBlock, timestamp){
        const MINE_RATE = parseInt(process.env.MINE_RATE);
        let {difficulty} = lastBlock;

        if (difficulty < 1) return 1;

        return timestamp - lastBlock.timestamp > MINE_RATE
        ? + difficulty + 1
        : + difficulty - 1; 

    }
}