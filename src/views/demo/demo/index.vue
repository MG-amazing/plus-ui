<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="部门id" prop="deptId">
              <el-input v-model="queryParams.deptId" placeholder="请输入部门id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户id" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="排序号" prop="orderNum">
              <el-input v-model="queryParams.orderNum" placeholder="请输入排序号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="key键" prop="testKey">
              <el-input v-model="queryParams.testKey" placeholder="请输入key键" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input v-model="queryParams.value" placeholder="请输入值" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['demo:demo:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['demo:demo:edit']" type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['demo:demo:remove']" type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['demo:demo:export']" type="warning" plain icon="Download" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar v-model:show-search="showSearch" @query-table="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="demoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column v-if="true" label="序号" prop="index" type="index" align="center" width="55" />
        <template v-for="(column, key) in pageTable.columns" :key="key">
          <el-table-column v-if="column.show" :prop="column.prop" :label="column.label">
            <template #default="scope">
              <template v-if="column.prop === 'id'">
                {{ scope.row[column.prop] }}
              </template>
              <template v-else-if="column.prop === 'result'"> </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['demo:demo:edit']" link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['demo:demo:remove']" link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        ref="pageRef"
        v-show="total > 0"
        v-model:page="queryParams.pageNum"
        :pageTable="pageTable"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改测试单对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="demoFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="key键" prop="testKey">
          <el-input v-model="form.testKey" placeholder="请输入key键" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="请输入值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Demo" lang="ts">
import { listDemo, getDemo, delDemo, addDemo, updateDemo } from '@/api/demo/demo';
import { DemoVO, DemoQuery, DemoForm } from '@/api/demo/demo/types';
import ListComposition from '@/composition/ListComposition';
// import AuthComposition from "@/composition/AuthComposition";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { pageTable } = ListComposition();
const pageRef = ref(null);

pageTable.columns = [
  { label: 'id', prop: 'id', show: true },
  { label: '部门id', prop: 'deptId', show: true },
  { label: '用户id', prop: 'userId', show: true },
  { label: '排序号', prop: 'orderNum', show: true },
  { label: 'key键', prop: 'testKey', show: true },
  { label: '值', prop: 'value', show: true }
];
const demoList = ref<DemoVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const demoFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DemoForm = {
  id: undefined,
  deptId: undefined,
  userId: undefined,
  orderNum: undefined,
  testKey: undefined,
  value: undefined
};
const data = reactive<PageData<DemoForm, DemoQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: undefined,
    userId: undefined,
    orderNum: undefined,
    testKey: undefined,
    value: undefined
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    deptId: [{ required: true, message: '部门id不能为空', trigger: 'blur' }],
    userId: [{ required: true, message: '用户id不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '排序号不能为空', trigger: 'blur' }],
    testKey: [{ required: true, message: 'key键不能为空', trigger: 'blur' }],
    value: [{ required: true, message: '值不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);
pageTable.form = queryParams.value;
/** 查询测试单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDemo(queryParams.value);
  demoList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  demoFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: DemoVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加测试单';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: DemoVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDemo(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改测试单';
};

/** 提交按钮 */
const submitForm = () => {
  demoFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDemo(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addDemo(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('修改成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: DemoVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除测试单编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delDemo(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'demo/demo/export',
    {
      ...queryParams.value
    },
    `demo_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
