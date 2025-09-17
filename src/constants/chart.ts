// 图表状态枚举映射，键为数字，值为状态描述
export const CHART_STATUS_MAP: Record<number, string> = {
    0: '等待',
    1: '运行中',
    2: '成功',
    3: '失败',
}
export const CHART_STATUS_ENUM = {
    WAIT: 0,
    RUNNING: 1,
    SUCCEED: 2,
    FAILED: 3,

}
