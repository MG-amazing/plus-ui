import { inject, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import CommonComposition from './CommonComposition'
import { useRoute } from 'vue-router'
import { selectByMenuCode } from '@/api/tenant/table-setting'
import { commonExportExcel, commonExportListExcel } from '@/api/common/click-api'

export default function () {
    const route = useRoute()
    const global = inject('global')
    const { ViewMode, FormShowType } = CommonComposition()
    // 分页参数
    const pagination = reactive({
        layout: '->,total, sizes, prev, pager, next, jumper', // 组件布局，子组件名用逗号分隔
        total: 0, // 总条目数
        currentPage: 1, // 当前页数
        pageSize: 100, // 每页显示条目数的初始值
        pageCount: 0, // 总页数
        pagerCount: 5, // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
        pageSizes: [20, 50, 100,500, 1000] // 每页显示个数选择器的选项设置
    })

    // 表格参数
    const pageTable = reactive({
        form: {},
        data: [],
        columns: [],
        changeData: [],
        showCheck: true,
        showIndex: true,
        loading: false,
        queryPage: null,
        tableOperateColumn: {}
    })

    // 传递表单对象
    const recordInfo = reactive({
        id: '',
        type: 0,
        show: false,
        showType: FormShowType.DRAWER
    })

    const searchFormRef = ref()
    const pageTableRef = ref()
    const listPageRef = ref()

    const pageName = ref('')

    // 处理分页查询参数
    const handlePageQueryParams = (isReset) => {
        if (isReset) {
            pagination.currentPage = 1
        }

        return {
            menuCode: route.meta.code,
            current: pagination.currentPage,
            size: pagination.pageSize
        }
    }
    const pageSizeWatch = (queryPage) => {
        if (pagination.currentPage === 1) {
            queryPage()
        } else {
            pagination.currentPage = 1
        }
    }

    // 查询之后分页赋值
    const handePageResult = ({ total, pages, records }) => {
        pagination.total = total
        pagination.pageCount = pages
        pageTable.data = records
    }
    // 表格选中数据事件
    const selectionChange = (val) => {
        pageTable.changeData = val
    }
    // 批量删除数据
    const removeBatchConfirm = (funCallback) => {
        if (pageTable.changeData.length > 0) {
            ElMessageBox.confirm('是否确定删除选中的 ' + pageTable.changeData.length + ' 条数据?', '系统提示', { type: 'warning' })
                .then(() => {
                    if (typeof funCallback === 'function') {
                        const ids = _.map(pageTable.changeData, 'id')
                        funCallback(ids)
                    }
                })
        } else {
            ElMessage.warning('请选中要删除的数据')
        }
    }
    // 删除单条数据
    const removeConfirm = (funCallback) => {
        ElMessageBox.confirm('是否确定删除当前数据?', '系统提示', { type: 'warning' })
            .then(() => {
                if (typeof funCallback === 'function') {
                    funCallback()
                }
            })
    }

    // 删除单条数据
    const submitConfirm = (funCallback) => {
        ElMessageBox.confirm('是否确定提交当前数据?', '系统提示', { type: 'warning' })
            .then(() => {
                if (typeof funCallback === 'function') {
                    funCallback(route.meta.code)
                }
            })
    }

    function checkSubmitConfirm(approveStatus) {
        if (approveStatus === 1) {
            ElMessage.warning('当前数据已提交无法进行操作')
            return false
        }
        if (approveStatus === 3) {
            ElMessage.warning('当前数据已完成无法进行操作')
            return false
        }
        return true
    }

    function checkSubmit({ approveStatus }) {
        return !(approveStatus === 1 || approveStatus === 3)
    }

    // 添加
    function add() {
        recordInfo.show = true
        recordInfo.id = ''
        recordInfo.type = ViewMode.ADD
        hideListPage()
    }

    // 详情
    function detail({ id }) {
        recordInfo.show = true
        recordInfo.id = id
        recordInfo.type = ViewMode.DETAIL
        hideListPage()
    }

    // 编辑
    function edit({ id }) {
        recordInfo.show = true
        recordInfo.id = id
        recordInfo.type = ViewMode.EDIT
        hideListPage()
    }

    // 复制
    function copy({ id }) {
        recordInfo.show = true
        recordInfo.id = id
        recordInfo.type = ViewMode.COPY
        hideListPage()
    }

    // 重置
    function reset(fun) {
        searchFormRef.value.resetFields()
        if (typeof fun === 'function') {
            fun()
        }
        pageTable.queryPage(true)
    }

    function setQueryPage(fun) {
        pageTable.queryPage = fun
    }

    function removeCallBack(success, result, message) {
        if (success) {
            pageTable.queryPage(true)
            // 删除之后清空选中
            pageTableRef.value.clearSelection()
            ElMessage.success('删除成功')
        } else {
            ElMessage.warning('删除失败')
        }
    }

    function submitCallBack(success, result, message) {
        if (success) {
            if (result) {
                pageTable.queryPage(true)
                // 清空选中
                pageTableRef.value.clearSelection()
                ElMessage.success('提交成功')
            } else {
                ElMessage.warning('提交失败')
            }
        } else {
            ElMessage.warning('提交失败')
        }
    }

    function hideListPage() {
        if (recordInfo.showType === '' || recordInfo.showType === 'default') {
            listPageRef.value.style.display = 'none'
        }
    }

    function showListPage() {
        if (listPageRef.value) {
            listPageRef.value.style.display = 'block'
        }
    }
    function exportExcelData(data) {
        data.form = pageTable.form
        data.columns = pageTable.columns
        data.size = pagination.total

        const param = handlePageQueryParams(true)

        commonExportExcel(global.$http, param, data)
            .then((result) => {
                const blob = new Blob([result])
                const downloadElement = document.createElement('a')
                const href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = data.fileName // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
            }).catch(() => {
                ElMessage.error('导出失败')
            })
    }

    function exportExcelListData(data) {
        data.form = pageTable.form
        data.columns = pageTable.columns
        commonExportListExcel(global.$http, data)
            .then((result) => {
                const blob = new Blob([result])
                const downloadElement = document.createElement('a')
                const href = window.URL.createObjectURL(blob) // 创建下载的链接
                downloadElement.href = href
                downloadElement.download = data.fileName // 下载后文件名
                document.body.appendChild(downloadElement)
                downloadElement.click() // 点击下载
                document.body.removeChild(downloadElement) // 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
            }).catch(() => {
            ElMessage.error('导出失败')
        })
    }


    /*
    * 添加排序信息
    * */
    function sortChange(obj) {
        if (obj.order === null) {
            pageTable.form.fieldSort = null
        } else {
            pageTable.form.fieldSort = obj.order === 'ascending' ? 'asc' : 'desc'
        }
        pageTable.form.fieldName = obj.prop
        pageTable.queryPage()
    }

    function loadTableSetting(request) {
        const menuCode = route.meta.code
        selectByMenuCode(request, menuCode).then(({ success, result, message }) => {
            if (success) {
                pageTable.columns = result.properties
                pageTable.tableOperateColumn = result.tableOperateColumn
            }
        })
    }

    // 每页多少条监听
    watch(() => pagination.pageSize, function (value) {
        // 当每页多少条切换的时候强制回到第一页，不做数据查询
        pageSizeWatch(pageTable.queryPage)
    })
    // 当前页监听
    watch(() => pagination.currentPage, function (value) {
        // 当前页发生改变的时候 进行数据查询
        pageTable.queryPage()
    })

    function refreshCallBack() {
        showListPage()
        pageTable.queryPage(true)
        pageTableRef.value.clearSelection()
    }

    return {
        pageName,
        pagination,
        pageTable,
        recordInfo,
        searchFormRef,
        pageTableRef,
        listPageRef,
        add,
        edit,
        detail,
        copy,
        reset,
        removeConfirm,
        removeBatchConfirm,
        checkSubmitConfirm,
        checkSubmit,
        submitConfirm,
        submitCallBack,
        removeCallBack,
        selectionChange,
        setQueryPage,
        handlePageQueryParams,
        handePageResult,
        refreshCallBack,
        hideListPage,
        showListPage,
        loadTableSetting,
        sortChange,
        exportExcelData,
        exportExcelListData
    }
}
