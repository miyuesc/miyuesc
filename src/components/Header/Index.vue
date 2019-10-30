<template>
  <div class="header" :class="isTop ? '' : 'clear_styl'">
    <div class="blog-logo" @click="toPage('/')">
      <img src="../../assets/logo.png" alt="" style="height: .24rem" />
      <span v-if="!isMobile">MiyueSC Official Blog</span>
    </div>
    <div class="nav">
      <ul class="menus">
        <li class="menu-item" v-for="(i, k) in menus" :key="k" @click="toPage(i.path)">
          <svg-icon :icon-class="i.icon" class-name="menu-item-icon" />
          <span>{{ i.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import config from "@/config/index";

@Component
export default class BlogHeader extends Vue {
  menus: any[] = config.menus;
  isTop: Boolean = true;
  isMobile: Boolean = true;
  $isMobile: any;

  toPage(path: any) {
    this.$router.push({ path: path });
  }
  created() {
    this.isMobile = this.$isMobile;
    const top = document.documentElement.scrollTop || document.body.scrollTop;
    if (!top) {
      this.isTop = true;
    }
    window.addEventListener("scroll", () => {
      const tops = document.documentElement.scrollTop || document.body.scrollTop;
      this.isTop = !tops;
    });
  }
}
</script>

<style lang="less">
@import "./header.less";
</style>
