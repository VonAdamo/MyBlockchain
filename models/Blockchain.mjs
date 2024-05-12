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
    
    createBlock(timestamp, preHash, hash, data, nonce, difficulty) {
        
        const block = new Block(
            timestamp,
            this.chain.length + 1, 
            preHash, 
            hash, 
            data,
            nonce,
            difficulty
        );

        this.chain.push(block);
        return block;
    };

    getLastBlock(){
        return this.chain.at(-1);
    };

    hashBlock(timestamp, preHash, data, nonce, difficulty){
        const stringToHash = timestamp.toString() + preHash + JSON.stringify(data) + nonce + difficulty;
        console.log(stringToHash);
        const hash = createHash(stringToHash);
        //console.log(hash);
        return hash;
    };

    validateChain(blockchain) {
        let isValid = true;

        for(let i = 1; i < blockchain.length; i++) {
            const block = blockchain[i];
            const lastBlock = blockchain[i - 1];

            const hash = this.hashBlock( block.timestamp, lastBlock.hash, block.data );
            
            if(hash !== block.hash) isValid = false;
            if(block.preHash !== lastBlock.hash) isValid = false;
        }

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
        {
            return {nonce,difficulty,timestamp};
        }
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