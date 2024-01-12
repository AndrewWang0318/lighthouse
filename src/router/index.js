import { createRouter, createWebHashHistory } from 'vue-router'
import { showToast } from "vant"; //引入Vant ui
import { useStore } from '@/stores/stores'


const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/',
      name: 'index',
      redirect:'/home',
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("@/views/home/index.vue"),
          meta:{
            name:'首页', // title名称
          },
        },
        {
          path: "socialSquare",
          name: "socialSquare",
          component: () => import("@/views/social-square/index.vue"),
          meta:{
            name:'动态',

          },
        },
        {
          path: "discover",
          name: "discover",
          component: () => import("@/views/discover/index.vue"),
          meta:{
            name:'发现',
          },
        },
        {
          path: "mine",
          name: "mine",
          component: () => import("@/views/mine/index.vue"),
          meta:{
            name:'我的',
          },
        },
      ],
    },
    // 登录注册
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/profile/login.vue'),
      meta:{
        name:'登录'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/profile/register.vue'),
      meta:{
        name:'注册'
      }
    },
    // 修改用户信息
    {
      path: '/userEdit',
      name: 'userEdit',
      component: () => import('@/views/profile/user-edit.vue'),
      meta:{
        name:'注册'
      }
    },
    // 发布瞬间
    {
      path: '/dynamicPublish',
      name: 'dynamicPublish',
      component: () => import('@/views/profile/dynamic-publish.vue'),
      meta:{
        name:'注册'
      }
    },
    // 华容道游戏
    {
      path: '/hrdGame',
      name: 'hrdGame',
      component: () => import('@/views/profile/hrd-game.vue'),
      meta:{
        name:'注册'
      }
    },

    {
      path: '/pickGame',
      name: 'pickGame',
      component: () => import('@/views/profile/pickGame.vue'),
      meta:{
        name:'注册'
      }
    },
    {
      path: '/rollingGame',
      name: 'rollingGame',
      component: () => import('@/views/profile/rollingGame.vue'),
      meta:{
        name:'注册'
      }
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
