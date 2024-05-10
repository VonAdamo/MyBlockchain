import { blockchain } from "../startup.mjs";

export const listNodes = (req, res, next) => {
    res.status(200).json({success:true, statusCode: 200, data: blockchain.memberNodes});
};

export const registerNode = (req, res, next) => {
    const node = req.body;
    //Om noden jag försöker lägga till redan finns 
    //eller om noden jag försöker lägga till är min egen nod så går det inte
    if( blockchain.memberNodes.includes(node.nodeUrl) || blockchain.nodeUrl === node.nodeUrl ) {
        return res.status(400).json({success:false, statusCode: 400, data: { message: `Error, ${node.nodeUrl} is already registered or is your own node`}});
    }
    blockchain.memberNodes.push(node.nodeUrl);
    //Synca noderna
    syncNodes(node.nodeUrl);

    res.status(201).json({success:true, statusCode: 201, data: { message: `Node ${node.nodeUrl} has been registered`}});
};

export const syncNodes = (url) => {
    //Säger att nodes är listan med alla mina nodes och min main
    const members = [...blockchain.memberNodes, blockchain.nodeUrl];

    try {
        //Listan av alla noder skickas till alla noder
        members.forEach(async(member) => {
            const body = {nodeUrl: member};
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