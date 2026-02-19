import "ol/ol.css";
import {Map, View} from 'ol';
import {fromLonLat} from "ol/proj";
import useMapLayers from "@/map/mapLayers.js";
import {usePlaneLayers} from "@/map/planeLayers.js";
import {useEvents} from "@/map/events.js";
import {usePlaneUpdate} from "@/map/update.js";

export async function initMap(container) {
    const center = fromLonLat([116.4247, 39.9056]);
    const map = new Map({
        target: container,
        view: new View({
            center: center,
            zoom: 4,
            maxZoom: 13,
            minZoom: 1
        }),
    });

    useMapLayers().forEach((layer) => {
        map.addLayer(layer);
    })

    const planeLayers = await usePlaneLayers();
    planeLayers.forEach((layer) => {
        map.addLayer(layer);
    })

    const { attachMove, attachClick } = useEvents(map);

    attachMove();
    attachClick();

    usePlaneUpdate(map);
}