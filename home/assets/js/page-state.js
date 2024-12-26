const projects = [
  {
    title: 'Vue Bpmn Process Designer',
    description: 'Vue.js 与 bpmn.js 结合，实现的 BPMN 2.0 流程图编辑器。支持 Vue 2 与 Vue 3。',
    links: [
      { label: 'Preview', link: 'https://bpmn.miyuefe.cn' },
      { label: 'Github', link: 'https://github.com/miyuesc/bpmn-process-designer' },
      { label: 'Gitee', link: 'https://gitee.com/miyuesc/bpmn-process-designer' },
    ]
  },
  {
    title: 'Bpmn Questions',
    description: 'Bpmn-js 答疑，包含常见问题、使用技巧、常见问题的解决方法、常用工具库等内容，以及 bpmn-js 相关的源码解析和扩展实践教程。',
    links: [
      { label: 'Github', link: 'https://github.com/miyuesc/bpmn-js-questions' },
    ]
  },
  {
    title: 'Chibivue Zh',
    description: 'Chibivue 中文翻译仓库，一步一步从 0 开始、渐进式地实现一个 Vue.js。',
    links: [
      { label: 'Preview', link: 'https://chibivue.miyuefe.cn' },
      { label: 'Github', link: 'https://github.com/miyuesc/chibivue-zh' },
      { label: 'Source', link: 'https://github.com/chibivue-land/chibivue' },
    ]
  },
  {
    title: 'Useful Codes',
    description: '包含简易钉钉流程组件、任务看板、Vue 大屏数据组件、echarts 图表集、常用 hook 函数与常用数据处理函数等内容。',
    links: [
      { label: 'Preview', link: 'https://miyuesc.github.io/useful-code/#/' },
      { label: 'Github', link: 'https://github.com/miyuesc/useful-code' },
    ]
  },
  {
    title: 'Auto Sync Juejin Article',
    description: '自动同步掘金已发布文章和专栏，按照时间、分类等维度进行统计分析，生成 vitepress 博客并自动发布 Github Page',
    links: [
      { label: 'Preview', link: 'https://miyuesc.github.io/auto-sync-blog/' },
      { label: 'Github', link: 'https://github.com/TeaTools/auto-sync-blog' },
    ]
  },
  {
    title: 'Daily Juejin Extension',
    description: '每日掘金下午茶辅助扩展程序。读取已打开的掘金文章页面，快速生成下午茶消息和表格信息',
    links: [
      { label: 'Github', link: 'https://github.com/miyuesc/daily-juejin-tea-extension' },
    ]
  },
  {
    title: 'Micro Juejin',
    description: '掘金创作者中心-微信小程序，实现掘金沸点、文章、已购小册等内容的显示和查看，以及创作者个人数据展示分析。',
    links: [
      { label: 'Github', link: 'https://github.com/miyuesc/native-juejin-app' },
    ]
  },
  {
    title: 'Data Visualization',
    description: '主要使用 Vue 3, Echarts 5, Element Plus 进行开发. 使用原生 JavaScript 实现元素的拖拽与缩放。 该项目主要为实现通用的可视化大屏的简单配置, 对于特殊图表仍然需要二次开发。',
    links: [
      { label: 'Preview', link: 'https://miyuesc.github.io/data-visualization/' },
      { label: 'Github', link: 'https://github.com/miyuesc/vue-data-visualization' },
      { label: 'Gitee', link: 'https://gitee.com/miyuesc/vue-data-visualization' },
    ]
  },
]

const initProjects = () => {
  const htmlText = projects.reduce((innerText, cur) => {
    innerText += `<div class="card">
    <h3 class="title">${cur.title}</h3>
    <div class="progress-bar"></div>
    <div class="description">${cur.description}</div>
    <div class="more">
      ${cur.links.map(link => `<a class="link-btn" href="${link.link}" target="_blank">${link.label}</a>`).join('\n')}
    </div>
  </div>`
    return innerText
  }, '')

  document.querySelector('#project')?.insertAdjacentHTML('afterbegin', htmlText)
}

initProjects()
