// 定义接口响应数据结构
export interface ResponseData<T = any> {
    code: number
    data: T
    msg: string
}
