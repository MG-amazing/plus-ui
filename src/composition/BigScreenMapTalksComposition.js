import { Marker, VectorLayer } from 'maptalks'
import { ClusterLayer } from 'maptalks.markercluster'
import _ from 'lodash'
import useBigScreenStore from '@/store/modules/big-scren'

export default function () {
    const bigScreenStore = useBigScreenStore()

    function addMask(code, isCluster, mapLayer) {
        let layer = bigScreenStore.layerMap[code]
        if (!bigScreenStore.layerMap[code]) {
            if (isCluster) {
                layer = new ClusterLayer(code, [], {
                    noClusterWithHowMany: 4, // 聚合的最小个数
                    maxClusterZoom: 17,
                    symbol: {
                        markerFile: (bigScreenStore.getMapIcon(code).iconUrl),
                        markerWidth: 48.75,
                        markerHeight: 82.5
                    }

                }).addTo(mapLayer)
            } else {
                layer = new VectorLayer(code, [], {
                    enableAltitude: true,
                    zIndex: 5
                }).addTo(mapLayer)
            }

            bigScreenStore.layerMap[code] = layer
        }
        _.forEach(bigScreenStore.dataMap[code], function (o) {
            if (o.longitude && o.latitude) {
                const mask = new Marker(
                    { x: o.longitude, y: o.latitude, z: 0 },
                    {
                        symbol: {
                            markerFile: (bigScreenStore.getMapIcon(code).iconUrl),
                            markerDx: 0,
                            markerDy: 0,
                            markerOpacity: 1,
                            markerWidth: 39,
                            markerHeight: 66
                        },
                        id: o.id
                    }
                ).addTo(layer)

                maskInfoWindow(mask, code, o)
            }
        })
    }

    // 气泡弹出
    function maskInfoWindow(mask, code, obj) {
        mask.setInfoWindow({
            autoPan: true,
            dy: 4,
            custom: true, // 只使用定制自定义true
            autoOpenOn: 'click', // set to null if not to open when clicking on marker
            autoCloseOn: 'click',
            // 支持自定义html内容
            content: bigScreenStore.infoWindowMap[code](obj)
        }).on('mousedown')
    }
    return {
        addMask
    }
}