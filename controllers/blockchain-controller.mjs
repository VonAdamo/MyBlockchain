import { blockchain } from "../startup.mjs";

const fetchBlockchain =(req, res, next) => {
    res.status(200).json({ message: "Blockchain fetched successfully", success: true, count: blockchain.chain.length, data: blockchain, })
};

const createBlock = (req, res, next) => {
    const lastBlock = blockchain.getLastBlock();
    console.log(lastBlock);

    const data = req.body;
    const timestamp = Date.now();
    const nonce = blockchain.proofOFWork(timestamp,lastBlock.hash, data);
    console.log(lastBlock);

    const hash = blockchain.hashBlock(timestamp, lastBlock.hash, data, nonce);
    const block = blockchain.createBlock(timestamp, lastBlock.hash, hash, data);

    res.status(201).json({ message: "Block created successfully", success: true, data: block })
};

export { fetchBlockchain, createBlock };