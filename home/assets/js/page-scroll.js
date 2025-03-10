const throttle = function(func, delay = 200) {
  let timer = null;
  let startTime = Date.now();
  return function(...args) {
    const curTime = Date.now();
    const remaining = delay - (curTime - startTime);
    const context = this;
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  }
}

let index = 0
const totalPage = document.querySelectorAll('body > section').length + 1
const wheelListener = throttle((ev) => {
  if (!ev || ev.shiftKey) return
  setScrollIdx(ev.deltaY > 0 ? 'forward' : 'back')
})
function setScrollIdx(behavior='forward') {
  if (behavior ==='forward') {
    if (index === totalPage - 1) return
    index += 1
  } else {
    if (index === 0) return
    index -= 1
  }
  pageScrollTo()
}
function pageScrollTo(behavior='forward') {
  const title = document.querySelector(`#nav-menu li[data-idx='${index}']`)?.innerText
  document.querySelector('#header-anchor').innerText = title || ''
  document.body.scrollTo(0, index * window.document.body.clientHeight)
}

window.addEventListener("wheel", wheelListener)
// window.addEventListener("mousewheel", wheelListener)

document.querySelector('#nav-menu').addEventListener('click', evt => {
  index = evt.target.getAttribute('data-idx') * 1
  pageScrollTo()
})
