import { Color } from './color';

describe('Color', () => {
    it('constructor', () => {
        const color = new Color({ r: 128, g: 255, b: 0, a: 1 });
        expect(color.rgbaObj).toEqual({ r: 128, g: 255, b: 0, a: 1 });
    });

    it('fromRgb', () => {
        const color = Color.fromRgb({ r: 0, g: 255, b: 0 });
        expect(color.rgbaObj).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('rgba', () => {
        const color = new Color({ r: 128, g: 255, b: 0, a: 1 });
        expect(color.rgba).toBe('rgba(128,255,0,1)');
    });

    it('rgbaArray', () => {
        const color = new Color({ r: 128, g: 255, b: 0, a: 1 });
        expect(color.rgbaArray).toEqual([128, 255, 0, 1]);
    });

    it('rgbaArray255', () => {
        const color = new Color({ r: 128, g: 255, b: 0, a: 1 });
        expect(color.rgbaArray255).toEqual([128, 255, 0, 255]);
    });

    it('hex', () => {
        const color = new Color({ r: 128, g: 255, b: 0, a: 1 });
        expect(color.hex).toBe('#80ff00ff');
    });

});