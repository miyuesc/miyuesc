import config from "@/config";
import { Vue } from "vue-property-decorator";
import documents from "./documents";
import AV from "./leancloud";
import { AxiosResponse } from "axios";

const GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_API = "https://api.github.com/repos";
const { username, repository, token } = config;
const blog = `${GITHUB_API}/${username}/${repository}`;
const access_token = token.join("");
const open = `state=open&access_token=${access_token}`;
const closed = `state=closed&access_token=${access_token}`;
const isDev = /^(192\.168|localhost)/.test(window.location.host);

// 状态检测
const checkStatus = (response: any) => {
  if (response.status >= 200 && response.status < 300) return response;
  const error: any = new Error(response.statusText);
  error.response = response;
  throw error;
};

// 构建 GraphQL
const createCall = async (document: any) => {
  try {
    const payload = JSON.stringify({ query: document });
    const response = await Vue.axios(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `token ${access_token}`
      },
      data: payload
    });
    checkStatus(response);
    const body = await response.data;
    return body.data;
  } catch (err) {
    return "error";
  }
};

// 获取所有文章总数
export const queryPostsTotal = async () =>
  createCall(documents.queryArchivesCount({ username, repository }));

// 获取文章列表
export const queryPosts = async ({ page = 1, pageSize = 10, filter = "" }) => {
  try {
    const url = `${blog}/issues?${open}&page=${page}&per_page=${pageSize}${filter}`;
    const response = await Vue.axios.get(url);
    checkStatus(response);
    return response.data;
  } catch (err) {
    // console.log(err);
  }
};
// 获取标签
export const queryTag = async () => {
  try {
    const url = `${blog}/labels?access_token=${access_token}&page=1&per_page=100`;
    const response = await fetch(url);
    checkStatus(response);
    return await response.json();
  } catch (err) {
    // console.log(err);
  }
};
// 获取单篇文章
export const queryPost = async (number: number) => {
  try {
    const url = `${blog}/issues/${number}?${open}`;
    const response = await Vue.axios.get(url);
    checkStatus(response);
    return await response.data;
  } catch (err) {
    // console.log(err);
  }
};
// 获取分类
export const queryCategory = async () => {
  try {
    const url = `${blog}/milestones?access_token=${access_token}`;
    const response = await fetch(url);
    checkStatus(response);
    return await response.json();
  } catch (err) {
    // console.log(err);
  }
};
// 文章热度
export const queryHot = async (ids: any) => {
  return new Promise(resolve => {
    if (isDev) return resolve([]);
    const query = new AV.Query("Counter");
    query.containedIn("id", ids);
    query.find().then((res: any) => {
      const hot: any = {};
      res.forEach((o: any) => (hot[o.attributes.id] = o.attributes.time));
      resolve(hot);
    });
  });
};
// 增加热度
export const increaseHot = (post: any) => {
  return new Promise(resolve => {
    if (isDev) return resolve(1);
    const query: any = new AV.Query("Counter");
    const Counter: any = AV.Object.extend("Counter");
    const { title, id } = post;
    query.equalTo("id", id);
    query.find().then((res: XMLHttpRequestResponseType) => {
      if (res.length > 0) {
        // 已存在则返回热度
        const counter: any = res[0];
        counter
          .increment("time", 1)
          .save(null, { fetchWhenSave: true })
          .then((counter: any) => {
            const time = counter.get("time");
            resolve(time);
          });
      } else {
        // 不存在则新建
        const newcounter = new Counter();
        newcounter.set("title", title);
        newcounter.set("id", id);
        newcounter.set("time", 1);
        newcounter.set("site", location.href);
        newcounter.save().then(() => resolve(1));
      }
    });
  });
};

export const queryClosed = async (type: any) => {
  try {
    let { data: data } = await Vue.axios.get(
      `${blog}/issues?${closed}&labels=${type}`
    );
    return data;
  } catch (e) {
    return e;
  }

  // return new Promise(resolve => {
  //   Vue.axios
  //     .get(`${blog}/issues?${closed}&labels=${type}`)
  //     .then((res: AxiosResponse) => {
  //       if (res.status) {
  //         return res.data;
  //       } else {
  //         return [];
  //       }
  //     });
  // });
};
