import '@maptalks/transcoders.draco'
import '@maptalks/transcoders.crn'
import '@maptalks/transcoders.ktx2'
import 'maptalks/dist/maptalks.css'
import { GroupTileLayer, ImageLayer, Map, Marker, SpatialReference, TileLayer } from 'maptalks'
import { Geo3DTilesLayer } from '@maptalks/3dtiles'
import useAppStore from '@/store/modules/app'
import _ from 'lodash'
import { reactive } from 'vue'
import { GroupGLLayer } from '@maptalks/gl'
import { ElMessage } from 'element-plus'
import useBigScreenStore from '@/store/modules/big-scren'

export default function () {
    /**
     * 添加 WMTS 图册
     * @param urlTemplate 服务地址
     * @param layerName 图层名称
     * @param zIndex 层级
     * @param map 地图独享
     * @param token token
     * @returns {SpatialReference}
     */
    async function loadMWTSLayer(urlTemplate, layerName, zIndex, map, token) {
        const params = await asyncMWTSLayer(urlTemplate, token)
        params.zIndex = zIndex

        const titleLayer = new TileLayer(layerName, params)
        if (map) {
            map.addLayer(titleLayer)
        }

        return titleLayer
    }
    function asyncMWTSLayer(urlTemplate, token) {
        return new Promise((resolve, reject) => {
            SpatialReference.loadWMTS(urlTemplate, function (err, conf) {
                if (err) {
                    throw new Error(err)
                }
                const params = conf[0]
                if (token) {
                    params.urlTemplate += '&tk=' + token
                }
                params.hitDetect = false

                resolve(params)
            })
        })
    }

    function load3DTitleLayer(urlTemplate, layerName, maxGPUMemory, maximumScreenSpaceError, heightOffset, rotation, map) {
        const titleLayer = new Geo3DTilesLayer(layerName, {
            maxGPUMemory, // 最大缓存数，单位 M bytes
            services: [
                {
                    url: urlTemplate,
                    maximumScreenSpaceError,
                    ambientLight: [1, 1, 1],
                    heightOffset,
                    rotation,
                    loadingLimitOnInteracting: 50
                }
            ]
        })
        if (map) {
            map.addLayer(titleLayer)
        }
        return titleLayer
    }

    function loadXYZLayer(urlTemplate, layerName, zIndex, map) {
        const titleLayer = new TileLayer(layerName, {
            urlTemplate,
            zIndex
        })
        if (map) {
            map.addLayer(titleLayer)
        }
        return titleLayer
    }

    /**
     * 添加地图标记
     * @param code 编码 用来匹配图标
     * @param point 坐标位置
     * @param layer 标记所在图层
     */
    function addMark(code, point, layer) {
        new Marker(
            point,
            {
                symbol: {
                    markerFile: (bigScreenStore.getMapIcon(code).iconUrl),
                    markerDx: 0,
                    markerDy: 0,
                    markerOpacity: 1
                }
            }
        ).addTo(layer)
    }

    const sceneConfig = {
        environment: {
            enable: true,
            mode: 1,
            level: 0,
            brightness: 0.915
        },
        postProcess: {
            enable: true
        },
        ground: {
            enable: true,
            renderPlugin: {
                type: 'lit'
            },
            symbol: {
                polygonOpacity: 1,
                material: {
                    baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
                    hsv: [0, 0, -0.532],
                    roughnessFactor: 0.22,
                    metallicFactor: 0.58
                }
            }
        }
    }

    // 光照设置
    const lights = {
        directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
        ambient: {
            resource: {
                url: {
                    front: '/map/hdr/front.jpg',
                    back: '/map/hdr/back.jpg',
                    left: '/map/hdr/left.jpg',
                    right: '/map/hdr/right.jpg',
                    top: '/map/hdr/top.jpg',
                    bottom: '/map/hdr/bottom.jpg'
                }
            },
            exposure: 1.426,
            hsv: [0, 0, 0],
            orientation: 302.553
        }
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
        groupGLLayer: null
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
        const map = new Map(mapDiv, {
            center: [mapScene.centerX, mapScene.centerY],
            minZoom: mapScene.minZoom,
            maxZoom: mapScene.maxZoom,
            zoom: mapScene.zoom,
            pitch: mapScene.pitch,
            bearing: mapScene.bearing
        })

        // 加载地图场景的数据
        defaultMapData.resourceTypeMap = _.groupBy(mapScene.resourceList, 'resourceType')
        let tempSceneConfig = {}
        if (isLoadWMTS) {
            if (defaultMapData.resourceTypeMap.WMTS) {
                const baseLayerImgGroup = new GroupTileLayer('baseLayerImgGroup', [], {
                    visible: true,
                    zIndex: 0,
                    hitDetect: false
                }).addTo(map)
                _.forEach(defaultMapData.resourceTypeMap.WMTS, function (o) {
                    loadMWTSLayer(o.resourceUrl, o.resourceCode, o.sortNumber, baseLayerImgGroup, mapToken)
                })
            }
        } else {
            tempSceneConfig = sceneConfig
        }
        if (isLoadXYZ) {
            if (defaultMapData.resourceTypeMap.XYZ) {
                const baseLayerXYZGroup = new GroupTileLayer('baseLayerXYZGroup', [], {
                    visible: true,
                    zIndex: 0,
                    hitDetect: false
                }).addTo(map)
                _.forEach(defaultMapData.resourceTypeMap.XYZ, function (o) {
                    loadXYZLayer(o.resourceUrl, o.resourceCode, o.sortNumber, baseLayerXYZGroup)
                })
            }
        }
        if (isLoad3DTitle) {
            if (defaultMapData.resourceTypeMap.Geo3DTiles) {
                map.setLights(lights)
                defaultMapData.groupGLLayer = new GroupGLLayer('layer3d', [], { sceneConfig: tempSceneConfig }).addTo(map)
                for (let i = 0; i < defaultMapData.resourceTypeMap.Geo3DTiles.length; i++) {
                    const threeDimensional = defaultMapData.resourceTypeMap.Geo3DTiles[i]
                    const resourceCode = threeDimensional.resourceCode
                    const maxGpuMemory = threeDimensional.maxGpuMemory
                    const maximumScreenSpaceError = threeDimensional.maximumScreenSpaceError
                    const heightOffset = threeDimensional.heightOffset

                    const rotation = [threeDimensional.rotationX, threeDimensional.rotationY, threeDimensional.rotationZ]
                    const tempLayer = load3DTitleLayer(threeDimensional.resourceUrl, resourceCode, maxGpuMemory, maximumScreenSpaceError, heightOffset, rotation, defaultMapData.groupGLLayer)
                    defaultMapData.switchLayerMap[threeDimensional.resourceCode] = tempLayer
                    if (i === 0) {
                        defaultMapData.selectLayer = resourceCode
                        tempLayer.once('loadtileset', e => {
                            const extent = tempLayer.getExtent(e.index)
                            map.fitExtent(extent, 0, { animation: false })
                        })
                    }
                }
            }
        } else {
            if (defaultMapData.resourceTypeMap.Image) {
                if (defaultMapData.resourceTypeMap.Image.length > 0) {
                    _.forEach(defaultMapData.resourceTypeMap.Image, function (o, i) {
                        const tempImageLayer = new ImageLayer(o.resourceCode, [{
                            url: o.resourceUrl,
                            extent: [o.minX, o.minY, o.maxX, o.maxY],
                            opacity: 1
                        }
                        ]).addTo(map)
                        if (i === 0) {
                            map.fitExtent([o.minX, o.minY, o.maxX, o.maxY], 0, { animation: false })
                            defaultMapData.selectLayer = o.resourceCode
                        }
                        defaultMapData.switchLayerMap[o.resourceCode] = tempImageLayer
                    })
                }
            }
        }

        defaultMapData.map = map
    }

    function switchLayer() {
        const current = defaultMapData.switchLayerMap[defaultMapData.selectLayer]
        let extent
        if (defaultMapData.isLoad3DTitle) {
            extent = current.getExtent()
        } else {
            extent = current._images[0].extent
        }
        defaultMapData.map.fitExtent(extent, 0, { animation: false })
    }

    function flyTo(viewer, value) {
        viewer.animateTo({
            center: [value.longitude, value.latitude],
            zoom: 18
        }, {
            duration: 500
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
        sceneConfig,
        lights,
        flyTo
    }
}
