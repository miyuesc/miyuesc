import Vue from "vue";
import SvgIcon from "@/components/SvgIcons/SvgIcon.vue"; // svg组件

// 全局注册
Vue.component("svg-icon", SvgIcon);

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
const req = require.context("./icons", false, /\.svg$/);
requireAll(req);
