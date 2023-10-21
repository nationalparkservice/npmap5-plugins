export default function anyToNumber(value: any, defaultNumber: number = 0): number {
    let returnNumber = NaN;
    if (value != undefined && typeof value !== 'object') {
        returnNumber = Number(value);
    }
    return isNaN(returnNumber) ? defaultNumber : returnNumber;
}