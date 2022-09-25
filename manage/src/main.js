import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'

import vant from 'vant'
import 'vant/lib/index.css'

// 引入bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import 'zico/css/zico.min.css'

// 导入font-awesome图标库
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

// 使用组件
Vue.use(VueAxios,axios)
Vue.use(VueCookies)
Vue.use(vant)

Vue.prototype.staticUrl = 'http://127.0.0.1:8000';
// Vue.prototype.staticUrl = 'http://120.55.81.135:10002';
// Vue.prototype.$http = axios
// 设置基础请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8000';
// axios.defaults.baseURL = 'http://120.55.81.135:10002';

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 携带cookie
axios.defaults.withCredentials = true;

// 添加axios请求拦截器, 该方法在请求之前触发
axios.interceptors.request.use(params => {
  // 将token的值赋值给headers
  // 
  if(VueCookies.get('_abc')){
    params.headers['token'] = VueCookies.get('_abc')
  }
  
  if(params.method == 'post'){
    // 
    // 进行data参数序列化
    if(params.data){
      let dataStr = ''
      for(let key in params.data){
        dataStr += key + '=' + params.data[key] + '&'
        // 
      }
      // 截取掉最后一个&符号赋值给params.data
      params.data = dataStr.slice(0,-1)
    }
  }
  return params
},err=>{
  return Promise.reject(err);
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
