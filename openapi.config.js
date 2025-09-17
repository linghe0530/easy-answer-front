
import { generateService } from '@umijs/openapi'
generateService({
  requestLibPath: "import request from '@/utils/request'",
  schemaPath: 'http://127.0.0.1:8081/v3/api-docs',
  serversPath: './src/api2',
})
//  pnpm i @umijs/openapi jiti vue3-colorpicker vue-cropper file-saver echarts vue-echarts dayjs ant-design-vue @ant-design/icons-vue axios vue-cropper@next
