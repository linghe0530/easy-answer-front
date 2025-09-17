declare namespace API {
    type AiGenerateQuestionRequest = {
        appId?: string
        questionNum?: number
        optionNum?: number
    }

    type aiGenerateQuestionSseParams = {
        appId: string
        questionNum?: number
        optionNum?: number
    }

    type App = {
        id?: string
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        reviewTime?: string
        userId?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type AppAddRequest = {
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
    }

    type AppAnswerCountDTO = {
        appId?: string
        answerCount?: number
    }

    type AppAnswerResultCountDTO = {
        resultName?: string
        resultCount?: number
    }

    type AppEditRequest = {
        id?: string
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
    }

    type AppQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        userId?: string
        notId?: number
        searchText?: string
    }

    type AppResp = {
        id?: string
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        reviewTime?: string
        userId?: string
        createTime?: string
        updateTime?: string
        user?: UserResp
    }

    type AppUpdateRequest = {
        id?: string
        appName?: string
        appDesc?: string
        appIcon?: string
        appType?: number
        scoringStrategy?: number
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        reviewTime?: string
    }

    type BiResponse = {
        chartId?: number
        genChart?: string
        genResult?: string
    }

    type Chart = {
        id?: string
        goal?: string
        name?: string
        chartData?: string
        chartType?: string
        genChart?: string
        genResult?: string
        status?: number
        execMessage?: string
        userId?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type ChartAddRequest = {
        name?: string
        goal?: string
        chartData?: string
        chartType?: string
    }

    type ChartEditRequest = {
        name?: string
        id?: string
        goal?: string
        chartData?: string
        chartType?: string
    }

    type ChartQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        name?: string
        goal?: string
        chartType?: string
        userId?: string
    }

    type CreateOutPaintingTaskResponse = {
        output?: Output
        code?: string
        message?: string
        requestId?: string
    }

    type CreatePictureOutPaintingTaskRequest = {
        pictureId: string
        parameters?: Parameters
    }

    type DeleteRequest = {
        id: string
    }



    type GenChartByAIRequest = {
        name?: string
        goal?: string
        chartType?: string
        file?: string
    }

    type getAppAnswerResultCountParams = {
        appId: string
    }

    type getAppRespByIdParams = {
        id: string
    }

    type getChartByIdParams = {
        id: string
    }

    type GetOutPaintingTaskResponse = {
        requestId?: string
        output?: Output
        usage?: Usage
    }

    type getPictureByIdParams = {
        id: string
    }

    type getPictureOutPaintingTaskParams = {
        taskId: string
    }


    type getQuestionRespByIdParams = {
        id: string
    }

    type getScoringResultRespByIdParams = {
        id: string
    }

    type getUserAnswerRespByIdParams = {
        id: string
    }

    type ImageItem = {
        contsign?: string
        height?: number
        width?: number
        thumbUrl?: string
        hoverUrl?: string
        fromUrl?: string
        objUrl?: string
        index?: number
        page?: number
    }

    type Option = {
        result?: string
        score?: number
        value: string
        key: string
    }

    type OrderItem = {
        column?: string
        asc?: boolean
    }

    type Output = {
        taskId?: string
        taskStatus?: string
    }

    type PageApp = {
        records?: App[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageApp
        searchCount?: PageApp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageAppResp = {
        records?: AppResp[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageAppResp
        searchCount?: PageAppResp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageChart = {
        records?: Chart[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageChart
        searchCount?: PageChart
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PagePicture = {
        records?: Picture[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PagePicture
        searchCount?: PagePicture
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PagePictureResp = {
        records?: PictureResp[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PagePictureResp
        searchCount?: PagePictureResp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageQuestion = {
        records?: Question[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageQuestion
        searchCount?: PageQuestion
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageQuestionResp = {
        records?: QuestionResp[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageQuestionResp
        searchCount?: PageQuestionResp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageScoringResult = {
        records?: ScoringResult[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageScoringResult
        searchCount?: PageScoringResult
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageScoringResultResp = {
        records?: ScoringResultResp[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageScoringResultResp
        searchCount?: PageScoringResultResp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageUser = {
        records?: User[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageUser
        searchCount?: PageUser
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageUserAnswer = {
        records?: UserAnswer[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageUserAnswer
        searchCount?: PageUserAnswer
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type PageUserAnswerResp = {
        records?: UserAnswerResp[]
        total?: number
        size?: number
        current?: number
        orders?: OrderItem[]
        optimizeCountSql?: PageUserAnswerResp
        searchCount?: PageUserAnswerResp
        optimizeJoinOfCountSql?: boolean
        maxLimit?: number
        countId?: string
        pages?: number
    }

    type Parameters = {
        angle?: number
        outputRatio?: string
        topOffset?: number
        bottomOffset?: number
        leftOffset?: number
        rightOffset?: number
        bestQuality?: boolean
        limitImageSize?: boolean
        addWatermark?: boolean
        xScale?: number
        yScale?: number
    }

    type Picture = {
        id?: string
        url?: string
        name?: string
        introduction?: string
        category?: string
        tags?: string
        picSize?: number
        picWidth?: number
        picHeight?: number
        picScale?: number
        picFormat?: string
        picColor?: string
        thumbnailUrl?: string
        userId?: string
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        reviewTime?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type PictureDeleteRequest = {
        id?: string
        spaceId?: number
    }

    type PictureEditByBatchRequest = {
        pictureIdList?: number[]
        spaceId?: number
        category?: string
        tags?: string[]
        nameRule?: string
    }

    type PictureEditRequest = {
        id?: string
        name?: string
        introduction?: string
        category?: string
        tags?: string[]
    }

    type PictureGetRequest = {
        id: string
    }

    type PictureQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        name?: string
        introduction?: string
        category?: string
        tags?: string[]
        picSize?: number
        picWidth?: number
        picHeight?: number
        picScale?: number
        picFormat?: string
        searchText?: string
        userId?: string
        reviewStatus?: number
        reviewMessage?: string
        reviewerId?: number
        reviewTime?: string
        spaceId?: number
        nullSpaceId?: boolean
        startEditTime?: string | Date
        endEditTime?: string | Date
    }

    type PictureResp = {
        id?: string
        url?: string
        thumbnailUrl?: string
        name?: string
        introduction?: string
        tags?: string[]
        category?: string
        picSize?: number
        picWidth?: number
        picHeight?: number
        picScale?: number
        picFormat?: string
        picColor?: string
        userId?: string
        createTime?: string
        updateTime?: string
        user?: UserResp
        permissionList?: string[]
    }

    type PictureReviewRequest = {
        id: string
        reviewStatus: number
        reviewMessage?: string
    }

    type PictureTagCategoryResponse = {
        tagList?: string[]
        categoryList?: string[]
    }

    type PictureUpdateRequest = {
        id?: string
        name?: string
        introduction?: string
        category?: string
        tags?: string[]
    }

    type PictureUploadBatchRequest = {
        searchText?: string
        count?: number
        namePrefix?: string
    }

    type PictureUploadRequest = {
        id?: string
        fileUrl?: string
        picName?: string
    }

    type Question = {
        id?: string
        questionContent?: string
        appId?: string
        userId?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type QuestionAddRequest = {
        questionContent: QuestionContentDTO[]
        appId: string
    }

    type QuestionContentDTO = {
        title?: string
        options?: Option[]
    }

    type QuestionEditRequest = {
        id: string
        questionContent: QuestionContentDTO[]
    }

    type QuestionQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        questionContent?: string
        appId?: string
        userId?: string
        notId?: number
    }

    type QuestionResp = {
        id?: string
        questionContent?: QuestionContentDTO[]
        appId?: string
        userId?: string
        createTime?: string
        updateTime?: string
        user?: UserResp
    }

    type QuestionUpdateRequest = {
        id?: string
        questionContent?: QuestionContentDTO[]
    }

    type RAppResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: AppResp
    }

    type RBiResponse = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: BiResponse
    }

    type RBoolean = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: boolean
    }

    type RChart = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: Chart
    }

    type RCreateOutPaintingTaskResponse = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: CreateOutPaintingTaskResponse
    }

    type ReviewRequest = {
        id: string
        reviewStatus?: number
        reviewMessage?: string
    }

    type RGetOutPaintingTaskResponse = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: GetOutPaintingTaskResponse
    }

    type RInteger = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: number
    }

    type RListAppAnswerCountDTO = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: AppAnswerCountDTO[]
    }

    type RListAppAnswerResultCountDTO = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: AppAnswerResultCountDTO[]
    }

    type RListImageItem = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: ImageItem[]
    }

    type RListPictureResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: PictureResp[]
    }

    type RListQuestionContentDTO = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: QuestionContentDTO[]
    }

    type RLong = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: number
    }

    type RPageApp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageApp
    }

    type RPageAppResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageAppResp
    }

    type RPageChart = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageChart
    }

    type RPagePicture = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PagePicture
    }

    type RPagePictureResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PagePictureResp
    }

    type RPageQuestion = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageQuestion
    }

    type RPageQuestionResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageQuestionResp
    }

    type RPageScoringResult = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageScoringResult
    }

    type RPageScoringResultResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageScoringResultResp
    }

    type RPageUser = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageUser
    }

    type RPageUserAnswer = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageUserAnswer
    }

    type RPageUserAnswerResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PageUserAnswerResp
    }

    type RPicture = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: Picture
    }

    type RPictureResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PictureResp
    }

    type RPictureTagCategoryResponse = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: PictureTagCategoryResponse
    }

    type RQuestionResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: QuestionResp
    }

    type RScoringResultResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: ScoringResultResp
    }

    type RString = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        /** 响应数据 */
        data?: string
    }

    type RUserAnswerResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: UserAnswerResp
    }

    type RUserResp = {
        /** 业务状态码，20000-成功，其它-失败 */
        code?: number
        /** 响应消息 */
        msg?: string
        data?: UserResp
    }

    type ScoringResult = {
        id?: string
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string
        resultScoreRange?: number
        appId?: string
        userId?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type ScoringResultAddRequest = {
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string[]
        resultScoreRange?: number
        appId?: string
    }

    type ScoringResultEditRequest = {
        id?: string
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string[]
        resultScoreRange?: number
    }

    type ScoringResultQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string
        resultScoreRange?: number
        appId?: string
        userId?: string
        notId?: number
        searchText?: string
    }

    type ScoringResultResp = {
        id?: string
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string[]
        resultScoreRange?: number
        appId?: string
        userId?: string
        createTime?: string
        updateTime?: string
        user?: UserResp
    }

    type ScoringResultUpdateRequest = {
        id?: string
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultProp?: string[]
        resultScoreRange?: number
    }

    type SearchPictureByColorRequest = {
        picColor?: string
    }

    type SearchPictureByPictureRequest = {
        pictureId: string
    }

    type SseEmitter = {
        timeout?: number
    }

    type uploadPicture1Params = {
        request: UploadPictureRequest
        picture: string
    }



    type UploadPictureRequest = {
        appId?: string
    }

    type Usage = {
        imageCount?: number
    }

    type User = {
        id?: string
        userAccount?: string
        userPassword?: string
        userName?: string
        userAvatar?: string
        userProfile?: string
        userRole?: string
        editTime?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type UserAnswer = {
        id?: string
        appId?: string
        appType?: number
        scoringStrategy?: number
        choices?: string
        resultId?: number
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultScore?: number
        userId?: string
        createTime?: string
        updateTime?: string
        isDelete?: number
    }

    type UserAnswerAddRequest = {
        id: string
        appId: string
        choices?: string[]
    }

    type UserAnswerEditRequest = {
        id?: string
        appId?: string
        choices?: string[]
    }

    type UserAnswerQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        appId?: string
        appType?: number
        scoringStrategy?: number
        choices?: string
        resultId?: number
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultScore?: number
        userId?: string
        notId?: number
        searchText?: string
    }

    type UserAnswerResp = {
        id?: string
        appId?: string
        appType?: number
        scoringStrategy?: number
        choices?: string[]
        resultId?: number
        resultName?: string
        resultDesc?: string
        resultPicture?: string
        resultScore?: number
        userId?: string
        createTime?: string
        updateTime?: string
        user?: UserResp
    }

    type UserAnswerUpdateRequest = {
        id?: string
        appId?: string
        choices?: string[]
    }

    type UserLoginRequest = {
        userAccount?: string
        userPassword?: string
    }

    type UserQueryRequest = {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
        id?: string
        userName?: string
        userAccount?: string
        userProfile?: string
        userRole?: string
    }

    type UserRegisterRequest = {
        userAccount: string
        userPassword: string
        checkPassword: string
    }

    type UserResp = {
        id?: string
        userName?: string
        userAvatar?: string
        userProfile?: string
        userRole?: string
        createTime?: string
    }

    type UserUpdateRequest = {
        id?: string
        userName?: string
        userAvatar?: string
        userProfile?: string
        userRole?: string
    }
}
