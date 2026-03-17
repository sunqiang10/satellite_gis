<template>
  <div class="loop-monitor">
    <!-- 顶部子导航 -->
    <div class="sub-nav">
      <div class="sub-nav-left">
        <div
          v-for="tab in navTabs"
          :key="tab.key"
          class="sub-nav-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="sub-nav-right">
        <span class="nav-clock">
          <span class="clock-icon">&#9201;</span>
          {{ currentTime }}
        </span>
        <span class="nav-sys-info">INTEL 1.95</span>
      </div>
    </div>

    <!-- 主体三栏布局 -->
    <div class="main-body">
      <!-- ====== 左侧面板 ====== -->
      <div class="left-col">
        <!-- 实测遥测 -->
        <div class="sci-panel telemetry-panel">
          <div class="sci-panel-header">
            <span class="panel-icon">&#9889;</span>
            <span>实测遥测</span>
          </div>
          <div class="sci-panel-body">
            <div class="tm-grid">
              <div class="tm-cell">
                <span class="tm-label">电压</span>
                <span class="tm-value">{{ telemetry.voltage }}<small>V</small></span>
              </div>
              <div class="tm-cell">
                <span class="tm-label">H3</span>
                <span class="tm-value">{{ telemetry.h3 }}<small>A</small></span>
              </div>
              <div class="tm-cell">
                <span class="tm-label">频率</span>
                <span class="tm-value">{{ telemetry.freq }}<small>Hz</small></span>
              </div>
              <div class="tm-cell">
                <span class="tm-label">温度</span>
                <span class="tm-value">{{ telemetry.temp }}<small>℃</small></span>
              </div>
              <div class="tm-cell">
                <span class="tm-label">湿度</span>
                <span class="tm-value">{{ telemetry.humidity }}<small>%</small></span>
              </div>
              <div class="tm-cell">
                <span class="tm-label">功率</span>
                <span class="tm-value">{{ telemetry.power }}<small>W</small></span>
              </div>
            </div>
            <div class="tm-row-extra">
              <span class="tm-tag">测控模式</span>
              <span class="tm-val-sm">{{ telemetry.mode }}</span>
              <span class="tm-val-sm cyan">{{ telemetry.packets }} pkt/s</span>
              <span class="tm-val-sm green">{{ telemetry.snr }} dB</span>
            </div>
            <div class="gauge-row">
              <div class="gauge-wrap" v-for="(g, i) in gauges" :key="i">
                <svg viewBox="0 0 120 120" class="gauge-svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(6,182,212,0.12)" stroke-width="8" 
                    stroke-dasharray="235.6" stroke-dashoffset="78.5" 
                    transform="rotate(135 60 60)" />
                  <circle cx="60" cy="60" r="50" fill="none" :stroke="g.color" stroke-width="8"
                    :stroke-dasharray="235.6" 
                    :stroke-dashoffset="235.6 - (g.percent / 100) * 235.6 + 78.5"
                    stroke-linecap="round"
                    transform="rotate(135 60 60)" />
                  <text x="60" y="55" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">{{ g.value }}</text>
                  <text x="60" y="72" text-anchor="middle" fill="#94a3b8" font-size="9">{{ g.unit }}</text>
                </svg>
                <div class="gauge-label">{{ g.label }}</div>
              </div>
            </div>
            <div class="digital-readout">
              <div class="readout-item">
                <span class="readout-label">SPV</span>
                <span class="readout-value glow-cyan">{{ telemetry.spv }}</span>
              </div>
              <div class="readout-item">
                <span class="readout-label">帧计数</span>
                <span class="readout-value glow-green">{{ telemetry.frameCount }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 实测遥控 -->
        <div class="sci-panel control-panel">
          <div class="sci-panel-header">
            <span class="panel-icon">&#9881;</span>
            <span>实测遥控</span>
          </div>
          <div class="sci-panel-body">
            <div class="ctrl-grid">
              <div class="ctrl-item" v-for="(c, i) in controlItems" :key="i">
                <span class="ctrl-label">{{ c.label }}</span>
                <span class="ctrl-val" :class="c.status">{{ c.value }}</span>
              </div>
            </div>
            <div class="ctrl-actions">
              <button class="btn-sci" @click="sendCommand('start')">启动</button>
              <button class="btn-sci outline" @click="sendCommand('stop')">停止</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== 中间区域 - 设备状态信息面板 ====== -->
      <div class="center-col">
        <div class="device-panel">
          <!-- 面板顶部信息栏 -->
          <div class="dp-header">
            <div class="dp-header-left">
              <!-- <div class="dp-tabs">
                <span class="dp-tab" :class="{ active: dpActiveTab === 'status' }" @click="dpActiveTab = 'status'">回路状态</span>
                <span class="dp-tab" :class="{ active: dpActiveTab === 'telemetry' }" @click="dpActiveTab = 'telemetry'">遥测信息</span>
              </div> -->
              <div class="dp-device-info">
                <span class="dp-info-label">设备名称:</span>
                <span class="dp-info-value">回路名AGO1-1_调制解调(帧)</span>
              </div>
              <div class="dp-device-sub">
                <span class="dp-info-label">设备编号:</span>
                <span class="dp-info-value">GTL-2000E/1-A03</span>
              </div>
              <div class="dp-time-range">
                <span class="dp-info-label">起止时间:</span>
                <span class="dp-info-value">{{ dpTimeStart }}</span>
                <span class="dp-time-sep">~</span>
                <span class="dp-info-value">{{ dpTimeEnd }}</span>
              </div>
            </div>
            <div class="dp-header-right">
              <!-- 圆形状态指示器 -->
              <div class="dp-circle-indicator">
                <svg viewBox="0 0 100 100" class="circle-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,182,212,0.1)" stroke-width="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ef4444" stroke-width="6"
                    :stroke-dasharray="263.9"
                    :stroke-dashoffset="263.9 * (1 - dpSignalPercent / 100)"
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)" />
                  <text x="50" y="46" text-anchor="middle" fill="#ef4444" font-size="18" font-weight="700">{{ dpSignalPercent }}%</text>
                  <text x="50" y="62" text-anchor="middle" fill="#94a3b8" font-size="8">信号质量</text>
                </svg>
              </div>
            </div>
          </div>

          <!-- 面板主体 - 三列布局 -->
          <div class="dp-body">
            <!-- 左侧参数表 -->
            <div class="dp-params">
              <!-- 主ADC 参数组 -->
              <div class="param-group">
                <div class="param-group-header">
                  <span class="pg-icon">&#9670;</span> 主ADC/
                </div>
                <div class="param-row" v-for="(p, i) in adcParams" :key="'adc'+i">
                  <span class="param-led" :class="'led-' + p.led"></span>
                  <span class="param-name">{{ p.name }}</span>
                  <span class="param-val" :class="p.cls">{{ p.value }}</span>
                </div>
              </div>
              <!-- ADC-Dpd-Lat 参数组 -->
              <div class="param-group">
                <div class="param-group-header">
                  <span class="pg-icon">&#9670;</span> ADC-Dpd-Lat
                </div>
                <div class="param-row" v-for="(p, i) in dpdParams" :key="'dpd'+i">
                  <span class="param-led" :class="'led-' + p.led"></span>
                  <span class="param-name">{{ p.name }}</span>
                  <span class="param-val" :class="p.cls">{{ p.value }}</span>
                </div>
              </div>
              <!-- 日接入 遥测数据 -->
              <div class="param-group">
                <div class="param-group-header">
                  <span class="pg-icon">&#9670;</span> 日接入 大风向 遥测数据
                </div>
                <div class="param-row" v-for="(p, i) in tmDataParams" :key="'tm'+i">
                  <span class="param-led" :class="'led-' + p.led"></span>
                  <span class="param-name">{{ p.name }}</span>
                  <span class="param-val" :class="p.cls">{{ p.value }}</span>
                </div>
              </div>
              <!-- 命C参数组 -->
              <div class="param-group">
                <div class="param-group-header">
                  <span class="pg-icon">&#9670;</span> 命C
                </div>
                <div class="param-row" v-for="(p, i) in cmdParams" :key="'cmd'+i">
                  <span class="param-led" :class="'led-' + p.led"></span>
                  <span class="param-name">{{ p.name }}</span>
                  <span class="param-val" :class="p.cls">{{ p.value }}</span>
                </div>
              </div>
            </div>

            <!-- 中部 - 遥测/遥控状态灯 + ESL/N0-AGC 图表 -->
            <div class="dp-charts-center">
              <div class="led-panel">
                <div class="led-panel-title">
                  <span class="pg-icon">&#9670;</span> 遥测信号状态
                </div>
                <div class="led-grid">
                  <div class="led-item" v-for="(led, i) in telemetryLeds" :key="'tl'+i">
                    <span class="led-dot" :class="'led-' + led.color"></span>
                    <span class="led-name">{{ led.label }}</span>
                  </div>
                </div>
              </div>
              <div class="chart-box">
                <div class="chart-box-title">
                  <span class="pg-icon">&#9670;</span> ESL/N0-AGC
                </div>
                <div ref="lineChartRef" class="echart-container"></div>
              </div>
            </div>

            <!-- 右侧 - 遥控/测量状态灯 + 多参数趋势 -->
            <div class="dp-charts-right">
              <div class="led-panel">
                <div class="led-panel-title">
                  <span class="pg-icon">&#9670;</span> 遥控/测量信号状态
                </div>
                <div class="led-grid">
                  <div class="led-item" v-for="(led, i) in controlMeasureLeds" :key="'cm'+i">
                    <span class="led-dot" :class="'led-' + led.color"></span>
                    <span class="led-name">{{ led.label }}</span>
                  </div>
                </div>
              </div>
              <div class="chart-box">
                <div class="chart-box-title">多参数趋势</div>
                <div ref="trendChartRef" class="echart-container"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== 右侧面板 ====== -->
      <div class="right-col">
        <div class="sci-panel stream-panel">
          <div class="sci-panel-header">
            <span class="panel-icon">&#9729;</span>
            <span>解调系统 <small>Swift Stream</small></span>
          </div>
          <div class="sci-panel-body">
            <div class="stream-date">
              <span class="date-label">日期</span>
              <span class="date-value">{{ streamData.date }}</span>
            </div>
            <div class="stream-params">
              <div class="stream-row" v-for="(p, i) in streamParams" :key="i">
                <span class="sp-label">{{ p.label }}</span>
                <span class="sp-value" :class="p.cls">{{ p.value }}</span>
              </div>
            </div>
            <div class="stream-chart">
              <div class="chart-title">数据传输速率</div>
              <div class="mini-bar-chart">
                <div 
                  v-for="(bar, i) in transferBars" 
                  :key="i" 
                  class="mini-bar"
                  :style="{ height: bar + '%' }"
                ></div>
              </div>
              <div class="chart-labels">
                <span>0s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>
            <div class="channel-list">
              <div class="channel-header">通道状态</div>
              <div class="channel-item" v-for="(ch, i) in channels" :key="i">
                <span class="ch-dot" :class="ch.status"></span>
                <span class="ch-name">{{ ch.name }}</span>
                <span class="ch-rate">{{ ch.rate }}</span>
                <span class="ch-status-text" :class="ch.status">{{ ch.statusText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const activeTab = ref('monitor')
const dpActiveTab = ref('status')

const navTabs = [
  { key: 'monitor', label: '回路监控' },
  { key: 'list', label: '遥测信息' },
  // { key: 'query', label: '回路查询' },
  // { key: 'curve', label: '回路曲线' },
  // { key: 'report', label: '回路报表' }
]

const currentTime = ref('')
const dpTimeStart = ref('15:54:14')
const dpTimeEnd = ref('16:01:51')
const dpSignalPercent = ref(67)

// === 遥测数据 ===
const telemetry = ref({
  voltage: 143,
  h3: 1.27,
  freq: 2450,
  temp: 0,
  humidity: 77,
  power: 2.9,
  mode: '自动跟踪',
  packets: 9637,
  snr: 70,
  spv: 38,
  frameCount: 85516
})

const gauges = ref([
  { label: '信号强度', value: 25, unit: 'dBm', percent: 62, color: '#06b6d4' },
  { label: '数据速率', value: 301, unit: 'Kbps', percent: 75, color: '#10b981' },
  { label: '误码率', value: 0.03, unit: '%', percent: 15, color: '#f59e0b' }
])

const controlItems = ref([
  { label: '指令通道', value: '正常', status: 'ok' },
  { label: '加密状态', value: '已启用', status: 'ok' },
  { label: '指令队列', value: '3 条', status: 'warn' },
  { label: '最后发送', value: '12:45:03', status: 'ok' },
  { label: '确认状态', value: '已确认', status: 'ok' },
  { label: '通道延迟', value: '23 ms', status: 'ok' }
])

// === 遥测信号状态灯 ===
const telemetryLeds = ref([
  { label: '遥测帧同步', color: 'green' },
  { label: '遥测载波', color: 'green' },
  { label: '遥测位同步', color: 'green' },
  { label: '遥测解调', color: 'red' },
  { label: '遥测副帧同步', color: 'green' },
  { label: '遥测时码', color: 'green' },
  { label: '遥测解密', color: 'red' },
  { label: '遥测RS', color: 'green' },
  { label: '遥测LDPC', color: 'green' },
  { label: '遥测Turbo', color: 'red' }
])

// === 遥控/测量信号状态灯 ===
const controlMeasureLeds = ref([
  { label: '遥控帧同步', color: 'green' },
  { label: '遥控载波', color: 'red' },
  { label: '遥控副载波', color: 'green' },
  { label: '遥控调制', color: 'green' },
  { label: '遥控加密', color: 'green' },
  { label: '测量帧同步', color: 'red' },
  { label: '测量载波', color: 'green' },
  { label: '测距', color: 'green' },
  { label: '测速', color: 'green' },
  { label: '引导', color: 'red' }
])

// === 设备面板参数组 ===
const adcParams = ref([
  { name: 'H4/D 电压', value: '3.32 V', cls: '', led: 'green' },
  { name: 'H4/D 电流', value: '1.05 A', cls: '', led: 'green' },
  { name: '功率', value: '28.6 W', cls: 'green', led: 'green' },
  { name: '正频率', value: '2245.5 MHz', cls: 'cyan', led: 'green' },
  { name: '波形', value: 'QPSK', cls: '', led: 'green' },
  { name: '码速率', value: '4096 Kbps', cls: '', led: 'green' },
  { name: '载噪比', value: '12.5 dB', cls: 'green', led: 'red' },
  { name: 'AGC', value: '-45.2 dBm', cls: 'orange', led: 'red' }
])

const dpdParams = ref([
  { name: 'Dpd 增益', value: '15.3 dB', cls: '', led: 'green' },
  { name: 'Lat 延迟', value: '2.4 ms', cls: '', led: 'green' },
  { name: '相位偏差', value: '0.12°', cls: 'green', led: 'green' },
  { name: '幅度偏差', value: '0.08 dB', cls: 'green', led: 'green' },
  { name: 'EVM', value: '3.2%', cls: '', led: 'yellow' },
  { name: '杂散', value: '-62 dBc', cls: '', led: 'green' }
])

const tmDataParams = ref([
  { name: '日接入量', value: '1,247 帧', cls: '', led: 'green' },
  { name: '风向角', value: '215.3°', cls: '', led: 'green' },
  { name: '俯仰角', value: '42.7°', cls: '', led: 'green' },
  { name: '方位角', value: '128.5°', cls: '', led: 'green' },
  { name: '遥测帧率', value: '100 fps', cls: 'cyan', led: 'green' },
  { name: '遥测误码', value: '0.0%', cls: 'green', led: 'green' }
])

const cmdParams = ref([
  { name: '命令序号', value: '#A2F4', cls: 'cyan', led: 'green' },
  { name: '响应时间', value: '23 ms', cls: '', led: 'green' },
  { name: '执行结果', value: '成功', cls: 'green', led: 'green' },
  { name: '重试次数', value: '0', cls: '', led: 'green' }
])

// === 右栏数据 ===
const streamData = ref({ date: '2026-02-12' })
const streamParams = ref([
  { label: '载波频率', value: '2017.5 MHz', cls: 'cyan' },
  { label: '符号速率', value: '2048 Ksps', cls: '' },
  { label: '调制方式', value: 'QPSK', cls: '' },
  { label: '信噪比', value: '15.3 dB', cls: 'green' },
  { label: '锁定状态', value: '已锁定', cls: 'green' },
  { label: '误码率', value: '1.2E-7', cls: '' },
  { label: '帧同步', value: '同步', cls: 'green' },
  { label: '数据速率', value: '4096 bps', cls: 'cyan' }
])
const transferBars = ref([])
const channels = ref([
  { name: 'CH-1 遥测', rate: '4096 bps', status: 'ok', statusText: '正常' },
  { name: 'CH-2 遥控', rate: '2048 bps', status: 'ok', statusText: '正常' },
  { name: 'CH-3 测距', rate: '1024 bps', status: 'ok', statusText: '正常' },
  { name: 'CH-4 图像', rate: '8192 bps', status: 'warn', statusText: '降速' },
  { name: 'CH-5 备份', rate: '---', status: 'off', statusText: '待机' }
])

// === ECharts refs ===
const lineChartRef = ref(null)
const trendChartRef = ref(null)

const lineChart = shallowRef(null)
const trendChart = shallowRef(null)

// 生成时间标签
const generateTimeLabels = (count, startMin = 54) => {
  const labels = []
  for (let i = 0; i < count; i++) {
    const min = startMin + Math.floor(i * 8 / count)
    const sec = Math.floor((i * 60 / count) % 60)
    labels.push(`15:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`)
  }
  return labels
}

// 通用暗色主题选项
const darkAxisStyle = {
  axisLine: { lineStyle: { color: 'rgba(6,182,212,0.2)' } },
  axisTick: { lineStyle: { color: 'rgba(6,182,212,0.15)' } },
  axisLabel: { color: '#8b9ab5', fontSize: 9 },
  splitLine: { lineStyle: { color: 'rgba(6,182,212,0.06)' } }
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  lineChart.value = echarts.init(lineChartRef.value)
  const timeLabels = generateTimeLabels(60)
  // 生成信号衰落曲线 - 先稳定后急剧下降再恢复
  const data = Array.from({ length: 60 }, (_, i) => {
    if (i < 25) return 65 + Math.random() * 5
    if (i < 30) return 65 - (i - 25) * 13 + Math.random() * 2
    if (i < 35) return 2 + Math.random() * 3
    if (i < 40) return (i - 35) * 6 + Math.random() * 3
    return 28 + Math.random() * 4
  })
  lineChart.value.setOption({
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: { type: 'category', data: timeLabels, ...darkAxisStyle, axisLabel: { ...darkAxisStyle.axisLabel, rotate: 45, interval: 12 } },
    yAxis: { type: 'value', max: 80, ...darkAxisStyle },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,12,28,0.95)', borderColor: 'rgba(6,182,212,0.3)', textStyle: { color: '#e2e8f0', fontSize: 10 } },
    series: [{
      type: 'line',
      data,
      smooth: false,
      symbol: 'none',
      lineStyle: { color: '#06b6d4', width: 1.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(6,182,212,0.25)' },
          { offset: 1, color: 'rgba(6,182,212,0.02)' }
        ])
      }
    }]
  })
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart.value = echarts.init(trendChartRef.value)
  const timeLabels = generateTimeLabels(50)
  const genLine = (base, amp) => Array.from({ length: 50 }, (_, i) => {
    if (i < 20) return base + Math.random() * amp
    if (i < 28) return base - (i - 20) * (amp * 0.4) + Math.random() * amp * 0.3
    return base * 0.3 + Math.random() * amp * 0.5
  })
  trendChart.value.setOption({
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: { type: 'category', data: timeLabels, ...darkAxisStyle, axisLabel: { ...darkAxisStyle.axisLabel, rotate: 45, interval: 10 } },
    yAxis: { type: 'value', ...darkAxisStyle },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,12,28,0.95)', borderColor: 'rgba(6,182,212,0.3)', textStyle: { color: '#e2e8f0', fontSize: 10 } },
    legend: { show: false },
    series: [
      { name: 'AGC', type: 'line', data: genLine(45, 8), smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 1.5 } },
      { name: 'ES/N0', type: 'line', data: genLine(35, 10), smooth: true, symbol: 'none', lineStyle: { color: '#d946ef', width: 1.5 } },
      { name: 'S/N0', type: 'line', data: genLine(55, 6), smooth: true, symbol: 'none', lineStyle: { color: '#f97316', width: 1.5 } }
    ]
  })
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

const generateBars = () => {
  transferBars.value = Array.from({ length: 20 }, () => 20 + Math.random() * 75)
}

const sendCommand = (type) => {
  ElMessage.success(`指令 [${type}] 已发送`)
}

// 动态更新图表数据
const updateCharts = () => {
  // 随机切换个别LED状态（低概率模拟偶发变化）
  if (Math.random() < 0.15) {
    const arr = Math.random() < 0.5 ? telemetryLeds : controlMeasureLeds
    const idx = Math.floor(Math.random() * arr.value.length)
    arr.value[idx].color = arr.value[idx].color === 'green' ? 'red' : 'green'
  }
}

let timeInterval, dataInterval

const handleResize = () => {
  lineChart.value?.resize()
  trendChart.value?.resize()
}

onMounted(() => {
  updateTime()
  generateBars()
  timeInterval = setInterval(updateTime, 1000)

  nextTick(() => {
    initLineChart()
    initTrendChart()
  })

  dataInterval = setInterval(() => {
    telemetry.value.voltage = (140 + Math.random() * 6).toFixed(0)
    telemetry.value.h3 = (1.2 + Math.random() * 0.15).toFixed(2)
    telemetry.value.packets = Math.floor(9500 + Math.random() * 300)
    telemetry.value.frameCount += Math.floor(Math.random() * 10)
    gauges.value[0].value = (22 + Math.random() * 8).toFixed(0)
    gauges.value[0].percent = 50 + Math.random() * 30
    gauges.value[1].value = Math.floor(280 + Math.random() * 50)
    gauges.value[1].percent = 60 + Math.random() * 30
    generateBars()
    updateCharts()
    dpSignalPercent.value = Math.floor(60 + Math.random() * 15)
    // 更新部分参数
    adcParams.value[2].value = (27 + Math.random() * 3).toFixed(1) + ' W'
    adcParams.value[6].value = (11 + Math.random() * 3).toFixed(1) + ' dB'
    adcParams.value[7].value = (-48 + Math.random() * 6).toFixed(1) + ' dBm'
  }, 2000)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (dataInterval) clearInterval(dataInterval)
  lineChart.value?.dispose()
  trendChart.value?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ===== 全局容器 ===== */
.loop-monitor {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  color: #c8d6e5;
  font-family: 'Consolas', 'Courier New', monospace;
  overflow: hidden;
  user-select: none;
}

/* ===== 顶部子导航 ===== */
.sub-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0 8px;
  height: 40px;
  background: linear-gradient(180deg, rgba(0,16,36,0.95), rgba(0,8,20,0.98));
  border-bottom: 1px solid rgba(6,182,212,0.35);
  border-top: 1px solid rgba(6,182,212,0.15);
}

.sub-nav-left {
  display: flex;
  gap: 2px;
}

.sub-nav-tab {
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  transition: all 0.25s;
  position: relative;
  letter-spacing: 1px;
}

.sub-nav-tab:hover {
  color: #94a3b8;
  background: rgba(6,182,212,0.06);
}

.sub-nav-tab.active {
  color: #06b6d4;
  background: rgba(6,182,212,0.12);
}

.sub-nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 20%;
  width: 60%;
  height: 2px;
  background: #06b6d4;
  box-shadow: 0 0 8px #06b6d4, 0 0 20px rgba(6,182,212,0.4);
}

.sub-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-clock {
  color: #06b6d4;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
}

.clock-icon {
  font-size: 12px;
  margin-right: 4px;
}

.nav-sys-info {
  color: #8b9ab5;
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid rgba(100,116,139,0.25);
  border-radius: 3px;
  background: rgba(15,23,42,0.5);
}

/* ===== 主体三栏 ===== */
.main-body {
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  gap: 8px;
  flex: 1;
  min-height: 0;
  padding: 8px;
  overflow: hidden;
}

/* ===== 科幻面板通用 ===== */
.sci-panel {
  background: linear-gradient(180deg, rgba(0,12,28,0.96), rgba(0,6,16,0.98));
  border: 1px solid rgba(6,182,212,0.2);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sci-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent);
}

.sci-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #06b6d4;
  background: linear-gradient(90deg, rgba(6,182,212,0.08), transparent);
  border-bottom: 1px solid rgba(6,182,212,0.15);
  flex-shrink: 0;
  letter-spacing: 1px;
}

.sci-panel-header small {
  color: #8b9ab5;
  font-weight: 400;
  font-size: 11px;
}

.panel-icon {
  font-size: 14px;
  color: #06b6d4;
  filter: drop-shadow(0 0 4px rgba(6,182,212,0.6));
}

.sci-panel-body {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  min-height: 0;
}

/* ===== 左栏 ===== */
.left-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.telemetry-panel {
  flex: 3;
  min-height: 0;
}

.control-panel {
  flex: 1;
  min-height: 0;
}

.tm-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.tm-cell {
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  background: rgba(6,182,212,0.04);
  border: 1px solid rgba(6,182,212,0.1);
  border-radius: 4px;
}

.tm-label {
  font-size: 9px;
  color: #8b9ab5;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tm-value {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1.2;
}

.tm-value small {
  font-size: 10px;
  color: #94a3b8;
  margin-left: 2px;
  font-weight: 400;
}

.tm-row-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin-bottom: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  border: 1px solid rgba(100,116,139,0.1);
}

.tm-tag {
  font-size: 10px;
  color: #94a3b8;
  padding: 2px 8px;
  background: rgba(6,182,212,0.1);
  border-radius: 3px;
  border: 1px solid rgba(6,182,212,0.2);
}

.tm-val-sm {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.tm-val-sm.cyan { color: #06b6d4; }
.tm-val-sm.green { color: #10b981; }

.gauge-row {
  display: flex;
  justify-content: space-around;
  margin: 8px 0;
  gap: 4px;
}

.gauge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.gauge-svg {
  width: 90px;
  height: 90px;
  filter: drop-shadow(0 0 6px rgba(6,182,212,0.3));
}

.gauge-label {
  font-size: 9px;
  color: #8b9ab5;
  margin-top: 2px;
  text-align: center;
}

.digital-readout {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid rgba(6,182,212,0.1);
}

.readout-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.readout-label {
  font-size: 9px;
  color: #8b9ab5;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.readout-value {
  font-size: 22px;
  font-weight: 700;
  font-family: 'Consolas', monospace;
}

.readout-value.glow-cyan {
  color: #06b6d4;
  text-shadow: 0 0 10px rgba(6,182,212,0.6);
}

.readout-value.glow-green {
  color: #10b981;
  text-shadow: 0 0 10px rgba(16,185,129,0.6);
}

.ctrl-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.ctrl-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 3px;
  border: 1px solid rgba(100,116,139,0.08);
}

.ctrl-label {
  font-size: 10px;
  color: #94a3b8;
}

.ctrl-val {
  font-size: 10px;
  font-weight: 600;
}

.ctrl-val.ok { color: #10b981; }
.ctrl-val.warn { color: #f59e0b; }
.ctrl-val.err { color: #ef4444; }

.ctrl-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-sci {
  padding: 6px 24px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(6,182,212,0.5);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.1));
  color: #06b6d4;
}

.btn-sci:hover {
  background: linear-gradient(135deg, rgba(6,182,212,0.4), rgba(6,182,212,0.2));
  box-shadow: 0 0 12px rgba(6,182,212,0.3);
}

.btn-sci.outline {
  background: transparent;
  color: #94a3b8;
  border-color: rgba(100,116,139,0.3);
}

.btn-sci.outline:hover {
  border-color: rgba(100,116,139,0.6);
  color: #e2e8f0;
  box-shadow: none;
}

/* ===== 中间区域 - 设备状态面板 ===== */
.center-col {
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.device-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: linear-gradient(180deg, rgba(0,12,28,0.96), rgba(0,6,16,0.98));
  border: 1px solid rgba(6,182,212,0.2);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.device-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent);
  z-index: 1;
}

/* 设备面板 Header */
.dp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 14px;
  background: linear-gradient(180deg, rgba(6,182,212,0.06), transparent);
  border-bottom: 1px solid rgba(6,182,212,0.15);
  flex-shrink: 0;
}

.dp-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dp-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.dp-tab {
  padding: 3px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #8b9ab5;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.dp-tab:hover {
  color: #94a3b8;
}

.dp-tab.active {
  color: #06b6d4;
  background: rgba(6,182,212,0.1);
  border-color: rgba(6,182,212,0.25);
}

.dp-device-info, .dp-device-sub, .dp-time-range {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.dp-info-label {
  color: #8b9ab5;
}

.dp-info-value {
  color: #e2e8f0;
  font-weight: 600;
}

.dp-time-sep {
  color: #64748b;
}

.dp-header-right {
  flex-shrink: 0;
}

.dp-circle-indicator {
  width: 80px;
  height: 80px;
}

.circle-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 8px rgba(239,68,68,0.3));
}

/* 面板主体 */
.dp-body {
  flex: 1;
  display: grid;
  grid-template-columns: 220px 1fr 1fr;
  gap: 6px;
  padding: 6px;
  min-height: 0;
  overflow: hidden;
}

/* 参数表区域 */
.dp-params {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;
}

.param-group {
  flex-shrink: 0;
}

.param-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #06b6d4;
  background: linear-gradient(90deg, rgba(6,182,212,0.08), transparent);
  border-radius: 3px;
  margin-bottom: 3px;
  letter-spacing: 0.5px;
}

.pg-icon {
  font-size: 8px;
  color: #06b6d4;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-bottom: 1px solid rgba(100,116,139,0.06);
  font-size: 10px;
  transition: background 0.15s;
}

.param-row:hover {
  background: rgba(6,182,212,0.04);
}

/* LED 状态指示灯 */
.param-led {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.param-led.led-green {
  background: radial-gradient(circle at 35% 35%, #6ee7b7, #10b981, #059669);
  box-shadow: 0 0 4px rgba(16,185,129,0.7), 0 0 8px rgba(16,185,129,0.3);
}

.param-led.led-red {
  background: radial-gradient(circle at 35% 35%, #fca5a5, #ef4444, #dc2626);
  box-shadow: 0 0 4px rgba(239,68,68,0.7), 0 0 8px rgba(239,68,68,0.3);
  animation: led-blink-red 1.5s ease-in-out infinite;
}

.param-led.led-yellow {
  background: radial-gradient(circle at 35% 35%, #fde68a, #f59e0b, #d97706);
  box-shadow: 0 0 4px rgba(245,158,11,0.7), 0 0 8px rgba(245,158,11,0.3);
  animation: led-blink-yellow 2s ease-in-out infinite;
}

@keyframes led-blink-red {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(239,68,68,0.7), 0 0 8px rgba(239,68,68,0.3); }
  50% { opacity: 0.6; box-shadow: 0 0 2px rgba(239,68,68,0.4); }
}

@keyframes led-blink-yellow {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(245,158,11,0.7), 0 0 8px rgba(245,158,11,0.3); }
  50% { opacity: 0.7; box-shadow: 0 0 2px rgba(245,158,11,0.4); }
}

.param-name {
  color: #94a3b8;
  flex: 1;
}

.param-val {
  font-weight: 600;
  color: #e2e8f0;
  text-align: right;
}

.param-val.green { color: #10b981; }
.param-val.cyan { color: #06b6d4; }
.param-val.orange { color: #f97316; }
.param-val.red { color: #ef4444; }

/* 图表容器 */
.dp-charts-center,
.dp-charts-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow: hidden;
}

/* LED 状态灯面板 */
.led-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(6,182,212,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.led-panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(6,182,212,0.04);
  border-bottom: 1px solid rgba(100,116,139,0.06);
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.led-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  padding: 6px;
  align-content: start;
  overflow-y: auto;
}

.led-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 3px;
  background: rgba(0,0,0,0.15);
  border: 1px solid rgba(100,116,139,0.05);
  transition: background 0.2s;
}

.led-item:hover {
  background: rgba(6,182,212,0.04);
}

.led-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s;
}

.led-dot.led-green {
  background: radial-gradient(circle at 35% 35%, #6ee7b7, #10b981, #059669);
  box-shadow: 0 0 5px rgba(16,185,129,0.8), 0 0 12px rgba(16,185,129,0.4);
}

.led-dot.led-red {
  background: radial-gradient(circle at 35% 35%, #fca5a5, #ef4444, #dc2626);
  box-shadow: 0 0 5px rgba(239,68,68,0.8), 0 0 12px rgba(239,68,68,0.4);
  animation: led-blink-red 1.5s ease-in-out infinite;
}

.led-name {
  font-size: 10px;
  color: #94a3b8;
  white-space: nowrap;
}

.chart-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(6,182,212,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.chart-box-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(6,182,212,0.04);
  border-bottom: 1px solid rgba(100,116,139,0.06);
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.echart-container {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/* ===== 右栏 ===== */
.right-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.stream-panel {
  flex: 1;
  min-height: 0;
}

.stream-date {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: rgba(6,182,212,0.04);
  border: 1px solid rgba(6,182,212,0.1);
  border-radius: 4px;
  margin-bottom: 8px;
}

.date-label {
  font-size: 10px;
  color: #8b9ab5;
}

.date-value {
  font-size: 12px;
  font-weight: 600;
  color: #06b6d4;
}

.stream-params {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.stream-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
  border-left: 2px solid rgba(6,182,212,0.15);
  transition: border-color 0.3s;
}

.stream-row:hover {
  border-left-color: #06b6d4;
  background: rgba(6,182,212,0.04);
}

.sp-label {
  font-size: 11px;
  color: #94a3b8;
}

.sp-value {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.sp-value.cyan { color: #06b6d4; }
.sp-value.green { color: #10b981; }

.stream-chart {
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
  border: 1px solid rgba(100,116,139,0.08);
}

.chart-title {
  font-size: 10px;
  color: #8b9ab5;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.mini-bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 50px;
}

.mini-bar {
  flex: 1;
  background: linear-gradient(180deg, #06b6d4, rgba(6,182,212,0.2));
  border-radius: 1px 1px 0 0;
  min-height: 2px;
  transition: height 0.5s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 8px;
  color: #64748b;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.channel-header {
  font-size: 10px;
  color: #8b9ab5;
  padding: 4px 0;
  border-bottom: 1px solid rgba(100,116,139,0.1);
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: rgba(0,0,0,0.15);
  border-radius: 3px;
  font-size: 10px;
}

.ch-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ch-dot.ok {
  background: #10b981;
  box-shadow: 0 0 6px rgba(16,185,129,0.6);
}

.ch-dot.warn {
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245,158,11,0.6);
}

.ch-dot.off {
  background: #334155;
}

.ch-name {
  flex: 1;
  color: #94a3b8;
}

.ch-rate {
  color: #94a3b8;
  font-family: 'Consolas', monospace;
}

.ch-status-text {
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.ch-status-text.ok { color: #10b981; }
.ch-status-text.warn { color: #f59e0b; }
.ch-status-text.off { color: #475569; }

/* ===== 滚动条 ===== */
.sci-panel-body::-webkit-scrollbar,
.dp-params::-webkit-scrollbar {
  width: 3px;
}

.sci-panel-body::-webkit-scrollbar-track,
.dp-params::-webkit-scrollbar-track {
  background: transparent;
}

.sci-panel-body::-webkit-scrollbar-thumb,
.dp-params::-webkit-scrollbar-thumb {
  background: rgba(6,182,212,0.2);
  border-radius: 2px;
}

.sci-panel-body::-webkit-scrollbar-thumb:hover,
.dp-params::-webkit-scrollbar-thumb:hover {
  background: rgba(6,182,212,0.4);
}

/* ===== 响应式 ===== */
@media (max-width: 1400px) {
  .main-body {
    grid-template-columns: 260px 1fr 240px;
  }
  .dp-body {
    grid-template-columns: 180px 1fr 1fr;
  }
}

@media (max-width: 1100px) {
  .main-body {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    overflow-y: auto;
  }
  .center-col {
    min-height: 500px;
  }
  .dp-body {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr;
  }
}
</style>
