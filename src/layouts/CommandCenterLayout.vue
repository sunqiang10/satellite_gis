<template>
  <div class="command-center min-h-screen bg-space-950 relative overflow-hidden">
    <!-- 星空背景 -->
    <div class="stars-bg"></div>
    
    <!-- 顶部导航栏 -->
    <header class="command-header">
      <div class="header-content">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-icon">
            <el-icon :size="24" class="text-white"><Monitor /></el-icon>
          </div>
          <div class="logo-text">
            <h1 class="text-white font-bold text-lg tracking-wider">远程测控中心系统</h1>
            <p class="text-sci-cyan text-xs tracking-widest">SATELLITE OPERATIONS</p>
          </div>
        </div>
        
        <!-- 主导航菜单 -->
        <nav class="main-nav">
          <router-link
            v-for="item in mainMenuItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            <span class="nav-text">{{ item.label }}</span>
            <div class="nav-glow"></div>
          </router-link>
        </nav>
        
        <!-- 右侧工具栏 -->
        <div class="header-tools">
          <div class="time-display">
            <el-icon :size="16" class="text-sci-cyan"><Clock /></el-icon>
            <span class="text-sci-cyan font-mono text-sm">{{ currentTime }}</span>
          </div>
          <div class="tool-btn" @click="toggleFullscreen">
            <el-icon :size="18" class="text-slate-300"><FullScreen /></el-icon>
          </div>
          <div class="tool-btn">
            <el-icon :size="18" class="text-slate-300"><Search /></el-icon>
          </div>
          <div class="tool-btn">
            <el-icon :size="18" class="text-slate-300"><User /></el-icon>
          </div>
          <div class="tool-btn" @click="handleLogout">
            <el-icon :size="18" class="text-slate-300"><SwitchButton /></el-icon>
          </div>
          <div class="menu-toggle" @click="showMobileMenu = !showMobileMenu">
            <el-icon :size="20" class="text-slate-300"><Menu /></el-icon>
          </div>
        </div>
      </div>
      
      <!-- 装饰线条 -->
      <div class="header-line-left"></div>
      <div class="header-line-right"></div>
    </header>

    <!-- 移动端菜单 -->
    <transition name="slide-down">
      <div v-if="showMobileMenu" class="mobile-menu">
        <router-link
          v-for="item in allMenuItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-item"
          :class="{ active: isActive(item.path) }"
          @click="showMobileMenu = false"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </transition>

    <!-- 主内容区 -->
    <main class="command-main">
      <router-view />
    </main>

    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="deco-line"></div>
      <div class="deco-dots">
        <span v-for="i in 20" :key="i" class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Monitor,
  Clock,
  FullScreen,
  Search,
  User,
  SwitchButton,
  Menu,
  Grid,
  Management,
  Setting,
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
const showMobileMenu = ref(false)
const currentTime = ref('')
let timeInterval = null

const mainMenuItems = [
  { path: '/dashboard', icon: Grid, label: '系统总览' },
  { path: '/satellite/dashboard', icon: Monitor, label: '实时监控' },
  { path: '/satellite/mission', icon: DocumentChecked, label: '任务管理' },
  { path: '/satellite/ttc', icon: Dish, label: '测控管理' },
  { path: '/satellite/planning', icon: Aim, label: '故障统计' },
  { path: '/satellite/qa', icon: DataLine, label: '客户服务' },
  { path: '/satellite/station', icon: Location, label: '站点管理' },
  { path: '/satellite/satellite', icon: Compass, label: '卫星管理' },
  { path: '/management', icon: Management, label: '系统管理' },
  { path: '/settings', icon: Setting, label: '系统设置' }
]

const allMenuItems = [
  ...mainMenuItems,
  { path: '/satellite/planning', icon: Aim, label: '故障统计' },
  { path: '/satellite/qa', icon: DataLine, label: '客户服务' },
  { path: '/management', icon: Management, label: '系统管理' },
  { path: '/settings', icon: Setting, label: '系统设置' }
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds} UTC+8`
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
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

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style scoped>
.command-center {
  background: linear-gradient(135deg, #020617 0%, #0a1628 50%, #020617 100%);
}

/* 星空背景 */
.stars-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.9), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(100,200,255,0.7), transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.5), transparent),
    radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 230px 90px, rgba(150,220,255,0.6), transparent),
    radial-gradient(2px 2px at 280px 140px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 320px 60px, rgba(255,255,255,0.5), transparent),
    radial-gradient(2px 2px at 350px 100px, rgba(100,200,255,0.8), transparent);
  background-size: 400px 200px;
  animation: stars-move 100s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes stars-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(-200px); }
}

/* 顶部导航栏 */
.command-header {
  position: relative;
  height: 56px;
  background: linear-gradient(180deg, 
    rgba(2, 6, 23, 0.95) 0%, 
    rgba(15, 23, 42, 0.9) 50%,
    rgba(2, 6, 23, 0.95) 100%
  );
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 100%;
  margin: 0 auto;
}

/* Logo区域 */
.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(6, 182, 212, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.logo-text h1 {
  background: linear-gradient(90deg, #fff, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 16px;
}

.logo-text p {
  font-size: 10px;
}

/* 主导航 */
.main-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-item {
  position: relative;
  padding: 6px 16px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 4px;
  overflow: hidden;
}

.nav-item:hover {
  color: #fff;
  background: rgba(6, 182, 212, 0.1);
}

.nav-item.active {
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.15);
}

.nav-item.active .nav-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #06b6d4, transparent);
  box-shadow: 0 0 8px #06b6d4;
}

/* 右侧工具栏 */
.header-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 4px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-btn:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.5);
}

.menu-toggle {
  display: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  cursor: pointer;
}

/* 装饰线条 */
.header-line-left,
.header-line-right {
  position: absolute;
  bottom: -1px;
  height: 2px;
  width: 200px;
}

.header-line-left {
  left: 0;
  background: linear-gradient(90deg, #06b6d4, transparent);
}

.header-line-right {
  right: 0;
  background: linear-gradient(90deg, transparent, #06b6d4);
}

/* 移动端菜单 */
.mobile-menu {
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: rgba(2, 6, 23, 0.98);
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
  padding: 12px;
  z-index: 99;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 3px;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 主内容区 */
.command-main {
  position: relative;
  z-index: 1;
  padding: 12px;
  height: calc(100vh - 56px);
  overflow: auto;
}

/* 滚动条样式 */
.command-main::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.command-main::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}

.command-main::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.5);
  border-radius: 4px;
}

.command-main::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.6);
}

/* 底部装饰 */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  z-index: 100;
  pointer-events: none;
}

.deco-line {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
}

.deco-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 3px;
  height: 3px;
  background: rgba(6, 182, 212, 0.6);
  border-radius: 50%;
  animation: dot-pulse 2s ease-in-out infinite;
}

.dot:nth-child(2n) {
  animation-delay: 0.2s;
}

.dot:nth-child(3n) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-nav {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 640px) {
  .logo-text p {
    display: none;
  }
  
  .time-display {
    display: none;
  }
}

/* 2K屏幕优化 */
@media (min-width: 1920px) {
  .header-content {
    padding: 0 24px;
  }
  
  .nav-item {
    padding: 8px 20px;
    font-size: 14px;
  }
}
</style>
