import { createHash } from "../utilities/crypto.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
    constructor() {
        //Blockchain
        this.chain = [];
        //Nodes
        this.nodes = [];
        //NodeUrl
        this.nodeUrl = process.argv[3];
        //Genesis Block
        this.createBlock(Date.now(), "0", "0", [],);
    }

    createBlock(timestamp, preHash, hash, data) {

        const block = new Block(
            timestamp,
            this.chain.length + 1, 
            preHash, 
            hash, 
            data
        );

        this.chain.push(block);
        return block;
    };

    getLastBlock(){
        return this.chain.at(-1);
    };

    hashBlock(timestamp, preHash, data, nonce, difficulty){
        const stringToHash = timestamp.toString() + preHash + JSON.stringify(data) + nonce + difficulty;
        //console.log(stringToHash);
        const hash = createHash(stringToHash);
        return hash;
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
        const MINE_RATE = process.env.MINE_RATE;
        let {difficulty} = lastBlock;

        if (difficulty < 1) return 1;

        return timestamp - lastBlock.timestamp > MINE_RATE
        ? + difficulty + 1
        : + difficulty - 1; 
    }
}