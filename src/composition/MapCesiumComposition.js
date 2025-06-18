import useAppStore from '@/store/modules/app'
import { reactive } from 'vue'
import useBigScreenStore from '@/store/modules/big-scren'
import * as Cesium from 'cesium'
import CesiumNavigation from 'cesium-navigation-es6'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import $ from 'jquery'

export default function () {
    /**
     * 添加 WMTS 图册
     * @param url 服务地址
     * @param layer 图层名称
     * @param zIndex 层级
     * @param map 地图独享
     * @param token token
     * @returns {SpatialReference}
     */
    async function loadMWTSLayer(url, layer, zIndex, map, token) {

    }
    function asyncMWTSLayer(urlTemplate, token) {

    }

    function load3DTitleLayer(url, layerName, maxGPUMemory, maximumScreenSpaceError, heightOffset, rotation, viewer) {
        const tileSet = new Cesium.Cesium3DTileset({
            url,
            maximumMemoryUsage: 10000, // 不可设置太高，目标机子空闲内存值以内，防止浏览器过于卡
            maximumScreenSpaceError: 24, // 用于驱动细节细化级别的最大屏幕空间错误;较高的值可提供更好的性能，但视觉质量较低。
            maximumNumberOfLoadedTiles: 1000000, // 最大加载瓦片个数
            cacheBytes: 5368709120,
            shadows: false, // 是否显示阴影
            skipLevelOfDetail: true, // 确定是否应在遍历期间应用详细级别跳过(默认false)
            baseScreenSpaceError: 1024, // When skipLevelOfDetailis true，在跳过详细级别之前必须达到的屏幕空间错误(默认1024)
            skipScreenSpaceErrorFactor: 16, // 定义要跳过的最小屏幕空间错误的乘数。与 一起使用skipLevels来确定要加载哪些图块(默认16)
            skipLevels: 1, // skipLevelOfDetail是true 一个常量，定义了加载图块时要跳过的最小级别数。为 0 时，不跳过任何级别。与 一起使用skipScreenSpaceErrorFactor来确定要加载哪些图块。(默认1)
            immediatelyLoadDesiredLevelOfDetail: false, // 当skipLevelOfDetail是时true，只会下载满足最大屏幕空间错误的图块。忽略跳过因素，只加载所需的图块(默认false)
            loadSiblings: false, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋 --- 何时确定在遍历期间skipLevelOfDetail是否true始终下载可见瓦片的兄弟姐妹(默认false)
            cullWithChildrenBounds: true, // 是否使用子边界体积的并集来剔除瓦片（默认true）
            dynamicScreenSpaceError: true, // 减少距离相机较远的图块的屏幕空间错误(默认false)
            dynamicScreenSpaceErrorDensity: 0.01278, // 数值加大，能让周边加载变快 --- 用于调整动态屏幕空间误差的密度，类似于雾密度(默认0.00278)
            dynamicScreenSpaceErrorFactor: 1.0, // 用于增加计算的动态屏幕空间误差的因素(默认4.0)
            dynamicScreenSpaceErrorHeightFalloff: 0.25 // 密度开始下降的瓦片集高度的比率(默认0.25)
        })
        const tilesets = viewer.scene.primitives.add(tileSet)

        // 调整模型高度
        tilesets.readyPromise.then(function (tileset) {
            tileset.modelName = layerName
            const offsetHeight = heightOffset
            const boundingSphere = tileset.boundingSphere
            const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
            const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
            const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, offsetHeight)
            const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        })
    }

    function loadXYZLayer(urlTemplate, layerName, zIndex, map) {

    }

    /**
     * 添加地图标记
     * @param code 编码 用来匹配图标
     * @param point 坐标位置
     * @param layer 标记所在图层
     */
    function addMark(code, point, layer) {

    }

    const sceneMap = {
        pointRegionPick: {
            name: '坐标/区域-选取'
        },
        home3d: {
            name: '三维首页地图'
        }
    }

    const appStore = useAppStore()
    const bigScreenStore = useBigScreenStore()
    const mapToken = appStore.parameters.mapToken
    const defaultMapData = reactive({
        resourceTypeMap: {
            WMTS: [],
            Image: [],
            Geo3DTiles: [],
            XYZ: []
        },
        switchLayerMap: {},
        selectLayer: null,
        map: null,
        isLoad3DTitle: false,
        mapScene: null,
        removeHandler: null
    })

    /**
     *
     * @param mapDiv map 容器
     * @param mapSceneCode 要加载的地图场景
     * @param isLoadWMTS 是否加载 地图
     * @param isLoad3DTitle 是否加载 3d 模型 否则 是否加载 2d 图片
     * @param isLoadXYZ 是否加载 xyz
     */
    function loadMapFromMapScene(mapDiv, mapSceneCode, isLoadWMTS, isLoad3DTitle, isLoadXYZ) {
        const mapScene = defaultMapData.mapScene = bigScreenStore.mapScene[mapSceneCode]
        if (!mapScene) {
            ElMessage.warning('请配置地图场景' + mapSceneCode)
            return
        }
        defaultMapData.isLoad3DTitle = isLoad3DTitle
        // 加载地图场景的数据
        defaultMapData.resourceTypeMap = _.groupBy(mapScene.resourceList, 'resourceType')

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDUxYWRmNi0yMmM4LTQwYzEtYjA4Mi1jMjc1NTg5MjM0ODgiLCJpZCI6ODMyNzIsImlhdCI6MTcxMzI0Njg2NX0.5Q7NsEjLt4SMRoH6GSVlSZPzM8FC4r0VadklrItZXYw'

        const viewer = new Cesium.Viewer(mapDiv, {
            requestRenderMode: true,
            geocoder: false, // 位置查找工具
            homeButton: false, // 视角返回初始位置
            sceneModePicker: false, // 选择视角的模式（球体、平铺、斜视平铺）
            baseLayerPicker: false, // 图层选择器（地形影像服务）
            navigationHelpButton: false, // 导航帮助(手势，鼠标)
            animation: false, // 左下角仪表盘（动画器件）
            timeline: false, // 底部时间线
            fullscreenButton: false, // 全屏
            vrButton: false, // VR
            infoBox: false, // 点击要素之后显示的信息,默认true
            // skyAtmosphere: false, // 取消大气显示
            selectionIndicator: false,
            shouldAnimate: true
        })

        const initLongitude = mapScene.centerX
        const initLatitude = mapScene.centerY
        const initHeight = 6000

        const pitchDegrees = mapScene.pitch
        const options = {
            // 默认视角
            defaultResetView: Cesium.Cartographic.fromDegrees(initLongitude, initLatitude, initHeight),
            // 相机方向
            orientation: { pitch: Cesium.Math.toRadians(pitchDegrees) },
            // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
            enableCompass: true,
            // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
            enableZoomControls: true,
            // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
            enableDistanceLegend: true,
            // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
            enableCompassOuterRing: true
        }

        new CesiumNavigation(viewer, options)

        viewer._cesiumWidget._creditContainer.style.display = 'none'// 隐藏版权
        // 开启光照与阴影
        viewer.scene.globe.enableLighting = true
        viewer.shadows = true
        viewer.shadowMap.darkness = 0.5
        // 设置cesium时间
        const utc = Cesium.JulianDate.fromDate(new Date('2022/10/04 3:00:00'))// UTC
        viewer.clock.currentTime = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate())// 北京时间=UTC+8=GMT+8
        viewer.scene.requestRenderMode = true
        viewer.scene.skyBox.show = true
        viewer.scene.requestRender()

        if (isLoad3DTitle) {
            if (defaultMapData.resourceTypeMap.Geo3DTiles) {
                for (let i = 0; i < defaultMapData.resourceTypeMap.Geo3DTiles.length; i++) {
                    const threeDimensional = defaultMapData.resourceTypeMap.Geo3DTiles[i]
                    const resourceCode = threeDimensional.resourceCode
                    const maxGpuMemory = threeDimensional.maxGpuMemory
                    const maximumScreenSpaceError = threeDimensional.maximumScreenSpaceError
                    const heightOffset = threeDimensional.heightOffset

                    const rotation = [threeDimensional.rotationX, threeDimensional.rotationY, threeDimensional.rotationZ]
                    load3DTitleLayer(threeDimensional.resourceUrl, resourceCode, maxGpuMemory, maximumScreenSpaceError, heightOffset, rotation, viewer)
                }
            }
        }

        const handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handler3D.setInputAction(function (movement) {
            // 点击弹出气泡窗口
            const pick = viewer.scene.pick(movement.position)
            if (pick && pick.id && pick.id.monitorType) { // 选中某模型
                let obj, cartographic
                if (pick.id.monitorType === 'polygon') {
                    const polyPositions = pick.id.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions

                    const polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center
                    cartographic = Cesium.Cartographic.fromCartesian(polyCenter)
                } else {
                    cartographic = Cesium.Cartographic.fromCartesian(pick.id._position._value)// 世界坐标转地理坐标（弧度）
                    const point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180]// 地理坐标（弧度）转经纬度坐标
                    let destination
                    if (viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
                        destination = Cesium.Cartesian3.fromDegrees(point[0], point[1] - 0.002, 200.0)
                    } else {
                        destination = Cesium.Cartesian3.fromDegrees(point[0], point[1], 200.0)
                    }
                    // 判断是否弹出气泡窗口内容
                    obj = { position: movement.position, destination, content: pick.id }

                    infoWindow(obj, viewer)
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(initLongitude, initLatitude, initHeight), // 相机飞入点
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // 方向
                pitch: Cesium.Math.toRadians(pitchDegrees), // 倾斜角度
                roll: 0.0
            },
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            duration: 1
        })

        defaultMapData.map = viewer
    }

    function switchLayer() {

    }

    function infoWindow(obj, viewer) {
        const picked = viewer.scene.pick(obj.position)
        if (defaultMapData.removeHandler) {
            defaultMapData.removeHandler.call()
        }

        if (Cesium.defined(picked)) {
            const id = Cesium.defaultValue(picked.id, picked.primitive.id)

            if (id instanceof Cesium.Entity) {
                const code = obj.content.monitorType
                const pointInfoWindow = bigScreenStore.infoWindowMap[code](obj.content.data)
                // 填充内容
                $('.cesium-selection-wrapper').show()
                $('#trackPopUpLink').empty()
                $('#trackPopUpLink').append(pointInfoWindow)
                let c = new Cesium.Cartesian2(obj.position.x, obj.position.y)

                $('#trackPopUp').show()
                positionPopUp(c) // Initial position at the place item picked
                defaultMapData.removeHandler = viewer.scene.postRender.addEventListener(function() {
                    const changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value)

                    // If things moved, move the popUp too
                    if (c && changedC && c.x && changedC.x && c.y && changedC.y) {
                        if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                            c = changedC
                            positionPopUp(changedC)
                        }
                    }
                })
                // PopUp close button event handler
                $('.leaflet-popup-close-button').click(function() {
                    $('#trackPopUp').hide()
                    // $('#trackPopUpLink').empty()
                    $('.cesium-selection-wrapper').hide()
                    defaultMapData.removeHandler.call()
                    return false
                })
                return id
            }
        }
    }

    function positionPopUp(c) {
        const x = c.x - ($('#trackPopUpContent').width()) / 2
        const y = c.y - ($('#trackPopUpContent').height())
        $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)')
    }

    function flyTo(viewer, value) {
        defaultMapData.map.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(parseFloat(value.longitude), parseFloat(value.latitude), 2000), // 相机飞入点
            orientation: {
                heading: Cesium.Math.toRadians(0.0), // 方向
                pitch: Cesium.Math.toRadians(-30), // 倾斜角度
                roll: 0.0
            },
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            duration: 1
        })
    }
    return {
        loadMWTSLayer,
        loadXYZLayer,
        load3DTitleLayer,
        addMark,
        loadMapFromMapScene,
        switchLayer,
        defaultMapData,
        sceneMap,
        flyTo
    }
}
