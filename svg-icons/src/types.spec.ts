import { isStyleImageInterface } from './types'; // replace with the actual path to your module

describe('isStyleImageInterface', () => {
    it('should return true for valid StyleImageInterface objects', () => {
        const validObject = {
            width: 100,
            height: 100,
            data: new Uint8Array(),
            render: () => { },
            onAdd: () => { },
            onRemove: () => { },
        };

        expect(isStyleImageInterface(validObject)).toBe(true);
    });

    it('should return false for invalid objects', () => {
        const invalidObject = {
            width: "100", // not a number
            height: 100,
            data: new Uint8Array(),
        };

        expect(isStyleImageInterface(invalidObject)).toBe(false);
    });

    it('should return false for non-objects', () => {
        expect(isStyleImageInterface(123)).toBe(false);
        expect(isStyleImageInterface("string")).toBe(false);
    });

    it('should return true for objects with optional properties omitted', () => {
        const validObject = {
            width: 100,
            height: 100,
            data: new Uint8Array(),
            // render, onAdd, and onRemove are omitted
        };

        expect(isStyleImageInterface(validObject)).toBe(true);
    });
});
