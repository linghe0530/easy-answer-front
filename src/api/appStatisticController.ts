import request, { type RequestOptions } from '@/utils/request.ts'

/** 此处后端没有提供注释 GET /app/statistic/answer_count */
export async function getAppAnswerCount(
    options?: RequestOptions,
): Promise<API.RListAppAnswerCountDTO> {
    return request.get('/app/statistic/answer_count', null, options)
}

/** 此处后端没有提供注释 GET /app/statistic/answer_result_count */
export async function getAppAnswerResultCount(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getAppAnswerResultCountParams,
    options?: RequestOptions,
): Promise<API.RListAppAnswerResultCountDTO> {
    return request.get('/app/statistic/answer_result_count', params, options)
}
