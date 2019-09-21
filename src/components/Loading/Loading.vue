<template>
  <div class="loading"></div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";

@Component
export default class Loading extends Vue {}
</script>

<style lang="less">
.loading {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  text-align: center;
  font-size: 1rem;
  background: #ffffff;
  display: flex;
}
</style>
