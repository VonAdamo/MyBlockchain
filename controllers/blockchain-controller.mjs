import { blockchain } from "../startup.mjs";

const fetchBlockchain =(req, res, next) => {
    res.status(200).json({ message: "Blockchain fetched successfully", success: true, count: blockchain.chain.length, data: blockchain, })
};

const createBlock = (req, res, next) => {
    const lastBlock = blockchain.getLastBlock();
    const data = req.body;
    console.log(data);

    const hash = blockchain.hashBlock(lastBlock.hash, data);
    const block = blockchain.createBlock(lastBlock.hash, hash, data);

    res.status(201).json({ message: "Block created successfully", success: true, data: block })
};

export { fetchBlockchain, createBlock };