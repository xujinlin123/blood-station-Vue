import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref(null)
    
    // 保存会员信息，登录时使用
    const setProfile = (val) => {
      profile.value = val
    }

    // 获取会员信息，登录时使用
    const getProfile = () => {
      return profile.value
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = null
    }

    // 记得 return
    return {
      profile,
      setProfile,
      getProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
	//小程序持久化配置
    persist: {
		storage : {
			getItem(key){
				return uni.getStorageSync(key)
			},
			setItem(key,value){
				uni.setStorageSync(key,value)
			},
		},
	},
  },
)
