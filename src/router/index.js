import { createRouter, createWebHistory } from 'vue-router'
import { showToast } from "vant"; //引入Vant ui
import { store } from '@/stores/stores'
import $util from "@/assets/js/util"
console.log()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect:'/Login'
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
