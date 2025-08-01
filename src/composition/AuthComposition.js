import { inject, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
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

  }
  loadMenuButton();

  return {
    loadMenuButton,
    authData
  };
}
