# 📦 前端手动配置导出功能教程

本教程将带你一步步完成 **前端手动配置导出 Excel 的全过程**，无需写导出逻辑代码，也能完成复杂的数据导出任务 🧙‍♂️📊

---

## 🔧 1. 后端菜单配置

进入 **系统管理 → 菜单管理**，找到要配置的菜单，点击编辑 ✏️

### 📌 填写以下信息：

#### ✅ 实体类名称：

在后端找到该接口的 Controller，例如：

```java
@SaCheckPermission("workflow:leave:list")
@GetMapping("/list")
public TableDataInfo<TestLeaveVo> list(TestLeaveBo bo, PageQuery pageQuery) {
    return testLeaveService.queryPageList(bo, pageQuery);
}
```

- 🏷️ 实体类：`TestLeave` 👉 填入菜单配置中的“实体类名称”
- 📥 参数类：`TestLeaveBo`（需位于 `./bo` 包中，程序会自动推理）
- 🔁 方法名：`list` 👉 填入“导出方法名”

🌐 示例接口地址：

```
http://localhost/dev-api/workflow/leave/list?pageNum=1&pageSize=10
```

---

## 💻 2. 前端配置导出组件

### ✅ 引入组合式函数

```ts
import ListComposition from '@/composition/ListComposition';
const { pageTable } = ListComposition();
const pageRef = ref(null);
```

---

### ✅ 配置分页组件

```vue
<pagination
  ref="pageRef"
  v-show="total > 0"
  v-model:page="queryParams.pageNum"
  v-model:limit="queryParams.pageSize"
  :total="total"
  @pagination="getList"
  :pageTable="pageTable"
/>
```

---

### ✅ 配置查询参数与列信息

```ts
pageTable.form = queryParams.value;

pageTable.columns = [
  { label: 'id', prop: 'id', show: false },
  { label: '请假类型', prop: 'leaveType', show: true },
  { label: '开始时间', prop: 'startDate', show: true },
  { label: '结束时间', prop: 'endDate', show: true },
  { label: '请假天数', prop: 'leaveDays', show: true },
  { label: '请假原因', prop: 'remark', show: true },
  { label: '流程状态', prop: 'status', show: true }
];
```

---

## 🖼️ 3. 表格列自定义渲染示例

```vue
<template #default="scope">
  <template v-if="column.prop === 'leaveType'">
    <el-tag type="primary">
      {{ options.find(item => item.value === scope.row[column.prop]).label }}
    </el-tag>
  </template>
  <template v-else-if="column.prop === 'status'">
    <el-tag :type="wfDictMap[scope.row[column.prop]].elTagType">
      {{ wfDictMap[scope.row[column.prop]].label }}
    </el-tag>
  </template>
  <template v-else>
    {{ scope.row[column.prop] }}
  </template>
</template>
```

---

## 🔘 4. 顶部按钮引入与配置

在菜单管理中配置导出按钮的位置（顶部、底部或两者），然后在页面中引入组件：

```vue
<top-button
  @handleAdd="handleAdd"
  @exportExcel="exportExcel"
  :tops="pageTable.top"
  :pageTable="pageTable"
  :single="single"
  :multiple="multiple"
/>
```

---

## 📤 5. 编写导出方法

```ts
const exportExcel = () => {
  pageTable.fileName = '请假信息.xlsx';
  pageTable.customize = 'invokeData'; // 自定义数据处理方法（可选）
  pageRef.value.exportExcel();
};
```

---

## 🧠 6. 自定义导出数据处理方法（后端）

当接口返回的是字典值等不适合直接展示的字段时，可进行自定义转换处理 👇

```java
@SuppressWarnings("unused")
public List<Map<String, Object>> invokeData(List<Map<String, Object>> data) {
    Map<String, DictDataDTO> wfBusinessStatus = dictService.getDictData("wf_business_status")
        .stream()
        .collect(Collectors.toMap(DictDataDTO::getDictValue, Function.identity()));

    Map<String, String> map = new HashMap<>();
    map.put("1", "事假");
    map.put("2", "调休");
    map.put("3", "病假");
    map.put("4", "婚假");

    data.forEach(d -> {
        d.put("status", wfBusinessStatus.get(d.get("status").toString()).getDictLabel());
        d.put("leaveType", map.get(d.get("leaveType").toString()));
    });

    return data;
}
```

- 该方法需写在当前接口对应 Controller 中
- 不使用 `customize` 参数时可省略

---

## 📌 7. 总结

✅ 你现在已经可以实现无代码导出功能，包括：

- 当前页 / 全部导出
- 动态列导出
- 查询条件导出
- 自定义格式化字段（字典翻译）

📦 前端组件地址：[点击跳转](https://github.com/MG-amazing/plus-ui-excel)

---

让导出变得简单，就是这么轻松 😎  
有需要欢迎提 Issue 或 PR~