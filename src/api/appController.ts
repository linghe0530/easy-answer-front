import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /app/add */
export async function addApp(
    body: API.AppAddRequest,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.post('/app/add', body, options)
}

/** 此处后端没有提供注释 POST /app/edit */
export async function editApp(
    body: API.AppEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/app/edit', body, options)
}

/** 此处后端没有提供注释 POST /app/page/resp */
export async function listAppRespPage(
    body: API.AppQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageAppResp> {
    return request.post('/app/page/resp', body, options)
}

/** 此处后端没有提供注释 GET /app/resp */
export async function getAppRespById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getAppRespByIdParams,
    options?: RequestOptions,
): Promise<API.RAppResp> {
    return request.get('/app/resp', params, options)
}

export async function deleteApp(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/app/delete', body, options)
}
