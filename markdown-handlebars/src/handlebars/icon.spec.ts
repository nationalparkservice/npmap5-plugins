import icon from "./icon";

class MockImageData {
    constructor(public readonly data: Uint8ClampedArray, public readonly width: number, public readonly height: number) { }
}

// Jest test for icon function
describe('icon', () => {
    beforeEach(() => {
        // Mock the Map object with a simple object
        global.window = Object.create(window);
        const map = {
            style: {
                getImage: jest.fn((name: string) => (name === 'test' && {
                    data: {
                        data: [255, 0, 0, 255],
                        height: 1,
                        width: 1,
                    },
                })),
            },
        };
        //Object.defineProperty(window, '__map', { value: map });
        (global.window as any).__map = map;

        // Mock ImageData
        Object.defineProperty(window, 'ImageData', {
            writable: true,
            value: MockImageData,
        });

        // Mock the getContext() method of HTMLCanvasElement
        (HTMLCanvasElement as any).prototype.getContext = jest.fn(() => {
            return {
                // Mock the putImageData() method of CanvasRenderingContext2D
                putImageData: jest.fn(),
            };
        });
        (HTMLCanvasElement as any).prototype.toDataURL = jest.fn(() => {
            return 'data:image/png;base64';
        });

    });

    test('returns the HTML string for an icon image', () => {
        const result = icon('test', 'Test Icon', 16, { fn: '', data: { map: (global.window as any).__map } });
        expect(result).toContain('<img');
        expect(result).toContain('src="data:image/png;base64');
        expect(result).toContain('alt="Test Icon"');
        expect(result).toContain('title="Test Icon"');
        expect(result).toContain('width: 1px;');
        expect(result).toContain('height: 1px;');
    });

    test('returns an empty string if the image data is not found', () => {
        const result = icon('', 'Test Icon', 16, { fn: '', data: { map: (global.window as any).__map } });
        expect(result).toBe('');
    });
});
