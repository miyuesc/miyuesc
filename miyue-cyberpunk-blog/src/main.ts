import { createApp } from "vue";
import "./assets/styles/main.scss";
import App from "./App.vue";
import router from "./router";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis only on desktop (Native scroll is better on mobile)
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

if (!isMobile) {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

const app = createApp(App);
app.use(router);
app.mount("#app");
