import { reactive  } from 'vue';

export default function () {
  // 表格参数
  const pageTable = reactive({
    form: {},
    data: [],
    columns: [],
    entityName: '',
    exportFunction: '',
    isDynamic: false,
    fileName: ''
  });


  function exportExcelData(data) {
    data.form = pageTable.form;
    data.columns = pageTable.columns;

    // commonExportExcel(global.$http, param, data)
    //     .then((result) => {
    //         const blob = new Blob([result])
    //         const downloadElement = document.createElement('a')
    //         const href = window.URL.createObjectURL(blob) // 创建下载的链接
    //         downloadElement.href = href
    //         downloadElement.download = data.fileName // 下载后文件名
    //         document.body.appendChild(downloadElement)
    //         downloadElement.click() // 点击下载
    //         document.body.removeChild(downloadElement) // 下载完成移除元素
    //         window.URL.revokeObjectURL(href) // 释放掉blob对象
    //     }).catch(() => {
    //         ElMessage.error('导出失败')
    //     })
  }

  function exportExcelListData(data) {
    data.form = pageTable.form;
    data.columns = pageTable.columns;
    // commonExportListExcel(global.$http, data)
    //     .then((result) => {
    //         const blob = new Blob([result])
    //         const downloadElement = document.createElement('a')
    //         const href = window.URL.createObjectURL(blob) // 创建下载的链接
    //         downloadElement.href = href
    //         downloadElement.download = data.fileName // 下载后文件名
    //         document.body.appendChild(downloadElement)
    //         downloadElement.click() // 点击下载
    //         document.body.removeChild(downloadElement) // 下载完成移除元素
    //         window.URL.revokeObjectURL(href) // 释放掉blob对象
    //     }).catch(() => {
    //     ElMessage.error('导出失败')
    // })
  }

  return {
    pageTable
  };
}
