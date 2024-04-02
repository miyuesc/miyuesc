const projects = [
  {
    title: 'Chibivue Zh',
    description: 'Chibivue 中文翻译仓库，一步一步从 0 开始实现一个 Vue.js。',
    links: [
      { label: 'Preview', link: 'https://chibivue.miyuefe.cn' },
      { label: 'Github', link: 'https://github.com/miyuesc/chibivue-zh' },
    ]
  },
  {
    title: 'Vue Bpmn Designer',
    description: 'Vue.js 与 bpmn.js 结合，实现的 BPMN 2.0 流程图编辑器。支持 Vue 2 与 Vue 3。 Github star: 1.5 k+ 、Gitee star: 1.5 k+。',
    links: [
      { label: 'Preview', link: '' },
      { label: 'Github', link: '' },
      { label: 'Gitee', link: '' },
    ]
  },
  {
    title: 'Data Visualization',
    description: '主要使用 Vue 3, Echarts 5, Element Plus 进行开发. 使用原生 JavaScript 实现元素的拖拽与缩放。 该项目主要为实现通用的可视化大屏的简单配置, 对于特殊图表仍然需要二次开发。',
    links: [
      { label: 'Preview', link: '' },
      { label: 'Github', link: '' },
      { label: 'Gitee', link: '' },
    ]
  },
  {
    title: 'Useful Codes',
    description: '包含简易钉钉流程组件、任务看板、Vue 大屏数据组件、echarts 图表集、常用 hook 函数与常用数据处理函数等内容。',
    links: [
      { label: 'Preview', link: '' },
      { label: 'Github', link: '' },
    ]
  },
  {
    title: 'Daily Juejin Extension',
    description: '每日掘金下午茶辅助扩展程序。读取已打开的掘金文章页面，快速生成下午茶消息和表格信息',
    links: [
      { label: 'Preview', link: '' },
      { label: 'Github', link: '' },
    ]
  },
  {
    title: 'Micro Juejin',
    description: '掘金创作者中心-微信小程序，实现掘金沸点、文章、已购小册等内容的显示和查看，以及创作者个人数据展示分析。',
    links: [
      { label: 'Preview', link: '' },
      { label: 'Github', link: '' },
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
