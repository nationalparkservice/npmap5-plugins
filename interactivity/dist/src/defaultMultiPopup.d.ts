import { Map as maplibreMap, Popup } from 'maplibre-gl';
import { QueryFeature, popupTemplate } from '.';
import BindPopup from './bindpopup';
export default function formatter(features: Array<QueryFeature>, _: popupTemplate, map?: maplibreMap, activePopups?: Map<'tooltip' | 'popup', Map<string, BindPopup>>, parentPopup?: Popup): HTMLDivElement;
