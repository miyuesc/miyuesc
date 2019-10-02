<template>
  <div class="post">
    <loading v-if="doLoading"> </loading>

    <div class="main" v-else>
      <div
        class="cover"
        :style="{
          backgroundImage: 'url(' + background + ')'
        }"
      ></div>
      <div class="main-body" :class="!isMobile ? 'main-body-web' : ''">
        <div class="post-body">
          <div class="post-title">
            <span>{{ articleInfo.title }}</span>
          </div>
          <div class="post-info">
            <div class="info-created">发布时间：{{ updateTime }}</div>
            <div class="info-tags">
              <div
                class="info-tag"
                v-for="i in articleInfo.labels"
                :key="i.id"
                :style="{ background: '#' + i.color }"
              >
                {{ i.name }}
              </div>
            </div>
          </div>
          <div class="post-text">
            <mark-down
              :content="articleInfo.body"
              :only-render="false"
              @created="initTitle"
            ></mark-down>
            <comment
              v-if="initComment"
              :id="articleInfo.id"
              :number="articleInfo.number"
              :title="articleInfo.title"
              style="border-top: 0.01rem dashed #b5b5b5"
            ></comment>
          </div>
        </div>
        <div class="post-menu" id="post-menu" v-if="!isMobile">
          <nav-titles
            :data="postMenus"
            :class="menuBarFixed ? 'isFixed' : ''"
          ></nav-titles>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import MarkDown from "@/components/MarkDown/Index.vue";
import Comment from "@/components/Comment/Index.vue";
import NavTitles from "@/components/NavTitles/Index.vue";
import { formatJSONDate } from "@/utils/format";
// import { queryPost } from "@/utils/services";
import { title } from "@/utils/interface";
import { queryAddArchive, queryArchive } from "@/utils/services";

const w: any = window;
const d: any = document;

@Component({
  components: {
    MarkDown,
    Comment,
    NavTitles
  }
})
export default class Post extends Vue {
  number: any = "";
  doLoading: boolean = true;
  initComment: boolean = false;
  menuBarFixed: boolean = false;
  articleInfo: any = null;
  background: string = "";
  updateTime: string = "";
  postMenus: any[] = [];
  currentIndex: number = 0;
  isMobile: Boolean = true;
  $isMobile: any;

  async created() {
    this.isMobile = this.$isMobile;
    this.number = this.$route.params.number;
    this.getArticleInfo()
      .then(() => {
        this.$nextTick(() => {
          this.initComment = true;
          setTimeout(() => {
            this.doLoading = false;
          }, 100);
        });
      })
      .then(() => {
        window.addEventListener("scroll", this.winListener);
      });
  }

  async winListener() {
    const offsetTop: number =
      document.documentElement.scrollTop || document.body.scrollTop;
    this.menuBarFixed = offsetTop > 320;
    this.currentIndex = offsetTop === 0 ? 0 : this.currentIndex;
  }

  async getArticleInfo() {
    this.articleInfo = await this.$store.dispatch("queryPost", {
      number: this.number
    });
    this.updateTime = formatJSONDate(this.articleInfo.created_at);
    this.background = this.articleInfo.body.match(/http\S*png/)
      ? this.articleInfo.body.match(/http\S*png/)
      : this.articleInfo.body.match(/http\S*jpg/);
    queryAddArchive({
      title: this.articleInfo.title,
      id: this.articleInfo.id,
      date: formatJSONDate(this.articleInfo.created_at),
      isYear: false,
      summary: this.articleInfo.body
        .split("summary_start")[1]
        .split("summary_end")[0]
    }).then(() => {
      return null;
    });
  }

  initTitle(titles: any) {
    let test: Array<title> = [];
    let firstTitleLevel = titles[0].level;
    let key = 0;

    test[0] = {
      parent: 0,
      ...titles[0],
      children: []
    };

    for (let i = 1; i < titles.length; i++) {
      if (firstTitleLevel - titles[i].level === 0) {
        test.push({ parent: 0, ...titles[i], children: [] });
        key++;
      } else {
        test[key].children.push({
          parent: key,
          ...titles[i],
          children: []
        });
      }
    }

    this.postMenus = test;
  }

  beforeDestroy(): void {
    window.removeEventListener("scroll", this.winListener);
  }
}
</script>

<style scoped lang="less">
@import "./post.less";
</style>
