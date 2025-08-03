<template>
  <div class="button-group">
    <el-col :span="1.5">
      <el-button
        v-for="item in filteredButtons"
        :key="item.menuId"
        :type="item.color || ''"
        class="rounded-btn"
        :disabled="isDisabled(item)"
        @click="handleClick(item)"
      >
        <svg-icon :icon-class="item.icon"></svg-icon>
        {{ item.menuName }}
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-dropdown v-if="excelExport.length == 1">
        <el-button :type="excelExport[0].color">
          <svg-icon :icon-class="excelExport[0].icon"></svg-icon>
          导出
          <el-icon class="el-icon--right"><arrow-down /> </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleExport(0)">导出本页</el-dropdown-item>
            <el-dropdown-item @click="handleExport(1)">导出全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="1.5">
      <el-button v-for="item in excelImport" :key="item.menuId" :type="item.color || ''" class="rounded-btn" @click="handleClick(item)">
        <svg-icon :icon-class="item.icon"></svg-icon>
        {{ item.menuName }}
      </el-button>
    </el-col>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, toRaw } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  single: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  pageTable: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(['handleAdd', 'handleUpdate', 'handleDelete', 'custom']);

const filteredButtons = computed(() =>
  props.pageTable.top.filter((btn) => {
    const action = getAction(btn.perms);
    return !['export', 'import', 'query'].includes(action);
  })
);
const excelExport = computed(() =>
  props.pageTable.top.filter((btn) => {
    const action = getAction(btn.perms);
    return ['export'].includes(action);
  })
);
const excelImport = computed(() =>
  props.pageTable.top.filter((btn) => {
    const action = getAction(btn.perms);
    return ['import'].includes(action);
  })
);
/** 判断是否禁用按钮 */
const isDisabled = (btn) => {
  const action = getAction(btn.perms);
  if (action === 'edit') return props.single;
  if (action === 'remove') return props.multiple;
  return false;
};
/** 从 perms 中取出最后动作 */
const getAction = (perms) => {
  return perms?.split(':').pop() || '';
};
/** 导出方法 */
const rawTable = toRaw(props.pageTable);

const handleExport = (type) => {
  if (type === 0) {
    rawTable.type = '0';
  }
  if (type === 1) {
    rawTable.type = '1';
  }
  emit('exportExcel');
};

/** 点击方法路由 */
const handleClick = (btn) => {
  const action = getAction(btn.perms);

  if (action === 'add') emit('handleAdd');
  else if (action === 'edit') emit('handleUpdate');
  else if (action === 'remove') emit('handleDelete');
  else emit(action); // 其他自定义事件
};
</script>
<style scoped lang="scss">
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rounded-btn {
  border-radius: 8px;
  padding: 10px 16px;
}
</style>
