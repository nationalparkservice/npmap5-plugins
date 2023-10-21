import hash from "./hash";

// Mocking HelperOptions for testing
const helperOptions = (hash: { [key: string]: unknown }) => ({
    hash,
    fn: jest.fn(),
    inverse: jest.fn(),
    data: jest.fn(),
});

describe("hash function", () => {
    it("should return an empty object when no arguments are provided", () => {
        const options = helperOptions({});
        const result = hash(options);
        expect(result).toEqual({});
    });

    it("should return a single key-value pair when one is provided", () => {
        const options = helperOptions({ one: "FIRST" });
        const result = hash(options);
        expect(result).toEqual({ one: "FIRST" });
    });

    it("should return multiple key-value pairs when multiple are provided", () => {
        const options = helperOptions({ two: "SECOND", one: "FIRST" });
        const result = hash(options);
        expect(result).toEqual({ one: "FIRST", two: "SECOND" });
    });

    it("should return an object with undefined values for keys with no value", () => {
        const options = helperOptions({ two: undefined, one: "FIRST" });
        const result = hash(options);
        expect(result).toEqual({ one: "FIRST", two: undefined });
    });
});