export default function toKeyValueArray(obj: object): Array<[k: string | number, v: any]> | undefined {
    if (Array.isArray(obj)) {
        // Array
        return obj.map((value, index) => [index, value]);
    } else if (obj instanceof Set) {
        // Set
        return Array.from(obj, (value) => [value, value]);
    } else if (obj instanceof Map) {
        // Map
        return Array.from(obj.entries());
    } else if (typeof obj === 'object' && obj !== null) {
        // Plain object
        return Object.entries(obj);
    } else {
        return undefined;
    }
}