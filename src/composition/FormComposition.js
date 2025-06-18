import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonComposition from '@/composition/CommonComposition'

export default function () {
    const { ViewMode } = CommonComposition()
    // 表单对象
    const subForm = reactive({
        // 是否显现
        show: false,
        // 表单类型
        type: 0,
        // 提交的表单
        form: {},
        // 表单校验
        rules: {},
        // 加载数据遮罩
        loading: true,
        // 是否正在保存
        saving: false
    })
    // 表单的Ref
    const subFormRef = ref()
    // 弹出框的Ref
    const dialogRef = ref()
    // 从外出把 defineEmit 传递进来
    const formEmit = reactive({
        emit: null
    })

    // 定义保存
    const saveMap = reactive({
        0: null,
        1: null,
        3: null
    })
    // 保存之前的校验
    const saveConfirm = (funCallback) => {
        subFormRef.value.validate((valid) => {
            if (valid) {
                ElMessageBox.confirm('是否确定保存当前数据?', '系统提示', { type: 'warning' })
                    .then(() => {
                        if (typeof funCallback === 'function') {
                            subForm.saving = true
                            funCallback()
                        }
                    })
            } else {
                ElMessage.warning('请按照提示完成表单填写')
            }
        })
    }
    /**
     * 修改表单类型
     * @param value
     */
    const setTypeValue = (value) => {
        subForm.type = value
    }

    /**
     * 判断是否为详情页面
     */
    const isDetail = computed(() => {
        return subForm.type === ViewMode.DETAIL || subForm.type === ViewMode.EXAMINE
    })
    /**
     * 判断是否为添加页面
     */
    const isAdd = computed(() => {
        return subForm.type === ViewMode.ADD
    })
    /**
     * 判断是否为编辑页面
     */
    const isEdit = computed(() => {
        return subForm.type === ViewMode.EDIT
    })

    /**
     * 判断是否需要查询表单
     */
    const isSelect = computed(() => {
        return subForm.type !== ViewMode.ADD
    })

    function setFormEmit(value) {
        formEmit.emit = value
    }
    function setShowValue(value) {
        subForm.show = value
        formEmit.emit('update:show', value)
    }

    /**
     * 关闭窗口
     */
    function close() {
        dialogRef.value.close()
    }

    // 保存
    function save() {
        saveConfirm(function () {
            saveMap[subForm.type]()
        })
    }

    function setAdd(fun) {
        saveMap['0'] = fun
    }
    function setEdit(fun) {
        saveMap['1'] = fun
    }
    function setCopy(fun) {
        saveMap['3'] = fun
    }

    /**
     * 保存方法回调
     * @param success
     * @param result
     * @param message
     * @param fun
     */
    function saveCallBack(success, result, message, fun) {
        if (success) {
            // 关闭页面
            setShowValue(false)
            // 刷新表格
            formEmit.emit('refreshCallBack')
            if (typeof fun === 'function') {
                fun()
            }
            ElMessage.success('保存成功')
        } else {
            ElMessage.warning('保存失败')
            subForm.saving = false
        }
    }
    watch(() => subForm.show, function (value) {
        setShowValue(value)
        if (!value) {
            formEmit.emit('showListPage')
        }
    })

    return {
        subForm,
        isAdd,
        isEdit,
        isDetail,
        isSelect,
        subFormRef,
        dialogRef,
        saveMap,
        save,
        setAdd,
        setEdit,
        setCopy,
        close,
        saveCallBack,
        setFormEmit,
        setShowValue,
        setTypeValue,
        saveConfirm
    }
}
