import request, { type RequestOptions } from '@/utils/request'

/** 此处后端没有提供注释 POST /question/add */
export async function addQuestion(
    body: API.QuestionAddRequest,
    options?: RequestOptions,
): Promise<API.RString> {
    return request.post('/question/add', body, options)
}

/** 此处后端没有提供注释 POST /question/ai_generate */
export async function aiGenerateQuestion(
    body: API.AiGenerateQuestionRequest,
    options?: RequestOptions,
): Promise<API.RListQuestionContentDTO> {
    return request.post('/question/ai_generate', body, options)
}

/** 此处后端没有提供注释 POST /question/delete */
export async function deleteQuestion(
    body: API.DeleteRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/question/delete', body, options)
}

/** 此处后端没有提供注释 POST /question/edit */
export async function editQuestion(
    body: API.QuestionEditRequest,
    options?: RequestOptions,
): Promise<API.RBoolean> {
    return request.post('/question/edit', body, options)
}

/** 此处后端没有提供注释 GET /question/get/resp */
export async function getQuestionRespById(
    params: API.getQuestionRespByIdParams,
    options?: RequestOptions,
): Promise<API.RQuestionResp> {
    return request.get('/question/get/resp', { params, ...options })
}

/** 此处后端没有提供注释 POST /question/list/page/resp */
export async function listQuestionRespPage(
    body: API.QuestionQueryRequest,
    options?: RequestOptions,
): Promise<API.RPageQuestionResp> {
    return request.post('/question/list/page/resp', body, options)
}
