// Use euclidean Distance when determining distances based on the visual distance on screen (using 3857)

import { Position } from "geojson";
import { earthCircumference } from "./projection";

/**
 * Calculates the Euclidean distance between two points in a plane.
 *
 * @param pointA - The first point as an array of two numbers [x, y].
 * @param pointB - The second point as an array of two numbers [x, y].
 * @returns The Euclidean distance between the two points.
 * 
 * @remarks
 * Use euclideanDistance when determining distances based on the visual distance on screen (using 3857).
 * Use {@link distance} to get the distance on the earth (using 4326).
 */
export function euclideanDistance(pointA: [number, number] | Position, pointB: [number, number] | Position): number {
    return Math.sqrt(
        Math.pow((pointA[1] - pointB[1]), 2) + (Math.pow((pointA[0] - pointB[0]), 2))
    );
};

/**
 * Calculates the Haversine distance between two points on the earth.
 *
 * @param pointA - The first point as an array of two numbers [longitude, latitude].
 * @param pointB - The second point as an array of two numbers [longitude, latitude].
 * @returns The Haversine distance between the two points on the earth, returns value in kilometers.
 * 
 * @remarks
 * Takes WGS84 longitude and latitude.
 * Uses the Haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
 * Use this formula for distance on earth, use {@link euclideanDistance} for distance on screen.
 */
export function distance([startLng, startLat]: [number, number] | Position, [endLng, endLat]: [number, number] | Position): number {
    const toRadian = (angle: number) => (Math.PI / 180) * angle;
    const radiusOfEarthInKm = earthCircumference / (2 * Math.PI * 1000);

    const dLat = toRadian(endLat - startLat);
    const dLon = toRadian(endLng - startLng);

    const startLatRadians = toRadian(startLat);
    const endLatRadians = toRadian(endLat);

    // Haversine Formula
    const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(startLatRadians) * Math.cos(endLatRadians);
    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = radiusOfEarthInKm * c;

    return finalDistance;
}
