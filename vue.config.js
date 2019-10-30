const path = require("path");

function resolve(dir) {
  return path.join(__dirname, "./", dir);
}

module.exports = {
  lintOnSave: true,
  pages: undefined,
  filenameHashing: true,
  runtimeCompiler: true,
  productionSourceMap: false,
  chainWebpack(config) {
    const cdn = {
      css: [
        // "//fonts.googleapis.com/css?family=Noto+Serif+SC",
        // "//cdn.jsdelivr.net/npm/lightgallery.js@1.1.2/dist/css/lightgallery.min.css"
      ],
      js: [
        // "//cdn.jsdelivr.net/npm/animejs@2.2.0/anime.min.js",
        // "//cdn.jsdelivr.net/npm/lightgallery.js@1.1.2/dist/js/lightgallery.min.js",
        // "//cdn.jsdelivr.net/npm/lg-autoplay.js@1.0.0/dist/lg-autoplay.min.js",
        // "//cdn.jsdelivr.net/npm/lg-pager.js@1.0.0/dist/lg-pager.min.js",
        // "//cdn.jsdelivr.net/npm/lg-zoom.js@1.0.1/dist/lg-zoom.min.js",
        // "//cdn.jsdelivr.net/npm/lg-thumbnail.js@1.1.0/dist/lg-thumbnail.min.js",
        // "//cdn.jsdelivr.net/npm/lg-fullscreen.js@1.1.0/dist/lg-fullscreen.min.js"
      ]
    };
    config.plugin("html").tap(args => {
      args[0].cdn = cdn;
      return args;
    });

    // svg rule loader
    const svgRule = config.module.rule("svg"); // 找到svg-loader
    svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/components/SvgIcons/icons"));
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  }
};
