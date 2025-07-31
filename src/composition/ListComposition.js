import { inject, reactive, ref } from 'vue';
import { getButtonByPath } from '@/api/pageInfo.js';
import { useRoute } from 'vue-router';

export default function () {
  const global = inject('global');
  const route = useRoute();

  // 分页参数
  const pagination = reactive({
    layout: '->,total, sizes, prev, pager, next, jumper', // 组件布局，子组件名用逗号分隔
    total: 0, // 总条目数
    currentPage: 1, // 当前页数
    pageSize: 100, // 每页显示条目数的初始值
    pageCount: 0, // 总页数
    pagerCount: 5, // 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
    pageSizes: [20, 50, 100, 500, 1000] // 每页显示个数选择器的选项设置
  });

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
    tableOperateColumn: {},
    entityName: '',
    exportFunction: '',
    isDynamic: false,
    fileName: ''
  });

  // 传递表单对象
  const recordInfo = reactive({
    id: '',
    type: 0,
    show: false
  });

  const searchFormRef = ref();
  const pageTableRef = ref();
  const listPageRef = ref();

  const pageName = ref('');
  function loadMenuButton() {
    getButtonByPath({ path: route.fullPath + '/index' }).then(({ success, result, message }) => {});
  }
  loadMenuButton();

  function exportExcelData(data) {
    data.form = pageTable.form;
    data.columns = pageTable.columns;
    data.size = pagination.total;

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

  /*
   * 添加排序信息
   * */
  function sortChange(obj) {
    if (obj.order === null) {
      pageTable.form.fieldSort = null;
    } else {
      pageTable.form.fieldSort = obj.order === 'ascending' ? 'asc' : 'desc';
    }
    pageTable.form.fieldName = obj.prop;
    pageTable.queryPage();
  }

  return {
    pageName,
    pagination,
    pageTable,
    recordInfo,
    searchFormRef,
    pageTableRef,
    listPageRef,
    loadMenuButton,
    sortChange,
    exportExcelData,
    exportExcelListData
  };
}
