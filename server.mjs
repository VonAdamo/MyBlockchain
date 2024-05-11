import express from "express";
import cors from "cors";
import blockchainRouter from "./routes/blockchain-routes.mjs";
import nodeRouter from "./routes/node-routes.mjs";
import logger from "./middleware/logger.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import ErrorResponse from "./utilities/ErrorResponseModel.mjs";


const app = express();

global.__appdir = __dirname;
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/v1/blockchain", blockchainRouter);
app.use("/api/v1/nodes", nodeRouter);

//Fångar alla fel URL:er
app.all("*", (req, res, next) => {
    next(new ErrorResponse(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

const PORT = process.argv[2];
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
