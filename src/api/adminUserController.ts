import type { RequestOptions } from '@/utils/request' // 假设RequestOptions来自这里
import request from '@/utils/request'

/**
 * 删除用户
 * @param body 删除请求参数
 * @param options 请求配置选项
 * @returns 是否删除成功的布尔值响应
 */
export async function deleteUser(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/user/delete', body, options)
}

/**
 * 分页查询用户列表
 * @param body 用户查询请求参数
 * @param options 请求配置选项
 * @returns 分页的用户列表响应
 */
export async function listUserPage(
    body: API.UserQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageUser> {
    return request.post('/v3/user/list/page', body, options)
}

/**
 * 更新用户信息
 * @param body 用户更新请求参数
 * @param options 请求配置选项
 * @returns 是否更新成功的布尔值响应
 */
export async function updateUser(
    body: API.UserUpdateRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/v3/user/update', body, options)
}
