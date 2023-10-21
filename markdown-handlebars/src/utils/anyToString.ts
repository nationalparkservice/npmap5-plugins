export default function anyToString(value: any): string {
    if (value === null || value === undefined) {
        return '';
    } else if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (e) { }
    }
    return String(value);
}