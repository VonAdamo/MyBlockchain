import { createHash } from "../utilities/crypto.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [];
        this.createBlock("0", "0", []);
    }

    createBlock( preHash, hash, data) {

        const block = new Block(
            this.chain.length + 1, 
            preHash, 
            hash, 
            data
        )

        this.chain.push(block);
        return block;
    }

    getLastBlock(){
        return this.chain.at(-1);
    };

    hashBlock(preHash, currentBlockData){
        const stringToHash = preHash + JSON.stringify(currentBlockData);
        const hash = createHash(stringToHash);
        return hash;
    }
}