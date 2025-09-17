import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /v3/scoring/result/list/page */
export async function listScoringResultPage(
    body: API.ScoringResultQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageScoringResult> {
    return request.post('/v3/scoring/result/list/page', body, options)
}

/** 此处后端没有提供注释 POST /v3/scoring/result/update */
export async function updateScoringResult(
    body: API.ScoringResultUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/scoring/result/update', body, options)
}
