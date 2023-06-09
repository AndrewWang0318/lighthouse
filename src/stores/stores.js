import { defineStore } from 'pinia'

export const store = defineStore('counter', {
  state: () => {
    return {
      userInfo: {}, // 用户信息
      loadingSwitch:false, 
    } 
  },
  actions: {
    userInfoAction(data) {
      this.userInfo = data
    },
    loadingSwitchAction(data){
      this.loadingSwitch = data
    }
  },
})