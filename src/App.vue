<template>
  <div id="app">
    <blog-header></blog-header>
    <div style="min-height: calc(100vh - 1.2rem)">
      <router-view />
      <back-to-top></back-to-top>
    </div>
    <div class="footer">
      <p>Copyright © 2019 MiyueSC. All rights reserved.</p>
      <p>Brought to you withby MiyueSC！</p>
    </div>
  </div>
</template>
<script>
//   import {Component, Vue, Watch} from "vue-property-decorator";
import BlogHeader from "@/components/Header/Index.vue";
import BackToTop from "@/components/BackToTop/Index.vue";

// @Component({
//   components: {
//     BlogHeader,
//     BlogFooter,
//     BackToTop
//   }
// })

const deviceWidth =
  document.documentElement.clientWidth > 1920 ? document.documentElement.clientWidth : 1920;

export default {
  name: "App",
  data() {
    return {
      transitionName: ""
    };
  },
  components: {
    BlogHeader,
    BackToTop
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      // this.transitionName = toDepth < fromDepth ? "slide-left" : "slide-right";
      this.transitionName = "slide";
    }
  },
  methods: {
    // 设置字号
    setRem() {
      const html = document.documentElement;
      const hWidth = html.getBoundingClientRect().width;
      // html.style.fontSize = fz <= 100 ? fz + "px" : "100px";
      if (hWidth > 750) {
        html.style.fontSize = "100px";
      } else {
        html.style.fontSize = `${hWidth / 7.5}px`;
      }
    }
  },
  created() {
    // if (this.$isMobile) {
    //   document.documentElement.style.fontSize = `${deviceWidth / 19.2}px`;
    // } else {
    //   document.documentElement.style.fontSize = `${deviceWidth / 19.2}px`;
    // }
    this.setRem();
    window.addEventListener("resize", this.setRem());
  }
};
</script>
<style lang="less">
html,
body {
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  font-family: Lato, PingFang SC, Microsoft YaHei, sans-serif;
}
/*html {*/
/*  font-size: 0.625vw;*/
/*}*/
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
  cursor: url("/Arrow.cur"), auto;
  .footer {
    display: grid;
    position: relative;
    width: 100vw;
    height: 6vh;
    background: #ffffff;
    text-align: center;
    font-weight: 400;
    p {
      margin: 0 auto;
      display: inline-block;
      line-height: 0.2rem;
      font-weight: lighter;
      font-size: 0.1rem;
    }
  }
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: rgba(58, 58, 58, 0.6);
}
</style>
