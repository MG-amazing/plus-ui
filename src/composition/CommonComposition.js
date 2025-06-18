import { computed, inject, ref } from 'vue'
import useAppStore from '@/store/modules/app'
import { BaseConfig } from '@/config/base.config'
import _ from 'lodash'
import { ElMessageBox } from 'element-plus'

const appStore = useAppStore()
export default function () {
    // 跳转页面的类型
    const ViewMode = {

        // 新增
        ADD: 0,
        // 编辑
        EDIT: 1,
        // 详情
        DETAIL: 2,
        // 复制
        COPY: 3,
        // 审批
        EXAMINE: 4
    }
    // 跳转页面的类型
    const FormShowType = {

        // 页面打开
        DEFAULT: 'default',
        // 抽屉打开
        DRAWER: 'drawer',
        // 弹窗打开
        DIALOG: 'dialog',
        // 页面打开
        DETAIL: ''
    }
    const ViewModeTitleMap = {
        0: '新增',
        1: '编辑',
        2: '详情',
        3: '复制'
    }

    // 启用状态
    const enableStatusMap = {
        0: '禁用',
        1: '启用'
    }
    // 审批状态
    const approveStatusMap = {
        0: '未提交',
        1: '审批中',
        2: '驳回',
        3: '完成'
    }
    // 流程操作状态
    const flowSubmitTypeMap = {
        0: '发起申请',
        1: '同意申请',
        2: '拒绝申请',
        3: '退回上一步',
        4: '跳转',
        5: '重新提交',
        6: '退回发起人',
        20: '拒绝申请'
    }
    // 流程状态
    const flowStatusMap = {
        10: '进行中',
        20: '已完成',
        30: '已撤回',
        40: '强行中止',
        50: '挂起',
        99: '已废弃'
    }
    // 审批状态对应tag 标签
    const approveStatusTagMap = {
        0: 'warning',
        1: 'primary',
        2: 'danger',
        3: 'success'
    }
    const defaultOtherHeight = ref(249)

    /**
     * 需要剪掉的高度
     */
    const otherHeight = computed(() => {
        if (appStore.tabFullScreen) {
            return defaultOtherHeight.value
        } else {
            return defaultOtherHeight.value - BaseConfig.topHeight
        }
    })

    /**
     * 设置默认高度
     * @param value
     */
    function setDefaultOtherHeight(value) {
        defaultOtherHeight.value = value
    }

    /**
     * 处理下拉数据 新增时传下拉数据集合，新增和编辑需要传selectId
     * @param selectList
     * @param selectId
     * @returns {string[]}
     */
    function handleSelectList(selectList, selectId) {
        return _.filter(selectList, function (o) {
            if (selectId) {
                return (o.deleteStatus === '0' && o.enableStatus === '1') || o.id === selectId
            } else {
                return o.deleteStatus === '0' && o.enableStatus === '1'
            }
        })
    }

    /**
     * 处理下拉数据 新增时传下拉数据集合，新增和编辑需要传selectIds
     * @param selectList
     * @param selectIds
     * @returns {string[]}
     */
    function handleSelectLists(selectList, selectIds) {
        return _.filter(selectList, function (o) {
            if (selectIds.length > 0) {
                return (o.deleteStatus === '0' && o.enableStatus === '1') || selectIds.indexOf(o.id) > -1
            } else {
                return o.deleteStatus === '0' && o.enableStatus === '1'
            }
        })
    }

    /**
     * 禁用选项
     * @param item
     * @returns {boolean}
     */
    function disableSelectOption(item) {
        return item.deleteStatus === '1' || item.enableStatus === '0'
    }
    const global = inject('global')

    /**
     * 下载模板
     * @param code
     * @param fileName
     */
    function templateDownload(code, fileName) {
        ElMessageBox.confirm('是否确定下载当前附件?', '系统提示', { type: 'warning' })
            .then(() => {
                global.$http({
                    method: 'get',
                    url: '/system_api/tenant/template/download?code=' + code,
                    responseType: 'arraybuffer'// arraybuffer/blob
                }).then(function(data) {
                    const blob = new Blob([data])
                    const downloadElement = document.createElement('a')
                    const href = window.URL.createObjectURL(blob) // 创建下载的链接
                    downloadElement.href = href
                    downloadElement.download = fileName // 下载后文件名
                    document.body.appendChild(downloadElement)
                    downloadElement.click() // 点击下载
                    document.body.removeChild(downloadElement) // 下载完成移除元素
                    window.URL.revokeObjectURL(href) // 释放掉blob对象
                })
            })
    }

    return {
        ViewMode,
        FormShowType,
        otherHeight,
        ViewModeTitleMap,
        approveStatusMap,
        approveStatusTagMap,
        flowStatusMap,
        flowSubmitTypeMap,
        setDefaultOtherHeight,
        enableStatusMap,
        handleSelectList,
        handleSelectLists,
        disableSelectOption,
        templateDownload
    }
}
