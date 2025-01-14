(function (self) {
  self.randomHexColor = function () {
    let hex = Math.floor(Math.random() * 16777216).toString(16) // 生成 ffffff 以内16进制数
    while (hex.length < 6) {
      // while循环判断hex位数，少于6位前面加0凑够6位
      hex = `0${hex}`
    }
    return `#${hex}` // 返回‘#’开头16进制颜色
  }
})(window.utils = {})
