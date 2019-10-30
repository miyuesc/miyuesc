<template>
  <div class="home">
    <loading v-if="doLoading"> </loading>
    <template v-else>
      <section id="background" class="background">
        <img
          :src="background"
          @load="bgDownload"
          :class="bgOpacity ? 'changing' : '0'"
          alt="background"
        />
      </section>
      <div class="title" data-value="HI,MIYUESC!">HI,MIYUESC!</div>
      <div class="tools">
        <div class="text">
          <svg-icon icon-class="quotes" style="float: left; width: 0.2rem; height: 0.2rem" />
          <span>{{ subTitle }}</span>
          <svg-icon icon-class="quotes" style="float: right; width: 0.2rem; height: 0.2rem" />
        </div>
        <ul class="tools-box">
          <li @click="changeBg('pre')">
            <svg-icon icon-class="angle-left" style="width: 0.2rem; height: 0.2rem" />
          </li>
          <li
            v-for="(i, k) in contacts"
            :key="k"
            :class="i.code ? 'has_code' : ''"
            @mouseenter="showCode = !!(i.code && !showCode)"
            @mouseleave="showCode = false"
          >
            <a :href="i.link" rel="noopener noreferrer" target="_blank">
              <svg-icon :icon-class="i.icon" style="width: 0.2rem; height: 0.2rem"
            /></a>
            <div v-if="i.code" class="code" :style="{ opacity: showCode ? 1 : 0 }">
              <img :src="i.code" class="code-image" />
            </div>
          </li>
          <li @click="changeBg('next')">
            <svg-icon icon-class="angle-right" style="width: 0.2rem; height: 0.2rem" />
          </li>
        </ul>
      </div>
      <div class="main-content">
        <div class="news-div">NEWS</div>
        <div class="news" :style="{ 'flex-direction': isMobile ? 'column' : 'row' }">
          <div class="news-item" @click="getPost(i.number)" v-for="i in newsData" :key="i.number">
            <img
              :src="i.body.match(/http\S*jpg/) || i.body.match(/http\S*png/)"
              @click="gotoPost(i.number)"
              :alt="i.title"
            />
            <div class="news-item-title">{{ i.title }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import config from "@/config/index";
import { queryPosts } from "@/utils/services";

@Component({})
export default class Home extends Vue {
  background: String = config.homeBgs[0];
  bgs: any[] = config.homeBgs;
  bgIndex: number = 0;
  bgOpacity: boolean = false;
  showCode: boolean = false;
  contacts: any[] = config.contact;
  newsData: any[] = [];
  subTitle: string = config.subTitle;
  doLoading: boolean = true;
  isMobile: Boolean = true;
  $isMobile: any;
  filter: any = {
    page: 1,
    pageSize: 3
  };

  created() {
    this.isMobile = this.$isMobile;
    this.background = this.bgs[this.bgIndex];
    this.queryNews();
  }

  queryNews() {
    queryPosts(this.filter).then((data: any) => {
      this.doLoading = false;
      this.newsData = data;
    });
  }

  bgDownload() {
    // this.doLoading = false;
  }
  changeBg(direction: any) {
    // this.doLoading = true;
    this.bgOpacity = true;
    setTimeout(() => {
      this.bgOpacity = false;
    }, 1600);
    setTimeout(() => {
      if (direction === "pre") {
        if (this.bgIndex - 1 > -1) {
          --this.bgIndex;
        } else {
          this.bgIndex = this.bgs.length - 1;
        }
      } else {
        if (this.bgIndex + 1 > this.bgs.length - 1) {
          this.bgIndex = 0;
        } else {
          ++this.bgIndex;
        }
      }
      this.background = this.bgs[this.bgIndex];
    }, 800);
  }
  // 查看文章
  getPost(number: any) {
    this.$router.push({ name: "post", params: { number } });
  }
}
</script>
<style lang="less">
@import "./home.less";
</style>
