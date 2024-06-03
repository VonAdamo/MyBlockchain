import { blockchain } from "../startup.mjs";
import { writeFileAsync} from "../utilities/fileHandler.mjs";
import { v4 as uuidv4 } from "uuid";

const fetchBlockchain =(req, res, next) => {
    res.status(200).json({ message: "Blockchain fetched successfully", success: true, count: blockchain.chain.length, data: blockchain, })
};

const createBlock = async (req, res, next) => {

    const lastBlock = blockchain.getLastBlock();

    const data = req.body;
    const id = uuidv4().replaceAll("-", "");
    req.body.id = id;

    data.id = req.body.id ?? data.id;
    data.firstName = req.body.firstName ?? data.firstName;
    data.lastName = req.body.lastName ?? data.lastName;
    data.contact.phone = req.body.contact.phone ?? data.contact.phone;
    data.contact.email = req.body.contact.email ?? data.contact.email;
    
    const {nonce, difficulty, timestamp} = blockchain.proofOFWork(lastBlock.hash, data);
    const hash = blockchain.hashBlock(timestamp, lastBlock.hash, data, nonce, difficulty);
    const block = blockchain.createBlock(timestamp, lastBlock.hash, hash, data, nonce, difficulty);

    writeFileAsync("data", "myblockchain.json", JSON.stringify(blockchain.chain, null, 2));

    blockchain.memberNodes.forEach(async(url) => {
        console.log(blockchain.memberNodes.length)
    const body = {block};
    await fetch(`${url}/api/v1/blockchain/block/distribute`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json",},
        });
    });
    
    res.status(201).json({ success: true, data: {message: "Block created and distributed", block }})
};

const distribute = (req, res, next) => {
    const block = req.body.block;
    const lastBlock = blockchain.getLastBlock();
    //Kolla så att sista blockets hash är samma som det nya blockets preHash
    const hash = lastBlock.hash === block.preHash;
    //Kolla så att det nya blockets index är ett större än det sista blockets index
    const index = lastBlock.blockIndex + 1 === block.blockIndex;

    if(hash && index) {
        console.log("Inside if");
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

    blockchain.memberNodes.forEach(async (member) => {
        const response = await fetch (`${member}/api/v1/blockchain`);
        if (response.ok) {
            const result = await response.json();

            console.log(result.data.chain.length, maxLength)
            if(result.data.chain.length > maxLength) {
                maxLength = result.data.chain.length;
                longestChain = result.data.chain;
            }

            console.log("Before if !longestChain")
            if (!longestChain || (longestChain && !blockchain.validateChain(longestChain))) 
                {
                console.log('Already in sync!');
              } else {
                blockchain.chain = longestChain;
              }
        }
    });
        
    res.status(200).json({ success: true, statusCode: 200, data: { message: "Sync complete!" },});
};

export { fetchBlockchain, createBlock, syncChain, distribute};