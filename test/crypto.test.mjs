import {describe, it, expect} from "vitest";
import { createHash } from "../utilities/crypto.mjs";

describe("Hasing", () => {
    it("should create a hash from the supplied arguments", () => {
        expect(createHash("adam", "majava")).toEqual(createHash("adam", "majava"));
    });

    it("should create a hash from the supplied arguments in any order", () => {
        expect(createHash("adam", "majava")).toEqual(createHash("majava", "adam"));
    });
});