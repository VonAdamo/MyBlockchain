export default class Block {
    constructor(blockIndex, preHash, hash, data) {
        this.timestamp = Date.now();
        this.blockIndex = blockIndex;
        this.preHash = preHash;
        this.hash = hash;
        this.data = data;
    }
}