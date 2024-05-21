import {it, describe, expect} from "vitest";
import {Block} from "../models/Block.mjs";

describe("Block", () => {
    const timestamp = Date.now();
    const blockIndex = 1;
    const preHash = "0";
    const hash = "0";
    const nonce = 1337;
    const difficulty = 1;
    const data = {firstName: "Adam", lastName: "Majava", contact: {phone: "1234567890", email: "adam@hello.com"}};

    const block = new Block({
        timestamp : timestamp,
        blockIndex : blockIndex,
        preHash : preHash,
        hash : hash,
        nonce : nonce,
        difficulty : difficulty,
        data : data,
    });

    describe("Block Properties", () => {
        it("should have the properties timestamp, blockIndex, preHash, hash, nonce, difficulty, and data", () => {
            expect(block).toHaveProperty("timestamp");
            expect(block).toHaveProperty("blockIndex");
            expect(block).toHaveProperty("preHash");
            expect(block).toHaveProperty("hash");
            expect(block).toHaveProperty("nonce");
            expect(block).toHaveProperty("difficulty");
            expect(block).toHaveProperty("data");
        });

        it("should have the correct values for the properties", () => {
            expect(block.timestamp).toBe(timestamp);
            expect(block.blockIndex).toBe(blockIndex);
            expect(block.preHash).toBe(preHash);
            expect(block.hash).toBe(hash);
            expect(block.nonce).toBe(nonce);
            expect(block.difficulty).toBe(difficulty);
            expect(block.data).toBe(data);
        });
    });
});