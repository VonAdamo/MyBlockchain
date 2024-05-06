import express from 'express';
import { fetchBlockchain, createBlock } from '../controllers/blockchain-controller.mjs';

const blockchainRouter = express.Router();

blockchainRouter.route('/').get(fetchBlockchain);
blockchainRouter.route("/mine").post(createBlock);

export default blockchainRouter;