import Vue from "vue";
import Vuex from "vuex";
import { queryPost, queryTag, increaseHot, queryHot, queryClosed } from "@/utils/services";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    // 获取标签
    async queryTag() {
      let data = await queryTag();
      const filterLabel = ["Mood", "Friend", "Book", "About"];
      data = data.filter((o: any) => !filterLabel.includes(o.name));
      return data;
    },
    // 获取文章详情
    async queryPost(context, { number }) {
      return await queryPost(number);
    },

    // 获取文章热度
    async queryHot(context, { ids }) {
      return await queryHot(ids);
    },

    // 增加热度
    async increaseHot(context, { post }) {
      return await increaseHot(post);
    },

    async queryClosed(context, { type }) {
      return await queryClosed(type);
    }
  }
});
