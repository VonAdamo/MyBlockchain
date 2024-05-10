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


    blockchain.nodes.forEach(async(url) => {
    const body = block;
    await fetch(`${url}/api/v1/blockchain/block/distribute`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    });

    res.status(201).json({ success: true, data: {message: "Block created and distributed", block }})
};

const distribute = (req, res, next) => {
    const block = req.body;
    const lastBlock = blockchain.getLastBlock();

    const hash = lastBlock.hash === block.preHash;
    const blockIndex = lastBlock.blockIndex + 1 === block.blockIndex;

    if(hash && blockIndex) {
        blockchain.chain.push(block);
        res.status(201).json({ success: true, statusCode: 201, data: {message: "Block created successfully" }});
    } else {
        res.status(500).json({ success: false, statusCode: 500, data: {message: "Block not created" }});
    }
};
// Sync chain kommer agera som consensus...
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

            if (!longestChain || (longestChain && !blockchain.validateChain(longestChain))) 
                {
                console.log('Är synkade');
              } else {
                blockchain.chain = longestChain;
              }
        }
    });
        
    res.status(200).json({ success: true, statusCode: 200, data: { message: 'Synkroniseringen är klar' },});
};
export { fetchBlockchain, createBlock, syncChain, distribute};