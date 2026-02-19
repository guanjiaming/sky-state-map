import TileLayer from "ol/layer/WebGLTile";
import XYZ from "ol/source/XYZ";

const layerSourceBgMap = "http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=daab60e9ab7cc08e1275b3885821d36d";
const layerSourceTextMark = "http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=daab60e9ab7cc08e1275b3885821d36d";

export default function useMapLayers () {
    return [
        new TileLayer({
            source: new XYZ({
                url: layerSourceBgMap,
            })
        }),
        new TileLayer({
            source: new XYZ({
                url: layerSourceTextMark
            })
        })
    ]
}