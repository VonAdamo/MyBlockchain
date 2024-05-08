import { blockchain } from "../startup.mjs";

export const listNodes = (req, res, next) => {
    res.status(200).json({success:true, statusCode: 200, data: blockchain.nodes});
};

export const registerNode = (req, res, next) => {
    const node = req.body;
    //Om noden jag försöker lägga till redan finns 
    //eller om noden jag försöker lägga till är min egen nod så går det inte
    if( blockchain.nodes.includes(node.nodeUrl) && blockchain.nodeUrl === node.nodeUrl ) {
        return res.status(400).json({success:false, statusCode: 400, data: { message: `Error, ${node.nodeUrl} is already registered`}});
    }

    blockchain.nodes.push(node.nodeUrl);

    res.status(201).json({success:true, statusCode: 201, data: { message: `Node ${node.nodeUrl} has been registered`}});
};