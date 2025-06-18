import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
export default function () {
    const release = (pageTable, funCallback) => {
        if (pageTable.changeData.length > 0) {
            ElMessageBox.confirm('是否确定发布选中的 ' + pageTable.changeData.length + ' 条数据?', '系统提示', { type: 'warning' })
                .then(() => {
                    if (typeof funCallback === 'function') {
                        const ids = _.map(pageTable.changeData, 'id')
                        funCallback(ids)
                    }
                })
        } else {
            ElMessage.warning('请选中要发布的数据')
        }
    }
    function releaseCallBack(pageTable, pageTableRef, success, result, message) {
        if (success) {
            pageTable.queryPage(true)
            // 删除之后清空选中
            pageTableRef.value.clearSelection()
            ElMessage.success('发布成功')
        } else {
            ElMessage.warning('发布失败')
        }
    }
    return {
        release,
        releaseCallBack
    }
}
