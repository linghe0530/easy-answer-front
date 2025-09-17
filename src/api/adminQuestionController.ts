import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /v3/question/list/page */
export async function listQuestionPage(
    body: API.AppQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageQuestion> {
    return request.post('/v3/question/list/page', body, options)
}

/** 此处后端没有提供注释 POST /v3/question/update */
export async function updateQuestion(
    body: API.QuestionUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/question/update', body, options)
}
