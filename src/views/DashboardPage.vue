<template>
  <div class="dashboard-container">
    <!-- 顶部统计栏 -->
    <div class="top-stats">
      <div class="stat-card" v-for="(stat, index) in topStats" :key="index">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon :size="20" class="text-white"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value" :style="{ color: stat.textColor }">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" v-if="stat.trend">
          <span :class="stat.trend > 0 ? 'up' : 'down'">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 卫星列表 -->
        <div class="panel-box">
          <div class="panel-header">
            <div class="header-icon blue">
              <el-icon :size="16"><Compass /></el-icon>
            </div>
            <span class="header-title">卫星状态</span>
            <span class="header-count">{{ satellites.length }}</span>
          </div>
          <div class="panel-body satellite-list">
            <div 
              v-for="sat in satellites" 
              :key="sat.id" 
              class="satellite-item"
              :class="sat.status"
            >
              <div class="sat-status-indicator" :class="sat.status"></div>
              <div class="sat-info">
                <div class="sat-name">{{ sat.name }}</div>
                <div class="sat-id">{{ sat.id }}</div>
              </div>
              <div class="sat-signal">
                <div class="signal-bars">
                  <div v-for="n in 4" :key="n" class="bar" :class="{ active: n <= sat.signal }"></div>
                </div>
                <span class="signal-text">{{ sat.signal * 25 }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 站点状态 -->
        <div class="panel-box">
          <div class="panel-header">
            <div class="header-icon green">
              <el-icon :size="16"><Location /></el-icon>
            </div>
            <span class="header-title">地面站状态</span>
          </div>
          <div class="panel-body station-list">
            <div v-for="station in stations" :key="station.id" class="station-item">
              <div class="station-icon">
                <el-icon :size="14"><Location /></el-icon>
              </div>
              <div class="station-info">
                <div class="station-name">{{ station.name }}</div>
                <div class="station-status" :class="station.status">
                  {{ station.status === 'online' ? '在线' : '离线' }}
                </div>
              </div>
              <div class="station-uptime">{{ station.uptime }}</div>
            </div>
          </div>
        </div>

        <!-- 资源使用 -->
        <div class="panel-box">
          <div class="panel-header">
            <div class="header-icon purple">
              <el-icon :size="16"><Cpu /></el-icon>
            </div>
            <span class="header-title">系统资源</span>
          </div>
          <div class="panel-body resource-list">
            <div v-for="res in resources" :key="res.name" class="resource-item">
              <div class="resource-header">
                <span class="resource-name">{{ res.name }}</span>
                <span class="resource-value" :class="res.level">{{ res.value }}%</span>
              </div>
              <div class="resource-bar">
                <div class="resource-fill" :style="{ width: res.value + '%', background: res.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="center-panel">
        <!-- 地球区域 -->
        <div class="earth-section">
          <div class="earth-container">
            <CesiumEarth />
            
            <!-- 悬浮信息卡片 -->
            <div class="floating-info top-left">
              <div class="info-item">
                <span class="label">活跃卫星</span>
                <span class="value text-cyan">{{ activeSatellites }}</span>
              </div>
            </div>
            <div class="floating-info top-right">
              <div class="info-item">
                <span class="label">轨道预测</span>
                <span class="value text-green">正常</span>
              </div>
            </div>
            <div class="floating-info bottom-left">
              <div class="info-item">
                <span class="label">数据流量</span>
                <span class="value text-blue">{{ dataFlow }} MB/s</span>
              </div>
            </div>
            <div class="floating-info bottom-right">
              <div class="info-item">
                <span class="label">任务队列</span>
                <span class="value text-purple">{{ taskQueue }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 甘特图 -->
        <div class="gantt-section">
          <div class="panel-box gantt-panel">
            <div class="panel-header">
              <div class="header-icon blue">
                <el-icon :size="16"><Timer /></el-icon>
              </div>
              <span class="header-title">任务时间线</span>
              <div class="gantt-controls">
                <el-button text size="small" class="!text-slate-400">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span class="time-range">{{ ganttTimeRange }}</span>
                <el-button text size="small" class="!text-slate-400">
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="panel-body gantt-chart">
              <div class="gantt-timeline">
                <div v-for="hour in timeLabels" :key="hour" class="time-label">{{ hour }}</div>
              </div>
              <div class="gantt-tasks">
                <div v-for="task in ganttTasks" :key="task.id" class="gantt-task-row">
                  <div class="task-label">{{ task.name }}</div>
                  <div class="task-timeline">
                    <div 
                      v-for="slot in task.slots" 
                      :key="slot.id"
                      class="task-slot"
                      :class="slot.type"
                      :style="{ left: slot.left + '%', width: slot.width + '%' }"
                    >
                      <div class="slot-tooltip">{{ slot.tooltip }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 告警事件 -->
        <div class="panel-box alert-panel">
          <div class="panel-header">
            <div class="header-icon red">
              <el-icon :size="16"><Warning /></el-icon>
            </div>
            <span class="header-title">告警事件</span>
            <span class="alert-count pulse">{{ alerts.length }}</span>
          </div>
          <div class="panel-body alert-list">
            <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.level">
              <div class="alert-icon">
                <el-icon :size="14"><WarningFilled /></el-icon>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
              <div class="alert-level-badge" :class="alert.level">{{ alert.levelText }}</div>
            </div>
          </div>
        </div>

        <!-- 事件流 -->
        <div class="panel-box">
          <div class="panel-header">
            <div class="header-icon cyan">
              <el-icon :size="16"><Notification /></el-icon>
            </div>
            <span class="header-title">实时事件流</span>
            <span class="header-count">{{ events.length }}</span>
          </div>
          <div class="panel-body event-list">
            <div v-for="event in events" :key="event.id" class="event-item">
              <div class="event-time">{{ event.time }}</div>
              <div class="event-content">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-desc">{{ event.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 通信日志 -->
        <div class="panel-box">
          <div class="panel-header">
            <div class="header-icon amber">
              <el-icon :size="16"><ChatDotRound /></el-icon>
            </div>
            <span class="header-title">通信日志</span>
          </div>
          <div class="panel-body log-list">
            <div v-for="log in logs" :key="log.id" class="log-item">
              <div class="log-indicator" :class="log.type"></div>
              <div class="log-content">
                <div class="log-title">{{ log.title }}</div>
                <div class="log-meta">
                  <span class="log-source">{{ log.source }}</span>
                  <span class="log-time">{{ log.time }}</span>
                </div>
              </div>
              <div class="log-status" :class="log.status">
                <el-icon :size="12"><component :is="log.statusIcon" /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Monitor,
  Compass,
  Location,
  Cpu,
  Warning,
  WarningFilled,
  Notification,
  ChatDotRound,
  Timer,
  ArrowLeft,
  ArrowRight,
  Check,
  Close,
  Loading
} from '@element-plus/icons-vue'
import CesiumEarth from '@/components/CesiumEarth.vue'

// 顶部统计数据
const topStats = ref([
              { icon: Monitor, value: '99.9%', label: '系统可用性', color: 'linear-gradient(135deg, #10b981, #059669)', textColor: '#10b981', trend: 0.2 },
  { icon: Compass, value: '12', label: '在轨卫星', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', textColor: '#06b6d4', trend: 1 },
  { icon: Location, value: '8', label: '地面站点', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', textColor: '#8b5cf6', trend: 0 },
  { icon: Cpu, value: '42%', label: '系统负载', color: 'linear-gradient(135deg, #f59e0b, #d97706)', textColor: '#f59e0b', trend: -3 }
])

// 卫星数据
const satellites = ref([
  { id: 'SZ-01', name: '神州一号', status: 'online', signal: 4 },
  { id: 'SZ-02', name: '神州二号', status: 'online', signal: 3 },
  { id: 'AG-01', name: '高分一号', status: 'online', signal: 4 },
  { id: 'AGS-01', name: '高分二号', status: 'warning', signal: 2 },
  { id: 'Tiang-01', name: '天宫核心舱', status: 'online', signal: 4 },
  { id: 'Chang-01', name: '嫦娥一号', status: 'online', signal: 3 },
  { id: 'Bei-01', name: '北斗一号', status: 'offline', signal: 0 },
  { id: 'Met-01', name: '风云一号', status: 'online', signal: 4 }
])

// 地面站数据
const stations = ref([
  { id: 1, name: '北京站', status: 'online', uptime: '99.8%' },
  { id: 2, name: '喀什站', status: 'online', uptime: '99.5%' },
  { id: 3, name: '三亚站', status: 'online', uptime: '99.9%' },
  { id: 4, name: '佳木斯站', status: 'warning', uptime: '98.2%' },
  { id: 5, name: '阿根廷站', status: 'online', uptime: '99.7%' }
])

// 资源使用
const resources = ref([
  { name: 'CPU', value: 42, color: 'linear-gradient(90deg, #06b6d4, #22d3ee)', level: 'normal' },
  { name: '内存', value: 68, color: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', level: 'normal' },
  { name: '存储', value: 45, color: 'linear-gradient(90deg, #10b981, #34d399)', level: 'normal' },
  { name: '网络', value: 23, color: 'linear-gradient(90deg, #f59e0b, #fbbf24)', level: 'low' }
])

// 告警事件
const alerts = ref([
  { id: 1, title: 'AGS-01 信号强度异常', time: '2分钟前', level: 'warning', levelText: '警告' },
  { id: 2, title: '佳木斯站连接不稳定', time: '5分钟前', level: 'warning', levelText: '警告' },
  { id: 3, title: 'Bei-01 通信中断', time: '15分钟前', level: 'error', levelText: '严重' },
  { id: 4, title: 'SZ-02 轨道修正完成', time: '32分钟前', level: 'info', levelText: '信息' }
])

// 事件流
const events = ref([
  { id: 1, time: '21:15:32', title: '轨道机动完成', description: 'SZ-01 成功完成轨道提升机动' },
  { id: 2, time: '21:12:18', title: '数据传输开始', description: 'AG-01 开始对地观测数据传输' },
  { id: 3, time: '21:08:45', title: '测控任务调度', description: '三亚站接管SZ-02测控任务' },
  { id: 4, time: '21:05:22', title: '系统自检完成', description: '所有子系统状态正常' },
  { id: 5, time: '20:58:11', title: '新任务注入', description: '高分二号成像任务已注入' }
])

// 通信日志
const logs = ref([
  { id: 1, title: 'Telemetry Exception', source: 'SZ-01', time: '21:15:06', type: 'warning', status: 'pending', statusIcon: Loading },
  { id: 2, title: 'Command Execution', source: 'AG-01', time: '21:12:30', type: 'success', status: 'success', statusIcon: Check },
  { id: 3, title: 'EXET REATION', source: 'Chang-01', time: '21:09:18', type: 'error', status: 'error', statusIcon: Close },
  { id: 4, title: 'IMAGING TASK', source: 'Tiang-01', time: '21:05:14', type: 'info', status: 'success', statusIcon: Check }
])

// 动态数据
const activeSatellites = ref(11)
const dataFlow = ref(128.5)
const taskQueue = ref(3)

// 甘特图数据
const ganttTimeRange = ref('今日 00:00 - 24:00')
const timeLabels = ref(['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'])
const ganttTasks = ref([
  { 
    id: 1, 
    name: 'SZ-12:RO', 
    slots: [
      { id: 1, left: 10, width: 15, type: 'normal', tooltip: '常规测控' },
      { id: 2, left: 40, width: 20, type: 'critical', tooltip: '关键任务' }
    ]
  },
  { 
    id: 2, 
    name: '31.12:00', 
    slots: [
      { id: 1, left: 5, width: 25, type: 'warning', tooltip: '维护窗口' },
      { id: 2, left: 50, width: 30, type: 'normal', tooltip: '数据传输' }
    ]
  },
  { 
    id: 3, 
    name: '22.15:00', 
    slots: [
      { id: 1, left: 20, width: 10, type: 'critical', tooltip: '轨道机动' },
      { id: 2, left: 60, width: 15, type: 'normal', tooltip: '常规测控' }
    ]
  }
])

// 动态更新数据
let updateInterval
onMounted(() => {
  updateInterval = setInterval(() => {
    // 更新数据流量
    dataFlow.value = (120 + Math.random() * 30).toFixed(1)
    // 更新活跃卫星
    activeSatellites.value = 10 + Math.floor(Math.random() * 3)
    // 添加新事件
    if (Math.random() > 0.7) {
      const newEvent = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        title: '系统更新',
        description: '实时数据更新完成'
      }
      events.value.unshift(newEvent)
      if (events.value.length > 6) events.value.pop()
    }
  }, 3000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 84px);
  max-width: 1920px;
  margin: 0 auto;
  overflow: hidden;
}

/* 顶部统计栏 */
.top-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.stat-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
}

.stat-trend {
  font-size: 11px;
  font-weight: 600;
}

.stat-trend .up {
  color: #10b981;
}

.stat-trend .down {
  color: #ef4444;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 260px 1fr 280px;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 面板通用样式 */
.panel-box {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(2, 6, 23, 0.5);
  border-bottom: 1px solid rgba(100, 116, 139, 0.1);
  flex-shrink: 0;
}

.header-icon {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.header-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
.header-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.header-icon.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.header-icon.cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.header-icon.amber { background: linear-gradient(135deg, #f59e0b, #d97706); }

.header-title {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
}

.header-count {
  margin-left: auto;
  padding: 2px 6px;
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  font-size: 11px;
  border-radius: 8px;
}

.panel-body {
  padding: 8px;
  flex: 1;
  overflow-y: auto;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
}

.left-panel .panel-box {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 卫星列表 */
.satellite-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-top: 2px;
}

.satellite-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 6px;
  border-left: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.satellite-item:hover {
  background: rgba(51, 65, 85, 0.6);
}

.satellite-item.online {
  border-left-color: #10b981;
}

.satellite-item.warning {
  border-left-color: #f59e0b;
}

.satellite-item.offline {
  border-left-color: #ef4444;
}

.sat-status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.sat-status-indicator.online {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.sat-status-indicator.warning {
  background: #f59e0b;
  box-shadow: 0 0 6px #f59e0b;
}

.sat-status-indicator.offline {
  background: #ef4444;
}

.sat-info {
  flex: 1;
}

.sat-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}

.sat-id {
  font-size: 10px;
  color: #64748b;
}

.sat-signal {
  display: flex;
  align-items: center;
  gap: 4px;
}

.signal-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
}

.bar {
  width: 2px;
  background: #334155;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.bar:nth-child(1) { height: 3px; }
.bar:nth-child(2) { height: 5px; }
.bar:nth-child(3) { height: 7px; }
.bar:nth-child(4) { height: 9px; }

.bar.active {
  background: #10b981;
}

.signal-text {
  font-size: 10px;
  color: #64748b;
}

/* 站点列表 */
.station-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-top: 2px;
}

.station-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 5px;
  flex-shrink: 0;
}

.station-icon {
  width: 20px;
  height: 20px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
}

.station-info {
  flex: 1;
}

.station-name {
  font-size: 11px;
  font-weight: 500;
  color: #e2e8f0;
}

.station-status {
  font-size: 10px;
}

.station-status.online {
  color: #10b981;
}

.station-status.warning {
  color: #f59e0b;
}

.station-uptime {
  font-size: 10px;
  color: #64748b;
}

/* 资源使用 */
.resource-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-top: 2px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-name {
  font-size: 11px;
  color: #94a3b8;
}

.resource-value {
  font-size: 12px;
  font-weight: 600;
}

.resource-value.low { color: #10b981; }
.resource-value.normal { color: #06b6d4; }
.resource-value.high { color: #f59e0b; }
.resource-value.critical { color: #ef4444; }

.resource-bar {
  height: 4px;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 2px;
  overflow: hidden;
}

.resource-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* 中间区域 */
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 地球区域 */
.earth-section {
  flex: 1;
  min-height: 0;
  position: relative;
}

.earth-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  border-radius: 12px;
  overflow: hidden;
}

.earth-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ring-1 {
  width: 160px;
  height: 160px;
  animation: ring-rotate 20s linear infinite;
}

.ring-2 {
  width: 220px;
  height: 220px;
  border-style: dashed;
  animation: ring-rotate 30s linear infinite reverse;
}

.ring-3 {
  width: 280px;
  height: 280px;
  border-color: rgba(139, 92, 246, 0.15);
  animation: ring-rotate 40s linear infinite;
}

@keyframes ring-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.floating-info {
  position: absolute;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  backdrop-filter: blur(10px);
}

.floating-info.top-left { top: 12px; left: 12px; }
.floating-info.top-right { top: 12px; right: 12px; }
.floating-info.bottom-left { bottom: 12px; left: 12px; }
.floating-info.bottom-right { bottom: 12px; right: 12px; }

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item .label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 700;
}

.text-cyan { color: #06b6d4; }
.text-green { color: #10b981; }
.text-blue { color: #3b82f6; }
.text-purple { color: #8b5cf6; }

/* 甘特图区域 */
.gantt-section {
  flex-shrink: 0;
  height: 140px;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
}

.right-panel .panel-box {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 告警面板 */
.alert-count {
  margin-left: auto;
  padding: 2px 6px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 11px;
  border-radius: 8px;
}

.alert-count.pulse {
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-top: 2px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 6px;
  border-left: 2px solid transparent;
  flex-shrink: 0;
}

.alert-item.warning {
  border-left-color: #f59e0b;
}

.alert-item.error {
  border-left-color: #ef4444;
}

.alert-item.info {
  border-left-color: #06b6d4;
}

.alert-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-item.warning .alert-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.alert-item.error .alert-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.alert-item.info .alert-icon {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 11px;
  font-weight: 500;
  color: #e2e8f0;
}

.alert-time {
  font-size: 10px;
  color: #64748b;
}

.alert-level-badge {
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 500;
}

.alert-level-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.alert-level-badge.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.alert-level-badge.info {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
}

/* 事件列表 */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-top: 2px;
}

.event-item {
  display: flex;
  gap: 8px;
  padding: 10px 8px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 5px;
  border-left: 2px solid #06b6d4;
  flex-shrink: 0;
}

.event-time {
  font-size: 10px;
  color: #06b6d4;
  font-family: monospace;
  min-width: 50px;
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 11px;
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 1px;
}

.event-desc {
  font-size: 10px;
  color: #64748b;
}

/* 日志列表 */
.log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-top: 2px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 5px;
  flex-shrink: 0;
}

.log-indicator {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.log-indicator.success { background: #10b981; }
.log-indicator.warning { background: #f59e0b; }
.log-indicator.error { background: #ef4444; }
.log-indicator.info { background: #06b6d4; }

.log-content {
  flex: 1;
}

.log-title {
  font-size: 10px;
  font-weight: 500;
  color: #e2e8f0;
}

.log-meta {
  display: flex;
  gap: 6px;
  font-size: 9px;
  color: #64748b;
}

.log-status {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-status.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.log-status.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.log-status.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

/* 甘特图样式 */
.gantt-panel {
  height: 100%;
}

.gantt-panel .panel-body {
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gantt-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-range {
  font-size: 11px;
  color: #94a3b8;
  font-family: monospace;
}

.gantt-chart {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.gantt-timeline {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
  padding-bottom: 2px;
}

.time-label {
  font-size: 9px;
  color: #64748b;
  font-family: monospace;
}

.gantt-tasks {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.gantt-task-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.task-label {
  width: 55px;
  font-size: 9px;
  color: #94a3b8;
  font-family: monospace;
}

.task-timeline {
  flex: 1;
  height: 14px;
  background: rgba(51, 65, 85, 0.3);
  border-radius: 2px;
  position: relative;
}

.task-slot {
  position: absolute;
  top: 2px;
  height: 10px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-slot:hover {
  transform: scaleY(1.2);
  z-index: 10;
}

.task-slot.normal {
  background: linear-gradient(90deg, #06b6d4, #22d3ee);
}

.task-slot.warning {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.task-slot.critical {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.slot-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  padding: 3px 6px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 3px;
  font-size: 10px;
  color: #e2e8f0;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

.task-slot:hover .slot-tooltip {
  opacity: 1;
  visibility: visible;
}

/* 响应式 */
@media (max-width: 1400px) {
  .main-content {
    grid-template-columns: 240px 1fr 260px;
  }
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .left-panel,
  .right-panel {
    display: none;
  }
  
  .top-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .top-stats {
    grid-template-columns: 1fr;
  }
}

/* 2K屏幕优化 */
@media (min-width: 1920px) {
  .dashboard-container {
    max-width: 100%;
  }
  
  .main-content {
    grid-template-columns: 280px 1fr 300px;
  }
}

/* 滚动条样式 */
.panel-body::-webkit-scrollbar {
  width: 4px;
}

.panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.panel-body::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 2px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}
</style>
