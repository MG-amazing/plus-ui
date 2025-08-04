<template>
  <div>
    <template :key="item.id" v-for="item in props.pageTable.row">
      <el-tooltip :content="item.menuName" effect="dark" placement="top">
        <el-button link :type="item.color" @click="handleClick(item)">
          <svg-icon :icon-class="item.icon" :icon-color="iconColorMap[item.color]"></svg-icon>
        </el-button>
      </el-tooltip>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, toRaw } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  pageTable: {
    type: Object,
    default: () => {}
  }
});
const iconColorMap = {
  danger: '#f56c6c',
  warning: '#e6a23c',
  success: '#67c23a',
  primary: '#409eff'
};
/** 从 perms 中取出最后动作 */
const getAction = (perms) => {
  return perms?.split(':').pop() || '';
};
const emit = defineEmits(['handleAdd', 'handleUpdate', 'handleDelete', 'custom']);

/** 点击方法路由 */
const handleClick = (btn) => {
  const action = getAction(btn.perms);

  if (action === 'add') emit('handleAdd');
  else if (action === 'edit') emit('handleUpdate');
  else if (action === 'remove') emit('handleDelete');
  else emit(action); // 其他自定义事件
};
</script>

<style scoped lang="scss"></style>
