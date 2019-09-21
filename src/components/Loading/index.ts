import LoadingComponent from "./Loading.vue";

const Loading = {
  install: function(Vue: any) {
    Vue.component("Loading", LoadingComponent);
  }
};

export default Loading;
