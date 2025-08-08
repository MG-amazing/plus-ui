> 🌐 **Multilingual Versions**  
>  [中文](../README.md)  
>  [English](export_tutorial_en.md)
# 📦 フロントエンド手動設定によるエクスポート機能チュートリアル

このチュートリアルでは、**フロントエンドで手動設定して Excel
をエクスポートする全過程**をステップごとに説明します。\
エクスポート処理のコードを書かなくても、複雑なデータエクスポートが可能です
🧙‍♂️📊

------------------------------------------------------------------------

## 🔧 1. バックエンドメニュー設定

**システム管理 → メニュー管理** に入り、設定したいメニューを見つけて編集
✏️

### 📌 次の項目を入力：

#### ✅ エンティティクラス名：

バックエンドで該当 API の Controller を探します。例：

``` java
@SaCheckPermission("workflow:leave:list")
@GetMapping("/list")
public TableDataInfo<TestLeaveVo> list(TestLeaveBo bo, PageQuery pageQuery) {
    return testLeaveService.queryPageList(bo, pageQuery);
}
```

-   🏷️ エンティティクラス：`TestLeave` 👉
    メニュー設定の「エンティティクラス名」に入力
-   📥 パラメータクラス：`TestLeaveBo`（`./bo`
    パッケージに配置、プログラムが自動判定）
-   🔁 メソッド名：`list` 👉 「エクスポートメソッド名」に入力

🌐 API アドレス例：

    http://localhost/dev-api/workflow/leave/list?pageNum=1&pageSize=10

------------------------------------------------------------------------

## 💻 2. フロントエンドでエクスポートコンポーネントを設定

### ✅ Composition API 関数を読み込み

``` ts
import ListComposition from '@/composition/ListComposition';
const { pageTable } = ListComposition();
const pageRef = ref(null);
```

------------------------------------------------------------------------

### ✅ ページネーションコンポーネントの設定

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

### ✅ クエリパラメータと列情報の設定

``` ts
pageTable.form = queryParams.value;

pageTable.columns = [
  { label: 'id', prop: 'id', show: false },
  { label: '休暇タイプ', prop: 'leaveType', show: true },
  { label: '開始日', prop: 'startDate', show: true },
  { label: '終了日', prop: 'endDate', show: true },
  { label: '休暇日数', prop: 'leaveDays', show: true },
  { label: '理由', prop: 'remark', show: true },
  { label: '進捗状況', prop: 'status', show: true }
];
```

------------------------------------------------------------------------

## 🖼️ 3. 表の列カスタムレンダリング例

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

## 🔘 4. 上部ボタンの導入と設定

メニュー管理でエクスポートボタンの位置（上部、下部、両方）を設定し、ページにコンポーネントを読み込み：

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

## 📤 5. エクスポートメソッドの作成

``` ts
const exportExcel = () => {
  pageTable.fileName = '休暇情報.xlsx';
  pageTable.customize = 'invokeData'; // データ加工メソッド（任意）
  pageRef.value.exportExcel();
};
```

------------------------------------------------------------------------

## 🧠 6. データ加工メソッド（バックエンド）

API
が返す値が辞書コードなどそのままでは表示に向かない場合、カスタム変換を行います
👇

``` java
@SuppressWarnings("unused")
public List<Map<String, Object>> invokeData(List<Map<String, Object>> data) {
    Map<String, DictDataDTO> wfBusinessStatus = dictService.getDictData("wf_business_status")
        .stream()
        .collect(Collectors.toMap(DictDataDTO::getDictValue, Function.identity()));

    Map<String, String> map = new HashMap<>();
    map.put("1", "私用休暇");
    map.put("2", "代休");
    map.put("3", "病気休暇");
    map.put("4", "結婚休暇");

    data.forEach(d -> {
        d.put("status", wfBusinessStatus.get(d.get("status").toString()).getDictLabel());
        d.put("leaveType", map.get(d.get("leaveType").toString()));
    });

    return data;
}
```

-   このメソッドは該当 API の Controller 内に記述
-   `customize` パラメータを使わない場合は不要

------------------------------------------------------------------------

## 📌 7. まとめ

✅ この方法で、コード不要で以下のエクスポートが可能になります：

-   現在ページ / 全件エクスポート
-   動的列エクスポート
-   検索条件付きエクスポート
-   フィールドのカスタム変換（辞書変換など）

📦
フロントエンドコンポーネントはこちら：[リンク](https://github.com/MG-amazing/plus-ui-excel)

------------------------------------------------------------------------

エクスポートをもっと簡単に、軽やかに 😎\
質問や改善案があれば Issue や PR をお待ちしています。
