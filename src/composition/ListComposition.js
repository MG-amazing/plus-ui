import { reactive } from 'vue';
import { getButtons } from '@/api/pageInfo.js';
import { useRoute } from 'vue-router';

export default function () {
  const route = useRoute();

  // 表格参数
  const pageTable = reactive({
    form: {},
    data: [],
    columns: [],
    entityName: '',
    exportFunction: '',
    isDynamic: false,
    fileName: '',
    row: [],
    top: [],
    type: '0', //导出本页 0 导出全部1
    sheetName: '',
    customize: ''
  });
  function getButtonsData() {
    getButtons({ path: route.meta.component }).then(({ code, data, msg }) => {
      pageTable.row = data.row;
      pageTable.top = data.top;
    });
  }
  getButtonsData();

  return {
    pageTable
  };
}
