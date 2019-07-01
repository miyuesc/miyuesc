<template>
  <div class="about">
    <div class="main">
      <div class="cover">
        <span>ABOUT ME</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>

<style scoped lang="less">
@import "./about.less";
</style>
