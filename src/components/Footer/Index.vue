<template>
  <div class="footer">
    <div style="font-size: 0.14rem">
      Copyright © 2019 MiyueSC. All rights reserved.
    </div>
    <div style="font-size: 0.12rem">Brought to you withby MiyueSC！</div>
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
  width: 12rem;
  /*height: 0.48rem;*/
  line-height: 0.16rem;
  padding: 0.06rem;
  margin: auto;
  margin-top: 0.24rem;
  font-family: "Apple Color Emoji", "Ubuntu", sans-serif;
  div {
    padding: 0;
    margin: 0 auto;
    height: 0.2rem;
  }
}
</style>
