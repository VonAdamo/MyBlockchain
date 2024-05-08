export default class Block {
    constructor(timestamp, blockIndex, preHash, hash, data, difficulty) {
        this.timestamp = timestamp,
        this.blockIndex = blockIndex;
        this.preHash = preHash;
        this.hash = hash;
        this.data = data;
        this.difficulty = difficulty || + process.env.DIFFICULTY;
    }
}