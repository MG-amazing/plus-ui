import { defineAsyncComponent, inject, reactive } from 'vue'
import ComponentEmpty from '@/components/big-screen/empty/index.vue'
import DefaultWindows from '@/components/big-screen/windows/windows1/index.vue'
import useAppStore from '@/store/modules/app'
import { useRouter } from 'vue-router'
import useBigScreenStore from '@/store/modules/big-scren'
import { bigScreenSettingByMenuCode } from '@/api/tenant/big-screen-setting'
import { loadMapScene } from '@/api/system/map-scene'
import { ElMessage } from 'element-plus'

export default function () {
    function asyncWindowComponent(key) {
        return defineAsyncComponent(() => {
            return new Promise((resolve, reject) => {
                if (key) {
                    const module = import.meta.glob('/src/components/big-screen/windows/**/index.vue')
                    module[`/src/components/big-screen/windows${key}/index.vue`]().then((mode) => {
                        resolve(mode)
                    })
                } else {
                    resolve(DefaultWindows)
                }
            }).catch((reject) => {
                return DefaultWindows
            })
        })
    }

    function asyncBigScreenComponent(key) {
        return defineAsyncComponent(() => {
            return new Promise((resolve, reject) => {
                if (key) {
                    const modules = import.meta.glob('/src/components/big-screen/jjw/**/index.vue')
                    modules[`/src/components/big-screen/business${key}/index.vue`]().then((mode) => {
                        if (mode) {
                            resolve(mode)
                        }
                    })
                } else {
                    resolve(ComponentEmpty)
                }
            }).catch((reject) => {
                return ComponentEmpty
            })
        })
    }

    const router = useRouter()
    const bigScreenStore = useBigScreenStore()

    const currentRouter = router.currentRoute.value

    const menuCode = currentRouter.meta.code
    const defaultData = {
        components: null,
        layers: null
    }
    const global = inject('global')
    function init() {
        return new Promise((resolve, reject) => {
            bigScreenSettingByMenuCode(global.$http, menuCode).then(({ success, result, message }) => {
                defaultData.components = result.componentMap
                defaultData.layers = result.layerMap
                resolve(defaultData)
            })
        }).catch(reason => {
            ElMessage.error('加载地图场景失败')
        })

        /* if (menuCode.indexOf('#') > -1) {
            const codeArray = menuCode.split('#')
            if (codeArray[2]) {
                const code = codeArray[2]
                if (bigScreenStore.bigScreenSetting[code]) {
                    defaultData.components = bigScreenStore.bigScreenSetting[code].componentMap
                    defaultData.layers = bigScreenStore.bigScreenSetting[code].layerMap
                }
            }
        } */
        //  return defaultData
    }

    return {
        asyncWindowComponent,
        asyncBigScreenComponent,
        init

    }
}