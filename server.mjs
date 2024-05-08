import express from "express";
import blockchainRouter from "./routes/blockchain-routes.mjs";

const app = express();

app.use(express.json());
app.use("/api/v1/blockchain", blockchainRouter);

const PORT = process.argv[2];
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
