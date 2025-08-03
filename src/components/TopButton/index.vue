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
  </div>
</template>
<script setup lang="ts">
import { getButtons } from '@/api/pageInfo';
import { useRoute } from 'vue-router';
import { defineProps, defineEmits } from 'vue';
const route = useRoute();
const props = defineProps({
  top: {
    type: Array,
    default: () => []
  },
  single: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['handleAdd', 'handleUpdate', 'handleDelete', 'custom']);
function getButtonsData() {
  getButtons({ path: route.fullPath }).then(({ code, data, msg }) => {
    defaultData.row = data.row;
    defaultData.top = data.top;
  });
}
getButtonsData();
const defaultData = reactive({
  row: [],
  top: []
});
const filteredButtons = computed(() =>
  defaultData.top.filter((btn) => {
    const action = getAction(btn.perms);
    return !['export', 'import', 'query'].includes(action);
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

/** 点击方法路由 */
const handleClick = (btn) => {
  const action = getAction(btn.perms);

  if (action === 'add') emit('handleAdd');
  else if (action === 'edit') emit('handleUpdate');
  else if (action === 'remove') emit('handleDelete');
  else emit('custom', action); // 其他自定义事件
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
