import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import '@/icons/index.js'
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/map";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "mavon-editor/dist/css/index.css";
import mavonEditor from "mavon-editor";
import axios from "axios";
import "./assets/css/index.css";
import "./assets/css/iconfont.css";
import config from "./utils/config";
import VueAxios from "vue-axios";
import dayjs from "dayjs";
import qs from "qs";
import VueCalendarHeatmap from "vue-calendar-heatmap";
import tagCloud from "./components/tag-cloud";

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.component("v-chart", ECharts);
Vue.prototype.config = config;
Vue.use(VueCalendarHeatmap);
Vue.use(tagCloud);
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(mavonEditor);
Vue.prototype.$moment = dayjs;
Vue.prototype.$qs = qs;

Vue.filter("date", function(value, formatStr = "YYYY-MM-DD") {
  return dayjs(value).format(formatStr);
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

axios.defaults.baseURL = "http://localhost"

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(config => {
  if (localStorage.getItem("token")){
    config.headers.token = localStorage.getItem("token")
  }
  return config
  },
  error => {return Promise.reject(error)})


