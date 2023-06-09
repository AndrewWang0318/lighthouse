import { createRouter, createWebHashHistory } from 'vue-router'
import { showToast } from "vant"; //引入Vant ui
import { store } from '@/stores/stores'
import $util from "@/assets/js/util"

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/Home'
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
          path: "Dynamic",
          name: "Dynamic",
          component: () => import("@/views/Dynamic/Dynamic.vue"),
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
      component: () => import('@/views/Login/Login.vue')
    },
    {
      path:'/Error',
      name: 'Error',
      component: () => import('@/views/Error/Error.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 访问部分路由需要校验是否登录
  let checkLoginArr = ["/main/upload","/main/dynamic"];
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
