import express from "express";
import cors from "cors";
import blockchainRouter from "./routes/blockchain-routes.mjs";
import nodeRouter from "./routes/node-routes.mjs";
import logger from "./middleware/logger.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import ErrorResponse from "./utilities/ErrorResponseModel.mjs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.argv[2];

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
global.__appdir = dirname;

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

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log('TODO: Sync at startup');
    syncAtStartup();
  });
  
  const syncAtStartup = async () => {
      console.log(process.argv[3]);
      const response = await fetch(`${process.argv[3]}/api/v1/blockchain/sync`);
      if (response.ok) 
      {
          const result = await response.json();
          console.log(result);
      } else {
        console.log('Oops något gick fel!!!');
      }
  };
