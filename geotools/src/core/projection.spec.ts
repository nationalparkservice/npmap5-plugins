import { earthCircumference, metersToPixels, pixelsToMeters, WebMercatorToWGS84, WGS84ToWebMercator } from './projection';

describe('Null Island', () => {
    it('WebMercatorToWGS84', () => {
        const { lng, lat } = WebMercatorToWGS84(0, 0);
        expect(lng).toBeCloseTo(0);
        expect(lat).toBeCloseTo(0);
    });

    it('WGS84ToWebMercator', () => {
        const { x, y } = WGS84ToWebMercator(0, 0);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(0);
    });
});

describe('Various Cities', () => {
    it('New York', () => {
        const newyork = { lng: -74.006, lat: 40.7128 };
        const webMercator = WGS84ToWebMercator(newyork.lng, newyork.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(newyork.lng, 4);
        expect(result.lat).toBeCloseTo(newyork.lat, 4);
    });

    it('Paris', () => {
        const paris = { lng: 2.3522, lat: 48.8566 };
        const webMercator = WGS84ToWebMercator(paris.lng, paris.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(paris.lng, 4);
        expect(result.lat).toBeCloseTo(paris.lat, 4);
    });

    it('Tokyo', () => {
        const tokyo = { lng: 139.6503, lat: 35.6762 };
        const webMercator = WGS84ToWebMercator(tokyo.lng, tokyo.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(tokyo.lng, 4);
        expect(result.lat).toBeCloseTo(tokyo.lat, 4);
    });

    it('Los Angeles', () => {
        const losangeles = { lng: -118.2437, lat: 34.0522 };
        const webMercator = WGS84ToWebMercator(losangeles.lng, losangeles.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(losangeles.lng, 3);
        expect(result.lat).toBeCloseTo(losangeles.lat, 3);
    });

    it('Sydney', () => {
        const sydney = { lng: 151.2093, lat: -33.8688 };
        const webMercator = WGS84ToWebMercator(sydney.lng, sydney.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(sydney.lng, 3);
        expect(result.lat).toBeCloseTo(sydney.lat, 3);
    });

    it('Mumbai', () => {
        const mumbai = { lng: 72.8777, lat: 19.0760 };
        const webMercator = WGS84ToWebMercator(mumbai.lng, mumbai.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(mumbai.lng, 3);
        expect(result.lat).toBeCloseTo(mumbai.lat, 3);
    });

    it('London', () => {
        const london = { lng: -0.1278, lat: 51.5074 };
        const webMercator = WGS84ToWebMercator(london.lng, london.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(london.lng, 3);
        expect(result.lat).toBeCloseTo(london.lat, 3);
    });

    it('Sao Paulo', () => {
        const saopaulo = { lng: -46.6333, lat: -23.5505 };
        const webMercator = WGS84ToWebMercator(saopaulo.lng, saopaulo.lat);
        const result = WebMercatorToWGS84(webMercator.x, webMercator.y);
        expect(result.lng).toBeCloseTo(saopaulo.lng, 3);
        expect(result.lat).toBeCloseTo(saopaulo.lat, 3);
    });
});

describe('metersToPixels', () => {
    it('should convert meters to pixels correctly', () => {
        const meters = 1000;
        const zoomLevel = 10;
        const tileSize = 256;
        const expectedPixels = meters / (earthCircumference / tileSize * Math.pow(2, -zoomLevel));
        expect(metersToPixels(meters, zoomLevel, tileSize)).toBe(expectedPixels);
    });
});

describe('pixelsToMeters', () => {
    it('should convert pixels to meters correctly', () => {
        const pixels = 1000;
        const zoomLevel = 10;
        const tileSize = 256;
        const expectedMeters = pixels * (earthCircumference / tileSize * Math.pow(2, -zoomLevel));
        expect(pixelsToMeters(pixels, zoomLevel, tileSize)).toBe(expectedMeters);
    });
});
