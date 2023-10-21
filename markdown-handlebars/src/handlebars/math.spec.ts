import math from "./math";

describe("math", () => {
    it("calls the specified Math function with the given number", () => {
        expect(math("round", 1.5, {})).toBe(2);
        expect(math("floor", 1.5, {})).toBe(1);
        expect(math("ceil", 1.5, {})).toBe(2);
        expect(math("ceil", -2.5, {})).toBe(-2);
    });
    it("calls the specified Math function with multiple numbers", () => {
        expect(math("ABS", -5, {})).toBe(5);
        expect(math("min", 1, 2, 3, 4, 5, {})).toBe(1);
        expect(math("pow", 2, 8, {})).toBe(256);
        expect(math("ceil", 1.5, {})).toBe(2);
    });
    it("calls the specified Math function with numbers", () => {
        expect(math("pi", {})).toBe(3.141592653589793);
        expect(math("E", {})).toBe(2.718281828459045);
    });

    it("throws an exception if an invalid Math function name is provided", () => {
        expect(() => math.call({}, "invalidFn", 1)).toThrow("Invalid Math function name: invalidFn");
    });
});