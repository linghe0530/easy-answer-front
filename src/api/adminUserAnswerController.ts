import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /v3/answer/list/page */
export async function listUserAnswerPage(
    body: API.UserAnswerQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageUserAnswer> {
    return request.post('/v3/answer/list/page', body, options)
}

/** 此处后端没有提供注释 POST /v3/answer/update */
export async function updateUserAnswer(
    body: API.UserAnswerUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/answer/update', body, options)
}
