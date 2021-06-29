import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入重置 css
import '../public/css/reset.css'
// 引入基本样式
import './assets/css/base.less'
// 引入修改 element 默认样式
import './assets/css/changeElement.less'

// 引入 element-plus
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import axios from "axios";

// 引入封装的 axios
const app = createApp(App)

app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')

