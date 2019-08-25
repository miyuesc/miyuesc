<template>
  <div class="markdown" v-html="html" v-highlight></div>
</template>
<script lang="ts">
import marked from "marked";
import { Component, Prop, Vue } from "vue-property-decorator";
import hljs from "@/assets/lib/highlight";

const renderer = new marked.Renderer();
renderer.heading = function(text: string, level: number) {
  return `<a class="hidden-anchor" ref="hiddenAnchor"></a><h${level +
    1} class="hljs-title">${text}</h${level + 1}>`;
};
renderer.image = function(href: string, title: string, text: string) {
  return `<span class="img-box" data-src="${href}" data-sub-html="<h4>${text}</h4>"><img src="${href}" loading="lazy" alt="${text}" />${
    text ? `<span>${text}</span>` : ""
  }</span>`;
};
renderer.link = function(href: string, title: string, text: string) {
  return `<a href=${href} target="_blank">${text}</a>`;
};
renderer.codespan = (code: string) => {
  return `<code class="line-code" type="text" datatype="text">${code}</code>`;
};
marked.setOptions({
  renderer,
  highlight: (code: any) => hljs.highlightAuto(code).value
});

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
    if (this.onlyRender && this.content.split("summary_start")[1]) {
      // 显示简介
      this.html = marked(
        this.content.split("summary_start")[1].split("summary_end")[0]
      );
    } else {
      this.html = marked(this.content.split("summary_end")[1]); // 显示正文
      this.$nextTick(() => {
        hljs.initLineNumbersOnLoad({
          target: "#post"
        });
        document
          .querySelectorAll(".hidden-anchor")
          .forEach((a: any, index: number) => {
            a.id = `h-${index}`;
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
      &:hover {
        background: #e9e9e9;
      }
    }
  }
  blockquote {
    margin: 0.12rem 0;
    width: 96%;
    border-left: 0.04rem solid #bcbcbc;
    background: #f6f6f6;
    padding: 0.02rem 0.12rem;
    p {
      margin: 0.04rem 0;
      font-size: 0.14rem;
      line-height: 0.16rem;
    }
  }
  .hljs {
    position: relative;
    padding-top: 0.32rem;
    padding-bottom: 0.06rem;
    &:before {
      content: "example";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 0.26rem;
      line-height: 0.26rem;
      background-color: #dbdbdb;
      text-align: center;
    }

    &:after {
      content: "";
      position: absolute;
      top: 0.05rem;
      left: 0.12rem;
      border-radius: 0.07rem;
      width: 0.14rem;
      height: 0.14rem;
      background: #ff5f57;
      box-shadow: 0.2rem 0 0 0 #ffbd2e, 0.4rem 0 0 0 #28ca42;
    }
  }
}
</style>
