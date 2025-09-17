import request, { type RequestOptions } from '@/utils/request'

/** 新增图表 POST /chart/add */
export async function addChart(
    body: API.ChartAddRequest,
    options?: RequestOptions,
): Promise<API.RLong> {
    return request.post('/chart/add', body, options)
}

/** 删除图表 POST /chart/delete */
export async function deleteChart(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/chart/delete', body, options)
}

/** 编辑图表 POST /chart/edit */
export async function editChart(
    body: API.ChartEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/chart/edit', body, options)
}

/** AI生成图表 POST /chart/gen */
export async function genChartByAi(
    body: API.GenChartByAIRequest,
    file: File,
    options?: RequestOptions,
): Promise<API.RBiResponse> {
    return request.upload(
        '/chart/gen',
        {
            ...body,
            file,
        },
        options,
    )
}

export async function genChartByAIAsync(
    body: API.GenChartByAIRequest,
    file: File,
    options?: RequestOptions,
): Promise<API.RBiResponse> {
    return request.upload(
        '/chart/gen/async',
        {
            ...body,
            file,
        },
        options,
    )
}

export async function genChartByAIMq(
    body: API.GenChartByAIRequest,
    file: File,
    options?: RequestOptions,
): Promise<API.RBiResponse> {
    return request.upload(
        '/chart/gen/mq',
        {
            ...body,
            file,
        },
        options,
    )
}

/** 按ID查询图表 GET /chart/get */
export async function getChartById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getChartByIdParams,
    options?: RequestOptions,
): Promise<API.RChart> {
    return request.get('/chart/get', {
        params,
        ...options,
    })
}

/** 分页查询图表列表 POST /chart/list/page */
export async function listChartByPage(
    body: API.ChartQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageChart> {
    return request.post('/chart/list/page', body, options)
}

/** 分页查询我的图表列表 POST /chart/my/list/page */
export async function listMyChartByPage(
    body: API.ChartQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageChart> {
    return request.post('/chart/my/list/page', body, options)
}
