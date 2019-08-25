<template>
  <div class="post">
    <div class="loading" v-if="doLoading">
      <img
        src="../../assets/icons/loading.gif"
        alt="loading"
        style="margin: auto; width: 0.6rem; height: 0.6rem"
      />
    </div>

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
          <ul class="post-menu-ul" :class="menuBarFixed ? 'isFixed' : ''">
            <li
              v-for="(m, k) in postMenus"
              :key="k"
              class="post-menu-li"
              :style="{
                textIndent: (m.level - 1) * 0.16 + 'rem'
              }"
              :class="currentIndex === k ? 'active' : ''"
            >
              <a :href="m.href" @click="currentIndex = k" :title="m.title">
                {{ m.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import MarkDown from "@/components/MarkDown/Index.vue";
import Comment from "@/components/Comment/Index.vue";
import { formatJSONDate } from "@/utils/format";
// import { queryPost } from "@/utils/services";

const w: any = window;
const d: any = document;

@Component({
  components: {
    MarkDown,
    Comment
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
  winListener: any = null;
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
          }, 100)
        });
      })
      .then(() => {
        this.winListener = window.addEventListener("scroll", () => {
          const offsetTop: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          this.menuBarFixed = offsetTop > 320;
          this.currentIndex = offsetTop === 0 ? 0 : this.currentIndex;
        });
        // let data: any = document.getElementsByClassName("hidden-anchor");
      });
  }
  async getArticleInfo() {
    this.articleInfo = await this.$store.dispatch("queryPost", {
      number: this.number
    });
    this.updateTime = formatJSONDate(this.articleInfo.created_at);
    this.background = this.articleInfo.body.match(/http\S*png/)
      ? this.articleInfo.body.match(/http\S*png/)
      : this.articleInfo.body.match(/http\S*jpg/);
    this.getTitle(this.articleInfo.body).then((data: any) => {
      this.postMenus = data;
    });
  }

  async getTitle(content: any) {
    let nav = [];

    let tempArr: any[] = [];
    content.replace(/(#+)[^#][^\n]*?(?:\n)/g, function(
      match: any,
      m1: any,
      m2: any
    ) {
      let title = match.replace("\n", "");
      let level = m1.length;
      tempArr.push({
        title: title.replace(/^#+/, "").replace(/\([^)]*?\)/, ""),
        level: level,
        children: []
      });
    });

    // 处理标题
    nav = tempArr.filter(item => item.level <= 5);
    let index = 0;
    return (nav = nav.map(item => {
      item.href = `#h-${index}`;
      item.index = index++;
      return item;
    }));
  }

  beforeDestroy() {
    this.winListener = window.removeEventListener("scroll", () => {});
    this.winListener = null;
  }
}
</script>

<style scoped lang="less">
@import "./post.less";
</style>
