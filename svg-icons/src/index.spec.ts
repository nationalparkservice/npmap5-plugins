import { IconConfigType } from './types'; // update with the correct import path
import { SVGPlugin } from '.'; // update with the correct import path

describe('SVGPlugin', () => {
    describe('stringifyConfig', () => {
        it('should encode an IconConfigType object and preserve brackets', () => {
            const iconConfig: IconConfigType = {
                fallbackImage: 'svg-dot',
                imageOptions: {
                    pixelRatio: 2,
                    sdf: false,
                    stretchX: undefined,
                    stretchY: undefined,
                    content: undefined,
                },
                baseImageId: '{icon}',
                fallbackFunctions: undefined,
                functions: [
                    {
                        name: 'applyCss',
                        params: {
                            color: 'green',
                        },
                    },
                ],
            };

            const result = SVGPlugin.stringifyConfig(iconConfig);

            expect(result).toEqual(expect.any(String)); // check if result is a string
            expect(decodeURIComponent(result)).toContain('{icon}'); // make sure the brackets are preserved
        });
    });
});
