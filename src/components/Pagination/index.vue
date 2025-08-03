<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup name="Pagination" lang="ts">
import { scrollTo } from '@/utils/scroll-to';
import { propTypes } from '@/utils/propTypes';
import { getInfoByPath } from '@/api/pageInfo';
import { exportCommonExcel } from '@/api/system/excel';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const props = defineProps({
  total: propTypes.number,
  page: propTypes.number.def(1),
  limit: propTypes.number.def(20),
  pageSizes: { type: Array<number>, default: () => [10, 20, 30, 50] },
  // 移动端页码按钮的数量端默认值5
  pagerCount: propTypes.number.def(document.body.clientWidth < 992 ? 5 : 7),
  layout: propTypes.string.def('total, sizes, prev, pager, next, jumper'),
  background: propTypes.bool.def(true),
  autoScroll: propTypes.bool.def(true),
  hidden: propTypes.bool.def(false),
  float: propTypes.string.def('right'),
  pageTable: {
    type: Object,
    default: () => {}
  }
});
function loadMenuButton() {
  const rawTable = toRaw(props.pageTable);

  getInfoByPath({ path: route.fullPath + '/index' }).then(({ code, data, msg }) => {
    rawTable.entityName = data.entityName;
    rawTable.exportFunction = data.exportFunction;
  });
}
loadMenuButton();
async function exportExcel() {
  try {
    const response = await exportCommonExcel({}, props.pageTable);
    const blob = new Blob([response]);

    // 如果后端返回的是错误页面/JSON，而不是 Excel 文件，则尝试读取并判断
    const text = await blob.text();
    try {
      const json = JSON.parse(text);
      // 如果能转成 JSON，说明其实是后端错误信息而不是 Excel
      ElMessage.error(json.message || '导出失败');
      return;
    } catch {
      // 不可转成 JSON，说明是正常的文件流，可以继续下载
    }

    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = props.pageTable.fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  } catch (error) {
    ElMessage.error('导出失败，请稍后再试');
  }
}

const emit = defineEmits(['update:page', 'update:limit', 'pagination']);
const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit('update:page', val);
  }
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit('update:limit', val);
  }
});
function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1;
  }
  emit('pagination', { page: currentPage.value, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: pageSize.value });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
defineExpose({ loadMenuButton, exportExcel });
</script>

<style lang="scss" scoped>
.pagination-container {
  .el-pagination {
    float: v-bind(float);
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
