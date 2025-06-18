export default function () {
    // 是否
    const isNoMap = {
        0: '否',
        1: '是'
    }
    // 来源类型
    const enterpriseSourceStatusMap = {
        0: '创建',
        1: '注册'
    }
    // 审核状态
    const enterpriseDataStatusMap = {
        0: '待审核',
        1: '初始化数据库',
        2: '通过',
        3: '拒绝'
    }
    // 企业类型
    const enterpriseTypeMap = {
        0: '企业'
    }

    // 应用类型
    const appTypeMap = {
        0: 'web',
        1: 'app'
    }
    // 驱动
    const driverMap = {
        'com.mysql.cj.jdbc.Driver': 'mysql（com.mysql.cj.jdbc.Driver）',
        'org.postgresql.Driver': 'postgresql（org.postgresql.Driver）',
        'com.highgo.jdbc.Driver': 'highgo（com.highgo.jdbc.Driver）'
    }

    // 菜单类型
    const menuTypeMap = {
        2: '目录',
        3: '菜单',
        5: '分组',
        4: '按钮',
    }
    // 菜单类型
    const menuTypeBigScreenMap = {
        2: '目录',
        3: '菜单',
        4: '图层'
    }
    // 跳转方式
    const jumpTypeMap = {
        0: '默认(组件跳转)',
        1: '外部跳转(_blank)',
        2: '内嵌页面(iframe)',
        3: '刷新链接(_self)'
    }
    // 系统管理新建菜单类型
    const menuTypeSystemMap = {
        2: '目录',
        3: '菜单'
    }
    // 系统管理新建跳转方式
    const jumpTypeSystemMap = {
        0: '动态表单(组件跳转)',
        1: '外部跳转(超链接)',
        2: '内部跳转(iframe)',
        3: '刷新链接(_self)'
    }

    // 按钮样式
    const cssMap = {
        primary: 'primary',
        success: 'success',
        info: 'info',
        warning: 'warning',
        danger: 'danger'
    }

    // 是否隐藏
    const hiddenStatusMap = {
        0: '显示',
        1: '隐藏'
    }

    // 参数级别
    const parameterLevelMap = {
        0: '平台级',
        1: '租户级'
    }

    // 用户类型
    const userTypeMap = {
        1: '管理员',
        3: '用户'
    }
    // 员工类型
    const staffTypeMap = {
        1: '管理员',
        2: '普通用户',
        9: '承包商'
    }

    // 员工类型
    const staffTypeListMap = {
        0: '拥有者',
        1: '管理员',
        2: '普通用户',
        9: '承包商'
    }
    // 机构类型
    const orgTypeListMap = {
        0: '机构',
        1: '企业',
        9: '承包商'
    }

    // 性别
    const sexMap = {
        0: '女',
        1: '男'
    }

    const staffDataStatusMap = {
        1: '同意',
        2: '拒绝'
    }
    // 日志来源类型
    const logClientTypeMap = {
        0: 'WEB',
        1: 'APP'
    }

    // 日志操作类型
    const logActionTypeMap = {
        0: '添加',
        1: '编辑',
        2: '删除'
    }

    // 日志返回类型
    const logResultMap = {
        0: '失败',
        1: '成功'
    }

    // 地图服务类别
    const resourceTypeMap = {
        WMTS: 'WMTS',
        Image: 'Image',
        Geo3DTiles: 'Geo3DTiles',
        XYZ: 'XYZ'
    }
    // 地图场景类别
    const sceneTypeMap = {
        2: '2d',
        3: '3d'
    }
    // 表单页面按钮分组
    const buttonGroupMap = {
        1: '表格1',
        2: '表格2',
        3: '表格3',
        4: '表格4'
    }
    return {
        menuTypeBigScreenMap,
        menuTypeSystemMap,
        jumpTypeSystemMap,
        orgTypeListMap,
        enterpriseSourceStatusMap,
        enterpriseDataStatusMap,
        enterpriseTypeMap,
        isNoMap,
        appTypeMap,
        menuTypeMap,
        driverMap,
        hiddenStatusMap,
        cssMap,
        jumpTypeMap,
        parameterLevelMap,
        userTypeMap,
        logClientTypeMap,
        logActionTypeMap,
        logResultMap,
        staffTypeMap,
        staffTypeListMap,
        sexMap,
        staffDataStatusMap,
        resourceTypeMap,
        sceneTypeMap,
        buttonGroupMap
    }
}
