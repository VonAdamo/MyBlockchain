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
// SyncChain will try to provide me with a concensus mechanism for my blockchain
const syncChain = (req, res, next) => {
    const currentLength = blockchain.chain.length;
    let maxLength = currentLength;
    let longestChain = null;

    blockchain.nodes.forEach(async (nodes) => {
        const response = await fetch (`${nodes}/api/v1/blockchain`);
        if (response.ok) {
            const result = await response.json();

            if(result.data.chain.length > maxLength) {
                maxLength = result.data.chain.length;
                longestChain = result.data.chain;
            }

            if(!longestChain) {
                res.status(400).json({success: false, statusCode: 400, data: {message: "Can't sync, this is the longest chain"}});
            } else {
                blockchain.chain = longestChain;
                res.status(200).json({success: true, statusCode: 200, data: {message:"Chain has been synced"}});
            }
        };
    });
    
    /* res.status(200).json({ success:true, statusCode: 200, data: {message:"Chain has been synced"},
    }); */
};
//############## ALTERNATIV SYNCCHAIN ############################
/* const syncChain = (req, res, next) => {
    const currentLength = blockchain.chain.length;
    let maxLength = currentLength;
    let longestChain = null;

    blockchain.nodes.forEach(async (nodes) => {
    const response = await fetch (`${nodes}/api/v1/blockchain`);
    if (response.ok) {
        const result = await response.json();

        if(result.data.chain.length > maxLength) {
            maxLength = result.data.chain.length;
            longestChain = result.data.chain;
        }

        if(!longestChain) {
            res.status(400).json({success: false, message: "Error, this is not the longest chain"});
        } else {
            blockchain.chain = longestChain;
            res.status(200).json({success: true, message: "Chain has been synced"});
        }
    }
    })
} */

export { fetchBlockchain, createBlock, syncChain};