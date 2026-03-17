<template>
  <div class="min-h-screen bg-space-950 flex">
    <aside class="w-64 bg-space-900 border-r border-slate-800 flex flex-col">
      <div class="p-6 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-sci-blue to-sci-purple rounded-lg flex items-center justify-center">
            <el-icon :size="20" class="text-white"><Monitor /></el-icon>
          </div>
          <div>
            <h1 class="text-white font-bold text-lg">远程测控中心系统</h1>
            <p class="text-slate-500 text-xs">Satellite Operations</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto p-4 space-y-2">
        <div class="text-slate-500 text-xs uppercase tracking-wider mb-3 px-3">系统菜单</div>
        <router-link
          v-for="item in mainMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
          :class="isActive(item.path) ? 'bg-sci-blue/20 text-sci-blue' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span class="font-medium">{{ item.label }}</span>
        </router-link>

        <div class="text-slate-500 text-xs uppercase tracking-wider mb-3 px-3 mt-6">卫星系统</div>
        <router-link
          v-for="item in satelliteMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
          :class="isActive(item.path) ? 'bg-sci-blue/20 text-sci-blue' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-8 h-8 bg-sci-blue/20 rounded-full flex items-center justify-center">
            <el-icon class="text-sci-blue"><User /></el-icon>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-medium truncate">{{ authStore.user?.username || '管理员' }}</p>
            <p class="text-slate-500 text-xs truncate">{{ authStore.user?.role || 'Admin' }}</p>
          </div>
          <el-button
            text
            @click="handleLogout"
            class="!text-slate-400 hover:!text-sci-red"
          >
            <el-icon><SwitchButton /></el-icon>
          </el-button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-space-900/50 border-b border-slate-800 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentBreadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <div class="w-2 h-2 bg-sci-green rounded-full animate-pulse"></div>
            <span>系统正常</span>
          </div>
          <el-button text class="!text-slate-400">
            <el-icon :size="20"><Bell /></el-icon>
          </el-button>
          <el-button text class="!text-slate-400">
            <el-icon :size="20"><Setting /></el-icon>
          </el-button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Monitor,
  User,
  Setting,
  Bell,
  SwitchButton,
  Grid,
  Management,
  List,
  Aim,
  DocumentChecked,
  Dish,
  Location,
  Compass,
  DataLine
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const mainMenuItems = [
  { path: '/dashboard', icon: Grid, label: '主页' },
  { path: '/management', icon: Management, label: '系统管理' },
  { path: '/settings', icon: Setting, label: '系统设置' }
]

const satelliteMenuItems = [
  { path: '/satellite/dashboard', icon: Grid, label: '实时监控' },
  { path: '/satellite/mission', icon: DocumentChecked, label: '任务管理' },
  { path: '/satellite/ttc', icon: Dish, label: '测控管理' },
  { path: '/satellite/station', icon: Location, label: '站点管理' },
  { path: '/satellite/satellite', icon: Compass, label: '卫星管理' },
  { path: '/satellite/planning', icon: Aim, label: '故障统计' },
  { path: '/satellite/qa', icon: DataLine, label: '客户服务' }
]

const currentBreadcrumb = computed(() => {
  const allMenuItems = [...mainMenuItems, ...satelliteMenuItems]
  const activeItem = allMenuItems.find(item => route.path.startsWith(item.path))
  return activeItem?.label || '未知'
})

const isActive = (path) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    authStore.logout()
    ElMessage.success('已安全退出')
    router.push('/login')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
:deep(.el-breadcrumb__inner) {
  color: #94a3b8;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #3b82f6;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #e2e8f0;
}

:deep(.el-breadcrumb__separator) {
  color: #64748b;
}
</style>