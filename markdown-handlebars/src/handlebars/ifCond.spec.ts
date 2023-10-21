import ifCond from './ifCond';
import { HelperOptions } from 'handlebars';

describe('ifCond', () => {
    it('returns the correct result for different operators', () => {
        const options = { fn: () => 'Truthy', inverse: () => 'Falsy' } as any as HelperOptions;

        expect(ifCond(null, '==', undefined, options)).toBe('Truthy');
        expect(ifCond('test', '!==', 'Test', options)).toBe('Truthy');
        expect(ifCond(10, '<', 20, options)).toBe('Truthy');
        expect(ifCond(false, '&&', true, options)).toBe('Falsy');
        expect(ifCond(null, '===', undefined, options)).toBe('Falsy');
        expect(ifCond('5', '<=', 5, options)).toBe('Truthy');
        expect(ifCond('10', '>', '20', options)).toBe('Falsy');
        expect(ifCond(false, '&&', true, options)).toBe('Falsy');
        expect((ifCond as any)(false, options)).toBe('Falsy');
        expect((ifCond as any)(true, options)).toBe('Truthy');
    });

    it('returns nothing if inverse isn\'t defined', () => {
        const options = { fn: () => 'Truthy' } as any as HelperOptions;

        expect(ifCond(null, '==', undefined, options)).toBe('Truthy');
        expect(ifCond('test', '!==', 'Test', options)).toBe('Truthy');
        expect(ifCond(10, '<', 20, options)).toBe('Truthy');
        expect(ifCond(false, '&&', true, options)).toBe('');
        expect(ifCond(null, '===', undefined, options)).toBe('');
        expect(ifCond('5', '<=', 5, options)).toBe('Truthy');
        expect(ifCond('10', '>', '20', options)).toBe('');
        expect(ifCond(false, '&&', true, options)).toBe('');
        expect((ifCond as any)(false, options)).toBe('');
        expect((ifCond as any)(true, options)).toBe('Truthy');
    });
});

