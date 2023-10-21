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
  position?: ControlPosition,
  style?: string | StyleSpecification,
  scrollZoom?: boolean
};

export default function OverviewMap(mapLibrary: typeof MapLibrary) {
  return class OverviewMapControl implements IControl {
    _overviewMap: MapLibraryMap;
    _mainMap: MapLibraryMap | undefined;
    _container: HTMLElement;
    _extent: FeatureCollection = blankGeoJsonFeature();
    _moving: boolean = false;
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
        style: ''
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
        const mainStyle = this._mainMap.style.serialize();
        this._overviewMap.setStyle(mainStyle);
      }

      // Center initial center
      this._overviewMap.setCenter(this._mainMap.getCenter())

      // Update the overview map when the main map moves
      this.options.watchEvents.forEach(event => map.on(event, () => this._updateOverview(map)));
      map.once('style.load', () => this._updateOverview(map));
      this._updateOverview(map);


      // Update the main map when the overview moves
      this._overviewMap.on('movestart', () => this._updateMain(map));

      return this._container;
    }

    onRemove() {
      if (this._mainMap) {
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
        this._moving = true;
        this._overviewMap.setCenter(center);
        this._overviewMap.setZoom(newOverviewZoom);
        this._moving = false;
        (this._overviewMap.getSource('bboxSource') as GeoJSONSource)?.setData(geojson);
        this._extent = geojson;
      }
    }


    _updateMain(map: MapLibraryMap) {
      // Don't update the main map if it's already moving
      if (this._moving || !this._mainMap) return;

      const selectionExtent: FeatureCollection = JSON.parse(JSON.stringify(this._extent));
      const screenCoords = ((selectionExtent.features[0]) as Feature<Polygon>).geometry.coordinates[0].map(
        pos => this._overviewMap.project(pos as [number, number])
      );
      (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(selectionExtent);

      // Used when overzoomed
      const overZoomOffset = Math.max(this._overviewMap.getZoom() - this._mainMap.getZoom(), this.options.zoomLevelOffset);

      const moving = () => {
        const currentSelectionExtentCoordinates = screenCoords
          .map(pos => this._overviewMap.unproject([pos.x, pos.y]))
          .map(xy => [xy.lng, xy.lat]);
        const geojson = blankGeoJsonFeature();
        geojson.features.push({
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [currentSelectionExtentCoordinates]
          }
        });
        (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(geojson);
      };

      const done = () => {
        this._overviewMap.off('move', moving);
        this._overviewMap.off('moveend', done);
        if (this._mainMap) {

          // Deal with the overview map being outside of its minZoom (TODO or max zoom)
          let newCenter = this._overviewMap.getCenter();

          const newMainZoom = between(
            this._mainMap.getMinZoom(),
            this._overviewMap.getZoom() - overZoomOffset,
            this._mainMap.getMaxZoom()
          );

          this._moving = true;
          this._mainMap.once('moveend', (e: any) => e.doneEvents && e.doneEvents());
          this._mainMap.easeTo({
            center: newCenter,
            zoom: newMainZoom
          }, {
            doneEvents: () => {
              (this._overviewMap.getSource('selectionSource') as GeoJSONSource)?.setData(blankGeoJsonFeature());
              this._moving = false;
              this._updateOverview(map);
            }
          });
        }
      };
      this._overviewMap.once('moveend', done);
      this._overviewMap.on('move', moving);
    }
  }
};
