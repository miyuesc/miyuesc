<template>
  <div class="archive">
    <loading v-if="doLoading"> </loading>

    <div class="main" v-else>
      <div class="cover">
        <span>BLOG ARCHIVE</span>
      </div>
      <div class="archive-main">
        <div class="archive-item" v-for="i in archives" :key="i.id">
          <div class="item-date">{{ i.date }}</div>
          <div class="item-marker"></div>
          <div class="item-title">{{ i.title }}</div>
          <div class="item-summary">{{ i.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { queryArchive } from "@/utils/services";

@Component
export default class Index extends Vue {
  doLoading: boolean = true;
  archives: {
    date: string;
    id: number;
    isYear: boolean;
    title: string;
    summary: string;
    year: number;
  }[] = [];

  created() {
    queryArchive().then((res: any) => {
      this.archives = res.map((i: any) => i.attributes);
      this.doLoading = false;
    });
  }
}
</script>

<style scoped lang="less">
@import "./archive.less";
</style>
