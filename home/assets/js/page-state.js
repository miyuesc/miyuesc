
const initProjects = () => {
  const projects = window.__configurations.projects || []

  const htmlText = projects.reduce((innerText, cur) => {
    const borderColor = utils.randomHexColor()
    const color1 = utils.randomHexColor()
    const color2 = utils.randomHexColor()
    innerText += `<div class="card" style="--active-color: ${borderColor}">
    <pixel-canvas class="card-pixel" data-gap="10" data-speed="25" data-colors="${borderColor}, ${color1}, ${color2}"></pixel-canvas>
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
