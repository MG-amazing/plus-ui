import _ from 'lodash'
import useBigScreenStore from '@/store/modules/big-scren'
import * as Cesium from 'cesium'

export default function () {
    const bigScreenStore = useBigScreenStore()

    function addMask(code, isCluster, viewer) {
        if (!bigScreenStore.layerMap[code]) {
            bigScreenStore.layerMap[code] = new Cesium.CustomDataSource(code)
        }
        _.forEach(bigScreenStore.dataMap[code], function (item, index) {
            if (item.longitude && item.latitude) {
                const layer = {
                    show: true,
                    id: '_' + code + index,
                    UniqueID: item.id,
                    monitorType: code,
                    data: item,
                    position: Cesium.Cartesian3.fromDegrees(parseFloat(item.longitude), parseFloat(item.latitude), 130),
                    billboard: { // 图标
                        image: (bigScreenStore.getMapIcon(code).iconUrl),
                        width: 60,
                        height: 99,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 30000, 0.2),
                        eyeOffset: new Cesium.Cartesian3(0, 0, -5)
                    },

                    label: { // 文字标签
                        show: false,
                        text: item.name,
                        font: '500 30px Helvetica', // 15pt monospace
                        scale: 0.5,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        // fillColor: Cesium.Color.WHITE,
                        // outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 1.0,
                        showBackground: true,
                        // backgroundColor: new Cesium.Color(7 / 255, 189 / 255, 110 / 255, 1),
                        pixelOffset: new Cesium.Cartesian2(0, -100), // 偏移量
                        backgroundPadding: new Cesium.Cartesian2(5, 5),
                        scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 20000, 0.0),
                        eyeOffset: new Cesium.Cartesian3(0, 0, 5),
                        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                            1000,
                            1.3,
                            20000,
                            0.01
                        )
                    }
                }
                bigScreenStore.layerMap[code].entities.add(layer)
            }
        })
        viewer.dataSources.add(bigScreenStore.layerMap[code])
    }

    return {
        addMask
    }
}