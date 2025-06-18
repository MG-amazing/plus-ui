export default function () {
    // 时间表达式选择类型
    const timeExpressionTypeOptions = [
        { key: 'API', label: 'API' },
        { key: 'CRON', label: 'CRON' },
        { key: 'FIXED_RATE', label: '固定频率（毫秒）' },
        { key: 'FIXED_DELAY', label: '固定延迟（毫秒）' },
        { key: 'WORKFLOW', label: '工作流' }
    ]

    // 工作流时间表达式选择类型
    const workFlowTimeExpressionTypeOptions = [
        { key: 'CRON', label: 'CRON' },
        { key: 'FIXED_RATE', label: '固定频率（毫秒）' }
    ]

    // 处理器类型
    const processorTypeOptions = [
        { key: 'BUILT_IN', label: '内置' },
        { key: 'EXTERNAL', label: '外置（动态加载）' }
    ]
    // 执行方式
    const executeTypeOptions = [
        { key: 'STANDALONE', label: '单机执行' },
        { key: 'BROADCAST', label: '广播执行' },
        { key: 'MAP', label: 'Map执行' },
        { key: 'MAP_REDUCE', label: 'MapReduce执行' }
    ]

    const dispatchStrategyOption = [
        { key: 'HEALTH_FIRST', label: 'HEALTH_FIRST' },
        { key: 'RANDOM', label: 'RANDOM' }
    ]
    // 任务状态
    const statusMap = {
        1: '等待派发',
        2: '等待Worker接收',
        3: '运行中',
        4: '失败',
        5: '成功',
        9: '手动取消',
        10: '手动停止'
    }
    const instanceStatusOptions = [
        { key: '', label: '全部' },
        { key: 'WAITING_DISPATCH', label: '等待派发' },
        {
            key: 'WAITING_WORKER_RECEIVE',
            label: '等待Worker接收'
        },
        { key: 'RUNNING', label: '运行中' },
        { key: 'FAILED', label: '失败' },
        { key: 'SUCCEED', label: '成功' },
        { key: 'CANCELED', label: '手动取消' },
        { key: 'STOPPED', label: '手动停止' }]

    // 任务状态
    const statusWorkflowInstanceMap = {
        1: '等待调度',
        2: '运行中',
        3: '失败',
        4: '成功',
        10: '手动停止'
    }
    const wfInstanceStatusOptions = [
        { key: '', label: '全部' },
        { key: 'WAITING', label: '等待调度' },
        { key: 'RUNNING', label: '运行中' },
        { key: 'FAILED', label: '失败' },
        { key: 'SUCCEED', label: '成功' },
        { key: 'STOPPED', label: '手动停止' }
    ]
    return {
        timeExpressionTypeOptions,
        workFlowTimeExpressionTypeOptions,
        processorTypeOptions,
        executeTypeOptions,
        dispatchStrategyOption,
        statusMap,
        statusWorkflowInstanceMap,
        instanceStatusOptions,
        wfInstanceStatusOptions
    }
}
