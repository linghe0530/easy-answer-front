import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 GET /v3/picture/get */
export async function getPictureById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getPictureByIdParams,
    options?: RequestOptions,
): Promise<API.RPicture> {
    return request.get('/v3/picture/get', params, options)
}

/** 此处后端没有提供注释 POST /v3/picture/list/page */
export async function listPictureByPage(
    body: API.PictureQueryRequest,
    options?: RequestOptions,
): Promise<API.RPagePicture> {
    return request.post('/v3/picture/list/page', body, options)
}

/** 此处后端没有提供注释 POST /v3/picture/review */
export async function reviewPicture(
    body: API.PictureReviewRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/picture/review', body, options)
}

/** 此处后端没有提供注释 POST /v3/picture/update */
export async function updatePicture(
    body: API.PictureUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/picture/update', body, options)
}

/** 此处后端没有提供注释 POST /v3/picture/upload/batch */
export async function uploadPictureBatch(
    body: API.PictureUploadBatchRequest,
    options?: RequestOptions,
): Promise<API.RInteger> {
    return request.post('/v3/picture/upload/batch', body, options)
}
