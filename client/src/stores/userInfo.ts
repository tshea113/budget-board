import { defineStore } from 'pinia'
import http from '@/services/api'
import { type APIResponse, type UserInfo } from '@/types/types'

export const useInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: { uid: null } as UserInfo
    }
  },
  actions: {
    async getUser(user: UserInfo, token: string) {
      const config = {
        headers: { Authorization: 'Bearer ' + token }
      }
      const response = await http.post<APIResponse<UserInfo>>('api/userdata/getuser', user, config)
      if (response?.data) {
        this.userInfo = response.data?.uid
      }
    }
  },
  persist: false
})
