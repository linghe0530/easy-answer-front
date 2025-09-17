import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores'
import Antd from 'ant-design-vue'
import 'vue-cropper/dist/index.css'
import 'ant-design-vue/dist/reset.css'
import '@/access/access.ts'



const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
