> 🌐 **Multilingual Versions**  
>  [中文](../README.md)  
>  [日本語](export_tutorial_jp.md)

# 📦 Frontend Manual Configuration Export Function Tutorial

This tutorial walks you through **the entire process of manually
configuring the frontend to export Excel**, step-by-step.\
No need to write export logic code --- you can still complete complex
data export tasks 🧙‍♂️📊

------------------------------------------------------------------------

## 🔧 1. Backend Menu Configuration

Go to **System Management → Menu Management**, find the menu you want to
configure, and click Edit ✏️

### 📌 Fill in the following information:

#### ✅ Entity Class Name:

Locate the Controller for the API in the backend, for example:

``` java
@SaCheckPermission("workflow:leave:list")
@GetMapping("/list")
public TableDataInfo<TestLeaveVo> list(TestLeaveBo bo, PageQuery pageQuery) {
    return testLeaveService.queryPageList(bo, pageQuery);
}
```

-   🏷️ Entity class: `TestLeave` 👉 Enter into "Entity Class Name" in
    the menu configuration\
-   📥 Parameter class: `TestLeaveBo` (must be located in the `./bo`
    package, program will infer automatically)\
-   🔁 Method name: `list` 👉 Enter into "Export Method Name"

🌐 Example API address:

    http://localhost/dev-api/workflow/leave/list?pageNum=1&pageSize=10

------------------------------------------------------------------------

## 💻 2. Configure the Export Component in the Frontend

### ✅ Import the Composition Function

``` ts
import ListComposition from '@/composition/ListComposition';
const { pageTable } = ListComposition();
const pageRef = ref(null);
```

------------------------------------------------------------------------

### ✅ Configure the Pagination Component

``` vue
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

------------------------------------------------------------------------

### ✅ Configure Query Parameters and Column Info

``` ts
pageTable.form = queryParams.value;

pageTable.columns = [
  { label: 'id', prop: 'id', show: false },
  { label: 'Leave Type', prop: 'leaveType', show: true },
  { label: 'Start Date', prop: 'startDate', show: true },
  { label: 'End Date', prop: 'endDate', show: true },
  { label: 'Leave Days', prop: 'leaveDays', show: true },
  { label: 'Reason', prop: 'remark', show: true },
  { label: 'Status', prop: 'status', show: true }
];
```

------------------------------------------------------------------------

## 🖼️ 3. Table Column Custom Rendering Example

``` vue
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

------------------------------------------------------------------------

## 🔘 4. Adding and Configuring the Top Buttons

In Menu Management, configure the position of the export button (top,
bottom, or both), then import the component into the page:

``` vue
<top-button
  @handleAdd="handleAdd"
  @exportExcel="exportExcel"
  :tops="pageTable.top"
  :pageTable="pageTable"
  :single="single"
  :multiple="multiple"
/>
```

------------------------------------------------------------------------

## 📤 5. Writing the Export Method

``` ts
const exportExcel = () => {
  pageTable.fileName = 'Leave_Info.xlsx';
  pageTable.customize = 'invokeData'; // Optional: custom data processing method
  pageRef.value.exportExcel();
};
```

------------------------------------------------------------------------

## 🧠 6. Backend Custom Data Processing Method

When the API returns dictionary values or fields not suitable for direct
display, you can transform them as follows 👇

``` java
@SuppressWarnings("unused")
public List<Map<String, Object>> invokeData(List<Map<String, Object>> data) {
    Map<String, DictDataDTO> wfBusinessStatus = dictService.getDictData("wf_business_status")
        .stream()
        .collect(Collectors.toMap(DictDataDTO::getDictValue, Function.identity()));

    Map<String, String> map = new HashMap<>();
    map.put("1", "Personal Leave");
    map.put("2", "Compensatory Leave");
    map.put("3", "Sick Leave");
    map.put("4", "Marriage Leave");

    data.forEach(d -> {
        d.put("status", wfBusinessStatus.get(d.get("status").toString()).getDictLabel());
        d.put("leaveType", map.get(d.get("leaveType").toString()));
    });

    return data;
}
```

-   This method must be placed inside the Controller for the current
    API\
-   Can be omitted if you are not using the `customize` parameter

------------------------------------------------------------------------

## 📌 7. Summary

✅ You can now implement no-code export features including:

-   Export current page / export all
-   Dynamic column export
-   Export with search filters
-   Custom field formatting (dictionary translation)

📦 Frontend component link: [Click
Here](https://github.com/MG-amazing/plus-ui-excel)

------------------------------------------------------------------------

Making exports simple --- that's the way 😎\
Feel free to open an Issue or PR if needed.
