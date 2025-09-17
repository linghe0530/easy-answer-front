import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios'
import type { ResponseData } from '@/types/response'
import router from '@/router'
import { message } from 'ant-design-vue'

// 定义请求配置的扩展接口
export interface RequestOptions extends AxiosRequestConfig {
    // 是否显示错误信息
    showError: boolean
    onError?: (err: Error) => void
    // 是否显示加载状态
    showLoading?: boolean
}

// 创建HTTP请求类
class HttpRequest {
    // axios实例
    private instance: AxiosInstance
    // 基础配置
    private readonly baseConfig: AxiosRequestConfig = {
        baseURL: import.meta.env.PROD ? import.meta.env.VITE_BACKEND_API_URL : '/api',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    }

    constructor(config: AxiosRequestConfig = {}) {
        // 创建axios实例
        this.instance = axios.create({
            ...this.baseConfig,
            ...config,
        })

        // 初始化拦截器
        this.initInterceptors()
    }

    // 初始化拦截器
    private initInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token')
                if (token) {
                    config.headers['Authorization'] = token
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            },
        )

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                const { showError = true, onError } = response.config as RequestOptions

                // 根据业务状态码处理
                const { code, msg } = response.data
                if (code === 0) {
                    return response.data
                } else if (code === 40100) {
                    void router.push('/user/login')
                    void message.error(msg || '未登录')
                    return null
                } else if (code === 40101) {
                    void router.push('/')
                    void message.error(msg || '暂无权限访问')
                    return null
                } else {
                    if (showError) {
                        void message.error(msg || '系统开小差了,请联系管理员!!!')
                    }
                    if (onError) {
                        onError(new Error(msg || '系统开小差了,请联系管理员!!!'))
                    }
                    return null
                }
            },
            (error: AxiosError<ResponseData>) => {
                const { showError = true } = error.config as RequestOptions

                // 处理HTTP错误状态码
                let errorMessage = '网络请求错误'
                const status = error.response?.status

                switch (status) {
                    case 400:
                        errorMessage = '请求参数错误'
                        break
                    case 401:
                        errorMessage = '未授权，请重新登录'
                        // 可以在这里处理登出逻辑
                        // logout();
                        break
                    case 403:
                        errorMessage = '拒绝访问'
                        break
                    case 404:
                        errorMessage = '请求资源不存在'
                        break
                    case 500:
                        errorMessage = '服务器错误'
                        break
                    default:
                        if (error.message.includes('timeout')) {
                            errorMessage = '请求超时'
                        } else if (error.message.includes('Network')) {
                            errorMessage = '网络连接错误'
                        }
                        break
                }

                // 显示错误信息
                if (showError) {
                    void message.error(errorMessage || '系统开小差了,请联系管理员!!!')
                }

                return Promise.reject(error)
            },
        )
    }

    // GET请求
    public get<T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> {
        return this.instance.get(url, { params, ...options })
    }

    // POST请求
    public post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.instance.post(url, data, options)
    }

    // 上传文件
    public upload<T = any>(url: string, formData: any, options?: RequestOptions): Promise<T> {
        return this.instance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...options,
        })
    }

    public postForm<T = any>(
        url: string,
        params: Record<string, any>,
        options?: RequestOptions,
    ): Promise<T> {
        const form = new FormData()
        for (const key in params) {
            form.append(key, params[key] == undefined ? '' : params[key])
        }
        return this.instance.post(url, form, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            ...options,
        })
    }

    // 下载文件
    public download(url: string, params?: any, options?: RequestOptions): Promise<Blob> {
        return this.instance.get(url, {
            params,
            responseType: 'blob',
            ...options,
        })
    }
}

// 创建请求实例
const request = new HttpRequest()
export default request
