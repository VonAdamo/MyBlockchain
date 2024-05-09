import { blockchain } from "../startup.mjs";

export const listNodes = (req, res, next) => {
    res.status(200).json({success:true, statusCode: 200, data: blockchain.nodes});
};

export const registerNode = (req, res, next) => {
    const node = req.body;
    //Om noden jag försöker lägga till redan finns 
    //eller om noden jag försöker lägga till är min egen nod så går det inte
    if( blockchain.nodes.includes(node.nodeUrl) || blockchain.nodeUrl === node.nodeUrl ) {
        return res.status(400).json({success:false, statusCode: 400, data: { message: `Error, ${node.nodeUrl} is already registered or is your own node`}});
    }
    blockchain.nodes.push(node.nodeUrl);
    //Synca noderna
    syncNodes(node.nodeUrl);

    res.status(201).json({success:true, statusCode: 201, data: { message: `Node ${node.nodeUrl} has been registered`}});
};

export const syncNodes = (url) => {
    //Säger att nodes är listan med alla mina nodes och min main
    const nodes = [...blockchain.nodes, blockchain.nodeUrl];

    try {
        //Listan av alla noder skickas till alla noder
        nodes.forEach(async(node) => {
            const body = {nodeUrl: node};
            await fetch(`${url}/api/v1/nodes/register-node`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
        })
    } catch (error) {
        console.log(error);
    }
};