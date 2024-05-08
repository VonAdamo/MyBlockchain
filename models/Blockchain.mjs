import { createHash } from "../utilities/crypto.mjs";
import Block from "./Block.mjs";

export default class Blockchain {
    constructor() {
        this.chain = [];
        this.createBlock(Date.now(), "0", "0", []);
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

    hashBlock(timestamp, preHash, data, nonce){
        const stringToHash = timestamp.toString() + preHash + JSON.stringify(data) + nonce;
        //console.log(stringToHash);
        const hash = createHash(stringToHash);
        return hash;
    };

    proofOFWork(timestamp, preHash, data){
        let nonce = 0;
        let hash = this.hashBlock(timestamp, preHash, data, nonce);

        while(hash.substring(0, 3) !== "000"){
            nonce++;
            hash = this.hashBlock(timestamp, preHash, data, nonce);
            console.log(hash);
        }
        console.log(nonce);
        return nonce;
    };
}