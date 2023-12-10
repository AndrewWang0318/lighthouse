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
      redirect:'/Login',
      
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue'),
      meta:{
        name:'登录'
      },
      beforeEnter: (to, from) => {
        let user_cookie = $tool.operatCookie("get", "user_info");
        const _store = useStore();
        let user_pina = _store.userInfo;
        if (from.path != "/" ) {
          if((user_cookie && user_cookie != "{}") && (user_pina && JSON.stringify(user_pina) != "{}")){
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
      path: '/UserInfoEdit',
      name: 'UserInfoEdit',
      component: () => import('@/views/Mine/UserInfoEdit.vue'),
      meta:{
        name:'用户信息'
      }
    },
    {
      path: '/Home',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      redirect:'/Home/PlanDetail',
      children: [
        {
          path: "PlanDetail",
          name: "PlanDetail",
          component: () => import("@/views/Plan/PlanDetail.vue"),
          meta:{
            name:'首页'
          },
        },
        {
          path: "FriendDynamic",
          name: "FriendDynamic",
          component: () => import("@/views/Dynamic/FriendDynamic.vue"),
          meta:{
            name:'动态'
          },
        },
        {
          path: "Mine",
          name: "Mine",
          component: () => import("@/views/Mine/Mine.vue"),
          meta:{
            name:'我的'
          },
        },
      ],
    },
    {
      path: '/PlanList',
      name: 'PlanList',
      component: () => import('@/views/Plan/PlanList.vue'),
      meta:{
        name:'计划列表'
      }
    },
    {
      path: '/AddPlan',
      name: 'AddPlan',
      component: () => import('@/views/Plan/AddPlan.vue'),
      meta:{
        name:'添加计划'
      }
    },
    
    {
      path: '/DynamicPublish',
      name: 'DynamicPublish',
      component: () => import('@/views/Dynamic/DynamicPublish.vue'),
      meta:{
        name:'动态发布'
      }
    },
    {
      path: '/FishOffice',
      name: 'FishOffice',
      component: () => import('@/views/Mine/FishOffice.vue'),
      meta:{
        name:'摸鱼办'
      }
    },
    {
      path: '/Demand',
      name: 'Demand',
      component: () => import('@/views/Mine/Demand.vue'),
      meta:{
        name:'提建议'
      }
    },

    {
      path: '/Game',
      name: 'Game',
      component: () => import('@/views/Mine/Game/Game.vue'),
      meta:{
        name:'小游戏'
      }
    },
    {
      path: '/HuaRongRoad',
      name: 'HuaRongRoad',
      component: () => import('@/views/Mine/Game/HRD/HuaRongRoad.vue'),
      meta:{
        name:'华容道'
      }
    },
    {
      path: '/GoogleDr',
      name: 'GoogleDr',
      component: () => import('@/views/Mine/Game/GoogleDr/GoogleDr.vue'),
      meta:{
        name:'404恐龙'
      }
    },
    {
      path:'/Error',
      name: 'Error',
      component: () => import('@/views/Error/Error.vue'),
      meta:{
        name:'错误'
      }
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
