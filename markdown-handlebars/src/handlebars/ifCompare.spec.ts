// ifCompare.test.ts
import ifCompare from './ifCompare';

describe('ifCompare', () => {
  test('equality operators', () => {
    expect(ifCompare(5, '==', 5)).toBe('true');
    expect(ifCompare(5, '===', 5)).toBe('true');
    expect(ifCompare(5, '!=', 3)).toBe('true');
    expect(ifCompare(5, '!==', '5')).toBe('true');
    expect(ifCompare(5, '==', 3)).toBe('');
    expect(ifCompare(5, '===', '5')).toBe('');
    expect(ifCompare(5, '!=', 5)).toBe('');
    expect(ifCompare(5, '!==', 5)).toBe('');
  });

  test('comparison operators', () => {
    expect(ifCompare(5, '<', 10)).toBe('true');
    expect(ifCompare(5, '<=', 5)).toBe('true');
    expect(ifCompare(5, '>', 3)).toBe('true');
    expect(ifCompare(5, '>=', 5)).toBe('true');
    expect(ifCompare(5, '<', 3)).toBe('');
    expect(ifCompare(5, '<=', 4)).toBe('');
    expect(ifCompare(5, '>', 10)).toBe('');
    expect(ifCompare(5, '>=', 6)).toBe('');
  });

  test('logical operators', () => {
    expect(ifCompare(true, '&&', true)).toBe('true');
    expect(ifCompare(false, '||', true)).toBe('true');
    expect(ifCompare(true, '&&', false)).toBe('');
    expect(ifCompare(false, '||', false)).toBe('');
  });

  test('invalid operator', () => {
    expect(ifCompare(5, 'invalid', 3)).toBe('');
  });
});
