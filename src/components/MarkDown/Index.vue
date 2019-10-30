<template>
  <div class="markdown" v-html="html" v-highlight></div>
</template>
<script lang="ts">
import marked from "marked";
import { Component, Prop, Vue } from "vue-property-decorator";
import hljs from "@/assets/lib/highlight";

@Component
export default class MarkDown extends Vue {
  @Prop({ type: String, default: "" })
  content!: string;
  @Prop({ type: String, default: "" })
  target!: string;
  @Prop({ type: Boolean, default: false })
  onlyRender!: boolean;
  @Prop({ type: Boolean, default: true })
  desc!: boolean;

  html: any = "";

  doMarked() {
    const renderer = new marked.Renderer();
    let titles: any[] = [];
    let index: number = -1;

    renderer.heading = function(text: string, level: number) {
      if (level < 4) {
        index++;
        titles.push({
          level: level,
          title: text.replace(/&nbsp;/g, " "),
          href: `#h-${index}`
        });
        return `<a class="hidden-anchor" ref="hiddenAnchor" id="h-${index}"></a><h${level +
          1} class="hljs-title h-title">${text}</h${level + 1}>`;
      } else {
        return `<h${level + 1} class="hljs-title h-title">${text}</h${level + 1}>`;
      }
    };
    renderer.image = function(href: string, title: string, text: string) {
      return `<span class="img-box" data-src="${href}"><img src="${href}" loading="lazy" alt="${text}" />
  </span>`;
    };
    renderer.link = function(href: string, title: string, text: string) {
      return `<a href=${href} target="_blank">${text}</a>`;
    };
    marked.setOptions({
      renderer,
      highlight: (code: any) => {
        return hljs.highlightAuto(code).value;
      }
    });

    if (this.onlyRender && this.content.split("summary_start")[1]) {
      // 显示简介
      this.html = marked(this.content.split("summary_start")[1].split("summary_end")[0]);
    } else {
      this.html = marked(this.content.split("summary_end")[1]); // 显示正文
      this.$emit("created", titles);
      this.$nextTick(() => {
        hljs.initLineNumbersOnLoad({
          target: "#post"
        });
      });
    }
  }

  created() {
    this.doMarked();
  }
}
</script>

<style lang="less">
.markdown {
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: normal !important;

  code {
    font-family: Consolas, Monaco, "Andale Mono", monospace !important;
    font-style: italic !important;
    padding: 0.02rem 0.04rem;
  }

  img,
  image {
    max-width: 6rem !important;
    margin: 0 auto;
    text-align: center;
  }

  .img-box {
    image,
    img {
      max-width: 6rem;
      text-align: center;
    }
  }
  table {
    padding-bottom: 0.2rem;
  }
  table > tr > .hljs-ln-numbers {
    width: 0.24rem;
  }
  .hljs-ln {
    width: 100%;
    tr {
      width: auto;
      font-size: 0.14rem;
    }
  }
  blockquote {
    margin: 0.12rem 0;
    width: 96%;
    border-left: 0.04rem solid #bcbcbc;
    background: #f6f6f6;
    padding: 0.02rem 0.12rem;
    * {
      margin: 0.04rem 0;
      font-size: 0.14rem;
      line-height: 0.24rem;
    }
  }
  .hljs {
    position: relative;
    padding-top: 0.48rem;
    padding-bottom: 0.16rem;
    background-color: rgb(21, 23, 24);
    min-height: 0.4rem;
    min-width: auto;
    border-radius: 0.05rem;
    box-shadow: rgba(0, 0, 0, 0.55) 0 0.2rem 0.6rem 0;
    &:before {
      content: "code";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0.48rem;
      line-height: 0.48rem;
      /*padding-top: 0.04rem;*/
      /*background-color: #dbdbdb;*/
      text-align: center;
      color: rgb(207, 210, 209);
    }

    &:after {
      content: "";
      position: absolute;
      top: 0.18rem;
      left: 0.12rem;
      border-radius: 50%;
      width: 0.12rem;
      height: 0.12rem;
      background: #ff5f56;
      box-shadow: 0.2rem 0 0 0 #ffbd2e, 0.4rem 0 0 0 #27c93f;
    }
  }
}
</style>
