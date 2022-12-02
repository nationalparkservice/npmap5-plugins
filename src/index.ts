import {
  IControl,
  Map as MapLibraryMap,
  default as MapLibrary,
  StyleSpecification,
  MapEventType,
  GeoJSONSource,
  ControlPosition,
  FillLayerSpecification
} from 'maplibre-gl';
import { FeatureCollection, Polygon, Position, Feature } from 'geojson';

const blankGeoJsonFeature = () => ({
  "type": "FeatureCollection",
  "features": []
} as FeatureCollection);

const between = (min: number, value: number, max: number) =>
  Math.min(max, Math.max(min, value));


export type overviewMapOptions = {
  zoomLevelOffset?: number,
  watchEvents?: Array<keyof MapEventType>,
  overlayPaint?: FillLayerSpecification['paint'],
  selectionPaint?: FillLayerSpecification['paint'],
  width?: number,
  height?: number,
  /** Where to display the control "top-left" | "top-right" | "bottom-left" | "bottom-right" */
  position?: ControlPosition,
  style?: string | StyleSpecification,
  /** True/false allow scroll on zoom */
  scrollZoom?: boolean,
  /** Amount of pixel to pan map on keypress, defaults to 15 */
  _keyboardPanStep?: number
};

export default function OverviewMap(mapLibrary: typeof MapLibrary) {
  return class OverviewMapControl implements IControl {
    _overviewMap: MapLibraryMap;
    _mainMap: MapLibraryMap | undefined;
    _container: HTMLElement;
    _extent: FeatureCollection = blankGeoJsonFeature();
    _moving: boolean = false;
    _easingMain: boolean = false;
    _mapLibrary: typeof MapLibrary;
    options: Required<overviewMapOptions>;

    constructor(options: overviewMapOptions) {

      // Create a container for the overview map
      this._container = document.createElement("div");

      this._container.className = "maplibregl-ctrl-overview-map maplibregl-ctrl";
      this._container.addEventListener("contextmenu", (e) => e.preventDefault());

      // options
      const defaultOptions = {
        zoomLevelOffset: -5,
        watchEvents: ['move', 'rotate', 'pitch'] as Array<keyof MapEventType>,
        overlayPaint: {
          'fill-color': '#d29700',
          'fill-opacity': 0.75
        },
        selectionPaint: {
          'fill-color': '#d29700',
          'fill-opacity': 0.25,
          'fill-outline-color': '#000000'
        },
        width: 150,
        height: 150,
        style: '',
        _keyboardPanStep: 15
      } as Required<overviewMapOptions>;

      this.options = { ...defaultOptions, ...options };
      this._mapLibrary = mapLibrary;
      this._container.setAttribute('style', `width: ${this.options.width}px; height: ${this.options.height}px;`);

      // Create the map for the overview
      this._overviewMap = new mapLibrary.Map({
        container: this._container,
        style: this.options.style,
        interactive: true,
        pitchWithRotate: false,
        attributionControl: false,
        boxZoom: false,
        dragRotate: false,
        touchZoomRotate: false,
        touchPitch: false,
        minZoom: -2
      });

      this._overviewMap.on('load', () => {
        this._overviewMap.transform.latRange = [
          this._overviewMap.transform.maxValidLatitude * -2,
          this._overviewMap.transform.maxValidLatitude * 2
        ];

        this._overviewMap.resize();

        this._overviewMap.addSource('bboxSource', {
          'type': 'geojson',
          'data': this._extent
        });
        this._overviewMap.addSource('selectionSource', {
          'type': 'geojson',
          'data': blankGeoJsonFeature()
        });

        // Add a new layer to visualize the polygon.
        this._overviewMap.addLayer({
          'id': 'bboxLayer',
          'type': 'fill',
          'source': 'bboxSource',
          'layout': {},
          'paint': this.options.overlayPaint
        });
        this._overviewMap.addLayer({
          'id': 'selectionFillLayer',
          'type': 'fill',
          'source': 'selectionSource',
          'layout': {},
          'paint': this.options.selectionPaint
        });
        this._overviewMap.addLayer({
          'id': 'selectionLineLayer',
          'type': 'line',
          'source': 'selectionSource',
          'layout': {},
          'paint': {
            'line-color': this.options.selectionPaint['fill-outline-color'] || '#000000',
            'line-width': 2
          }
        });
      });

    }

    onAdd(map: MapLibraryMap) {
      this._mainMap = map;

      if (this.options.style === '') {
        this._overviewMap.setStyle(this._mainMap.style.serialize());
      }

      // Disable the keyboard events, but use our own
      this._overviewMap.keyboard.disable();
      // we still use the _panstep from the keyboard events in out custom function
      this._overviewMap.keyboard._panStep = this.options._keyboardPanStep;
      //this._overviewMap.getCanvas().addEventListener('keydown', this._keyboardEvents, true);

      // Update the overview map when the main map moves
      this.options.watchEvents.forEach(event => map.on(event, () => this._updateOverview(map)));

      /////////////////////////////
      // Update Overview Map triggers
      // Once the style is loaded, start listening
      map.once('style.load', () => this._updateOverview(map));

      // Start listening when it's added
      this._updateOverview(map);

      // Update the main map when the overview moves if the map is loaded (otherwise the style.load will pick up the change)
      this._overviewMap.on('movestart', () => map.loaded() && this._updateMain(map));

      // Make the overview map take control whenever the viewview map gets clicked
      const takeControl = () => {
        map.stop();
        this._moving = false;
        this._updateMain(map);
      }
      this._overviewMap.on('mousedown', takeControl);
      this._overviewMap.on('touchstart', takeControl);

      // Forward keydown events to the main map
      this._overviewMap.getCanvas().addEventListener('keydown', (e) => {
        //e.preventDefault();
        map.stop();
        this._keyboardEvents(e);
      });
      /////////////////////////////

      return this._container;
    }

    onRemove() {
      if (this._mainMap) {
        //this._overviewMap.off('movestart', () => this._mainMap && this._moveOverview(this._mainMap));
        this.options.watchEvents
          .forEach(event => this._mainMap && this._mainMap
            .off(event, () => this._updateOverview(this._mainMap as MapLibraryMap))
          );
        this._overviewMap.off('movestart', () => this._updateMain(this._mainMap as MapLibraryMap));
      }

      if (this.options.style === '') {
        this._overviewMap.setStyle('');
      }
      this._mainMap = undefined;
    }

    _updateOverview(map: MapLibraryMap) {
      // Don't update the overview map if it's already moving
      if (this._moving || !this._overviewMap) return;
      const pixelRatio = map.getPixelRatio();
      const geojson = blankGeoJsonFeature();

      if (map) {
        const center = map.unproject([(map.getCanvas().width / pixelRatio) / 2, (map.getCanvas().height / pixelRatio) / 2])
        const bounds = map.getBounds();
        let extentCoordinates = [
          [-179.99, bounds.getNorth()] as Position,
          [179.99, bounds.getNorth()] as Position,
          [179.99, bounds.getSouth()] as Position,
          [-179.99, bounds.getSouth()] as Position,
          [-179.99, bounds.getNorth()] as Position,
        ];

        // If the extent isn't larger that the earth, create a better one
        if ((bounds.getEast() - bounds.getWest()) < 360 + (Math.abs(90 - Math.abs(90 - Math.abs(map.getBearing())))) * (map.getPitch() / 60)) {
          extentCoordinates = [
            map.unproject([0, 0]).toArray() as Position,
            map.unproject([map.getCanvas().width / pixelRatio, 0]).toArray() as Position,
            map.unproject([map.getCanvas().width / pixelRatio, map.getCanvas().height / pixelRatio]).toArray() as Position,
            map.unproject([0, map.getCanvas().height / pixelRatio]).toArray() as Position,
            map.unproject([0, 0]).toArray() as Position
          ];
        }
        geojson.features.push({
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [extentCoordinates]
          }
        } as Feature<Polygon>);

        const newOverviewZoom = between(
          this._overviewMap.getMinZoom(),
          map.getZoom() + this.options.zoomLevelOffset,
          this._overviewMap.getMaxZoom()
        );
        if (!this._easingMain) {
          this._moving = true;
          this._overviewMap.setCenter(center);
          this._overviewMap.setZoom(newOverviewZoom);
          this._moving = false;
        }
        (this._overviewMap.getSource('bboxSource') as GeoJSONSource)?.setData(geojson);
        this._extent = geojson;
      }
    }


    _updateMain(map: MapLibraryMap) {
      // Don't update the main map if it's already moving or if it doesn't exist
      if (this._moving || !this._mainMap) return;
      const moveStartCenter = this._overviewMap.getCenter();

      // Take control of the main map
      this._mainMap.stop();

      // Get the current extent, and copy it
      const selectionExtent: FeatureCollection = JSON.parse(JSON.stringify(this._extent));

      // Get the coordinates on the screen for the current map extent
      const screenCoords = ((selectionExtent.features[0]) as Feature<Polygon>).geometry.coordinates[0].map(
        pos => this._overviewMap.project(pos as [number, number])
      );

      // Update the GeoJSON object in the overview map to match the extent
      (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(selectionExtent);

      // Used when overzoomed
      const overZoomOffset = Math.max(this._overviewMap.getZoom() - this._mainMap.getZoom(), this.options.zoomLevelOffset);

      // Called when the overview map is moving
      const moving = () => {
        // Gets the current position 
        const currentSelectionExtentCoordinates = screenCoords
          .map(pos => this._overviewMap.unproject([pos.x, pos.y]))
          .map(xy => [xy.lng, xy.lat]);

        // Updates the GeoJSON to match the new position
        const geojson = blankGeoJsonFeature();
        geojson.features.push({
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [currentSelectionExtentCoordinates]
          }
        });

        // Updates the box on the overview map
        (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(geojson);
      };

      const doneEvents = () => {
        // Draw the current box on the overview map
        (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(blankGeoJsonFeature());
        this._moving = false;
        this._easingMain = false;

        // Start up the event listeners again
        this._updateOverview(map);
      };

      // Called when the overview map is done moving
      const moveend = () => {
        // Stop listening for events
        this._overviewMap.off('move', moving);
        this._overviewMap.off('moveend', moveend);
        this._overviewMap.off('mouseup', moveend);
        this._overviewMap.off('touchend', moveend);
        if (this._easingMain) return;

        // If the map and the oveview map are ready, then we can update the map's center
        if (this._mainMap) {
          // Deal with the overview map being outside of its minZoom
          let newCenter = this._overviewMap.getCenter();
          const newMainZoom = between(
            this._mainMap.getMinZoom(),
            this._overviewMap.getZoom() - overZoomOffset,
            this._mainMap.getMaxZoom()
          );

          // Check if the overview map has moved, if so, ease the main map, otherwise finish events
          if (newCenter.lng !== moveStartCenter.lng || newCenter.lat !== moveStartCenter.lat) {
            // Execute the "doneEvents" code when the map stops moving
            this._mainMap.once('moveend', (event: any) => event.doneEvents && event.doneEvents());
            this._moving = true;
            this._easingMain = true;

            this._mainMap.easeTo({
              center: newCenter,
              zoom: newMainZoom
            }, {
              doneEvents
            });
          } else {
            doneEvents();
          }
        }
      };

      this._overviewMap.on('move', moving);
      this._overviewMap.once('moveend', moveend);
      this._overviewMap.once('mouseup', moveend);
      this._overviewMap.once('touchend', moveend);
    }

    _getCenterAtPitch(map: MapLibraryMap, pitch: number, rotation: number) {
      const pixelRatio = map.getPixelRatio();
      const center = map.unproject([(map.getCanvas().width / pixelRatio) / 2, (map.getCanvas().height / pixelRatio) / 2]);
      return center;
    }

    _keyboardEvents = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      // The +1 directions are in Pixel space, not LngLat, in pixel space 0,0 it the top left
      const events = {
        "ArrowLeft": () => {
          e.preventDefault();
          return { xDir: 1 };
        },
        "ArrowRight": () => {
          e.preventDefault();
          return { xDir: -1 };
        },
        "ArrowUp": () => {
          e.preventDefault();
          return { yDir: 1 };
        },
        "ArrowDown": () => {
          e.preventDefault();
          return { yDir: -1 };
        },
        "+": () => ({ zoomDir: +1 }),
        "-": () => ({ zoomDir: -1 }),
      } as { [key: string]: () => { [key: string]: number } };

      if (events[e.key]) {
        // Update the variables
        let { xDir, yDir, zoomDir } = events[e.key]();
        xDir = xDir || 0;
        yDir = yDir || 0;
        zoomDir = zoomDir || 0;

        if (this._mainMap) {
          const zoomMain = this._mainMap.getZoom();

          // Convert the current center of the overview map to pixel space
          const overviewMapCenterPixels = this._overviewMap.project(this._overviewMap.getCenter());
          // Get the point that would be panned that center 
          const newCenter = this._overviewMap.unproject(new this._mapLibrary.Point(
            overviewMapCenterPixels.x + (xDir * this._overviewMap.keyboard._panStep),
            overviewMapCenterPixels.y + (yDir * this._overviewMap.keyboard._panStep)
          ));
          // Get the current center of the main map
          const mainMapCenterPixels = this._mainMap.project(this._mainMap.getCenter());
          // Get the new point on the main map in pixels
          const mainMapNewCenterPixels = this._mainMap.project(newCenter);

          // Define the offset to pan to
          const xyOffset = {
            x: mainMapNewCenterPixels.x - mainMapCenterPixels.x,
            y: mainMapNewCenterPixels.y - mainMapCenterPixels.y
          };

          this._mainMap.easeTo({
            duration: 300,
            easeId: 'keyboardHandler',
            easing: (t) => t * (2 - t),
            zoom: zoomDir ? Math.round(zoomMain) + zoomDir * (e.shiftKey ? 2 : 1) : zoomMain,
            offset: [xyOffset.x, xyOffset.y],
            center: this._mainMap.getCenter()
          }, { originalEvent: e });
        }
      }
    };
  }
};