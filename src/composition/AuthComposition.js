import { inject, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getButtonByPath } from '@/api/pageInfo.js';
export default function () {
  const route = useRoute();

  const global = inject('global');
  const authData = reactive({
    authButton: {
      top: [],
      row: []
    },
    authOperate: {
      searchAll: false,
      authOrgIds: []
    }
  });

  function loadMenuButton() {
    getButtonByPath({ path: route.fullPath + '/index' }).then(({ success, result, message }) => {
      authData.authButton = result;
    });
  }
  loadMenuButton();

  return {
    loadMenuButton,
    authData
  };
}
