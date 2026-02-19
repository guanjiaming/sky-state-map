import {Feature} from "ol";
import VectorLayer from "ol/layer/WebGLVector";
import VectorSource from "ol/source/Vector";
import {fromLonLat} from "ol/proj";
import Point from "ol/geom/Point";
import {LineString} from "ol/geom";

import planeIcon from '../assets/airplane.svg';
import mockData from '../data.json';
import {fetchFlightData} from "@/api/index.js";

const normalStyle = {
    "icon-src": planeIcon,
    "icon-width": 30,
    "icon-height": 30,
    "icon-anchor": [0.5, 0.5],
    "icon-rotate-with-view": true,
    "icon-rotation": ['get', 'heading']
}

const activeStyle = {
    ...normalStyle,
    "icon-color": "#f40"
}

export async function usePlaneLayers() {
    // await 等待数据
    const planes = await createPlane()
    return [
        ...planes,
        ...createPath(),
    ]
}

async function createPlane() {
    const states = await fetchFlightData();
    const features = states.map(item => {
        return new Feature({
            geometry: new Point(fromLonLat([item.lon, item.lat])),
            ...item,
            isHovered: 0,
            isSelected: 0,
        })
    });

    const planeLayer = new VectorLayer({
        source: new VectorSource({
            features: features,
        }),
        style: [
            {
                filter: ['==', ['+', ['get', 'isHovered'], ['get', 'isSelected']], 0],
                style: normalStyle,
            },
            {
                else: true,
                style: activeStyle,
            }
        ],
        name: "plane",
    });

    return [planeLayer];
}

function createPath() {
    const pathLayer = new VectorLayer({
        source: new VectorSource({
            features: []
        }),
        style: {
            "stroke-color": '#f40',
            "stroke-width": 2,
        },
        name: "path",
    })
    return [pathLayer]
}