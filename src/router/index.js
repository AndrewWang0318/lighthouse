import { createRouter, createWebHashHistory } from 'vue-router'
import { showToast } from "vant"; //引入Vant ui
import { store } from '@/stores/stores'
import $tool from "@/utils/tool";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/Login'
    },
    {
      path: '/Home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      redirect:'/Home/Plan',
      children: [
        {
          path: "Plan",
          name: "Plan",
          component: () => import("@/views/Plan/Plan.vue"),
        },
        {
          path: "FriendDynamic",
          name: "FriendDynamic",
          component: () => import("@/views/Dynamic/FriendDynamic.vue"),
        },
        {
          path: "Mine",
          name: "Mine",
          component: () => import("@/views/Mine/Mine.vue"),
        },
      ],
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue'),
      beforeEnter: (to, from) => {
        let user_cookie = $tool.operatCookie("get", "user_info");
        const _store = store();
        let user_pina = _store.userInfo;
        if (from.path != "/" ) {
          if((user_cookie && user_cookie != "{}") || (user_pina && JSON.stringify(user_pina) != "{}")){
            showToast("当前已登录~");
            return false
          }else{
            return true
          }
        }else{
          return true
        }
      },
    },
    {
      path: '/UpdateInfo',
      name: 'UpdateInfo',
      component: () => import('@/views/Mine/UpdateInfo.vue'),
    },
    {
      path: '/UpdateInfoDetail',
      name: 'UpdateInfoDetail',
      component: () => import('@/views/Mine/UpdateInfoDetail.vue'),
    },
    {
      path:'/Error',
      name: 'Error',
      component: () => import('@/views/Error/Error.vue')
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/Error",
    },
  ]
})

router.beforeEach((to, from, next) => {
  // 访问部分路由需要校验是否登录
  let checkLoginArr = ["",""];
  const _store = store();
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
