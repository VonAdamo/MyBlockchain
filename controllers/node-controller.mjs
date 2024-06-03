import { blockchain } from "../startup.mjs";

export const listNodes = (req, res, next) => {
    res.status(200).json({success:true, statusCode: 200, data: blockchain.memberNodes});
};

export const registerNode = (req, res, next) => {
    const node = req.body;
    if( blockchain.memberNodes.indexOf(node.nodeUrl) === -1 && blockchain.nodeUrl !== node.nodeUrl ) {
        blockchain.memberNodes.push(node.nodeUrl);

        syncNodes(node.nodeUrl);
        
        res.status(201).json({success:true, statusCode: 201, data: { message: `Node ${node.nodeUrl} has been registered`}});
    } else {
        res.status(400).json({success:false, statusCode: 400, data: { message: `Node ${node.nodeUrl} already exists or is your own node`}});
    }  
};

const syncNodes = (url) => {
    const members = [...blockchain.memberNodes, blockchain.nodeUrl];

    try {
        members.forEach(async(member) => {
            const body = {nodeUrl: member};
            await fetch(`${url}/api/v1/nodes/register-node`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json", }
            });
        });
    } catch (error) {
        console.log(error);
    }
};