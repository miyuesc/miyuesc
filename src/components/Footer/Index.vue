<template>
  <div class="footer" style="background: #ffffff">
    <p style="font-size: 0.14rem">
      Copyright © 2019 MiyueSC. All rights reserved.
    </p>
    <p style="font-size: 0.12rem">Brought to you withby MiyueSC！</p>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class BlogFooter extends Vue {}
</script>

<style scoped lang="less">
.footer {
  border-top: 0.01rem solid rgba(183, 183, 183, 0.6);
  color: darkgrey;
  width: 100vw;
  margin: 0 auto;
  padding: 0.04rem 10vw;
  position: relative;
  z-index: 99;
  font-family: "PingFang SS", "Microsoft YaHei UI", "Apple Color Emoji", "Ubuntu", sans-serif;
  font-weight: 400;
  p {
    font-weight: lighter;
  }
}
</style>
