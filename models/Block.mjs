export default class Block {
    constructor(timestamp, blockIndex, preHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp,
        this.blockIndex = blockIndex;
        this.preHash = preHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || +process.env.DIFFICULTY;
    }
}