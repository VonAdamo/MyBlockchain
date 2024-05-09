import express from 'express';
import { fetchBlockchain, createBlock, syncChain } from '../controllers/blockchain-controller.mjs';

const blockchainRouter = express.Router();

blockchainRouter.route('/').get(fetchBlockchain);
blockchainRouter.route("/mine").post(createBlock);
blockchainRouter.route("/sync").get(syncChain);

export default blockchainRouter;