import {Feature} from "ol";
import {LineString} from "ol/geom";
import {fromLonLat} from "ol/proj";

export function useEvents(map) {

    /**
     * 鼠标移入飞机
     */
    function attachMove() {
        let lastHoveredFeature = null;
        map.on('pointermove', (e) => {
            if (e.dragging) {
                return;
            }

            if (lastHoveredFeature) {
                lastHoveredFeature.set('isHovered', 0)
                lastHoveredFeature = null;
            }

            const features = map.getFeaturesAtPixel(e.pixel, {
                hitTolerance: 3,
                layerFilter: layer => layer.get('name') === 'plane'
            });
            const currentFeature = features[0];

            if (currentFeature) {
                lastHoveredFeature = currentFeature;
                currentFeature.set('isHovered', 1)
            } else {
                // 更改鼠标样式为 正常箭头的样式
            }
        })

    }

    /**
     * 飞机点击事件
     */
    function attachClick() {
        let lastClickedFeature = null;
        map.on('click', e => {
            if (e.dragging) {
                return;
            }

            if (lastClickedFeature) {
                lastClickedFeature.set('isClicked', 0);
                lastClickedFeature = null;
            }

            const features = map.getFeaturesAtPixel(e.pixel, {
                hitTolerance: 3,
                layerFilter: layer => layer.get('name') === 'plane'
            })

            const clickedFeature = features[0];

            if (clickedFeature) {
                addPath(clickedFeature);
                clickedFeature.set('isClicked', 1);
                lastClickedFeature = clickedFeature;
                // 移动中心点
                const center = clickedFeature.getGeometry().flatCoordinates;
                map.getView().animate({
                    center: center,
                    duration: 500,
                }, {
                    zoom: 12,
                    duration: 500,
                });
            }

        })

        const pathLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'path');

        /**
         * 飞机的路径Feature
         * @returns {Feature<LineString, {[p: string]: any}>}
         */
        function addPath(clickedFeature) {
            // todo 调用接口获取当前飞机的path路径
            const icao24 = clickedFeature.get('icao24');
            console.log(icao24);
            const mockPath = [
                {lon: 106.8097, lat: 51.9719},
                {lon: 106.7924, lat: 51.9804},
                {lon: 106.749, lat: 51.0017},
                {lon: 106.6684, lat: 51.0415},
                {lon: 106.6709, lat: 51.0403},
                {lon: 106.6645, lat: 51.0434},
            ]

            const lastPoint = clickedFeature.getGeometry().getCoordinates();

            const resultLineStrings = mockPath.map(item => {
                return fromLonLat([item.lon, item.lat]);
            })

            const pathLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'path');
            pathLayer.getSource().clear();
            pathLayer.getSource().addFeature(new Feature({
                    geometry: new LineString([...resultLineStrings, lastPoint]),
                    icao24,
                })
            );
        }

        function removePath() {
            pathLayer.getSource().clear();
        }
    }

    function attachMoveEnd() {
        map.on('moveend', e => {

            const view = map.getView();
            const center = view.getCenter();
            const extent = view.getProjection().getExtent();

            const wordWidth = extent[2] - extent[0];
            const x = center[0];
            view.setCenter([
                ((((x - extent[0]) % wordWidth) + wordWidth) % wordWidth) + extent[0],
                center[1]
            ]);
        })
    }

    attachMoveEnd();

    return {
        attachMove,
        attachClick
    }
}