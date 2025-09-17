import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /user/login */
export async function userLogin(
    body: API.UserLoginRequest,
    options?: RequestOptions,
): Promise<API.RUserResp> {
    return request.post('/user/login', body, options)
}

/** 此处后端没有提供注释 POST /user/register */
export async function userRegister(
    body: API.UserRegisterRequest,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.post('/user/register', body, options)
}

export async function getLoginInfo(options?: RequestOptions): Promise<API.RUserResp> {
    return request.get('/user/get', null, options)
}
