import { createHash } from "../utilities/crypto.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [];
        this.memberNodes = [];
        this.nodeUrl = process.argv[3];
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

    hashBlock(timestamp, preHash, data){
        const args = timestamp.toString() + preHash + JSON.stringify(data);
        console.log(args);
        const hash = createHash(args);
        return hash;
    };

    validateChain(blockchain) {
        let isValid = true;
    
        for(let i = 1; i < blockchain.length; i++) {
            const block = blockchain[i];
            const lastBlock = blockchain[i - 1];
            const hash = this.hashBlock(block.timestamp, lastBlock.hash, block.data);
    
            if(hash !== block.hash) {isValid = false;}
            if(block.preHash !== lastBlock.hash) {isValid = false;}
        }
        console.log("6. isValid", isValid);
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