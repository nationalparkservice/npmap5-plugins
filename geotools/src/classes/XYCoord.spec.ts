import { XYCoord } from "./XYCoord";

describe("XYCoord", () => {
    describe("constructor", () => {
        it("should create an instance of XYCoord with EPSG 3857", () => {
            const coord = new XYCoord(-11688546.533293726, 4865942.279503177);
            expect(coord).toBeInstanceOf(XYCoord);
            expect(coord.x).toBe(-11688546.533293726);
            expect(coord.y).toBe(4865942.279503177);
            expect(coord.lng).toBe(-105);
            expect(coord.lat).toBe(40);
        });

        it("should create an instance of XYCoord with EPSG 4326", () => {
            const coord = new XYCoord(-105, 40, '4326');
            expect(coord).toBeInstanceOf(XYCoord);
            expect(coord.lng).toBe(-105);
            expect(coord.lat).toBe(40);
            expect(coord.x).toBe(-11688546.533293726);
            expect(coord.y).toBe(4865942.279503177);
        });

        it("should throw an error if unsupported EPSG code is provided", () => {
            expect(() => new XYCoord(-105, 40, '1234' as any)).toThrow('Only 3857 and 4326 are supported');
        });
    });

    describe("pixelAtZoom", () => {
        it("should return correct pixel coordinates at a specific zoom level", () => {
            const coord = new XYCoord(-11688546.533293726, 4865942.279503177);
            const pixelCoord = coord.pixelAtZoom(3);
            expect(pixelCoord.x).toBeCloseTo(426.6666);
            expect(pixelCoord.y).toBeCloseTo(775.330);
        });
    });

    describe("getters", () => {
        const coord = new XYCoord(-11688546.533293726, 4865942.279503177);

        it("should return correct xyArray", () => {
            expect(coord.xyArray).toEqual([-11688546.533293726, 4865942.279503177]);
        });

        it("should return correct xyObject", () => {
            expect(coord.xyObject).toEqual({ x: -11688546.533293726, y: 4865942.279503177 });
        });

        it("should return correct lngLatArray", () => {
            expect(coord.lngLatArray).toEqual([-105, 40]);
        });

        it("should return correct lngLatPosition", () => {
            expect(coord.lngLatPosition).toEqual([-105, 40]);
        });

        it("should return correct lngLatObject", () => {
            expect(coord.lngLatObject).toEqual({ lng: -105, lat: 40 });
        });
    });
});
