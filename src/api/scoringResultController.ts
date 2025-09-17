import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /scoring/result/add */
export async function addScoringResult(
    body: API.ScoringResultAddRequest,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.post('/scoring/result/add', body, options)
}

/** 此处后端没有提供注释 POST /scoring/result/delete */
export async function deleteScoringResult(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/scoring/result/delete', body, options)
}

/** 此处后端没有提供注释 POST /scoring/result/edit */
export async function editScoringResult(
    body: API.ScoringResultEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/scoring/result/edit', body, options)
}

/** 此处后端没有提供注释 GET /scoring/result/get/resp */
export async function getScoringResultRespById(
    params: API.getScoringResultRespByIdParams,
    options?: RequestOptions,
): Promise<API.RScoringResultResp> {
    return request.get('/scoring/result/get/resp', { params, ...options })
}

/** 此处后端没有提供注释 POST /scoring/result/list/page/resp */
export async function listScoringResultRespPage(
    body: API.ScoringResultQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageScoringResultResp> {
    return request.post('/scoring/result/list/page/resp', body, options)
}

/** 此处后端没有提供注释 POST /scoring/result/my/list/page/resp */
export async function listMyScoringResultRespPage(
    body: API.ScoringResultQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageScoringResultResp> {
    return request.post('/scoring/result/my/list/page/resp', body, options)
}
