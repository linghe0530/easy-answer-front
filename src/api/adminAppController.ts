import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /v3/app/list/page */
export async function listAppPage(
    body: API.AppQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageApp> {
    return request.post('/v3/app/list/page', body, options)
}

/** 此处后端没有提供注释 POST /v3/app/review */
export async function doAppReview(
    body: API.ReviewRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/app/review', body, options)
}

/** 此处后端没有提供注释 POST /v3/app/update */
export async function updateApp(
    body: API.AppUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/app/update', body, options)
}
