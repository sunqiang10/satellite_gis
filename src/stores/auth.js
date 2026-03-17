import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // 初始化时检查本地存储的token
  if (token.value) {
    isAuthenticated.value = true
  }

  function login(userData) {
    // 保存token到localStorage
    if (userData.token) {
      token.value = userData.token
      localStorage.setItem('token', userData.token)
    }
    
    isAuthenticated.value = true
    user.value = {
      id: userData.id,
      username: userData.username || userData.logonName,
      role: userData.role,
      permissions: userData.permissions || ['read', 'write', 'delete'],
      ...userData
    }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  function getToken() {
    return token.value
  }

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    getToken
  }
})
