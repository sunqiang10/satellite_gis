<template>
  <div class="login-container">
    <!-- 背景星空 -->
    <div class="space-background"></div>
    
    <!-- 动态星空粒子 -->
    <canvas ref="starCanvas" class="star-canvas"></canvas>
    
    <!-- 扫描线效果 -->
    <div class="scanline"></div>
    
    <!-- 地球和卫星背景 -->
    <div class="space-elements">
      <!-- 地球 -->
      <div class="earth-wrapper">
        <ThreeEarth />
      </div>
      
      <!-- 全屏环绕轨道 -->
      <div class="global-orbits-container">
        <!-- 大轨道1 -->
        <div class="global-orbit orbit-1">
          <div class="orbit-line"></div>
          <div class="orbit-particle p1"></div>
          <div class="orbit-particle p2"></div>
          <div class="orbit-particle p3"></div>
        </div>
        <!-- 大轨道2 -->
        <div class="global-orbit orbit-2">
          <div class="orbit-line"></div>
          <div class="orbit-particle p1"></div>
          <div class="orbit-particle p2"></div>
          <div class="orbit-particle p3"></div>
          <div class="orbit-particle p4"></div>
        </div>
        <!-- 大轨道3 -->
        <div class="global-orbit orbit-3">
          <div class="orbit-line"></div>
          <div class="orbit-particle p1"></div>
          <div class="orbit-particle p2"></div>
        </div>
        <!-- 卫星 -->
        <div class="orbiting-satellite-wrapper">
          <div class="satellite">
            <img 
              src="@/assets/images/satellite.png"
              alt="卫星" 
              @error="handleImageError"
            >
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="main-title">远程测控中心系统</h1>
        <p class="sub-title">SATELLITE MISSION CONTROL SYSTEM</p>
        <div class="title-decoration">
          <div class="line"></div>
          <div class="diamond"></div>
          <div class="line"></div>
        </div>
      </div>
      
      <!-- 登录表单区域 -->
      <div class="login-section">
        <div class="login-box">
          <div class="scan-line"></div>
          <!-- 表单标题 -->
          <div class="form-header">
            <div class="header-line"></div>
            <h2>用户登录</h2>
            <div class="header-line"></div>
          </div>
          
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
            <!-- 账号 -->
            <el-form-item prop="username">
              <div class="input-group">
                <el-icon class="input-icon"><User /></el-icon>
                <el-input
                  v-model="loginForm.username"
                  placeholder="账号"
                  size="large"
                />
              </div>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password">
              <div class="input-group">
                <el-icon class="input-icon"><Lock /></el-icon>
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  size="large"
                  show-password
                />
              </div>
            </el-form-item>

            <!-- 登录按钮 -->
            <el-form-item>
              <button
                type="button"
                :disabled="loading"
                @click="handleLogin"
                class="login-button"
              >
                <span v-if="loading" class="loading-content">
                  <el-icon class="spin-icon"><Loading /></el-icon>
                  登录中...
                </span>
                <span v-else>登录</span>
              </button>
            </el-form-item>
          </el-form>

          <!-- 底部信息 -->
          <div class="footer-info">
            <span>版本: V1.2.3</span>
            <span class="separator">|</span>
            <span>构建: 影子内阁</span>
            <span class="separator">|</span>
            <span>遥控终端</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Loading } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api'
import ThreeEarth from '@/components/ThreeEarth.vue'

const router = useRouter()
const authStore = useAuthStore()
const starCanvas = ref(null)
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleImageError = (e) => {
  console.warn('图片加载失败:', e.target.src)
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await userApi.login({
          username: loginForm.username,
          password: loginForm.password
        })
        
        if (response) {
          authStore.login(response)
          ElMessage.success('登录成功，欢迎回来！')
          await router.replace('/dashboard')
        }
      } catch (error) {
        ElMessage.error(error.message || '登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 星空动画
let animationId = null

const initStarField = () => {
  const canvas = starCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  const stars = []
  const starCount = 150
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2
    })
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    stars.forEach(star => {
      star.twinkle += 0.02
      const twinkleOpacity = star.opacity * (0.7 + 0.3 * Math.sin(star.twinkle))
      
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`
      ctx.fill()
      
      star.y += star.speed
      if (star.y > canvas.height) {
        star.y = 0
        star.x = Math.random() * canvas.width
      }
    })
    
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
  
  return () => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationId)
  }
}

onMounted(() => {
  initStarField()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background: #020617;
  color: #e2e8f0;
  overflow: hidden;
  position: relative;
}

/* 背景 */
.space-background {
  position: absolute;
  inset: 0;
  background: url('@/assets/images/space-bg.jpg') center/cover no-repeat;
  opacity: 0.9;
}

/* 星空画布 */
.star-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 扫描线 */
.scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  opacity: 0.3;
}

/* 太空元素 */
.space-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent !important;
}

/* 地球 */
/* 地球容器 - 页面布局 */
.earth-wrapper {
  position: absolute;
  left: 12%;
  bottom: 22%;
  width: 500px;
  height: 500px;
  opacity: 0.95;
  z-index: 1;
  overflow: visible;
  background: transparent !important;
  isolation: isolate;
}

/* ThreeEarth 组件会创建自己的容器 */
.earth-wrapper :deep(.earth-container) {
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
}

.earth-wrapper :deep(.earth-container canvas) {
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
  display: block;
}

.earth-glow {
  display: none;
}

/* 全屏环绕轨道容器 */
.global-orbits-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 轨道基础样式 */
.global-orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform-style: preserve-3d;
}

/* 轨道线 */
.orbit-line {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(34, 211, 238, 0.15);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.1);
}

/* 轨道1 - 最大 */
.orbit-1 {
  width: 1400px;
  height: 1400px;
  margin-left: -700px;
  margin-top: -700px;
  transform: rotateX(60deg) rotateY(20deg) rotateZ(0deg);
  animation: rotateOrbit1 60s linear infinite;
}

.orbit-1 .orbit-line {
  animation: pulseOrbit 3s ease-in-out infinite;
}

/* 轨道2 */
.orbit-2 {
  width: 1100px;
  height: 1100px;
  margin-left: -550px;
  margin-top: -550px;
  transform: rotateX(50deg) rotateY(-30deg) rotateZ(45deg);
  animation: rotateOrbit2 50s linear infinite reverse;
}

.orbit-2 .orbit-line {
  border-color: rgba(68, 136, 255, 0.2);
  box-shadow: 0 0 25px rgba(68, 136, 255, 0.15), inset 0 0 25px rgba(68, 136, 255, 0.08);
  animation: pulseOrbit 3s ease-in-out infinite 1s;
}

/* 轨道3 */
.orbit-3 {
  width: 900px;
  height: 900px;
  margin-left: -450px;
  margin-top: -450px;
  transform: rotateX(70deg) rotateY(10deg) rotateZ(-20deg);
  animation: rotateOrbit3 40s linear infinite;
}

.orbit-3 .orbit-line {
  border-color: rgba(0, 170, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 170, 255, 0.2), inset 0 0 20px rgba(0, 170, 255, 0.1);
  animation: pulseOrbit 3s ease-in-out infinite 2s;
}

/* 轨道粒子 */
.orbit-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #22d3ee 0%, rgba(34, 211, 238, 0) 70%);
  border-radius: 50%;
  box-shadow: 0 0 20px #22d3ee, 0 0 40px #22d3ee;
  animation: particlePulse 2s ease-in-out infinite;
}

.orbit-2 .orbit-particle {
  background: radial-gradient(circle, #4488ff 0%, rgba(68, 136, 255, 0) 70%);
  box-shadow: 0 0 15px #4488ff, 0 0 30px #4488ff;
}

.orbit-3 .orbit-particle {
  background: radial-gradient(circle, #00aaff 0%, rgba(0, 170, 255, 0) 70%);
  box-shadow: 0 0 12px #00aaff, 0 0 25px #00aaff;
}

/* 粒子位置 */
.orbit-1 .p1 { top: 0; left: 50%; transform: translate(-50%, -50%); }
.orbit-1 .p2 { top: 33%; right: 5%; transform: translate(50%, -50%); }
.orbit-1 .p3 { top: 66%; left: 5%; transform: translate(-50%, -50%); }

.orbit-2 .p1 { top: 10%; right: 15%; transform: translate(50%, -50%); }
.orbit-2 .p2 { bottom: 15%; right: 10%; transform: translate(50%, 50%); }
.orbit-2 .p3 { bottom: 10%; left: 20%; transform: translate(-50%, 50%); }
.orbit-2 .p4 { top: 30%; left: 8%; transform: translate(-50%, -50%); }

.orbit-3 .p1 { top: 5%; left: 60%; transform: translate(-50%, -50%); }
.orbit-3 .p2 { bottom: 20%; right: 25%; transform: translate(50%, 50%); }

/* 卫星轨道 */
.orbiting-satellite-wrapper {
  position: absolute;
  left: 25%;
  top: 50%;
  width: 700px;
  height: 700px;
  margin-left: -350px;
  margin-top: -350px;
  animation: orbitSatellite 25s linear infinite;
}

.satellite {
  position: absolute;
  top: 0;
  left: 50%;
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.9));
  animation: satelliteRotate 25s linear infinite reverse;
}

.satellite img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 动画 */
@keyframes rotateOrbit1 {
  from { transform: rotateX(60deg) rotateY(20deg) rotateZ(0deg); }
  to { transform: rotateX(60deg) rotateY(20deg) rotateZ(360deg); }
}

@keyframes rotateOrbit2 {
  from { transform: rotateX(50deg) rotateY(-30deg) rotateZ(45deg); }
  to { transform: rotateX(50deg) rotateY(-30deg) rotateZ(405deg); }
}

@keyframes rotateOrbit3 {
  from { transform: rotateX(70deg) rotateY(10deg) rotateZ(-20deg); }
  to { transform: rotateX(70deg) rotateY(10deg) rotateZ(340deg); }
}

@keyframes pulseOrbit {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes particlePulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.8; }
}

@keyframes orbitSatellite {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes satelliteRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

/* 主内容 */
.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 标题区域 */
.header-section {
  text-align: center;
  padding-top: 60px;
  margin-bottom: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.15em;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
}

.sub-title {
  font-size: 16px;
  color: #22d3ee;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  font-weight: 300;
}

.title-decoration {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.title-decoration .line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6));
}

.title-decoration .line:last-child {
  background: linear-gradient(270deg, transparent, rgba(34, 211, 238, 0.6));
}

.title-decoration .diamond {
  width: 8px;
  height: 8px;
  background: rgba(34, 211, 238, 0.8);
  transform: rotate(45deg);
}

/* 登录区域 */
.login-section {
  position: fixed;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.login-box {
  width: 400px;
  /* background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(20, 30, 60, 0.85) 50%, rgba(15, 23, 42, 0.9) 100%); */
  /* backdrop-filter: blur(20px); */
  /* -webkit-backdrop-filter: blur(20px); */
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  padding: 32px;
  box-shadow: 
    0 0 60px rgba(34, 211, 238, 0.2),
    0 0 100px rgba(34, 211, 238, 0.1),
    inset 0 0 60px rgba(34, 211, 238, 0.05);
  position: relative;
  overflow: hidden;
}

/* 流光边框效果 */
.login-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(34, 211, 238, 0.8) 20%, 
    rgba(0, 170, 255, 0.8) 40%, 
    rgba(34, 211, 238, 0.8) 60%, 
    rgba(0, 170, 255, 0.8) 80%, 
    transparent 100%
  );
  background-size: 200% 100%;
  animation: borderFlow 3s linear infinite;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

/* 四角装饰 */
.login-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: 
    linear-gradient(90deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) top left / 40px 2px no-repeat,
    linear-gradient(180deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) top left / 2px 40px no-repeat,
    linear-gradient(-90deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) top right / 40px 2px no-repeat,
    linear-gradient(180deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) top right / 2px 40px no-repeat,
    linear-gradient(90deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) bottom left / 40px 2px no-repeat,
    linear-gradient(0deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) bottom left / 2px 40px no-repeat,
    linear-gradient(-90deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) bottom right / 40px 2px no-repeat,
    linear-gradient(0deg, rgba(34, 211, 238, 0.8) 0%, transparent 10%) bottom right / 2px 40px no-repeat;
  pointer-events: none;
  z-index: 2;
}

/* 扫描线效果 */
.login-box .scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), transparent);
  animation: scanLine 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 3;
}

@keyframes borderFlow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes scanLine {
  0%, 100% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* 表单头部 */
.form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.form-header h2 {
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0.2em;
  font-weight: 400;
}

.header-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 0.4));
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
  animation: lineGlow 2s ease-in-out infinite;
}

.header-line:last-child {
  background: linear-gradient(270deg, transparent, rgba(34, 211, 238, 0.8), rgba(34, 211, 238, 0.4));
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
  animation: lineGlow 2s ease-in-out infinite 1s;
}

@keyframes lineGlow {
  0%, 100% { opacity: 0.6; box-shadow: 0 0 10px rgba(34, 211, 238, 0.5); }
  50% { opacity: 1; box-shadow: 0 0 20px rgba(34, 211, 238, 0.8); }
}

/* 表单样式 */
.login-form {
  margin-bottom: 16px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

/* 输入组 */
.input-group {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 35, 60, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(34, 211, 238, 0.4);
  border-radius: 6px;
  padding: 0 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.input-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.1), transparent);
  transition: left 0.5s ease;
}

.input-group:hover::before {
  left: 100%;
}

.input-group:hover {
  border-color: rgba(34, 211, 238, 0.7);
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 10px rgba(34, 211, 238, 0.05);
  transform: translateX(3px);
}

.input-group:focus-within {
  border-color: #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 15px rgba(34, 211, 238, 0.1);
  transform: translateX(5px);
}

.input-icon {
  color: #22d3ee;
  font-size: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

/* Element Plus 输入框覆盖样式 */
.input-group :deep(.el-input__wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.input-group :deep(.el-input__inner) {
  color: #e2e8f0;
  background: transparent;
  height: 42px;
  font-size: 14px;
}

.input-group :deep(.el-input__inner::placeholder) {
  color: #64748b;
}

/* 部门选择器 */
.department-select {
  width: 100%;
}

.department-select :deep(.el-select__wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.department-select :deep(.el-select__input) {
  color: #e2e8f0;
  height: 42px;
  font-size: 14px;
}

.department-select :deep(.el-select__placeholder) {
  color: #64748b;
}

/* 验证码组 */
.captcha-group {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-code {
  width: 112px;
  height: 44px;
  background: linear-gradient(135deg, 
    rgba(37, 99, 235, 0.9) 0%, 
    rgba(59, 130, 246, 0.8) 50%, 
    rgba(37, 99, 235, 0.9) 100%
  );
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  letter-spacing: 0.3em;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(100, 180, 255, 0.5);
  box-shadow: 
    0 0 15px rgba(37, 99, 235, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.captcha-code::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.captcha-code:hover::before {
  left: 100%;
}

.captcha-code:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(96, 165, 250, 0.8) 50%, rgba(59, 130, 246, 0.9) 100%);
  box-shadow: 0 0 25px rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

/* 选项行 */
.options-row {
  margin-bottom: 8px !important;
}

.options-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.captcha-checkbox :deep(.el-checkbox__inner) {
  background-color: rgba(15, 23, 42, 0.8);
  border-color: rgba(34, 211, 238, 0.4);
}

.captcha-checkbox :deep(.el-checkbox__inner:hover) {
  border-color: #22d3ee;
}

.captcha-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #22d3ee;
  border-color: #22d3ee;
}

.checkbox-text {
  color: #94a3b8;
  font-size: 14px;
}

.forgot-link {
  color: #22d3ee;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: rgba(34, 211, 238, 0.8);
}

/* 登录按钮 */
.login-button {
  width: 100%;
  margin-top: 50px;
  height: 48px;
  background: linear-gradient(135deg, 
    rgba(14, 165, 233, 0.9) 0%, 
    rgba(34, 211, 238, 0.8) 25%,
    rgba(2, 132, 199, 0.9) 50%, 
    rgba(34, 211, 238, 0.8) 75%,
    rgba(3, 105, 161, 0.9) 100%
  );
  background-size: 200% 100%;
  border: 1px solid rgba(34, 211, 238, 0.6);
  border-radius: 6px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 20px rgba(34, 211, 238, 0.4),
    0 0 40px rgba(34, 211, 238, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  animation: buttonGlow 2s ease-in-out infinite;
}

@keyframes buttonGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 100%
  );
  transform: translateX(-100%);
  animation: buttonShine 3s ease-in-out infinite;
}

@keyframes buttonShine {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  border-color: rgba(34, 211, 238, 0.8);
  box-shadow: 
    0 0 30px rgba(34, 211, 238, 0.5),
    0 0 60px rgba(34, 211, 238, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 
    0 0 15px rgba(34, 211, 238, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  animation: none;
  box-shadow: none;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 底部信息 */
.footer-info {
  padding-top: 16px;
  border-top: 1px solid rgba(34, 211, 238, 0.2);
  text-align: center;
  color: rgba(148, 163, 184, 0.8);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
}

.footer-info .separator {
  margin: 0 12px;
  color: #334155;
}

/* 动画 */

@keyframes orbitRotate {
  from { transform: translate(-7%, -7%) rotate(0deg); }
  to { transform: translate(-7%, -7%) rotate(360deg); }
}

@keyframes satelliteFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(5deg); }
  50% { transform: translateY(-5px) rotate(0deg); }
  75% { transform: translateY(10px) rotate(-5deg); }
}

/* 响应式 */
@media (max-width: 1280px) {
  .login-section {
    right: 40px;
  }
  
  .earth-wrapper {
    left: 8%;
    width: 450px;
    height: 450px;
  }
  
  .orbit-1 {
    width: 1200px;
    height: 1200px;
    margin-left: -600px;
    margin-top: -600px;
  }
  
  .orbit-2 {
    width: 950px;
    height: 950px;
    margin-left: -475px;
    margin-top: -475px;
  }
  
  .orbit-3 {
    width: 750px;
    height: 750px;
    margin-left: -375px;
    margin-top: -375px;
  }
}

@media (max-width: 1024px) {
  .login-section {
    right: 20px;
  }
  
  .earth-wrapper {
    left: 5%;
    width: 380px;
    height: 380px;
  }
  
  .orbit-1 {
    width: 1000px;
    height: 1000px;
    margin-left: -500px;
    margin-top: -500px;
  }
  
  .orbit-2 {
    width: 800px;
    height: 800px;
    margin-left: -400px;
    margin-top: -400px;
  }
  
  .orbit-3 {
    width: 650px;
    height: 650px;
    margin-left: -325px;
    margin-top: -325px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .login-section {
    position: fixed;
    left: 50%;
    right: auto;
    top: 55%;
    transform: translate(-50%, -50%);
    padding: 20px;
  }
  
  .login-box {
    width: 100%;
    max-width: 360px;
  }
  
  .earth-wrapper {
    left: 5%;
    width: 280px;
    height: 280px;
    opacity: 0.6;
  }
  
  .orbit-1, .orbit-2, .orbit-3 {
    display: none;
  }
  
  .orbiting-satellite-wrapper {
    display: none;
  }
  
  .orbit-ring {
    display: none;
  }
  
  .orbiting-satellite {
    display: none;
  }
}

/* 表单错误提示 */
.login-form :deep(.el-form-item__error) {
  color: #ef4444;
  font-size: 12px;
  padding-top: 4px;
}
</style>