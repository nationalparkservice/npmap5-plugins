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

  var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwp2YXIgd29ya2VyX2NvZGUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHsKICAndXNlIHN0cmljdCc7CgogIGNvbnN0IGVhcnRoQ2lyY3VtZmVyZW5jZSA9IDQwMDc1MDE2LjY4NTU3ODQ5Ow0KICAvKioNCiAgICAqIENvbnZlcnRzIGEgd2VibWVyY2F0b3IgeCx5IHRvIFdHUzg0IGxuZyxsYXQNCiAgICAqIEBwYXJhbSB4DQogICAgKiBAcGFyYW0geQ0KICAgICogQHJldHVybnMgTG5nTG5nTGlrZQ0KICAgICovDQogIGZ1bmN0aW9uIHRvV0dTODQoeCwgeSkgew0KICAgICAgLy8gQ29udmVydCB0aGUgbGF0IGxuZw0KICAgICAgY29uc3Qgd2dzTG5nID0geCAqIDE4MCAvIChlYXJ0aENpcmN1bWZlcmVuY2UgLyAyKTsNCiAgICAgIC8vIHRoYW5rcyBtYWdpY2hpbSBAIGdpdGh1YiBmb3IgdGhlIGNvcnJlY3Rpb24NCiAgICAgIGNvbnN0IHdnc0xhdCA9IE1hdGguYXRhbihNYXRoLmV4cCh5ICogTWF0aC5QSSAvIChlYXJ0aENpcmN1bWZlcmVuY2UgLyAyKSkpICogMzYwIC8gTWF0aC5QSSAtIDkwOw0KICAgICAgcmV0dXJuIHsgbG5nOiB3Z3NMbmcsIGxhdDogd2dzTGF0IH07DQogIH0KCiAgY29uc3Qgd2ViTWVyY2F0b3JDb2RlcyA9IFsnMTAyMTAwJywgJzkwMDkxMycsICczODU3JywgJzM1ODcnLCAnNTQwMDQnLCAnNDEwMDEnLCAnMTAyMTEzJywgJzM3ODUnXTsNCiAgZnVuY3Rpb24gbWVyZ2VSaW5ncyhyaW5nc1gsIHJpbmdzWSwgc3JpZCkgew0KICAgICAgY29uc3QgcmVwcm9qZWN0ID0gKHgsIHkpID0+IHsNCiAgICAgICAgICBjb25zdCB4eSA9IHRvV0dTODQoeCwgeSk7DQogICAgICAgICAgcmV0dXJuIFt4eS5sbmcsIHh5LmxhdF07DQogICAgICB9Ow0KICAgICAgaWYgKHdlYk1lcmNhdG9yQ29kZXMuaW5kZXhPZihzcmlkKSA+IC0xKSB7DQogICAgICAgICAgcmV0dXJuIHJpbmdzWC5tYXAoKHJpbmcsIGkpID0+IHJpbmcubWFwKCh4LCBqKSA9PiByZXByb2plY3QoeCwgcmluZ3NZW2ldW2pdKSkpOw0KICAgICAgfQ0KICAgICAgZWxzZSB7DQogICAgICAgICAgcmV0dXJuIHJpbmdzWC5tYXAoKHJpbmcsIGkpID0+IHJpbmcubWFwKCh4LCBqKSA9PiBbeCwgcmluZ3NZW2ldW2pdXSkpOw0KICAgICAgfQ0KICB9DQogIGZ1bmN0aW9uIGRlWmlnWmFnKHZhbHVlcywgc3BsaXRzLCBzY2FsZSwgaW5pdGlhbE9mZnNldCwgdXBwZXJMZWZ0T3JpZ2luKSB7DQogICAgICByZXR1cm4gc3BsaXRzLm1hcCgoc3BsaXQsIGkpID0+IHsNCiAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gMDsNCiAgICAgICAgICByZXR1cm4gQXJyYXkoc3BsaXQpLmZpbGwodW5kZWZpbmVkKS5tYXAoKF8sIGopID0+IHsNCiAgICAgICAgICAgICAgY29uc3QgdmFsdWVPZmZzZXQgPSBzcGxpdHMucmVkdWNlKChhLCB2LCBpZHgpID0+IGEgKz0gKGlkeCA8IGkgPyB2IDogMCksIDApOw0KICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1t2YWx1ZU9mZnNldCArIGpdOw0KICAgICAgICAgICAgICBjb25zdCBzaWduID0gdXBwZXJMZWZ0T3JpZ2luID8gLTEgOiAxOw0KICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU7DQogICAgICAgICAgICAgIGlmIChqID09PSAwKSB7DQogICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9ICh2YWx1ZSAqIHNpZ24pICsgKGluaXRpYWxPZmZzZXQgLyBzY2FsZSk7DQogICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgZWxzZSB7DQogICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9ICh2YWx1ZSAqIHNpZ24pICsgbGFzdFZhbHVlOw0KICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHJldHVyblZhbHVlOw0KICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7DQogICAgICAgICAgfSkubWFwKCh2KSA9PiB2ICogc2NhbGUpOw0KICAgICAgfSk7DQogIH0NCiAgY2xhc3MgRGVaaWdaYWdKU09OIHsNCiAgICAgIGNvbnN0cnVjdG9yKGZlYXR1cmVzLCB0cmFuc2Zvcm0sIGdlb21ldHJ5VHlwZSkgew0KICAgICAgICAgIHRoaXMuc3JpZCA9ICczODU3JzsNCiAgICAgICAgICB0aGlzLmZlYXR1cmVzID0gZmVhdHVyZXM7DQogICAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07DQogICAgICAgICAgdGhpcy5nZW9tZXRyeVR5cGUgPSBnZW9tZXRyeVR5cGU7DQogICAgICB9DQogICAgICBhc3luYyBjb252ZXJ0KCkgew0KICAgICAgICAgIHJldHVybiB0aGlzLmZlYXR1cmVzLm1hcChmZWF0dXJlID0+IHsNCiAgICAgICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeSA9IHRoaXMuY29udmVydEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cnkpOw0KICAgICAgICAgICAgICByZXR1cm4gZmVhdHVyZTsNCiAgICAgICAgICB9KTsNCiAgICAgIH0NCiAgICAgIGNvbnZlcnRHZW9tZXRyeShnZW9tZXRyeSkgew0KICAgICAgICAgIGNvbnN0IGNvdW50cyA9IFtdOw0KICAgICAgICAgIGNvbnN0IHggPSBbXTsNCiAgICAgICAgICBjb25zdCB5ID0gW107DQogICAgICAgICAgaWYgKHRoaXMuZ2VvbWV0cnlUeXBlID09PSAnZXNyaUdlb21ldHJ5UG9pbnQnKSB7DQogICAgICAgICAgICAgIGNvdW50cy5wdXNoKDEpOw0KICAgICAgICAgICAgICB4LnB1c2goZ2VvbWV0cnkueCk7DQogICAgICAgICAgICAgIHkucHVzaChnZW9tZXRyeS55KTsNCiAgICAgICAgICB9DQogICAgICAgICAgZWxzZSBpZiAodGhpcy5nZW9tZXRyeVR5cGUgPT09ICdlc3JpR2VvbWV0cnlNdWx0aXBvaW50Jykgew0KICAgICAgICAgICAgICBnZW9tZXRyeS5wb2ludHMuZm9yRWFjaChwID0+IHsNCiAgICAgICAgICAgICAgICAgIGNvdW50cy5wdXNoKDEpOw0KICAgICAgICAgICAgICAgICAgeC5wdXNoKHBbMF0pOw0KICAgICAgICAgICAgICAgICAgeS5wdXNoKHBbMV0pOw0KICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICB9DQogICAgICAgICAgZWxzZSBpZiAodGhpcy5nZW9tZXRyeVR5cGUgPT09ICdlc3JpR2VvbWV0cnlQb2x5bGluZScpIHsNCiAgICAgICAgICAgICAgZ2VvbWV0cnkucGF0aHMuZm9yRWFjaChsID0+IHsNCiAgICAgICAgICAgICAgICAgIGNvdW50cy5wdXNoKGwubGVuZ3RoKTsNCiAgICAgICAgICAgICAgICAgIGwuZm9yRWFjaChwb3NpdGlvbiA9PiB7DQogICAgICAgICAgICAgICAgICAgICAgeC5wdXNoKHBvc2l0aW9uWzBdKTsNCiAgICAgICAgICAgICAgICAgICAgICB5LnB1c2gocG9zaXRpb25bMV0pOw0KICAgICAgICAgICAgICAgICAgfSk7DQogICAgICAgICAgICAgIH0pOw0KICAgICAgICAgIH0NCiAgICAgICAgICBlbHNlIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeVBvbHlnb24nKSB7DQogICAgICAgICAgICAgIGdlb21ldHJ5LnJpbmdzLmZvckVhY2gocG9seSA9PiB7DQogICAgICAgICAgICAgICAgICBjb3VudHMucHVzaChwb2x5Lmxlbmd0aCk7DQogICAgICAgICAgICAgICAgICBwb2x5LmZvckVhY2gocG9zaXRpb24gPT4gew0KICAgICAgICAgICAgICAgICAgICAgIHgucHVzaChwb3NpdGlvblswXSk7DQogICAgICAgICAgICAgICAgICAgICAgeS5wdXNoKHBvc2l0aW9uWzFdKTsNCiAgICAgICAgICAgICAgICAgIH0pOw0KICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICB9DQogICAgICAgICAgLy8gZGV6aWd6YWcgdGhlIHJpbmdzLCBhbmQgbWVyZ2UgKyByZXByb2plY3QgdGhlbQ0KICAgICAgICAgIGNvbnN0IHJpbmdzWCA9IGRlWmlnWmFnKHgsIGNvdW50cywgdGhpcy50cmFuc2Zvcm0uc2NhbGVbMF0sIHRoaXMudHJhbnNmb3JtLnRyYW5zbGF0ZVswXSwgZmFsc2UpOw0KICAgICAgICAgIGNvbnN0IHJpbmdzWSA9IGRlWmlnWmFnKHksIGNvdW50cywgdGhpcy50cmFuc2Zvcm0uc2NhbGVbMV0sIHRoaXMudHJhbnNmb3JtLnRyYW5zbGF0ZVsxXSwgdGhpcy50cmFuc2Zvcm0ub3JpZ2luUG9zaXRpb24gPT09ICd1cHBlckxlZnQnKTsNCiAgICAgICAgICAvLyBNZXJnZSB0aGUgcmluZ3MNCiAgICAgICAgICBjb25zdCByaW5ncyA9IG1lcmdlUmluZ3MocmluZ3NYLCByaW5nc1ksIHRoaXMuc3JpZCk7DQogICAgICAgICAgbGV0IG5ld0dlb21ldHJ5ID0ge307DQogICAgICAgICAgaWYgKHRoaXMuZ2VvbWV0cnlUeXBlID09PSAnZXNyaUdlb21ldHJ5UG9pbnQnKSB7DQogICAgICAgICAgICAgIG5ld0dlb21ldHJ5ID0geyAneCc6IHJpbmdzWzBdWzBdWzBdLCAneSc6IHJpbmdzWzBdWzBdWzFdIH07DQogICAgICAgICAgfQ0KICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZ2VvbWV0cnlUeXBlID09PSAnZXNyaUdlb21ldHJ5TXVsdGlwb2ludCcpIHsNCiAgICAgICAgICAgICAgbmV3R2VvbWV0cnkgPSB7ICdwb2ludHMnOiByaW5nc1swXSB9Ow0KICAgICAgICAgIH0NCiAgICAgICAgICBlbHNlIGlmICh0aGlzLmdlb21ldHJ5VHlwZSA9PT0gJ2VzcmlHZW9tZXRyeVBvbHlsaW5lJykgew0KICAgICAgICAgICAgICBuZXdHZW9tZXRyeSA9IHsgcGF0aHM6IHJpbmdzIH07DQogICAgICAgICAgfQ0KICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZ2VvbWV0cnlUeXBlID09PSAnZXNyaUdlb21ldHJ5UG9seWdvbicpIHsNCiAgICAgICAgICAgICAgbmV3R2VvbWV0cnkgPSB7IHJpbmdzOiByaW5ncyB9Ow0KICAgICAgICAgIH0NCiAgICAgICAgICByZXR1cm4gbmV3R2VvbWV0cnk7DQogICAgICB9DQogIH0KCiAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiAgZnVuY3Rpb24gcHJvdG8gKCkgew0KICAgICAgbGV0IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlciA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLl9yZWFkRmllbGQsIHsgdmVyc2lvbjogIiIsIHF1ZXJ5UmVzdWx0OiBudWxsIH0sIGVuZCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai52ZXJzaW9uID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpDQogICAgICAgICAgICAgIG9iai5xdWVyeVJlc3VsdCA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdC5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgew0KICAgICAgICAgIGlmIChvYmoudmVyc2lvbikNCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoMSwgb2JqLnZlcnNpb24pOw0KICAgICAgICAgIGlmIChvYmoucXVlcnlSZXN1bHQpDQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMiwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0LndyaXRlLCBvYmoucXVlcnlSZXN1bHQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVR5cGUgPSB7DQogICAgICAgICAgImVzcmlHZW9tZXRyeVR5cGVQb2ludCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMCwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImVzcmlHZW9tZXRyeVR5cGVNdWx0aXBvaW50Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUdlb21ldHJ5VHlwZVBvbHlsaW5lIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAyLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUdlb21ldHJ5VHlwZVBvbHlnb24iOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDMsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJlc3JpR2VvbWV0cnlUeXBlTXVsdGlwYXRjaCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogNCwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImVzcmlHZW9tZXRyeVR5cGVOb25lIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxMjcsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkVHlwZSA9IHsNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZVNtYWxsSW50ZWdlciI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMCwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImVzcmlGaWVsZFR5cGVJbnRlZ2VyIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZVNpbmdsZSI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMiwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImVzcmlGaWVsZFR5cGVEb3VibGUiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDMsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJlc3JpRmllbGRUeXBlU3RyaW5nIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiA0LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZURhdGUiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDUsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJlc3JpRmllbGRUeXBlT0lEIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiA2LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUdlb21ldHJ5Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiA3LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUJsb2IiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDgsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJlc3JpRmllbGRUeXBlUmFzdGVyIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiA5LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUdVSUQiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDEwLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAiZXNyaUZpZWxkVHlwZUdsb2JhbElEIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxMSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImVzcmlGaWVsZFR5cGVYTUwiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDEyLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfQ0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TUUxUeXBlID0gew0KICAgICAgICAgICJzcWxUeXBlQmlnSW50Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiAwLA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZUJpbmFyeSI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVCaXQiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDIsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlQ2hhciI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMywNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVEYXRlIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiA0LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZURlY2ltYWwiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDUsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlRG91YmxlIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiA2LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZUZsb2F0Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiA3LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZUdlb21ldHJ5Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiA4LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZUdVSUQiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDksDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlSW50ZWdlciI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMTAsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlTG9uZ05WYXJjaGFyIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxMSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVMb25nVmFyYmluYXJ5Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxMiwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVMb25nVmFyY2hhciI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMTMsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlTkNoYXIiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDE0LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZU5WYXJjaGFyIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAxNSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVPdGhlciI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMTYsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlUmVhbCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMTcsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlU21hbGxJbnQiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDE4LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZVNxbFhtbCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMTksDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlVGltZSI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMjAsDQogICAgICAgICAgICAgICJvcHRpb25zIjoge30NCiAgICAgICAgICB9LA0KICAgICAgICAgICJzcWxUeXBlVGltZXN0YW1wIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAyMSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVUaW1lc3RhbXAyIjogew0KICAgICAgICAgICAgICAidmFsdWUiOiAyMiwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVUaW55SW50Ijogew0KICAgICAgICAgICAgICAidmFsdWUiOiAyMywNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgInNxbFR5cGVWYXJiaW5hcnkiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDI0LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfSwNCiAgICAgICAgICAic3FsVHlwZVZhcmNoYXIiOiB7DQogICAgICAgICAgICAgICJ2YWx1ZSI6IDI1LA0KICAgICAgICAgICAgICAib3B0aW9ucyI6IHt9DQogICAgICAgICAgfQ0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWFudGl6ZU9yaWdpblBvc3Rpb24gPSB7DQogICAgICAgICAgInVwcGVyTGVmdCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMCwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0sDQogICAgICAgICAgImxvd2VyTGVmdCI6IHsNCiAgICAgICAgICAgICAgInZhbHVlIjogMSwNCiAgICAgICAgICAgICAgIm9wdGlvbnMiOiB7fQ0KICAgICAgICAgIH0NCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZSA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZS5fcmVhZEZpZWxkLCB7IHdraWQ6IDAsIGxhc3Rlc3RXa2lkOiAwLCB2Y3NXa2lkOiAwLCBsYXRlc3RWY3NXa2lkOiAwLCB3a3Q6ICIiIH0sIGVuZCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKHRhZyA9PT0gMSkNCiAgICAgICAgICAgICAgb2JqLndraWQgPSBwYmYucmVhZFZhcmludCgpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLmxhc3Rlc3RXa2lkID0gcGJmLnJlYWRWYXJpbnQoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai52Y3NXa2lkID0gcGJmLnJlYWRWYXJpbnQoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpDQogICAgICAgICAgICAgIG9iai5sYXRlc3RWY3NXa2lkID0gcGJmLnJlYWRWYXJpbnQoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDUpDQogICAgICAgICAgICAgIG9iai53a3QgPSBwYmYucmVhZFN0cmluZygpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TcGF0aWFsUmVmZXJlbmNlLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai53a2lkKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgxLCBvYmoud2tpZCk7DQogICAgICAgICAgaWYgKG9iai5sYXN0ZXN0V2tpZCkNCiAgICAgICAgICAgICAgcGJmLndyaXRlVmFyaW50RmllbGQoMiwgb2JqLmxhc3Rlc3RXa2lkKTsNCiAgICAgICAgICBpZiAob2JqLnZjc1draWQpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDMsIG9iai52Y3NXa2lkKTsNCiAgICAgICAgICBpZiAob2JqLmxhdGVzdFZjc1draWQpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDQsIG9iai5sYXRlc3RWY3NXa2lkKTsNCiAgICAgICAgICBpZiAob2JqLndrdCkNCiAgICAgICAgICAgICAgcGJmLndyaXRlU3RyaW5nRmllbGQoNSwgb2JqLndrdCk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GaWVsZCA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLl9yZWFkRmllbGQsIHsgbmFtZTogIiIsIGZpZWxkVHlwZTogMCwgYWxpYXM6ICIiLCBzcWxUeXBlOiAwLCBkb21haW46ICIiLCBkZWZhdWx0VmFsdWU6ICIiIH0sIGVuZCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai5uYW1lID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpDQogICAgICAgICAgICAgIG9iai5maWVsZFR5cGUgPSBwYmYucmVhZFZhcmludCgpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMykNCiAgICAgICAgICAgICAgb2JqLmFsaWFzID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpDQogICAgICAgICAgICAgIG9iai5zcWxUeXBlID0gcGJmLnJlYWRWYXJpbnQoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDUpDQogICAgICAgICAgICAgIG9iai5kb21haW4gPSBwYmYucmVhZFN0cmluZygpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNikNCiAgICAgICAgICAgICAgb2JqLmRlZmF1bHRWYWx1ZSA9IHBiZi5yZWFkU3RyaW5nKCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai5uYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmoubmFtZSk7DQogICAgICAgICAgaWYgKG9iai5maWVsZFR5cGUpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDIsIG9iai5maWVsZFR5cGUpOw0KICAgICAgICAgIGlmIChvYmouYWxpYXMpDQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDMsIG9iai5hbGlhcyk7DQogICAgICAgICAgaWYgKG9iai5zcWxUeXBlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCg0LCBvYmouc3FsVHlwZSk7DQogICAgICAgICAgaWYgKG9iai5kb21haW4pDQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDUsIG9iai5kb21haW4pOw0KICAgICAgICAgIGlmIChvYmouZGVmYXVsdFZhbHVlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCg2LCBvYmouZGVmYXVsdFZhbHVlKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlZhbHVlID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUuX3JlYWRGaWVsZCwgeyBzdHJpbmdfdmFsdWU6ICIiLCB2YWx1ZV90eXBlOiBudWxsLCBmbG9hdF92YWx1ZTogMCwgZG91YmxlX3ZhbHVlOiAwLCBzaW50X3ZhbHVlOiAwLCB1aW50X3ZhbHVlOiAwLCBpbnQ2NF92YWx1ZTogMCwgdWludDY0X3ZhbHVlOiAwLCBzaW50NjRfdmFsdWU6IDAsIGJvb2xfdmFsdWU6IGZhbHNlIH0sIGVuZCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlZhbHVlLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai5zdHJpbmdfdmFsdWUgPSBwYmYucmVhZFN0cmluZygpLCBvYmoudmFsdWVfdHlwZSA9ICJzdHJpbmdfdmFsdWUiOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLmZsb2F0X3ZhbHVlID0gcGJmLnJlYWRGbG9hdCgpLCBvYmoudmFsdWVfdHlwZSA9ICJmbG9hdF92YWx1ZSI7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQ0KICAgICAgICAgICAgICBvYmouZG91YmxlX3ZhbHVlID0gcGJmLnJlYWREb3VibGUoKSwgb2JqLnZhbHVlX3R5cGUgPSAiZG91YmxlX3ZhbHVlIjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpDQogICAgICAgICAgICAgIG9iai5zaW50X3ZhbHVlID0gcGJmLnJlYWRTVmFyaW50KCksIG9iai52YWx1ZV90eXBlID0gInNpbnRfdmFsdWUiOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNSkNCiAgICAgICAgICAgICAgb2JqLnVpbnRfdmFsdWUgPSBwYmYucmVhZFZhcmludCgpLCBvYmoudmFsdWVfdHlwZSA9ICJ1aW50X3ZhbHVlIjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDYpDQogICAgICAgICAgICAgIG9iai5pbnQ2NF92YWx1ZSA9IHBiZi5yZWFkVmFyaW50KHRydWUpLCBvYmoudmFsdWVfdHlwZSA9ICJpbnQ2NF92YWx1ZSI7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA3KQ0KICAgICAgICAgICAgICBvYmoudWludDY0X3ZhbHVlID0gcGJmLnJlYWRWYXJpbnQoKSwgb2JqLnZhbHVlX3R5cGUgPSAidWludDY0X3ZhbHVlIjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDgpDQogICAgICAgICAgICAgIG9iai5zaW50NjRfdmFsdWUgPSBwYmYucmVhZFNWYXJpbnQoKSwgb2JqLnZhbHVlX3R5cGUgPSAic2ludDY0X3ZhbHVlIjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDkpDQogICAgICAgICAgICAgIG9iai5ib29sX3ZhbHVlID0gcGJmLnJlYWRCb29sZWFuKCksIG9iai52YWx1ZV90eXBlID0gImJvb2xfdmFsdWUiOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZS53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgew0KICAgICAgICAgIGlmIChvYmouc3RyaW5nX3ZhbHVlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmouc3RyaW5nX3ZhbHVlKTsNCiAgICAgICAgICBpZiAob2JqLmZsb2F0X3ZhbHVlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVGbG9hdEZpZWxkKDIsIG9iai5mbG9hdF92YWx1ZSk7DQogICAgICAgICAgaWYgKG9iai5kb3VibGVfdmFsdWUpDQogICAgICAgICAgICAgIHBiZi53cml0ZURvdWJsZUZpZWxkKDMsIG9iai5kb3VibGVfdmFsdWUpOw0KICAgICAgICAgIGlmIChvYmouc2ludF92YWx1ZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlU1ZhcmludEZpZWxkKDQsIG9iai5zaW50X3ZhbHVlKTsNCiAgICAgICAgICBpZiAob2JqLnVpbnRfdmFsdWUpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDUsIG9iai51aW50X3ZhbHVlKTsNCiAgICAgICAgICBpZiAob2JqLmludDY0X3ZhbHVlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCg2LCBvYmouaW50NjRfdmFsdWUpOw0KICAgICAgICAgIGlmIChvYmoudWludDY0X3ZhbHVlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCg3LCBvYmoudWludDY0X3ZhbHVlKTsNCiAgICAgICAgICBpZiAob2JqLnNpbnQ2NF92YWx1ZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlU1ZhcmludEZpZWxkKDgsIG9iai5zaW50NjRfdmFsdWUpOw0KICAgICAgICAgIGlmIChvYmouYm9vbF92YWx1ZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlQm9vbGVhbkZpZWxkKDksIG9iai5ib29sX3ZhbHVlKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnkgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5ID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnkucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnkuX3JlYWRGaWVsZCwgeyBsZW5ndGhzOiBbXSwgY29vcmRzOiBbXSB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeS5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAodGFnID09PSAyKQ0KICAgICAgICAgICAgICBwYmYucmVhZFBhY2tlZFZhcmludChvYmoubGVuZ3Rocyk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAzKQ0KICAgICAgICAgICAgICBwYmYucmVhZFBhY2tlZFNWYXJpbnQob2JqLmNvb3Jkcyk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai5sZW5ndGhzKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVQYWNrZWRWYXJpbnQoMiwgb2JqLmxlbmd0aHMpOw0KICAgICAgICAgIGlmIChvYmouY29vcmRzKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVQYWNrZWRTVmFyaW50KDMsIG9iai5jb29yZHMpOw0KICAgICAgfTsNCiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLmVzcmlTaGFwZUJ1ZmZlciA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLmVzcmlTaGFwZUJ1ZmZlci5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7DQogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIuX3JlYWRGaWVsZCwgeyBieXRlczogbnVsbCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKHRhZyA9PT0gMSkNCiAgICAgICAgICAgICAgb2JqLmJ5dGVzID0gcGJmLnJlYWRCeXRlcygpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLmJ5dGVzKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVCeXRlc0ZpZWxkKDEsIG9iai5ieXRlcyk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmUgPSB7fTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmUuX3JlYWRGaWVsZCwgeyBhdHRyaWJ1dGVzOiBbXSwgZ2VvbWV0cnk6IG51bGwsIGNvbXByZXNzZWRfZ2VvbWV0cnk6IG51bGwsIHNoYXBlQnVmZmVyOiBudWxsLCBjZW50cm9pZDogbnVsbCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai5hdHRyaWJ1dGVzLnB1c2goRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlZhbHVlLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcykpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLmdlb21ldHJ5ID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyksIG9iai5jb21wcmVzc2VkX2dlb21ldHJ5ID0gImdlb21ldHJ5IjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai5zaGFwZUJ1ZmZlciA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5lc3JpU2hhcGVCdWZmZXIucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSwgb2JqLmNvbXByZXNzZWRfZ2VvbWV0cnkgPSAic2hhcGVCdWZmZXIiOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gNCkNCiAgICAgICAgICAgICAgb2JqLmNlbnRyb2lkID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmUud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLmF0dHJpYnV0ZXMpDQogICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspDQogICAgICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDEsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5WYWx1ZS53cml0ZSwgb2JqLmF0dHJpYnV0ZXNbaV0pOw0KICAgICAgICAgIGlmIChvYmouZ2VvbWV0cnkpDQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMiwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5LndyaXRlLCBvYmouZ2VvbWV0cnkpOw0KICAgICAgICAgIGlmIChvYmouc2hhcGVCdWZmZXIpDQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMywgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLmVzcmlTaGFwZUJ1ZmZlci53cml0ZSwgb2JqLnNoYXBlQnVmZmVyKTsNCiAgICAgICAgICBpZiAob2JqLmNlbnRyb2lkKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDQsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeS53cml0ZSwgb2JqLmNlbnRyb2lkKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZCA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlVuaXF1ZUlkRmllbGQucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC5fcmVhZEZpZWxkLCB7IG5hbWU6ICIiLCBpc1N5c3RlbU1haW50YWluZWQ6IGZhbHNlIH0sIGVuZCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlVuaXF1ZUlkRmllbGQuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKHRhZyA9PT0gMSkNCiAgICAgICAgICAgICAgb2JqLm5hbWUgPSBwYmYucmVhZFN0cmluZygpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLmlzU3lzdGVtTWFpbnRhaW5lZCA9IHBiZi5yZWFkQm9vbGVhbigpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5VbmlxdWVJZEZpZWxkLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai5uYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmoubmFtZSk7DQogICAgICAgICAgaWYgKG9iai5pc1N5c3RlbU1haW50YWluZWQpDQogICAgICAgICAgICAgIHBiZi53cml0ZUJvb2xlYW5GaWVsZCgyLCBvYmouaXNTeXN0ZW1NYWludGFpbmVkKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnlQcm9wZXJ0aWVzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVByb3BlcnRpZXMgPSB7fTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5HZW9tZXRyeVByb3BlcnRpZXMucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnlQcm9wZXJ0aWVzLl9yZWFkRmllbGQsIHsgc2hhcGVBcmVhRmllbGROYW1lOiAiIiwgc2hhcGVMZW5ndGhGaWVsZE5hbWU6ICIiLCB1bml0czogIiIgfSwgZW5kKTsNCiAgICAgIH07DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnlQcm9wZXJ0aWVzLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai5zaGFwZUFyZWFGaWVsZE5hbWUgPSBwYmYucmVhZFN0cmluZygpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLnNoYXBlTGVuZ3RoRmllbGROYW1lID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai51bml0cyA9IHBiZi5yZWFkU3RyaW5nKCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcy53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgew0KICAgICAgICAgIGlmIChvYmouc2hhcGVBcmVhRmllbGROYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmouc2hhcGVBcmVhRmllbGROYW1lKTsNCiAgICAgICAgICBpZiAob2JqLnNoYXBlTGVuZ3RoRmllbGROYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgyLCBvYmouc2hhcGVMZW5ndGhGaWVsZE5hbWUpOw0KICAgICAgICAgIGlmIChvYmoudW5pdHMpDQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDMsIG9iai51bml0cyk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMgPSB7fTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMuX3JlYWRGaWVsZCwgeyBtaW5TZXJ2ZXJHZW46IDAsIHNlcnZlckdlbjogMCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai5taW5TZXJ2ZXJHZW4gPSBwYmYucmVhZFZhcmludCgpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLnNlcnZlckdlbiA9IHBiZi5yZWFkVmFyaW50KCk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLm1pblNlcnZlckdlbikNCiAgICAgICAgICAgICAgcGJmLndyaXRlVmFyaW50RmllbGQoMSwgb2JqLm1pblNlcnZlckdlbik7DQogICAgICAgICAgaWYgKG9iai5zZXJ2ZXJHZW4pDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDIsIG9iai5zZXJ2ZXJHZW4pOw0KICAgICAgfTsNCiAgICAgIC8vIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2NhbGUgPSB7fTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS5yZWFkID0gZnVuY3Rpb24gKHBiZiwgZW5kKSB7DQogICAgICAgICAgcmV0dXJuIHBiZi5yZWFkRmllbGRzKEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS5fcmVhZEZpZWxkLCB7IHhTY2FsZTogMCwgeVNjYWxlOiAwLCBtU2NhbGU6IDAsIHpTY2FsZTogMCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAodGFnID09PSAxKQ0KICAgICAgICAgICAgICBvYmoueFNjYWxlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpDQogICAgICAgICAgICAgIG9iai55U2NhbGUgPSBwYmYucmVhZERvdWJsZSgpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMykNCiAgICAgICAgICAgICAgb2JqLm1TY2FsZSA9IHBiZi5yZWFkRG91YmxlKCk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA0KQ0KICAgICAgICAgICAgICBvYmouelNjYWxlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgIH07DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2NhbGUud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLnhTY2FsZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlRG91YmxlRmllbGQoMSwgb2JqLnhTY2FsZSk7DQogICAgICAgICAgaWYgKG9iai55U2NhbGUpDQogICAgICAgICAgICAgIHBiZi53cml0ZURvdWJsZUZpZWxkKDIsIG9iai55U2NhbGUpOw0KICAgICAgICAgIGlmIChvYmoubVNjYWxlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgzLCBvYmoubVNjYWxlKTsNCiAgICAgICAgICBpZiAob2JqLnpTY2FsZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlRG91YmxlRmllbGQoNCwgb2JqLnpTY2FsZSk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zbGF0ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zbGF0ZS5fcmVhZEZpZWxkLCB7IHhUcmFuc2xhdGU6IDAsIHlUcmFuc2xhdGU6IDAsIG1UcmFuc2xhdGU6IDAsIHpUcmFuc2xhdGU6IDAgfSwgZW5kKTsNCiAgICAgIH07DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlLl9yZWFkRmllbGQgPSBmdW5jdGlvbiAodGFnLCBvYmosIHBiZikgew0KICAgICAgICAgIGlmICh0YWcgPT09IDEpDQogICAgICAgICAgICAgIG9iai54VHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpDQogICAgICAgICAgICAgIG9iai55VHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai5tVHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpDQogICAgICAgICAgICAgIG9iai56VHJhbnNsYXRlID0gcGJmLnJlYWREb3VibGUoKTsNCiAgICAgIH07DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlLndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai54VHJhbnNsYXRlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgxLCBvYmoueFRyYW5zbGF0ZSk7DQogICAgICAgICAgaWYgKG9iai55VHJhbnNsYXRlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgyLCBvYmoueVRyYW5zbGF0ZSk7DQogICAgICAgICAgaWYgKG9iai5tVHJhbnNsYXRlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCgzLCBvYmoubVRyYW5zbGF0ZSk7DQogICAgICAgICAgaWYgKG9iai56VHJhbnNsYXRlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVEb3VibGVGaWVsZCg0LCBvYmouelRyYW5zbGF0ZSk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtLnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybS5fcmVhZEZpZWxkLCB7IHF1YW50aXplT3JpZ2luUG9zdGlvbjogMCwgc2NhbGU6IG51bGwsIHRyYW5zbGF0ZTogbnVsbCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2Zvcm0uX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKHRhZyA9PT0gMSkNCiAgICAgICAgICAgICAgb2JqLnF1YW50aXplT3JpZ2luUG9zdGlvbiA9IHBiZi5yZWFkVmFyaW50KCk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAyKQ0KICAgICAgICAgICAgICBvYmouc2NhbGUgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2NhbGUucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai50cmFuc2xhdGUgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlRyYW5zZm9ybS53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgew0KICAgICAgICAgIGlmIChvYmoucXVhbnRpemVPcmlnaW5Qb3N0aW9uKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVWYXJpbnRGaWVsZCgxLCBvYmoucXVhbnRpemVPcmlnaW5Qb3N0aW9uKTsNCiAgICAgICAgICBpZiAob2JqLnNjYWxlKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDIsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TY2FsZS53cml0ZSwgb2JqLnNjYWxlKTsNCiAgICAgICAgICBpZiAob2JqLnRyYW5zbGF0ZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgzLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNsYXRlLndyaXRlLCBvYmoudHJhbnNsYXRlKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdCA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmVSZXN1bHQucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdC5fcmVhZEZpZWxkLCB7IG9iamVjdElkRmllbGROYW1lOiAiIiwgdW5pcXVlSWRGaWVsZDogbnVsbCwgZ2xvYmFsSWRGaWVsZE5hbWU6ICIiLCBnZW9oYXNoRmllbGROYW1lOiAiIiwgZ2VvbWV0cnlQcm9wZXJ0aWVzOiBudWxsLCBzZXJ2ZXJHZW5zOiBudWxsLCBnZW9tZXRyeVR5cGU6IDAsIHNwYXRpYWxSZWZlcmVuY2U6IG51bGwsIGV4Y2VlZGVkVHJhbnNmZXJMaW1pdDogZmFsc2UsIGhhc1o6IGZhbHNlLCBoYXNNOiBmYWxzZSwgdHJhbnNmb3JtOiBudWxsLCBmaWVsZHM6IFtdLCB2YWx1ZXM6IFtdLCBmZWF0dXJlczogW10gfSwgZW5kKTsNCiAgICAgIH07DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZVJlc3VsdC5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAodGFnID09PSAxKQ0KICAgICAgICAgICAgICBvYmoub2JqZWN0SWRGaWVsZE5hbWUgPSBwYmYucmVhZFN0cmluZygpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLnVuaXF1ZUlkRmllbGQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC5yZWFkKHBiZiwgcGJmLnJlYWRWYXJpbnQoKSArIHBiZi5wb3MpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMykNCiAgICAgICAgICAgICAgb2JqLmdsb2JhbElkRmllbGROYW1lID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDQpDQogICAgICAgICAgICAgIG9iai5nZW9oYXNoRmllbGROYW1lID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDUpDQogICAgICAgICAgICAgIG9iai5nZW9tZXRyeVByb3BlcnRpZXMgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuR2VvbWV0cnlQcm9wZXJ0aWVzLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA2KQ0KICAgICAgICAgICAgICBvYmouc2VydmVyR2VucyA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSA3KQ0KICAgICAgICAgICAgICBvYmouZ2VvbWV0cnlUeXBlID0gcGJmLnJlYWRWYXJpbnQoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDgpDQogICAgICAgICAgICAgIG9iai5zcGF0aWFsUmVmZXJlbmNlID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNwYXRpYWxSZWZlcmVuY2UucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDkpDQogICAgICAgICAgICAgIG9iai5leGNlZWRlZFRyYW5zZmVyTGltaXQgPSBwYmYucmVhZEJvb2xlYW4oKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDEwKQ0KICAgICAgICAgICAgICBvYmouaGFzWiA9IHBiZi5yZWFkQm9vbGVhbigpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMTEpDQogICAgICAgICAgICAgIG9iai5oYXNNID0gcGJmLnJlYWRCb29sZWFuKCk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAxMikNCiAgICAgICAgICAgICAgb2JqLnRyYW5zZm9ybSA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5UcmFuc2Zvcm0ucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDEzKQ0KICAgICAgICAgICAgICBvYmouZmllbGRzLnB1c2goRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcykpOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMTQpDQogICAgICAgICAgICAgIG9iai52YWx1ZXMucHVzaChGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSk7DQogICAgICAgICAgZWxzZSBpZiAodGFnID09PSAxNSkNCiAgICAgICAgICAgICAgb2JqLmZlYXR1cmVzLnB1c2goRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmUucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKSk7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZlYXR1cmVSZXN1bHQud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLm9iamVjdElkRmllbGROYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmoub2JqZWN0SWRGaWVsZE5hbWUpOw0KICAgICAgICAgIGlmIChvYmoudW5pcXVlSWRGaWVsZCkNCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVW5pcXVlSWRGaWVsZC53cml0ZSwgb2JqLnVuaXF1ZUlkRmllbGQpOw0KICAgICAgICAgIGlmIChvYmouZ2xvYmFsSWRGaWVsZE5hbWUpDQogICAgICAgICAgICAgIHBiZi53cml0ZVN0cmluZ0ZpZWxkKDMsIG9iai5nbG9iYWxJZEZpZWxkTmFtZSk7DQogICAgICAgICAgaWYgKG9iai5nZW9oYXNoRmllbGROYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCg0LCBvYmouZ2VvaGFzaEZpZWxkTmFtZSk7DQogICAgICAgICAgaWYgKG9iai5nZW9tZXRyeVByb3BlcnRpZXMpDQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoNSwgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkdlb21ldHJ5UHJvcGVydGllcy53cml0ZSwgb2JqLmdlb21ldHJ5UHJvcGVydGllcyk7DQogICAgICAgICAgaWYgKG9iai5zZXJ2ZXJHZW5zKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDYsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5TZXJ2ZXJHZW5zLndyaXRlLCBvYmouc2VydmVyR2Vucyk7DQogICAgICAgICAgaWYgKG9iai5nZW9tZXRyeVR5cGUpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDcsIG9iai5nZW9tZXRyeVR5cGUpOw0KICAgICAgICAgIGlmIChvYmouc3BhdGlhbFJlZmVyZW5jZSkNCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSg4LCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU3BhdGlhbFJlZmVyZW5jZS53cml0ZSwgb2JqLnNwYXRpYWxSZWZlcmVuY2UpOw0KICAgICAgICAgIGlmIChvYmouZXhjZWVkZWRUcmFuc2ZlckxpbWl0KQ0KICAgICAgICAgICAgICBwYmYud3JpdGVCb29sZWFuRmllbGQoOSwgb2JqLmV4Y2VlZGVkVHJhbnNmZXJMaW1pdCk7DQogICAgICAgICAgaWYgKG9iai5oYXNaKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVCb29sZWFuRmllbGQoMTAsIG9iai5oYXNaKTsNCiAgICAgICAgICBpZiAob2JqLmhhc00pDQogICAgICAgICAgICAgIHBiZi53cml0ZUJvb2xlYW5GaWVsZCgxMSwgb2JqLmhhc00pOw0KICAgICAgICAgIGlmIChvYmoudHJhbnNmb3JtKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDEyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVHJhbnNmb3JtLndyaXRlLCBvYmoudHJhbnNmb3JtKTsNCiAgICAgICAgICBpZiAob2JqLmZpZWxkcykNCiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmouZmllbGRzLmxlbmd0aDsgaSsrKQ0KICAgICAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgxMywgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkZpZWxkLndyaXRlLCBvYmouZmllbGRzW2ldKTsNCiAgICAgICAgICBpZiAob2JqLnZhbHVlcykNCiAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iai52YWx1ZXMubGVuZ3RoOyBpKyspDQogICAgICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDE0LCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuVmFsdWUud3JpdGUsIG9iai52YWx1ZXNbaV0pOw0KICAgICAgICAgIGlmIChvYmouZmVhdHVyZXMpDQogICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvYmouZmVhdHVyZXMubGVuZ3RoOyBpKyspDQogICAgICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDE1LCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuRmVhdHVyZS53cml0ZSwgb2JqLmZlYXR1cmVzW2ldKTsNCiAgICAgIH07DQogICAgICAvLyBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkNvdW50UmVzdWx0ID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQucmVhZCA9IGZ1bmN0aW9uIChwYmYsIGVuZCkgew0KICAgICAgICAgIHJldHVybiBwYmYucmVhZEZpZWxkcyhGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQuX3JlYWRGaWVsZCwgeyBjb3VudDogMCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5Db3VudFJlc3VsdC5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAodGFnID09PSAxKQ0KICAgICAgICAgICAgICBvYmouY291bnQgPSBwYmYucmVhZFZhcmludCgpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5Db3VudFJlc3VsdC53cml0ZSA9IGZ1bmN0aW9uIChvYmosIHBiZikgew0KICAgICAgICAgIGlmIChvYmouY291bnQpDQogICAgICAgICAgICAgIHBiZi53cml0ZVZhcmludEZpZWxkKDEsIG9iai5jb3VudCk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLk9iamVjdElkc1Jlc3VsdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0ID0ge307DQogICAgICBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLk9iamVjdElkc1Jlc3VsdC5fcmVhZEZpZWxkLCB7IG9iamVjdElkRmllbGROYW1lOiAiIiwgc2VydmVyR2VuczogbnVsbCwgb2JqZWN0SWRzOiBbXSB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5PYmplY3RJZHNSZXN1bHQuX3JlYWRGaWVsZCA9IGZ1bmN0aW9uICh0YWcsIG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKHRhZyA9PT0gMSkNCiAgICAgICAgICAgICAgb2JqLm9iamVjdElkRmllbGROYW1lID0gcGJmLnJlYWRTdHJpbmcoKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDIpDQogICAgICAgICAgICAgIG9iai5zZXJ2ZXJHZW5zID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlNlcnZlckdlbnMucmVhZChwYmYsIHBiZi5yZWFkVmFyaW50KCkgKyBwYmYucG9zKTsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIHBiZi5yZWFkUGFja2VkVmFyaW50KG9iai5vYmplY3RJZHMpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5PYmplY3RJZHNSZXN1bHQud3JpdGUgPSBmdW5jdGlvbiAob2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAob2JqLm9iamVjdElkRmllbGROYW1lKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVTdHJpbmdGaWVsZCgxLCBvYmoub2JqZWN0SWRGaWVsZE5hbWUpOw0KICAgICAgICAgIGlmIChvYmouc2VydmVyR2VucykNCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuU2VydmVyR2Vucy53cml0ZSwgb2JqLnNlcnZlckdlbnMpOw0KICAgICAgICAgIGlmIChvYmoub2JqZWN0SWRzKQ0KICAgICAgICAgICAgICBwYmYud3JpdGVQYWNrZWRWYXJpbnQoMywgb2JqLm9iamVjdElkcyk7DQogICAgICB9Ow0KICAgICAgLy8gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdCA9IHt9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0LnJlYWQgPSBmdW5jdGlvbiAocGJmLCBlbmQpIHsNCiAgICAgICAgICByZXR1cm4gcGJmLnJlYWRGaWVsZHMoRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0Ll9yZWFkRmllbGQsIHsgZmVhdHVyZVJlc3VsdDogbnVsbCwgUmVzdWx0czogbnVsbCwgY291bnRSZXN1bHQ6IG51bGwsIGlkc1Jlc3VsdDogbnVsbCB9LCBlbmQpOw0KICAgICAgfTsNCiAgICAgIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5RdWVyeVJlc3VsdC5fcmVhZEZpZWxkID0gZnVuY3Rpb24gKHRhZywgb2JqLCBwYmYpIHsNCiAgICAgICAgICBpZiAodGFnID09PSAxKQ0KICAgICAgICAgICAgICBvYmouZmVhdHVyZVJlc3VsdCA9IEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlUmVzdWx0LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyksIG9iai5SZXN1bHRzID0gImZlYXR1cmVSZXN1bHQiOw0KICAgICAgICAgIGVsc2UgaWYgKHRhZyA9PT0gMikNCiAgICAgICAgICAgICAgb2JqLmNvdW50UmVzdWx0ID0gRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLkNvdW50UmVzdWx0LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyksIG9iai5SZXN1bHRzID0gImNvdW50UmVzdWx0IjsNCiAgICAgICAgICBlbHNlIGlmICh0YWcgPT09IDMpDQogICAgICAgICAgICAgIG9iai5pZHNSZXN1bHQgPSBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuT2JqZWN0SWRzUmVzdWx0LnJlYWQocGJmLCBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyksIG9iai5SZXN1bHRzID0gImlkc1Jlc3VsdCI7DQogICAgICB9Ow0KICAgICAgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLlF1ZXJ5UmVzdWx0LndyaXRlID0gZnVuY3Rpb24gKG9iaiwgcGJmKSB7DQogICAgICAgICAgaWYgKG9iai5mZWF0dXJlUmVzdWx0KQ0KICAgICAgICAgICAgICBwYmYud3JpdGVNZXNzYWdlKDEsIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlci5GZWF0dXJlUmVzdWx0LndyaXRlLCBvYmouZmVhdHVyZVJlc3VsdCk7DQogICAgICAgICAgaWYgKG9iai5jb3VudFJlc3VsdCkNCiAgICAgICAgICAgICAgcGJmLndyaXRlTWVzc2FnZSgyLCBGZWF0dXJlQ29sbGVjdGlvblBCdWZmZXIuQ291bnRSZXN1bHQud3JpdGUsIG9iai5jb3VudFJlc3VsdCk7DQogICAgICAgICAgaWYgKG9iai5pZHNSZXN1bHQpDQogICAgICAgICAgICAgIHBiZi53cml0ZU1lc3NhZ2UoMywgRmVhdHVyZUNvbGxlY3Rpb25QQnVmZmVyLk9iamVjdElkc1Jlc3VsdC53cml0ZSwgb2JqLmlkc1Jlc3VsdCk7DQogICAgICB9Ow0KICAgICAgcmV0dXJuIEZlYXR1cmVDb2xsZWN0aW9uUEJ1ZmZlcjsNCiAgfQoKICB2YXIgaWVlZTc1NCQxID0ge307CgogIC8qISBpZWVlNzU0LiBCU0QtMy1DbGF1c2UgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovCgogIGllZWU3NTQkMS5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHsKICAgIHZhciBlLCBtOwogICAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMTsKICAgIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxOwogICAgdmFyIGVCaWFzID0gZU1heCA+PiAxOwogICAgdmFyIG5CaXRzID0gLTc7CiAgICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwOwogICAgdmFyIGQgPSBpc0xFID8gLTEgOiAxOwogICAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07CgogICAgaSArPSBkOwoKICAgIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpOwogICAgcyA+Pj0gKC1uQml0cyk7CiAgICBuQml0cyArPSBlTGVuOwogICAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fQoKICAgIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpOwogICAgZSA+Pj0gKC1uQml0cyk7CiAgICBuQml0cyArPSBtTGVuOwogICAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fQoKICAgIGlmIChlID09PSAwKSB7CiAgICAgIGUgPSAxIC0gZUJpYXM7CiAgICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHsKICAgICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpCiAgICB9IGVsc2UgewogICAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pOwogICAgICBlID0gZSAtIGVCaWFzOwogICAgfQogICAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbikKICB9OwoKICBpZWVlNzU0JDEud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHsKICAgIHZhciBlLCBtLCBjOwogICAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMTsKICAgIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxOwogICAgdmFyIGVCaWFzID0gZU1heCA+PiAxOwogICAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKTsKICAgIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSk7CiAgICB2YXIgZCA9IGlzTEUgPyAxIDogLTE7CiAgICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDsKCiAgICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTsKCiAgICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkgewogICAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDA7CiAgICAgIGUgPSBlTWF4OwogICAgfSBlbHNlIHsKICAgICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpOwogICAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7CiAgICAgICAgZS0tOwogICAgICAgIGMgKj0gMjsKICAgICAgfQogICAgICBpZiAoZSArIGVCaWFzID49IDEpIHsKICAgICAgICB2YWx1ZSArPSBydCAvIGM7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpOwogICAgICB9CiAgICAgIGlmICh2YWx1ZSAqIGMgPj0gMikgewogICAgICAgIGUrKzsKICAgICAgICBjIC89IDI7CiAgICAgIH0KCiAgICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkgewogICAgICAgIG0gPSAwOwogICAgICAgIGUgPSBlTWF4OwogICAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7CiAgICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7CiAgICAgICAgZSA9IGUgKyBlQmlhczsKICAgICAgfSBlbHNlIHsKICAgICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7CiAgICAgICAgZSA9IDA7CiAgICAgIH0KICAgIH0KCiAgICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fQoKICAgIGUgPSAoZSA8PCBtTGVuKSB8IG07CiAgICBlTGVuICs9IG1MZW47CiAgICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9CgogICAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4OwogIH07CgogIHZhciBwYmYgPSBQYmY7CgogIHZhciBpZWVlNzU0ID0gaWVlZTc1NCQxOwoKICBmdW5jdGlvbiBQYmYoYnVmKSB7CiAgICAgIHRoaXMuYnVmID0gQXJyYXlCdWZmZXIuaXNWaWV3ICYmIEFycmF5QnVmZmVyLmlzVmlldyhidWYpID8gYnVmIDogbmV3IFVpbnQ4QXJyYXkoYnVmIHx8IDApOwogICAgICB0aGlzLnBvcyA9IDA7CiAgICAgIHRoaXMudHlwZSA9IDA7CiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5idWYubGVuZ3RoOwogIH0KCiAgUGJmLlZhcmludCAgPSAwOyAvLyB2YXJpbnQ6IGludDMyLCBpbnQ2NCwgdWludDMyLCB1aW50NjQsIHNpbnQzMiwgc2ludDY0LCBib29sLCBlbnVtCiAgUGJmLkZpeGVkNjQgPSAxOyAvLyA2NC1iaXQ6IGRvdWJsZSwgZml4ZWQ2NCwgc2ZpeGVkNjQKICBQYmYuQnl0ZXMgICA9IDI7IC8vIGxlbmd0aC1kZWxpbWl0ZWQ6IHN0cmluZywgYnl0ZXMsIGVtYmVkZGVkIG1lc3NhZ2VzLCBwYWNrZWQgcmVwZWF0ZWQgZmllbGRzCiAgUGJmLkZpeGVkMzIgPSA1OyAvLyAzMi1iaXQ6IGZsb2F0LCBmaXhlZDMyLCBzZml4ZWQzMgoKICB2YXIgU0hJRlRfTEVGVF8zMiA9ICgxIDw8IDE2KSAqICgxIDw8IDE2KSwKICAgICAgU0hJRlRfUklHSFRfMzIgPSAxIC8gU0hJRlRfTEVGVF8zMjsKCiAgLy8gVGhyZXNob2xkIGNob3NlbiBiYXNlZCBvbiBib3RoIGJlbmNobWFya2luZyBhbmQga25vd2xlZGdlIGFib3V0IGJyb3dzZXIgc3RyaW5nCiAgLy8gZGF0YSBzdHJ1Y3R1cmVzICh3aGljaCBjdXJyZW50bHkgc3dpdGNoIHN0cnVjdHVyZSB0eXBlcyBhdCAxMiBieXRlcyBvciBtb3JlKQogIHZhciBURVhUX0RFQ09ERVJfTUlOX0xFTkdUSCA9IDEyOwogIHZhciB1dGY4VGV4dERlY29kZXIgPSB0eXBlb2YgVGV4dERlY29kZXIgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IG5ldyBUZXh0RGVjb2RlcigndXRmOCcpOwoKICBQYmYucHJvdG90eXBlID0gewoKICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7CiAgICAgICAgICB0aGlzLmJ1ZiA9IG51bGw7CiAgICAgIH0sCgogICAgICAvLyA9PT0gUkVBRElORyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKICAgICAgcmVhZEZpZWxkczogZnVuY3Rpb24ocmVhZEZpZWxkLCByZXN1bHQsIGVuZCkgewogICAgICAgICAgZW5kID0gZW5kIHx8IHRoaXMubGVuZ3RoOwoKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgewogICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnJlYWRWYXJpbnQoKSwKICAgICAgICAgICAgICAgICAgdGFnID0gdmFsID4+IDMsCiAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zID0gdGhpcy5wb3M7CgogICAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbCAmIDB4NzsKICAgICAgICAgICAgICByZWFkRmllbGQodGFnLCByZXN1bHQsIHRoaXMpOwoKICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPT09IHN0YXJ0UG9zKSB0aGlzLnNraXAodmFsKTsKICAgICAgICAgIH0KICAgICAgICAgIHJldHVybiByZXN1bHQ7CiAgICAgIH0sCgogICAgICByZWFkTWVzc2FnZTogZnVuY3Rpb24ocmVhZEZpZWxkLCByZXN1bHQpIHsKICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRGaWVsZHMocmVhZEZpZWxkLCByZXN1bHQsIHRoaXMucmVhZFZhcmludCgpICsgdGhpcy5wb3MpOwogICAgICB9LAoKICAgICAgcmVhZEZpeGVkMzI6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIHZhbCA9IHJlYWRVSW50MzIodGhpcy5idWYsIHRoaXMucG9zKTsKICAgICAgICAgIHRoaXMucG9zICs9IDQ7CiAgICAgICAgICByZXR1cm4gdmFsOwogICAgICB9LAoKICAgICAgcmVhZFNGaXhlZDMyOiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciB2YWwgPSByZWFkSW50MzIodGhpcy5idWYsIHRoaXMucG9zKTsKICAgICAgICAgIHRoaXMucG9zICs9IDQ7CiAgICAgICAgICByZXR1cm4gdmFsOwogICAgICB9LAoKICAgICAgLy8gNjQtYml0IGludCBoYW5kbGluZyBpcyBiYXNlZCBvbiBnaXRodWIuY29tL2Rwdy9ub2RlLWJ1ZmZlci1tb3JlLWludHMgKE1JVC1saWNlbnNlZCkKCiAgICAgIHJlYWRGaXhlZDY0OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciB2YWwgPSByZWFkVUludDMyKHRoaXMuYnVmLCB0aGlzLnBvcykgKyByZWFkVUludDMyKHRoaXMuYnVmLCB0aGlzLnBvcyArIDQpICogU0hJRlRfTEVGVF8zMjsKICAgICAgICAgIHRoaXMucG9zICs9IDg7CiAgICAgICAgICByZXR1cm4gdmFsOwogICAgICB9LAoKICAgICAgcmVhZFNGaXhlZDY0OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciB2YWwgPSByZWFkVUludDMyKHRoaXMuYnVmLCB0aGlzLnBvcykgKyByZWFkSW50MzIodGhpcy5idWYsIHRoaXMucG9zICsgNCkgKiBTSElGVF9MRUZUXzMyOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICByZWFkRmxvYXQ6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIHZhbCA9IGllZWU3NTQucmVhZCh0aGlzLmJ1ZiwgdGhpcy5wb3MsIHRydWUsIDIzLCA0KTsKICAgICAgICAgIHRoaXMucG9zICs9IDQ7CiAgICAgICAgICByZXR1cm4gdmFsOwogICAgICB9LAoKICAgICAgcmVhZERvdWJsZTogZnVuY3Rpb24oKSB7CiAgICAgICAgICB2YXIgdmFsID0gaWVlZTc1NC5yZWFkKHRoaXMuYnVmLCB0aGlzLnBvcywgdHJ1ZSwgNTIsIDgpOwogICAgICAgICAgdGhpcy5wb3MgKz0gODsKICAgICAgICAgIHJldHVybiB2YWw7CiAgICAgIH0sCgogICAgICByZWFkVmFyaW50OiBmdW5jdGlvbihpc1NpZ25lZCkgewogICAgICAgICAgdmFyIGJ1ZiA9IHRoaXMuYnVmLAogICAgICAgICAgICAgIHZhbCwgYjsKCiAgICAgICAgICBiID0gYnVmW3RoaXMucG9zKytdOyB2YWwgID0gIGIgJiAweDdmOyAgICAgICAgaWYgKGIgPCAweDgwKSByZXR1cm4gdmFsOwogICAgICAgICAgYiA9IGJ1Zlt0aGlzLnBvcysrXTsgdmFsIHw9IChiICYgMHg3ZikgPDwgNzsgIGlmIChiIDwgMHg4MCkgcmV0dXJuIHZhbDsKICAgICAgICAgIGIgPSBidWZbdGhpcy5wb3MrK107IHZhbCB8PSAoYiAmIDB4N2YpIDw8IDE0OyBpZiAoYiA8IDB4ODApIHJldHVybiB2YWw7CiAgICAgICAgICBiID0gYnVmW3RoaXMucG9zKytdOyB2YWwgfD0gKGIgJiAweDdmKSA8PCAyMTsgaWYgKGIgPCAweDgwKSByZXR1cm4gdmFsOwogICAgICAgICAgYiA9IGJ1Zlt0aGlzLnBvc107ICAgdmFsIHw9IChiICYgMHgwZikgPDwgMjg7CgogICAgICAgICAgcmV0dXJuIHJlYWRWYXJpbnRSZW1haW5kZXIodmFsLCBpc1NpZ25lZCwgdGhpcyk7CiAgICAgIH0sCgogICAgICByZWFkVmFyaW50NjQ6IGZ1bmN0aW9uKCkgeyAvLyBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIHYyLjAuMQogICAgICAgICAgcmV0dXJuIHRoaXMucmVhZFZhcmludCh0cnVlKTsKICAgICAgfSwKCiAgICAgIHJlYWRTVmFyaW50OiBmdW5jdGlvbigpIHsKICAgICAgICAgIHZhciBudW0gPSB0aGlzLnJlYWRWYXJpbnQoKTsKICAgICAgICAgIHJldHVybiBudW0gJSAyID09PSAxID8gKG51bSArIDEpIC8gLTIgOiBudW0gLyAyOyAvLyB6aWd6YWcgZW5jb2RpbmcKICAgICAgfSwKCiAgICAgIHJlYWRCb29sZWFuOiBmdW5jdGlvbigpIHsKICAgICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMucmVhZFZhcmludCgpKTsKICAgICAgfSwKCiAgICAgIHJlYWRTdHJpbmc6IGZ1bmN0aW9uKCkgewogICAgICAgICAgdmFyIGVuZCA9IHRoaXMucmVhZFZhcmludCgpICsgdGhpcy5wb3M7CiAgICAgICAgICB2YXIgcG9zID0gdGhpcy5wb3M7CiAgICAgICAgICB0aGlzLnBvcyA9IGVuZDsKCiAgICAgICAgICBpZiAoZW5kIC0gcG9zID49IFRFWFRfREVDT0RFUl9NSU5fTEVOR1RIICYmIHV0ZjhUZXh0RGVjb2RlcikgewogICAgICAgICAgICAgIC8vIGxvbmdlciBzdHJpbmdzIGFyZSBmYXN0IHdpdGggdGhlIGJ1aWx0LWluIGJyb3dzZXIgVGV4dERlY29kZXIgQVBJCiAgICAgICAgICAgICAgcmV0dXJuIHJlYWRVdGY4VGV4dERlY29kZXIodGhpcy5idWYsIHBvcywgZW5kKTsKICAgICAgICAgIH0KICAgICAgICAgIC8vIHNob3J0IHN0cmluZ3MgYXJlIGZhc3Qgd2l0aCBvdXIgY3VzdG9tIGltcGxlbWVudGF0aW9uCiAgICAgICAgICByZXR1cm4gcmVhZFV0ZjgodGhpcy5idWYsIHBvcywgZW5kKTsKICAgICAgfSwKCiAgICAgIHJlYWRCeXRlczogZnVuY3Rpb24oKSB7CiAgICAgICAgICB2YXIgZW5kID0gdGhpcy5yZWFkVmFyaW50KCkgKyB0aGlzLnBvcywKICAgICAgICAgICAgICBidWZmZXIgPSB0aGlzLmJ1Zi5zdWJhcnJheSh0aGlzLnBvcywgZW5kKTsKICAgICAgICAgIHRoaXMucG9zID0gZW5kOwogICAgICAgICAgcmV0dXJuIGJ1ZmZlcjsKICAgICAgfSwKCiAgICAgIC8vIHZlcmJvc2UgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnM7IGRvZXNuJ3QgYWZmZWN0IGd6aXBwZWQgc2l6ZQoKICAgICAgcmVhZFBhY2tlZFZhcmludDogZnVuY3Rpb24oYXJyLCBpc1NpZ25lZCkgewogICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gUGJmLkJ5dGVzKSByZXR1cm4gYXJyLnB1c2godGhpcy5yZWFkVmFyaW50KGlzU2lnbmVkKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkVmFyaW50KGlzU2lnbmVkKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkU1ZhcmludDogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRTVmFyaW50KCkpOwogICAgICAgICAgdmFyIGVuZCA9IHJlYWRQYWNrZWRFbmQodGhpcyk7CiAgICAgICAgICBhcnIgPSBhcnIgfHwgW107CiAgICAgICAgICB3aGlsZSAodGhpcy5wb3MgPCBlbmQpIGFyci5wdXNoKHRoaXMucmVhZFNWYXJpbnQoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkQm9vbGVhbjogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRCb29sZWFuKCkpOwogICAgICAgICAgdmFyIGVuZCA9IHJlYWRQYWNrZWRFbmQodGhpcyk7CiAgICAgICAgICBhcnIgPSBhcnIgfHwgW107CiAgICAgICAgICB3aGlsZSAodGhpcy5wb3MgPCBlbmQpIGFyci5wdXNoKHRoaXMucmVhZEJvb2xlYW4oKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkRmxvYXQ6IGZ1bmN0aW9uKGFycikgewogICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gUGJmLkJ5dGVzKSByZXR1cm4gYXJyLnB1c2godGhpcy5yZWFkRmxvYXQoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkRmxvYXQoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkRG91YmxlOiBmdW5jdGlvbihhcnIpIHsKICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFBiZi5CeXRlcykgcmV0dXJuIGFyci5wdXNoKHRoaXMucmVhZERvdWJsZSgpKTsKICAgICAgICAgIHZhciBlbmQgPSByZWFkUGFja2VkRW5kKHRoaXMpOwogICAgICAgICAgYXJyID0gYXJyIHx8IFtdOwogICAgICAgICAgd2hpbGUgKHRoaXMucG9zIDwgZW5kKSBhcnIucHVzaCh0aGlzLnJlYWREb3VibGUoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkRml4ZWQzMjogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRGaXhlZDMyKCkpOwogICAgICAgICAgdmFyIGVuZCA9IHJlYWRQYWNrZWRFbmQodGhpcyk7CiAgICAgICAgICBhcnIgPSBhcnIgfHwgW107CiAgICAgICAgICB3aGlsZSAodGhpcy5wb3MgPCBlbmQpIGFyci5wdXNoKHRoaXMucmVhZEZpeGVkMzIoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkU0ZpeGVkMzI6IGZ1bmN0aW9uKGFycikgewogICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gUGJmLkJ5dGVzKSByZXR1cm4gYXJyLnB1c2godGhpcy5yZWFkU0ZpeGVkMzIoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkU0ZpeGVkMzIoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkRml4ZWQ2NDogZnVuY3Rpb24oYXJyKSB7CiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSBQYmYuQnl0ZXMpIHJldHVybiBhcnIucHVzaCh0aGlzLnJlYWRGaXhlZDY0KCkpOwogICAgICAgICAgdmFyIGVuZCA9IHJlYWRQYWNrZWRFbmQodGhpcyk7CiAgICAgICAgICBhcnIgPSBhcnIgfHwgW107CiAgICAgICAgICB3aGlsZSAodGhpcy5wb3MgPCBlbmQpIGFyci5wdXNoKHRoaXMucmVhZEZpeGVkNjQoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAogICAgICByZWFkUGFja2VkU0ZpeGVkNjQ6IGZ1bmN0aW9uKGFycikgewogICAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gUGJmLkJ5dGVzKSByZXR1cm4gYXJyLnB1c2godGhpcy5yZWFkU0ZpeGVkNjQoKSk7CiAgICAgICAgICB2YXIgZW5kID0gcmVhZFBhY2tlZEVuZCh0aGlzKTsKICAgICAgICAgIGFyciA9IGFyciB8fCBbXTsKICAgICAgICAgIHdoaWxlICh0aGlzLnBvcyA8IGVuZCkgYXJyLnB1c2godGhpcy5yZWFkU0ZpeGVkNjQoKSk7CiAgICAgICAgICByZXR1cm4gYXJyOwogICAgICB9LAoKICAgICAgc2tpcDogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB2YXIgdHlwZSA9IHZhbCAmIDB4NzsKICAgICAgICAgIGlmICh0eXBlID09PSBQYmYuVmFyaW50KSB3aGlsZSAodGhpcy5idWZbdGhpcy5wb3MrK10gPiAweDdmKSB7fQogICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gUGJmLkJ5dGVzKSB0aGlzLnBvcyA9IHRoaXMucmVhZFZhcmludCgpICsgdGhpcy5wb3M7CiAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBQYmYuRml4ZWQzMikgdGhpcy5wb3MgKz0gNDsKICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT09IFBiZi5GaXhlZDY0KSB0aGlzLnBvcyArPSA4OwogICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1VuaW1wbGVtZW50ZWQgdHlwZTogJyArIHR5cGUpOwogICAgICB9LAoKICAgICAgLy8gPT09IFdSSVRJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCiAgICAgIHdyaXRlVGFnOiBmdW5jdGlvbih0YWcsIHR5cGUpIHsKICAgICAgICAgIHRoaXMud3JpdGVWYXJpbnQoKHRhZyA8PCAzKSB8IHR5cGUpOwogICAgICB9LAoKICAgICAgcmVhbGxvYzogZnVuY3Rpb24obWluKSB7CiAgICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfHwgMTY7CgogICAgICAgICAgd2hpbGUgKGxlbmd0aCA8IHRoaXMucG9zICsgbWluKSBsZW5ndGggKj0gMjsKCiAgICAgICAgICBpZiAobGVuZ3RoICE9PSB0aGlzLmxlbmd0aCkgewogICAgICAgICAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheShsZW5ndGgpOwogICAgICAgICAgICAgIGJ1Zi5zZXQodGhpcy5idWYpOwogICAgICAgICAgICAgIHRoaXMuYnVmID0gYnVmOwogICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoOwogICAgICAgICAgfQogICAgICB9LAoKICAgICAgZmluaXNoOiBmdW5jdGlvbigpIHsKICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5wb3M7CiAgICAgICAgICB0aGlzLnBvcyA9IDA7CiAgICAgICAgICByZXR1cm4gdGhpcy5idWYuc3ViYXJyYXkoMCwgdGhpcy5sZW5ndGgpOwogICAgICB9LAoKICAgICAgd3JpdGVGaXhlZDMyOiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHRoaXMucmVhbGxvYyg0KTsKICAgICAgICAgIHdyaXRlSW50MzIodGhpcy5idWYsIHZhbCwgdGhpcy5wb3MpOwogICAgICAgICAgdGhpcy5wb3MgKz0gNDsKICAgICAgfSwKCiAgICAgIHdyaXRlU0ZpeGVkMzI6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDQpOwogICAgICAgICAgd3JpdGVJbnQzMih0aGlzLmJ1ZiwgdmFsLCB0aGlzLnBvcyk7CiAgICAgICAgICB0aGlzLnBvcyArPSA0OwogICAgICB9LAoKICAgICAgd3JpdGVGaXhlZDY0OiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHRoaXMucmVhbGxvYyg4KTsKICAgICAgICAgIHdyaXRlSW50MzIodGhpcy5idWYsIHZhbCAmIC0xLCB0aGlzLnBvcyk7CiAgICAgICAgICB3cml0ZUludDMyKHRoaXMuYnVmLCBNYXRoLmZsb29yKHZhbCAqIFNISUZUX1JJR0hUXzMyKSwgdGhpcy5wb3MgKyA0KTsKICAgICAgICAgIHRoaXMucG9zICs9IDg7CiAgICAgIH0sCgogICAgICB3cml0ZVNGaXhlZDY0OiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHRoaXMucmVhbGxvYyg4KTsKICAgICAgICAgIHdyaXRlSW50MzIodGhpcy5idWYsIHZhbCAmIC0xLCB0aGlzLnBvcyk7CiAgICAgICAgICB3cml0ZUludDMyKHRoaXMuYnVmLCBNYXRoLmZsb29yKHZhbCAqIFNISUZUX1JJR0hUXzMyKSwgdGhpcy5wb3MgKyA0KTsKICAgICAgICAgIHRoaXMucG9zICs9IDg7CiAgICAgIH0sCgogICAgICB3cml0ZVZhcmludDogZnVuY3Rpb24odmFsKSB7CiAgICAgICAgICB2YWwgPSArdmFsIHx8IDA7CgogICAgICAgICAgaWYgKHZhbCA+IDB4ZmZmZmZmZiB8fCB2YWwgPCAwKSB7CiAgICAgICAgICAgICAgd3JpdGVCaWdWYXJpbnQodmFsLCB0aGlzKTsKICAgICAgICAgICAgICByZXR1cm47CiAgICAgICAgICB9CgogICAgICAgICAgdGhpcy5yZWFsbG9jKDQpOwoKICAgICAgICAgIHRoaXMuYnVmW3RoaXMucG9zKytdID0gICAgICAgICAgIHZhbCAmIDB4N2YgIHwgKHZhbCA+IDB4N2YgPyAweDgwIDogMCk7IGlmICh2YWwgPD0gMHg3ZikgcmV0dXJuOwogICAgICAgICAgdGhpcy5idWZbdGhpcy5wb3MrK10gPSAoKHZhbCA+Pj49IDcpICYgMHg3ZikgfCAodmFsID4gMHg3ZiA/IDB4ODAgOiAwKTsgaWYgKHZhbCA8PSAweDdmKSByZXR1cm47CiAgICAgICAgICB0aGlzLmJ1Zlt0aGlzLnBvcysrXSA9ICgodmFsID4+Pj0gNykgJiAweDdmKSB8ICh2YWwgPiAweDdmID8gMHg4MCA6IDApOyBpZiAodmFsIDw9IDB4N2YpIHJldHVybjsKICAgICAgICAgIHRoaXMuYnVmW3RoaXMucG9zKytdID0gICAodmFsID4+PiA3KSAmIDB4N2Y7CiAgICAgIH0sCgogICAgICB3cml0ZVNWYXJpbnQ6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVZhcmludCh2YWwgPCAwID8gLXZhbCAqIDIgLSAxIDogdmFsICogMik7CiAgICAgIH0sCgogICAgICB3cml0ZUJvb2xlYW46IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVZhcmludChCb29sZWFuKHZhbCkpOwogICAgICB9LAoKICAgICAgd3JpdGVTdHJpbmc6IGZ1bmN0aW9uKHN0cikgewogICAgICAgICAgc3RyID0gU3RyaW5nKHN0cik7CiAgICAgICAgICB0aGlzLnJlYWxsb2Moc3RyLmxlbmd0aCAqIDQpOwoKICAgICAgICAgIHRoaXMucG9zKys7IC8vIHJlc2VydmUgMSBieXRlIGZvciBzaG9ydCBzdHJpbmcgbGVuZ3RoCgogICAgICAgICAgdmFyIHN0YXJ0UG9zID0gdGhpcy5wb3M7CiAgICAgICAgICAvLyB3cml0ZSB0aGUgc3RyaW5nIGRpcmVjdGx5IHRvIHRoZSBidWZmZXIgYW5kIHNlZSBob3cgbXVjaCB3YXMgd3JpdHRlbgogICAgICAgICAgdGhpcy5wb3MgPSB3cml0ZVV0ZjgodGhpcy5idWYsIHN0ciwgdGhpcy5wb3MpOwogICAgICAgICAgdmFyIGxlbiA9IHRoaXMucG9zIC0gc3RhcnRQb3M7CgogICAgICAgICAgaWYgKGxlbiA+PSAweDgwKSBtYWtlUm9vbUZvckV4dHJhTGVuZ3RoKHN0YXJ0UG9zLCBsZW4sIHRoaXMpOwoKICAgICAgICAgIC8vIGZpbmFsbHksIHdyaXRlIHRoZSBtZXNzYWdlIGxlbmd0aCBpbiB0aGUgcmVzZXJ2ZWQgcGxhY2UgYW5kIHJlc3RvcmUgdGhlIHBvc2l0aW9uCiAgICAgICAgICB0aGlzLnBvcyA9IHN0YXJ0UG9zIC0gMTsKICAgICAgICAgIHRoaXMud3JpdGVWYXJpbnQobGVuKTsKICAgICAgICAgIHRoaXMucG9zICs9IGxlbjsKICAgICAgfSwKCiAgICAgIHdyaXRlRmxvYXQ6IGZ1bmN0aW9uKHZhbCkgewogICAgICAgICAgdGhpcy5yZWFsbG9jKDQpOwogICAgICAgICAgaWVlZTc1NC53cml0ZSh0aGlzLmJ1ZiwgdmFsLCB0aGlzLnBvcywgdHJ1ZSwgMjMsIDQpOwogICAgICAgICAgdGhpcy5wb3MgKz0gNDsKICAgICAgfSwKCiAgICAgIHdyaXRlRG91YmxlOiBmdW5jdGlvbih2YWwpIHsKICAgICAgICAgIHRoaXMucmVhbGxvYyg4KTsKICAgICAgICAgIGllZWU3NTQud3JpdGUodGhpcy5idWYsIHZhbCwgdGhpcy5wb3MsIHRydWUsIDUyLCA4KTsKICAgICAgICAgIHRoaXMucG9zICs9IDg7CiAgICAgIH0sCgogICAgICB3cml0ZUJ5dGVzOiBmdW5jdGlvbihidWZmZXIpIHsKICAgICAgICAgIHZhciBsZW4gPSBidWZmZXIubGVuZ3RoOwogICAgICAgICAgdGhpcy53cml0ZVZhcmludChsZW4pOwogICAgICAgICAgdGhpcy5yZWFsbG9jKGxlbik7CiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB0aGlzLmJ1Zlt0aGlzLnBvcysrXSA9IGJ1ZmZlcltpXTsKICAgICAgfSwKCiAgICAgIHdyaXRlUmF3TWVzc2FnZTogZnVuY3Rpb24oZm4sIG9iaikgewogICAgICAgICAgdGhpcy5wb3MrKzsgLy8gcmVzZXJ2ZSAxIGJ5dGUgZm9yIHNob3J0IG1lc3NhZ2UgbGVuZ3RoCgogICAgICAgICAgLy8gd3JpdGUgdGhlIG1lc3NhZ2UgZGlyZWN0bHkgdG8gdGhlIGJ1ZmZlciBhbmQgc2VlIGhvdyBtdWNoIHdhcyB3cml0dGVuCiAgICAgICAgICB2YXIgc3RhcnRQb3MgPSB0aGlzLnBvczsKICAgICAgICAgIGZuKG9iaiwgdGhpcyk7CiAgICAgICAgICB2YXIgbGVuID0gdGhpcy5wb3MgLSBzdGFydFBvczsKCiAgICAgICAgICBpZiAobGVuID49IDB4ODApIG1ha2VSb29tRm9yRXh0cmFMZW5ndGgoc3RhcnRQb3MsIGxlbiwgdGhpcyk7CgogICAgICAgICAgLy8gZmluYWxseSwgd3JpdGUgdGhlIG1lc3NhZ2UgbGVuZ3RoIGluIHRoZSByZXNlcnZlZCBwbGFjZSBhbmQgcmVzdG9yZSB0aGUgcG9zaXRpb24KICAgICAgICAgIHRoaXMucG9zID0gc3RhcnRQb3MgLSAxOwogICAgICAgICAgdGhpcy53cml0ZVZhcmludChsZW4pOwogICAgICAgICAgdGhpcy5wb3MgKz0gbGVuOwogICAgICB9LAoKICAgICAgd3JpdGVNZXNzYWdlOiBmdW5jdGlvbih0YWcsIGZuLCBvYmopIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuQnl0ZXMpOwogICAgICAgICAgdGhpcy53cml0ZVJhd01lc3NhZ2UoZm4sIG9iaik7CiAgICAgIH0sCgogICAgICB3cml0ZVBhY2tlZFZhcmludDogICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZFZhcmludCwgYXJyKTsgICB9LAogICAgICB3cml0ZVBhY2tlZFNWYXJpbnQ6ICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZFNWYXJpbnQsIGFycik7ICB9LAogICAgICB3cml0ZVBhY2tlZEJvb2xlYW46ICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZEJvb2xlYW4sIGFycik7ICB9LAogICAgICB3cml0ZVBhY2tlZEZsb2F0OiAgICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZEZsb2F0LCBhcnIpOyAgICB9LAogICAgICB3cml0ZVBhY2tlZERvdWJsZTogICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZERvdWJsZSwgYXJyKTsgICB9LAogICAgICB3cml0ZVBhY2tlZEZpeGVkMzI6ICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZEZpeGVkMzIsIGFycik7ICB9LAogICAgICB3cml0ZVBhY2tlZFNGaXhlZDMyOiBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZFNGaXhlZDMyLCBhcnIpOyB9LAogICAgICB3cml0ZVBhY2tlZEZpeGVkNjQ6ICBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZEZpeGVkNjQsIGFycik7ICB9LAogICAgICB3cml0ZVBhY2tlZFNGaXhlZDY0OiBmdW5jdGlvbih0YWcsIGFycikgeyBpZiAoYXJyLmxlbmd0aCkgdGhpcy53cml0ZU1lc3NhZ2UodGFnLCB3cml0ZVBhY2tlZFNGaXhlZDY0LCBhcnIpOyB9LAoKICAgICAgd3JpdGVCeXRlc0ZpZWxkOiBmdW5jdGlvbih0YWcsIGJ1ZmZlcikgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5CeXRlcyk7CiAgICAgICAgICB0aGlzLndyaXRlQnl0ZXMoYnVmZmVyKTsKICAgICAgfSwKICAgICAgd3JpdGVGaXhlZDMyRmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkZpeGVkMzIpOwogICAgICAgICAgdGhpcy53cml0ZUZpeGVkMzIodmFsKTsKICAgICAgfSwKICAgICAgd3JpdGVTRml4ZWQzMkZpZWxkOiBmdW5jdGlvbih0YWcsIHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5GaXhlZDMyKTsKICAgICAgICAgIHRoaXMud3JpdGVTRml4ZWQzMih2YWwpOwogICAgICB9LAogICAgICB3cml0ZUZpeGVkNjRGaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuRml4ZWQ2NCk7CiAgICAgICAgICB0aGlzLndyaXRlRml4ZWQ2NCh2YWwpOwogICAgICB9LAogICAgICB3cml0ZVNGaXhlZDY0RmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkZpeGVkNjQpOwogICAgICAgICAgdGhpcy53cml0ZVNGaXhlZDY0KHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlVmFyaW50RmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLlZhcmludCk7CiAgICAgICAgICB0aGlzLndyaXRlVmFyaW50KHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlU1ZhcmludEZpZWxkOiBmdW5jdGlvbih0YWcsIHZhbCkgewogICAgICAgICAgdGhpcy53cml0ZVRhZyh0YWcsIFBiZi5WYXJpbnQpOwogICAgICAgICAgdGhpcy53cml0ZVNWYXJpbnQodmFsKTsKICAgICAgfSwKICAgICAgd3JpdGVTdHJpbmdGaWVsZDogZnVuY3Rpb24odGFnLCBzdHIpIHsKICAgICAgICAgIHRoaXMud3JpdGVUYWcodGFnLCBQYmYuQnl0ZXMpOwogICAgICAgICAgdGhpcy53cml0ZVN0cmluZyhzdHIpOwogICAgICB9LAogICAgICB3cml0ZUZsb2F0RmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkZpeGVkMzIpOwogICAgICAgICAgdGhpcy53cml0ZUZsb2F0KHZhbCk7CiAgICAgIH0sCiAgICAgIHdyaXRlRG91YmxlRmllbGQ6IGZ1bmN0aW9uKHRhZywgdmFsKSB7CiAgICAgICAgICB0aGlzLndyaXRlVGFnKHRhZywgUGJmLkZpeGVkNjQpOwogICAgICAgICAgdGhpcy53cml0ZURvdWJsZSh2YWwpOwogICAgICB9LAogICAgICB3cml0ZUJvb2xlYW5GaWVsZDogZnVuY3Rpb24odGFnLCB2YWwpIHsKICAgICAgICAgIHRoaXMud3JpdGVWYXJpbnRGaWVsZCh0YWcsIEJvb2xlYW4odmFsKSk7CiAgICAgIH0KICB9OwoKICBmdW5jdGlvbiByZWFkVmFyaW50UmVtYWluZGVyKGwsIHMsIHApIHsKICAgICAgdmFyIGJ1ZiA9IHAuYnVmLAogICAgICAgICAgaCwgYjsKCiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggID0gKGIgJiAweDcwKSA+PiA0OyAgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggfD0gKGIgJiAweDdmKSA8PCAzOyAgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggfD0gKGIgJiAweDdmKSA8PCAxMDsgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggfD0gKGIgJiAweDdmKSA8PCAxNzsgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggfD0gKGIgJiAweDdmKSA8PCAyNDsgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CiAgICAgIGIgPSBidWZbcC5wb3MrK107IGggfD0gKGIgJiAweDAxKSA8PCAzMTsgaWYgKGIgPCAweDgwKSByZXR1cm4gdG9OdW0obCwgaCwgcyk7CgogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHZhcmludCBub3QgbW9yZSB0aGFuIDEwIGJ5dGVzJyk7CiAgfQoKICBmdW5jdGlvbiByZWFkUGFja2VkRW5kKHBiZikgewogICAgICByZXR1cm4gcGJmLnR5cGUgPT09IFBiZi5CeXRlcyA/CiAgICAgICAgICBwYmYucmVhZFZhcmludCgpICsgcGJmLnBvcyA6IHBiZi5wb3MgKyAxOwogIH0KCiAgZnVuY3Rpb24gdG9OdW0obG93LCBoaWdoLCBpc1NpZ25lZCkgewogICAgICBpZiAoaXNTaWduZWQpIHsKICAgICAgICAgIHJldHVybiBoaWdoICogMHgxMDAwMDAwMDAgKyAobG93ID4+PiAwKTsKICAgICAgfQoKICAgICAgcmV0dXJuICgoaGlnaCA+Pj4gMCkgKiAweDEwMDAwMDAwMCkgKyAobG93ID4+PiAwKTsKICB9CgogIGZ1bmN0aW9uIHdyaXRlQmlnVmFyaW50KHZhbCwgcGJmKSB7CiAgICAgIHZhciBsb3csIGhpZ2g7CgogICAgICBpZiAodmFsID49IDApIHsKICAgICAgICAgIGxvdyAgPSAodmFsICUgMHgxMDAwMDAwMDApIHwgMDsKICAgICAgICAgIGhpZ2ggPSAodmFsIC8gMHgxMDAwMDAwMDApIHwgMDsKICAgICAgfSBlbHNlIHsKICAgICAgICAgIGxvdyAgPSB+KC12YWwgJSAweDEwMDAwMDAwMCk7CiAgICAgICAgICBoaWdoID0gfigtdmFsIC8gMHgxMDAwMDAwMDApOwoKICAgICAgICAgIGlmIChsb3cgXiAweGZmZmZmZmZmKSB7CiAgICAgICAgICAgICAgbG93ID0gKGxvdyArIDEpIHwgMDsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgbG93ID0gMDsKICAgICAgICAgICAgICBoaWdoID0gKGhpZ2ggKyAxKSB8IDA7CiAgICAgICAgICB9CiAgICAgIH0KCiAgICAgIGlmICh2YWwgPj0gMHgxMDAwMDAwMDAwMDAwMDAwMCB8fCB2YWwgPCAtMHgxMDAwMDAwMDAwMDAwMDAwMCkgewogICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiB2YXJpbnQgZG9lc25cJ3QgZml0IGludG8gMTAgYnl0ZXMnKTsKICAgICAgfQoKICAgICAgcGJmLnJlYWxsb2MoMTApOwoKICAgICAgd3JpdGVCaWdWYXJpbnRMb3cobG93LCBoaWdoLCBwYmYpOwogICAgICB3cml0ZUJpZ1ZhcmludEhpZ2goaGlnaCwgcGJmKTsKICB9CgogIGZ1bmN0aW9uIHdyaXRlQmlnVmFyaW50TG93KGxvdywgaGlnaCwgcGJmKSB7CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSA9IGxvdyAmIDB4N2YgfCAweDgwOyBsb3cgPj4+PSA3OwogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gPSBsb3cgJiAweDdmIHwgMHg4MDsgbG93ID4+Pj0gNzsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdID0gbG93ICYgMHg3ZiB8IDB4ODA7IGxvdyA+Pj49IDc7CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSA9IGxvdyAmIDB4N2YgfCAweDgwOyBsb3cgPj4+PSA3OwogICAgICBwYmYuYnVmW3BiZi5wb3NdICAgPSBsb3cgJiAweDdmOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVCaWdWYXJpbnRIaWdoKGhpZ2gsIHBiZikgewogICAgICB2YXIgbHNiID0gKGhpZ2ggJiAweDA3KSA8PCA0OwoKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdIHw9IGxzYiAgICAgICAgIHwgKChoaWdoID4+Pj0gMykgPyAweDgwIDogMCk7IGlmICghaGlnaCkgcmV0dXJuOwogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gID0gaGlnaCAmIDB4N2YgfCAoKGhpZ2ggPj4+PSA3KSA/IDB4ODAgOiAwKTsgaWYgKCFoaWdoKSByZXR1cm47CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSAgPSBoaWdoICYgMHg3ZiB8ICgoaGlnaCA+Pj49IDcpID8gMHg4MCA6IDApOyBpZiAoIWhpZ2gpIHJldHVybjsKICAgICAgcGJmLmJ1ZltwYmYucG9zKytdICA9IGhpZ2ggJiAweDdmIHwgKChoaWdoID4+Pj0gNykgPyAweDgwIDogMCk7IGlmICghaGlnaCkgcmV0dXJuOwogICAgICBwYmYuYnVmW3BiZi5wb3MrK10gID0gaGlnaCAmIDB4N2YgfCAoKGhpZ2ggPj4+PSA3KSA/IDB4ODAgOiAwKTsgaWYgKCFoaWdoKSByZXR1cm47CiAgICAgIHBiZi5idWZbcGJmLnBvcysrXSAgPSBoaWdoICYgMHg3ZjsKICB9CgogIGZ1bmN0aW9uIG1ha2VSb29tRm9yRXh0cmFMZW5ndGgoc3RhcnRQb3MsIGxlbiwgcGJmKSB7CiAgICAgIHZhciBleHRyYUxlbiA9CiAgICAgICAgICBsZW4gPD0gMHgzZmZmID8gMSA6CiAgICAgICAgICBsZW4gPD0gMHgxZmZmZmYgPyAyIDoKICAgICAgICAgIGxlbiA8PSAweGZmZmZmZmYgPyAzIDogTWF0aC5mbG9vcihNYXRoLmxvZyhsZW4pIC8gKE1hdGguTE4yICogNykpOwoKICAgICAgLy8gaWYgMSBieXRlIGlzbid0IGVub3VnaCBmb3IgZW5jb2RpbmcgbWVzc2FnZSBsZW5ndGgsIHNoaWZ0IHRoZSBkYXRhIHRvIHRoZSByaWdodAogICAgICBwYmYucmVhbGxvYyhleHRyYUxlbik7CiAgICAgIGZvciAodmFyIGkgPSBwYmYucG9zIC0gMTsgaSA+PSBzdGFydFBvczsgaS0tKSBwYmYuYnVmW2kgKyBleHRyYUxlbl0gPSBwYmYuYnVmW2ldOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVQYWNrZWRWYXJpbnQoYXJyLCBwYmYpICAgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlVmFyaW50KGFycltpXSk7ICAgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkU1ZhcmludChhcnIsIHBiZikgIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZVNWYXJpbnQoYXJyW2ldKTsgIH0KICBmdW5jdGlvbiB3cml0ZVBhY2tlZEZsb2F0KGFyciwgcGJmKSAgICB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVGbG9hdChhcnJbaV0pOyAgICB9CiAgZnVuY3Rpb24gd3JpdGVQYWNrZWREb3VibGUoYXJyLCBwYmYpICAgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlRG91YmxlKGFycltpXSk7ICAgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkQm9vbGVhbihhcnIsIHBiZikgIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZUJvb2xlYW4oYXJyW2ldKTsgIH0KICBmdW5jdGlvbiB3cml0ZVBhY2tlZEZpeGVkMzIoYXJyLCBwYmYpICB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVGaXhlZDMyKGFycltpXSk7ICB9CiAgZnVuY3Rpb24gd3JpdGVQYWNrZWRTRml4ZWQzMihhcnIsIHBiZikgeyBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcGJmLndyaXRlU0ZpeGVkMzIoYXJyW2ldKTsgfQogIGZ1bmN0aW9uIHdyaXRlUGFja2VkRml4ZWQ2NChhcnIsIHBiZikgIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHBiZi53cml0ZUZpeGVkNjQoYXJyW2ldKTsgIH0KICBmdW5jdGlvbiB3cml0ZVBhY2tlZFNGaXhlZDY0KGFyciwgcGJmKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBwYmYud3JpdGVTRml4ZWQ2NChhcnJbaV0pOyB9CgogIC8vIEJ1ZmZlciBjb2RlIGJlbG93IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIsIE1JVC1saWNlbnNlZAoKICBmdW5jdGlvbiByZWFkVUludDMyKGJ1ZiwgcG9zKSB7CiAgICAgIHJldHVybiAoKGJ1Zltwb3NdKSB8CiAgICAgICAgICAoYnVmW3BvcyArIDFdIDw8IDgpIHwKICAgICAgICAgIChidWZbcG9zICsgMl0gPDwgMTYpKSArCiAgICAgICAgICAoYnVmW3BvcyArIDNdICogMHgxMDAwMDAwKTsKICB9CgogIGZ1bmN0aW9uIHdyaXRlSW50MzIoYnVmLCB2YWwsIHBvcykgewogICAgICBidWZbcG9zXSA9IHZhbDsKICAgICAgYnVmW3BvcyArIDFdID0gKHZhbCA+Pj4gOCk7CiAgICAgIGJ1Zltwb3MgKyAyXSA9ICh2YWwgPj4+IDE2KTsKICAgICAgYnVmW3BvcyArIDNdID0gKHZhbCA+Pj4gMjQpOwogIH0KCiAgZnVuY3Rpb24gcmVhZEludDMyKGJ1ZiwgcG9zKSB7CiAgICAgIHJldHVybiAoKGJ1Zltwb3NdKSB8CiAgICAgICAgICAoYnVmW3BvcyArIDFdIDw8IDgpIHwKICAgICAgICAgIChidWZbcG9zICsgMl0gPDwgMTYpKSArCiAgICAgICAgICAoYnVmW3BvcyArIDNdIDw8IDI0KTsKICB9CgogIGZ1bmN0aW9uIHJlYWRVdGY4KGJ1ZiwgcG9zLCBlbmQpIHsKICAgICAgdmFyIHN0ciA9ICcnOwogICAgICB2YXIgaSA9IHBvczsKCiAgICAgIHdoaWxlIChpIDwgZW5kKSB7CiAgICAgICAgICB2YXIgYjAgPSBidWZbaV07CiAgICAgICAgICB2YXIgYyA9IG51bGw7IC8vIGNvZGVwb2ludAogICAgICAgICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPQogICAgICAgICAgICAgIGIwID4gMHhFRiA/IDQgOgogICAgICAgICAgICAgIGIwID4gMHhERiA/IDMgOgogICAgICAgICAgICAgIGIwID4gMHhCRiA/IDIgOiAxOwoKICAgICAgICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA+IGVuZCkgYnJlYWs7CgogICAgICAgICAgdmFyIGIxLCBiMiwgYjM7CgogICAgICAgICAgaWYgKGJ5dGVzUGVyU2VxdWVuY2UgPT09IDEpIHsKICAgICAgICAgICAgICBpZiAoYjAgPCAweDgwKSB7CiAgICAgICAgICAgICAgICAgIGMgPSBiMDsKICAgICAgICAgICAgICB9CiAgICAgICAgICB9IGVsc2UgaWYgKGJ5dGVzUGVyU2VxdWVuY2UgPT09IDIpIHsKICAgICAgICAgICAgICBiMSA9IGJ1ZltpICsgMV07CiAgICAgICAgICAgICAgaWYgKChiMSAmIDB4QzApID09PSAweDgwKSB7CiAgICAgICAgICAgICAgICAgIGMgPSAoYjAgJiAweDFGKSA8PCAweDYgfCAoYjEgJiAweDNGKTsKICAgICAgICAgICAgICAgICAgaWYgKGMgPD0gMHg3RikgewogICAgICAgICAgICAgICAgICAgICAgYyA9IG51bGw7CiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICB9IGVsc2UgaWYgKGJ5dGVzUGVyU2VxdWVuY2UgPT09IDMpIHsKICAgICAgICAgICAgICBiMSA9IGJ1ZltpICsgMV07CiAgICAgICAgICAgICAgYjIgPSBidWZbaSArIDJdOwogICAgICAgICAgICAgIGlmICgoYjEgJiAweEMwKSA9PT0gMHg4MCAmJiAoYjIgJiAweEMwKSA9PT0gMHg4MCkgewogICAgICAgICAgICAgICAgICBjID0gKGIwICYgMHhGKSA8PCAweEMgfCAoYjEgJiAweDNGKSA8PCAweDYgfCAoYjIgJiAweDNGKTsKICAgICAgICAgICAgICAgICAgaWYgKGMgPD0gMHg3RkYgfHwgKGMgPj0gMHhEODAwICYmIGMgPD0gMHhERkZGKSkgewogICAgICAgICAgICAgICAgICAgICAgYyA9IG51bGw7CiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICB9IGVsc2UgaWYgKGJ5dGVzUGVyU2VxdWVuY2UgPT09IDQpIHsKICAgICAgICAgICAgICBiMSA9IGJ1ZltpICsgMV07CiAgICAgICAgICAgICAgYjIgPSBidWZbaSArIDJdOwogICAgICAgICAgICAgIGIzID0gYnVmW2kgKyAzXTsKICAgICAgICAgICAgICBpZiAoKGIxICYgMHhDMCkgPT09IDB4ODAgJiYgKGIyICYgMHhDMCkgPT09IDB4ODAgJiYgKGIzICYgMHhDMCkgPT09IDB4ODApIHsKICAgICAgICAgICAgICAgICAgYyA9IChiMCAmIDB4RikgPDwgMHgxMiB8IChiMSAmIDB4M0YpIDw8IDB4QyB8IChiMiAmIDB4M0YpIDw8IDB4NiB8IChiMyAmIDB4M0YpOwogICAgICAgICAgICAgICAgICBpZiAoYyA8PSAweEZGRkYgfHwgYyA+PSAweDExMDAwMCkgewogICAgICAgICAgICAgICAgICAgICAgYyA9IG51bGw7CiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICB9CiAgICAgICAgICB9CgogICAgICAgICAgaWYgKGMgPT09IG51bGwpIHsKICAgICAgICAgICAgICBjID0gMHhGRkZEOwogICAgICAgICAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxOwoKICAgICAgICAgIH0gZWxzZSBpZiAoYyA+IDB4RkZGRikgewogICAgICAgICAgICAgIGMgLT0gMHgxMDAwMDsKICAgICAgICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKTsKICAgICAgICAgICAgICBjID0gMHhEQzAwIHwgYyAmIDB4M0ZGOwogICAgICAgICAgfQoKICAgICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpOwogICAgICAgICAgaSArPSBieXRlc1BlclNlcXVlbmNlOwogICAgICB9CgogICAgICByZXR1cm4gc3RyOwogIH0KCiAgZnVuY3Rpb24gcmVhZFV0ZjhUZXh0RGVjb2RlcihidWYsIHBvcywgZW5kKSB7CiAgICAgIHJldHVybiB1dGY4VGV4dERlY29kZXIuZGVjb2RlKGJ1Zi5zdWJhcnJheShwb3MsIGVuZCkpOwogIH0KCiAgZnVuY3Rpb24gd3JpdGVVdGY4KGJ1Ziwgc3RyLCBwb3MpIHsKICAgICAgZm9yICh2YXIgaSA9IDAsIGMsIGxlYWQ7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHsKICAgICAgICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKTsgLy8gY29kZSBwb2ludAoKICAgICAgICAgIGlmIChjID4gMHhEN0ZGICYmIGMgPCAweEUwMDApIHsKICAgICAgICAgICAgICBpZiAobGVhZCkgewogICAgICAgICAgICAgICAgICBpZiAoYyA8IDB4REMwMCkgewogICAgICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4RUY7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gMHhCRjsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEJEOwogICAgICAgICAgICAgICAgICAgICAgbGVhZCA9IGM7CiAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsKICAgICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgIGMgPSBsZWFkIC0gMHhEODAwIDw8IDEwIHwgYyAtIDB4REMwMCB8IDB4MTAwMDA7CiAgICAgICAgICAgICAgICAgICAgICBsZWFkID0gbnVsbDsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgIGlmIChjID4gMHhEQkZGIHx8IChpICsgMSA9PT0gc3RyLmxlbmd0aCkpIHsKICAgICAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEVGOwogICAgICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IDB4QkY7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gMHhCRDsKICAgICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgIGxlYWQgPSBjOwogICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgICAgICAgIH0KICAgICAgICAgIH0gZWxzZSBpZiAobGVhZCkgewogICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEVGOwogICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEJGOwogICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSAweEJEOwogICAgICAgICAgICAgIGxlYWQgPSBudWxsOwogICAgICAgICAgfQoKICAgICAgICAgIGlmIChjIDwgMHg4MCkgewogICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSBjOwogICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICBpZiAoYyA8IDB4ODAwKSB7CiAgICAgICAgICAgICAgICAgIGJ1Zltwb3MrK10gPSBjID4+IDB4NiB8IDB4QzA7CiAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgaWYgKGMgPCAweDEwMDAwKSB7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gYyA+PiAweEMgfCAweEUwOwogICAgICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IGMgPj4gMHgxMiB8IDB4RjA7CiAgICAgICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gYyA+PiAweEMgJiAweDNGIHwgMHg4MDsKICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICBidWZbcG9zKytdID0gYyA+PiAweDYgJiAweDNGIHwgMHg4MDsKICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgYnVmW3BvcysrXSA9IGMgJiAweDNGIHwgMHg4MDsKICAgICAgICAgIH0KICAgICAgfQogICAgICByZXR1cm4gcG9zOwogIH0KCiAgLy90eXBlIEFyY2dpc1Jlc3RTb3VyY2VTcGVjaWZpY2F0aW9uID0gYW55Ow0KICB2YXIgZXNyaVBiZkdlb21ldHJ5VHlwZUVudW07DQogIChmdW5jdGlvbiAoZXNyaVBiZkdlb21ldHJ5VHlwZUVudW0pIHsNCiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlUG9pbnQiXSA9IDBdID0gImVzcmlHZW9tZXRyeVR5cGVQb2ludCI7DQogICAgICBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVsiZXNyaUdlb21ldHJ5VHlwZU11bHRpcG9pbnQiXSA9IDFdID0gImVzcmlHZW9tZXRyeVR5cGVNdWx0aXBvaW50IjsNCiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlUG9seWxpbmUiXSA9IDJdID0gImVzcmlHZW9tZXRyeVR5cGVQb2x5bGluZSI7DQogICAgICBlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVsiZXNyaUdlb21ldHJ5VHlwZVBvbHlnb24iXSA9IDNdID0gImVzcmlHZW9tZXRyeVR5cGVQb2x5Z29uIjsNCiAgICAgIGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2VzcmlQYmZHZW9tZXRyeVR5cGVFbnVtWyJlc3JpR2VvbWV0cnlUeXBlTXVsdGlwYXRjaCJdID0gNF0gPSAiZXNyaUdlb21ldHJ5VHlwZU11bHRpcGF0Y2giOw0KICAgICAgZXNyaVBiZkdlb21ldHJ5VHlwZUVudW1bZXNyaVBiZkdlb21ldHJ5VHlwZUVudW1bImVzcmlHZW9tZXRyeVR5cGVOb25lIl0gPSAxMjddID0gImVzcmlHZW9tZXRyeVR5cGVOb25lIjsNCiAgfSkoZXNyaVBiZkdlb21ldHJ5VHlwZUVudW0gfHwgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtID0ge30pKTsKCiAgY2xhc3MgQ29udmVydFBiZiB7DQogICAgICBjb25zdHJ1Y3RvcihwYmZEYXRhKSB7DQogICAgICAgICAgdGhpcy5kYXRhID0gcGJmRGF0YTsNCiAgICAgIH0NCiAgICAgIGFzeW5jIGNvbnZlcnQoKSB7DQogICAgICAgICAgdmFyIF9hOw0KICAgICAgICAgIGNvbnN0IHBiZiQxID0gbmV3IHBiZih0aGlzLmRhdGEpOw0KICAgICAgICAgIGNvbnN0IHBiZkpzb24gPSBwcm90bygpLnJlYWQocGJmJDEpOw0KICAgICAgICAgIC8vIEdldCB0aGUgRmVhdHVyZVJlc3VsdA0KICAgICAgICAgIGlmIChwYmZKc29uLnF1ZXJ5UmVzdWx0ID09PSBudWxsKSB7DQogICAgICAgICAgICAgIC8vY29uc29sZS53YXJuKCdpc3N1ZSB3aXRoIHRoZSByZXN1bHQnLCBwYmZKc29uKTsNCiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUmVzcG9uc2Uoew0KICAgICAgICAgICAgICAgICAgJ2V4Y2VlZGVkVHJhbnNmZXJMaW1pdCc6IHRydWUsDQogICAgICAgICAgICAgIH0sIFtdKTsNCiAgICAgICAgICB9DQogICAgICAgICAgY29uc3QgZmVhdHVyZVJlc3VsdCA9IHBiZkpzb24ucXVlcnlSZXN1bHQuZmVhdHVyZVJlc3VsdDsNCiAgICAgICAgICAvLyBHZXQgdGhlIGZpZWxkIG5hbWVzDQogICAgICAgICAgY29uc3QgZmllbGRzID0gZmVhdHVyZVJlc3VsdC5maWVsZHMubWFwKChmaWVsZCkgPT4gZmllbGQubmFtZSk7DQogICAgICAgICAgLy8gR2V0IHRoZSB0cmFuc2xhdGlvbiBpbmZvDQogICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSBmZWF0dXJlUmVzdWx0LnRyYW5zZm9ybS50cmFuc2xhdGU7DQogICAgICAgICAgY29uc3Qgc2NhbGUgPSBmZWF0dXJlUmVzdWx0LnRyYW5zZm9ybS5zY2FsZTsNCiAgICAgICAgICBjb25zdCBnZW9tZXRyeVR5cGUgPSBmZWF0dXJlUmVzdWx0Lmdlb21ldHJ5VHlwZTsNCiAgICAgICAgICBjb25zdCBxdWFudGl6ZU9yaWdpblBvc3Rpb24gPSBmZWF0dXJlUmVzdWx0LnRyYW5zZm9ybS5xdWFudGl6ZU9yaWdpblBvc3Rpb247DQogICAgICAgICAgY29uc3Qgc3JpZCA9IChfYSA9IGZlYXR1cmVSZXN1bHQuc3BhdGlhbFJlZmVyZW5jZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLndraWQudG9TdHJpbmcoKTsNCiAgICAgICAgICBjb25zdCBmZWF0dXJlcyA9IGZlYXR1cmVSZXN1bHQuZmVhdHVyZXMubWFwKChmZWF0dXJlKSA9PiB7DQogICAgICAgICAgICAgIC8vIFBhcnNlIGVhY2ggYXR0cmlidXRlDQogICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZmVhdHVyZS5hdHRyaWJ1dGVzDQogICAgICAgICAgICAgICAgICAubWFwKChhdHRyaWJ1dGUsIGluZGV4KSA9PiAoeyAna2V5JzogZmllbGRzW2luZGV4XSwgJ3ZhbHVlJzogYXR0cmlidXRlW2F0dHJpYnV0ZVsndmFsdWVfdHlwZSddXSB9KSkNCiAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+IHsNCiAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHt9Ow0KICAgICAgICAgICAgICAgICAgbmV3T2JqW2Mua2V5XSA9IGMudmFsdWU7DQogICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5hLCAuLi5uZXdPYmogfTsNCiAgICAgICAgICAgICAgfSwge30pOw0KICAgICAgICAgICAgICAvLyBQYXJzZSB0aGUgZ2VvbWV0cmllcyBhbmQgY2xlYW4gdXAgdGhlIHF1YW50aXphdGlvbg0KICAgICAgICAgICAgICBsZXQgcmluZ3MgPSBbW1tdXV07DQogICAgICAgICAgICAgIGlmICgoZmVhdHVyZS5nZW9tZXRyeSAhPT0gbnVsbCkpIHsNCiAgICAgICAgICAgICAgICAgIGxldCBjb3VudHMgPSBnZW9tZXRyeVR5cGUgPT09IGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtLmVzcmlHZW9tZXRyeVR5cGVQb2ludCA/IFsxXSA6IChmZWF0dXJlLmdlb21ldHJ5Lmxlbmd0aHMpOw0KICAgICAgICAgICAgICAgICAgLy8gQnJlYWsgaW50byBYIGFuZCBZIHJpbmdzDQogICAgICAgICAgICAgICAgICBsZXQgeCA9IFtdOw0KICAgICAgICAgICAgICAgICAgbGV0IHkgPSBbXTsNCiAgICAgICAgICAgICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRzLmZvckVhY2goKGNvb3JkLCBpZHgpID0+IHsNCiAgICAgICAgICAgICAgICAgICAgICBpZiAoaWR4ICUgMiA9PT0gMCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgICB4LnB1c2goY29vcmQpOw0KICAgICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgeS5wdXNoKGNvb3JkKTsNCiAgICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgICAgICAgIC8vbGV0IHggPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3Jkcy5maWx0ZXIoKF86IG51bWJlciwgaWR4OiBudW1iZXIpID0+IGlkeCAlIDIgPT09IDApOw0KICAgICAgICAgICAgICAgICAgLy9sZXQgeSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRzLmZpbHRlcigoXzogbnVtYmVyLCBpZHg6IG51bWJlcikgPT4gaWR4ICUgMiA9PT0gMSk7DQogICAgICAgICAgICAgICAgICAvLyBkZXppZ3phZyB0aGUgcmluZ3MsIGFuZCBtZXJnZSArIHJlcHJvamVjdCB0aGVtDQogICAgICAgICAgICAgICAgICBsZXQgcmluZ3NYID0gZGVaaWdaYWcoeCwgY291bnRzLCBzY2FsZS54U2NhbGUsIHRyYW5zbGF0aW9uLnhUcmFuc2xhdGUsIGZhbHNlKTsNCiAgICAgICAgICAgICAgICAgIGxldCByaW5nc1kgPSBkZVppZ1phZyh5LCBjb3VudHMsIHNjYWxlLnlTY2FsZSwgdHJhbnNsYXRpb24ueVRyYW5zbGF0ZSwgcXVhbnRpemVPcmlnaW5Qb3N0aW9uID09PSAwKTsNCiAgICAgICAgICAgICAgICAgIC8vIE1lcmdlIHRoZSByaW5ncw0KICAgICAgICAgICAgICAgICAgcmluZ3MgPSBtZXJnZVJpbmdzKHJpbmdzWCwgcmluZ3NZLCBzcmlkKTsNCiAgICAgICAgICAgICAgICAgIC8vcmluZ3MgPSByaW5nc1gubWFwKChyaW5nLCBpKSA9PiByaW5nLm1hcCgoeCwgaikgPT4gW3gsIHJpbmdzWVtpXVtqXV0pKTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICBsZXQgZ2VvbWV0cnkgPSB7fTsNCiAgICAgICAgICAgICAgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlUG9pbnQnKSB7DQogICAgICAgICAgICAgICAgICBnZW9tZXRyeSA9IHsgJ3gnOiByaW5nc1swXVswXVswXSwgJ3knOiByaW5nc1swXVswXVsxXSB9Ow0KICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgIGVsc2UgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlTXVsdGlQb2ludCcpIHsNCiAgICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0geyAncG9pbnRzJzogcmluZ3NbMF0gfTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICBlbHNlIGlmIChlc3JpUGJmR2VvbWV0cnlUeXBlRW51bVtnZW9tZXRyeVR5cGVdID09PSAnZXNyaUdlb21ldHJ5VHlwZVBvbHlsaW5lJykgew0KICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkgPSB7IHBhdGhzOiByaW5ncyB9Ow0KICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgIGVsc2UgaWYgKGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2dlb21ldHJ5VHlwZV0gPT09ICdlc3JpR2VvbWV0cnlUeXBlUG9seWdvbicpIHsNCiAgICAgICAgICAgICAgICAgIGdlb21ldHJ5ID0geyByaW5nczogcmluZ3MgfTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICByZXR1cm4gew0KICAgICAgICAgICAgICAgICAgJ2dlb21ldHJ5JzogZ2VvbWV0cnksDQogICAgICAgICAgICAgICAgICAnYXR0cmlidXRlcyc6IGF0dHJpYnV0ZXMsDQogICAgICAgICAgICAgIH07DQogICAgICAgICAgfSk7DQogICAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUmVzcG9uc2UoZmVhdHVyZVJlc3VsdCwgZmVhdHVyZXMpOw0KICAgICAgfQ0KICAgICAgX2J1aWxkUmVzcG9uc2UoZmVhdHVyZVJlc3VsdCwgZmVhdHVyZXMpIHsNCiAgICAgICAgICByZXR1cm4gew0KICAgICAgICAgICAgICAnZmVhdHVyZXMnOiBmZWF0dXJlcywNCiAgICAgICAgICAgICAgJ2V4Y2VlZGVkVHJhbnNmZXJMaW1pdCc6IGZlYXR1cmVSZXN1bHQuZXhjZWVkZWRUcmFuc2ZlckxpbWl0LA0KICAgICAgICAgICAgICAnc3BhdGlhbFJlZmVyZW5jZSc6IHsgJ3draWQnOiA0MzI2LCAnbGF0ZXN0V2tpZCc6IDQzMjYgfSwNCiAgICAgICAgICAgICAgJ2dlb21ldHJ5VHlwZSc6IGVzcmlQYmZHZW9tZXRyeVR5cGVFbnVtW2ZlYXR1cmVSZXN1bHQuZ2VvbWV0cnlUeXBlIHx8IDEyN10ucmVwbGFjZSgnVHlwZScsICcnKSwNCiAgICAgICAgICAgICAgJ2hhc00nOiBmZWF0dXJlUmVzdWx0Lmhhc00sDQogICAgICAgICAgICAgICdoYXNaJzogZmVhdHVyZVJlc3VsdC5oYXNaLA0KICAgICAgICAgICAgICAnZ2xvYmFsSWRGaWVsZE5hbWUnOiBmZWF0dXJlUmVzdWx0Lmdsb2JhbElkRmllbGROYW1lDQogICAgICAgICAgfTsNCiAgICAgIH0NCiAgfQoKICBjbGFzcyBHZW9tZXRyaWVzQXRab29tIHsNCiAgICAgIGNvbnN0cnVjdG9yKCkgew0KICAgICAgICAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBnZW9tZXRyaWVzIHRoYXQgaGF2ZSBhbHJlYWR5IGJlZW4gbG9hZGVkDQogICAgICAgICAgdGhpcy5fZ2VvbWV0cmllc0F0Wm9vbSA9IG5ldyBBcnJheSgyNCk7DQogICAgICAgICAgdGhpcy5fbWF4R2VvbWV0cnlab29tID0gMDsNCiAgICAgIH0NCiAgICAgIGFzeW5jIGdldEtleXNBdFpvb20oem9vbSwgbWF4Wm9vbSkgew0KICAgICAgICAgIC8vIERldGVybWluZSB0aGUgbWF4IHpvb20gYmFzZWQgb24gdGhlIHVzZXIgaW5wdXQsIHRoZSBtYXAncyBtYXh6b29tLCBvciB0aGUgbWF4em9vbSB3ZSBoYXZlIGNhY2hlZA0KICAgICAgICAgIG1heFpvb20gPSBtYXhab29tICE9PSB1bmRlZmluZWQgPyBtYXhab29tIDogdGhpcy5fbWF4R2VvbWV0cnlab29tOw0KICAgICAgICAgIGNvbnN0IGdlb21ldHJ5R3JvdXBzID0gW107DQogICAgICAgICAgZm9yIChsZXQgeiA9IChNYXRoLm1pbihtYXhab29tLCB0aGlzLl9tYXhHZW9tZXRyeVpvb20pKTsgeiA+PSB6b29tOyB6LS0pIHsNCiAgICAgICAgICAgICAgaWYgKHRoaXMuX2dlb21ldHJpZXNBdFpvb21bel0gIT09IHVuZGVmaW5lZCkgew0KICAgICAgICAgICAgICAgICAgZ2VvbWV0cnlHcm91cHMucHVzaChbLi4udGhpcy5fZ2VvbWV0cmllc0F0Wm9vbVt6XS5rZXlzKCldKTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgIH0NCiAgICAgICAgICByZXR1cm4gZ2VvbWV0cnlHcm91cHMuZmxhdCgpOw0KICAgICAgfQ0KICAgICAgdXBkYXRlS2V5QXRab29tKHpvb20sIHByaW1hcnlLZXkpIHsNCiAgICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSAnYWRkZWQnOw0KICAgICAgICAgIGlmICh0aGlzLl9nZW9tZXRyaWVzQXRab29tW3pvb21dID09PSB1bmRlZmluZWQpDQogICAgICAgICAgICAgIHRoaXMuX2dlb21ldHJpZXNBdFpvb21bem9vbV0gPSBuZXcgTWFwKCk7DQogICAgICAgICAgdGhpcy5fbWF4R2VvbWV0cnlab29tID0gTWF0aC5tYXgodGhpcy5fbWF4R2VvbWV0cnlab29tLCB6b29tKTsNCiAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHpvb207IHorKykgew0KICAgICAgICAgICAgICBpZiAodGhpcy5fZ2VvbWV0cmllc0F0Wm9vbVt6XSAhPT0gdW5kZWZpbmVkKSB7DQogICAgICAgICAgICAgICAgICB0aGlzLl9nZW9tZXRyaWVzQXRab29tW3pdLmRlbGV0ZShwcmltYXJ5S2V5KTsNCiAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gJ3VwZGF0ZWQnOw0KICAgICAgICAgICAgICB9DQogICAgICAgICAgfQ0KICAgICAgICAgIHRoaXMuX2dlb21ldHJpZXNBdFpvb21bem9vbV0uc2V0KHByaW1hcnlLZXksIHRydWUpOw0KICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTsNCiAgICAgIH0NCiAgICAgIGFzeW5jIHVwZGF0ZUtleXNBdFpvb20oem9vbSwgcHJpbWFyeUtleXMpIHsNCiAgICAgICAgICByZXR1cm4gcHJpbWFyeUtleXMubWFwKHByaW1hcnlLZXkgPT4gdGhpcy51cGRhdGVLZXlBdFpvb20oem9vbSwgcHJpbWFyeUtleSkpOw0KICAgICAgfQ0KICB9CgogIGNvbnN0IGxpYnJhcmllcyA9IHsNCiAgICAgICdDb252ZXJ0UGJmJzogQ29udmVydFBiZiwNCiAgICAgICdHZW9tZXRyaWVzQXRab29tJzogR2VvbWV0cmllc0F0Wm9vbSwNCiAgICAgICdEZVppZ1phZ0pTT04nOiBEZVppZ1phZ0pTT04NCiAgfTsNCiAgbGV0IHN1YkNsYXNzOw0KICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBlID0+IHsNCiAgICAgIGNvbnN0IGRhdGEgPSAoZS5kYXRhIHx8IGUpOw0KICAgICAgY29uc3QgcG9zdCA9IChpZCwgZXJyLCByZXMsIHR5cGUpID0+IHsNCiAgICAgICAgICBwb3N0TWVzc2FnZSh7DQogICAgICAgICAgICAgIHR5cGU6IHR5cGUgPyB0eXBlIDogKGVyciA/ICdlcnJvcicgOiAncmVzcG9uc2UnKSwNCiAgICAgICAgICAgICAgaWQ6IGlkLA0KICAgICAgICAgICAgICBtZXNzYWdlOiByZXMsDQogICAgICAgICAgICAgIGVycm9yOiBlcnINCiAgICAgICAgICB9KTsNCiAgICAgIH07DQogICAgICBjb25zdCBjb21tYW5kcyA9IHsNCiAgICAgICAgICAnaW5pdCc6IChtc2cpID0+IHsNCiAgICAgICAgICAgICAgY29uc3QgeyBpZCwgY29tbWFuZCwgbWVzc2FnZSB9ID0gbXNnOw0KICAgICAgICAgICAgICBzdWJDbGFzcyA9IG5ldyBsaWJyYXJpZXNbY29tbWFuZF0oLi4ubWVzc2FnZSk7DQogICAgICAgICAgICAgIC8vIHJldHVybiB0aGUgY2xhc3MnIG1ldGhvZHMNCiAgICAgICAgICAgICAgY29uc3QgZm5zID0gWw0KICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobGlicmFyaWVzW2NvbW1hbmRdLnByb3RvdHlwZSksDQogICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhzdWJDbGFzcykNCiAgICAgICAgICAgICAgXS5tYXAoa2V5ID0+IFtrZXksIHR5cGVvZiBsaWJyYXJpZXNbY29tbWFuZF0ucHJvdG90eXBlW2tleV1dKQ0KICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gKHsgLi4uYSwgLi4ueyBbY1swXV06IGNbMV0gfSB9KSwge30pOw0KICAgICAgICAgICAgICBwb3N0KGlkLCB1bmRlZmluZWQsIGZucywgJ2luaXRfcmVzcG9uc2UnKTsNCiAgICAgICAgICB9LA0KICAgICAgICAgICdnZXQnOiBmdW5jdGlvbiAobXNnKSB7DQogICAgICAgICAgICAgIGNvbnN0IHsgaWQsIGNvbW1hbmQgfSA9IG1zZzsNCiAgICAgICAgICAgICAgaWYgKHN1YkNsYXNzICYmIHN1YkNsYXNzW2NvbW1hbmRdKSB7DQogICAgICAgICAgICAgICAgICBwb3N0KGlkLCB1bmRlZmluZWQsIHN1YkNsYXNzW2NvbW1hbmRdKTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICAgIHBvc3QoaWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgIH0sDQogICAgICAgICAgJ2V4ZWMnOiBmdW5jdGlvbiAobXNnKSB7DQogICAgICAgICAgICAgIGNvbnN0IHsgaWQsIGNvbW1hbmQsIG1lc3NhZ2UgfSA9IG1zZzsNCiAgICAgICAgICAgICAgaWYgKHN1YkNsYXNzICYmIHN1YkNsYXNzW2NvbW1hbmRdICYmIHR5cGVvZiBzdWJDbGFzc1tjb21tYW5kXSA9PT0gJ2Z1bmN0aW9uJykgew0KICAgICAgICAgICAgICAgICAgY29uc3QgY21kID0gc3ViQ2xhc3NbY29tbWFuZF0NCiAgICAgICAgICAgICAgICAgICAgICAuYXBwbHkoc3ViQ2xhc3MsIG1lc3NhZ2UpOw0KICAgICAgICAgICAgICAgICAgaWYgKCEhY21kICYmIHR5cGVvZiBjbWQudGhlbiA9PT0gJ2Z1bmN0aW9uJykgew0KICAgICAgICAgICAgICAgICAgICAgIC8vIEl0J3MgYSBwcm9taXNlLCBzbyB3YWl0IGZvciBpdA0KICAgICAgICAgICAgICAgICAgICAgIGNtZA0KICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4gcG9zdChpZCwgdW5kZWZpbmVkLCByZXMpKQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZSA9PiBwb3N0KGlkLCBlKSk7DQogICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICAgICAgICAvLyBOb3QgYSBwcm9taXNlLCBqdXN0IHJldHVybiBpdA0KICAgICAgICAgICAgICAgICAgICAgIHBvc3QoaWQsIHVuZGVmaW5lZCwgY21kKTsNCiAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICAgIC8vIEVycm9yDQogICAgICAgICAgICAgICAgICBwb3N0KGlkLCBuZXcgRXJyb3IoYGNvbW1hbmQgIiR7Y29tbWFuZH0iIG5vdCBmb3VuZGApKTsNCiAgICAgICAgICAgICAgfQ0KICAgICAgICAgIH0NCiAgICAgIH07DQogICAgICBpZiAoY29tbWFuZHNbZGF0YS50eXBlXSkgew0KICAgICAgICAgIGNvbW1hbmRzW2RhdGEudHlwZV0oZGF0YSk7DQogICAgICB9DQogIH0pOwoKICBleHBvcnRzLmxpYnJhcmllcyA9IGxpYnJhcmllczsKCiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTsKCiAgcmV0dXJuIGV4cG9ydHM7Cgp9KSh7fSk7Cgo=', null, false);
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
          const pbf$1 = new pbf(this.data);
          const pbfJson = proto().read(pbf$1);
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
              super(id, { 'type': 'geojson', collectResourceTiming: false }, dispatcher, eventedParent);
              this._quantizedQuery = false;
              this._requestFormat = 'json';
              this._geometriesAtZoom = createActor('GeometriesAtZoom');
              this._requests = [];
              this._sortableFields = [];
              this._events = new mapLibrary['Evented'];
              this._liveLayer = false;
              this._waitTimes = {};
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
              this._asyncLoad(map).then(() => super.load());
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
                          newFeatures[idx].geometry;
                          return {
                              id: ids[idx],
                              newGeometry: newFeatures[idx].geometry
                          };
                      }
                  }).filter(idx => idx !== undefined)
              };
              if (dataDiff.update.length || dataDiff.add.length) {
                  if (this.updateData && false) {
                      // TODO Maplibre version 3!
                      // This is untested, so don't enable it!
                      this.updateData(dataDiff);
                  }
                  else {
                      // Update the _data in place
                      const currentFeatures = this._data.features;
                      const currentFeaturesIds = currentFeatures.map(feature => feature.properties[this.promoteId]);
                      // these functions were tested on on jsbench.me, and for loops are the fastest
                      for (let i = 0; i < dataDiff.update.length; i++) {
                          let featureIdx = currentFeaturesIds.indexOf(dataDiff.update[i].id);
                          if (featureIdx > -1) {
                              currentFeatures[featureIdx].geometry = dataDiff.update[i].newGeometry;
                          }
                      }
                      for (let i = 0; i < dataDiff.add.length; i++) {
                          currentFeatures.push(dataDiff.add[i]);
                      }
                      this.setData(this._data);
                  }
              }
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
                  'where': this._options.where,
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
              // Uses listeners are a debouncer
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
