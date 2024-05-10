import express from "express";
import blockchainRouter from "./routes/blockchain-routes.mjs";
import nodeRouter from "./routes/node-routes.mjs";

const app = express();

app.use((req, res, next) => {
    const message =  `${req.method} ${req.originalUrl}`;
    console.log(message);

    next();
});

app.use(express.json());
app.use("/api/v1/blockchain", blockchainRouter);
app.use("/api/v1/nodes", nodeRouter);

const PORT = process.argv[2];
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
