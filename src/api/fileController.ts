import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /user/login */
export async function userLogin(
    body: API.UserLoginRequest,
    options?: RequestOptions,
): Promise<API.RUserResp> {
    return request.post('/user/login', body, options)
}

/** 此处后端没有提供注释 POST /picture/upload */
export async function uploadPicture(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.PictureUploadRequest,
    picture?: File,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.upload(
        '/file/upload',
        {
            ...params,
            picture,
        },
        options,
    )
}
