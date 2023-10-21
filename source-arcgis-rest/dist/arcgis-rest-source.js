(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ArcGisRestSource = factory());
})(this, (function () { 'use strict';

  /* @preserve
  * @terraformer/arcgis - v2.1.1 - MIT
  * Copyright (c) 2012-2022 Environmental Systems Research Institute, Inc.
  * Tue Aug 02 2022 14:23:48 GMT-0700 (Pacific Daylight Time)
  */
  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var edgeIntersectsEdge = function edgeIntersectsEdge(a1, a2, b1, b2) {
    var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if (uB !== 0) {
      var ua = uaT / uB;
      var ub = ubT / uB;

      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return true;
      }
    }

    return false;
  };
  var coordinatesContainPoint = function coordinatesContainPoint(coordinates, point) {
    var contains = false;

    for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
      if ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1] || coordinates[j][1] <= point[1] && point[1] < coordinates[i][1]) && point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0]) {
        contains = !contains;
      }
    }

    return contains;
  };
  var pointsEqual = function pointsEqual(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  };
  var arrayIntersectsArray = function arrayIntersectsArray(a, b) {
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = 0; j < b.length - 1; j++) {
        if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
          return true;
        }
      }
    }

    return false;
  };

  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var closeRing = function closeRing(coordinates) {
    if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
      coordinates.push(coordinates[0]);
    }

    return coordinates;
  }; // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order

  var ringIsClockwise = function ringIsClockwise(ringToTest) {
    var total = 0;
    var i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;

    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }

    return total >= 0;
  }; // This function ensures that rings are oriented in the right directions
  // from http://jsperf.com/cloning-an-object/2

  var shallowClone = function shallowClone(obj) {
    var target = {};

    for (var i in obj) {
      // both arcgis attributes and geojson props are just hardcoded keys
      if (obj.hasOwnProperty(i)) {
        // eslint-disable-line no-prototype-builtins
        target[i] = obj[i];
      }
    }

    return target;
  };

  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var coordinatesContainCoordinates = function coordinatesContainCoordinates(outer, inner) {
    var intersects = arrayIntersectsArray(outer, inner);
    var contains = coordinatesContainPoint(outer, inner[0]);

    if (!intersects && contains) {
      return true;
    }

    return false;
  }; // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings


  var convertRingsToGeoJSON = function convertRingsToGeoJSON(rings) {
    var outerRings = [];
    var holes = [];
    var x; // iterator

    var outerRing; // current outer ring being evaluated

    var hole; // current hole being evaluated
    // for each ring

    for (var r = 0; r < rings.length; r++) {
      var ring = closeRing(rings[r].slice(0));

      if (ring.length < 4) {
        continue;
      } // is this ring an outer ring? is it clockwise?


      if (ringIsClockwise(ring)) {
        var polygon = [ring.slice().reverse()]; // wind outer rings counterclockwise for RFC 7946 compliance

        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring.slice().reverse()); // wind inner rings clockwise for RFC 7946 compliance
      }
    }

    var uncontainedHoles = []; // while there are holes left...

    while (holes.length) {
      // pop a hole off out stack
      hole = holes.pop(); // loop over all outer rings and see if they contain our hole.

      var contained = false;

      for (x = outerRings.length - 1; x >= 0; x--) {
        outerRing = outerRings[x][0];

        if (coordinatesContainCoordinates(outerRing, hole)) {
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);
          contained = true;
          break;
        }
      } // ring is not contained in any outer ring
      // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320


      if (!contained) {
        uncontainedHoles.push(hole);
      }
    } // if we couldn't match any holes using contains we can try intersects...


    while (uncontainedHoles.length) {
      // pop a hole off out stack
      hole = uncontainedHoles.pop(); // loop over all outer rings and see if any intersect our hole.

      var intersects = false;

      for (x = outerRings.length - 1; x >= 0; x--) {
        outerRing = outerRings[x][0];

        if (arrayIntersectsArray(outerRing, hole)) {
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);
          intersects = true;
          break;
        }
      }

      if (!intersects) {
        outerRings.push([hole.reverse()]);
      }
    }

    if (outerRings.length === 1) {
      return {
        type: 'Polygon',
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: 'MultiPolygon',
        coordinates: outerRings
      };
    }
  };

  var getId = function getId(attributes, idAttribute) {
    var keys = idAttribute ? [idAttribute, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key in attributes && (typeof attributes[key] === 'string' || typeof attributes[key] === 'number')) {
        return attributes[key];
      }
    }

    throw Error('No valid id attribute found');
  };

  var arcgisToGeoJSON = function arcgisToGeoJSON(arcgis, idAttribute) {
    var geojson = {};

    if (arcgis.features) {
      geojson.type = 'FeatureCollection';
      geojson.features = [];

      for (var i = 0; i < arcgis.features.length; i++) {
        geojson.features.push(arcgisToGeoJSON(arcgis.features[i], idAttribute));
      }
    }

    if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
      geojson.type = 'Point';
      geojson.coordinates = [arcgis.x, arcgis.y];

      if (typeof arcgis.z === 'number') {
        geojson.coordinates.push(arcgis.z);
      }
    }

    if (arcgis.points) {
      geojson.type = 'MultiPoint';
      geojson.coordinates = arcgis.points.slice(0);
    }

    if (arcgis.paths) {
      if (arcgis.paths.length === 1) {
        geojson.type = 'LineString';
        geojson.coordinates = arcgis.paths[0].slice(0);
      } else {
        geojson.type = 'MultiLineString';
        geojson.coordinates = arcgis.paths.slice(0);
      }
    }

    if (arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
    }

    if (typeof arcgis.xmin === 'number' && typeof arcgis.ymin === 'number' && typeof arcgis.xmax === 'number' && typeof arcgis.ymax === 'number') {
      geojson.type = 'Polygon';
      geojson.coordinates = [[[arcgis.xmax, arcgis.ymax], [arcgis.xmin, arcgis.ymax], [arcgis.xmin, arcgis.ymin], [arcgis.xmax, arcgis.ymin], [arcgis.xmax, arcgis.ymax]]];
    }

    if (arcgis.geometry || arcgis.attributes) {
      geojson.type = 'Feature';
      geojson.geometry = arcgis.geometry ? arcgisToGeoJSON(arcgis.geometry) : null;
      geojson.properties = arcgis.attributes ? shallowClone(arcgis.attributes) : null;

      if (arcgis.attributes) {
        try {
          geojson.id = getId(arcgis.attributes, idAttribute);
        } catch (err) {// don't set an id
        }
      }
    } // if no valid geometry was encountered


    if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
      geojson.geometry = null;
    }

    if (arcgis.spatialReference && arcgis.spatialReference.wkid && arcgis.spatialReference.wkid !== 4326) {
      console.warn('Object converted in non-standard crs - ' + JSON.stringify(arcgis.spatialReference));
    }

    return geojson;
  };

  var WorkerClass = null;

  try {
      var WorkerThreads =
          typeof module !== 'undefined' && typeof module.require === 'function' && module.require('worker_threads') ||
          typeof __non_webpack_require__ === 'function' && __non_webpack_require__('worker_threads') ||
          typeof require === 'function' && require('worker_threads');
      WorkerClass = WorkerThreads.Worker;
  } catch(e) {} // eslint-disable-line

  function decodeBase64$1(base64, enableUnicode) {
      return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
  }

  function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
      var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
      var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
      var source = decodeBase64$1(base64, enableUnicode);
      var start = source.indexOf('\n', 10) + 1;
      var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
      return function WorkerFactory(options) {
          return new WorkerClass(body, Object.assign({}, options, { eval: true }));
      };
  }

  function decodeBase64(base64, enableUnicode) {
      var binaryString = atob(base64);
      if (enableUnicode) {
          var binaryView = new Uint8Array(binaryString.length);
          for (var i = 0, n = binaryString.length; i < n; ++i) {
              binaryView[i] = binaryString.charCodeAt(i);
          }
          return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
      }
      return binaryString;
  }

  function createURL(base64, sourcemapArg, enableUnicodeArg) {
      var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
      var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
      var source = decodeBase64(base64, enableUnicode);
      var start = source.indexOf('\n', 10) + 1;
      var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
      var blob = new Blob([body], { type: 'application/javascript' });
      return URL.createObjectURL(blob);
  }

  function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
      var url;
      return function WorkerFactory(options) {
          url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
          return new Worker(url, options);
      };
  }

  var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

  function isNodeJS() {
      return kIsNodeJS;
  }

  function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
      if (isNodeJS()) {
          return createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg);
      }
      return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
  }

  var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwp2YXIgd29ya2VyX2NvZGUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHsKICAndXNlIHN0cmljdCc7CgogIGNvbnN0IGVhcnRoQ2lyY3VtZmVyZW5jZSA9IDQwMDc1MDE2LjY4NTU3ODQ5OwogIC8qKgogICAgKiBDb252ZXJ0cyBhIHdlYm1lcmNhdG9yIHgseSB0byBXR1M4NCBsbmcsbGF0CiAgICAqIEBwYXJhbSB4CiAgICAqIEBwYXJhbSB5CiAgICAqIEByZXR1cm5zIExuZ0xuZ0xpa2UKICAgICovCiAgZnVuY3Rpb24gdG9XR1M4NCh4LCB5KSB7CiAgICAgIC8vIENvbnZlcnQgdGhlIGxhdCBsbmcKICAgICAgY29uc3Qgd2dzTG5nID0geCAqIDE4MCAvIChlYXJ0aENpcmN1bWZlcmVuY2UgLyAyKTsKICAgICAgLy8gdGhhbmtzIG1hZ2ljaGltIEAgZ2l0aHViIGZvciB0aGUgY29ycmVjdGlvbgogICAgICBjb25zdCB3Z3NMYXQgPSBNYXRoLmF0YW4oTWF0aC5leHAoeSAqIE1hdGguUEkgLyAoZWFydGhDaXJjdW1mZXJlbmNlIC8gMikpKSAqIDM2MCAvIE1hdGguUEkgLSA5MDsKICAgICAgcmV0dXJuIHsgbG5nOiB3Z3NMbmcsIGxhdDogd2dzTGF0IH07CiAgfQoKICBjb25zdCB3ZWJNZXJjYXRvckNvZGVzID0gWycxMDIxMDAnLCAnOTAwOTEzJywgJzM4NTcnLCAnMzU4NycsICc1NDAwNCcsICc0MTAwMScsICcxMDIxMTMnLCAnMzc4NSddOwogIGZ1bmN0aW9uIG1lcmdlUmluZ3MocmluZ3NYLCByaW5nc1ksIHNyaWQpIHsKICAgICAgY29uc3QgcmVwcm9qZWN0ID0gKHgsIHkpID0+IHsKICAgICAgICAgIGNvbnN0IHh5ID0gdG9XR1M4NCh4LCB5KTsKICAgICAgICAgIHJldHVybiBbeHkubG5nLCB4eS5sYXRdOwogICAgICB9OwogICAgICBpZiAod2ViTWVyY2F0b3JDb2Rlcy5pbmRleE9mKHNyaWQpID4gLTEpIHsKICAgICAgICAgIHJldHVybiByaW5nc1gubWFwKChyaW5nLCBpKSA9PiByaW5nLm1hcCgoeCwgaikgPT4gcmVwcm9qZWN0KHgsIHJpbmdzWVtpXVtqXSkpKTsKICAgICAgfQogICAgICBlbHNlIHsKICAgICAgICAgIHJldHVybiByaW5nc1gubWFwKChyaW5nLCBpKSA9PiByaW5nLm1hcCgoeCwgaikgPT4gW3gsIHJpbmdzWVtpXVtqXV0pKTsKICAgICAgfQogIH0KICBmdW5jdGlvbiBkZVppZ1phZyh2YWx1ZXMsIHNwbGl0cywgc2NhbGUsIGluaXRpYWxPZmZzZXQsIHVwcGVyTGVmdE9yaWdpbikgewogICAgICByZXR1cm4gc3BsaXRzLm1hcCgoc3BsaXQsIGkpID0+IHsKICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSAwOwogICAgICAgICAgcmV0dXJuIEFycmF5KHNwbGl0KS5maWxsKHVuZGVmaW5lZCkubWFwKChfLCBqKSA9PiB7CiAgICAgICAgICAgICAgY29uc3QgdmFsdWVPZmZzZXQgPSBzcGxpdHMucmVkdWNlKChhLCB2LCBpZHgpID0+IGEgKz0gKGlkeCA8IGkgPyB2IDogMCksIDApOwogICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW3ZhbHVlT2Zmc2V0ICsgal07CiAgICAgICAgICAgICAgY29uc3Qgc2lnbiA9IHVwcGVyTGVmdE9yaWdpbiA/IC0xIDogMTsKICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU7CiAgICAgICAgICAgICAgaWYgKGogPT09IDApIHsKICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAodmFsdWUgKiBzaWduKSArIChpbml0aWFsT2Zmc2V0IC8gc2NhbGUpOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAodmFsdWUgKiBzaWduKSArIGxhc3RWYWx1ZTsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgbGFzdFZhbHVlID0gcmV0dXJuVmFsdWU7CiAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlOwogICAgICAgICAgfSkubWFwKCh2KSA9PiB2ICogc2NhbGUpOwogICAgICB9KTsKICB9CiAgY2xhc3MgRGVaaWdaYWdKU09OIHsKICAgICAgY29uc3RydWN0b3IoZmVhdHVyZXMsIHRyYW5zZm9ybSwgZ2VvbWV0cnlUeXBlKSB7CiAgICAgICAgICB0aGlzLnNyaWQgPSAnMzg1Nyc7CiAgICAgICAgICB0aGlzLmZlYXR1cmVzID0gZmVhdHVyZXM7CiAgICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTsKICAgICAgICAgIHRoaXMuZ2VvbWV0cnlUeXBlID0gZ2VvbWV0cnlUeXBlOwogICAgICB9CiAgICAgIGFzeW5jIGNvbnZlcnQoKSB7CiAgICAgICAgICByZXR1cm4gdGhpcy5mZWF0dXJlcy5tYXAoZmVhdHVyZSA9PiB7CiAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHRoaXMuY29udmVydEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cnkpOwogICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlOwogICAgICAgICAgfSk7CiAgICAgIH0KICAgICAgY29udmVydEdlb21ldHJ5KGdlb21ldHJ5KSB7CiAgICAgICAgICBjb25zdCBjb3VudHMgPSBbXTsKICAgICAgICAgIGNvbnN0IHggPSBbXTsKICAgICAgICAgIGNvbnN0IHkgPSBbXTsKICAgICAgICAgIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeVBvaW50JykgewogICAgICAgICAgICAgIGNvdW50cy5wdXNoKDEpOwogICAgICAgICAgICAgIHgucHVzaChnZW9tZXRyeS54KTsKICAgICAgICAgICAgICB5LnB1c2goZ2VvbWV0cnkueSk7CiAgICAgICAgICB9CiAgICAgICAgICBlbHNlIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeU11bHRpcG9pbnQnKSB7CiAgICAgICAgICAgICAgZ2VvbWV0cnkucG9pbnRzLmZvckVhY2gocCA9PiB7CiAgICAgICAgICAgICAgICAgIGNvdW50cy5wdXNoKDEpOwogICAgICAgICAgICAgICAgICB4LnB1c2gocFswXSk7CiAgICAgICAgICAgICAgICAgIHkucHVzaChwWzFdKTsKICAgICAgICAgICAgICB9KTsKICAgICAgICAgIH0KICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZ2VvbWV0cnlUeXBlID09PSAnZXNyaUdlb21ldHJ5UG9seWxpbmUnKSB7CiAgICAgICAgICAgICAgZ2VvbWV0cnkucGF0aHMuZm9yRWFjaChsID0+IHsKICAgICAgICAgICAgICAgICAgY291bnRzLnB1c2gobC5sZW5ndGgpOwogICAgICAgICAgICAgICAgICBsLmZvckVhY2gocG9zaXRpb24gPT4gewogICAgICAgICAgICAgICAgICAgICAgeC5wdXNoKHBvc2l0aW9uWzBdKTsKICAgICAgICAgICAgICAgICAgICAgIHkucHVzaChwb3NpdGlvblsxXSk7CiAgICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgIH0pOwogICAgICAgICAgfQogICAgICAgICAgZWxzZSBpZiAodGhpcy5nZW9tZXRyeVR5cGUgPT09ICdlc3JpR2VvbWV0cnlQb2x5Z29uJykgewogICAgICAgICAgICAgIGdlb21ldHJ5LnJpbmdzLmZvckVhY2gocG9seSA9PiB7CiAgICAgICAgICAgICAgICAgIGNvdW50cy5wdXNoKHBvbHkubGVuZ3RoKTsKICAgICAgICAgICAgICAgICAgcG9seS5mb3JFYWNoKHBvc2l0aW9uID0+IHsKICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChwb3NpdGlvblswXSk7CiAgICAgICAgICAgICAgICAgICAgICB5LnB1c2gocG9zaXRpb25bMV0pOwogICAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICB9KTsKICAgICAgICAgIH0KICAgICAgICAgIC8vIGRlemlnemFnIHRoZSByaW5ncywgYW5kIG1lcmdlICsgcmVwcm9qZWN0IHRoZW0KICAgICAgICAgIGNvbnN0IHJpbmdzWCA9IGRlWmlnWmFnKHgsIGNvdW50cywgdGhpcy50cmFuc2Zvcm0uc2NhbGVbMF0sIHRoaXMudHJhbnNmb3JtLnRyYW5zbGF0ZVswXSwgZmFsc2UpOwogICAgICAgICAgY29uc3QgcmluZ3NZID0gZGVaaWdaYWcoeSwgY291bnRzLCB0aGlzLnRyYW5zZm9ybS5zY2FsZVsxXSwgdGhpcy50cmFuc2Zvcm0udHJhbnNsYXRlWzFdLCB0aGlzLnRyYW5zZm9ybS5vcmlnaW5Qb3NpdGlvbiA9PT0gJ3VwcGVyTGVmdCcpOwogICAgICAgICAgLy8gTWVyZ2UgdGhlIHJpbmdzCiAgICAgICAgICBjb25zdCByaW5ncyA9IG1lcmdlUmluZ3MocmluZ3NYLCByaW5nc1ksIHRoaXMuc3JpZCk7CiAgICAgICAgICBsZXQgbmV3R2VvbWV0cnkgPSB7fTsKICAgICAgICAgIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeVBvaW50JykgewogICAgICAgICAgICAgIG5ld0dlb21ldHJ5ID0geyAneCc6IHJpbmdzWzBdWzBdWzBdLCAneSc6IHJpbmdzWzBdWzBdWzFdIH07CiAgICAgICAgICB9CiAgICAgICAgICBlbHNlIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeU11bHRpcG9pbnQnKSB7CiAgICAgICAgICAgICAgbmV3R2VvbWV0cnkgPSB7ICdwb2ludHMnOiByaW5nc1swXSB9OwogICAgICAgICAgfQogICAgICAgICAgZWxzZSBpZiAodGhpcy5nZW9tZXRyeVR5cGUgPT09ICdlc3JpR2VvbWV0cnlQb2x5bGluZScpIHsKICAgICAgICAgICAgICBuZXdHZW9tZXRyeSA9IHsgcGF0aHM6IHJpbmdzIH07CiAgICAgICAgICB9CiAgICAgICAgICBlbHNlIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeVBvbHlnb24nKSB7CiAgICAgICAgICAgICAgbmV3R2VvbWV0cnkgPSB7IHJpbmdzOiByaW5ncyB9OwogICAgICAgICAgfQogICAgICAgICAgcmV0dXJuIG5ld0dlb21ldHJ5OwogICAgICB9CiAgfQoKICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogIGZ1bmN0aW9uIHByb3RvICgpIHsKICAgICAgbGV0IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlciA9IHt9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5fcmVhZEZpZWxkLCB7IHZlcnNpb246ICIiLCBxdWVyeVJlc3VsdDogbnVsbCB9LCBlbmQpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai52ZXJzaW9uID0gcGJmLnJlYWRTdHJpbmcoKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmoucXVlcnlSZXN1bHQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuUXVlcnlSZXN1bHQucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAob2JqLnZlcnNpb24pCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoMSwgb2JqLnZlcnNpb24pOwogICAgICAgICAgaWYgKG9iai5xdWVyeVJlc3VsdCkKICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDIsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdC53cml0ZSwgb2JqLnF1ZXJ5UmVzdWx0KTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5VHlwZSA9IHsKICAgICAgICAgICJlc3JpR2VvbWV0cnlUeXBlUG9pbnQiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlHZW9tZXRyeVR5cGVNdWx0aXBvaW50IjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDEsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJlc3JpR2VvbWV0cnlUeXBlUG9seWxpbmUiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlHZW9tZXRyeVR5cGVQb2x5Z29uIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDMsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJlc3JpR2VvbWV0cnlUeXBlTXVsdGlwYXRjaCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA0LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUdlb21ldHJ5VHlwZU5vbmUiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTI3LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0KICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkVHlwZSA9IHsKICAgICAgICAgICJlc3JpRmllbGRUeXBlU21hbGxJbnRlZ2VyIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDAsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJlc3JpRmllbGRUeXBlSW50ZWdlciI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAxLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZVNpbmdsZSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAyLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZURvdWJsZSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAzLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZVN0cmluZyI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA0LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZURhdGUiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogNSwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlGaWVsZFR5cGVPSUQiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogNiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlGaWVsZFR5cGVHZW9tZXRyeSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA3LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUJsb2IiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogOCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlGaWVsZFR5cGVSYXN0ZXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogOSwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImVzcmlGaWVsZFR5cGVHVUlEIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDEwLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUdsb2JhbElEIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDExLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZVhNTCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAxMiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TUUxUeXBlID0gewogICAgICAgICAgInNxbFR5cGVCaWdJbnQiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVCaW5hcnkiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMSwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVCaXQiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVDaGFyIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDMsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlRGF0ZSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA0LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAic3FsVHlwZURlY2ltYWwiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogNSwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVEb3VibGUiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogNiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVGbG9hdCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA3LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAic3FsVHlwZUdlb21ldHJ5IjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDgsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlR1VJRCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiA5LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAic3FsVHlwZUludGVnZXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTAsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlTG9uZ05WYXJjaGFyIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDExLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAic3FsVHlwZUxvbmdWYXJiaW5hcnkiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTIsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlTG9uZ1ZhcmNoYXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTMsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlTkNoYXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTQsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlTlZhcmNoYXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTUsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlT3RoZXIiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTYsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlUmVhbCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAxNywKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVTbWFsbEludCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAxOCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVTcWxYbWwiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMTksCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlVGltZSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAyMCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVUaW1lc3RhbXAiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMjEsCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQogICAgICAgICAgfSwKICAgICAgICAgICJzcWxUeXBlVGltZXN0YW1wMiI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAyMiwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVUaW55SW50IjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDIzLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0sCiAgICAgICAgICAic3FsVHlwZVZhcmJpbmFyeSI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAyNCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgInNxbFR5cGVWYXJjaGFyIjogewogICAgICAgICAgICAgICJ2YWx1ZSI6IDI1LAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0KICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1YW50aXplT3JpZ2luUG9zdGlvbiA9IHsKICAgICAgICAgICJ1cHBlckxlZnQiOiB7CiAgICAgICAgICAgICAgInZhbHVlIjogMCwKICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9CiAgICAgICAgICB9LAogICAgICAgICAgImxvd2VyTGVmdCI6IHsKICAgICAgICAgICAgICAidmFsdWUiOiAxLAogICAgICAgICAgICAgICJvcHRpb25zIjoge30KICAgICAgICAgIH0KICAgICAgfTsKICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZSA9IHt9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZS5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7CiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UuX3JlYWRGaWVsZCwgeyB3a2lkOiAwLCBsYXN0ZXN0V2tpZDogMCwgdmNzV2tpZDogMCwgbGF0ZXN0VmNzV2tpZDogMCwgd2t0OiAiIiB9LCBlbmQpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZS5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsKICAgICAgICAgIGlmICh0YWcgPT09IDEpCiAgICAgICAgICAgICAgb2JqLndraWQgPSBwYmYucmVhZFZhcmludCgpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAyKQogICAgICAgICAgICAgIG9iai5sYXN0ZXN0V2tpZCA9IHBiZi5yZWFkVmFyaW50KCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpCiAgICAgICAgICAgICAgb2JqLnZjc1draWQgPSBwYmYucmVhZFZhcmludCgpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA0KQogICAgICAgICAgICAgIG9iai5sYXRlc3RWY3NXa2lkID0gcGJmLnJlYWRWYXJpbnQoKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNSkKICAgICAgICAgICAgICBvYmoud2t0ID0gcGJmLnJlYWRTdHJpbmcoKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2Uud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsKICAgICAgICAgIGlmIChvYmoud2tpZCkKICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgxLCBvYmoud2tpZCk7CiAgICAgICAgICBpZiAob2JqLmxhc3Rlc3RXa2lkKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDIsIG9iai5sYXN0ZXN0V2tpZCk7CiAgICAgICAgICBpZiAob2JqLnZjc1draWQpCiAgICAgICAgICAgICAgcGJmLndyaXRlVmFyaW50RmllbGQoMywgb2JqLnZjc1draWQpOwogICAgICAgICAgaWYgKG9iai5sYXRlc3RWY3NXa2lkKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDQsIG9iai5sYXRlc3RWY3NXa2lkKTsKICAgICAgICAgIGlmIChvYmoud2t0KQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDUsIG9iai53a3QpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmllbGQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmllbGQgPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmllbGQuX3JlYWRGaWVsZCwgeyBuYW1lOiAiIiwgZmllbGRUeXBlOiAwLCBhbGlhczogIiIsIHNxbFR5cGU6IDAsIGRvbWFpbjogIiIsIGRlZmF1bHRWYWx1ZTogIiIgfSwgZW5kKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmoubmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgb2JqLmZpZWxkVHlwZSA9IHBiZi5yZWFkVmFyaW50KCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpCiAgICAgICAgICAgICAgb2JqLmFsaWFzID0gcGJmLnJlYWRTdHJpbmcoKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNCkKICAgICAgICAgICAgICBvYmouc3FsVHlwZSA9IHBiZi5yZWFkVmFyaW50KCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDUpCiAgICAgICAgICAgICAgb2JqLmRvbWFpbiA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDYpCiAgICAgICAgICAgICAgb2JqLmRlZmF1bHRWYWx1ZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GaWVsZC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5uYW1lKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDEsIG9iai5uYW1lKTsKICAgICAgICAgIGlmIChvYmouZmllbGRUeXBlKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDIsIG9iai5maWVsZFR5cGUpOwogICAgICAgICAgaWYgKG9iai5hbGlhcykKICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgzLCBvYmouYWxpYXMpOwogICAgICAgICAgaWYgKG9iai5zcWxUeXBlKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDQsIG9iai5zcWxUeXBlKTsKICAgICAgICAgIGlmIChvYmouZG9tYWluKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDUsIG9iai5kb21haW4pOwogICAgICAgICAgaWYgKG9iai5kZWZhdWx0VmFsdWUpCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoNiwgb2JqLmRlZmF1bHRWYWx1ZSk7CiAgICAgIH07CiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZSA9IHt9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZS5fcmVhZEZpZWxkLCB7IHN0cmluZ192YWx1ZTogIiIsIHZhbHVlX3R5cGU6IG51bGwsIGZsb2F0X3ZhbHVlOiAwLCBkb3VibGVfdmFsdWU6IDAsIHNpbnRfdmFsdWU6IDAsIHVpbnRfdmFsdWU6IDAsIGludDY0X3ZhbHVlOiAwLCB1aW50NjRfdmFsdWU6IDAsIHNpbnQ2NF92YWx1ZTogMCwgYm9vbF92YWx1ZTogZmFsc2UgfSwgZW5kKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlZhbHVlLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmouc3RyaW5nX3ZhbHVlID0gcGJmLnJlYWRTdHJpbmcoKSwgb2JqLnZhbHVlX3R5cGUgPSAic3RyaW5nX3ZhbHVlIjsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmouZmxvYXRfdmFsdWUgPSBwYmYucmVhZEZsb2F0KCksIG9iai52YWx1ZV90eXBlID0gImZsb2F0X3ZhbHVlIjsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMykKICAgICAgICAgICAgICBvYmouZG91YmxlX3ZhbHVlID0gcGJmLnJlYWREb3VibGUoKSwgb2JqLnZhbHVlX3R5cGUgPSAiZG91YmxlX3ZhbHVlIjsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNCkKICAgICAgICAgICAgICBvYmouc2ludF92YWx1ZSA9IHBiZi5yZWFkU1ZhcmludCgpLCBvYmoudmFsdWVfdHlwZSA9ICJzaW50X3ZhbHVlIjsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNSkKICAgICAgICAgICAgICBvYmoudWludF92YWx1ZSA9IHBiZi5yZWFkVmFyaW50KCksIG9iai52YWx1ZV90eXBlID0gInVpbnRfdmFsdWUiOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA2KQogICAgICAgICAgICAgIG9iai5pbnQ2NF92YWx1ZSA9IHBiZi5yZWFkVmFyaW50KHRydWUpLCBvYmoudmFsdWVfdHlwZSA9ICJpbnQ2NF92YWx1ZSI7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDcpCiAgICAgICAgICAgICAgb2JqLnVpbnQ2NF92YWx1ZSA9IHBiZi5yZWFkVmFyaW50KCksIG9iai52YWx1ZV90eXBlID0gInVpbnQ2NF92YWx1ZSI7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDgpCiAgICAgICAgICAgICAgb2JqLnNpbnQ2NF92YWx1ZSA9IHBiZi5yZWFkU1ZhcmludCgpLCBvYmoudmFsdWVfdHlwZSA9ICJzaW50NjRfdmFsdWUiOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA5KQogICAgICAgICAgICAgIG9iai5ib29sX3ZhbHVlID0gcGJmLnJlYWRCb29sZWFuKCksIG9iai52YWx1ZV90eXBlID0gImJvb2xfdmFsdWUiOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsKICAgICAgICAgIGlmIChvYmouc3RyaW5nX3ZhbHVlKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDEsIG9iai5zdHJpbmdfdmFsdWUpOwogICAgICAgICAgaWYgKG9iai5mbG9hdF92YWx1ZSkKICAgICAgICAgICAgICBwYmYud3JpdGVGbG9hdEZpZWxkKDIsIG9iai5mbG9hdF92YWx1ZSk7CiAgICAgICAgICBpZiAob2JqLmRvdWJsZV92YWx1ZSkKICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgzLCBvYmouZG91YmxlX3ZhbHVlKTsKICAgICAgICAgIGlmIChvYmouc2ludF92YWx1ZSkKICAgICAgICAgICAgICBwYmYud3JpdGVTVmFyaW50RmllbGQoNCwgb2JqLnNpbnRfdmFsdWUpOwogICAgICAgICAgaWYgKG9iai51aW50X3ZhbHVlKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDUsIG9iai51aW50X3ZhbHVlKTsKICAgICAgICAgIGlmIChvYmouaW50NjRfdmFsdWUpCiAgICAgICAgICAgICAgcGJmLndyaXRlVmFyaW50RmllbGQoNiwgb2JqLmludDY0X3ZhbHVlKTsKICAgICAgICAgIGlmIChvYmoudWludDY0X3ZhbHVlKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDcsIG9iai51aW50NjRfdmFsdWUpOwogICAgICAgICAgaWYgKG9iai5zaW50NjRfdmFsdWUpCiAgICAgICAgICAgICAgcGJmLndyaXRlU1ZhcmludEZpZWxkKDgsIG9iai5zaW50NjRfdmFsdWUpOwogICAgICAgICAgaWYgKG9iai5ib29sX3ZhbHVlKQogICAgICAgICAgICAgIHBiZi53cml0ZUJvb2xlYW5GaWVsZCg5LCBvYmouYm9vbF92YWx1ZSk7CiAgICAgIH07CiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeSA9IHt9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnkucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeS5fcmVhZEZpZWxkLCB7IGxlbmd0aHM6IFtdLCBjb29yZHM6IFtdIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeS5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsKICAgICAgICAgIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgcGJmLnJlYWRQYWNrZWRWYXJpbnQob2JqLmxlbmd0aHMpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQogICAgICAgICAgICAgIHBiZi5yZWFkUGFja2VkU1ZhcmludChvYmouY29vcmRzKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAob2JqLmxlbmd0aHMpCiAgICAgICAgICAgICAgcGJmLndyaXRlUGFja2VkVmFyaW50KDIsIG9iai5sZW5ndGhzKTsKICAgICAgICAgIGlmIChvYmouY29vcmRzKQogICAgICAgICAgICAgIHBiZi53cml0ZVBhY2tlZFNWYXJpbnQoMywgb2JqLmNvb3Jkcyk7CiAgICAgIH07CiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuZXNyaVNoYXBlQnVmZmVyID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIuX3JlYWRGaWVsZCwgeyBieXRlczogbnVsbCB9LCBlbmQpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuZXNyaVNoYXBlQnVmZmVyLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmouYnl0ZXMgPSBwYmYucmVhZEJ5dGVzKCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsKICAgICAgICAgIGlmIChvYmouYnl0ZXMpCiAgICAgICAgICAgICAgcGJmLndyaXRlQnl0ZXNGaWVsZCgxLCBvYmouYnl0ZXMpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZS5fcmVhZEZpZWxkLCB7IGF0dHJpYnV0ZXM6IFtdLCBnZW9tZXRyeTogbnVsbCwgY29tcHJlc3NlZF9nZW9tZXRyeTogbnVsbCwgc2hhcGVCdWZmZXI6IG51bGwsIGNlbnRyb2lkOiBudWxsIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmouYXR0cmlidXRlcy5wdXNoKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZS5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmouZ2VvbWV0cnkgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnkucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSwgb2JqLmNvbXByZXNzZWRfZ2VvbWV0cnkgPSAiZ2VvbWV0cnkiOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQogICAgICAgICAgICAgIG9iai5zaGFwZUJ1ZmZlciA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSwgb2JqLmNvbXByZXNzZWRfZ2VvbWV0cnkgPSAic2hhcGVCdWZmZXIiOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA0KQogICAgICAgICAgICAgIG9iai5jZW50cm9pZCA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeS5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZS53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5hdHRyaWJ1dGVzKQogICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspCiAgICAgICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMSwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlZhbHVlLndyaXRlLCBvYmouYXR0cmlidXRlc1tpXSk7CiAgICAgICAgICBpZiAob2JqLmdlb21ldHJ5KQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMiwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LndyaXRlLCBvYmouZ2VvbWV0cnkpOwogICAgICAgICAgaWYgKG9iai5zaGFwZUJ1ZmZlcikKICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDMsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIud3JpdGUsIG9iai5zaGFwZUJ1ZmZlcik7CiAgICAgICAgICBpZiAob2JqLmNlbnRyb2lkKQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoNCwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LndyaXRlLCBvYmouY2VudHJvaWQpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5VbmlxdWVJZEZpZWxkID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5VbmlxdWVJZEZpZWxkLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC5fcmVhZEZpZWxkLCB7IG5hbWU6ICIiLCBpc1N5c3RlbU1haW50YWluZWQ6IGZhbHNlIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5VbmlxdWVJZEZpZWxkLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmoubmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgb2JqLmlzU3lzdGVtTWFpbnRhaW5lZCA9IHBiZi5yZWFkQm9vbGVhbigpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5uYW1lKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDEsIG9iai5uYW1lKTsKICAgICAgICAgIGlmIChvYmouaXNTeXN0ZW1NYWludGFpbmVkKQogICAgICAgICAgICAgIHBiZi53cml0ZUJvb2xlYW5GaWVsZCgyLCBvYmouaXNTeXN0ZW1NYWludGFpbmVkKTsKICAgICAgfTsKICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVByb3BlcnRpZXMgPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcy5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7CiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcy5fcmVhZEZpZWxkLCB7IHNoYXBlQXJlYUZpZWxkTmFtZTogIiIsIHNoYXBlTGVuZ3RoRmllbGROYW1lOiAiIiwgdW5pdHM6ICIiIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVByb3BlcnRpZXMuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai5zaGFwZUFyZWFGaWVsZE5hbWUgPSBwYmYucmVhZFN0cmluZygpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAyKQogICAgICAgICAgICAgIG9iai5zaGFwZUxlbmd0aEZpZWxkTmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpCiAgICAgICAgICAgICAgb2JqLnVuaXRzID0gcGJmLnJlYWRTdHJpbmcoKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcy53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5zaGFwZUFyZWFGaWVsZE5hbWUpCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoMSwgb2JqLnNoYXBlQXJlYUZpZWxkTmFtZSk7CiAgICAgICAgICBpZiAob2JqLnNoYXBlTGVuZ3RoRmllbGROYW1lKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDIsIG9iai5zaGFwZUxlbmd0aEZpZWxkTmFtZSk7CiAgICAgICAgICBpZiAob2JqLnVuaXRzKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDMsIG9iai51bml0cyk7CiAgICAgIH07CiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMgPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zLl9yZWFkRmllbGQsIHsgbWluU2VydmVyR2VuOiAwLCBzZXJ2ZXJHZW46IDAgfSwgZW5kKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai5taW5TZXJ2ZXJHZW4gPSBwYmYucmVhZFZhcmludCgpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAyKQogICAgICAgICAgICAgIG9iai5zZXJ2ZXJHZW4gPSBwYmYucmVhZFZhcmludCgpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2VydmVyR2Vucy53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5taW5TZXJ2ZXJHZW4pCiAgICAgICAgICAgICAgcGJmLndyaXRlVmFyaW50RmllbGQoMSwgb2JqLm1pblNlcnZlckdlbik7CiAgICAgICAgICBpZiAob2JqLnNlcnZlckdlbikKICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgyLCBvYmouc2VydmVyR2VuKTsKICAgICAgfTsKICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNjYWxlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNjYWxlID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7CiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNjYWxlLl9yZWFkRmllbGQsIHsgeFNjYWxlOiAwLCB5U2NhbGU6IDAsIG1TY2FsZTogMCwgelNjYWxlOiAwIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsKICAgICAgICAgIGlmICh0YWcgPT09IDEpCiAgICAgICAgICAgICAgb2JqLnhTY2FsZSA9IHBiZi5yZWFkRG91YmxlKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgb2JqLnlTY2FsZSA9IHBiZi5yZWFkRG91YmxlKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpCiAgICAgICAgICAgICAgb2JqLm1TY2FsZSA9IHBiZi5yZWFkRG91YmxlKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpCiAgICAgICAgICAgICAgb2JqLnpTY2FsZSA9IHBiZi5yZWFkRG91YmxlKCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai54U2NhbGUpCiAgICAgICAgICAgICAgcGJmLndyaXRlRG91YmxlRmllbGQoMSwgb2JqLnhTY2FsZSk7CiAgICAgICAgICBpZiAob2JqLnlTY2FsZSkKICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgyLCBvYmoueVNjYWxlKTsKICAgICAgICAgIGlmIChvYmoubVNjYWxlKQogICAgICAgICAgICAgIHBiZi53cml0ZURvdWJsZUZpZWxkKDMsIG9iai5tU2NhbGUpOwogICAgICAgICAgaWYgKG9iai56U2NhbGUpCiAgICAgICAgICAgICAgcGJmLndyaXRlRG91YmxlRmllbGQoNCwgb2JqLnpTY2FsZSk7CiAgICAgIH07CiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2xhdGUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2xhdGUucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgewogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2xhdGUuX3JlYWRGaWVsZCwgeyB4VHJhbnNsYXRlOiAwLCB5VHJhbnNsYXRlOiAwLCBtVHJhbnNsYXRlOiAwLCB6VHJhbnNsYXRlOiAwIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2xhdGUuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai54VHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmoueVRyYW5zbGF0ZSA9IHBiZi5yZWFkRG91YmxlKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpCiAgICAgICAgICAgICAgb2JqLm1UcmFuc2xhdGUgPSBwYmYucmVhZERvdWJsZSgpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA0KQogICAgICAgICAgICAgIG9iai56VHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zbGF0ZS53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai54VHJhbnNsYXRlKQogICAgICAgICAgICAgIHBiZi53cml0ZURvdWJsZUZpZWxkKDEsIG9iai54VHJhbnNsYXRlKTsKICAgICAgICAgIGlmIChvYmoueVRyYW5zbGF0ZSkKICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgyLCBvYmoueVRyYW5zbGF0ZSk7CiAgICAgICAgICBpZiAob2JqLm1UcmFuc2xhdGUpCiAgICAgICAgICAgICAgcGJmLndyaXRlRG91YmxlRmllbGQoMywgb2JqLm1UcmFuc2xhdGUpOwogICAgICAgICAgaWYgKG9iai56VHJhbnNsYXRlKQogICAgICAgICAgICAgIHBiZi53cml0ZURvdWJsZUZpZWxkKDQsIG9iai56VHJhbnNsYXRlKTsKICAgICAgfTsKICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2Zvcm0gPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybS5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7CiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybS5fcmVhZEZpZWxkLCB7IHF1YW50aXplT3JpZ2luUG9zdGlvbjogMCwgc2NhbGU6IG51bGwsIHRyYW5zbGF0ZTogbnVsbCB9LCBlbmQpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgewogICAgICAgICAgaWYgKHRhZyA9PT0gMSkKICAgICAgICAgICAgICBvYmoucXVhbnRpemVPcmlnaW5Qb3N0aW9uID0gcGJmLnJlYWRWYXJpbnQoKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmouc2NhbGUgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2NhbGUucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMykKICAgICAgICAgICAgICBvYmoudHJhbnNsYXRlID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zbGF0ZS5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAob2JqLnF1YW50aXplT3JpZ2luUG9zdGlvbikKICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgxLCBvYmoucXVhbnRpemVPcmlnaW5Qb3N0aW9uKTsKICAgICAgICAgIGlmIChvYmouc2NhbGUpCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2NhbGUud3JpdGUsIG9iai5zY2FsZSk7CiAgICAgICAgICBpZiAob2JqLnRyYW5zbGF0ZSkKICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDMsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2xhdGUud3JpdGUsIG9iai50cmFuc2xhdGUpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlUmVzdWx0ID0ge307CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlUmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdC5fcmVhZEZpZWxkLCB7IG9iamVjdElkRmllbGROYW1lOiAiIiwgdW5pcXVlSWRGaWVsZDogbnVsbCwgZ2xvYmFsSWRGaWVsZE5hbWU6ICIiLCBnZW9oYXNoRmllbGROYW1lOiAiIiwgZ2VvbWV0cnlQcm9wZXJ0aWVzOiBudWxsLCBzZXJ2ZXJHZW5zOiBudWxsLCBnZW9tZXRyeVR5cGU6IDAsIHNwYXRpYWxSZWZlcmVuY2U6IG51bGwsIGV4Y2VlZGVkVHJhbnNmZXJMaW1pdDogZmFsc2UsIGhhc1o6IGZhbHNlLCBoYXNNOiBmYWxzZSwgdHJhbnNmb3JtOiBudWxsLCBmaWVsZHM6IFtdLCB2YWx1ZXM6IFtdLCBmZWF0dXJlczogW10gfSwgZW5kKTsKICAgICAgfTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmVSZXN1bHQuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai5vYmplY3RJZEZpZWxkTmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgb2JqLnVuaXF1ZUlkRmllbGQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQogICAgICAgICAgICAgIG9iai5nbG9iYWxJZEZpZWxkTmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpCiAgICAgICAgICAgICAgb2JqLmdlb2hhc2hGaWVsZE5hbWUgPSBwYmYucmVhZFN0cmluZygpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA1KQogICAgICAgICAgICAgIG9iai5nZW9tZXRyeVByb3BlcnRpZXMgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnlQcm9wZXJ0aWVzLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDYpCiAgICAgICAgICAgICAgb2JqLnNlcnZlckdlbnMgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2VydmVyR2Vucy5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA3KQogICAgICAgICAgICAgIG9iai5nZW9tZXRyeVR5cGUgPSBwYmYucmVhZFZhcmludCgpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA4KQogICAgICAgICAgICAgIG9iai5zcGF0aWFsUmVmZXJlbmNlID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gOSkKICAgICAgICAgICAgICBvYmouZXhjZWVkZWRUcmFuc2ZlckxpbWl0ID0gcGJmLnJlYWRCb29sZWFuKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDEwKQogICAgICAgICAgICAgIG9iai5oYXNaID0gcGJmLnJlYWRCb29sZWFuKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDExKQogICAgICAgICAgICAgIG9iai5oYXNNID0gcGJmLnJlYWRCb29sZWFuKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDEyKQogICAgICAgICAgICAgIG9iai50cmFuc2Zvcm0gPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDEzKQogICAgICAgICAgICAgIG9iai5maWVsZHMucHVzaChGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmllbGQucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDE0KQogICAgICAgICAgICAgIG9iai52YWx1ZXMucHVzaChGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDE1KQogICAgICAgICAgICAgIG9iai5mZWF0dXJlcy5wdXNoKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcykpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5vYmplY3RJZEZpZWxkTmFtZSkKICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmoub2JqZWN0SWRGaWVsZE5hbWUpOwogICAgICAgICAgaWYgKG9iai51bmlxdWVJZEZpZWxkKQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMiwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlVuaXF1ZUlkRmllbGQud3JpdGUsIG9iai51bmlxdWVJZEZpZWxkKTsKICAgICAgICAgIGlmIChvYmouZ2xvYmFsSWRGaWVsZE5hbWUpCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoMywgb2JqLmdsb2JhbElkRmllbGROYW1lKTsKICAgICAgICAgIGlmIChvYmouZ2VvaGFzaEZpZWxkTmFtZSkKICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCg0LCBvYmouZ2VvaGFzaEZpZWxkTmFtZSk7CiAgICAgICAgICBpZiAob2JqLmdlb21ldHJ5UHJvcGVydGllcykKICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDUsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVByb3BlcnRpZXMud3JpdGUsIG9iai5nZW9tZXRyeVByb3BlcnRpZXMpOwogICAgICAgICAgaWYgKG9iai5zZXJ2ZXJHZW5zKQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoNiwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMud3JpdGUsIG9iai5zZXJ2ZXJHZW5zKTsKICAgICAgICAgIGlmIChvYmouZ2VvbWV0cnlUeXBlKQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDcsIG9iai5nZW9tZXRyeVR5cGUpOwogICAgICAgICAgaWYgKG9iai5zcGF0aWFsUmVmZXJlbmNlKQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoOCwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2Uud3JpdGUsIG9iai5zcGF0aWFsUmVmZXJlbmNlKTsKICAgICAgICAgIGlmIChvYmouZXhjZWVkZWRUcmFuc2ZlckxpbWl0KQogICAgICAgICAgICAgIHBiZi53cml0ZUJvb2xlYW5GaWVsZCg5LCBvYmouZXhjZWVkZWRUcmFuc2ZlckxpbWl0KTsKICAgICAgICAgIGlmIChvYmouaGFzWikKICAgICAgICAgICAgICBwYmYud3JpdGVCb29sZWFuRmllbGQoMTAsIG9iai5oYXNaKTsKICAgICAgICAgIGlmIChvYmouaGFzTSkKICAgICAgICAgICAgICBwYmYud3JpdGVCb29sZWFuRmllbGQoMTEsIG9iai5oYXNNKTsKICAgICAgICAgIGlmIChvYmoudHJhbnNmb3JtKQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMTIsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2Zvcm0ud3JpdGUsIG9iai50cmFuc2Zvcm0pOwogICAgICAgICAgaWYgKG9iai5maWVsZHMpCiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZmllbGRzLmxlbmd0aDsgaSsrKQogICAgICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDEzLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmllbGQud3JpdGUsIG9iai5maWVsZHNbaV0pOwogICAgICAgICAgaWYgKG9iai52YWx1ZXMpCiAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iai52YWx1ZXMubGVuZ3RoOyBpKyspCiAgICAgICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMTQsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZS53cml0ZSwgb2JqLnZhbHVlc1tpXSk7CiAgICAgICAgICBpZiAob2JqLmZlYXR1cmVzKQogICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvYmouZmVhdHVyZXMubGVuZ3RoOyBpKyspCiAgICAgICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMTUsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLndyaXRlLCBvYmouZmVhdHVyZXNbaV0pOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQgPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkNvdW50UmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQuX3JlYWRGaWVsZCwgeyBjb3VudDogMCB9LCBlbmQpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai5jb3VudCA9IHBiZi5yZWFkVmFyaW50KCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5Db3VudFJlc3VsdC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5jb3VudCkKICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgxLCBvYmouY291bnQpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLk9iamVjdElkc1Jlc3VsdCA9IHt9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0Ll9yZWFkRmllbGQsIHsgb2JqZWN0SWRGaWVsZE5hbWU6ICIiLCBzZXJ2ZXJHZW5zOiBudWxsLCBvYmplY3RJZHM6IFtdIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5PYmplY3RJZHNSZXN1bHQuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAodGFnID09PSAxKQogICAgICAgICAgICAgIG9iai5vYmplY3RJZEZpZWxkTmFtZSA9IHBiZi5yZWFkU3RyaW5nKCk7CiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpCiAgICAgICAgICAgICAgb2JqLnNlcnZlckdlbnMgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2VydmVyR2Vucy5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQogICAgICAgICAgICAgIHBiZi5yZWFkUGFja2VkVmFyaW50KG9iai5vYmplY3RJZHMpOwogICAgICB9OwogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0LndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7CiAgICAgICAgICBpZiAob2JqLm9iamVjdElkRmllbGROYW1lKQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDEsIG9iai5vYmplY3RJZEZpZWxkTmFtZSk7CiAgICAgICAgICBpZiAob2JqLnNlcnZlckdlbnMpCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2VydmVyR2Vucy53cml0ZSwgb2JqLnNlcnZlckdlbnMpOwogICAgICAgICAgaWYgKG9iai5vYmplY3RJZHMpCiAgICAgICAgICAgICAgcGJmLndyaXRlUGFja2VkVmFyaW50KDMsIG9iai5vYmplY3RJZHMpOwogICAgICB9OwogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuUXVlcnlSZXN1bHQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuUXVlcnlSZXN1bHQgPSB7fTsKICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsKICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuUXVlcnlSZXN1bHQuX3JlYWRGaWVsZCwgeyBmZWF0dXJlUmVzdWx0OiBudWxsLCBSZXN1bHRzOiBudWxsLCBjb3VudFJlc3VsdDogbnVsbCwgaWRzUmVzdWx0OiBudWxsIH0sIGVuZCk7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdC5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsKICAgICAgICAgIGlmICh0YWcgPT09IDEpCiAgICAgICAgICAgICAgb2JqLmZlYXR1cmVSZXN1bHQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdC5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpLCBvYmouUmVzdWx0cyA9ICJmZWF0dXJlUmVzdWx0IjsKICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikKICAgICAgICAgICAgICBvYmouY291bnRSZXN1bHQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSwgb2JqLlJlc3VsdHMgPSAiY291bnRSZXN1bHQiOwogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQogICAgICAgICAgICAgIG9iai5pZHNSZXN1bHQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyksIG9iai5SZXN1bHRzID0gImlkc1Jlc3VsdCI7CiAgICAgIH07CiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgewogICAgICAgICAgaWYgKG9iai5mZWF0dXJlUmVzdWx0KQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMSwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmVSZXN1bHQud3JpdGUsIG9iai5mZWF0dXJlUmVzdWx0KTsKICAgICAgICAgIGlmIChvYmouY291bnRSZXN1bHQpCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQud3JpdGUsIG9iai5jb3VudFJlc3VsdCk7CiAgICAgICAgICBpZiAob2JqLmlkc1Jlc3VsdCkKICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDMsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5PYmplY3RJZHNSZXN1bHQud3JpdGUsIG9iai5pZHNSZXN1bHQpOwogICAgICB9OwogICAgICByZXR1cm4gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyOwogIH0KCiAgZnVuY3Rpb24gZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMgKHgpIHsKICAJcmV0dXJuIHggJiYgeC5fX2VzTW9kdWxlICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh4LCAnZGVmYXVsdCcpID8geFsnZGVmYXVsdCddIDogeDsKICB9CgogIHZhciBpZWVlNzU0JDEgPSB7fTsKCiAgLyohIGllZWU3NTQuIEJTRC0zLUNsYXVzZSBMaWNlbnNlLiBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmcvb3BlbnNvdXJjZT4gKi8KCiAgaWVlZTc1NCQxLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykgewogICAgdmFyIGUsIG07CiAgICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxOwogICAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDE7CiAgICB2YXIgZUJpYXMgPSBlTWF4ID4+IDE7CiAgICB2YXIgbkJpdHMgPSAtNzsKICAgIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDA7CiAgICB2YXIgZCA9IGlzTEUgPyAtMSA6IDE7CiAgICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTsKCiAgICBpICs9IGQ7CgogICAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7CiAgICBzID4+PSAoLW5CaXRzKTsKICAgIG5CaXRzICs9IGVMZW47CiAgICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9CgogICAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7CiAgICBlID4+PSAoLW5CaXRzKTsKICAgIG5CaXRzICs9IG1MZW47CiAgICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9CgogICAgaWYgKGUgPT09IDApIHsKICAgICAgZSA9IDEgLSBlQmlhczsKICAgIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkgewogICAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSkKICAgIH0gZWxzZSB7CiAgICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7CiAgICAgIGUgPSBlIC0gZUJpYXM7CiAgICB9CiAgICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKQogIH07CgogIGllZWU3NTQkMS53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykgewogICAgdmFyIGUsIG0sIGM7CiAgICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxOwogICAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDE7CiAgICB2YXIgZUJpYXMgPSBlTWF4ID4+IDE7CiAgICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApOwogICAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKTsKICAgIHZhciBkID0gaXNMRSA/IDEgOiAtMTsKICAgIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwOwoKICAgIHZhbHVlID0gTWF0aC5hYnModmFsdWUpOwoKICAgIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7CiAgICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDsKICAgICAgZSA9IGVNYXg7CiAgICB9IGVsc2UgewogICAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7CiAgICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHsKICAgICAgICBlLS07CiAgICAgICAgYyAqPSAyOwogICAgICB9CiAgICAgIGlmIChlICsgZUJpYXMgPj0gMSkgewogICAgICAgIHZhbHVlICs9IHJ0IC8gYzsKICAgICAgfSBlbHNlIHsKICAgICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7CiAgICAgIH0KICAgICAgaWYgKHZhbHVlICogYyA+PSAyKSB7CiAgICAgICAgZSsrOwogICAgICAgIGMgLz0gMjsKICAgICAgfQoKICAgICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7CiAgICAgICAgbSA9IDA7CiAgICAgICAgZSA9IGVNYXg7CiAgICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHsKICAgICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTsKICAgICAgICBlID0gZSArIGVCaWFzOwogICAgICB9IGVsc2UgewogICAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTsKICAgICAgICBlID0gMDsKICAgICAgfQogICAgfQoKICAgIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9CgogICAgZSA9IChlIDw8IG1MZW4pIHwgbTsKICAgIGVMZW4gKz0gbUxlbjsKICAgIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge30KCiAgICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjg7CiAgfTsKCiAgdmFyIHBiZiA9IFBiZjsKCiAgdmFyIGllZWU3NTQgPSBpZWVlNzU0JDE7CgogIGZ1bmN0aW9uIFBiZihidWYpIHsKICAgICAgdGhpcy5idWYgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KGJ1ZikgPyBidWYgOiBuZXcgVWludDhBcnJheShidWYgfHwgMCk7CiAgICAgIHRoaXMucG9zID0gMDsKICAgICAgdGhpcy50eXBlID0gMDsKICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmJ1Zi5sZW5ndGg7CiAgfQoKICBQYmYuVmFyaW50ICA9IDA7IC8vIHZhcmludDogaW50MzIsIGludDY0LCB1aW50MzIsIHVpbnQ2NCwgc2ludDMyLCBzaW50NjQsIGJvb2wsIGVudW0KICBQYmYuRml4ZWQ2NCA9IDE7IC8vIDY0LWJpdDogZG91YmxlLCBmaXhlZDY0LCBzZml4ZWQ2NAogIFBiZi5CeXRlcyAgID0gMjsgLy8gbGVuZ3RoLWRlbGltaXRlZDogc3RyaW5nLCBieXRlcywgZW1iZWRkZWQgbWVzc2FnZXMsIHBhY2tlZCByZXBlYXRlZCBmaWVsZHMKICBQYmYuRml4ZWQzMiA9IDU7IC8vIDMyLWJpdDogZmxvYXQsIGZpeGVkMzIsIHNmaXhlZDMyCgogIHZhciBTSElGVF9MRUZUXzMyID0gKDEgPDwgMTYpICogKDEgPDwgMTYpLAogICAgICBTSElGVF9SSUdIVF8zMiA9IDEgLyBTSElGVF9MRUZUXzMyOwoKICAvLyBUaHJlc2hvbGQgY2hvc2VuIGJhc2VkIG9uIGJvdGggYmVuY2htYXJraW5nIGFuZCBrbm93bGVkZ2UgYWJvdXQgYnJvd3NlciBzdHJpbmcKICAvLyBkYXRhIHN0cnVjdHVyZXMgKHdoaWNoIGN1cnJlbnRseSBzd2l0Y2ggc3RydWN0dXJlIHR5cGVzIGF0IDEyIGJ5dGVzIG9yIG1vcmUpCiAgdmFyIFRFWFRfREVDT0RFUl9NSU5fTEVOR1RIID0gMTI7CiAgdmFyIHV0ZjhUZXh0RGVjb2RlciA9IHR5cGVvZiBUZXh0RGVjb2RlciA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogbmV3IFRleHREZWNvZGVyKCd1dGY4Jyk7CgogIFBiZi5wcm90b3R5cGUgPSB7CgogICAgICBkZXN0cm95OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHRoaXMuYnVmID0gbnVsbDsKICAgICAgfSwKCiAgICAgIC8vID09PSBSRUFESU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgogICAgICByZWFkRmllbGRzOiBmdW5jdGlvbihyZWFkRmllbGQsIHJlc3VsdCwgZW5kKSB7CiAgICAgICAgICBlbmQgPSBlbmQgfHwgdGhpcy5sZW5ndGg7CgogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSB7CiAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMucmVhZFZhcmludCgpLAogICAgICAgICAgICAgICAgICB0YWcgPSB2YWwgPj4gMywKICAgICAgICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLnBvczsKCiAgICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsICYgMHg3OwogICAgICAgICAgICAgIHJlYWRGaWVsZCh0YWcsIHJlc3VsdCwgdGhpcyk7CgogICAgICAgICAgICAgIGlmICh0aGlzLnBvcyA9PT0gc3RhcnRQb3MpIHRoaXMuc2tpcCh2YWwpOwogICAgICAgICAgfQogICAgICAgICAgcmV0dXJuIHJlc3VsdDsKICAgICAgfSwKCiAgICAgIHJlYWRNZXNzYWdlOiBmdW5jdGlvbihyZWFkRmllbGQsIHJlc3VsdCkgewogICAgICAgICAgcmV0dXJuIHRoaXMucmVhZEZpZWxkcyhyZWFkRmllbGQsIHJlc3VsdCwgdGhpcy5yZWFkVmFyaW50KCkgKyB0aGlzLnBvcyk7CiAgICAgIH0sCgogICAgICByZWFkRml4ZWQzMjogZnVuY3Rpb24oKSB7CiAgICAgICAgICB2YXIgdmFsID0gcmVhZFVJbnQzMih0aGlzLmJ1ZiwgdGhpcy5wb3MpOwogICAgICAgICAgdGhpcy5wb3MgKz0gNDsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICByZWFkU0ZpeGVkMzI6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIHZhbCA9IHJlYWRJbnQzMih0aGlzLmJ1ZiwgdGhpcy5wb3MpOwogICAgICAgICAgdGhpcy5wb3MgKz0gNDsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICAvLyA2NC1iaXQgaW50IGhhbmRsaW5nIGlzIGJhc2VkIG9uIGdpdGh1Yi5jb20vZHB3L25vZGUtYnVmZmVyLW1vcmUtaW50cyAoTUlULWxpY2Vuc2VkKQoKICAgICAgcmVhZEZpeGVkNjQ6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIHZhbCA9IHJlYWRVSW50MzIodGhpcy5idWYsIHRoaXMucG9zKSArIHJlYWRVSW50MzIodGhpcy5idWYsIHRoaXMucG9zICsgNCkgKiBTSElGVF9MRUZUXzMyOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICByZWFkU0ZpeGVkNjQ6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIHZhbCA9IHJlYWRVSW50MzIodGhpcy5idWYsIHRoaXMucG9zKSArIHJlYWRJbnQzMih0aGlzLmJ1ZiwgdGhpcy5wb3MgKyA0KSAqIFNISUZUX0xFRlRfMzI7CiAgICAgICAgICB0aGlzLnBvcyArPSA4OwogICAgICAgICAgcmV0dXJuIHZhbDsKICAgICAgfSwKCiAgICAgIHJlYWRGbG9hdDogZnVuY3Rpb24oKSB7CiAgICAgICAgICB2YXIgdmFsID0gaWVlZTc1NC5yZWFkKHRoaXMuYnVmLCB0aGlzLnBvcywgdHJ1ZSwgMjMsIDQpOwogICAgICAgICAgdGhpcy5wb3MgKz0gNDsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICByZWFkRG91YmxlOiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciB2YWwgPSBpZWVlNzU0LnJlYWQodGhpcy5idWYsIHRoaXMucG9zLCB0cnVlLCA1MiwgOCk7CiAgICAgICAgICB0aGlzLnBvcyArPSA4OwogICAgICAgICAgcmV0dXJuIHZhbDsKICAgICAgfSwKCiAgICAgIHJlYWRWYXJpbnQ6IGZ1bmN0aW9uKGlzU2lnbmVkKSB7CiAgICAgICAgICB2YXIgYnVmID0gdGhpcy5idWYsCiAgICAgICAgICAgICAgdmFsLCBiOwoKICAgICAgICAgIGIgPSBidWZbdGhpcy5wb3MrK107IHZhbCAgPSAgYiAmIDB4N2Y7ICAgICAgICBpZiAoYiA8IDB4ODApIHJldHVybiB2YWw7CiAgICAgICAgICBiID0gYnVmW3RoaXMucG9zKytdOyB2YWwgfD0gKGIgJiAweDdmKSA8PCA3OyAgaWYgKGIgPCAweDgwKSByZXR1cm4gdmFsOwogICAgICAgICAgYiA9IGJ1Zlt0aGlzLnBvcysrXTsgdmFsIHw9IChiICYgMHg3ZikgPDwgMTQ7IGlmIChiIDwgMHg4MCkgcmV0dXJuIHZhbDsKICAgICAgICAgIGIgPSBidWZbdGhpcy5wb3MrK107IHZhbCB8PSAoYiAmIDB4N2YpIDw8IDIxOyBpZiAoYiA8IDB4ODApIHJldHVybiB2YWw7CiAgICAgICAgICBiID0gYnVmW3RoaXMucG9zXTsgICB2YWwgfD0gKGIgJiAweDBmKSA8PCAyODsKCiAgICAgICAgICByZXR1cm4gcmVhZFZhcmludFJlbWFpbmRlcih2YWwsIGlzU2lnbmVkLCB0aGlzKTsKICAgICAgfSwKCiAgICAgIHJlYWRWYXJpbnQ2NDogZnVuY3Rpb24oKSB7IC8vIGZvciBjb21wYXRpYmlsaXR5IHdpdGggdjIuMC4xCiAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkVmFyaW50KHRydWUpOwogICAgICB9LAoKICAgICAgcmVhZFNWYXJpbnQ6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIG51bSA9IHRoaXMucmVhZFZhcmludCgpOwogICAgICAgICAgcmV0dXJuIG51bSAlIDIgPT09IDEgPyAobnVtICsgMSkgLyAtMiA6IG51bSAvIDI7IC8vIHppZ3phZyBlbmNvZGluZwogICAgICB9LAoKICAgICAgcmVhZEJvb2xlYW46IGZ1bmN0aW9uKCkgewogICAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5yZWFkVmFyaW50KCkpOwogICAgICB9LAoKICAgICAgcmVhZFN0cmluZzogZnVuY3Rpb24oKSB7CiAgICAgICAgICB2YXIgZW5kID0gdGhpcy5yZWFkVmFyaW50KCkgKyB0aGlzLnBvczsKICAgICAgICAgIHZhciBwb3MgPSB0aGlzLnBvczsKICAgICAgICAgIHRoaXMucG9zID0gZW5kOwoKICAgICAgICAgIGlmIChlbmQgLSBwb3MgPj0gVEVYVF9ERUNPREVSX01JTl9MRU5HVEggJiYgdXRmOFRleHREZWNvZGVyKSB7CiAgICAgICAgICAgICAgLy8gbG9uZ2VyIHN0cmluZ3MgYXJlIGZhc3Qgd2l0aCB0aGUgYnVpbHQtaW4gYnJvd3NlciBUZXh0RGVjb2RlciBBUEkKICAgICAgICAgICAgICByZXR1cm4gcmVhZFV0ZjhUZXh0RGVjb2Rlcih0aGlzLmJ1ZiwgcG9zLCBlbmQpOwogICAgICAgICAgfQogICAgICAgICAgLy8gc2hvcnQgc3RyaW5ncyBhcmUgZmFzdCB3aXRoIG91ciBjdXN0b20gaW1wbGVtZW50YXRpb24KICAgICAgICAgIHJldHVybiByZWFkVXRmOCh0aGlzLmJ1ZiwgcG9zLCBlbmQpOwogICAgICB9LAoKICAgICAgcmVhZEJ5dGVzOiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciBlbmQgPSB0aGlzLnJlYWRWYXJpbnQoKSArIHRoaXMucG9zLAogICAgICAgICAgICAgIGJ1ZmZlciA9IHRoaXMuYnVmLnN1YmFycmF5KHRoaXMucG9zLCBlbmQpOwogICAgICAgICAgdGhpcy5wb3MgPSBlbmQ7CiAgICAgICAgICByZXR1cm4gYnVmZmVyOwogICAgICB9LAoKICAgICAgLy8gdmVyYm9zZSBmb3IgcGVyZm9ybWFuY2UgcmVhc29uczsgZG9lc24ndCBhZmZlY3QgZ3ppcHBlZCBzaXplCgogICAgICByZWFkUGFja2VkVmFyaW50OiBmdW5jdGlvbihhcnIsIGlzU2lnbmVkKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRWYXJpbnQoaXNTaWduZWQpKTsKICAgICAgICAgIHZhciBlbmQgPSByZWFkUGFja2VkRW5kKHRoaXMpOwogICAgICAgICAgYXJyID0gYXJyIHx8IFtdOwogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSBhcnIucHVzaCh0aGlzLnJlYWRWYXJpbnQoaXNTaWduZWQpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRTVmFyaW50OiBmdW5jdGlvbihhcnIpIHsKICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFBiZi5CeXRlcykgcmV0dXJuIGFyci5wdXNoKHRoaXMucmVhZFNWYXJpbnQoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkU1ZhcmludCgpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRCb29sZWFuOiBmdW5jdGlvbihhcnIpIHsKICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFBiZi5CeXRlcykgcmV0dXJuIGFyci5wdXNoKHRoaXMucmVhZEJvb2xlYW4oKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkQm9vbGVhbigpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRGbG9hdDogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRGbG9hdCgpKTsKICAgICAgICAgIHZhciBlbmQgPSByZWFkUGFja2VkRW5kKHRoaXMpOwogICAgICAgICAgYXJyID0gYXJyIHx8IFtdOwogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSBhcnIucHVzaCh0aGlzLnJlYWRGbG9hdCgpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWREb3VibGU6IGZ1bmN0aW9uKGFycikgewogICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gUGJmLkJ5dGVzKSByZXR1cm4gYXJyLnB1c2godGhpcy5yZWFkRG91YmxlKCkpOwogICAgICAgICAgdmFyIGVuZCA9IHJlYWRQYWNrZWRFbmQodGhpcyk7CiAgICAgICAgICBhcnIgPSBhcnIgfHwgW107CiAgICAgICAgICB3aGlsZSAodGhpcy5wb3MgPCBlbmQpIGFyci5wdXNoKHRoaXMucmVhZERvdWJsZSgpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRGaXhlZDMyOiBmdW5jdGlvbihhcnIpIHsKICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFBiZi5CeXRlcykgcmV0dXJuIGFyci5wdXNoKHRoaXMucmVhZEZpeGVkMzIoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkRml4ZWQzMigpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRTRml4ZWQzMjogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRTRml4ZWQzMigpKTsKICAgICAgICAgIHZhciBlbmQgPSByZWFkUGFja2VkRW5kKHRoaXMpOwogICAgICAgICAgYXJyID0gYXJyIHx8IFtdOwogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSBhcnIucHVzaCh0aGlzLnJlYWRTRml4ZWQzMigpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRGaXhlZDY0OiBmdW5jdGlvbihhcnIpIHsKICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFBiZi5CeXRlcykgcmV0dXJuIGFyci5wdXNoKHRoaXMucmVhZEZpeGVkNjQoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkRml4ZWQ2NCgpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCiAgICAgIHJlYWRQYWNrZWRTRml4ZWQ2NDogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRTRml4ZWQ2NCgpKTsKICAgICAgICAgIHZhciBlbmQgPSByZWFkUGFja2VkRW5kKHRoaXMpOwogICAgICAgICAgYXJyID0gYXJyIHx8IFtdOwogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSBhcnIucHVzaCh0aGlzLnJlYWRTRml4ZWQ2NCgpKTsKICAgICAgICAgIHJldHVybiBhcnI7CiAgICAgIH0sCgogICAgICBza2lwOiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHZhciB0eXBlID0gdmFsICYgMHg3OwogICAgICAgICAgaWYgKHR5cGUgPT09IFBiZi5WYXJpbnQpIHdoaWxlICh0aGlzLmJ1Zlt0aGlzLnBvcysrXSA+IDB4N2YpIHt9CiAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBQYmYuQnl0ZXMpIHRoaXMucG9zID0gdGhpcy5yZWFkVmFyaW50KCkgKyB0aGlzLnBvczsKICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFBiZi5GaXhlZDMyKSB0aGlzLnBvcyArPSA0OwogICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gUGJmLkZpeGVkNjQpIHRoaXMucG9zICs9IDg7CiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcignVW5pbXBsZW1lbnRlZCB0eXBlOiAnICsgdHlwZSk7CiAgICAgIH0sCgogICAgICAvLyA9PT0gV1JJVElORyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKICAgICAgd3JpdGVUYWc6IGZ1bmN0aW9uKHRhZywgdHlwZSkgewogICAgICAgICAgdGhpcy53cml0ZVZhcmludCgodGFnIDw8IDMpIHwgdHlwZSk7CiAgICAgIH0sCgogICAgICByZWFsbG9jOiBmdW5jdGlvbihtaW4pIHsKICAgICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAxNjsKCiAgICAgICAgICB3aGlsZSAobGVuZ3RoIDwgdGhpcy5wb3MgKyBtaW4pIGxlbmd0aCAqPSAyOwoKICAgICAgICAgIGlmIChsZW5ndGggIT09IHRoaXMubGVuZ3RoKSB7CiAgICAgICAgICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aCk7CiAgICAgICAgICAgICAgYnVmLnNldCh0aGlzLmJ1Zik7CiAgICAgICAgICAgICAgdGhpcy5idWYgPSBidWY7CiAgICAgICAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7CiAgICAgICAgICB9CiAgICAgIH0sCgogICAgICBmaW5pc2g6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnBvczsKICAgICAgICAgIHRoaXMucG9zID0gMDsKICAgICAgICAgIHJldHVybiB0aGlzLmJ1Zi5zdWJhcnJheSgwLCB0aGlzLmxlbmd0aCk7CiAgICAgIH0sCgogICAgICB3cml0ZUZpeGVkMzI6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDQpOwogICAgICAgICAgd3JpdGVJbnQzMih0aGlzLmJ1ZiwgdmFsLCB0aGlzLnBvcyk7CiAgICAgICAgICB0aGlzLnBvcyArPSA0OwogICAgICB9LAoKICAgICAgd3JpdGVTRml4ZWQzMjogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB0aGlzLnJlYWxsb2MoNCk7CiAgICAgICAgICB3cml0ZUludDMyKHRoaXMuYnVmLCB2YWwsIHRoaXMucG9zKTsKICAgICAgICAgIHRoaXMucG9zICs9IDQ7CiAgICAgIH0sCgogICAgICB3cml0ZUZpeGVkNjQ6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDgpOwogICAgICAgICAgd3JpdGVJbnQzMih0aGlzLmJ1ZiwgdmFsICYgLTEsIHRoaXMucG9zKTsKICAgICAgICAgIHdyaXRlSW50MzIodGhpcy5idWYsIE1hdGguZmxvb3IodmFsICogU0hJRlRfUklHSFRfMzIpLCB0aGlzLnBvcyArIDQpOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgfSwKCiAgICAgIHdyaXRlU0ZpeGVkNjQ6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDgpOwogICAgICAgICAgd3JpdGVJbnQzMih0aGlzLmJ1ZiwgdmFsICYgLTEsIHRoaXMucG9zKTsKICAgICAgICAgIHdyaXRlSW50MzIodGhpcy5idWYsIE1hdGguZmxvb3IodmFsICogU0hJRlRfUklHSFRfMzIpLCB0aGlzLnBvcyArIDQpOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgfSwKCiAgICAgIHdyaXRlVmFyaW50OiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHZhbCA9ICt2YWwgfHwgMDsKCiAgICAgICAgICBpZiAodmFsID4gMHhmZmZmZmZmIHx8IHZhbCA8IDApIHsKICAgICAgICAgICAgICB3cml0ZUJpZ1ZhcmludCh2YWwsIHRoaXMpOwogICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgIH0KCiAgICAgICAgICB0aGlzLnJlYWxsb2MoNCk7CgogICAgICAgICAgdGhpcy5idWZbdGhpcy5wb3MrK10gPSAgICAgICAgICAgdmFsICYgMHg3ZiAgfCAodmFsID4gMHg3ZiA/IDB4ODAgOiAwKTsgaWYgKHZhbCA8PSAweDdmKSByZXR1cm47CiAgICAgICAgICB0aGlzLmJ1Zlt0aGlzLnBvcysrXSA9ICgodmFsID4+Pj0gNykgJiAweDdmKSB8ICh2YWwgPiAweDdmID8gMHg4MCA6IDApOyBpZiAodmFsIDw9IDB4N2YpIHJldHVybjsKICAgICAgICAgIHRoaXMuYnVmW3RoaXMucG9zKytdID0gKCh2YWwgPj4+PSA3KSAmIDB4N2YpIHwgKHZhbCA+IDB4N2YgPyAweDgwIDogMCk7IGlmICh2YWwgPD0gMHg3ZikgcmV0dXJuOwogICAgICAgICAgdGhpcy5idWZbdGhpcy5wb3MrK10gPSAgICh2YWwgPj4+IDcpICYgMHg3ZjsKICAgICAgfSwKCiAgICAgIHdyaXRlU1ZhcmludDogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVmFyaW50KHZhbCA8IDAgPyAtdmFsICogMiAtIDEgOiB2YWwgKiAyKTsKICAgICAgfSwKCiAgICAgIHdyaXRlQm9vbGVhbjogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVmFyaW50KEJvb2xlYW4odmFsKSk7CiAgICAgIH0sCgogICAgICB3cml0ZVN0cmluZzogZnVuY3Rpb24oc3RyKSB7CiAgICAgICAgICBzdHIgPSBTdHJpbmcoc3RyKTsKICAgICAgICAgIHRoaXMucmVhbGxvYyhzdHIubGVuZ3RoICogNCk7CgogICAgICAgICAgdGhpcy5wb3MrKzsgLy8gcmVzZXJ2ZSAxIGJ5dGUgZm9yIHNob3J0IHN0cmluZyBsZW5ndGgKCiAgICAgICAgICB2YXIgc3RhcnRQb3MgPSB0aGlzLnBvczsKICAgICAgICAgIC8vIHdyaXRlIHRoZSBzdHJpbmcgZGlyZWN0bHkgdG8gdGhlIGJ1ZmZlciBhbmQgc2VlIGhvdyBtdWNoIHdhcyB3cml0dGVuCiAgICAgICAgICB0aGlzLnBvcyA9IHdyaXRlVXRmOCh0aGlzLmJ1Ziwgc3RyLCB0aGlzLnBvcyk7CiAgICAgICAgICB2YXIgbGVuID0gdGhpcy5wb3MgLSBzdGFydFBvczsKCiAgICAgICAgICBpZiAobGVuID49IDB4ODApIG1ha2VSb29tRm9yRXh0cmFMZW5ndGgoc3RhcnRQb3MsIGxlbiwgdGhpcyk7CgogICAgICAgICAgLy8gZmluYWxseSwgd3JpdGUgdGhlIG1lc3NhZ2UgbGVuZ3RoIGluIHRoZSByZXNlcnZlZCBwbGFjZSBhbmQgcmVzdG9yZSB0aGUgcG9zaXRpb24KICAgICAgICAgIHRoaXMucG9zID0gc3RhcnRQb3MgLSAxOwogICAgICAgICAgdGhpcy53cml0ZVZhcmludChsZW4pOwogICAgICAgICAgdGhpcy5wb3MgKz0gbGVuOwogICAgICB9LAoKICAgICAgd3JpdGVGbG9hdDogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB0aGlzLnJlYWxsb2MoNCk7CiAgICAgICAgICBpZWVlNzU0LndyaXRlKHRoaXMuYnVmLCB2YWwsIHRoaXMucG9zLCB0cnVlLCAyMywgNCk7CiAgICAgICAgICB0aGlzLnBvcyArPSA0OwogICAgICB9LAoKICAgICAgd3JpdGVEb3VibGU6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDgpOwogICAgICAgICAgaWVlZTc1NC53cml0ZSh0aGlzLmJ1ZiwgdmFsLCB0aGlzLnBvcywgdHJ1ZSwgNTIsIDgpOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgfSwKCiAgICAgIHdyaXRlQnl0ZXM6IGZ1bmN0aW9uKGJ1ZmZlcikgewogICAgICAgICAgdmFyIGxlbiA9IGJ1ZmZlci5sZW5ndGg7CiAgICAgICAgICB0aGlzLndyaXRlVmFyaW50KGxlbik7CiAgICAgICAgICB0aGlzLnJlYWxsb2MobGVuKTsKICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHRoaXMuYnVmW3RoaXMucG9zKytdID0gYnVmZmVyW2ldOwogICAgICB9LAoKICAgICAgd3JpdGVSYXdNZXNzYWdlOiBmdW5jdGlvbihmbiwgb2JqKSB7CiAgICAgICAgICB0aGlzLnBvcysrOyAvLyByZXNlcnZlIDEgYnl0ZSBmb3Igc2hvcnQgbWVzc2FnZSBsZW5ndGgKCiAgICAgICAgICAvLyB3cml0ZSB0aGUgbWVzc2FnZSBkaXJlY3RseSB0byB0aGUgYnVmZmVyIGFuZCBzZWUgaG93IG11Y2ggd2FzIHdyaXR0ZW4KICAgICAgICAgIHZhciBzdGFydFBvcyA9IHRoaXMucG9zOwogICAgICAgICAgZm4ob2JqLCB0aGlzKTsKICAgICAgICAgIHZhciBsZW4gPSB0aGlzLnBvcyAtIHN0YXJ0UG9zOwoKICAgICAgICAgIGlmIChsZW4gPj0gMHg4MCkgbWFrZVJvb21Gb3JFeHRyYUxlbmd0aChzdGFydFBvcywgbGVuLCB0aGlzKTsKCiAgICAgICAgICAvLyBmaW5hbGx5LCB3cml0ZSB0aGUgbWVzc2FnZSBsZW5ndGggaW4gdGhlIHJlc2VydmVkIHBsYWNlIGFuZCByZXN0b3JlIHRoZSBwb3NpdGlvbgogICAgICAgICAgdGhpcy5wb3MgPSBzdGFydFBvcyAtIDE7CiAgICAgICAgICB0aGlzLndyaXRlVmFyaW50KGxlbik7CiAgICAgICAgICB0aGlzLnBvcyArPSBsZW47CiAgICAgIH0sCgogICAgICB3cml0ZU1lc3NhZ2U6IGZ1bmN0aW9uKHRhZywgZm4sIG9iaikgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5CeXRlcyk7CiAgICAgICAgICB0aGlzLndyaXRlUmF3TWVzc2FnZShmbiwgb2JqKTsKICAgICAgfSwKCiAgICAgIHdyaXRlUGFja2VkVmFyaW50OiAgIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkVmFyaW50LCBhcnIpOyAgIH0sCiAgICAgIHdyaXRlUGFja2VkU1ZhcmludDogIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkU1ZhcmludCwgYXJyKTsgIH0sCiAgICAgIHdyaXRlUGFja2VkQm9vbGVhbjogIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkQm9vbGVhbiwgYXJyKTsgIH0sCiAgICAgIHdyaXRlUGFja2VkRmxvYXQ6ICAgIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkRmxvYXQsIGFycik7ICAgIH0sCiAgICAgIHdyaXRlUGFja2VkRG91YmxlOiAgIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkRG91YmxlLCBhcnIpOyAgIH0sCiAgICAgIHdyaXRlUGFja2VkRml4ZWQzMjogIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkRml4ZWQzMiwgYXJyKTsgIH0sCiAgICAgIHdyaXRlUGFja2VkU0ZpeGVkMzI6IGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkU0ZpeGVkMzIsIGFycik7IH0sCiAgICAgIHdyaXRlUGFja2VkRml4ZWQ2NDogIGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkRml4ZWQ2NCwgYXJyKTsgIH0sCiAgICAgIHdyaXRlUGFja2VkU0ZpeGVkNjQ6IGZ1bmN0aW9uKHRhZywgYXJyKSB7IGlmIChhcnIubGVuZ3RoKSB0aGlzLndyaXRlTWVzc2FnZSh0YWcsIHdyaXRlUGFja2VkU0ZpeGVkNjQsIGFycik7IH0sCgogICAgICB3cml0ZUJ5dGVzRmllbGQ6IGZ1bmN0aW9uKHRhZywgYnVmZmVyKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkJ5dGVzKTsKICAgICAgICAgIHRoaXMud3JpdGVCeXRlcyhidWZmZXIpOwogICAgICB9LAogICAgICB3cml0ZUZpeGVkMzJGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuRml4ZWQzMik7CiAgICAgICAgICB0aGlzLndyaXRlRml4ZWQzMih2YWwpOwogICAgICB9LAogICAgICB3cml0ZVNGaXhlZDMyRmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkZpeGVkMzIpOwogICAgICAgICAgdGhpcy53cml0ZVNGaXhlZDMyKHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlRml4ZWQ2NEZpZWxkOiBmdW5jdGlvbih0YWcsIHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5GaXhlZDY0KTsKICAgICAgICAgIHRoaXMud3JpdGVGaXhlZDY0KHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlU0ZpeGVkNjRGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuRml4ZWQ2NCk7CiAgICAgICAgICB0aGlzLndyaXRlU0ZpeGVkNjQodmFsKTsKICAgICAgfSwKICAgICAgd3JpdGVWYXJpbnRGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuVmFyaW50KTsKICAgICAgICAgIHRoaXMud3JpdGVWYXJpbnQodmFsKTsKICAgICAgfSwKICAgICAgd3JpdGVTVmFyaW50RmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLlZhcmludCk7CiAgICAgICAgICB0aGlzLndyaXRlU1ZhcmludCh2YWwpOwogICAgICB9LAogICAgICB3cml0ZVN0cmluZ0ZpZWxkOiBmdW5jdGlvbih0YWcsIHN0cikgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5CeXRlcyk7CiAgICAgICAgICB0aGlzLndyaXRlU3RyaW5nKHN0cik7CiAgICAgIH0sCiAgICAgIHdyaXRlRmxvYXRGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuRml4ZWQzMik7CiAgICAgICAgICB0aGlzLndyaXRlRmxvYXQodmFsKTsKICAgICAgfSwKICAgICAgd3JpdGVEb3VibGVGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuRml4ZWQ2NCk7CiAgICAgICAgICB0aGlzLndyaXRlRG91YmxlKHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlQm9vbGVhbkZpZWxkOiBmdW5jdGlvbih0YWcsIHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVZhcmludEZpZWxkKHRhZywgQm9vbGVhbih2YWwpKTsKICAgICAgfQogIH07CgogIGZ1bmN0aW9uIHJlYWRWYXJpbnRSZW1haW5kZXIobCwgcywgcCkgewogICAgICB2YXIgYnVmID0gcC5idWYsCiAgICAgICAgICBoLCBiOwoKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCAgPSAoYiAmIDB4NzApID4+IDQ7ICBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCB8PSAoYiAmIDB4N2YpIDw8IDM7ICBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCB8PSAoYiAmIDB4N2YpIDw8IDEwOyBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCB8PSAoYiAmIDB4N2YpIDw8IDE3OyBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCB8PSAoYiAmIDB4N2YpIDw8IDI0OyBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKICAgICAgYiA9IGJ1ZltwLnBvcysrXTsgaCB8PSAoYiAmIDB4MDEpIDw8IDMxOyBpZiAoYiA8IDB4ODApIHJldHVybiB0b051bShsLCBoLCBzKTsKCiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgdmFyaW50IG5vdCBtb3JlIHRoYW4gMTAgYnl0ZXMnKTsKICB9CgogIGZ1bmN0aW9uIHJlYWRQYWNrZWRFbmQocGJmKSB7CiAgICAgIHJldHVybiBwYmYudHlwZSA9PT0gUGJmLkJ5dGVzID8KICAgICAgICAgIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zIDogcGJmLnBvcyArIDE7CiAgfQoKICBmdW5jdGlvbiB0b051bShsb3csIGhpZ2gsIGlzU2lnbmVkKSB7CiAgICAgIGlmIChpc1NpZ25lZCkgewogICAgICAgICAgcmV0dXJuIGhpZ2ggKiAweDEwMDAwMDAwMCArIChsb3cgPj4+IDApOwogICAgICB9CgogICAgICByZXR1cm4gKChoaWdoID4+PiAwKSAqIDB4MTAwMDAwMDAwKSArIChsb3cgPj4+IDApOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVCaWdWYXJpbnQodmFsLCBwYmYpIHsKICAgICAgdmFyIGxvdywgaGlnaDsKCiAgICAgIGlmICh2YWwgPj0gMCkgewogICAgICAgICAgbG93ICA9ICh2YWwgJSAweDEwMDAwMDAwMCkgfCAwOwogICAgICAgICAgaGlnaCA9ICh2YWwgLyAweDEwMDAwMDAwMCkgfCAwOwogICAgICB9IGVsc2UgewogICAgICAgICAgbG93ICA9IH4oLXZhbCAlIDB4MTAwMDAwMDAwKTsKICAgICAgICAgIGhpZ2ggPSB+KC12YWwgLyAweDEwMDAwMDAwMCk7CgogICAgICAgICAgaWYgKGxvdyBeIDB4ZmZmZmZmZmYpIHsKICAgICAgICAgICAgICBsb3cgPSAobG93ICsgMSkgfCAwOwogICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICBsb3cgPSAwOwogICAgICAgICAgICAgIGhpZ2ggPSAoaGlnaCArIDEpIHwgMDsKICAgICAgICAgIH0KICAgICAgfQoKICAgICAgaWYgKHZhbCA+PSAweDEwMDAwMDAwMDAwMDAwMDAwIHx8IHZhbCA8IC0weDEwMDAwMDAwMDAwMDAwMDAwKSB7CiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIHZhcmludCBkb2VzblwndCBmaXQgaW50byAxMCBieXRlcycpOwogICAgICB9CgogICAgICBwYmYucmVhbGxvYygxMCk7CgogICAgICB3cml0ZUJpZ1ZhcmludExvdyhsb3csIGhpZ2gsIHBiZik7CiAgICAgIHdyaXRlQmlnVmFyaW50SGlnaChoaWdoLCBwYmYpOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVCaWdWYXJpbnRMb3cobG93LCBoaWdoLCBwYmYpIHsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdID0gbG93ICYgMHg3ZiB8IDB4ODA7IGxvdyA+Pj49IDc7CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSA9IGxvdyAmIDB4N2YgfCAweDgwOyBsb3cgPj4+PSA3OwogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gPSBsb3cgJiAweDdmIHwgMHg4MDsgbG93ID4+Pj0gNzsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdID0gbG93ICYgMHg3ZiB8IDB4ODA7IGxvdyA+Pj49IDc7CiAgICAgIHBiZi5idWZbcGJmLnBvc10gICA9IGxvdyAmIDB4N2Y7CiAgfQoKICBmdW5jdGlvbiB3cml0ZUJpZ1ZhcmludEhpZ2goaGlnaCwgcGJmKSB7CiAgICAgIHZhciBsc2IgPSAoaGlnaCAmIDB4MDcpIDw8IDQ7CgogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gfD0gbHNiICAgICAgICAgfCAoKGhpZ2ggPj4+PSAzKSA/IDB4ODAgOiAwKTsgaWYgKCFoaWdoKSByZXR1cm47CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSAgPSBoaWdoICYgMHg3ZiB8ICgoaGlnaCA+Pj49IDcpID8gMHg4MCA6IDApOyBpZiAoIWhpZ2gpIHJldHVybjsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdICA9IGhpZ2ggJiAweDdmIHwgKChoaWdoID4+Pj0gNykgPyAweDgwIDogMCk7IGlmICghaGlnaCkgcmV0dXJuOwogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gID0gaGlnaCAmIDB4N2YgfCAoKGhpZ2ggPj4+PSA3KSA/IDB4ODAgOiAwKTsgaWYgKCFoaWdoKSByZXR1cm47CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSAgPSBoaWdoICYgMHg3ZiB8ICgoaGlnaCA+Pj49IDcpID8gMHg4MCA6IDApOyBpZiAoIWhpZ2gpIHJldHVybjsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdICA9IGhpZ2ggJiAweDdmOwogIH0KCiAgZnVuY3Rpb24gbWFrZVJvb21Gb3JFeHRyYUxlbmd0aChzdGFydFBvcywgbGVuLCBwYmYpIHsKICAgICAgdmFyIGV4dHJhTGVuID0KICAgICAgICAgIGxlbiA8PSAweDNmZmYgPyAxIDoKICAgICAgICAgIGxlbiA8PSAweDFmZmZmZiA/IDIgOgogICAgICAgICAgbGVuIDw9IDB4ZmZmZmZmZiA/IDMgOiBNYXRoLmZsb29yKE1hdGgubG9nKGxlbikgLyAoTWF0aC5MTjIgKiA3KSk7CgogICAgICAvLyBpZiAxIGJ5dGUgaXNuJ3QgZW5vdWdoIGZvciBlbmNvZGluZyBtZXNzYWdlIGxlbmd0aCwgc2hpZnQgdGhlIGRhdGEgdG8gdGhlIHJpZ2h0CiAgICAgIHBiZi5yZWFsbG9jKGV4dHJhTGVuKTsKICAgICAgZm9yICh2YXIgaSA9IHBiZi5wb3MgLSAxOyBpID49IHN0YXJ0UG9zOyBpLS0pIHBiZi5idWZbaSArIGV4dHJhTGVuXSA9IHBiZi5idWZbaV07CiAgfQoKICBmdW5jdGlvbiB3cml0ZVBhY2tlZFZhcmludChhcnIsIHBiZikgICB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVWYXJpbnQoYXJyW2ldKTsgICB9CiAgZnVuY3Rpb24gd3JpdGVQYWNrZWRTVmFyaW50KGFyciwgcGJmKSAgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlU1ZhcmludChhcnJbaV0pOyAgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkRmxvYXQoYXJyLCBwYmYpICAgIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZUZsb2F0KGFycltpXSk7ICAgIH0KICBmdW5jdGlvbiB3cml0ZVBhY2tlZERvdWJsZShhcnIsIHBiZikgICB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVEb3VibGUoYXJyW2ldKTsgICB9CiAgZnVuY3Rpb24gd3JpdGVQYWNrZWRCb29sZWFuKGFyciwgcGJmKSAgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlQm9vbGVhbihhcnJbaV0pOyAgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkRml4ZWQzMihhcnIsIHBiZikgIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZUZpeGVkMzIoYXJyW2ldKTsgIH0KICBmdW5jdGlvbiB3cml0ZVBhY2tlZFNGaXhlZDMyKGFyciwgcGJmKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVTRml4ZWQzMihhcnJbaV0pOyB9CiAgZnVuY3Rpb24gd3JpdGVQYWNrZWRGaXhlZDY0KGFyciwgcGJmKSAgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlRml4ZWQ2NChhcnJbaV0pOyAgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkU0ZpeGVkNjQoYXJyLCBwYmYpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZVNGaXhlZDY0KGFycltpXSk7IH0KCiAgLy8gQnVmZmVyIGNvZGUgYmVsb3cgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlciwgTUlULWxpY2Vuc2VkCgogIGZ1bmN0aW9uIHJlYWRVSW50MzIoYnVmLCBwb3MpIHsKICAgICAgcmV0dXJuICgoYnVmW3Bvc10pIHwKICAgICAgICAgIChidWZbcG9zICsgMV0gPDwgOCkgfAogICAgICAgICAgKGJ1Zltwb3MgKyAyXSA8PCAxNikpICsKICAgICAgICAgIChidWZbcG9zICsgM10gKiAweDEwMDAwMDApOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVJbnQzMihidWYsIHZhbCwgcG9zKSB7CiAgICAgIGJ1Zltwb3NdID0gdmFsOwogICAgICBidWZbcG9zICsgMV0gPSAodmFsID4+PiA4KTsKICAgICAgYnVmW3BvcyArIDJdID0gKHZhbCA+Pj4gMTYpOwogICAgICBidWZbcG9zICsgM10gPSAodmFsID4+PiAyNCk7CiAgfQoKICBmdW5jdGlvbiByZWFkSW50MzIoYnVmLCBwb3MpIHsKICAgICAgcmV0dXJuICgoYnVmW3Bvc10pIHwKICAgICAgICAgIChidWZbcG9zICsgMV0gPDwgOCkgfAogICAgICAgICAgKGJ1Zltwb3MgKyAyXSA8PCAxNikpICsKICAgICAgICAgIChidWZbcG9zICsgM10gPDwgMjQpOwogIH0KCiAgZnVuY3Rpb24gcmVhZFV0ZjgoYnVmLCBwb3MsIGVuZCkgewogICAgICB2YXIgc3RyID0gJyc7CiAgICAgIHZhciBpID0gcG9zOwoKICAgICAgd2hpbGUgKGkgPCBlbmQpIHsKICAgICAgICAgIHZhciBiMCA9IGJ1ZltpXTsKICAgICAgICAgIHZhciBjID0gbnVsbDsgLy8gY29kZXBvaW50CiAgICAgICAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9CiAgICAgICAgICAgICAgYjAgPiAweEVGID8gNCA6CiAgICAgICAgICAgICAgYjAgPiAweERGID8gMyA6CiAgICAgICAgICAgICAgYjAgPiAweEJGID8gMiA6IDE7CgogICAgICAgICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlID4gZW5kKSBicmVhazsKCiAgICAgICAgICB2YXIgYjEsIGIyLCBiMzsKCiAgICAgICAgICBpZiAoYnl0ZXNQZXJTZXF1ZW5jZSA9PT0gMSkgewogICAgICAgICAgICAgIGlmIChiMCA8IDB4ODApIHsKICAgICAgICAgICAgICAgICAgYyA9IGIwOwogICAgICAgICAgICAgIH0KICAgICAgICAgIH0gZWxzZSBpZiAoYnl0ZXNQZXJTZXF1ZW5jZSA9PT0gMikgewogICAgICAgICAgICAgIGIxID0gYnVmW2kgKyAxXTsKICAgICAgICAgICAgICBpZiAoKGIxICYgMHhDMCkgPT09IDB4ODApIHsKICAgICAgICAgICAgICAgICAgYyA9IChiMCAmIDB4MUYpIDw8IDB4NiB8IChiMSAmIDB4M0YpOwogICAgICAgICAgICAgICAgICBpZiAoYyA8PSAweDdGKSB7CiAgICAgICAgICAgICAgICAgICAgICBjID0gbnVsbDsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0KICAgICAgICAgIH0gZWxzZSBpZiAoYnl0ZXNQZXJTZXF1ZW5jZSA9PT0gMykgewogICAgICAgICAgICAgIGIxID0gYnVmW2kgKyAxXTsKICAgICAgICAgICAgICBiMiA9IGJ1ZltpICsgMl07CiAgICAgICAgICAgICAgaWYgKChiMSAmIDB4QzApID09PSAweDgwICYmIChiMiAmIDB4QzApID09PSAweDgwKSB7CiAgICAgICAgICAgICAgICAgIGMgPSAoYjAgJiAweEYpIDw8IDB4QyB8IChiMSAmIDB4M0YpIDw8IDB4NiB8IChiMiAmIDB4M0YpOwogICAgICAgICAgICAgICAgICBpZiAoYyA8PSAweDdGRiB8fCAoYyA+PSAweEQ4MDAgJiYgYyA8PSAweERGRkYpKSB7CiAgICAgICAgICAgICAgICAgICAgICBjID0gbnVsbDsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0KICAgICAgICAgIH0gZWxzZSBpZiAoYnl0ZXNQZXJTZXF1ZW5jZSA9PT0gNCkgewogICAgICAgICAgICAgIGIxID0gYnVmW2kgKyAxXTsKICAgICAgICAgICAgICBiMiA9IGJ1ZltpICsgMl07CiAgICAgICAgICAgICAgYjMgPSBidWZbaSArIDNdOwogICAgICAgICAgICAgIGlmICgoYjEgJiAweEMwKSA9PT0gMHg4MCAmJiAoYjIgJiAweEMwKSA9PT0gMHg4MCAmJiAoYjMgJiAweEMwKSA9PT0gMHg4MCkgewogICAgICAgICAgICAgICAgICBjID0gKGIwICYgMHhGKSA8PCAweDEyIHwgKGIxICYgMHgzRikgPDwgMHhDIHwgKGIyICYgMHgzRikgPDwgMHg2IHwgKGIzICYgMHgzRik7CiAgICAgICAgICAgICAgICAgIGlmIChjIDw9IDB4RkZGRiB8fCBjID49IDB4MTEwMDAwKSB7CiAgICAgICAgICAgICAgICAgICAgICBjID0gbnVsbDsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0KICAgICAgICAgIH0KCiAgICAgICAgICBpZiAoYyA9PT0gbnVsbCkgewogICAgICAgICAgICAgIGMgPSAweEZGRkQ7CiAgICAgICAgICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDE7CgogICAgICAgICAgfSBlbHNlIGlmIChjID4gMHhGRkZGKSB7CiAgICAgICAgICAgICAgYyAtPSAweDEwMDAwOwogICAgICAgICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApOwogICAgICAgICAgICAgIGMgPSAweERDMDAgfCBjICYgMHgzRkY7CiAgICAgICAgICB9CgogICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7CiAgICAgICAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2U7CiAgICAgIH0KCiAgICAgIHJldHVybiBzdHI7CiAgfQoKICBmdW5jdGlvbiByZWFkVXRmOFRleHREZWNvZGVyKGJ1ZiwgcG9zLCBlbmQpIHsKICAgICAgcmV0dXJuIHV0ZjhUZXh0RGVjb2Rlci5kZWNvZGUoYnVmLnN1YmFycmF5KHBvcywgZW5kKSk7CiAgfQoKICBmdW5jdGlvbiB3cml0ZVV0ZjgoYnVmLCBzdHIsIHBvcykgewogICAgICBmb3IgKHZhciBpID0gMCwgYywgbGVhZDsgaSA8IHN0ci5sZW5ndGg7IGkrKykgewogICAgICAgICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpOyAvLyBjb2RlIHBvaW50CgogICAgICAgICAgaWYgKGMgPiAweEQ3RkYgJiYgYyA8IDB4RTAwMCkgewogICAgICAgICAgICAgIGlmIChsZWFkKSB7CiAgICAgICAgICAgICAgICAgIGlmIChjIDwgMHhEQzAwKSB7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gMHhFRjsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEJGOwogICAgICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4QkQ7CiAgICAgICAgICAgICAgICAgICAgICBsZWFkID0gYzsKICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgYyA9IGxlYWQgLSAweEQ4MDAgPDwgMTAgfCBjIC0gMHhEQzAwIHwgMHgxMDAwMDsKICAgICAgICAgICAgICAgICAgICAgIGxlYWQgPSBudWxsOwogICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgaWYgKGMgPiAweERCRkYgfHwgKGkgKyAxID09PSBzdHIubGVuZ3RoKSkgewogICAgICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4RUY7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gMHhCRjsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEJEOwogICAgICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgbGVhZCA9IGM7CiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgY29udGludWU7CiAgICAgICAgICAgICAgfQogICAgICAgICAgfSBlbHNlIGlmIChsZWFkKSB7CiAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4RUY7CiAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4QkY7CiAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4QkQ7CiAgICAgICAgICAgICAgbGVhZCA9IG51bGw7CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGMgPCAweDgwKSB7CiAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IGM7CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgIGlmIChjIDwgMHg4MDApIHsKICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IGMgPj4gMHg2IHwgMHhDMDsKICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICBpZiAoYyA8IDB4MTAwMDApIHsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSBjID4+IDB4QyB8IDB4RTA7CiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gYyA+PiAweDEyIHwgMHhGMDsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSBjID4+IDB4QyAmIDB4M0YgfCAweDgwOwogICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSBjID4+IDB4NiAmIDB4M0YgfCAweDgwOwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICBidWZbcG9zKytdID0gYyAmIDB4M0YgfCAweDgwOwogICAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBwb3M7CiAgfQoKICB2YXIgUGJmJDEgPSAvKkBfX1BVUkVfXyovZ2V0RGVmYXVsdEV4cG9ydEZyb21DanMocGJmKTsKCiAgLy90eXBlIEFyY2dpc1Jlc3RTb3VyY2VTcGVjaWZpY2F0aW9uID0gYW55OwogIHZhciBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bTsKICAoZnVuY3Rpb24gKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtKSB7CiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlUG9pbnQiXSA9IDBdID0gImVzcmlHZW9tZXRyeVR5cGVQb2ludCI7CiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlTXVsdGlwb2ludCJdID0gMV0gPSAiZXNyaUdlb21ldHJ5VHlwZU11bHRpcG9pbnQiOwogICAgICBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVsiZXNyaUdlb21ldHJ5VHlwZVBvbHlsaW5lIl0gPSAyXSA9ICJlc3JpR2VvbWV0cnlUeXBlUG9seWxpbmUiOwogICAgICBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVsiZXNyaUdlb21ldHJ5VHlwZVBvbHlnb24iXSA9IDNdID0gImVzcmlHZW9tZXRyeVR5cGVQb2x5Z29uIjsKICAgICAgZXNyaVBiZkdlb21ldHJ5VHlwZUVudW1bZXNyaVBiZkdlb21ldHJ5VHlwZUVudW1bImVzcmlHZW9tZXRyeVR5cGVNdWx0aXBhdGNoIl0gPSA0XSA9ICJlc3JpR2VvbWV0cnlUeXBlTXVsdGlwYXRjaCI7CiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlTm9uZSJdID0gMTI3XSA9ICJlc3JpR2VvbWV0cnlUeXBlTm9uZSI7CiAgfSkoZXNyaVBiZkdlb21ldHJ5VHlwZUVudW0gfHwgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtID0ge30pKTsKCiAgY2xhc3MgQ29udmVydFBiZiB7CiAgICAgIGNvbnN0cnVjdG9yKHBiZkRhdGEpIHsKICAgICAgICAgIHRoaXMuZGF0YSA9IHBiZkRhdGE7CiAgICAgIH0KICAgICAgYXN5bmMgY29udmVydCgpIHsKICAgICAgICAgIHZhciBfYTsKICAgICAgICAgIGNvbnN0IHBiZiA9IG5ldyBQYmYkMSh0aGlzLmRhdGEpOwogICAgICAgICAgY29uc3QgcGJmSnNvbiA9IHByb3RvKCkucmVhZChwYmYpOwogICAgICAgICAgLy8gR2V0IHRoZSBGZWF0dXJlUmVzdWx0CiAgICAgICAgICBpZiAocGJmSnNvbi5xdWVyeVJlc3VsdCA9PT0gbnVsbCkgewogICAgICAgICAgICAgIC8vY29uc29sZS53YXJuKCdpc3N1ZSB3aXRoIHRoZSByZXN1bHQnLCBwYmZKc29uKTsKICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXNwb25zZSh7CiAgICAgICAgICAgICAgICAgICdleGNlZWRlZFRyYW5zZmVyTGltaXQnOiB0cnVlLAogICAgICAgICAgICAgIH0sIFtdKTsKICAgICAgICAgIH0KICAgICAgICAgIGNvbnN0IGZlYXR1cmVSZXN1bHQgPSBwYmZKc29uLnF1ZXJ5UmVzdWx0LmZlYXR1cmVSZXN1bHQ7CiAgICAgICAgICAvLyBHZXQgdGhlIGZpZWxkIG5hbWVzCiAgICAgICAgICBjb25zdCBmaWVsZHMgPSBmZWF0dXJlUmVzdWx0LmZpZWxkcy5tYXAoKGZpZWxkKSA9PiBmaWVsZC5uYW1lKTsKICAgICAgICAgIC8vIEdldCB0aGUgdHJhbnNsYXRpb24gaW5mbwogICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSBmZWF0dXJlUmVzdWx0LnRyYW5zZm9ybS50cmFuc2xhdGU7CiAgICAgICAgICBjb25zdCBzY2FsZSA9IGZlYXR1cmVSZXN1bHQudHJhbnNmb3JtLnNjYWxlOwogICAgICAgICAgY29uc3QgZ2VvbWV0cnlUeXBlID0gZmVhdHVyZVJlc3VsdC5nZW9tZXRyeVR5cGU7CiAgICAgICAgICBjb25zdCBxdWFudGl6ZU9yaWdpblBvc3Rpb24gPSBmZWF0dXJlUmVzdWx0LnRyYW5zZm9ybS5xdWFudGl6ZU9yaWdpblBvc3Rpb247CiAgICAgICAgICBjb25zdCBzcmlkID0gKF9hID0gZmVhdHVyZVJlc3VsdC5zcGF0aWFsUmVmZXJlbmNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Eud2tpZC50b1N0cmluZygpOwogICAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBmZWF0dXJlUmVzdWx0LmZlYXR1cmVzLm1hcCgoZmVhdHVyZSkgPT4gewogICAgICAgICAgICAgIC8vIFBhcnNlIGVhY2ggYXR0cmlidXRlCiAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBmZWF0dXJlLmF0dHJpYnV0ZXMKICAgICAgICAgICAgICAgICAgLm1hcCgoYXR0cmlidXRlLCBpbmRleCkgPT4gKHsgJ2tleSc6IGZpZWxkc1tpbmRleF0sICd2YWx1ZSc6IGF0dHJpYnV0ZVthdHRyaWJ1dGVbJ3ZhbHVlX3R5cGUnXV0gfSkpCiAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+IHsKICAgICAgICAgICAgICAgICAgY29uc3QgbmV3T2JqID0ge307CiAgICAgICAgICAgICAgICAgIG5ld09ialtjLmtleV0gPSBjLnZhbHVlOwogICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5hLCAuLi5uZXdPYmogfTsKICAgICAgICAgICAgICB9LCB7fSk7CiAgICAgICAgICAgICAgLy8gUGFyc2UgdGhlIGdlb21ldHJpZXMgYW5kIGNsZWFuIHVwIHRoZSBxdWFudGl6YXRpb24KICAgICAgICAgICAgICBsZXQgcmluZ3MgPSBbW1tdXV07CiAgICAgICAgICAgICAgaWYgKChmZWF0dXJlLmdlb21ldHJ5ICE9PSBudWxsKSkgewogICAgICAgICAgICAgICAgICBsZXQgY291bnRzID0gZ2VvbWV0cnlUeXBlID09PSBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bS5lc3JpR2VvbWV0cnlUeXBlUG9pbnQgPyBbMV0gOiAoZmVhdHVyZS5nZW9tZXRyeS5sZW5ndGhzKTsKICAgICAgICAgICAgICAgICAgLy8gQnJlYWsgaW50byBYIGFuZCBZIHJpbmdzCiAgICAgICAgICAgICAgICAgIGxldCB4ID0gW107CiAgICAgICAgICAgICAgICAgIGxldCB5ID0gW107CiAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRzLmZvckVhY2goKGNvb3JkLCBpZHgpID0+IHsKICAgICAgICAgICAgICAgICAgICAgIGlmIChpZHggJSAyID09PSAwKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgeC5wdXNoKGNvb3JkKTsKICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgICAgIHkucHVzaChjb29yZCk7CiAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICAgICAgICAvL2xldCB4ID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZHMuZmlsdGVyKChfOiBudW1iZXIsIGlkeDogbnVtYmVyKSA9PiBpZHggJSAyID09PSAwKTsKICAgICAgICAgICAgICAgICAgLy9sZXQgeSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRzLmZpbHRlcigoXzogbnVtYmVyLCBpZHg6IG51bWJlcikgPT4gaWR4ICUgMiA9PT0gMSk7CiAgICAgICAgICAgICAgICAgIC8vIGRlemlnemFnIHRoZSByaW5ncywgYW5kIG1lcmdlICsgcmVwcm9qZWN0IHRoZW0KICAgICAgICAgICAgICAgICAgbGV0IHJpbmdzWCA9IGRlWmlnWmFnKHgsIGNvdW50cywgc2NhbGUueFNjYWxlLCB0cmFuc2xhdGlvbi54VHJhbnNsYXRlLCBmYWxzZSk7CiAgICAgICAgICAgICAgICAgIGxldCByaW5nc1kgPSBkZVppZ1phZyh5LCBjb3VudHMsIHNjYWxlLnlTY2FsZSwgdHJhbnNsYXRpb24ueVRyYW5zbGF0ZSwgcXVhbnRpemVPcmlnaW5Qb3N0aW9uID09PSAwKTsKICAgICAgICAgICAgICAgICAgLy8gTWVyZ2UgdGhlIHJpbmdzCiAgICAgICAgICAgICAgICAgIHJpbmdzID0gbWVyZ2VSaW5ncyhyaW5nc1gsIHJpbmdzWSwgc3JpZCk7CiAgICAgICAgICAgICAgICAgIC8vcmluZ3MgPSByaW5nc1gubWFwKChyaW5nLCBpKSA9PiByaW5nLm1hcCgoeCwgaikgPT4gW3gsIHJpbmdzWVtpXVtqXV0pKTsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgbGV0IGdlb21ldHJ5ID0ge307CiAgICAgICAgICAgICAgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlUG9pbnQnKSB7CiAgICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0geyAneCc6IHJpbmdzWzBdWzBdWzBdLCAneSc6IHJpbmdzWzBdWzBdWzFdIH07CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIGVsc2UgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlTXVsdGlQb2ludCcpIHsKICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSB7ICdwb2ludHMnOiByaW5nc1swXSB9OwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICBlbHNlIGlmIChlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtnZW9tZXRyeVR5cGVdID09PSAnZXNyaUdlb21ldHJ5VHlwZVBvbHlsaW5lJykgewogICAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IHsgcGF0aHM6IHJpbmdzIH07CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIGVsc2UgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlUG9seWdvbicpIHsKICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSB7IHJpbmdzOiByaW5ncyB9OwogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICByZXR1cm4gewogICAgICAgICAgICAgICAgICAnZ2VvbWV0cnknOiBnZW9tZXRyeSwKICAgICAgICAgICAgICAgICAgJ2F0dHJpYnV0ZXMnOiBhdHRyaWJ1dGVzLAogICAgICAgICAgICAgIH07CiAgICAgICAgICB9KTsKICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3BvbnNlKGZlYXR1cmVSZXN1bHQsIGZlYXR1cmVzKTsKICAgICAgfQogICAgICBfYnVpbGRSZXNwb25zZShmZWF0dXJlUmVzdWx0LCBmZWF0dXJlcykgewogICAgICAgICAgcmV0dXJuIHsKICAgICAgICAgICAgICAnZmVhdHVyZXMnOiBmZWF0dXJlcywKICAgICAgICAgICAgICAnZXhjZWVkZWRUcmFuc2ZlckxpbWl0JzogZmVhdHVyZVJlc3VsdC5leGNlZWRlZFRyYW5zZmVyTGltaXQsCiAgICAgICAgICAgICAgJ3NwYXRpYWxSZWZlcmVuY2UnOiB7ICd3a2lkJzogNDMyNiwgJ2xhdGVzdFdraWQnOiA0MzI2IH0sCiAgICAgICAgICAgICAgJ2dlb21ldHJ5VHlwZSc6IGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2ZlYXR1cmVSZXN1bHQuZ2VvbWV0cnlUeXBlIHx8IDEyN10ucmVwbGFjZSgnVHlwZScsICcnKSwKICAgICAgICAgICAgICAnaGFzTSc6IGZlYXR1cmVSZXN1bHQuaGFzTSwKICAgICAgICAgICAgICAnaGFzWic6IGZlYXR1cmVSZXN1bHQuaGFzWiwKICAgICAgICAgICAgICAnZ2xvYmFsSWRGaWVsZE5hbWUnOiBmZWF0dXJlUmVzdWx0Lmdsb2JhbElkRmllbGROYW1lCiAgICAgICAgICB9OwogICAgICB9CiAgfQoKICBjbGFzcyBHZW9tZXRyaWVzQXRab29tIHsKICAgICAgY29uc3RydWN0b3IoKSB7CiAgICAgICAgICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgZ2VvbWV0cmllcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGxvYWRlZAogICAgICAgICAgdGhpcy5fZ2VvbWV0cmllc0F0Wm9vbSA9IG5ldyBBcnJheSgyNCk7CiAgICAgICAgICB0aGlzLl9tYXhHZW9tZXRyeVpvb20gPSAwOwogICAgICB9CiAgICAgIGFzeW5jIGdldEtleXNBdFpvb20oem9vbSwgbWF4Wm9vbSkgewogICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBtYXggem9vbSBiYXNlZCBvbiB0aGUgdXNlciBpbnB1dCwgdGhlIG1hcCdzIG1heHpvb20sIG9yIHRoZSBtYXh6b29tIHdlIGhhdmUgY2FjaGVkCiAgICAgICAgICBtYXhab29tID0gbWF4Wm9vbSAhPT0gdW5kZWZpbmVkID8gbWF4Wm9vbSA6IHRoaXMuX21heEdlb21ldHJ5Wm9vbTsKICAgICAgICAgIGNvbnN0IGdlb21ldHJ5R3JvdXBzID0gW107CiAgICAgICAgICBmb3IgKGxldCB6ID0gKE1hdGgubWluKG1heFpvb20sIHRoaXMuX21heEdlb21ldHJ5Wm9vbSkpOyB6ID49IHpvb207IHotLSkgewogICAgICAgICAgICAgIGlmICh0aGlzLl9nZW9tZXRyaWVzQXRab29tW3pdICE9PSB1bmRlZmluZWQpIHsKICAgICAgICAgICAgICAgICAgZ2VvbWV0cnlHcm91cHMucHVzaChbLi4udGhpcy5fZ2VvbWV0cmllc0F0Wm9vbVt6XS5rZXlzKCldKTsKICAgICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgICByZXR1cm4gZ2VvbWV0cnlHcm91cHMuZmxhdCgpOwogICAgICB9CiAgICAgIHVwZGF0ZUtleUF0Wm9vbSh6b29tLCBwcmltYXJ5S2V5KSB7CiAgICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSAnYWRkZWQnOwogICAgICAgICAgaWYgKHRoaXMuX2dlb21ldHJpZXNBdFpvb21bem9vbV0gPT09IHVuZGVmaW5lZCkKICAgICAgICAgICAgICB0aGlzLl9nZW9tZXRyaWVzQXRab29tW3pvb21dID0gbmV3IE1hcCgpOwogICAgICAgICAgdGhpcy5fbWF4R2VvbWV0cnlab29tID0gTWF0aC5tYXgodGhpcy5fbWF4R2VvbWV0cnlab29tLCB6b29tKTsKICAgICAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgem9vbTsgeisrKSB7CiAgICAgICAgICAgICAgaWYgKHRoaXMuX2dlb21ldHJpZXNBdFpvb21bel0gIT09IHVuZGVmaW5lZCkgewogICAgICAgICAgICAgICAgICB0aGlzLl9nZW9tZXRyaWVzQXRab29tW3pdLmRlbGV0ZShwcmltYXJ5S2V5KTsKICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSAndXBkYXRlZCc7CiAgICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgICAgdGhpcy5fZ2VvbWV0cmllc0F0Wm9vbVt6b29tXS5zZXQocHJpbWFyeUtleSwgdHJ1ZSk7CiAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7CiAgICAgIH0KICAgICAgYXN5bmMgdXBkYXRlS2V5c0F0Wm9vbSh6b29tLCBwcmltYXJ5S2V5cykgewogICAgICAgICAgcmV0dXJuIHByaW1hcnlLZXlzLm1hcChwcmltYXJ5S2V5ID0+IHRoaXMudXBkYXRlS2V5QXRab29tKHpvb20sIHByaW1hcnlLZXkpKTsKICAgICAgfQogIH0KCiAgY29uc3QgbGlicmFyaWVzID0gewogICAgICAnQ29udmVydFBiZic6IENvbnZlcnRQYmYsCiAgICAgICdHZW9tZXRyaWVzQXRab29tJzogR2VvbWV0cmllc0F0Wm9vbSwKICAgICAgJ0RlWmlnWmFnSlNPTic6IERlWmlnWmFnSlNPTgogIH07CiAgbGV0IHN1YkNsYXNzOwogIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGUgPT4gewogICAgICBjb25zdCBkYXRhID0gKGUuZGF0YSB8fCBlKTsKICAgICAgY29uc3QgcG9zdCA9IChpZCwgZXJyLCByZXMsIHR5cGUpID0+IHsKICAgICAgICAgIHBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgICB0eXBlOiB0eXBlID8gdHlwZSA6IChlcnIgPyAnZXJyb3InIDogJ3Jlc3BvbnNlJyksCiAgICAgICAgICAgICAgaWQ6IGlkLAogICAgICAgICAgICAgIG1lc3NhZ2U6IHJlcywKICAgICAgICAgICAgICBlcnJvcjogZXJyCiAgICAgICAgICB9KTsKICAgICAgfTsKICAgICAgY29uc3QgY29tbWFuZHMgPSB7CiAgICAgICAgICAnaW5pdCc6IChtc2cpID0+IHsKICAgICAgICAgICAgICBjb25zdCB7IGlkLCBjb21tYW5kLCBtZXNzYWdlIH0gPSBtc2c7CiAgICAgICAgICAgICAgc3ViQ2xhc3MgPSBuZXcgbGlicmFyaWVzW2NvbW1hbmRdKC4uLm1lc3NhZ2UpOwogICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgY2xhc3MnIG1ldGhvZHMKICAgICAgICAgICAgICBjb25zdCBmbnMgPSBbCiAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGxpYnJhcmllc1tjb21tYW5kXS5wcm90b3R5cGUpLAogICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhzdWJDbGFzcykKICAgICAgICAgICAgICBdLm1hcChrZXkgPT4gW2tleSwgdHlwZW9mIGxpYnJhcmllc1tjb21tYW5kXS5wcm90b3R5cGVba2V5XV0pCiAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+ICh7IC4uLmEsIC4uLnsgW2NbMF1dOiBjWzFdIH0gfSksIHt9KTsKICAgICAgICAgICAgICBwb3N0KGlkLCB1bmRlZmluZWQsIGZucywgJ2luaXRfcmVzcG9uc2UnKTsKICAgICAgICAgIH0sCiAgICAgICAgICAnZ2V0JzogZnVuY3Rpb24gKG1zZykgewogICAgICAgICAgICAgIGNvbnN0IHsgaWQsIGNvbW1hbmQgfSA9IG1zZzsKICAgICAgICAgICAgICBpZiAoc3ViQ2xhc3MgJiYgc3ViQ2xhc3NbY29tbWFuZF0pIHsKICAgICAgICAgICAgICAgICAgcG9zdChpZCwgdW5kZWZpbmVkLCBzdWJDbGFzc1tjb21tYW5kXSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgICBwb3N0KGlkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgfSwKICAgICAgICAgICdleGVjJzogZnVuY3Rpb24gKG1zZykgewogICAgICAgICAgICAgIGNvbnN0IHsgaWQsIGNvbW1hbmQsIG1lc3NhZ2UgfSA9IG1zZzsKICAgICAgICAgICAgICBpZiAoc3ViQ2xhc3MgJiYgc3ViQ2xhc3NbY29tbWFuZF0gJiYgdHlwZW9mIHN1YkNsYXNzW2NvbW1hbmRdID09PSAnZnVuY3Rpb24nKSB7CiAgICAgICAgICAgICAgICAgIGNvbnN0IGNtZCA9IHN1YkNsYXNzW2NvbW1hbmRdCiAgICAgICAgICAgICAgICAgICAgICAuYXBwbHkoc3ViQ2xhc3MsIG1lc3NhZ2UpOwogICAgICAgICAgICAgICAgICBpZiAoISFjbWQgJiYgdHlwZW9mIGNtZC50aGVuID09PSAnZnVuY3Rpb24nKSB7CiAgICAgICAgICAgICAgICAgICAgICAvLyBJdCdzIGEgcHJvbWlzZSwgc28gd2FpdCBmb3IgaXQKICAgICAgICAgICAgICAgICAgICAgIGNtZAogICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiBwb3N0KGlkLCB1bmRlZmluZWQsIHJlcykpCiAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gcG9zdChpZCwgZSkpOwogICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgLy8gTm90IGEgcHJvbWlzZSwganVzdCByZXR1cm4gaXQKICAgICAgICAgICAgICAgICAgICAgIHBvc3QoaWQsIHVuZGVmaW5lZCwgY21kKTsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0KICAgICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgICAgLy8gRXJyb3IKICAgICAgICAgICAgICAgICAgcG9zdChpZCwgbmV3IEVycm9yKGBjb21tYW5kICIke2NvbW1hbmR9IiBub3QgZm91bmRgKSk7CiAgICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICB9OwogICAgICBpZiAoY29tbWFuZHNbZGF0YS50eXBlXSkgewogICAgICAgICAgY29tbWFuZHNbZGF0YS50eXBlXShkYXRhKTsKICAgICAgfQogIH0pOwoKICBleHBvcnRzLmxpYnJhcmllcyA9IGxpYnJhcmllczsKCiAgcmV0dXJuIGV4cG9ydHM7Cgp9KSh7fSk7Ci8vIyBzb3VyY2VNYXBwaW5nVVJMPXdvcmtlci5qcy5tYXAKCg==', null, false);
  /* eslint-enable */

  const earthCircumference = 40075016.68557849;
  /**
    * Converts a webmercator x,y to WGS84 lng,lat
    * @param x
    * @param y
    * @returns LngLngLike
    */
  function toWGS84(x, y) {
      // Convert the lat lng
      const wgsLng = x * 180 / (earthCircumference / 2);
      // thanks magichim @ github for the correction
      const wgsLat = Math.atan(Math.exp(y * Math.PI / (earthCircumference / 2))) * 360 / Math.PI - 90;
      return { lng: wgsLng, lat: wgsLat };
  }
  /**
   * Converts a WGS84 lng,lat to webmercator x,y
   * @param lng
   * @param lat
   * @returns {x: number, y: number}
   */
  function fromWGS84(lng, lat) {
      // Calculate the web mercator X and Y
      // https://gist.github.com/onderaltintas/6649521
      const wmx = lng * (earthCircumference / 2) / 180;
      let wmy = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      wmy = wmy * (earthCircumference / 2) / 180;
      return { x: wmx, y: wmy };
  }
  /**
   * Takes a zoom, returns WebMercator Meters Per Pixel
   * Adapted from: https://github.com/mapbox/postgis-vt-util/blob/master/src/ZRes.sql
   * @param zoom
   * @param tileSize is optional, default is 256 (for 256x256 tiles)
   * @returns number
   */
  function metersPerPixel(zoom, tileSize = 256) {
      return earthCircumference / (tileSize * (1 << zoom));
  }

  const webMercatorCodes = ['102100', '900913', '3857', '3587', '54004', '41001', '102113', '3785'];
  function getEsriBoundingBox(lngLatBbox) {
      const sw = [Math.min(lngLatBbox[0], lngLatBbox[2]), Math.min(lngLatBbox[1], lngLatBbox[3])];
      const ne = [Math.max(lngLatBbox[0], lngLatBbox[2]), Math.max(lngLatBbox[1], lngLatBbox[3])];
      let swXY = fromWGS84(sw[0], sw[1]);
      let neXY = fromWGS84(ne[0], ne[1]);
      return {
          'type': 'extent',
          'xmin': swXY.x,
          'ymin': swXY.y,
          'xmax': neXY.x,
          'ymax': neXY.y,
          'spatialReferece': {
              'latestWkid': 102100,
              'wkid': 3857
          }
      };
  }
  function quantizationParameters(tileZoomLevel, tileSize = 256) {
      return {
          mode: 'view',
          originPosition: 'upperLeft',
          tolerance: metersPerPixel(tileZoomLevel, tileSize),
          extent: getEsriBoundingBox([-180.0, -85.06, 180, 85.06])
      };
  }
  function mergeRings(ringsX, ringsY, srid) {
      const reproject = (x, y) => {
          const xy = toWGS84(x, y);
          return [xy.lng, xy.lat];
      };
      if (webMercatorCodes.indexOf(srid) > -1) {
          return ringsX.map((ring, i) => ring.map((x, j) => reproject(x, ringsY[i][j])));
      }
      else {
          return ringsX.map((ring, i) => ring.map((x, j) => [x, ringsY[i][j]]));
      }
  }
  function deZigZag(values, splits, scale, initialOffset, upperLeftOrigin) {
      return splits.map((split, i) => {
          let lastValue = 0;
          return Array(split).fill(undefined).map((_, j) => {
              const valueOffset = splits.reduce((a, v, idx) => a += (idx < i ? v : 0), 0);
              const value = values[valueOffset + j];
              const sign = upperLeftOrigin ? -1 : 1;
              let returnValue;
              if (j === 0) {
                  returnValue = (value * sign) + (initialOffset / scale);
              }
              else {
                  returnValue = (value * sign) + lastValue;
              }
              lastValue = returnValue;
              return returnValue;
          }).map((v) => v * scale);
      });
  }
  class DeZigZagJSON {
      constructor(features, transform, geometryType) {
          this.srid = '3857';
          this.features = features;
          this.transform = transform;
          this.geometryType = geometryType;
      }
      async convert() {
          return this.features.map(feature => {
              feature.geometry = this.convertGeometry(feature.geometry);
              return feature;
          });
      }
      convertGeometry(geometry) {
          const counts = [];
          const x = [];
          const y = [];
          if (this.geometryType === 'esriGeometryPoint') {
              counts.push(1);
              x.push(geometry.x);
              y.push(geometry.y);
          }
          else if (this.geometryType === 'esriGeometryMultipoint') {
              geometry.points.forEach(p => {
                  counts.push(1);
                  x.push(p[0]);
                  y.push(p[1]);
              });
          }
          else if (this.geometryType === 'esriGeometryPolyline') {
              geometry.paths.forEach(l => {
                  counts.push(l.length);
                  l.forEach(position => {
                      x.push(position[0]);
                      y.push(position[1]);
                  });
              });
          }
          else if (this.geometryType === 'esriGeometryPolygon') {
              geometry.rings.forEach(poly => {
                  counts.push(poly.length);
                  poly.forEach(position => {
                      x.push(position[0]);
                      y.push(position[1]);
                  });
              });
          }
          // dezigzag the rings, and merge + reproject them
          const ringsX = deZigZag(x, counts, this.transform.scale[0], this.transform.translate[0], false);
          const ringsY = deZigZag(y, counts, this.transform.scale[1], this.transform.translate[1], this.transform.originPosition === 'upperLeft');
          // Merge the rings
          const rings = mergeRings(ringsX, ringsY, this.srid);
          let newGeometry = {};
          if (this.geometryType === 'esriGeometryPoint') {
              newGeometry = { 'x': rings[0][0][0], 'y': rings[0][0][1] };
          }
          else if (this.geometryType === 'esriGeometryMultipoint') {
              newGeometry = { 'points': rings[0] };
          }
          else if (this.geometryType === 'esriGeometryPolyline') {
              newGeometry = { paths: rings };
          }
          else if (this.geometryType === 'esriGeometryPolygon') {
              newGeometry = { rings: rings };
          }
          return newGeometry;
      }
  }

  // FeatureCollectionPBuffer ========================================
  function proto () {
      let FeatureCollectionPBuffer = {};
      FeatureCollectionPBuffer.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer._readField, { version: "", queryResult: null }, end);
      };
      FeatureCollectionPBuffer._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.version = pbf.readString();
          else if (tag === 2)
              obj.queryResult = FeatureCollectionPBuffer.QueryResult.read(pbf, pbf.readVarint() + pbf.pos);
      };
      FeatureCollectionPBuffer.write = function (obj, pbf) {
          if (obj.version)
              pbf.writeStringField(1, obj.version);
          if (obj.queryResult)
              pbf.writeMessage(2, FeatureCollectionPBuffer.QueryResult.write, obj.queryResult);
      };
      FeatureCollectionPBuffer.GeometryType = {
          "esriGeometryTypePoint": {
              "value": 0,
              "options": {}
          },
          "esriGeometryTypeMultipoint": {
              "value": 1,
              "options": {}
          },
          "esriGeometryTypePolyline": {
              "value": 2,
              "options": {}
          },
          "esriGeometryTypePolygon": {
              "value": 3,
              "options": {}
          },
          "esriGeometryTypeMultipatch": {
              "value": 4,
              "options": {}
          },
          "esriGeometryTypeNone": {
              "value": 127,
              "options": {}
          }
      };
      FeatureCollectionPBuffer.FieldType = {
          "esriFieldTypeSmallInteger": {
              "value": 0,
              "options": {}
          },
          "esriFieldTypeInteger": {
              "value": 1,
              "options": {}
          },
          "esriFieldTypeSingle": {
              "value": 2,
              "options": {}
          },
          "esriFieldTypeDouble": {
              "value": 3,
              "options": {}
          },
          "esriFieldTypeString": {
              "value": 4,
              "options": {}
          },
          "esriFieldTypeDate": {
              "value": 5,
              "options": {}
          },
          "esriFieldTypeOID": {
              "value": 6,
              "options": {}
          },
          "esriFieldTypeGeometry": {
              "value": 7,
              "options": {}
          },
          "esriFieldTypeBlob": {
              "value": 8,
              "options": {}
          },
          "esriFieldTypeRaster": {
              "value": 9,
              "options": {}
          },
          "esriFieldTypeGUID": {
              "value": 10,
              "options": {}
          },
          "esriFieldTypeGlobalID": {
              "value": 11,
              "options": {}
          },
          "esriFieldTypeXML": {
              "value": 12,
              "options": {}
          }
      };
      FeatureCollectionPBuffer.SQLType = {
          "sqlTypeBigInt": {
              "value": 0,
              "options": {}
          },
          "sqlTypeBinary": {
              "value": 1,
              "options": {}
          },
          "sqlTypeBit": {
              "value": 2,
              "options": {}
          },
          "sqlTypeChar": {
              "value": 3,
              "options": {}
          },
          "sqlTypeDate": {
              "value": 4,
              "options": {}
          },
          "sqlTypeDecimal": {
              "value": 5,
              "options": {}
          },
          "sqlTypeDouble": {
              "value": 6,
              "options": {}
          },
          "sqlTypeFloat": {
              "value": 7,
              "options": {}
          },
          "sqlTypeGeometry": {
              "value": 8,
              "options": {}
          },
          "sqlTypeGUID": {
              "value": 9,
              "options": {}
          },
          "sqlTypeInteger": {
              "value": 10,
              "options": {}
          },
          "sqlTypeLongNVarchar": {
              "value": 11,
              "options": {}
          },
          "sqlTypeLongVarbinary": {
              "value": 12,
              "options": {}
          },
          "sqlTypeLongVarchar": {
              "value": 13,
              "options": {}
          },
          "sqlTypeNChar": {
              "value": 14,
              "options": {}
          },
          "sqlTypeNVarchar": {
              "value": 15,
              "options": {}
          },
          "sqlTypeOther": {
              "value": 16,
              "options": {}
          },
          "sqlTypeReal": {
              "value": 17,
              "options": {}
          },
          "sqlTypeSmallInt": {
              "value": 18,
              "options": {}
          },
          "sqlTypeSqlXml": {
              "value": 19,
              "options": {}
          },
          "sqlTypeTime": {
              "value": 20,
              "options": {}
          },
          "sqlTypeTimestamp": {
              "value": 21,
              "options": {}
          },
          "sqlTypeTimestamp2": {
              "value": 22,
              "options": {}
          },
          "sqlTypeTinyInt": {
              "value": 23,
              "options": {}
          },
          "sqlTypeVarbinary": {
              "value": 24,
              "options": {}
          },
          "sqlTypeVarchar": {
              "value": 25,
              "options": {}
          }
      };
      FeatureCollectionPBuffer.QuantizeOriginPostion = {
          "upperLeft": {
              "value": 0,
              "options": {}
          },
          "lowerLeft": {
              "value": 1,
              "options": {}
          }
      };
      // FeatureCollectionPBuffer.SpatialReference ========================================
      FeatureCollectionPBuffer.SpatialReference = {};
      FeatureCollectionPBuffer.SpatialReference.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.SpatialReference._readField, { wkid: 0, lastestWkid: 0, vcsWkid: 0, latestVcsWkid: 0, wkt: "" }, end);
      };
      FeatureCollectionPBuffer.SpatialReference._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.wkid = pbf.readVarint();
          else if (tag === 2)
              obj.lastestWkid = pbf.readVarint();
          else if (tag === 3)
              obj.vcsWkid = pbf.readVarint();
          else if (tag === 4)
              obj.latestVcsWkid = pbf.readVarint();
          else if (tag === 5)
              obj.wkt = pbf.readString();
      };
      FeatureCollectionPBuffer.SpatialReference.write = function (obj, pbf) {
          if (obj.wkid)
              pbf.writeVarintField(1, obj.wkid);
          if (obj.lastestWkid)
              pbf.writeVarintField(2, obj.lastestWkid);
          if (obj.vcsWkid)
              pbf.writeVarintField(3, obj.vcsWkid);
          if (obj.latestVcsWkid)
              pbf.writeVarintField(4, obj.latestVcsWkid);
          if (obj.wkt)
              pbf.writeStringField(5, obj.wkt);
      };
      // FeatureCollectionPBuffer.Field ========================================
      FeatureCollectionPBuffer.Field = {};
      FeatureCollectionPBuffer.Field.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Field._readField, { name: "", fieldType: 0, alias: "", sqlType: 0, domain: "", defaultValue: "" }, end);
      };
      FeatureCollectionPBuffer.Field._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.name = pbf.readString();
          else if (tag === 2)
              obj.fieldType = pbf.readVarint();
          else if (tag === 3)
              obj.alias = pbf.readString();
          else if (tag === 4)
              obj.sqlType = pbf.readVarint();
          else if (tag === 5)
              obj.domain = pbf.readString();
          else if (tag === 6)
              obj.defaultValue = pbf.readString();
      };
      FeatureCollectionPBuffer.Field.write = function (obj, pbf) {
          if (obj.name)
              pbf.writeStringField(1, obj.name);
          if (obj.fieldType)
              pbf.writeVarintField(2, obj.fieldType);
          if (obj.alias)
              pbf.writeStringField(3, obj.alias);
          if (obj.sqlType)
              pbf.writeVarintField(4, obj.sqlType);
          if (obj.domain)
              pbf.writeStringField(5, obj.domain);
          if (obj.defaultValue)
              pbf.writeStringField(6, obj.defaultValue);
      };
      // FeatureCollectionPBuffer.Value ========================================
      FeatureCollectionPBuffer.Value = {};
      FeatureCollectionPBuffer.Value.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Value._readField, { string_value: "", value_type: null, float_value: 0, double_value: 0, sint_value: 0, uint_value: 0, int64_value: 0, uint64_value: 0, sint64_value: 0, bool_value: false }, end);
      };
      FeatureCollectionPBuffer.Value._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.string_value = pbf.readString(), obj.value_type = "string_value";
          else if (tag === 2)
              obj.float_value = pbf.readFloat(), obj.value_type = "float_value";
          else if (tag === 3)
              obj.double_value = pbf.readDouble(), obj.value_type = "double_value";
          else if (tag === 4)
              obj.sint_value = pbf.readSVarint(), obj.value_type = "sint_value";
          else if (tag === 5)
              obj.uint_value = pbf.readVarint(), obj.value_type = "uint_value";
          else if (tag === 6)
              obj.int64_value = pbf.readVarint(true), obj.value_type = "int64_value";
          else if (tag === 7)
              obj.uint64_value = pbf.readVarint(), obj.value_type = "uint64_value";
          else if (tag === 8)
              obj.sint64_value = pbf.readSVarint(), obj.value_type = "sint64_value";
          else if (tag === 9)
              obj.bool_value = pbf.readBoolean(), obj.value_type = "bool_value";
      };
      FeatureCollectionPBuffer.Value.write = function (obj, pbf) {
          if (obj.string_value)
              pbf.writeStringField(1, obj.string_value);
          if (obj.float_value)
              pbf.writeFloatField(2, obj.float_value);
          if (obj.double_value)
              pbf.writeDoubleField(3, obj.double_value);
          if (obj.sint_value)
              pbf.writeSVarintField(4, obj.sint_value);
          if (obj.uint_value)
              pbf.writeVarintField(5, obj.uint_value);
          if (obj.int64_value)
              pbf.writeVarintField(6, obj.int64_value);
          if (obj.uint64_value)
              pbf.writeVarintField(7, obj.uint64_value);
          if (obj.sint64_value)
              pbf.writeSVarintField(8, obj.sint64_value);
          if (obj.bool_value)
              pbf.writeBooleanField(9, obj.bool_value);
      };
      // FeatureCollectionPBuffer.Geometry ========================================
      FeatureCollectionPBuffer.Geometry = {};
      FeatureCollectionPBuffer.Geometry.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Geometry._readField, { lengths: [], coords: [] }, end);
      };
      FeatureCollectionPBuffer.Geometry._readField = function (tag, obj, pbf) {
          if (tag === 2)
              pbf.readPackedVarint(obj.lengths);
          else if (tag === 3)
              pbf.readPackedSVarint(obj.coords);
      };
      FeatureCollectionPBuffer.Geometry.write = function (obj, pbf) {
          if (obj.lengths)
              pbf.writePackedVarint(2, obj.lengths);
          if (obj.coords)
              pbf.writePackedSVarint(3, obj.coords);
      };
      // FeatureCollectionPBuffer.esriShapeBuffer ========================================
      FeatureCollectionPBuffer.esriShapeBuffer = {};
      FeatureCollectionPBuffer.esriShapeBuffer.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.esriShapeBuffer._readField, { bytes: null }, end);
      };
      FeatureCollectionPBuffer.esriShapeBuffer._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.bytes = pbf.readBytes();
      };
      FeatureCollectionPBuffer.esriShapeBuffer.write = function (obj, pbf) {
          if (obj.bytes)
              pbf.writeBytesField(1, obj.bytes);
      };
      // FeatureCollectionPBuffer.Feature ========================================
      FeatureCollectionPBuffer.Feature = {};
      FeatureCollectionPBuffer.Feature.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Feature._readField, { attributes: [], geometry: null, compressed_geometry: null, shapeBuffer: null, centroid: null }, end);
      };
      FeatureCollectionPBuffer.Feature._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.attributes.push(FeatureCollectionPBuffer.Value.read(pbf, pbf.readVarint() + pbf.pos));
          else if (tag === 2)
              obj.geometry = FeatureCollectionPBuffer.Geometry.read(pbf, pbf.readVarint() + pbf.pos), obj.compressed_geometry = "geometry";
          else if (tag === 3)
              obj.shapeBuffer = FeatureCollectionPBuffer.esriShapeBuffer.read(pbf, pbf.readVarint() + pbf.pos), obj.compressed_geometry = "shapeBuffer";
          else if (tag === 4)
              obj.centroid = FeatureCollectionPBuffer.Geometry.read(pbf, pbf.readVarint() + pbf.pos);
      };
      FeatureCollectionPBuffer.Feature.write = function (obj, pbf) {
          if (obj.attributes)
              for (var i = 0; i < obj.attributes.length; i++)
                  pbf.writeMessage(1, FeatureCollectionPBuffer.Value.write, obj.attributes[i]);
          if (obj.geometry)
              pbf.writeMessage(2, FeatureCollectionPBuffer.Geometry.write, obj.geometry);
          if (obj.shapeBuffer)
              pbf.writeMessage(3, FeatureCollectionPBuffer.esriShapeBuffer.write, obj.shapeBuffer);
          if (obj.centroid)
              pbf.writeMessage(4, FeatureCollectionPBuffer.Geometry.write, obj.centroid);
      };
      // FeatureCollectionPBuffer.UniqueIdField ========================================
      FeatureCollectionPBuffer.UniqueIdField = {};
      FeatureCollectionPBuffer.UniqueIdField.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.UniqueIdField._readField, { name: "", isSystemMaintained: false }, end);
      };
      FeatureCollectionPBuffer.UniqueIdField._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.name = pbf.readString();
          else if (tag === 2)
              obj.isSystemMaintained = pbf.readBoolean();
      };
      FeatureCollectionPBuffer.UniqueIdField.write = function (obj, pbf) {
          if (obj.name)
              pbf.writeStringField(1, obj.name);
          if (obj.isSystemMaintained)
              pbf.writeBooleanField(2, obj.isSystemMaintained);
      };
      // FeatureCollectionPBuffer.GeometryProperties ========================================
      FeatureCollectionPBuffer.GeometryProperties = {};
      FeatureCollectionPBuffer.GeometryProperties.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.GeometryProperties._readField, { shapeAreaFieldName: "", shapeLengthFieldName: "", units: "" }, end);
      };
      FeatureCollectionPBuffer.GeometryProperties._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.shapeAreaFieldName = pbf.readString();
          else if (tag === 2)
              obj.shapeLengthFieldName = pbf.readString();
          else if (tag === 3)
              obj.units = pbf.readString();
      };
      FeatureCollectionPBuffer.GeometryProperties.write = function (obj, pbf) {
          if (obj.shapeAreaFieldName)
              pbf.writeStringField(1, obj.shapeAreaFieldName);
          if (obj.shapeLengthFieldName)
              pbf.writeStringField(2, obj.shapeLengthFieldName);
          if (obj.units)
              pbf.writeStringField(3, obj.units);
      };
      // FeatureCollectionPBuffer.ServerGens ========================================
      FeatureCollectionPBuffer.ServerGens = {};
      FeatureCollectionPBuffer.ServerGens.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.ServerGens._readField, { minServerGen: 0, serverGen: 0 }, end);
      };
      FeatureCollectionPBuffer.ServerGens._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.minServerGen = pbf.readVarint();
          else if (tag === 2)
              obj.serverGen = pbf.readVarint();
      };
      FeatureCollectionPBuffer.ServerGens.write = function (obj, pbf) {
          if (obj.minServerGen)
              pbf.writeVarintField(1, obj.minServerGen);
          if (obj.serverGen)
              pbf.writeVarintField(2, obj.serverGen);
      };
      // FeatureCollectionPBuffer.Scale ========================================
      FeatureCollectionPBuffer.Scale = {};
      FeatureCollectionPBuffer.Scale.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Scale._readField, { xScale: 0, yScale: 0, mScale: 0, zScale: 0 }, end);
      };
      FeatureCollectionPBuffer.Scale._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.xScale = pbf.readDouble();
          else if (tag === 2)
              obj.yScale = pbf.readDouble();
          else if (tag === 3)
              obj.mScale = pbf.readDouble();
          else if (tag === 4)
              obj.zScale = pbf.readDouble();
      };
      FeatureCollectionPBuffer.Scale.write = function (obj, pbf) {
          if (obj.xScale)
              pbf.writeDoubleField(1, obj.xScale);
          if (obj.yScale)
              pbf.writeDoubleField(2, obj.yScale);
          if (obj.mScale)
              pbf.writeDoubleField(3, obj.mScale);
          if (obj.zScale)
              pbf.writeDoubleField(4, obj.zScale);
      };
      // FeatureCollectionPBuffer.Translate ========================================
      FeatureCollectionPBuffer.Translate = {};
      FeatureCollectionPBuffer.Translate.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Translate._readField, { xTranslate: 0, yTranslate: 0, mTranslate: 0, zTranslate: 0 }, end);
      };
      FeatureCollectionPBuffer.Translate._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.xTranslate = pbf.readDouble();
          else if (tag === 2)
              obj.yTranslate = pbf.readDouble();
          else if (tag === 3)
              obj.mTranslate = pbf.readDouble();
          else if (tag === 4)
              obj.zTranslate = pbf.readDouble();
      };
      FeatureCollectionPBuffer.Translate.write = function (obj, pbf) {
          if (obj.xTranslate)
              pbf.writeDoubleField(1, obj.xTranslate);
          if (obj.yTranslate)
              pbf.writeDoubleField(2, obj.yTranslate);
          if (obj.mTranslate)
              pbf.writeDoubleField(3, obj.mTranslate);
          if (obj.zTranslate)
              pbf.writeDoubleField(4, obj.zTranslate);
      };
      // FeatureCollectionPBuffer.Transform ========================================
      FeatureCollectionPBuffer.Transform = {};
      FeatureCollectionPBuffer.Transform.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.Transform._readField, { quantizeOriginPostion: 0, scale: null, translate: null }, end);
      };
      FeatureCollectionPBuffer.Transform._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.quantizeOriginPostion = pbf.readVarint();
          else if (tag === 2)
              obj.scale = FeatureCollectionPBuffer.Scale.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 3)
              obj.translate = FeatureCollectionPBuffer.Translate.read(pbf, pbf.readVarint() + pbf.pos);
      };
      FeatureCollectionPBuffer.Transform.write = function (obj, pbf) {
          if (obj.quantizeOriginPostion)
              pbf.writeVarintField(1, obj.quantizeOriginPostion);
          if (obj.scale)
              pbf.writeMessage(2, FeatureCollectionPBuffer.Scale.write, obj.scale);
          if (obj.translate)
              pbf.writeMessage(3, FeatureCollectionPBuffer.Translate.write, obj.translate);
      };
      // FeatureCollectionPBuffer.FeatureResult ========================================
      FeatureCollectionPBuffer.FeatureResult = {};
      FeatureCollectionPBuffer.FeatureResult.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.FeatureResult._readField, { objectIdFieldName: "", uniqueIdField: null, globalIdFieldName: "", geohashFieldName: "", geometryProperties: null, serverGens: null, geometryType: 0, spatialReference: null, exceededTransferLimit: false, hasZ: false, hasM: false, transform: null, fields: [], values: [], features: [] }, end);
      };
      FeatureCollectionPBuffer.FeatureResult._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.objectIdFieldName = pbf.readString();
          else if (tag === 2)
              obj.uniqueIdField = FeatureCollectionPBuffer.UniqueIdField.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 3)
              obj.globalIdFieldName = pbf.readString();
          else if (tag === 4)
              obj.geohashFieldName = pbf.readString();
          else if (tag === 5)
              obj.geometryProperties = FeatureCollectionPBuffer.GeometryProperties.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 6)
              obj.serverGens = FeatureCollectionPBuffer.ServerGens.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 7)
              obj.geometryType = pbf.readVarint();
          else if (tag === 8)
              obj.spatialReference = FeatureCollectionPBuffer.SpatialReference.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 9)
              obj.exceededTransferLimit = pbf.readBoolean();
          else if (tag === 10)
              obj.hasZ = pbf.readBoolean();
          else if (tag === 11)
              obj.hasM = pbf.readBoolean();
          else if (tag === 12)
              obj.transform = FeatureCollectionPBuffer.Transform.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 13)
              obj.fields.push(FeatureCollectionPBuffer.Field.read(pbf, pbf.readVarint() + pbf.pos));
          else if (tag === 14)
              obj.values.push(FeatureCollectionPBuffer.Value.read(pbf, pbf.readVarint() + pbf.pos));
          else if (tag === 15)
              obj.features.push(FeatureCollectionPBuffer.Feature.read(pbf, pbf.readVarint() + pbf.pos));
      };
      FeatureCollectionPBuffer.FeatureResult.write = function (obj, pbf) {
          if (obj.objectIdFieldName)
              pbf.writeStringField(1, obj.objectIdFieldName);
          if (obj.uniqueIdField)
              pbf.writeMessage(2, FeatureCollectionPBuffer.UniqueIdField.write, obj.uniqueIdField);
          if (obj.globalIdFieldName)
              pbf.writeStringField(3, obj.globalIdFieldName);
          if (obj.geohashFieldName)
              pbf.writeStringField(4, obj.geohashFieldName);
          if (obj.geometryProperties)
              pbf.writeMessage(5, FeatureCollectionPBuffer.GeometryProperties.write, obj.geometryProperties);
          if (obj.serverGens)
              pbf.writeMessage(6, FeatureCollectionPBuffer.ServerGens.write, obj.serverGens);
          if (obj.geometryType)
              pbf.writeVarintField(7, obj.geometryType);
          if (obj.spatialReference)
              pbf.writeMessage(8, FeatureCollectionPBuffer.SpatialReference.write, obj.spatialReference);
          if (obj.exceededTransferLimit)
              pbf.writeBooleanField(9, obj.exceededTransferLimit);
          if (obj.hasZ)
              pbf.writeBooleanField(10, obj.hasZ);
          if (obj.hasM)
              pbf.writeBooleanField(11, obj.hasM);
          if (obj.transform)
              pbf.writeMessage(12, FeatureCollectionPBuffer.Transform.write, obj.transform);
          if (obj.fields)
              for (var i = 0; i < obj.fields.length; i++)
                  pbf.writeMessage(13, FeatureCollectionPBuffer.Field.write, obj.fields[i]);
          if (obj.values)
              for (i = 0; i < obj.values.length; i++)
                  pbf.writeMessage(14, FeatureCollectionPBuffer.Value.write, obj.values[i]);
          if (obj.features)
              for (i = 0; i < obj.features.length; i++)
                  pbf.writeMessage(15, FeatureCollectionPBuffer.Feature.write, obj.features[i]);
      };
      // FeatureCollectionPBuffer.CountResult ========================================
      FeatureCollectionPBuffer.CountResult = {};
      FeatureCollectionPBuffer.CountResult.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.CountResult._readField, { count: 0 }, end);
      };
      FeatureCollectionPBuffer.CountResult._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.count = pbf.readVarint();
      };
      FeatureCollectionPBuffer.CountResult.write = function (obj, pbf) {
          if (obj.count)
              pbf.writeVarintField(1, obj.count);
      };
      // FeatureCollectionPBuffer.ObjectIdsResult ========================================
      FeatureCollectionPBuffer.ObjectIdsResult = {};
      FeatureCollectionPBuffer.ObjectIdsResult.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.ObjectIdsResult._readField, { objectIdFieldName: "", serverGens: null, objectIds: [] }, end);
      };
      FeatureCollectionPBuffer.ObjectIdsResult._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.objectIdFieldName = pbf.readString();
          else if (tag === 2)
              obj.serverGens = FeatureCollectionPBuffer.ServerGens.read(pbf, pbf.readVarint() + pbf.pos);
          else if (tag === 3)
              pbf.readPackedVarint(obj.objectIds);
      };
      FeatureCollectionPBuffer.ObjectIdsResult.write = function (obj, pbf) {
          if (obj.objectIdFieldName)
              pbf.writeStringField(1, obj.objectIdFieldName);
          if (obj.serverGens)
              pbf.writeMessage(2, FeatureCollectionPBuffer.ServerGens.write, obj.serverGens);
          if (obj.objectIds)
              pbf.writePackedVarint(3, obj.objectIds);
      };
      // FeatureCollectionPBuffer.QueryResult ========================================
      FeatureCollectionPBuffer.QueryResult = {};
      FeatureCollectionPBuffer.QueryResult.read = function (pbf, end) {
          return pbf.readFields(FeatureCollectionPBuffer.QueryResult._readField, { featureResult: null, Results: null, countResult: null, idsResult: null }, end);
      };
      FeatureCollectionPBuffer.QueryResult._readField = function (tag, obj, pbf) {
          if (tag === 1)
              obj.featureResult = FeatureCollectionPBuffer.FeatureResult.read(pbf, pbf.readVarint() + pbf.pos), obj.Results = "featureResult";
          else if (tag === 2)
              obj.countResult = FeatureCollectionPBuffer.CountResult.read(pbf, pbf.readVarint() + pbf.pos), obj.Results = "countResult";
          else if (tag === 3)
              obj.idsResult = FeatureCollectionPBuffer.ObjectIdsResult.read(pbf, pbf.readVarint() + pbf.pos), obj.Results = "idsResult";
      };
      FeatureCollectionPBuffer.QueryResult.write = function (obj, pbf) {
          if (obj.featureResult)
              pbf.writeMessage(1, FeatureCollectionPBuffer.FeatureResult.write, obj.featureResult);
          if (obj.countResult)
              pbf.writeMessage(2, FeatureCollectionPBuffer.CountResult.write, obj.countResult);
          if (obj.idsResult)
              pbf.writeMessage(3, FeatureCollectionPBuffer.ObjectIdsResult.write, obj.idsResult);
      };
      return FeatureCollectionPBuffer;
  }

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var ieee754$1 = {};

  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

  ieee754$1.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = (nBytes * 8) - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? (nBytes - 1) : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  };

  ieee754$1.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = (nBytes * 8) - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
    var i = isLE ? 0 : (nBytes - 1);
    var d = isLE ? 1 : -1;
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = ((value * c) - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  };

  var pbf = Pbf;

  var ieee754 = ieee754$1;

  function Pbf(buf) {
      this.buf = ArrayBuffer.isView && ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf || 0);
      this.pos = 0;
      this.type = 0;
      this.length = this.buf.length;
  }

  Pbf.Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
  Pbf.Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
  Pbf.Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
  Pbf.Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

  var SHIFT_LEFT_32 = (1 << 16) * (1 << 16),
      SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

  // Threshold chosen based on both benchmarking and knowledge about browser string
  // data structures (which currently switch structure types at 12 bytes or more)
  var TEXT_DECODER_MIN_LENGTH = 12;
  var utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf8');

  Pbf.prototype = {

      destroy: function() {
          this.buf = null;
      },

      // === READING =================================================================

      readFields: function(readField, result, end) {
          end = end || this.length;

          while (this.pos < end) {
              var val = this.readVarint(),
                  tag = val >> 3,
                  startPos = this.pos;

              this.type = val & 0x7;
              readField(tag, result, this);

              if (this.pos === startPos) this.skip(val);
          }
          return result;
      },

      readMessage: function(readField, result) {
          return this.readFields(readField, result, this.readVarint() + this.pos);
      },

      readFixed32: function() {
          var val = readUInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
      },

      readSFixed32: function() {
          var val = readInt32(this.buf, this.pos);
          this.pos += 4;
          return val;
      },

      // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)

      readFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readUInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
      },

      readSFixed64: function() {
          var val = readUInt32(this.buf, this.pos) + readInt32(this.buf, this.pos + 4) * SHIFT_LEFT_32;
          this.pos += 8;
          return val;
      },

      readFloat: function() {
          var val = ieee754.read(this.buf, this.pos, true, 23, 4);
          this.pos += 4;
          return val;
      },

      readDouble: function() {
          var val = ieee754.read(this.buf, this.pos, true, 52, 8);
          this.pos += 8;
          return val;
      },

      readVarint: function(isSigned) {
          var buf = this.buf,
              val, b;

          b = buf[this.pos++]; val  =  b & 0x7f;        if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 7;  if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 14; if (b < 0x80) return val;
          b = buf[this.pos++]; val |= (b & 0x7f) << 21; if (b < 0x80) return val;
          b = buf[this.pos];   val |= (b & 0x0f) << 28;

          return readVarintRemainder(val, isSigned, this);
      },

      readVarint64: function() { // for compatibility with v2.0.1
          return this.readVarint(true);
      },

      readSVarint: function() {
          var num = this.readVarint();
          return num % 2 === 1 ? (num + 1) / -2 : num / 2; // zigzag encoding
      },

      readBoolean: function() {
          return Boolean(this.readVarint());
      },

      readString: function() {
          var end = this.readVarint() + this.pos;
          var pos = this.pos;
          this.pos = end;

          if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
              // longer strings are fast with the built-in browser TextDecoder API
              return readUtf8TextDecoder(this.buf, pos, end);
          }
          // short strings are fast with our custom implementation
          return readUtf8(this.buf, pos, end);
      },

      readBytes: function() {
          var end = this.readVarint() + this.pos,
              buffer = this.buf.subarray(this.pos, end);
          this.pos = end;
          return buffer;
      },

      // verbose for performance reasons; doesn't affect gzipped size

      readPackedVarint: function(arr, isSigned) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readVarint(isSigned));
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readVarint(isSigned));
          return arr;
      },
      readPackedSVarint: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSVarint());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSVarint());
          return arr;
      },
      readPackedBoolean: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readBoolean());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readBoolean());
          return arr;
      },
      readPackedFloat: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFloat());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFloat());
          return arr;
      },
      readPackedDouble: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readDouble());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readDouble());
          return arr;
      },
      readPackedFixed32: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFixed32());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFixed32());
          return arr;
      },
      readPackedSFixed32: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed32());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSFixed32());
          return arr;
      },
      readPackedFixed64: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readFixed64());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readFixed64());
          return arr;
      },
      readPackedSFixed64: function(arr) {
          if (this.type !== Pbf.Bytes) return arr.push(this.readSFixed64());
          var end = readPackedEnd(this);
          arr = arr || [];
          while (this.pos < end) arr.push(this.readSFixed64());
          return arr;
      },

      skip: function(val) {
          var type = val & 0x7;
          if (type === Pbf.Varint) while (this.buf[this.pos++] > 0x7f) {}
          else if (type === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
          else if (type === Pbf.Fixed32) this.pos += 4;
          else if (type === Pbf.Fixed64) this.pos += 8;
          else throw new Error('Unimplemented type: ' + type);
      },

      // === WRITING =================================================================

      writeTag: function(tag, type) {
          this.writeVarint((tag << 3) | type);
      },

      realloc: function(min) {
          var length = this.length || 16;

          while (length < this.pos + min) length *= 2;

          if (length !== this.length) {
              var buf = new Uint8Array(length);
              buf.set(this.buf);
              this.buf = buf;
              this.length = length;
          }
      },

      finish: function() {
          this.length = this.pos;
          this.pos = 0;
          return this.buf.subarray(0, this.length);
      },

      writeFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
      },

      writeSFixed32: function(val) {
          this.realloc(4);
          writeInt32(this.buf, val, this.pos);
          this.pos += 4;
      },

      writeFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
      },

      writeSFixed64: function(val) {
          this.realloc(8);
          writeInt32(this.buf, val & -1, this.pos);
          writeInt32(this.buf, Math.floor(val * SHIFT_RIGHT_32), this.pos + 4);
          this.pos += 8;
      },

      writeVarint: function(val) {
          val = +val || 0;

          if (val > 0xfffffff || val < 0) {
              writeBigVarint(val, this);
              return;
          }

          this.realloc(4);

          this.buf[this.pos++] =           val & 0x7f  | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] = ((val >>>= 7) & 0x7f) | (val > 0x7f ? 0x80 : 0); if (val <= 0x7f) return;
          this.buf[this.pos++] =   (val >>> 7) & 0x7f;
      },

      writeSVarint: function(val) {
          this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
      },

      writeBoolean: function(val) {
          this.writeVarint(Boolean(val));
      },

      writeString: function(str) {
          str = String(str);
          this.realloc(str.length * 4);

          this.pos++; // reserve 1 byte for short string length

          var startPos = this.pos;
          // write the string directly to the buffer and see how much was written
          this.pos = writeUtf8(this.buf, str, this.pos);
          var len = this.pos - startPos;

          if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

          // finally, write the message length in the reserved place and restore the position
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
      },

      writeFloat: function(val) {
          this.realloc(4);
          ieee754.write(this.buf, val, this.pos, true, 23, 4);
          this.pos += 4;
      },

      writeDouble: function(val) {
          this.realloc(8);
          ieee754.write(this.buf, val, this.pos, true, 52, 8);
          this.pos += 8;
      },

      writeBytes: function(buffer) {
          var len = buffer.length;
          this.writeVarint(len);
          this.realloc(len);
          for (var i = 0; i < len; i++) this.buf[this.pos++] = buffer[i];
      },

      writeRawMessage: function(fn, obj) {
          this.pos++; // reserve 1 byte for short message length

          // write the message directly to the buffer and see how much was written
          var startPos = this.pos;
          fn(obj, this);
          var len = this.pos - startPos;

          if (len >= 0x80) makeRoomForExtraLength(startPos, len, this);

          // finally, write the message length in the reserved place and restore the position
          this.pos = startPos - 1;
          this.writeVarint(len);
          this.pos += len;
      },

      writeMessage: function(tag, fn, obj) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeRawMessage(fn, obj);
      },

      writePackedVarint:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedVarint, arr);   },
      writePackedSVarint:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSVarint, arr);  },
      writePackedBoolean:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedBoolean, arr);  },
      writePackedFloat:    function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFloat, arr);    },
      writePackedDouble:   function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedDouble, arr);   },
      writePackedFixed32:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed32, arr);  },
      writePackedSFixed32: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed32, arr); },
      writePackedFixed64:  function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedFixed64, arr);  },
      writePackedSFixed64: function(tag, arr) { if (arr.length) this.writeMessage(tag, writePackedSFixed64, arr); },

      writeBytesField: function(tag, buffer) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeBytes(buffer);
      },
      writeFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFixed32(val);
      },
      writeSFixed32Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeSFixed32(val);
      },
      writeFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeFixed64(val);
      },
      writeSFixed64Field: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeSFixed64(val);
      },
      writeVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeVarint(val);
      },
      writeSVarintField: function(tag, val) {
          this.writeTag(tag, Pbf.Varint);
          this.writeSVarint(val);
      },
      writeStringField: function(tag, str) {
          this.writeTag(tag, Pbf.Bytes);
          this.writeString(str);
      },
      writeFloatField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed32);
          this.writeFloat(val);
      },
      writeDoubleField: function(tag, val) {
          this.writeTag(tag, Pbf.Fixed64);
          this.writeDouble(val);
      },
      writeBooleanField: function(tag, val) {
          this.writeVarintField(tag, Boolean(val));
      }
  };

  function readVarintRemainder(l, s, p) {
      var buf = p.buf,
          h, b;

      b = buf[p.pos++]; h  = (b & 0x70) >> 4;  if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 3;  if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 10; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 17; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x7f) << 24; if (b < 0x80) return toNum(l, h, s);
      b = buf[p.pos++]; h |= (b & 0x01) << 31; if (b < 0x80) return toNum(l, h, s);

      throw new Error('Expected varint not more than 10 bytes');
  }

  function readPackedEnd(pbf) {
      return pbf.type === Pbf.Bytes ?
          pbf.readVarint() + pbf.pos : pbf.pos + 1;
  }

  function toNum(low, high, isSigned) {
      if (isSigned) {
          return high * 0x100000000 + (low >>> 0);
      }

      return ((high >>> 0) * 0x100000000) + (low >>> 0);
  }

  function writeBigVarint(val, pbf) {
      var low, high;

      if (val >= 0) {
          low  = (val % 0x100000000) | 0;
          high = (val / 0x100000000) | 0;
      } else {
          low  = ~(-val % 0x100000000);
          high = ~(-val / 0x100000000);

          if (low ^ 0xffffffff) {
              low = (low + 1) | 0;
          } else {
              low = 0;
              high = (high + 1) | 0;
          }
      }

      if (val >= 0x10000000000000000 || val < -0x10000000000000000) {
          throw new Error('Given varint doesn\'t fit into 10 bytes');
      }

      pbf.realloc(10);

      writeBigVarintLow(low, high, pbf);
      writeBigVarintHigh(high, pbf);
  }

  function writeBigVarintLow(low, high, pbf) {
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos++] = low & 0x7f | 0x80; low >>>= 7;
      pbf.buf[pbf.pos]   = low & 0x7f;
  }

  function writeBigVarintHigh(high, pbf) {
      var lsb = (high & 0x07) << 4;

      pbf.buf[pbf.pos++] |= lsb         | ((high >>>= 3) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f | ((high >>>= 7) ? 0x80 : 0); if (!high) return;
      pbf.buf[pbf.pos++]  = high & 0x7f;
  }

  function makeRoomForExtraLength(startPos, len, pbf) {
      var extraLen =
          len <= 0x3fff ? 1 :
          len <= 0x1fffff ? 2 :
          len <= 0xfffffff ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));

      // if 1 byte isn't enough for encoding message length, shift the data to the right
      pbf.realloc(extraLen);
      for (var i = pbf.pos - 1; i >= startPos; i--) pbf.buf[i + extraLen] = pbf.buf[i];
  }

  function writePackedVarint(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeVarint(arr[i]);   }
  function writePackedSVarint(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeSVarint(arr[i]);  }
  function writePackedFloat(arr, pbf)    { for (var i = 0; i < arr.length; i++) pbf.writeFloat(arr[i]);    }
  function writePackedDouble(arr, pbf)   { for (var i = 0; i < arr.length; i++) pbf.writeDouble(arr[i]);   }
  function writePackedBoolean(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeBoolean(arr[i]);  }
  function writePackedFixed32(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed32(arr[i]);  }
  function writePackedSFixed32(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed32(arr[i]); }
  function writePackedFixed64(arr, pbf)  { for (var i = 0; i < arr.length; i++) pbf.writeFixed64(arr[i]);  }
  function writePackedSFixed64(arr, pbf) { for (var i = 0; i < arr.length; i++) pbf.writeSFixed64(arr[i]); }

  // Buffer code below from https://github.com/feross/buffer, MIT-licensed

  function readUInt32(buf, pos) {
      return ((buf[pos]) |
          (buf[pos + 1] << 8) |
          (buf[pos + 2] << 16)) +
          (buf[pos + 3] * 0x1000000);
  }

  function writeInt32(buf, val, pos) {
      buf[pos] = val;
      buf[pos + 1] = (val >>> 8);
      buf[pos + 2] = (val >>> 16);
      buf[pos + 3] = (val >>> 24);
  }

  function readInt32(buf, pos) {
      return ((buf[pos]) |
          (buf[pos + 1] << 8) |
          (buf[pos + 2] << 16)) +
          (buf[pos + 3] << 24);
  }

  function readUtf8(buf, pos, end) {
      var str = '';
      var i = pos;

      while (i < end) {
          var b0 = buf[i];
          var c = null; // codepoint
          var bytesPerSequence =
              b0 > 0xEF ? 4 :
              b0 > 0xDF ? 3 :
              b0 > 0xBF ? 2 : 1;

          if (i + bytesPerSequence > end) break;

          var b1, b2, b3;

          if (bytesPerSequence === 1) {
              if (b0 < 0x80) {
                  c = b0;
              }
          } else if (bytesPerSequence === 2) {
              b1 = buf[i + 1];
              if ((b1 & 0xC0) === 0x80) {
                  c = (b0 & 0x1F) << 0x6 | (b1 & 0x3F);
                  if (c <= 0x7F) {
                      c = null;
                  }
              }
          } else if (bytesPerSequence === 3) {
              b1 = buf[i + 1];
              b2 = buf[i + 2];
              if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80) {
                  c = (b0 & 0xF) << 0xC | (b1 & 0x3F) << 0x6 | (b2 & 0x3F);
                  if (c <= 0x7FF || (c >= 0xD800 && c <= 0xDFFF)) {
                      c = null;
                  }
              }
          } else if (bytesPerSequence === 4) {
              b1 = buf[i + 1];
              b2 = buf[i + 2];
              b3 = buf[i + 3];
              if ((b1 & 0xC0) === 0x80 && (b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                  c = (b0 & 0xF) << 0x12 | (b1 & 0x3F) << 0xC | (b2 & 0x3F) << 0x6 | (b3 & 0x3F);
                  if (c <= 0xFFFF || c >= 0x110000) {
                      c = null;
                  }
              }
          }

          if (c === null) {
              c = 0xFFFD;
              bytesPerSequence = 1;

          } else if (c > 0xFFFF) {
              c -= 0x10000;
              str += String.fromCharCode(c >>> 10 & 0x3FF | 0xD800);
              c = 0xDC00 | c & 0x3FF;
          }

          str += String.fromCharCode(c);
          i += bytesPerSequence;
      }

      return str;
  }

  function readUtf8TextDecoder(buf, pos, end) {
      return utf8TextDecoder.decode(buf.subarray(pos, end));
  }

  function writeUtf8(buf, str, pos) {
      for (var i = 0, c, lead; i < str.length; i++) {
          c = str.charCodeAt(i); // code point

          if (c > 0xD7FF && c < 0xE000) {
              if (lead) {
                  if (c < 0xDC00) {
                      buf[pos++] = 0xEF;
                      buf[pos++] = 0xBF;
                      buf[pos++] = 0xBD;
                      lead = c;
                      continue;
                  } else {
                      c = lead - 0xD800 << 10 | c - 0xDC00 | 0x10000;
                      lead = null;
                  }
              } else {
                  if (c > 0xDBFF || (i + 1 === str.length)) {
                      buf[pos++] = 0xEF;
                      buf[pos++] = 0xBF;
                      buf[pos++] = 0xBD;
                  } else {
                      lead = c;
                  }
                  continue;
              }
          } else if (lead) {
              buf[pos++] = 0xEF;
              buf[pos++] = 0xBF;
              buf[pos++] = 0xBD;
              lead = null;
          }

          if (c < 0x80) {
              buf[pos++] = c;
          } else {
              if (c < 0x800) {
                  buf[pos++] = c >> 0x6 | 0xC0;
              } else {
                  if (c < 0x10000) {
                      buf[pos++] = c >> 0xC | 0xE0;
                  } else {
                      buf[pos++] = c >> 0x12 | 0xF0;
                      buf[pos++] = c >> 0xC & 0x3F | 0x80;
                  }
                  buf[pos++] = c >> 0x6 & 0x3F | 0x80;
              }
              buf[pos++] = c & 0x3F | 0x80;
          }
      }
      return pos;
  }

  var Pbf$1 = /*@__PURE__*/getDefaultExportFromCjs(pbf);

  //type ArcgisRestSourceSpecification = any;
  var esriPbfGeometryTypeEnum;
  (function (esriPbfGeometryTypeEnum) {
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypePoint"] = 0] = "esriGeometryTypePoint";
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypeMultipoint"] = 1] = "esriGeometryTypeMultipoint";
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypePolyline"] = 2] = "esriGeometryTypePolyline";
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypePolygon"] = 3] = "esriGeometryTypePolygon";
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypeMultipatch"] = 4] = "esriGeometryTypeMultipatch";
      esriPbfGeometryTypeEnum[esriPbfGeometryTypeEnum["esriGeometryTypeNone"] = 127] = "esriGeometryTypeNone";
  })(esriPbfGeometryTypeEnum || (esriPbfGeometryTypeEnum = {}));

  class ConvertPbf {
      constructor(pbfData) {
          this.data = pbfData;
      }
      async convert() {
          var _a;
          const pbf = new Pbf$1(this.data);
          const pbfJson = proto().read(pbf);
          // Get the FeatureResult
          if (pbfJson.queryResult === null) {
              //console.warn('issue with the result', pbfJson);
              return this._buildResponse({
                  'exceededTransferLimit': true,
              }, []);
          }
          const featureResult = pbfJson.queryResult.featureResult;
          // Get the field names
          const fields = featureResult.fields.map((field) => field.name);
          // Get the translation info
          const translation = featureResult.transform.translate;
          const scale = featureResult.transform.scale;
          const geometryType = featureResult.geometryType;
          const quantizeOriginPostion = featureResult.transform.quantizeOriginPostion;
          const srid = (_a = featureResult.spatialReference) === null || _a === void 0 ? void 0 : _a.wkid.toString();
          const features = featureResult.features.map((feature) => {
              // Parse each attribute
              let attributes = feature.attributes
                  .map((attribute, index) => ({ 'key': fields[index], 'value': attribute[attribute['value_type']] }))
                  .reduce((a, c) => {
                  const newObj = {};
                  newObj[c.key] = c.value;
                  return { ...a, ...newObj };
              }, {});
              // Parse the geometries and clean up the quantization
              let rings = [[[]]];
              if ((feature.geometry !== null)) {
                  let counts = geometryType === esriPbfGeometryTypeEnum.esriGeometryTypePoint ? [1] : (feature.geometry.lengths);
                  // Break into X and Y rings
                  let x = [];
                  let y = [];
                  feature.geometry.coords.forEach((coord, idx) => {
                      if (idx % 2 === 0) {
                          x.push(coord);
                      }
                      else {
                          y.push(coord);
                      }
                  });
                  //let x = feature.geometry.coords.filter((_: number, idx: number) => idx % 2 === 0);
                  //let y = feature.geometry.coords.filter((_: number, idx: number) => idx % 2 === 1);
                  // dezigzag the rings, and merge + reproject them
                  let ringsX = deZigZag(x, counts, scale.xScale, translation.xTranslate, false);
                  let ringsY = deZigZag(y, counts, scale.yScale, translation.yTranslate, quantizeOriginPostion === 0);
                  // Merge the rings
                  rings = mergeRings(ringsX, ringsY, srid);
                  //rings = ringsX.map((ring, i) => ring.map((x, j) => [x, ringsY[i][j]]));
              }
              let geometry = {};
              if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePoint') {
                  geometry = { 'x': rings[0][0][0], 'y': rings[0][0][1] };
              }
              else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypeMultiPoint') {
                  geometry = { 'points': rings[0] };
              }
              else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePolyline') {
                  geometry = { paths: rings };
              }
              else if (esriPbfGeometryTypeEnum[geometryType] === 'esriGeometryTypePolygon') {
                  geometry = { rings: rings };
              }
              return {
                  'geometry': geometry,
                  'attributes': attributes,
              };
          });
          return this._buildResponse(featureResult, features);
      }
      _buildResponse(featureResult, features) {
          return {
              'features': features,
              'exceededTransferLimit': featureResult.exceededTransferLimit,
              'spatialReference': { 'wkid': 4326, 'latestWkid': 4326 },
              'geometryType': esriPbfGeometryTypeEnum[featureResult.geometryType || 127].replace('Type', ''),
              'hasM': featureResult.hasM,
              'hasZ': featureResult.hasZ,
              'globalIdFieldName': featureResult.globalIdFieldName
          };
      }
  }

  class GeometriesAtZoom {
      constructor() {
          // Keeps track of the geometries that have already been loaded
          this._geometriesAtZoom = new Array(24);
          this._maxGeometryZoom = 0;
      }
      async getKeysAtZoom(zoom, maxZoom) {
          // Determine the max zoom based on the user input, the map's maxzoom, or the maxzoom we have cached
          maxZoom = maxZoom !== undefined ? maxZoom : this._maxGeometryZoom;
          const geometryGroups = [];
          for (let z = (Math.min(maxZoom, this._maxGeometryZoom)); z >= zoom; z--) {
              if (this._geometriesAtZoom[z] !== undefined) {
                  geometryGroups.push([...this._geometriesAtZoom[z].keys()]);
              }
          }
          return geometryGroups.flat();
      }
      updateKeyAtZoom(zoom, primaryKey) {
          let returnValue = 'added';
          if (this._geometriesAtZoom[zoom] === undefined)
              this._geometriesAtZoom[zoom] = new Map();
          this._maxGeometryZoom = Math.max(this._maxGeometryZoom, zoom);
          for (let z = 0; z < zoom; z++) {
              if (this._geometriesAtZoom[z] !== undefined) {
                  this._geometriesAtZoom[z].delete(primaryKey);
                  returnValue = 'updated';
              }
          }
          this._geometriesAtZoom[zoom].set(primaryKey, true);
          return returnValue;
      }
      async updateKeysAtZoom(zoom, primaryKeys) {
          return primaryKeys.map(primaryKey => this.updateKeyAtZoom(zoom, primaryKey));
      }
  }

  const libraries = {
      'ConvertPbf': ConvertPbf,
      'GeometriesAtZoom': GeometriesAtZoom,
      'DeZigZagJSON': DeZigZagJSON
  };
  let subClass;
  self.addEventListener('message', e => {
      const data = (e.data || e);
      const post = (id, err, res, type) => {
          postMessage({
              type: type ? type : (err ? 'error' : 'response'),
              id: id,
              message: res,
              error: err
          });
      };
      const commands = {
          'init': (msg) => {
              const { id, command, message } = msg;
              subClass = new libraries[command](...message);
              // return the class' methods
              const fns = [
                  ...Object.getOwnPropertyNames(libraries[command].prototype),
                  ...Object.keys(subClass)
              ].map(key => [key, typeof libraries[command].prototype[key]])
                  .reduce((a, c) => ({ ...a, ...{ [c[0]]: c[1] } }), {});
              post(id, undefined, fns, 'init_response');
          },
          'get': function (msg) {
              const { id, command } = msg;
              if (subClass && subClass[command]) {
                  post(id, undefined, subClass[command]);
              }
              else {
                  post(id, undefined, undefined);
              }
          },
          'exec': function (msg) {
              const { id, command, message } = msg;
              if (subClass && subClass[command] && typeof subClass[command] === 'function') {
                  const cmd = subClass[command]
                      .apply(subClass, message);
                  if (!!cmd && typeof cmd.then === 'function') {
                      // It's a promise, so wait for it
                      cmd
                          .then(res => post(id, undefined, res))
                          .catch(e => post(id, e));
                  }
                  else {
                      // Not a promise, just return it
                      post(id, undefined, cmd);
                  }
              }
              else {
                  // Error
                  post(id, new Error(`command "${command}" not found`));
              }
          }
      };
      if (commands[data.type]) {
          commands[data.type](data);
      }
  });

  const rnd = () => Math.random().toString(36).substring(2);
  function supportsWorkers() {
      let supported = false;
      try {
          supported = typeof (window.Worker) === 'function';
      }
      catch (e) {
          supported = false;
      }
      return supported;
  }
  function createActor(subClass, args = []) {
      if (supportsWorkers()) {
          //throw new Error('WebWorker Not Supported');
          return new Actor(subClass, args);
      }
      else {
          return new WorkerlessActor(subClass, args);
      }
  }
  class Actor {
      constructor(subClass, args = []) {
          this.initId = rnd() + '-' + subClass;
          this.worker = new WorkerFactory();
          this.handlers = new Map();
          // Listen for any messages back from the worker
          this.worker.onmessage = (event) => {
              const data = event.data;
              const handler = this.handlers.get(data.id);
              const that = this;
              if (handler) {
                  if (data.type === 'response') {
                      handler.res(data.message);
                  }
                  if (data.type === 'error') {
                      const error = data.error || new Error(`Unknown error with ${this.subClass}`);
                      handler.rej(error);
                  }
                  if (data.type === 'init_response') {
                      this._ = Object.keys(data.message)
                          .map(key => {
                          const isFn = typeof data.message[key];
                          const subFunction = function () {
                              return isFn ?
                                  that.exec(key)(...arguments) :
                                  that.get(key);
                          };
                          return [key, subFunction];
                      })
                          .reduce((a, c) => ({ ...a, ...{ [c[0]]: c[1] } }), {});
                      handler.res(this._);
                  }
              }
          };
          // Tell the worker to create the class
          this.worker.postMessage({
              type: 'init',
              id: this.initId,
              command: subClass,
              message: args
          });
      }
      onLoad() {
          return new Promise((res) => {
              (this._ === undefined) ?
                  this.handlers.set(this.initId, { 'res': res, 'rej': res }) :
                  res(this._);
          });
      }
      exec(command) {
          const that = this;
          return function (...args) {
              return new Promise((res, rej) => {
                  const id = rnd() + '-' + command;
                  that.handlers.set(id, { 'res': res, 'rej': rej });
                  // Tell the worker to run the command
                  that.worker.postMessage({
                      type: 'exec',
                      id: id,
                      command: command,
                      message: [...args]
                  });
              });
          };
      }
      get(command) {
          return new Promise((res, rej) => {
              const id = rnd() + '-' + command;
              this.handlers.set(id, { 'res': res, 'rej': rej });
              // Tell the worker to run the command
              this.worker.postMessage({
                  type: 'get',
                  id: id,
                  command: command,
                  message: []
              });
          });
      }
  }
  /** Mimic the Actor so we can use the same interface when WebWorkers are not supported */
  class WorkerlessActor {
      constructor(subClass, args = []) {
          this.subClass = new libraries[subClass](...args);
      }
      onLoad() {
          return new Promise(res => res(this));
      }
      get(command) {
          return new Promise((res) => res(this.subClass[command]));
      }
      exec(command) {
          const that = this;
          return function (...args) {
              return Promise.resolve(that.subClass[command](...args));
          };
      }
  }

  class MapFetch {
      constructor(map) {
          this._map = map;
      }
      async fetch(url, init = {}, callbackCancel) {
          let urlString = url.toString();
          // URLs over 2048 characters can't use GET, so if no method is set, switch them to POST
          // Convert the body to a query string
          // TODO if there is already a querystring, we can't just append it
          // TODO this only works with urlencoded bodies, there can be others?
          const getUrl = init.body ? (urlString.replace(/\??$/, '?') + init.body) : urlString;
          if (getUrl.length > 2048 && init.method === undefined) {
              init.method = 'POST';
          }
          // Default to GET
          init.method = ['POST', 'GET', 'PUT'].indexOf((init.method || '').toUpperCase()) > -1 ? (init.method || '').toUpperCase() : 'GET';
          if (init.method === 'GET') {
              // We can't use the body, so we need to make it into a queryString
              urlString = getUrl;
          }
          const requestParameters = {
              url: urlString,
              method: init.method
          };
          if (init.method === 'POST') {
              if (init.headers)
                  requestParameters.headers = init.headers;
              if (init.body)
                  requestParameters.body = init.body.toString();
          }
          return ({
              arrayBuffer: async () => {
                  requestParameters.type = 'arrayBuffer';
                  return this._getResource(requestParameters, callbackCancel);
              },
              json: async () => {
                  requestParameters.type = 'json';
                  return this._getResource(requestParameters, callbackCancel);
              },
              text: async () => {
                  requestParameters.type = 'string';
                  return this._getResource(requestParameters, callbackCancel);
              }
          });
      }
      async _getResource(requestParameters, callbackCancel) {
          return new Promise((res, rej) => {
              let cancelable = this._map.style.getResource(Math.random().toString(32).substring(2), requestParameters, (e, r) => {
                  if (e) {
                      rej(e.toString());
                  }
                  else {
                      res(r);
                  }
              });
              if (callbackCancel) {
                  callbackCancel({
                      'cancel': () => {
                          cancelable.cancel();
                          rej('cancel');
                      }
                  });
              }
          });
      }
  }

  const ArcGisRestSourceDefaults = {
      where: '1=1',
      outfields: '*',
      resultRecordCount: undefined,
  };
  function ArcGisRestSource(mapLibrary) {
      return class ArcGisRest extends mapLibrary['GeoJSONSource'] {
          constructor(id, originalSource, dispatcher, eventedParent) {
              super(id, { 'type': 'geojson', collectResourceTiming: false, 'data': {} }, dispatcher, eventedParent);
              this._quantizedQuery = false;
              this._requestFormat = 'json';
              this._geometriesAtZoom = createActor('GeometriesAtZoom');
              this._requests = [];
              this._sortableFields = [];
              this._events = new mapLibrary['Evented'];
              this._liveLayer = false;
              this._waitTimes = {};
              this._isUpdateable = false; // Determines if the layer can be updated
              window.layer = this;
              // Set the defaults
              this.id = id;
              this._originalSource = { ...ArcGisRestSourceDefaults, ...originalSource };
              // Clean the input URL to remove trailing query strings
              const cleanedUrl = this._originalSource.url.match(/.+?[Feature|Map]Server\/\d{1,}/);
              if (cleanedUrl) {
                  this._originalSource.url = cleanedUrl[0];
              }
              else {
                  throw new Error('ArcGisRest URL is invalid ' + this._originalSource.url);
              }
              window.source = this;
          }
          onAdd(map) {
              this.map = map;
              this._asyncLoad(map).then(() => this.load());
          }
          async _asyncLoad(map) {
              // Read the config from the server
              const url = new URL(this._originalSource.url);
              url.searchParams.append('f', 'json');
              if (this._originalSource.token) {
                  url.searchParams.append('token', this._originalSource.token);
              }
              // Use the built in fetch, and make it cancellable
              const mapFetch = new MapFetch(map);
              const esriLayerConfig = await (await mapFetch.fetch(url)).json();
              if (esriLayerConfig.error) {
                  console.error('ArcGIS Error', esriLayerConfig.error);
                  return false;
              }
              // Get some important values from this
              const maxRecordCount = esriLayerConfig.maxRecordCount || 500;
              const supportedQueryFormats = (esriLayerConfig.supportedQueryFormats || "")
                  .toLowerCase()
                  .replace(/\s/g, '')
                  .split(',');
              const supportsPbf = supportedQueryFormats.indexOf('pbf') > -1;
              this._requestFormat = supportsPbf ? 'pbf' : 'json';
              // Only quantize lines and polygons
              this._quantizedQuery = (esriLayerConfig.supportsCoordinatesQuantization === true) && (esriLayerConfig.geometryType === 'esriGeometryPolygon' ||
                  esriLayerConfig.geometryType === 'esriGeometryPolyline');
              if (esriLayerConfig.fields) {
                  this._sortableFields = (esriLayerConfig.fields)
                      .filter(field => ([
                      'esriFieldTypeString', 'esriFieldTypeDouble', 'esriFieldTypeDate', 'esriFieldTypeGUID',
                      'esriFieldTypeGlobalID', 'esriFieldTypeInteger', 'esriFieldTypeOID', 'esriFieldTypeSingle',
                      'esriFieldTypeSmallInteger'
                  ].indexOf(field.type) > -1) &&
                      field.name.indexOf('()') === -1 &&
                      (field.alias || '').indexOf('()') === -1)
                      .map(field => field.name);
              }
              if (esriLayerConfig.indexes) {
                  this.promoteId = esriLayerConfig.indexes
                      .filter((index) => (index.isUnique === true) &&
                      index.fields &&
                      this._sortableFields.indexOf(index.fields) > -1)
                      .map((index) => index['fields'])[0];
              }
              if (esriLayerConfig.fields) {
                  this._primaryKeyType = esriLayerConfig.fields
                      .filter((f) => f.name === this.promoteId)
                      .map((f) => [
                      'esriFieldTypeDouble', 'esriFieldTypeDate', 'esriFieldTypeGUID',
                      'esriFieldTypeGlobalID', 'esriFieldTypeInteger', 'esriFieldTypeOID', 'esriFieldTypeSingle',
                      'esriFieldTypeSmallInteger'
                  ].indexOf(f.type) > -1 ? 'number' : 'string')[0];
              }
              // Set the record count to the smaller of the two values (either the server max record count, or the defined one)
              this._originalSource.resultRecordCount = (this._originalSource.resultRecordCount || Infinity) < maxRecordCount ? this._originalSource.resultRecordCount : maxRecordCount;
              // Start with blank data
              this.setData({
                  "type": "FeatureCollection",
                  "features": []
              });
              this._events.on('data', (esriData) => this.drawMapData(esriData.json, esriData.zoom));
              this.loadMapData(map);
              // Don't load the map if we're not trying to request one (liveLayer)
              map.on('moveend', () => this._liveLayer && this._waitEvent('redrawMap', 100));
              this._events.on('redrawMap', () => this.loadMapData(map));
          }
          ;
          loadTile(tile, callback) {
              if (!this._liveLayer) {
                  this._liveLayer = true; // This makes sure we're only loading the layer if its tiles are requested
                  this._waitEvent('redrawMap', 1000);
              }
              super.loadTile(tile, callback);
          }
          async loadMapData(map, bounds) {
              map = map === undefined ? this.map : map;
              if (map === undefined)
                  throw new Error('Source Data (Source ID: ' + this.id + ') could not be loaded');
              console.log('LOADING');
              // Don't load the map if we're not trying to request one (liveLayer)
              //if (!this._liveLayer) return;
              // Get list of all geometries at this or a higher zoom, if it doesn't support quantization, set to max zoom
              const displayZoom = this._quantizedQuery ? Math.floor(this.map.getZoom()) : this.map.getMaxZoom();
              // Create the ArcGIS Request
              let where = this._originalSource.where;
              // Build the request object
              const request = {
                  where
              };
              // If there is a primary key, make sure we don't download it again
              if (this.promoteId) {
                  bounds = bounds || [map.getBounds().getWest(), map.getBounds().getSouth(), map.getBounds().getEast(), map.getBounds().getNorth()];
                  const projectedSouthWest = fromWGS84(bounds[0], bounds[1]);
                  const projectedNorthEast = fromWGS84(bounds[2], bounds[3]);
                  const projectedBounds = [projectedSouthWest.x, projectedSouthWest.y, projectedNorthEast.x, projectedNorthEast.y];
                  const alreadyLoadedKeys = await this._geometriesAtZoom.exec('getKeysAtZoom')(displayZoom);
                  request.geometry = projectedBounds.join(',');
                  request.geometryType = 'esriGeometryEnvelope';
                  request.inSR = '3857';
                  const wrap = (v) => this._primaryKeyType === 'string' ? `'${v}'` : v;
                  if (alreadyLoadedKeys.length) {
                      request.where = `(${where}) AND "${this.promoteId}" NOT IN (${alreadyLoadedKeys.map(k => wrap(k)).join(',')})`;
                  }
              }
              // Cancel all over requests
              this._requests.forEach(fn => fn.cancel());
              //const newEsriJson = await 
              this._queryFeatures(this._originalSource.url, request, 0, (cancel) => this._requests.push(cancel), map, displayZoom);
              this._liveLayer = false; // We won't draw the layer again until another tile it requested
          }
          async drawMapData(newEsriJson, displayZoom) {
              // Convert to GeoJSON Features
              const newFeatures = this._esriJsonToFeatures(newEsriJson);
              // Run the diff
              const ids = newFeatures.map(feature => feature.properties[this.promoteId]);
              const updatedIds = await (this._geometriesAtZoom.exec('updateKeysAtZoom')(displayZoom, ids));
              const dataDiff = {
                  add: updatedIds.map((updatedId, idx) => {
                      if (updatedId === 'added') {
                          return newFeatures[idx];
                      }
                  }).filter(idx => idx !== undefined),
                  update: updatedIds.map((updatedId, idx) => {
                      if (updatedId === 'updated') {
                          const newGeometry = newFeatures[idx].geometry;
                          return {
                              id: ids[idx],
                              newGeometry
                          };
                      }
                  }).filter(idx => idx !== undefined),
                  removeAll: false,
                  remove: []
              };
              if (dataDiff.update.length || dataDiff.add.length) {
                  if (this.updateData && this._isUpdateable) {
                      // Maplibre version 3!
                      //https://github.com/maplibre/maplibre-gl-js/commit/6a33333e2ca444abb28382e61d84c01169d7f325
                      //console.log('USING UPDATE', dataDiff, this.promoteId);
                      this.updateData(dataDiff);
                  }
                  else {
                      // Update the _data in place
                      console.log('this._data', this._data);
                      const currentFeatures = this._data.features;
                      const currentFeaturesIds = currentFeatures.map(feature => feature.properties[this.promoteId]);
                      // these functions were tested on on jsbench.me, and for loops are the fastest
                      for (let i = 0; i < dataDiff.update.length; i++) {
                          let featureIdx = currentFeaturesIds.indexOf(dataDiff.update[i].id);
                          if (featureIdx > -1) {
                              currentFeatures[featureIdx].geometry = dataDiff.update[i].newGeometry || currentFeatures[featureIdx].geometry;
                          }
                      }
                      for (let i = 0; i < dataDiff.add.length; i++) {
                          const record = dataDiff.add[i];
                          if (record.properties)
                              record.id = record.id || record.properties[this.promoteId];
                          currentFeatures.push(record);
                      }
                      if (this._data) {
                          this.setData(this._data);
                          //this._isUpdateable = true; // TODO test with updateData in maplibre-gl-js
                      }
                  }
              }
          }
          /**
           * Responsible for invoking WorkerSource's geojson.loadData target, which
           * handles loading the geojson data and preparing to serve it up as tiles,
           * using geojson-vt or supercluster as appropriate.
           * @param diff - the diff object
           */
          _updateWorkerData(diff) {
              console.log('UPDATING!!', diff);
              super._updateWorkerData(diff);
          }
          async _queryFeatures(url, options, offset, cancel, map, zoom) {
              map = map === undefined ? this.map : map;
              if (map === undefined)
                  throw new Error('Source Data (Source ID: ' + this.id + ') could not be loaded');
              // Convert the out field array to a string
              const outFieldsString = Array.isArray(this._originalSource.outfields) ?
                  this._originalSource.outfields.map(f => `"${f}"`).join(',') :
                  '*';
              const quantizationSting = this._quantizedQuery ?
                  JSON.stringify(quantizationParameters(zoom, this.tileSize)) :
                  '';
              // Define the full query parameters
              const queryParams = {
                  'where': this._originalSource.where,
                  'spatialRel': 'esriSpatialRelIntersects',
                  'outFields': outFieldsString,
                  'returnGeometry': true,
                  'returnTrueCurves': false,
                  // If the data is quantized, quantize it to 3857, otherwise just use 4326
                  // the PBF format is always quantized (even if the coordinates quantization isn't supported)
                  'outSR': (this._quantizedQuery || this._requestFormat === 'pbf') ? '3857' : '4326',
                  'returnIdsOnly': false,
                  'returnCountOnly': false,
                  'returnZ': false,
                  'returnM': false,
                  'returnDistinctValues': false,
                  'returnExtentOnly': false,
                  'featureEncoding': 'esriDefault',
                  'orderByFields': this._sortableFields.map(v => `"${v}"`).join(','),
                  'resultOffset': offset !== undefined ? offset : 0,
                  'resultRecordCount': this._originalSource.resultRecordCount,
                  'quantizationParameters': quantizationSting,
                  //'token': this.token, // TODO
                  'f': this._requestFormat,
                  ...options
              };
              const mapFetch = new MapFetch(map);
              const tmpUrl = new URL(url);
              Object.keys(queryParams)
                  .map(key => tmpUrl.searchParams.append(key, queryParams[key].toString()));
              const dataPromise = mapFetch.fetch(url + '/query', {
                  'body': tmpUrl.search.replace(/^\?/, ''),
                  //'method': 'POST', // Automatically decide based on URL length (GETs have better caching)
                  'headers': {
                      'content-type': 'application/x-www-form-urlencoded'
                  },
              }, (cancelFunction) => cancel && cancel(cancelFunction));
              const arcgisRequest = await (await dataPromise);
              let data = { 'features': [], 'exceededTransferLimit': false };
              try {
                  if (queryParams.f === 'pbf') {
                      const pbfData = await arcgisRequest.arrayBuffer();
                      const convertPbfWorker = createActor('ConvertPbf', [pbfData]);
                      //const convertPbf = new ConvertPbf(pbfData);
                      data = await convertPbfWorker.exec('convert')();
                  }
                  else {
                      data = await arcgisRequest.json();
                      if (this._quantizedQuery) {
                          // Dezigzag simplified data
                          const dezigzagWorker = createActor('DeZigZagJSON', [
                              data.features,
                              data.transform,
                              data.geometryType
                          ]);
                          const features = await dezigzagWorker.exec('convert')();
                          data.spatialReference = { 'wkid': 4326 };
                          data.features = features;
                      }
                  }
              }
              catch (e) {
                  // There was an error with the request, it was probably cancelled
                  if (e !== 'cancel') {
                      console.error('Error with request', e);
                  }
                  return;
              }
              // Update the data
              if (data && data.features.length) {
                  this._events.fire('data', {
                      'json': data,
                      'zoom': zoom
                  });
              }
              if (data.exceededTransferLimit === true) {
                  this._queryFeatures(url, options, (offset || 0) + data.features.length, cancel, map, zoom);
              }
          }
          _esriJsonToFeatures(esriJson) {
              const supportedGeometryTypes = {
                  'esriGeometryPoint': 'Point',
                  'esriGeometryMultipoint': 'MultiPoint',
                  'esriGeometryLine': 'LineString',
                  'esriGeometryPolyline': 'MultiLineString',
                  'esriGeometryPolygon': 'MultiPolygon'
              };
              if (Object.keys(supportedGeometryTypes).indexOf(esriJson.geometryType) === -1) {
                  throw new Error('Geometry ' + esriJson.geometryType + ' not supported');
              }
              // Convert Features
              const features = esriJson.features.map(feature => {
                  // TODO reproject? data should already be 4326 by this point
                  if ((esriJson.spatialReference.latestWkid || esriJson.spatialReference.wkid) !== 4326) {
                      console.warn('Unspported Projection (' + (esriJson.spatialReference.latestWkid || esriJson.spatialReference.wkid) + '), some data may not display correctly');
                  }
                  return {
                      'type': 'Feature',
                      'properties': feature.attributes,
                      'geometry': arcgisToGeoJSON(feature.geometry)
                  };
              });
              return features;
          }
          _waitEvent(name, waitTime = 100) {
              // Uses listeners as a debouncer
              console.log('Called', name, waitTime);
              this._waitTimes[name] = (this._waitTimes[name] || 0) + waitTime;
              setTimeout(() => {
                  if (this._waitTimes[name] !== undefined) {
                      this._waitTimes[name] = this._waitTimes[name] - waitTime;
                      if (this._waitTimes[name] <= 0) {
                          this._waitTimes[name] = 0; // Reset the time to 0
                          this._events.fire(name);
                      }
                  }
              }, waitTime);
          }
      };
  }

  return ArcGisRestSource;

}));
