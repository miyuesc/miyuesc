<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
/**
 * @Description: -
 * @Author: -
 * @Date: -
 **/

import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class SvgIcon extends Vue {
  @Prop({ type: String, required: true })
  iconClass!: string;
  @Prop({ type: String, required: false })
  className!: string;

  get iconName() {
    return `#icon-${this.iconClass}`;
  }
  get svgClass() {
    if (this.className) {
      return "svg-icon " + this.className;
    } else {
      return "svg-icon";
    }
  }
}
</script>

<style scoped lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
