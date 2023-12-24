import { createRouter, createWebHashHistory } from 'vue-router'
import { showToast } from "vant"; //引入Vant ui
import { useStore } from '@/stores/stores'
import $tool from "@/utils/tool";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/home/index',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: "index",
          name: "Index",
          component: () => import("@/views/index/index.vue"),
          meta:{
            name:'首页'
          },
        },
        // {
        //   path: "FriendDynamic",
        //   name: "FriendDynamic",
        //   component: () => import("@/views/Dynamic/FriendDynamic.vue"),
        //   meta:{
        //     name:'动态'
        //   },
        // },
        // {
        //   path: "Mine",
        //   name: "Mine",
        //   component: () => import("@/views/Mine/Mine.vue"),
        //   meta:{
        //     name:'我的'
        //   },
        // },
      ],
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/profile/error.vue'),
      meta:{
        name:'错误'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta:{
        name:'登录'
      }
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/error",
    },
  ]
})

router.beforeEach((to, from, next) => {
  // 访问部分路由需要校验是否登录
  let checkLoginArr = ["",""];
  const _store = useStore();
  document.title = `灯塔 | ${to.meta.name}`
  if (checkLoginArr.includes(to.path)) {
    let user_info = _store.userInfo;
    if (user_info && JSON.stringify(user_info) !== "{}") {
      next();
    } else {
      showToast("您还未登录,请先登录~");
      router.push("/Login");
    }
  } else {
    next(); // 下一步
  }
});

export default router
