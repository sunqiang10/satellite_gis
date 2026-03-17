<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">测控管理</h2>
        <p class="text-slate-400 mt-1">卫星测控与通信管理</p>
      </div>
      <div class="flex gap-3">
        <el-button type="primary" @click="handleSendCommand">
          <el-icon class="mr-2"><Position /></el-icon>
          发送指令
        </el-button>
        <el-button @click="refreshData">
          <el-icon class="mr-2"><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 记录查询区域 -->
    <div class="glass-panel rounded-xl p-6">
      <el-tabs v-model="activeTab" type="border-card" class="record-tabs">
        <!-- 遥控记录 -->
        <el-tab-pane label="遥控记录" name="remoteControl">
          <div class="search-area mb-6">
            <div class="flex flex-wrap gap-4 items-end">
              <el-form-item label="用户" class="!mb-0">
                <el-input v-model="searchForms.remoteControl.username" placeholder="请输入用户" clearable style="width: 180px" />
              </el-form-item>
              <el-form-item label="卫星名称" class="!mb-0">
                <el-select v-model="searchForms.remoteControl.satelliteName" placeholder="请选择卫星" clearable style="width: 180px">
                  <el-option v-for="item in satelliteOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间区间" class="!mb-0">
                <el-date-picker
                  v-model="searchForms.remoteControl.timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 360px"
                />
              </el-form-item>
              <div class="flex gap-2" style="margin-bottom: 18px;">
                <el-button type="primary" @click="handleSearch('remoteControl')">
                  <el-icon class="mr-1"><Search /></el-icon>查询
                </el-button>
                <el-button @click="handleReset('remoteControl')">
                  <el-icon class="mr-1"><RefreshRight /></el-icon>重置
                </el-button>
              </div>
            </div>
          </div>
          
          <div class="table-wrapper">
            <el-table :data="paginatedData.remoteControl" v-loading="loading.remoteControl">
            <el-table-column type="index" label="序号" min-width="60" />
            <el-table-column prop="id" label="记录ID" min-width="100" />
            <el-table-column prop="commandName" label="指令名称" min-width="120" />
            <el-table-column prop="satelliteName" label="卫星名称" min-width="100" />
            <el-table-column prop="username" label="操作用户" min-width="100" />
            <el-table-column prop="params" label="指令参数" min-width="450">
              <template #default="{ row }">
                <el-tooltip :content="JSON.stringify(row.params)" placement="top">
                  <code class="text-sci-cyan text-sm truncate max-w-[200px] block">{{ JSON.stringify(row.params) }}</code>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="执行状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="executeTime" label="执行时间" min-width="160" />
            <el-table-column prop="responseTime" label="响应时间(ms)" min-width="120" />
            <el-table-column label="操作" min-width="90" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="handleViewDetail(row, 'remoteControl')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          
          <div class="pagination-wrapper mt-4">
            <el-pagination
              v-model:current-page="pagination.remoteControl.currentPage"
              v-model:page-size="pagination.remoteControl.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.remoteControl.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="(size) => handleSizeChange('remoteControl', size)"
              @current-change="(page) => handleCurrentChange('remoteControl', page)"
              background
            />
          </div>
        </el-tab-pane>

        <!-- 遥测记录 -->
        <el-tab-pane label="遥测记录" name="telemetry">
          <div class="search-area mb-6">
            <div class="flex flex-wrap gap-4 items-end">
              <el-form-item label="用户" class="!mb-0">
                <el-input v-model="searchForms.telemetry.username" placeholder="请输入用户" clearable style="width: 180px" />
              </el-form-item>
              <el-form-item label="卫星名称" class="!mb-0">
                <el-select v-model="searchForms.telemetry.satelliteName" placeholder="请选择卫星" clearable style="width: 180px">
                  <el-option v-for="item in satelliteOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间区间" class="!mb-0">
                <el-date-picker
                  v-model="searchForms.telemetry.timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 360px"
                />
              </el-form-item>
              <div class="flex gap-2" style="margin-bottom: 18px;">
                <el-button type="primary" @click="handleSearch('telemetry')">
                  <el-icon class="mr-1"><Search /></el-icon>查询
                </el-button>
                <el-button @click="handleReset('telemetry')">
                  <el-icon class="mr-1"><RefreshRight /></el-icon>重置
                </el-button>
              </div>
            </div>
          </div>
          
          <div class="table-wrapper">
            <el-table :data="paginatedData.telemetry" v-loading="loading.telemetry">
            <el-table-column type="index" label="序号" min-width="60" />
            <el-table-column prop="id" label="记录ID" min-width="100" />
            <el-table-column prop="satelliteName" label="卫星名称" min-width="100" />
            <el-table-column prop="username" label="采集用户" min-width="100" />
            <el-table-column prop="telemetryType" label="遥测类型" min-width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="getTelemetryTypeType(row.telemetryType)">
                  {{ row.telemetryType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dataSize" label="数据大小" min-width="90">
              <template #default="{ row }">
                {{ formatDataSize(row.dataSize) }}
              </template>
            </el-table-column>
            <el-table-column prop="signalQuality" label="信号质量" min-width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.signalQuality" :stroke-width="6" :show-text="false" :color="getSignalColor" />
                <span class="text-xs text-slate-400">{{ row.signalQuality }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="collectTime" label="采集时间" min-width="160" />
            <el-table-column prop="parseStatus" label="解析状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="row.parseStatus === '已解析' ? 'success' : 'warning'" size="small">
                  {{ row.parseStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="90" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="handleViewDetail(row, 'telemetry')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          
          <div class="pagination-wrapper mt-4">
            <el-pagination
              v-model:current-page="pagination.telemetry.currentPage"
              v-model:page-size="pagination.telemetry.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.telemetry.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="(size) => handleSizeChange('telemetry', size)"
              @current-change="(page) => handleCurrentChange('telemetry', page)"
              background
            />
          </div>
        </el-tab-pane>

        <!-- 数传记录 -->
        <el-tab-pane label="数传记录" name="dataTransmission">
          <div class="search-area mb-6">
            <div class="flex flex-wrap gap-4 items-end">
              <el-form-item label="用户" class="!mb-0">
                <el-input v-model="searchForms.dataTransmission.username" placeholder="请输入用户" clearable style="width: 180px" />
              </el-form-item>
              <el-form-item label="卫星名称" class="!mb-0">
                <el-select v-model="searchForms.dataTransmission.satelliteName" placeholder="请选择卫星" clearable style="width: 180px">
                  <el-option v-for="item in satelliteOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间区间" class="!mb-0">
                <el-date-picker
                  v-model="searchForms.dataTransmission.timeRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 360px"
                />
              </el-form-item>
              <div class="flex gap-2" style="margin-bottom: 18px;">
                <el-button type="primary" @click="handleSearch('dataTransmission')">
                  <el-icon class="mr-1"><Search /></el-icon>查询
                </el-button>
                <el-button @click="handleReset('dataTransmission')">
                  <el-icon class="mr-1"><RefreshRight /></el-icon>重置
                </el-button>
              </div>
            </div>
          </div>
          
          <div class="table-wrapper">
            <el-table :data="paginatedData.dataTransmission" v-loading="loading.dataTransmission">
            <el-table-column type="index" label="序号" min-width="60" />
            <el-table-column prop="id" label="记录ID" min-width="100" />
            <el-table-column prop="satelliteName" label="卫星名称" min-width="100" />
            <el-table-column prop="username" label="操作员" min-width="100" />
            <el-table-column prop="taskName" label="任务名称" min-width="140" />
            <el-table-column prop="dataType" label="数据类型" min-width="100">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.dataType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dataSize" label="数据大小" min-width="90">
              <template #default="{ row }">
                {{ formatDataSize(row.dataSize) }}
              </template>
            </el-table-column>
            <el-table-column prop="transmissionRate" label="传输速率" min-width="110">
              <template #default="{ row }">
                <span class="text-sci-cyan">{{ row.transmissionRate }} Mbps</span>
              </template>
            </el-table-column>
            <el-table-column prop="transmissionMode" label="传输模式" min-width="90" />
            <el-table-column prop="startTime" label="开始时间" min-width="160" />
            <el-table-column prop="endTime" label="结束时间" min-width="160" />
            <el-table-column prop="status" label="传输状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="getTransmissionStatusType(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="90" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="handleViewDetail(row, 'dataTransmission')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
          
          <div class="pagination-wrapper mt-4">
            <el-pagination
              v-model:current-page="pagination.dataTransmission.currentPage"
              v-model:page-size="pagination.dataTransmission.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.dataTransmission.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="(size) => handleSizeChange('dataTransmission', size)"
              @current-change="(page) => handleCurrentChange('dataTransmission', page)"
              background
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 发送指令对话框 -->
    <el-dialog v-model="commandDialogVisible" title="发送指令" width="500px">
      <el-form :model="commandForm" label-width="100px">
        <el-form-item label="指令类型">
          <el-select v-model="commandForm.type" placeholder="选择指令类型">
            <el-option label="姿态控制" value="SET_ATTITUDE" />
            <el-option label="数据上传" value="UPLOAD_DATA" />
            <el-option label="系统检查" value="CHECK_SYSTEM" />
            <el-option label="轨道调整" value="ADJUST_ORBIT" />
            <el-option label="设备重启" value="REBOOT_DEVICE" />
          </el-select>
        </el-form-item>
        <el-form-item label="指令参数">
          <el-input
            v-model="commandForm.params"
            type="textarea"
            :rows="4"
            placeholder='{"key": "value"}'
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="commandForm.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="commandDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitCommand">发送</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="记录详情" width="600px">
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item v-for="(value, key) in currentDetail" :key="key" :label="formatLabel(key)">
            <span v-if="typeof value === 'object'">
              <pre class="text-xs bg-slate-800 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(value, null, 2) }}</pre>
            </span>
            <span v-else>{{ value }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Position, Refresh, Search, RefreshRight } from '@element-plus/icons-vue'
import { mockApi } from '@/api/mock'

let updateInterval = null

const activeTab = ref('remoteControl')
const commandDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentDetail = ref(null)
const commandForm = ref({
  type: '',
  params: '',
  priority: 'medium'
})

const satelliteOptions = ref([
  { label: '遥感卫星-01', value: 'RS-01' },
  { label: '遥感卫星-02', value: 'RS-02' },
  { label: '通信卫星-01', value: 'COM-01' },
  { label: '导航卫星-01', value: 'NAV-01' },
  { label: '气象卫星-01', value: 'MET-01' }
])

const searchForms = reactive({
  remoteControl: {
    username: '',
    satelliteName: '',
    timeRange: []
  },
  telemetry: {
    username: '',
    satelliteName: '',
    timeRange: []
  },
  dataTransmission: {
    username: '',
    satelliteName: '',
    timeRange: []
  }
})

const pagination = reactive({
  remoteControl: {
    currentPage: 1,
    pageSize: 10,
    total: 0
  },
  telemetry: {
    currentPage: 1,
    pageSize: 10,
    total: 0
  },
  dataTransmission: {
    currentPage: 1,
    pageSize: 10,
    total: 0
  }
})

const loading = reactive({
  remoteControl: false,
  telemetry: false,
  dataTransmission: false
})

const remoteControlData = ref([])
const telemetryData = ref([])
const dataTransmissionData = ref([])

const paginatedData = computed(() => {
  return {
    remoteControl: getPagedData(remoteControlData.value, 'remoteControl'),
    telemetry: getPagedData(telemetryData.value, 'telemetry'),
    dataTransmission: getPagedData(dataTransmissionData.value, 'dataTransmission')
  }
})

const getPagedData = (data, type) => {
  const start = (pagination[type].currentPage - 1) * pagination[type].pageSize
  const end = start + pagination[type].pageSize
  return data.slice(start, end)
}

const getStatusType = (status) => {
  const typeMap = {
    executed: 'success',
    executing: 'warning',
    pending: 'info',
    failed: 'danger'
  }
  return typeMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    executed: '已执行',
    executing: '执行中',
    pending: '待执行',
    failed: '已失败'
  }
  return textMap[status] || '未知'
}

const getTelemetryTypeType = (type) => {
  const typeMap = {
    '姿态数据': 'primary',
    '电源数据': 'success',
    '温度数据': 'warning',
    '轨道数据': 'info'
  }
  return typeMap[type] || 'default'
}

const getTransmissionStatusType = (status) => {
  const typeMap = {
    '已完成': 'success',
    '传输中': 'warning',
    '等待中': 'info',
    '已失败': 'danger'
  }
  return typeMap[status] || 'default'
}

const formatDataSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB'
  return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}

const getSignalColor = (percentage) => {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

const formatLabel = (key) => {
  const labelMap = {
    id: '记录ID',
    commandName: '指令名称',
    satelliteName: '卫星名称',
    username: '操作用户',
    params: '指令参数',
    status: '执行状态',
    executeTime: '执行时间',
    responseTime: '响应时间(ms)',
    telemetryType: '遥测类型',
    dataSize: '数据大小',
    signalQuality: '信号质量',
    collectTime: '采集时间',
    parseStatus: '解析状态',
    taskName: '任务名称',
    dataType: '数据类型',
    transmissionRate: '传输速率',
    transmissionMode: '传输模式',
    startTime: '开始时间',
    endTime: '结束时间'
  }
  return labelMap[key] || key
}

const generateMockData = () => {
  const users = ['张三', '李四', '王五', '赵六', '钱七']
  const satellites = ['RS-01', 'RS-02', 'COM-01', 'NAV-01', 'MET-01']
  const statuses = ['executed', 'executing', 'pending', 'failed']
  const telemetryTypes = ['姿态数据', '电源数据', '温度数据', '轨道数据']
  const dataTypes = ['图像数据', '遥测数据', '科学数据', '控制数据']
  const transmissionModes = ['实时传输', '延时传输', '批量传输']
  const transmissionStatuses = ['已完成', '传输中', '等待中', '已失败']
  
  // 生成遥控记录数据
  remoteControlData.value = Array.from({ length: 56 }, (_, i) => ({
    id: `RC${String(i + 1).padStart(4, '0')}`,
    commandName: ['姿态调整', '轨道修正', '数据下载', '设备自检', '电源管理'][Math.floor(Math.random() * 5)],
    satelliteName: satellites[Math.floor(Math.random() * satellites.length)],
    username: users[Math.floor(Math.random() * users.length)],
    params: { angle: Math.random() * 360, speed: Math.random() * 10 },
    status: statuses[Math.floor(Math.random() * statuses.length)],
    executeTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
    responseTime: Math.floor(Math.random() * 500) + 50
  }))
  
  // 生成遥测记录数据
  telemetryData.value = Array.from({ length: 68 }, (_, i) => ({
    id: `TM${String(i + 1).padStart(4, '0')}`,
    satelliteName: satellites[Math.floor(Math.random() * satellites.length)],
    username: users[Math.floor(Math.random() * users.length)],
    telemetryType: telemetryTypes[Math.floor(Math.random() * telemetryTypes.length)],
    dataSize: Math.floor(Math.random() * 1024 * 1024 * 10),
    signalQuality: Math.floor(Math.random() * 40) + 60,
    collectTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
    parseStatus: Math.random() > 0.3 ? '已解析' : '解析中'
  }))
  
  // 生成数传记录数据
  dataTransmissionData.value = Array.from({ length: 42 }, (_, i) => ({
    id: `DT${String(i + 1).padStart(4, '0')}`,
    satelliteName: satellites[Math.floor(Math.random() * satellites.length)],
    username: users[Math.floor(Math.random() * users.length)],
    taskName: `数据传输任务-${i + 1}`,
    dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)],
    dataSize: Math.floor(Math.random() * 1024 * 1024 * 100),
    transmissionRate: (Math.random() * 100 + 50).toFixed(1),
    transmissionMode: transmissionModes[Math.floor(Math.random() * transmissionModes.length)],
    startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
    endTime: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
    status: transmissionStatuses[Math.floor(Math.random() * transmissionStatuses.length)]
  }))
  
  // 更新总数
  pagination.remoteControl.total = remoteControlData.value.length
  pagination.telemetry.total = telemetryData.value.length
  pagination.dataTransmission.total = dataTransmissionData.value.length
}

const handleSearch = (type) => {
  loading[type] = true
  
  setTimeout(() => {
    const searchForm = searchForms[type]
    let data = []
    
    switch(type) {
      case 'remoteControl':
        data = remoteControlData.value
        break
      case 'telemetry':
        data = telemetryData.value
        break
      case 'dataTransmission':
        data = dataTransmissionData.value
        break
    }
    
    // 过滤数据
    let filteredData = data.filter(item => {
      let match = true
      
      if (searchForm.username && !item.username.includes(searchForm.username)) {
        match = false
      }
      
      if (searchForm.satelliteName && item.satelliteName !== searchForm.satelliteName) {
        match = false
      }
      
      if (searchForm.timeRange && searchForm.timeRange.length === 2) {
        const itemTime = new Date(item.executeTime || item.collectTime || item.startTime)
        const startTime = new Date(searchForm.timeRange[0])
        const endTime = new Date(searchForm.timeRange[1])
        
        if (itemTime < startTime || itemTime > endTime) {
          match = false
        }
      }
      
      return match
    })
    
    // 更新数据和总数
    switch(type) {
      case 'remoteControl':
        remoteControlData.value = filteredData.length > 0 ? filteredData : data
        pagination.remoteControl.total = filteredData.length
        break
      case 'telemetry':
        telemetryData.value = filteredData.length > 0 ? filteredData : data
        pagination.telemetry.total = filteredData.length
        break
      case 'dataTransmission':
        dataTransmissionData.value = filteredData.length > 0 ? filteredData : data
        pagination.dataTransmission.total = filteredData.length
        break
    }
    
    pagination[type].currentPage = 1
    loading[type] = false
    ElMessage.success('查询完成')
  }, 500)
}

const handleReset = (type) => {
  searchForms[type] = {
    username: '',
    satelliteName: '',
    timeRange: []
  }
  generateMockData()
  pagination[type].currentPage = 1
  ElMessage.success('已重置')
}

const handleSizeChange = (type, size) => {
  pagination[type].pageSize = size
  pagination[type].currentPage = 1
}

const handleCurrentChange = (type, page) => {
  pagination[type].currentPage = page
}

const handleViewDetail = (row, type) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}

const refreshData = () => {
  generateMockData()
  ElMessage.success('数据已刷新')
}

const handleSendCommand = () => {
  commandForm.value = {
    type: '',
    params: '',
    priority: 'medium'
  }
  commandDialogVisible.value = true
}

const handleSubmitCommand = () => {
  if (!commandForm.value.type) {
    ElMessage.warning('请选择指令类型')
    return
  }
  
  try {
    const params = commandForm.value.params ? JSON.parse(commandForm.value.params) : {}
    const newCommand = {
      id: `RC${String(remoteControlData.value.length + 1).padStart(4, '0')}`,
      commandName: commandForm.value.type,
      satelliteName: 'RS-01',
      username: '当前用户',
      params,
      status: 'pending',
      executeTime: new Date().toLocaleString('zh-CN'),
      responseTime: 0
    }
    remoteControlData.value.unshift(newCommand)
    pagination.remoteControl.total = remoteControlData.value.length

    commandDialogVisible.value = false
    ElMessage.success('指令已发送')
  } catch (error) {
    ElMessage.error('参数格式错误，请输入有效的JSON格式')
  }
}

onMounted(() => {
  generateMockData()
})
</script>

<style scoped>
:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table__inner-wrapper) {
  background-color: transparent;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table th.el-table__cell) {
  background-color: rgba(30, 41, 59, 0.5);
  color: #e2e8f0;
  border-color: #334155;
}

:deep(.el-table td.el-table__cell) {
  border-color: #334155;
  color: #cbd5e1;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(30, 41, 59, 0.5);
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #3b82f6, #22d3ee);
}

:deep(.el-select .el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

:deep(.el-select .el-input__inner) {
  color: #e2e8f0;
}

:deep(.el-dialog) {
  background-color: #0f172a;
  border: 1px solid #334155;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #334155;
}

:deep(.el-dialog__title) {
  color: #e2e8f0;
}

:deep(.el-dialog__body) {
  color: #cbd5e1;
}

:deep(.el-form-item__label) {
  color: #94a3b8;
}

:deep(.el-input__wrapper) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
}

:deep(.el-input__inner) {
  color: #e2e8f0;
}

:deep(.el-textarea__inner) {
  background-color: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  color: #e2e8f0;
}

:deep(.el-textarea__inner:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.el-textarea__inner:focus) {
  border-color: #3b82f6;
}

:deep(.el-radio__label) {
  color: #cbd5e1;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-tabs--border-card) {
  background: transparent;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

:deep(.el-tabs--border-card > .el-tabs__header) {
  background: rgba(30, 41, 59, 0.5);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  color: #94a3b8;
  border-right: 1px solid rgba(59, 130, 246, 0.2);
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  background: rgba(59, 130, 246, 0.2);
  color: #22d3ee;
  border-bottom-color: transparent;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover) {
  color: #22d3ee;
}

:deep(.el-date-editor .el-range-input) {
  background: transparent;
  color: #e2e8f0;
}

:deep(.el-date-editor .el-range-separator) {
  color: #94a3b8;
}

:deep(.el-pagination) {
  color: #cbd5e1;
}

:deep(.el-pagination .el-pager li) {
  background: rgba(30, 41, 59, 0.5);
  color: #cbd5e1;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #3b82f6;
  color: #fff;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #22d3ee;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: rgba(30, 41, 59, 0.5);
  color: #cbd5e1;
}

:deep(.el-pagination .el-input__wrapper) {
  background: rgba(30, 41, 59, 0.5);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table-wrapper :deep(.el-table) {
  min-width: 100%;
}

.search-area {
  padding: 16px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

:deep(.el-descriptions) {
  background: transparent;
}

:deep(.el-descriptions__body) {
  background: rgba(30, 41, 59, 0.3);
}

:deep(.el-descriptions__label) {
  background: rgba(30, 41, 59, 0.5) !important;
  color: #94a3b8;
}

:deep(.el-descriptions__content) {
  color: #e2e8f0;
}

.text-sci-cyan {
  color: #22d3ee;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

pre {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>