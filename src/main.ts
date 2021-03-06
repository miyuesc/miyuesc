import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

// 引入highlight代码高亮插件
// @ts-ignore
import hljs from "highlight.js";
import "highlight.js/styles/agate.css"; //样式文件
Vue.directive("highlight", function(el) {
  let blocks: any = el.querySelectorAll("pre code");
  blocks.forEach((block: any) => {
    hljs.highlightBlock(block);
  });
});

// @ts-ignore
import isMobile from "ismobilejs";
Vue.prototype.$isMobile = isMobile.phone;

// 引入gitalk评论模块
import "gitalk/dist/gitalk.css";

import Loading from "@/components/Loading/index";
Vue.use(Loading);

import "@/components/SvgIcons";

Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vm;
