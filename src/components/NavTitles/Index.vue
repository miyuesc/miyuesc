<template>
  <ul class="nav-list">
    <li class="nav-list-li" v-for="(nav, index) in data" :key="index">
      <a
        class="nav-list-li-a"
        :href="nav.href"
        :class="current === nav || nav.children.includes(current) ? 'active' : ''"
        >{{ nav.title }}</a
      >
      <ul class="nav-children-list" v-if="current === nav || nav.children.includes(current)">
        <li v-for="(n, i) in nav.children" :key="i">
          <a :href="n.href" :class="current === n ? 'reading' : ''">{{ n.title }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import { title } from "@/utils/interface";

@Component
export default class NavTitles extends Vue {
  @Prop({ type: Array, default: () => [], required: true })
  data!: Array<title>;
  current: any = null;

  winScrollHandler() {
    const topDistance = 100;
    let titlesList: title[] = [];
    let distanceList: any[] = [];
    this.data.forEach(i => {
      titlesList.push(i);
      if (i.children.length) titlesList.push(...i.children);
    });
    for (let i = 0; i < titlesList.length; i++) {
      let dom: any = document.getElementById(`${titlesList[i].href.replace(/#/g, "")}`);
      distanceList.push({
        y: dom.getBoundingClientRect().top + 10, // 利用dom.getBoundingClientRect().top可以拿到元素相对于显示器的动态y轴坐标
        index: i,
        item: titlesList[i]
      });
    }
    let readingVO = distanceList.filter(item => item.y > topDistance)[0];
    this.current = readingVO
      ? distanceList[readingVO.index - 1]
        ? distanceList[readingVO.index - 1].item
        : distanceList[0].item
      : distanceList[distanceList.length - 1].item;
  }

  created() {
    window.addEventListener("scroll", this.winScrollHandler);
  }

  beforeDestroy(): void {
    window.removeEventListener("scroll", this.winScrollHandler);
  }
}
</script>

<style lang="less">
.nav-list {
  margin-left: 15px;
  list-style: none;
  padding-left: 0;
  border-left: 1px solid rgba(44, 62, 80, 0.6);
  text-align: left;
  position: absolute;
  display: flex;
  flex-direction: column;
  .nav-list-li {
    min-height: 0.32rem;
    width: 100%;
    overflow-x: hidden;
    font-family: Lato, PingFang SC, Microsoft YaHei, sans-serif;
    .nav-list-li-a {
      transition: ease-in-out 0.2s;
      line-height: 0.32rem;
      width: 2.4rem;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
      color: #2c3e50;
      padding-left: 0.2rem;
      &:hover {
        color: #ff773e;
        //width: auto;
        max-width: 4.2rem;
        border-left: 0.02rem solid #ff773e;
        height: auto;
      }
    }
    .active {
      color: #ff773e;
      background: #89ffdc;
      border-left: 0.02rem solid #ff773e;
      padding-left: 0.18rem;
      &:hover {
        padding-left: 0.2rem;
      }
    }
    .nav-children-list {
      transition: all ease-in-out 0.4s;
      margin-left: 15px;
      list-style: none;
      padding-left: 0;
      text-align: left;
      display: flex;
      flex-direction: column;
      li {
        font-family: Lato, PingFang SC, Microsoft YaHei, sans-serif;
        a {
          transition: all ease-in-out 0.4s;
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-decoration: none;
          color: #2c3e50;
          line-height: 0.3rem;
          padding-left: 0.2rem;
          &:hover {
            color: #ff773e;
            max-width: 4.2rem;
            height: auto;
          }
        }
        .reading {
          color: #ff773e;
          padding-left: 0.18rem;
          &::before {
            content: "\27A5   ";
            /*font-size: 0.12rem;*/
          }
          &:hover {
            padding-left: 0.2rem;
          }
        }
      }
    }
  }
}
</style>
