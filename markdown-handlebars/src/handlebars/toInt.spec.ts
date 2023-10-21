import toInt from './toInt';

describe('convertToInt', () => {
  test('should convert a string to an integer', () => {
    expect(toInt('10')).toBe(10);
  });

  test('should convert a float string to an integer', () => {
    expect(toInt(Math.PI.toString())).toBe(3);
  });

  test('should return NaN for an invalid string', () => {
    expect(toInt('hello')).toBeNaN();
  });
});