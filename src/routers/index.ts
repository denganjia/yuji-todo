import {createRouter, RouteRecordRaw, createWebHashHistory} from "vue-router";
import Layout from "@/layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    name: "layout",
    children: [{path: "list", name: "list", component: () => import("@/views/List/index.vue")}],
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index.vue"),
    name: "login",
  },
  {
    path: '/register',
    component: () => import("@/views/Register/index.vue"),
    name: "register",
  },
  {
    path: '/setting', name: 'setting', component: () => import("@/views/Setting/index.vue")
  }
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  strict: true,
});

router.beforeEach((to, from, next) => {
  const whiteList = ['login', 'register']
  window.$loadingBar.start();
  if (whiteList.includes(<string>to.name)) {
    next();
  } else {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next("/login");
    }
  }
});
router.afterEach(() => {
  window.$loadingBar.finish();
});
router.onError(() => {
  window.$loadingBar.error();
});
