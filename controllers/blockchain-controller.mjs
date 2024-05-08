import { blockchain } from "../startup.mjs";

const fetchBlockchain =(req, res, next) => {
    res.status(200).json({ message: "Blockchain fetched successfully", success: true, count: blockchain.chain.length, data: blockchain, })
};

const createBlock = (req, res, next) => {
    const lastBlock = blockchain.getLastBlock();
    const data = req.body;
    const {nonce, difficulty, timestamp} = blockchain.proofOFWork(lastBlock.hash, data);

    const hash = blockchain.hashBlock(timestamp, lastBlock.hash, data, nonce, difficulty);
    const block = blockchain.createBlock(timestamp, lastBlock.hash, hash, data, difficulty);

    res.status(201).json({ message: "Block created successfully", success: true, data: block })
};

export { fetchBlockchain, createBlock };