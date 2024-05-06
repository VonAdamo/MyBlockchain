import express from "express";
import dotenv from "dotenv";
import blockchainRouter from "./routes/blockchain-routes.mjs";

dotenv.config({path: "./config.env"});

const app = express();

app.use(express.json());
app.use("/api/v1/blockchain", blockchainRouter);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log("Server is running on port 5003"));
