import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /answer/add */
export async function generateUserAnswerId(options?: RequestOptions): Promise<API.RString> {
    return request.get('/answer/generate/id', null, options)
}

/** 此处后端没有提供注释 POST /answer/add */
export async function addUserAnswer(
    body: API.UserAnswerAddRequest,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.post('/answer/add', body, options)
}

/** 此处后端没有提供注释 POST /answer/delete */
export async function deleteUserAnswer(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/answer/delete', body, options)
}

/** 此处后端没有提供注释 POST /answer/edit */
export async function editUserAnswer(
    body: API.UserAnswerEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/answer/edit', body, options)
}

/** 此处后端没有提供注释 POST /answer/list/page/resp */
export async function listUserAnswerRespByPage(
    body: API.UserAnswerQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageUserAnswerResp> {
    return request.post('/answer/list/page/resp', body, options)
}

/** 此处后端没有提供注释 POST /answer/my/list/page/resp */
export async function listMyUserAnswerRespByPage(
    body: API.UserAnswerQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageUserAnswerResp> {
    return request.post('/answer/my/list/page/resp', body, options)
}

/** 此处后端没有提供注释 GET /answer/resp */
export async function getUserAnswerRespById(
    params: API.getUserAnswerRespByIdParams,
    options?: RequestOptions,
): Promise<API.RUserAnswerResp> {
    return request.get('/answer/resp', params, options)
}
