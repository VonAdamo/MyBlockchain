import express from 'express';
import { fetchBlockchain, createBlock, syncChain, distribute } from '../controllers/blockchain-controller.mjs';

const blockchainRouter = express.Router();

blockchainRouter.route('/').get(fetchBlockchain);
blockchainRouter.route("/mine").post(createBlock);
blockchainRouter.route("/sync").get(syncChain);
blockchainRouter.route("/block/distribute").post(distribute);

export default blockchainRouter;