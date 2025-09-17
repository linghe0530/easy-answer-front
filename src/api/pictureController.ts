import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /picture/delete */
export async function deletePicture(
    body: API.PictureDeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/picture/delete', body, options)
}

/** 此处后端没有提供注释 POST /picture/edit */
export async function editPicture(
    body: API.PictureEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/picture/edit', body, options)
}

/** 此处后端没有提供注释 POST /picture/edit/batch */
export async function editPictureByBatch(
    body: API.PictureEditByBatchRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/picture/edit/batch', body, options)
}

/** 此处后端没有提供注释 GET /picture/get/resp */
export async function getPictureRespById(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureGetRequest,
    options?: RequestOptions,
): Promise<API.RPictureResp> {
    return request.get('/picture/get/resp', params, options)

}

/** 此处后端没有提供注释 POST /picture/list/page/resp */
export async function listPictureRespPage(
    body: API.PictureQueryRequest,
    options?: RequestOptions,
): Promise<API.RPagePictureResp> {
    return request.post('/picture/list/page/resp', body, options)
}

/** 此处后端没有提供注释 POST /picture/out_painting/create_task */
export async function createPictureOutPaintingTask(
    body: API.CreatePictureOutPaintingTaskRequest,
    options?: RequestOptions,
): Promise<API.RCreateOutPaintingTaskResponse> {
    return request.post('/picture/out_painting/create_task', body, options)
}

/** 此处后端没有提供注释 GET /picture/out_painting/get_task */
export async function getPictureOutPaintingTask(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.getPictureOutPaintingTaskParams,
    options?: RequestOptions,
): Promise<API.RGetOutPaintingTaskResponse> {
    return request.get('/picture/out_painting/get_task', params, options)
}

/** 此处后端没有提供注释 POST /picture/search/color */
export async function searchPictureByColor(
    body: API.SearchPictureByColorRequest,
    options?: RequestOptions,
): Promise<API.RListPictureResp> {
    return request.post('/picture/search/color', body, options)
}

/** 此处后端没有提供注释 POST /picture/search/picture */
export async function searchPictureByPicture(
    body: API.SearchPictureByPictureRequest,
    options?: RequestOptions,
): Promise<API.RListImageItem> {
    return request.post('/picture/search/picture', body, options)
}

/** 此处后端没有提供注释 GET /picture/tag_category */
export async function listPictureTagCategory(
    options?: RequestOptions,
): Promise<API.RPictureTagCategoryResponse> {
    return request.get('/picture/tag_category', options)
}

/** 此处后端没有提供注释 POST /picture/upload */
export async function uploadPicture(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    body: API.PictureUploadRequest,
    file: File,
    options?: RequestOptions,
): Promise<API.RPictureResp> {
    return request.upload(
        '/picture/upload',
        {
            ...body,
            file,
        },
        options,
    )
}

/** 此处后端没有提供注释 POST /picture/upload/url */
export async function uploadPictureByUrl(
    body: API.PictureUploadRequest,
    options?: RequestOptions,
): Promise<API.RPictureResp> {
    return request.post('/picture/upload/url', body, options)
}
