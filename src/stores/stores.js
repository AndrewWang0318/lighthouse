import { defineStore } from 'pinia'

// 不能直接解构赋值,需要使用storeToRefs

const useStore = defineStore('main', {
  state: () => {
    return {
      userInfo: {}, // 用户信息
      loadingSwitch:false, 
    } 
  },
  actions: {
    userInfoAction(data = {}) {
      this.userInfo = data
    },
    loadingSwitchAction(data){
      this.loadingSwitch = data
    }
  },
  persist: {
    key: 'map',
    storage: sessionStorage,
  },
})


export { useStore }