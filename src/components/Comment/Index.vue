<template>
  <div id="comment" class="comment"></div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
//@ts-ignore
import Gitalk from "../../../node_modules/gitalk";
import "gitalk/dist/gitalk.css";
import config from "@/config/index";

@Component
export default class Comment extends Vue {
  @Prop({ type: Number, default: 0 })
  id!: any;
  @Prop({ type: Number, default: 0 })
  number!: any;
  @Prop({ type: String, default: "" })
  title!: any;

  mounted() {
    const gitalk: any = new Gitalk({
      // clientID: config.gitalk.clientID,
      // clientSecret: config.gitalk.clientSecret,
      // repo: config.gitalk.repo,
      // owner: config.gitalk.owner,
      // admin: config.gitalk.admin,
      ...config.gitalk,
      id: this.id + "-" + this.number,
      title: this.title
    });
    gitalk.render("comment");
  }
}
</script>

<style scoped lang="less">
.comment {
  width: 800px;
  margin: auto;
  margin-top: 120px;
  height: auto;
  text-align: left !important;
}
</style>
