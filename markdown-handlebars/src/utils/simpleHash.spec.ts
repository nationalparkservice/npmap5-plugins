import simpleHash from './simpleHash';

describe('simpleHash', () => {
    test('returns expected value for "hello world"', () => {
        expect(simpleHash('hello world')).toBe('to5x38');
    });

    test('returns expected value for empty string', () => {
        expect(simpleHash('')).toBe('0');
    });

    test('returns expected value for special characters', () => {
        expect(simpleHash('@#&^*()_+-=')).toBe('1fr0vm4');
    });

    test('returns expected value for long input', () => {
        const input = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut magna eget leo laoreet ornare eget vel magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec mollis orci vel diam suscipit, eget dictum quam pharetra. Quisque maximus arcu id dui tincidunt, eu ullamcorper nibh elementum. Maecenas semper, mauris in dignissim fringilla, massa lectus venenatis nisi, eget consequat velit velit quis metus. Sed euismod, metus in posuere convallis, urna velit pharetra augue, vitae tincidunt massa est a ante. Nullam sit amet augue in ex venenatis laoreet. Fusce vitae arcu leo. Donec bibendum tincidunt felis at interdum. Curabitur in libero in elit iaculis lobortis quis ac velit. Nam varius vel nibh ac pretium. Donec id ante turpis. Aliquam erat volutpat. Ut nec aliquam velit. Donec fringilla magna ac enim sagittis elementum. Praesent eget diam auctor, placerat turpis vitae, lacinia libero. In consequat, enim in pellentesque sollicitudin, augue nulla ultricies nibh, quis facilisis magna ante a ipsum. Vestibulum vitae arcu vel ex consectetur aliquam. Proin eleifend, quam non pretium ultricies, sapien purus egestas augue, quis feugiat enim velit ut nisi. Vestibulum id dui ac lacus ullamcorper tincidunt vel eget tortor.';

        expect(simpleHash(input)).toBe('itiiv');
    });
});
