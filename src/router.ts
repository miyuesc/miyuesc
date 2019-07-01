import Vue from "vue";
import Router from "vue-router";
import routes from "@/routes/routes";

Vue.use(Router);

const router = new Router({
  // mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    next();
  } else {
    router.push({ name: from.name });
  }
});

export default router;
