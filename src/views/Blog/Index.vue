<template>
  <div class="blog">
    <loading v-if="doLoading"> </loading>

    <div class="main" v-else>
      <div class="cover">
        <span>TECH, RECORD AND LIFE</span>
      </div>
      <div class="articles-box">
        <div class="articles">
          <article class="article-card" v-for="(i, k) in articles" :key="k">
            <div style="width: 4.00rem; height: 100%; float: left">
              <div class="article-title" @click="gotoPost(i.number)">
                <span>{{ i.title }}</span>
              </div>
              <div class="article-time">Released at {{ i.updateTime }}</div>
              <div
                class="article-tag"
                v-for="(tag, index) in i.labels"
                :key="index"
                :style="{ color: '#' + tag.color }"
              >
                {{ tag.name }}
              </div>
              <div class="article-desc">
                <mark-down :content="i.body" :only-render="true"></mark-down>
              </div>
            </div>
            <div class="article-cover">
              <img
                :src="i.body.match(/http\S*jpg/) || i.body.match(/http\S*png/)"
                @click="gotoPost(i.number)"
                :alt="i.title"
              />
            </div>
          </article>
          <div class="error-img" v-if="!articles.length">
            <img
              src="http://ww1.sinaimg.cn/large/0067sbCSly1g4fs489wyog306o06o74f.gif"
              alt="sorry,There are no posts under this category"
            />
            <p class="error-text">
              I'm sorry,There are no posts under this category!
            </p>
            <p class="error-text">
              And I will complement as soon as possible
            </p>
          </div>
          <div class="buttons">
            <button
              v-show="filter.page > 1"
              class="page-button pre-button"
              @click="changePage('pre')"
            >
              上一页
            </button>
            <button
              v-show="total > filter.page * filter.pageSize"
              class="page-button next-button"
              @click="changePage('next')"
            >
              下一页
            </button>
          </div>
        </div>
        <div v-if="!isMobile" class="lists">
          <div class="tags-list">
            <div class="tags-title">
              <svg-icon svg-class="tag"></svg-icon>
              <span style="vertical-align: top" class="tag-box-title" @click="resetFilter"
                >Tags</span
              >
            </div>
            <div class="tags">
              <div
                class="tag-item"
                v-for="tag in tags"
                :key="tag.id"
                :style="{ color: '#' + tag.color }"
                @click="queryFilter(tag.name, 'tag')"
              >
                <div class="tag-name">{{ tag.name }}</div>
              </div>
            </div>
          </div>
          <div class="category-list">
            <div class="category-title">
              <svg-icon svg-class="category"></svg-icon>
              <div class="category-box-title" @click="resetFilter">
                Categories
              </div>
            </div>
            <div class="categories">
              <div
                class="category-item"
                v-for="category in categories"
                :key="category.id"
                @click="queryFilter(category.number, 'category')"
              >
                <div class="border-left"></div>
                <div class="category-name">{{ category.title }}</div>
                <div class="border-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import {
  queryPosts,
  queryCategory,
  queryPostsTotal,
  queryTagTotal,
  queryArchive
} from "@/utils/services";
import MarkDown from "@/components/MarkDown/Index.vue";

@Component({
  components: {
    MarkDown
  }
})
export default class Blog extends Vue {
  doLoading: boolean = true;
  filter: any = {
    page: 1,
    pageSize: 5,
    filter: ""
  };
  total: number = 0;
  articles: any[] = [];
  tags: any[] = [];
  categories: any[] = [];
  isMobile: Boolean = true;
  $isMobile: any;

  preNotDisabled() {
    return this.filter.page >= 1;
  }
  nextNotDisabled() {
    return this.total > this.filter.page * this.filter.pageSize;
  }

  async created() {
    await this.queryTag();
    await this.getCategory();
    this.getAllBlog();
    this.isMobile = this.$isMobile;
    queryArchive().then((res: any) => {});
  }
  // 获取所有文章
  getAllBlog() {
    queryPosts(this.filter).then((data: any) => {
      this.doLoading = false;
      this.articles = data;
      // console.log(data);
      this.articles.forEach((i: any) => {
        i.updateTime = i.updated_at.toString().substring(0, 10);
      });
    });
    queryPostsTotal().then((data: any) => {
      // console.log(data);
      this.total = data.repository.issues.totalCount;
    });
  }

  changePage(type: string) {
    this.doLoading = true;
    type === "next" ? this.filter.page++ : this.filter.page--;
    queryPosts(this.filter).then((data: any) => {
      this.articles = data;
      this.articles.forEach((i: any) => {
        i.updateTime = i.updated_at.toString().substring(0, 10);
      });
      this.doLoading = false;
    });
  }
  // 获取标签列表
  async queryTag() {
    this.tags = await this.$store.dispatch("queryTag");
  }
  // 获取分类列表
  async getCategory() {
    this.categories = await queryCategory();
    // console.log(this.categories);
  }
  // 查看文章
  gotoPost(number: any) {
    this.$router.push({ name: "post", params: { number } });
  }
  // 筛选查看
  queryFilter(filter: any, type: string) {
    this.doLoading = true;
    this.filter.filter = type === "tag" ? `&labels=${filter}` : `&milestone=${filter}`;
    let labels: string = type === "tag" ? filter : "";
    let milestone: string = type === "category" ? filter : "";
    queryPosts(this.filter).then((data: any) => {
      this.articles = data;
      this.articles.forEach((i: any) => {
        i.updateTime = i.updated_at.toString().substring(0, 10);
      });
      this.doLoading = false;
    });
    queryTagTotal({ label: labels, milestone: milestone }).then(
      (data: any) => (this.total = data.search.issueCount)
    );
  }
  // 重置筛选
  resetFilter() {
    this.doLoading = true;
    this.filter = { page: 1, pageSize: 5, filter: "" };
    this.getAllBlog();
  }
}
</script>

<style scoped lang="less">
@import "./blog.less";
</style>
