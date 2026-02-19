import {fromLonLat} from "ol/proj";
import {Feature} from "ol";
import Point from "ol/geom/Point";

export function usePlaneUpdate(map) {

    let lastUpdateTime = 0;
    let lastRemoteTime = 0;
    const MIN_UPDATE_TIME = 15000;
    let remoteState = null;

    function update() {
        requestAnimationFrame(() => {
            update();
        });

        // 更新逻辑

        const date = Date.now();
        if (date - lastRemoteTime > MIN_UPDATE_TIME) {
            lastRemoteTime = date;
            console.log("获取远程数据");
            // todo fetchState().then(data => {  }) remoteData = xxx;
        }

        const zoom = map.getView().getZoom();
        if (date - lastUpdateTime > getInterval(zoom)) {
            console.log('update');
            lastUpdateTime = date;
            updateLayer();
        }
    }

    /**
     * 更新飞机图层
     */
    function updateLayer() {
        if (remoteState) {
            // 处理远程数据
            applyRemoteState();
        }
        // 更新数据
        updatePlaneLayer();
        updatePathLayer();
    }

    /**
     * 更新数据
     */
    function updatePlaneLayer() {
        console.log('updatePlaneLayer');
        const layers = map.getLayers().getArray();
        const planeLayer = layers.find(layer => layer.get('name') === 'plane');
        const features = planeLayer.getSource().getFeatures();
        for (let feature of features) {
            const lon = feature.get('lon');
            const lat = feature.get('lat');
            const velocity = feature.get('velocity')
            const heading = feature.get('heading');
            const timePosition = feature.get('timePosition');
            if (!heading || !velocity) {
                continue;
            }
            const [x, y] = fromLonLat([lon, lat]);
            const t = (Date.now() - timePosition) / 1000;
            const d = velocity * t;
            // console.log(11,heading,t, d, x, y);

            const newPoint = [x + d * Math.sin(heading), y + d * Math.cos(heading)];
            // console.log('newPoint', newPoint);
            feature.getGeometry().setCoordinates(newPoint);
        }
    }

    function updatePathLayer() {
        const layers = map.getLayers().getArray();
        const pathLayer = layers.find(layer => layer.get('name') === 'path');
        const features = pathLayer.getSource().getFeatures();
        const feature = features[0];
        if (!feature) return;
        const pathPoints = feature.getGeometry().getCoordinates();

        const icao24 = feature.get('icao24');
        const planeLayer = layers.find(layer => layer.get('name') === 'plane');
        console.log('planeLayer', planeLayer);
        const planeSources = pathLayer.getSource();
        const planeFeatures = planeSources.getFeatures();
        console.log('planeFeatures', planeFeatures);
        const currentPlane = planeFeatures.find(feature => feature.get('icao24') === icao24);
        if (!currentPlane) {
            return;
        }
        console.log('pathPoints', pathPoints);
        pathPoints[pathPoints.length - 1] = currentPlane.getGeometry().getCoordinates();
        feature.getGeometry().setCoordinates([...pathPoints]);

    }

    /**
     * 应用远程数据
     */
    function applyRemoteState() {
        const layers = map.getLayers().getArray();
        const airPlaneSources = layers.find(layer => layer.get('name') === 'plane').getSource();
        const airPlaneFeatures = airPlaneSources.getFeatures();

        // 远程数据的map O(1)
        const remoteStateMap = new Map();
        for (let state of remoteState) {
            remoteStateMap.set(state.icao24, state);
        }
        // 使用远程数据更新
        for (let feature of airPlaneFeatures) {
            const icao24 = feature.get('icao24');
            const state = remoteStateMap.get(icao24);
            if (!state) {
                // remoteStateMap.delete(icao24);
                feature.clear(feature);
                continue;
            }
            feature.set("velocity", state.velocity);
            feature.set("heading", state.heading);
            feature.set("lon", state.lon);
            feature.set("lat", state.lat);
            feature.set("timePosition", state.timePosition);
            feature.set("altitude", state.altitude);
            remoteStateMap.delete(icao24);
        }

        for (const [_, state] of remoteStateMap) {
            const feature = new Feature(
                {
                    geometry: new Point(fromLonLat([state.lon, state.lat])),
                    ...state,
                    isHovered: 0,
                    isSelected: 0
                }
            )
            airPlaneSources.addFeatures([feature]);
        }
        remoteState = null;
    }

    /**
     * 更新频率
     * @param zoom
     * @returns {number|number}
     */
    function getInterval(zoom) {
        zoom = Math.floor(zoom);
        return [20000, 10000, 5000, 4000, 3000, 2000, 5000, 500, 100, 50][zoom] || 2000
    }

    update();
}